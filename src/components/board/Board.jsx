import React from 'react'
import { useDashboardFunc } from '../../context/useDashboardFunc'
import { Link } from 'react-router-dom'
import { useSearch } from '../../context/useSearch'

const Board = ({ tempboard, setTempBoard }) => {

    
    const images = [
        '/img/s1.jpg',
        '/img/s2.jpg',
        '/img/s3.jpg',
        '/img/s4.jpg',
        '/img/s5.jpg'
    ];
    const { search, setSearch, filteredBoards } = useSearch();


    return (
        <div className='board-compo'>
        
            <div className="headline flex items-center justify-evenly">
                <div className="prt-1 flex items-center justify-between gap-3">
                    <div className="head-t">
                        <h1 className='txt1'> 
                            T 4 S K 
                        </h1>
                        <h1 className="txt2">
                            T 4 S K
                        </h1>
                    </div>
                    <h1> Board Workspace </h1>
                </div>
                <div className="prt-1">
                    {/* <h1> Hatdog</h1> */}
                    <button className='samp'> 
                        + Invite Workspaces
                    </button>
                </div>
            </div>

            <div className="board-list">
                <div className="category">
                    <div className="selections flex items-center justify-between gap-2">
                        <select name="" id="">
                            <option value=""> Most Recently Active </option>
                            {filteredBoards.map((board,index) => (
                                <option value={board.boardTitle} key={index}>
                                    {board.boardTitle}
                                </option>
                            ))}
                        </select>
                        <select name="" id="">
                            <option value=""> Category Options </option>
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
                        filteredBoards.map((board, index) => { 
                            const selectedImage = images[Math.floor(Math.random() * images.length)];
                                
                            return (
                            <div key={index} className="boarding-shift flex items-center justify-center relative">
                                <Link
                                    to={`/dashboard/${board?.id}`}
                                    className="board-item"
                                >
                                    <img src={selectedImage} alt="Thumbnail" className="bg-img-title"/>
                                    {/* <img src="./img/s1.jpg" alt="" className="bg-img-title" /> */}
                                    <p className='text-white'>{board.boardTitle}</p>
                                </Link>
                            </div>
                        )})
                    ) : (
                        <p>No matching boards found.</p>
                    )}
                </div>
            </div>

        </div>
    )
}

export default Board