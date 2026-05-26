import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface AudioBuffer {
  data: Float32Array;
  sampleRate: number;
}

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private microphone: MediaStreamAudioSourceNode | null = null;
  private scriptProcessor: ScriptProcessorNode | null = null;
  private recordedChunks: Float32Array[] = [];
  
  private isRecordingSubject = new BehaviorSubject<boolean>(false);
  isRecording$ = this.isRecordingSubject.asObservable();
  
  private frequencyDataSubject = new BehaviorSubject<Uint8Array>(new Uint8Array(0));
  frequencyData$ = this.frequencyDataSubject.asObservable();
  
  private transcriptSubject = new BehaviorSubject<string>('');
  transcript$ = this.transcriptSubject.asObservable();

  constructor() {}

  async startRecording(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Initialize audio context if not already done
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      // Create microphone source
      if (!this.microphone) {
        this.microphone = this.audioContext.createMediaStreamSource(stream);
      }

      // Create analyser for visualization
      if (!this.analyser) {
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 256;
      }
      
      this.microphone.connect(this.analyser);

      // Create script processor for raw audio data
      const bufferSize = 4096;
      this.scriptProcessor = this.audioContext.createScriptProcessor(bufferSize, 1, 1);
      
      this.scriptProcessor.onaudioprocess = (event: AudioProcessingEvent) => {
        const inputData = event.inputBuffer.getChannelData(0);
        // Store the audio data for later processing
        this.recordedChunks.push(new Float32Array(inputData));
      };

      this.analyser.connect(this.scriptProcessor);
      this.scriptProcessor.connect(this.audioContext.destination);

      this.isRecordingSubject.next(true);
      this.recordedChunks = [];
      
      // Start visualization loop
      this.visualize();
    } catch (error) {
      console.error('Error accessing microphone:', error);
      throw error;
    }
  }

  stopRecording(): AudioBuffer {
    if (!this.scriptProcessor || !this.audioContext) {
      throw new Error('Recording was not started');
    }

    this.isRecordingSubject.next(false);
    
    // Combine all recorded chunks into a single buffer
    const totalLength = this.recordedChunks.reduce((sum, chunk) => sum + chunk.length, 0);
    const audioBuffer = new Float32Array(totalLength);
    
    let offset = 0;
    for (const chunk of this.recordedChunks) {
      audioBuffer.set(chunk, offset);
      offset += chunk.length;
    }

    const sampleRate = this.audioContext.sampleRate;
    
    return {
      data: audioBuffer,
      sampleRate
    };
  }

  setTranscript(text: string): void {
    this.transcriptSubject.next(text);
  }

  getTranscript(): string {
    return this.transcriptSubject.value;
  }

  private visualize(): void {
    if (!this.isRecordingSubject.value || !this.analyser) {
      return;
    }

    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);
    this.frequencyDataSubject.next(dataArray);

    requestAnimationFrame(() => this.visualize());
  }

  cleanup(): void {
    if (this.scriptProcessor) {
      this.scriptProcessor.disconnect();
    }
    if (this.analyser) {
      this.analyser.disconnect();
    }
    if (this.microphone) {
      this.microphone.disconnect();
    }
  }
}
