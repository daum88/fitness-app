import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './AuthPage.css';

const AuthPage = () => {
    const [isSignup, setIsSignup] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('player'); // Default role is player
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const toggleForm = () => {
        setIsSignup(!isSignup);
        setError(''); // Clear errors when toggling
    };

    const handleSubmit = async () => {
        setError('');
        try {
            if (isSignup) {
                // Handle signup
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                await setDoc(doc(db, 'users', user.uid), {
                    name,
                    email,
                    role,
                    coachId: role === 'coach' ? user.uid : ''
                });

                // Redirect to home
                navigate('/');
            } else {
                // Handle login
                await signInWithEmailAndPassword(auth, email, password);

                // Redirect to home
                navigate('/');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className={`cont ${isSignup ? 's--signup' : ''}`}>
            <div className="form sign-in">
                <h2>Welcome</h2>
                {error && <p className="error">{error}</p>}
                <label>
                    <span>Email</span>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </label>
                <label>
                    <span>Password</span>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </label>
                <p className="forgot-pass">Forgot password?</p>
                <button type="button" className="submit" onClick={handleSubmit}>
                    Sign In
                </button>
            </div>
            <div className="sub-cont">
                <div className="img">
                    <div className="img__text m--up">
                        <h3>Don't have an account? Please Sign up!</h3>
                    </div>
                    <div className="img__text m--in">
                        <h3>If you already have an account, just sign in.</h3>
                    </div>
                    <div className="img__btn" onClick={toggleForm}>
                        <span className="m--up">Sign Up</span>
                        <span className="m--in">Sign In</span>
                    </div>
                </div>
                <div className="form sign-up">
                    <h2>Create your Account</h2>
                    {error && <p className="error">{error}</p>}
                    <label>
                        <span>Name</span>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    </label>
                    <label>
                        <span>Email</span>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </label>
                    <label>
                        <span>Password</span>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </label>
                    <label>
                        <span>Role</span>
                        <select value={role} onChange={(e) => setRole(e.target.value)}>
                            <option value="player">Player</option>
                            <option value="coach">Coach</option>
                        </select>
                    </label>
                    <button type="button" className="submit" onClick={handleSubmit}>
                        Sign Up
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
