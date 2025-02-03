import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";

const CoachDashboard = () => {
    const [players, setPlayers] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [trainings, setTrainings] = useState([]);
    const [ratings, setRatings] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [coachId, setCoachId] = useState(null);

    useEffect(() => {
        const fetchCoachId = async () => {
            try {
                setLoading(true);
                const user = auth.currentUser;
                if (user) {
                    const coachRef = doc(db, "users", user.uid);
                    const coachDoc = await getDoc(coachRef);
                    if (coachDoc.exists()) {
                        setCoachId(coachDoc.data().coachId);
                    } else {
                        setError("Coach data not found.");
                    }
                }
            } catch (err) {
                setError("Error fetching coach data.");
            } finally {
                setLoading(false);
            }
        };

        fetchCoachId();
    }, []);

    useEffect(() => {
        const fetchPlayers = async () => {
            if (!coachId) return;
            try {
                setLoading(true);
                const q = query(collection(db, "groups"), where("coachId", "==", coachId));
                const playerSnapshot = await getDocs(q);
                if (!playerSnapshot.empty) {
                    const playerList = playerSnapshot.docs.map((doc) => doc.data().playerEmail);
                    setPlayers(playerList);
                } else {
                    setPlayers([]);
                }
            } catch (err) {
                setError("Error fetching players.");
            } finally {
                setLoading(false);
            }
        };

        if (coachId) {
            fetchPlayers();
        }
    }, [coachId]);

    useEffect(() => {
        const fetchFavorites = async () => {
            if (!coachId) return;
            try {
                const favRef = doc(db, "favorites", coachId);
                const favDoc = await getDoc(favRef);
                if (favDoc.exists()) {
                    setFavorites(favDoc.data().exercises);
                } else {
                    setFavorites([]);
                }
            } catch (err) {
                setError("Error fetching favorites.");
            }
        };

        if (coachId) {
            fetchFavorites();
        }
    }, [coachId]);

    useEffect(() => {
        const fetchTrainings = async () => {
            if (!coachId) return;
            try {
                const q = query(collection(db, "trainings"), where("coachId", "==", coachId));
                const trainingSnapshot = await getDocs(q);
                if (!trainingSnapshot.empty) {
                    const trainingList = trainingSnapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    setTrainings(trainingList);
                } else {
                    setTrainings([]);
                }
            } catch (err) {
                setError("Error fetching trainings.");
            }
        };

        if (coachId) {
            fetchTrainings();
        }
    }, [coachId]);

    useEffect(() => {
        const fetchRatings = async () => {
            if (!coachId) return;
            try {
                const q = query(collection(db, "ratings"), where("coachId", "==", coachId));
                const ratingsSnapshot = await getDocs(q);
                let ratingsData = {};
                ratingsSnapshot.forEach((doc) => {
                    const data = doc.data();
                    if (!ratingsData[data.trainingId]) {
                        ratingsData[data.trainingId] = [];
                    }
                    ratingsData[data.trainingId].push({ player: data.playerEmail, rating: data.rating });
                });
                setRatings(ratingsData);
            } catch (err) {
                setError("Error fetching training ratings.");
            }
        };

        if (coachId) {
            fetchRatings();
        }
    }, [coachId]);

    return (
        <div style={{ padding: "20px" }}>
            <h1>Coach Dashboard</h1>

            <h2>Favorite Exercises</h2>
            {favorites.length === 0 ? (
                <p>No favorite exercises yet.</p>
            ) : (
                <div className="exercise-grid">
                    {favorites.map((exercise, index) => (
                        <div key={index} className="exercise-card">
                            <h3>{exercise.name}</h3>
                            <p>Difficulty: {exercise.difficulty}</p>
                        </div>
                    ))}
                </div>
            )}

            <h2>Trainings</h2>
            {trainings.length === 0 ? (
                <p>No trainings found.</p>
            ) : (
                <div className="training-list">
                    {trainings.map((training) => (
                        <div key={training.id} className="training-card" style={{
                            padding: "15px",
                            border: "1px solid #ddd",
                            borderRadius: "10px",
                            marginBottom: "15px",
                            background: "#f9f9f9"
                        }}>
                            <h3>Training Session</h3>
                            <p><strong>Created:</strong> {new Date(training.createdAt.seconds * 1000).toLocaleDateString()}</p>
                            <p><strong>Exercises:</strong></p>
                            <ul>
                                {training.exercises.map((exercise, index) => (
                                    <li key={index}>{exercise.name} - Difficulty: {exercise.difficulty}</li>
                                ))}
                            </ul>
                            <h4>Training Ratings</h4>
                            {ratings[training.id] ? (
                                <ul>
                                    {ratings[training.id].map((rating, index) => (
                                        <li key={index}>{rating.player}: {rating.rating} ⭐</li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No ratings yet.</p>
                            )}
                            <h4>Players Who Haven't Rated</h4>
                            <ul>
                                {players.filter(player => !ratings[training.id]?.some(r => r.player === player)).map((player, index) => (
                                    <li key={index}>{player}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CoachDashboard;
