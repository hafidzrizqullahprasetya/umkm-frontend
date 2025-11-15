import {
  Utensils,
  Shirt,
  Star,
  Hammer,
  Laptop,
  Briefcase,
  MoreHorizontal,
} from "lucide-react";
import React from "react";

const tabs: { label: string; icon: React.ReactElement }[] = [
  { label: "Semua", icon: <Star size={16} /> },
  { label: "Makanan", icon: <Utensils size={16} /> },
  { label: "Fashion", icon: <Shirt size={16} /> },
  { label: "Kerajinan", icon: <Hammer size={16} /> },
  { label: "Teknologi", icon: <Laptop size={16} /> },
  { label: "Jasa", icon: <Briefcase size={16} /> },
  { label: "Lainnya", icon: <MoreHorizontal size={16} /> },
];

export default function UmkmTab({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className="flex justify-start items-center gap-2 bg-white rounded-lg p-1 border border-gray-100 overflow-x-auto scrollbar-hide">
      {tabs.map((tab) => (
        <button
          key={tab.label}
          onClick={() => onChange(tab.label)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-md transition-colors whitespace-nowrap ${
            value === tab.label
              ? "bg-primary text-white"
              : "text-foreground hover:bg-gray-50"
          }`}
        >
          <span
            className={` ${
              value === tab.label ? "text-white" : "text-primary"
            }`}
          >
            {tab.icon}
          </span>
          <span className="text-sm font-medium">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}