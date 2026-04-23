"use client";

import { useEffect, useState } from "react";
import { getTasks, deleteTask } from "@/lib/store";
import { teamMembers, products } from "@/lib/mockData";
import { Task, TaskCategory, TaskStatus, TaskPriority } from "@/lib/types";
import Link from "next/link";

const STATUS_COLOR: Record<string, string> = {
  접수: "bg-slate-100 text-slate-600",
  진행중: "bg-blue-100 text-blue-700",
  검토중: "bg-yellow-100 text-yellow-700",
  완료: "bg-green-100 text-green-700",
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [category, setCategory] = useState<TaskCategory | "전체">("전체");
  const [status, setStatus] = useState<TaskStatus | "전체">("전체");
  const [priority, setPriority] = useState<TaskPriority | "전체">("전체");
  const [assignee, setAssignee] = useState<string>("전체");
  const [search, setSearch] = useState("");

  useEffect(() => { setTasks(getTasks()); }, []);

  const filtered = tasks.filter((t) => {
    if (category !== "전체" && t.category !== category) return false;
    if (status !== "전체" && t.status !== status) return false;
    if (priority !== "전체" && t.priority !== priority) return false;
    if (assignee !== "전체" && t.assigneeId !== assignee) return false;
    if (search && !t.title.includes(search) && !t.requesterName.includes(search)) return false;
    return true;
  });

  const getMemberName = (id: string) => teamMembers.find((m) => m.id === id)?.name ?? "-";
  const getProductName = (id: string) => products.find((p) => p.id === id)?.name ?? "-";

  const handleDelete = (id: string) => {
    if (!confirm("업무를 삭제하시겠습니까?")) return;
    deleteTask(id);
    setTasks(getTasks());
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">업무 목록</h2>
          <p className="text-slate-500 text-sm mt-0.5">총 {filtered.length}건</p>
        </div>
        <Link href="/tasks/new"
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
          + 새 업무 등록
        </Link>
      </div>

      {/* 필터 */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="업무명 또는 요청자 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm w-56 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select value={category} onChange={(e) => setCategory(e.target.value as TaskCategory | "전체")}
            className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            {["전체", "검토", "교육", "리뷰", "자료생성"].map((v) => <option key={v}>{v}</option>)}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value as TaskStatus | "전체")}
            className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            {["전체", "접수", "진행중", "검토중", "완료"].map((v) => <option key={v}>{v}</option>)}
          </select>
          <select value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority | "전체")}
            className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            {["전체", "긴급", "일반"].map((v) => <option key={v}>{v}</option>)}
          </select>
          <select value={assignee} onChange={(e) => setAssignee(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="전체">담당자 전체</option>
            {teamMembers.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </div>
      </div>

      {/* 테이블 */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-slate-500 text-xs text-left">
              <th className="px-4 py-3 font-medium">우선순위</th>
              <th className="px-4 py-3 font-medium">업무명</th>
              <th className="px-4 py-3 font-medium">유형</th>
              <th className="px-4 py-3 font-medium">제품</th>
              <th className="px-4 py-3 font-medium">요청자</th>
              <th className="px-4 py-3 font-medium">담당자</th>
              <th className="px-4 py-3 font-medium">마감일</th>
              <th className="px-4 py-3 font-medium">상태</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 && (
              <tr><td colSpan={9} className="px-4 py-8 text-center text-slate-400">업무가 없습니다.</td></tr>
            )}
            {filtered.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  {t.priority === "긴급"
                    ? <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">긴급</span>
                    : <span className="text-xs text-slate-400">일반</span>}
                </td>
                <td className="px-4 py-3 max-w-xs">
                  <Link href={`/tasks/${t.id}`} className="text-slate-800 hover:text-blue-600 font-medium line-clamp-1">
                    {t.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate-500">{t.category}</td>
                <td className="px-4 py-3 text-slate-500">{getProductName(t.productId)}</td>
                <td className="px-4 py-3 text-slate-500 text-xs">{t.requesterName}</td>
                <td className="px-4 py-3 text-slate-500">{getMemberName(t.assigneeId)}</td>
                <td className="px-4 py-3 text-slate-500">{t.dueDate}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLOR[t.status]}`}>
                    {t.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link href={`/tasks/${t.id}`}
                      className="text-xs text-blue-600 hover:underline">수정</Link>
                    <button onClick={() => handleDelete(t.id)}
                      className="text-xs text-red-500 hover:underline">삭제</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
