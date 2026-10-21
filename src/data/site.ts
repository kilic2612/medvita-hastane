// Hastaneye özel bilgiler tek yerden yönetilir. MedVita hayali bir kurumdur; tüm iletişim bilgileri örnektir.
export const site = {
  nameParts: ['Med', 'Vita'] as const,
  logoSubtitle: 'Özel Hastanesi',
  fullName: 'MedVita Özel Hastanesi',
  emergencyPhone: '0850 222 0 112',
  emergencyTel: '+908502220112',
  phone: '0850 222 0 100',
  tel: '+908502220100',
  email: 'demo@medvita.example',
  address: 'Örnek Mah. Sağlık Cad. No: 1, Antakya / Hatay',
  mapQuery: 'Antakya, Hatay',
  hours: [
    { day: 'Pazartesi – Cuma', time: '08:00 – 20:00' },
    { day: 'Cumartesi', time: '09:00 – 17:00' },
    { day: 'Pazar', time: 'Poliklinik kapalı' },
    { day: 'Acil Servis', time: '7/24 açık', highlight: true },
  ],
  social: {
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
    x: 'https://x.com',
    linkedin: 'https://linkedin.com',
    youtube: 'https://youtube.com',
  },
};

export const navLinks = [
  { id: 'home', label: 'Ana Sayfa' },
  { id: 'departments', label: 'Bölümler' },
  { id: 'doctors', label: 'Doktorlar' },
  { id: 'about', label: 'Hakkımızda' },
  { id: 'blog', label: 'Sağlık Rehberi' },
  { id: 'contact', label: 'İletişim' },
];
