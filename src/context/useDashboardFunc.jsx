import React, { createContext, useContext, useState, useEffect } from 'react';
import { saveUserBoardData } from '../utilities/board';
import { fetchUserBoards } from '../utilities/board'; // Import fetchUserBoards function

const DashboardFuncContext = createContext();

export const useDashboardFunc = () => {
    return useContext(DashboardFuncContext);
};

const DashboardProvider = ({ children }) => {

    const [createBoard, setCreateBoard] = useState();
    const [IsCreateBoard, setIsCreateBoard] = useState(false);
    const [successMessage, setSuccessMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState(false);

    const [boardAttr, setBoardAttr] = useState({
        boardTitle: '',
        boardVisibility: '',
        boardTemplate: '',
    });

    const [userBoards, setUserBoards] = useState([]); // State to store user boards

    useEffect(() => {
        const getBoards = async () => {
            const boards = await fetchUserBoards();
            console.log(boards)
            setUserBoards(boards); // Set fetched boards to state
        };

        getBoards();
    }, []);

    const handleCreateBoard = async (e, user, board) => {
        e.preventDefault();

        if (!board.boardTitle.trim() || !board.boardTemplate.trim()) {
            setErrorMessage("Board Title and Board Template are required.");
            setTimeout(() => {
                setErrorMessage("");
            }, 3000);
            return; 
        }

        try {
            
            await saveUserBoardData(user, board);
            const boards = await fetchUserBoards();
            setUserBoards(boards);

            setSuccessMessage("Board created successfully!");
            setTimeout(() => {
                setSuccessMessage("");
            }, 3000);

            setBoardAttr({
                boardTitle: "",
                boardVisibility: "",
                boardTemplate: "",
            });
        } catch (error) {
            setErrorMessage("Error creating board. Please try again.");
            setTimeout(() => {
                setErrorMessage("");
            }, 3000);
        }
    };

      
    const value = {
        createBoard, setCreateBoard,
        IsCreateBoard, setIsCreateBoard,
        boardAttr, setBoardAttr,
        userBoards, setUserBoards, // Pass the boards to the context
        handleCreateBoard, successMessage, 
        errorMessage
    };

    return (
        <DashboardFuncContext.Provider value={value}>
            {children}
        </DashboardFuncContext.Provider>
    );
};

export default DashboardProvider;
