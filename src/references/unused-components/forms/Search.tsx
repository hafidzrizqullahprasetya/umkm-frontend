"use client";

import { MagnifyingGlass } from "phosphor-react";
import React from "react";
import ViewToggle from "../navigation/ViewToggle";

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
      className={`bg-white rounded-3xl border-2 border-[var(--cream)] flex items-center gap-3 p-2 shadow-xl hover:shadow-2xl transition-shadow ${
        className || ""
      }`}
    >
      <div className="relative flex-1">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none">
          <div className="w-10 h-10 bg-gradient-to-br from-[var(--primary)] to-[var(--primary)]/80 rounded-full flex items-center justify-center">
            <MagnifyingGlass size={20} className="text-white" weight="bold" />
          </div>
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari UMKM berdasarkan nama, kategori, atau lokasi..."
          className="w-full pl-20 pr-6 py-4 rounded-full bg-transparent focus:outline-none text-[var(--dark)] font-medium placeholder:text-[var(--dark)]/40 placeholder:font-normal"
        />
      </div>
      <ViewToggle view={view} onToggle={onToggle} />
    </div>
  );
}
