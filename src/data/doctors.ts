export interface Doctor {
  id: string;
  title: string;
  name: string;
  departmentId: string;
  specialty: string;
  experience: number;
  rating: number;
  reviews: number;
  photo: string;
  languages: string[];
}

// Örnek portreler (kaynak: randomuser.me) public/doctors altında siteyle birlikte sunulur; dış sunucuya istek gitmez.
const portrait = (gender: 'men' | 'women', n: number) => `/doctors/${gender}-${n}.jpg`;

export const doctors: Doctor[] = [
  { id: 'ahmet-yilmaz', title: 'Prof. Dr.', name: 'Ahmet Yılmaz', departmentId: 'kardiyoloji', specialty: 'Girişimsel Kardiyoloji', experience: 24, rating: 4.9, reviews: 312, photo: portrait('men', 32), languages: ['TR', 'EN'] },
  { id: 'elif-demir', title: 'Uzm. Dr.', name: 'Elif Demir', departmentId: 'kardiyoloji', specialty: 'Kardiyoloji Uzmanı', experience: 11, rating: 4.8, reviews: 198, photo: portrait('women', 44), languages: ['TR', 'EN'] },
  { id: 'mehmet-kaya', title: 'Doç. Dr.', name: 'Mehmet Kaya', departmentId: 'noroloji', specialty: 'Nöroloji & Epilepsi', experience: 16, rating: 4.9, reviews: 241, photo: portrait('men', 45), languages: ['TR', 'DE'] },
  { id: 'zeynep-arslan', title: 'Uzm. Dr.', name: 'Zeynep Arslan', departmentId: 'noroloji', specialty: 'Baş Ağrısı & Migren', experience: 9, rating: 4.7, reviews: 126, photo: portrait('women', 65), languages: ['TR', 'EN'] },
  { id: 'can-ozturk', title: 'Prof. Dr.', name: 'Can Öztürk', departmentId: 'ortopedi', specialty: 'Protez & Eklem Cerrahisi', experience: 22, rating: 4.9, reviews: 287, photo: portrait('men', 52), languages: ['TR', 'EN'] },
  { id: 'burak-sahin', title: 'Op. Dr.', name: 'Burak Şahin', departmentId: 'ortopedi', specialty: 'Spor Yaralanmaları', experience: 12, rating: 4.8, reviews: 174, photo: portrait('men', 22), languages: ['TR', 'EN'] },
  { id: 'ayse-celik', title: 'Uzm. Dr.', name: 'Ayşe Çelik', departmentId: 'pediatri', specialty: 'Çocuk Sağlığı Uzmanı', experience: 14, rating: 5.0, reviews: 402, photo: portrait('women', 68), languages: ['TR', 'EN'] },
  { id: 'selin-koc', title: 'Uzm. Dr.', name: 'Selin Koç', departmentId: 'pediatri', specialty: 'Yenidoğan & Çocuk Alerjisi', experience: 8, rating: 4.8, reviews: 156, photo: portrait('women', 26), languages: ['TR'] },
  { id: 'emre-aydin', title: 'Dt.', name: 'Emre Aydın', departmentId: 'dis', specialty: 'İmplantoloji & Estetik', experience: 10, rating: 4.8, reviews: 233, photo: portrait('men', 75), languages: ['TR', 'EN', 'AR'] },
  { id: 'murat-dogan', title: 'Op. Dr.', name: 'Murat Doğan', departmentId: 'genel-cerrahi', specialty: 'Laparoskopik Cerrahi', experience: 18, rating: 4.9, reviews: 219, photo: portrait('men', 41), languages: ['TR', 'EN'] },
  { id: 'deniz-yildiz', title: 'Uzm. Dr.', name: 'Deniz Yıldız', departmentId: 'radyoloji', specialty: 'Girişimsel Radyoloji', experience: 13, rating: 4.7, reviews: 98, photo: portrait('women', 33), languages: ['TR', 'EN'] },
  { id: 'cem-aksoy', title: 'Op. Dr.', name: 'Cem Aksoy', departmentId: 'goz', specialty: 'Katarakt & Refraktif Cerrahi', experience: 15, rating: 4.9, reviews: 265, photo: portrait('men', 61), languages: ['TR', 'EN', 'RU'] },
  { id: 'gizem-erdem', title: 'Uzm. Dr.', name: 'Gizem Erdem', departmentId: 'laboratuvar', specialty: 'Tıbbi Biyokimya', experience: 10, rating: 4.7, reviews: 84, photo: portrait('women', 50), languages: ['TR'] },
];

export const getDoctor = (id: string) => doctors.find((d) => d.id === id);
export const doctorsIn = (departmentId: string) => doctors.filter((d) => d.departmentId === departmentId);
