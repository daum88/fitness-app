import { doc, setDoc, getDoc, arrayUnion } from "firebase/firestore";
import { auth, db } from "../firebase";

// Add an exercise to the user's favorites
export const addToFavorites = async (exercise) => {
    const user = auth.currentUser;
    if (!user) {
        alert("You need to log in to save favorites.");
        return;
    }

    const userDocRef = doc(db, "favorites", user.uid);
    try {
        await setDoc(
            userDocRef,
            { exercises: arrayUnion(exercise) },
            { merge: true }
        );
        alert("Added to favorites!");
    } catch (error) {
        console.error("Error saving favorite:", error);
    }
};

// Fetch all favorite exercises for the logged-in user
export const fetchFavorites = async () => {
    const user = auth.currentUser;
    if (!user) return [];

    const userDocRef = doc(db, "favorites", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
        return userDoc.data().exercises || [];
    } else {
        return [];
    }
};
