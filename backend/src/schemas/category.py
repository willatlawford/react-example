from pydantic import BaseModel


class CategoryBase(BaseModel):
    """Base schema for category data."""
    name: str
    description: str | None = None


class CategoryCreate(CategoryBase):
    """Schema for creating a new category."""
    pass


class CategoryUpdate(BaseModel):
    """Schema for updating a category (all fields optional)."""
    name: str | None = None
    description: str | None = None


class Category(CategoryBase):
    """Schema for category response with ID."""
    id: int

    model_config = {"from_attributes": True}
