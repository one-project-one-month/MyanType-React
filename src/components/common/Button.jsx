export default function Button({ children, isActive, onClick, className = '' }) {
    return (
        <button
            onClick={onClick}
            className={`py-3 px-5 w-full flex rounded-lg text-sm text-gray-600 font-medium transition duration-200 cursor-pointer 
                ${isActive ? 'bg-[#141723] text-white shadow-inner shadow-[#1f2230]/40' : 'bg-transparent hover:bg-gray-800'}
                ${className}`}
        >
            {children}
        </button>
    );
}