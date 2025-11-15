"use client"
import React from 'react'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, Heart, MagnifyingGlass, List } from 'phosphor-react';

function Header() {
    const [isSticky, setIsSticky] = useState(false);
    const [wishlistCount, setWishlistCount] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isSticky ? 'bg-white shadow-lg' : 'bg-[var(--primary)]'}`}>

            {/* Main Header */}
            <div className="border-b border-white/20">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center py-4">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2">
                            <div className={`text-2xl font-bold ${isSticky ? 'text-[var(--primary)]' : 'text-white'}`}>
                                UMKM Indonesia
                            </div>
                        </Link>

                        {/* Search Bar */}
                        <div className="hidden md:block flex-1 max-w-xl mx-8">
                            <form className="relative">
                                <input
                                    type="text"
                                    placeholder="Cari UMKM, kategori, atau produk..."
                                    className="w-full px-4 py-2.5 rounded-lg border-2 border-[var(--border)] focus:outline-none focus:border-[var(--secondary)] transition-colors"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-[var(--primary)] text-white rounded-md hover:bg-[var(--primary)]/90 transition-colors flex items-center gap-1"
                                >
                                    <MagnifyingGlass size={16} weight="bold" />
                                    <span>Cari</span>
                                </button>
                            </form>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                            {/* Wishlist */}
                            <Link
                                href="/wishlist"
                                className={`relative flex items-center gap-2 px-3 py-2 border-2 rounded-lg transition-colors ${
                                    isSticky
                                        ? 'border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white'
                                        : 'border-white text-white hover:bg-white hover:text-[var(--primary)]'
                                }`}
                            >
                                <Heart size={20} weight="bold" />
                                <span className="hidden lg:inline">Wishlist</span>
                                {wishlistCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-[var(--orange)] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                        {wishlistCount}
                                    </span>
                                )}
                            </Link>

                            {/* Login */}
                            <Link
                                href="/login"
                                className={`hidden md:flex items-center gap-2 px-4 py-2 border-2 rounded-lg transition-colors ${
                                    isSticky
                                        ? 'border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white'
                                        : 'border-white text-white hover:bg-white hover:text-[var(--primary)]'
                                }`}
                            >
                                <User size={20} weight="bold" />
                                <span>Masuk</span>
                            </Link>

                            {/* Register */}
                            <Link
                                href="/register"
                                className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                                    isSticky
                                        ? 'bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90'
                                        : 'bg-[var(--secondary)] text-[var(--dark)] hover:bg-[var(--secondary)]/90'
                                }`}
                            >
                                Daftar
                            </Link>

                            {/* Mobile Menu Toggle */}
                            <button
                                className={`md:hidden p-2 ${isSticky ? 'text-[var(--primary)]' : 'text-white'}`}
                                aria-label="Menu"
                            >
                                <List size={24} weight="bold" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
