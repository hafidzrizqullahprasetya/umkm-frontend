"use client";

import { useState, useRef, useEffect } from 'react';
import { MapPin, Phone, Globe, ShoppingBag, At, InstagramLogo, FacebookLogo, TiktokLogo, TwitterLogo, ImageSquare, X, CaretLeft, CaretRight } from "phosphor-react";
import Header from "@/components/shared/header/Header";
import Footer from "@/components/shared/Footer";
import { Umkm } from "@/types/umkm";
import Link from 'next/link';

interface UMKMDetailPageProps {
  umkm: Umkm;
  allUmkm?: Umkm[];
  allCategories?: string[];
  user?: any;
}

const UMKMDetailPage = ({ umkm, allUmkm = [], allCategories = [], user }: UMKMDetailPageProps) => {
  // Collect all images (logo + gallery)
  const getAllImages = () => {
    const images: string[] = [];
    if (umkm.logo) images.push(umkm.logo);
    if (umkm.umkm_galeri && umkm.umkm_galeri.length > 0) {
      umkm.umkm_galeri.forEach((item: any) => {
        const url = item.img_url || item.url;
        if (url) images.push(url);
      });
    }
    return images;
  };

  const allImages = getAllImages();
  const [activeImage, setActiveImage] = useState(allImages[0] || '');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);

  const handleImageClick = (imageUrl: string, index: number) => {
    setActiveImage(imageUrl);
    setActiveImageIndex(index);
  };

  const openFullscreen = (index: number) => {
    setFullscreenIndex(index);
    setShowFullscreen(true);
  };

  const closeFullscreen = () => {
    setShowFullscreen(false);
  };

  const nextFullscreenImage = () => {
    setFullscreenIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevFullscreenImage = () => {
    setFullscreenIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const scrollThumbnails = (direction: 'left' | 'right') => {
    if (thumbnailContainerRef.current) {
      const scrollAmount = 200;
      thumbnailContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Keyboard navigation for fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showFullscreen) {
        if (e.key === 'ArrowLeft') prevFullscreenImage();
        if (e.key === 'ArrowRight') nextFullscreenImage();
        if (e.key === 'Escape') closeFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showFullscreen]);

  const getSocialIcon = (type: string) => {
    switch (type) {
      case 'Instagram': return <InstagramLogo size={20} />;
      case 'Facebook': return <FacebookLogo size={20} />;
      case 'TikTok': return <TiktokLogo size={20} />;
      case 'X': return <TwitterLogo size={20} />;
      default: return <Globe size={20} />;
    }
  };

  const getOnlineShopIcon = (type: string) => {
    // Simple mapping, can be expanded
    switch (type.toLowerCase()) {
      case 'tokopedia': return <ShoppingBag size={20} />;
      case 'shopee': return <ShoppingBag size={20} />;
      default: return <ShoppingBag size={20} />;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] pt-32">
      <Header
        user={user}
        umkmName={umkm.name}
        allUmkm={allUmkm}
        allCategories={allCategories}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Top Card */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-[var(--border)] mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Image */}
            <div className="md:col-span-1">
              {/* Main Image */}
              <div
                className="rounded-lg overflow-hidden bg-gray-100 border border-[var(--border)] h-64 flex items-center justify-center cursor-pointer"
                onClick={() => activeImage && openFullscreen(activeImageIndex)}
              >
                {activeImage ? (
                  <img
                    src={activeImage}
                    alt={umkm.name}
                    className="w-full h-full object-cover hover:opacity-95 transition-opacity"
                  />
                ) : (
                  <div className="text-center p-4">
                    <ImageSquare size={80} weight="thin" className="text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-400">Tidak ada gambar</p>
                  </div>
                )}
              </div>

              {/* Thumbnail Slider */}
              {allImages.length > 1 && (
                <div className="mt-3 relative">
                  {/* Left Arrow */}
                  <button
                    onClick={() => scrollThumbnails('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-1.5 shadow-md transition-all"
                  >
                    <CaretLeft size={16} weight="bold" />
                  </button>

                  {/* Thumbnails Container */}
                  <div
                    ref={thumbnailContainerRef}
                    className="flex gap-2 overflow-x-auto scrollbar-hide px-8"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {allImages.map((img, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleImageClick(img, idx)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                          activeImageIndex === idx
                            ? 'border-[var(--primary)] ring-2 ring-[var(--primary)]/30'
                            : 'border-gray-200 hover:border-[var(--primary)]/50'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`Thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Right Arrow */}
                  <button
                    onClick={() => scrollThumbnails('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-1.5 shadow-md transition-all"
                  >
                    <CaretRight size={16} weight="bold" />
                  </button>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="md:col-span-2 flex flex-col justify-between">
              <div>
                <span className="px-4 py-1.5 bg-primary text-white text-sm font-bold rounded-full">
                  {umkm.type}
                </span>
                <h1 className="text-4xl font-bold text-[var(--dark)] mt-4 mb-2">
                  {umkm.name}
                </h1>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {umkm.description || 'Deskripsi UMKM tidak tersedia.'}
                </p>
              </div>

              {/* Contact & Links */}
              <div>
                <h3 className="text-lg font-semibold text-[var(--dark)] mb-3">Kontak & Tautan</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {/* Contact */}
                  {umkm.contact && (
                    <a href={`tel:${umkm.contact}`} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 transition-colors">
                      <Phone size={20} className="text-[var(--primary)]" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">Telepon</p>
                        <p className="text-xs text-gray-500">{umkm.contact}</p>
                      </div>
                    </a>
                  )}
                  {/* Social Media */}
                  {umkm.media_sosial?.map((social, idx) => (
                    <a key={`social-${idx}`} href={social.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 transition-colors">
                      <div className="text-[var(--primary)]">{getSocialIcon(social.type)}</div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{social.type}</p>
                        <p className="text-xs text-gray-500 truncate max-w-[100px]">{social.url.replace('https://', '').replace('www.','')}</p>
                      </div>
                    </a>
                  ))}
                  {/* Online Shops */}
                  {umkm.online_shop?.map((shop, idx) => (
                     <a key={`shop-${idx}`} href={shop.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 transition-colors">
                      <div className="text-[var(--primary)]">{getOnlineShopIcon(shop.type)}</div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{shop.type}</p>
                        <p className="text-xs text-gray-500 truncate max-w-[100px]">{shop.url.replace('https://', '').replace('www.','')}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        {umkm.umkm_galeri && umkm.umkm_galeri.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6 border border-[var(--border)] mb-8">
            <h3 className="text-lg font-semibold text-[var(--dark)] mb-6">Galeri UMKM</h3>
            <div className="space-y-6">
              {(() => {
                // Group images by section
                const groupedGallery = umkm.umkm_galeri.reduce((acc: any, item: any) => {
                  const section = item.section || 'Galeri';
                  if (!acc[section]) {
                    acc[section] = [];
                  }
                  acc[section].push(item);
                  return acc;
                }, {});

                return Object.entries(groupedGallery).map(([section, items]: [string, any]) => (
                  <div key={section}>
                    <h4 className="text-md font-semibold text-gray-700 mb-3">{section}</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {items.map((item: any, idx: number) => {
                        const imageUrl = item.img_url || item.url;
                        const imageIndex = allImages.indexOf(imageUrl);
                        return imageUrl ? (
                          <div
                            key={idx}
                            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity border border-[var(--border)]"
                            onClick={() => {
                              handleImageClick(imageUrl, imageIndex);
                              openFullscreen(imageIndex);
                            }}
                          >
                            <img
                              src={imageUrl}
                              alt={`${section} ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div
                            key={idx}
                            className="relative aspect-square rounded-lg overflow-hidden border border-[var(--border)] bg-gray-100 flex items-center justify-center"
                          >
                            <div className="text-center">
                              <ImageSquare size={32} weight="thin" className="text-gray-400 mx-auto mb-1" />
                              <p className="text-xs text-gray-400">Tidak ada gambar</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>
        )}

        {/* Bottom Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Location Map */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md overflow-hidden border border-[var(--border)]">
            <div className="p-4 bg-white border-b border-[var(--border)]">
              <h3 className="text-lg font-semibold text-[var(--dark)] flex items-center gap-2">
                <MapPin size={20} weight="fill" className="text-[var(--primary)]" />
                Lokasi UMKM
              </h3>
            </div>
            {umkm.location ? (
              <div className="relative h-96 w-full">
                <iframe
                  src={`https://www.google.com/maps?q=${encodeURIComponent(umkm.location)}&output=embed`}
                  width="100%"
                  height="100%"
                  className="border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                <p>Lokasi tidak tersedia.</p>
              </div>
            )}
          </div>

          {/* Stats Card */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-md p-6 border border-[var(--border)]">
            <h3 className="text-lg font-semibold text-[var(--dark)] mb-4">Statistik UMKM</h3>
            <div className="space-y-4">
              <div className="bg-[var(--background)] p-4 rounded-lg flex items-center justify-between">
                <p className="font-medium text-gray-700">Online Shop</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{umkm.online_shop?.length || 0}</p>
              </div>
              <div className="bg-[var(--background)] p-4 rounded-lg flex items-center justify-between">
                <p className="font-medium text-gray-700">Media Sosial</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{umkm.media_sosial?.length || 0}</p>
              </div>
              <div className="bg-[var(--background)] p-4 rounded-lg flex items-center justify-between">
                <p className="font-medium text-gray-700">Foto Galeri</p>
                <p className="text-2xl font-bold text-[var(--primary)]">{umkm.umkm_galeri?.length || 0}</p>
              </div>
            </div>
            <div className="mt-6">
              <Link
                href="/umkm"
                className="block w-full text-center bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white py-3 rounded-lg font-medium transition-colors"
              >
                Kembali ke Daftar UMKM
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Fullscreen Modal */}
      {showFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={closeFullscreen}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-all z-50"
          >
            <X size={24} weight="bold" />
          </button>

          {/* Previous Button */}
          {allImages.length > 1 && (
            <button
              onClick={prevFullscreenImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-all z-50"
            >
              <CaretLeft size={32} weight="bold" />
            </button>
          )}

          {/* Image */}
          <div className="max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center p-8">
            <img
              src={allImages[fullscreenIndex]}
              alt={`Fullscreen ${fullscreenIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Next Button */}
          {allImages.length > 1 && (
            <button
              onClick={nextFullscreenImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-all z-50"
            >
              <CaretRight size={32} weight="bold" />
            </button>
          )}

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
            {fullscreenIndex + 1} / {allImages.length}
          </div>

          {/* Thumbnail Strip */}
          {allImages.length > 1 && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 max-w-4xl">
              <div className="flex gap-2 overflow-x-auto px-4 py-2 bg-black/30 rounded-lg backdrop-blur-sm">
                {allImages.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setFullscreenIndex(idx)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                      fullscreenIndex === idx
                        ? 'border-white ring-2 ring-white/50'
                        : 'border-white/30 hover:border-white/60'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hint Text */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
            Gunakan ← → atau klik tombol untuk navigasi • ESC untuk keluar
          </div>
        </div>
      )}
    </div>
  );
};

export default UMKMDetailPage;
