import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header className="header">
      <h1 className="header-title">Todo App</h1>
      <nav>
        <NavLink to="/">View Todos</NavLink>
        <NavLink to="/add">Add Todo</NavLink>
        <NavLink to="/categories">Categories</NavLink>
      </nav>
    </header>
  );
}
