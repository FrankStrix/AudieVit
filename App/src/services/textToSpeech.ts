import { detectLanguage } from './language';
import type { LangInfo } from './language';

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

export function speak(text: string, lang?: LangInfo): Promise<void> {
  const clean = sanitize(text);
  if (!clean) return Promise.resolve();

  const ttsLang = lang || detectLanguage(clean);

  return new Promise((resolve) => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = ttsLang.tts;
    utterance.rate = 1;
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();

    setTimeout(() => {
      speechSynthesis.speak(utterance);
    }, 30);
  });
}

export function stopSpeaking(): void {
  speechSynthesis.cancel();
}
