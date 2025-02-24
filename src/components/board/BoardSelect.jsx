import { useParams } from "react-router-dom";
import { useDashboardFunc } from "../../context/useDashboardFunc"; // Import context
import "../../scss/boardselect.scss";
import { useEffect, useState } from "react";
import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore"; 
import { db } from "../../utilities/firebase";
import { useAuth } from "../../context/useAuth";

const BoardSelect = () => {
    const { itemId } = useParams(); // Get board ID from URL
    const { userBoards, setUserBoards } = useDashboardFunc(); // Get user boards from context
    const { accBST } = useAuth();

    const selectedBoard = userBoards.find((board) => board?.id === itemId);
    const images = [
        '/img/s1.jpg',
        '/img/s2.jpg',
        '/img/s3.jpg',
        '/img/s4.jpg',
        '/img/s5.jpg'
    ];
    
      // Choose a random image only once when the component mounts.
    const [selectedImage] = useState(() => {
        return images[Math.floor(Math.random() * images.length)];
    });
    


    // Inside your BoardSelect component:
    const [boardOwner, setBoardOwner] = useState(null);
    
    useEffect(() => {
        async function fetchBoardOwner() {
            if (selectedBoard && selectedBoard.email && selectedBoard.email !== accBST.email) {
            const q = query(
                collection(db, "account"),
                where("email", "==", selectedBoard.email)
            );
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const ownerData = querySnapshot.docs[0].data();
                setBoardOwner(ownerData);
            } else {
                console.error("Board owner not found in accounts.");
            }
            } else {
            setBoardOwner(null);
            }
        }
        fetchBoardOwner();
    }, [selectedBoard, accBST?.email]);
    
    const settings = boardOwner ? boardOwner : accBST;

    
    const [activeCategory, setActiveCategory] = useState({});
    const [newTask, setNewTask] = useState({});
    const [editedCategoryTitles, setEditedCategoryTitles] = useState({});
    const [expandedTaskItems, setExpandedTaskItems] = useState({});
    const [taskErrors, setTaskErrors] = useState({});
    
    const [taskDotsOpen, setTaskDotsOpen] = useState({});
    const [colorDropdownOpen, setColorDropdownOpen] = useState({});


    const [newCategory, setNewCategory] = useState("");
    const [newCategoryError, setNewCategoryError] = useState("");

    const toggleCategory = (category) => {
        setActiveCategory((prev) => ({ ...prev, [category]: !prev[category] }));
    };

    const displayedCategories = selectedBoard
        ? selectedBoard.taskList.slice(0, settings.taskLimits)
        : [];
      


    const handleCategoryTitleUpdate = async (categoryIndex, newTitle) => {
        if (!selectedBoard) return;

        const updatedTaskList = selectedBoard.taskList.map((task, idx) => {
            if (idx === categoryIndex) {
                return { ...task, title: newTitle };
            }
            return task;
        });

        try {
            const boardRef = doc(db, "boards", selectedBoard.id);
            await updateDoc(boardRef, { taskList: updatedTaskList });
            setUserBoards((prevBoards) =>
                prevBoards.map((board) =>
                    board.id === selectedBoard.id ? { ...board, taskList: updatedTaskList } : board
                )
            );
            setEditedCategoryTitles((prev) => {
                const newState = { ...prev };
                delete newState[categoryIndex];
                return newState;
            });
        } catch (error) {
            console.error("Error updating category title:", error);
        }
    };

    const handleCreateTask = async (categoryTitle) => {
        if (!newTask[categoryTitle]?.trim() || !selectedBoard) return;

        const updatedTaskList = selectedBoard.taskList.map((task) => {
            if (task.title === categoryTitle) {
                if (task.tasks.length >= accBST.cardLimits) {
                    setTaskErrors((prev) => ({
                        ...prev,
                        [categoryTitle]:
                            "You have reached the maximum number of tasks for this category."
                    }));
                    setTimeout(() => {
                        setTaskErrors((prev) => {
                            const newState = { ...prev };
                            delete newState[categoryTitle];
                            return newState;
                        });
                    }, 3000);
                    return task;
                }
                setTaskErrors((prev) => ({
                    ...prev,
                    [categoryTitle]: ""
                }));
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

    const handleCreateCategory = async () => {
        if (!newCategory.trim() || !selectedBoard) return;
        if (selectedBoard.taskList.length >= accBST.taskLimits) {
            setNewCategoryError("You have reached the maximum number of categories for this board.");
            setTimeout(() => {
                setNewCategoryError("");
            }, 3000);
            return;
        }
        const newCategoryObj = {
            title: newCategory,
            tasks: [],
            taggings: [],
            links: []
        };
        const updatedTaskList = [...selectedBoard.taskList, newCategoryObj];
        try {
            const boardRef = doc(db, "boards", selectedBoard.id);
            await updateDoc(boardRef, { taskList: updatedTaskList });
            setUserBoards((prevBoards) =>
                prevBoards.map((board) =>
                    board.id === selectedBoard.id ? { ...board, taskList: updatedTaskList } : board
                )
            );
            setNewCategory("");
        } catch (error) {
            console.error("Error creating new category:", error);
        }
    };

    const handleDeleteCategory = async (categoryIndex) => {
        if (!selectedBoard) return;
        const updatedTaskList = selectedBoard.taskList.filter(
            (_, idx) => idx !== categoryIndex
        );
        try {

            const boardRef = doc(db, "boards", selectedBoard.id);
            await updateDoc(boardRef, { taskList: updatedTaskList });
            setUserBoards((prevBoards) =>
                prevBoards.map((board) =>
                    board.id === selectedBoard.id
                        ? { ...board, taskList: updatedTaskList }
                        : board
                )
            );
            setTaskDotsOpen((prev) => ({
                ...prev,
                [categoryIndex]: !prev[categoryIndex]
            }))
        } catch (error) {
            console.error("Error deleting category:", error);
        }
    };
    
    const handleDeleteTask = async (categoryIndex, taskIndex) => {
        if (!selectedBoard) return;
        const updatedTaskList = selectedBoard.taskList.map((category, idx) => {
            if (idx === categoryIndex) {
                return {
                    ...category,
                    tasks: category.tasks.filter((_, index) => index !== taskIndex)
                };
            }
            return category;
        });
        try {
            const boardRef = doc(db, "boards", selectedBoard.id);
            await updateDoc(boardRef, { taskList: updatedTaskList });
            setUserBoards((prevBoards) =>
                prevBoards.map((board) =>
                    board.id === selectedBoard.id
                        ? { ...board, taskList: updatedTaskList }
                        : board
                )
            );
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    const handleSample = () => {

    }

    const handleNextTaskCategory = async (categoryIndex, taskIndex) => {
        if (!selectedBoard) return;
        if (categoryIndex >= selectedBoard.taskList.length - 1) return;
        const taskToMove = selectedBoard.taskList[categoryIndex].tasks[taskIndex];
        const updatedTaskList = selectedBoard.taskList.map((category, idx) => {
            if (idx === categoryIndex) {
                return {
                    ...category,
                    tasks: category.tasks.filter((_, index) => index !== taskIndex)
                };
            }
            if (idx === categoryIndex + 1) {
                return {
                    ...category,
                    tasks: [...category.tasks, taskToMove]
                };
            }
            return category;
        });
        try {
            const boardRef = doc(db, "boards", selectedBoard.id);
            await updateDoc(boardRef, { taskList: updatedTaskList });
            setUserBoards((prevBoards) =>
            prevBoards.map((board) =>
                board.id === selectedBoard.id
                ? { ...board, taskList: updatedTaskList }
                : board
            )
            );
        } catch (error) {
            console.error("Error moving task forward:", error);
        }
    };

    const handlePreviousTaskCategory = async (categoryIndex, taskIndex) => {
        if (!selectedBoard) return;
        // If already in the first category, do nothing.
        if (categoryIndex <= 0) return;
        const taskToMove = selectedBoard.taskList[categoryIndex].tasks[taskIndex];
        const updatedTaskList = selectedBoard.taskList.map((category, idx) => {
            if (idx === categoryIndex) {
            return {
                ...category,
                tasks: category.tasks.filter((_, index) => index !== taskIndex)
            };
            }
            if (idx === categoryIndex - 1) {
            return {
                ...category,
                tasks: [...category.tasks, taskToMove]
            };
            }
            return category;
        });
        try {
            const boardRef = doc(db, "boards", selectedBoard.id);
            await updateDoc(boardRef, { taskList: updatedTaskList });
            setUserBoards((prevBoards) =>
            prevBoards.map((board) =>
                board.id === selectedBoard.id
                ? { ...board, taskList: updatedTaskList }
                : board
            )
            );
        } catch (error) {
            console.error("Error moving task backward:", error);
        }
    };


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.td-1')) {
                setTaskDotsOpen({});
            }
        };
      
        document.addEventListener("mousedown", handleClickOutside);
      
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    
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
            <img src={selectedImage} alt="Thumbnail" className="thumbnail absolute -z-10"/>

            <div className="list-of-tasks flex items-start justify-start gap-2 flex-wrap">
                {selectedBoard &&
                    displayedCategories.map((task, displayedIndex) => {

                    const currentCategoryTitle =
                        editedCategoryTitles[displayedIndex] !== undefined
                            ? editedCategoryTitles[displayedIndex]
                            : task.title;

                            // const displayTaskItems = task.tasks.slice(0, accBST.cardLimits);
                            const displayTaskItems = task.tasks.slice(0, settings.cardLimits);


                    return (
                        <div className="task" key={displayedIndex}>
                            <div className="td-1 relative">
                                <input
                                    type="text"
                                    value={currentCategoryTitle}

                                    onChange={(e) =>
                                        setEditedCategoryTitles((prev) => ({
                                            ...prev,
                                            [displayedIndex]: e.target.value
                                        }))
                                    }
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            handleCategoryTitleUpdate(
                                                displayedIndex,
                                                currentCategoryTitle
                                            );
                                        }
                                    }}
                                />
                                
                                <svg
                                    onClick={() =>
                                        setTaskDotsOpen((prev) => ({
                                        ...prev,
                                        [displayedIndex]: !prev[displayedIndex]
                                        }))
                                    }
                                    width="17"
                                    height="5"
                                    viewBox="0 0 17 5"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M10.0625 2.5C10.0625 2.80903 9.97086 3.11113 9.79917 3.36808C9.62748 3.62503 9.38345 3.8253 9.09794 3.94356C8.81243 4.06182 8.49827 4.09277 8.19517 4.03248C7.89208 3.97219 7.61367 3.82337 7.39515 3.60485C7.17663 3.38633 7.02781 3.10792 6.96752 2.80483C6.90723 2.50173 6.93818 2.18757 7.05644 1.90206C7.1747 1.61655 7.37497 1.37252 7.63192 1.20083C7.88887 1.02914 8.19097 0.9375 8.5 0.9375C8.9144 0.9375 9.31183 1.10212 9.60485 1.39515C9.89788 1.68817 10.0625 2.0856 10.0625 2.5ZM1.85938 0.9375C1.55034 0.9375 1.24825 1.02914 0.991298 1.20083C0.734346 1.37252 0.534076 1.61655 0.415814 1.90206C0.297552 2.18757 0.266609 2.50173 0.326899 2.80483C0.387188 3.10792 0.536002 3.38633 0.754521 3.60485C0.973041 3.82337 1.25145 3.97219 1.55455 4.03248C1.85764 4.09277 2.17181 4.06182 2.45732 3.94356C2.74283 3.8253 2.98686 3.62503 3.15855 3.36808C3.33024 3.11113 3.42188 2.80903 3.42188 2.5C3.42188 2.0856 3.25726 1.68817 2.96423 1.39515C2.6712 1.10212 2.27378 0.9375 1.85938 0.9375ZM15.1406 0.9375C14.8316 0.9375 14.5295 1.02914 14.2725 1.20083C14.0156 1.37252 13.8153 1.61655 13.6971 1.90206C13.5788 2.18757 13.5479 2.50173 13.6081 2.80483C13.6684 3.10792 13.8173 3.38633 14.0358 3.60485C14.2543 3.82337 14.5327 3.97219 14.8358 4.03248C15.1389 4.09277 15.4531 4.06182 15.7386 3.94356C16.0241 3.8253 16.2681 3.62503 16.4398 3.36808C16.6115 3.11113 16.7031 2.80903 16.7031 2.5C16.7031 2.0856 16.5385 1.68817 16.2455 1.39515C15.9525 1.10212 15.555 0.9375 15.1406 0.9375Z" fill="#fff"/>
                                </svg>

                                {taskDotsOpen[displayedIndex] && (
                                <div className="dropdown-menu flex flex-col">
                                    <h1> Settings Card </h1>
                                    <div className="dropdown-item del-area flex items-center justify-between hovers"
                                        onClick={() => handleDeleteCategory(displayedIndex)}
                                    >
                                        <span>Delete</span>
                                    </div>
                                    <div className="dropdown-item color-area flex items-center justify-between"
                                        onClick={(e) => {
                                        e.stopPropagation(); 
                                        setColorDropdownOpen((prev) => ({
                                            ...prev,
                                            [displayedIndex]: !prev[displayedIndex]
                                        }));
                                    }}>
                                        <div className="ddi py-2 flex items-center justify-between w-full h-full hovers">
                                            <span>Change Color</span>
                                            <div className="circle bg-gray-500"></div>
                                        </div>

                                        {colorDropdownOpen[displayedIndex] && (

                                        <div className="sec_dropdown-menu flex flex-col gap-1.5">
                                            <h1> Custom Color </h1>
                                            <div className="secdropdown-item flex items-center justify-between hovers">
                                                <span className="circle bg-red-500"></span>
                                                <span> "Initial" </span>
                                            </div>
                                            <div className="secdropdown-item hovers">
                                                <span className="circle bg-blue-500"></span>
                                                <span className="circle bg-amber-500"></span>
                                                <span className="circle bg-teal-500"></span>
                                                <span className="circle bg-cyan-500"></span>
                                                <span> Custom </span>
                                            </div>
                                            <div className="secdropdown-item hovers">
                                                <span className="circle bg-green-500"></span>
                                                <span> "Finish" </span>

                                            </div>
                                        </div>
                                        
                                        )}
                                    </div>
                                    <div className="dropdown-item flex items-center justify-between">
                                        <span> Limits TasksList </span>
                                        <span> {settings.taskLimits} </span>
                                    </div>
                                    <div className="dropdown-item flex items-center justify-between">
                                        <span> Limits Card </span>
                                        <span> {settings.cardLimits} </span>
                                    </div>
                                    <div className="dropdown-item flex items-center justify-between">
                                        <span> Link Status </span>
                                        {settings.islinks ?  
                                            <div className="circle bg-green-500"></div>
                                            :
                                            <div className="circle bg-red-500"></div>
                                        }
                                    </div>
                                    <div className="dropdown-item flex items-center justify-between">
                                        <span> Tagging Status </span>
                                        {settings.istagging ?
                                            <div className="circle bg-green-500"></div>
                                            :
                                            <div className="circle bg-red-500"></div>
                                        }
                                    </div>
                                </div>
                                )}

                            </div>

                            <div className="card-sect grid grid-cols-1 gap-2">
                                {displayTaskItems.map((taskItem, i) => {
                                    const cardKey = `${currentCategoryTitle}-${i}`;
                                    const isExpanded = expandedTaskItems[cardKey] || false;
                                    return (
                                        <div className={`expand ${isExpanded ? "true" : "false"}`} key={i}>
                                            <div
                                                tabIndex="0"
                                                onFocus={() =>
                                                    setExpandedTaskItems((prev) => ({
                                                        ...prev,
                                                        [cardKey]: true
                                                    }))
                                                }
                                                onBlur={(e) => {
                                                    if (!e.currentTarget.contains(e.relatedTarget)) {
                                                        setExpandedTaskItems((prev) => ({
                                                            ...prev,
                                                            [cardKey]: false
                                                        }));
                                                    }
                                                }}                                                
                                            >
                                                <input type="text" placeholder={`${taskItem}`} />
                                                {isExpanded && (
                                                    <div className="flex items-center justify-start flex-wrap gap-1 py-2">
                                                        {settings?.islinks && (
                                                            <div className="links" onClick={() => handleSample()}>
                                                                <p>Links</p>
                                                            </div>
                                                        )}
                                                        {settings?.istagging && (
                                                            <div className="taggings">
                                                                <p>Taggings</p>
                                                            </div>
                                                        )}
                                                        {/* Delete button for the card */}
                                                        <button
                                                            onClick={() => handleDeleteTask(displayedIndex, i)}
                                                            className="delete-task-button"
                                                        >
                                                            Delete Card
                                                        </button>
                                                        <div className="next_prev flex items-center justify-center gap-1">
                                                            {displayedIndex >= 0 &&
                                                            
                                                                <div 
                                                                    className="svg-card flex items-center justify-center"
                                                                    onClick={() => handlePreviousTaskCategory(displayedIndex, i)}
                                                                >
                                                                    <svg width="22" height="15" viewBox="0 0 22 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M20.9609 7.5918C20.9609 6.38113 20.6426 5.2858 20.0059 4.3058C19.3686 3.3258 18.5299 2.60513 17.4899 2.1438C17.3593 2.07446 17.2559 1.9788 17.1799 1.8568C17.1033 1.73546 17.0893 1.60746 17.1379 1.4728C17.1866 1.33413 17.2816 1.2418 17.4229 1.1958C17.5643 1.1498 17.7003 1.1548 17.8309 1.2108C19.2589 1.85213 20.3043 2.77613 20.9669 3.9828C21.6296 5.19013 21.9609 6.39313 21.9609 7.5918C21.9609 8.78646 21.6326 9.98646 20.9759 11.1918C20.3193 12.3971 19.2786 13.3205 17.8539 13.9618C17.7233 14.0178 17.5866 14.0235 17.4439 13.9788C17.3013 13.9341 17.2033 13.8428 17.1499 13.7048C17.0973 13.5741 17.1083 13.4478 17.1829 13.3258C17.2569 13.2045 17.3593 13.1091 17.4899 13.0398C18.5299 12.5785 19.3686 11.8575 20.0059 10.8768C20.6419 9.8968 20.9609 8.8018 20.9609 7.5918ZM8.95994 0.591797C10.9079 0.591797 12.5616 1.2718 13.9209 2.6318C15.2803 3.9918 15.9606 5.64513 15.9619 7.5918C15.9633 9.53846 15.2833 11.1918 13.9219 12.5518C12.5606 13.9118 10.9073 14.5918 8.96194 14.5918C8.13127 14.5918 7.34394 14.4611 6.59994 14.1998C5.85594 13.9385 5.18094 13.5601 4.57494 13.0648C4.46094 12.9748 4.3976 12.8638 4.38494 12.7318C4.3716 12.5998 4.42027 12.4788 4.53094 12.3688C4.6376 12.2621 4.76094 12.2101 4.90094 12.2128C5.04094 12.2155 5.16994 12.2615 5.28794 12.3508C5.80127 12.7435 6.36327 13.0485 6.97394 13.2658C7.5846 13.4831 8.24727 13.5918 8.96194 13.5918C10.6286 13.5918 12.0453 13.0085 13.2119 11.8418C14.3786 10.6751 14.9619 9.25846 14.9619 7.5918C14.9619 5.92513 14.3786 4.50846 13.2119 3.3418C12.0453 2.17513 10.6286 1.5918 8.96194 1.5918C8.24794 1.5918 7.58527 1.70046 6.97394 1.9178C6.36327 2.13513 5.80127 2.4398 5.28794 2.8318C5.16994 2.9218 5.04094 2.96813 4.90094 2.9708C4.76094 2.97346 4.6376 2.92146 4.53094 2.8148C4.42094 2.7048 4.37227 2.58346 4.38494 2.4508C4.3976 2.31813 4.46094 2.20746 4.57494 2.1188C5.1816 1.62346 5.8566 1.24513 6.59994 0.983797C7.34327 0.722464 8.12927 0.591797 8.95994 0.591797ZM1.95394 7.0918H9.34594C9.48794 7.0918 9.60694 7.13946 9.70294 7.2348C9.79827 7.33013 9.84594 7.44913 9.84594 7.5918C9.84594 7.73446 9.79827 7.85346 9.70294 7.9488C9.6076 8.04413 9.4886 8.0918 9.34594 8.0918H1.95394L3.69994 9.8378C3.79327 9.93113 3.84327 10.0458 3.84994 10.1818C3.8566 10.3178 3.8066 10.4391 3.69994 10.5458C3.59327 10.6525 3.47527 10.7058 3.34594 10.7058C3.2166 10.7058 3.0986 10.6525 2.99194 10.5458L0.603937 8.1578C0.441936 7.9958 0.360937 7.80713 0.360937 7.5918C0.360937 7.37646 0.441936 7.1878 0.603937 7.0258L2.99194 4.6378C3.08527 4.54446 3.19994 4.49446 3.33594 4.4878C3.47194 4.48113 3.59327 4.53113 3.69994 4.6378C3.8066 4.74446 3.85994 4.86246 3.85994 4.9918C3.85994 5.12113 3.8066 5.23913 3.69994 5.3458L1.95394 7.0918Z" fill="#fff"/>
                                                                    </svg>
                                                                </div>
                                                            }

                                                            {displayedIndex < selectedBoard.taskList.length - 1 && (
                                                                <div 
                                                                    className="svg-card flex items-center justify-center"
                                                                    onClick={() => handleNextTaskCategory(displayedIndex, i)}
                                                                >
                                                                    <svg width="22" height="15" viewBox="0 0 22 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M1.03906 7.5918C1.03906 8.80246 1.3574 9.8978 1.99406 10.8778C2.6314 11.8578 3.47006 12.5785 4.51006 13.0398C4.64073 13.1091 4.74406 13.2048 4.82006 13.3268C4.89673 13.4481 4.91073 13.5761 4.86206 13.7108C4.8134 13.8495 4.7184 13.9418 4.57706 13.9878C4.43573 14.0338 4.29973 14.0288 4.16906 13.9728C2.74106 13.3315 1.69573 12.4075 1.03306 11.2008C0.370396 9.99346 0.0390625 8.79046 0.0390625 7.5918C0.0390625 6.39713 0.367396 5.19713 1.02406 3.9918C1.68073 2.78646 2.7214 1.86313 4.14606 1.2218C4.27673 1.1658 4.4134 1.16013 4.55606 1.2048C4.69873 1.24946 4.79673 1.3408 4.85006 1.4788C4.90273 1.60946 4.89173 1.7358 4.81706 1.8578C4.74306 1.97913 4.64073 2.07446 4.51006 2.1438C3.47006 2.60513 2.6314 3.32613 1.99406 4.3068C1.35806 5.2868 1.03906 6.3818 1.03906 7.5918ZM13.0401 14.5918C11.0921 14.5918 9.4384 13.9118 8.07906 12.5518C6.71973 11.1918 6.0394 9.53846 6.03806 7.5918C6.03673 5.64513 6.71673 3.9918 8.07806 2.6318C9.4394 1.2718 11.0927 0.591797 13.0381 0.591797C13.8687 0.591797 14.6561 0.722464 15.4001 0.983797C16.1441 1.24513 16.8191 1.62346 17.4251 2.1188C17.5391 2.2088 17.6024 2.3198 17.6151 2.4518C17.6284 2.5838 17.5797 2.7048 17.4691 2.8148C17.3624 2.92146 17.2391 2.97346 17.0991 2.9708C16.9591 2.96813 16.8301 2.92213 16.7121 2.8328C16.1987 2.44013 15.6367 2.13513 15.0261 1.9178C14.4154 1.70046 13.7527 1.5918 13.0381 1.5918C11.3714 1.5918 9.95473 2.17513 8.78806 3.3418C7.6214 4.50846 7.03806 5.92513 7.03806 7.5918C7.03806 9.25846 7.6214 10.6751 8.78806 11.8418C9.95473 13.0085 11.3714 13.5918 13.0381 13.5918C13.7521 13.5918 14.4147 13.4831 15.0261 13.2658C15.6367 13.0485 16.1987 12.7438 16.7121 12.3518C16.8301 12.2618 16.9591 12.2155 17.0991 12.2128C17.2391 12.2101 17.3624 12.2621 17.4691 12.3688C17.5791 12.4788 17.6277 12.6001 17.6151 12.7328C17.6024 12.8655 17.5391 12.9761 17.4251 13.0648C16.8184 13.5601 16.1434 13.9385 15.4001 14.1998C14.6567 14.4611 13.8707 14.5918 13.0401 14.5918ZM20.0461 8.0918H12.6541C12.5121 8.0918 12.3931 8.04413 12.2971 7.9488C12.2017 7.85346 12.1541 7.73446 12.1541 7.5918C12.1541 7.44913 12.2017 7.33013 12.2971 7.2348C12.3924 7.13946 12.5114 7.0918 12.6541 7.0918H20.0461L18.3001 5.3458C18.2067 5.25246 18.1567 5.1378 18.1501 5.0018C18.1434 4.8658 18.1934 4.74446 18.3001 4.6378C18.4067 4.53113 18.5247 4.4778 18.6541 4.4778C18.7834 4.4778 18.9014 4.53113 19.0081 4.6378L21.3961 7.0258C21.5581 7.1878 21.6391 7.37646 21.6391 7.5918C21.6391 7.80713 21.5581 7.9958 21.3961 8.1578L19.0081 10.5458C18.9147 10.6391 18.8001 10.6891 18.6641 10.6958C18.5281 10.7025 18.4067 10.6525 18.3001 10.5458C18.1934 10.4391 18.1401 10.3211 18.1401 10.1918C18.1401 10.0625 18.1934 9.94446 18.3001 9.8378L20.0461 8.0918Z" fill="#fff"/>
                                                                    </svg>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            {taskErrors[currentCategoryTitle] && (
                                <div className="error-message flex items-center justify-center" style={{ color: "red", fontSize: "13px"}}>
                                    {taskErrors[currentCategoryTitle]}
                                </div>
                            )}
                            
                            {!activeCategory[currentCategoryTitle] && (
                                <div
                                    className="card-btn"
                                    onClick={() => toggleCategory(currentCategoryTitle)}
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
                            {activeCategory[currentCategoryTitle] && (
                                <div className="rd-cd-btn">
                                    <input
                                        type="text"
                                        placeholder="Enter a title"
                                        value={newTask[currentCategoryTitle] || ""}
                                        onChange={(e) =>
                                            setNewTask((prev) => ({
                                                ...prev,
                                                [currentCategoryTitle]: e.target.value
                                            }))
                                        }
                                    />
                                    <div className="btn-create-cd">
                                        <div
                                            className="btn"
                                            onClick={() => handleCreateTask(currentCategoryTitle)}
                                        >
                                            Add Card
                                        </div>
                                        <h5
                                            className="cursor-pointer hover:bg-gray-400"
                                            onClick={() =>
                                                toggleCategory(currentCategoryTitle)
                                            }
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
                        <input
                            type="text"
                            placeholder="Create New Category"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleCreateCategory();
                                }
                            }}
                        />
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
                    {newCategoryError && (
                        <div
                            className="error-message flex items-center justify-center"
                            style={{ color: "red", fontSize: "13px", marginTop: "0.5rem" }}
                        >
                            {newCategoryError}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default BoardSelect;
