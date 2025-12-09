from datetime import datetime, timezone

from src.schemas.category import Category, CategoryCreate, CategoryUpdate
from src.schemas.todo import Todo, TodoCreate, TodoUpdate


class MemoryStorage:
    """In-memory storage for todos and categories."""

    def __init__(self):
        self._categories: dict[int, dict] = {}
        self._todos: dict[int, dict] = {}
        self._category_counter = 0
        self._todo_counter = 0

    # Category methods
    def get_categories(self) -> list[Category]:
        """List all categories."""
        return [Category(**c) for c in self._categories.values()]

    def get_category(self, category_id: int) -> Category | None:
        """Get a single category by ID."""
        if category_id in self._categories:
            return Category(**self._categories[category_id])
        return None

    def create_category(self, data: CategoryCreate) -> Category:
        """Create a new category."""
        self._category_counter += 1
        category = {"id": self._category_counter, **data.model_dump()}
        self._categories[self._category_counter] = category
        return Category(**category)

    def update_category(self, category_id: int, data: CategoryUpdate) -> Category | None:
        """Update an existing category."""
        if category_id not in self._categories:
            return None
        update_data = data.model_dump(exclude_unset=True)
        self._categories[category_id].update(update_data)
        return Category(**self._categories[category_id])

    def delete_category(self, category_id: int) -> bool:
        """Delete a category."""
        if category_id in self._categories:
            del self._categories[category_id]
            return True
        return False

    # Todo methods
    def get_todos(self, category_id: int | None = None) -> list[Todo]:
        """List all todos, optionally filtered by category."""
        todos = list(self._todos.values())
        if category_id is not None:
            todos = [t for t in todos if t["category_id"] == category_id]
        return [Todo(**t) for t in todos]

    def get_todo(self, todo_id: int) -> Todo | None:
        """Get a single todo by ID."""
        if todo_id in self._todos:
            return Todo(**self._todos[todo_id])
        return None

    def create_todo(self, data: TodoCreate) -> Todo:
        """Create a new todo."""
        self._todo_counter += 1
        now = datetime.now(timezone.utc)
        todo = {
            "id": self._todo_counter,
            "created_at": now,
            "updated_at": now,
            **data.model_dump(),
        }
        self._todos[self._todo_counter] = todo
        return Todo(**todo)

    def update_todo(self, todo_id: int, data: TodoUpdate) -> Todo | None:
        """Update an existing todo."""
        if todo_id not in self._todos:
            return None
        update_data = data.model_dump(exclude_unset=True)
        self._todos[todo_id].update(update_data)
        self._todos[todo_id]["updated_at"] = datetime.now(timezone.utc)
        return Todo(**self._todos[todo_id])

    def delete_todo(self, todo_id: int) -> bool:
        """Delete a todo."""
        if todo_id in self._todos:
            del self._todos[todo_id]
            return True
        return False


# Global storage instance
storage = MemoryStorage()
