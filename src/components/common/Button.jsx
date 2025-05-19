export default function Button({ children, isActive, onClick, className = '' }) {
    return (
        <button
            onClick={onClick}
            className={`py-3 flex rounded-lg text-white transition cursor-pointer pl-4
                ${isActive ? 'bg-[#141723]' : 'bg-transparent'}
                ${className}`}
        >
            {children}
        </button>
    );
}