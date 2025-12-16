import { useState } from "react";
import type { CategoryCreate } from "../models/category";
import Spinner from "../components/Spinner";
import { useCategoriesQuery } from "../api/queries/categories";
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
} from "../api/mutations/categories";

export default function ManageCategoriesPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { data: categories = [], isLoading } = useCategoriesQuery();
  const createCategoryMutation = useCreateCategoryMutation();
  const deleteCategoryMutation = useDeleteCategoryMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const category: CategoryCreate = {
      name,
      description: description || null,
    };

    createCategoryMutation.mutate(category, {
      onSuccess: () => {
        setName("");
        setDescription("");
      },
    });
  };

  const handleDelete = (id: number) => {
    deleteCategoryMutation.mutate(id);
  };

  return (
    <div className="page">
      <h1>Manage Categories</h1>

      <section className="form-section">
        <h2>Add New Category</h2>
        {createCategoryMutation.isError && (
          <div className="error">
            {createCategoryMutation.error instanceof Error
              ? createCategoryMutation.error.message
              : "Failed to create category"}
          </div>
        )}
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
          <button type="submit" disabled={createCategoryMutation.isPending}>
            {createCategoryMutation.isPending ? "Adding..." : "Add Category"}
          </button>
        </form>
      </section>

      <section className="list-section">
        <h2>Existing Categories</h2>
        {isLoading ? (
          <Spinner />
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
                  onClick={() => handleDelete(category.id)}
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
