import type { SpeechCommandRecognizer, SpeechCommandRecognizerResult } from '@tensorflow-models/speech-commands';

declare const speechCommands: {
  create: (type: string) => SpeechCommandRecognizer;
};

let recognizer: SpeechCommandRecognizer | null = null;

export async function loadModel(): Promise<string[]> {
  recognizer = speechCommands.create('BROWSER_FFT');
  await recognizer.ensureModelLoaded();
  return recognizer.wordLabels();
}

export async function startListening(
  onCommand: (word: string, confidence: number) => void,
): Promise<void> {
  if (!recognizer) throw new Error('Model not loaded yet');

  await recognizer.listen(async (result: SpeechCommandRecognizerResult) => {
    const scores: number[] = [];
    const raw = result.scores;
    const arr = Array.isArray(raw) ? raw[0] : raw;
    for (let i = 0; i < arr.length; i++) {
      scores.push(arr[i]);
    }
    const max = Math.max(...scores);
    const idx = scores.indexOf(max);
    const word = recognizer!.wordLabels()[idx];

    if (max > 0.6 && word !== '_background_noise_' && word !== 'unknown') {
      onCommand(word, max);
    }
  }, {
    probabilityThreshold: 0.6,
    overlapFactor: 0.5,
  });
}

export async function stopListening(): Promise<void> {
  if (recognizer) {
    await recognizer.stopListening();
  }
}
