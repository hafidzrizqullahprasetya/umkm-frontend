"use client";

import Link from "next/link";
import {
  MapPin,
  Phone,
  Envelope,
  InstagramLogo,
  FacebookLogo,
  TwitterLogo,
  YoutubeLogo,
  CaretRight,
} from "phosphor-react";

interface FooterProps {
  allCategories?: string[];
}

const Footer = ({ allCategories = [] }: FooterProps) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--primary)] text-white border-t border-white/10 pt-8 pb-4">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-6">
          {/* Brand Section */}
          <div className="space-y-3">
            <div className="flex flex-col">
              <div className="text-xl font-black text-white mb-0.5">
                Tampung
              </div>
              <div className="text-[10px] text-white/80 leading-tight">
                Tempat Aksi Mendukung UMKM Nagari/Gapura
              </div>
            </div>
            <p className="text-white/70 text-xs leading-relaxed">
              Platform digital yang menghubungkan UMKM lokal dengan pelanggan
              potensial. Temukan produk unik dan dukung ekonomi lokal bersama
              kami.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <a
                href="#"
                className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[var(--secondary)] hover:text-[var(--dark)] transition-all"
                aria-label="Instagram"
              >
                <InstagramLogo size={16} weight="fill" />
              </a>
              <a
                href="#"
                className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[var(--secondary)] hover:text-[var(--dark)] transition-all"
                aria-label="Facebook"
              >
                <FacebookLogo size={16} weight="fill" />
              </a>
              <a
                href="#"
                className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[var(--secondary)] hover:text-[var(--dark)] transition-all"
                aria-label="Twitter"
              >
                <TwitterLogo size={16} weight="fill" />
              </a>
              <a
                href="#"
                className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[var(--secondary)] hover:text-[var(--dark)] transition-all"
                aria-label="Youtube"
              >
                <YoutubeLogo size={16} weight="fill" />
              </a>
            </div>
          </div>

          {/* Quick Links - Kategori UMKM */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-bold text-sm mb-3">Kategori UMKM</h3>
            {allCategories && allCategories.length > 0 ? (
              <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                {allCategories.slice(0, 8).map((category, index) => (
                  <li key={index}>
                    <Link
                      href={`/umkm?category=${encodeURIComponent(category)}`}
                      className="text-white/70 hover:text-[var(--secondary)] text-xs flex items-center gap-1.5 group transition-colors"
                    >
                      <CaretRight
                        size={12}
                        className="text-white/40 group-hover:text-[var(--secondary)] transition-colors flex-shrink-0"
                      />
                      <span className="truncate">{category}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-white/50 text-xs italic">
                Kategori tidak tersedia
              </p>
            )}
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold text-sm mb-3">Hubungi Kami</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <MapPin
                  size={16}
                  className="text-[var(--secondary)] flex-shrink-0 mt-0.5"
                  weight="fill"
                />
                <span className="text-white/70 text-xs leading-tight">
                  Jl. Jendral Sudirman No. 123, Palembang, Sumatera Selatan
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone
                  size={16}
                  className="text-[var(--secondary)] flex-shrink-0"
                  weight="fill"
                />
                <span className="text-white/70 text-xs">+62 812 3456 7890</span>
              </li>
              <li className="flex items-center gap-2">
                <Envelope
                  size={16}
                  className="text-[var(--secondary)] flex-shrink-0"
                  weight="fill"
                />
                <span className="text-white/70 text-xs">
                  info@tampung.id
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-4 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-white/60 text-xs text-center md:text-left">
            &copy; {currentYear} Tampung - UMKM Connect. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="#"
              className="text-white/60 hover:text-[var(--secondary)] text-xs transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-white/60 hover:text-[var(--secondary)] text-xs transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
