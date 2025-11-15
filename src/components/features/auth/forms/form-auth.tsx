"use client"

import { credentialRegister, credetialLogin } from "@/lib/action"
import { Lock, User } from "phosphor-react"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FormEvent, useEffect, useState } from "react"
import { toast } from "react-toastify"

export default function FormAuth({isRegister}: {
    isRegister: boolean
} ){
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    useEffect( ()=>{
        toast(error,{
            position:'bottom-right',
            autoClose: false,

        })
    },[error])
    async function handleSubmitRegister(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setError(null)
        setLoading(true)
        try {
            const formData = new FormData(event.currentTarget)
            const password = formData.get('password')?.toString()
            if (!formData.get('username')) { throw new Error('Username Cannot be Empty!')}
            if (!formData.get('email')) { throw new Error('Email Cannot be Empty!')}
            if (!password) { throw new Error('Password Cannot be Empty!')}
            if (password.length < 8) {
                throw new Error('Password at least have 8 characters')
            }
            const response = await credentialRegister(formData)
            console.log(response)
            if (!!response?.error) {
                setError(response.error)
            } 
            if(response?.ok){
                router.push('/home')
            }
        } catch (error){
            setError(error instanceof Error ? error.message : 'Error unknown')
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    async function handleSubmitLogin(event:FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setError(null)
        setLoading(true)
        try {
            const formData = new FormData(event.currentTarget)
            const email = formData.get('email') as string
            const password = formData.get('password')?.toString()
            if (!email ||!password) {
                throw new Error('Email and Password cannot be empty')
            }
            if (password.length <8) {
                throw new Error('Password at least have 8 characters')
            }
            const result = await credetialLogin(formData)
            console.log(result)
            if (result?.error) {
                throw new Error (result.error)
            } else {
                router.push('/home')
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Error unknown')
            console.log(error)
        }finally{
            setLoading(false)
        }
    }
    return (
        <form onSubmit={isRegister? handleSubmitRegister : handleSubmitLogin} className="w-full max-w-md mx-auto px-2 max-md:max-w-sm">
            { isRegister? (<>
            <label htmlFor="username" className="text-black font-bold text-base max-sm:text-sm">
                Username
            </label>
            <div className={`relative flex w-full ${isRegister? 'mb-5 mt-1' : 'mb-7 mt-2'} `}>
                <input
                    type="username"
                    name="username"
                    placeholder="Jhon doe"
                    className="rounded border border-[#718355] flex-1 text-black py-3 pl-8 pr-3 text-sm max-sm:py-2"
                />
                <div className="absolute pointer-events-none top-2.5 left-1.5">
                    <User className="text-[#A1A8B5]" fontWeight={700} />
                </div>
            </div></>) : ''}
            <label htmlFor="email" className="text-black font-bold text-base max-sm:text-sm">
                Email atau Username
            </label>
            <div className={`relative flex w-full ${isRegister?'mb-5 mt-1' : 'mb-7 mt-2'} `}>
                <input
                    type="email"
                    name="email"
                    placeholder="nama@gmail.com atau username"
                    className="rounded border border-[#718355] flex-1 text-black py-3 pl-8 pr-3 text-sm max-sm:py-2"
                />
                <div className="absolute pointer-events-none top-2.5 left-1.5">
                    <User className="text-[#A1A8B5]" fontWeight={700} />
                </div>
            </div>

            <label htmlFor="password" className="text-black font-bold text-base max-sm:text-sm">
                Password
            </label>
            <div className={`relative flex w-full ${isRegister? 'mt-1' : 'mt-2'}`}>
                <input
                    type="password"
                    name="password"
                    placeholder="masukkan password anda"
                    className="rounded border border-[#718355] flex-1 text-black py-3 pl-8 pr-3 text-sm max-sm:py-2"
                />
                <div className="absolute pointer-events-none top-2.5 left-1.5">
                    <LockKeyhole className="text-[#A1A8B5]" fontWeight={700} />
                </div>
            </div>
             {/* {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 text-sm p-3 rounded-md mt-4">
                {error}
                </div>
            )} */}
            <div className="flex items-center justify-between mt-4 mb-6 max-sm:flex-col max-sm:items-start max-sm:gap-2">
                <label htmlFor="remember" className="inline-flex items-center text-sm text-[#718355] font-semibold">
                    <input
                        id="remember"
                        name="remember"
                        type="checkbox"
                        className="mr-2 h-4 w-4 rounded-md border-[#718355] text-[#718355] focus:ring-[#718355]"
                    />
                    Ingat saya
                </label>
                <Link
                    href="/forgot-password"
                    className="text-sm text-[#718355] font-semibold hover:underline"
                >
                    Lupa password?
                </Link>
            </div>

            <div className="flex flex-col gap-4">
                <button
                    type="submit"
                    className="bg-[#718355] text-white font-bold text-lg w-full rounded-md p-3 cursor-pointer hover:bg-[#5e6e48] transition-colors max-sm:text-base"
                >
                    Masuk ke Dashboard
                </button>

                <div className="flex items-center gap-2 text-sm max-sm:text-xs">
                    <hr className="flex-grow border-t border-gray-300" />
                    <span className="text-gray-500">atau masuk dengan</span>
                    <hr className="flex-grow border-t border-gray-300" />
                </div>

                <button
                    type="button"
                    onClick={() => signIn("google", { callbackUrl: "/home" })}
                    className="w-full bg-white text-[#495564] p-3 font-semibold flex items-center justify-center rounded-md border-2 border-[#718355] text-lg cursor-pointer hover:bg-gray-50 transition-colors max-sm:text-base"
                >
                    <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
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

                <p className="text-center w-full text-gray-500 text-sm max-sm:text-xs">
                    {isRegister? 
                    <>
                        Sudah punya akun?{" "}
                        <Link href={isRegister? '/login':'/register'} className="text-[#718355] font-bold hover:underline">
                            Login sekarang
                        </Link>
                    </>: 
                    <>
                        Belum punya akun?{" "}
                        <Link href={isRegister? '/login':'/register'} className="text-[#718355] font-bold hover:underline">
                            Daftar sekarang
                        </Link>
                    </>
                    }
                </p>
            </div>
        </form>
    )
}
