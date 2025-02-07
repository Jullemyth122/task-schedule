import React from 'react'
import '../scss/home.scss';

const Home = () => {
    return (
        <div className='home-comp'>
            <div className="headline">
                <div className="line"></div>
                <div className="title-task">
                    <h1 className="ti-h1"> T 4 S K </h1>    
                    <h1 className='ti-h2'> T 4 S K </h1>    
                </div>
                <div className="line"></div>
            </div>             
            <div className="content-banner w-full flex items-end justify-center"> 
                <div className="outside-show-content w full flex items-end justify-center relative">
                    <div className="ellipse elip1"></div>
                    <div className="ellipse elip2"></div>
                    <div className="show-content flex items-center justify-evenly relative">
                        
                        <div className="ellipse elip1"></div>
                        <div className="ellipse elip2"></div>

                        <div className="content1">
                            <div className="text-title">
                                <h1 className='text-xl'> Task Name </h1>
                                <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.3996 12.9492L15.5796 11.6492C15.8796 10.5692 15.8996 9.39922 15.5796 8.22922L17.3996 6.94922L15.9496 4.44922L13.9196 5.36922C13.1296 4.56922 12.1296 3.94922 10.9596 3.65922L10.7596 1.44922H7.85965L7.65965 3.65922C6.48965 3.94922 5.48965 4.56922 4.69965 5.36922L2.66965 4.44922L1.21965 6.94922L3.03965 8.22922C2.71965 9.39922 2.73965 10.5692 3.03965 11.6492L1.21965 12.9492L2.66965 15.4492L4.69965 14.5192C5.48965 15.3092 6.48965 15.9092 7.65965 16.2192L7.85965 18.4492H10.7596L10.9596 16.2192C12.1296 15.9092 13.1296 15.3092 13.9196 14.5192L15.9496 15.4492L17.3996 12.9492ZM11.3096 0.449219C11.5796 0.449219 11.8096 0.649219 11.8096 0.909219L11.9896 2.94922C12.7496 3.22922 13.4296 3.63922 14.0396 4.12922L15.8896 3.25922C16.1196 3.13922 16.4096 3.21922 16.5496 3.44922L18.5496 6.94922C18.6896 7.15922 18.6096 7.44922 18.3896 7.59922L16.7196 8.76922C16.8496 9.56922 16.8396 10.3592 16.7196 11.1292L18.3896 12.2992C18.6096 12.4492 18.6896 12.7392 18.5496 12.9492L16.5496 16.4492C16.4096 16.6592 16.1196 16.7392 15.8896 16.6192L14.0396 15.7592C13.4296 16.2492 12.7496 16.6492 11.9896 16.9492L11.8096 18.9492C11.8096 19.2392 11.5796 19.4492 11.3096 19.4492H7.30965C7.17704 19.4492 7.04986 19.3965 6.9561 19.3028C6.86233 19.209 6.80965 19.0818 6.80965 18.9492L6.62965 16.9492C5.86965 16.6492 5.18965 16.2492 4.57965 15.7592L2.72965 16.6192C2.49965 16.7392 2.20965 16.6592 2.06965 16.4492L0.0696488 12.9492C-0.0703512 12.7392 0.00964886 12.4492 0.229649 12.2992L1.89965 11.1292C1.77965 10.3592 1.76965 9.56922 1.89965 8.76922L0.229649 7.59922C0.00964886 7.44922 -0.0703512 7.15922 0.0696488 6.94922L2.06965 3.44922C2.20965 3.21922 2.49965 3.13922 2.72965 3.25922L4.57965 4.12922C5.18965 3.63922 5.86965 3.22922 6.62965 2.94922L6.80965 0.909219C6.80965 0.649219 7.03965 0.449219 7.30965 0.449219H11.3096ZM9.30965 6.44922C10.2379 6.44922 11.1281 6.81797 11.7845 7.47435C12.4409 8.13072 12.8096 9.02096 12.8096 9.94922C12.8096 10.8775 12.4409 11.7677 11.7845 12.4241C11.1281 13.0805 10.2379 13.4492 9.30965 13.4492C8.38139 13.4492 7.49115 13.0805 6.83478 12.4241C6.1784 11.7677 5.80965 10.8775 5.80965 9.94922C5.80965 9.02096 6.1784 8.13072 6.83478 7.47435C7.49115 6.81797 8.38139 6.44922 9.30965 6.44922ZM9.30965 7.44922C8.64661 7.44922 8.01072 7.71261 7.54188 8.18145C7.07304 8.65029 6.80965 9.28618 6.80965 9.94922C6.80965 10.6123 7.07304 11.2481 7.54188 11.717C8.01072 12.1858 8.64661 12.4492 9.30965 12.4492C9.97269 12.4492 10.6086 12.1858 11.0774 11.717C11.5463 11.2481 11.8096 10.6123 11.8096 9.94922C11.8096 9.28618 11.5463 8.65029 11.0774 8.18145C10.6086 7.71261 9.97269 7.44922 9.30965 7.44922Z" fill="white"/>
                                </svg>
                            </div>
                            <div className="subtask-scroll">
                                <div className="subtask-section p-4">
                                    <div className="subtask-comp">
                                        <div className="subt-title flex items-center justify-between p-2">
                                            <h3> Subtask </h3>
                                            <svg width="15" height="18" viewBox="0 0 15 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9 16.5L8.646 16.854L9 17.207L9.354 16.854L9 16.5ZM1 0C0.867392 0 0.740215 0.0526785 0.646447 0.146447C0.552679 0.240215 0.5 0.367392 0.5 0.5C0.5 0.632608 0.552679 0.759785 0.646447 0.853553C0.740215 0.947321 0.867392 1 1 1V0ZM3.646 11.854L8.646 16.854L9.354 16.146L4.354 11.146L3.646 11.854ZM9.354 16.854L14.354 11.854L13.646 11.146L8.646 16.146L9.354 16.854ZM9.5 16.5V6.5H8.5V16.5H9.5ZM3 0H1V1H3V0ZM9.5 6.5C9.5 4.77609 8.81518 3.12279 7.59619 1.90381C6.37721 0.684819 4.72391 0 3 0V1C4.45869 1 5.85764 1.57946 6.88909 2.61091C7.92054 3.64236 8.5 5.04131 8.5 6.5H9.5Z" fill="#FFFA6F"/>
                                            </svg>                                     
                                        </div>
                                        <div className="subt-line"></div>
                                        <div className="descrip-task p-2">
                                            <h1> Description Task </h1>
                                            <br />
                                            <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.  </p>
                                        </div>
                                        <div className="subt-line"></div>
                                        <div className="subtask-notes p-2 flex items-center justify-evenly gap-3">
                                            <div className="date-timeline flex items-center justify-evenly gap-3">
                                                <h3> Oct 1, 2023 </h3>
                                                <h3> 1AM to 5PM </h3>
                                            </div>
                                            <div className="prio-level">
                                                <h5> High </h5>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="subtask-section p-4">
                                    <div className="subtask-comp">
                                        <div className="subt-title flex items-center justify-between p-2">
                                            <h3> Subtask </h3>
                                            <svg width="15" height="18" viewBox="0 0 15 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9 16.5L8.646 16.854L9 17.207L9.354 16.854L9 16.5ZM1 0C0.867392 0 0.740215 0.0526785 0.646447 0.146447C0.552679 0.240215 0.5 0.367392 0.5 0.5C0.5 0.632608 0.552679 0.759785 0.646447 0.853553C0.740215 0.947321 0.867392 1 1 1V0ZM3.646 11.854L8.646 16.854L9.354 16.146L4.354 11.146L3.646 11.854ZM9.354 16.854L14.354 11.854L13.646 11.146L8.646 16.146L9.354 16.854ZM9.5 16.5V6.5H8.5V16.5H9.5ZM3 0H1V1H3V0ZM9.5 6.5C9.5 4.77609 8.81518 3.12279 7.59619 1.90381C6.37721 0.684819 4.72391 0 3 0V1C4.45869 1 5.85764 1.57946 6.88909 2.61091C7.92054 3.64236 8.5 5.04131 8.5 6.5H9.5Z" fill="#FFFA6F"/>
                                            </svg>                                     
                                        </div>
                                        <div className="subt-line"></div>
                                        <div className="descrip-task p-2">
                                            <h1> Description Task </h1>
                                            <br />
                                            <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.  </p>
                                        </div>
                                        <div className="subt-line"></div>
                                        <div className="subtask-notes p-2 flex items-center justify-evenly gap-3">
                                            <div className="date-timeline flex items-center justify-evenly gap-3">
                                                <h3> Oct 1, 2023 </h3>
                                                <h3> 1AM to 5PM </h3>
                                            </div>
                                            <div className="prio-level">
                                                <h5> High </h5>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="content2 px-3 py-3">
                            <div className="task-sec h-12 w-full flex items-center justify-between">
                                <h4> Task Name </h4>
                                <div className="svg-icon">
                                    <svg width="15" height="18" viewBox="0 0 15 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 16.5L8.646 16.854L9 17.207L9.354 16.854L9 16.5ZM1 0C0.867392 0 0.740215 0.0526785 0.646447 0.146447C0.552679 0.240215 0.5 0.367392 0.5 0.5C0.5 0.632608 0.552679 0.759785 0.646447 0.853553C0.740215 0.947321 0.867392 1 1 1V0ZM3.646 11.854L8.646 16.854L9.354 16.146L4.354 11.146L3.646 11.854ZM9.354 16.854L14.354 11.854L13.646 11.146L8.646 16.146L9.354 16.854ZM9.5 16.5V6.5H8.5V16.5H9.5ZM3 0H1V1H3V0ZM9.5 6.5C9.5 4.77609 8.81518 3.12279 7.59619 1.90381C6.37721 0.684819 4.72391 0 3 0V1C4.45869 1 5.85764 1.57946 6.88909 2.61091C7.92054 3.64236 8.5 5.04131 8.5 6.5H9.5Z" fill="#FFFA6F"/>
                                    </svg>
                                </div>
                            </div>
                            <div className="task-sec h-12 w-full flex items-center justify-between">
                                <h4> Task Name </h4>
                                <div className="svg-icon">
                                    <svg width="15" height="18" viewBox="0 0 15 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 16.5L8.646 16.854L9 17.207L9.354 16.854L9 16.5ZM1 0C0.867392 0 0.740215 0.0526785 0.646447 0.146447C0.552679 0.240215 0.5 0.367392 0.5 0.5C0.5 0.632608 0.552679 0.759785 0.646447 0.853553C0.740215 0.947321 0.867392 1 1 1V0ZM3.646 11.854L8.646 16.854L9.354 16.146L4.354 11.146L3.646 11.854ZM9.354 16.854L14.354 11.854L13.646 11.146L8.646 16.146L9.354 16.854ZM9.5 16.5V6.5H8.5V16.5H9.5ZM3 0H1V1H3V0ZM9.5 6.5C9.5 4.77609 8.81518 3.12279 7.59619 1.90381C6.37721 0.684819 4.72391 0 3 0V1C4.45869 1 5.85764 1.57946 6.88909 2.61091C7.92054 3.64236 8.5 5.04131 8.5 6.5H9.5Z" fill="#FFFA6F"/>
                                    </svg>
                                </div>
                            </div>
                            <div className="task-sec h-12 w-full flex items-center justify-between">
                                <h4> Task Name </h4>
                                <div className="svg-icon">
                                    <svg width="15" height="18" viewBox="0 0 15 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 16.5L8.646 16.854L9 17.207L9.354 16.854L9 16.5ZM1 0C0.867392 0 0.740215 0.0526785 0.646447 0.146447C0.552679 0.240215 0.5 0.367392 0.5 0.5C0.5 0.632608 0.552679 0.759785 0.646447 0.853553C0.740215 0.947321 0.867392 1 1 1V0ZM3.646 11.854L8.646 16.854L9.354 16.146L4.354 11.146L3.646 11.854ZM9.354 16.854L14.354 11.854L13.646 11.146L8.646 16.146L9.354 16.854ZM9.5 16.5V6.5H8.5V16.5H9.5ZM3 0H1V1H3V0ZM9.5 6.5C9.5 4.77609 8.81518 3.12279 7.59619 1.90381C6.37721 0.684819 4.72391 0 3 0V1C4.45869 1 5.85764 1.57946 6.88909 2.61091C7.92054 3.64236 8.5 5.04131 8.5 6.5H9.5Z" fill="#FFFA6F"/>
                                    </svg>
                                </div>
                            </div>
                            <div className="task-sec h-12 w-full flex items-center justify-between">
                                <h4> Task Name </h4>
                                <div className="svg-icon">
                                    <svg width="15" height="18" viewBox="0 0 15 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 16.5L8.646 16.854L9 17.207L9.354 16.854L9 16.5ZM1 0C0.867392 0 0.740215 0.0526785 0.646447 0.146447C0.552679 0.240215 0.5 0.367392 0.5 0.5C0.5 0.632608 0.552679 0.759785 0.646447 0.853553C0.740215 0.947321 0.867392 1 1 1V0ZM3.646 11.854L8.646 16.854L9.354 16.146L4.354 11.146L3.646 11.854ZM9.354 16.854L14.354 11.854L13.646 11.146L8.646 16.146L9.354 16.854ZM9.5 16.5V6.5H8.5V16.5H9.5ZM3 0H1V1H3V0ZM9.5 6.5C9.5 4.77609 8.81518 3.12279 7.59619 1.90381C6.37721 0.684819 4.72391 0 3 0V1C4.45869 1 5.85764 1.57946 6.88909 2.61091C7.92054 3.64236 8.5 5.04131 8.5 6.5H9.5Z" fill="#FFFA6F"/>
                                    </svg>
                                </div>
                            </div>
                        </div>  

                    </div>
                </div>
            </div>     
        </div>
    )
}

export default Home