import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, collection, query, where, orderBy, limit, getDocs, addDoc } from "firebase/firestore";

const PlayerDashboard = () => {
    const [playerData, setPlayerData] = useState(null);
    const [workouts, setWorkouts] = useState([]);
    const [selectedWorkout, setSelectedWorkout] = useState(null);
    const [rating, setRating] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlayerData = async () => {
            try {
                const userId = auth.currentUser?.uid;

                if (!userId) {
                    console.error("No user ID found. Are you logged in?");
                    setLoading(false);
                    return;
                }

                // Fetch player details
                const playerRef = doc(db, "users", userId);
                const playerDoc = await getDoc(playerRef);

                if (playerDoc.exists()) {
                    const playerDetails = playerDoc.data();
                    console.log("Player Details:", playerDetails); // Debugging log

                    if (!playerDetails.coachId) {
                        console.error("Player has no coachId assigned.");
                        setLoading(false);
                        return;
                    }

                    setPlayerData(playerDetails);

                    // Fetch the last 5 workouts for the player
                    const workoutsQuery = query(
                        collection(db, "trainings"),
                        where("coachId", "==", playerDetails.coachId), // Only fetch workouts assigned by the player's coach
                        orderBy("createdAt", "desc"), // Order by creation date
                        limit(5) // Limit to the last 5 workouts
                    );

                    const workoutsSnapshot = await getDocs(workoutsQuery);
                    const workoutList = workoutsSnapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    console.log("Fetched Workouts:", workoutList); // Debugging log
                    setWorkouts(workoutList);
                } else {
                    console.error("Player data not found in Firestore.");
                }
            } catch (error) {
                console.error("Error fetching player data or workouts:", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPlayerData();
    }, []);


    const handleRateWorkout = async () => {
        try {
            if (!selectedWorkout || rating === 0) {
                alert("Please select a workout and provide a rating.");
                return;
            }

            // Save the rating in Firestore
            const ratingsRef = collection(db, "ratings");
            await addDoc(ratingsRef, {
                workoutId: selectedWorkout.id,
                playerId: auth.currentUser.uid,
                rating,
                createdAt: new Date(),
            });

            alert("Rating submitted successfully!");
            setSelectedWorkout(null);
            setRating(0);
        } catch (error) {
            console.error("Error submitting rating:", error.message);
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h1>Welcome, {playerData?.name}</h1>
            <p><strong>Email:</strong> {playerData?.email}</p>

            <div style={{ marginTop: "30px" }}>
                <h2>Last 5 Workouts</h2>
                {workouts.length === 0 ? (
                    <p>No workouts available.</p>
                ) : (
                    <ul style={{ listStyle: "none", padding: 0 }}>
                        {workouts.map((workout) => (
                            <li
                                key={workout.id}
                                style={{
                                    padding: "10px",
                                    border: "1px solid #ddd",
                                    borderRadius: "10px",
                                    marginBottom: "10px",
                                    cursor: "pointer",
                                    backgroundColor: selectedWorkout?.id === workout.id ? "#f0f8ff" : "#fff",
                                }}
                                onClick={() => setSelectedWorkout(workout)}
                            >
                                <p><strong>Workout Name:</strong> {workout.name || "Unnamed Workout"}</p>
                                <p><strong>Created At:</strong> {new Date(workout.createdAt.seconds * 1000).toLocaleString()}</p>
                                <p><strong>Exercises:</strong> {workout.exercises.length}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {selectedWorkout && (
                <div style={{ marginTop: "20px" }}>
                    <h3>Rate Workout: {selectedWorkout.name || "Unnamed Workout"}</h3>
                    <div>
                        <label>
                            Rating (1-5):{" "}
                            <input
                                type="number"
                                min="1"
                                max="5"
                                value={rating}
                                onChange={(e) => setRating(parseInt(e.target.value, 10))}
                                style={{ width: "50px", textAlign: "center" }}
                            />
                        </label>
                    </div>
                    <button
                        onClick={handleRateWorkout}
                        style={{
                            marginTop: "10px",
                            backgroundColor: "#28a745",
                            color: "#fff",
                            border: "none",
                            padding: "10px 15px",
                            cursor: "pointer",
                            borderRadius: "5px",
                        }}
                    >
                        Submit Rating
                    </button>
                </div>
            )}
        </div>
    );
};

export default PlayerDashboard;