"use client";
import { useState } from "react";

interface FilterProps {
  filters: {
    category: string;
    location: string[];
    year: string;
  };
  onFilterChange: (key: string, value: string | string[]) => void;
}

const locations = [
  "Jakarta",
  "Yogyakarta",
  "Bali",
  "Surabaya",
  "Medan",
  "Bandung",
  "Semarang",
  "Makassar",
  "Palembang",
  "Manado",
  "Denpasar",
  "Solo",
];

export default function UmkmFilter({ filters, onFilterChange }: FilterProps) {
  const [yearRange, setYearRange] = useState([2020, 2025]);

  const handleYearChange = (value: number[]) => {
    setYearRange(value);
    onFilterChange("year", `${value[0]}-${value[1]}`);
  };

  const handleLocationChange = (loc: string, checked: boolean) => {
    let newLocations = [...filters.location];
    if (checked) {
      newLocations.push(loc);
    } else {
      newLocations = newLocations.filter((l) => l !== loc);
    }
    onFilterChange("location", newLocations);
  };

  const clearLocationFilters = () => {
    onFilterChange("location", []);
  };

  return (
    <div className="w-72 bg-white rounded-lg border border-gray-100 overflow-hidden sticky top-8 h-fit">
      <div className="p-5 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-foreground">Filter UMKM</h3>
      </div>

      <div className="p-5 space-y-6">
        {/* Lokasi - Checkbox */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-medium text-foreground">
              Lokasi
            </label>
            {filters.location.length > 0 && (
              <button
                onClick={clearLocationFilters}
                className="text-xs text-primary hover:text-primary/80 font-medium"
              >
                Hapus
              </button>
            )}
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
            {locations.map((loc) => (
              <label
                key={loc}
                className="flex items-center py-1.5 px-2 rounded hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={filters.location.includes(loc)}
                  onChange={(e) => handleLocationChange(loc, e.target.checked)}
                  className="mr-3 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary focus:ring-offset-0"
                />
                <span className="text-sm text-foreground">{loc}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Tahun Berdiri */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Tahun Berdiri
          </label>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-foreground">
                {yearRange[0]}
              </span>
              <span className="text-sm font-medium text-foreground">
                {yearRange[1]}
              </span>
            </div>
            <div className="space-y-3">
              <input
                type="range"
                min="1990"
                max="2025"
                value={yearRange[0]}
                onChange={(e) =>
                  handleYearChange([parseInt(e.target.value), yearRange[1]])
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <input
                type="range"
                min="1990"
                max="2025"
                value={yearRange[1]}
                onChange={(e) =>
                  handleYearChange([yearRange[0], parseInt(e.target.value)])
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Reset Button */}
      <div className="p-5 border-t border-gray-100">
        <button
          onClick={() => {
            onFilterChange("category", "Semua");
            onFilterChange("location", []);
            onFilterChange("year", "Semua");
            setYearRange([2020, 2025]);
          }}
          className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2.5 rounded-md transition-colors"
        >
          Reset Filter
        </button>
      </div>
    </div>
  );
}
