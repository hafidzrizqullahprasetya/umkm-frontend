import { redirect } from 'next/navigation';
import Link from 'next/link';

export default function HomePage() {
  // This is a placeholder home page - in a real app, you might check authentication status
  // and redirect to login if the user is not authenticated
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#2E6946] to-[#222222] p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-[#222222] mb-4">Dashboard UMKM</h1>
        <p className="text-gray-600 mb-6">Selamat datang di dashboard UMKM Anda</p>
        <div className="space-y-4">
          <Link 
            href="/umkm" 
            className="block w-full bg-[#2E6946] text-white font-bold py-3 rounded-lg hover:bg-[#222222] transition-colors"
          >
            Lihat UMKM Saya
          </Link>
          <Link 
            href="/login" 
            className="block w-full bg-[#D9E55B] text-[#222222] font-bold py-3 rounded-lg hover:bg-[#FDF7E0] transition-colors"
          >
            Kembali ke Login
          </Link>
        </div>
      </div>
    </div>
  );
}