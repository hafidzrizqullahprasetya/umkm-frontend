"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, ShoppingBag, ShareNetwork, ImageSquare, NavigationArrow, Clock } from "phosphor-react";
import { Umkm } from "@/types/umkm";
import { getDistanceInfo } from "@/lib/location";

interface UmkmListCardProps {
  umkm: Umkm;
}

const UmkmListCard: React.FC<UmkmListCardProps> = ({ umkm }) => {
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
    <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col md:flex-row group hover:shadow-lg transition-all duration-300">
      {/* Image Area */}
      <Link href={`/umkm/${umkm.id}`} className="relative md:w-80 flex-shrink-0 overflow-hidden">
        {/* Category Badge - Top Left */}
        <div className="absolute top-2 left-2 bg-[var(--primary)] text-white px-3 py-1 rounded-md text-xs font-bold z-10 shadow-md">
          {umkm.type}
        </div>

        <div className="relative w-full h-56 bg-gray-100 overflow-hidden">
          {displayImage ? (
            <Image
              src={displayImage}
              alt={umkm.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 320px"
              quality={75}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <ImageSquare size={80} weight="thin" className="text-gray-400 mb-2" />
              <p className="text-sm text-gray-400">Tidak ada gambar</p>
            </div>
          )}
        </div>
      </Link>

      {/* Content Area */}
      <div className="flex-1 p-6 flex flex-col md:flex-row gap-4">
        {/* Main Info */}
        <div className="flex-1 flex flex-col">
          <Link href={`/umkm/${umkm.id}`}>
            <h4 className="text-xl font-semibold mb-2 text-[var(--dark)] group-hover:text-[var(--primary)] transition-colors line-clamp-1">
              {umkm.name}
            </h4>
          </Link>

          <div className="flex items-center gap-2 mb-3">
            <MapPin size={18} weight="fill" className="text-[var(--primary)] flex-shrink-0" />
            <span className="text-sm text-gray-600 line-clamp-1">{umkm.location || 'Lokasi tidak tersedia'}</span>
          </div>

          <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
            {umkm.description || 'Deskripsi tidak tersedia'}
          </p>

          <Link
            href={`/umkm/${umkm.id}`}
            className="inline-block bg-[var(--primary)] hover:bg-[var(--dark)] text-white py-2.5 px-6 rounded-md text-sm font-medium transition-all duration-300 hover:shadow-md w-fit"
          >
            Lihat Detail
          </Link>
        </div>

        {/* Info Card */}
        <div className="md:w-48 flex-shrink-0 bg-gray-50 rounded-lg p-4 flex flex-col gap-3 h-fit">
          <h6 className="font-semibold text-sm text-[var(--dark)] mb-1">Informasi Kontak</h6>

          {umkm.contact && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600 flex items-center gap-1">
                <Phone size={14} weight="fill" className="text-[var(--primary)]" />
                Telepon
              </span>
              <span className="font-medium text-gray-800">Ada</span>
            </div>
          )}

          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600 flex items-center gap-1">
              <ShoppingBag size={14} weight="fill" className="text-[var(--primary)]" />
              Online Shop
            </span>
            <span className="font-medium text-gray-800">{umkm.online_shop?.length || 0}</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600 flex items-center gap-1">
              <ShareNetwork size={14} weight="fill" className="text-[var(--primary)]" />
              Media Sosial
            </span>
            <span className="font-medium text-gray-800">{umkm.media_sosial?.length || 0}</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600 flex items-center gap-1">
              <ImageSquare size={14} weight="fill" className="text-[var(--primary)]" />
              Galeri Foto
            </span>
            <span className="font-medium text-gray-800">{umkm.umkm_galeri?.length || 0}</span>
          </div>

          {/* Distance & Time Info */}
          {distanceInfo && (
            <>
              <div className="border-t border-gray-200 my-2"></div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-[var(--primary)]/10 to-[var(--primary)]/5 rounded-md border border-[var(--primary)]/20">
                  <NavigationArrow size={16} weight="fill" className="text-[var(--primary)] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[var(--primary)] truncate">{distanceInfo.distance}</p>
                    <p className="text-xs text-gray-500">dari UGM</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-[var(--orange)]/10 to-[var(--orange)]/5 rounded-md border border-[var(--orange)]/20">
                  <Clock size={16} weight="fill" className="text-[var(--orange)] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[var(--orange)] truncate">~{distanceInfo.travelTime}</p>
                    <p className="text-xs text-gray-500">estimasi</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UmkmListCard;
