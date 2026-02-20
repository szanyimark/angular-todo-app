export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  completedAt: string | null;
  createdAt: string;
}

export interface CreateTodoInput {
  title: string;
}

export interface UpdateTodoInput {
  id: string;
  title?: string;
  completed?: boolean;
}