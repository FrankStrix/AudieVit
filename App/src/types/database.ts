export interface Conversation {
  id: number;
  orario: string;
  domanda: string;
  risposta_prima_parte: string | null;
}
