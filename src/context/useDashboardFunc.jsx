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

    const [boardAttr, setBoardAttr] = useState({
        boardTitle: '',
        boardVisibility: '',
        boardTemplate: '',
    });

    const [userBoards, setUserBoards] = useState([]); // State to store user boards

    useEffect(() => {
        const getBoards = async () => {
            const boards = await fetchUserBoards();
            setUserBoards(boards); // Set fetched boards to state
        };

        getBoards();
    }, []);

    const handleCreateBoard = async (e, user, board) => {
        e.preventDefault();

        try {
            await saveUserBoardData(user, board);
            // After saving, fetch the updated boards
            const boards = await fetchUserBoards();
            setUserBoards(boards); // Update the boards state
        } catch (error) {
            throw new Error(error);
        }
    };

    const value = {
        createBoard, setCreateBoard,
        IsCreateBoard, setIsCreateBoard,
        boardAttr, setBoardAttr,
        userBoards, setUserBoards, // Pass the boards to the context
        handleCreateBoard
    };

    return (
        <DashboardFuncContext.Provider value={value}>
            {children}
        </DashboardFuncContext.Provider>
    );
};

export default DashboardProvider;
