"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { Umkm } from '@/types/umkm';
import {
  Storefront,
  ChartLineUp,
  ShoppingBag,
  ShareNetwork,
  ImageSquare,
  MapPin,
  Phone,
  PencilSimple,
  Trash,
  Plus,
  Eye,
  SignOut,
  User,
  CaretDown,
  X
} from 'phosphor-react';
import Link from 'next/link';
import Image from 'next/image';
import UmkmFormModal from './UmkmFormModal';
import ConfirmationModal from '@/components/shared/ConfirmationModal';

interface DashboardPageProps {
  userUmkm: Umkm[];
  userName: string;
  userEmail: string;
  userWhatsapp?: string;
  userAddress?: string;
}

export default function DashboardPage({ userUmkm: initialUserUmkm, userName, userEmail, userWhatsapp, userAddress }: DashboardPageProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<'overview' | 'umkm'>('overview');
  const [userUmkm, setUserUmkm] = useState(initialUserUmkm);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedUmkm, setSelectedUmkm] = useState<Umkm | null>(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showRestrictionModal, setShowRestrictionModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [umkmToDelete, setUmkmToDelete] = useState<string | null>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const token = (session as any)?.accessToken;

  // Get user initials from name
  const getUserInitials = (name: string) => {
    const nameParts = name.trim().split(' ');
    if (nameParts.length === 1) {
      return nameParts[0].substring(0, 2).toUpperCase();
    }
    return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
  };

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = async () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = async () => {
    await signOut({ callbackUrl: '/' });
    setShowLogoutConfirm(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    };

    if (showProfileDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileDropdown]);

  // Calculate statistics
  const totalUmkm = userUmkm.length;
  const totalOnlineShops = userUmkm.reduce((sum, umkm) => sum + (umkm.online_shop?.length || 0), 0);
  const totalSocialMedia = userUmkm.reduce((sum, umkm) => sum + (umkm.media_sosial?.length || 0), 0);
  const totalGalleryImages = userUmkm.reduce((sum, umkm) => sum + (umkm.umkm_galeri?.length || 0), 0);

  const handleAddUmkm = () => {
    // Check if user already has a UMKM (for admin_umkm user)
    if (userUmkm.length > 0) {
      setShowRestrictionModal(true);
      return;
    }

    setModalMode('add');
    setSelectedUmkm(null);
    setShowModal(true);
  };

  const handleEditUmkm = (umkm: Umkm) => {
    setModalMode('edit');
    setSelectedUmkm(umkm);
    setShowModal(true);
  };

  const getBackendUrl = () => {
    return process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
  };

  const handleDeleteUmkm = async (umkmId: string) => {
    setUmkmToDelete(umkmId);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!umkmToDelete) return;

    try {
      const baseUrl = getBackendUrl();
      const response = await fetch(`${baseUrl}/api/umkm?id=${umkmToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete UMKM');
      }

      // Update local state
      setUserUmkm(prev => prev.filter(umkm => umkm.id !== Number(umkmToDelete)));
      setShowDeleteConfirm(false);
      setUmkmToDelete(null);
      toast.success('UMKM berhasil dihapus!');

      // Invalidate cache and refresh
      router.refresh();
      setTimeout(() => {
        router.push('/home');
      }, 1500);
    } catch (error) {
      console.error('Error deleting UMKM:', error);
      toast.error('Gagal menghapus UMKM');
      setShowDeleteConfirm(false);
      setUmkmToDelete(null);
    }
  };

  const handleSubmitForm = async (data: any) => {
    const method = modalMode === 'add' ? 'POST' : 'PUT';

    try {
      const baseUrl = getBackendUrl();

      let url = `${baseUrl}/api/umkm`;
      if (userEmail) {
        url += `?email=${encodeURIComponent(userEmail)}`;
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(method === 'POST' ? 'Failed to create UMKM' : 'Failed to update UMKM');
      }

      const updatedUmkm = result.data;

      if (modalMode === 'add') {
        setUserUmkm(prev => [...prev, updatedUmkm]);
      } else {
        setUserUmkm(prev => prev.map(umkm => umkm.id === updatedUmkm.id ? updatedUmkm : umkm));
      }

      setShowModal(false);
      toast.success(method === 'POST' ? 'UMKM berhasil ditambahkan!' : 'UMKM berhasil diperbarui!');

      // Invalidate cache and refresh
      router.refresh();
      setTimeout(() => {
        router.push('/home');
      }, 1500);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(method === 'POST' ? 'Gagal menambahkan UMKM' : 'Gagal memperbarui UMKM');
    }
  };

  // Profile update function
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    try {
      const baseUrl = getBackendUrl();

      const updateData: any = {
        name: formData.get("name"),
        address: formData.get("address"),
      };

      const oldPassword = formData.get("oldPassword") as string;
      const newPassword = formData.get("password") as string;

      // For profile update, we need both old and new password if changing
      if (newPassword && newPassword.trim() !== "") {
        if (!oldPassword || oldPassword.trim() === "") {
          toast.error("Password lama diperlukan untuk mengganti password");
          return;
        }
        updateData.old_password = oldPassword;
        updateData.new_password = newPassword;
      }

      const response = await fetch(`${baseUrl}/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult.message || "Failed to update profile");
      }

      toast.success("Profil berhasil diperbarui!");
      setShowEditProfileModal(false);

      // Invalidate cache and refresh
      router.refresh();
      setTimeout(() => {
        router.push('/home');
      }, 1500);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(`Gagal memperbarui profil: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] pb-12">
      {/* Dashboard Header */}
      <div className="bg-[var(--primary)] text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">

              <div className="border-l border-white/30 h-12"></div>

              <div>
                <h1 className="text-2xl font-bold text-white">Dashboard UMKM</h1>
                <p className="text-white/90">Selamat datang kembali, {userName}!</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Back to Home Button */}
              <Link
                href="/"
                className="px-6 py-3 bg-[var(--secondary)] text-[var(--dark)] rounded-lg font-bold hover:bg-[var(--orange)] hover:text-white transition-all flex items-center gap-2"
              >
                <span>Kembali ke Beranda</span>
              </Link>

              {/* User Profile Dropdown */}
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center gap-3 bg-white/20 hover:bg-white/30 rounded-lg px-4 py-3 transition-all"
                >
                  {/* Avatar with Initials */}
                  <div className="w-10 h-10 rounded-full bg-[var(--secondary)] text-[var(--dark)] flex items-center justify-center font-bold text-sm">
                    {getUserInitials(userName)}
                  </div>

                  {/* User Info */}
                  <div className="text-left">
                    <div className="text-sm font-bold text-white truncate max-w-[120px]">{userName}</div>
                    <div className="text-xs text-white/70 truncate max-w-[120px]">{userEmail}</div>
                  </div>

                  {/* Dropdown Icon */}
                  <CaretDown
                    size={16}
                    weight="bold"
                    className={`text-white transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Dropdown Menu */}
                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
                    {/* User Info in Dropdown */}
                    <div className="p-4 bg-[var(--primary)]/10 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-[var(--primary)] text-white flex items-center justify-center font-bold text-base">
                          {getUserInitials(userName)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-[var(--dark)] truncate">{userName}</div>
                          <div className="text-xs text-gray-600 truncate">{userEmail}</div>
                        </div>
                      </div>
                    </div>

                    {/* Dropdown Actions */}
                    <div className="p-2 space-y-1">
                      <button
                        onClick={() => {
                          setShowEditProfileModal(true);
                          setShowProfileDropdown(false); // Close the dropdown
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors group"
                      >
                        <User size={20} weight="bold" className="group-hover:scale-110 transition-transform" />
                        <span className="font-medium">Edit Profil</span>
                      </button>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
                      >
                        <SignOut size={20} weight="bold" className="group-hover:scale-110 transition-transform" />
                        <span className="font-medium">Keluar</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="container mx-auto px-4 mt-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total UMKM */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-[var(--border)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Total UMKM</p>
                <h3 className="text-3xl font-bold text-[var(--dark)]">{totalUmkm}</h3>
              </div>
              <div className="w-16 h-16 bg-[var(--primary)]/10 rounded-xl flex items-center justify-center">
                <Storefront size={32} weight="bold" className="text-[var(--primary)]" />
              </div>
            </div>
          </div>

          {/* Total Online Shops */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-[var(--border)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Online Shop</p>
                <h3 className="text-3xl font-bold text-[var(--dark)]">{totalOnlineShops}</h3>
              </div>
              <div className="w-16 h-16 bg-[var(--secondary)]/10 rounded-xl flex items-center justify-center">
                <ShoppingBag size={32} weight="bold" className="text-[var(--primary)]" />
              </div>
            </div>
          </div>

          {/* Total Social Media */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-[var(--border)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Media Sosial</p>
                <h3 className="text-3xl font-bold text-[var(--dark)]">{totalSocialMedia}</h3>
              </div>
              <div className="w-16 h-16 bg-[var(--orange)]/10 rounded-xl flex items-center justify-center">
                <ShareNetwork size={32} weight="bold" className="text-[var(--orange)]" />
              </div>
            </div>
          </div>

          {/* Total Gallery Images */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-[var(--border)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Galeri Foto</p>
                <h3 className="text-3xl font-bold text-[var(--dark)]">{totalGalleryImages}</h3>
              </div>
              <div className="w-16 h-16 bg-[var(--cream)]/50 rounded-xl flex items-center justify-center">
                <ImageSquare size={32} weight="bold" className="text-[var(--primary)]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4">
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-[var(--border)] overflow-hidden mb-8">
          <div className="border-b border-[var(--border)]">
            <div className="flex">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-4 font-semibold transition-colors flex items-center gap-2 ${
                  activeTab === 'overview'
                    ? 'text-[var(--primary)] border-b-2 border-[var(--primary)]'
                    : 'text-gray-600 hover:text-[var(--primary)]'
                }`}
              >
                <ChartLineUp size={20} weight="bold" />
                <span>Ringkasan</span>
              </button>
              <button
                onClick={() => setActiveTab('umkm')}
                className={`px-6 py-4 font-semibold transition-colors flex items-center gap-2 ${
                  activeTab === 'umkm'
                    ? 'text-[var(--primary)] border-b-2 border-[var(--primary)]'
                    : 'text-gray-600 hover:text-[var(--primary)]'
                }`}
              >
                <Storefront size={20} weight="bold" />
                <span>UMKM Saya ({totalUmkm})</span>
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-[var(--dark)] mb-6">Statistik UMKM Anda</h3>

                  {totalUmkm === 0 ? (
                    <div className="text-center py-16 bg-gray-50 rounded-xl">
                      <Storefront size={64} weight="bold" className="text-gray-300 mx-auto mb-4" />
                      <h4 className="text-xl font-semibold text-gray-600 mb-2">Belum Ada UMKM</h4>
                      <p className="text-gray-500 mb-6">Daftarkan UMKM pertama Anda sekarang dan mulai kelola dengan mudah</p>
                      <button
                        onClick={handleAddUmkm}
                        className="px-8 py-4 bg-[var(--primary)] text-white rounded-lg font-bold hover:bg-[var(--dark)] transition-colors flex items-center gap-2 mx-auto"
                      >
                        <Plus size={20} weight="bold" />
                        <span>Tambah UMKM Pertama</span>
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* UMKM by Category */}
                      <div className="bg-gray-50 rounded-xl p-6">
                        <h4 className="font-bold text-xl text-[var(--dark)] mb-6">Distribusi Kategori UMKM</h4>
                        <div className="space-y-5">
                          {Array.from(new Set(userUmkm.map(u => u.type))).map((category, idx) => {
                            const count = userUmkm.filter(u => u.type === category).length;
                            const percentage = (count / totalUmkm) * 100;
                            return (
                              <div key={category} className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-base font-medium text-gray-700">{category}</span>
                                  <span className="text-base font-bold text-[var(--primary)]">{count} UMKM</span>
                                </div>
                                <div className="w-full bg-[var(--border)] rounded-full h-3">
                                  <div
                                    className="bg-[var(--primary)] h-3 rounded-full transition-all duration-500 ease-out"
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Quick Stats */}
                      <div className="bg-gray-50 rounded-xl p-6">
                        <h4 className="font-bold text-xl text-[var(--dark)] mb-6">Statistik Rata-rata</h4>
                        <div className="space-y-6">
                          <div className="p-4 bg-white rounded-lg border border-[var(--border)]">
                            <div className="flex items-center justify-between">
                              <span className="text-base text-gray-600">Online Shop per UMKM</span>
                              <span className="text-xl font-bold text-[var(--primary)]">
                                {totalUmkm > 0 ? +(totalOnlineShops / totalUmkm).toFixed(1) : 0}
                              </span>
                            </div>
                          </div>

                          <div className="p-4 bg-white rounded-lg border border-[var(--border)]">
                            <div className="flex items-center justify-between">
                              <span className="text-base text-gray-600">Media Sosial per UMKM</span>
                              <span className="text-xl font-bold text-[var(--primary)]">
                                {totalUmkm > 0 ? +(totalSocialMedia / totalUmkm).toFixed(1) : 0}
                              </span>
                            </div>
                          </div>

                          <div className="p-4 bg-white rounded-lg border border-[var(--border)]">
                            <div className="flex items-center justify-between">
                              <span className="text-base text-gray-600">Foto Galeri per UMKM</span>
                              <span className="text-xl font-bold text-[var(--primary)]">
                                {totalUmkm > 0 ? +(totalGalleryImages / totalUmkm).toFixed(1) : 0}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* UMKM List Tab */}
            {activeTab === 'umkm' && (
              <div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                  <h3 className="text-2xl font-bold text-[var(--dark)]">Daftar UMKM Saya</h3>
                  <button
                    onClick={handleAddUmkm}
                    className="px-6 py-3 bg-[var(--primary)] text-white rounded-lg font-bold hover:bg-[var(--dark)] transition-colors flex items-center gap-2"
                  >
                    <Plus size={20} weight="bold" />
                    <span>Tambah UMKM Baru</span>
                  </button>
                </div>

                {userUmkm.length === 0 ? (
                  <div className="text-center py-16 bg-gray-50 rounded-xl">
                    <Storefront size={64} weight="bold" className="text-gray-300 mx-auto mb-4" />
                    <h4 className="text-xl font-semibold text-gray-600 mb-2">Belum Ada UMKM Terdaftar</h4>
                    <p className="text-gray-500 mb-6">Klik tombol "Tambah UMKM Baru" untuk mulai mendaftarkan UMKM Anda</p>
                    <button
                      onClick={handleAddUmkm}
                      className="px-8 py-4 bg-[var(--primary)] text-white rounded-lg font-bold hover:bg-[var(--dark)] transition-colors flex items-center gap-2 mx-auto"
                    >
                      <Plus size={20} weight="bold" />
                      <span>Tambah UMKM Pertama</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userUmkm.map((umkm) => (
                      <div key={umkm.id} className="bg-white rounded-xl shadow-sm border border-[var(--border)] hover:shadow-md transition-all duration-300">
                        {/* Image */}
                        <div className="relative h-48 bg-gray-100 overflow-hidden">
                          {umkm.logo ? (
                            <Image
                              src={umkm.logo}
                              alt={umkm.name}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              quality={75}
                            />
                          ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <ImageSquare size={64} weight="thin" className="text-gray-400 mb-2" />
                              <p className="text-sm text-gray-400">Tidak ada logo</p>
                            </div>
                          )}
                          <div className="absolute top-3 right-3 px-3 py-1 bg-[var(--primary)] text-white text-xs font-bold rounded-full z-10">
                            {umkm.type}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-5">
                          <h4 className="text-lg font-bold text-[var(--dark)] mb-3 line-clamp-1">
                            {umkm.name}
                          </h4>

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin size={16} weight="fill" className="text-[var(--primary)] flex-shrink-0" />
                              <span className="line-clamp-1">{umkm.location || 'Lokasi tidak tersedia'}</span>
                            </div>
                            {umkm.contact && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Phone size={16} weight="fill" className="text-[var(--primary)] flex-shrink-0" />
                                <span>{umkm.contact}</span>
                              </div>
                            )}
                          </div>

                          {/* Stats */}
                          <div className="grid grid-cols-3 gap-3 mb-5 pt-4 border-t border-[var(--border)]">
                            <div className="text-center">
                              <div className="text-xs text-gray-500 mb-1">Online Shop</div>
                              <div className="text-lg font-bold text-[var(--primary)]">{umkm.online_shop?.length || 0}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-gray-500 mb-1">Sosial Media</div>
                              <div className="text-lg font-bold text-[var(--primary)]">{umkm.media_sosial?.length || 0}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-gray-500 mb-1">Galeri</div>
                              <div className="text-lg font-bold text-[var(--primary)]">{umkm.umkm_galeri?.length || 0}</div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2">
                            <Link
                              href={`/umkm/${umkm.id}`}
                              className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-center text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                            >
                              <Eye size={16} weight="bold" />
                              <span>Lihat</span>
                            </Link>
                            <button
                              onClick={() => handleEditUmkm(umkm)}
                              className="flex-1 px-3 py-2 bg-[var(--primary)] text-white rounded-lg text-center text-sm font-medium hover:bg-[var(--dark)] transition-colors flex items-center justify-center gap-2"
                            >
                              <PencilSimple size={16} weight="bold" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteUmkm(String(umkm.id))}
                              className="px-3 py-2 bg-red-500 text-white rounded-lg text-center text-sm font-medium hover:bg-red-600 transition-colors"
                            >
                              <Trash size={16} weight="bold" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* UMKM Form Modal */}
      <UmkmFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmitForm}
        umkm={selectedUmkm}
        mode={modalMode}
        userWhatsapp={userWhatsapp}
      />

      {/* UMKM Restriction Modal */}
      {showRestrictionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="bg-[var(--primary)] text-white p-6 rounded-t-xl">
              <h3 className="text-xl font-bold">Informasi</h3>
            </div>

            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Mohon maaf untuk saat ini hanya bisa menambahkan 1 UMKM.
              </p>
              <p className="text-gray-600 text-sm">
                Setiap pengguna hanya dapat memiliki satu UMKM. Silakan edit UMKM yang sudah ada jika ingin membuat perubahan.
              </p>
            </div>

            <div className="p-6 bg-[var(--background)] rounded-b-xl flex justify-end gap-3">
              <button
                onClick={() => setShowRestrictionModal(false)}
                className="px-6 py-3 bg-[var(--primary)] text-white rounded-lg font-bold hover:bg-[var(--dark)] transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Editing Modal */}
      {showEditProfileModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[var(--primary)] text-white p-6 rounded-t-xl flex items-center justify-between">
              <h3 className="text-2xl font-bold">Edit Profil</h3>
              <button
                onClick={() => setShowEditProfileModal(false)}
                className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
              >
                <X size={24} weight="bold" />
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={userName}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={userEmail}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Email tidak dapat diubah</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Alamat
                </label>
                <textarea
                  name="address"
                  rows={3}
                  defaultValue={userAddress}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Password Lama (Untuk ganti password)
                </label>
                <input
                  type="password"
                  name="oldPassword"
                  placeholder="Masukkan password lama Anda"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Password Baru (Opsional)
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Kosongkan jika tidak ingin mengubah password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Minimal 6 karakter. Kosongkan jika tidak ingin mengubah.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditProfileModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-[var(--primary)] text-white rounded-lg font-bold hover:opacity-90 transition-all"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleConfirmLogout}
        title="Konfirmasi Keluar"
        message="Apakah Anda yakin ingin keluar dari akun Anda?"
        confirmText="Ya, Keluar"
        cancelText="Batal"
      />

      {/* Delete UMKM Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Konfirmasi Hapus UMKM"
        message="Apakah Anda yakin ingin menghapus UMKM ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Ya, Hapus"
        cancelText="Batal"
      />
    </div>
  );
}