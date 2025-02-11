import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchUserBoards } from "../utilities/board"; // Fetching user boards
import { useDashboardFunc } from "./useDashboardFunc";
import { useAuth } from "./useAuth";

const SearchFuncContext = createContext();

export const useSearch = () => useContext(SearchFuncContext);

const SearchProvider = ({ children }) => {


    const { userBoards } = useDashboardFunc()
    const { currentUser } = useAuth()

    const [search, setSearch] = useState("");
    const [filteredBoards, setFilteredBoards] = useState([]);
    // const [userBoards, setUserBoards] = useState([]);




    useEffect(() => {
        // First, filter boards that belong to the current user
        const boardsForUser = userBoards.filter(
        board => board.email === currentUser?.email
        );

        const delayDebounce = setTimeout(() => {
        if (search.trim() === "") {
            setFilteredBoards(boardsForUser);
        } else {
            const filtered = boardsForUser.filter(board =>
            board.boardTitle.toLowerCase().includes(search.toLowerCase())
            );
            setFilteredBoards(filtered);
        }
        }, 300); // Adjust debounce time as needed

        return () => clearTimeout(delayDebounce);
    }, [search, userBoards, currentUser]);


    const value = {
        search,
        setSearch,
        filteredBoards,
        userBoards,
    };

    return (
        <SearchFuncContext.Provider value={value}>
            {children}
        </SearchFuncContext.Provider>
    );
};

export default SearchProvider;
