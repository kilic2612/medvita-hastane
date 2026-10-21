import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { motion } from 'framer-motion';
import { CalendarCheck, CalendarClock, ExternalLink, LoaderCircle, LogOut, Mail, ShieldAlert, Users, type LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Logo } from '../components/ui/Logo';
import { ToastProvider } from '../context/ToastContext';
import { site } from '../data/site';
import { toDateKey } from '../lib/format';
import { btn } from '../lib/styles';
import { AppointmentsPanel } from './AppointmentsPanel';
import { auth, checkIsAdmin } from './auth';
import { LoginScreen } from './LoginScreen';
import { MessagesPanel } from './MessagesPanel';
import { SubscribersPanel } from './SubscribersPanel';
import type { Appointment, Message, Subscriber } from './types';
import { useLiveCollection } from './useLiveCollection';

type AuthState = { status: 'loading' } | { status: 'signedOut' } | { status: 'denied'; user: User } | { status: 'admin'; user: User };

export default function AdminApp() {
  const [state, setState] = useState<AuthState>({ status: 'loading' });

  useEffect(() => {
    document.title = `Yönetim Paneli | ${site.fullName}`;
    return onAuthStateChanged(auth, async (user) => {
      if (!user) return setState({ status: 'signedOut' });
      setState((await checkIsAdmin(user)) ? { status: 'admin', user } : { status: 'denied', user });
    });
  }, []);

  return (
    <ToastProvider>
      {state.status === 'loading' && (
        <div className="grid min-h-dvh place-items-center bg-surface">
          <LoaderCircle className="size-8 animate-spin text-accent" />
        </div>
      )}
      {state.status === 'signedOut' && <LoginScreen />}
      {state.status === 'denied' && <AccessDenied user={state.user} />}
      {state.status === 'admin' && <Dashboard user={state.user} />}
    </ToastProvider>
  );
}

function AccessDenied({ user }: { user: User }) {
  return (
    <div className="grid min-h-dvh place-items-center bg-surface p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl ring-1 ring-slate-200">
        <ShieldAlert className="mx-auto size-12 text-amber-500" />
        <h1 className="mt-4 text-xl font-extrabold text-navy">Yetkiniz yok</h1>
        <p className="mt-2 text-sm text-slate-500">
          <strong>{user.email}</strong> hesabı yönetici olarak tanımlı değil. Bir yöneticiden, Firebase konsolunda <code>admins</code> koleksiyonuna aşağıdaki
          kimlikle bir belge eklemesini isteyin:
        </p>
        <code className="mt-4 block break-all rounded-xl bg-surface p-3 text-xs text-navy ring-1 ring-slate-200">{user.uid}</code>
        <button type="button" onClick={() => signOut(auth)} className={`${btn.outline} mt-6`}>
          <LogOut className="size-4" /> Çıkış Yap
        </button>
      </div>
    </div>
  );
}

type Tab = 'appointments' | 'messages' | 'subscribers';

function Dashboard({ user }: { user: User }) {
  const [tab, setTab] = useState<Tab>('appointments');
  const appointments = useLiveCollection<Appointment>('appointments');
  const messages = useLiveCollection<Message>('messages');
  const subscribers = useLiveCollection<Subscriber>('subscribers');

  const today = toDateKey(new Date());
  const todayCount = appointments.items.filter((a) => a.date === today && a.status !== 'cancelled').length;
  const pendingCount = appointments.items.filter((a) => a.status === 'pending').length;
  const unreadCount = messages.items.filter((m) => !m.read).length;

  const tabs: { id: Tab; label: string; badge?: number }[] = [
    { id: 'appointments', label: 'Randevular', badge: pendingCount },
    { id: 'messages', label: 'Mesajlar', badge: unreadCount },
    { id: 'subscribers', label: 'Bülten Aboneleri' },
  ];

  return (
    <div className="min-h-dvh bg-surface">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="wrap flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="hidden rounded-full bg-navy px-3 py-1 text-xs font-bold text-white sm:inline">Yönetim</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-slate-500 md:inline">{user.email}</span>
            <a href="/" target="_blank" rel="noreferrer" className="grid size-10 place-items-center rounded-full text-slate-500 hover:bg-slate-100" aria-label="Siteyi aç">
              <ExternalLink className="size-4" />
            </a>
            <button type="button" onClick={() => signOut(auth)} className={`${btn.outline} px-4 py-2`}>
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Çıkış</span>
            </button>
          </div>
        </div>
      </header>

      <main className="wrap py-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard icon={CalendarCheck} label="Bugünkü randevu" value={todayCount} tone="bg-sky-50 text-accent" onClick={() => setTab('appointments')} />
          <StatCard icon={CalendarClock} label="Onay bekleyen" value={pendingCount} tone="bg-amber-50 text-amber-500" onClick={() => setTab('appointments')} />
          <StatCard icon={Mail} label="Okunmamış mesaj" value={unreadCount} tone="bg-rose-50 text-rose-500" onClick={() => setTab('messages')} />
          <StatCard icon={Users} label="Bülten abonesi" value={subscribers.items.length} tone="bg-teal-50 text-mint" onClick={() => setTab('subscribers')} />
        </div>

        <nav className="mt-8 flex gap-1 border-b border-slate-200">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`relative -mb-px whitespace-nowrap px-4 py-3 text-sm font-semibold transition-colors ${tab === t.id ? 'text-navy' : 'text-slate-500 hover:text-navy'}`}
            >
              {t.label}
              {!!t.badge && <span className="ml-2 rounded-full bg-emergency px-2 py-0.5 text-xs font-bold text-white">{t.badge}</span>}
              {tab === t.id && <motion.span layoutId="admin-tab" className="absolute inset-x-0 bottom-0 h-0.5 bg-accent" />}
            </button>
          ))}
        </nav>

        <div className="mt-6">
          {tab === 'appointments' && <AppointmentsPanel data={appointments} />}
          {tab === 'messages' && <MessagesPanel data={messages} />}
          {tab === 'subscribers' && <SubscribersPanel data={subscribers} />}
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, tone, onClick }: { icon: LucideIcon; label: string; value: number; tone: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex items-center gap-4 rounded-2xl bg-white p-4 text-left ring-1 ring-slate-200 transition hover:shadow-lg sm:p-5">
      <span className={`grid size-12 shrink-0 place-items-center rounded-xl ${tone}`}>
        <Icon className="size-6" />
      </span>
      <span>
        <span className="block text-2xl font-extrabold text-navy">{value}</span>
        <span className="block text-xs text-slate-500 sm:text-sm">{label}</span>
      </span>
    </button>
  );
}
