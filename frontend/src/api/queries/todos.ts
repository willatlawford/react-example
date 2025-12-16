import { useQuery } from "@tanstack/react-query";
import { getTodos, getTodo } from "../services/todos";

export const todoKeys = {
  all: ["todos"] as const,
  list: (categoryId?: number | null) =>
    categoryId ? (["todos", { categoryId }] as const) : (["todos"] as const),
  detail: (id: number) => ["todos", id] as const,
};

export function useTodosQuery(categoryId?: number | null) {
  return useQuery({
    queryKey: todoKeys.list(categoryId),
    queryFn: () => getTodos(categoryId),
  });
}

export function useTodoQuery(id: number) {
  return useQuery({
    queryKey: todoKeys.detail(id),
    queryFn: () => getTodo(id),
  });
}
