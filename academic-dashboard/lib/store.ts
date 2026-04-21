"use client";

import { Task } from "./types";
import { sampleTasks } from "./mockData";

const STORAGE_KEY = "mi_tasks";

export function getTasks(): Task[] {
  if (typeof window === "undefined") return sampleTasks;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleTasks));
    return sampleTasks;
  }
  return JSON.parse(raw) as Task[];
}

export function saveTask(task: Task): void {
  const tasks = getTasks();
  const idx = tasks.findIndex((t) => t.id === task.id);
  if (idx >= 0) tasks[idx] = task;
  else tasks.unshift(task);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export function deleteTask(id: string): void {
  const tasks = getTasks().filter((t) => t.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export function getTaskById(id: string): Task | undefined {
  return getTasks().find((t) => t.id === id);
}

export function generateId(): string {
  return `t${Date.now()}`;
}
