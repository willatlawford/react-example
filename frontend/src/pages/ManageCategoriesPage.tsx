import { useState, useEffect } from "react";
import type { Category, CategoryCreate } from "../models/category";

const API_BASE = "http://localhost:8000/api";

export default function ManageCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = () => {
    setLoading(true);
    fetch(`${API_BASE}/categories`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Failed to load categories:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const category: CategoryCreate = {
      name,
      description: description || null,
    };

    try {
      const res = await fetch(`${API_BASE}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(category),
      });

      if (!res.ok) {
        throw new Error("Failed to create category");
      }

      setName("");
      setDescription("");
      fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE}/categories/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete category");

      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Failed to delete category:", err);
    }
  };

  return (
    <div className="page">
      <h1>Manage Categories</h1>

      <section className="form-section">
        <h2>Add New Category</h2>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter category name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description (optional)"
              rows={2}
            />
          </div>
          <button type="submit" disabled={submitting}>
            {submitting ? "Adding..." : "Add Category"}
          </button>
        </form>
      </section>

      <section className="list-section">
        <h2>Existing Categories</h2>
        {loading ? (
          <p>Loading...</p>
        ) : categories.length === 0 ? (
          <p className="empty-state">No categories found. Create one!</p>
        ) : (
          <ul className="category-list">
            {categories.map((category) => (
              <li key={category.id}>
                <div className="category-content">
                  <strong>{category.name}</strong>
                  {category.description && (
                    <span className="category-description">
                      {category.description}
                    </span>
                  )}
                </div>
                <button
                  className="delete-btn"
                  onClick={() => deleteCategory(category.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
