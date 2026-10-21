// Örnek liste; hastanenin güncel anlaşmalarıyla değiştirilmelidir.
export type InsuranceType = 'public' | 'private' | 'tss' | 'international';

export const insuranceTypeLabels: Record<InsuranceType, string> = {
  public: 'Kamu (SGK)',
  private: 'Özel Sağlık Sigortası',
  tss: 'Tamamlayıcı (TSS)',
  international: 'Uluslararası',
};

export interface Insurance {
  name: string;
  /** Logo yerine gösterilen kısaltma; verilmezse ilk iki kelimenin baş harfleri kullanılır. */
  short?: string;
  types: InsuranceType[];
}

export const insurances: Insurance[] = [
  { name: 'Sosyal Güvenlik Kurumu', short: 'SGK', types: ['public'] },
  { name: 'Emekli Sandığı', types: ['public'] },
  { name: 'Bağ-Kur', short: 'BK', types: ['public'] },
  { name: 'Allianz Sigorta', types: ['private', 'tss'] },
  { name: 'AXA Sigorta', types: ['private', 'tss'] },
  { name: 'Anadolu Sigorta', types: ['private', 'tss'] },
  { name: 'Mapfre Sigorta', types: ['private', 'tss'] },
  { name: 'HDI Sigorta', types: ['private'] },
  { name: 'Groupama Sigorta', types: ['private', 'tss'] },
  { name: 'Türkiye Sigorta', types: ['private', 'tss'] },
  { name: 'Sompo Sigorta', types: ['private'] },
  { name: 'Doğa Sigorta', types: ['private', 'tss'] },
  { name: 'Quick Sigorta', types: ['private', 'tss'] },
  { name: 'Bupa Acıbadem Sigorta', types: ['private', 'tss'] },
  { name: 'Ankara Sigorta', types: ['private'] },
  { name: 'Unico Sigorta', types: ['private'] },
  { name: 'Allianz Care', types: ['international'] },
  { name: 'Cigna Global', types: ['international'] },
  { name: 'Bupa Global', types: ['international'] },
  { name: 'International SOS', types: ['international'] },
];
