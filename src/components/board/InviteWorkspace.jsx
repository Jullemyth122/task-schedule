import React, { useState } from 'react';
import { fetchUserAcc, updateAccountActivity } from '../../utilities/account';
import { useAuth } from '../../context/useAuth';
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { db } from '../../utilities/firebase';

const inviteUser = async (userId, inviterEmail) => {
    const userDocRef = doc(db, "account", userId);
    await updateDoc(userDocRef, {
        invitesEmail: arrayUnion(inviterEmail)
    });
};

const InviteWorkspace = ({ onClose }) => {
    const [searchEmail, setSearchEmail] = useState('');
    const [foundUsers, setFoundUsers] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const { currentUser } = useAuth();

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFoundUsers([]);
        setErrorMessage('');
        setSuccessMessage('');
        try {
            const accounts = await fetchUserAcc();
            // Exclude the current user's account from the search results
            const matchingUsers = accounts.filter(acc =>
                acc.email.toLowerCase().includes(searchEmail.toLowerCase()) &&
                acc.email.toLowerCase() !== currentUser.email.toLowerCase()
            );
            if (matchingUsers.length > 0) {
                setFoundUsers(matchingUsers);
            } else {
                setErrorMessage('No account found with that email.');
            }
        } catch (error) {
            console.error(error);
            setErrorMessage('Error searching for account.');
        }
        setLoading(false);
    };
    

    const handleSendInvite = async (user) => {
        setErrorMessage('');
        setSuccessMessage('');

        //if the selected account is the current user, abort the inviting requests.
        if (user.email.toLowerCase() === currentUser.email.toLowerCase()) {
            setErrorMessage("Error: You cannot invite yourself.");
            return;
        }

        try {
            const userDocRef = doc(db, "account", user.id);
            const docSnap = await getDoc(userDocRef);
            if (docSnap.exists()) {
                const userData = docSnap.data();
                if (userData.invitesEmail && userData.invitesEmail.includes(currentUser.email)) {
                    setErrorMessage(`Error: Invitation already sent to ${user.email}. You cannot invite this user again.`);
                    await updateAccountActivity(
                        currentUser?.uid,
                        `User attempted to send duplicate invitation to ${user.email}`
                    );
                    return;
                }
            }
            await inviteUser(user.id, currentUser.email);
            await updateAccountActivity(
                currentUser?.uid,
                `User attempted to send invitation to ${user.email}`
            );
            setSuccessMessage(`Success: Invitation sent successfully to ${user.email}.`);
            setFoundUsers(foundUsers.filter(u => u.id !== user.id));
        } catch (error) {
            console.error(error);
            setErrorMessage('Error sending invitation.');
        }
    };

    return (
        <div className="invite-workspace-dropdown">
            <form onSubmit={handleSearch} className="invite-form">
                <input 
                    type="text"
                    placeholder="Enter email to search..."
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading}>Search</button>
            </form>
            {loading && <p>Searching...</p>}
            {errorMessage && <p className="message error">{errorMessage}</p>}
            {successMessage && <p className="message success">{successMessage}</p>}
            {foundUsers.length > 0 && (
                <div className="search-results">
                {foundUsers.map(user => (
                    <div key={user.id} className="search-result-item">
                        <p>
                            <strong>{user.username}</strong> ({user.email})
                        </p>
                        <button onClick={() => handleSendInvite(user)}>Send Invitation</button>
                    </div>
                ))}
                </div>
            )}
            <button className="close-btn" onClick={onClose}>Close</button>
        </div>
    );
};

export default InviteWorkspace;
