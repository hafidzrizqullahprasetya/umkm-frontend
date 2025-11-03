export interface Umkm {
  id: number;
  name: string;
  category: string;
  description?: string;
  address?: string;
  province?: string;
  images?: string[];
  lat?: number;
  lng?: number;
}