import React from 'react'
import Link from 'next/link';
import LoadingLink from '@/components/shared/LoadingLink';
import { FacebookLogo, TwitterLogo, LinkedinLogo, YoutubeLogo, InstagramLogo, ArrowRight } from "phosphor-react"

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="footer-section">
                        <h3 className="text-xl font-bold mb-4">UMKM Indonesia</h3>
                        <p className="text-gray-400 mb-4">
                            Platform resmi untuk mendukung dan mengembangkan UMKM lokal di seluruh Indonesia.
                        </p>
                        <div className="social-links flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <FacebookLogo size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <TwitterLogo size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <InstagramLogo size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <LinkedinLogo size={20} />
                            </a>
                        </div>
                    </div>

                    <div className="footer-section">
                        <h3 className="text-lg font-semibold mb-4">UMKM</h3>
                        <ul className="space-y-2">
                            <li><LoadingLink href="/umkm" className="text-gray-400 hover:text-white transition-colors">Direktori UMKM</LoadingLink></li>
                            <li><LoadingLink href="/umkm?category=kuliner" className="text-gray-400 hover:text-white transition-colors">Kuliner</LoadingLink></li>
                            <li><LoadingLink href="/umkm?category=fashion" className="text-gray-400 hover:text-white transition-colors">Fashion</LoadingLink></li>
                            <li><LoadingLink href="/umkm?category=kerajinan" className="text-gray-400 hover:text-white transition-colors">Kerajinan</LoadingLink></li>
                            <li><LoadingLink href="/umkm?category=retail" className="text-gray-400 hover:text-white transition-colors">Retail</LoadingLink></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h3 className="text-lg font-semibold mb-4">Perusahaan</h3>
                        <ul className="space-y-2">
                            <li><LoadingLink href="/about" className="text-gray-400 hover:text-white transition-colors">Tentang Kami</LoadingLink></li>
                            <li><LoadingLink href="/contact" className="text-gray-400 hover:text-white transition-colors">Kontak</LoadingLink></li>
                            <li><LoadingLink href="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</LoadingLink></li>
                            <li><LoadingLink href="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</LoadingLink></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h3 className="text-lg font-semibold mb-4">Kontak</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li>Alamat: Jl. UMKM No. 1, Jakarta</li>
                            <li>Telepon: +62 21 1234 5678</li>
                            <li>Email: info@umkm-indonesia.com</li>
                        </ul>

                        <div className="mt-4">
                            <h4 className="text-lg font-semibold mb-2">Newsletter</h4>
                            <div className="flex">
                                <input
                                    type="email"
                                    placeholder="Email Anda"
                                    className="px-3 py-2 rounded-l text-gray-800 w-full"
                                />
                                <button className="bg-[var(--primary)] text-white px-4 py-2 rounded-r">
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                    <p>© 2025 UMKM Indonesia. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer