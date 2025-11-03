"use client";
import { FaTh, FaList } from "react-icons/fa";

interface ViewToggleProps {
  view: "grid" | "list";
  onToggle: (view: "grid" | "list") => void;
}

export default function ViewToggle({ view, onToggle }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-1 bg-gray-50 rounded-md p-1">
      <button
        onClick={() => onToggle("grid")}
        className={`p-2.5 rounded transition-colors ${
          view === "grid"
            ? "bg-white text-primary"
            : "text-gray-400 hover:text-gray-600"
        }`}
        aria-label="Grid view"
      >
        <FaTh size={16} />
      </button>
      <button
        onClick={() => onToggle("list")}
        className={`p-2.5 rounded transition-colors ${
          view === "list"
            ? "bg-white text-primary"
            : "text-gray-400 hover:text-gray-600"
        }`}
        aria-label="List view"
      >
        <FaList size={16} />
      </button>
    </div>
  );
}
