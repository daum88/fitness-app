import React, { useState } from "react";
import { auth, db } from "../firebase"; // Firebase authentication and Firestore
import { collection, addDoc } from "firebase/firestore"; // Firestore functions
import { exercises } from "../data/mockData"; // Import exercises from mockData.js

const CreateTraining = () => {
    const [trainingName, setTrainingName] = useState(""); // Training name state
    const [selectedExercises, setSelectedExercises] = useState([]); // Selected exercises state
    const [loading, setLoading] = useState(false); // Loading state

    // Handle exercise selection
    const handleSelectExercise = (exercise) => {
        if (selectedExercises.some((e) => e.id === exercise.id)) {
            // Remove exercise if already selected
            setSelectedExercises(selectedExercises.filter((e) => e.id !== exercise.id));
        } else {
            // Add exercise if not already selected
            setSelectedExercises([...selectedExercises, exercise]);
        }
    };

    // Save training to Firestore
    const handleSaveTraining = async () => {
        if (!trainingName || selectedExercises.length === 0) {
            alert("Please provide a training name and select at least one exercise.");
            return;
        }

        const user = auth.currentUser; // Get the logged-in user
        if (!user) {
            alert("You must be logged in to create a training.");
            return;
        }

        try {
            setLoading(true);
            // Save the training document in Firestore
            await addDoc(collection(db, "trainings"), {
                name: trainingName,
                exercises: selectedExercises,
                coachId: user.uid, // Include the logged-in user's UID
                createdAt: new Date(), // Timestamp for training creation
            });
            alert("Training saved successfully!");
            setTrainingName("");
            setSelectedExercises([]);
        } catch (error) {
            console.error("Error saving training:", error);
            alert("Failed to save training. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Create Training</h1>

            {/* Input for training name */}
            <input
                type="text"
                placeholder="Enter training name"
                value={trainingName}
                onChange={(e) => setTrainingName(e.target.value)}
                style={{
                    padding: "10px",
                    marginBottom: "20px",
                    width: "100%",
                    boxSizing: "border-box",
                }}
            />

            <h2>Select Exercises</h2>

            {/* Display exercises */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                {exercises.map((exercise) => (
                    <div
                        key={exercise.id}
                        style={{
                            border: selectedExercises.some((e) => e.id === exercise.id)
                                ? "2px solid #ff5722"
                                : "1px solid #ccc",
                            padding: "10px",
                            cursor: "pointer",
                            textAlign: "center",
                            borderRadius: "5px",
                            backgroundColor: selectedExercises.some((e) => e.id === exercise.id)
                                ? "#ffe6e0"
                                : "#fff",
                        }}
                        onClick={() => handleSelectExercise(exercise)}
                    >
                        <h3>{exercise.name}</h3>
                        <p>Difficulty: {exercise.difficulty}</p>
                        <p>Clicks: {exercise.clicks}</p>
                        <p>Category: {exercise.category}</p>
                    </div>
                ))}
            </div>

            {/* Save training button */}
            <button
                onClick={handleSaveTraining}
                disabled={loading}
                style={{
                    marginTop: "20px",
                    padding: "10px 20px",
                    backgroundColor: loading ? "#ccc" : "#4CAF50",
                    color: "white",
                    border: "none",
                    cursor: loading ? "not-allowed" : "pointer",
                    fontSize: "16px",
                    borderRadius: "5px",
                }}
            >
                {loading ? "Saving..." : "Save Training"}
            </button>
        </div>
    );
};

export default CreateTraining;
