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
      id: 'intro',
      label: 'Introduzione',
    },
    {
      id: 'installazione',
      label: 'Installazione',
      children: [
        { id: 'prerequisiti', label: 'Prerequisiti' },
        { id: 'installare-ollama', label: 'Installare Ollama' },
        { id: 'scaricare-audievit', label: 'Scaricare AudieVit' },
        { id: 'configurare-avviare', label: 'Configurare e avviare' },
        { id: 'build-produzione', label: 'Build di produzione' },
      ],
    },
    {
      id: 'guida-uso',
      label: 'Guida all\'uso',
      children: [
        { id: 'prima-schermata', label: 'Prima schermata' },
        { id: 'iniziare-conversazione', label: 'Iniziare conversazione' },
        { id: 'riconoscimento-vocale', label: 'Riconoscimento vocale' },
        { id: 'risposte-ai', label: 'Risposte AI' },
        { id: 'sintesi-vocale', label: 'Sintesi vocale' },
        { id: 'gestione-sessioni', label: 'Gestione sessioni' },
        { id: 'rilevamento-lingua', label: 'Rilevamento lingua' },
      ],
    },
    {
      id: 'architettura',
      label: 'Architettura',
      children: [
        { id: 'architettura-panoramica', label: 'Panoramica' },
        { id: 'frontend', label: 'Frontend' },
        { id: 'servizi', label: 'Servizi' },
        { id: 'servizio-speechrecognition', label: 'SpeechRecognition' },
        { id: 'servizio-ollama', label: 'Ollama' },
        { id: 'servizio-tts', label: 'TextToSpeech' },
        { id: 'servizio-lingua', label: 'Language' },
        { id: 'servizio-database', label: 'Database' },
        { id: 'componenti', label: 'Componenti' },
        { id: 'proxy-networking', label: 'Proxy e networking' },
        { id: 'persistenza-dati', label: 'Persistenza dati' },
      ],
    },
    {
      id: 'api-reference',
      label: 'API Reference',
      children: [
        { id: 'api-speechrecognition', label: 'speechRecognition' },
        { id: 'api-ollama', label: 'ollama' },
        { id: 'api-tts', label: 'textToSpeech' },
        { id: 'api-lingua', label: 'language' },
        { id: 'api-database', label: 'database' },
      ],
    },
    {
      id: 'sviluppo',
      label: 'Sviluppo',
      children: [
        { id: 'struttura-progetto', label: 'Struttura progetto' },
        { id: 'script-npm', label: 'Script npm' },
        { id: 'estendere', label: 'Estendere AudieVit' },
      ],
    },
    {
      id: 'faq',
      label: 'FAQ',
      children: [
        { id: 'faq-microfono', label: 'Microfono' },
        { id: 'faq-ollama', label: 'Ollama' },
        { id: 'faq-tts', label: 'Sintesi vocale' },
        { id: 'faq-database', label: 'Database' },
        { id: 'faq-altro', label: 'Altro' },
      ],
    },
    {
      id: 'riferimenti',
      label: 'Riferimenti',
    },
  ];

  scrollTo(id: string) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
}
