import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase"; // Ensure Firebase is correctly configured
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import "./Navbar.css";

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setIsLoggedIn(true);
                const userRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(userRef);
                if (userDoc.exists()) {
                    setRole(userDoc.data().role); // Get role from Firestore ("coach" or "player")
                }
            } else {
                setIsLoggedIn(false);
                setRole(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/login");
        } catch (error) {
            console.error("Error logging out:", error.message);
        }
    };

    return (
        <nav className="navbar">
            <div className="logo">
                <Link to="/" className="nav-link">Fitness App</Link>
            </div>
            <div className="nav-links">
                <Link to="/" className="nav-link">Home</Link>

                {!isLoggedIn ? (
                    <>
                        <Link to="/login" className="nav-link login-btn">Log In</Link>
                    </>
                ) : (
                    <>
                        <Link to="/dashboard" className="nav-link">Dashboard</Link>

                        {/* Coach-Specific Links */}
                        {role === "coach" && (
                            <>
                                <Link to="/createtraining" className="nav-link button">Create Training</Link>
                                <Link to="/addplayertogroup" className="nav-link button">Add Player to Group</Link>
                            </>
                        )}

                        {/* Player-Specific Link */}
                        {role === "player" && (
                            <Link to="/ratetraining" className="nav-link button">Rate Training</Link>
                        )}

                        <button
                            className="nav-link logout-btn"
                            onClick={handleLogout}
                        >
                            Log Out
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
