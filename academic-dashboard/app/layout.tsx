import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  title: "학술MI 업무 대시보드",
  description: "종근당 학술MI파트 업무 관리 시스템",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${geist.variable} h-full`}>
      <body className="flex h-full min-h-screen bg-slate-50 antialiased">
        <Sidebar />
        <main className="flex-1 overflow-auto pt-14 md:pt-0">{children}</main>
      </body>
    </html>
  );
}
