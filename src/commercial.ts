// Freemium Licensing, WhatsApp Sales Checkout, Parental Gate & Screen Time Engine
// Aligned with high-conversion educational digital product standards

const STORAGE_KEY_VIP = 'anatomi_tubuh_vip_status';
const STORAGE_KEY_LIMIT = 'anatomi_tubuh_screen_limit_mins';
const STORAGE_KEY_SESSION_START = 'anatomi_tubuh_session_start_ts';

export interface CommercialPlan {
  id: 'personal' | 'school';
  name: string;
  badge: string;
  price: string;
  originalPrice: string;
  discountBadge: string;
  targetAudience: string;
  features: string[];
  isPopular?: boolean;
}

export const COMMERCIAL_PLANS: CommercialPlan[] = [
  {
    id: 'personal',
    name: 'Paket Dokter Cilik Mandiri',
    badge: 'Pilihan Favorit Keluarga',
    price: 'Rp 49.000',
    originalPrice: 'Rp 149.000',
    discountBadge: 'Diskon 67%',
    targetAudience: 'Untuk 1 Anak & Pendampingan Orang Tua di Rumah',
    features: [
      'Akses seumur hidup (Lifetime Access) tanpa biaya bulanan',
      'Buka seluruh 5 Level Bedah Anatomi & 12 Organ 3D',
      'Buka Bank Soal 30 Kuis Evaluasi Kurikulum Merdeka',
      'Buka Simulator Alur Pencernaan, Sirkulasi & Pernapasan',
      'Cetak Piagam Penghargaan Dokter Cilik Resmi A4',
      'Cetak Lembar Kerja Mewarnai & Teka-Teki Silang',
      'Bebas Iklan & Dilengkapi Fitur Pembatas Waktu Layar (Screen Time)'
    ],
    isPopular: true
  },
  {
    id: 'school',
    name: 'Paket Lisensi Guru & Laboratorium Sekolah',
    badge: 'Rekomendasi Institusi Pendidikan',
    price: 'Rp 149.000',
    originalPrice: 'Rp 399.000',
    discountBadge: 'Diskon 63%',
    targetAudience: 'Untuk Guru SD/SMP, Kelas Belajar, & Lembaga Kursus Sains',
    features: [
      'Lisensi Multi-Device (Bisa dibuka di hingga 30 komputer/tablet siswa)',
      'Hak Cetak Tanpa Batas Seluruh LKPD & Sertifikat Siswa Se-Sekolah',
      'Bonus Modul Ajar IPAS & Rencana Pembelajaran Kurikulum Merdeka',
      'Rubrik Penilaian & Lembar Raport Evaluasi Portofolio Siswa',
      'Dukungan Teknis Prioritas via WhatsApp VIP Admin',
      'Update Konten Edukasi & Soal Baru Selamanya Gratis'
    ]
  }
];

const VALID_ACTIVATION_CODES = [
  'ANATOMI-VIP-2026',
  'DOKTER-INDONESIA',
  'SPESIALIS-BEDAH',
  'MERDEKA-BELAJAR',
  'PRO-DOKTER-CILIK',
  'GURU-JUARA-2026',
  'SEKOLAH-SEHAT'
];

class CommercialManager {
  private isVip: boolean = false;
  private currentChallenge: { question: string; answer: number } | null = null;
  private screenTimeLimit: number = 0;

  constructor() {
    this.isVip = this.loadVipStatus();
    try {
      const val = localStorage.getItem(STORAGE_KEY_LIMIT);
      if (val) this.screenTimeLimit = Number(val);
    } catch {}
  }

  public hasVipAccess(): boolean {
    return this.isVip;
  }

  public isLevelLocked(levelId: number): boolean {
    if (this.isVip) return false;
    return levelId > 2; // Levels 1 and 2 are 100% free demo
  }

  // Generate WhatsApp Direct Order Link
  public getWhatsAppOrderUrl(planId: 'personal' | 'school' = 'personal', parentName: string = ''): string {
    const plan = COMMERCIAL_PLANS.find(p => p.id === planId) || COMMERCIAL_PLANS[0];
    const adminPhone = '6281234567890'; // WhatsApp sales number
    const text = `Halo Admin Anatomi Tubuh Kita! 🩺✨%0A%0ASaya ingin memesan lisensi *${plan.name}* (${plan.price}).%0ANama Pemesan: ${encodeURIComponent(parentName || 'Orang Tua / Guru')}%0A%0AMohon panduan nomor rekening dan kode aktivasi VIP-nya. Terima kasih!`;
    return `https://api.whatsapp.com/send?phone=${adminPhone}&text=${text}`;
  }

  // Parental Gate Security Challenge (Simple arithmetic to prevent accidental kid purchases)
  public generateParentalChallenge(): { question: string; answer: number } {
    const a = Math.floor(Math.random() * 6) + 3; // 3 - 8
    const b = Math.floor(Math.random() * 6) + 2; // 2 - 7
    this.currentChallenge = {
      question: `Berapakah hasil dari ${a} × ${b}?`,
      answer: a * b
    };
    return this.currentChallenge;
  }

  public verifyParentalChallenge(inputAnswer: number): boolean {
    if (!this.currentChallenge) return false;
    const isOk = Number(inputAnswer) === this.currentChallenge.answer;
    if (isOk) this.currentChallenge = null;
    return isOk;
  }

  // Screen Time Limiter for healthy kid digital habits
  public setScreenTimeLimit(minutes: number) {
    this.screenTimeLimit = minutes;
    try {
      localStorage.setItem(STORAGE_KEY_LIMIT, String(minutes));
      localStorage.setItem(STORAGE_KEY_SESSION_START, String(Date.now()));
    } catch {}
  }

  public getScreenTimeLimit(): number {
    try {
      const val = localStorage.getItem(STORAGE_KEY_LIMIT);
      return val !== null ? Number(val) : this.screenTimeLimit;
    } catch {
      return this.screenTimeLimit;
    }
  }

  public getRemainingScreenSeconds(): number | null {
    const limitMins = this.getScreenTimeLimit();
    if (limitMins <= 0) return null; // Unlimited
    try {
      const start = Number(localStorage.getItem(STORAGE_KEY_SESSION_START) || String(Date.now()));
      const elapsed = Math.floor((Date.now() - start) / 1000);
      const totalSecs = limitMins * 60;
      return Math.max(0, totalSecs - elapsed);
    } catch {
      return null;
    }
  }

  public isScreenTimeExpired(): boolean {
    const remaining = this.getRemainingScreenSeconds();
    if (remaining === null) return false;
    return remaining <= 0;
  }

  public activateWithCode(rawCode: string): { success: boolean; message: string } {
    const clean = rawCode.trim().toUpperCase().replace(/[^A-Z0-9-]/g, '');
    if (VALID_ACTIVATION_CODES.includes(clean)) {
      this.isVip = true;
      this.saveVipStatus();
      return {
        success: true,
        message: '🎉 Selamat! Lisensi Penuh VIP Dokter Spesialis Berhasil Diaktifkan!'
      };
    }
    return {
      success: false,
      message: '❌ Kode lisensi tidak valid atau sudah kadaluarsa. Silakan hubungi admin WhatsApp!'
    };
  }

  public resetVipForTesting() {
    this.isVip = false;
    this.saveVipStatus();
  }

  private loadVipStatus(): boolean {
    try {
      return localStorage.getItem(STORAGE_KEY_VIP) === 'true';
    } catch {
      return false;
    }
  }

  private saveVipStatus() {
    try {
      localStorage.setItem(STORAGE_KEY_VIP, this.isVip ? 'true' : 'false');
    } catch {}
  }
}

export const commercial = new CommercialManager();
