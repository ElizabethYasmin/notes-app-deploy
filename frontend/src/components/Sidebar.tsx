import { useState } from "react";
import { NavLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import NoteAltOutlinedIcon from "@mui/icons-material/NoteAltOutlined";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AddIcon from "@mui/icons-material/Add";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
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
    <Box
      component="aside"
      sx={{
        width: 240,
        flexShrink: 0,
        bgcolor: "grey.50",
        borderRight: "1px solid",
        borderColor: "divider",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 2, py: 2.5 }}>
        <NoteAltOutlinedIcon color="primary" />
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Mis Notas
        </Typography>
      </Box>

      <Box sx={{ px: 1, flex: 1, overflowY: "auto" }}>
        <Typography variant="caption" sx={{ px: 1, color: "text.secondary", fontWeight: 700 }}>
          NOTAS
        </Typography>
        <List dense disablePadding sx={{ mb: 2 }}>
          <ListItemButton component={NavLink} to="/notes" end sx={navLinkStyles}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <InboxOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Activas" />
          </ListItemButton>
          <ListItemButton component={NavLink} to="/notes/archived" sx={navLinkStyles}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <ArchiveOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Archivadas" />
          </ListItemButton>
        </List>

        <Typography variant="caption" sx={{ px: 1, color: "text.secondary", fontWeight: 700 }}>
          CATEGORÍAS
        </Typography>
        <List dense disablePadding>
          <ListItemButton
            selected={categoryFilter === undefined}
            onClick={() => onCategoryFilterChange(undefined)}
            sx={{ borderRadius: 1 }}
          >
            <ListItemIcon sx={{ minWidth: 32 }}>
              <LabelOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Todas" />
          </ListItemButton>

          {categories.map((c) =>
            editingId === c.id ? (
              <Box key={c.id} component="form" sx={{ px: 1, py: 0.5 }} onSubmit={(e) => { e.preventDefault(); confirmEdit(); }}>
                <TextField
                  autoFocus
                  size="small"
                  fullWidth
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onBlur={confirmEdit}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") setEditingId(null);
                  }}
                />
              </Box>
            ) : (
              <ListItemButton
                key={c.id}
                selected={categoryFilter === c.id}
                onClick={() => onCategoryFilterChange(c.id)}
                sx={{ borderRadius: 1, "&:hover .category-actions": { opacity: 1 } }}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <LabelOutlinedIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={c.name}
                  slotProps={{ primary: { noWrap: true } }}
                />
                <Box className="category-actions" sx={{ display: "flex", opacity: 0, transition: "opacity 0.1s" }}>
                  <IconButton
                    size="small"
                    title="Editar categoría"
                    onClick={(e) => {
                      e.stopPropagation();
                      startEdit(c);
                    }}
                  >
                    <EditOutlinedIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                  <IconButton
                    size="small"
                    title="Borrar categoría"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteCategory(c.id);
                    }}
                  >
                    <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>
              </ListItemButton>
            )
          )}
        </List>

        <Box component="form" onSubmit={onCreateCategory} sx={{ display: "flex", gap: 0.5, px: 1, mt: 1 }}>
          <TextField
            size="small"
            fullWidth
            placeholder="Nueva categoría"
            value={newCategoryName}
            onChange={(e) => onNewCategoryNameChange(e.target.value)}
          />
          <IconButton type="submit" size="small" color="primary">
            <AddIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <Divider />
      <List dense disablePadding sx={{ p: 1 }}>
        <ListItemButton onClick={onLogout} sx={{ borderRadius: 1 }}>
          <ListItemIcon sx={{ minWidth: 32 }}>
            <LogoutOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Cerrar sesión" />
        </ListItemButton>
      </List>
    </Box>
  );
}

const navLinkStyles = {
  borderRadius: 1,
  "&.active": {
    bgcolor: "action.selected",
    fontWeight: 600,
  },
};
