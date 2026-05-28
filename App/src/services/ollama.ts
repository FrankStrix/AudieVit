import { detectLanguage } from './language';

export async function generateResponse(
  question: string,
  onChunk?: (fullText: string) => void,
  history?: { role: string; content: string }[],
): Promise<string> {
  const lang = detectLanguage(question);
  const prompt = buildPrompt(question, history);

  const res = await fetch('/api/ollama/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama2',
      prompt,
      system: `Rispondi sempre in ${lang.name}. Sii conciso, risposte brevi ma giuste.`,
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

  const lines = history.map((m) => {
    return `${m.content}`;
  });
  lines.push(`Utente: ${question}`);
  return lines.join('\n\n');
}
