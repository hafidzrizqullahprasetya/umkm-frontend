"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Umkm } from "@/types/umkm";
import {
  Storefront,
  ChartLineUp,
  Users,
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
  UserCircle,
  Envelope,
  MapTrifold,
  ShieldCheck,
  UploadSimple,
  FileJs,
  Download,
  X,
  CaretLeft,
  CaretRight,
} from "phosphor-react";
import Link from "next/link";
import UmkmFormModal from "../dashboard/UmkmFormModal"; // Import the shared modal

interface AdminDashboardProps {
  user: any;
  allUmkm: Umkm[];
  allUsers: any[];
}

export default function AdminDashboard({
  user,
  allUmkm: initialUmkm,
  allUsers: initialUsers,
}: AdminDashboardProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<"overview" | "umkm" | "users" | "upload">(
    "overview"
  );

  // Helper function to get access token from various sources
  const getAccessToken = () => {
    // First try to get from user prop (from NextAuth session)
    if (user && (user as any).token) {
      return (user as any).token;
    }
    
    if ((session as any)?.accessToken) {
      return (session as any).accessToken;
    }

    // Fallback to localStorage or sessionStorage
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token') || sessionStorage.getItem('token');
    }
    return null;
  };
  const [allUmkm, setAllUmkm] = useState(initialUmkm);
  const [allUsers, setAllUsers] = useState(initialUsers);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Pagination states
  const [umkmPage, setUmkmPage] = useState(1);
  const [usersPage, setUsersPage] = useState(1);
  const itemsPerPage = 6; // 6 items per page for UMKM list
  const usersPerPage = 10; // 10 users per page for table

  // Unified Modal States
  const [showUmkmModal, setShowUmkmModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedUmkm, setSelectedUmkm] = useState<Umkm | null>(null);

  // Edit User Modal
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [activeUserTab, setActiveUserTab] = useState<'basic' | 'security'>('basic');

  // Toast state
  const [toast, setToast] = useState<{show: boolean; message: string; type: 'success' | 'error'}>({
    show: false,
    message: '',
    type: 'success'
  });

  // Profile editing state
  const [isEditingOwnProfile, setIsEditingOwnProfile] = useState(false);

  // State for restriction modal
  const [showRestrictionModal, setShowRestrictionModal] = useState(false);



  const getUserInitials = (name: string) => {
    if (!name) return "AD";
    const nameParts = name.trim().split(" ");
    if (nameParts.length === 1) {
      return nameParts[0].substring(0, 2).toUpperCase();
    }
    return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
  };

  const handleLogout = async () => {
    if (confirm("Apakah Anda yakin ingin keluar?")) {
      await signOut({ callbackUrl: "/" });
    }
  };

  // Pagination calculations
  const totalUmkmPages = Math.ceil(allUmkm.length / itemsPerPage);
  const totalUsersPages = Math.ceil(allUsers.length / usersPerPage);

  const paginatedUmkm = allUmkm.slice(
    (umkmPage - 1) * itemsPerPage,
    umkmPage * itemsPerPage
  );

  const paginatedUsers = allUsers.slice(
    (usersPage - 1) * usersPerPage,
    usersPage * usersPerPage
  );

  // Edit handlers
  const handleEditUser = (userItem: any) => {
    setEditingUser(userItem);
    setShowEditUserModal(true);
  };

  const handleAddUmkm = () => {
    setModalMode('add');
    setSelectedUmkm(null);
    setShowUmkmModal(true);
  };

  const handleEditUmkm = (umkm: Umkm) => {
    setModalMode('edit');
    setSelectedUmkm(umkm);
    setShowUmkmModal(true);
  };

  // Since we're removing the duplicate modal, we no longer need these functions.
  // The edit functionality will be handled by the existing UmkmFormModal.

  const handleSubmitUmkmForm = async (data: any) => {
    const token = getAccessToken();
    if (!token) {
      alert("Authentication error. Please log in again.");
      return;
    }

    try {
      const baseUrl = getBackendUrl();
      const method = modalMode === 'add' ? 'POST' : 'PUT';
      
      let url = `${baseUrl}/api/umkm`;
      
      // For PUT, find the user email associated with the UMKM
      if (method === 'PUT' && selectedUmkm) {
        const umkmOwner = allUsers.find(u => u.id === selectedUmkm.user_id);
        const email = umkmOwner?.email;
        if (!email) throw new Error("Could not find owner's email for this UMKM.");
        url += `?email=${encodeURIComponent(email)}`;
      } else if (method === 'POST') {
        // For POST, the email of the owner must be provided.
        // The form modal should ideally have a user selector for admins.
        // For now, we'll check if data.email is passed, otherwise default to the admin's own email.
        const ownerEmail = data.email || user.email;
        if (!ownerEmail) throw new Error("Owner email is required to create a new UMKM.");
        url += `?email=${encodeURIComponent(ownerEmail)}`;
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || (method === 'POST' ? 'Failed to create UMKM' : 'Failed to update UMKM'));
      }
      
      showToast(method === 'POST' ? 'UMKM berhasil ditambahkan!' : 'UMKM berhasil diperbarui!', 'success');
      setShowUmkmModal(false);
      setTimeout(() => {
        router.refresh(); // Refresh server-side props
      }, 1000);

    } catch (error: any) {
      console.error('Error submitting UMKM form:', error);
      showToast(`Gagal: ${error.message}`, 'error');
    }
  };

  const handleUpdateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const baseUrl = getBackendUrl();

      if (isEditingOwnProfile) {
        // Handle profile update for current user
        const updateData: any = {
          name: formData.get("name"),
          address: formData.get("address"),
        };

        const oldPassword = formData.get("oldPassword") as string;
        const newPassword = formData.get("password") as string;

        // For profile update, we need both old and new password if changing
        if (newPassword && newPassword.trim() !== "") {
          if (!oldPassword || oldPassword.trim() === "") {
            throw new Error("Password lama diperlukan untuk mengganti password");
          }
          updateData.old_password = oldPassword;
          updateData.new_password = newPassword;
        }

        // Get access token
        const token = getAccessToken();
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };

        // Only add authorization header if token exists
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        // Use profile update endpoint
        const response = await fetch(`${baseUrl}/user/profile`, {
          method: "PUT",
          headers,
          body: JSON.stringify(updateData),
        });

        if (!response.ok) {
          const errorResult = await response.json();
          throw new Error(errorResult.message || "Failed to update profile");
        }

        showToast("Profil berhasil diperbarui!", 'success');
        setTimeout(() => {
          router.refresh();
        }, 1000);
      } else {
        // Handle user update for other users (admin functionality)
        const updateData: any = {
          username: formData.get("username"),
          name: formData.get("name"),
          address: formData.get("address"),
          whatsapp: formData.get("whatsapp"),
          role: formData.get("role"),
        };

        const password = formData.get("password") as string;
        if (password && password.trim() !== "") {
          updateData.password = password;
        }

        // Get access token
        const token = getAccessToken();
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };

        // Only add authorization header if token exists
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(`${baseUrl}/user/${editingUser.id}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(updateData),
        });

        if (!response.ok) {
          const errorResult = await response.json();
          throw new Error(errorResult.message || "Failed to update user");
        }

        showToast("User berhasil diperbarui!", 'success');
        setTimeout(() => {
          router.refresh();
        }, 1000);
      }

      setShowEditUserModal(false);
      setEditingUser(null);
      setIsEditingOwnProfile(false); // Reset profile editing flag

    } catch (error: any) {
      console.error("Error updating user:", error);
      showToast(`Gagal memperbarui user: ${error.message}`, 'error');
    }
  };

  // Function to check if user already has one UMKM (for admin_umkm restriction)
  const hasUserUmkm = (userId: number) => {
    const userUmkm = allUmkm.filter(umkm => umkm.user_id === userId);
    return userUmkm.length > 0;
  };

  // Function to handle adding UMKM with restriction check (for use in user dashboard)
  const handleAddUmkmWithRestriction = (user: any, userUmkm: Umkm[]) => {
    // Check if user is admin_umkm and already has a UMKM
    if (user.role === 'admin_umkm' && userUmkm.length > 0) {
      setShowRestrictionModal(true);
      return false;
    }
    // If user can add UMKM, proceed (this would be handled in the user dashboard)
    return true;
  };

  // Toast helper function
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setShowProfileDropdown(false);
      }
    };

    if (showProfileDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileDropdown]);

  // Calculate statistics
  const totalUsers = allUsers.length;
  const totalUmkm = allUmkm.length;
  const totalOnlineShops = allUmkm.reduce(
    (sum, umkm) => sum + (umkm.online_shop?.length || 0),
    0
  );
  const totalSocialMedia = allUmkm.reduce(
    (sum, umkm) => sum + (umkm.media_sosial?.length || 0),
    0
  );

  const getBackendUrl = () => {
    return process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
  };

  const handleDeleteUmkm = async (umkmId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus UMKM ini?")) {
      return;
    }
    const token = getAccessToken();
    if (!token) {
      showToast("Authentication error. Please log in again.", 'error');
      return;
    }

    try {
      const baseUrl = getBackendUrl();
      const umkmToDelete = allUmkm.find(umkm => umkm.id === umkmId);
      const owner = allUsers.find(u => u.id === umkmToDelete?.user_id);
      const userEmail = owner?.email;

      if (!userEmail) {
        throw new Error("User email not found for UMKM deletion");
      }

      const response = await fetch(`${baseUrl}/api/umkm?email=${encodeURIComponent(userEmail)}`, {
        method: "DELETE",
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete UMKM");
      }

      setAllUmkm((prev) => prev.filter((umkm) => umkm.id !== umkmId));
      showToast("UMKM berhasil dihapus!", 'success');
      setTimeout(() => {
        router.refresh();
      }, 1000);
    } catch (error: any) {
      console.error("Error deleting UMKM:", error);
      showToast(`Gagal menghapus UMKM: ${error.message}`, 'error');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (
      !confirm(
        "Apakah Anda yakin ingin menghapus user ini? Semua UMKM milik user ini juga akan terhapus."
      )
    ) {
      return;
    }

    try {
      const baseUrl = getBackendUrl();
      // Get access token
      const token = getAccessToken();
      const headers: Record<string, string> = {};

      // Only add authorization header if token exists
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${baseUrl}/user/${userId}`, {
        method: "DELETE",
        headers,
      });

      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult.message || "Failed to delete user");
      }

      setAllUsers((prev) => prev.filter((u) => u.id !== userId));
      showToast("User berhasil dihapus!", 'success');
      setTimeout(() => {
        router.refresh();
      }, 1000);
    } catch (error: any) {
      console.error("Error deleting user:", error);
      showToast(`Gagal menghapus user: ${error.message}`, 'error');
    }
  };

  const handleBulkUploadUmkm = async (file: File) => {
    try {
      const text = await file.text();
      const jsonData = JSON.parse(text);

      if (!jsonData.umkms || !Array.isArray(jsonData.umkms)) {
        throw new Error('File JSON harus berisi array "umkms"');
      }

      const baseUrl = getBackendUrl();
      const response = await fetch(`${baseUrl}/api/umkm/bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jsonData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal upload UMKM");
      }

      // Build detailed message
      const totalSuccess = (result.data.created?.length || 0) + (result.data.updated?.length || 0);
      let message = `Upload selesai!\n\n`;
      message += `✅ Total Berhasil: ${totalSuccess} UMKM\n`;

      if (result.data.created?.length > 0) {
        message += `   📝 Dibuat baru: ${result.data.created.length}\n`;
      }
      if (result.data.updated?.length > 0) {
        message += `   🔄 Diperbarui: ${result.data.updated.length}\n`;
      }

      message += `❌ Gagal: ${result.data.failed?.length || 0} UMKM`;

      if (result.data.failed && result.data.failed.length > 0) {
        message += "\n\nDetail error:";
        result.data.failed.forEach((fail: any, index: number) => {
          message += `\n${index + 1}. ${fail.data.name || fail.data.email}: ${fail.error}`;
        });
      }

      alert(message);

      if (totalSuccess > 0) {
        router.refresh();
      }
    } catch (error) {
      console.error("Error uploading UMKM:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Gagal upload UMKM. Pastikan format JSON benar."
      );
    }
  };

  const handleBulkUploadUsers = async (file: File) => {
    try {
      const text = await file.text();
      const jsonData = JSON.parse(text);

      if (!jsonData.users || !Array.isArray(jsonData.users)) {
        throw new Error('File JSON harus berisi array "users"');
      }

      const baseUrl = getBackendUrl();
      const response = await fetch(`${baseUrl}/user/bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jsonData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal upload users");
      }

      // Build detailed message
      const totalSuccess = (result.data.created?.length || 0) + (result.data.updated?.length || 0);
      let message = `Upload selesai!\n\n`;
      message += `✅ Total Berhasil: ${totalSuccess} user\n`;

      if (result.data.created?.length > 0) {
        message += `   📝 Dibuat baru: ${result.data.created.length}\n`;
      }
      if (result.data.updated?.length > 0) {
        message += `   🔄 Diperbarui: ${result.data.updated.length}\n`;
      }

      message += `❌ Gagal: ${result.data.failed?.length || 0} user`;

      if (result.data.failed && result.data.failed.length > 0) {
        message += "\n\nDetail error:";
        result.data.failed.forEach((fail: any, index: number) => {
          message += `\n${index + 1}. ${fail.data.email}: ${fail.error}`;
        });
      }

      alert(message);

      if (totalSuccess > 0) {
        router.refresh();
      }
    } catch (error) {
      console.error("Error uploading users:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Gagal upload users. Pastikan format JSON benar."
      );
    }
  };

  const downloadUmkmTemplate = () => {
    const template = {
      umkms: [
        {
          email: "user1@email.com",
          name: "Warung Makan Bu Siti",
          type: "Kuliner",
          description: "Warung makan tradisional dengan menu masakan rumahan yang lezat dan harga terjangkau",
          location: "Jl. Raya Bogor No. 123, Jakarta Timur",
          contact: "081234567890",
          logo: "",
          gmaps: "https://maps.google.com/?q=-6.2088,106.8456",
          online_shop: [
            { type: "Tokopedia", url: "https://tokopedia.com/warungbusiti" },
            { type: "Shopee", url: "https://shopee.co.id/warungbusiti" }
          ],
          media_sosial: [
            { type: "Instagram", url: "https://instagram.com/warungbusiti" },
            { type: "Facebook", url: "https://facebook.com/warungbusiti" }
          ],
          umkm_galeri: []
        },
        {
          email: "user2@email.com",
          name: "Batik Karya Nusantara",
          type: "Fashion",
          description: "Produsen batik tulis dan cap dengan motif tradisional dan modern berkualitas tinggi",
          location: "Jl. Malioboro No. 45, Yogyakarta",
          contact: "082345678901",
          logo: "",
          gmaps: "https://maps.google.com/?q=-7.7956,110.3695",
          online_shop: [
            { type: "Tokopedia", url: "https://tokopedia.com/batikkarya" },
            { type: "Lazada", url: "https://lazada.co.id/batikkarya" }
          ],
          media_sosial: [
            { type: "Instagram", url: "https://instagram.com/batikkarya" },
            { type: "TikTok", url: "https://tiktok.com/@batikkarya" }
          ],
          umkm_galeri: []
        }
      ],
      catatan: "Field 'contact' bisa diisi dengan nomor WhatsApp UMKM. Jika ingin menggunakan nomor WhatsApp yang sama dengan user, isi dengan nomor yang sama di data user. Field 'logo' dan 'umkm_galeri' bisa dikosongkan, gambar dapat ditambahkan nanti via Edit UMKM."
    };

    const blob = new Blob([JSON.stringify(template, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "template-umkm.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };



  const downloadUsersTemplate = () => {
    const template = {
      users: [
        {
          username: "user1",
          email: "user1@email.com",
          password: "password123",
          name: "Siti Nurhaliza",
          address: "Jl. Raya Bogor No. 123, Jakarta Timur",
          whatsapp: "081234567890",
          role: "admin_umkm"
        },
        {
          username: "user2",
          email: "user2@email.com",
          password: "password456",
          name: "Budi Santoso",
          address: "Jl. Malioboro No. 45, Yogyakarta",
          whatsapp: "082345678901",
          role: "admin_umkm"
        }
      ],
      catatan: "Field 'whatsapp' adalah nomor WhatsApp user yang dapat digunakan sebagai kontak UMKM. Saat user menambah UMKM, mereka bisa memilih untuk menggunakan nomor WhatsApp ini atau input nomor berbeda."
    };

    const blob = new Blob([JSON.stringify(template, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "template-users.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] pb-12">
      {/* Dashboard Header */}
      <div className="bg-[var(--primary)] text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-white">
                  UMKM Indonesia
                </div>
              </div>

              <div className="border-l border-white/30 h-12"></div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck
                    size={24}
                    weight="bold"
                    className="text-[var(--secondary)]"
                  />
                  <h1 className="text-2xl font-bold text-white">
                    Dashboard Administrator
                  </h1>
                </div>
                <p className="text-white/90">
                  Kelola semua data UMKM dan pengguna
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/"
                className="px-6 py-3 bg-[var(--secondary)] text-[var(--dark)] rounded-lg font-bold hover:bg-[var(--orange)] hover:text-white transition-all flex items-center gap-2"
              >
                <span>Kembali ke Beranda</span>
              </Link>

              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center gap-3 bg-white/20 hover:bg-white/30 rounded-lg px-4 py-3 transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-[var(--secondary)] text-[var(--dark)] flex items-center justify-center font-bold text-sm">
                    {getUserInitials(user.name || user.username || "Admin")}
                  </div>

                  <div className="text-left">
                    <div className="text-sm font-bold text-white truncate max-w-[120px]">
                      {user.name || user.username || "Administrator"}
                    </div>
                    <div className="text-xs text-white/70 truncate max-w-[120px]">
                      {user.email}
                    </div>
                  </div>

                  <CaretDown
                    size={16}
                    weight="bold"
                    className={`text-white transition-transform ${
                      showProfileDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
                    <div className="p-4 bg-[var(--primary)]/10 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-[var(--primary)] text-white flex items-center justify-center font-bold text-base">
                          {getUserInitials(
                            user.name || user.username || "Admin"
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-[var(--dark)] truncate">
                            {user.name || user.username || "Administrator"}
                          </div>
                          <div className="text-xs text-gray-600 truncate">
                            {user.email}
                          </div>
                          <div className="text-xs text-[var(--primary)] font-bold mt-1">
                            Administrator
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-2 space-y-1">
                      <button
                        onClick={() => {
                          // Set the editing user to the current user and open the edit modal
                          setEditingUser(user);
                          setIsEditingOwnProfile(true); // Set flag for own profile editing
                          setShowEditUserModal(true);
                          setActiveUserTab('basic'); // Start with basic info tab
                          setShowProfileDropdown(false); // Close the dropdown
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors group"
                      >
                        <UserCircle
                          size={20}
                          weight="bold"
                          className="group-hover:scale-110 transition-transform"
                        />
                        <span className="font-medium">Edit Profil</span>
                      </button>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
                      >
                        <SignOut
                          size={20}
                          weight="bold"
                          className="group-hover:scale-110 transition-transform"
                        />
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
          <div className="bg-white rounded-xl shadow-sm p-6 border border-[var(--border)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">
                  Total Pengguna
                </p>
                <h3 className="text-3xl font-bold text-[var(--dark)]">
                  {totalUsers}
                </h3>
              </div>
              <div className="w-16 h-16 bg-[var(--primary)]/10 rounded-xl flex items-center justify-center">
                <Users
                  size={32}
                  weight="bold"
                  className="text-[var(--primary)]"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-[var(--border)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">
                  Total UMKM
                </p>
                <h3 className="text-3xl font-bold text-[var(--dark)]">
                  {totalUmkm}
                </h3>
              </div>
              <div className="w-16 h-16 bg-[var(--secondary)]/10 rounded-xl flex items-center justify-center">
                <Storefront
                  size={32}
                  weight="bold"
                  className="text-[var(--primary)]"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-[var(--border)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">
                  Online Shop
                </p>
                <h3 className="text-3xl font-bold text-[var(--dark)]">
                  {totalOnlineShops}
                </h3>
              </div>
              <div className="w-16 h-16 bg-[var(--orange)]/10 rounded-xl flex items-center justify-center">
                <ShoppingBag
                  size={32}
                  weight="bold"
                  className="text-[var(--orange)]"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-[var(--border)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">
                  Media Sosial
                </p>
                <h3 className="text-3xl font-bold text-[var(--dark)]">
                  {totalSocialMedia}
                </h3>
              </div>
              <div className="w-16 h-16 bg-[var(--cream)]/50 rounded-xl flex items-center justify-center">
                <ShareNetwork
                  size={32}
                  weight="bold"
                  className="text-[var(--primary)]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm border border-[var(--border)] overflow-hidden mb-8">
          <div className="border-b border-[var(--border)]">
            <div className="flex">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-6 py-4 font-semibold transition-colors flex items-center gap-2 ${
                  activeTab === "overview"
                    ? "text-[var(--primary)] border-b-2 border-[var(--primary)]"
                    : "text-gray-600 hover:text-[var(--primary)]"
                }`}
              >
                <ChartLineUp size={20} weight="bold" />
                <span>Ringkasan</span>
              </button>
              <button
                onClick={() => setActiveTab("umkm")}
                className={`px-6 py-4 font-semibold transition-colors flex items-center gap-2 ${
                  activeTab === "umkm"
                    ? "text-[var(--primary)] border-b-2 border-[var(--primary)]"
                    : "text-gray-600 hover:text-[var(--primary)]"
                }`}
              >
                <Storefront size={20} weight="bold" />
                <span>Semua UMKM ({totalUmkm})</span>
              </button>
              <button
                onClick={() => setActiveTab("users")}
                className={`px-6 py-4 font-semibold transition-colors flex items-center gap-2 ${
                  activeTab === "users"
                    ? "text-[var(--primary)] border-b-2 border-[var(--primary)]"
                    : "text-gray-600 hover:text-[var(--primary)]"
                }`}
              >
                <Users size={20} weight="bold" />
                <span>Pengguna ({totalUsers})</span>
              </button>
              <button
                onClick={() => setActiveTab("upload")}
                className={`px-6 py-4 font-semibold transition-colors flex items-center gap-2 ${
                  activeTab === "upload"
                    ? "text-[var(--primary)] border-b-2 border-[var(--primary)]"
                    : "text-gray-600 hover:text-[var(--primary)]"
                }`}
              >
                <UploadSimple size={20} weight="bold" />
                <span>Upload JSON</span>
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-[var(--dark)] mb-6">
                    Statistik Platform
                  </h3>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="font-bold text-xl text-[var(--dark)] mb-6">
                        UMKM per Kategori
                      </h4>
                      <div className="space-y-5">
                        {Array.from(new Set(allUmkm.map((u) => u.type))).map(
                          (category) => {
                            const count = allUmkm.filter(
                              (u) => u.type === category
                            ).length;
                            const percentage =
                              totalUmkm > 0 ? (count / totalUmkm) * 100 : 0;
                            return (
                              <div key={category} className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-base font-medium text-gray-700">
                                    {category}
                                  </span>
                                  <span className="text-base font-bold text-[var(--primary)]">
                                    {count} UMKM
                                  </span>
                                </div>
                                <div className="w-full bg-[var(--border)] rounded-full h-3">
                                  <div
                                    className="bg-[var(--primary)] h-3 rounded-full transition-all duration-500 ease-out"
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="font-bold text-xl text-[var(--dark)] mb-6">
                        Pengguna per Role
                      </h4>
                      <div className="space-y-6">
                        {["admin_umkm", "administrator"].map((role) => {
                          const count = allUsers.filter(
                            (u) => u.role === role
                          ).length;
                          const percentage =
                            totalUsers > 0 ? (count / totalUsers) * 100 : 0;
                          return (
                            <div key={role} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-base font-medium text-gray-700">
                                  {role === "admin_umkm"
                                    ? "Admin UMKM"
                                    : "Administrator"}
                                </span>
                                <span className="text-base font-bold text-[var(--primary)]">
                                  {count} user
                                </span>
                              </div>
                              <div className="w-full bg-[var(--border)] rounded-full h-3">
                                <div
                                  className="bg-[var(--orange)] h-3 rounded-full transition-all duration-500 ease-out"
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* UMKM Tab */}
            {activeTab === "umkm" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-[var(--dark)]">
                    Semua UMKM
                  </h3>
                </div>

                {allUmkm.length === 0 ? (
                  <div className="text-center py-16 bg-gray-50 rounded-xl">
                    <Storefront
                      size={64}
                      weight="bold"
                      className="text-gray-300 mx-auto mb-4"
                    />
                    <h4 className="text-xl font-semibold text-gray-600 mb-2">
                      Belum Ada UMKM Terdaftar
                    </h4>
                    <p className="text-gray-500">
                      Tidak ada UMKM yang terdaftar di sistem
                    </p>
                  </div>
                ) : (
                  <>
                  <div className="space-y-4">
                    {paginatedUmkm.map((umkm) => (
                      <div
                        key={umkm.id}
                        className="bg-white rounded-xl shadow-sm border border-[var(--border)] hover:shadow-md transition-all duration-300 p-4"
                      >
                        <div className="flex gap-4">
                          {/* Logo */}
                          <div className="flex-shrink-0 w-32 h-32 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                            {umkm.logo ? (
                              <img
                                src={umkm.logo}
                                alt={umkm.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="text-center p-4">
                                <ImageSquare size={48} weight="thin" className="text-gray-400 mx-auto mb-2" />
                                <p className="text-xs text-gray-400">No Logo</p>
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-1">
                                  <h4 className="text-xl font-bold text-[var(--dark)] truncate">
                                    {umkm.name}
                                  </h4>
                                  <span className="px-3 py-1 bg-[var(--primary)] text-white text-xs font-bold rounded-full flex-shrink-0">
                                    {umkm.type}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-1">
                                  Owner: <span className="font-medium">{umkm.user?.name || umkm.user?.username || "N/A"}</span>
                                  {" • "}
                                  <span className="text-gray-500">{umkm.user?.email}</span>
                                </p>
                              </div>
                            </div>

                            {umkm.description && (
                              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                {umkm.description}
                              </p>
                            )}

                            <div className="grid grid-cols-2 gap-3 mb-3">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <MapPin
                                  size={16}
                                  weight="fill"
                                  className="text-[var(--primary)] flex-shrink-0"
                                />
                                <span className="line-clamp-1">
                                  {umkm.location || "Lokasi tidak tersedia"}
                                </span>
                              </div>
                              {umkm.contact && (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Phone
                                    size={16}
                                    weight="fill"
                                    className="text-[var(--primary)] flex-shrink-0"
                                  />
                                  <span>{umkm.contact}</span>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-6 text-sm">
                                <div className="flex items-center gap-2">
                                  <ShoppingBag size={16} weight="bold" className="text-[var(--primary)]" />
                                  <span className="font-medium">{umkm.online_shop?.length || 0} Shop</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <ShareNetwork size={16} weight="bold" className="text-[var(--primary)]" />
                                  <span className="font-medium">{umkm.media_sosial?.length || 0} Medsos</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <ImageSquare size={16} weight="bold" className="text-[var(--primary)]" />
                                  <span className="font-medium">{umkm.umkm_galeri?.length || 0} Galeri</span>
                                </div>
                              </div>

                              <div className="flex gap-2">
                                <Link
                                  href={`/umkm/${umkm.id}`}
                                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
                                >
                                  <Eye size={16} weight="bold" />
                                  <span>Lihat</span>
                                </Link>
                                <button
                                  onClick={() => handleEditUmkm(umkm)}
                                  className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
                                >
                                  <PencilSimple size={16} weight="bold" />
                                  <span>Edit</span>
                                </button>
                                <button
                                  onClick={() => handleDeleteUmkm(umkm.id)}
                                  className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors flex items-center gap-2"
                                >
                                  <Trash size={16} weight="bold" />
                                  <span>Hapus</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination Controls for UMKM */}
                  {totalUmkmPages > 1 && (
                    <div className="flex items-center justify-center gap-4 mt-8">
                      <button
                        onClick={() => setUmkmPage((prev) => Math.max(1, prev - 1))}
                        disabled={umkmPage === 1}
                        className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                          umkmPage === 1
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-[var(--primary)] text-white hover:opacity-90"
                        }`}
                      >
                        <CaretLeft size={16} weight="bold" />
                        <span>Sebelumnya</span>
                      </button>

                      <div className="flex items-center gap-2">
                        {Array.from({ length: totalUmkmPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => setUmkmPage(page)}
                            className={`w-10 h-10 rounded-lg font-bold ${
                              umkmPage === page
                                ? "bg-[var(--primary)] text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => setUmkmPage((prev) => Math.min(totalUmkmPages, prev + 1))}
                        disabled={umkmPage === totalUmkmPages}
                        className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                          umkmPage === totalUmkmPages
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-[var(--primary)] text-white hover:opacity-90"
                        }`}
                      >
                        <span>Selanjutnya</span>
                        <CaretRight size={16} weight="bold" />
                      </button>
                    </div>
                  )}
                  </>
                )}
              </div>
            )}

            {/* Users Tab */}
            {activeTab === "users" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-[var(--dark)]">
                    Daftar Pengguna
                  </h3>
                </div>

                {allUsers.length === 0 ? (
                  <div className="text-center py-16 bg-gray-50 rounded-xl">
                    <Users
                      size={64}
                      weight="bold"
                      className="text-gray-300 mx-auto mb-4"
                    />
                    <h4 className="text-xl font-semibold text-gray-600 mb-2">
                      Belum Ada Pengguna
                    </h4>
                    <p className="text-gray-500">
                      Tidak ada pengguna terdaftar di sistem
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b-2 border-[var(--border)]">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                            Pengguna
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                            Nama
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                            Email
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                            Role
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                            UMKM
                          </th>
                          <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">
                            Aksi
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--border)]">
                        {paginatedUsers.map((userItem) => (
                          <tr
                            key={userItem.id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[var(--primary)] text-white flex items-center justify-center font-bold text-sm">
                                  {getUserInitials(
                                    userItem.name || userItem.username || "U"
                                  )}
                                </div>
                                <div>
                                  <div className="font-semibold text-[var(--dark)]">
                                    {userItem.username || "No username"}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                              {userItem.name || "-"}
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                              {userItem.email}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-bold ${
                                  userItem.role === "administrator"
                                    ? "bg-purple-100 text-purple-700"
                                    : "bg-blue-100 text-blue-700"
                                }`}
                              >
                                {userItem.role === "administrator"
                                  ? "Administrator"
                                  : "Admin UMKM"}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="font-semibold text-[var(--primary)]">
                                {
                                  allUmkm.filter(
                                    (u) => u.user_id === userItem.id
                                  ).length
                                }{" "}
                                UMKM
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => handleEditUser(userItem)}
                                  className="px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                                >
                                  <PencilSimple size={16} weight="bold" />
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(userItem.id)}
                                  disabled={
                                    userItem.role === "administrator" &&
                                    userItem.id === user.id
                                  }
                                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    userItem.role === "administrator" &&
                                    userItem.id === user.id
                                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                      : "bg-red-500 text-white hover:bg-red-600"
                                  }`}
                                >
                                  <Trash size={16} weight="bold" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Pagination Controls for Users */}
                    {totalUsersPages > 1 && (
                      <div className="flex items-center justify-center gap-4 mt-6">
                        <button
                          onClick={() => setUsersPage((prev) => Math.max(1, prev - 1))}
                          disabled={usersPage === 1}
                          className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                            usersPage === 1
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                              : "bg-[var(--primary)] text-white hover:opacity-90"
                          }`}
                        >
                          <CaretLeft size={16} weight="bold" />
                          <span>Sebelumnya</span>
                        </button>

                        <div className="flex items-center gap-2">
                          {Array.from({ length: totalUsersPages }, (_, i) => i + 1).map((page) => (
                            <button
                              key={page}
                              onClick={() => setUsersPage(page)}
                              className={`w-10 h-10 rounded-lg font-bold ${
                                usersPage === page
                                  ? "bg-[var(--primary)] text-white"
                                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                              }`}
                            >
                              {page}
                            </button>
                          ))}
                        </div>

                        <button
                          onClick={() => setUsersPage((prev) => Math.min(totalUsersPages, prev + 1))}
                          disabled={usersPage === totalUsersPages}
                          className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                            usersPage === totalUsersPages
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                              : "bg-[var(--primary)] text-white hover:opacity-90"
                          }`}
                        >
                          <span>Selanjutnya</span>
                          <CaretRight size={16} weight="bold" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Upload JSON Tab */}
            {activeTab === "upload" && (
              <div>
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-[var(--dark)] mb-2">
                    Upload Data via JSON
                  </h3>
                  <p className="text-gray-600">
                    Upload data UMKM dan pengguna secara bulk menggunakan file
                    JSON
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Upload UMKM */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-[var(--primary)] rounded-xl flex items-center justify-center">
                        <Storefront
                          size={24}
                          weight="bold"
                          className="text-white"
                        />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-[var(--dark)]">
                          Upload UMKM
                        </h4>
                        <p className="text-sm text-gray-600">
                          Upload banyak UMKM sekaligus
                        </p>
                      </div>
                    </div>

                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm font-medium text-blue-900 mb-2">
                        Format JSON:
                      </p>
                      <pre className="text-xs bg-white p-3 rounded border border-blue-200 overflow-x-auto">
                        {JSON.stringify(
                          {
                            umkms: [
                              {
                                email: "user@email.com",
                                name: "Nama UMKM",
                                type: "Kuliner",
                                description: "Deskripsi...",
                                location: "Lokasi",
                                contact: "081234567890",
                                logo: "",
                                gmaps: "url_gmaps",
                                online_shop: [
                                  { type: "Tokopedia", url: "..." },
                                ],
                                media_sosial: [
                                  { type: "Instagram", url: "..." },
                                ],
                                umkm_galeri: [],
                              },
                            ],
                          },
                          null,
                          2
                        )}
                      </pre>
                      <div className="text-xs text-blue-800 mt-2 space-y-1">
                        <p>
                          <strong>type (UMKM):</strong> "Kuliner", "Fashion", "Kerajinan", "Jasa", atau "Pertanian"
                        </p>
                        <p>
                          <strong>type (online_shop):</strong> "Tokopedia", "Shopee", "Lazada", "Blibli", atau "GoJek"
                        </p>
                        <p>
                          <strong>type (media_sosial):</strong> "Instagram", "Facebook", "TikTok", atau "X"
                        </p>
                        <p>
                          <strong>contact:</strong> Nomor WhatsApp UMKM (bisa sama dengan whatsapp user atau berbeda)
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <button
                        onClick={downloadUmkmTemplate}
                        className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-[var(--secondary)] text-[var(--dark)] rounded-lg font-bold hover:opacity-90 transition-all border-2 border-[var(--primary)]"
                      >
                        <Download size={20} weight="bold" />
                        <span>Unduh Template UMKM</span>
                      </button>

                      <label className="block">
                        <input
                          type="file"
                          accept=".json"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleBulkUploadUmkm(file);
                            e.target.value = "";
                          }}
                          className="hidden"
                          id="umkm-upload"
                        />
                        <label
                          htmlFor="umkm-upload"
                          className="cursor-pointer flex items-center justify-center gap-3 px-6 py-4 bg-[var(--primary)] text-white rounded-lg font-bold hover:opacity-90 transition-all"
                        >
                          <FileJs size={24} weight="bold" />
                          <span>Pilih File JSON UMKM</span>
                        </label>
                      </label>
                    </div>
                  </div>

                  {/* Upload Users */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-[var(--orange)] rounded-xl flex items-center justify-center">
                        <Users size={24} weight="bold" className="text-white" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-[var(--dark)]">
                          Upload Pengguna
                        </h4>
                        <p className="text-sm text-gray-600">
                          Upload banyak pengguna sekaligus
                        </p>
                      </div>
                    </div>

                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm font-medium text-blue-900 mb-2">
                        Format JSON:
                      </p>
                      <pre className="text-xs bg-white p-3 rounded border border-blue-200 overflow-x-auto">
                        {JSON.stringify(
                          {
                            users: [
                              {
                                username: "username",
                                email: "email@example.com",
                                password: "password123",
                                name: "Nama Lengkap",
                                address: "Alamat...",
                                whatsapp: "08123456789",
                                role: "admin_umkm",
                              },
                            ],
                          },
                          null,
                          2
                        )}
                      </pre>
                    </div>

                    <div className="space-y-3">
                      <button
                        onClick={downloadUsersTemplate}
                        className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-[var(--secondary)] text-[var(--dark)] rounded-lg font-bold hover:opacity-90 transition-all border-2 border-[var(--orange)]"
                      >
                        <Download size={20} weight="bold" />
                        <span>Unduh Template Pengguna</span>
                      </button>

                      <label className="block">
                        <input
                          type="file"
                          accept=".json"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleBulkUploadUsers(file);
                            e.target.value = "";
                          }}
                          className="hidden"
                          id="users-upload"
                        />
                        <label
                          htmlFor="users-upload"
                          className="cursor-pointer flex items-center justify-center gap-3 px-6 py-4 bg-[var(--orange)] text-white rounded-lg font-bold hover:opacity-90 transition-all"
                        >
                          <FileJs size={24} weight="bold" />
                          <span>Pilih File JSON Pengguna</span>
                        </label>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <h4 className="font-bold text-yellow-900 mb-2 flex items-center gap-2">
                    <ShieldCheck size={20} weight="bold" />
                    Catatan Penting
                  </h4>
                  <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
                    <li>
                      Klik tombol <strong>"Unduh Template"</strong> untuk mendapatkan contoh format JSON yang benar
                    </li>
                    <li>
                      Template sudah berisi 2 contoh data UMKM dan 2 contoh pengguna dengan field <strong>whatsapp</strong>
                    </li>
                    <li>
                      Untuk UMKM, email harus sesuai dengan email pengguna yang sudah terdaftar
                    </li>
                    <li>
                      Field <strong>contact</strong> di UMKM adalah nomor WhatsApp. Bisa sama dengan whatsapp user atau nomor berbeda untuk bisnis
                    </li>
                    <li>
                      Field <strong>whatsapp</strong> di user akan muncul sebagai opsi saat user menambah UMKM melalui form
                    </li>
                    <li>
                      Field <strong>logo</strong> dan <strong>umkm_galeri</strong> bisa dikosongkan, gambar dapat ditambahkan nanti melalui Edit UMKM
                    </li>
                    <li>
                      Untuk pengguna, email tidak boleh duplikat dengan yang sudah ada
                    </li>
                    <li>
                      Upload akan memberikan laporan jumlah data yang berhasil dan gagal
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      {showEditUserModal && editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-[var(--primary)] text-white p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Edit User</h2>
              <button
                onClick={() => {
                  setShowEditUserModal(false);
                  setEditingUser(null);
                }}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X size={24} weight="bold" />
              </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-[var(--border)] bg-[var(--background)]">
              <div className="flex">
                <button
                  onClick={() => setActiveUserTab('basic')}
                  className={`px-6 py-3 font-semibold text-sm transition-colors ${
                    activeUserTab === 'basic'
                      ? 'text-[var(--primary)] border-b-2 border-[var(--primary)] bg-white'
                      : 'text-gray-600 hover:text-[var(--primary)]'
                  }`}
                >
                  Informasi Dasar
                </button>
                <button
                  onClick={() => setActiveUserTab('security')}
                  className={`px-6 py-3 font-semibold text-sm transition-colors ${
                    activeUserTab === 'security'
                      ? 'text-[var(--primary)] border-b-2 border-[var(--primary)] bg-white'
                      : 'text-gray-600 hover:text-[var(--primary)]'
                  }`}
                >
                  Keamanan
                </button>
              </div>
            </div>

            <form onSubmit={handleUpdateUser} className="flex-1 overflow-y-auto p-6">
              {/* Basic Info Tab */}
              {activeUserTab === 'basic' && (
                <div className="space-y-4">
                  {!isEditingOwnProfile && (
                    <div>
                      <label className="block text-sm font-semibold text-[var(--dark)] mb-2">
                        Username <span className="text-[var(--orange)]">*</span>
                      </label>
                      <input
                        type="text"
                        name="username"
                        defaultValue={editingUser.username}
                        className="w-full px-4 py-3 border-2 border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--primary)] transition-colors"
                        required
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-[var(--dark)] mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editingUser.email}
                      disabled
                      className="w-full px-4 py-3 border-2 border-[var(--border)] rounded-lg focus:outline-none bg-gray-100 cursor-not-allowed"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Email tidak dapat diubah
                    </p>
                  </div>

                  {isEditingOwnProfile && (
                    <div>
                      <label className="block text-sm font-semibold text-[var(--dark)] mb-2">
                        Role
                      </label>
                      <input
                        type="text"
                        value={editingUser.role}
                        disabled
                        className="w-full px-4 py-3 border-2 border-[var(--border)] rounded-lg focus:outline-none bg-gray-100 cursor-not-allowed"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Role tidak dapat diubah
                      </p>
                    </div>
                  )}

                  {!isEditingOwnProfile && (
                    <div>
                      <label className="block text-sm font-semibold text-[var(--dark)] mb-2">
                        Role <span className="text-[var(--orange)]">*</span>
                      </label>
                      <select
                        name="role"
                        defaultValue={editingUser.role}
                        className="w-full px-4 py-3 border-2 border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--primary)] transition-colors"
                        required
                      >
                        <option value="admin_umkm">Admin UMKM</option>
                        <option value="administrator">Administrator</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-[var(--dark)] mb-2">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={editingUser.name || ""}
                      className="w-full px-4 py-3 border-2 border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--primary)] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[var(--dark)] mb-2">
                      Alamat
                    </label>
                    <textarea
                      name="address"
                      rows={3}
                      defaultValue={editingUser.address || ""}
                      className="w-full px-4 py-3 border-2 border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--primary)] transition-colors resize-none"
                      placeholder="Alamat lengkap..."
                    />
                  </div>

                  {!isEditingOwnProfile && (
                    <div>
                      <label className="block text-sm font-semibold text-[var(--dark)] mb-2">
                        WhatsApp
                      </label>
                      <input
                        type="text"
                        name="whatsapp"
                        defaultValue={editingUser.whatsapp || ""}
                        placeholder="08xxxxxxxxxx"
                        className="w-full px-4 py-3 border-2 border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--primary)] transition-colors"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Security Tab */}
              {activeUserTab === 'security' && (
                <div className="space-y-4">
                  {isEditingOwnProfile && (
                    <div>
                      <label className="block text-sm font-semibold text-[var(--dark)] mb-2">
                        Password Lama
                      </label>
                      <input
                        type="password"
                        name="oldPassword"
                        placeholder="Masukkan password lama Anda"
                        className="w-full px-4 py-3 border-2 border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--primary)] transition-colors"
                        required={isEditingOwnProfile}
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Diperlukan untuk mengganti password
                      </p>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-semibold text-[var(--dark)] mb-2">
                      {isEditingOwnProfile ? 'Password Baru' : 'Password Baru'}
                    </label>
                    <input
                      type="password"
                      name="password"
                      placeholder={isEditingOwnProfile ? "Masukkan password baru" : "Kosongkan jika tidak ingin mengubah password"}
                      className="w-full px-4 py-3 border-2 border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--primary)] transition-colors"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Minimal 6 karakter. {isEditingOwnProfile ? 'Kosongkan jika tidak ingin mengubah.' : 'Kosongkan jika tidak ingin mengubah.'}
                    </p>
                  </div>
                </div>
              )}
            </form>
            {/* Footer */}
            <div className="border-t border-[var(--border)] p-6 bg-[var(--background)] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowEditUserModal(false);
                  setEditingUser(null);
                }}
                className="px-6 py-3 border-2 border-[var(--border)] text-[var(--dark)] rounded-lg hover:bg-[var(--cream)] transition-colors font-medium"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--dark)] font-bold transition-colors"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UMKM Form Modal - Using the shared component */}
      <UmkmFormModal
        isOpen={showUmkmModal}
        onClose={() => setShowUmkmModal(false)}
        onSubmit={handleSubmitUmkmForm}
        umkm={selectedUmkm}
        mode={modalMode}
        userWhatsapp={user.whatsapp}
      />

      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg text-white font-medium min-w-[300px] transform transition-transform duration-300 ${
            toast.type === 'success'
              ? 'bg-green-500'
              : 'bg-red-500'
          }`}
        >
          <div className="flex items-center gap-2">
            {toast.type === 'success' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

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
    </div>
  );
}
