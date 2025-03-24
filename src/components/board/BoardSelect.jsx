import { useParams } from "react-router-dom";
import { useDashboardFunc } from "../../context/useDashboardFunc"; // Import context
import "../../scss/boardselect.scss";
import { useEffect, useState } from "react";
import { 
    collection, 
    doc, 
    getDocs, 
    query, 
    updateDoc, 
    where 
} from "firebase/firestore"; 
import { db } from "../../utilities/firebase";
import { useAuth } from "../../context/useAuth";
import { updateAccountActivity, updateAccountRequests } from "../../utilities/account";
import { customColors } from "../../utilities/colors";
import PremiumActivationModal from "./PremiumActivationModal";
import TaskSelectModal from "./TaskSelectModal";

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

    const [selectedImage] = useState(() => {
        return images[Math.floor(Math.random() * images.length)];
    });

    const [boardOwner, setBoardOwner] = useState(null);

    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Hello! Give us a request or feedback?' }
    ]);
    const [inputValue, setInputValue] = useState('');

    const togglePopup = () => {
        if (isChatOpen) {
            setMessages([{ sender: 'bot', text: 'Hello! Give us a request or feedback?' }]);
        }
        setIsChatOpen(!isChatOpen);
    };

    const handleSend = async () => {
        if (inputValue.trim() === '') return;

        const userMessage = { sender: 'user', text: inputValue };
        setMessages(prev => [...prev, userMessage]);

        if (accBST?.uid) {
            try {
                await updateAccountRequests(accBST.uid, inputValue);
            } catch (error) {
                console.error('Error updating account requests:', error);
            }
        }

        setInputValue('');

        setTimeout(() => {
            setMessages(prev => [
                ...prev,
                { sender: 'bot', text: 'Thank you for your feedback / request!' }
            ]);
        }, 1000);
    };
    
    useEffect(() => {
        async function fetchBoardOwner() {
            if (
                selectedBoard &&
                selectedBoard.email &&
                selectedBoard.email !== accBST?.email
            ) {
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

    // Use boardOwner settings if exists, otherwise the logged-in user's account.
    const settings = boardOwner ? boardOwner : accBST;

    // console.log(settings)

    const [activeCategory, setActiveCategory] = useState({});
    const [newTask, setNewTask] = useState({});
    const [editedCategoryTitles, setEditedCategoryTitles] = useState({});
    const [expandedTaskItems, setExpandedTaskItems] = useState({});
    const [taskErrors, setTaskErrors] = useState({});

    const [expandedTaskList, setExpandedTaskList] = useState({});

    const [taskDotsOpen, setTaskDotsOpen] = useState({});
    const [colorDropdownOpen, setColorDropdownOpen] = useState({});
    const [categoryColors, setCategoryColors] = useState({});
    const [allowBg, setAllowBg] = useState(false)


    const [newCategory, setNewCategory] = useState("");
    const [newCategoryError, setNewCategoryError] = useState("");
    const [isPremiumUser, setIsPremiumUser] = useState();


    const toggleCategory = (category) => {
        setActiveCategory((prev) => ({ ...prev, [category]: !prev[category] }));
    };

    const displayedCategories = selectedBoard
        ? selectedBoard.taskList.slice(0, settings?.taskLimits)
        : [];


    const chunkArray = (array, chunkSize) => {
        const result = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            result.push(array.slice(i, i + chunkSize));
        }
        return result;
    };

    function getPriorityFromColor(color) {
        const index = customColors.findIndex(item => item.bg === color);
        if (index === -1) return null;
        return {
            level: Math.floor(index / 10) + 1, // Priority level 1-5
            shade: index % 10, // 0 (lightest) to 9 (darkest)
        };
    }


    function getSortKey(task) {
        if (task.color === "red") return -1000;       // Always at the very top.
        if (task.color === "green") return 1000;        // Always at the very bottom.
        if (!task.color || task.color.trim() === "") return 0;
        
        const prio = getPriorityFromColor(task.color);

        return prio ? prio.level * 10 + prio.shade : 0;
    }

    const colorGroups = chunkArray(customColors, 10);
    
        
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
                    board.id === selectedBoard.id
                        ? { ...board, taskList: updatedTaskList }
                        : board
                )
            );
            setEditedCategoryTitles((prev) => {
                const newState = { ...prev };
                delete newState[categoryIndex];
                return newState;
            });

            // Update account activity log.
            await updateAccountActivity(
                settings?.uid,
                "User updated a category title"
            );
        } catch (error) {
            console.error("Error updating category title:", error);
        }
    };

    const handleCreateTask = async (categoryTitle) => {
        if (!newTask[categoryTitle]?.trim() || !selectedBoard) return;

        const updatedTaskList = selectedBoard.taskList.map((task) => {
            if (task.title === categoryTitle) {
                if (task.tasks.length >= settings?.cardLimits) {
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
                    board.id === itemId
                        ? { ...board, taskList: updatedTaskList }
                        : board
                )
            );
            setNewTask((prev) => ({ ...prev, [categoryTitle]: "" }));
            setActiveCategory({}); // Reset active categories
            // Update account activity log.
            await updateAccountActivity(
                settings?.uid,
                `User created a task in category ${categoryTitle}`
            );
        } catch (error) {
            console.error("Error adding task: ", error);
        }
    };

    const handleCreateCategory = async () => {
        if (!newCategory.trim() || !selectedBoard) return;

        if (selectedBoard.taskList.length >= settings.taskLimits) {
            setNewCategoryError("You have reached the maximum number of categories for this board.");
            setTimeout(() => {
            setNewCategoryError("");
            }, 3000);
            return;
        }

        // New category has default color "".
        const newCategoryObj = {
            title: newCategory,
            tasks: [],
            taggings: [],
            links: [],
            color: ""  // default remains empty
        };

        const currentTaskList = selectedBoard.taskList;
        let updatedTaskList = [];

        // If the last task is "green" or titled "done", insert the new category before it.
        const lastTask = currentTaskList[currentTaskList.length - 1];
        if (lastTask && (lastTask.color === "green" || lastTask.title.toLowerCase() === "done")) {
            updatedTaskList = [
            ...currentTaskList.slice(0, currentTaskList.length - 1),
            newCategoryObj,
            lastTask
            ];
        } else {
            updatedTaskList = [...currentTaskList, newCategoryObj];
        }
        // Sort tasks with custom logic:
        //   red tasks get lowest sort key (-1000),
        //   default tasks (empty color) get 0,
        //   tasks with custom colors get keys based on their priority level (minimum 10),
        //   green tasks get a high key (1000).
        updatedTaskList.sort((a, b) => getSortKey(a) - getSortKey(b));

        try {
            const boardRef = doc(db, "boards", selectedBoard.id);
            await updateDoc(boardRef, { taskList: updatedTaskList });
            setUserBoards((prevBoards) =>
            prevBoards.map((board) =>
                board.id === selectedBoard.id ? { ...board, taskList: updatedTaskList } : board
            )
            );
            setNewCategory("");
            // Update account activity log.
            await updateAccountActivity(settings?.uid, "User created a new category");
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
            }));
            // Update account activity log.
            await updateAccountActivity(
                settings?.uid,
                "User deleted a category"
            );
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
                    tasks: category.tasks.filter(
                        (_, index) => index !== taskIndex
                    )
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
            // Update account activity log.
            await updateAccountActivity(
                settings?.uid,
                "User deleted a task"
            );
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };


    const handleChangeCategoryColor = async (categoryIndex, color, categoryTitle) => {
        // First, update the specific task's color.
        let updatedTaskList = selectedBoard.taskList.map((task, idx) => {
            if (idx === categoryIndex) {
            return { ...task, color: color };
            }
            return task;
        });

        // Separate tasks by fixed colors.
        const redTasks = updatedTaskList.filter(task => task.color === "red");
        const greenTasks = updatedTaskList.filter(task => task.color === "green");
        const otherTasks = updatedTaskList.filter(task => task.color !== "red" && task.color !== "green");

        // Sort the "other" tasks using our sort key.
        otherTasks.sort((a, b) => getSortKey(a) - getSortKey(b));

        // Combine: red tasks at the top, then the sorted tasks, then green tasks.
        updatedTaskList = [...redTasks, ...otherTasks, ...greenTasks];

        try {
            const boardRef = doc(db, "boards", selectedBoard.id);
            await updateDoc(boardRef, { taskList: updatedTaskList });
            setUserBoards(prevBoards =>
            prevBoards.map(board =>
                board.id === selectedBoard.id ? { ...board, taskList: updatedTaskList } : board
            )
            );
            await updateAccountActivity(
            settings?.uid,
            `Apply Color ${color} in Task Category ${categoryTitle}`
            );
        } catch (error) {
            console.error("Error updating category color:", error);
        }
        setColorDropdownOpen(prev => ({
            ...prev,
            [categoryIndex]: false,
        }));
    };

    const handleNextTaskCategory = async (categoryIndex, taskIndex) => {
        if (!selectedBoard) return;
        if (categoryIndex >= selectedBoard.taskList.length - 1) return;
        const taskToMove = selectedBoard.taskList[categoryIndex].tasks[taskIndex];
        const updatedTaskList = selectedBoard.taskList.map((category, idx) => {
            if (idx === categoryIndex) {
                return {
                    ...category,
                    tasks: category.tasks.filter(
                        (_, index) => index !== taskIndex
                    )
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
            // Update account activity log.
            await updateAccountActivity(
                settings?.uid,
                "User moved a task forward"
            );
        } catch (error) {
            console.error("Error moving task forward:", error);
        }
    };

    const handlePreviousTaskCategory = async (categoryIndex, taskIndex) => {
        if (!selectedBoard) return;
        if (categoryIndex <= 0) return;
        const taskToMove = selectedBoard.taskList[categoryIndex].tasks[taskIndex];
        const updatedTaskList = selectedBoard.taskList.map((category, idx) => {
            if (idx === categoryIndex) {
                return {
                    ...category,
                    tasks: category.tasks.filter(
                        (_, index) => index !== taskIndex
                    )
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
            // Update account activity log.
            await updateAccountActivity(
                settings?.uid,
                "User moved a task backward"
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

            {isPremiumUser ? 
                <PremiumActivationModal
                    userUid={settings?.uid}
                    onClose={() => setIsPremiumUser(false)}
                    onUpgrade={(tier) => {
                    }}
                />
                :
                <></>
            }

            {expandedTaskList.open && 
                <TaskSelectModal
                    taskCategory={expandedTaskList} 
                    onClose={() => setExpandedTaskList({})} 
                    selectedImage={selectedImage}
                />
            }

            <div className="req-chat">
                <div className={`chat-logo ${isChatOpen ? 'open' : ''}`} onClick={togglePopup}>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M9 1.5C7.01088 1.5 5.10322 2.29018 3.6967 3.6967C2.29018 5.10322 1.5 7.01088 1.5 9C1.5 10.9891 2.29018 12.8968 3.6967 14.3033C5.10322 15.7098 7.01088 16.5 9 16.5H14.09C14.5197 16.5 14.8191 16.4998 15.0541 16.4852C15.2846 16.4709 15.4201 16.4442 15.5243 16.4055C15.7257 16.3304 15.9087 16.2128 16.0608 16.0608C16.2128 15.9087 16.3304 15.7257 16.4055 15.5243C16.4442 15.42 16.4709 15.2847 16.4852 15.0544C16.4998 14.8196 16.5 14.5202 16.5 14.09V9C16.5 7.01088 15.7098 5.10322 14.3033 3.6967C12.8968 2.29018 10.9891 1.5 9 1.5ZM2.98959 2.98959C4.58365 1.39553 6.74566 0.5 9 0.5C11.2543 0.5 13.4163 1.39553 15.0104 2.98959C16.6045 4.58365 17.5 6.74566 17.5 9V14.1061C17.5 14.5164 17.5 14.8469 17.4833 15.1163C17.4661 15.3934 17.4299 15.6385 17.3427 15.8732C17.2174 16.209 17.0213 16.5144 16.7679 16.7679C16.5144 17.0213 16.2095 17.2172 15.8737 17.3425C15.639 17.4297 15.393 17.4661 15.1159 17.4833C14.8464 17.5 14.5159 17.5 14.1061 17.5H9C6.74566 17.5 4.58365 16.6045 2.98959 15.0104C1.39553 13.4163 0.5 11.2543 0.5 9C0.5 6.74566 1.39553 4.58365 2.98959 2.98959Z" fill="black"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M5.5 8C5.5 7.72386 5.72386 7.5 6 7.5H12C12.2761 7.5 12.5 7.72386 12.5 8C12.5 8.27614 12.2761 8.5 12 8.5H6C5.72386 8.5 5.5 8.27614 5.5 8ZM8.5 12C8.5 11.7239 8.72386 11.5 9 11.5H12C12.2761 11.5 12.5 11.7239 12.5 12C12.5 12.2761 12.2761 12.5 12 12.5H9C8.72386 12.5 8.5 12.2761 8.5 12Z" fill="black"/>
                    </svg>
                </div>
                <div className={`chat-popup ${isChatOpen ? 'open' : ''}`}>
                    <div className="chat-header">
                        <h4>Chat</h4>
                        <button onClick={togglePopup}>X</button>
                    </div>
                    <div className="chat-body">
                        {messages.map((msg, index) => (
                            <p key={index} className={`message ${msg.sender}`}>
                            {msg.text}
                            </p>
                        ))}
                    </div>
                    <div className="chat-footer">
                        <input
                            type="text"
                            placeholder="Type your message..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSend();
                            }}
                        />
                        <button onClick={handleSend}>Send</button>
                    </div>
                </div>
            </div>

            <div className="headline flex items-center justify-between">
                <h1>{selectedBoard?.boardTitle}</h1>
                <div className="cls-bgsb flex items-center justify-between gap-2">
                    <div className="bgComp cursor-pointer" onClick={e => setAllowBg(!allowBg)}>
                        <h1> 
                            {allowBg ?
                                "Remove Background" 
                                : 
                                "Allow Background"
                            }
                        </h1>
                    </div>
                    {/* <button className="shared-button flex items-center justify-between gap-5">
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
                    </button> */}
                </div>
            </div>

            {allowBg && 
                <img src={selectedImage} alt="Thumbnail" className="thumbnail absolute -z-10"/>
            }

            <div className="list-of-tasks flex items-start justify-start gap-2 flex-wrap">
                {selectedBoard &&
                    displayedCategories.map((task, displayedIndex) => {

                    const currentCategoryTitle =
                        editedCategoryTitles[displayedIndex] !== undefined
                            ? editedCategoryTitles[displayedIndex]
                            : task.title;

                            // const displayTaskItems = task.tasks.slice(0, accBST.cardLimits);
                            const displayTaskItems = task.tasks.slice(0, settings?.cardLimits);
                            const selectedColor = task?.color;

                            const bgColor = 
                            !selectedColor
                              ? "#414141df"
                              : selectedColor === "red"
                                ? "#f87171cd"
                                : selectedColor === "green"
                                  ? "#4ade80c3"
                                  : selectedColor;
                          
                    return (
                        <div className="task" key={displayedIndex} 
                            // style={{ background:`linear-gradient(to left, #ffffff4a,${bgColor})` }}
                            style={{ background:`${bgColor}` }}
                            >
                            <div className="td-1 relative">
                                <div className="open-up flex items-center justify-center gap-1.5">
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
                                                handleCategoryTitleUpdate(displayedIndex, currentCategoryTitle);
                                                e.target.blur(); // This removes focus from the input
                                            }
                                        }}
                                    />
                                    <div className={`svg_op_settings p-2 bg-white`}>
                                        <svg
                                            onClick={() => 
                                              setExpandedTaskList({ ...task, displayTask:displayTaskItems , id: displayedIndex, open:true })
                                            }
                                            width="16" 
                                            height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8 11.88L5.76 9.64C5.662 9.54267 5.547 9.491 5.415 9.485C5.283 9.479 5.162 9.531 5.052 9.641C4.942 9.751 4.887 9.86967 4.887 9.997C4.887 10.1243 4.942 10.2433 5.052 10.354L7.435 12.742C7.59633 12.904 7.78467 12.985 8 12.985C8.21533 12.985 8.404 12.904 8.566 12.742L10.954 10.354C11.0513 10.2567 11.103 10.141 11.109 10.007C11.115 9.873 11.0633 9.751 10.954 9.641C10.8447 9.531 10.7257 9.47567 10.597 9.475C10.4683 9.47433 10.3493 9.52967 10.24 9.641L8 11.88ZM8 4.12L10.24 6.36C10.338 6.45733 10.453 6.50933 10.585 6.516C10.717 6.522 10.838 6.47 10.948 6.36C11.0587 6.24933 11.114 6.13033 11.114 6.003C11.114 5.87567 11.0587 5.75667 10.948 5.646L8.566 3.258C8.404 3.096 8.21533 3.015 8 3.015C7.78467 3.015 7.59633 3.096 7.435 3.258L5.046 5.646C4.94867 5.74333 4.89767 5.858 4.893 5.99C4.88833 6.12267 4.94133 6.244 5.052 6.354C5.162 6.464 5.281 6.519 5.409 6.519C5.537 6.519 5.65567 6.464 5.765 6.354L8 4.12ZM1.616 16C1.15533 16 0.771 15.846 0.463 15.538C0.155 15.23 0.000666667 14.8453 0 14.384V1.616C0 1.15533 0.154333 0.771 0.463 0.463C0.771666 0.155 1.156 0.000666667 1.616 0H14.385C14.845 0 15.2293 0.154333 15.538 0.463C15.8467 0.771666 16.0007 1.156 16 1.616V14.385C16 14.845 15.846 15.2293 15.538 15.538C15.23 15.8467 14.8453 16.0007 14.384 16H1.616ZM1.616 15H14.385C14.5383 15 14.6793 14.936 14.808 14.808C14.9367 14.68 15.0007 14.5387 15 14.384V1.616C15 1.462 14.936 1.32067 14.808 1.192C14.68 1.06333 14.5387 0.999333 14.384 1H1.616C1.462 1 1.32067 1.064 1.192 1.192C1.06333 1.32 0.999333 1.46133 1 1.616V14.385C1 14.5383 1.064 14.6793 1.192 14.808C1.32 14.9367 1.461 15.0007 1.615 15" fill={selectedColor == "" ? `#2f2f2fc3` : bgColor}/>
                                        </svg>
                                    </div>
                                </div>

                                <div className={`svg_op_settings p-2 bg-white`}>
                                    <svg 
                                        onClick={() =>
                                            setTaskDotsOpen((prev) => ({
                                            ...prev,
                                            [displayedIndex]: !prev[displayedIndex]
                                            }))
                                        }
                                        width="18" 
                                        height="4" 
                                        viewBox="0 0 18 4" 
                                        fill="none" xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M2.75 3.875C2.25272 3.875 1.77581 3.67746 1.42417 3.32583C1.07254 2.97419 0.875 2.49728 0.875 2C0.875 1.50272 1.07254 1.02581 1.42417 0.674175C1.77581 0.322544 2.25272 0.125 2.75 0.125C3.24728 0.125 3.72419 0.322544 4.07583 0.674175C4.42746 1.02581 4.625 1.50272 4.625 2C4.625 2.49728 4.42746 2.97419 4.07583 3.32583C3.72419 3.67746 3.24728 3.875 2.75 3.875ZM9 3.875C8.50272 3.875 8.02581 3.67746 7.67417 3.32583C7.32254 2.97419 7.125 2.49728 7.125 2C7.125 1.50272 7.32254 1.02581 7.67417 0.674175C8.02581 0.322544 8.50272 0.125 9 0.125C9.49728 0.125 9.97419 0.322544 10.3258 0.674175C10.6775 1.02581 10.875 1.50272 10.875 2C10.875 2.49728 10.6775 2.97419 10.3258 3.32583C9.97419 3.67746 9.49728 3.875 9 3.875ZM15.25 3.875C14.7527 3.875 14.2758 3.67746 13.9242 3.32583C13.5725 2.97419 13.375 2.49728 13.375 2C13.375 1.50272 13.5725 1.02581 13.9242 0.674175C14.2758 0.322544 14.7527 0.125 15.25 0.125C15.7473 0.125 16.2242 0.322544 16.5758 0.674175C16.9275 1.02581 17.125 1.50272 17.125 2C17.125 2.49728 16.9275 2.97419 16.5758 3.32583C16.2242 3.67746 15.7473 3.875 15.25 3.875Z" fill={selectedColor == "" ? `#2f2f2fc3` : bgColor}/>
                                    </svg>


                                </div>                                

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
                                        
                                        if (selectedBoard.email !== accBST.email) {
                                            alert("You are not allowed to change colors on someone else's board.");
                                            return;
                                        }
                                        if (!settings?.isPremiumUser) {
                                            setIsPremiumUser(!settings.isPremiumUser);
                                            return;
                                        }
                                        setColorDropdownOpen((prev) => ({
                                            ...prev,
                                            [displayedIndex]: !prev[displayedIndex]
                                        }));
                                    }}>
                                        <div className="ddi py-2 flex items-center justify-between w-full h-full hovers">
                                            <span>Change Color</span>
                                            <div 
                                                className={`circle ${ selectedColor != "" ? "" : "bg-gray-500"}`}
                                                style={ selectedColor != ""  ? { background: bgColor } : {background: ""} }
                                            ></div>
                                        </div>

                                        {colorDropdownOpen[displayedIndex] && (

                                        <div className="sec_dropdown-menu flex flex-col gap-1.5">
                                            <h1> Custom Color </h1>
                                            <div 
                                                className="secdropdown-item flex items-center justify-between hovers"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleChangeCategoryColor(displayedIndex, "red", currentCategoryTitle);
                                                }}
                                            >
                                                <span className="circle bg-red-500"></span>
                                                <span> "Initial" </span>
                                            </div>
                                            <div className="ccsd">
                                                {colorGroups.map((group, groupIndex) => (
                                                    <div key={groupIndex} className="color-group">
                                                        <div className="custom-colors-grid grid grid-cols-10 gap-1">
                                                            {group.map((colorItem) => (
                                                            <div
                                                                key={colorItem.value}
                                                                className="secdropdown-item hovers flex items-center justify-center"
                                                                onClick={(e) => {
                                                                e.stopPropagation();
                                                                    handleChangeCategoryColor(displayedIndex, colorItem.bg, currentCategoryTitle);
                                                                }}
                                                            >
                                                                <span className="circle" style={{ backgroundColor: colorItem.bg }}></span>
                                                            </div>
                                                            ))}
                                                        </div>
                                                        <div className="priority-level text-center mt-1">
                                                            <span>Priority Level {groupIndex + 1}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div 
                                                className="secdropdown-item hovers"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleChangeCategoryColor(displayedIndex, "green", currentCategoryTitle);
                                                }}
                                            >
                                                <span className="circle bg-green-500"></span>
                                                <span> "Finish" </span>

                                            </div>
                                        </div>
                                        
                                        )}
                                    </div>
                                    <div className="dropdown-item flex items-center justify-between">
                                        <span> Limits TasksList </span>
                                        <span> {settings?.taskLimits} </span>
                                    </div>
                                    <div className="dropdown-item flex items-center justify-between">
                                        <span> Limits Card </span>
                                        <span> {settings?.cardLimits} </span>
                                    </div>
                                    <div className="dropdown-item flex items-center justify-between">
                                        <span> Link Status </span>
                                        {settings?.islinks ?  
                                            <span className="circle bg-green-500"></span>
                                            :
                                            <span className="circle bg-red-500"></span>
                                        }
                                    </div>
                                    <div className="dropdown-item flex items-center justify-between">
                                        <span> Tagging Status </span>
                                        {settings?.istagging ?
                                            <span className="circle bg-green-500"></span>
                                            :
                                            <span className="circle bg-red-500"></span>
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
                            onClick={handleCreateCategory}
                        >
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
