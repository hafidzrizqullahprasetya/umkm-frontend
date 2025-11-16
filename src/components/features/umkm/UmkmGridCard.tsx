"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, ImageSquare, NavigationArrow, Clock } from "phosphor-react";
import { Umkm } from "@/types/umkm";
import { getDistanceInfo } from "@/lib/location";

interface UmkmGridCardProps {
  umkm: Umkm;
}

const UmkmGridCard: React.FC<UmkmGridCardProps> = ({ umkm }) => {
  // Get display image: logo first, then first gallery image, then placeholder
  const getDisplayImage = () => {
    if (umkm.logo) return umkm.logo;
    if (umkm.umkm_galeri && umkm.umkm_galeri.length > 0) {
      const firstGallery = umkm.umkm_galeri[0];
      return (firstGallery as any).img_url || (firstGallery as any).url;
    }
    return null;
  };

  const displayImage = getDisplayImage();

  // Get distance and travel time info from gmaps URL
  const distanceInfo = getDistanceInfo(umkm.gmaps, umkm.location);

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden h-full flex flex-col group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Image Area */}
      <Link href={`/umkm/${umkm.id}`} className="relative block overflow-hidden">
        {/* Category Badge - Top Left */}
        <div className="absolute top-2 left-2 bg-[var(--primary)] text-white px-3 py-1 rounded-md text-xs font-bold z-10 shadow-md">
          {umkm.type}
        </div>

        {/* Distance & Time Badges - Bottom of Image */}
        {distanceInfo && (
          <div className="absolute bottom-2 left-2 right-2 flex gap-2 z-10">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--primary)] text-white rounded-md shadow-lg backdrop-blur-sm">
              <NavigationArrow size={14} weight="fill" className="text-white" />
              <span className="text-xs font-bold">{distanceInfo.distance}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--orange)] text-white rounded-md shadow-lg backdrop-blur-sm">
              <Clock size={14} weight="fill" className="text-white" />
              <span className="text-xs font-bold">~{distanceInfo.travelTime}</span>
            </div>
          </div>
        )}

        <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
          {displayImage ? (
            <Image
              src={displayImage}
              alt={umkm.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              quality={75}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <ImageSquare size={64} weight="thin" className="text-gray-400 mb-2" />
              <p className="text-sm text-gray-400">Tidak ada gambar</p>
            </div>
          )}
        </div>
      </Link>

      {/* Body Content */}
      <div className="p-4 flex-1 flex flex-col">
        <Link href={`/umkm/${umkm.id}`}>
          <h4 className="text-lg font-semibold mb-2 text-[var(--dark)] group-hover:text-[var(--primary)] transition-colors line-clamp-2">
            {umkm.name}
          </h4>
        </Link>

        <div className="flex items-center gap-2 mb-2">
          <MapPin size={16} weight="fill" className="text-[var(--primary)] flex-shrink-0" />
          <span className="text-sm text-gray-600 line-clamp-1">{umkm.location || 'Lokasi tidak tersedia'}</span>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-1">
          {umkm.description || 'Deskripsi tidak tersedia'}
        </p>

        <Link
          href={`/umkm/${umkm.id}`}
          className="w-full bg-[var(--primary)] hover:bg-[var(--dark)] text-white py-2.5 px-4 rounded-md text-center text-sm font-medium transition-all duration-300 hover:shadow-md"
        >
          Lihat Detail
        </Link>
      </div>
    </div>
  );
};

export default UmkmGridCard;
