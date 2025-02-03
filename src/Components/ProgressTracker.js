const ProgressTracker = ({ progress }) => (
    <div className="w-full bg-gray-300 rounded overflow-hidden">
        <div className="h-4 bg-green-500" style={{ width: `${progress}%` }}></div>
    </div>
);

export default ProgressTracker;
