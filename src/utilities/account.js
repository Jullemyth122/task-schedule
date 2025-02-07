import { doc, setDoc } from "firebase/firestore";
import { db } from './firebase'; // Ensure that db is imported

// Function to save user data to Firestore
const saveUserData = async (user, username) => {
    try {
        // Create a document for the user with their UID in Firestore
        await setDoc(doc(db, "account", user.uid), {
            username: user.displayName || username,  // use user's displayName if available, or fallback to local username
            email: user.email,
            uid: user.uid,
            createdAt: new Date(), // Optional: Add a timestamp
        });
        console.log("User data saved to Firestore");
    } catch (error) {
        console.error("Error saving user data: ", error);
    }
};

// Export the saveUserData function
export { saveUserData };
