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
    { id: 'intro', label: 'Introduzione' },
    { id: 'installazione', label: 'Installazione' },
    { id: 'guida-uso', label: 'Guida all\'uso' },
    { id: 'architettura', label: 'Architettura' },
    { id: 'api-reference', label: 'API Reference' },
    { id: 'sviluppo', label: 'Sviluppo' },
    { id: 'faq', label: 'FAQ' },
    { id: 'riferimenti', label: 'Riferimenti' },
  ];

  scrollTo(id: string) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
}
