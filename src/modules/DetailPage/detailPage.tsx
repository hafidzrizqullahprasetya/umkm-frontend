"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { EmblaFadeCarousel } from "../../components/CarouselFade/EmblaFadeCarousel";
import GalleryCarousel from "../../components/CarouselGalerry/EmblaParallaxCarousel";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface DetailPageProps {
  slug: string;
}

const detailPageDummy = (slug: string) => {
  return {
    name: "Kopi Senja",
    logo: "/icons/logoKopi.svg",
    description: "Kedai kopi hangat dengan suasana nyaman di Bandung",
    images: [
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1920&h=1080&fit=crop",
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1920&h=1080&fit=crop",
      "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1920&h=1080&fit=crop",
    ],
    fullDescription:
      "Kopi Senja adalah kedai kopi lokal yang menyajikan berbagai varian kopi Nusantara dengan cita rasa khas. Kami menggunakan biji kopi pilihan dari petani lokal Jawa Barat. Suasana tempat dibuat hangat dan tenang, cocok untuk bekerja, berbincang, atau sekadar menikmati sore hari.",
    gallery: [
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=1200&h=800&fit=crop",
    ],
    products: [
      "https://images.unsplash.com/photo-1514066558159-fc8c737ef259?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1545665225-b23b99e4d45e?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1520970014086-2208d157c9e2?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1200&h=800&fit=crop",
    ],
    contact: {
      address: "Jl. Braga No. 45, Bandung, Jawa Barat",
      phone: "0821-2345-6788",
      email: "kopidulubarukamu@gmail.com",
      whatsapp: "6282123456788",
      coordinates: { lat: -6.9175, lng: 107.6191 },
    },
    socialMedia: {
      instagram: "kopisenja",
    },
    onlineStores: {
      shopee: "https://shopee.co.id/kopisenja",
    },
  };
};

export function DetailPage({ slug }: DetailPageProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentGalleryType, setCurrentGalleryType] = useState<
    "gallery" | "products"
  >("gallery");

  const data = detailPageDummy(slug);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setActiveImageIndex((prev) =>
        prev === data.images.length - 1 ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, data.images.length]);

  useEffect(() => {
    return () => {
      if (autoPlayRef.current) {
        clearTimeout(autoPlayRef.current);
      }
    };
  }, []);

  const handleImageClick = (index: number, type: "gallery" | "products") => {
    setCurrentImageIndex(index);
    setCurrentGalleryType(type);
    setIsDialogOpen(true);
  };

  const handleNext = () => {
    const images =
      currentGalleryType === "gallery" ? data.gallery : data.products;
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    const images =
      currentGalleryType === "gallery" ? data.gallery : data.products;
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isDialogOpen) return;
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDialogOpen, currentGalleryType, currentImageIndex]);

  const currentImages =
    currentGalleryType === "gallery" ? data.gallery : data.products;

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full mb-4 md:mb-8">
        <EmblaFadeCarousel
          images={data.images}
          name={data.name}
          description={data.description}
          logo={data.logo}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-5 space-y-4 md:space-y-6">
        {/* Description Section */}
        <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-8 border-1 border-[#718355] shadow-xl">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            <div className="w-full md:w-64 h-48 md:h-48 relative flex-shrink-0 rounded-lg overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1514066558159-fc8c737ef259?w=800&h=600&fit=crop"
                alt="Deskripsi Gambar"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-3">
                Deskripsi Singkat
              </h2>
              <p className="text-sm md:text-lg text-gray-700 leading-relaxed">
                {data.fullDescription}
              </p>
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-8 border-1 border-[#718355] shadow-xl">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 text-center">
            Galeri UMKM
          </h2>
          <GalleryCarousel
            images={data.gallery}
            onImageClick={(index) => handleImageClick(index, "gallery")}
          />

          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 text-center mt-6 md:mt-10">
            Galeri Products
          </h2>
          <GalleryCarousel
            images={data.products}
            onImageClick={(index) => handleImageClick(index, "products")}
          />
        </div>

        {/* Contact and Location Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-8 border-1 border-[#718355] shadow-md">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-4">
              Contact
            </h2>

            <div className="mb-4 md:mb-6">
              <h3 className="text-base md:text-lg font-bold text-gray-900 mb-1 md:mb-2">
                Alamat:
              </h3>
              <p className="text-sm md:text-base text-gray-700">
                {data.contact.address}
              </p>
            </div>

            <div className="mb-4 md:mb-6">
              <h3 className="text-base md:text-lg font-bold text-gray-900 mb-1 md:mb-2">
                Telepon:
              </h3>
              <p className="text-sm md:text-base text-gray-700">
                {data.contact.phone}
              </p>
            </div>

            <div className="mb-6 md:mb-8">
              <h3 className="text-base md:text-lg font-bold text-gray-900 mb-1 md:mb-2">
                Email:
              </h3>
              <p className="text-sm md:text-base text-gray-700 break-all">
                {data.contact.email}
              </p>
            </div>

            <div className="flex items-center justify-start gap-3 md:gap-4 mb-4 md:mb-6">
              <a
                href={`https://instagram.com/${data.socialMedia.instagram}`}
                target="_blank"
                rel="noreferrer"
                className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-md"
                title="Instagram"
              >
                <svg
                  className="w-6 h-6 md:w-7 md:h-7 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              <a
                href={`https://wa.me/${data.contact.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="w-12 h-12 md:w-14 md:h-14 bg-[#25D366] rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-md"
                title="WhatsApp"
              >
                <svg
                  className="w-6 h-6 md:w-7 md:h-7 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>

              <a
                href={data.onlineStores.shopee}
                target="_blank"
                rel="noreferrer"
                className="w-12 h-12 md:w-14 md:h-14 bg-[#EE4D2D] rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-md"
                title="Shopee"
              >
                <svg
                  className="w-6 h-6 md:w-7 md:h-7 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M15.5 12.5c0 .552-.448 1-1 1s-1-.448-1-1 .448-1 1-1 1 .448 1 1zm-7 0c0 .552-.448 1-1 1s-1-.448-1-1 .448-1 1-1 1 .448 1 1zm10.72-9.5H4.78L4 6h16l-.78-3zm-1.72 4H6l-1 6h14l-1-6zM5 19h14v2H5v-2z" />
                </svg>
              </a>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-6">
              <a
                href={`tel:${data.contact.phone}`}
                className="flex-1 px-4 md:px-6 py-2.5 md:py-3 text-white bg-[#718355] rounded-xl text-sm md:text-sm font-semibold hover:bg-[#5A6B44] transition-colors shadow-sm text-center"
              >
                ☎️ Call
              </a>
              <a
                href={`mailto:${data.contact.email}`}
                className="flex-1 px-4 md:px-6 py-2.5 md:py-3 text-white bg-[#718355] rounded-xl text-sm md:text-sm font-semibold hover:bg-[#5A6B44] transition-colors shadow-sm text-center"
              >
                📩 Email
              </a>
            </div>
          </div>

          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 border-1 border-[#718355] shadow-md">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">
              📍 Lokasi Kami
            </h2>

            <div className="relative h-48 md:h-64 bg-gray-200 rounded-lg mb-3 overflow-hidden">
              <iframe
                src={`https://maps.google.com/maps?q=${data.contact.coordinates.lat},${data.contact.coordinates.lng}&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </div>

            <div className="bg-[#EEF6EE] p-3 md:p-4 rounded-lg mb-3">
              <p className="text-xs font-semibold text-gray-700 mb-1">
                Alamat:
              </p>
              <p className="text-sm text-gray-900 font-medium">
                {data.contact.address}
              </p>
            </div>

            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${data.contact.coordinates.lat},${data.contact.coordinates.lng}`}
              target="_blank"
              rel="noreferrer"
              className="block bg-[#718355] text-white px-4 py-2.5 md:py-3 rounded-lg text-sm font-semibold hover:bg-[#5A6B44] w-full text-center transition-colors shadow-md"
            >
              Petunjuk Arah ke Lokasi
            </a>
          </div>
        </div>
      </div>

      {/* Dialog Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] w-auto h-auto max-w-[90vw] max-h-[90vh] p-0 bg-transparent border-none overflow-visible data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200">
          <DialogTitle className="sr-only">
            {currentGalleryType === "gallery" ? "Gallery" : "Product"} Image{" "}
            {currentImageIndex + 1} of {currentImages.length}
          </DialogTitle>

          <div className="relative">
            {/* Image Counter */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium z-20 backdrop-blur-sm">
              {currentImageIndex + 1} / {currentImages.length}
            </div>

            {/* Close Button */}
            <button
              onClick={() => setIsDialogOpen(false)}
              className="group absolute -right-4 -top-4 z-20 w-10 h-10 md:w-12 md:h-12 bg-white hover:bg-[#718355] hover:scale-110 rounded-full flex items-center justify-center transition-all shadow-lg focus:outline-none"
              aria-label="Close"
            >
              <svg
                className="w-6 h-6 text-gray-800 group-hover:text-white transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Image Container with White Border */}
            <div className="relative bg-white p-2 rounded-lg shadow-2xl">
              {/* Previous Button - Inside container */}
              <button
                onClick={handlePrev}
                className="group absolute left-2 top-1/2 -translate-y-1/2 md:hidden z-20 w-10 h-10 bg-white/90 hover:bg-[#718355] rounded-full flex items-center justify-center transition-all shadow-lg focus:outline-none"
                aria-label="Previous"
              >
                <svg
                  className="w-5 h-5 text-gray-800 group-hover:text-white transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <div className="relative">
                <Image
                  src={currentImages[currentImageIndex]}
                  alt={`${
                    currentGalleryType === "gallery" ? "Gallery" : "Product"
                  } ${currentImageIndex + 1}`}
                  width={800}
                  height={600}
                  className="object-contain rounded max-w-[85vw] max-h-[70vh] md:max-w-[70vw] w-auto h-auto"
                  quality={100}
                  priority
                />
              </div>

              {/* Next Button - Inside container */}
              <button
                onClick={handleNext}
                className="group absolute right-2 top-1/2 -translate-y-1/2 md:hidden z-20 w-10 h-10 bg-white/90 hover:bg-[#718355] rounded-full flex items-center justify-center transition-all shadow-lg focus:outline-none"
                aria-label="Next"
              >
                <svg
                  className="w-5 h-5 text-gray-800 group-hover:text-white transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            {/* Previous Button - Outside container (Desktop only) */}
            <button
              onClick={handlePrev}
              className="group hidden md:flex absolute -left-16 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white hover:bg-[#718355] hover:scale-110 rounded-full items-center justify-center transition-all shadow-lg focus:outline-none"
              aria-label="Previous"
            >
              <svg
                className="w-6 h-6 text-gray-800 group-hover:text-white transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Next Button - Outside container (Desktop only) */}
            <button
              onClick={handleNext}
              className="group hidden md:flex absolute -right-16 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white hover:bg-[#718355] hover:scale-110 rounded-full items-center justify-center transition-all shadow-lg focus:outline-none"
              aria-label="Next"
            >
              <svg
                className="w-6 h-6 text-gray-800 group-hover:text-white transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
