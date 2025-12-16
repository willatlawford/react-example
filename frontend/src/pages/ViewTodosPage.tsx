import { useState, useEffect } from "react";
import type { Todo } from "../models/todo";
import type { Category } from "../models/category";
import Spinner from "../components/Spinner";

const API_BASE = "http://localhost:8000/api";

export default function ViewTodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filterCategory, setFilterCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/categories`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Failed to load categories:", err));
  }, []);

  useEffect(() => {
    setLoading(true);
    const url = filterCategory
      ? `${API_BASE}/todos?category_id=${filterCategory}`
      : `${API_BASE}/todos`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((err) => console.error("Failed to load todos:", err))
      .finally(() => setLoading(false));
  }, [filterCategory]);

  const toggleComplete = async (todo: Todo) => {
    try {
      const res = await fetch(`${API_BASE}/todos/${todo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !todo.completed }),
      });

      if (!res.ok) throw new Error("Failed to update todo");

      const updated = await res.json();
      setTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      if (selectedTodo?.id === updated.id) {
        setSelectedTodo(updated);
      }
    } catch (err) {
      console.error("Failed to update todo:", err);
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE}/todos/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete todo");

      setTodos((prev) => prev.filter((t) => t.id !== id));
      if (selectedTodo?.id === id) {
        setSelectedTodo(null);
      }
    } catch (err) {
      console.error("Failed to delete todo:", err);
    }
  };

  const getCategoryName = (categoryId: number | null) => {
    if (!categoryId) return "No category";
    return categories.find((c) => c.id === categoryId)?.name ?? "Unknown";
  };

  const openDrawer = (todo: Todo) => {
    setSelectedTodo(todo);
    setEditingTitle(todo.title);
  };

  const closeDrawer = () => {
    setSelectedTodo(null);
    setEditingTitle("");
  };

  const saveTitle = async () => {
    if (!selectedTodo || editingTitle === selectedTodo.title) return;

    setIsSaving(true);
    try {
      const res = await fetch(`${API_BASE}/todos/${selectedTodo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editingTitle }),
      });

      if (!res.ok) throw new Error("Failed to update todo");

      const updated = await res.json();
      setTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      setSelectedTodo(updated);
    } catch (err) {
      console.error("Failed to update todo:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="page">
      <h1>Todos</h1>
      <div className="filter-group">
        <label htmlFor="filter">Filter by category:</label>
        <select
          id="filter"
          value={filterCategory ?? ""}
          onChange={(e) =>
            setFilterCategory(e.target.value ? Number(e.target.value) : null)
          }
        >
          <option value="">All categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {todos.length === 0 ? (
        <p className="empty-state">No todos found. Create one!</p>
      ) : (
        <ul className="todo-list">
          {todos.map((todo) => (
            <li key={todo.id} className={todo.completed ? "completed" : ""}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleComplete(todo)}
              />
              <div className="todo-content">
                <button
                  className="todo-title-btn"
                  onClick={() => openDrawer(todo)}
                >
                  {todo.title}
                </button>
                {todo.description && (
                  <span className="todo-description">{todo.description}</span>
                )}
                <span className="todo-category">
                  {getCategoryName(todo.category_id)}
                </span>
              </div>
              <button
                className="delete-btn"
                onClick={() => deleteTodo(todo.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Drawer overlay */}
      {selectedTodo && (
        <div className="drawer-overlay" onClick={closeDrawer} />
      )}

      {/* Drawer */}
      <div className={`drawer ${selectedTodo ? "open" : ""}`}>
        {selectedTodo && (
          <>
            <div className="drawer-header">
              <h2>Todo Details</h2>
              <button className="drawer-close" onClick={closeDrawer}>
                &times;
              </button>
            </div>
            <div className="drawer-content">
              <div className="form-group">
                <label htmlFor="edit-title">Title</label>
                <input
                  id="edit-title"
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  onBlur={saveTitle}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveTitle();
                  }}
                />
                {isSaving && <span className="saving-indicator">Saving...</span>}
              </div>

              <div className="todo-meta">
                <span
                  className={`status ${selectedTodo.completed ? "completed" : "pending"}`}
                >
                  {selectedTodo.completed ? "Completed" : "Pending"}
                </span>
                <span className="category-badge">
                  {getCategoryName(selectedTodo.category_id)}
                </span>
              </div>

              {selectedTodo.description && (
                <div className="drawer-section">
                  <h3>Description</h3>
                  <p className="todo-full-description">
                    {selectedTodo.description}
                  </p>
                </div>
              )}

              <div className="drawer-section">
                <h3>Timestamps</h3>
                <p className="timestamp">
                  Created: {new Date(selectedTodo.created_at).toLocaleString()}
                </p>
                <p className="timestamp">
                  Updated: {new Date(selectedTodo.updated_at).toLocaleString()}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
