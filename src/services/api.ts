import { digitsOnly } from '../lib/validation';

/**
 * Sitenin backend ile konuştuğu tek katman.
 * Firebase SDK'sı ilk kullanımda yüklenir; böylece ana sayfanın açılışı yavaşlamaz.
 * .env.local tanımlı değilse (ör. yeni bir geliştirici ortamı) demo modunda çalışır.
 */
export const backendEnabled = Boolean(import.meta.env.VITE_FIREBASE_PROJECT_ID);

export class SlotTakenError extends Error {
  constructor() {
    super('Seçilen saat dolu.');
  }
}

export class AlreadySubscribedError extends Error {
  constructor() {
    super('Bu e-posta zaten kayıtlı.');
  }
}

const loadFirestore = async () => {
  const [{ db }, firestore] = await Promise.all([import('../lib/firebase'), import('firebase/firestore')]);
  return { db, ...firestore };
};

const demoDelay = () => new Promise((resolve) => setTimeout(resolve, 900));

const isPermissionDenied = (error: unknown) => (error as { code?: string })?.code === 'permission-denied';

export const slotKey = (date: string, time: string) => `${date}_${time}`;

/** Hekimin `fromDate` tarihinden itibaren dolu saatleri ("YYYY-MM-DD_HH:MM"). */
export async function getBookedSlots(doctorId: string, fromDate: string) {
  if (!backendEnabled) return new Set<string>();
  const { db, collection, query, where, getDocs } = await loadFirestore();
  const snapshot = await getDocs(query(collection(db, 'slots'), where('doctorId', '==', doctorId), where('date', '>=', fromDate)));
  return new Set(snapshot.docs.map((d) => slotKey(d.get('date'), d.get('time'))));
}

export interface AppointmentInput {
  departmentId: string;
  doctorId: string;
  date: string;
  time: string;
  patient: { fullName: string; tc: string; phone: string; email: string; notes: string };
}

const makeCode = () => `MV-${Date.now().toString(36).slice(-4).toUpperCase()}${Math.random().toString(36).slice(2, 4).toUpperCase()}`;

/**
 * Randevu ve dolu-saat kaydını tek seferde (batch) yazar.
 * Saat başka biri tarafından alınmışsa güvenlik kuralları yazmayı reddeder → SlotTakenError.
 */
export async function createAppointment(input: AppointmentInput) {
  const code = makeCode();
  if (!backendEnabled) {
    await demoDelay();
    return code;
  }

  const { db, collection, doc, getDoc, writeBatch, serverTimestamp } = await loadFirestore();
  const slotId = `${input.doctorId}_${input.date}_${input.time}`;
  const slotRef = doc(db, 'slots', slotId);
  if ((await getDoc(slotRef)).exists()) throw new SlotTakenError();

  const appointmentRef = doc(collection(db, 'appointments'));
  const batch = writeBatch(db);
  batch.set(appointmentRef, {
    code,
    departmentId: input.departmentId,
    doctorId: input.doctorId,
    date: input.date,
    time: input.time,
    slotId,
    status: 'pending',
    createdAt: serverTimestamp(),
    patient: {
      fullName: input.patient.fullName.trim(),
      tc: input.patient.tc,
      phone: digitsOnly(input.patient.phone),
      email: input.patient.email.trim().toLowerCase(),
      notes: input.patient.notes.trim(),
    },
  });
  batch.set(slotRef, { doctorId: input.doctorId, date: input.date, time: input.time, appointmentId: appointmentRef.id });

  try {
    await batch.commit();
  } catch (error) {
    if (isPermissionDenied(error) && (await getDoc(slotRef)).exists()) throw new SlotTakenError();
    throw error;
  }
  return code;
}

export interface MessageInput {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export async function sendMessage(input: MessageInput) {
  if (!backendEnabled) return demoDelay();
  const { db, collection, addDoc, serverTimestamp } = await loadFirestore();
  await addDoc(collection(db, 'messages'), {
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    phone: digitsOnly(input.phone),
    subject: input.subject,
    message: input.message.trim(),
    read: false,
    createdAt: serverTimestamp(),
  });
}

export async function subscribeNewsletter(rawEmail: string) {
  if (!backendEnabled) return demoDelay();
  const email = rawEmail.trim().toLowerCase();
  const { db, doc, setDoc, serverTimestamp } = await loadFirestore();
  try {
    // Belge kimliği e-posta olduğu için aynı adres ikinci kez yazılamaz (kurallar "update"i reddeder).
    await setDoc(doc(db, 'subscribers', email), { email, createdAt: serverTimestamp() });
  } catch (error) {
    if (isPermissionDenied(error)) throw new AlreadySubscribedError();
    throw error;
  }
}
