"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getTaskById } from "@/lib/store";
import { Task } from "@/lib/types";
import TaskForm from "@/components/TaskForm";

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [task, setTask] = useState<Task | undefined>();

  useEffect(() => {
    setTask(getTaskById(id));
  }, [id]);

  if (!task) return <div className="p-8 text-slate-500">업무를 찾을 수 없습니다.</div>;

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">업무 수정</h2>
        <p className="text-slate-500 text-sm mt-0.5">접수일: {task.createdAt}</p>
      </div>
      <TaskForm initial={task} />
    </div>
  );
}
