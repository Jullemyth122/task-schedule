import { collection, doc, getDocs, setDoc } from "firebase/firestore";
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
            cardLimits:3,
            taskLimits:3,
            notifications:[],
            createdAt: new Date(), // Optional: Add a timestamp
        });
        console.log("User data saved to Firestore");
    } catch (error) {
        console.error("Error saving user data: ", error);
    }
};

// Export the saveUserData function
export { saveUserData };

const fetchUserAcc = async() => {
    try {
        const querySnapshot = await getDocs(collection(db, 'account'));
        const accounts = querySnapshot.docs.map(doc => ({
            ...doc.data(),
            id:doc.id
        }))
        console.log(accounts)
        return accounts;
    } catch (error) {
        console.error("Error fetching accounts: ", error);
        return [];
    }
}

export { fetchUserAcc }