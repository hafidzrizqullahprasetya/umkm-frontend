"use client"
import React from 'react'
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import LoadingLink from '@/components/shared/LoadingLink';
import { usePathname, useRouter } from 'next/navigation';
import { User, MagnifyingGlass, List, Storefront, House, CaretRight, Tag, CaretDown, MapPin } from 'phosphor-react';
import LoginPage from '@/components/features/auth/components/login';
import { Umkm } from '@/types/umkm';

interface HeaderProps {
    user?: any; // Add user prop to determine authentication state
    umkmName?: string; // Optional UMKM name for detail page breadcrumb
    allUmkm?: Umkm[]; // All UMKM data for search
    allCategories?: string[]; // All categories for dropdown
    breadcrumbOnly?: boolean; // Only show breadcrumb, hide search and buttons
}

function Header({ user, umkmName, allUmkm = [], allCategories = [], breadcrumbOnly = false }: HeaderProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [isSticky, setIsSticky] = useState(false);
    const [showAuth, setShowAuth] = useState(false);
    const [isRegister, setIsRegister] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('Semua');
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

    const searchRef = useRef<HTMLDivElement>(null);
    const categoryRef = useRef<HTMLDivElement>(null);

    // Determine if we're on home page (which is actually UMKM directory)
    const isHomePage = pathname === '/';

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

    // Sync with URL parameters
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const categoryParam = params.get('category');
            const searchParam = params.get('search');

            if (categoryParam) {
                setSelectedCategory(categoryParam);
            } else {
                setSelectedCategory('Semua');
            }

            if (searchParam) {
                setSearchQuery(searchParam);
            }
        }
    }, [pathname]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSearchResults(false);
            }
            if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
                setShowCategoryDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Filter UMKM based on search query and selected category
    const filteredUmkm = allUmkm.filter(umkm => {
        const matchesSearch = !searchQuery ||
            umkm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (umkm.description && umkm.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
            umkm.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (umkm.location && umkm.location.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesCategory = selectedCategory === 'Semua' || umkm.type === selectedCategory;

        return matchesSearch && matchesCategory;
    }).slice(0, 5); // Limit to 5 results

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setShowSearchResults(e.target.value.length > 0);
    };

    const handleSearchSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (searchQuery.trim() || selectedCategory !== 'Semua') {
            const params = new URLSearchParams();
            if (searchQuery.trim()) params.set('search', searchQuery);
            if (selectedCategory !== 'Semua') params.set('category', selectedCategory);
            router.push(`/?${params.toString()}`);
            setShowSearchResults(false);
        }
    };

    const handleCategorySelect = (category: string) => {
        setSelectedCategory(category);
        setShowCategoryDropdown(false);
        // Auto-trigger search when category changes
        const params = new URLSearchParams();
        if (searchQuery.trim()) params.set('search', searchQuery);
        if (category !== 'Semua') params.set('category', category);
        if (params.toString()) {
            router.push(`/?${params.toString()}`);
        } else {
            router.push('/');
        }
    };

    const handleUmkmClick = (umkmId: string) => {
        router.push(`/umkm/${umkmId}`);
        setShowSearchResults(false);
        setSearchQuery('');
    };

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
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[var(--primary)] ${isSticky ? 'shadow-lg' : ''}`}>

                {/* Main Header - Hidden when breadcrumbOnly */}
                {!breadcrumbOnly && (
                    <div className="border-b border-white/10">
                        <div className="container mx-auto px-4">
                            <div className="flex justify-between items-center py-4">
                                {/* Logo */}
                                <LoadingLink href="/" className="flex items-center gap-2">
                                    <div className="text-2xl font-bold text-white">
                                        UMKM Indonesia
                                    </div>
                                </LoadingLink>

                                {/* Location & Search Bar */}
                                <div className="hidden md:block flex-1 max-w-2xl mx-8">
                                <div className="flex gap-2">
                                    {/* Location Badge */}
                                    <div className="flex items-center gap-2 px-4 py-2.5 bg-white/10 border-2 border-white/20 rounded-lg backdrop-blur-sm whitespace-nowrap h-[42px]">
                                        <MapPin size={16} weight="fill" className="text-[var(--secondary)]" />
                                        <span className="text-sm font-semibold text-white">UGM Jogja</span>
                                    </div>

                                    {/* Category Dropdown */}
                                    <div ref={categoryRef} className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                                            className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-[var(--border)] rounded-lg hover:border-[var(--secondary)] transition-colors whitespace-nowrap h-[42px]"
                                        >
                                            <Tag size={16} weight="bold" className="text-[var(--primary)]" />
                                            <span className="text-sm font-medium text-[var(--dark)]">{selectedCategory}</span>
                                            <CaretDown size={14} weight="bold" className="text-gray-500" />
                                        </button>

                                        {/* Category Dropdown Menu */}
                                        {showCategoryDropdown && (
                                            <div className="absolute top-full mt-2 left-0 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 max-h-96 overflow-y-auto">
                                                <button
                                                    onClick={() => handleCategorySelect('Semua')}
                                                    className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 ${
                                                        selectedCategory === 'Semua' ? 'bg-[var(--primary)]/5 text-[var(--primary)] font-semibold' : 'text-gray-700'
                                                    }`}
                                                >
                                                    <Tag size={16} weight={selectedCategory === 'Semua' ? "fill" : "bold"} className={selectedCategory === 'Semua' ? "text-[var(--primary)]" : "text-gray-400"} />
                                                    Semua Kategori
                                                </button>
                                                {allCategories.map((cat, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => handleCategorySelect(cat)}
                                                        className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 ${
                                                            selectedCategory === cat ? 'bg-[var(--primary)]/5 text-[var(--primary)] font-semibold' : 'text-gray-700'
                                                        }`}
                                                    >
                                                        <Tag size={16} weight={selectedCategory === cat ? "fill" : "bold"} className={selectedCategory === cat ? "text-[var(--primary)]" : "text-gray-400"} />
                                                        {cat}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Search Input */}
                                    <div ref={searchRef} className="relative flex-1">
                                        <form onSubmit={handleSearchSubmit} className="relative">
                                            <input
                                                type="text"
                                                value={searchQuery}
                                                onChange={handleSearchChange}
                                                placeholder="Cari UMKM, kategori, atau produk..."
                                                className="w-full px-4 py-2.5 rounded-lg border-2 border-[var(--border)] focus:outline-none focus:border-[var(--secondary)] transition-colors h-[42px]"
                                            />
                                            <button
                                                type="submit"
                                                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-[var(--primary)] text-white rounded-md hover:bg-[var(--primary)]/90 transition-colors flex items-center gap-1"
                                            >
                                                <MagnifyingGlass size={16} weight="bold" />
                                                <span>Cari</span>
                                            </button>
                                        </form>

                                        {/* Search Results Dropdown */}
                                        {showSearchResults && searchQuery && (
                                            <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 max-h-96 overflow-y-auto">
                                                {filteredUmkm.length > 0 ? (
                                                    <>
                                                        {filteredUmkm.map((umkm) => (
                                                            <button
                                                                key={umkm.id}
                                                                onClick={() => handleUmkmClick(umkm.id)}
                                                                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                                                            >
                                                                <div className="flex items-start gap-3">
                                                                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                                                        {umkm.logo ? (
                                                                            <img
                                                                                src={umkm.logo}
                                                                                alt={umkm.name}
                                                                                className="w-full h-full object-cover"
                                                                                onError={(e) => {
                                                                                    e.currentTarget.style.display = 'none';
                                                                                }}
                                                                            />
                                                                        ) : (
                                                                            <Storefront size={24} weight="thin" className="text-gray-400" />
                                                                        )}
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <h4 className="text-sm font-semibold text-[var(--dark)] truncate">{umkm.name}</h4>
                                                                        <p className="text-xs text-gray-500 mt-0.5 truncate">{umkm.location || 'Lokasi tidak tersedia'}</p>
                                                                        <span className="inline-block mt-1 px-2 py-0.5 bg-[var(--primary)]/10 text-[var(--primary)] text-xs rounded-md font-medium">
                                                                            {umkm.type}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </button>
                                                        ))}
                                                        <div className="px-4 py-2 border-t border-gray-200">
                                                            <button
                                                                onClick={handleSearchSubmit}
                                                                className="text-xs text-[var(--primary)] hover:underline font-medium"
                                                            >
                                                                Lihat semua hasil pencarian →
                                                            </button>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="px-4 py-6 text-center">
                                                        <p className="text-sm text-gray-500">Tidak ada hasil ditemukan</p>
                                                        <p className="text-xs text-gray-400 mt-1">Coba gunakan kata kunci lain</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-3">
                                {/* Login */}
                                {user ? (
                                    <LoadingLink
                                        href="/home"
                                        className="flex items-center gap-2 px-4 py-2.5 border-2 border-white text-white rounded-lg transition-colors hover:bg-white hover:text-[var(--primary)]"
                                    >
                                        <User size={20} weight="bold" />
                                        <span>Dashboard UMKM</span>
                                    </LoadingLink>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => openAuth(false)}
                                            className="hidden sm:flex items-center gap-2 px-4 py-2.5 border-2 border-white text-white rounded-lg transition-colors hover:bg-white hover:text-[var(--primary)]"
                                        >
                                            <User size={20} weight="bold" />
                                            <span>Masuk UMKM</span>
                                        </button>

                                        {/* Daftar UMKM */}
                                        <button
                                            onClick={() => openAuth(true)}
                                            className="flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all font-bold shadow-md bg-[var(--secondary)] text-[var(--dark)] hover:bg-[var(--orange)] hover:text-white hover:shadow-lg"
                                        >
                                            <Storefront size={20} weight="bold" />
                                            <span>Daftar UMKM</span>
                                        </button>
                                    </>
                                )}

                                {/* Mobile Menu Toggle */}
                                <button
                                    className="md:hidden p-2 text-white"
                                    aria-label="Menu"
                                >
                                    <List size={24} weight="bold" />
                                </button>
                            </div>
                        </div>
                    </div>
                    </div>
                )}

                {/* Breadcrumb Section */}
                <div className={`bg-gradient-to-r from-white/5 to-white/10 ${!breadcrumbOnly ? 'border-t border-white/10' : ''}`}>
                    <div className="container mx-auto px-4 py-3">
                        <div className="flex items-center gap-2 text-sm">
                            <LoadingLink
                                href="/"
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                                    isHomePage
                                        ? 'bg-[var(--secondary)] text-[var(--dark)] font-semibold shadow-md'
                                        : 'text-white hover:text-[var(--secondary)] hover:bg-white/10'
                                }`}
                            >
                                <House size={16} weight={isHomePage ? "fill" : "regular"} />
                                <span>Direktori UMKM</span>
                            </LoadingLink>

                            {!isHomePage && pathname.startsWith('/umkm/') && (
                                <>
                                    <CaretRight size={16} weight="bold" className="text-white" />
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[var(--secondary)] text-[var(--dark)] font-semibold shadow-md">
                                        <span className="line-clamp-1">{umkmName || 'Detail UMKM'}</span>
                                    </div>
                                </>
                            )}

                            {pathname === '/home' && (
                                <>
                                    <CaretRight size={16} weight="bold" className="text-white/50" />
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[var(--secondary)] text-[var(--dark)] font-semibold shadow-md">
                                        <Storefront size={16} weight="fill" />
                                        <span>Dashboard UMKM</span>
                                    </div>
                                </>
                            )}
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