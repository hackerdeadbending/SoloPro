const FLAG_BASE = 'https://flagcdn.io/flags/4x3';
const FLAG_FALLBACK = 'https://flagcdn.com';

/** Uses canonical FlagCDN SVG artwork and preserves each flag's native ratio. */
export default function Flag({ code, className = '' }) {
  const normalized = String(code || '').trim().toLowerCase();
  if (!normalized) return null;
  const primary = `${FLAG_BASE}/${normalized}.svg`;
  const fallback = `${FLAG_FALLBACK}/${normalized}.svg`;
  return (
    <img
      className={`flag-svg ${className}`}
      src={primary}
      alt={`${String(code).toUpperCase()} flag`}
      loading="eager"
      decoding="async"
      draggable="false"
      referrerPolicy="no-referrer"
      onError={(event) => {
        const image = event.currentTarget;
        if (image.dataset.fallback !== '1') {
          image.dataset.fallback = '1';
          image.src = fallback;
          return;
        }
        image.style.display = 'none';
      }}
    />
  );
}
