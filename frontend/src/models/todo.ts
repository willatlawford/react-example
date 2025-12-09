export interface Todo {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  category_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface TodoCreate {
  title: string;
  description?: string | null;
  completed?: boolean;
  category_id?: number | null;
}

export interface TodoUpdate {
  title?: string;
  description?: string | null;
  completed?: boolean;
  category_id?: number | null;
}
