import React, { createContext, useContext, useState, useEffect } from 'react';
import { saveUserBoardData } from '../utilities/board';
import { fetchUserBoards } from '../utilities/board'; // Import fetchUserBoards function
import { updateAccountActivity } from '../utilities/account';

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
        boardVisibility: 'Private', // default
        boardTemplate: '',
        boardInviteEmail:[],
    });

    const [userBoards, setUserBoards] = useState([]); 
    useEffect(() => {
        const getBoards = async () => {
            const boards = await fetchUserBoards();
            setUserBoards(boards); 
        };

        getBoards();
    }, []);


    const handleCreateBoard = async (e, user, board) => {
        e.preventDefault();
      
        const missingFields = [];
        if (!board?.boardTitle?.trim()) {
            missingFields.push("Board Title");
        }
        if (!board?.boardVisibility?.trim()) {
            missingFields.push("Board Visibility");
        }
        if (!board?.boardTemplate?.trim()) {
            missingFields.push("Board Template");
        }
        // If the board is Workspace, check that at least 2 invite emails have been provided
        if (board?.boardVisibility === "Workspace") {
            if (!board?.boardInviteEmail || board?.boardInviteEmail.length < 2) {
                missingFields.push("At least 2 invite emails are required for a Workspace board");
            }
        }
        if (missingFields.length > 0) {
            setErrorMessage(`${missingFields.join(", ")} ${missingFields.length > 1 ? "are" : "is"} required.`);
            setTimeout(() => setErrorMessage(""), 3000);
            return;
        }
      
        try {
            await saveUserBoardData(user, board);
            const boards = await fetchUserBoards();
            setUserBoards(boards);
        
            await updateAccountActivity(user.uid, "User created a board");
        
            setSuccessMessage("Board created successfully!");
            setTimeout(() => setSuccessMessage(""), 3000);
        
            setBoardAttr({
                boardTitle: "",
                boardVisibility: "",
                boardTemplate: "",
                boardInviteEmail: [],
            });
        } catch (error) {
            setErrorMessage("Error creating board. Please try again.");
            setTimeout(() => setErrorMessage(""), 3000);
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
