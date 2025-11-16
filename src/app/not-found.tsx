"use client";

import Link from "next/link";
import { House } from "phosphor-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg_light-1 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <div className="mb-8">
          <div className="text-9xl font-black text-[var(--primary)] mb-4">404</div>
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--dark)] mb-4">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-[var(--dark)]/60 text-lg mb-8">
            Maaf, halaman yang Anda cari tidak dapat ditemukan. Mungkin halaman telah dipindahkan atau dihapus.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white px-8 py-4 rounded font-bold transition-colors"
        >
          <House size={20} weight="fill" />
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
