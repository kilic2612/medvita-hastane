import { motion } from 'framer-motion';
import { Ambulance, Clock, LoaderCircle, Mail, MapPin, Navigation, Phone, Send, Siren } from 'lucide-react';
import { useState, type FormEvent, type ReactNode } from 'react';
import { useToast } from '../../context/ToastContext';
import { site } from '../../data/site';
import { useForm } from '../../hooks/useForm';
import { fadeUp, hoverTap, revealOnScroll, stagger } from '../../lib/motion';
import { btn, inputClass, type FieldState } from '../../lib/styles';
import { formatPhone, isValidEmail, isValidPhone } from '../../lib/validation';
import { sendMessage } from '../../services/api';
import { EmergencyButton } from '../ui/EmergencyButton';
import { Field } from '../ui/Field';
import { SectionHeading } from '../ui/SectionHeading';

type ContactValues = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  consent: boolean;
};

const initialValues: ContactValues = { name: '', email: '', phone: '', subject: '', message: '', consent: false };

const subjects = ['Genel Bilgi', 'Randevu & Muayene', 'Anlaşmalı Kurumlar', 'Öneri / Teşekkür', 'Şikâyet'];

function validateContact(v: ContactValues) {
  const e: Partial<Record<keyof ContactValues, string>> = {};
  if (v.name.trim().length < 3) e.name = 'Lütfen adınızı ve soyadınızı girin.';
  if (!v.email.trim()) e.email = 'E-posta adresi zorunludur.';
  else if (!isValidEmail(v.email)) e.email = 'Geçerli bir e-posta adresi girin.';
  if (v.phone && !isValidPhone(v.phone)) e.phone = 'Geçerli bir telefon numarası girin.';
  if (!v.subject) e.subject = 'Lütfen bir konu seçin.';
  if (v.message.trim().length < 10) e.message = 'Mesajınız en az 10 karakter olmalıdır.';
  else if (v.message.length > 1000) e.message = 'Mesajınız en fazla 1000 karakter olabilir.';
  if (!v.consent) e.consent = 'Devam etmek için onay vermeniz gerekiyor.';
  return e;
}

export function Contact() {
  return (
    <section id="contact" className="scroll-mt-20 bg-white py-24">
      <div className="wrap">
        <EmergencyBanner />

        <div className="mt-24">
          <SectionHeading
            eyebrow="İletişim"
            title="Size Nasıl Yardımcı Olabiliriz?"
            description="Sorularınız, önerileriniz veya randevu talepleriniz için bize ulaşın; hasta hizmetleri ekibimiz en kısa sürede size dönüş yapsın."
          />
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-5">
          <motion.div variants={stagger(0.08)} {...revealOnScroll} className="space-y-4 lg:col-span-2">
            <InfoCard icon={<MapPin className="size-5" />} title="Adres">
              {site.address}
            </InfoCard>
            <InfoCard icon={<Phone className="size-5" />} title="Çağrı Merkezi">
              <a href={`tel:${site.tel}`} className="font-semibold text-navy hover:text-accent">
                {site.phone}
              </a>
            </InfoCard>
            <InfoCard icon={<Siren className="size-5" />} title="7/24 Acil Hattı" emergency>
              <a href={`tel:${site.emergencyTel}`} className="font-bold text-emergency hover:underline">
                {site.emergencyPhone}
              </a>
            </InfoCard>
            <InfoCard icon={<Mail className="size-5" />} title="E-posta">
              <a href={`mailto:${site.email}`} className="font-semibold text-navy hover:text-accent">
                {site.email}
              </a>
            </InfoCard>
            <motion.div variants={fadeUp} className="rounded-2xl bg-navy p-6 text-white">
              <p className="flex items-center gap-2 font-bold">
                <Clock className="size-5 text-accent" />
                Çalışma Saatleri
              </p>
              <dl className="mt-4 divide-y divide-white/10 text-sm">
                {site.hours.map((h) => (
                  <div key={h.day} className="flex justify-between py-2.5">
                    <dt className="text-slate-400">{h.day}</dt>
                    <dd className={h.highlight ? 'font-bold text-mint' : 'font-semibold'}>{h.time}</dd>
                  </div>
                ))}
              </dl>
            </motion.div>
          </motion.div>

          <motion.div variants={fadeUp} {...revealOnScroll} className="lg:col-span-3">
            <ContactForm />
          </motion.div>
        </div>

        <MapEmbed />
      </div>
    </section>
  );
}

function EmergencyBanner() {
  return (
    <motion.div
      variants={fadeUp}
      {...revealOnScroll}
      className="relative overflow-hidden rounded-[2rem] bg-linear-to-br from-red-500 via-emergency to-rose-600 p-8 text-white shadow-2xl shadow-red-500/25 sm:p-10"
    >
      <span aria-hidden className="absolute -right-16 -top-16 size-64 rounded-full bg-white/10" />
      <span aria-hidden className="absolute -bottom-20 right-40 size-48 rounded-full bg-white/10" />
      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-5">
          <motion.span
            animate={{ rotate: [0, -8, 8, -8, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 2.5 }}
            className="grid size-16 shrink-0 place-items-center rounded-2xl bg-white/20 backdrop-blur"
          >
            <Ambulance className="size-8" />
          </motion.span>
          <div>
            <h2 className="text-2xl font-extrabold sm:text-3xl">Acil bir durum mu yaşıyorsunuz?</h2>
            <p className="mt-2 max-w-xl text-red-50">
              Hayati tehlike içeren durumlarda vakit kaybetmeden <strong>112 Acil Çağrı Merkezi</strong>’ni arayın veya 7/24 açık acil
              servisimize başvurun.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <motion.a href="tel:112" {...hoverTap} className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 font-extrabold text-emergency shadow-lg">
            <Phone className="size-5" />
            112’yi Ara
          </motion.a>
          <EmergencyButton className="bg-red-700! px-6 py-3.5 ring-2 ring-white/40" label={site.emergencyPhone} />
        </div>
      </div>
    </motion.div>
  );
}

function InfoCard({ icon, title, children, emergency = false }: { icon: ReactNode; title: string; children: ReactNode; emergency?: boolean }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ x: 4 }}
      className={`flex items-start gap-4 rounded-2xl p-5 ring-1 ${emergency ? 'bg-red-50 ring-red-100' : 'bg-surface ring-slate-200/70'}`}
    >
      <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${emergency ? 'bg-emergency text-white' : 'bg-white text-accent shadow-sm ring-1 ring-slate-200'}`}>
        {icon}
      </span>
      <div className="min-w-0 text-sm text-slate-600">
        <p className="mb-0.5 font-bold text-navy">{title}</p>
        {children}
      </div>
    </motion.div>
  );
}

function ContactForm() {
  const toast = useToast();
  const [sending, setSending] = useState(false);
  const form = useForm<ContactValues>(initialValues, validateContact);
  const { values, set, touch, error, errors } = form;

  const state = (key: keyof ContactValues): FieldState => (error(key) ? 'error' : values[key] && !errors[key] ? 'valid' : undefined);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (sending) return;
    if (!form.isValid) {
      form.touchAll();
      toast({ type: 'error', title: 'Form eksik', description: 'Lütfen işaretli alanları kontrol edin.' });
      return;
    }
    setSending(true);
    try {
      await sendMessage(values);
      toast({ type: 'success', title: 'Mesajınız iletildi', description: `Teşekkürler ${values.name.trim().split(' ')[0]}, en kısa sürede size dönüş yapacağız.` });
      form.reset();
    } catch {
      toast({ type: 'error', title: 'Mesaj gönderilemedi', description: `Lütfen tekrar deneyin veya ${site.phone} numarasını arayın.` });
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="h-full rounded-3xl bg-white p-6 shadow-2xl shadow-slate-900/[0.07] ring-1 ring-slate-200/70 sm:p-8">
      <h3 className="text-xl font-bold text-navy">Bize Yazın</h3>
      <p className="mt-1 text-sm text-slate-500">* ile işaretli alanların doldurulması zorunludur.</p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field id="c-name" label="Ad Soyad" required error={error('name')}>
          <input
            id="c-name"
            autoComplete="name"
            value={values.name}
            onChange={(e) => set('name', e.target.value)}
            onBlur={() => touch('name')}
            aria-invalid={!!error('name')}
            placeholder="Adınız ve soyadınız"
            className={inputClass(state('name'))}
          />
        </Field>
        <Field id="c-email" label="E-posta" required error={error('email')}>
          <input
            id="c-email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => set('email', e.target.value)}
            onBlur={() => touch('email')}
            aria-invalid={!!error('email')}
            placeholder="ornek@eposta.com"
            className={inputClass(state('email'))}
          />
        </Field>
        <Field id="c-phone" label="Telefon" error={error('phone')}>
          <input
            id="c-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={(e) => set('phone', formatPhone(e.target.value))}
            onBlur={() => touch('phone')}
            aria-invalid={!!error('phone')}
            placeholder="05XX XXX XX XX"
            className={inputClass(state('phone'))}
          />
        </Field>
        <Field id="c-subject" label="Konu" required error={error('subject')}>
          <select
            id="c-subject"
            value={values.subject}
            onChange={(e) => {
              set('subject', e.target.value);
              touch('subject');
            }}
            onBlur={() => touch('subject')}
            aria-invalid={!!error('subject')}
            className={`${inputClass(state('subject'))} ${values.subject ? '' : 'text-slate-400'}`}
          >
            <option value="" disabled>
              Konu seçin
            </option>
            {subjects.map((s) => (
              <option key={s} value={s} className="text-navy">
                {s}
              </option>
            ))}
          </select>
        </Field>
        <div className="sm:col-span-2">
          <Field id="c-message" label="Mesajınız" required error={error('message')}>
            <textarea
              id="c-message"
              rows={5}
              value={values.message}
              onChange={(e) => set('message', e.target.value)}
              onBlur={() => touch('message')}
              aria-invalid={!!error('message')}
              placeholder="Size nasıl yardımcı olabiliriz?"
              className={`${inputClass(state('message'))} resize-none`}
            />
            <p className={`mt-1 text-right text-xs ${values.message.length > 1000 ? 'text-emergency' : 'text-slate-400'}`}>{values.message.length}/1000</p>
          </Field>
        </div>
        <div className="sm:col-span-2">
          <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={values.consent}
              onChange={(e) => {
                set('consent', e.target.checked);
                touch('consent');
              }}
              className="mt-0.5 size-5 shrink-0 cursor-pointer accent-accent"
            />
            <span>
              Kişisel verilerimin <strong className="text-navy">KVKK Aydınlatma Metni</strong> kapsamında, talebimin yanıtlanması amacıyla
              işlenmesini kabul ediyorum.
            </span>
          </label>
          {error('consent') && <p className="mt-1.5 pl-8 text-xs font-medium text-emergency">{error('consent')}</p>}
        </div>
      </div>

      <motion.button type="submit" {...hoverTap} disabled={sending} className={`${btn.primary} mt-7 w-full sm:w-auto sm:px-10`}>
        {sending ? (
          <>
            <LoaderCircle className="size-4 animate-spin" />
            Gönderiliyor…
          </>
        ) : (
          <>
            Mesajı Gönder
            <Send className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-1" />
          </>
        )}
      </motion.button>
    </form>
  );
}

/** KVKK gereği Google Haritalar yalnızca kullanıcı onayıyla yüklenir. */
function MapEmbed() {
  const [loaded, setLoaded] = useState(false);
  const query = encodeURIComponent(site.mapQuery);

  return (
    <motion.div variants={fadeUp} {...revealOnScroll} className="relative mt-10 h-96 overflow-hidden rounded-[2rem] bg-slate-100 ring-1 ring-slate-200">
      {loaded ? (
        <iframe
          title="Hastane konumu"
          src={`https://maps.google.com/maps?q=${query}&z=14&output=embed`}
          className="size-full border-0 grayscale-[30%]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div className="relative grid size-full place-items-center">
          <div
            aria-hidden
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                'linear-gradient(#e2e8f0 2px, transparent 2px), linear-gradient(90deg, #e2e8f0 2px, transparent 2px), linear-gradient(#f1f5f9 1px, transparent 1px), linear-gradient(90deg, #f1f5f9 1px, transparent 1px)',
              backgroundSize: '120px 120px, 120px 120px, 24px 24px, 24px 24px',
            }}
          />
          <span aria-hidden className="absolute left-0 top-1/2 h-3 w-full -rotate-6 bg-white shadow-sm" />
          <span aria-hidden className="absolute left-1/3 top-0 h-full w-3 rotate-12 bg-white shadow-sm" />
          <div className="relative flex flex-col items-center text-center">
            <motion.span
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              className="grid size-16 place-items-center rounded-full bg-emergency text-white shadow-xl shadow-red-500/40"
            >
              <MapPin className="size-8" />
            </motion.span>
            <span className="mt-1 h-2 w-8 rounded-full bg-slate-900/15 blur-[2px]" />
            <button type="button" onClick={() => setLoaded(true)} className={`${btn.dark} mt-6`}>
              Haritayı Göster
            </button>
            <p className="mt-3 max-w-xs px-4 text-xs text-slate-500">Harita Google tarafından sağlanır ve yüklendiğinde Google çerezleri kullanılabilir.</p>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${query}`}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-accent hover:underline lg:hidden"
            >
              <Navigation className="size-4" />
              Yol Tarifi Al
            </a>
          </div>
        </div>
      )}

      <div className="absolute bottom-4 left-4 hidden max-w-sm flex-col gap-3 rounded-2xl bg-white/95 p-4 shadow-xl backdrop-blur lg:flex">
        <p className="flex items-start gap-2 text-sm text-slate-600">
          <MapPin className="mt-0.5 size-4 shrink-0 text-emergency" />
          {site.address}
        </p>
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${query}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 self-start text-sm font-bold text-accent hover:underline"
        >
          <Navigation className="size-4" />
          Yol Tarifi Al
        </a>
      </div>
    </motion.div>
  );
}
