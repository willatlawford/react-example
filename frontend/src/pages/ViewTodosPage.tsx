import { useState } from "react";
import type { Todo } from "../models/todo";
import Spinner from "../components/Spinner";
import { useTodosQuery } from "../api/queries/todos";
import { useCategoriesQuery } from "../api/queries/categories";
import { useUpdateTodoMutation, useDeleteTodoMutation } from "../api/mutations/todos";

export default function ViewTodosPage() {
  const [filterCategory, setFilterCategory] = useState<number | null>(null);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const { data: todos = [], isLoading: todosLoading } = useTodosQuery(filterCategory);
  const { data: categories = [] } = useCategoriesQuery();
  const updateTodoMutation = useUpdateTodoMutation();
  const deleteTodoMutation = useDeleteTodoMutation();

  const toggleComplete = (todo: Todo) => {
    updateTodoMutation.mutate(
      { id: todo.id, data: { completed: !todo.completed } },
      {
        onSuccess: (updated) => {
          if (selectedTodo?.id === updated.id) {
            setSelectedTodo(updated);
          }
        },
      }
    );
  };

  const handleDelete = (id: number) => {
    deleteTodoMutation.mutate(id, {
      onSuccess: () => {
        if (selectedTodo?.id === id) {
          setSelectedTodo(null);
        }
      },
    });
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

  const saveTitle = () => {
    if (!selectedTodo || editingTitle === selectedTodo.title) return;

    updateTodoMutation.mutate(
      { id: selectedTodo.id, data: { title: editingTitle } },
      {
        onSuccess: (updated) => {
          setSelectedTodo(updated);
        },
      }
    );
  };

  if (todosLoading) {
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
                onClick={() => handleDelete(todo.id)}
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
                {updateTodoMutation.isPending && (
                  <span className="saving-indicator">Saving...</span>
                )}
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
