"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getTasks } from "@/lib/store";
import { teamMembers, products } from "@/lib/mockData";
import { Task } from "@/lib/types";
import Link from "next/link";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

const STATUS_COLOR: Record<string, string> = {
  접수: "bg-slate-100 text-slate-600",
  진행중: "bg-blue-100 text-blue-700",
  검토중: "bg-yellow-100 text-yellow-700",
  완료: "bg-green-100 text-green-700",
};

const CATEGORY_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];
const CATEGORIES = ["검토", "교육", "리뷰", "자료생성"];

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/login')
      }
    })
    setTasks(getTasks());
  }, [router]);

  const today = new Date().toISOString().slice(0, 10);
  const urgent = tasks.filter((t) => t.priority === "긴급" && t.status !== "완료");
  const todayDue = tasks.filter((t) => t.dueDate === today && t.status !== "완료");
  const inProgress = tasks.filter((t) => t.status === "진행중" || t.status === "검토중");
  const completed = tasks.filter((t) => t.status === "완료");

  const categoryData = CATEGORIES.map((c, i) => ({
    name: c,
    건수: tasks.filter((t) => t.category === c).length,
    color: CATEGORY_COLORS[i],
  }));

  const memberData = teamMembers.map((m) => ({
    name: m.name,
    진행: tasks.filter((t) => t.assigneeId === m.id && t.status !== "완료").length,
    완료: tasks.filter((t) => t.assigneeId === m.id && t.status === "완료").length,
  })).filter((m) => m.진행 + m.완료 > 0);

  const getMemberName = (id: string) => teamMembers.find((m) => m.id === id)?.name ?? "-";
  const getProductName = (id: string) => products.find((p) => p.id === id)?.name ?? "-";

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">대시보드</h2>
          <p className="text-slate-500 text-sm mt-0.5">{today} 기준 업무 현황</p>
        </div>
        <Link
          href="/tasks/new"
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          + 새 업무 등록
        </Link>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "긴급 업무", value: urgent.length, sub: "즉시 처리 필요", color: "border-red-200 bg-red-50 text-red-700" },
          { label: "오늘 마감", value: todayDue.length, sub: "오늘까지 완료", color: "border-orange-200 bg-orange-50 text-orange-700" },
          { label: "진행중", value: inProgress.length, sub: "진행중 + 검토중", color: "border-blue-200 bg-blue-50 text-blue-700" },
          { label: "완료", value: completed.length, sub: `전체 ${tasks.length}건`, color: "border-green-200 bg-green-50 text-green-700" },
        ].map(({ label, value, sub, color }) => (
          <div key={label} className={`rounded-xl border p-5 ${color}`}>
            <p className="text-sm font-medium opacity-80">{label}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
            <p className="text-xs mt-1 opacity-70">{sub}</p>
          </div>
        ))}
      </div>

      {/* 차트 */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">업무 유형별 현황</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={categoryData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="건수" radius={[4, 4, 0, 0]}>
                {categoryData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">담당자별 업무 현황</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={memberData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="진행" stackId="a" fill="#3b82f6" />
              <Bar dataKey="완료" stackId="a" fill="#d1fae5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 긴급 업무 */}
      {urgent.length > 0 && (
        <div className="bg-white rounded-xl border border-red-200 p-6">
          <h3 className="text-sm font-semibold text-red-700 mb-4">🔴 긴급 업무</h3>
          <div className="space-y-2">
            {urgent.map((t) => (
              <Link key={t.id} href={`/tasks/${t.id}`}
                className="flex items-center justify-between p-3 rounded-lg bg-red-50 hover:bg-red-100 transition-colors">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLOR[t.status]}`}>{t.status}</span>
                  <span className="text-sm text-slate-800">{t.title}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span>{getMemberName(t.assigneeId)}</span>
                  <span className="text-red-600 font-medium">마감 {t.dueDate}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 최근 업무 */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-700">최근 업무</h3>
          <Link href="/tasks" className="text-xs text-blue-600 hover:underline">전체 보기</Link>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr className="text-slate-500 text-left text-xs">
              <th className="px-4 py-3 font-medium">업무명</th>
              <th className="px-4 py-3 font-medium">유형</th>
              <th className="px-4 py-3 font-medium">제품</th>
              <th className="px-4 py-3 font-medium">담당자</th>
              <th className="px-4 py-3 font-medium">마감일</th>
              <th className="px-4 py-3 font-medium">상태</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {tasks.slice(0, 6).map((t) => (
              <tr key={t.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <Link href={`/tasks/${t.id}`} className="text-slate-800 hover:text-blue-600 font-medium">
                    {t.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate-500">{t.category}</td>
                <td className="px-4 py-3 text-slate-500">{getProductName(t.productId)}</td>
                <td className="px-4 py-3 text-slate-500">{getMemberName(t.assigneeId)}</td>
                <td className="px-4 py-3 text-slate-500">{t.dueDate}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLOR[t.status]}`}>
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
