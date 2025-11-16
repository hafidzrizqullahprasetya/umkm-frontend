"use client";

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Umkm } from '@/types/umkm';
import { X, Plus, Trash, Upload, ShoppingBag, ShareNetwork, ImageSquare, Pencil, FloppyDisk } from 'phosphor-react';
import ConfirmationModal from '@/components/shared/ConfirmationModal';
import InputModal from '@/components/shared/InputModal';

interface UmkmFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  umkm?: Umkm | null;
  mode: 'add' | 'edit';
  userWhatsapp?: string;
}

const UMKM_TYPES = ['Kuliner', 'Fashion', 'Kerajinan', 'Jasa', 'Bidang Pertanian'];
const ONLINE_SHOP_TYPES = ['Blibli', 'Tokopedia', 'Shopee', 'Lazada', 'Go-Jek'];
const MEDIA_SOSIAL_TYPES = ['X', 'Instagram', 'Facebook', 'TikTok'];

// Helper to group gallery by section
const groupGalleryBySection = (gallery: Array<{ section: string; img_url: string }>) => {
  return gallery.reduce((acc, item) => {
    (acc[item.section] = acc[item.section] || []).push(item);
    return acc;
  }, {} as Record<string, Array<{ section: string; img_url: string }>>);
};


export default function UmkmFormModal({ isOpen, onClose, onSubmit, umkm, mode, userWhatsapp }: UmkmFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'online' | 'social' | 'gallery'>('basic');

  // Basic info
  const [name, setName] = useState('');
  const [type, setType] = useState(UMKM_TYPES[0]);
  const [description, setDescription] = useState('');
  const [contact, setContact] = useState('');
  const [useUserWhatsapp, setUseUserWhatsapp] = useState(false);
  const [location, setLocation] = useState('');
  const [gmaps, setGmaps] = useState('');
  const [logo, setLogo] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  // Online shops
  const [onlineShops, setOnlineShops] = useState<Array<{ type: string; url: string }>>([]);
  const [newOnlineShop, setNewOnlineShop] = useState({ type: ONLINE_SHOP_TYPES[0], url: '' });

  // Social media
  const [socialMedia, setSocialMedia] = useState<Array<{ type: string; url: string }>>([]);
  const [newSocialMedia, setNewSocialMedia] = useState({ type: MEDIA_SOSIAL_TYPES[0], url: '' });

  // Gallery
  const [gallery, setGallery] = useState<Array<{ section: string; img_url: string }>>([]);
  const [editingSection, setEditingSection] = useState<{ old: string; new: string } | null>(null);
  const [showDeleteSectionConfirm, setShowDeleteSectionConfirm] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState<string | null>(null);
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);

  // Load existing data when editing
  useEffect(() => {
    if (mode === 'edit' && umkm) {
      setName(umkm.name);
      setType(umkm.type);
      setDescription(umkm.description || '');
      const umkmContact = umkm.contact || '';
      setContact(umkmContact);
      // Check if contact matches user whatsapp
      setUseUserWhatsapp(userWhatsapp ? umkmContact === userWhatsapp : false);
      setLocation(umkm.location || '');
      setGmaps(umkm.gmaps || '');
      setLogo(umkm.logo || '');
      setOnlineShops(umkm.online_shop?.map(os => ({ type: os.type, url: os.url })) || []);
      setSocialMedia(umkm.media_sosial?.map(ms => ({ type: ms.type, url: ms.url })) || []);
      setGallery(umkm.umkm_galeri?.map(g => ({ section: g.section, img_url: g.img_url })) || []);
    } else {
      // Reset form for add mode
      setName('');
      setType(UMKM_TYPES[0]);
      setDescription('');
      setContact('');
      setUseUserWhatsapp(false);
      setLocation('');
      setGmaps('');
      setLogo('');
      setOnlineShops([]);
      setSocialMedia([]);
      setGallery([]);
    }
  }, [mode, umkm, isOpen, userWhatsapp]);

  // Handle checkbox change
  useEffect(() => {
    if (useUserWhatsapp && userWhatsapp) {
      setContact(userWhatsapp);
    }
  }, [useUserWhatsapp, userWhatsapp]);

  const handleAddOnlineShop = () => {
    if (newOnlineShop.url.trim()) {
      setOnlineShops([...onlineShops, { ...newOnlineShop }]);
      setNewOnlineShop({ type: ONLINE_SHOP_TYPES[0], url: '' });
    }
  };

  const handleRemoveOnlineShop = (index: number) => {
    setOnlineShops(onlineShops.filter((_, i) => i !== index));
  };

  const handleAddSocialMedia = () => {
    if (newSocialMedia.url.trim()) {
      setSocialMedia([...socialMedia, { ...newSocialMedia }]);
      setNewSocialMedia({ type: MEDIA_SOSIAL_TYPES[0], url: '' });
    }
  };

  const handleRemoveSocialMedia = (index: number) => {
    setSocialMedia(socialMedia.filter((_, i) => i !== index));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 10MB');
      e.target.value = '';
      return;
    }

    setLogoFile(file);
    setUploadingLogo(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
      console.log(formData)
      const response = await fetch(`${backendUrl}/upload/single`, {
        method: 'POST',
        headers: {
          authorization: '', 
        },
        body: formData,
      });

      const data = await response.json();
      console.log(data)

      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      if (data.data && data.data.url) {
        setLogo(data.data.url);
      }
    } catch (error: any) {
      console.error('Error uploading logo:', error);
      toast.error(error.message || 'Gagal upload logo');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleAddSection = () => {
    setShowAddSectionModal(true);
  };

  const handleConfirmAddSection = (newSectionName: string) => {
    if (newSectionName && newSectionName.trim()) {
      const trimmedName = newSectionName.trim();
      if (gallery.some(item => item.section === trimmedName)) {
        toast.error('Nama section sudah ada.');
        return;
      }
      // Add a placeholder to show the section immediately
      setGallery([...gallery, { section: trimmedName, img_url: 'placeholder' }]);
      setShowAddSectionModal(false);
    } else {
      toast.error('Nama section tidak boleh kosong.');
    }
  };

  const handleSaveSectionName = (oldSection: string) => {
    if (!editingSection || editingSection.new.trim() === '') {
      toast.error('Nama section tidak boleh kosong.');
      return;
    }
    if (gallery.some(item => item.section === editingSection.new.trim() && item.section !== oldSection)) {
      toast.error('Nama section sudah ada.');
      return;
    }
    setGallery(
      gallery.map(item =>
        item.section === oldSection ? { ...item, section: editingSection.new.trim() } : item
      )
    );
    setEditingSection(null);
  };

  const handleDeleteSection = (section: string) => {
    setSectionToDelete(section);
    setShowDeleteSectionConfirm(true);
  };

  const handleConfirmDeleteSection = () => {
    if (sectionToDelete) {
      setGallery(gallery.filter(item => item.section !== sectionToDelete));
      setSectionToDelete(null);
      setShowDeleteSectionConfirm(false);
    }
  };

  const handleAddImagesToSection = async (section: string, files: FileList) => {
    if (files.length === 0) return;

    const fileList = Array.from(files);
    const oversized = fileList.filter(f => f.size > 10 * 1024 * 1024);
    if (oversized.length > 0) {
      toast.error('Beberapa file melebihi batas ukuran 10MB.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      fileList.forEach(file => formData.append('images', file));

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
      const response = await fetch(`${backendUrl}/upload/multiple`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Upload gagal');

      const newImages = result.data.map((item: any) => ({
        section: section,
        img_url: item.url,
      }));

      // Remove placeholder if it exists
      const galleryWithoutPlaceholder = gallery.filter(item => item.img_url !== 'placeholder');
      setGallery([...galleryWithoutPlaceholder, ...newImages]);

    } catch (error: any) {
      toast.error(`Gagal mengupload gambar: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = (img_url: string) => {
    setGallery(gallery.filter(item => item.img_url !== img_url));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Nama UMKM harus diisi');
      return;
    }

    setLoading(true);
    try {
      // Convert "Bidang Pertanian" to "Pertanian" for database enum
      const typeValue = type === 'Bidang Pertanian' ? 'Pertanian' : type;

      const data = {
        name: name.trim(),
        type: typeValue,
        description: description.trim() || null,
        contact: contact.trim() || null,
        location: location.trim() || null,
        gmaps: gmaps.trim() || null,
        logo: logo.trim() || null,
        online_shop: onlineShops,
        media_sosial: socialMedia,
        umkm_galeri: gallery.filter(item => item.img_url !== 'placeholder' && item.img_url && item.img_url.trim() !== ''),
      };

      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Gagal menyimpan data UMKM');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const groupedGallery = groupGalleryBySection(gallery);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[var(--primary)] text-white p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {mode === 'add' ? 'Tambah UMKM Baru' : 'Edit UMKM'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X size={24} weight="bold" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-[var(--border)] bg-[var(--background)]">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('basic')}
              className={`px-6 py-3 font-semibold text-sm whitespace-nowrap transition-colors ${
                activeTab === 'basic'
                  ? 'text-[var(--primary)] border-b-2 border-[var(--primary)] bg-white'
                  : 'text-gray-600 hover:text-[var(--primary)]'
              }`}
            >
              Informasi Dasar
            </button>
            <button
              onClick={() => setActiveTab('online')}
              className={`px-6 py-3 font-semibold text-sm whitespace-nowrap transition-colors ${
                activeTab === 'online'
                  ? 'text-[var(--primary)] border-b-2 border-[var(--primary)] bg-white'
                  : 'text-gray-600 hover:text-[var(--primary)]'
              }`}
            >
              <div className="flex items-center gap-2">
                <ShoppingBag size={16} weight="bold" />
                <span>Online Shop ({onlineShops.length})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('social')}
              className={`px-6 py-3 font-semibold text-sm whitespace-nowrap transition-colors ${
                activeTab === 'social'
                  ? 'text-[var(--primary)] border-b-2 border-[var(--primary)] bg-white'
                  : 'text-gray-600 hover:text-[var(--primary)]'
              }`}
            >
              <div className="flex items-center gap-2">
                <ShareNetwork size={16} weight="bold" />
                <span>Media Sosial ({socialMedia.length})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`px-6 py-3 font-semibold text-sm whitespace-nowrap transition-colors ${
                activeTab === 'gallery'
                  ? 'text-[var(--primary)] border-b-2 border-[var(--primary)] bg-white'
                  : 'text-gray-600 hover:text-[var(--primary)]'
              }`}
            >
              <div className="flex items-center gap-2">
                <ImageSquare size={16} weight="bold" />
                <span>Galeri ({gallery.filter(g => g.img_url !== 'placeholder').length})</span>
              </div>
            </button>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[var(--dark)] mb-2">
                  Nama UMKM <span className="text-[var(--orange)]">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--primary)] transition-colors"
                  placeholder="Contoh: Warung Makan Sederhana"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--dark)] mb-2">
                  Kategori <span className="text-[var(--orange)]">*</span>
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--primary)] transition-colors"
                  required
                >
                  {UMKM_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--dark)] mb-2">
                  Deskripsi
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--primary)] transition-colors resize-none"
                  placeholder="Jelaskan tentang UMKM Anda..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--dark)] mb-2">
                  Kontak WhatsApp
                </label>
                {userWhatsapp && (
                  <label className="flex items-center gap-2 mb-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useUserWhatsapp}
                      onChange={(e) => setUseUserWhatsapp(e.target.checked)}
                      className="w-4 h-4 rounded border-2 border-[var(--primary)] text-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)] cursor-pointer"
                    />
                    <span className="text-sm text-gray-700">
                      Gunakan nomor WhatsApp saya ({userWhatsapp})
                    </span>
                  </label>
                )}
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => {
                    setContact(e.target.value);
                    if (e.target.value !== userWhatsapp) {
                      setUseUserWhatsapp(false);
                    }
                  }}
                  disabled={useUserWhatsapp}
                  className={`w-full px-4 py-3 border-2 border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--primary)] transition-colors ${
                    useUserWhatsapp ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                  placeholder="Contoh: 081234567890"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Nomor WhatsApp untuk dihubungi pelanggan
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--dark)] mb-2">
                  Lokasi
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--primary)] transition-colors"
                  placeholder="Contoh: Jakarta Selatan"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--dark)] mb-2">
                  Link Google Maps
                </label>
                <input
                  type="url"
                  value={gmaps}
                  onChange={(e) => setGmaps(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--primary)] transition-colors"
                  placeholder="https://www.google.com/maps/place/..."
                />
                <p className="mt-1 text-xs text-gray-500">
                  Gunakan URL lengkap Google Maps, bukan link pendek (goo.gl)
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--dark)] mb-2">
                  Logo UMKM
                </label>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <label
                      htmlFor="logo-upload"
                      className={`flex-1 cursor-pointer flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-lg transition-all ${
                        uploadingLogo
                          ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
                          : 'border-[var(--primary)] hover:bg-[var(--primary)]/5'
                      }`}
                    >
                      <Upload size={20} weight="bold" className="text-[var(--primary)]" />
                      <span className="text-sm font-medium text-[var(--dark)]">
                        {uploadingLogo ? 'Uploading...' : logoFile ? logoFile.name : 'Pilih File Logo'}
                      </span>
                    </label>
                    <input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      disabled={uploadingLogo}
                      className="hidden"
                    />
                  </div>
                  {logo && (
                    <div className="flex items-start gap-3 p-3 bg-[var(--background)] rounded-lg border border-[var(--border)]">
                      <div className="w-24 h-24 rounded-lg border-2 border-[var(--border)] bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                        <img
                          src={logo}
                          alt="Preview logo"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--dark)] mb-1">Logo berhasil diupload</p>
                        <p className="text-xs text-gray-500 truncate">{logo}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Online Shop Tab */}
          {activeTab === 'online' && (
            <div className="space-y-4">
              <div className="bg-[var(--background)] rounded-lg p-4 border-2 border-dashed border-[var(--border)]">
                <h4 className="font-semibold text-[var(--dark)] mb-3">Tambah Online Shop</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <select
                    value={newOnlineShop.type}
                    onChange={(e) => setNewOnlineShop({ ...newOnlineShop, type: e.target.value })}
                    className="px-4 py-2 border-2 border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--primary)]"
                  >
                    {ONLINE_SHOP_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <input
                    type="url"
                    value={newOnlineShop.url}
                    onChange={(e) => setNewOnlineShop({ ...newOnlineShop, url: e.target.value })}
                    placeholder="https://tokopedia.com/..."
                    className="px-4 py-2 border-2 border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--primary)]"
                  />
                  <button
                    type="button"
                    onClick={handleAddOnlineShop}
                    className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--dark)] transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus size={18} weight="bold" />
                    <span>Tambah</span>
                  </button>
                </div>
              </div>

              {onlineShops.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-[var(--dark)]">Daftar Online Shop</h4>
                  {onlineShops.map((shop, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-white border border-[var(--border)] rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-[var(--dark)]">{shop.type}</p>
                        <p className="text-sm text-gray-500 truncate">{shop.url}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveOnlineShop(index)}
                        className="p-2 text-[var(--orange)] hover:bg-[var(--background)] rounded-lg transition-colors"
                      >
                        <Trash size={18} weight="bold" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Social Media Tab */}
          {activeTab === 'social' && (
            <div className="space-y-4">
              <div className="bg-[var(--background)] rounded-lg p-4 border-2 border-dashed border-[var(--border)]">
                <h4 className="font-semibold text-[var(--dark)] mb-3">Tambah Media Sosial</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <select
                    value={newSocialMedia.type}
                    onChange={(e) => setNewSocialMedia({ ...newSocialMedia, type: e.target.value })}
                    className="px-4 py-2 border-2 border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--primary)]"
                  >
                    {MEDIA_SOSIAL_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <input
                    type="url"
                    value={newSocialMedia.url}
                    onChange={(e) => setNewSocialMedia({ ...newSocialMedia, url: e.target.value })}
                    placeholder="https://instagram.com/..."
                    className="px-4 py-2 border-2 border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--primary)]"
                  />
                  <button
                    type="button"
                    onClick={handleAddSocialMedia}
                    className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--dark)] transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus size={18} weight="bold" />
                    <span>Tambah</span>
                  </button>
                </div>
              </div>

              {socialMedia.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-[var(--dark)]">Daftar Media Sosial</h4>
                  {socialMedia.map((social, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-white border border-[var(--border)] rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-[var(--dark)]">{social.type}</p>
                        <p className="text-sm text-gray-500 truncate">{social.url}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveSocialMedia(index)}
                        className="p-2 text-[var(--orange)] hover:bg-[var(--background)] rounded-lg transition-colors"
                      >
                        <Trash size={18} weight="bold" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Gallery Tab */}
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              {Object.entries(groupedGallery).map(([section, items]) => (
                <div key={section} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  {/* Section Header */}
                  <div className="flex items-center justify-between mb-4">
                    {editingSection?.old === section ? (
                      <div className="flex-1 flex gap-2">
                        <input
                          type="text"
                          value={editingSection.new}
                          onChange={(e) => setEditingSection({ ...editingSection, new: e.target.value })}
                          className="flex-1 px-3 py-2 border-2 border-[var(--primary)] rounded-lg focus:outline-none"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveSectionName(section)}
                          className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        >
                          <FloppyDisk size={20} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingSection(null)}
                          className="p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    ) : (
                      <h4 className="text-lg font-bold text-[var(--dark)] flex-1">{section}</h4>
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingSection({ old: section, new: section })}
                        className="p-2 text-gray-500 hover:text-[var(--primary)] hover:bg-gray-200 rounded-lg"
                        title="Edit Nama Section"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSection(section)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-lg"
                        title="Hapus Section"
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Image Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {items.filter(item => item.img_url !== 'placeholder').map((item, index) => (
                      <div key={index} className="relative group aspect-square">
                        <img
                          src={item.img_url}
                          alt={item.section}
                          className="w-full h-full object-cover rounded-md border border-gray-200"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => handleDeleteImage(item.img_url)}
                            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                          >
                            <Trash size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                    {/* Add Image Button */}
                    <label className="cursor-pointer aspect-square flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-md hover:bg-gray-100 hover:border-[var(--primary)] transition-colors">
                      <Plus size={24} className="text-gray-400" />
                      <span className="text-xs text-center text-gray-500">Tambah Gambar</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleAddImagesToSection(section, e.target.files!)}
                      />
                    </label>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddSection}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-100 hover:border-[var(--primary)] transition-colors"
              >
                <Plus size={20} weight="bold" className="text-gray-500" />
                <span className="font-semibold text-gray-600">Tambah Section Baru</span>
              </button>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="border-t border-[var(--border)] p-6 bg-[var(--background)] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 border-2 border-[var(--border)] text-[var(--dark)] rounded-lg hover:bg-[var(--cream)] transition-colors font-medium"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-6 py-3 rounded-lg font-bold transition-colors ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[var(--primary)] hover:bg-[var(--dark)] text-white'
            }`}
          >
            {loading ? 'Menyimpan...' : mode === 'add' ? 'Tambah UMKM' : 'Simpan Perubahan'}
          </button>
        </div>
      </div>

      {/* Delete Section Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteSectionConfirm}
        onClose={() => setShowDeleteSectionConfirm(false)}
        onConfirm={handleConfirmDeleteSection}
        title="Konfirmasi Hapus Section"
        message={`Apakah Anda yakin ingin menghapus section "${sectionToDelete}" dan semua fotonya?`}
        confirmText="Ya, Hapus"
        cancelText="Batal"
      />

      {/* Add Section Input Modal */}
      <InputModal
        isOpen={showAddSectionModal}
        onClose={() => setShowAddSectionModal(false)}
        onConfirm={handleConfirmAddSection}
        title="Tambah Section Baru"
        message="Masukkan nama section baru:"
        placeholder="Contoh: Produk Utama"
        confirmText="Tambah"
        cancelText="Batal"
      />
    </div>
  );
}
