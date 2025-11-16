import FormAuth from "../forms/form-auth";
import { X, Storefront, TrendUp, Users, ChartLineUp } from "phosphor-react";

interface LoginPageProps {
  isRegister: boolean;
  onClose: () => void;
  onModeChange?: (mode: "login" | "register") => void;
}

export default function LoginPage({
  isRegister,
  onClose,
  onModeChange,
}: LoginPageProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Side - Illustration & Copywriting */}
          <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-primary via-primary to-dark p-12 text-white relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-10 right-10 w-32 h-32 bg-secondary/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 left-10 w-40 h-40 bg-orange/20 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              {/* Icon */}
              <div className="mb-6 inline-flex items-center justify-center w-16 h-16 bg-secondary rounded-2xl shadow-lg">
                <Storefront size={32} weight="bold" className="text-dark" />
              </div>

              {/* Main Copywriting */}
              <h2 className="text-4xl font-bold mb-4 leading-tight">
                {isRegister
                  ? "Wujudkan Impian Bisnis Anda!"
                  : "Kelola UMKM Lebih Mudah!"}
              </h2>

              <p className="text-lg text-white/90 mb-8 leading-relaxed">
                {isRegister
                  ? "Bergabunglah dengan ribuan UMKM yang telah berkembang bersama platform kami. Saatnya bisnis Anda dikenal lebih luas!"
                  : "Akses dashboard lengkap untuk mengelola profil UMKM, produk, dan jangkauan pelanggan Anda."}
              </p>

              {/* Benefits */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-secondary rounded-lg flex items-center justify-center shadow-lg">
                    <TrendUp size={20} weight="bold" className="text-dark" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Tingkatkan Visibilitas</h4>
                    <p className="text-sm text-white/80">
                      Tampilkan produk UMKM Anda kepada ribuan calon pembeli
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-secondary rounded-lg flex items-center justify-center shadow-lg">
                    <Users size={20} weight="bold" className="text-dark" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">
                      Jangkau Lebih Banyak Pelanggan
                    </h4>
                    <p className="text-sm text-white/80">
                      Terhubung dengan konsumen yang mencari produk lokal
                      berkualitas
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-secondary rounded-lg flex items-center justify-center shadow-lg">
                    <ChartLineUp
                      size={20}
                      weight="bold"
                      className="text-dark"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Kembangkan Usaha</h4>
                    <p className="text-sm text-white/80">
                      Dapatkan insight dan tools untuk mengembangkan bisnis Anda
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="p-8 lg:p-12">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-dark">
                  {isRegister ? "Daftar UMKM Anda" : "Masuk ke Dashboard"}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {isRegister
                    ? "Mulai perjalanan digital UMKM Anda"
                    : "Kelola bisnis Anda dengan mudah"}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-dark transition-colors p-1 rounded-full hover:bg-secondary"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>

            {/* Mobile Benefits Badge */}
            <div className="lg:hidden mb-6 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl border border-primary/20">
              <div className="flex items-center gap-3 mb-2">
                <Storefront size={24} weight="bold" className="text-primary" />
                <h3 className="font-bold text-dark">
                  Bergabung dengan Komunitas UMKM
                </h3>
              </div>
              <p className="text-sm text-gray-600">
                {isRegister
                  ? "Tampilkan produk Anda dan jangkau lebih banyak pelanggan!"
                  : "Kelola profil UMKM Anda dengan dashboard lengkap"}
              </p>
            </div>

            {/* Form */}
            <FormAuth isRegister={isRegister} onModeChange={onModeChange} />
          </div>
        </div>
      </div>
    </div>
  );
}
