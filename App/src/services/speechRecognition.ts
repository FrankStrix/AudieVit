type SpeechRecognitionCallbacks = {
  onFinal: (text: string) => void;
  onInterim: (text: string) => void;
};

let recognition: SpeechRecognition | null = null;
let callbacks: SpeechRecognitionCallbacks | null = null;
let isListening = false;

function getSpeechRecognition(): SpeechRecognition | null {
  const SpeechRecognitionAPI =
    (window as unknown as Record<string, unknown>).SpeechRecognition ??
    (window as unknown as Record<string, unknown>).webkitSpeechRecognition;

  if (!SpeechRecognitionAPI) return null;
  return new (SpeechRecognitionAPI as new () => SpeechRecognition)();
}

function setupRecognition(): SpeechRecognition | null {
  const instance = getSpeechRecognition();
  if (!instance) return null;

  instance.continuous = true;
  instance.interimResults = true;
  instance.lang = 'it-IT';

  instance.onresult = (event: SpeechRecognitionEvent) => {
    let interim = '';
    let final = '';

    for (let i = 0; i < event.results.length; i++) {
      const result = event.results[i];
      if (result.isFinal) {
        final += result[0].transcript;
      } else {
        interim += result[0].transcript;
      }
    }

    if (interim) {
      callbacks?.onInterim(interim.trim());
    }
    if (final) {
      const text = final.trim();
      if (text) {
        callbacks?.onFinal(text);
      }
    }
  };

  instance.onerror = (event: SpeechRecognitionErrorEvent) => {
    if (event.error === 'no-speech' || event.error === 'aborted') return;
    isListening = false;
  };

  instance.onend = () => {
    if (isListening && recognition) {
      setTimeout(() => {
        if (isListening && recognition) {
          try {
            recognition.start();
          } catch {
            isListening = false;
          }
        }
      }, 200);
    }
  };

  return instance;
}

export function startListening(cbs: SpeechRecognitionCallbacks): void {
  if (isListening) return;

  const instance = setupRecognition();
  if (!instance) return;

  recognition = instance;
  callbacks = cbs;
  isListening = true;

  try {
    recognition.start();
  } catch {
    isListening = false;
  }
}

export function stopListening(): void {
  isListening = false;
  callbacks = null;
  if (recognition) {
    try {
      recognition.stop();
    } catch {
      // ignore
    }
    recognition = null;
  }
}
