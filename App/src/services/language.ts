type LangInfo = {
  code: string;
  name: string;
  tts: string;
};

const languages: [string, LangInfo, RegExp][] = [
  [
    'it',
    { code: 'it', name: 'italiano', tts: 'it-IT' },
    /[àèéìòù]|(\b(il|la|le|gli|che|per|con|una|uno|sono|hai|nel|dei|della|dell|alla|nelle|sugli|dagli|degli|quest[ao]|quell[ao]|cosa|come|dove|quando|perché|molto|posso|devo|puoi|voglio|fammi|dimmi|bene|male|grazie|ciao|salve|buongiorno|buonasera|arrivederci|prego|scusa|scusi|mi|ti|si|ci|vi|loro|questo|quello|parla|parlare|capire|sentire|aiutare|italian[oa])\b)/i,
  ],
  [
    'fr',
    { code: 'fr', name: 'francese', tts: 'fr-FR' },
    /[àâçéèêëîïôûùü]|(\b(le|la|les|des|du|une|dans|avec|pour|sur|est|sont|ce|cet|cette|ces|que|qui|quoi|comment|pourquoi|français|parle|bonjour|merci|oui|non|très|faire|dire|vouloir|pouvoir|devoir)\b)/i,
  ],
  [
    'es',
    { code: 'es', name: 'spagnolo', tts: 'es-ES' },
    /[áéíóúñü]|(\b(el|la|los|las|un|una|con|por|para|del|es|son|este|esta|ese|esa|qué|quién|cómo|dónde|porqué|hablar|decir|querer|poder|deber|mucho|español|hola|gracias|sí|no|muy)\b)/i,
  ],
  [
    'de',
    { code: 'de', name: 'tedesco', tts: 'de-DE' },
    /[äöüß]|(\b(der|die|das|den|dem|des|ein|eine|einen|mit|und|oder|aber|ist|sind|nicht|kein|was|wer|wie|wo|warum|deutsch|sprechen|sagen|wollen|können|müssen|sehr|bitte|danke|ja|nein|hallo)\b)/i,
  ],
];

const defaultLang: LangInfo = { code: 'en', name: 'inglese', tts: 'en-US' };

export function detectLanguage(text: string): LangInfo {
  const clean = text.toLowerCase();
  for (const [, info, pattern] of languages) {
    if (pattern.test(clean)) return info;
  }
  return defaultLang;
}
