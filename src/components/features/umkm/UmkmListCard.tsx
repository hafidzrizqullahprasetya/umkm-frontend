"use client";
import React from 'react';
import Link from 'next/link';
import { MapPin, Star, Phone, ShoppingBag, ShareNetwork, ImageSquare } from "phosphor-react";
import { Umkm } from "@/types/umkm";

interface UmkmListCardProps {
  umkm: Umkm;
}

const UmkmListCard: React.FC<UmkmListCardProps> = ({ umkm }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col md:flex-row">
      {/* Image Area */}
      <Link href={`/umkm/${umkm.id}`} className="relative md:w-1/3 flex-shrink-0">
        <div className="absolute top-2 left-2 bg-[var(--primary)] text-white px-3 py-1 rounded-md text-xs font-medium z-10">
          {umkm.type}
        </div>
        <img
          src={umkm.logo || '/images/matcha.png'}
          alt={umkm.name}
          className="w-full h-48 md:h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = '/images/matcha.png';
          }}
        />
      </Link>

      {/* Content Area */}
      <div className="flex-1 p-4 md:p-6 flex flex-col md:flex-row gap-4">
        {/* Main Info */}
        <div className="flex-1">
          <Link href={`/umkm/${umkm.id}`}>
            <h4 className="text-xl font-semibold mb-2 text-[var(--dark)] hover:text-[var(--primary)] transition-colors">
              {umkm.name}
            </h4>
          </Link>

          <div className="flex items-center gap-2 mb-2">
            <MapPin size={18} weight="fill" className="text-[var(--primary)] flex-shrink-0" />
            <span className="text-sm text-gray-600">{umkm.location || 'Lokasi tidak tersedia'}</span>
          </div>

          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                weight={i < 4 ? "fill" : "regular"}
                className={i < 4 ? "text-yellow-400" : "text-gray-300"}
              />
            ))}
            <span className="text-sm text-gray-600 ml-1">(4.0)</span>
          </div>

          <p className="text-sm text-gray-600 mb-4 line-clamp-3">
            {umkm.description || 'Deskripsi tidak tersedia'}
          </p>

          <Link
            href={`/umkm/${umkm.id}`}
            className="inline-block bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white py-2 px-6 rounded-md text-sm font-medium transition-colors"
          >
            Lihat Detail
          </Link>
        </div>

        {/* Info Card */}
        <div className="md:w-48 bg-gray-50 rounded-lg p-4 flex flex-col gap-3">
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
        </div>
      </div>
    </div>
  );
};

export default UmkmListCard;
