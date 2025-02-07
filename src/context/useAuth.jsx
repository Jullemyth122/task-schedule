// useAuth.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider, facebookProvider } from '../utilities/firebase'; // Import providers
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'; // Import the signInWithPopup method
import { saveUserData } from '../utilities/account';  // Import saveUserData function
import { updateProfile } from "firebase/auth"; // Import updateProfile from Firebase

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {


    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");  // New state for success messages

    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user);
            console.log(user)
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    // const signUp = async (email, password) => {
    //     try {
    //         await auth.createUserWithEmailAndPassword(email, password);
    //     } catch (error) {
    //         console.error('Error signing up: ', error.message);
    //     }
    // };

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            // Create user with Firebase
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user; // Get the user object from the signup response
    
            // Update the user's displayName with the username entered by the user
            await updateProfile(user, {
                displayName: username // This sets the displayName to the username
            });
    
            // Now that we have the user, save to Firestore
            await saveUserData(user, username); // Pass the correct user object and username
    
            setSuccessMessage("Account created successfully!");  // Success message
            console.log("User signed up:", username, email);
        } catch (error) {
            setErrorMessage(error.message);  // Set error message if any
            setSuccessMessage("");  // Clear success message on error
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // Sign user in with Firebase
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user; // Get the user object from the login response
    
            // Successfully logged in
            setSuccessMessage("Successfully logged in!");  // Success message
            console.log("User signed in:", email);
    
            // Save user data to localStorage (ensure to save the correct user object)
            localStorage.setItem("user", JSON.stringify(user));
    
            // Redirect to the dashboard page
            window.location.href = "/dashboard";
        } catch (error) {
            setErrorMessage(error.message);  // Set error message if any
            setSuccessMessage("");  // Clear success message on error
        }
    };

    const handleGoogleLogin = async (e) => {
        e.preventDefault();  // Prevent any accidental form submission
    
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
    
            // If the user has a valid email, proceed
            if (!user.email || !/\S+@\S+\.\S+/.test(user.email)) {
                setErrorMessage("Google sign-in failed: Invalid or missing email.");
                return; // Don't proceed further if email is invalid
            }
    
            // Proceed with saving user data or any other actions
            await saveUserData(user, username); // You can pass `user.displayName` or any other fields
    
            setSuccessMessage("Google sign-in successful!");
            setErrorMessage("");
            localStorage.setItem("user", JSON.stringify(user));

            window.location.href = "/dashboard";

            console.log("Google sign-in successful:", user);
        } catch (error) {
            // Handle any errors that occur during the sign-in process
            setErrorMessage(error.message);
            setSuccessMessage("");  // Clear success message if error occurs
        }
    };

    const handleFacebookLogin = async (e) => {
        e.preventDefault();  // Prevent any accidental form submission
    
        try {
            const result = await signInWithPopup(auth, facebookProvider);
            const user = result.user;
    
            // Ensure the user has a valid email
            if (!user.email || !/\S+@\S+\.\S+/.test(user.email)) {
                setErrorMessage("Facebook sign-in failed: Invalid or missing email.");
                return; // Don't proceed further if email is invalid
            }
    
            // Proceed with saving user data or any other actions
            await saveUserData(user, username); // You can pass `user.displayName` or any other fields
    
            setSuccessMessage("Facebook sign-in successful!");
            setErrorMessage("");
            localStorage.setItem("user", JSON.stringify(user));
            window.location.href = "/dashboard";

            console.log("Facebook sign-in successful:", user);
        } catch (error) {
            setErrorMessage(error.message);  // Handle error during sign-in
            setSuccessMessage("");  // Clear success message if error occurs
        }
    };

    const signOut = async () => {
        try {
            await auth.signOut();
        } catch (error) {
            console.error('Error signing out: ', error.message);
        }
    };


    // const signInWithFacebook = async () => {
    //     try {
    //         await auth.signInWithPopup(facebookAuthProvider);
    //     } catch (error) {
    //         console.error('Error signing in with Facebook: ', error.message);
    //     }
    // };

    const value = {
        currentUser,
        // signUp,
        handleSignup,
        handleLogin,
        signOut,
        handleGoogleLogin,
        handleFacebookLogin,

        username,email,password,
        setUsername,setEmail,setPassword,
        errorMessage,setErrorMessage,
        successMessage,setSuccessMessage
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
