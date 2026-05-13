/**
 * ElevenLabs TTS utility — production-safe for Expo on Android + iOS.
 *
 * Flow:
 *   text → prepareText() → ElevenLabs API → ArrayBuffer
 *       → arrayBufferToBase64() → writeAsStringAsync() → local file URI
 *       → returned to caller (expo-audio plays it)
 */

import * as FileSystem from 'expo-file-system';
// EncodingType MUST be a named import.
// `FileSystem.EncodingType` is undefined in expo-file-system v17+ when
// imported with `* as FileSystem` — the namespace does not re-export enums.
import { EncodingType } from 'expo-file-system';

import {
  ELEVENLABS_API_KEY,
  ELEVENLABS_URL,
  ELEVENLABS_MODEL,
  ELEVENLABS_VOICE_ID,
} from '../config/api';

// ElevenLabs per-request character limit (free & starter plans: 2 500)
const MAX_CHARS = 2500;

// ─────────────────────────────────────────────────────────────────────────────
// STEP 0 — resolve a writable directory, guaranteed to exist
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Returns a writable directory path that ends with '/'.
 *
 * Why this is needed on Android:
 *   - `FileSystem.cacheDirectory` can be null on Android 10+ in Expo Go and
 *     in certain cold-start / low-memory conditions.
 *   - `FileSystem.documentDirectory` is the app's internal files/ dir and is
 *     ALWAYS available on both Android and iOS without any permissions.
 *   - Android may purge the cache directory; we must call makeDirectoryAsync
 *     each time to guarantee the subdirectory still exists.
 */
async function getAudioDir(): Promise<string> {
  // Prefer cache (not backed up, cleaned by OS) — fall back to documents
  const base = FileSystem.cacheDirectory ?? FileSystem.documentDirectory;

  if (!base) {
    // This should never happen in a properly packaged Expo app, but if it
    // does we give a clear error rather than a cryptic crash.
    throw new Error(
      '[ElevenLabs] No writable storage available on this device.\n' +
      'Both FileSystem.cacheDirectory and FileSystem.documentDirectory are null.\n' +
      'Ensure expo-file-system is installed and the app is not running in a restricted environment.',
    );
  }

  const dir = `${base}georg_tts/`;

  // Create the subdirectory if it was purged or never existed.
  // { intermediates: true } is a no-op if it already exists on iOS,
  // but on Android it may throw "already exists" — we catch and ignore that.
  try {
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    console.log('[ElevenLabs] Audio directory ready:', dir);
  } catch (e: any) {
    // "already exists" is fine — any other error is worth logging
    if (!String(e?.message ?? e).toLowerCase().includes('already')) {
      console.warn('[ElevenLabs] makeDirectoryAsync warning:', e?.message ?? e);
    }
  }

  return dir;
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 1 — sanitise text before sending to ElevenLabs
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Trims text to MAX_CHARS at a sentence boundary to avoid 422 responses.
 */
function prepareText(raw: string): string {
  const text = raw.trim().replace(/\s+/g, ' ');   // collapse whitespace
  if (text.length <= MAX_CHARS) return text;

  const slice      = text.slice(0, MAX_CHARS);
  const lastPeriod = Math.max(
    slice.lastIndexOf('. '),
    slice.lastIndexOf('! '),
    slice.lastIndexOf('? '),
  );

  return lastPeriod > MAX_CHARS * 0.5
    ? slice.slice(0, lastPeriod + 1).trim()
    : slice.trim() + '…';
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT — generateSpeech
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Converts `text` to speech via ElevenLabs and returns a local file URI
 * that can be passed directly to expo-audio's `useAudioPlayer({ uri })`.
 *
 * Safe on Android + iOS, with full fallbacks and validation at every step.
 */
export async function generateSpeech(
  text:    string,
  voiceId: string = ELEVENLABS_VOICE_ID,
): Promise<string> {

  // ── Step 1: prepare text ────────────────────────────────────────────────
  const safeText = prepareText(text);
  console.log(`[ElevenLabs] Sending ${safeText.length} chars → voice ${voiceId}`);

  // ── Step 2: call ElevenLabs API ─────────────────────────────────────────
  let response: Response;
  try {
    response = await fetch(`${ELEVENLABS_URL}/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key':   ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
        'Accept':       'audio/mpeg',
      },
      body: JSON.stringify({
        text:     safeText,
        model_id: ELEVENLABS_MODEL,
        voice_settings: {
          stability:         0.5,
          similarity_boost:  0.75,
          style:             0.0,
          use_speaker_boost: true,
        },
      }),
    });
  } catch (networkErr: any) {
    throw new Error(`[ElevenLabs] Network request failed: ${networkErr?.message ?? networkErr}`);
  }

  // ── Step 3: HTTP status guard ────────────────────────────────────────────
  if (!response.ok) {
    const errText = await response.text().catch(() => '(no body)');
    console.error('[ElevenLabs] HTTP', response.status, errText);
    throw new Error(`ElevenLabs API error ${response.status}: ${errText}`);
  }

  // ── Step 4: content-type guard ───────────────────────────────────────────
  // A wrong API key or exhausted quota often returns 200 JSON instead of audio
  const ct = response.headers.get('content-type') ?? '';
  console.log('[ElevenLabs] Response content-type:', ct);

  if (!ct.includes('audio') && !ct.includes('octet-stream')) {
    const body = await response.text().catch(() => '(unreadable)');
    console.error('[ElevenLabs] Non-audio response body:', body);
    throw new Error(
      `ElevenLabs returned "${ct}" instead of audio. ` +
      `Check your API key and account quota.\nBody: ${body.slice(0, 200)}`,
    );
  }

  // ── Step 5: read binary data ─────────────────────────────────────────────
  let arrayBuffer: ArrayBuffer;
  try {
    arrayBuffer = await response.arrayBuffer();
  } catch (e: any) {
    throw new Error(`[ElevenLabs] Failed to read audio buffer: ${e?.message ?? e}`);
  }

  if (!arrayBuffer || arrayBuffer.byteLength === 0) {
    throw new Error('[ElevenLabs] Received empty audio buffer from API.');
  }
  console.log(`[ElevenLabs] Audio received: ${arrayBuffer.byteLength} bytes`);

  // ── Step 6: encode to base64 ─────────────────────────────────────────────
  const base64 = arrayBufferToBase64(arrayBuffer);
  if (!base64) throw new Error('[ElevenLabs] base64 encoding produced empty string.');

  // ── Step 7: resolve writable directory (with Android fallback) ──────────
  const audioDir  = await getAudioDir();
  const filePath  = `${audioDir}tts_${Date.now()}.mp3`;

  // ── Step 8: write file ───────────────────────────────────────────────────
  try {
    await FileSystem.writeAsStringAsync(filePath, base64, {
      encoding: EncodingType.Base64,   // named import — never FileSystem.EncodingType
    });
  } catch (writeErr: any) {
    console.error('[ElevenLabs] writeAsStringAsync failed:', writeErr);
    throw new Error(`[ElevenLabs] Failed to save audio file: ${writeErr?.message ?? writeErr}`);
  }

  // ── Step 9: verify the file was actually written ─────────────────────────
  const info = await FileSystem.getInfoAsync(filePath);
  if (!info.exists) {
    throw new Error(`[ElevenLabs] File was not found after writing: ${filePath}`);
  }
  if ((info as any).size === 0) {
    await FileSystem.deleteAsync(filePath, { idempotent: true }).catch(() => {});
    throw new Error('[ElevenLabs] Written file has 0 bytes — audio data may be corrupt.');
  }

  console.log(`[ElevenLabs] Audio ready at ${filePath} (${(info as any).size ?? '?'} bytes)`);
  return filePath;
}

// ─────────────────────────────────────────────────────────────────────────────
// Cleanup helper
// ─────────────────────────────────────────────────────────────────────────────
/** Safely deletes a temp audio file. Never throws. */
export async function removeTempAudio(uri: string): Promise<void> {
  if (!uri) return;
  try {
    const info = await FileSystem.getInfoAsync(uri);
    if (info.exists) await FileSystem.deleteAsync(uri, { idempotent: true });
  } catch {
    // Silently ignore — the OS will evict the cache directory eventually
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Pure manual base64 encoder
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Why not btoa() or String.fromCharCode(...spread)?
 *   - btoa() throws InvalidCharacterError on raw binary in some RN JS engines.
 *   - The spread operator hits the JS call-stack limit for large MP3 buffers.
 * This loop processes 3 bytes at a time with no recursion and no btoa.
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const len   = bytes.length;
  let   out   = '';

  for (let i = 0; i < len; i += 3) {
    const a = bytes[i];
    const b = i + 1 < len ? bytes[i + 1] : 0;
    const c = i + 2 < len ? bytes[i + 2] : 0;

    out += CHARS[a >> 2];
    out += CHARS[((a & 3) << 4) | (b >> 4)];
    out += i + 1 < len ? CHARS[((b & 15) << 2) | (c >> 6)] : '=';
    out += i + 2 < len ? CHARS[c & 63] : '=';
  }

  return out;
}
