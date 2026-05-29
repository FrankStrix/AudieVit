export type LangInfo = {
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

const defaultLang: LangInfo = { code: 'it', name: 'italiano', tts: 'it-IT' };

const englishPattern = /\b(the|an|is|are|was|were|be|been|have|has|had|do|does|did|will|would|can|could|shall|should|may|might|this|that|these|those|you|he|she|it|we|they|my|your|his|her|its|our|their|what|which|who|whom|when|where|why|how|and|but|or|nor|for|so|yet|all|each|every|both|few|some|any|not|very|too|really|please|thank|hello|hi|yes|good|well|great|nice|fine|sure|okay|right|wrong|true|false|morning|afternoon|evening|night|today|tomorrow|yesterday|now|then|here|there|always|never|often|sometimes|everyone|everything|nothing|something|people|time|day|year|week|month|hour|world|life|work|home|place|city|country|name|number|question|answer|problem|idea|example|friend|family|child|man|woman|boy|girl|love|hate|like|want|need|get|give|take|make|say|go|see|know|think|feel|find|show|tell|ask|help|work|play|live|eat|drink|sleep|run|walk|stop|start|finish|open|close|turn|try|hope|wish|believe|understand|remember|forget|mean|seem|look|sound|big|small|long|short|high|low|old|new|hot|cold|warm|cool|dark|light|fast|slow|hard|soft|easy|difficult|simple|bad|happy|sad|angry|calm|maybe|perhaps|also|just|more|most|less|least|much|many|some|such|than|then|only|own|same|other|another|first|last|next|young|dear|kind|pretty|cool|super)\b/i;

export function detectLanguage(text: string): LangInfo {
  const clean = text.toLowerCase();
  for (const [, info, pattern] of languages) {
    if (pattern.test(clean)) return info;
  }
  if (englishPattern.test(clean)) return { code: 'en', name: 'inglese', tts: 'en-US' };
  return defaultLang;
}
