const FLAG_CDN = 'https://flagcdn.com';

export default function Flag({ code, className = '' }) {
  const normalized = String(code || '').trim().toLowerCase();
  if (!normalized) return null;
  return (
    <img
      className={`flag-svg ${className}`}
      src={`${FLAG_CDN}/${normalized}.svg`}
      alt={`${String(code).toUpperCase()} flag`}
      loading="lazy"
      decoding="async"
      draggable="false"
      referrerPolicy="no-referrer"
      onError={(event) => { event.currentTarget.style.visibility = 'hidden'; }}
    />
  );
}
