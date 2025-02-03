import React, { useState } from "react";
import { auth, db } from "../firebase"; // Ensure Firebase is configured
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("player"); // Default role is "player"

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            // Create user in Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Save additional user info in Firestore
            const userRef = doc(db, "users", user.uid);
            const userData = {
                name,
                email,
                role, // "player" or "coach"
            };

            await setDoc(userRef, userData);

            alert("Account created successfully!");
        } catch (error) {
            console.error("Error creating account:", error.message);
            alert(error.message);
        }
    };

    return (
        <div>
            <h1>Signup</h1>
            <form onSubmit={handleSignup}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Role:</label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="player">Player</option>
                        <option value="coach">Coach</option>
                    </select>
                </div>
                <button type="submit">Signup</button>
            </form>
        </div>
    );
};

export default Signup;
