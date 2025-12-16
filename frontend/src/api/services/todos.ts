import type { Todo, TodoCreate, TodoUpdate } from "../../models/todo";

const API_BASE = "http://localhost:8000/api";

export async function getTodos(categoryId?: number | null): Promise<Todo[]> {
  const url = categoryId
    ? `${API_BASE}/todos?category_id=${categoryId}`
    : `${API_BASE}/todos`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch todos");
  return res.json();
}

export async function getTodo(id: number): Promise<Todo> {
  const res = await fetch(`${API_BASE}/todos/${id}`);
  if (!res.ok) throw new Error("Failed to fetch todo");
  return res.json();
}

export async function createTodo(data: TodoCreate): Promise<Todo> {
  const res = await fetch(`${API_BASE}/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create todo");
  return res.json();
}

export async function updateTodo(id: number, data: TodoUpdate): Promise<Todo> {
  const res = await fetch(`${API_BASE}/todos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update todo");
  return res.json();
}

export async function deleteTodo(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/todos/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete todo");
}
