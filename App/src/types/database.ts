export interface Message {
  id: number;
  session_id: number;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface Session {
  id: number;
  created_at: string;
  preview: string;
}
