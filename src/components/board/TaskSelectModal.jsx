import React from 'react';

const TaskSelectModal = ({ taskCategory, onClose, selectedImage }) => {
    return (
        <div className="modal-overlay">
            <div className="task-modal">
                <div className="task-modal-img">
                    <img src={selectedImage} alt="Task Cover" />
                    <button className="close-button" onClick={onClose}>
                        X
                    </button>
                </div>

                <div className="task-modal-content">
                    <div className="left-column">
                        <div className="task-modal-header">
                            <h2>{taskCategory.title}</h2>
                            <span className="in-list">in list <span> T 4 S K </span></span>
                        </div>
                        <div className="notifications">
                            <span>Notifications:</span>
                            <button>Watching</button>
                        </div>
                        <div className="section description">
                            <h3>Description</h3>
                            <ul>
                                <li> Description 1 </li>
                                <li> Description 2 </li>
                                <li> Description 3 </li>
                            </ul>
                            <button>Edit</button>
                        </div>

                        <div className="section activity">
                            <h3>Activity</h3>
                            <button>Hide details</button>
                            <input type="text" placeholder="Write a comment..." />
                            <div className="activity-log">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14 8C14 9.06087 13.5786 10.0783 12.8284 10.8284C12.0783 11.5786 11.0609 12 10 12C8.93913 12 7.92172 11.5786 7.17157 10.8284C6.42143 10.0783 6 9.06087 6 8C6 6.93913 6.42143 5.92172 7.17157 5.17157C7.92172 4.42143 8.93913 4 10 4C11.0609 4 12.0783 4.42143 12.8284 5.17157C13.5786 5.92172 14 6.93913 14 8Z" fill="#fff"/>
                                    <path fillRule="evenodd" clipRule="evenodd" d="M9.592 19.992C4.2585 19.778 0 15.386 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20H9.863C9.77233 20 9.682 19.9973 9.592 19.992ZM3.583 16.31C3.50823 16.0953 3.48278 15.8665 3.50854 15.6406C3.5343 15.4147 3.6106 15.1975 3.73179 15.0051C3.85298 14.8128 4.01593 14.6502 4.20856 14.5294C4.40119 14.4086 4.61855 14.3328 4.8445 14.3075C8.7425 13.876 11.2815 13.915 15.1605 14.3165C15.3868 14.3401 15.6046 14.4149 15.7976 14.5354C15.9905 14.6559 16.1534 14.8189 16.2739 15.0119C16.3943 15.2048 16.4691 15.4227 16.4927 15.649C16.5162 15.8753 16.4877 16.1039 16.4095 16.3175C18.0721 14.6355 19.0031 12.365 19 10C19 5.0295 14.9705 1 10 1C5.0295 1 1 5.0295 1 10C1 12.458 1.9855 14.686 3.583 16.31Z" fill="#fff"/>
                                </svg>
                                <span>"Name" added this task to do "Date"</span>
                            </div>
                        </div>
                    </div>

                    <div className="right-column">
                        <ul className="action-list">
                            <li><button>Join</button></li>
                            <li><button>Members</button></li>
                            <li><button>Labels</button></li>
                            <li><button>Checklist</button></li>
                            <li><button>Dates</button></li>
                            <li><button>Attachment</button></li>
                            <li><button>Custom Fields</button></li>
                        </ul>

                        {/* Power-Ups */}
                        <h3>Power-Ups</h3>
                        <ul className="action-list">
                            <li><button>+ Add Power-Ups</button></li>
                        </ul>
                        {/* Actions */}
                        <h3>Actions</h3>
                        <ul className="action-list">
                            <li><button>Move</button></li>
                            <li><button>Copy</button></li>
                            <li><button>Mirror</button></li>
                            <li><button>Make template</button></li>
                            <li><button>Archive</button></li>
                            <li><button>Delete</button></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskSelectModal;
