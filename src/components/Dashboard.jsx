import React, { useEffect, useRef, useState } from 'react';
import '../scss/dashboard.scss';
import { Link, Outlet, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { useDashboardFunc } from '../context/useDashboardFunc'
import { useAuth } from '../context/useAuth';
import Board from './board/Board';
import BoardSelect from './board/BoardSelect';
import { fetchUserAcc } from '../utilities/account';


const Dashboard = ({  }) => {

    const location = useLocation();
  
    // Only show Board if the pathname is exactly "/dashboard"
    const isDashboardRoot = location.pathname === '/dashboard';
  
    const { currentUser  } = useAuth()

    const { 
        IsCreateBoard, setIsCreateBoard,
        boardAttr,setBoardAttr,
        handleCreateBoard,
        userBoards, successMessage, errorMessage, setErrorMessage, setUserBoards, deleteBoard
    } = useDashboardFunc()

    const [tempboard,setTempBoard] = useState(null)
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteSearchResults, setInviteSearchResults] = useState([]);

    const [workspaceDropdownOpen, setWorkspaceDropdownOpen] = useState(false);
    const [boardsDropdownOpen, setBoardsDropdownOpen] = useState(false);
    const [othDropdownOpen, setOthDropdownOpen] = useState(false);
    const [othPublicDropdownOpen, setOthPublicDropdownOpen] = useState(false);
    const [othWorkspaceDropdownOpen, setOthWorkspaceDropdownOpen] = useState(false);
    

    // const workspaceDropdownRef = useRef(null);
    const boardsDropdownRef = useRef(null);
    const OthDropdownRef = useRef(null);
    const othPublicRef = useRef(null);
    const othWorkspaceRef = useRef(null);
    const [isOpenDeletes, setIsOpenDeletes] = useState({});


    const toggleWorkspaceDropdown = () => {
        setWorkspaceDropdownOpen(prev => !prev);
    };

    const toggleBoardsDropdown = () => {
        setBoardsDropdownOpen(prev => !prev);
    };

    const toggleOthDropdown = () => {
        setOthDropdownOpen(prev => !prev);
    }

    const toggleOthPublic = () => {
        setOthPublicDropdownOpen(prev => !prev);
    }
    const toggleOthWorkspace = () => {
        setOthWorkspaceDropdownOpen(prev => !prev);
    }


    // Function to search for matching accounts as you type
    const handleInviteSearch = async (e) => {
        const query = e.target.value;
        setInviteEmail(query);
        if (query.trim() === "") {
            setInviteSearchResults([]);
            return;
        }
        try {
            const accounts = await fetchUserAcc();
            const results = accounts.filter(acc =>
                acc.email.toLowerCase().includes(query.toLowerCase()) &&
                acc.email.toLowerCase() !== currentUser.email.toLowerCase() &&
                !(boardAttr.boardInviteEmail && boardAttr.boardInviteEmail.includes(acc.email))
            );
            setInviteSearchResults(results);
        } catch (error) {
            console.error(error);
        }
    };

    // Function to add the invite email if typed manually (if user clicks "Add Invite")
    const handleAddInvite = () => {
        if (!inviteEmail) return;
        if (inviteEmail.toLowerCase() === currentUser.email.toLowerCase()) {
            setErrorMessage("You cannot invite yourself.");
            return;
        }
        if (boardAttr.boardInviteEmail && boardAttr.boardInviteEmail.includes(inviteEmail)) {
            setErrorMessage("This email is already invited.");
            return;
        }
        setBoardAttr((prevState) => ({
            ...prevState,
            boardInviteEmail: prevState.boardInviteEmail
            ? [...prevState.boardInviteEmail, inviteEmail]
            : [inviteEmail],
        }));
        setInviteEmail("");
        setInviteSearchResults([]);
        setErrorMessage("");
    };

    // Function to handle selection from dropdown suggestions
    const handleSelectInviteEmail = (selectedEmail) => {
        setBoardAttr((prevState) => ({
            ...prevState,
            boardInviteEmail: prevState.boardInviteEmail
            ? [...prevState.boardInviteEmail, selectedEmail]
            : [selectedEmail],
        }));
        setInviteEmail("");
        setInviteSearchResults([]);
    };

    // Remove an invite email
    const removeInvite = (email) => {
        setBoardAttr((prevState) => ({
            ...prevState,
            boardInviteEmail: prevState.boardInviteEmail.filter((e) => e !== email),
        }));
    };


    useEffect(() => {
        // if (workspaceDropdownOpen) {
        //     gsap.to(workspaceDropdownRef.current, { height: "auto", opacity: 1, duration: 0.3, ease: "power2.out" });
        // } else {
        //     gsap.to(workspaceDropdownRef.current, { height: 0, opacity: 0, duration: 0.3, ease: "power2.inOut" });
        // }

        if (boardsDropdownOpen) {
            gsap.to(boardsDropdownRef.current, { height: "auto", opacity: 1, duration: 0.3, ease: "power2.out" });
        } else {
            gsap.to(boardsDropdownRef.current, { height: 0, opacity: 0, duration: 0.3, ease: "power2.inOut" });
        }

        if (othDropdownOpen) {
            gsap.to(OthDropdownRef.current, { height: "auto", opacity: 1, duration: 0.3, ease: "power2.out" });
        } else {
            gsap.to(OthDropdownRef.current, { height: 0, opacity: 1, duration: 0.3, ease: "power2.out" });
        }

        if (othPublicDropdownOpen) {
            gsap.to(othPublicRef.current, { height: "auto", opacity: 1, duration: 0.3, ease: "power2.out" });
        } else {
            gsap.to(othPublicRef.current, { height: 0, opacity: 1, duration: 0.3, ease: "power2.out" });
        }

        if (othWorkspaceDropdownOpen) {
            gsap.to(othWorkspaceRef.current, { height: "auto", opacity: 1, duration: 0.3, ease: "power2.out" });
        } else {
            gsap.to(othWorkspaceRef.current, { height: 0, opacity: 1, duration: 0.3, ease: "power2.out" });
        }

    }, [
        // workspaceDropdownOpen, 
        boardsDropdownOpen,
        othDropdownOpen,
        othPublicDropdownOpen,
        othWorkspaceDropdownOpen,
    ]);

    const handleShowBoardClick = (e) => {
        setTempBoard(false);
    }
      

    const [currentPage, setCurrentPage] = useState(0);
    const [currentPage2, setCurrentPage2] = useState(0);
    const [currentPage3, setCurrentPage3] = useState(0);
    const itemsPerPage = 5; // Only show 5 items per page
    
    const filteredBoards = userBoards?.filter(board => board.email === currentUser?.email);
    const filteredWorldBoards = userBoards?.filter(board => board.boardVisibility === "Public");
    
    // Show only workspace boards where either the board owner is the current user, or the boardInviteEmail array includes the current user's email.
    // const filteredWorkspaceBoards = userBoards?.filter(board =>
    //     board.boardVisibility === "Workspace" &&
    //     (board.email === currentUser?.email &&
    //     (board.boardInviteEmail && board.boardInviteEmail.includes(currentUser?.email)))
    // );

    const filteredWorkspaceBoards = userBoards?.filter(board =>
        board.boardVisibility === "Workspace" &&
        board.email !== currentUser?.email && // Exclude boards owned by the current user
        board.boardInviteEmail &&
        board.boardInviteEmail.includes(currentUser.email)
      );
      

        
    const totalPages = Math.ceil(filteredBoards.length / itemsPerPage);
    const totalPagesWorld = Math.ceil(filteredWorldBoards.length / itemsPerPage);
    const totalPagesWorkspace = Math.ceil(filteredWorkspaceBoards.length / itemsPerPage);
    const paginatedBoards = filteredBoards.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
    const paginatedWorldBoards = filteredWorldBoards.slice(currentPage2 * itemsPerPage, (currentPage2 + 1) * itemsPerPage);
    const paginatedWorkspaceBoards = filteredWorkspaceBoards.slice(currentPage3 * itemsPerPage, (currentPage3 + 1) * itemsPerPage);
    

    const handleDeleteBoard = async (board_id) => {
        try {
            await deleteBoard(board_id);
            setUserBoards(prevBoards => prevBoards.filter(board => board.id !== board_id));
        } catch (error) {
            console.error("Error deleting board:", error);
        }
    };

    return (
        <div className='dashboard flex items-center justify-between'>

            <div className="main-dash">
                <div className="side-bar">
                    <h1 className='side-title text-center flex items-center justify-evenly'> 
                        <svg width="23" height="25" viewBox="0 0 23 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M4.73284 1.14829C5.08915 0.791975 5.57243 0.591797 6.07634 0.591797H16.921C17.1705 0.591797 17.4176 0.640942 17.6481 0.736426C17.8786 0.83191 18.0881 0.971863 18.2645 1.14829C18.4409 1.32473 18.5809 1.53418 18.6764 1.7647C18.7718 1.99522 18.821 2.24229 18.821 2.4918V8.91858C18.821 9.16809 18.7718 9.41516 18.6764 9.64568C18.5809 9.8762 18.4409 10.0857 18.2645 10.2621C18.0881 10.4385 17.8786 10.5785 17.6481 10.674C17.4176 10.7694 17.1705 10.8186 16.921 10.8186H11.9996V14.0293H20.0656C21.4367 14.0293 22.546 15.1409 22.546 16.5097V18.3921C22.5472 18.4061 22.5478 18.4203 22.5478 18.4347C22.5478 18.449 22.5472 18.4632 22.546 18.4772V24.3061C22.546 24.5822 22.3221 24.8061 22.046 24.8061C21.7698 24.8061 21.546 24.5822 21.546 24.3061V18.9347H1.45312V24.3061C1.45312 24.5822 1.22927 24.8061 0.953125 24.8061C0.676983 24.8061 0.453125 24.5822 0.453125 24.3061V16.5097C0.453125 15.1412 1.56211 14.0293 2.9317 14.0293H10.9996V10.8186H6.07634C5.02698 10.8186 4.17634 9.96794 4.17634 8.91858V2.4918C4.17634 1.98789 4.37652 1.50461 4.73284 1.14829ZM16.921 9.81858C17.0392 9.81858 17.1562 9.7953 17.2654 9.75007C17.3746 9.70485 17.4738 9.63855 17.5574 9.55498C17.641 9.47141 17.7072 9.37219 17.7525 9.263C17.7977 9.15381 17.821 9.03677 17.821 8.91858V2.4918C17.821 2.37361 17.7977 2.25657 17.7525 2.14738C17.7072 2.03819 17.641 1.93897 17.5574 1.8554C17.4738 1.77183 17.3746 1.70553 17.2654 1.66031C17.1562 1.61508 17.0392 1.5918 16.921 1.5918H6.07634C5.83764 1.5918 5.60873 1.68662 5.43994 1.8554C5.27116 2.02418 5.17634 2.2531 5.17634 2.4918V8.91858C5.17634 9.41565 5.57927 9.81858 6.07634 9.81858H16.921ZM2.9317 15.0293C2.11557 15.0293 1.45312 15.6924 1.45312 16.5097V17.9347H21.546V16.5097C21.546 15.6926 20.8838 15.0293 20.0656 15.0293H2.9317Z" fill="white"/>
                        </svg>
                        Task Workspace 
                    </h1>
                    <div className="line"></div>
                    <div className="sidenav-ul grid gap-3">
                        <Link to={'/dashboard'} className="sidenav-head cursor-pointer" onClick={e => setTempBoard(true)}>
                            <h1 className='text-2xl main-title slash'> Board </h1>
                        </Link>

                        {/* <div className="sidenav-ulx">
                            <div className="sidenav-ulx-head flex items-center justify-between slash">
                                <h1> Workspace Views </h1>
                                <svg onClick={toggleWorkspaceDropdown} className='drop-svg' width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 14H10C10.2833 14 10.521 14.096 10.713 14.288C10.905 14.48 11.0007 14.7173 11 15C10.9993 15.2827 10.9033 15.5203 10.712 15.713C10.5207 15.9057 10.2833 16.0013 10 16H1C0.716667 16 0.479333 15.904 0.288 15.712C0.0966668 15.52 0.000666667 15.2827 0 15V6C0 5.71667 0.0960001 5.47934 0.288 5.288C0.48 5.09667 0.717333 5.00067 1 5C1.28267 4.99934 1.52033 5.09534 1.713 5.288C1.90567 5.48067 2.00133 5.718 2 6V14ZM7 9H15C15.2833 9 15.521 9.096 15.713 9.288C15.905 9.48 16.0007 9.71734 16 10C15.9993 10.2827 15.9033 10.5203 15.712 10.713C15.5207 10.9057 15.2833 11.0013 15 11H6C5.71667 11 5.47933 10.904 5.288 10.712C5.09667 10.52 5.00067 10.2827 5 10V1C5 0.71667 5.096 0.479337 5.288 0.288004C5.48 0.0966702 5.71733 0.000670115 6 3.44827e-06C6.28267 -0.000663218 6.52033 0.0953369 6.713 0.288004C6.90567 0.48067 7.00133 0.718003 7 1V9Z" fill="black"/>
                                </svg>
                            </div>

                            <div className="dropdown-ulx main_ulx" ref={workspaceDropdownRef}>
                                <p> Table </p>
                                <p> Calendar </p>
                                <p> Ganchart </p>
                            </div>
                            
                        </div> */}

                        <div className="sidenav-ulx relative">

                            <div className="sidenav-ulx-head flex items-center justify-between slash">
                                <h1> Your Boards </h1>
                                <svg className='drop-svg' onClick={toggleBoardsDropdown} width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 3.5C2.82843 3.5 3.5 2.82843 3.5 2C3.5 1.17157 2.82843 0.5 2 0.5C1.17157 0.5 0.5 1.17157 0.5 2C0.5 2.82843 1.17157 3.5 2 3.5Z" fill="#538FFF"/>
                                <path d="M9 3.5C9.82843 3.5 10.5 2.82843 10.5 2C10.5 1.17157 9.82843 0.5 9 0.5C8.17157 0.5 7.5 1.17157 7.5 2C7.5 2.82843 8.17157 3.5 9 3.5Z" fill="#538FFF"/>
                                <path d="M16 3.5C16.8284 3.5 17.5 2.82843 17.5 2C17.5 1.17157 16.8284 0.5 16 0.5C15.1716 0.5 14.5 1.17157 14.5 2C14.5 2.82843 15.1716 3.5 16 3.5Z" fill="#538FFF"/>
                                <path d="M2 10.5C2.82843 10.5 3.5 9.82843 3.5 9C3.5 8.17157 2.82843 7.5 2 7.5C1.17157 7.5 0.5 8.17157 0.5 9C0.5 9.82843 1.17157 10.5 2 10.5Z" fill="#538FFF"/>
                                <path d="M9 10.5C9.82843 10.5 10.5 9.82843 10.5 9C10.5 8.17157 9.82843 7.5 9 7.5C8.17157 7.5 7.5 8.17157 7.5 9C7.5 9.82843 8.17157 10.5 9 10.5Z" fill="#538FFF"/>
                                <path d="M16 10.5C16.8284 10.5 17.5 9.82843 17.5 9C17.5 8.17157 16.8284 7.5 16 7.5C15.1716 7.5 14.5 8.17157 14.5 9C14.5 9.82843 15.1716 10.5 16 10.5Z" fill="#538FFF"/>
                                <path d="M2 17.5C2.82843 17.5 3.5 16.8284 3.5 16C3.5 15.1716 2.82843 14.5 2 14.5C1.17157 14.5 0.5 15.1716 0.5 16C0.5 16.8284 1.17157 17.5 2 17.5Z" fill="#538FFF"/>
                                <path d="M9 17.5C9.82843 17.5 10.5 16.8284 10.5 16C10.5 15.1716 9.82843 14.5 9 14.5C8.17157 14.5 7.5 15.1716 7.5 16C7.5 16.8284 8.17157 17.5 9 17.5Z" fill="#538FFF"/>
                                <path d="M16 17.5C16.8284 17.5 17.5 16.8284 17.5 16C17.5 15.1716 16.8284 14.5 16 14.5C15.1716 14.5 14.5 15.1716 14.5 16C14.5 16.8284 15.1716 17.5 16 17.5Z" fill="#538FFF"/>
                                </svg>
                            </div>
                            {IsCreateBoard && (
                                <div
                                    className="modal-overlay"
                                    tabIndex={0}
                                    onBlur={(e) => {
                                        if (!e.currentTarget.contains(e.relatedTarget)) {
                                            setIsCreateBoard(false);
                                        }
                                    }}
                                >
                                    <div className="modal-content">
                                        <header className="modal-header">
                                            <h2 className='text-black'> Board </h2>
                                            <button className="close-btn" onClick={() => {
                                                setBoardAttr({})
                                                setIsCreateBoard(false)
                                            }}>
                                                <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M17 4.5918H14V1.5918C14 1.32658 13.8946 1.07223 13.7071 0.88469C13.5196 0.697154 13.2652 0.591797 13 0.591797C12.7348 0.591797 12.4804 0.697154 12.2929 0.88469C12.1054 1.07223 12 1.32658 12 1.5918V4.5918C12 5.12223 12.2107 5.63094 12.5858 6.00601C12.9609 6.38108 13.4696 6.5918 14 6.5918H17C17.2652 6.5918 17.5196 6.48644 17.7071 6.2989C17.8946 6.11137 18 5.85701 18 5.5918C18 5.32658 17.8946 5.07223 17.7071 4.88469C17.5196 4.69715 17.2652 4.5918 17 4.5918ZM4 6.5918C4.53043 6.5918 5.03914 6.38108 5.41421 6.00601C5.78929 5.63094 6 5.12223 6 4.5918V1.5918C6 1.32658 5.89464 1.07223 5.70711 0.88469C5.51957 0.697154 5.26522 0.591797 5 0.591797C4.73478 0.591797 4.48043 0.697154 4.29289 0.88469C4.10536 1.07223 4 1.32658 4 1.5918V4.5918H1C0.734784 4.5918 0.48043 4.69715 0.292893 4.88469C0.105357 5.07223 0 5.32658 0 5.5918C0 5.85701 0.105357 6.11137 0.292893 6.2989C0.48043 6.48644 0.734784 6.5918 1 6.5918H4ZM4 14.5918H1C0.734784 14.5918 0.48043 14.4864 0.292893 14.2989C0.105357 14.1114 0 13.857 0 13.5918C0 13.3266 0.105357 13.0722 0.292893 12.8847C0.48043 12.6972 0.734784 12.5918 1 12.5918H4C4.53043 12.5918 5.03914 12.8025 5.41421 13.1776C5.78929 13.5527 6 14.0614 6 14.5918V17.5918C6 17.857 5.89464 18.1114 5.70711 18.2989C5.51957 18.4864 5.26522 18.5918 5 18.5918C4.73478 18.5918 4.48043 18.4864 4.29289 18.2989C4.10536 18.1114 4 17.857 4 17.5918V14.5918ZM14 12.5918C13.4696 12.5918 12.9609 12.8025 12.5858 13.1776C12.2107 13.5527 12 14.0614 12 14.5918V17.5918C12 17.857 12.1054 18.1114 12.2929 18.2989C12.4804 18.4864 12.7348 18.5918 13 18.5918C13.2652 18.5918 13.5196 18.4864 13.7071 18.2989C13.8946 18.1114 14 17.857 14 17.5918V14.5918H17C17.2652 14.5918 17.5196 14.4864 17.7071 14.2989C17.8946 14.1114 18 13.857 18 13.5918C18 13.3266 17.8946 13.0722 17.7071 12.8847C17.5196 12.6972 17.2652 12.5918 17 12.5918H14Z" fill="black"/>
                                                </svg>
                                            </button>
                                        </header>

                                    {/* Message area */}
                                    {(successMessage || errorMessage) && (
                                        <div className="message-container">
                                        {successMessage && (
                                            <div className="message success">{successMessage}</div>
                                        )}
                                        {errorMessage && (
                                            <div className="message error">{errorMessage}</div>
                                        )}
                                        </div>
                                    )}

                                    <div className="modal-body">
                                        <div className="image-preview">
                                            <img className="main-img" src="/img/s1.jpg" alt="Board Cover" />
                                        </div>
                                        <div className="collection-img">
                                            <img src="/img/s1.jpg" alt="Thumbnail" />
                                            <img src="/img/s2.jpg" alt="Thumbnail" />
                                            <img src="/img/s3.jpg" alt="Thumbnail" />
                                            <img src="/img/s4.jpg" alt="Thumbnail" />
                                            <img src="/img/s5.jpg" alt="Thumbnail" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Board Title"
                                            value={boardAttr.boardTitle}
                                            onChange={(e) =>
                                                setBoardAttr((prevState) => ({
                                                ...prevState,
                                                boardTitle: e.target.value,
                                                }))
                                            }
                                        />
                                        <div className="select-group">
                                            <label>Visibility</label>
                                            <select
                                                value={boardAttr.boardVisibility}
                                                onChange={(e) =>
                                                setBoardAttr((prevState) => ({
                                                    ...prevState,
                                                    boardVisibility: e.target.value,
                                                }))
                                                }
                                            >
                                                <option value="Private">Private</option>
                                                <option value="Workspace">Workspace</option>
                                                <option value="Public">Public</option>
                                            </select>
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Board Template"
                                            value={boardAttr.boardTemplate}
                                            onChange={(e) =>
                                                setBoardAttr((prevState) => ({
                                                ...prevState,
                                                boardTemplate: e.target.value,
                                                }))
                                            }
                                        />

                                        {boardAttr.boardVisibility === "Workspace" && (
                                        <div className="invite-members">
                                            <label>Invite Workspace Members (minimum 2 required)</label>
                                            <div className="invite-input-group" style={{ position: "relative" }}>
                                                <input
                                                    type="text"
                                                    placeholder="Enter email to invite..."
                                                    value={inviteEmail}
                                                    onChange={handleInviteSearch}
                                                />
                                                <button type="button" onClick={handleAddInvite}>Add Invite</button>
                                                {/* Dropdown with search suggestions */}
                                                {inviteSearchResults.length > 0 && (
                                                    <div className="invite-search-dropdown">
                                                    {inviteSearchResults.map((result, idx) => (
                                                        <div
                                                        key={idx}
                                                        className="invite-search-item"
                                                        onClick={() => handleSelectInviteEmail(result.email)}
                                                        >
                                                        {result.username} ({result.email})
                                                        </div>
                                                    ))}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="invite-list">
                                                {boardAttr.boardInviteEmail &&
                                                    boardAttr.boardInviteEmail.map((email, idx) => (
                                                    <div key={idx} className="invite-item">
                                                        <span>{email}</span>
                                                        <button type="button" onClick={() => removeInvite(email)}>Remove</button>
                                                    </div>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                        )}

                                    </div>
                                    <footer className="modal-footer">
                                        <button
                                            className="create-btn"
                                            onClick={(e) => handleCreateBoard(e, currentUser, boardAttr)}
                                        >
                                        Create Board
                                        </button>
                                    </footer>
                                    </div>
                                </div>
                            )}

                            <div className="dropdown-ulx main_ulx" ref={boardsDropdownRef}>
                                {paginatedBoards.map((board, index) => (      
                                    <div className="temp-link flex items-center justify-between relative">
                                        <Link 
                                            key={index}
                                            to={`/dashboard/${board.id}`}
                                            className='boardtitles'
                                            onClick={handleShowBoardClick}
                                        >
                                            {board.boardTitle}
                                        </Link>
                                        <div 
                                            className={`svg_drop ${
                                                isOpenDeletes[board.id]
                                                ? 'open'
                                                : 'close'
                                            }`}
                                        >

                                            <svg 
                                                onClick={() => 
                                                    setIsOpenDeletes((prev) => ({
                                                        ...prev,
                                                        [board.id]: !prev[board.id]
                                                    }))
                                                }
                                                className={`slide-del ${
                                                    isOpenDeletes[board.id] ? 'slide_out' : 'slide_in'
                                                }`} 
                                                width="17" height="16" 
                                                viewBox="0 0 17 16" fill="none" 
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                            <path fillRule="evenodd" clipRule="evenodd" d="M6.44 5.49986L8.871 7.92986L7.811 8.99086L4.629 5.80986L3.922 5.10286C3.82826 5.0091 3.77561 4.88194 3.77561 4.74936C3.77561 4.61678 3.82826 4.48962 3.922 4.39586L7.811 0.505859L8.871 1.56686L6.438 3.99986H11C12.5913 3.99986 14.1174 4.632 15.2426 5.75722C16.3679 6.88244 17 8.40856 17 9.99986C17 11.5912 16.3679 13.1173 15.2426 14.2425C14.1174 15.3677 12.5913 15.9999 11 15.9999H0V14.4999H11C12.1935 14.4999 13.3381 14.0258 14.182 13.1818C15.0259 12.3379 15.5 11.1933 15.5 9.99986C15.5 8.80638 15.0259 7.66179 14.182 6.81788C13.3381 5.97397 12.1935 5.49986 11 5.49986H6.44Z"/>
                                            </svg>

                                            <svg 
                                                className={`del-board ${
                                                    isOpenDeletes[board.id] ? 'slide_in' : 'slide_out'
                                                }`} 
                                                onClick={e => handleDeleteBoard(board.id)}
                                                width="14" height="16" 
                                                viewBox="0 0 14 16" fill="none" 
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                            <path d="M2.61601 16.0005C2.17134 16.0005 1.79101 15.8421 1.47501 15.5255C1.15901 15.2088 1.00067 14.8291 1.00001 14.3865V2.00047H0.500007C0.358007 2.00047 0.23934 1.95247 0.144007 1.85647C0.0486736 1.76047 0.000673516 1.64147 6.84931e-06 1.49947C-0.000659817 1.35747 0.0473402 1.2388 0.144007 1.14347C0.240674 1.04814 0.35934 1.00047 0.500007 1.00047H4.00001C4.00001 0.793802 4.07667 0.613802 4.23001 0.460469C4.38334 0.307135 4.56334 0.230469 4.77001 0.230469H9.23001C9.43667 0.230469 9.61667 0.307135 9.77001 0.460469C9.92334 0.613802 10 0.793802 10 1.00047H13.5C13.642 1.00047 13.7607 1.04847 13.856 1.14447C13.9513 1.24047 13.9993 1.35947 14 1.50147C14.0007 1.64347 13.9527 1.76214 13.856 1.85747C13.7593 1.9528 13.6407 2.00047 13.5 2.00047H13V14.3855C13 14.8295 12.8417 15.2095 12.525 15.5255C12.2083 15.8415 11.8283 15.9998 11.385 16.0005H2.61601ZM12 2.00047H2.00001V14.3855C2.00001 14.5648 2.05767 14.7121 2.17301 14.8275C2.28834 14.9428 2.43601 15.0005 2.61601 15.0005H11.385C11.5643 15.0005 11.7117 14.9428 11.827 14.8275C11.9423 14.7121 12 14.5648 12 14.3855V2.00047ZM5.30801 13.0005C5.45001 13.0005 5.56901 12.9525 5.66501 12.8565C5.76101 12.7605 5.80867 12.6418 5.80801 12.5005V4.50047C5.80801 4.35847 5.76001 4.2398 5.66401 4.14447C5.56801 4.04914 5.44901 4.00114 5.30701 4.00047C5.16501 3.9998 5.04634 4.0478 4.95101 4.14447C4.85567 4.24114 4.80801 4.3598 4.80801 4.50047V12.5005C4.80801 12.6425 4.85601 12.7611 4.95201 12.8565C5.04801 12.9525 5.16667 13.0005 5.30801 13.0005ZM8.69301 13.0005C8.83501 13.0005 8.95367 12.9525 9.04901 12.8565C9.14434 12.7605 9.19201 12.6418 9.19201 12.5005V4.50047C9.19201 4.35847 9.14401 4.2398 9.04801 4.14447C8.95201 4.04847 8.83334 4.00047 8.69201 4.00047C8.55001 4.00047 8.43101 4.04847 8.33501 4.14447C8.23901 4.24047 8.19134 4.35914 8.19201 4.50047V12.5005C8.19201 12.6425 8.24001 12.7611 8.33601 12.8565C8.43201 12.9518 8.55101 12.9998 8.69301 13.0005Z" fill="black"/>
                                            </svg>

                                            <svg 
                                                onClick={() => 
                                                    setIsOpenDeletes((prev) => ({
                                                        ...prev,
                                                        [board.id]: !prev[board.id]
                                                    }))
                                                }
                                                className={`del-slide ${
                                                    isOpenDeletes[board.id] ? 'slide_in delay' : 'slide_out'
                                                }`} 
                                                width="17" height="16" 
                                                viewBox="0 0 17 16" fill="none" 
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M10.56 5.49986L8.129 7.92986L9.189 8.99086L12.371 5.80986L13.078 5.10286C13.1717 5.0091 13.2244 4.88194 13.2244 4.74936C13.2244 4.61678 13.1717 4.48962 13.078 4.39586L9.189 0.505859L8.129 1.56686L10.562 3.99986H6C4.4087 3.99986 2.88258 4.632 1.75736 5.75722C0.63214 6.88244 0 8.40856 0 9.99986C0 11.5912 0.63214 13.1173 1.75736 14.2425C2.88258 15.3677 4.4087 15.9999 6 15.9999H17V14.4999H6C4.80653 14.4999 3.66193 14.0258 2.81802 13.1818C1.97411 12.3379 1.5 11.1933 1.5 9.99986C1.5 8.80638 1.97411 7.66179 2.81802 6.81788C3.66193 5.97397 4.80653 5.49986 6 5.49986H10.56Z" fill="black"/>
                                            </svg>

                                        </div>
                                    </div>                               
                                ))}

                                <div className="pagination-controls flex justify-between mt-2">
                                    <button 
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
                                        disabled={currentPage === 0}
                                        className="pagination-btn"
                                    >
                                        <svg width="9" height="14" viewBox="0 0 9 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8.36296 13.6113C8.47884 13.4957 8.57077 13.3583 8.6335 13.2071C8.69623 13.0559 8.72852 12.8938 8.72852 12.7301C8.72852 12.5664 8.69623 12.4042 8.6335 12.253C8.57077 12.1018 8.47884 11.9645 8.36296 11.8488L3.51296 6.99881L8.36296 2.14881C8.59668 1.91509 8.72799 1.5981 8.72799 1.26756C8.72799 0.937031 8.59668 0.620034 8.36296 0.386312C8.12924 0.152589 7.81224 0.0212879 7.48171 0.0212879C7.15118 0.0212879 6.83418 0.152589 6.60046 0.386312L0.86296 6.12381C0.747081 6.23946 0.655146 6.37682 0.59242 6.52803C0.529693 6.67925 0.497406 6.84135 0.497406 7.00506C0.497406 7.16877 0.529693 7.33088 0.59242 7.48209C0.655146 7.63331 0.747081 7.77067 0.86296 7.88631L6.60046 13.6238C7.07546 14.0988 7.87546 14.0988 8.36296 13.6113Z" fill="white"/>
                                        </svg>
                                    </button>
                                    <span className='page-txt'> {currentPage + 1} of {totalPages} </span>
                                    <button 
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
                                        disabled={currentPage === totalPages - 1}
                                        className="pagination-btn"
                                    >
                                        <svg width="9" height="14" viewBox="0 0 9 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M0.63704 0.386734C0.52116 0.502376 0.429226 0.639737 0.366499 0.790954C0.303772 0.94217 0.271484 1.10427 0.271484 1.26798C0.271484 1.43169 0.303772 1.5938 0.366499 1.74501C0.429226 1.89623 0.52116 2.03359 0.63704 2.14923L5.48704 6.99923L0.63704 11.8492C0.403318 12.083 0.272014 12.4 0.272014 12.7305C0.272014 13.061 0.403318 13.378 0.63704 13.6117C0.870762 13.8455 1.18776 13.9768 1.51829 13.9768C1.84882 13.9768 2.16582 13.8455 2.39954 13.6117L8.13704 7.87423C8.25292 7.75859 8.34485 7.62123 8.40758 7.47001C8.47031 7.3188 8.50259 7.15669 8.50259 6.99298C8.50259 6.82927 8.47031 6.66717 8.40758 6.51595C8.34485 6.36474 8.25292 6.22738 8.13704 6.11173L2.39954 0.374234C1.92454 -0.100766 1.12454 -0.100766 0.63704 0.386734Z" fill="white"/>
                                        </svg>
                                    </button>
                                </div>

                                <div className="create-board" onClick={e => setIsCreateBoard(!IsCreateBoard)}>
                                    <p> 
                                        Create Board 
                                    </p>
                                    <svg className='drop-svg' width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6 8H1C0.71667 8 0.479337 7.904 0.288004 7.712C0.0966702 7.52 0.000670115 7.28267 3.44827e-06 7C-0.000663218 6.71734 0.0953369 6.48 0.288004 6.288C0.48067 6.096 0.718003 6 1 6H6V1C6 0.71667 6.096 0.479337 6.288 0.288004C6.48 0.0966702 6.71734 0.000670115 7 3.44827e-06C7.28267 -0.000663218 7.52034 0.0953369 7.713 0.288004C7.90567 0.48067 8.00134 0.718003 8 1V6H13C13.2833 6 13.521 6.096 13.713 6.288C13.905 6.48 14.0007 6.71734 14 7C13.9993 7.28267 13.9033 7.52034 13.712 7.713C13.5207 7.90567 13.2833 8.00134 13 8H8V13C8 13.2833 7.904 13.521 7.712 13.713C7.52 13.905 7.28267 14.0007 7 14C6.71734 13.9993 6.48 13.9033 6.288 13.712C6.096 13.5207 6 13.2833 6 13V8Z" fill="#fff"/>
                                    </svg>

                                </div>
                            </div>
                        </div>
                        <div className="sidenav-ulx slash others">

                            <div className="oth_board-ulx flex items-center justify-between">
                                <h1> Other Boards </h1>
                                <svg className='oth-svg cursor-pointer' onClick={toggleOthDropdown} width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13 17.5918H15V13.5918H17V17.5918H19L16 20.5918L13 17.5918ZM10 16.5918C10 14.3918 11.2 12.4918 13 11.3918C12.9 10.8918 12.5 10.5918 12 10.5918H6V8.5918H8C8.6 8.5918 9 8.1918 9 7.5918V5.5918H11C12.1 5.5918 13 4.6918 13 3.5918V3.1918C15.9 4.3918 18 7.1918 18 10.5918V10.8918C18.7 11.0918 19.3 11.4918 19.9 11.9918C20 11.5918 20 11.0918 20 10.5918C20 5.0918 15.5 0.591797 10 0.591797C4.5 0.591797 0 5.0918 0 10.5918C0 16.0918 4.5 20.5918 10 20.5918C10.5 20.5918 11 20.5918 11.4 20.4918C10.5 19.3918 10 18.0918 10 16.5918ZM9 18.4918C5 17.9918 2 14.6918 2 10.5918C2 9.9918 2.1 9.3918 2.2 8.7918L7 13.5918V14.5918C7 15.6918 7.9 16.5918 9 16.5918V18.4918Z" fill="#538FFF"/>
                                </svg>
                            </div>
                            
                            <div className="fix-oth">
                                <div className="dropdown-ulx main_ulx oth" ref={OthDropdownRef}>
                                    <div className="public-dd">
                                        <h3 onClick={toggleOthPublic} className='cursor-pointer'> Public Board </h3>
                                        <div className="public-list dropdown-ulx main_ulx" ref={othPublicRef}>
                                            {paginatedWorldBoards.map((board, index) => (                                     
                                                <Link 
                                                    key={index}
                                                    to={`/dashboard/${board.id}`}
                                                    className='boardtitles'
                                                    onClick={handleShowBoardClick}
                                                >
                                                    {board.boardTitle}
                                                </Link>
                                            ))}
                                        </div>
                                        <div className="pagination-controls flex justify-between mt-2">
                                            <button 
                                                onClick={() => setCurrentPage2(prev => Math.max(prev - 1, 0))}
                                                disabled={currentPage2 === 0}
                                                className="pagination-btn"
                                            >
                                                <svg width="9" height="14" viewBox="0 0 9 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M8.36296 13.6113C8.47884 13.4957 8.57077 13.3583 8.6335 13.2071C8.69623 13.0559 8.72852 12.8938 8.72852 12.7301C8.72852 12.5664 8.69623 12.4042 8.6335 12.253C8.57077 12.1018 8.47884 11.9645 8.36296 11.8488L3.51296 6.99881L8.36296 2.14881C8.59668 1.91509 8.72799 1.5981 8.72799 1.26756C8.72799 0.937031 8.59668 0.620034 8.36296 0.386312C8.12924 0.152589 7.81224 0.0212879 7.48171 0.0212879C7.15118 0.0212879 6.83418 0.152589 6.60046 0.386312L0.86296 6.12381C0.747081 6.23946 0.655146 6.37682 0.59242 6.52803C0.529693 6.67925 0.497406 6.84135 0.497406 7.00506C0.497406 7.16877 0.529693 7.33088 0.59242 7.48209C0.655146 7.63331 0.747081 7.77067 0.86296 7.88631L6.60046 13.6238C7.07546 14.0988 7.87546 14.0988 8.36296 13.6113Z" fill="white"/>
                                                </svg>
                                            </button>
                                            <span className='page-txt'> {currentPage2 + 1} of {totalPagesWorld} </span>
                                            <button 
                                                onClick={() => setCurrentPage2(prev => Math.min(prev + 1, totalPagesWorld - 1))}
                                                disabled={currentPage2 === totalPagesWorld - 1}
                                                className="pagination-btn"
                                            >
                                                <svg width="9" height="14" viewBox="0 0 9 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M0.63704 0.386734C0.52116 0.502376 0.429226 0.639737 0.366499 0.790954C0.303772 0.94217 0.271484 1.10427 0.271484 1.26798C0.271484 1.43169 0.303772 1.5938 0.366499 1.74501C0.429226 1.89623 0.52116 2.03359 0.63704 2.14923L5.48704 6.99923L0.63704 11.8492C0.403318 12.083 0.272014 12.4 0.272014 12.7305C0.272014 13.061 0.403318 13.378 0.63704 13.6117C0.870762 13.8455 1.18776 13.9768 1.51829 13.9768C1.84882 13.9768 2.16582 13.8455 2.39954 13.6117L8.13704 7.87423C8.25292 7.75859 8.34485 7.62123 8.40758 7.47001C8.47031 7.3188 8.50259 7.15669 8.50259 6.99298C8.50259 6.82927 8.47031 6.66717 8.40758 6.51595C8.34485 6.36474 8.25292 6.22738 8.13704 6.11173L2.39954 0.374234C1.92454 -0.100766 1.12454 -0.100766 0.63704 0.386734Z" fill="white"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="workspace-dd">
                                        <h3 onClick={toggleOthWorkspace} className='cursor-pointer'> Workspace Board </h3>
                                        <div className="workspace-list dropdown-ulx main_ulx" ref={othWorkspaceRef}>
                                            {paginatedWorkspaceBoards.map((board, index) => (                                     
                                                <Link 
                                                    key={index}
                                                    to={`/dashboard/${board.id}`}
                                                    className='boardtitles'
                                                    onClick={handleShowBoardClick}
                                                >
                                                    {board.boardTitle}
                                                </Link>
                                            ))}
                                        </div>
                                        <div className="pagination-controls flex justify-between mt-2">
                                            <button 
                                                onClick={() => setCurrentPage3(prev => Math.max(prev - 1, 0))}
                                                disabled={currentPage3 === 0}
                                                className="pagination-btn"
                                            >
                                                <svg width="9" height="14" viewBox="0 0 9 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M8.36296 13.6113C8.47884 13.4957 8.57077 13.3583 8.6335 13.2071C8.69623 13.0559 8.72852 12.8938 8.72852 12.7301C8.72852 12.5664 8.69623 12.4042 8.6335 12.253C8.57077 12.1018 8.47884 11.9645 8.36296 11.8488L3.51296 6.99881L8.36296 2.14881C8.59668 1.91509 8.72799 1.5981 8.72799 1.26756C8.72799 0.937031 8.59668 0.620034 8.36296 0.386312C8.12924 0.152589 7.81224 0.0212879 7.48171 0.0212879C7.15118 0.0212879 6.83418 0.152589 6.60046 0.386312L0.86296 6.12381C0.747081 6.23946 0.655146 6.37682 0.59242 6.52803C0.529693 6.67925 0.497406 6.84135 0.497406 7.00506C0.497406 7.16877 0.529693 7.33088 0.59242 7.48209C0.655146 7.63331 0.747081 7.77067 0.86296 7.88631L6.60046 13.6238C7.07546 14.0988 7.87546 14.0988 8.36296 13.6113Z" fill="white"/>
                                                </svg>
                                            </button>
                                            <span className='page-txt'> {currentPage3 + 1} of {totalPagesWorkspace} </span>
                                            <button 
                                                onClick={() => setCurrentPage3(prev => Math.min(prev + 1, totalPagesWorkspace - 1))}
                                                disabled={currentPage3 === totalPagesWorkspace - 1}
                                                className="pagination-btn"
                                            >
                                                <svg width="9" height="14" viewBox="0 0 9 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M0.63704 0.386734C0.52116 0.502376 0.429226 0.639737 0.366499 0.790954C0.303772 0.94217 0.271484 1.10427 0.271484 1.26798C0.271484 1.43169 0.303772 1.5938 0.366499 1.74501C0.429226 1.89623 0.52116 2.03359 0.63704 2.14923L5.48704 6.99923L0.63704 11.8492C0.403318 12.083 0.272014 12.4 0.272014 12.7305C0.272014 13.061 0.403318 13.378 0.63704 13.6117C0.870762 13.8455 1.18776 13.9768 1.51829 13.9768C1.84882 13.9768 2.16582 13.8455 2.39954 13.6117L8.13704 7.87423C8.25292 7.75859 8.34485 7.62123 8.40758 7.47001C8.47031 7.3188 8.50259 7.15669 8.50259 6.99298C8.50259 6.82927 8.47031 6.66717 8.40758 6.51595C8.34485 6.36474 8.25292 6.22738 8.13704 6.11173L2.39954 0.374234C1.92454 -0.100766 1.12454 -0.100766 0.63704 0.386734Z" fill="white"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        
            <div className="show-dash">

                { isDashboardRoot 
                    &&
                    <Board tempboard={tempboard} setTempBoard={setTempBoard} ></Board>
                }

                <Outlet />

            </div>
        
        </div>
    )
}

export default Dashboard