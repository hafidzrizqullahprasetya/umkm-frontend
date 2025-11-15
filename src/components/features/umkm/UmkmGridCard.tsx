"use client";
import React from 'react';
import Link from 'next/link';
import { MapPin, Star } from "phosphor-react";
import { Umkm } from "@/types/umkm";

interface UmkmGridCardProps {
  umkm: Umkm;
}

const UmkmGridCard: React.FC<UmkmGridCardProps> = ({ umkm }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden h-full flex flex-col">
      {/* Image Area */}
      <Link href={`/umkm/${umkm.id}`} className="relative block">
        <div className="absolute top-2 left-2 bg-[var(--primary)] text-white px-3 py-1 rounded-md text-xs font-medium z-10">
          {umkm.type}
        </div>
        <img
          src={umkm.logo || '/images/matcha.png'}
          alt={umkm.name}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.currentTarget.src = '/images/matcha.png';
          }}
        />
      </Link>

      {/* Body Content */}
      <div className="p-4 flex-1 flex flex-col">
        <Link href={`/umkm/${umkm.id}`}>
          <h4 className="text-lg font-semibold mb-2 text-[var(--dark)] hover:text-[var(--primary)] transition-colors line-clamp-2">
            {umkm.name}
          </h4>
        </Link>

        <div className="flex items-center gap-2 mb-2">
          <MapPin size={16} weight="fill" className="text-[var(--primary)] flex-shrink-0" />
          <span className="text-sm text-gray-600 line-clamp-1">{umkm.location || 'Lokasi tidak tersedia'}</span>
        </div>

        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              weight={i < 4 ? "fill" : "regular"}
              className={i < 4 ? "text-yellow-400" : "text-gray-300"}
            />
          ))}
          <span className="text-xs text-gray-600 ml-1">(4.0)</span>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-1">
          {umkm.description || 'Deskripsi tidak tersedia'}
        </p>

        <Link
          href={`/umkm/${umkm.id}`}
          className="w-full bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white py-2 px-4 rounded-md text-center text-sm font-medium transition-colors"
        >
          Lihat Detail
        </Link>
      </div>
    </div>
  );
};

export default UmkmGridCard;
