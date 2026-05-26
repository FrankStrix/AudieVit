import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioService } from '../../services/audio.service';
import { IntentClassificationService } from '../../services/intent-classification.service';
import { ResponseGenerationService } from '../../services/response-generation.service';
import { TextToSpeechService } from '../../services/text-to-speech.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-voice-assistant',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './voice-assistant.component.html',
  styleUrl: './voice-assistant.component.css'
})
export class VoiceAssistantComponent implements OnInit, OnDestroy {
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;

  isRecording$!: any;
  transcript$!: any;
  frequencyData$!: any;
  isModelLoaded$!: any;
  isSpeaking$!: any;

  error: string | null = null;
  responseText: string = '';
  intent: string = '';
  confidence: number = 0;
  isProcessing: boolean = false;

  private destroy$ = new Subject<void>();
  private canvasContext: CanvasRenderingContext2D | null = null;

  constructor(
    private audioService: AudioService,
    private intentService: IntentClassificationService,
    private responseService: ResponseGenerationService,
    private ttsService: TextToSpeechService
  ) {}

  ngOnInit(): void {
    this.isRecording$ = this.audioService.isRecording$;
    this.transcript$ = this.audioService.transcript$;
    this.frequencyData$ = this.audioService.frequencyData$;
    this.isModelLoaded$ = this.intentService.isModelLoaded$;
    this.isSpeaking$ = this.ttsService.isSpeaking$;

    // Subscribe to frequency data for visualization
    this.frequencyData$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: Uint8Array) => {
        if (this.canvas) {
          this.drawVisualization(data);
        }
      });
  }

  async startListening(): Promise<void> {
    try {
      this.error = null;
      this.responseText = '';
      this.intent = '';
      this.confidence = 0;
      await this.audioService.startRecording();
    } catch (err) {
      this.error = 'Failed to access microphone. Please check permissions and try again.';
      console.error(err);
    }
  }

  stopListening(): void {
    try {
      const audioBuffer = this.audioService.stopRecording();
      console.log('Recording stopped. Processing audio...');
      this.processAudio(audioBuffer);
    } catch (err) {
      this.error = 'Error stopping recording. Please try again.';
      console.error(err);
    }
  }

  stopSpeaking(): void {
    this.ttsService.stop();
  }

  private async processAudio(audioBuffer: { data: Float32Array; sampleRate: number }): Promise<void> {
    this.isProcessing = true;
    this.error = null;

    try {
      // Validate audio buffer
      if (!audioBuffer.data || audioBuffer.data.length === 0) {
        throw new Error('No audio data captured');
      }

      console.log(`Processing ${audioBuffer.data.length} samples at ${audioBuffer.sampleRate} Hz`);

      // Step 1: Classify the audio intent
      const prediction = await this.intentService.classifyAudio(audioBuffer);
      this.intent = prediction.intent;
      this.confidence = prediction.confidence;

      console.log(`Detected intent: ${prediction.intent} (${(prediction.confidence * 100).toFixed(1)}%)`);

      // Step 2: Generate a response based on the intent
      const response = this.responseService.generateResponse(prediction.intent, prediction.confidence);
      this.responseText = response.text;

      console.log(`Generated response: ${response.text}`);

      // Step 3: Speak the response
      if (this.ttsService.isSpeakingSupported()) {
        await this.ttsService.speak(response.text, 0.9);
      } else {
        this.error = 'Text-to-speech is not supported in your browser.';
      }
    } catch (err) {
      this.error = `Error processing audio: ${err instanceof Error ? err.message : 'Unknown error'}. Please try again.`;
      console.error(err);
    } finally {
      this.isProcessing = false;
    }
  }

  private drawVisualization(frequencyData: Uint8Array): void {
    if (!this.canvas) return;

    const canvas = this.canvas.nativeElement;
    if (!this.canvasContext) {
      this.canvasContext = canvas.getContext('2d');
      if (!this.canvasContext) return;
    }

    const ctx = this.canvasContext;
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, width, height);

    // Draw frequency bars
    const barWidth = width / frequencyData.length;
    ctx.fillStyle = '#4CAF50';

    for (let i = 0; i < frequencyData.length; i++) {
      const barHeight = (frequencyData[i] / 255) * height;
      ctx.fillRect(i * barWidth, height - barHeight, barWidth - 1, barHeight);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.audioService.cleanup();
  }
}
