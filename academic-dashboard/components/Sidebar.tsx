"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ClipboardList, Package, Users, PlusCircle, Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/", label: "대시보드", icon: LayoutDashboard },
  { href: "/tasks", label: "업무 목록", icon: ClipboardList },
  { href: "/tasks/new", label: "업무 등록", icon: PlusCircle },
  { href: "/products", label: "제품 목록", icon: Package },
  { href: "/team", label: "팀원 현황", icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* 모바일 상단 헤더 */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-slate-900 text-white fixed top-0 left-0 right-0 z-50">
        <div>
          <p className="text-xs text-slate-400">종근당</p>
          <p className="text-sm font-bold">학술MI 업무 대시보드</p>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* 모바일 드로어 메뉴 */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileOpen(false)}>
          <div className="w-64 h-full bg-slate-900 p-6" onClick={e => e.stopPropagation()}>
            <nav className="mt-8 space-y-1">
              {navItems.map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    pathname === href
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-slate-800"
                  }`}>
                  <Icon size={18} />
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* PC 사이드바 */}
      <aside className="hidden md:flex w-56 min-h-screen bg-slate-900 text-white flex-col p-6">
        <div className="mb-8">
          <p className="text-xs text-slate-400">종근당</p>
          <p className="text-sm font-bold leading-tight">학술MI 업무<br />대시보드</p>
        </div>
        <nav className="space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === href
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800"
              }`}>
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}