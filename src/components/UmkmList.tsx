import { FaCalendarAlt, FaMapMarkerAlt, FaStar } from "react-icons/fa";
import Image from "next/image";
import { dummyUmkm } from "../lib/data";

interface UmkmItem {
  category: string;
  title: string;
  date: string;
  location: string;
  image: string;
  description: string;
}

interface ListProps {
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

export default function UmkmList({
  filters,
  selectedTab,
  currentPage,
  itemsPerPage,
  searchTerm,
}: ListProps) {
  // Filter data berdasarkan filters, selectedTab dan searchTerm
  const filteredUmkm = dummyUmkm as UmkmItem[]; // Type assertion to use the new interface

  const filteredData = filteredUmkm.filter((umkm) => {
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
  const paginatedUmkm = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="space-y-4">
      {paginatedUmkm.map((umkm, idx) => (
        <div
          key={idx}
          className="flex flex-col md:flex-row bg-white rounded-lg overflow-hidden border border-gray-100 hover:border-primary/30 transition-colors cursor-pointer"
        >
          {/* Image */}
          <div className="md:w-64 relative flex-shrink-0">
            <div className="relative h-48 md:h-full bg-gray-100">
              <Image
                src={umkm.image}
                alt={umkm.title}
                width={400}
                height={300}
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
          </div>

          {/* Content */}
          <div className="flex-1 p-5 flex flex-col">
            <h3 className="text-xl font-semibold text-foreground mb-3">
              {umkm.title}
            </h3>

            <div className="space-y-2 mb-3">
              <div className="flex items-center text-muted-foreground">
                <FaCalendarAlt
                  className="mr-2 text-primary flex-shrink-0"
                  size={14}
                />
                <span className="text-sm">{umkm.date}</span>
              </div>

              <div className="flex items-center text-muted-foreground">
                <FaMapMarkerAlt
                  className="mr-2 text-primary flex-shrink-0"
                  size={14}
                />
                <span className="text-sm">{umkm.location}</span>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">
              {umkm.description}
            </p>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center gap-1">
                <FaStar className="text-yellow-400" size={16} />
                <FaStar className="text-yellow-400" size={16} />
                <FaStar className="text-yellow-400" size={16} />
                <FaStar className="text-yellow-400" size={16} />
                <FaStar className="text-gray-300" size={16} />
                <span className="text-sm text-muted-foreground ml-2">
                  (4.5)
                </span>
              </div>

              <button className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-5 rounded-md transition-colors text-sm">
                Lihat Detail
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
