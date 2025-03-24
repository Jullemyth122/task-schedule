// Board.jsx
import React, { useEffect, useState } from 'react';
import { useDashboardFunc } from '../../context/useDashboardFunc';
import { Link } from 'react-router-dom';
import { useSearch } from '../../context/useSearch';
import { useAuth } from '../../context/useAuth';
import InviteWorkspace from './InviteWorkspace'; // Invite component
import { fetchConnectedBoards } from '../../utilities/board'; // NEW helper
import '../../scss/boardCompo.scss';

const Board = ({ tempboard, setTempBoard }) => {
    const images = [
        '/img/s1.jpg', '/img/s2.jpg', 
        '/img/s3.jpg', '/img/s4.jpg', '/img/s5.jpg'
    ];

    const { search, setSearch, filteredBoards } = useSearch();
    const { currentUser, accBST } = useAuth(); // Get accBST from auth context

    const [selectedImages, setSelectedImages] = useState([]);
    const [showInviteDropdown, setShowInviteDropdown] = useState(false);
    const [connectedBoards, setConnectedBoards] = useState([]);

    // Update board thumbnails when boards change
    useEffect(() => {
        if (filteredBoards.length > 0) {
        const newSelectedImages = filteredBoards.map(() =>
            images[Math.floor(Math.random() * images.length)]
        );
        setSelectedImages(newSelectedImages);
        }
    }, [filteredBoards]);

    useEffect(() => {
        // accBST is the current user's account document data
        if (accBST && accBST.invitesEmail && accBST.invitesEmail.length > 0) {
            fetchConnectedBoards(accBST.invitesEmail)
                .then(boards => setConnectedBoards(boards))
                .catch(error => console.error(error));
        } else {
            setConnectedBoards([]); // Clear if no inviters found
        }
    }, [accBST, showInviteDropdown]); 

    return (
        <div className='board-compo'>
            <div className="headline flex items-center justify-evenly">
                <div className="prt-1 flex items-center justify-between gap-3">
                    <div className="head-t">
                        <h1 className='txt1'> T 4 S K </h1>
                        <h1 className="txt2"> T 4 S K </h1>
                    </div>
                    <h1> Board Workspace </h1>
                </div>
                <div className="prt-1 relative">
                    <button className='samp' onClick={() => setShowInviteDropdown(prev => !prev)}>
                        + Invite Workspaces
                    </button>
                    {showInviteDropdown && (
                        <InviteWorkspace onClose={() => setShowInviteDropdown(false)} />
                    )}
                </div>
            </div>

        <div className="board-list">
            <div className="category">
                <div className="selections flex items-center justify-between gap-2">
                    <select name="" id=""
                        // value={}
                        onChange={e => setSearch(e.target.value)}
                    >
                        <option value=""> Most Recently Active </option>
                        {filteredBoards
                            .filter(board => {
                                // If board.createdAt is a Firestore Timestamp, convert it to a JS Date
                                const boardDate = board.createdAt.toDate
                                    ? board.createdAt.toDate()
                                    : new Date(board.createdAt);
                                const threeDaysAgo = new Date();
                                threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
                                // Return true if the board was created within the last 3 days
                                return boardDate >= threeDaysAgo;
                            })
                            .map((board, index) => (
                                <option value={board.boardTitle} key={index}>
                                    {board.boardTitle}
                                </option>
                            ))
                        }
                    </select>
                    <select 
                        name="" id="" 
                        // onChange={e => setSearch(e.target.value)}
                    >
                        <option value=""> All Visibility Type </option>
                        <option value="Private"> Private </option>
                        <option value="Public"> Public </option>
                        <option value="Workspace"> Workspace </option>
                    </select>
                </div>
                <div className="search-boards">
                    <input 
                    type="text" 
                    placeholder='Search...' 
                    onChange={e => setSearch(e.target.value)} 
                    value={search} 
                    />
                </div>
            </div>

            <div className="list-items">
                {filteredBoards.length > 0 ? (
                    filteredBoards.map((board, index) => (
                    <div key={index} className="boarding-shift flex items-center justify-center relative">
                        <Link to={`/dashboard/${board?.id}`} className="board-item">
                        <img src={selectedImages[index]} alt="Thumbnail" className="bg-img-title" />
                        <p className='text-white'>{board.boardTitle}</p>
                        </Link>
                    </div>
                    ))
                ) : (
                    <p className='work-p'>No matching boards found.</p>
                )}
            </div>
            <hr/>
            <h5 className='work-title'>Workspace Connections</h5>
            <div className="list-items">
                {connectedBoards.length > 0 ? (
                    connectedBoards.map((board, index) => (
                    <div key={board.id || index} className="boarding-shift flex items-center justify-center relative">
                        <Link to={`/dashboard/${board?.id}`} className="board-item">
                        <img src={selectedImages[index]} alt="Thumbnail" className="bg-img-title" />
                            <p className='work-p'>{board.boardTitle}</p>
                        </Link>
                    </div>
                    ))
                ) : (
                    <p className='work-p'>No co-workspace boards found.</p>
                )}
                </div>
            </div>
        </div>
    );
};

export default Board;
