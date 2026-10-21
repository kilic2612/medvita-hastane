// Örnek metinlerdir; yayından önce hastanenin hukuk birimi tarafından güncellenmelidir.
export type LegalDocId = 'hasta-haklari' | 'kvkk' | 'cerez';

export const legalDocs: Record<LegalDocId, { title: string; paragraphs: string[] }> = {
  'hasta-haklari': {
    title: 'Hasta Hakları',
    paragraphs: [
      'Hasta Hakları Yönetmeliği kapsamında, hastanemize başvuran her hasta aşağıdaki haklara sahiptir:',
      'Sağlık durumu, uygulanacak tıbbi işlemler ve olası riskler hakkında bilgi isteme; sağlık kuruluşunu ve hekimini seçme ve değiştirme.',
      'Mahremiyetine saygı gösterilmesi, kişisel ve tıbbi bilgilerinin gizli tutulması; saygı, nezaket ve şefkat içerisinde hizmet alma.',
      'Tedaviyi reddetme veya durdurma, güvenli bir ortamda hizmet alma, mevzuatın izin verdiği ölçüde refakatçi bulundurma ve ziyaretçi kabul etme.',
      'Haklarının ihlal edildiğini düşündüğünde Hasta İletişim Birimi aracılığıyla başvuru ve şikâyette bulunma.',
    ],
  },
  kvkk: {
    title: 'KVKK Aydınlatma Metni',
    paragraphs: [
      '6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca hastanemiz, veri sorumlusu sıfatıyla kişisel verilerinizi aşağıda açıklanan kapsamda işlemektedir.',
      'Kimlik, iletişim ve sağlık verileriniz; randevu oluşturulması, tıbbi teşhis ve tedavi hizmetlerinin yürütülmesi, faturalandırma ve yasal yükümlülüklerin yerine getirilmesi amaçlarıyla işlenir.',
      'Verileriniz, mevzuatın öngördüğü durumlarda Sağlık Bakanlığı, SGK, özel sigorta şirketleri ve yetkili kamu kurumlarıyla paylaşılabilir.',
      'Online randevu ve iletişim formları aracılığıyla ilettiğiniz bilgiler, hizmet sağlayıcımız Google Cloud’un Avrupa Birliği’ndeki (Frankfurt) veri merkezlerinde şifrelenerek saklanır ve yalnızca yetkili hastane personeli tarafından görüntülenebilir.',
      'KVKK’nın 11. maddesi kapsamında verilerinizin işlenip işlenmediğini öğrenme, düzeltilmesini veya silinmesini isteme ve işlemeye itiraz etme haklarına sahipsiniz.',
    ],
  },
  cerez: {
    title: 'Çerez Politikası',
    paragraphs: [
      'Web sitemizde, sitenin düzgün çalışması ve kullanıcı deneyiminin iyileştirilmesi amacıyla zorunlu çerezler kullanılmaktadır.',
      'Harita gibi üçüncü taraf içerikler yalnızca siz yüklemeyi onayladığınızda etkinleştirilir ve bu hizmetlerin kendi çerez politikalarına tabidir.',
      'Tarayıcı ayarlarınızdan çerezleri dilediğiniz zaman silebilir veya engelleyebilirsiniz.',
    ],
  },
};
