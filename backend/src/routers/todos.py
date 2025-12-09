from fastapi import APIRouter, HTTPException, Query

from src.schemas.todo import Todo, TodoCreate, TodoUpdate
from src.storage.memory import storage

router = APIRouter(prefix="/api/todos", tags=["todos"])


@router.get("", response_model=list[Todo])
def list_todos(category_id: int | None = Query(None)):
    """List all todos, optionally filtered by category."""
    return storage.get_todos(category_id)


@router.get("/{todo_id}", response_model=Todo)
def get_todo(todo_id: int):
    """Get a single todo by ID."""
    todo = storage.get_todo(todo_id)
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo


@router.post("", response_model=Todo, status_code=201)
def create_todo(data: TodoCreate):
    """Create a new todo."""
    if data.category_id is not None:
        if not storage.get_category(data.category_id):
            raise HTTPException(status_code=400, detail="Category not found")
    return storage.create_todo(data)


@router.put("/{todo_id}", response_model=Todo)
def update_todo(todo_id: int, data: TodoUpdate):
    """Update an existing todo."""
    if data.category_id is not None:
        if not storage.get_category(data.category_id):
            raise HTTPException(status_code=400, detail="Category not found")
    todo = storage.update_todo(todo_id, data)
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo


@router.delete("/{todo_id}")
def delete_todo(todo_id: int):
    """Delete a todo."""
    if not storage.delete_todo(todo_id):
        raise HTTPException(status_code=404, detail="Todo not found")
    return {"message": "Todo deleted successfully"}
