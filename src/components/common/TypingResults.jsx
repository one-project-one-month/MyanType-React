export default function TypingResults({ children, className= '' }) {
    return (
        <div
            className={`bg-[#141723] text-white rounded-lg p-4 flex items-center text-center ${className}`}
        >
            {children}
        </div>
    );
}