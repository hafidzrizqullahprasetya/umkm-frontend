"use client";
import { LayoutGrid, List } from "lucide-react";

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
        <LayoutGrid
        className={`w-5 h-5 ${
          view === "grid" ? "text-primary" : "text-gray-400"
        }`}
      />
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
        <List
        className={`w-5 h-5 ${
          view === "list" ? "text-primary" : "text-gray-400"
        }`}
      />
      </button>
    </div>
  );
}
