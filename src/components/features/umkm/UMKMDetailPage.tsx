"use client";

import { useState } from 'react';
import { ShareNetwork, Star, MapPin, Phone, Envelope, Globe, ShoppingBag, At, InstagramLogo, FacebookLogo, TiktokLogo, TwitterLogo } from "phosphor-react";
import Header from "@/components/shared/header/Header";
import Footer from "@/components/shared/Footer";
import { Umkm } from "@/types/umkm";
import Link from 'next/link';

interface UMKMDetailPageProps {
  umkm: Umkm;
}

const UMKMDetailPage = ({ umkm }: UMKMDetailPageProps) => {
  const [activeTab, setActiveTab] = useState<string>('tab1');
  const [activeImage, setActiveImage] = useState(umkm.logo || '/images/matcha.png');

  // Use gallery images if available, otherwise use logo
  const thumbnails = umkm.umkm_galeri && umkm.umkm_galeri.length > 0
    ? umkm.umkm_galeri.slice(0, 5).map((img, idx) => ({
        id: `img${idx + 1}`,
        src: img.img_url,
        alt: `${umkm.name} - ${img.section}`,
      }))
    : [
        { id: 'one', src: umkm.logo || '/images/matcha.png', alt: umkm.name },
      ];

  const getSocialIcon = (type: string) => {
    switch (type) {
      case 'Instagram': return <InstagramLogo size={20} weight="fill" />;
      case 'Facebook': return <FacebookLogo size={20} weight="fill" />;
      case 'TikTok': return <TiktokLogo size={20} weight="fill" />;
      case 'X': return <TwitterLogo size={20} weight="fill" />;
      default: return <At size={20} weight="fill" />;
    }
  };

  const getOnlineShopIcon = (type: string) => {
    return <ShoppingBag size={20} weight="fill" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 mt-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm flex-wrap">
            <Link href="/umkm" className="text-gray-600 hover:text-[var(--primary)]">
              Direktori UMKM
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-[var(--primary)] font-medium">{umkm.name}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Main Content */}
          <div className="lg:col-span-2">
            {/* Product Details Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image Gallery */}
                <div>
                  {/* Thumbnail Navigation */}
                  {thumbnails.length > 1 && (
                    <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                      {thumbnails.map((thumb) => (
                        <button
                          key={thumb.id}
                          onClick={() => setActiveImage(thumb.src)}
                          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                            activeImage === thumb.src
                              ? 'border-[var(--primary)] ring-2 ring-[var(--primary)]/20'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <img
                            src={thumb.src}
                            alt={thumb.alt}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/images/matcha.png";
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Main Image */}
                  <div className="rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={activeImage}
                      alt={umkm.name}
                      className="w-full aspect-square object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/images/matcha.png";
                      }}
                    />
                  </div>
                </div>

                {/* Product Info */}
                <div>
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-[var(--primary)]/10 text-[var(--primary)] text-sm font-medium rounded-full">
                      {umkm.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        weight={i < 4 ? "fill" : "regular"}
                        className={i < 4 ? "text-yellow-400" : "text-gray-300"}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">(4.0 Rating)</span>
                  </div>

                  <h1 className="text-3xl font-bold text-[var(--dark)] mb-4">
                    {umkm.name}
                  </h1>

                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {umkm.description || 'Deskripsi UMKM tidak tersedia.'}
                  </p>

                  {/* Contact Button */}
                  {umkm.contact && (
                    <a
                      href={`tel:${umkm.contact}`}
                      className="inline-flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white px-6 py-3 rounded-lg font-medium transition-colors mb-6"
                    >
                      <Phone size={20} weight="fill" />
                      Hubungi UMKM
                    </a>
                  )}

                  {/* Info Grid */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-3">
                      <MapPin size={20} weight="fill" className="text-[var(--primary)] flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Lokasi</p>
                        <p className="text-gray-800 font-medium">{umkm.location || 'Tidak tersedia'}</p>
                      </div>
                    </div>

                    {umkm.contact && (
                      <div className="flex items-start gap-3">
                        <Phone size={20} weight="fill" className="text-[var(--primary)] flex-shrink-0 mt-1" />
                        <div>
                          <p className="text-sm text-gray-500">Kontak</p>
                          <p className="text-gray-800 font-medium">{umkm.contact}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-3">
                      <ShoppingBag size={20} weight="fill" className="text-[var(--primary)] flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Online Shop</p>
                        <p className="text-gray-800 font-medium">{umkm.online_shop?.length || 0} Platform</p>
                      </div>
                    </div>
                  </div>

                  {/* Social Share */}
                  <div className="flex items-center gap-3 pt-6 border-t border-gray-200">
                    <button className="flex items-center gap-2 text-gray-600 hover:text-[var(--primary)] transition-colors">
                      <ShareNetwork size={20} weight="regular" />
                      <span className="text-sm">Bagikan</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs Section */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Tab Headers */}
              <div className="border-b border-gray-200">
                <div className="flex overflow-x-auto">
                  <button
                    onClick={() => setActiveTab('tab1')}
                    className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                      activeTab === 'tab1'
                        ? 'text-[var(--primary)] border-b-2 border-[var(--primary)]'
                        : 'text-gray-600 hover:text-[var(--primary)]'
                    }`}
                  >
                    Detail Informasi
                  </button>
                  <button
                    onClick={() => setActiveTab('tab2')}
                    className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                      activeTab === 'tab2'
                        ? 'text-[var(--primary)] border-b-2 border-[var(--primary)]'
                        : 'text-gray-600 hover:text-[var(--primary)]'
                    }`}
                  >
                    Media Sosial ({umkm.media_sosial?.length || 0})
                  </button>
                  <button
                    onClick={() => setActiveTab('tab3')}
                    className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                      activeTab === 'tab3'
                        ? 'text-[var(--primary)] border-b-2 border-[var(--primary)]'
                        : 'text-gray-600 hover:text-[var(--primary)]'
                    }`}
                  >
                    Online Shop ({umkm.online_shop?.length || 0})
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {/* Tab 1: Detail Information */}
                {activeTab === 'tab1' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-[var(--dark)] mb-4">
                        Tentang {umkm.name}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {umkm.description || 'Belum ada deskripsi lengkap untuk UMKM ini.'}
                      </p>
                    </div>

                    {umkm.umkm_galeri && umkm.umkm_galeri.length > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold text-[var(--dark)] mb-3">
                          Galeri Foto
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {umkm.umkm_galeri.map((img, idx) => (
                            <div key={idx} className="rounded-lg overflow-hidden bg-gray-100 aspect-square">
                              <img
                                src={img.img_url}
                                alt={`${umkm.name} - ${img.section}`}
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                onError={(e) => {
                                  e.currentTarget.src = "/images/matcha.png";
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 2: Social Media */}
                {activeTab === 'tab2' && (
                  <div>
                    <h3 className="text-xl font-semibold text-[var(--dark)] mb-4">
                      Media Sosial
                    </h3>
                    {umkm.media_sosial && umkm.media_sosial.length > 0 ? (
                      <div className="space-y-3">
                        {umkm.media_sosial.map((social, idx) => (
                          <a
                            key={idx}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 transition-all group"
                          >
                            <div className="flex items-center justify-center w-12 h-12 bg-[var(--primary)]/10 rounded-lg group-hover:bg-[var(--primary)] group-hover:text-white transition-colors text-[var(--primary)]">
                              {getSocialIcon(social.type)}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-800 group-hover:text-[var(--primary)]">
                                {social.type}
                              </p>
                              <p className="text-sm text-gray-500 truncate">{social.url}</p>
                            </div>
                            <Globe size={20} className="text-gray-400 group-hover:text-[var(--primary)]" />
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">
                        Belum ada akun media sosial yang terdaftar.
                      </p>
                    )}
                  </div>
                )}

                {/* Tab 3: Online Shop */}
                {activeTab === 'tab3' && (
                  <div>
                    <h3 className="text-xl font-semibold text-[var(--dark)] mb-4">
                      Online Shop
                    </h3>
                    {umkm.online_shop && umkm.online_shop.length > 0 ? (
                      <div className="space-y-3">
                        {umkm.online_shop.map((shop, idx) => (
                          <a
                            key={idx}
                            href={shop.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 transition-all group"
                          >
                            <div className="flex items-center justify-center w-12 h-12 bg-[var(--primary)]/10 rounded-lg group-hover:bg-[var(--primary)] group-hover:text-white transition-colors text-[var(--primary)]">
                              {getOnlineShopIcon(shop.type)}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-800 group-hover:text-[var(--primary)]">
                                {shop.type}
                              </p>
                              <p className="text-sm text-gray-500 truncate">{shop.url}</p>
                            </div>
                            <Globe size={20} className="text-gray-400 group-hover:text-[var(--primary)]" />
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">
                        Belum ada toko online yang terdaftar.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Sidebar */}
          <div className="lg:col-span-1">
            {/* Contact Info Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-[var(--dark)] mb-4">
                Informasi Kontak
              </h3>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Kategori</p>
                  <p className="text-gray-800 font-medium">{umkm.type}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Lokasi</p>
                  <p className="text-gray-800">{umkm.location || 'Tidak tersedia'}</p>
                </div>

                {umkm.contact && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Telepon</p>
                    <a
                      href={`tel:${umkm.contact}`}
                      className="text-[var(--primary)] hover:underline font-medium"
                    >
                      {umkm.contact}
                    </a>
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Online Shop</p>
                  <p className="text-gray-800 font-medium">{umkm.online_shop?.length || 0} Platform</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Media Sosial</p>
                  <p className="text-gray-800 font-medium">{umkm.media_sosial?.length || 0} Platform</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Galeri Foto</p>
                  <p className="text-gray-800 font-medium">{umkm.umkm_galeri?.length || 0} Foto</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <Link
                  href="/umkm"
                  className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-lg font-medium transition-colors"
                >
                  Kembali ke Daftar UMKM
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UMKMDetailPage;
