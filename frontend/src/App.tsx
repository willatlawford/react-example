import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import AddTodoPage from "./pages/AddTodoPage";
import ViewTodosPage from "./pages/ViewTodosPage";
import ManageCategoriesPage from "./pages/ManageCategoriesPage";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />
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
