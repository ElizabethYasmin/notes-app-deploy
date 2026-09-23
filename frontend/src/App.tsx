import { Navigate, Route, Routes } from "react-router-dom";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { NotesPage } from "./pages/NotesPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/notes"
        element={
          <ProtectedRoute>
            <NotesPage tab="active" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notes/archived"
        element={
          <ProtectedRoute>
            <NotesPage tab="archived" />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/notes" replace />} />
    </Routes>
  );
}

export default App;
