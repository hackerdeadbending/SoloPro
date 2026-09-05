const FLAG_CDN = 'https://flagcdn.com';

export default function Flag({ code, className = '' }) {
  const normalized = String(code || '').trim().toLowerCase();
  if (!normalized) return null;
  const src = normalized === 'it'
    ? `${FLAG_CDN}/w640/it.png`
    : `${FLAG_CDN}/${normalized}.svg`;
  return (
    <img
      className={`flag-svg ${className}`}
      src={src}
      alt={`${String(code).toUpperCase()} flag`}
      loading="lazy"
      decoding="async"
      draggable="false"
      referrerPolicy="no-referrer"
      onError={(event) => { event.currentTarget.style.visibility = 'hidden'; }}
    />
  );
}
