import { getAuth, type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { app, db } from '../lib/firebase';

export const auth = getAuth(app);

// firestore.rules içindeki isAdmin() listesiyle aynı tutulmalıdır.
const ROOT_ADMIN_UIDS = ['yonetici-1'];

export async function checkIsAdmin(user: User) {
  if (ROOT_ADMIN_UIDS.includes(user.uid)) return true;
  try {
    return (await getDoc(doc(db, 'admins', user.uid))).exists();
  } catch {
    return false;
  }
}

export function authErrorMessage(code: string | undefined) {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
    case 'auth/invalid-email':
      return 'E-posta veya şifre hatalı.';
    case 'auth/too-many-requests':
      return 'Çok fazla deneme yapıldı. Lütfen birkaç dakika sonra tekrar deneyin.';
    case 'auth/network-request-failed':
      return 'İnternet bağlantısı kurulamadı.';
    default:
      return 'Giriş yapılamadı. Lütfen tekrar deneyin.';
  }
}
