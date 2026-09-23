import type { Category } from "../types/Note";
import { authFetch } from "./http";

const API_URL = import.meta.env.VITE_API_URL;

export const categoryService = {
  listAll: (): Promise<Category[]> =>
    authFetch(`${API_URL}/categories`).then((r) => r.json()),

  create: (name: string): Promise<Category> =>
    authFetch(`${API_URL}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    }).then((r) => r.json()),

  update: (id: number, name: string): Promise<Category> =>
    authFetch(`${API_URL}/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    }).then((r) => r.json()),

  remove: (id: number): Promise<void> =>
    authFetch(`${API_URL}/categories/${id}`, { method: "DELETE" }).then(() => undefined),
};
