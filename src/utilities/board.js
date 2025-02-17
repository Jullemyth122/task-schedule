import { db } from './firebase'; // Ensure that db is imported
import { collection, addDoc, getDocs } from "firebase/firestore";

// Use `addDoc` to automatically generate a document ID
const saveUserBoardData = async (user, board) => {
    try {
        // Add a new document to the 'boards' collection
        await addDoc(collection(db, "boards"), {
            username: user.displayName,
            email: user.email,
            boardTitle: board.boardTitle,
            boardVisibility: board.boardVisibility,
            boardTemplate: board.boardTemplate,
            taskList: [
                { title: "To Do List", tasks: [], taggings: [], links: [] },
                { title: "Working", tasks: [], taggings: [], links: [] },
                { title: "Done", tasks: [], taggings: [], links: [] }
            ],
            createdAt: new Date(),
        });
        // await addDoc(collection(db, "boards"), {
        //     username: user.displayName,
        //     email: user.email,
        //     boardTitle: board.boardTitle,
        //     boardVisibility: board.boardVisibility,
        //     boardTemplate: board.boardTemplate,
        //     taskList: [
        //         { "To Do List": [], taggings:[], links:[] },
        //         { "Working": [], taggings:[], links:[] },
        //         { "Done": [], taggings:[], links:[] }
        //     ],
        //     createdAt: new Date(),
        // });
        console.log("User data saved to Firestore");
    } catch (error) {
        console.error("Error saving user data: ", error);
    }
};

// Export the saveUserData function
export { saveUserBoardData };

// Function to fetch all boards from Firestore (🟢 Now includes document ID)
const fetchUserBoards = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "boards"));
        const boards = querySnapshot.docs.map(doc => ({
            id: doc.id, // 🟢 Include Firestore document ID
            ...doc.data()
        }));
        // console.log(boards)
        return boards;
    } catch (error) {
        console.error("Error fetching boards: ", error);
        return [];
    }
};

export { fetchUserBoards };
