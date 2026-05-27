import { Component } from '@angular/core';

export interface DocSection {
  id: string;
  label: string;
  children?: DocSection[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class SidebarComponent {
  sections: DocSection[] = [
    {
      id: 'getting-started',
      label: 'Getting Started',
      children: [
        { id: 'installation', label: 'Installation' },
        { id: 'quick-start', label: 'Quick Start' },
      ],
    },
    {
      id: 'voice-recognition',
      label: 'Voice Recognition',
      children: [
        { id: 'how-it-works', label: 'How It Works' },
        { id: 'tensorflow-setup', label: 'TensorFlow Setup' },
        { id: 'commands', label: 'Commands' },
      ],
    },
    {
      id: 'api',
      label: 'API Reference',
      children: [
        { id: 'audio-service', label: 'Audio Service' },
        { id: 'classifier', label: 'Classifier' },
        { id: 'tts', label: 'Text To Speech' },
      ],
    },
  ];

  scrollTo(id: string) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
}
