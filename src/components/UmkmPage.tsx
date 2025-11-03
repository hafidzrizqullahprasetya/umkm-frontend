"use client";
import { useState, useEffect } from "react";
import UmkmTab from "./UmkmTab";
import UmkmCard from "./UmkmCard";
import UmkmList from "./UmkmList";
import UmkmFilter from "./UmkmFilter";
import Pagination from "./Pagination";
import Search from "./Search";
import { dummyUmkm } from "../lib/data";
import { FaMapMarkerAlt } from "react-icons/fa";

export default function UmkmPage() {
  const [selectedTab, setSelectedTab] = useState("Semua");
  const [filters, setFilters] = useState({
    category: "Semua",
    location: [] as string[],
    year: "Semua",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [userLocation, setUserLocation] = useState<string | null>(null);
  const itemsPerPage = 6;

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          // Simulate getting city name from coordinates
          // In production, you would use a reverse geocoding API
          const cities = [
            "Jakarta",
            "Bandung",
            "Surabaya",
            "Yogyakarta",
            "Bali",
          ];
          const randomCity = cities[Math.floor(Math.random() * cities.length)];
          setUserLocation(randomCity);
        },
        () => {
          console.log("Location access denied");
        }
      );
    }
  }, []);

  const handleFilterChange = (key: string, value: string | string[]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset ke halaman 1 saat filter berubah
  };

  // Hitung filteredUmkm untuk total pages
  const filteredUmkm = dummyUmkm.filter((umkm) => {
    const categoryMatch =
      filters.category === "Semua" || umkm.category === filters.category;
    const locationMatch =
      filters.location.length === 0 ||
      filters.location.some((loc) => umkm.location.includes(loc));
    const yearMatch =
      filters.year === "Semua" || umkm.date.includes(filters.year);
    const tabMatch = selectedTab === "Semua" || umkm.category === selectedTab;
    const searchMatch =
      searchTerm === "" ||
      umkm.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      umkm.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      umkm.location.toLowerCase().includes(searchTerm.toLowerCase());

    return (
      categoryMatch && locationMatch && yearMatch && tabMatch && searchMatch
    );
  });

  const totalPages = Math.ceil(filteredUmkm.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-primary via-secondary to-accent py-12 px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-3">
            Direktori UMKM Indonesia
          </h1>
          <p className="text-white/90 text-lg mb-4">
            Temukan dan dukung UMKM lokal di sekitar Anda
          </p>
          {userLocation && (
            <div className="flex items-center gap-2 text-white/95">
              <FaMapMarkerAlt className="text-lg" />
              <span className="font-medium">Lokasi Anda: {userLocation}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="flex gap-6">
          {/* Filter Sidebar */}
          <UmkmFilter filters={filters} onFilterChange={handleFilterChange} />

          {/* Content Area */}
          <div className="flex-1">
            {/* Search Bar */}
            <Search
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              view={view}
              onToggle={setView}
              className="mb-6"
            />

            {/* Category Tabs */}
            <div className="mb-6">
              <UmkmTab value={selectedTab} onChange={setSelectedTab} />
            </div>

            {/* Results Count */}
            <div className="mb-4 text-muted-foreground">
              Menampilkan{" "}
              <span className="font-semibold text-foreground">
                {filteredUmkm.length}
              </span>{" "}
              UMKM
            </div>

            {/* Grid/List View */}
            {view === "grid" ? (
              <UmkmCard
                filters={filters}
                selectedTab={selectedTab}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                searchTerm={searchTerm}
              />
            ) : (
              <UmkmList
                filters={filters}
                selectedTab={selectedTab}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                searchTerm={searchTerm}
              />
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
