type SpeechRecognitionCallback = (text: string) => void;

let recognition: SpeechRecognition | null = null;
let onResultCallback: SpeechRecognitionCallback | null = null;
let isListening = false;

function getSpeechRecognition(): SpeechRecognition | null {
  const SpeechRecognitionAPI =
    (window as unknown as Record<string, unknown>).SpeechRecognition ??
    (window as unknown as Record<string, unknown>).webkitSpeechRecognition;

  if (!SpeechRecognitionAPI) return null;
  return new (SpeechRecognitionAPI as new () => SpeechRecognition)();
}

export function startListening(onResult: SpeechRecognitionCallback): void {
  if (isListening) return;

  const instance = getSpeechRecognition();
  if (!instance) {
    console.warn('SpeechRecognition not supported in this browser');
    return;
  }

  recognition = instance;
  onResultCallback = onResult;
  isListening = true;

  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.lang = 'it-IT';

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    const last = event.results[event.results.length - 1];
    if (last.isFinal) {
      const transcript = last[0].transcript.trim();
      if (transcript) {
        onResultCallback?.(transcript);
      }
    }
  };

  recognition.onerror = () => {
    isListening = false;
  };

  recognition.onend = () => {
    if (isListening && recognition) {
      try {
        recognition.start();
      } catch {
        isListening = false;
      }
    }
  };

  try {
    recognition.start();
  } catch {
    isListening = false;
  }
}

export function stopListening(): void {
  isListening = false;
  onResultCallback = null;
  if (recognition) {
    try {
      recognition.stop();
    } catch {
      // ignore
    }
    recognition = null;
  }
}
