import type { Note, NoteRequest } from "../types/Note";

const API_URL = import.meta.env.VITE_API_URL;

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    throw new Error(`Error ${res.status}: ${res.statusText}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const noteService = {

  listActive: (categoryId?: number): Promise<Note[]> => {
    const query = categoryId ? `?categoryId=${categoryId}` : "";
    return fetch(`${API_URL}/notes/active${query}`).then((r) => handleResponse<Note[]>(r));
  },

  listArchived: (categoryId?: number): Promise<Note[]> => {
    const query = categoryId ? `?categoryId=${categoryId}` : "";
    return fetch(`${API_URL}/notes/archived${query}`).then((r) => handleResponse<Note[]>(r));
  },

  create: (data: NoteRequest): Promise<Note> =>
    fetch(`${API_URL}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => handleResponse<Note>(r)),

  update: (id: number, data: NoteRequest): Promise<Note> =>
    fetch(`${API_URL}/notes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => handleResponse<Note>(r)),

  remove: (id: number): Promise<void> =>
    fetch(`${API_URL}/notes/${id}`, { method: "DELETE" }).then((r) =>
      handleResponse<void>(r)
    ),

  archive: (id: number): Promise<Note> =>
    fetch(`${API_URL}/notes/${id}/archive`, { method: "PATCH" }).then((r) =>
      handleResponse<Note>(r)
    ),

  unarchive: (id: number): Promise<Note> =>
    fetch(`${API_URL}/notes/${id}/unarchive`, { method: "PATCH" }).then((r) =>
      handleResponse<Note>(r)
    ),

};
