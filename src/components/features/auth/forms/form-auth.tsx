"use client"

import { credentialRegister, credetialLogin } from "@/lib/action";
import { Lock, User } from "phosphor-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function FormAuth({isRegister}: {
    isRegister: boolean
} ){
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (error) {
            toast.error(error, {
                position: 'bottom-right',
                autoClose: 5000,
            });
        }
    }, [error]);

    async function handleSubmitRegister(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const formData = new FormData(event.currentTarget);

            // Client-side validation
            const username = formData.get('username')?.toString()?.trim();
            const email = formData.get('email')?.toString()?.trim();
            const password = formData.get('password')?.toString();

            if (!username || username.length === 0) {
                throw new Error('Username tidak boleh kosong');
            }

            if (username.length < 3) {
                throw new Error('Username minimal terdiri dari 3 karakter');
            }

            if (!email || email.length === 0) {
                throw new Error('Email tidak boleh kosong');
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                throw new Error('Format email tidak valid');
            }

            if (!password || password.length === 0) {
                throw new Error('Password tidak boleh kosong');
            }

            if (password.length < 8) {
                throw new Error('Password minimal terdiri dari 8 karakter');
            }

            const hasUpperCase = /[A-Z]/.test(password);
            const hasLowerCase = /[a-z]/.test(password);
            const hasNumbers = /\d/.test(password);
            const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

            if (!(hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar)) {
                throw new Error('Password harus mengandung huruf besar, huruf kecil, angka, dan karakter spesial');
            }

            const response = await credentialRegister(formData);
            console.log(response);

            if (response?.error) {
                setError(response.error);
                throw new Error(response.error);
            }

            // If no error and we got a successful response, proceed to home
            toast.success(isRegister ? 'Pendaftaran berhasil! Selamat datang.' : 'Login berhasil! Selamat datang kembali.');
            router.push('/home');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan tak terduga';
            setError(errorMessage);
            console.log(error);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmitLogin(event:FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const formData = new FormData(event.currentTarget);
            const email = formData.get('email')?.toString()?.trim();
            const password = formData.get('password')?.toString();

            // Client-side validation
            if (!email || email.length === 0) {
                throw new Error('Email tidak boleh kosong');
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                throw new Error('Format email tidak valid');
            }

            if (!password || password.length === 0) {
                throw new Error('Password tidak boleh kosong');
            }

            if (password.length < 8) {
                throw new Error('Password minimal terdiri dari 8 karakter');
            }

            const result = await credetialLogin(formData);
            console.log(result);

            if (result?.error) {
                throw new Error(result.error);
            }

            // If no error, proceed to home
            toast.success('Login berhasil! Selamat datang kembali.');
            router.push('/home');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan tak terduga';
            setError(errorMessage);
            console.log(error);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={isRegister? handleSubmitRegister : handleSubmitLogin} className="w-full max-w-md mx-auto px-2 max-md:max-w-sm">
            { isRegister && (
                <>
                    <label htmlFor="username" className="text-[#222222] font-semibold text-base max-sm:text-sm block mb-2">
                        Username
                    </label>
                    <div className="relative flex w-full mb-5 mt-1">
                        <input
                            type="text"
                            name="username"
                            placeholder="Masukkan username Anda"
                            className="w-full rounded-lg border border-[#D9E55B] bg-[#FDF7E0] flex-1 text-[#222222] py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E6946] focus:border-transparent transition-all"
                        />
                        <div className="absolute pointer-events-none top-3.5 left-3.5 flex items-center">
                            <User className="text-[#2E6946]" size={20} weight="bold" />
                        </div>
                    </div>
                </>
            )}

            <label htmlFor="email" className="text-[#222222] font-semibold text-base max-sm:text-sm block mb-2">
                {isRegister ? 'Email' : 'Email atau Username'}
            </label>
            <div className={`relative flex w-full ${isRegister ? 'mb-5 mt-1' : 'mb-5 mt-1'}`}>
                <input
                    type="email"
                    name="email"
                    placeholder={isRegister ? "Masukkan email Anda" : "Masukkan email atau username Anda"}
                    className="w-full rounded-lg border border-[#D9E55B] bg-[#FDF7E0] flex-1 text-[#222222] py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E6946] focus:border-transparent transition-all"
                />
                <div className="absolute pointer-events-none top-3.5 left-3.5 flex items-center">
                    <User className="text-[#2E6946]" size={20} weight="bold" />
                </div>
            </div>

            <label htmlFor="password" className="text-[#222222] font-semibold text-base max-sm:text-sm block mb-2">
                Password
            </label>
            <div className="relative flex w-full mt-1">
                <input
                    type="password"
                    name="password"
                    placeholder="Masukkan password Anda"
                    className="w-full rounded-lg border border-[#D9E55B] bg-[#FDF7E0] flex-1 text-[#222222] py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E6946] focus:border-transparent transition-all"
                />
                <div className="absolute pointer-events-none top-3.5 left-3.5 flex items-center">
                    <Lock className="text-[#2E6946]" size={20} weight="bold" />
                </div>
            </div>

            <div className="flex items-center justify-between mt-4 mb-6 max-sm:flex-col max-sm:items-start max-sm:gap-2">
                <label htmlFor="remember" className="inline-flex items-center text-sm text-[#2E6946] font-medium">
                    <input
                        id="remember"
                        name="remember"
                        type="checkbox"
                        className="mr-2 h-4 w-4 rounded border-[#2E6946] text-[#2E6946] focus:ring-[#2E6946] focus:ring-offset-0"
                    />
                    Ingat saya
                </label>
                { !isRegister && (
                    <Link
                        href="/forgot-password"
                        className="text-sm text-[#2E6946] font-medium hover:underline hover:text-[#F68B40]"
                    >
                        Lupa password?
                    </Link>
                )}
            </div>

            <div className="flex flex-col gap-4">
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full rounded-lg p-3 font-bold text-lg text-white transition-colors ${
                        loading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-[#2E6946] hover:bg-[#222222] active:scale-95'
                    }`}
                >
                    {loading ? 'Memproses...' : isRegister ? 'Daftar Sekarang' : 'Masuk ke Dashboard'}
                </button>

                <div className="flex items-center gap-3 text-sm my-4">
                    <div className="flex-grow border-t border-[#D9E55B]"></div>
                    <span className="text-gray-500 text-xs">atau masuk dengan</span>
                    <div className="flex-grow border-t border-[#D9E55B]"></div>
                </div>

                <button
                    type="button"
                    onClick={() => signIn("google", { callbackUrl: "/home" })}
                    className="w-full bg-white text-[#222222] font-medium py-3 flex items-center justify-center rounded-lg border-2 border-[#D9E55B] text-base cursor-pointer hover:bg-[#FDF7E0] transition-colors active:scale-95"
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

                <p className="text-center w-full text-gray-600 text-sm mt-6">
                    {isRegister ? (
                        <>
                            Sudah punya akun?{" "}
                            <Link href="/login" className="text-[#2E6946] font-bold hover:underline hover:text-[#F68B40]">
                                Login sekarang
                            </Link>
                        </>
                    ) : (
                        <>
                            Belum punya akun?{" "}
                            <Link href="/register" className="text-[#2E6946] font-bold hover:underline hover:text-[#F68B40]">
                                Daftar sekarang
                            </Link>
                        </>
                    )}
                </p>
            </div>
        </form>
    );
}
