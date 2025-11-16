import React from 'react'
import Link from 'next/link';
import LoadingLink from '@/components/shared/LoadingLink';
import { FacebookLogo, TwitterLogo, LinkedinLogo, YoutubeLogo, InstagramLogo, ArrowRight, MapPin, Phone, EnvelopeSimple } from "phosphor-react"

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

                    {/* Company Info Section */}
                    <div className="footer-section space-y-4 sm:space-y-6">
                        <div className="flex flex-col space-y-3 sm:space-y-4">
                            <h3 className="text-xl sm:text-2xl font-bold">Tampung</h3>
                            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                                Tempat Aksi Mendukung UMKM Nagari/Gapura. Temukan dan dukung UMKM lokal terbaik di Indonesia.
                            </p>
                        </div>

                        {/* Social Media Icons */}
                        <div className="pt-2">
                            <h4 className="text-sm font-semibold mb-3 sm:mb-4">Ikuti Kami</h4>
                            <div className="flex gap-3 sm:gap-4">
                                <a
                                    href="#"
                                    className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-gray-700 hover:bg-blue-600 rounded-full transition-all duration-300 ease-in-out transform hover:scale-110"
                                    aria-label="Facebook"
                                >
                                    <FacebookLogo size={18} weight="bold" className="sm:w-5 sm:h-5" />
                                </a>
                                <a
                                    href="#"
                                    className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-gray-700 hover:bg-sky-500 rounded-full transition-all duration-300 ease-in-out transform hover:scale-110"
                                    aria-label="Twitter"
                                >
                                    <TwitterLogo size={18} weight="bold" className="sm:w-5 sm:h-5" />
                                </a>
                                <a
                                    href="#"
                                    className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-gray-700 hover:bg-pink-600 rounded-full transition-all duration-300 ease-in-out transform hover:scale-110"
                                    aria-label="Instagram"
                                >
                                    <InstagramLogo size={18} weight="bold" className="sm:w-5 sm:h-5" />
                                </a>
                                <a
                                    href="#"
                                    className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-gray-700 hover:bg-blue-700 rounded-full transition-all duration-300 ease-in-out transform hover:scale-110"
                                    aria-label="LinkedIn"
                                >
                                    <LinkedinLogo size={18} weight="bold" className="sm:w-5 sm:h-5" />
                                </a>
                                <a
                                    href="#"
                                    className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-gray-700 hover:bg-red-600 rounded-full transition-all duration-300 ease-in-out transform hover:scale-110"
                                    aria-label="YouTube"
                                >
                                    <YoutubeLogo size={18} weight="bold" className="sm:w-5 sm:h-5" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Information Links */}
                    <div className="footer-section">
                        <h4 className="text-base sm:text-lg font-bold mb-4 sm:mb-6">Informasi</h4>
                        <ul className="space-y-2 sm:space-y-3">
                            <li>
                                <LoadingLink
                                    href="/about"
                                    className="text-gray-400 hover:text-white text-sm sm:text-base transition-colors duration-200 inline-block"
                                >
                                    Tentang Kami
                                </LoadingLink>
                            </li>
                            <li>
                                <LoadingLink
                                    href="/faq"
                                    className="text-gray-400 hover:text-white text-sm sm:text-base transition-colors duration-200 inline-block"
                                >
                                    FAQ
                                </LoadingLink>
                            </li>
                            <li>
                                <LoadingLink
                                    href="/terms-condition"
                                    className="text-gray-400 hover:text-white text-sm sm:text-base transition-colors duration-200 inline-block"
                                >
                                    Syarat & Ketentuan
                                </LoadingLink>
                            </li>
                            <li>
                                <LoadingLink
                                    href="/privacy-policy"
                                    className="text-gray-400 hover:text-white text-sm sm:text-base transition-colors duration-200 inline-block"
                                >
                                    Kebijakan Privasi
                                </LoadingLink>
                            </li>
                            <li>
                                <LoadingLink
                                    href="/contact"
                                    className="text-gray-400 hover:text-white text-sm sm:text-base transition-colors duration-200 inline-block"
                                >
                                    Kontak
                                </LoadingLink>
                            </li>
                        </ul>
                    </div>

                    {/* Category Links */}
                    <div className="footer-section">
                        <h4 className="text-base sm:text-lg font-bold mb-4 sm:mb-6">Kategori UMKM</h4>
                        <ul className="space-y-2 sm:space-y-3">
                            <li>
                                <LoadingLink
                                    href="/umkm?category=kuliner"
                                    className="text-gray-400 hover:text-white text-sm sm:text-base transition-colors duration-200 inline-block"
                                >
                                    Kuliner
                                </LoadingLink>
                            </li>
                            <li>
                                <LoadingLink
                                    href="/umkm?category=fashion"
                                    className="text-gray-400 hover:text-white text-sm sm:text-base transition-colors duration-200 inline-block"
                                >
                                    Fashion
                                </LoadingLink>
                            </li>
                            <li>
                                <LoadingLink
                                    href="/umkm?category=kerajinan"
                                    className="text-gray-400 hover:text-white text-sm sm:text-base transition-colors duration-200 inline-block"
                                >
                                    Kerajinan
                                </LoadingLink>
                            </li>
                            <li>
                                <LoadingLink
                                    href="/umkm?category=retail"
                                    className="text-gray-400 hover:text-white text-sm sm:text-base transition-colors duration-200 inline-block"
                                >
                                    Retail
                                </LoadingLink>
                            </li>
                            <li>
                                <LoadingLink
                                    href="/umkm?category=teknologi"
                                    className="text-gray-400 hover:text-white text-sm sm:text-base transition-colors duration-200 inline-block"
                                >
                                    Teknologi
                                </LoadingLink>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Information */}
                    <div className="footer-section">
                        <h4 className="text-base sm:text-lg font-bold mb-4 sm:mb-6">Hubungi Kami</h4>
                        <div className="space-y-4 sm:space-y-5">
                            {/* Address */}
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 mt-1">
                                    <MapPin size={20} weight="bold" className="text-gray-400 w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                                        Jl. UMKM No. 1, Jakarta<br />
                                        Indonesia
                                    </p>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 mt-1">
                                    <Phone size={20} weight="bold" className="text-gray-400 w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm sm:text-base mb-1">Buka 24 Jam</p>
                                    <a
                                        href="tel:+622112345678"
                                        className="text-white hover:text-blue-400 text-sm sm:text-base transition-colors duration-200"
                                    >
                                        +62 21 1234 5678
                                    </a>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 mt-1">
                                    <EnvelopeSimple size={20} weight="bold" className="text-gray-400 w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                                <div>
                                    <a
                                        href="mailto:info@tampung.com"
                                        className="text-gray-400 hover:text-white text-sm sm:text-base transition-colors duration-200 break-all"
                                    >
                                        info@tampung.com
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyright Section */}
                <div className="border-t border-gray-700 mt-8 sm:mt-12 lg:mt-16 pt-6 sm:pt-8">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
                        <p className="text-gray-400 text-sm sm:text-base text-center sm:text-left">
                            © 2025 Tampung. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer