export interface Conversation {
  id: number;
  user_name: string;
  question: string;
  answer: string | null;
  created_at: string;
}
