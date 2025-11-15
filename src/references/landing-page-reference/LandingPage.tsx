"use client";

import React from 'react';
import Header from "@/components/shared/header/Header";
import { MagnifyingGlass, CheckCircle, UsersThree } from 'phosphor-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Main Content - Add padding top to account for fixed header */}
      <main className="pt-32">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <section className="py-16">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-[var(--dark)] mb-6">
                Temukan UMKM Terbaik di Indonesia
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Platform direktori UMKM terlengkap untuk membantu Anda menemukan produk dan jasa lokal berkualitas
              </p>
              <div className="flex gap-4 justify-center">
                <a
                  href="/umkm"
                  className="px-8 py-3 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary)]/90 transition-colors font-medium"
                >
                  Jelajahi UMKM
                </a>
                <a
                  href="/register"
                  className="px-8 py-3 bg-[var(--secondary)] text-[var(--dark)] rounded-lg hover:bg-[var(--secondary)]/90 transition-colors font-medium"
                >
                  Daftarkan UMKM Anda
                </a>
              </div>
            </div>
          </section>

          {/* Features Section with Sidebar Layout */}
          <section className="py-16">
            <div className="flex gap-8">
              {/* Sidebar - Filter/Features */}
              <div className="w-80 flex-shrink-0">
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden sticky top-36">
                  {/* Price Range / Stats */}
                  <div className="p-6 border-b border-gray-200">
                    <h5 className="text-lg font-semibold text-[var(--dark)] mb-4">Statistik Platform</h5>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Total UMKM</span>
                        <span className="text-lg font-bold text-[var(--primary)]">1,250+</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Kategori</span>
                        <span className="text-lg font-bold text-[var(--primary)]">15+</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Kota Terdaftar</span>
                        <span className="text-lg font-bold text-[var(--primary)]">50+</span>
                      </div>
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="p-6 border-b border-gray-200">
                    <h5 className="text-lg font-semibold text-[var(--dark)] mb-4">Keunggulan Platform</h5>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <MagnifyingGlass size={20} weight="bold" className="text-[var(--primary)]" />
                        </div>
                        <div className="flex-1">
                          <h6 className="text-sm font-semibold text-[var(--dark)] mb-1">Mudah Ditemukan</h6>
                          <p className="text-xs text-gray-600">Cari UMKM berdasarkan kategori atau lokasi</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-[var(--secondary)]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <CheckCircle size={20} weight="bold" className="text-[var(--primary)]" />
                        </div>
                        <div className="flex-1">
                          <h6 className="text-sm font-semibold text-[var(--dark)] mb-1">Terverifikasi</h6>
                          <p className="text-xs text-gray-600">UMKM telah melalui proses verifikasi</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-[var(--orange)]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <UsersThree size={20} weight="bold" className="text-[var(--primary)]" />
                        </div>
                        <div className="flex-1">
                          <h6 className="text-sm font-semibold text-[var(--dark)] mb-1">Dukung Lokal</h6>
                          <p className="text-xs text-gray-600">Bantu UMKM Indonesia berkembang</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="p-6 bg-[var(--primary)]/5">
                    <h6 className="text-sm font-semibold text-[var(--dark)] mb-2">Daftarkan UMKM Anda</h6>
                    <p className="text-xs text-gray-600 mb-4">Bergabung dengan ribuan UMKM lainnya secara gratis</p>
                    <a
                      href="/register"
                      className="block w-full px-4 py-2.5 bg-[var(--secondary)] text-[var(--dark)] rounded-lg hover:bg-[var(--secondary)]/90 transition-colors font-medium text-sm text-center"
                    >
                      Daftar Sekarang
                    </a>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1">
                <div className="bg-white rounded-2xl shadow-sm">
                  {/* Header */}
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-[var(--dark)] mb-2">
                      Mengapa Bergabung dengan Platform Kami?
                    </h2>
                    <p className="text-gray-600">
                      Manfaatkan platform direktori UMKM terpercaya untuk mengembangkan bisnis Anda
                    </p>
                  </div>

                  {/* Benefits Grid */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Benefit 1 */}
                      <div className="p-5 border border-gray-200 rounded-xl hover:border-[var(--primary)] hover:shadow-md transition-all duration-300">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-[var(--primary)] text-xl font-bold">1</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-[var(--dark)] mb-2">Tingkatkan Visibilitas</h4>
                            <p className="text-sm text-gray-600">
                              Tampilkan produk dan jasa UMKM Anda kepada ribuan calon pelanggan potensial di seluruh Indonesia
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Benefit 2 */}
                      <div className="p-5 border border-gray-200 rounded-xl hover:border-[var(--primary)] hover:shadow-md transition-all duration-300">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-[var(--primary)] text-xl font-bold">2</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-[var(--dark)] mb-2">Jangkauan Lebih Luas</h4>
                            <p className="text-sm text-gray-600">
                              Perluas pasar Anda hingga ke berbagai daerah dengan memanfaatkan platform digital yang mudah diakses
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Benefit 3 */}
                      <div className="p-5 border border-gray-200 rounded-xl hover:border-[var(--primary)] hover:shadow-md transition-all duration-300">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-[var(--primary)] text-xl font-bold">3</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-[var(--dark)] mb-2">Gratis & Mudah</h4>
                            <p className="text-sm text-gray-600">
                              Pendaftaran gratis dengan proses yang cepat dan sederhana, tanpa biaya tersembunyi untuk semua UMKM
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Benefit 4 */}
                      <div className="p-5 border border-gray-200 rounded-xl hover:border-[var(--primary)] hover:shadow-md transition-all duration-300">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-[var(--primary)] text-xl font-bold">4</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-[var(--dark)] mb-2">Komunitas Solid</h4>
                            <p className="text-sm text-gray-600">
                              Bergabung dengan komunitas UMKM Indonesia yang saling mendukung dan tumbuh bersama
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom CTA */}
                    <div className="mt-6 p-5 bg-[var(--primary)]/5 rounded-xl border border-[var(--primary)]/20">
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                          <h4 className="font-semibold text-[var(--dark)] mb-1">Siap untuk Memulai?</h4>
                          <p className="text-sm text-gray-600">
                            Daftarkan UMKM Anda sekarang dan raih peluang bisnis lebih besar
                          </p>
                        </div>
                        <a
                          href="/register"
                          className="px-6 py-2.5 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary)]/90 transition-colors font-medium whitespace-nowrap"
                        >
                          Mulai Gratis
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;