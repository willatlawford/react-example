from datetime import datetime

from pydantic import BaseModel


class TodoBase(BaseModel):
    """Base schema for todo data."""
    title: str
    description: str | None = None
    completed: bool = False
    category_id: int | None = None


class TodoCreate(TodoBase):
    """Schema for creating a new todo."""
    pass


class TodoUpdate(BaseModel):
    """Schema for updating a todo (all fields optional)."""
    title: str | None = None
    description: str | None = None
    completed: bool | None = None
    category_id: int | None = None


class Todo(TodoBase):
    """Schema for todo response with ID and timestamps."""
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
