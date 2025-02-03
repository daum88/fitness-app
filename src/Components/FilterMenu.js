import React from "react";

const FilterMenu = ({ categories, selectedCategory, onCategorySelect }) => {
    return (
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            {categories.map((category) => (
                <button
                    key={category}
                    onClick={() => onCategorySelect(category)}
                    style={{
                        padding: "10px 15px",
                        paddingTop: "10px",
                        backgroundColor: selectedCategory === category ? "#333" : "#f4f4f4",
                        color: selectedCategory === category ? "#fff" : "#000",
                        border: "1px solid #ddd",
                        borderRadius: "5px",
                        cursor: "pointer",
                    }}
                >
                    {category}
                </button>
            ))}
        </div>
    );
};

export default FilterMenu;
