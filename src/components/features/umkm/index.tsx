"use client";

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from "@/components/shared/header/Header";
import Footer from "@/components/shared/Footer";
import { CaretLeft, CaretRight, Tag, FunnelSimple, SquaresFour, Rows, MapTrifold, SortAscending } from "phosphor-react";
import { Umkm } from "@/types/umkm";
import UmkmGridCard from "./UmkmGridCard";
import UmkmListCard from "./UmkmListCard";
import MapView from "./MapView";
import { extractCoordsFromGmapsUrl, getDistanceInfo } from "@/lib/location";

interface UmkmClientPageSimpleProps {
  allUmkm: Umkm[];
}

export default function UmkmClientPageSimple({ allUmkm }: UmkmClientPageSimpleProps) {
  // Extract coordinates from gmaps URLs and add to UMKM data
  const umkmWithCoords = useMemo(() => {
    return allUmkm.map(umkm => {
      const coords = extractCoordsFromGmapsUrl(umkm.gmaps);
      return {
        ...umkm,
        lat: coords?.lat,
        lng: coords?.lng
      };
    });
  }, [allUmkm]);
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<string>('tab1');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<'default' | 'distance-asc' | 'distance-desc' | 'time-asc' | 'time-desc'>('default');

  // Handle URL search parameters
  useEffect(() => {
    const search = searchParams.get('search');
    const category = searchParams.get('category');

    if (search) {
      setSearchQuery(search);
    }

    if (category && category !== 'Semua') {
      setSelectedCategories([category]);
    }
  }, [searchParams]);

  // Items per page
  const itemsPerPage = activeTab === 'tab1' ? 6 : 4;

  // Get unique categories
  const allCategories = useMemo(() => {
    return Array.from(new Set(umkmWithCoords.map(u => u.type).filter(Boolean))).sort();
  }, [umkmWithCoords]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(cat => cat !== category)
        : [...prev, category]
    );
  };

  // Filter and sort UMKM
  const filteredUmkm = useMemo(() => {
    // First, filter
    let filtered = umkmWithCoords.filter(umkm => {
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

      return matchesSearch && matchesCategory;
    });

    // Then, sort based on distance/time
    if (sortBy !== 'default') {
      filtered = [...filtered].sort((a, b) => {
        const distanceA = getDistanceInfo(a.gmaps, a.location);
        const distanceB = getDistanceInfo(b.gmaps, b.location);

        // Handle UMKM without coordinates (put them at the end)
        if (!distanceA && !distanceB) return 0;
        if (!distanceA) return 1;
        if (!distanceB) return -1;

        switch (sortBy) {
          case 'distance-asc':
            return distanceA.distanceMeters - distanceB.distanceMeters;
          case 'distance-desc':
            return distanceB.distanceMeters - distanceA.distanceMeters;
          case 'time-asc':
            return distanceA.distanceMeters - distanceB.distanceMeters; // Same as distance
          case 'time-desc':
            return distanceB.distanceMeters - distanceA.distanceMeters; // Same as distance
          default:
            return 0;
        }
      });
    }

    return filtered;
  }, [umkmWithCoords, searchQuery, selectedCategories, sortBy]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredUmkm.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUmkm = filteredUmkm.slice(startIndex, endIndex);

  // Reset to page 1 when filters change or tab changes
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategories, activeTab]);

  return (
    <div className="min-h-screen bg-gray-75">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Filter & Info Bar */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md border border-gray-100 p-6 mb-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            {/* Left Side: Categories Filter */}
            <div className="flex-1 w-full lg:w-auto">
              <div className="flex items-center gap-2 mb-3">
                <Tag size={18} weight="bold" className="text-[var(--primary)]" />
                <h4 className="text-sm font-bold text-[var(--dark)]">Filter Kategori</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {/* Semua Button */}
                <button
                  onClick={() => setSelectedCategories([])}
                  className={`group flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 border-2 ${
                    selectedCategories.length === 0
                      ? 'bg-[var(--primary)] border-[var(--primary)] text-white shadow-lg hover:shadow-xl'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-[var(--primary)] hover:text-[var(--primary)] hover:shadow-md hover:-translate-y-0.5'
                  }`}
                >
                  <Tag
                    size={16}
                    weight={selectedCategories.length === 0 ? "fill" : "bold"}
                    className={selectedCategories.length === 0 ? "text-white" : "text-[var(--primary)]"}
                  />
                  <span>Semua</span>
                </button>

                {allCategories.map((cat, i) => (
                  <button
                    key={i}
                    onClick={() => handleCategoryChange(cat)}
                    className={`group flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 border-2 ${
                      selectedCategories.includes(cat)
                        ? 'bg-[var(--primary)] border-[var(--primary)] text-white shadow-lg hover:shadow-xl'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-[var(--primary)] hover:text-[var(--primary)] hover:shadow-md hover:-translate-y-0.5'
                    }`}
                  >
                    <Tag
                      size={16}
                      weight={selectedCategories.includes(cat) ? "fill" : "bold"}
                      className={selectedCategories.includes(cat) ? "text-white" : "text-[var(--primary)]"}
                    />
                    <span>{cat}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Side: Sort and View Toggle */}
            <div className="flex flex-col gap-3 flex-shrink-0">
              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 bg-white rounded-lg border-2 border-gray-200 px-3 py-2 hover:border-[var(--primary)] transition-all">
                <SortAscending size={18} weight="bold" className="text-[var(--primary)]" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="text-sm font-medium bg-transparent border-none text-[var(--dark)] focus:outline-none cursor-pointer"
                >
                  <option value="default">Urutkan: Default</option>
                  <option value="distance-asc">Jarak: Terdekat</option>
                  <option value="distance-desc">Jarak: Terjauh</option>
                  <option value="time-asc">Waktu: Tercepat</option>
                  <option value="time-desc">Waktu: Terlama</option>
                </select>
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('tab1')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-md transition-all ${
                    activeTab === 'tab1'
                      ? 'bg-[var(--primary)] shadow-md text-white'
                      : 'text-gray-600 hover:text-[var(--primary)] hover:bg-white'
                  }`}
                  title="Grid View"
                >
                  <SquaresFour size={18} weight="bold" />
                  <span className="text-xs font-medium">Grid</span>
                </button>
                <button
                  onClick={() => setActiveTab('tab2')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-md transition-all ${
                    activeTab === 'tab2'
                      ? 'bg-[var(--primary)] shadow-md text-white'
                      : 'text-gray-600 hover:text-[var(--primary)] hover:bg-white'
                  }`}
                  title="List View"
                >
                  <Rows size={18} weight="bold" />
                  <span className="text-xs font-medium">List</span>
                </button>
                <button
                  onClick={() => setActiveTab('tab3')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-md transition-all ${
                    activeTab === 'tab3'
                      ? 'bg-[var(--primary)] shadow-md text-white'
                      : 'text-gray-600 hover:text-[var(--primary)] hover:bg-white'
                  }`}
                  title="Map View"
                >
                  <MapTrifold size={18} weight="bold" />
                  <span className="text-xs font-medium">Peta</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Cards Section */}
        <div>
          {/* Grid View */}
          {activeTab === 'tab1' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginatedUmkm.length > 0 ? (
                  paginatedUmkm.map((umkm) => (
                    <UmkmGridCard key={umkm.id} umkm={umkm} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <h2 className="text-2xl font-semibold text-gray-600">Tidak Ada UMKM Ditemukan</h2>
                    <p className="text-gray-500 mt-2">Coba ubah filter pencarian Anda</p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {filteredUmkm.length > 0 && totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg border-2 transition-all ${
                      currentPage === 1
                        ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white'
                    }`}
                  >
                    <CaretLeft size={20} weight="bold" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                        currentPage === page
                          ? 'bg-[var(--primary)] border-[var(--primary)] text-white'
                          : 'border-gray-200 text-gray-600 hover:border-[var(--primary)] hover:text-[var(--primary)]'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg border-2 transition-all ${
                      currentPage === totalPages
                        ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white'
                    }`}
                  >
                    <CaretRight size={20} weight="bold" />
                  </button>
                </div>
              )}
            </>
          )}

          {/* List View */}
          {activeTab === 'tab2' && (
            <>
              <div className="space-y-4">
                {paginatedUmkm.length > 0 ? (
                  paginatedUmkm.map((umkm) => (
                    <UmkmListCard key={umkm.id} umkm={umkm} />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <h2 className="text-2xl font-semibold text-gray-600">Tidak Ada UMKM Ditemukan</h2>
                    <p className="text-gray-500 mt-2">Coba ubah filter pencarian Anda</p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {filteredUmkm.length > 0 && totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg border-2 transition-all ${
                      currentPage === 1
                        ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white'
                    }`}
                  >
                    <CaretLeft size={20} weight="bold" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                        currentPage === page
                          ? 'bg-[var(--primary)] border-[var(--primary)] text-white'
                          : 'border-gray-200 text-gray-600 hover:border-[var(--primary)] hover:text-[var(--primary)]'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg border-2 transition-all ${
                      currentPage === totalPages
                        ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white'
                    }`}
                  >
                    <CaretRight size={20} weight="bold" />
                  </button>
                </div>
              )}
            </>
          )}

          {/* Map View */}
          {activeTab === 'tab3' && (
            <MapView allUmkm={filteredUmkm} />
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
