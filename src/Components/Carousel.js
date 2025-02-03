import React from "react";
import Splide from "@splidejs/splide";
import { Grid } from '@splidejs/splide-extension-grid';
import "@splidejs/splide/dist/css/splide.min.css";

const Carousel = ({ items }) => {
    React.useEffect(() => {
        const splide = new Splide("#splide", {
            type: "loop",
            padding: { left: "1rem", right: "1rem", bottom: "1rem" },
            perPage: 1, // Number of rows displayed at a time
            grid: {
                rows: 2, // Number of rows
                cols: 3, // Number of columns
                gap: {
                    row: "1rem", // Space between rows
                    col: "1rem", // Space between columns
                },
            },
            extensions: { Grid }, // Enable the Grid extension
        });
        splide.mount();
    }, []);

    return (
        <div id="splide" className="splide">
            <div className="splide__track">
                <ul className="splide__list">
                    {items.map((item, index) => (
                        <li className="splide__slide" key={index}>
                            <div
                                style={{
                                    padding: "20px",
                                    backgroundColor: "#f4f4f4",
                                    border: "1px solid #ddd",
                                    textAlign: "center",
                                }}
                            >
                                <h3>{item.name}</h3>
                                <p>Difficulty: {item.difficulty}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Carousel;
