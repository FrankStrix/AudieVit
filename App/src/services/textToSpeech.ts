import { detectLanguage } from './language';

function sanitize(text: string): string {
  return text
    .replace(/&egrave;/g, 'è')
    .replace(/&agrave;/g, 'à')
    .replace(/&ograve;/g, 'ò')
    .replace(/&ugrave;/g, 'ù')
    .replace(/&igrave;/g, 'ì')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, 'e')
    .replace(/&lt;/g, ' ')
    .replace(/&gt;/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#\d+;/g, ' ')
    .replace(/[`*_#~>{}\[\]()|\\]/g, ' ')
    .replace(/:\w+:/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export function speak(text: string): Promise<void> {
  const clean = sanitize(text);
  const lang = detectLanguage(clean);
  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = lang.tts;
    utterance.rate = 1;
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    speechSynthesis.speak(utterance);
  });
}

export function stopSpeaking(): void {
  speechSynthesis.cancel();
}
