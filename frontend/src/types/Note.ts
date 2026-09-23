export interface Category {
  id: number;
  name: string;
}

export interface Note {
  id: number;
  title: string;
  content: string;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
  categories: Category[];
}

export interface NoteRequest {
  title: string;
  content: string;
  categoryIds?: number[];
}
