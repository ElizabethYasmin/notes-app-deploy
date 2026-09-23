import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { noteService } from "../services/noteService";
import { categoryService } from "../services/categoryService";
import { connectRealtime, disconnectRealtime } from "../services/realtime";
import { NoteForm } from "../components/NoteForm";
import { NoteList } from "../components/NoteList";
import { Sidebar } from "../components/Sidebar";
import { clearAuthHeader } from "../services/http";
import type { Category, Note, NoteRequest } from "../types/Note";

interface NotesPageProps {
  tab: "active" | "archived";
}

export function NotesPage({ tab }: NotesPageProps) {
  const navigate = useNavigate();
  const [notes, setNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<number | undefined>(undefined);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");

  async function loadNotes() {
    const data =
      tab === "active"
        ? await noteService.listActive(categoryFilter)
        : await noteService.listArchived(categoryFilter);
    setNotes(data);
  }

  async function loadCategories() {
    setCategories(await categoryService.listAll());
  }

  useEffect(() => {
    loadNotes();
  }, [tab, categoryFilter]);

  useEffect(() => {
    loadCategories();
  }, []);

  // Kept fresh on every render so the WebSocket callback below (set up once, on mount)
  // always refetches with the current tab/categoryFilter instead of a stale closure.
  const refreshRef = useRef(() => {
    loadNotes();
    loadCategories();
  });
  refreshRef.current = () => {
    loadNotes();
    loadCategories();
  };

  useEffect(() => {
    connectRealtime(() => refreshRef.current());
    return () => disconnectRealtime();
  }, []);

  async function handleSubmit(data: NoteRequest) {
    if (editingNote) {
      await noteService.update(editingNote.id, {
        ...data,
        categoryIds: editingNote.categories.map((c) => c.id),
      });
      setEditingNote(null);
    } else {
      await noteService.create(data);
    }
    loadNotes();
  }

  async function handleDelete(id: number) {
    if (!confirm("¿Borrar esta nota? Esta acción no se puede deshacer.")) return;
    await noteService.remove(id);
    loadNotes();
  }

  async function handleArchive(id: number) {
    await noteService.archive(id);
    loadNotes();
  }

  async function handleUnarchive(id: number) {
    await noteService.unarchive(id);
    loadNotes();
  }

  function categoryIdsOf(noteId: number): number[] {
    return notes.find((n) => n.id === noteId)?.categories.map((c) => c.id) ?? [];
  }

  async function handleAddCategory(noteId: number, categoryId: number) {
    const note = notes.find((n) => n.id === noteId);
    if (!note) return;
    await noteService.update(noteId, {
      title: note.title,
      content: note.content,
      categoryIds: [...categoryIdsOf(noteId), categoryId],
    });
    loadNotes();
  }

  async function handleRemoveCategory(noteId: number, categoryId: number) {
    const note = notes.find((n) => n.id === noteId);
    if (!note) return;
    await noteService.update(noteId, {
      title: note.title,
      content: note.content,
      categoryIds: categoryIdsOf(noteId).filter((id) => id !== categoryId),
    });
    loadNotes();
  }

  async function handleCreateCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    await categoryService.create(newCategoryName);
    setNewCategoryName("");
    loadCategories();
  }

  async function handleUpdateCategory(id: number, name: string) {
    await categoryService.update(id, name);
    loadCategories();
    loadNotes(); // note.categories embeds the name, so open notes need the fresh label too
  }

  async function handleDeleteCategory(id: number) {
    const category = categories.find((c) => c.id === id);
    if (!confirm(`¿Borrar la categoría "${category?.name}"? Se quitará de todas tus notas.`)) return;
    await categoryService.remove(id);
    if (categoryFilter === id) setCategoryFilter(undefined);
    loadCategories();
    loadNotes();
  }

  function handleLogout() {
    disconnectRealtime();
    clearAuthHeader();
    navigate("/login");
  }

  return (
    <div className="app-shell">
      <Sidebar
        categories={categories}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        newCategoryName={newCategoryName}
        onNewCategoryNameChange={setNewCategoryName}
        onCreateCategory={handleCreateCategory}
        onUpdateCategory={handleUpdateCategory}
        onDeleteCategory={handleDeleteCategory}
        onLogout={handleLogout}
      />

      <main className="main-content">
        <h1 className="page-title">{tab === "active" ? "Activas" : "Archivadas"}</h1>

        <div className="quick-add">
          <NoteForm
            editingNote={editingNote}
            onSubmit={handleSubmit}
            onCancelEdit={() => setEditingNote(null)}
          />
        </div>

        <NoteList
          notes={notes}
          allCategories={categories}
          onEdit={setEditingNote}
          onDelete={handleDelete}
          onArchive={handleArchive}
          onUnarchive={handleUnarchive}
          onAddCategory={handleAddCategory}
          onRemoveCategory={handleRemoveCategory}
        />
      </main>
    </div>
  );
}
