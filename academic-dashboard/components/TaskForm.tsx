"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Task, TaskCategory, TaskStatus, TaskPriority, RequestChannel } from "@/lib/types";
import { teamMembers, products } from "@/lib/mockData";
import { saveTask, generateId } from "@/lib/store";

type Props = { initial?: Task };

const productCategories = [...new Set(products.map((p) => p.category))];

export default function TaskForm({ initial }: Props) {
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);

  const [form, setForm] = useState<Omit<Task, "id" | "createdAt" | "completedAt">>({
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    category: initial?.category ?? "검토",
    status: initial?.status ?? "접수",
    priority: initial?.priority ?? "일반",
    assigneeId: initial?.assigneeId ?? teamMembers[0].id,
    requesterName: initial?.requesterName ?? "",
    requestChannel: initial?.requestChannel ?? "이메일",
    productId: initial?.productId ?? products[0].id,
    dueDate: initial?.dueDate ?? "",
  });

  const [productSearch, setProductSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");

  const filteredProducts = products.filter((p) => {
    const matchCategory = selectedCategory === "전체" || p.category === selectedCategory;
    const matchSearch = p.name.includes(productSearch);
    return matchCategory && matchSearch;
  });

  const set = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const task: Task = {
      ...form,
      id: initial?.id ?? generateId(),
      createdAt: initial?.createdAt ?? today,
      completedAt: form.status === "완료" ? (initial?.completedAt ?? today) : null,
    };
    saveTask(task);
    router.push("/tasks");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 기본 정보 */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-slate-700">업무 기본 정보</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-xs font-medium text-slate-600 mb-1">업무명 *</label>
            <input required value={form.title} onChange={(e) => set("title", e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="업무 제목을 입력하세요" />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">업무 유형 *</label>
            <select value={form.category} onChange={(e) => set("category", e.target.value as TaskCategory)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              {(["검토", "교육", "리뷰", "자료생성"] as TaskCategory[]).map((v) => <option key={v}>{v}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">우선순위 *</label>
            <select value={form.priority} onChange={(e) => set("priority", e.target.value as TaskPriority)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              {(["일반", "긴급"] as TaskPriority[]).map((v) => <option key={v}>{v}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">상태</label>
            <select value={form.status} onChange={(e) => set("status", e.target.value as TaskStatus)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              {(["접수", "진행중", "검토중", "완료"] as TaskStatus[]).map((v) => <option key={v}>{v}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">마감일 *</label>
            <input required type="date" value={form.dueDate} onChange={(e) => set("dueDate", e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-medium text-slate-600 mb-1">업무 설명</label>
            <textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="업무 내용을 입력하세요" />
          </div>
        </div>
      </div>

      {/* 요청 정보 */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-slate-700">요청 정보</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">요청자 *</label>
            <input required value={form.requesterName} onChange={(e) => set("requesterName", e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="예: 영업1팀 홍길동 부장" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">요청 경로</label>
            <select value={form.requestChannel} onChange={(e) => set("requestChannel", e.target.value as RequestChannel)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              {(["이메일", "메신저", "기타"] as RequestChannel[]).map((v) => <option key={v}>{v}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* 제품 선택 */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
        <h3 className="text-sm font-semibold text-slate-700">관련 제품</h3>
        <div className="flex gap-2">
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>전체</option>
            {productCategories.map((c) => <option key={c}>{c}</option>)}
          </select>
          <input value={productSearch} onChange={(e) => setProductSearch(e.target.value)}
            placeholder="제품명 검색"
            className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm w-40 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <select value={form.productId} onChange={(e) => set("productId", e.target.value)} size={5}
          className="w-full border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          {filteredProducts.map((p) => (
            <option key={p.id} value={p.id}>{p.name} ({p.category})</option>
          ))}
        </select>
        <p className="text-xs text-slate-400">현재 선택: {products.find((p) => p.id === form.productId)?.name}</p>
      </div>

      {/* 담당자 */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
        <h3 className="text-sm font-semibold text-slate-700">담당자 배정</h3>
        <div className="grid grid-cols-5 gap-2">
          {teamMembers.map((m) => (
            <button key={m.id} type="button"
              onClick={() => set("assigneeId", m.id)}
              className={`p-3 rounded-lg border text-center text-sm transition-colors ${
                form.assigneeId === m.id
                  ? "border-blue-500 bg-blue-50 text-blue-700 font-medium"
                  : "border-slate-200 hover:border-slate-300 text-slate-600"
              }`}>
              <p className="font-medium">{m.name}</p>
              <p className="text-xs opacity-70 mt-0.5">{m.role}</p>
            </button>
          ))}
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex gap-3 justify-end">
        <button type="button" onClick={() => router.back()}
          className="px-5 py-2 border border-slate-200 text-slate-600 text-sm rounded-lg hover:bg-slate-50 transition-colors">
          취소
        </button>
        <button type="submit"
          className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
          {initial ? "수정 저장" : "업무 등록"}
        </button>
      </div>
    </form>
  );
}
