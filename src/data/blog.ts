import type { LucideIcon } from 'lucide-react';
import { Brain, Eye, HeartPulse, Monitor, Salad, ShieldCheck } from 'lucide-react';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: number;
  date: string;
  authorId: string;
  icon: LucideIcon;
  gradient: string;
  content: string[];
}

export const blogPosts: BlogPost[] = [
  {
    id: 'kalp-sagligi',
    title: 'Kalp Sağlığınızı Korumanın 7 Altın Kuralı',
    excerpt: 'Kalp hastalıklarının büyük bölümü yaşam tarzı değişiklikleriyle önlenebilir. Bugünden başlayabileceğiniz basit ama etkili adımlar.',
    category: 'Kardiyoloji',
    readTime: 6,
    date: '2026-10-14',
    authorId: 'ahmet-yilmaz',
    icon: HeartPulse,
    gradient: 'from-rose-500 to-red-500',
    content: [
      'Kalp ve damar hastalıkları dünyada önde gelen ölüm nedenleri arasında yer alıyor. İyi haber şu ki risk faktörlerinin önemli bir kısmı kontrol edilebilir.',
      'Haftada en az 150 dakika orta tempolu egzersiz yapın; tempolu yürüyüş, yüzme veya bisiklet iyi seçeneklerdir. Sigarayı bırakmak, kalp krizi riskini kısa sürede belirgin şekilde azaltır.',
      'Tuz tüketiminizi sınırlayın, sebze, meyve, tam tahıl ve baklagilleri sofranızın merkezine koyun. İşlenmiş gıdalar ve trans yağlardan uzak durun.',
      'Tansiyon, kolesterol ve kan şekeri değerlerinizi düzenli olarak ölçtürün. Bu değerler çoğu zaman belirti vermeden yükselir.',
      'Kaliteli uyku, stres yönetimi ve ideal kiloyu korumak da en az ilaç kadar değerlidir. Göğüs ağrısı, nefes darlığı veya çarpıntı yaşarsanız vakit kaybetmeden bir kardiyoloğa başvurun.',
    ],
  },
  {
    id: 'migren',
    title: 'Migren mi, Gerilim Tipi Baş Ağrısı mı? Farkı Nasıl Anlarsınız?',
    excerpt: 'Her baş ağrısı aynı değildir. Ağrının karakteri, süresi ve eşlik eden belirtiler doğru tedavinin anahtarıdır.',
    category: 'Nöroloji',
    readTime: 5,
    date: '2026-10-08',
    authorId: 'zeynep-arslan',
    icon: Brain,
    gradient: 'from-violet-500 to-purple-600',
    content: [
      'Migren genellikle başın tek tarafında, zonklayıcı karakterde ve orta-şiddetli bir ağrıdır. Bulantı, ışık ve sese hassasiyet sıklıkla eşlik eder.',
      'Gerilim tipi baş ağrısı ise çoğunlukla başın iki yanında, sıkıştırıcı ya da bant gibi hissedilir ve günlük aktivitelerle kötüleşmez.',
      'Ağrı günlüğü tutmak; tetikleyicileri (uykusuzluk, açlık, stres, bazı yiyecekler) belirlemenize ve hekiminizle daha verimli bir görüşme yapmanıza yardımcı olur.',
      'Ani başlayan "hayatınızın en şiddetli" baş ağrısı, konuşma bozukluğu, kol-bacakta güçsüzlük veya bilinç değişikliği acil değerlendirme gerektirir.',
    ],
  },
  {
    id: 'cocuk-bagisiklik',
    title: 'Çocuklarda Bağışıklığı Destekleyen Beslenme Önerileri',
    excerpt: 'Okul dönemiyle artan enfeksiyonlara karşı dengeli beslenme, uyku ve hareketin gücü.',
    category: 'Çocuk Sağlığı',
    readTime: 4,
    date: '2026-09-29',
    authorId: 'ayse-celik',
    icon: Salad,
    gradient: 'from-sky-500 to-cyan-500',
    content: [
      'Güçlü bir bağışıklık sistemi için mucize gıdalar yerine dengeli ve çeşitli bir beslenme düzeni esastır.',
      'Her öğünde renkli sebze ve meyvelere yer verin; yoğurt, kefir gibi fermente gıdalar bağırsak sağlığını destekler.',
      'Yaşına uygun uyku süresi ve günlük en az bir saat fiziksel aktivite, bağışıklık için beslenme kadar önemlidir.',
      'Aşı takviminin eksiksiz uygulanması en etkili korunma yöntemlerinden biridir. Takviye vitaminleri hekiminize danışmadan kullanmayın.',
    ],
  },
  {
    id: 'bel-boyun',
    title: 'Masa Başı Çalışanlar İçin Bel ve Boyun Sağlığı',
    excerpt: 'Uzun süre oturmanın kas-iskelet sistemine etkileri ve ofiste uygulayabileceğiniz ergonomi önerileri.',
    category: 'Ortopedi',
    readTime: 5,
    date: '2026-09-18',
    authorId: 'burak-sahin',
    icon: Monitor,
    gradient: 'from-amber-500 to-orange-500',
    content: [
      'Ekranınızın üst kenarı göz hizanızda, klavyeniz dirsek yüksekliğinde olmalı. Ayaklarınız yere tam basmalı ve beliniz sandalyenin sırtlığına destek almalı.',
      'Her 30–45 dakikada bir kalkıp birkaç dakika hareket edin. Basit boyun ve omuz germe egzersizleri kas gerginliğini azaltır.',
      'Düzenli egzersizle güçlendirilen karın ve sırt kasları, bel ağrılarına karşı en iyi korumadır.',
      'Bacağa yayılan ağrı, uyuşma veya güç kaybı gibi belirtilerde bir ortopedi uzmanına başvurmayı ertelemeyin.',
    ],
  },
  {
    id: 'check-up',
    title: 'Check-up Neden Önemli? Yaşınıza Göre Yapılması Gereken Testler',
    excerpt: 'Pek çok hastalık erken evrede belirti vermez. Düzenli check-up ile erken tanının gücünü keşfedin.',
    category: 'Koruyucu Hekimlik',
    readTime: 7,
    date: '2026-09-05',
    authorId: 'gizem-erdem',
    icon: ShieldCheck,
    gradient: 'from-teal-500 to-emerald-500',
    content: [
      'Check-up, herhangi bir şikâyetiniz yokken sağlık durumunuzun kapsamlı olarak değerlendirilmesidir ve hastalıkların erken evrede yakalanmasını sağlar.',
      '20–30 yaş aralığında kan sayımı, kan şekeri, kolesterol ve tiroid testleri temel değerlendirme için genellikle yeterlidir.',
      '40 yaşından sonra kardiyolojik değerlendirme, kanser taramaları (mamografi, kolon taraması gibi) ve göz tansiyonu ölçümü programa eklenir.',
      'Hangi testlerin size uygun olduğu yaş, cinsiyet, aile öyküsü ve yaşam tarzınıza göre hekiminiz tarafından belirlenmelidir.',
    ],
  },
  {
    id: 'goz-sagligi',
    title: 'Ekran Başında Göz Sağlığı: 20-20-20 Kuralı',
    excerpt: 'Dijital göz yorgunluğunu azaltmanın en pratik yolu ve göz kuruluğuna karşı alınabilecek önlemler.',
    category: 'Göz Sağlığı',
    readTime: 3,
    date: '2026-08-27',
    authorId: 'cem-aksoy',
    icon: Eye,
    gradient: 'from-cyan-500 to-blue-500',
    content: [
      'Her 20 dakikada bir, 20 saniye boyunca yaklaşık 6 metre (20 feet) uzağa bakın. Bu basit alışkanlık odaklanma kaslarınızı dinlendirir.',
      'Ekrana bakarken göz kırpma sayısı azalır; bilinçli olarak sık göz kırpmak kuruluk hissini hafifletir.',
      'Ekran parlaklığını ortam ışığına göre ayarlayın ve ekranı göz hizasının biraz altında, kol mesafesinde konumlandırın.',
      'Bulanık görme, sık baş ağrısı veya geçmeyen kuruluk varsa yıllık göz muayenenizi aksatmayın.',
    ],
  },
];
