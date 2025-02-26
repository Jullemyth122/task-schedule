// board.js
import { db } from './firebase'; // Ensure that db is imported
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

const saveUserBoardData = async (user, board) => {
    try {
        await addDoc(collection(db, "boards"), {
            username: user.displayName,
            email: user.email,
            boardTitle: board.boardTitle,
            boardVisibility: board.boardVisibility,
            boardTemplate: board.boardTemplate,
            boardInviteEmail: board.boardInviteEmail || [], // Use passed emails here
            taskList: [
                { title: "To Do List", tasks: [], taggings: [], links: [], color:"" },
                { title: "Working", tasks: [], taggings: [], links: [], color:"" },
                { title: "Done", tasks: [], taggings: [], links: [], color:"" }
            ],
            createdAt: new Date(),
        });
        console.log("User board saved to Firestore");
    } catch (error) {
        console.error("Error saving board data: ", error);
    }
};

const fetchUserBoards = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "boards"));
        const boards = querySnapshot.docs.map(doc => ({
            id: doc.id, // Include Firestore document ID
            ...doc.data()
        }));
        return boards;
    } catch (error) {
        console.error("Error fetching boards: ", error);
        return [];
    }
};

const fetchConnectedBoards = async (inviterEmails) => {
    try {
        const q = query(
            collection(db, "boards"),
            where("email", "in", inviterEmails)
        );
        const querySnapshot = await getDocs(q);
        const boards = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return boards;
    } catch (error) {
        console.error("Error fetching connected boards: ", error);
        return [];
    }
};

export { fetchUserBoards, saveUserBoardData, fetchConnectedBoards };
