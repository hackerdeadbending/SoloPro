export default function Modal({
  open,
  onClose,
  title,
  children,
  wide = false,
}) {
  if (!open) return null;

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose?.();
        }
      }}
    >
      <div className={wide ? 'modal wide' : 'modal'}>
        <div className="modal-head">
          <h3>{title}</h3>

          <button
            className="icon-btn"
            type="button"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}