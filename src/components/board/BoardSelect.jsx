import { useParams } from "react-router-dom";
import { useDashboardFunc } from "../../context/useDashboardFunc"; // Import context
import "../../scss/boardselect.scss";
import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore"; 
import { db } from "../../utilities/firebase";
import { useAuth } from "../../context/useAuth";

const BoardSelect = () => {
    const { itemId } = useParams(); // Get board ID from URL
    const { userBoards, setUserBoards } = useDashboardFunc(); // Get user boards from context
    const { accBST } = useAuth();

    const selectedBoard = userBoards.find((board) => board?.id === itemId);
    const [activeCategory, setActiveCategory] = useState({});
    const [newTask, setNewTask] = useState({});

    console.log(accBST)
    // State to track which task card is expanded
    // The key can be a combination of category title and index
    const [expandedTaskItems, setExpandedTaskItems] = useState({});

    const toggleCategory = (category) => {
        setActiveCategory((prev) => ({ ...prev, [category]: !prev[category] }));
    };

    const handleCreateTask = async (categoryTitle) => {
        if (!newTask[categoryTitle]?.trim() || !selectedBoard) return;

        const updatedTaskList = selectedBoard.taskList.map((task) => {
            if (task.title === categoryTitle) {
                return {
                    ...task,
                    tasks: [...task.tasks, newTask[categoryTitle]]
                };
            }
            return task;
        });

        try {
            const boardRef = doc(db, "boards", selectedBoard.id);
            await updateDoc(boardRef, { taskList: updatedTaskList });

            setUserBoards((prevBoards) =>
                prevBoards.map((board) =>
                    board.id === itemId ? { ...board, taskList: updatedTaskList } : board
                )
            );

            setNewTask((prev) => ({ ...prev, [categoryTitle]: "" }));
            setActiveCategory({}); // Reset active categories
        } catch (error) {
            console.error("Error adding task: ", error);
        }
    };


    return (
        <div className="board-select">
            <div className="headline flex items-center justify-between">
                <h1>{selectedBoard?.boardTitle}</h1>
                <button className="shared-button flex items-center justify-between gap-5">
                    <svg
                        width="27"
                        height="27"
                        viewBox="0 0 27 27"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M19.8759 12.9996C21.6992 12.9996 23.4479 13.7239 24.7372 15.0132C26.0265 16.3026 26.7509 18.0512 26.7509 19.8746C26.7509 21.698 26.0265 23.4467 24.7372 24.736C23.4479 26.0253 21.6992 26.7496 19.8759 26.7496C18.0525 26.7496 16.3038 26.0253 15.0145 24.736C13.7252 23.4467 13.0009 21.698 13.0009 19.8746C13.0009 18.0512 13.7252 16.3026 15.0145 15.0132C16.3038 13.7239 18.0525 12.9996 19.8759 12.9996ZM13.0296 15.4996C12.6553 16.0842 12.3575 16.7143 12.1434 17.3746H3.31711C3.06847 17.3746 2.83001 17.4734 2.6542 17.6492C2.47838 17.825 2.37961 18.0635 2.37961 18.3121V19.0334C2.37961 19.7021 2.61961 20.3496 3.05461 20.8584C4.62086 22.6946 7.07961 23.6259 10.5009 23.6259C11.2475 23.6259 11.9475 23.5817 12.6009 23.4934C12.9084 24.1121 13.2921 24.6859 13.7409 25.2021C12.7467 25.4021 11.6667 25.5021 10.5009 25.5021C6.56961 25.5021 3.58586 24.3696 1.62836 22.0771C0.903841 21.2285 0.505821 20.1492 0.505859 19.0334V18.3109C0.506191 17.5654 0.802481 16.8505 1.32962 16.3234C1.85676 15.7962 2.57162 15.4999 3.31711 15.4996H13.0296ZM19.8759 15.4996L19.7634 15.5096C19.6385 15.5324 19.5235 15.5927 19.4337 15.6825C19.344 15.7723 19.2837 15.8872 19.2609 16.0121L19.2509 16.1246V19.2496H16.1309L16.0184 19.2596C15.8935 19.2824 15.7785 19.3427 15.6887 19.4325C15.599 19.5223 15.5387 19.6372 15.5159 19.7621L15.5059 19.8746L15.5159 19.9871C15.5387 20.112 15.599 20.227 15.6887 20.3167C15.7785 20.4065 15.8935 20.4668 16.0184 20.4896L16.1309 20.4996H19.2509V23.6246L19.2609 23.7371C19.2837 23.862 19.344 23.977 19.4337 24.0667C19.5235 24.1565 19.6385 24.2168 19.7634 24.2396L19.8759 24.2496L19.9884 24.2396C20.1132 24.2168 20.2282 24.1565 20.318 24.0667C20.4077 23.977 20.468 23.862 20.4909 23.7371L20.5009 23.6246V20.4996H23.6309L23.7434 20.4896C23.8682 20.4668 23.9832 20.4065 24.073 20.3167C24.1627 20.227 24.223 20.112 24.2459 19.9871L24.2559 19.8746L24.2459 19.7621C24.223 19.6372 24.1627 19.5223 24.073 19.4325C23.9832 19.3427 23.8682 19.2824 23.7434 19.2596L23.6309 19.2496H20.5009V16.1246L20.4909 16.0121C20.468 15.8872 20.4077 15.7723 20.318 15.6825C20.2282 15.5927 20.1132 15.5324 19.9884 15.5096L19.8759 15.4996ZM10.5009 0.505859C11.3216 0.505859 12.1343 0.66752 12.8926 0.981612C13.6509 1.2957 14.3399 1.75608 14.9203 2.33644C15.5006 2.91681 15.961 3.6058 16.2751 4.36409C16.5892 5.12237 16.7509 5.9351 16.7509 6.75586C16.7509 7.57662 16.5892 8.38935 16.2751 9.14763C15.961 9.90592 15.5006 10.5949 14.9203 11.1753C14.3399 11.7556 13.6509 12.216 12.8926 12.5301C12.1343 12.8442 11.3216 13.0059 10.5009 13.0059C8.84326 13.0059 7.25354 12.3474 6.08144 11.1753C4.90934 10.0032 4.25086 8.41346 4.25086 6.75586C4.25086 5.09826 4.90934 3.50854 6.08144 2.33644C7.25354 1.16434 8.84326 0.505859 10.5009 0.505859ZM10.5009 2.38086C9.92633 2.38086 9.35742 2.49402 8.82662 2.71389C8.29582 2.93375 7.81352 3.25601 7.40727 3.66227C7.00101 4.06852 6.67875 4.55082 6.45889 5.08162C6.23902 5.61242 6.12586 6.18133 6.12586 6.75586C6.12586 7.33039 6.23902 7.8993 6.45889 8.4301C6.67875 8.9609 7.00101 9.44319 7.40727 9.84945C7.81352 10.2557 8.29582 10.578 8.82662 10.7978C9.35742 11.0177 9.92633 11.1309 10.5009 11.1309C11.6612 11.1309 12.774 10.6699 13.5945 9.84945C14.4149 9.02898 14.8759 7.91618 14.8759 6.75586C14.8759 5.59554 14.4149 4.48274 13.5945 3.66227C12.774 2.8418 11.6612 2.38086 10.5009 2.38086Z" fill="black"/>               
                    </svg>
                    Share
                </button>
            </div>

            <div className="list-of-tasks flex items-start justify-start gap-2 flex-wrap">
                {selectedBoard &&
                    selectedBoard.taskList.map((task, categoryIndex) => {
                    const categoryTitle = task.title;
                    const taskItems = task.tasks || [];

                    return (
                        <div className="task" key={categoryIndex}>
                            <div className="td-1">
                                <input type="text" defaultValue={categoryTitle} readOnly />
                                <svg
                                    width="17"
                                    height="5"
                                    viewBox="0 0 17 5"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M10.0625 2.5C10.0625 2.80903 9.97086 3.11113 9.79917 3.36808C9.62748 3.62503 9.38345 3.8253 9.09794 3.94356C8.81243 4.06182 8.49827 4.09277 8.19517 4.03248C7.89208 3.97219 7.61367 3.82337 7.39515 3.60485C7.17663 3.38633 7.02781 3.10792 6.96752 2.80483C6.90723 2.50173 6.93818 2.18757 7.05644 1.90206C7.1747 1.61655 7.37497 1.37252 7.63192 1.20083C7.88887 1.02914 8.19097 0.9375 8.5 0.9375C8.9144 0.9375 9.31183 1.10212 9.60485 1.39515C9.89788 1.68817 10.0625 2.0856 10.0625 2.5ZM1.85938 0.9375C1.55034 0.9375 1.24825 1.02914 0.991298 1.20083C0.734346 1.37252 0.534076 1.61655 0.415814 1.90206C0.297552 2.18757 0.266609 2.50173 0.326899 2.80483C0.387188 3.10792 0.536002 3.38633 0.754521 3.60485C0.973041 3.82337 1.25145 3.97219 1.55455 4.03248C1.85764 4.09277 2.17181 4.06182 2.45732 3.94356C2.74283 3.8253 2.98686 3.62503 3.15855 3.36808C3.33024 3.11113 3.42188 2.80903 3.42188 2.5C3.42188 2.0856 3.25726 1.68817 2.96423 1.39515C2.6712 1.10212 2.27378 0.9375 1.85938 0.9375ZM15.1406 0.9375C14.8316 0.9375 14.5295 1.02914 14.2725 1.20083C14.0156 1.37252 13.8153 1.61655 13.6971 1.90206C13.5788 2.18757 13.5479 2.50173 13.6081 2.80483C13.6684 3.10792 13.8173 3.38633 14.0358 3.60485C14.2543 3.82337 14.5327 3.97219 14.8358 4.03248C15.1389 4.09277 15.4531 4.06182 15.7386 3.94356C16.0241 3.8253 16.2681 3.62503 16.4398 3.36808C16.6115 3.11113 16.7031 2.80903 16.7031 2.5C16.7031 2.0856 16.5385 1.68817 16.2455 1.39515C15.9525 1.10212 15.555 0.9375 15.1406 0.9375Z" fill="#fff"/>
                                </svg>
                            </div>

                            <div className="card-sect grid grid-cols-1 gap-2">
                                {taskItems.map((taskItem, i) => {
                                    // Create a unique key for each task card
                                    const cardKey = `${categoryTitle}-${i}`;
                                    const isExpanded = expandedTaskItems[cardKey] || false;
                                    return (
                                        <div
                                            className={`expand ${isExpanded ? "true" : "false"}`}
                                            key={i}
                                        >
                                            {/* 
                                                Wrap the input and additional UI in a focusable div.
                                                onFocus will expand the card; onBlur will collapse it.
                                            */}
                                            <div
                                                tabIndex="0"
                                                onFocus={() =>
                                                    setExpandedTaskItems((prev) => ({
                                                        ...prev,
                                                        [cardKey]: true
                                                    }))
                                                }
                                                onBlur={() =>
                                                    setExpandedTaskItems((prev) => ({
                                                        ...prev,
                                                        [cardKey]: false
                                                    }))
                                                }
                                            >
                                                <input
                                                    type="text"
                                                    placeholder={`${taskItem}`}
                                                    // Optionally, you can still use onClick if desired
                                                />
                                                {isExpanded && (
                                                    <div className="flex items-center justify-start gap-1 py-2">
                                                        {accBST?.islinks && (
                                                            <div className="links">
                                                                <p>Links</p>
                                                            </div>
                                                        )}
                                                        {accBST?.istagging && (
                                                            <div className="taggings">
                                                                <p>Taggings</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            {!activeCategory[categoryTitle] && (
                                <div
                                    className="card-btn"
                                    onClick={() => toggleCategory(categoryTitle)}
                                >
                                    <svg
                                        width="12"
                                        height="12"
                                        viewBox="0 0 12 12"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M5.5 6.5H0V5.5H5.5V0H6.5V5.5H12V6.5H6.5V12H5.5V6.5Z" fill="white"/>
                                    </svg>
                                    <h4>Add Card</h4>
                                </div>
                            )}
                            {activeCategory[categoryTitle] && (
                                <div className="rd-cd-btn">
                                    <input
                                        type="text"
                                        placeholder="Enter a title"
                                        value={newTask[categoryTitle] || ""}
                                        onChange={(e) =>
                                            setNewTask((prev) => ({
                                                ...prev,
                                                [categoryTitle]: e.target.value
                                            }))
                                        }
                                    />
                                    <div className="btn-create-cd">
                                        <div
                                            className="btn"
                                            onClick={() => handleCreateTask(categoryTitle)}
                                        >
                                            Add Card
                                        </div>
                                        <h5
                                            className="cursor-pointer hover:bg-gray-400"
                                            onClick={() =>
                                                toggleCategory(categoryTitle)
                                            } // close input when clicking "X"
                                        >
                                            X
                                        </h5>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
                <div className="task taskAdder">
                    <div className="td-1">
                        <input type="text" name="" id="" placeholder="Create New Task"/>
                        <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M5.5 6.5H0V5.5H5.5V0H6.5V5.5H12V6.5H6.5V12H5.5V6.5Z" fill="#000"/>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BoardSelect;
