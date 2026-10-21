import type { LucideIcon } from 'lucide-react';
import { Baby, Bone, Brain, Eye, HeartPulse, Microscope, ScanLine, Scissors, Smile } from 'lucide-react';

export type DepartmentCategory = 'surgical' | 'internal' | 'diagnostic';

export const categoryLabels: Record<DepartmentCategory, string> = {
  surgical: 'Cerrahi',
  internal: 'Dahili',
  diagnostic: 'Tanısal',
};

export interface Department {
  id: string;
  name: string;
  category: DepartmentCategory;
  icon: LucideIcon;
  gradient: string;
  summary: string;
  description: string;
  treatments: string[];
}

export const departments: Department[] = [
  {
    id: 'kardiyoloji',
    name: 'Kardiyoloji',
    category: 'internal',
    icon: HeartPulse,
    gradient: 'from-rose-500 to-red-500',
    summary: 'Kalp ve damar hastalıklarında ileri tanı ve tedavi.',
    description:
      'Koroner arter hastalığından ritim bozukluklarına kadar tüm kalp ve damar sorunlarında, girişimsel kardiyoloji laboratuvarımız ve deneyimli ekibimizle kapsamlı tanı ve tedavi hizmeti sunuyoruz.',
    treatments: ['Efor testi & EKG', 'Ekokardiyografi', 'Koroner anjiyografi', 'Ritim Holter takibi', 'Hipertansiyon yönetimi'],
  },
  {
    id: 'noroloji',
    name: 'Nöroloji',
    category: 'internal',
    icon: Brain,
    gradient: 'from-violet-500 to-purple-600',
    summary: 'Beyin, omurilik ve sinir sistemi hastalıkları.',
    description:
      'Migren, epilepsi, inme, Parkinson ve Alzheimer gibi nörolojik hastalıklarda EEG ve EMG laboratuvarlarımız eşliğinde doğru tanı ve kişiye özel tedavi planları oluşturuyoruz.',
    treatments: ['EEG & EMG', 'Migren tedavisi', 'İnme takibi', 'Epilepsi yönetimi', 'Uyku bozuklukları'],
  },
  {
    id: 'ortopedi',
    name: 'Ortopedi ve Travmatoloji',
    category: 'surgical',
    icon: Bone,
    gradient: 'from-amber-500 to-orange-500',
    summary: 'Kas, kemik ve eklem sağlığında cerrahi çözümler.',
    description:
      'Spor yaralanmaları, eklem protezleri, omurga sorunları ve kırık tedavilerinde artroskopik ve minimal invaziv yöntemlerle hızlı iyileşmeyi hedefliyoruz.',
    treatments: ['Diz & kalça protezi', 'Artroskopik cerrahi', 'Spor yaralanmaları', 'Omurga cerrahisi', 'Kırık tedavisi'],
  },
  {
    id: 'pediatri',
    name: 'Çocuk Sağlığı ve Hastalıkları',
    category: 'internal',
    icon: Baby,
    gradient: 'from-sky-500 to-cyan-500',
    summary: 'Yenidoğandan ergenliğe çocuklarınızın sağlığı.',
    description:
      'Yenidoğan takibinden aşı programlarına, büyüme-gelişme izleminden çocukluk çağı enfeksiyonlarına kadar çocuk dostu ortamımızda bütüncül bakım sağlıyoruz.',
    treatments: ['Sağlam çocuk takibi', 'Aşı programı', 'Yenidoğan bakımı', 'Büyüme & gelişme', 'Çocuk alerjisi'],
  },
  {
    id: 'dis',
    name: 'Ağız ve Diş Sağlığı',
    category: 'surgical',
    icon: Smile,
    gradient: 'from-teal-500 to-emerald-500',
    summary: 'Estetik ve koruyucu diş hekimliği.',
    description:
      'İmplant, ortodonti, estetik diş hekimliği ve kanal tedavilerinde dijital görüntüleme ve konforlu tedavi yaklaşımlarıyla gülüşünüzü koruyoruz.',
    treatments: ['İmplant tedavisi', 'Ortodonti', 'Diş beyazlatma', 'Kanal tedavisi', 'Zirkonyum kaplama'],
  },
  {
    id: 'genel-cerrahi',
    name: 'Genel Cerrahi',
    category: 'surgical',
    icon: Scissors,
    gradient: 'from-blue-600 to-indigo-600',
    summary: 'Laparoskopik ve minimal invaziv cerrahi.',
    description:
      'Safra kesesi, fıtık, tiroid, meme ve sindirim sistemi cerrahisinde kapalı (laparoskopik) yöntemlerle daha az ağrı ve daha kısa hastanede kalış süresi sağlıyoruz.',
    treatments: ['Laparoskopik cerrahi', 'Fıtık ameliyatları', 'Tiroid cerrahisi', 'Meme cerrahisi', 'Obezite cerrahisi'],
  },
  {
    id: 'radyoloji',
    name: 'Radyoloji',
    category: 'diagnostic',
    icon: ScanLine,
    gradient: 'from-slate-600 to-slate-800',
    summary: 'Yüksek çözünürlüklü görüntüleme hizmetleri.',
    description:
      '3 Tesla MR, düşük dozlu BT, dijital mamografi ve ultrason cihazlarımızla hızlı ve güvenilir görüntüleme; sonuçlarınız online olarak erişiminizde.',
    treatments: ['3T MR', 'Bilgisayarlı tomografi', 'Dijital mamografi', 'Doppler ultrason', 'Kemik dansitometrisi'],
  },
  {
    id: 'goz',
    name: 'Göz Hastalıkları',
    category: 'surgical',
    icon: Eye,
    gradient: 'from-cyan-500 to-blue-500',
    summary: 'Lazer ve katarakt cerrahisinde ileri teknoloji.',
    description:
      'Katarakt, glokom, retina hastalıkları ve refraktif (lazer) cerrahide son nesil cihazlarla görme kalitenizi korumak ve artırmak için çalışıyoruz.',
    treatments: ['Katarakt cerrahisi', 'Lazer (LASIK/LASEK)', 'Glokom takibi', 'Retina tedavileri', 'Çocuk göz muayenesi'],
  },
  {
    id: 'laboratuvar',
    name: 'Tıbbi Laboratuvar',
    category: 'diagnostic',
    icon: Microscope,
    gradient: 'from-fuchsia-500 to-pink-500',
    summary: 'Hızlı ve güvenilir laboratuvar testleri.',
    description:
      'Biyokimya, hematoloji, mikrobiyoloji ve hormon testlerini tam otomatik sistemlerle çalışıyor; sonuçlarınızı aynı gün içinde SMS ve online olarak iletiyoruz.',
    treatments: ['Check-up paketleri', 'Hormon testleri', 'Hematoloji', 'Mikrobiyoloji', 'Vitamin & mineral'],
  },
];

export const getDepartment = (id: string) => departments.find((d) => d.id === id);
