import type { Metadata } from "next";
import { body } from "@/utils/font";
import "./globals.css";
import { ToastContainer } from "react-toastify";

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
      <body
        className={`${body.className} antialiased`}
      >
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}