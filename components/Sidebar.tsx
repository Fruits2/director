"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ClipboardList, Package, Users, PlusCircle } from "lucide-react";

const navItems = [
  { href: "/", label: "대시보드", icon: LayoutDashboard },
  { href: "/tasks", label: "업무 목록", icon: ClipboardList },
  { href: "/tasks/new", label: "업무 등록", icon: PlusCircle },
  { href: "/products", label: "제품 목록", icon: Package },
  { href: "/team", label: "팀원 현황", icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-52 min-h-screen bg-slate-900 text-slate-100 flex flex-col shrink-0">
      <div className="px-5 py-5 border-b border-slate-700">
        <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">종근당</p>
        <h1 className="text-sm font-bold mt-0.5 leading-snug">학술MI 업무<br />대시보드</h1>
      </div>
      <nav className="flex-1 py-4">
        <ul className="space-y-0.5 px-3">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
                    active
                      ? "bg-blue-600 text-white font-medium"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Icon size={15} />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="px-5 py-4 border-t border-slate-700 text-xs text-slate-500">
        학술MI파트 · 내부용
      </div>
    </aside>
  );
}
