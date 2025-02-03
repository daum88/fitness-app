import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { collection, getDocs} from "firebase/firestore";

const GroupDashboard = () => {
    const [players, setPlayers] = useState([]);
    const [coachId, setCoachId] = useState(""); // Store logged-in coach's UID
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCoachId = async () => {
            try {
                const userId = auth.currentUser?.uid; // Get logged-in coach's UID
                if (!userId) {
                    console.error("No coach ID found. Are you logged in?");
                    setLoading(false);
                    return;
                }

                // Save the logged-in coach's UID as coachId
                setCoachId(userId);
            } catch (error) {
                console.error("Error fetching coach ID:", error.message);
                setLoading(false);
            }
        };

        const fetchPlayers = async () => {
            try {
                if (!coachId) return; // Wait until coachId is set

                const usersRef = collection(db, "users");
                const snapshot = await getDocs(usersRef);

                // Filter players based on coachId
                const filteredPlayers = snapshot.docs
                    .map((doc) => ({ id: doc.id, ...doc.data() }))
                    .filter((user) => user.role === "player" && user.coachId === coachId);

                setPlayers(filteredPlayers);
            } catch (error) {
                console.error("Error fetching players:", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCoachId().then(fetchPlayers); // Ensure fetchPlayers runs after coachId is set
    }, [coachId]);

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <h1>Group Dashboard</h1>
            {players.length === 0 ? (
                <p>No players assigned to you yet.</p>
            ) : (
                <ul>
                    {players.map((player) => (
                        <li key={player.id}>
                            {player.name} ({player.email})
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default GroupDashboard;
