const FLAG_BASE = 'https://flagcdn.io/flags/4x3';
const FLAG_FALLBACK = 'https://flagcdn.com';

export default function Flag({ code, className = '' }) {
  if (!code) return null;
  const normalized = String(code).trim().toLowerCase();
  if (!normalized || normalized === 'undefined' || normalized === 'null') return null;
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
