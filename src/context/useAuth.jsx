import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider, facebookProvider, db } from '../utilities/firebase';
import { 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  updateProfile 
} from 'firebase/auth';
import { saveUserData } from '../utilities/account';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {

    const [accBST, setAccBST] = useState(null); // holds current user's account document data
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Listen for auth state changes
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        if (currentUser) {
            const accountRef = doc(db, "account", currentUser.uid);
            const unsubscribe = onSnapshot(accountRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
                const accountData = docSnapshot.data();
                console.log("Account data:", accountData);
                setAccBST(accountData);
            } else {
                // Delay the check to allow the document creation to complete
                setTimeout(async () => {
                const refreshedSnapshot = await getDoc(accountRef);
                if (!refreshedSnapshot.exists()) {
                    alert("Account data not found. You are not authorized to access this system.");
                    signOut();
                }
                }, 2000); // Adjust the delay as needed
            }
            });
            return () => unsubscribe();
        }
    }, [currentUser]);


    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // Sign in the user with Firebase
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            setSuccessMessage("Successfully logged in!");
            
            localStorage.setItem("user", JSON.stringify(user));

            setEmail("");
            setPassword("");
            setUsername("");
            setErrorMessage("");
            setSuccessMessage("");
        } catch (error) {
            setErrorMessage(error.message);
            setSuccessMessage("");
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await updateProfile(user, { displayName: username });
            await saveUserData(user, username);

            setSuccessMessage("Account created successfully!");
            setEmail("");
            setPassword("");
            setUsername("");
            setErrorMessage("");
            setSuccessMessage("");
        } catch (error) {
            setErrorMessage(error.message);
            setSuccessMessage("");
        }
    };

    const handleGoogleLogin = async (e) => {
        e.preventDefault();
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // Validate email
            if (!user.email || !/\S+@\S+\.\S+/.test(user.email)) {
                setErrorMessage("Google sign-in failed: Invalid or missing email.");
                return;
            }

            const accountRef = doc(db, "account", user.uid);
            const accountSnapshot = await getDoc(accountRef);
            if (!accountSnapshot.exists()) {
                await saveUserData(user, username);
            }

            setEmail("");
            setPassword("");
            setUsername("");
            setErrorMessage("");
            setSuccessMessage("");
            localStorage.setItem("user", JSON.stringify(user));
        } catch (error) {
            setErrorMessage(error.message);
            setSuccessMessage("");
        }
    };

    const handleFacebookLogin = async (e) => {
        e.preventDefault();
        try {
            const result = await signInWithPopup(auth, facebookProvider);
            const user = result.user;

            // Validate email
            if (!user.email || !/\S+@\S+\.\S+/.test(user.email)) {
                setErrorMessage("Facebook sign-in failed: Invalid or missing email.");
                return;
            }

            const accountRef = doc(db, "account", user.uid);
            const accountSnapshot = await getDoc(accountRef);

            console.log(user);
            if (!accountSnapshot.exists()) {
                // Use displayName from the provider if username state is empty.
                await saveUserData(user, username || user.displayName);
            }

            setEmail("");
            setPassword("");
            setUsername("");
            setErrorMessage("");
            setSuccessMessage("");
            localStorage.setItem("user", JSON.stringify(user));
        } catch (error) {
            setErrorMessage(error.message);
            setSuccessMessage("");
        }
    };


    const handleResetPassword = async (emailForReset) => {
        try {
            await sendPasswordResetEmail(auth, emailForReset);
            setSuccessMessage("Password reset email sent. Please check your inbox.");
            setErrorMessage("");
        } catch (error) {
            setErrorMessage(error.message);
            setSuccessMessage("");
            throw error;
        }
    };

    const signOut = async () => {
        try {
            await auth.signOut();
        } catch (error) {
            console.error('Error signing out:', error.message);
        }
    };

    const value = {
        currentUser,
        handleSignup,
        handleLogin,
        signOut,
        handleGoogleLogin,
        handleFacebookLogin,
        handleResetPassword,
        username,
        email,
        password,
        setUsername,
        setEmail,
        setPassword,
        errorMessage,
        setErrorMessage,
        successMessage,
        setSuccessMessage,
        accBST
    };

    return (
        <AuthContext.Provider value={value}>
        {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
