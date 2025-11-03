import type { Metadata } from "next";
import { body } from "@/utils/font";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={` ${body.className} antialiased`}
      >
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}