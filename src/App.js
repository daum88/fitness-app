import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/AuthPage";
import Signup from "./pages/Signup";
import CoachDashboard from "./pages/CoachDashboard";
import PlayerDashboard from "./pages/PlayerDashboard";
import CreateTraining from "./pages/CreateTraining";
import GroupDashboard from "./pages/GroupDashboard";
import AddPlayerToGroup from "./pages/AddPlayerToGroup";
import { auth, db } from "./firebase"; // Firebase Authentication and Firestore
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const App = () => {
    const [role, setRole] = useState(null); // Store user role ("player" or "coach")
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                try {
                    const userRef = doc(db, "users", currentUser.uid); // Get user data from Firestore
                    const userDoc = await getDoc(userRef);

                    if (userDoc.exists()) {
                        setRole(userDoc.data().role); // Set the role as "player" or "coach"
                    } else {
                        console.error("User document not found.");
                    }
                } catch (error) {
                    console.error("Error fetching user role:", error);
                }
            } else {
                setRole(null); // No user is logged in
            }
            setLoading(false); // Stop loading after fetching data
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        // Show a loading indicator while data is being fetched
        return <p>Loading...</p>;
    }

    return (
        <Router>
            <div>
                <Navbar role={role} />
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />

                    {/* Coach-Specific Routes */}
                    {role === "coach" && (
                        <>
                            <Route path="/dashboard" element={<CoachDashboard />} />
                            <Route path="/group-dashboard" element={<GroupDashboard />} />
                            <Route path="/create-training" element={<CreateTraining />} />
                            <Route path="/add-player" element={<AddPlayerToGroup />} />
                        </>
                    )}

                    {/* Player-Specific Routes */}
                    {role === "player" && (
                        <>
                            <Route path="/dashboard" element={<PlayerDashboard />} />
                        </>
                    )}

                    {/* Unauthorized Fallback */}
                    {role === "coach" && <Route path="*" element={<Navigate to="/dashboard" />} />}
                    {role === "player" && <Route path="*" element={<Navigate to="/dashboard" />} />}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
