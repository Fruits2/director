"use client";

import { useState } from "react";
import { products } from "@/lib/mockData";

const categories = ["전체", ...new Set(products.map((p) => p.category))];

export default function ProductsPage() {
  const [selected, setSelected] = useState("전체");
  const [search, setSearch] = useState("");

  const filtered = products.filter((p) => {
    const matchCat = selected === "전체" || p.category === selected;
    const matchSearch = p.name.includes(search) || p.code.includes(search);
    return matchCat && matchSearch;
  });

  return (
    <div className="p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">제품 목록</h2>
        <p className="text-slate-500 text-sm mt-0.5">종근당 주요 제품 {products.length}개</p>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        {categories.map((c) => (
          <button key={c} onClick={() => setSelected(c)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selected === c
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}>
            {c}
          </button>
        ))}
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="제품명 또는 코드 검색"
          className="ml-auto px-3 py-1.5 border border-slate-200 rounded-lg text-sm w-48 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-slate-500 text-xs text-left">
              <th className="px-4 py-3 font-medium">제품명</th>
              <th className="px-4 py-3 font-medium">카테고리</th>
              <th className="px-4 py-3 font-medium">제품 코드</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-800">{p.name}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-600">{p.category}</span>
                </td>
                <td className="px-4 py-3 text-slate-400 font-mono text-xs">{p.code}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
