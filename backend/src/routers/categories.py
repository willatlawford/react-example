from fastapi import APIRouter, HTTPException

from src.schemas.category import Category, CategoryCreate, CategoryUpdate
from src.storage.memory import storage

router = APIRouter(prefix="/api/categories", tags=["categories"])


@router.get("", response_model=list[Category])
def list_categories():
    """List all categories."""
    return storage.get_categories()


@router.get("/{category_id}", response_model=Category)
def get_category(category_id: int):
    """Get a single category by ID."""
    category = storage.get_category(category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


@router.post("", response_model=Category, status_code=201)
def create_category(data: CategoryCreate):
    """Create a new category."""
    return storage.create_category(data)


@router.put("/{category_id}", response_model=Category)
def update_category(category_id: int, data: CategoryUpdate):
    """Update an existing category."""
    category = storage.update_category(category_id, data)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


@router.delete("/{category_id}")
def delete_category(category_id: int):
    """Delete a category."""
    if not storage.delete_category(category_id):
        raise HTTPException(status_code=404, detail="Category not found")
    return {"message": "Category deleted successfully"}
