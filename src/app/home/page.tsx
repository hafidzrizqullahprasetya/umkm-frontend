import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import Link from 'next/link';

export default async function HomePage() {
  const session = await getServerSession(authConfig);
  console.log(session)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2E6946] to-[#222222] p-4">
      {/* Header */}
      <header className="max-w-6xl mx-auto p-4 flex justify-between items-center">
        <div className="text-white text-xl font-bold">UMKM Platform</div>
        <div>
          {session?.user ? (
            <Link
              href="/home"
              className="bg-white text-[#2E6946] px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/"
              className="bg-white text-[#2E6946] px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Kembali ke Beranda
            </Link>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-[#222222] mb-4">Dashboard UMKM</h1>
          <p className="text-gray-600 mb-8">
            {session?.user
              ? `Selamat datang, ${session.user.name || session.user.email}!`
              : 'Silakan login untuk mengakses dashboard UMKM Anda'}
          </p>

          <div className="space-y-6">
            <Link
              href="/umkm"
              className="block w-full bg-[#2E6946] text-white font-bold py-3 rounded-lg hover:bg-[#222222] transition-colors"
            >
              Lihat UMKM Saya
            </Link>

            <div className="pt-4">
              <p className="text-gray-500 mb-4">Atau jelajahi UMKM lainnya</p>
              <Link
                href="/"
                className="block w-full bg-[#D9E55B] text-[#222222] font-bold py-3 rounded-lg hover:bg-[#FDF7E0] transition-colors"
              >
                Jelajahi Semua UMKM
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}