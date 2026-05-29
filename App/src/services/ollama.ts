import { detectLanguage } from './language';

export async function generateResponse(
  question: string,
  onChunk?: (fullText: string) => void,
  history?: { role: string; content: string }[],
): Promise<string> {
  const lang = await detectLanguage(question);
  const prompt = buildPrompt(question, history);

  const res = await fetch('/api/ollama/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'qwen2.5:3b',
      prompt,
      system: `Rispondi in ${lang.name}. Sii conciso, risposte brevi ma giuste. sappi che la data e ora attuali sono: ${new Date().toLocaleString('it-IT', { timeZone: 'Europe/Rome', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })} (ora italiana).`,
      stream: true,
    }),
  });

  if (!res.ok) {
    throw new Error(`Ollama error: ${res.status} ${res.statusText}`);
  }

  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let fullResponse = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split('\n').filter(Boolean);

    for (const line of lines) {
      const data = JSON.parse(line);
      if (data.response) {
        fullResponse += data.response;
        onChunk?.(fullResponse);
      }
    }
  }

  return fullResponse.trim();
}

function buildPrompt(question: string, history?: { role: string; content: string }[]): string {
  if (!history || history.length === 0) return question;

  const userMessages = history
    .filter((m) => m.role === 'user')
    .slice(-3)
    .map((m) => m.content);

  if (userMessages.length === 0) return question;

  const context = userMessages.join(' → ');
  return `Domande precedenti: ${context}\n\nNuova domanda: ${question}`;
}
