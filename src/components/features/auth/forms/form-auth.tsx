"use client";

import { credentialRegister, credetialLogin } from "@/lib/action";
import { Lock, User, Eye, EyeSlash } from "phosphor-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function FormAuth({
  isRegister,
  onModeChange,
}: {
  isRegister: boolean;
  onModeChange?: (mode: "login" | "register") => void;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


  async function handleSubmitRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const formData = new FormData(event.currentTarget);

      // Client-side validation
      const username = formData.get("username")?.toString()?.trim();
      const email = formData.get("email")?.toString()?.trim();
      const password = formData.get("password")?.toString();

      if (!username || username.length === 0) {
        throw new Error("Username tidak boleh kosong");
      }

      if (username.length < 3) {
        throw new Error("Username minimal terdiri dari 3 karakter");
      }

      if (!email || email.length === 0) {
        throw new Error("Email tidak boleh kosong");
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Format email tidak valid");
      }

      if (!password || password.length === 0) {
        throw new Error("Password tidak boleh kosong");
      }

      if (password.length < 6) {
        throw new Error("Password minimal terdiri dari 6 karakter");
      }

      const response = await credentialRegister(formData);
      console.log(response);

      if (response?.error) {
        setError(response.error);
        throw new Error(response.error);
      }

      // If no error and we got a successful response, proceed to home
      toast.success("UMKM Anda berhasil terdaftar! Selamat bergabung.", {
        position: "top-center",
        autoClose: 3000,
      });
      router.push("/home");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan tak terduga";
      setError(errorMessage);
      console.log(error);
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      const email = formData.get("email")?.toString()?.trim();
      const password = formData.get("password")?.toString();

      // Client-side validation
      if (!email || email.length === 0) {
        throw new Error("Email tidak boleh kosong");
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Format email tidak valid");
      }

      if (!password || password.length === 0) {
        throw new Error("Password tidak boleh kosong");
      }

      if (password.length < 6) {
        throw new Error("Password minimal terdiri dari 6 karakter");
      }

      const result = await credetialLogin(formData);
      console.log(result);

      if (result?.error) {
        throw new Error(result.error);
      }

      // Redirect based on user role
      const redirectPath = result?.role === "administrator" ? "/admin" : "/home";

      toast.success(
        result?.role === "administrator"
          ? "Selamat datang, Administrator!"
          : "Selamat datang kembali! Kelola UMKM Anda sekarang.",
        {
          position: "top-center",
          autoClose: 3000,
        }
      );
      router.push(redirectPath);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan tak terduga";
      setError(errorMessage);
      console.log(error);
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={isRegister ? handleSubmitRegister : handleSubmitLogin}
      className="w-full space-y-5"
    >
      {/* Username Field - Register Only */}
      {isRegister && (
        <div className="space-y-2">
          <label
            htmlFor="username"
            className="text-dark font-semibold text-sm block"
          >
            Username
          </label>
          <div className="relative">
            <input
              type="text"
              name="username"
              placeholder="Masukkan username Anda"
              className="w-full rounded-lg border-2 border-primary text-dark py-3 pl-12 pr-4 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
            />
            <div className="absolute pointer-events-none top-1/2 -translate-y-1/2 left-4">
              <User className="text-primary" size={20} weight="bold" />
            </div>
          </div>
        </div>
      )}

      {/* Email Field */}
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="text-dark font-semibold text-sm block"
        >
          {isRegister ? "Email" : "Email atau Username"}
        </label>
        <div className="relative">
          <input
            type="email"
            name="email"
            placeholder={
              isRegister
                ? "Masukkan email Anda"
                : "Masukkan email atau username Anda"
            }
            className="w-full rounded-lg border-2 border-primary text-dark py-3 pl-12 pr-4 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
          />
          <div className="absolute pointer-events-none top-1/2 -translate-y-1/2 left-4">
            <User className="text-primary" size={20} weight="bold" />
          </div>
        </div>
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <label
          htmlFor="password"
          className="text-dark font-semibold text-sm block"
        >
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Masukkan password Anda"
            className="w-full rounded-lg border-2 border-primary text-dark py-3 pl-12 pr-12 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
          />
          <div className="absolute pointer-events-none top-1/2 -translate-y-1/2 left-4">
            <Lock className="text-primary" size={20} weight="bold" />
          </div>
          <div
            className="absolute pointer-events-auto top-1/2 -translate-y-1/2 right-4 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeSlash className="text-primary" size={20} weight="bold" />
            ) : (
              <Eye className="text-primary" size={20} weight="bold" />
            )}
          </div>
        </div>
      </div>

      {/* Remember Me & Forgot Password - Login Only */}
      {!isRegister && (
        <div className="flex items-center justify-between pt-1">
          <label
            htmlFor="remember"
            className="inline-flex items-center text-sm text-primary font-medium cursor-pointer"
          >
            <input
              id="remember"
              name="remember"
              type="checkbox"
              className="mr-2 h-4 w-4 rounded border-2 border-primary text-primary focus:ring-2 focus:ring-primary focus:ring-offset-0 cursor-pointer"
            />
            Ingat saya
          </label>
          <Link
            href="/forgot-password"
            className="text-sm text-primary font-medium hover:text-secondary transition-colors"
          >
            Lupa password?
          </Link>
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className={`w-full rounded-lg py-3.5 font-bold text-base text-white transition-all ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-primary hover:opacity-80 active:scale-[0.98] shadow-md hover:shadow-lg"
          }`}
        >
          {loading
            ? "Memproses..."
            : isRegister
            ? "Daftar UMKM"
            : "Masuk ke Dashboard UMKM"}
        </button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 py-2">
        <div className="flex-grow border-t-2 border-secondary"></div>
        <span className="text-gray-500 text-xs font-medium">
          atau masuk dengan
        </span>
        <div className="flex-grow border-t-2 border-secondary"></div>
      </div>

      {/* Google Sign In */}
      <button
        type="button"
        onClick={() => signIn("google", { callbackUrl: "/home" })}
        className="w-full bg-secondary text-dark font-semibold py-3 flex items-center justify-center rounded-lg border-2 border-secondary hover:opacity-80"
      >
        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Google
      </button>

      {/* Toggle Login/Register */}
      <p className="text-center text-gray-600 text-sm pt-4">
        {isRegister ? (
          <>
            UMKM Anda sudah terdaftar?{" "}
            {onModeChange ? (
              <button
                type="button"
                onClick={() => onModeChange("login")}
                className="text-primary font-bold hover:text-secondary transition-colors bg-transparent border-none cursor-pointer"
              >
                Masuk di sini
              </button>
            ) : (
              <Link
                href="/login"
                className="text-primary font-bold hover:text-secondary transition-colors"
              >
                Masuk di sini
              </Link>
            )}
          </>
        ) : (
          <>
            Belum mendaftarkan UMKM Anda?{" "}
            {onModeChange ? (
              <button
                type="button"
                onClick={() => onModeChange("register")}
                className="text-primary font-bold hover:text-secondary transition-colors bg-transparent border-none cursor-pointer"
              >
                Daftar sekarang
              </button>
            ) : (
              <Link
                href="/register"
                className="text-primary font-bold hover:text-secondary transition-colors"
              >
                Daftar sekarang
              </Link>
            )}
          </>
        )}
      </p>
    </form>
  );
}
