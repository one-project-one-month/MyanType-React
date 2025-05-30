import React from 'react';

const PaginationControls = ({ currentPage, totalPages, handlePreviousPage, handleNextPage, hasStarted, mode }) => {
  return (
    hasStarted &&
    mode !== 'custom' &&
    totalPages > 1 && (
      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 0}
          className={`px-4 py-2 rounded-lg text-white ${
            currentPage === 0 ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          Previous
        </button>
        <span className="text-white">Page {currentPage + 1} of {totalPages}</span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages - 1}
          className={`px-4 py-2 rounded-lg text-white ${
            currentPage === totalPages - 1 ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          Next
        </button>
      </div>
    )
  );
};

export default PaginationControls;