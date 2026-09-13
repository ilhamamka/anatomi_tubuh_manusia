// Papan Peringkat Dokter Cilik Indonesia & Manajemen Profil Pemain

export interface PlayerProfile {
  id: string;
  name: string;
  city: string;
  xp: number;
  stars: number;
  rankTitle: string;
  avatar: string;
  completedLevels: number[];
  unlockedBadges: string[];
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  city: string;
  xp: number;
  stars: number;
  rankTitle: string;
  avatar: string;
  isCurrentPlayer?: boolean;
}

const STORAGE_KEY_PROFILE = 'anatomi_tubuh_player_profile';

export function getRankTitle(xp: number): string {
  if (xp >= 5000) return '🏆 Profesor Anatomi Indonesia';
  if (xp >= 3000) return '🩺 Spesialis Bedah Cilik';
  if (xp >= 1500) return '🥼 Dokter Umum Cilik';
  if (xp >= 500)  return '🌟 Dokter Residen Cilik';
  return '🌱 Dokter Magang Cilik';
}

const DEFAULT_NATIONAL_LEADERBOARD: Omit<LeaderboardEntry, 'rank'>[] = [
  { name: 'Kinar R.', city: 'Jakarta Pusat', xp: 4850, stars: 42, rankTitle: '🩺 Spesialis Bedah Cilik', avatar: '👧' },
  { name: 'Fatih Al-Ghifari', city: 'Pekanbaru', xp: 4420, stars: 39, rankTitle: '🩺 Spesialis Bedah Cilik', avatar: '👦' },
  { name: 'Arka Maulana', city: 'Bandung', xp: 3950, stars: 35, rankTitle: '🩺 Spesialis Bedah Cilik', avatar: '🧒' },
  { name: 'Aisyah Putri', city: 'Surabaya', xp: 3400, stars: 31, rankTitle: '🥼 Dokter Umum Cilik', avatar: '👧' },
  { name: 'Bagas Aditya', city: 'Yogyakarta', xp: 2900, stars: 27, rankTitle: '🥼 Dokter Umum Cilik', avatar: '👦' },
  { name: 'Naura Khansa', city: 'Medan', xp: 2450, stars: 23, rankTitle: '🥼 Dokter Umum Cilik', avatar: '👧' },
  { name: 'Rizky Pratama', city: 'Makassar', xp: 1980, stars: 19, rankTitle: '🥼 Dokter Umum Cilik', avatar: '👦' },
  { name: 'Ghea Paramitha', city: 'Denpasar', xp: 1450, stars: 15, rankTitle: '🌟 Dokter Residen Cilik', avatar: '👧' },
  { name: 'Kenzo Alvaro', city: 'Semarang', xp: 1100, stars: 12, rankTitle: '🌟 Dokter Residen Cilik', avatar: '👦' }
];

class LeaderboardManager {
  private profile: PlayerProfile;

  constructor() {
    this.profile = this.loadProfile();
  }

  public getProfile(): PlayerProfile {
    return this.profile;
  }

  public setPlayerName(name: string, city: string) {
    this.profile.name = name.trim() || 'Dokter Cilik Hebat';
    this.profile.city = city.trim() || 'Indonesia';
    this.saveProfile();
  }

  public addRewards(xp: number, stars: number, levelId?: number, badgeName?: string) {
    this.profile.xp += xp;
    this.profile.stars += stars;
    this.profile.rankTitle = getRankTitle(this.profile.xp);

    if (levelId && !this.profile.completedLevels.includes(levelId)) {
      this.profile.completedLevels.push(levelId);
    }

    if (badgeName && !this.profile.unlockedBadges.includes(badgeName)) {
      this.profile.unlockedBadges.push(badgeName);
    }

    this.saveProfile();
  }

  public getLeaderboard(): LeaderboardEntry[] {
    const list: Omit<LeaderboardEntry, 'rank'>[] = [
      ...DEFAULT_NATIONAL_LEADERBOARD,
      {
        name: `${this.profile.name} (Kamu)`,
        city: this.profile.city,
        xp: this.profile.xp,
        stars: this.profile.stars,
        rankTitle: this.profile.rankTitle,
        avatar: this.profile.avatar,
        isCurrentPlayer: true
      }
    ];

    list.sort((a, b) => b.xp - a.xp);

    return list.map((item, idx) => ({
      ...item,
      rank: idx + 1
    }));
  }

  private loadProfile(): PlayerProfile {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PROFILE);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }

    return {
      id: 'doc_' + Math.random().toString(36).substring(2, 9),
      name: 'Dokter Cilik Hebat',
      city: 'Indonesia',
      xp: 450,
      stars: 6,
      rankTitle: '🌱 Dokter Magang Cilik',
      avatar: '🩺',
      completedLevels: [1],
      unlockedBadges: ['🌟 Detektif Indera Cilik']
    };
  }

  private saveProfile() {
    try {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(this.profile));
    } catch {
      // Ignore
    }
  }
}

export const leaderboard = new LeaderboardManager();
