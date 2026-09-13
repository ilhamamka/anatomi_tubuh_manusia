// Interactive Pediatric Medical Quiz & Assessment Engine
// 30 Kurikulum Merdeka aligned questions (IPAS SD Fase B/C & Biologi SMP Fase D)
// Includes instant audio-visual feedback, cheerful praise voiceovers, pedagogical explanations, and XP rewards

import { sound } from './audio';
import { confetti } from './confetti';
import { leaderboard } from './leaderboard';

export interface MedicalQuestion {
  id: string;
  tier: 1 | 2 | 3; // 1: Dokter Muda (SD 3-4), 2: Dokter Spesialis (SD 5-6), 3: Profesor Medis (SMP)
  tierLabel: string;
  curriculumStandard: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  icon: string;
  xpReward: number;
  organId: string;
}

export const MEDICAL_QUESTIONS: MedicalQuestion[] = [
  // --- TIER 1: DOKTER MUDA (SD Kelas 3-4: Mengenal Bagian & Fungsi Organ Tubuh) ---
  {
    id: 'mq1',
    tier: 1,
    tierLabel: 'Dokter Muda (Fase B SD)',
    curriculumStandard: 'Capaian IPAS SD: Mengidentifikasi bagian tubuh dan fungsinya',
    question: 'Organ apakah yang berfungsi memompa darah beroksigen ke seluruh bagian tubuhmu?',
    options: ['Lambung', 'Jantung', 'Ginjal', 'Hati'],
    correctIndex: 1,
    explanation: 'Jantung berdenyut sekitar 100.000 kali setiap hari untuk memompa darah segar ke seluruh penjuru tubuh!',
    icon: '🫀',
    xpReward: 25,
    organId: 'heart'
  },
  {
    id: 'mq2',
    tier: 1,
    tierLabel: 'Dokter Muda (Fase B SD)',
    curriculumStandard: 'Capaian IPAS SD: Panca Indera & Saraf',
    question: 'Organ yang menjadi pusat komando seluruh pikiran, memori, dan gerakan tubuh manusia adalah...',
    options: ['Otak', 'Paru-paru', 'Usus', 'Tulang'],
    correctIndex: 0,
    explanation: 'Otak memiliki 86 miliar neuron yang mengendalikan belajar, berpikir, berbicara, dan mimpi indahmu!',
    icon: '🧠',
    xpReward: 25,
    organId: 'brain'
  },
  {
    id: 'mq3',
    tier: 1,
    tierLabel: 'Dokter Muda (Fase B SD)',
    curriculumStandard: 'Capaian IPAS SD: Sistem Pernapasan Manusia',
    question: 'Saat kita menarik napas di taman yang segar, organ apakah yang mengembang menyerap oksigen?',
    options: ['Hati', 'Ginjal', 'Paru-Paru', 'Kulit'],
    correctIndex: 2,
    explanation: 'Paru-paru mengembang seperti balon ajaib untuk menyerap gas oksigen (O2) dan membuang karbondioksida (CO2).',
    icon: '🫁',
    xpReward: 25,
    organId: 'lungs'
  },
  {
    id: 'mq4',
    tier: 1,
    tierLabel: 'Dokter Muda (Fase B SD)',
    curriculumStandard: 'Capaian IPAS SD: Pemeliharaan Kesehatan Tubuh',
    question: 'Berapa jumlah tulang yang menopang tubuh manusia dewasa agar bisa berdiri tegap dan melompat?',
    options: ['50 Tulang', '100 Tulang', '206 Tulang', '500 Tulang'],
    correctIndex: 2,
    explanation: 'Tubuh orang dewasa tersusun atas 206 tulang yang kokoh, melindungi organ lunak dan menjadi tempat otot melekat.',
    icon: '🦴',
    xpReward: 25,
    organId: 'skeleton'
  },
  {
    id: 'mq5',
    tier: 1,
    tierLabel: 'Dokter Muda (Fase B SD)',
    curriculumStandard: 'Capaian IPAS SD: Sistem Pencernaan Dasar',
    question: 'Makanan lezat yang masuk ke dalam tubuh pertama kali dilumat dan dihancurkan oleh gigi di dalam...',
    options: ['Mulut', 'Tenggorokan', 'Lambung', 'Usus Besar'],
    correctIndex: 0,
    explanation: 'Di dalam mulut, makanan dikunyah oleh gigi dan dibasahi air liur yang mengandung enzim ptialin.',
    icon: '👄',
    xpReward: 25,
    organId: 'stomach'
  },
  {
    id: 'mq6',
    tier: 1,
    tierLabel: 'Dokter Muda (Fase B SD)',
    curriculumStandard: 'Capaian IPAS SD: Panca Indera',
    question: 'Bagian mata manakah yang memberikan warna indah (seperti cokelat, biru, atau hitam) pada bola mata kita?',
    options: ['Kornea', 'Iris', 'Pupil', 'Retina'],
    correctIndex: 1,
    explanation: 'Iris adalah selaput berotot yang memberi pigmen warna mata dan mengatur ukuran lubang pupil.',
    icon: '👁️',
    xpReward: 25,
    organId: 'senses_eye'
  },
  {
    id: 'mq7',
    tier: 1,
    tierLabel: 'Dokter Muda (Fase B SD)',
    curriculumStandard: 'Capaian IPAS SD: Panca Indera Pendengaran',
    question: 'Selain untuk mendengar suara merdu, cairan di dalam telinga juga berfungsi penting untuk...',
    options: ['Mengatur suhu tubuh', 'Menjaga keseimbangan tubuh', 'Mencerna makanan', 'Memompa darah'],
    correctIndex: 1,
    explanation: 'Cairan di saluran setengah lingkaran telinga dalam menjaga kita tetap seimbang dan tidak terjatuh saat berjalan!',
    icon: '👂',
    xpReward: 25,
    organId: 'senses_ear'
  },
  {
    id: 'mq8',
    tier: 1,
    tierLabel: 'Dokter Muda (Fase B SD)',
    curriculumStandard: 'Capaian IPAS SD: Menjaga Kebersihan Diri',
    question: 'Organ apakah yang merupakan organ terluas yang menyelimuti seluruh bagian luar tubuh manusia?',
    options: ['Rambut', 'Kulit', 'Kuku', 'Otot'],
    correctIndex: 1,
    explanation: 'Kulit memiliki luas sekitar 2 meter persegi dan berfungsi sebagai jubah perisai pelindung dari kuman luar!',
    icon: '🧴',
    xpReward: 25,
    organId: 'senses_skin'
  },
  {
    id: 'mq9',
    tier: 1,
    tierLabel: 'Dokter Muda (Fase B SD)',
    curriculumStandard: 'Capaian IPAS SD: Pola Hidup Bersih & Sehat',
    question: 'Berapa lama waktu tidur malam yang dianjurkan untuk anak-anak agar sel otak berkembang cerdas?',
    options: ['2 - 3 Jam', '4 - 5 Jam', '8 - 9 Jam', '15 Jam'],
    correctIndex: 2,
    explanation: 'Tidur cukup 8-9 jam membantu otak membersihkan racun metabolik dan mengunci ingatan belajar seharian.',
    icon: '😴',
    xpReward: 25,
    organId: 'brain'
  },
  {
    id: 'mq10',
    tier: 1,
    tierLabel: 'Dokter Muda (Fase B SD)',
    curriculumStandard: 'Capaian IPAS SD: Sistem Ekskresi Sederhana',
    question: 'Bentuk organ ginjal manusia sangat mirip dengan biji tanaman apakah?',
    options: ['Biji Jagung', 'Kacang Merah', 'Biji Kedelai', 'Biji Semangka'],
    correctIndex: 1,
    explanation: 'Sepasang ginjal berbentuk persis seperti dua butir kacang merah yang bertugas menyaring darah setiap hari.',
    icon: '🫘',
    xpReward: 25,
    organId: 'kidneys'
  },

  // --- TIER 2: DOKTER SPESIALIS (SD Kelas 5-6: Sistem Organ & Mekanisme Kerja) ---
  {
    id: 'mq11',
    tier: 2,
    tierLabel: 'Dokter Spesialis (Fase C SD)',
    curriculumStandard: 'Capaian IPAS SD: Alur Sistem Pencernaan Manusia',
    question: 'Di organ manakah sebagian besar (90%) sari makanan dan nutrisi diserap masuk ke dalam aliran darah?',
    options: ['Mulut', 'Kerongkongan', 'Lambung', 'Usus Halus'],
    correctIndex: 3,
    explanation: 'Usus halus memiliki jutaan tonjolan mikroskopis bernama vili yang menyerap karbohidrat, protein, dan vitamin.',
    icon: '〰️',
    xpReward: 35,
    organId: 'intestines'
  },
  {
    id: 'mq12',
    tier: 2,
    tierLabel: 'Dokter Spesialis (Fase C SD)',
    curriculumStandard: 'Capaian IPAS SD: Sistem Pernapasan Lanjut',
    question: 'Kantung udara amat kecil di ujung bronkiolus tempat terjadinya pertukaran gas O2 dan CO2 bernama...',
    options: ['Alveolus', 'Trakea', 'Faring', 'Laring'],
    correctIndex: 0,
    explanation: 'Paru-paru memiliki sekitar 480 juta alveolus yang dikelilingi pembuluh darah kapiler halus.',
    icon: '🫁',
    xpReward: 35,
    organId: 'lungs'
  },
  {
    id: 'mq13',
    tier: 2,
    tierLabel: 'Dokter Spesialis (Fase C SD)',
    curriculumStandard: 'Capaian IPAS SD: Sistem Peredaran Darah',
    question: 'Peredaran darah kecil pada manusia mengalirkan darah dari jantung menuju ke organ mana lalu kembali ke jantung?',
    options: ['Otak', 'Paru-Paru', 'Hati', 'Seluruh Tubuh'],
    correctIndex: 1,
    explanation: 'Sirkulasi kecil: Jantung (Bilik Kanan) ➔ Arteri Pulmonalis ➔ Paru-Paru ➔ Vena Pulmonalis ➔ Jantung (Serambi Kiri).',
    icon: '🫀',
    xpReward: 35,
    organId: 'heart'
  },
  {
    id: 'mq14',
    tier: 2,
    tierLabel: 'Dokter Spesialis (Fase C SD)',
    curriculumStandard: 'Capaian IPAS SD: Komposisi Darah & Imun',
    question: 'Komponen sel darah yang bertindak sebagai tentara pembela tubuh untuk membasmi kuman bakteri dan virus adalah...',
    options: ['Eritrosit (Sel Darah Merah)', 'Leukosit (Sel Darah Putih)', 'Trombosit (Keping Darah)', 'Plasma Darah'],
    correctIndex: 1,
    explanation: 'Leukosit (sel darah putih) mendeteksi patogen berbahaya dan memusnahkannya agar kita lekas sembuh dari sakit.',
    icon: '🩸',
    xpReward: 35,
    organId: 'blood_cells'
  },
  {
    id: 'mq15',
    tier: 2,
    tierLabel: 'Dokter Spesialis (Fase C SD)',
    curriculumStandard: 'Capaian IPAS SD: Fisiologi Lambung',
    question: 'Zat asam sangat kuat di dalam lambung yang berfungsi membunuh kuman pada makanan adalah...',
    options: ['Asam Cuka', 'Asam Klorida (HCl)', 'Asam Sitrat', 'Asam Laktat'],
    correctIndex: 1,
    explanation: 'Asam klorida (HCl) lambung memiliki derajat keasaman pH 1.5 - 2.0 yang sangat ampuh mensterilkan makanan!',
    icon: '🥣',
    xpReward: 35,
    organId: 'stomach'
  },
  {
    id: 'mq16',
    tier: 2,
    tierLabel: 'Dokter Spesialis (Fase C SD)',
    curriculumStandard: 'Capaian IPAS SD: Metabolisme Hati',
    question: 'Cairan pencerna lemak yang berwarna kehijauan dan diproduksi oleh organ hati disimpan di dalam...',
    options: ['Kantung Kemih', 'Kantung Empedu', 'Pankreas', 'Limpa'],
    correctIndex: 1,
    explanation: 'Kantung empedu menampung cairan empedu dari hati untuk disemprotkan ke usus saat mencerna santapan berlemak.',
    icon: '🛡️',
    xpReward: 35,
    organId: 'liver'
  },
  {
    id: 'mq17',
    tier: 2,
    tierLabel: 'Dokter Spesialis (Fase C SD)',
    curriculumStandard: 'Capaian IPAS SD: Sistem Ekskresi',
    question: 'Apa fungsi utama usus besar dalam tahap akhir proses pencernaan manusia?',
    options: ['Menghancurkan karbohidrat', 'Menyerap kembali kelebihan air dan mineral', 'Menghasilkan enzim asam', 'Mengedarkan oksigen'],
    correctIndex: 1,
    explanation: 'Usus besar menyerap air dari sisa makanan sehingga terbentuk feses yang padat untuk dikeluarkan.',
    icon: '〰️',
    xpReward: 35,
    organId: 'intestines'
  },
  {
    id: 'mq18',
    tier: 2,
    tierLabel: 'Dokter Spesialis (Fase C SD)',
    curriculumStandard: 'Capaian IPAS SD: Komponen Darah',
    question: 'Saat lututmu lecet tergores aspal, bagian darah apakah yang bertugas membekukan darah dan menutup luka?',
    options: ['Trombosit (Keping Darah)', 'Hemoglobin', 'Sel Darah Putih', 'Albumin'],
    correctIndex: 0,
    explanation: 'Trombosit segera berkumpul di area luka membentuk benang-benang fibrin sebagai perban alami tubuh!',
    icon: '🩸',
    xpReward: 35,
    organId: 'blood_cells'
  },
  {
    id: 'mq19',
    tier: 2,
    tierLabel: 'Dokter Spesialis (Fase C SD)',
    curriculumStandard: 'Capaian IPAS SD: Sistem Gerak Rangka',
    question: 'Tulang apakah yang paling panjang, terberat, dan terkuat di seluruh tubuh manusia?',
    options: ['Tulang Lengan (Humerus)', 'Tulang Paha (Femur)', 'Tulang Rusuk', 'Tulang Belakang'],
    correctIndex: 1,
    explanation: 'Femur (tulang paha) mampu menopang beban tubuh hingga 30 kali berat badan kita saat berlari dan melompat!',
    icon: '🦴',
    xpReward: 35,
    organId: 'skeleton'
  },
  {
    id: 'mq20',
    tier: 2,
    tierLabel: 'Dokter Spesialis (Fase C SD)',
    curriculumStandard: 'Capaian IPAS SD: Pemeliharaan Organ Ekskresi',
    question: 'Berapa liter darah yang disaring oleh kedua ginjal manusia setiap hari untuk membersihkan racun metabolik?',
    options: ['5 Liter', '20 Liter', '180 Liter', '500 Liter'],
    correctIndex: 2,
    explanation: 'Ginjal menyaring 180 liter darah setiap 24 jam dan membuang 1-2 liter racun terlarut dalam bentuk air seni.',
    icon: '🫘',
    xpReward: 35,
    organId: 'kidneys'
  },

  // --- TIER 3: PROFESOR MEDIS (SMP Kelas 7-9: Fisiologi & Biologi Seluler Mendalam) ---
  {
    id: 'mq21',
    tier: 3,
    tierLabel: 'Profesor Medis (Fase D SMP)',
    curriculumStandard: 'Capaian Biologi SMP: Struktur Nefron Ginjal',
    question: 'Unit penyaring fungsional terkecil di dalam ginjal yang berjumlah sekitar 1 juta buah per ginjal disebut...',
    options: ['Neuron', 'Nefron', 'Nukleus', 'Nodus Ranvier'],
    correctIndex: 1,
    explanation: 'Nefron terdiri atas Glomerulus, Kapsula Bowman, dan Tubulus yang memproses filtrasi, reabsorpsi, dan augmentasi.',
    icon: '🫘',
    xpReward: 50,
    organId: 'kidneys'
  },
  {
    id: 'mq22',
    tier: 3,
    tierLabel: 'Profesor Medis (Fase D SMP)',
    curriculumStandard: 'Capaian Biologi SMP: Biokimia Darah',
    question: 'Molekul protein kaya zat besi di dalam sel darah merah yang mengikat oksigen disebut...',
    options: ['Insulin', 'Hemoglobin', 'Keratin', 'Kolagen'],
    correctIndex: 1,
    explanation: 'Hemoglobin (Hb) mampu mengikat 4 molekul oksigen sekaligus dan memberikan warna merah cerah pada darah beroksigen.',
    icon: '🩸',
    xpReward: 50,
    organId: 'blood_cells'
  },
  {
    id: 'mq23',
    tier: 3,
    tierLabel: 'Profesor Medis (Fase D SMP)',
    curriculumStandard: 'Capaian Biologi SMP: Anatomi Ruang Jantung',
    question: 'Ruang jantung manakah yang memiliki dinding otot paling tebal karena harus memompa darah ke seluruh tubuh?',
    options: ['Serambi Kanan (Atrium Dextra)', 'Bilik Kanan (Ventrikel Dexter)', 'Serambi Kiri (Atrium Sinistra)', 'Bilik Kiri (Ventrikel Sinister)'],
    correctIndex: 3,
    explanation: 'Bilik Kiri memompa darah dengan tekanan tinggi melalui katup Aorta menuju ujung kepala hingga ujung kaki.',
    icon: '🫀',
    xpReward: 50,
    organId: 'heart'
  },
  {
    id: 'mq24',
    tier: 3,
    tierLabel: 'Profesor Medis (Fase D SMP)',
    curriculumStandard: 'Capaian Biologi SMP: Enzim Pencernaan Kimiawi',
    question: 'Enzim di dalam lambung yang bertugas memecah molekul protein menjadi peptida sederhana adalah...',
    options: ['Ptialin', 'Pepsin', 'Amilase', 'Lipase'],
    correctIndex: 1,
    explanation: 'Pepsinogen diaktifkan oleh asam klorida (HCl) menjadi enzim aktif Pepsin yang memecah ikatan rantai protein.',
    icon: '🥣',
    xpReward: 50,
    organId: 'stomach'
  },
  {
    id: 'mq25',
    tier: 3,
    tierLabel: 'Profesor Medis (Fase D SMP)',
    curriculumStandard: 'Capaian Biologi SMP: Sistem Saraf & Sinapsis',
    question: 'Celah sempit tempat perpindahan sinyal listrik dan neurotransmiter kimia antarsel saraf disebut...',
    options: ['Akson', 'Dendrit', 'Sinapsis', 'Mielin'],
    correctIndex: 2,
    explanation: 'Sinapsis adalah sambungan mikroskopis tempat molekul neurotransmiter (seperti dopamin) meneruskan sinyal antarneuron.',
    icon: '🧠',
    xpReward: 50,
    organId: 'brain'
  },
  {
    id: 'mq26',
    tier: 3,
    tierLabel: 'Profesor Medis (Fase D SMP)',
    curriculumStandard: 'Capaian Biologi SMP: Histologi Tulang',
    question: 'Bagian tengah dari tulang panjang yang aktif memproduksi sel-sel darah merah dan putih baru disebut...',
    options: ['Periosteum', 'Sumsum Tulang (Bone Marrow)', 'Tulang Rawan (Kartilago)', 'Kanal Havers'],
    correctIndex: 1,
    explanation: 'Sumsum tulang merah adalah pabrik hematopoiesis yang memproduksi miliaran sel darah baru setiap hari!',
    icon: '🦴',
    xpReward: 50,
    organId: 'skeleton'
  },
  {
    id: 'mq27',
    tier: 3,
    tierLabel: 'Profesor Medis (Fase D SMP)',
    curriculumStandard: 'Capaian Biologi SMP: Fungsi Hati',
    question: 'Di dalam sel hati, kelebihan glukosa dalam darah disimpan dalam bentuk cadangan polisakarida yang disebut...',
    options: ['Sukrosa', 'Glikogen', 'Selulosa', 'Fruktosa'],
    correctIndex: 1,
    explanation: 'Glikogen disimpan di hati dan otot, lalu dipecah kembali menjadi glukosa saat tubuh membutuhkan tenaga tambahan.',
    icon: '🛡️',
    xpReward: 50,
    organId: 'liver'
  },
  {
    id: 'mq28',
    tier: 3,
    tierLabel: 'Profesor Medis (Fase D SMP)',
    curriculumStandard: 'Capaian Biologi SMP: Panca Indera Fotoreseptor',
    question: 'Sel fotoreseptor di retina mata yang sangat peka terhadap cahaya redup malam hari namun tidak membedakan warna adalah...',
    options: ['Sel Kerucut (Cones)', 'Sel Batang (Rods)', 'Sel Ganglion', 'Sel Bipolar'],
    correctIndex: 1,
    explanation: 'Sel batang (sekitar 120 juta sel) bertanggung jawab untuk penglihatan malam (skotopik) monokrom.',
    icon: '👁️',
    xpReward: 50,
    organId: 'senses_eye'
  },
  {
    id: 'mq29',
    tier: 3,
    tierLabel: 'Profesor Medis (Fase D SMP)',
    curriculumStandard: 'Capaian Biologi SMP: Fisiologi Pendengaran',
    question: 'Tiga tulang pendengaran terkecil di rongga telinga tengah secara berurutan adalah...',
    options: ['Femur, Tibia, Fibula', 'Martil (Malleus), Landasan (Incus), Sanggurdi (Stapes)', 'Radius, Ulna, Karpal', 'Kranium, Sternum, Klavikula'],
    correctIndex: 1,
    explanation: 'Malleus, Incus, dan Stapes memperkuat getaran mekanis gelombang suara dari membran timpani ke jendela oval koklea.',
    icon: '👂',
    xpReward: 50,
    organId: 'senses_ear'
  },
  {
    id: 'mq30',
    tier: 3,
    tierLabel: 'Profesor Medis (Fase D SMP)',
    curriculumStandard: 'Capaian Biologi SMP: Histologi Kulit',
    question: 'Lapisan terdalam kulit manusia yang tersusun atas jaringan lemak penahan panas tubuh dan benturan adalah...',
    options: ['Epidermis', 'Stratum Korneum', 'Dermis', 'Hipodermis (Subkutan)'],
    correctIndex: 3,
    explanation: 'Hipodermis kaya akan sel adiposit (lemak) yang berfungsi sebagai isolator termal dan bantalan pelindung organ dalam.',
    icon: '🧴',
    xpReward: 50,
    organId: 'senses_skin'
  }
];

export class QuizManager {
  private container: HTMLElement;
  private selectedTier: 1 | 2 | 3 | 'all' = 'all';
  private questions: MedicalQuestion[] = [];
  private currentIndex: number = 0;
  private score: number = 0;
  private answered: boolean = false;
  private selectedOptionIndex: number | null = null;
  private totalXpEarned: number = 0;

  constructor(container: HTMLElement) {
    this.container = container;
    this.filterQuestions('all');
  }

  public filterQuestions(tier: 1 | 2 | 3 | 'all') {
    this.selectedTier = tier;
    if (tier === 'all') {
      this.questions = [...MEDICAL_QUESTIONS];
    } else {
      this.questions = MEDICAL_QUESTIONS.filter(q => q.tier === tier);
    }
    this.currentIndex = 0;
    this.score = 0;
    this.answered = false;
    this.selectedOptionIndex = null;
    this.totalXpEarned = 0;
    this.render();
  }

  public render() {
    if (this.questions.length === 0) {
      this.container.innerHTML = '<div class="quiz-empty">Belum ada pertanyaan tersedia.</div>';
      return;
    }

    if (this.currentIndex >= this.questions.length) {
      this.renderCompletionSummary();
      return;
    }

    const q = this.questions[this.currentIndex];
    const progressPercent = Math.round(((this.currentIndex) / this.questions.length) * 100);

    this.container.innerHTML = `
      <div class="quiz-view-wrapper">
        <!-- Quiz Control Bar -->
        <div class="quiz-top-bar">
          <div class="quiz-tier-selector">
            <button class="tier-pill-btn ${this.selectedTier === 'all' ? 'active' : ''}" data-tier="all" type="button">
              ✨ Semua Jenjang (30)
            </button>
            <button class="tier-pill-btn ${this.selectedTier === 1 ? 'active' : ''}" data-tier="1" type="button">
              🌱 Dokter Muda (SD 3-4)
            </button>
            <button class="tier-pill-btn ${this.selectedTier === 2 ? 'active' : ''}" data-tier="2" type="button">
              🩺 Dokter Spesialis (SD 5-6)
            </button>
            <button class="tier-pill-btn ${this.selectedTier === 3 ? 'active' : ''}" data-tier="3" type="button">
              🎓 Profesor Medis (SMP)
            </button>
          </div>

          <div class="quiz-stats-cluster">
            <span class="quiz-stat-pill">⭐ Skor: <strong>${this.score}</strong></span>
            <span class="quiz-stat-pill">⚡ XP: <strong>+${this.totalXpEarned}</strong></span>
          </div>
        </div>

        <!-- Progress Track -->
        <div class="quiz-progress-track">
          <div class="quiz-progress-fill" style="width: ${progressPercent}%;"></div>
        </div>

        <!-- Question Card -->
        <div class="quiz-card-stage neo-card">
          <div class="quiz-card-header">
            <div class="quiz-card-meta">
              <span class="quiz-badge-tier">${q.tierLabel}</span>
              <span class="quiz-curriculum-badge">${q.curriculumStandard}</span>
            </div>
            <span class="quiz-number-indicator">Soal ${this.currentIndex + 1} dari ${this.questions.length}</span>
          </div>

          <div class="quiz-question-row">
            <span class="quiz-large-icon">${q.icon}</span>
            <h3 class="quiz-question-text">${q.question}</h3>
          </div>

          <!-- Options Grid -->
          <div class="quiz-options-grid">
            ${q.options.map((opt, idx) => {
              let stateClass = '';
              if (this.answered) {
                if (idx === q.correctIndex) {
                  stateClass = 'option-correct';
                } else if (idx === this.selectedOptionIndex) {
                  stateClass = 'option-wrong';
                } else {
                  stateClass = 'option-disabled';
                }
              }
              const letters = ['A', 'B', 'C', 'D'];
              return `
                <button class="quiz-option-btn ${stateClass}" data-option-index="${idx}" ${this.answered ? 'disabled' : ''} type="button">
                  <span class="option-letter">${letters[idx]}</span>
                  <span class="option-text">${opt}</span>
                </button>
              `;
            }).join('')}
          </div>

          <!-- Explanation & Feedback Drawer -->
          ${this.answered ? `
            <div class="quiz-explanation-box ${this.selectedOptionIndex === q.correctIndex ? 'is-correct' : 'is-wrong'}">
              <div class="explanation-title">
                ${this.selectedOptionIndex === q.correctIndex ? '🎉 JAWABAN TEPAT DOKTER CILIK!' : '💡 PEMBAHASAN SAINS MEDIS:'}
              </div>
              <p class="explanation-text">${q.explanation}</p>
              <div class="explanation-actions">
                <button id="btn-quiz-next" class="btn-neo-primary" type="button">
                  ${this.currentIndex + 1 < this.questions.length ? 'Lanjut ke Soal Berikutnya ➔' : 'Lihat Hasil Kelulusan Medis 🎓'}
                </button>
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;

    this.bindEvents();
  }

  private bindEvents() {
    // Tier buttons
    this.container.querySelectorAll('[data-tier]').forEach(btn => {
      btn.addEventListener('click', () => {
        sound.playPop();
        const t = btn.getAttribute('data-tier');
        if (t === 'all') this.filterQuestions('all');
        else this.filterQuestions(Number(t) as 1 | 2 | 3);
      });
    });

    // Options selection
    if (!this.answered) {
      this.container.querySelectorAll('[data-option-index]').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = Number(btn.getAttribute('data-option-index'));
          this.handleAnswer(idx);
        });
      });
    }

    // Next question button
    const nextBtn = this.container.querySelector('#btn-quiz-next');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        sound.playPop();
        this.currentIndex++;
        this.answered = false;
        this.selectedOptionIndex = null;
        this.render();
      });
    }
  }

  private handleAnswer(index: number) {
    if (this.answered) return;
    this.answered = true;
    this.selectedOptionIndex = index;

    const q = this.questions[this.currentIndex];
    const isCorrect = index === q.correctIndex;

    if (isCorrect) {
      this.score += 10;
      this.totalXpEarned += q.xpReward;
      leaderboard.addRewards(q.xpReward, 1, 0, 'Kuis Dokter Cilik');
      sound.speakPraise();
      confetti.burst(60);
    } else {
      sound.playWrong();
      setTimeout(() => {
        sound.playNaturalSpeech('Yuk perhatikan penjelasannya ya!');
      }, 200);
    }

    this.render();
  }

  private renderCompletionSummary() {
    const totalPossibleScore = this.questions.length * 10;
    const percentage = Math.round((this.score / totalPossibleScore) * 100);
    const passed = percentage >= 70;

    this.container.innerHTML = `
      <div class="quiz-view-wrapper">
        <div class="neo-card quiz-result-card">
          <div class="result-header">
            <span class="result-icon">${passed ? '🏆' : '🌱'}</span>
            <h2 class="result-title">${passed ? 'Selamat! Kamu Lulus Evaluasi Dokter Cilik!' : 'Semangat Belajar, Dokter Cilik!'}</h2>
            <p class="result-desc">
              ${passed 
                ? 'Pengetahuan anatomi dan biologimu luar biasa! Kamu siap menjadi inspirasi dokter muda masa depan.'
                : 'Jangan berkecil hati ya! Ulangi materi atlas dan coba lagi kuis ini untuk meningkatkan nilaimu.'}
            </p>
          </div>

          <div class="result-scores-grid">
            <div class="result-score-box">
              <span class="score-num">${this.score} / ${totalPossibleScore}</span>
              <span class="score-label">Total Nilai Medis (${percentage}%)</span>
            </div>
            <div class="result-score-box">
              <span class="score-num">+${this.totalXpEarned}</span>
              <span class="score-label">XP Dokter Diterima</span>
            </div>
          </div>

          <div class="result-action-row">
            <button id="btn-quiz-retry" class="btn-neo-secondary" type="button">
              🔁 Ulangi Kuis Ini
            </button>
            <a href="#worksheets" class="btn-neo-primary" id="btn-to-certificate">
              🎖️ Cetak Sertifikat Kelulusan Resmi
            </a>
          </div>
        </div>
      </div>
    `;

    if (passed) {
      confetti.burst(100);
      sound.playFanfare();
    }

    this.container.querySelector('#btn-quiz-retry')?.addEventListener('click', () => {
      sound.playPop();
      this.filterQuestions(this.selectedTier);
    });
  }

  public destroy() {
    sound.stopSpeaking();
  }
}
