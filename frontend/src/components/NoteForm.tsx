import { useEffect, useState } from "react";
import type { Note, NoteRequest } from "../types/Note";

interface NoteFormProps {
  editingNote: Note | null;
  onSubmit: (data: NoteRequest) => void;
  onCancelEdit: () => void;
}

export function NoteForm({ editingNote, onSubmit, onCancelEdit }: NoteFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title);
      setContent(editingNote.content ?? "");
    } else {
      setTitle("");
      setContent("");
    }
  }, [editingNote]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title, content });
    setTitle("");
    setContent("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Escribe algo..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {editingNote ? "Guardar cambios" : "Crear nota"}
        </button>
        {editingNote && (
          <button type="button" className="btn btn-ghost" onClick={onCancelEdit}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
