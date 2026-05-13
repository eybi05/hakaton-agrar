import { DEEPSEEK_API_KEY, DEEPSEEK_URL } from '../config/api';

export type TtsLanguage = {
  code:       string;      // internal key
  label:      string;      // display label
  speechCode: string;      // expo-speech language code
  apiName:    string;      // name passed to the translation prompt
  flag:       string;
};

export const TTS_LANGUAGES: TtsLanguage[] = [
  { code: 'en', label: 'English',    speechCode: 'en-US', apiName: 'English',    flag: '🇬🇧' },
  { code: 'az', label: 'Azərbaycan', speechCode: 'az-AZ', apiName: 'Azerbaijani',flag: '🇦🇿' },
  { code: 'ru', label: 'Русский',    speechCode: 'ru-RU', apiName: 'Russian',    flag: '🇷🇺' },
  { code: 'tr', label: 'Türkçe',     speechCode: 'tr-TR', apiName: 'Turkish',    flag: '🇹🇷' },
];

/**
 * Translates `text` to `targetLanguage` using DeepSeek.
 * Returns the original text if the target language is English (no API call needed).
 */
export async function translateText(
  text: string,
  targetLang: TtsLanguage,
  originalLang: 'en' | 'az' = 'en',
): Promise<string> {
  // No translation needed if source == target
  if (targetLang.code === originalLang) return text;

  const res = await fetch(DEEPSEEK_URL, {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-v4-flash',
      messages: [
        {
          role: 'system',
          content:
            `You are a professional translator specializing in tourism and cultural content. ` +
            `Translate the following text into ${targetLang.apiName}. ` +
            `Return ONLY the translated text — no explanations, no quotation marks, no extra commentary.`,
        },
        { role: 'user', content: text },
      ],
      max_tokens: 1200,
      temperature: 0.2,
    }),
  });

  if (!res.ok) throw new Error(`Translation failed: HTTP ${res.status}`);

  const data = await res.json();
  const translated: string = data?.choices?.[0]?.message?.content ?? '';
  if (!translated.trim()) throw new Error('Empty translation response');
  return translated.trim();
}
