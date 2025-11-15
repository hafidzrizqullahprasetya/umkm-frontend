import { Search as SearchIcon } from "lucide-react";
import React from "react";
import ViewToggle from "./ViewToggle";

interface SearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  view: "grid" | "list";
  onToggle: (view: "grid" | "list") => void;
  className?: string;
}

export default function Search({
  searchTerm,
  onSearchChange,
  view,
  onToggle,
  className,
}: SearchProps) {
  return (
    <div
      className={`bg-white rounded-lg border border-gray-100 flex items-center gap-3 p-1 ${
        className || ""
      }`}
    >
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-primary">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari UMKM berdasarkan nama, kategori, atau lokasi..."
          className="w-full pl-11 pr-4 py-3 rounded-md bg-transparent focus:outline-none text-foreground placeholder:text-gray-400"
        />
      </div>
      <ViewToggle view={view} onToggle={onToggle} />
    </div>
  );
}
