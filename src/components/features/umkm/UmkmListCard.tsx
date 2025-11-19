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
    <div className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
      {/* Image Area */}
      <Link href={`/umkm/${umkm.id}`} className="relative md:w-64 flex-shrink-0 overflow-hidden bg-gray-50">
        {/* Category Badge - Top Left */}
        <div className="absolute top-2 left-2 z-10">
          <span className="bg-[var(--primary)] text-white px-2 py-0.5 rounded text-[10px] font-bold shadow-sm uppercase tracking-wider">
            {umkm.type}
          </span>
        </div>

        <div className="relative w-full h-48 md:h-full min-h-[180px]">
          {displayImage ? (
            <Image
              src={displayImage}
              alt={umkm.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 256px"
              quality={75}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300">
              <ImageSquare size={48} weight="thin" className="mb-2" />
              <span className="text-xs">No Image</span>
            </div>
          )}
        </div>
      </Link>

      {/* Content Area */}
      <div className="flex-1 p-4 flex flex-col md:flex-row gap-4">
        {/* Main Info */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <Link href={`/umkm/${umkm.id}`} className="block">
              <h4 className="text-lg font-bold text-[var(--dark)] group-hover:text-[var(--primary)] transition-colors line-clamp-1" title={umkm.name}>
                {umkm.name}
              </h4>
            </Link>
            
            {/* Distance Badges for Mobile (visible only on small screens) */}
            {distanceInfo && (
              <div className="flex md:hidden gap-1.5">
                <div className="flex items-center gap-1 px-1.5 py-0.5 bg-[var(--primary)]/10 text-[var(--primary)] rounded text-[10px] font-bold">
                  <NavigationArrow size={10} weight="fill" />
                  <span>{distanceInfo.distance}</span>
                </div>
                <div className="flex items-center gap-1 px-1.5 py-0.5 bg-[var(--orange)]/10 text-[var(--orange)] rounded text-[10px] font-bold">
                  <Clock size={10} weight="fill" />
                  <span>~{distanceInfo.travelTime}</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-start gap-1.5 mb-3">
            <MapPin size={16} weight="fill" className="text-[var(--primary)] flex-shrink-0 mt-0.5" />
            <span className="text-sm text-gray-500 line-clamp-1">{umkm.location || 'Lokasi tidak tersedia'}</span>
          </div>

          <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1 leading-relaxed">
            {umkm.description || 'Deskripsi tidak tersedia'}
          </p>

          <div className="flex items-center gap-3 mt-auto">
            <Link
              href={`/umkm/${umkm.id}`}
              className="inline-flex items-center justify-center bg-[var(--primary)] hover:bg-[var(--dark)] text-white py-2 px-5 rounded-lg text-xs font-semibold transition-all duration-300 hover:shadow-md active:scale-[0.98]"
            >
              Lihat Detail
            </Link>
            
            {/* Quick Stats Row */}
            <div className="flex items-center gap-3 ml-auto text-xs text-gray-500">
               {umkm.contact && (
                <div className="flex items-center gap-1" title="Telepon">
                  <Phone size={14} weight="fill" className="text-[var(--primary)]" />
                  <span className="hidden sm:inline">Ada</span>
                </div>
               )}
               <div className="flex items-center gap-1" title="Online Shop">
                  <ShoppingBag size={14} weight="fill" className="text-[var(--primary)]" />
                  <span>{umkm.online_shop?.length || 0}</span>
               </div>
               <div className="flex items-center gap-1" title="Media Sosial">
                  <ShareNetwork size={14} weight="fill" className="text-[var(--primary)]" />
                  <span>{umkm.media_sosial?.length || 0}</span>
               </div>
            </div>
          </div>
        </div>

        {/* Info Card (Desktop Only) */}
        {distanceInfo && (
          <div className="hidden md:flex w-40 flex-shrink-0 flex-col gap-2 justify-center border-l border-gray-100 pl-4">
            <div className="p-3 bg-[var(--primary)] text-white rounded-lg shadow-sm text-center">
              <NavigationArrow size={20} weight="fill" className="mx-auto mb-1" />
              <p className="text-sm font-bold">{distanceInfo.distance}</p>
              <p className="text-[10px] opacity-90">dari UGM</p>
            </div>
            <div className="p-3 bg-[var(--orange)] text-white rounded-lg shadow-sm text-center">
              <Clock size={20} weight="fill" className="mx-auto mb-1" />
              <p className="text-sm font-bold">~{distanceInfo.travelTime}</p>
              <p className="text-[10px] opacity-90">estimasi</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UmkmListCard;
