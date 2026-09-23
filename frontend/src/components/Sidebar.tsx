import { useState } from "react";
import { NavLink } from "react-router-dom";
import type { Category } from "../types/Note";

interface SidebarProps {
  categories: Category[];
  categoryFilter: number | undefined;
  onCategoryFilterChange: (id: number | undefined) => void;
  newCategoryName: string;
  onNewCategoryNameChange: (value: string) => void;
  onCreateCategory: (e: React.FormEvent) => void;
  onUpdateCategory: (id: number, name: string) => void;
  onDeleteCategory: (id: number) => void;
  onLogout: () => void;
}

export function Sidebar({
  categories,
  categoryFilter,
  onCategoryFilterChange,
  newCategoryName,
  onNewCategoryNameChange,
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory,
  onLogout,
}: SidebarProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  function startEdit(category: Category) {
    setEditingId(category.id);
    setEditingName(category.name);
  }

  function confirmEdit() {
    const trimmed = editingName.trim();
    if (editingId !== null && trimmed) {
      onUpdateCategory(editingId, trimmed);
    }
    setEditingId(null);
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-title">📝 Mis Notas</div>

      <div>
        <div className="sidebar-section-label">Notas</div>
        <div className="sidebar-nav">
          <NavLink
            to="/notes"
            end
            className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}
          >
            🗂️ Activas
          </NavLink>
          <NavLink
            to="/notes/archived"
            className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}
          >
            🗄️ Archivadas
          </NavLink>
        </div>
      </div>

      <div>
        <div className="sidebar-section-label">Categorías</div>
        <div className="sidebar-nav">
          <button
            className={`sidebar-item ${categoryFilter === undefined ? "active" : ""}`}
            onClick={() => onCategoryFilterChange(undefined)}
          >
            ● Todas
          </button>

          {categories.map((c) =>
            editingId === c.id ? (
              <form
                key={c.id}
                className="sidebar-category-edit"
                onSubmit={(e) => {
                  e.preventDefault();
                  confirmEdit();
                }}
              >
                <input
                  autoFocus
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onBlur={confirmEdit}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") setEditingId(null);
                  }}
                />
              </form>
            ) : (
              <div key={c.id} className="sidebar-category-row">
                <button
                  className={`sidebar-item ${categoryFilter === c.id ? "active" : ""}`}
                  onClick={() => onCategoryFilterChange(c.id)}
                >
                  # {c.name}
                </button>
                <button
                  className="sidebar-icon-btn"
                  title="Editar categoría"
                  onClick={() => startEdit(c)}
                >
                  ✎
                </button>
                <button
                  className="sidebar-icon-btn"
                  title="Borrar categoría"
                  onClick={() => onDeleteCategory(c.id)}
                >
                  ✕
                </button>
              </div>
            )
          )}
        </div>
        <form className="sidebar-category-form" onSubmit={onCreateCategory}>
          <input
            type="text"
            placeholder="+ nueva categoría"
            value={newCategoryName}
            onChange={(e) => onNewCategoryNameChange(e.target.value)}
          />
        </form>
      </div>

      <button className="sidebar-item" onClick={onLogout} style={{ marginTop: "auto" }}>
        🚪 Cerrar sesión
      </button>
    </aside>
  );
}
