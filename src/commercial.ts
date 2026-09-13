// Freemium Licensing & VIP Commercial Gate Engine

const STORAGE_KEY_VIP = 'anatomi_tubuh_vip_status';

const VALID_ACTIVATION_CODES = [
  'ANATOMI-VIP-2026',
  'DOKTER-INDONESIA',
  'SPESIALIS-BEDAH',
  'MERDEKA-BELAJAR',
  'PRO-DOKTER-CILIK'
];

class CommercialManager {
  private isVip: boolean = false;

  constructor() {
    this.isVip = this.loadVipStatus();
  }

  public hasVipAccess(): boolean {
    return this.isVip;
  }

  public isLevelLocked(levelId: number): boolean {
    if (this.isVip) return false;
    return levelId > 2; // Levels 1 and 2 are 100% free demo
  }

  public activateWithCode(rawCode: string): { success: boolean; message: string } {
    const clean = rawCode.trim().toUpperCase().replace(/[^A-Z0-9-]/g, '');
    if (VALID_ACTIVATION_CODES.includes(clean)) {
      this.isVip = true;
      this.saveVipStatus();
      return {
        success: true,
        message: '🎉 Selamat! Akses Penuh VIP Dokter Spesialis Berhasil Diaktifkan!'
      };
    }
    return {
      success: false,
      message: '❌ Kode lisensi tidak valid atau sudah kadaluarsa. Silakan periksa kembali!'
    };
  }

  public resetVipForTesting() {
    this.isVip = false;
    this.saveVipStatus();
  }

  private loadVipStatus(): boolean {
    try {
      const val = localStorage.getItem(STORAGE_KEY_VIP);
      return val === 'true';
    } catch {
      return false;
    }
  }

  private saveVipStatus() {
    try {
      localStorage.setItem(STORAGE_KEY_VIP, this.isVip ? 'true' : 'false');
    } catch {
      // Ignore
    }
  }
}

export const commercial = new CommercialManager();
