export type TaskCategory = "검토" | "교육" | "리뷰" | "자료생성";
export type TaskStatus = "접수" | "진행중" | "검토중" | "완료";
export type TaskPriority = "긴급" | "일반";
export type RequestChannel = "이메일" | "메신저" | "기타";

export type TeamMember = {
  id: string;
  name: string;
  role: string;
};

export type Product = {
  id: string;
  name: string;
  category: string;
  code: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string;
  requesterName: string;
  requestChannel: RequestChannel;
  productId: string;
  dueDate: string;
  createdAt: string;
  completedAt: string | null;
};
