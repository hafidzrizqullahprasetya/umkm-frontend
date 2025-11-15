import FormAuth from "../forms/form-auth";
import Image from "next/image";

export default function LoginPage({ isRegister }: {
  isRegister: boolean;
}) {
  return (
    <section className="w-full min-h-screen flex justify-center items-center bg-gradient-to-br from-[#2E6946] to-[#222222] max-md:py-4">
      <div className="bg-white rounded-2xl flex flex-row w-4xl max-w-6xl h-[620px] max-md:flex-col max-md:w-[90%] max-md:h-auto max-md:rounded-2xl shadow-xl">

        <div className="relative w-1/2 h-full rounded-l-2xl overflow-hidden max-md:w-full max-md:h-[300px] max-md:rounded-t-2xl max-md:rounded-b-none bg-gradient-to-br from-[#2E6946] to-[#D9E55B] flex items-center justify-center">
          <div className="text-center p-8 max-md:p-4">
            <h1 className="text-white text-3xl font-bold mb-4 max-md:text-xl">
              {isRegister ? 'Daftarkan UMKM Mu!' : 'Temukan UMKM Terbaik di Sekitarmu'}
            </h1>
            <p className="text-white text-base opacity-90 max-md:text-sm mb-8">
              {isRegister
                ? 'Bergabunglah bersama ribuan UMKM lainnya'
                : 'Akses berbagai produk UMKM lokal terbaik'}
            </p>
            <div className="flex justify-center">
              <div className="bg-white/30 backdrop-blur-sm rounded-xl p-4 max-w-xs">
                <div className="bg-[#FDF7E0] border-2 border-dashed border-[#2E6946] rounded-xl w-64 h-64 max-md:w-48 max-md:h-48 flex items-center justify-center">
                  <span className="text-[#2E6946] text-sm font-medium">UMKM Image</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-1/2 p-8 flex flex-col justify-center items-center max-md:w-full max-md:p-4">
          <div className="w-full text-center max-md:text-center mb-6">
            <h1 className="text-[#222222] text-3xl font-bold max-md:text-2xl">
              {isRegister ? 'Daftar Sekarang!' : 'Selamat Datang Kembali!'}
            </h1>
            <p className="text-[#718355] text-base mt-2 max-md:text-sm">
              {isRegister
                ? 'Buat akun untuk memulai perjalanan UMKM Anda'
                : 'Masuk untuk mengelola UMKM Anda'}
            </p>
          </div>
          <FormAuth isRegister={isRegister} />
        </div>
      </div>
    </section>
  );
}