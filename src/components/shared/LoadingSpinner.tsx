import { CircleNotch } from "phosphor-react";

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-[var(--background)]/80 z-[9999] flex items-center justify-center backdrop-blur-sm">
      <div className="flex flex-col items-center bg-white rounded-xl shadow-2xl p-8 border border-[var(--border)] max-w-sm w-full">
        <CircleNotch
          size={48}
          weight="bold"
          className="text-[var(--primary)] animate-spin"
        />
        <p className="mt-4 text-lg font-semibold text-[var(--dark)]">
          Memuat halaman...
        </p>
        <p className="mt-2 text-sm text-gray-500 text-center">
          Harap tunggu sebentar, halaman sedang dipersiapkan
        </p>
      </div>
    </div>
  );
}