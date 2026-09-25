import { useEffect, useState } from 'react';
import Modal from './Modal';
import { useApp } from '../context/AppState';
import { createTranslator } from '../i18n';
import { updatePassword } from '../utils/supabaseAuth';

export default function PasswordRecovery() {
  const app = useApp();
  const t = createTranslator(app.language);
  const [open, setOpen] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const hash = String(window.location.hash || '').replace(/^#/, '');
    const params = new URLSearchParams(hash);

    const token = params.get('access_token');
    const type = params.get('type');
    const errorDescription = params.get('error_description');

    if (errorDescription && type === 'recovery') {
      setMessage(decodeURIComponent(errorDescription.replaceAll('+',' ')));
    }

    if (token && type === 'recovery') {
      setAccessToken(token);
      setOpen(true);

      try {
        sessionStorage.setItem(
          'solopro-recovery-access-token',
          token
        );
      } catch {}
    }
  }, []);

  if (!open) {
    return null;
  }

  async function submit(e) {
    e.preventDefault();
    setMessage('');

    if (password.length < 8) {
      setMessage(t('passwordMinLength'));
      return;
    }

    if (password !== confirm) {
      setMessage(t('passwordsDoNotMatch'));
      return;
    }

    if (!accessToken) {
      setMessage(t('recoverySessionMissing'));
      return;
    }

    setBusy(true);

    try {
      await updatePassword(accessToken, password);

      setMessage(
        t('passwordUpdated')
      );

      try {
        sessionStorage.removeItem(
          'solopro-recovery-access-token'
        );
        sessionStorage.removeItem(
          'solopro-recovery-code'
        );
      } catch {}

      window.history.replaceState(
        {},
        document.title,
        window.location.pathname + window.location.search
      );

      setTimeout(() => {
        setOpen(false);
      }, 1500);
    } catch (err) {
      console.error('Password recovery error:', err);

      setMessage(
        err?.message ||
        t('unableToUpdatePassword')
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={() => {}}
      title={t("resetYourPassword")}
    >
      <div className="account-modal"><form className="form-stack" onSubmit={submit}>
        <label>
          {t("newPassword")}

          <input
            type="password"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
        </label>

        <label>
          {t("confirmPassword")}

          <input
            type="password"
            minLength={8}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
            required
          />
        </label>

        {message && (
          <div className="account-message">
            {message}
          </div>
        )}

        <button
          className="primary full"
          type="submit"
          disabled={busy}
        >
          {busy ? t('saving') : t('updatePassword')}
        </button>
      </form></div>
    </Modal>
  );
}