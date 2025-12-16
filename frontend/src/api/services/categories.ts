import type { Category, CategoryCreate } from "../../models/category";

const API_BASE = "http://localhost:8000/api";

export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${API_BASE}/categories`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

export async function getCategory(id: number): Promise<Category> {
  const res = await fetch(`${API_BASE}/categories/${id}`);
  if (!res.ok) throw new Error("Failed to fetch category");
  return res.json();
}

export async function createCategory(data: CategoryCreate): Promise<Category> {
  const res = await fetch(`${API_BASE}/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create category");
  return res.json();
}

export async function deleteCategory(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/categories/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete category");
}
