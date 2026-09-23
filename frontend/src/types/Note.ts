export interface Note {
  id: number;
  title: string;
  content: string;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NoteRequest {
  title: string;
  content: string;
}
