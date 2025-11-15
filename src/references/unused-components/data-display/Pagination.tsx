"use client";

import { CaretLeft, CaretRight } from "phosphor-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Show only 5 pages at a time
  const getVisiblePages = () => {
    if (totalPages <= 5) return pages;

    if (currentPage <= 3) {
      return [...pages.slice(0, 5), -1]; // -1 represents ellipsis
    }

    if (currentPage >= totalPages - 2) {
      return [-1, ...pages.slice(totalPages - 5)];
    }

    return [-1, ...pages.slice(currentPage - 2, currentPage + 1), -1];
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex justify-center items-center gap-3">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-[var(--cream)] rounded-full text-[var(--dark)] font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--cream)] hover:border-[var(--secondary)] transition-all hover:scale-105 shadow-lg disabled:hover:scale-100"
      >
        <CaretLeft size={20} weight="bold" />
        <span className="hidden sm:inline">Sebelumnya</span>
      </button>

      <div className="flex gap-2">
        {visiblePages.map((page, idx) => {
          if (page === -1) {
            return (
              <span key={`ellipsis-${idx}`} className="px-3 text-[var(--dark)]/40 font-bold flex items-center">
                ...
              </span>
            );
          }

          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-12 h-12 rounded-full font-black transition-all duration-300 ${
                page === currentPage
                  ? "bg-gradient-to-br from-[var(--primary)] to-[var(--primary)]/80 text-white shadow-xl scale-110 border-2 border-[var(--primary)]"
                  : "bg-white border-2 border-[var(--cream)] text-[var(--dark)] hover:bg-[var(--secondary)] hover:border-[var(--secondary)] hover:scale-105 shadow-lg"
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-[var(--cream)] rounded-full text-[var(--dark)] font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--cream)] hover:border-[var(--secondary)] transition-all hover:scale-105 shadow-lg disabled:hover:scale-100"
      >
        <span className="hidden sm:inline">Selanjutnya</span>
        <CaretRight size={20} weight="bold" />
      </button>
    </div>
  );
}
