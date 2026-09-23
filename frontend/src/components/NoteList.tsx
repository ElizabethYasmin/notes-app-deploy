import type { Category, Note } from "../types/Note";

interface NoteListProps {
  notes: Note[];
  allCategories: Category[];
  onEdit: (note: Note) => void;
  onDelete: (id: number) => void;
  onArchive: (id: number) => void;
  onUnarchive: (id: number) => void;
  onAddCategory: (noteId: number, categoryId: number) => void;
  onRemoveCategory: (noteId: number, categoryId: number) => void;
}

export function NoteList({
  notes,
  allCategories,
  onEdit,
  onDelete,
  onArchive,
  onUnarchive,
  onAddCategory,
  onRemoveCategory,
}: NoteListProps) {
  if (notes.length === 0) {
    return <p className="empty-state">No hay notas para mostrar.</p>;
  }

  return (
    <ul className="note-list">
      {notes.map((note) => {
        const availableToAdd = allCategories.filter(
          (c) => !note.categories.some((nc) => nc.id === c.id)
        );

        return (
          <li key={note.id} className="note-row">
            <div className="note-main">
              <p className="note-title">{note.title}</p>
              {note.content && <p className="note-preview">{note.content}</p>}

              <div className="tag-row">
                {note.categories.map((c) => (
                  <span key={c.id} className="tag">
                    {c.name}
                    <button className="tag-remove" onClick={() => onRemoveCategory(note.id, c.id)}>
                      ✕
                    </button>
                  </span>
                ))}

                {availableToAdd.length > 0 && (
                  <select
                    className="add-category-select"
                    defaultValue=""
                    onChange={(e) => {
                      if (e.target.value) {
                        onAddCategory(note.id, Number(e.target.value));
                        e.target.value = "";
                      }
                    }}
                  >
                    <option value="" disabled>
                      + tag
                    </option>
                    {availableToAdd.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
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
        );
      })}
    </ul>
  );
}
