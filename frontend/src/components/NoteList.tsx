import { useState } from "react";
import type { MouseEvent } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import UnarchiveOutlinedIcon from "@mui/icons-material/UnarchiveOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutlineOutlined";
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
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [menuNoteId, setMenuNoteId] = useState<number | null>(null);

  function openAddCategoryMenu(e: MouseEvent<HTMLElement>, noteId: number) {
    setMenuAnchor(e.currentTarget);
    setMenuNoteId(noteId);
  }

  function closeAddCategoryMenu() {
    setMenuAnchor(null);
    setMenuNoteId(null);
  }

  if (notes.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
        No hay notas para mostrar.
      </Typography>
    );
  }

  return (
    <List disablePadding>
      {notes.map((note) => {
        const availableToAdd = allCategories.filter(
          (c) => !note.categories.some((nc) => nc.id === c.id)
        );

        return (
          <ListItem
            key={note.id}
            disableGutters
            sx={{
              alignItems: "flex-start",
              borderBottom: "1px solid",
              borderColor: "divider",
              py: 1.5,
              "&:hover .note-actions": { opacity: 1 },
            }}
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {note.title}
              </Typography>
              {note.content && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                >
                  {note.content}
                </Typography>
              )}

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, alignItems: "center" }}>
                {note.categories.map((c) => (
                  <Chip
                    key={c.id}
                    label={c.name}
                    size="small"
                    onDelete={() => onRemoveCategory(note.id, c.id)}
                    sx={{ bgcolor: "primary.50" }}
                  />
                ))}

                {availableToAdd.length > 0 && (
                  <Tooltip title="Agregar categoría">
                    <IconButton size="small" onClick={(e) => openAddCategoryMenu(e, note.id)}>
                      <AddCircleOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </Box>

            <Box className="note-actions" sx={{ display: "flex", gap: 0.25, opacity: 0, transition: "opacity 0.1s" }}>
              <Tooltip title="Editar">
                <IconButton size="small" onClick={() => onEdit(note)}>
                  <EditOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              {note.archived ? (
                <Tooltip title="Desarchivar">
                  <IconButton size="small" color="success" onClick={() => onUnarchive(note.id)}>
                    <UnarchiveOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              ) : (
                <Tooltip title="Archivar">
                  <IconButton size="small" onClick={() => onArchive(note.id)}>
                    <ArchiveOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title="Borrar">
                <IconButton size="small" color="error" onClick={() => onDelete(note.id)}>
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </ListItem>
        );
      })}

      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeAddCategoryMenu}>
        {menuNoteId !== null &&
          allCategories
            .filter((c) => !notes.find((n) => n.id === menuNoteId)?.categories.some((nc) => nc.id === c.id))
            .map((c) => (
              <MenuItem
                key={c.id}
                onClick={() => {
                  onAddCategory(menuNoteId, c.id);
                  closeAddCategoryMenu();
                }}
              >
                {c.name}
              </MenuItem>
            ))}
      </Menu>
    </List>
  );
}
