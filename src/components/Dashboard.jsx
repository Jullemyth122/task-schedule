import React, { useEffect, useRef, useState } from 'react';
import '../scss/dashboard.scss';
import { Link, Outlet, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { useDashboardFunc } from '../context/useDashboardFunc'
import { useAuth } from '../context/useAuth';
import Board from './board/Board';
import BoardSelect from './board/BoardSelect';


const Dashboard = ({  }) => {

    const location = useLocation();
  
    // Only show Board if the pathname is exactly "/dashboard"
    const isDashboardRoot = location.pathname === '/dashboard';
  
    const { currentUser  } = useAuth()

    const [expandedCreate, setExpandedCreate] = useState();


    const { 
        IsCreateBoard, setIsCreateBoard,
        boardAttr,setBoardAttr,
        handleCreateBoard,
        userBoards
    } = useDashboardFunc()

    const [tempboard,setTempBoard] = useState(null)
    const [isBoardSelect, setIsBoardSelect] = useState(false)

    const [workspaceDropdownOpen, setWorkspaceDropdownOpen] = useState(false);
    const [boardsDropdownOpen, setBoardsDropdownOpen] = useState(false);

    const workspaceDropdownRef = useRef(null);
    const boardsDropdownRef = useRef(null);

    const toggleWorkspaceDropdown = () => {
        setWorkspaceDropdownOpen(prev => !prev);
    };

    const toggleBoardsDropdown = () => {
        setBoardsDropdownOpen(prev => !prev);
    };

    useEffect(() => {
        // GSAP animation for workspace dropdown
        if (workspaceDropdownOpen) {
            gsap.to(workspaceDropdownRef.current, { height: "auto", opacity: 1, duration: 0.3, ease: "power2.out" });
        } else {
            gsap.to(workspaceDropdownRef.current, { height: 0, opacity: 0, duration: 0.3, ease: "power2.inOut" });
        }

        // GSAP animation for boards dropdown
        if (boardsDropdownOpen) {
            gsap.to(boardsDropdownRef.current, { height: "auto", opacity: 1, duration: 0.3, ease: "power2.out" });
        } else {
            gsap.to(boardsDropdownRef.current, { height: 0, opacity: 0, duration: 0.3, ease: "power2.inOut" });
        }
    }, [
        workspaceDropdownOpen, 
        boardsDropdownOpen
    ]);

    const handleShowBoardClick = (e) => {
        setTempBoard(false);
      }
      

    const filteredBoards = userBoards?.filter(board => board.email === currentUser.email);


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

                        <div className="sidenav-ulx">

                            <div className="sidenav-ulx-head flex items-center justify-between slash">
                                <h1> Workspace Views </h1>
                                <svg onClick={toggleWorkspaceDropdown} className='drop-svg' width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 14H10C10.2833 14 10.521 14.096 10.713 14.288C10.905 14.48 11.0007 14.7173 11 15C10.9993 15.2827 10.9033 15.5203 10.712 15.713C10.5207 15.9057 10.2833 16.0013 10 16H1C0.716667 16 0.479333 15.904 0.288 15.712C0.0966668 15.52 0.000666667 15.2827 0 15V6C0 5.71667 0.0960001 5.47934 0.288 5.288C0.48 5.09667 0.717333 5.00067 1 5C1.28267 4.99934 1.52033 5.09534 1.713 5.288C1.90567 5.48067 2.00133 5.718 2 6V14ZM7 9H15C15.2833 9 15.521 9.096 15.713 9.288C15.905 9.48 16.0007 9.71734 16 10C15.9993 10.2827 15.9033 10.5203 15.712 10.713C15.5207 10.9057 15.2833 11.0013 15 11H6C5.71667 11 5.47933 10.904 5.288 10.712C5.09667 10.52 5.00067 10.2827 5 10V1C5 0.71667 5.096 0.479337 5.288 0.288004C5.48 0.0966702 5.71733 0.000670115 6 3.44827e-06C6.28267 -0.000663218 6.52033 0.0953369 6.713 0.288004C6.90567 0.48067 7.00133 0.718003 7 1V9Z" fill="black"/>
                                </svg>
                            </div>

                            <div className="dropdown-ulx" ref={workspaceDropdownRef}>
                                <p> Table </p>
                                <p> Calendar </p>
                                <p> Ganchart </p>
                            </div>
                            
                        </div>

                        <div className="sidenav-ulx relative">

                            <div className="sidenav-ulx-head flex items-center justify-between slash">
                                <h1> Your Boards </h1>
                                <svg className='drop-svg' onClick={toggleBoardsDropdown} width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 3.5C2.82843 3.5 3.5 2.82843 3.5 2C3.5 1.17157 2.82843 0.5 2 0.5C1.17157 0.5 0.5 1.17157 0.5 2C0.5 2.82843 1.17157 3.5 2 3.5Z" fill="black"/>
                                <path d="M9 3.5C9.82843 3.5 10.5 2.82843 10.5 2C10.5 1.17157 9.82843 0.5 9 0.5C8.17157 0.5 7.5 1.17157 7.5 2C7.5 2.82843 8.17157 3.5 9 3.5Z" fill="black"/>
                                <path d="M16 3.5C16.8284 3.5 17.5 2.82843 17.5 2C17.5 1.17157 16.8284 0.5 16 0.5C15.1716 0.5 14.5 1.17157 14.5 2C14.5 2.82843 15.1716 3.5 16 3.5Z" fill="black"/>
                                <path d="M2 10.5C2.82843 10.5 3.5 9.82843 3.5 9C3.5 8.17157 2.82843 7.5 2 7.5C1.17157 7.5 0.5 8.17157 0.5 9C0.5 9.82843 1.17157 10.5 2 10.5Z" fill="black"/>
                                <path d="M9 10.5C9.82843 10.5 10.5 9.82843 10.5 9C10.5 8.17157 9.82843 7.5 9 7.5C8.17157 7.5 7.5 8.17157 7.5 9C7.5 9.82843 8.17157 10.5 9 10.5Z" fill="black"/>
                                <path d="M16 10.5C16.8284 10.5 17.5 9.82843 17.5 9C17.5 8.17157 16.8284 7.5 16 7.5C15.1716 7.5 14.5 8.17157 14.5 9C14.5 9.82843 15.1716 10.5 16 10.5Z" fill="black"/>
                                <path d="M2 17.5C2.82843 17.5 3.5 16.8284 3.5 16C3.5 15.1716 2.82843 14.5 2 14.5C1.17157 14.5 0.5 15.1716 0.5 16C0.5 16.8284 1.17157 17.5 2 17.5Z" fill="black"/>
                                <path d="M9 17.5C9.82843 17.5 10.5 16.8284 10.5 16C10.5 15.1716 9.82843 14.5 9 14.5C8.17157 14.5 7.5 15.1716 7.5 16C7.5 16.8284 8.17157 17.5 9 17.5Z" fill="black"/>
                                <path d="M16 17.5C16.8284 17.5 17.5 16.8284 17.5 16C17.5 15.1716 16.8284 14.5 16 14.5C15.1716 14.5 14.5 15.1716 14.5 16C14.5 16.8284 15.1716 17.5 16 17.5Z" fill="black"/>
                                </svg>
                            </div>

                            {IsCreateBoard && 
                                <>
                                    <div className="board_create-show"
                                        tabIndex={0} // Make the div focusable
                                        onBlur={(e) => {
                                        // If the new focused element is not inside this container, close it
                                        if (!e.currentTarget.contains(e.relatedTarget)) {
                                            setIsCreateBoard(false);
                                        }
                                        }}
                                    >
                                        <div className="create-ttl">
                                            <h5> Create Board </h5>
                                        </div>
                                        <img className='main-img' src="/img/btc5.jpg" alt="Yes" />

                                        <div className="collection-img flex items-center justify-center gap-1">
                                            <img src="/img/btc5.jpg" alt="" />
                                            <img src="/img/btc5.jpg" alt="" />
                                            <img src="/img/btc5.jpg" alt="" />
                                            <img src="/img/btc5.jpg" alt="" />
                                        </div>

                                        <input
                                            type="text"
                                            placeholder="Board Title"
                                            value={boardAttr.boardTitle}
                                            onChange={e => setBoardAttr(prevState => ({ ...prevState, boardTitle: e.target.value }))}
                                        />
                                        <div className="vtb-1">
                                            <label htmlFor=""> Visibility </label>
                                            <select name="" id=""
                                            value={boardAttr.boardVisibility}
                                            onChange={e => setBoardAttr(prevState => ({ ...prevState, boardVisibility: e.target.value }))}
                                            >
                                                <option value="Private"> Private </option>
                                                <option value="Workspace"> Workspace </option>
                                                <option value="Public"> Public </option>
                                            </select>
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Board Template"
                                            value={boardAttr.boardTemplate}
                                            onChange={e => setBoardAttr(prevState => ({ ...prevState, boardTemplate: e.target.value }))}
                                        />
                                        <button className='create-btn' onClick={e => handleCreateBoard(e, currentUser, boardAttr)}>
                                            <h3> Create Item </h3>
                                        </button>
                                    </div>
                                </>
                            }

                            <div className="dropdown-ulx" ref={boardsDropdownRef}>
                                {filteredBoards?.map((board, index) => {                                     
                                    return (
                                    <Link 
                                        key={index}
                                        to={`/dashboard/${board?.id}`}
                                        className='boardtitles'

                                        onClick={handleShowBoardClick}
                                    >
                                        {board?.boardTitle}
                                    </Link>
                                    )} 
                                )}
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