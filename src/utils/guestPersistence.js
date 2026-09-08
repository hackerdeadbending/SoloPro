const STATE_KEY = 'solopro-state-v4';
const LEGACY_KEY = 'solopro-state-v3';

// Guest mode is intentionally memory-only. The existing AppState provider
// still calls localStorage.setItem(), so we guard that single persistence
// boundary here without changing the application's data model.
if (typeof window !== 'undefined' && window.localStorage) {
  const storage = window.localStorage;
  const originalSetItem = storage.setItem.bind(storage);
  const originalRemoveItem = storage.removeItem.bind(storage);

  try {
    const saved = JSON.parse(storage.getItem(STATE_KEY) || storage.getItem(LEGACY_KEY) || 'null');
    if (!saved?.account?.authenticated) {
      originalRemoveItem(STATE_KEY);
      originalRemoveItem(LEGACY_KEY);
    }
  } catch {
    originalRemoveItem(STATE_KEY);
    originalRemoveItem(LEGACY_KEY);
  }

  storage.setItem = function(key, value) {
    if (key !== STATE_KEY) {
      return originalSetItem(key, value);
    }

    try {
      const next = JSON.parse(value);
      if (next?.account?.authenticated === true) {
        return originalSetItem(key, value);
      }

      // Guest state never survives a page reload.
      originalRemoveItem(STATE_KEY);
      originalRemoveItem(LEGACY_KEY);
      return;
    } catch {
      originalRemoveItem(STATE_KEY);
      originalRemoveItem(LEGACY_KEY);
    }
  };
}
