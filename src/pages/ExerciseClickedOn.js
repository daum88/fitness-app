import React from "react";
import { useParams } from "react-router-dom";

const ExerciseClickedOn = () => {
    const { name } = useParams(); // Retrieve the exercise name from the route

    return (
        <div>
            <h1>Exercise: {name}</h1>
            <p>Details about {name} will go here.</p>
        </div>
    );
};

export default ExerciseClickedOn;
