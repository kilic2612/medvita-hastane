import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { ArrowLeft, ArrowRight, CalendarCheck, Check, LoaderCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { AppointmentPreset } from '../../context/AppointmentContext';
import { useToast } from '../../context/ToastContext';
import { getDepartment } from '../../data/departments';
import { doctorsIn, getDoctor } from '../../data/doctors';
import { site } from '../../data/site';
import { useForm } from '../../hooks/useForm';
import { formatDate, toDateKey } from '../../lib/format';
import { createAppointment, getBookedSlots, SlotTakenError } from '../../services/api';
import { hoverTap } from '../../lib/motion';
import { btn } from '../../lib/styles';
import { Modal } from '../ui/Modal';
import { AppointmentSuccess } from './AppointmentSuccess';
import { DateTimePicker } from './DateTimePicker';
import { DepartmentStep } from './DepartmentStep';
import { DoctorStep } from './DoctorStep';
import { emptyPatient, PatientStep, validatePatient, type PatientValues } from './PatientStep';
import { StepIndicator } from './StepIndicator';

const steps = ['Bölüm', 'Hekim', 'Tarih & Saat', 'Bilgileriniz'] as const;
const FORM_ID = 'appointment-patient-form';

const slide: Variants = {
  enter: (dir: number) => ({ x: dir * 48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir * -48, opacity: 0 }),
};

interface AppointmentModalProps {
  preset: AppointmentPreset;
  onClose: () => void;
}

export function AppointmentModal({ preset, onClose }: AppointmentModalProps) {
  const toast = useToast();
  const presetDoctor = preset.doctorId ? getDoctor(preset.doctorId) : undefined;

  const [departmentId, setDepartmentId] = useState(presetDoctor?.departmentId ?? preset.departmentId ?? '');
  const [doctorId, setDoctorId] = useState(presetDoctor?.id ?? '');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [step, setStep] = useState(presetDoctor ? 2 : preset.departmentId ? 1 : 0);
  const [direction, setDirection] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [code, setCode] = useState<string | null>(null);
  const form = useForm<PatientValues>(emptyPatient, validatePatient);
  const [booked, setBooked] = useState<Set<string> | null>(null);
  const [slotsVersion, setSlotsVersion] = useState(0);

  // Hekim seçildiğinde (veya saat çakışmasından sonra) dolu saatler veritabanından okunur.
  useEffect(() => {
    if (!doctorId) return;
    let active = true;
    setBooked(null);
    getBookedSlots(doctorId, toDateKey(new Date()))
      .then((slots) => active && setBooked(slots))
      .catch(() => {
        if (!active) return;
        setBooked(new Set());
        toast({ type: 'error', title: 'Müsaitlik bilgisi alınamadı', description: 'İnternet bağlantınızı kontrol edip tekrar deneyin.' });
      });
    return () => {
      active = false;
    };
  }, [doctorId, slotsVersion, toast]);

  const department = getDepartment(departmentId);
  const doctor = getDoctor(doctorId);
  const doctorName = doctor && `${doctor.title} ${doctor.name}`;

  const goTo = (target: number) => {
    setDirection(target > step ? 1 : -1);
    setStep(target);
  };

  // Seçim yapıldığında kısa bir gecikmeyle sonraki adıma geçilir; kullanıcı seçimini görür.
  const advanceSoon = (target: number) => window.setTimeout(() => goTo(target), 220);

  const selectDepartment = (id: string) => {
    if (id !== departmentId) {
      setDepartmentId(id);
      setDoctorId('');
      setDate('');
      setTime('');
    }
    advanceSoon(1);
  };

  const selectDoctor = (id: string) => {
    if (id !== doctorId) {
      setDoctorId(id);
      setDate('');
      setTime('');
    }
    advanceSoon(2);
  };

  const submit = async () => {
    if (submitting) return;
    if (!form.isValid) {
      form.touchAll();
      toast({ type: 'error', title: 'Eksik veya hatalı bilgi', description: 'Lütfen işaretli alanları kontrol edin.' });
      return;
    }
    setSubmitting(true);
    try {
      const { fullName, tc, phone, email, notes } = form.values;
      const newCode = await createAppointment({ departmentId, doctorId, date, time, patient: { fullName, tc, phone, email, notes } });
      setCode(newCode);
      toast({
        type: 'success',
        title: 'Randevunuz oluşturuldu!',
        description: `${doctorName} · ${formatDate(date)} ${time}`,
      });
    } catch (error) {
      if (error instanceof SlotTakenError) {
        // Bilgiler formda korunur; kullanıcı yalnızca yeni bir saat seçer.
        toast({ type: 'error', title: 'Bu saat az önce doldu', description: 'Lütfen başka bir saat seçin, bilgileriniz korunuyor.' });
        setTime('');
        setSlotsVersion((v) => v + 1);
        goTo(2);
      } else {
        toast({ type: 'error', title: 'Randevu oluşturulamadı', description: `Lütfen tekrar deneyin veya ${site.phone} numaralı çağrı merkezimizi arayın.` });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const canProceed = [!!department, !!doctor, !!date && !!time, true][step];

  return (
    <Modal onClose={onClose} label="Online randevu" className="max-w-3xl">
      <header className="border-b border-slate-100 px-6 pb-5 pt-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-2xl bg-linear-to-br from-accent to-mint text-white shadow-lg shadow-sky-500/30">
              <CalendarCheck className="size-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-navy">Online Randevu</h2>
              <p className="text-sm text-slate-500">{code ? 'İşleminiz tamamlandı' : `Adım ${step + 1} / ${steps.length} · ${steps[step]}`}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Kapat"
            className="grid size-10 place-items-center rounded-full bg-slate-100 text-slate-500 transition hover:rotate-90 hover:bg-slate-200 hover:text-navy"
          >
            <X className="size-5" />
          </button>
        </div>
        {!code && (
          <div className="mt-5">
            <StepIndicator steps={steps} current={step} onStepClick={goTo} />
          </div>
        )}
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-6 py-6 sm:min-h-[24rem]">
        {code ? (
          <AppointmentSuccess
            code={code}
            patient={form.values.fullName.trim()}
            tc={form.values.tc}
            phone={form.values.phone}
            department={department?.name}
            doctor={doctorName}
            date={date}
            time={time}
            onClose={onClose}
          />
        ) : (
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={step}
              custom={direction}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              {step === 0 && <DepartmentStep selected={departmentId} onSelect={selectDepartment} />}
              {step === 1 && (
                <DoctorStep doctors={doctorsIn(departmentId)} departmentName={department?.name} selected={doctorId} onSelect={selectDoctor} />
              )}
              {step === 2 && doctor && (
                <DateTimePicker
                  booked={booked}
                  date={date}
                  time={time}
                  onDate={(d) => {
                    setDate(d);
                    setTime('');
                  }}
                  onTime={setTime}
                />
              )}
              {step === 3 && (
                <PatientStep form={form} formId={FORM_ID} onSubmit={submit} summary={{ department: department?.name, doctor: doctorName, date, time }} />
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {!code && (
        <footer className="flex items-center justify-between gap-3 border-t border-slate-100 bg-surface/80 px-6 py-4">
          <button type="button" onClick={() => goTo(step - 1)} disabled={step === 0} className={`${btn.outline} disabled:invisible`}>
            <ArrowLeft className="size-4" />
            Geri
          </button>
          {step === 3 ? (
            <motion.button type="submit" form={FORM_ID} {...hoverTap} disabled={submitting} className={btn.primary}>
              {submitting ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" />
                  Gönderiliyor…
                </>
              ) : (
                <>
                  Randevuyu Onayla
                  <Check className="size-4" strokeWidth={3} />
                </>
              )}
            </motion.button>
          ) : (
            <motion.button type="button" {...hoverTap} onClick={() => canProceed && goTo(step + 1)} disabled={!canProceed} className={btn.primary}>
              Devam
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </motion.button>
          )}
        </footer>
      )}
    </Modal>
  );
}
