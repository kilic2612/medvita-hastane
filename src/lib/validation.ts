// TC Kimlik No algoritması (99 ile başlayan Yabancı Kimlik Numaraları da aynı kurala uyar).
export function isValidTC(value: string) {
  if (!/^[1-9]\d{10}$/.test(value)) return false;
  const d = value.split('').map(Number);
  const odd = d[0] + d[2] + d[4] + d[6] + d[8];
  const even = d[1] + d[3] + d[5] + d[7];
  const tenth = (((odd * 7 - even) % 10) + 10) % 10;
  const eleventh = d.slice(0, 10).reduce((sum, n) => sum + n, 0) % 10;
  return tenth === d[9] && eleventh === d[10];
}

export const digitsOnly = (value: string) => value.replace(/\D/g, '');

/** "5321234567" → "0532 123 45 67" */
export function formatPhone(value: string) {
  let digits = digitsOnly(value);
  if (digits && !digits.startsWith('0')) digits = `0${digits}`;
  digits = digits.slice(0, 11);
  return [digits.slice(0, 4), digits.slice(4, 7), digits.slice(7, 9), digits.slice(9, 11)].filter(Boolean).join(' ');
}

export const isValidMobile = (value: string) => /^05\d{9}$/.test(digitsOnly(value));
export const isValidPhone = (value: string) => /^0[2-5]\d{9}$/.test(digitsOnly(value));
export const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());

const trMap: Record<string, string> = { ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u', â: 'a', î: 'i', û: 'u' };

/** Türkçe karakterlere duyarsız arama için metni sadeleştirir ("Ayşe" → "ayse"). */
export const normalize = (value: string) =>
  value
    .toLocaleLowerCase('tr-TR')
    .replace(/[çğıöşüâîû]/g, (c) => trMap[c] ?? c)
    .trim();
