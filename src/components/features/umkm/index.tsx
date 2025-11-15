"use client";

import { useState, useMemo } from 'react';
import Header from "@/components/shared/header/Header";
import Footer from "@/components/shared/Footer";
import { MagnifyingGlass, Star } from "phosphor-react";
import { Umkm } from "@/types/umkm";
import UmkmGridCard from "./UmkmGridCard";
import UmkmListCard from "./UmkmListCard";

interface UmkmClientPageSimpleProps {
  allUmkm: Umkm[];
}

export default function UmkmClientPageSimple({ allUmkm }: UmkmClientPageSimpleProps) {
  const [activeTab, setActiveTab] = useState<string>('tab1');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);

  // Get unique categories and locations
  const allCategories = useMemo(() => {
    return Array.from(new Set(allUmkm.map(u => u.type).filter(Boolean))).sort();
  }, [allUmkm]);

  const allLocations = useMemo(() => {
    return Array.from(new Set(allUmkm.map(u => u.location).filter(Boolean))).sort();
  }, [allUmkm]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(cat => cat !== category)
        : [...prev, category]
    );
  };

  const handleLocationChange = (location: string) => {
    setSelectedLocations(prev =>
      prev.includes(location)
        ? prev.filter(loc => loc !== location)
        : [...prev, location]
    );
  };

  // Filter UMKM based on selected filters
  const filteredUmkm = useMemo(() => {
    return allUmkm.filter(umkm => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery ||
        umkm.name.toLowerCase().includes(searchLower) ||
        (umkm.description && umkm.description.toLowerCase().includes(searchLower)) ||
        umkm.type.toLowerCase().includes(searchLower) ||
        (umkm.location && umkm.location.toLowerCase().includes(searchLower));

      // Category filter
      const matchesCategory = selectedCategories.length === 0 ||
        selectedCategories.includes(umkm.type);

      // Location filter
      const matchesLocation = selectedLocations.length === 0 ||
        (umkm.location && selectedLocations.includes(umkm.location));

      // Rating filter (default to 4.0 for now as rating is not in Umkm type)
      const matchesRating = true; // We'll skip rating filter for now

      return matchesSearch && matchesCategory && matchesLocation && matchesRating;
    });
  }, [allUmkm, searchQuery, selectedCategories, selectedLocations, minRating]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 mt-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-[var(--primary)] font-medium">Direktori UMKM</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6 space-y-6">
                {/* Search Box */}
                <div>
                  <h5 className="text-lg font-semibold text-[var(--dark)] mb-3">Pencarian UMKM</h5>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Cari UMKM..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <MagnifyingGlass size={20} />
                    </div>
                  </div>
                </div>

                {/* Rating Filter */}
                <div>
                  <h5 className="text-lg font-semibold text-[var(--dark)] mb-3">Filter Rating</h5>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        id="rating-all"
                        type="radio"
                        name="rating"
                        checked={minRating === 0}
                        onChange={() => setMinRating(0)}
                        className="w-4 h-4 text-[var(--primary)] focus:ring-[var(--primary)]"
                      />
                      <span className="text-sm text-gray-700">Semua Rating</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        id="rating-4"
                        type="radio"
                        name="rating"
                        checked={minRating === 4}
                        onChange={() => setMinRating(4)}
                        className="w-4 h-4 text-[var(--primary)] focus:ring-[var(--primary)]"
                      />
                      <span className="text-sm text-gray-700 flex items-center gap-1">
                        <Star size={16} weight="fill" className="text-yellow-400" />
                        4+ ke atas
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        id="rating-3"
                        type="radio"
                        name="rating"
                        checked={minRating === 3}
                        onChange={() => setMinRating(3)}
                        className="w-4 h-4 text-[var(--primary)] focus:ring-[var(--primary)]"
                      />
                      <span className="text-sm text-gray-700 flex items-center gap-1">
                        <Star size={16} weight="fill" className="text-yellow-400" />
                        3+ ke atas
                      </span>
                    </label>
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <h5 className="text-lg font-semibold text-[var(--dark)] mb-3">Kategori UMKM</h5>
                  <div className="space-y-2">
                    {allCategories.map((cat, i) => (
                      <label key={i} className="flex items-center gap-2 cursor-pointer">
                        <input
                          id={`cat${i + 1}`}
                          type="checkbox"
                          checked={selectedCategories.includes(cat)}
                          onChange={() => handleCategoryChange(cat)}
                          className="w-4 h-4 text-[var(--primary)] rounded focus:ring-[var(--primary)]"
                        />
                        <span className="text-sm text-gray-700">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Locations */}
                <div>
                  <h5 className="text-lg font-semibold text-[var(--dark)] mb-3">Pilih Lokasi</h5>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {allLocations.map((loc, i) => (
                      <label key={i} className="flex items-center gap-2 cursor-pointer">
                        <input
                          id={`loc${i + 1}`}
                          type="checkbox"
                          checked={selectedLocations.includes(loc)}
                          onChange={() => handleLocationChange(loc)}
                          className="w-4 h-4 text-[var(--primary)] rounded focus:ring-[var(--primary)]"
                        />
                        <span className="text-sm text-gray-700">{loc}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Top Bar */}
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <span className="text-sm text-gray-600">
                  Menampilkan <span className="font-semibold text-[var(--primary)]">{filteredUmkm.length}</span> UMKM
                </span>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">Urutkan: Terbaru</span>
                  <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setActiveTab('tab1')}
                      className={`p-2 rounded transition-colors ${
                        activeTab === 'tab1'
                          ? 'bg-white shadow-sm text-[var(--primary)]'
                          : 'text-gray-600 hover:text-[var(--primary)]'
                      }`}
                      title="Grid View"
                    >
                      <svg width={18} height={18} viewBox="0 0 16 16" fill="none">
                        <rect x="0.5" y="0.5" width={6} height={6} rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                        <rect x="0.5" y="9.5" width={6} height={6} rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                        <rect x="9.5" y="0.5" width={6} height={6} rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                        <rect x="9.5" y="9.5" width={6} height={6} rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setActiveTab('tab2')}
                      className={`p-2 rounded transition-colors ${
                        activeTab === 'tab2'
                          ? 'bg-white shadow-sm text-[var(--primary)]'
                          : 'text-gray-600 hover:text-[var(--primary)]'
                      }`}
                      title="List View"
                    >
                      <svg width={18} height={18} viewBox="0 0 16 16" fill="none">
                        <rect x="0.5" y="0.5" width={6} height={6} rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                        <rect x="0.5" y="9.5" width={6} height={6} rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                        <rect x={9} y={2.5} width={7} height={2} fill="currentColor" rx="0.5" />
                        <rect x={9} y={11.5} width={7} height={2} fill="currentColor" rx="0.5" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Grid View */}
              {activeTab === 'tab1' && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredUmkm.length > 0 ? (
                    filteredUmkm.map((umkm) => (
                      <UmkmGridCard key={umkm.id} umkm={umkm} />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <h2 className="text-2xl font-semibold text-gray-600">Tidak Ada UMKM Ditemukan</h2>
                      <p className="text-gray-500 mt-2">Coba ubah filter pencarian Anda</p>
                    </div>
                  )}
                </div>
              )}

              {/* List View */}
              {activeTab === 'tab2' && (
                <div className="space-y-4">
                  {filteredUmkm.length > 0 ? (
                    filteredUmkm.map((umkm) => (
                      <UmkmListCard key={umkm.id} umkm={umkm} />
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <h2 className="text-2xl font-semibold text-gray-600">Tidak Ada UMKM Ditemukan</h2>
                      <p className="text-gray-500 mt-2">Coba ubah filter pencarian Anda</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

      <Footer />
    </div>
  );
}
