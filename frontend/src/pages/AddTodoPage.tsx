import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { TodoCreate } from "../models/todo";
import { useCategoriesQuery } from "../api/queries/categories";
import { useCreateTodoMutation } from "../api/mutations/todos";

export default function AddTodoPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const navigate = useNavigate();

  const { data: categories = [] } = useCategoriesQuery();
  const createTodoMutation = useCreateTodoMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const todo: TodoCreate = {
      title,
      description: description || null,
      category_id: categoryId,
    };

    createTodoMutation.mutate(todo, {
      onSuccess: () => {
        navigate("/");
      },
    });
  };

  return (
    <div className="page">
      <h1>Add Todo</h1>
      {createTodoMutation.isError && (
        <div className="error">
          {createTodoMutation.error instanceof Error
            ? createTodoMutation.error.message
            : "Failed to create todo"}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter todo title"
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description (optional)"
            rows={3}
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={categoryId ?? ""}
            onChange={(e) =>
              setCategoryId(e.target.value ? Number(e.target.value) : null)
            }
          >
            <option value="">No category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" disabled={createTodoMutation.isPending}>
          {createTodoMutation.isPending ? "Creating..." : "Create Todo"}
        </button>
      </form>
    </div>
  );
}
