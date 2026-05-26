import { Injectable } from '@angular/core';

export interface Response {
  text: string;
  intent: string;
}

@Injectable({
  providedIn: 'root'
})
export class ResponseGenerationService {
  private responseMap: Record<string, string[]> = {
    greeting: [
      'Hello! How can I help you?',
      'Hi there! What can I do for you?',
      'Hello! Nice to meet you.',
    ],
    question: [
      'That\'s an interesting question. Let me think about it.',
      'Great question! I\'m happy to help.',
      'I understand. Let me provide you with an answer.',
    ],
    thanks: [
      'You\'re welcome!',
      'Happy to help!',
      'My pleasure!',
    ],
    command: [
      'I\'m ready to help. What would you like me to do?',
      'Sure! I can help with that.',
      'Got it! Let me process that.',
    ],
    unknown: [
      'Sorry, I didn\'t quite understand that.',
      'Could you please repeat that?',
      'I\'m not sure what you mean. Could you rephrase?',
    ],
  };

  constructor() {}

  generateResponse(intent: string, confidence: number): Response {
    // Use the intent to select appropriate responses
    const responses = this.responseMap[intent] || this.responseMap['unknown'];
    
    // Select a random response
    const selectedResponse = responses[Math.floor(Math.random() * responses.length)];

    return {
      text: selectedResponse,
      intent: intent,
    };
  }

  // Add a custom response for a specific intent
  addCustomResponse(intent: string, response: string): void {
    if (!this.responseMap[intent]) {
      this.responseMap[intent] = [];
    }
    this.responseMap[intent].push(response);
  }
}
