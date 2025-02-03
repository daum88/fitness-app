import React from "react";
import {addToFavorites} from "../utils/favourites";

const ExerciseCard = ({ name, difficulty }) => {
    return (
        <div
            style={{
                border: "1px solid #ccc",
                padding: "10px",
                borderRadius: "8px",
                textAlign: "center",
                backgroundColor: "#f9f9f9",
            }}
        >
            <h3>{name}</h3>
            <p>Difficulty: {difficulty}</p>
            <button
                onClick={() => addToFavorites({ name, difficulty })}
                style={{
                    marginTop: "10px",
                    padding: "8px 16px",
                    backgroundColor: "#007BFF",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                }}
            >
                Add to Favorites
            </button>
        </div>
    );
};

export default ExerciseCard;
