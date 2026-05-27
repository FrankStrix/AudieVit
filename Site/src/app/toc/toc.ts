import { Component } from '@angular/core';

export interface TocItem {
  id: string;
  label: string;
}

@Component({
  selector: 'app-toc',
  standalone: true,
  templateUrl: './toc.html',
  styleUrl: './toc.scss',
})
export class TocComponent {
  items: TocItem[] = [
    { id: 'installation', label: 'Installation' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'commands', label: 'Supported Commands' },
    { id: 'classifier', label: 'Classifier API' },
    { id: 'tts', label: 'Speech Synthesis' },
  ];

  scrollTo(id: string) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
}
