import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchUserBoards } from "../utilities/board";
import { useDashboardFunc } from "./useDashboardFunc";
import { useAuth } from "./useAuth";
import BST from "../utilities/BST"; // ✅ Import BST

const SearchFuncContext = createContext();
export const useSearch = () => useContext(SearchFuncContext);

const SearchProvider = ({ children }) => {
    const { userBoards } = useDashboardFunc();
    const { currentUser } = useAuth();

    const [search, setSearch] = useState("");
    const [filteredBoards, setFilteredBoards] = useState([]);
    const boardsForUser = userBoards.filter(board => board.email === currentUser?.email);

    // Initialize BST
    const bst = new BST();

    useEffect(() => {
        // Filter data for the current user
        
        // Insert all data into BST
        boardsForUser.forEach(board => bst.insert(board.boardTitle.toLowerCase(), board));

        const delayDebounce = setTimeout(() => {
            if (search.trim() === "") {
                return setFilteredBoards(boardsForUser);
            } else {
                const filtered = bst.search(search);
                console.log(filtered);
                return setFilteredBoards(filtered);
            }
        }, 300); // Debounce to optimize performance

        return () => clearTimeout(delayDebounce);
    }, [search, userBoards, currentUser]);

    const value = {
        search,
        setSearch,
        filteredBoards,
        userBoards,
    };

    return <SearchFuncContext.Provider value={value}>{children}</SearchFuncContext.Provider>;
};

export default SearchProvider;
