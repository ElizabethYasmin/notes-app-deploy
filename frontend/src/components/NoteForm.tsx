import { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
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
    <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          variant="standard"
          placeholder="Título"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          slotProps={{ input: { disableUnderline: true, sx: { fontSize: 18, fontWeight: 600 } } }}
        />
        <TextField
          variant="standard"
          placeholder="Escribe algo..."
          fullWidth
          multiline
          minRows={2}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          sx={{ mt: 0.5 }}
          slotProps={{ input: { disableUnderline: true } }}
        />
        <Box sx={{ display: "flex", gap: 1, mt: 1.5 }}>
          <Button type="submit" variant="contained" size="small" startIcon={<AddOutlinedIcon />}>
            {editingNote ? "Guardar cambios" : "Crear nota"}
          </Button>
          {editingNote && (
            <Button
              type="button"
              variant="text"
              size="small"
              color="inherit"
              startIcon={<CloseOutlinedIcon />}
              onClick={onCancelEdit}
            >
              Cancelar
            </Button>
          )}
        </Box>
      </Box>
    </Paper>
  );
}
