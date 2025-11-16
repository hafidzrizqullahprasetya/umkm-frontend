"use client";
import { GridFour, List } from "phosphor-react";

interface ViewToggleProps {
  view: "grid" | "list";
  onToggle: (view: "grid" | "list") => void;
}

export default function ViewToggle({ view, onToggle }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-2 bg-[var(--cream)] rounded-full p-1.5 border-2 border-[var(--secondary)]/30">
      <button
        onClick={() => onToggle("grid")}
        className={`p-3 rounded-full transition-all duration-300 ${
          view === "grid"
            ? "bg-gradient-to-br from-[var(--primary)] to-[var(--primary)]/80 text-white shadow-lg scale-110"
            : "text-[var(--dark)]/40 hover:text-[var(--primary)] hover:bg-white/50"
        }`}
        aria-label="Grid view"
      >
        <GridFour
          className={`w-5 h-5`}
          weight="bold"
        />
      </button>
      <button
        onClick={() => onToggle("list")}
        className={`p-3 rounded-full transition-all duration-300 ${
          view === "list"
            ? "bg-gradient-to-br from-[var(--orange)] to-[var(--orange)]/80 text-white shadow-lg scale-110"
            : "text-[var(--dark)]/40 hover:text-[var(--orange)] hover:bg-white/50"
        }`}
        aria-label="List view"
      >
        <List
          className={`w-5 h-5`}
          weight="bold"
        />
      </button>
    </div>
  );
}
