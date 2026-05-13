/** Central API configuration — keep this file private, never commit to public repos. */

// ── DeepSeek ──────────────────────────────────────────────────────────────────
export const DEEPSEEK_API_KEY = 'sk-f06422fcc0e24efba93af049879f25b7';
export const DEEPSEEK_URL     = 'https://api.deepseek.com/chat/completions';
export const DEEPSEEK_MODEL   = 'deepseek-v4-flash';

// ── Google Gemini Vision (image analysis) ────────────────────────────────────
export const GEMINI_API_KEY    = 'AIzaSyCEXbArRf5Fo1oyt64d60Adhv3NnBavb0Q';
export const GEMINI_VISION_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// ── ElevenLabs TTS ────────────────────────────────────────────────────────────
export const ELEVENLABS_API_KEY = 'cb21dda117c67d4954e69cfe2c66a09bea4b104589b336fdbef31b7bf03a5d8e';
export const ELEVENLABS_URL     = 'https://api.elevenlabs.io/v1/text-to-speech';
export const ELEVENLABS_MODEL   = 'eleven_multilingual_v2';  // supports 29 languages

// Voice to use — Rachel: calm, clear, ideal for audio guides
// Full list: https://api.elevenlabs.io/v1/voices
export const ELEVENLABS_VOICE_ID = '21m00Tcm4TlvDq8ikWAM'; // Rachel
