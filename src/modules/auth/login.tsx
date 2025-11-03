import FormAuth from "@/components/auth/form-auth"
import Image from "next/image"

export default function LoginPage({isRegister}: {
  isRegister: boolean
}) {
  return (
    <>
      <section className="w-full h-lvh flex justify-center items-center bg-gradient-to-br from-[#87986A] to-[#2C3223] max-md:h-fit max-md:py-4">
        <div className="bg-white rounded-2xl flex flex-row w-5xl h-[620px] max-md:flex-col max-md:w-[90%] max-md:h-auto max-md:rounded-2xl">

          <div className="relative w-1/2 h-full rounded-l-2xl overflow-hidden max-md:w-full max-md:h-[300px] max-md:rounded-t-2xl max-md:rounded-b-none">
            <Image 
              src={"/images/matcha.png"} 
              alt="Login Image"  
              fill
              className="object-cover pointer-events-none"
            />
          </div>

          <div className="w-1/2 p-6 flex flex-col justify-center items-center max-md:w-full max-md:p-4">
            <div className="w-full text-center max-md:text-center">
              <h1 className="text-black text-4xl font-bold max-md:text-2xl">{isRegister? 'Daftarkan UMKM Mu!':'Selamat Datang Kembali!'}</h1>
              <p className="text-[#495564] text-base mb-3.5 max-md:text-sm">Masuk untuk melihat UMKM disekitar anda</p>
            </div>
            <FormAuth isRegister={isRegister}/>
          </div>
        </div>
      </section>
    </>
  )
}
