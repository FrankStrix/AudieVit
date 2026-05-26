import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TextToSpeechService {
  private isSpeakingSubject = new BehaviorSubject<boolean>(false);
  isSpeaking$ = this.isSpeakingSubject.asObservable();

  private synth = window.speechSynthesis;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {}

  speak(text: string, rate: number = 1): Promise<void> {
    return new Promise((resolve, reject) => {
      // Cancel any ongoing speech
      this.synth.cancel();

      try {
        this.currentUtterance = new SpeechSynthesisUtterance(text);
        this.currentUtterance.rate = rate;
        this.currentUtterance.pitch = 1;
        this.currentUtterance.volume = 1;

        this.currentUtterance.onstart = () => {
          this.isSpeakingSubject.next(true);
        };

        this.currentUtterance.onend = () => {
          this.isSpeakingSubject.next(false);
          resolve();
        };

        this.currentUtterance.onerror = (error) => {
          this.isSpeakingSubject.next(false);
          reject(error);
        };

        this.synth.speak(this.currentUtterance);
      } catch (error) {
        reject(error);
      }
    });
  }

  stop(): void {
    this.synth.cancel();
    this.isSpeakingSubject.next(false);
  }

  isSpeakingSupported(): boolean {
    return 'speechSynthesis' in window;
  }

  getVoices(): SpeechSynthesisVoice[] {
    return this.synth.getVoices();
  }
}
