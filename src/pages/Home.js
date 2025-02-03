import React, { useState, lazy, Suspense, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FilterMenu from "../Components/FilterMenu";
import { exercises } from "../data/mockData";
import "../styles.css";

const ExerciseCard = lazy(() => import("../Components/ExerciseCard"));

const Home = () => {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [favorites, setFavorites] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem("user");
        setIsAuthenticated(!!user);
        const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
        setFavorites(storedFavorites);
        document.querySelectorAll("section").forEach((section) => {
            section.classList.add("visible");
        });
    }, []);

    const handleGetStarted = () => {
        isAuthenticated ? navigate("/dashboard") : navigate("/login");
    };

    const handleAddToFavorites = (exercise) => {
        const updatedFavorites = [...favorites, exercise];
        setFavorites(updatedFavorites);
        localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    };

    const handleRemoveFromFavorites = (exerciseId) => {
        const updatedFavorites = favorites.filter((exercise) => exercise.id !== exerciseId);
        setFavorites(updatedFavorites);
        localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    };

    const filteredExercises =
        selectedCategory === "All"
            ? exercises
            : exercises.filter((exercise) => exercise.category === selectedCategory);

    return (
        <div className="container">

            {/* Hero Section */}
            <section id="hero" className="hero-section">
                <h1>Achieve Your Fitness Goals</h1>
                <p>Customized plans, progress tracking, and more.</p>
                <button className="cta-button" onClick={handleGetStarted}>
                    Get Started
                </button>
            </section>

            {/* Carousel Section */}
            <section id="carousel" className="carousel-section">
                <h2>Discover Top Workouts</h2>
                <div className="carousel-container">
                    {exercises.slice(0, 5).map((exercise, index) => (
                        <div key={index} className="carousel-item">
                            <h3>{exercise.name}</h3>
                            <p>{exercise.difficulty}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Explore Exercises Grid */}
            <section id="explore" className="explore-section">
                <h2>Browse Exercises</h2>
                <div className="category-container">
                    <FilterMenu
                        categories={["All", "Upper Body", "Lower Body", "Core", "Full Body"]}
                        selectedCategory={selectedCategory}
                        onCategorySelect={setSelectedCategory}
                    />
                </div>
                <div className="exercise-grid">
                    <Suspense fallback={<p>Loading exercises...</p>}>
                        {filteredExercises.map((exercise) => (
                            <ExerciseCard
                                key={exercise.id}
                                name={exercise.name}
                                difficulty={exercise.difficulty}
                                onAddToFavorites={() => handleAddToFavorites(exercise)}
                            />
                        ))}
                    </Suspense>
                </div>
            </section>

            {/* Dashboard Section for Coaches */}
            {isAuthenticated && (
                <section id="dashboard" className="dashboard-section">
                    <h2>Your Favorite Exercises</h2>
                    {favorites.length === 0 ? (
                        <p>No favorite exercises yet.</p>
                    ) : (
                        <div className="exercise-grid">
                            {favorites.map((exercise) => (
                                <div key={exercise.id} className="exercise-card">
                                    <h3>{exercise.name}</h3>
                                    <p>{exercise.difficulty}</p>
                                    <button className="remove-favorite" onClick={() => handleRemoveFromFavorites(exercise.id)}>
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            )}

            {/* Improved Benefits Section */}
            <section id="benefits" className="benefits-section">
                <h2>Why Fitness Hub?</h2>
                <div className="benefits-container">
                    {[
                        { icon: "🏋️", title: "Personalized Plans", description: "Tailored workout plans for every fitness level." },
                        { icon: "📊", title: "Track Progress", description: "Detailed analytics to monitor your fitness journey." },
                        { icon: "🤝", title: "Community Support", description: "Stay motivated with like-minded fitness enthusiasts." },
                        { icon: "🎯", title: "Goal Setting", description: "Set and achieve your fitness goals step by step." },
                    ].map((benefit, index) => (
                        <div key={index} className="benefit-card">
                            <i>{benefit.icon}</i>
                            <h3>{benefit.title}</h3>
                            <p>{benefit.description}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;
