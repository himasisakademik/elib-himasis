'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; 
    const halfPages = Math.floor(maxPagesToShow / 2);

    if (totalPages <= maxPagesToShow + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1); 

      let start = Math.max(2, currentPage - halfPages);
      let end = Math.min(totalPages - 1, currentPage + halfPages);

      if (currentPage - 1 <= halfPages) {
        end = maxPagesToShow;
      }
      if (totalPages - currentPage <= halfPages) {
        start = totalPages - maxPagesToShow + 1;
      }

      if (start > 2) {
        pageNumbers.push('...');
      }

      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }

      if (end < totalPages - 1) {
        pageNumbers.push('...');
      }

      pageNumbers.push(totalPages); 
    }
    return pageNumbers;
  };

  const pages = getPageNumbers();

  if (totalPages <= 1) {
    return null; 
  }

  return (
    <div className="flex justify-center mt-12">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl p-2 sm:p-4">
        <div className="flex items-center space-x-1 sm:space-x-2">
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-110 bg-slate-700/50 text-gray-300 hover:bg-slate-600/50 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            aria-label="Go to first page"
          >
            <ChevronsLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-110 bg-slate-700/50 text-gray-300 hover:bg-slate-600/50 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            aria-label="Go to previous page"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {pages.map((page, index) =>
            typeof page === 'number' ? (
              <button
                key={index}
                onClick={() => onPageChange(page)}
                className={`hidden sm:block px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-110 ${
                  currentPage === page
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/50 hover:text-white'
                }`}
              >
                {page}
              </button>
            ) : (
              <span key={index} className="hidden sm:block px-4 py-2 text-gray-400">
                {page}
              </span>
            )
          )}
          <div className="sm:hidden px-4 py-2 rounded-xl font-medium bg-slate-700/50 text-gray-300">
            Halaman {currentPage} dari {totalPages}
          </div>


          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-110 bg-slate-700/50 text-gray-300 hover:bg-slate-600/50 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            aria-label="Go to next page"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-110 bg-slate-700/50 text-gray-300 hover:bg-slate-600/50 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            aria-label="Go to last page"
          >
            <ChevronsRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
