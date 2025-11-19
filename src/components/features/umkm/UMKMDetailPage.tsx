"use client";

import { useState, useRef, useEffect } from "react";
import {
  MapPin,
  Phone,
  Globe,
  ShoppingBag,
  InstagramLogo,
  FacebookLogo,
  TiktokLogo,
  TwitterLogo,
  ImageSquare,
  X,
  CaretLeft,
  CaretRight,
  ArrowLeft,
} from "phosphor-react";
import Header from "@/components/shared/header/Header";
import Footer from "@/components/shared/Footer";
import { Umkm } from "@/types/umkm";
import { useRouter } from "next/navigation";

interface UMKMDetailPageProps {
  umkm: Umkm;
  allUmkm?: Umkm[];
  allCategories?: string[];
  user?: any;
}

const UMKMDetailPage = ({
  umkm,
  allUmkm = [],
  allCategories = [],
  user,
}: UMKMDetailPageProps) => {
  const router = useRouter();

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
  const [activeImage, setActiveImage] = useState(allImages[0] || "");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);

  const handleImageClick = (imageUrl: string, index: number) => {
    setActiveImage(imageUrl);
    setActiveImageIndex(index);
  };

  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

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
    setFullscreenIndex(
      (prev) => (prev - 1 + allImages.length) % allImages.length,
    );
  };

  const scrollThumbnails = (direction: "left" | "right") => {
    if (thumbnailContainerRef.current) {
      const scrollAmount = 200;
      thumbnailContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Keyboard navigation for fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showFullscreen) {
        if (e.key === "ArrowLeft") prevFullscreenImage();
        if (e.key === "ArrowRight") nextFullscreenImage();
        if (e.key === "Escape") closeFullscreen();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showFullscreen]);

  const getSocialIcon = (type: string) => {
    switch (type) {
      case "Instagram":
        return <InstagramLogo size={20} />;
      case "Facebook":
        return <FacebookLogo size={20} />;
      case "TikTok":
        return <TiktokLogo size={20} />;
      case "X":
        return <TwitterLogo size={20} />;
      default:
        return <Globe size={20} />;
    }
  };

  const getOnlineShopIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "tokopedia":
        return <ShoppingBag size={20} />;
      case "shopee":
        return <ShoppingBag size={20} />;
      default:
        return <ShoppingBag size={20} />;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header
        user={user}
        umkmName={umkm.name}
        allUmkm={allUmkm}
        allCategories={allCategories}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-12">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 bg-[var(--secondary)] text-dark hover:bg-[var(--primary)]/90 transition-all font-medium mb-8 px-4 py-2.5 rounded-lg shadow-sm"
        >
          <ArrowLeft size={20} weight="bold" />
          <span>Kembali</span>
        </button>

        {/* Top Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Image Section */}
            <div className="lg:col-span-5">
              {/* Main Image */}
              <div
                className="rounded-xl overflow-hidden bg-gray-50 border border-gray-100 aspect-[4/3] relative group cursor-zoom-in"
                onClick={() => activeImage && openFullscreen(activeImageIndex)}
              >
                {activeImage ? (
                  <img
                    src={activeImage}
                    alt={umkm.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                    <ImageSquare size={48} weight="thin" className="mb-2" />
                    <p className="text-sm">Tidak ada gambar</p>
                  </div>
                )}

                {/* Overlay Hint */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="bg-black/50 text-white px-3 py-1.5 rounded-full text-xs backdrop-blur-sm">
                    Klik untuk memperbesar
                  </span>
                </div>
              </div>

              {/* Thumbnail Slider */}
              {allImages.length > 1 && (
                <div className="mt-4 relative group/thumbs">
                  {/* Left Arrow */}
                  <button
                    onClick={() => scrollThumbnails("left")}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-700 rounded-full p-1.5 shadow-md opacity-0 group-hover/thumbs:opacity-100 transition-all disabled:opacity-0"
                    aria-label="Scroll left"
                  >
                    <CaretLeft size={16} weight="bold" />
                  </button>

                  {/* Thumbnails Container */}
                  <div
                    ref={thumbnailContainerRef}
                    className="flex gap-2 overflow-x-auto scrollbar-hide px-1 py-1"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  >
                    {allImages.map((img, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleImageClick(img, idx)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                          activeImageIndex === idx
                            ? "border-[var(--primary)] ring-2 ring-[var(--primary)]/20"
                            : "border-transparent hover:border-gray-300"
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
                    onClick={() => scrollThumbnails("right")}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-700 rounded-full p-1.5 shadow-md opacity-0 group-hover/thumbs:opacity-100 transition-all"
                    aria-label="Scroll right"
                  >
                    <CaretRight size={16} weight="bold" />
                  </button>
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="lg:col-span-7 flex flex-col">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-[var(--primary)] text-[var(--white)] text-xs font-bold rounded-full uppercase tracking-wider border border-[var(--primary)]/20">
                    {umkm.type}
                  </span>
                  {umkm.location && (
                    <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                      <MapPin
                        size={16}
                        weight="fill"
                        className="text-[var(--primary)]"
                      />
                      <span className="truncate max-w-[250px]">
                        {umkm.location}
                      </span>
                    </div>
                  )}
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-[var(--dark)] mb-6 leading-tight">
                  {umkm.name}
                </h1>

                <div
                  className={`prose prose-sm max-w-none text-gray-600 mb-8 leading-relaxed transition-all duration-300 ${
                    isDescriptionExpanded
                      ? "line-clamp-none"
                      : "line-clamp-6 cursor-pointer"
                  }`}
                  onClick={() =>
                    setIsDescriptionExpanded(!isDescriptionExpanded)
                  }
                >
                  <p>{umkm.description || "Deskripsi UMKM tidak tersedia."}</p>
                  {!isDescriptionExpanded && (
                    <span className="text-[var(--primary)] text-sm font-medium mt-2 inline-block">
                      Klik untuk membaca selengkapnya…
                    </span>
                  )}
                </div>
              </div>

              {/* Contact & Links Grid */}
              <div>
                <h3 className="text-sm font-bold text-[var(--dark)] uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
                  Kontak & Tautan
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Contact - Always show */}
                  {umkm.contact ? (
                    <a
                      href={`tel:${umkm.contact}`}
                      className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-white transition-colors">
                        <Phone size={20} weight="fill" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-gray-500 mb-0.5">
                          Telepon
                        </p>
                        <p className="text-sm font-semibold text-[var(--dark)] truncate">
                          {umkm.contact}
                        </p>
                      </div>
                    </a>
                  ) : (
                    <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                        <Phone size={20} weight="fill" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-gray-500 mb-0.5">
                          Telepon
                        </p>
                        <p className="text-sm text-gray-400 italic">
                          UMKM belum menambahkan nomor
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Social Media - Always show at least placeholder */}
                  {umkm.media_sosial && umkm.media_sosial.length > 0 ? (
                    umkm.media_sosial.map((social, idx) => (
                      <a
                        key={`social-${idx}`}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 transition-all group"
                      >
                        <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-white transition-colors">
                          {getSocialIcon(social.type)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-gray-500 mb-0.5">
                            {social.type}
                          </p>
                          <p className="text-sm font-semibold text-[var(--dark)] truncate">
                            {social.url.replace(/^https?:\/\/(www\.)?/, "")}
                          </p>
                        </div>
                      </a>
                    ))
                  ) : (
                    <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                        <Globe size={20} weight="fill" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-gray-500 mb-0.5">
                          Media Sosial
                        </p>
                        <p className="text-sm text-gray-400 italic">
                          UMKM belum menambahkan media sosial
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Online Shops - Always show at least placeholder */}
                  {umkm.online_shop && umkm.online_shop.length > 0 ? (
                    umkm.online_shop.map((shop, idx) => (
                      <a
                        key={`shop-${idx}`}
                        href={shop.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 transition-all group"
                      >
                        <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-white transition-colors">
                          {getOnlineShopIcon(shop.type)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-gray-500 mb-0.5">
                            {shop.type}
                          </p>
                          <p className="text-sm font-semibold text-[var(--dark)] truncate">
                            {shop.url.replace(/^https?:\/\/(www\.)?/, "")}
                          </p>
                        </div>
                      </a>
                    ))
                  ) : (
                    <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                        <ShoppingBag size={20} weight="fill" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-gray-500 mb-0.5">
                          Toko Online
                        </p>
                        <p className="text-sm text-gray-400 italic">
                          UMKM belum menambahkan toko online
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        {umkm.umkm_galeri && umkm.umkm_galeri.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
            <h3 className="text-lg font-bold text-[var(--dark)] mb-6 flex items-center gap-2">
              <ImageSquare size={24} className="text-[var(--primary)]" />
              Galeri Foto
            </h3>
            <div className="space-y-8">
              {(() => {
                // Group images by section
                const groupedGallery = umkm.umkm_galeri.reduce(
                  (acc: any, item: any) => {
                    const section = item.section || "Lainnya";
                    if (!acc[section]) {
                      acc[section] = [];
                    }
                    acc[section].push(item);
                    return acc;
                  },
                  {},
                );

                return Object.entries(groupedGallery).map(
                  ([section, items]: [string, any]) => (
                    <div key={section}>
                      <h4 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wider border-l-4 border-[var(--primary)] pl-3">
                        {section}
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {items.map((item: any, idx: number) => {
                          const imageUrl = item.img_url || item.url;
                          const imageIndex = allImages.indexOf(imageUrl);
                          return imageUrl ? (
                            <div
                              key={idx}
                              className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group border border-gray-100"
                              onClick={() => {
                                handleImageClick(imageUrl, imageIndex);
                                openFullscreen(imageIndex);
                              }}
                            >
                              <img
                                src={imageUrl}
                                alt={`${section} ${idx + 1}`}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                  ),
                );
              })()}
            </div>
          </div>
        )}

        {/* Bottom Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Location Map */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 flex flex-col">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-lg font-bold text-[var(--dark)] flex items-center gap-2">
                <MapPin
                  size={20}
                  weight="fill"
                  className="text-[var(--primary)]"
                />
                Lokasi UMKM
              </h3>
            </div>
            <div className="flex-1 min-h-[300px] bg-gray-100 relative">
              {umkm.location ? (
                <iframe
                  src={`https://www.google.com/maps?q=${encodeURIComponent(umkm.location)}&output=embed`}
                  width="100%"
                  height="100%"
                  className="absolute inset-0 border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  <p>Lokasi tidak tersedia.</p>
                </div>
              )}
            </div>
          </div>

          {/* Stats Card */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm p-6 border border-gray-100 h-fit sticky top-24">
            <h3 className="text-lg font-bold text-[var(--dark)] mb-6">
              Ringkasan
            </h3>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between group hover:border-[var(--primary)]/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    <ShoppingBag size={20} weight="fill" />
                  </div>
                  <span className="font-medium text-gray-700">Online Shop</span>
                </div>
                <span className="text-xl font-bold text-[var(--dark)]">
                  {umkm.online_shop?.length || 0}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between group hover:border-[var(--primary)]/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center">
                    <Globe size={20} weight="fill" />
                  </div>
                  <span className="font-medium text-gray-700">
                    Media Sosial
                  </span>
                </div>
                <span className="text-xl font-bold text-[var(--dark)]">
                  {umkm.media_sosial?.length || 0}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between group hover:border-[var(--primary)]/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                    <ImageSquare size={20} weight="fill" />
                  </div>
                  <span className="font-medium text-gray-700">Foto Galeri</span>
                </div>
                <span className="text-xl font-bold text-[var(--dark)]">
                  {umkm.umkm_galeri?.length || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <Footer allCategories={allCategories} />
      </div>

      {/* Fullscreen Modal */}
      {showFullscreen && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm animate-fade-in"
          onClick={closeFullscreen}
        >
          <div className="flex items-center justify-center h-full">
            {/* Close Button - now more visible */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeFullscreen();
              }}
              className="absolute top-6 right-6 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-all z-50 backdrop-blur-sm border border-white/30"
            >
              <X size={32} weight="bold" />
            </button>

            {/* Previous Button */}
            {allImages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevFullscreenImage();
                }}
                className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-4 transition-all z-50 backdrop-blur-sm border border-white/30"
              >
                <CaretLeft size={40} weight="bold" />
              </button>
            )}

            {/* Image - now larger */}
            <div className="w-full h-full flex items-center justify-center p-4 relative">
              <img
                src={allImages[fullscreenIndex]}
                alt={`Fullscreen ${fullscreenIndex + 1}`}
                className="max-w-[90vw] max-h-[90vh] object-contain shadow-2xl rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm border border-white/30">
                <span className="text-white font-medium tracking-wider text-sm">
                  {fullscreenIndex + 1} / {allImages.length}
                </span>
              </div>
            </div>

            {/* Next Button */}
            {allImages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextFullscreenImage();
                }}
                className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-4 transition-all z-50 backdrop-blur-sm border border-white/30"
              >
                <CaretRight size={40} weight="bold" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UMKMDetailPage;
