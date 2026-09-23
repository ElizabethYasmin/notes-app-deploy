import type { Note } from "../types/Note";

interface NoteListProps {
  notes: Note[];
  onEdit: (note: Note) => void;
  onDelete: (id: number) => void;
  onArchive: (id: number) => void;
  onUnarchive: (id: number) => void;
}

export function NoteList({ notes, onEdit, onDelete, onArchive, onUnarchive }: NoteListProps) {
  if (notes.length === 0) {
    return <p className="empty-state">No hay notas para mostrar.</p>;
  }

  return (
    <ul className="note-list">
      {notes.map((note) => (
        <li key={note.id} className="note-row">
          <div className="note-main">
            <p className="note-title">{note.title}</p>
            {note.content && <p className="note-preview">{note.content}</p>}
          </div>

          <div className="note-actions">
            <button className="btn-icon" onClick={() => onEdit(note)}>
              ✏️
            </button>
            {note.archived ? (
              <button className="btn-icon success" onClick={() => onUnarchive(note.id)}>
                ↩️
              </button>
            ) : (
              <button className="btn-icon" onClick={() => onArchive(note.id)}>
                🗄️
              </button>
            )}
            <button className="btn-icon danger" onClick={() => onDelete(note.id)}>
              🗑️
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
