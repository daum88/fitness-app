import React from "react";

const ExerciseGrid = ({ exercises }) => {
    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "20px",
            }}
        >
            {exercises.map((exercise) => (
                <div
                    key={exercise.id}
                    style={{
                        padding: "15px",
                        backgroundColor: "#f9f9f9",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        textAlign: "center",
                    }}
                >
                    <h3>{exercise.name}</h3>
                    <p>Difficulty: {exercise.difficulty}</p>
                    <p>Clicks: {exercise.clicks}</p>
                </div>
            ))}
        </div>
    );
};

export default ExerciseGrid;
