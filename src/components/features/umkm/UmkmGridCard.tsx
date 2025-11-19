"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  ImageSquare,
  NavigationArrow,
  Clock,
  Phone,
} from "phosphor-react";
import { Umkm } from "@/types/umkm";
import { getDistanceInfo } from "@/lib/location";

interface UmkmGridCardProps {
  umkm: Umkm;
  isFirst?: boolean;
}

const UmkmGridCard: React.FC<UmkmGridCardProps> = ({
  umkm,
  isFirst = false,
}) => {
  const getDisplayImage = () => {
    if (umkm.logo) return umkm.logo;
    if (umkm.umkm_galeri && umkm.umkm_galeri.length > 0) {
      const firstGallery = umkm.umkm_galeri[0];
      return (firstGallery as any).img_url || (firstGallery as any).url;
    }
    return null;
  };

  const displayImage = getDisplayImage();

  const distanceInfo = getDistanceInfo(umkm.gmaps, umkm.location);

  return (
    <div
      className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col hover:shadow-md transition-all duration-300 hover:-translate-y-1"
      {...(isFirst && { "data-tour": "umkm-card" })}
    >
      {/* Image Area */}
      <Link
        href={`/umkm/${umkm.id}`}
        className="relative block w-full h-40 overflow-hidden bg-gray-50"
      >
        {/* Category Badge - Top Left */}
        <div className="absolute top-2 left-2 z-10">
          <span className="bg-[var(--primary)] text-white px-2 py-0.5 rounded text-[10px] font-bold shadow-sm uppercase tracking-wider">
            {umkm.type}
          </span>
        </div>

        {/* Distance & Time Badges - Bottom */}
        {distanceInfo && (
          <div className="absolute bottom-2 left-2 right-2 flex gap-1.5 z-10">
            <div className="flex items-center gap-1 px-2 py-1 bg-[var(--primary)] text-white rounded text-[10px] font-bold shadow-md">
              <NavigationArrow size={12} weight="fill" className="text-white" />
              <span>{distanceInfo.distance}</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-[var(--orange)] text-white rounded text-[10px] font-bold shadow-md">
              <Clock size={12} weight="fill" className="text-white" />
              <span>~{distanceInfo.travelTime}</span>
            </div>
          </div>
        )}

        {displayImage ? (
          <Image
            src={displayImage}
            alt={umkm.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={75}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300">
            <ImageSquare size={40} weight="thin" className="mb-1" />
            <span className="text-[10px]">No Image</span>
          </div>
        )}
      </Link>

      {/* Body Content */}
      <div className="p-3 flex-1 flex flex-col">
        <Link href={`/umkm/${umkm.id}`} className="block mb-1">
          <h4
            className="text-sm font-bold text-[var(--dark)] group-hover:text-[var(--primary)] transition-colors line-clamp-1"
            title={umkm.name}
          >
            {umkm.name}
          </h4>
        </Link>

        <div className="flex flex-col gap-1 mb-2">
          <div className="flex items-start gap-1.5">
            <MapPin
              size={14}
              weight="fill"
              className="text-[var(--primary)] flex-shrink-0 mt-0.5"
            />
            <span className="text-xs text-gray-500 line-clamp-1 leading-tight">
              {umkm.location || "Lokasi tidak tersedia"}
            </span>
          </div>
          {umkm.contact && (
            <div className="flex items-center gap-1.5">
              <Phone
                size={14}
                weight="fill"
                className="text-[var(--primary)] flex-shrink-0"
              />
              <span className="text-xs text-gray-500 line-clamp-1">
                {umkm.contact}
              </span>
            </div>
          )}
        </div>

        <p className="text-xs text-gray-600 line-clamp-2 mb-3 flex-1 leading-relaxed">
          {umkm.description || "Deskripsi tidak tersedia"}
        </p>

        <Link
          href={`/umkm/${umkm.id}`}
          className="w-full bg-[var(--primary)] hover:bg-[var(--dark)] text-white py-2 rounded-lg text-center text-xs font-semibold transition-all duration-300 hover:shadow-md active:scale-[0.98]"
        >
          Lihat Detail
        </Link>
      </div>
    </div>
  );
};

export default UmkmGridCard;
