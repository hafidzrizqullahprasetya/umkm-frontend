"use client"
import React from 'react'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, MagnifyingGlass, List, Storefront } from 'phosphor-react';
import LoginPage from '@/components/features/auth/components/login';

interface HeaderProps {
    user?: any; // Add user prop to determine authentication state
}

function Header({ user }: HeaderProps) {
    const [isSticky, setIsSticky] = useState(false);
    const [showAuth, setShowAuth] = useState(false);
    const [isRegister, setIsRegister] = useState(false);

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

    const openAuth = (register: boolean) => {
        setIsRegister(register);
        setShowAuth(true);
    };

    const closeAuth = () => {
        setShowAuth(false);
    };

    const switchMode = (mode: 'login' | 'register') => {
        setIsRegister(mode === 'register');
    };

    return (
        <>
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
                                {/* Login */}
                                {user ? (
                                    <Link
                                        href="/home"
                                        className={`flex items-center gap-2 px-4 py-2.5 border-2 rounded-lg transition-colors ${
                                            isSticky
                                                ? 'border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white'
                                                : 'border-white text-white hover:bg-white hover:text-[var(--primary)]'
                                        }`}
                                    >
                                        <User size={20} weight="bold" />
                                        <span>Dashboard UMKM</span>
                                    </Link>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => openAuth(false)}
                                            className={`hidden sm:flex items-center gap-2 px-4 py-2.5 border-2 rounded-lg transition-colors ${
                                                isSticky
                                                    ? 'border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white'
                                                    : 'border-white text-white hover:bg-white hover:text-[var(--primary)]'
                                            }`}
                                        >
                                            <User size={20} weight="bold" />
                                            <span>Masuk UMKM</span>
                                        </button>

                                        {/* Daftar UMKM */}
                                        <button
                                            onClick={() => openAuth(true)}
                                            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all font-bold shadow-md hover:shadow-lg ${
                                                isSticky
                                                    ? 'bg-[var(--primary)] text-white hover:bg-[var(--dark)]'
                                                    : 'bg-[var(--secondary)] text-[var(--dark)] hover:bg-[var(--white)] hover:text-primary'
                                            }`}
                                        >
                                            <Storefront size={20} weight="bold" />
                                            <span>Daftar UMKM</span>
                                        </button>
                                    </>
                                )}

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

            {/* Auth Modal - using the updated LoginPage component directly */}
            {showAuth && (
                <LoginPage
                    isRegister={isRegister}
                    onClose={closeAuth}
                    onModeChange={switchMode}
                />
            )}
        </>
    )
}

export default Header