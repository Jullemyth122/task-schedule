import { arrayUnion, collection, doc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { db } from './firebase'; // Ensure that db is imported

// Function to save user data to Firestore
const saveUserData = async (user, username) => {
    try {
        // Create a document for the user with their UID in Firestore
        await setDoc(doc(db, "account", user.uid), {
            username: user.displayName || username,  // use user's displayName if available, or fallback to local username
            email: user.email,
            uid: user.uid,
            islinks:true,
            istagging:true,
            cardLimits:6,
            taskLimits:6,
            notifications:[],
            updates:"", 
            requests:[],
            isPremiumUser:false,
            ratePremium:0,
            PremiumPrice:0,
            invitesEmail:[],
            role:'user',
            updatedAt: new Date(),
            createdAt: new Date(), // Optional: Add a timestamp
        });
    } catch (error) {
        console.error("Error saving user data: ", error);
    }
};

const fetchUserAcc = async() => {
    try {
        const querySnapshot = await getDocs(collection(db, 'account'));
        const accounts = querySnapshot.docs.map(doc => ({
            ...doc.data(),
            id:doc.id
        }))
        return accounts;
    } catch (error) {
        console.error("Error fetching accounts: ", error);
        return [];
    }
}

const updateAccountActivity = async (userId, message) => {
    try {
        const accountRef = doc(db, "account", userId);
        await updateDoc(accountRef, {
            updates: message,
            updatedAt: new Date(),
        });
    } catch (error) {
        console.error("Error updating account activity:", error);
    }
};
  

// New function to update the requests field by appending the feedback
const updateAccountRequests = async (userId, message) => {
    try {
        const accountRef = doc(db, "account", userId);
        await updateDoc(accountRef, {
            requests: arrayUnion(message),
        });
    } catch (error) {
        console.error("Error updating account requests:", error);
    }
};


export { fetchUserAcc, saveUserData, updateAccountActivity, updateAccountRequests }