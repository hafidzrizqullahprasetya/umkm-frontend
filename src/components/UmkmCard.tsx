import Image from "next/image";
import { Calendar, MapPin } from "lucide-react";
import { dummyUmkm } from "../lib/data";

interface CardProps {
  filters: {
    category: string;
    location: string[];
    year: string;
  };
  selectedTab: string;
  currentPage: number;
  itemsPerPage: number;
  searchTerm: string;
}

export default function UmkmCard({
  filters,
  selectedTab,
  currentPage,
  itemsPerPage,
  searchTerm,
}: CardProps) {
  // Filter data berdasarkan filters, selectedTab dan searchTerm
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
      umkm.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      umkm.description.toLowerCase().includes(searchTerm.toLowerCase());

    return (
      categoryMatch && locationMatch && yearMatch && tabMatch && searchMatch
    );
  });

  // Paginate data
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUmkm = filteredUmkm.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {paginatedUmkm.map((umkm, idx) => (
        <div
          key={idx}
          className="group relative rounded-lg overflow-hidden bg-white border border-gray-100 hover:border-primary/30 transition-colors cursor-pointer"
        >
          {/* Image Container */}
          <div className="relative h-48 overflow-hidden bg-gray-100">
            <Image
              src={umkm.image}
              alt={umkm.title}
              width={600}
              height={256}
              className="w-full h-full object-cover"
              priority={idx === 0}
            />
            {/* Category Badge */}
            <div className="absolute top-3 left-3">
              <span className="bg-primary text-white text-xs font-medium px-3 py-1.5 rounded-md">
                {umkm.category}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="text-lg font-semibold text-foreground mb-3 line-clamp-1">
              {umkm.title}
            </h3>

            <div className="space-y-2 mb-3">
              <div className="flex items-center text-muted-foreground text-sm">
<Calendar className="mr-1" />
                <span>{umkm.date}</span>
              </div>
              <div className="flex items-center text-muted-foreground text-sm">
<MapPin className="mr-1" />
                <span>{umkm.location}</span>
              </div>
            </div>

            <p className="text-gray-600 text-sm line-clamp-2 mb-4">
              {umkm.description}
            </p>

            {/* Action Button */}
            <button className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2.5 rounded-md transition-colors text-sm">
              Lihat Detail
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
