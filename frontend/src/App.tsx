import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import AddTodoPage from "./pages/AddTodoPage";
import ViewTodosPage from "./pages/ViewTodosPage";
import ManageCategoriesPage from "./pages/ManageCategoriesPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <nav>
          <NavLink to="/">View Todos</NavLink>
          <NavLink to="/add">Add Todo</NavLink>
          <NavLink to="/categories">Categories</NavLink>
        </nav>
        <main>
          <Routes>
            <Route path="/" element={<ViewTodosPage />} />
            <Route path="/add" element={<AddTodoPage />} />
            <Route path="/categories" element={<ManageCategoriesPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
