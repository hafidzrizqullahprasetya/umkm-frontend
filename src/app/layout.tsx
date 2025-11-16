import type { Metadata } from "next";
import { body } from "@/utils/font";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import LoadingProvider from "@/components/shared/LoadingProvider";
import Providers from "@/lib/context/providers";

export const metadata: Metadata = {
  title: "UMKM Platform",
  description: "Platform untuk menampilkan UMKM di Indonesia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${body.className} antialiased`}>
        <Providers>
          <LoadingProvider>
            {children}
            <ToastContainer
              position="top-center"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={true}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
              style={{
                top: "20px",
              }}
              toastStyle={{
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                fontFamily: "inherit",
                fontSize: "14px",
              }}
            />
          </LoadingProvider>
        </Providers>
      </body>
    </html>
  );
}
