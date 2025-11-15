import { Umkm } from "@/types/umkm";

export async function getAllUmkm(): Promise<Umkm[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/umkm`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch UMKM data');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching UMKM data:', error);
    return [];
  }
}
