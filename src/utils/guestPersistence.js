const STATE_KEY = 'solopro-state-v4';
const LEGACY_KEY = 'solopro-state-v3';

// Guest mode is intentionally memory-only.
// Persistence is handled safely inside AppState; this module only removes
// any old unauthenticated state left by previous versions.
try {
  if (typeof window !== 'undefined' && window.localStorage) {
    const storage = window.localStorage;
    const saved = JSON.parse(
      storage.getItem(STATE_KEY) ||
      storage.getItem(LEGACY_KEY) ||
      'null'
    );

    if (!saved?.account?.authenticated) {
      storage.removeItem(STATE_KEY);
      storage.removeItem(LEGACY_KEY);
    }
  }
} catch {
  // Storage may be unavailable/restricted (for example Safari private mode).
  // The app must still boot and operate in memory.
}
