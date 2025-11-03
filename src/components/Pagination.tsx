"use client";

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
    <div className="flex justify-center items-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-white border border-gray-200 rounded-md text-foreground font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
      >
        Sebelumnya
      </button>

      {visiblePages.map((page, idx) => {
        if (page === -1) {
          return (
            <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">
              ...
            </span>
          );
        }

        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              page === currentPage
                ? "bg-primary text-white"
                : "bg-white border border-gray-200 text-foreground hover:bg-gray-50"
            }`}
          >
            {page}
          </button>
        );
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-white border border-gray-200 rounded-md text-foreground font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
      >
        Selanjutnya
      </button>
    </div>
  );
}
