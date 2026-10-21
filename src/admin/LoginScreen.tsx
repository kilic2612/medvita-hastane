import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { motion } from 'framer-motion';
import { LoaderCircle, LockKeyhole, LogIn } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Logo } from '../components/ui/Logo';
import { useToast } from '../context/ToastContext';
import { inputClass, btn } from '../lib/styles';
import { isValidEmail } from '../lib/validation';
import { auth, authErrorMessage } from './auth';

export function LoginScreen() {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err) {
      setError(authErrorMessage((err as { code?: string }).code));
    } finally {
      setBusy(false);
    }
  };

  const resetPassword = async () => {
    if (!isValidEmail(email)) {
      setError('Şifre sıfırlama bağlantısı için önce e-posta adresinizi yazın.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch {
      // Hesabın var olup olmadığını belli etmemek için her durumda aynı mesaj gösterilir.
    }
    toast({ type: 'info', title: 'E-postanızı kontrol edin', description: 'Hesap kayıtlıysa şifre sıfırlama bağlantısı gönderildi.' });
  };

  return (
    <div className="grid min-h-dvh place-items-center bg-linear-to-br from-navy via-brand to-navy p-4">
      <motion.form
        onSubmit={submit}
        noValidate
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl"
      >
        <Logo />
        <div className="mt-8 flex items-center gap-2 text-navy">
          <LockKeyhole className="size-5 text-accent" />
          <h1 className="text-xl font-extrabold">Yönetim Paneli</h1>
        </div>
        <p className="mt-1 text-sm text-slate-500">Yalnızca yetkili hastane personeli içindir.</p>

        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="admin-email" className="mb-1.5 block text-sm font-semibold text-navy">
              E-posta
            </label>
            <input id="admin-email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass()} />
          </div>
          <div>
            <label htmlFor="admin-password" className="mb-1.5 block text-sm font-semibold text-navy">
              Şifre
            </label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass()}
            />
          </div>
        </div>

        {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-medium text-emergency">{error}</p>}

        <button type="submit" disabled={busy || !email || !password} className={`${btn.primary} mt-6 w-full`}>
          {busy ? <LoaderCircle className="size-4 animate-spin" /> : <LogIn className="size-4" />}
          Giriş Yap
        </button>
        <button type="button" onClick={resetPassword} className="mt-4 w-full text-center text-sm font-semibold text-slate-500 hover:text-accent">
          Şifremi unuttum
        </button>
      </motion.form>
    </div>
  );
}
