import { CalendarDays, CircleCheck, Clock, Sparkles, Stethoscope } from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';
import type { FormApi } from '../../hooks/useForm';
import { formatDate } from '../../lib/format';
import { inputClass, type FieldState } from '../../lib/styles';
import { digitsOnly, formatPhone, isValidEmail, isValidMobile, isValidTC } from '../../lib/validation';
import { Field } from '../ui/Field';

export type PatientValues = {
  fullName: string;
  tc: string;
  phone: string;
  email: string;
  notes: string;
  consent: boolean;
};

export const emptyPatient: PatientValues = { fullName: '', tc: '', phone: '', email: '', notes: '', consent: false };

export function validatePatient(v: PatientValues) {
  const e: Partial<Record<keyof PatientValues, string>> = {};
  const name = v.fullName.trim();
  if (name.length < 3) e.fullName = 'Lütfen adınızı ve soyadınızı girin.';
  else if (!/\s/.test(name)) e.fullName = 'Ad ve soyadınızı birlikte yazın.';

  if (!v.tc) e.tc = 'TC Kimlik No zorunludur.';
  else if (v.tc.length !== 11) e.tc = `TC Kimlik No 11 haneli olmalıdır (${v.tc.length}/11).`;
  else if (!isValidTC(v.tc)) e.tc = 'Geçersiz TC Kimlik No, lütfen kontrol edin.';

  if (!v.phone) e.phone = 'Cep telefonu zorunludur.';
  else if (!isValidMobile(v.phone)) e.phone = 'Geçerli bir cep telefonu girin (05XX XXX XX XX).';

  if (v.email && !isValidEmail(v.email)) e.email = 'Geçerli bir e-posta adresi girin.';
  if (v.notes.length > 500) e.notes = 'Not en fazla 500 karakter olabilir.';
  if (!v.consent) e.consent = 'Devam etmek için onay vermeniz gerekiyor.';
  return e;
}

interface PatientStepProps {
  form: FormApi<PatientValues>;
  formId: string;
  onSubmit: () => void;
  summary: { department?: string; doctor?: string; date: string; time: string };
}

export function PatientStep({ form, formId, onSubmit, summary }: PatientStepProps) {
  const { values, set, touch, error, errors } = form;

  // Hata varsa kırmızı; alan doldurulmuş ve geçerliyse yeşil kenarlık.
  const state = (key: keyof PatientValues): FieldState =>
    error(key) ? 'error' : values[key] && !errors[key] ? 'valid' : undefined;

  // Demo sitede ziyaretçilerin gerçek bilgi girmeden formu deneyebilmesi için (10000000146 algoritmaya uygun test numarasıdır).
  const fillDemo = () => {
    set('fullName', 'Deneme Hasta');
    set('tc', '10000000146');
    set('phone', '0555 555 55 55');
    set('consent', true);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form id={formId} onSubmit={handleSubmit} noValidate>
      <div className="flex flex-wrap gap-2 rounded-2xl bg-surface p-3 text-xs font-semibold text-slate-600 ring-1 ring-slate-100">
        <SummaryChip icon={<Stethoscope className="size-3.5 text-accent" />} text={`${summary.department} · ${summary.doctor}`} />
        <SummaryChip icon={<CalendarDays className="size-3.5 text-accent" />} text={formatDate(summary.date)} />
        <SummaryChip icon={<Clock className="size-3.5 text-accent" />} text={summary.time} />
      </div>

      <button
        type="button"
        onClick={fillDemo}
        className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-800 transition hover:bg-amber-200"
      >
        <Sparkles className="size-3.5" />
        Demo: örnek bilgilerle doldur
      </button>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field id="fullName" label="Ad Soyad" required error={error('fullName')}>
            <input
              id="fullName"
              autoComplete="name"
              value={values.fullName}
              onChange={(e) => set('fullName', e.target.value)}
              onBlur={() => touch('fullName')}
              aria-invalid={!!error('fullName')}
              placeholder="Örn. Ayşe Yılmaz"
              className={inputClass(state('fullName'))}
            />
          </Field>
        </div>

        <Field id="tc" label="TC Kimlik No" required error={error('tc')} hint="Yabancı uyruklu hastalar YKN girebilir.">
          <div className="relative">
            <input
              id="tc"
              inputMode="numeric"
              autoComplete="off"
              maxLength={11}
              value={values.tc}
              onChange={(e) => set('tc', digitsOnly(e.target.value).slice(0, 11))}
              onBlur={() => touch('tc')}
              aria-invalid={!!error('tc')}
              placeholder="11 haneli kimlik numaranız"
              className={`${inputClass(state('tc'))} pr-10 tracking-wider`}
            />
            {state('tc') === 'valid' && <CircleCheck className="absolute right-3 top-1/2 size-5 -translate-y-1/2 text-emerald-500" />}
          </div>
        </Field>

        <Field id="phone" label="Cep Telefonu" required error={error('phone')} hint="Randevu onayı SMS ile gönderilir.">
          <div className="relative">
            <input
              id="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={values.phone}
              onChange={(e) => set('phone', formatPhone(e.target.value))}
              onBlur={() => touch('phone')}
              aria-invalid={!!error('phone')}
              placeholder="05XX XXX XX XX"
              className={`${inputClass(state('phone'))} pr-10`}
            />
            {state('phone') === 'valid' && <CircleCheck className="absolute right-3 top-1/2 size-5 -translate-y-1/2 text-emerald-500" />}
          </div>
        </Field>

        <div className="sm:col-span-2">
          <Field id="email" label="E-posta" error={error('email')} hint="İsteğe bağlı; randevu özeti e-postanıza da gönderilir.">
            <input
              id="email"
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
        </div>

        <div className="sm:col-span-2">
          <Field id="notes" label="Şikâyetiniz / Notlarınız" error={error('notes')}>
            <textarea
              id="notes"
              rows={3}
              value={values.notes}
              onChange={(e) => set('notes', e.target.value)}
              onBlur={() => touch('notes')}
              placeholder="Hekiminizin bilmesini istediğiniz kısa bir not (isteğe bağlı)"
              className={`${inputClass(error('notes') ? 'error' : undefined)} resize-none`}
            />
            <p className="mt-1 text-right text-xs text-slate-400">{values.notes.length}/500</p>
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
              className="mt-0.5 size-5 shrink-0 cursor-pointer rounded accent-accent"
            />
            <span>
              <strong className="text-navy">KVKK Aydınlatma Metni</strong>’ni okudum; kişisel ve sağlık verilerimin randevu işlemleri kapsamında
              işlenmesini ve Avrupa Birliği’ndeki sunucularda saklanmasını onaylıyorum.
            </span>
          </label>
          {error('consent') && <p className="mt-1.5 pl-8 text-xs font-medium text-emergency">{error('consent')}</p>}
        </div>
      </div>
    </form>
  );
}

function SummaryChip({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 ring-1 ring-slate-200">
      {icon}
      {text}
    </span>
  );
}
