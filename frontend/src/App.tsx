import { useEffect, useState } from "react";
import { noteService } from "./services/noteService";
import { NoteForm } from "./components/NoteForm";
import { NoteList } from "./components/NoteList";
import type { Note, NoteRequest } from "./types/Note";

function App() {
  const [tab, setTab] = useState<"active" | "archived">("active");
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  async function loadNotes() {
    const data = tab === "active" ? await noteService.listActive() : await noteService.listArchived();
    setNotes(data);
  }

  useEffect(() => {
    loadNotes();
  }, [tab]);

  async function handleSubmit(data: NoteRequest) {
    if (editingNote) {
      await noteService.update(editingNote.id, data);
      setEditingNote(null);
    } else {
      await noteService.create(data);
    }
    loadNotes();
  }

  async function handleDelete(id: number) {
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

  return (
    <div className="app-shell">
      <main className="main-content">
        <h1 className="page-title">📝 Mis Notas</h1>

        <div className="form-actions" style={{ marginBottom: 20 }}>
          <button
            className={`btn ${tab === "active" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setTab("active")}
          >
            Activas
          </button>
          <button
            className={`btn ${tab === "archived" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setTab("archived")}
          >
            Archivadas
          </button>
        </div>

        <div className="quick-add">
          <NoteForm
            editingNote={editingNote}
            onSubmit={handleSubmit}
            onCancelEdit={() => setEditingNote(null)}
          />
        </div>

        <NoteList
          notes={notes}
          onEdit={setEditingNote}
          onDelete={handleDelete}
          onArchive={handleArchive}
          onUnarchive={handleUnarchive}
        />
      </main>
    </div>
  );
}

export default App;
