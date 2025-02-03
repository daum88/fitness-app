import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { auth } from "../firebase";

const AddPlayerToGroup = () => {
    const [playerEmail, setPlayerEmail] = useState("");

    const handleAddPlayer = async () => {
        if (!playerEmail) {
            alert("Please enter a player's email.");
            return;
        }

        const coach = auth.currentUser; // Get the logged-in coach

        if (!coach) {
            alert("You must be logged in as a coach to add players.");
            return;
        }

        try {
            // Save the association between coach and player
            await addDoc(collection(db, "groups"), {
                coachId: coach.uid,
                playerEmail: playerEmail,
            });

            alert(`Player with email ${playerEmail} added to your group!`);
            setPlayerEmail("");
        } catch (error) {
            console.error("Error adding player:", error);
            alert("Failed to add player. Please try again.");
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Add Player to Group</h1>
            <input
                type="email"
                placeholder="Enter player's email"
                value={playerEmail}
                onChange={(e) => setPlayerEmail(e.target.value)}
                style={{
                    padding: "10px",
                    marginBottom: "20px",
                    width: "100%",
                    boxSizing: "border-box",
                }}
            />
            <button
                onClick={handleAddPlayer}
                style={{
                    padding: "10px 20px",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "16px",
                    borderRadius: "5px",
                }}
            >
                Add Player
            </button>
        </div>
    );
};

export default AddPlayerToGroup;
