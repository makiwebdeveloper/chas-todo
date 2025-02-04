export enum TodoStatus {
  PENDING = "pending",
  COMPLETED = "completed",
}

export enum TodoComplexity {
  EASY = "easy",
  MEDIUM = "medium",
  DIFFICULT = "difficult",
}

export interface ICreateTodoBody {
  text: string;
  complexity: TodoComplexity;
}

export interface ITodo {
  id: string;
  created_at: string;
  completed_at: string | null;
  text: string;
  status: TodoStatus;
  complexity: TodoComplexity;
  user_id: string;
}
