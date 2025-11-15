import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';
import { Umkm } from '@/types/umkm';

export async function GET() {
  try {
    // Tentukan path ke file JSON
    const jsonDirectory = path.join(process.cwd(), 'src', 'public', 'data');
    // Baca file
    const fileContents = await fs.readFile(path.join(jsonDirectory, 'data-umkm.json'), 'utf8');
    // Parse konten JSON
    const data: Umkm[] = JSON.parse(fileContents);

    // Sesuaikan data agar cocok dengan skema Prisma (untuk masa depan)
    const formattedData = data.map(item => ({
      id: item.id,
      user_id: 1, // Placeholder, ganti dengan user_id yang sebenarnya nanti
      type: item.category, // Di Prisma ini adalah enum, pastikan nilainya cocok
      name: item.name,
      description: item.description,
      contact: 'N/A', // Placeholder
      location: item.address,
      logo: item.images[0] || null, // Ambil gambar pertama sebagai logo
      created_at: new Date(),
      updated_at: new Date(),
      online_shop: [], // Placeholder
      umkm_galeri: item.images.map((img, index) => ({
        id: index + 1,
        umkm_id: item.id,
        section: 'Galeri',
        img_url: img,
        created_at: new Date(),
        updated_at: new Date(),
      })),
      media_sosial: [], // Placeholder
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Error reading or parsing data-umkm.json:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
