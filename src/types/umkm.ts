// Disesuaikan dengan skema Prisma

export interface MediaSosial {
  id: number;
  umkm_id: number;
  type: 'X' | 'Instagram' | 'Facebook' | 'TikTok';
  url: string;
  created_at: Date;
  updated_at: Date;
}

export interface UmkmGaleri {
  id: number;
  umkm_id: number;
  section: string;
  img_url: string;
  created_at: Date;
  updated_at: Date;
}

export interface OnlineShop {
  id: number;
  umkm_id: number;
  type: 'Blibli' | 'Tokopedia' | 'Shopee' | 'Lazada' | 'Go-Jek';
  url: string;
  created_at: Date;
  updated_at: Date;
}

export interface Umkm {
  id: number;
  user_id: number;
  type: string; // Seharusnya cocok dengan enum UmkmType
  name: string;
  description: string | null;
  contact: string | null;
  location: string | null;
  logo: string | null;
  created_at: Date;
  updated_at: Date;
  online_shop: OnlineShop[];
  umkm_galeri: UmkmGaleri[];
  media_sosial: MediaSosial[];
}