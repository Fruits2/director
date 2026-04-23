"use client";

import { useEffect, useState } from "react";
import { getTasks } from "@/lib/store";
import { teamMembers } from "@/lib/mockData";
import { Task } from "@/lib/types";

const STATUS_COLOR: Record<string, string> = {
  접수: "bg-slate-100 text-slate-600",
  진행중: "bg-blue-100 text-blue-700",
  검토중: "bg-yellow-100 text-yellow-700",
  완료: "bg-green-100 text-green-700",
};

export default function TeamPage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => { setTasks(getTasks()); }, []);

  return (
    <div className="p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">팀원 현황</h2>
        <p className="text-slate-500 text-sm mt-0.5">팀원별 업무 배정 및 진행 현황</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {teamMembers.map((member) => {
          const memberTasks = tasks.filter((t) => t.assigneeId === member.id);
          const active = memberTasks.filter((t) => t.status !== "완료");
          const done = memberTasks.filter((t) => t.status === "완료");
          const urgent = active.filter((t) => t.priority === "긴급");

          return (
            <div key={member.id} className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-semibold text-slate-800">{member.name}</p>
                  <p className="text-xs text-slate-400">{member.role}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-800">{active.length}</p>
                  <p className="text-xs text-slate-400">진행중</p>
                </div>
              </div>

              <div className="flex gap-3 text-xs text-slate-500 mb-4">
                <span>완료 {done.length}건</span>
                {urgent.length > 0 && (
                  <span className="text-red-600 font-medium">긴급 {urgent.length}건</span>
                )}
              </div>

              {active.length > 0 ? (
                <div className="space-y-1.5">
                  {active.slice(0, 3).map((t) => (
                    <div key={t.id} className="flex items-center justify-between py-1.5 border-t border-slate-100">
                      <span className="text-xs text-slate-700 truncate max-w-[180px]">{t.title}</span>
                      <span className={`px-1.5 py-0.5 rounded text-xs font-medium ml-2 ${STATUS_COLOR[t.status]}`}>
                        {t.status}
                      </span>
                    </div>
                  ))}
                  {active.length > 3 && (
                    <p className="text-xs text-slate-400 pt-1">외 {active.length - 3}건</p>
                  )}
                </div>
              ) : (
                <p className="text-xs text-slate-400 border-t border-slate-100 pt-3">진행중인 업무 없음</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
