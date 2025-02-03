import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const RateTrainingList = () => {
    const [trainings, setTrainings] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTrainings = async () => {
            setLoading(true);
            try {
                const querySnapshot = await getDocs(collection(db, "trainings"));
                const fetchedTrainings = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setTrainings(fetchedTrainings);
            } catch (error) {
                console.error("Error fetching trainings:", error);
                alert("Failed to fetch trainings. Please try again.");
            }
            setLoading(false);
        };

        fetchTrainings();
    }, []);

    return (
        <div style={{ padding: "20px" }}>
            <h1>Rate a Training</h1>
            {loading ? (
                <p>Loading trainings...</p>
            ) : trainings.length > 0 ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
                    {trainings.map((training) => (
                        <div
                            key={training.id}
                            style={{
                                border: "1px solid #ccc",
                                borderRadius: "5px",
                                padding: "10px",
                                cursor: "pointer",
                                textAlign: "center",
                            }}
                            onClick={() => navigate(`/rate-training/${training.id}`)} // Navigate to specific training
                        >
                            <h3>{training.name}</h3>
                            <p>{training.exercises.length} exercises</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No trainings available to rate.</p>
            )}
        </div>
    );
};

export default RateTrainingList;
