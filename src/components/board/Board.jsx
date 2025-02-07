import React from 'react'
import { useDashboardFunc } from '../../context/useDashboardFunc'
import { Link } from 'react-router-dom'

const Board = ({ tempboard, setTempBoard }) => {

    
    const { userBoards } = useDashboardFunc()

    return (
        <div className='board-compo'>
        
            <div className="headline">
                <h1> Board
                </h1>
            </div>

            <div className="board-list">
                <div className="category">
                    <div className="selections flex items-center justify-between gap-2">
                        <select name="" id="">
                            <option value=""> Most Recently Active </option>
                            {userBoards.map((board,index) => (
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
                        <input type="text" placeholder='Search...' />
                    </div>
                </div>

                <div className="list-items">
                    {userBoards.map((board, index) => (
                        <div key={index} className='boarding-shift'>
                            <Link 
                            to={`/dashboard/${board?.boardTitle}`}            
                            className="board-item"
                            // onClick={setTempBoard(false)}
                            >
                                <p> {board.boardTitle} </p>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    )
}

export default Board