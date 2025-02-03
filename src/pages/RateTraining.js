import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const RateTraining = () => {
    const [trainingSessions, setTrainingSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrainingSessions = async () => {
            try {
                const userId = auth.currentUser.uid; // Get the logged-in user's ID
                const trainingRef = doc(db, "trainings", userId); // Reference to Firestore collection
                const trainingDoc = await getDoc(trainingRef);

                if (trainingDoc.exists()) {
                    setTrainingSessions(trainingDoc.data().sessions || []);
                } else {
                    console.error("No training data found.");
                }
            } catch (error) {
                console.error("Error fetching training sessions:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTrainingSessions();
    }, []);

    if (loading) return <p>Loading...</p>;

    if (trainingSessions.length === 0) {
        return <p>No training sessions available.</p>;
    }

    return (
        <div>
            <h1>Your Training Sessions</h1>
            <ul>
                {trainingSessions.map((session, index) => (
                    <li key={index}>
                        <p><strong>Session:</strong> {session.name}</p>
                        <p><strong>Date:</strong> {session.date}</p>
                        <p><strong>Coach's Comments:</strong> {session.comments}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RateTraining;
