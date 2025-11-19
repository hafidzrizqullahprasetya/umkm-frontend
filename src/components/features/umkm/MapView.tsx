"use client";

import { useState, useCallback } from 'react';
import { APIProvider, Map, AdvancedMarker, InfoWindow, Marker } from '@vis.gl/react-google-maps';
import { Umkm } from '@/types/umkm';
import { MapPin, Phone, Storefront, X, NavigationArrow, User } from 'phosphor-react';
import Link from 'next/link';
import { DEFAULT_LOCATION } from '@/lib/location';

interface MapViewProps {
  allUmkm: Umkm[];
}

export default function MapView({ allUmkm }: MapViewProps) {
  const [selectedUmkm, setSelectedUmkm] = useState<Umkm | null>(null);
  const [hoveredUmkm, setHoveredUmkm] = useState<number | null>(null);
  // Default to UGM Yogyakarta
  const [mapCenter, setMapCenter] = useState({ lat: DEFAULT_LOCATION.lat, lng: DEFAULT_LOCATION.lng });
  const [mapZoom, setMapZoom] = useState(13);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  // Filter UMKM that have coordinates
  const umkmWithCoordinates = allUmkm.filter(
    (umkm) => umkm.lat !== undefined && umkm.lng !== undefined
  );

  const handleMarkerClick = (umkm: Umkm) => {
    setSelectedUmkm(umkm);
    setMapCenter({ lat: umkm.lat!, lng: umkm.lng! });
  };

  const handleListItemClick = (umkm: Umkm) => {
    if (umkm.lat && umkm.lng) {
      setMapCenter({ lat: umkm.lat, lng: umkm.lng });
      setMapZoom(15);
      setSelectedUmkm(umkm);
    }
  };

  if (!apiKey) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <MapPin size={64} weight="bold" className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Google Maps API Key belum dikonfigurasi
          </h3>
          <p className="text-sm text-gray-500">
            Silakan tambahkan NEXT_PUBLIC_GOOGLE_MAPS_API_KEY di file .env.local
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-200px)] bg-white rounded-lg shadow-md overflow-hidden">
      {/* Left Sidebar - UMKM List */}
      <div className="w-96 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
          <h3 className="text-lg font-bold text-[var(--dark)] flex items-center gap-2">
            <Storefront size={24} weight="bold" className="text-[var(--primary)]" />
            Daftar UMKM ({umkmWithCoordinates.length})
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Klik untuk lihat lokasi di peta
          </p>
        </div>

        <div className="divide-y divide-gray-100">
          {umkmWithCoordinates.map((umkm) => (
            <div
              key={umkm.id}
              onClick={() => handleListItemClick(umkm)}
              onMouseEnter={() => setHoveredUmkm(umkm.id)}
              onMouseLeave={() => setHoveredUmkm(null)}
              className={`p-3 cursor-pointer transition-all border-b border-gray-50 hover:bg-gray-50 ${
                selectedUmkm?.id === umkm.id ? 'bg-[var(--primary)]/5 border-l-4 border-l-[var(--primary)]' : 'border-l-4 border-l-transparent'
              }`}
            >
              <div className="flex gap-3">
                {/* Image */}
                <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 relative">
                  {(umkm.logo || umkm.images?.[0]) ? (
                    <img
                      src={umkm.logo || umkm.images?.[0]}
                      alt={umkm.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const placeholder = e.currentTarget.parentElement;
                        if (placeholder) {
                          placeholder.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-300"><svg width="24" height="24" fill="currentColor"><use href="#icon-storefront" /></svg></div>';
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <Storefront size={24} weight="thin" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className={`font-bold text-sm line-clamp-1 ${selectedUmkm?.id === umkm.id ? 'text-[var(--primary)]' : 'text-[var(--dark)]'}`}>
                      {umkm.name}
                    </h4>
                    <span className="px-1.5 py-0.5 bg-primary text-white text-[10px] font-bold rounded uppercase tracking-wider flex-shrink-0">
                      {umkm.type}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-start gap-1.5 text-xs text-gray-500">
                      <MapPin size={14} weight="fill" className="text-[var(--primary)] mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-1">{umkm.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {umkmWithCoordinates.length === 0 && (
          <div className="text-center py-12 px-4">
            <MapPin size={48} weight="bold" className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">
              Belum ada UMKM dengan koordinat lokasi
            </p>
          </div>
        )}
      </div>

      {/* Right Side - Google Maps */}
      <div className="flex-1 relative">
        <APIProvider apiKey={apiKey}>
          <Map
            mapId="umkm-map"
            defaultCenter={mapCenter}
            defaultZoom={mapZoom}
            gestureHandling="greedy"
            disableDefaultUI={false}
            clickableIcons={true}
            style={{ width: '100%', height: '100%' }}
            zoomControl={true}
            mapTypeControl={true}
            streetViewControl={true}
            fullscreenControl={true}
          >
            {/* User Location Marker (UGM) */}
            <AdvancedMarker
              position={{ lat: DEFAULT_LOCATION.lat, lng: DEFAULT_LOCATION.lng }}
              title="Lokasi Anda (UGM)"
            >
              <div className="relative">
                {/* Pulse animation background */}
                <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75" style={{ width: '40px', height: '40px', marginLeft: '-8px', marginTop: '-8px' }}></div>

                {/* Main marker */}
                <div className="relative bg-blue-500 rounded-full p-2 border-4 border-white shadow-lg">
                  <User size={24} weight="fill" className="text-white" />
                </div>
              </div>
            </AdvancedMarker>
            {umkmWithCoordinates.map((umkm) => (
              <AdvancedMarker
                key={umkm.id}
                position={{ lat: umkm.lat!, lng: umkm.lng! }}
                onClick={() => handleMarkerClick(umkm)}
              >
                <div
                  className={`relative transition-transform ${
                    selectedUmkm?.id === umkm.id || hoveredUmkm === umkm.id
                      ? 'scale-125 z-10'
                      : 'scale-100'
                  }`}
                >
                  {/* Custom Marker */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg cursor-pointer transition-all ${
                      selectedUmkm?.id === umkm.id
                        ? 'bg-[var(--orange)] ring-4 ring-white'
                        : 'bg-[var(--primary)] hover:bg-[var(--orange)]'
                    }`}
                  >
                    <Storefront size={20} weight="bold" className="text-white" />
                  </div>

                  {/* Marker Pin */}
                  <div
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent ${
                      selectedUmkm?.id === umkm.id
                        ? 'border-t-[var(--orange)]'
                        : 'border-t-[var(--primary)]'
                    }`}
                  />
                </div>
              </AdvancedMarker>
            ))}

            {/* Info Window */}
            {selectedUmkm && selectedUmkm.lat && selectedUmkm.lng && (
              <InfoWindow
                position={{ lat: selectedUmkm.lat, lng: selectedUmkm.lng }}
                onCloseClick={() => setSelectedUmkm(null)}
                headerContent={
                  <div className="font-bold text-[var(--dark)] px-2 pt-2">
                    {selectedUmkm.name}
                  </div>
                }
              >
                <div className="p-2 max-w-xs">
                  {/* Image */}
                  <div className="w-full h-32 rounded-lg overflow-hidden bg-gray-100 mb-3 flex items-center justify-center">
                    {(selectedUmkm.logo || selectedUmkm.images?.[0]) ? (
                      <img
                        src={selectedUmkm.logo || selectedUmkm.images?.[0]}
                        alt={selectedUmkm.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const placeholder = e.currentTarget.parentElement;
                          if (placeholder) {
                            placeholder.innerHTML = '<div class="flex flex-col items-center"><svg width="48" height="48" fill="#9CA3AF" class="mb-1"></svg><p class="text-xs text-gray-400">Tidak ada gambar</p></div>';
                          }
                        }}
                      />
                    ) : (
                      <div className="flex flex-col items-center">
                        <Storefront size={48} weight="thin" className="text-gray-400 mb-1" />
                        <p className="text-xs text-gray-400">Tidak ada gambar</p>
                      </div>
                    )}
                  </div>

                  {/* Category */}
                  <div className="mb-2">
                    <span className="px-2 py-1 bg-primary text-white text-xs font-semibold rounded">
                      {selectedUmkm.type}
                    </span>
                  </div>

                  {/* Description */}
                  {selectedUmkm.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {selectedUmkm.description}
                    </p>
                  )}

                  {/* Location */}
                  <div className="flex items-start gap-2 text-sm text-gray-700 mb-2">
                    <MapPin size={16} weight="fill" className="text-[var(--primary)] mt-0.5 flex-shrink-0" />
                    <span className="text-xs">{selectedUmkm.location}</span>
                  </div>

                  {/* Contact */}
                  {selectedUmkm.contact && (
                    <div className="flex items-center gap-2 text-sm text-gray-700 mb-3">
                      <Phone size={16} weight="fill" className="text-[var(--primary)] flex-shrink-0" />
                      <span className="text-xs">{selectedUmkm.contact}</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      href={`/umkm/${selectedUmkm.id}`}
                      className="flex-1 px-3 py-2 bg-[var(--primary)] text-white rounded-lg text-center text-sm font-semibold hover:bg-[var(--dark)] transition-colors"
                    >
                      Lihat Detail
                    </Link>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${selectedUmkm.lat},${selectedUmkm.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 bg-[var(--secondary)] text-[var(--dark)] rounded-lg text-center text-sm font-semibold hover:bg-[var(--orange)] hover:text-white transition-colors flex items-center gap-1"
                    >
                      <NavigationArrow size={16} weight="bold" />
                      Rute
                    </a>
                  </div>
                </div>
              </InfoWindow>
            )}
          </Map>
        </APIProvider>

        {/* Legend */}
        <div className="absolute bottom-6 left-6 bg-white rounded-lg shadow-lg p-4">
          <h4 className="text-sm font-bold text-[var(--dark)] mb-2">Legenda</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[var(--primary)] flex items-center justify-center">
                <Storefront size={14} weight="bold" className="text-white" />
              </div>
              <span className="text-xs text-gray-600">Lokasi UMKM</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[var(--orange)] flex items-center justify-center ring-2 ring-gray-300">
                <Storefront size={14} weight="bold" className="text-white" />
              </div>
              <span className="text-xs text-gray-600">UMKM Terpilih</span>
            </div>
          </div>
        </div>

        {/* Stats Badge */}
        <div className="absolute top-6 left-6 bg-white rounded-lg shadow-lg px-4 py-2">
          <div className="flex items-center gap-2">
            <MapPin size={20} weight="bold" className="text-[var(--primary)]" />
            <div>
              <div className="text-xs text-gray-500">Total Lokasi</div>
              <div className="text-lg font-bold text-[var(--dark)]">{umkmWithCoordinates.length}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
