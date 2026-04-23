import TaskForm from "@/components/TaskForm";

export default function NewTaskPage() {
  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">새 업무 등록</h2>
        <p className="text-slate-500 text-sm mt-0.5">의뢰 접수 내용을 입력하세요</p>
      </div>
      <TaskForm />
    </div>
  );
}
