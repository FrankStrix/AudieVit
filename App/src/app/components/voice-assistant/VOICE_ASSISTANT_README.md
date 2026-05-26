# Voice Assistant Module

A local voice recognition and response system built with Angular, TensorFlow.js, and Web Audio API. This module enables desktop application users to interact via voice commands with AI-powered intent recognition and text-to-speech responses.

## Features

- **🎤 Real-time Audio Capture**: Uses Web Audio API for browser-based microphone access
- **🧠 Intent Classification**: TensorFlow.js-based speech command recognition
- **💬 Intelligent Responses**: Dynamic response generation based on detected intents
- **🔊 Text-to-Speech**: Native browser SpeechSynthesis API for audio output
- **📊 Audio Visualization**: Real-time frequency spectrum display during recording
- **⚡ Completely Local**: All processing happens in the browser—no cloud dependencies

## Architecture

### Services

#### `AudioService`
Manages microphone recording and audio capture:
- `startRecording()`: Request microphone permissions and begin capturing
- `stopRecording()`: Stop recording and return audio buffer
- `frequencyData$`: Observable of real-time frequency data for visualization
- `isRecording$`: Observable tracking recording state

#### `IntentClassificationService`
Uses TensorFlow.js for speech command classification:
- Loads pre-trained speech-commands model
- Classifies recorded audio into intents (greeting, question, command, thanks, unknown)
- Returns predictions with confidence scores
- Fallback to simple classification if model fails

#### `ResponseGenerationService`
Maps intents to contextual responses:
- Rule-based response mapping
- Random selection from response pools
- Easily extensible for custom intents and responses

#### `TextToSpeechService`
Handles voice output:
- Uses browser SpeechSynthesis API
- Supports rate control and voice selection
- `speak(text, rate)`: Speaks the provided text
- `isSpeaking$`: Observable tracking speech state

### Component

#### `VoiceAssistantComponent`
Main UI component orchestrating the voice interaction flow:
- Start/Stop listening controls
- Real-time audio visualization (canvas-based frequency display)
- Intent detection and confidence display
- Generated response display
- Audio playback status
- Error handling and user feedback

## Setup & Installation

### 1. Install Dependencies

```bash
npm install
```

This installs TensorFlow.js and the speech-commands model automatically.

### 2. Enable in App Routes

The voice assistant is already routed at `/voice` by default. The root path redirects to it.

### 3. Run the App

```bash
npm start
```

Navigate to `http://localhost:1420` (or your configured Tauri dev URL).

## Usage

1. **Start Listening**: Click the "Start Listening" button
   - Microphone permission will be requested (browser-dependent)
   - Red recording indicator and frequency visualization appear
2. **Speak**: Say a command or phrase
3. **Stop Listening**: Click "Stop Listening" or wait for auto-stop
4. **AI Processing**: 
   - Intent is classified using TensorFlow.js
   - Confidence score is displayed
   - Contextual response is generated
5. **Audio Response**: Response is spoken aloud using browser TTS

## Intents Supported

Current default intents:
- `greeting`: "hello", "hi", "hey"
- `question`: Questions or requests for information
- `command`: Action-oriented requests
- `thanks`: Gratitude expressions
- `unknown`: Unrecognized or low-confidence inputs

## Customization

### Add Custom Responses

```typescript
// In your component or service
constructor(private responseService: ResponseGenerationService) {
  this.responseService.addCustomResponse('greeting', 'Hey there! How can I assist?');
}
```

### Adjust TTS Rate

In the component's `processAudio` method:
```typescript
await this.ttsService.speak(response.text, 1.2); // 1.2x speed
```

### Add Custom Intent Mapping

Extend the `responseMap` in `ResponseGenerationService`:
```typescript
private responseMap: Record<string, string[]> = {
  'custom_intent': [
    'Response 1',
    'Response 2',
    'Response 3'
  ],
  // ... existing intents
};
```

## Browser Compatibility

Required APIs:
- **Web Audio API**: For microphone access and audio processing
- **SpeechSynthesis API**: For text-to-speech
- **TensorFlow.js**: For neural network inference

Tested on:
- Chrome/Chromium 90+
- Firefox 88+
- Edge 90+

Safari has limited SpeechSynthesis support.

## Performance Notes

- **Audio Recording**: ~4KB/second (mono, 16kHz)
- **Model Loading**: ~2-3 seconds on first load (cached thereafter)
- **Inference Time**: ~100-300ms per audio clip
- **TTS Latency**: Varies by browser and text length

## Troubleshooting

### Microphone Access Denied
- Check browser permissions (Settings > Privacy > Microphone)
- Ensure HTTPS in production (required by getUserMedia)
- Try a different browser

### Model Not Loading
- Check browser console for TensorFlow errors
- Verify network connectivity (model files must download)
- Clear browser cache and reload

### No Audio Output
- Check system volume and browser volume settings
- Verify SpeechSynthesis support in your browser
- Check browser console for errors

## Future Enhancements

- [ ] Custom wake-word detection
- [ ] Multi-language support
- [ ] User intent history/logging
- [ ] Integration with Tauri backend for extended AI capabilities
- [ ] Voice profile customization
- [ ] Offline model persistence

## Files Structure

```
src/app/
├── components/
│   └── voice-assistant/
│       ├── voice-assistant.component.ts
│       ├── voice-assistant.component.html
│       └── voice-assistant.component.css
└── services/
    ├── audio.service.ts
    ├── intent-classification.service.ts
    ├── response-generation.service.ts
    └── text-to-speech.service.ts
```

## License

Part of AudieVit project.
