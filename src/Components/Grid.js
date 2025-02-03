const Grid = ({ children, gap = "16px", columns = 3 }) => {
    const gridStyle = {
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: gap,
    };
    return <div style={gridStyle}>{children}</div>;
};

export default Grid;
