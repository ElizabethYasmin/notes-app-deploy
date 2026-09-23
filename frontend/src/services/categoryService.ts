import type { Category } from "../types/Note";

const API_URL = import.meta.env.VITE_API_URL;

export const categoryService = {
  listAll: (): Promise<Category[]> =>
    fetch(`${API_URL}/categories`).then((r) => r.json()),

  create: (name: string): Promise<Category> =>
    fetch(`${API_URL}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    }).then((r) => r.json()),

  update: (id: number, name: string): Promise<Category> =>
    fetch(`${API_URL}/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    }).then((r) => r.json()),

  remove: (id: number): Promise<void> =>
    fetch(`${API_URL}/categories/${id}`, { method: "DELETE" }).then(() => undefined),
};
