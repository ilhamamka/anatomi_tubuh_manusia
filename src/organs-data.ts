// Complete Human Body Anatomy Curriculum & SVG Graphics Engine
// Aligned with Indonesian Kurikulum Merdeka (IPAS SD / Biologi SMP) & Global STEM Education

export interface OrganInfo {
  id: string;
  name: string;
  latinName: string;
  system: 'saraf' | 'sirkulasi' | 'pernapasan' | 'pencernaan' | 'ekskresi' | 'gerak' | 'indera';
  systemName: string;
  funTitle: string;
  emoji: string;
  primaryColor: string;
  secondaryColor: string;
  summary: string;
  description: string;
  story: string;
  funFacts: string[];
  healthTips: string;
  soundType: 'heartbeat' | 'breath' | 'neural' | 'digestive' | 'bone_snap' | 'xray_scan' | 'pop';
  targetPos: {
    x: number; // percentage 0-100 on silhouette
    y: number; // percentage 0-100 on silhouette
    width: number;
    height: number;
  };
  realisticImage?: string;
  clinicalMetrics?: Record<string, string>;
  renderSVG: (size?: number, animate?: boolean) => string;
}

export interface CurriculumLevel {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  xpReward: number;
  organs: string[];
  isLockedDefault: boolean;
}

export interface ClinicalCase {
  id: string;
  patientName: string;
  patientAge: string;
  avatar: string;
  chiefComplaint: string;
  story: string;
  correctOrganId: string;
  examinationTool: 'stethoscope' | 'xray' | 'thermometer';
  toolFinding: string;
  treatment: string;
  doctorTip: string;
}

// 1. Organ Vectors & Scientific Dataset
export const ORGANS: Record<string, OrganInfo> = {
  brain: {
    id: 'brain',
    story: 'Ting! Ide brilian! Horeee! Halo Dokter Cilik! Aku si Otak Super Jenius! Zzzt, sinyal listrik kilatku melesat secepat kilat loh, wuuush! Akulah yang membantumu berhitung, membaca, dan punya mimpi indah! Yuk tidur teratur agar aku selalu cerdas! Semangat!',
    name: 'Otak',
    latinName: 'Cerebrum & Encephalon',
    system: 'saraf',
    systemName: 'Sistem Saraf Pusat',
    funTitle: 'Otak si Markas Komando',
    emoji: '🧠',
    primaryColor: '#f472b6',
    secondaryColor: '#db2777',
    summary: 'Pusat kendali seluruh pikiran, mimpi, gerakan, dan memori tubuh manusia.',
    description: 'Otak kita memiliki sekitar 86 miliar sel saraf (neuron) yang saling berkomunikasi menggunakan sinyal listrik kilat untuk membantu kita belajar, mengingat, dan merasakan emosi.',
    funFacts: [
      'Otak manusia menghasilkan daya listrik sekitar 12-25 watt, cukup untuk menyalakan bohlam lampu kecil!',
      'Meskipun beratnya hanya 2% dari berat tubuh, otak mengonsumsi 20% dari seluruh energi dan oksigen kita.',
      'Saat kamu tidur, otak bekerja membersihkan racun dan merapikan ingatan belajar seharian.'
    ],
    healthTips: 'Tidur cukup 8-9 jam setiap malam, baca buku, dan makan makanan bergizi seperti ikan serta kacang-kacangan untuk otak cerdas!',
    soundType: 'neural',
    targetPos: { x: 50, y: 13, width: 44, height: 38 },
    realisticImage: '/assets/realistic_brain_3d.png',
    clinicalMetrics: {
      'Jumlah Sel Saraf': '~86 Miliar Neuron',
      'Kecepatan Impuls': '430 km/jam',
      'Konsumsi Energi': '20% Total O2 Tubuh'
    },
    renderSVG: (size = 80, animate = true) => `
      <svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" class="organ-svg ${animate ? 'organ-pulse-slow' : ''}">
        <circle cx="50" cy="50" r="46" fill="#fdf2f8" stroke="#db2777" stroke-width="2.5" stroke-dasharray="4 2"/>
        <!-- Brain Left & Right Hemispheres -->
        <path d="M50 25c-8-6-20-4-25 4-5 8-4 18 1 24-5 4-6 12-2 18 4 6 12 7 18 4 3 7 10 9 16 6" fill="#f472b6" stroke="#2f2a26" stroke-width="3"/>
        <path d="M50 25c8-6 20-4 25 4 5 8 4 18-1 24 5 4 6 12 2 18-4 6-12 7-18 4-3 7-10 9-16 6" fill="#fb7185" stroke="#2f2a26" stroke-width="3"/>
        <!-- Brain folds / Gyri & Sulci -->
        <path d="M35 36c3 4 8 5 11 1m-14 11c5 2 10-1 12 4m-8 10c4 3 9 1 11-2" stroke="#be185d" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M65 36c-3 4-8 5-11 1m14 11c-5 2-10-1-12 4m8 10c-4 3-9 1-11-2" stroke="#9f1239" stroke-width="2.5" stroke-linecap="round"/>
        <!-- Central Fissure -->
        <path d="M50 24v54" stroke="#2f2a26" stroke-width="3" stroke-linecap="round"/>
        <!-- Friendly Cute Face -->
        <circle cx="43" cy="52" r="3" fill="#2f2a26"/>
        <circle cx="57" cy="52" r="3" fill="#2f2a26"/>
        <path d="M47 58q3 3 6 0" stroke="#2f2a26" stroke-width="2.5" stroke-linecap="round"/>
        <!-- Sparkle synapse -->
        <polygon points="50 12 52 16 56 18 52 20 50 24 48 20 44 18 48 16" fill="#facc15" stroke="#ca8a04" stroke-width="1"/>
      </svg>
    `
  },

  heart: {
    id: 'heart',
    story: 'Dug-dug! Dug-dug! Horeee! Halo Dokter Cilik! Aku si Jantung Pompa Ajaib! Setiap hari aku berdetak seratus ribu kali memompa darah segar ke seluruh tubuhmu! Dug-dug, dug-dug, aku kuat dan semangat selalu! Yuk berolahraga gembira!',
    name: 'Jantung',
    latinName: 'Cor',
    system: 'sirkulasi',
    systemName: 'Sistem Peredaran Darah',
    funTitle: 'Jantung si Pompa Ajaib',
    emoji: '🫀',
    primaryColor: '#ef4444',
    secondaryColor: '#b91c1c',
    summary: 'Otot terkuat yang memompa darah segar berisi oksigen ke seluruh penjuru tubuh 24 jam nonstop.',
    description: 'Jantung berukuran sebesar kepalan tanganmu dan berdetak sekitar 100.000 kali setiap hari. Jantung memiliki 4 ruang (serambi kanan, bilik kanan, serambi kiri, dan bilik kiri) yang bekerja kompak.',
    funFacts: [
      'Jantung memompa sekitar 7.500 liter darah setiap hari melalui pembuluh darah sepanjang 96.000 km!',
      'Suara detak jantung "lub-dub" berasal dari menutupnya 4 katup jantung secara bergantian.',
      'Jika kamu memegang dadamu di sebelah kiri sedikit tengah, kamu bisa merasakan detak jantungmu sendiri.'
    ],
    healthTips: 'Rutin berolahraga aerobik seperti lari kecil, bersepeda, dan berenang agar otot jantung tetap kuat dan sehat!',
    soundType: 'heartbeat',
    targetPos: { x: 52, y: 34, width: 36, height: 36 },
    realisticImage: '/assets/realistic_heart_3d.png',
    clinicalMetrics: {
      'Curah Jantung': '5.0 Liter / menit',
      'Detak Harian': '~100.000 Detak / hari',
      'Tekanan Normal': '120/80 mmHg'
    },
    renderSVG: (size = 80, animate = true) => `
      <svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" class="organ-svg ${animate ? 'organ-heartbeat' : ''}">
        <circle cx="50" cy="50" r="46" fill="#fef2f2" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="4 2"/>
        <!-- Aorta & Pulmonary Arteries -->
        <path d="M48 20c0-6 8-8 12-4s4 10 2 16" stroke="#3b82f6" stroke-width="6" stroke-linecap="round" fill="none"/>
        <path d="M38 23c-3-5 5-9 9-4" stroke="#ef4444" stroke-width="6" stroke-linecap="round" fill="none"/>
        <!-- Heart Anatomy Muscle -->
        <path d="M50 32c-14-14-32 2-24 22 6 15 20 28 24 32 4-4 18-17 24-32 8-20-10-36-24-22z" fill="#ef4444" stroke="#2f2a26" stroke-width="3"/>
        <!-- Chamber divider lines -->
        <path d="M48 38c-3 12-2 24 2 34" stroke="#b91c1c" stroke-width="2.5" stroke-linecap="round"/>
        <!-- Coronary Blood Vessels -->
        <path d="M44 48c4 4 2 10 6 14" stroke="#3b82f6" stroke-width="2" stroke-linecap="round"/>
        <!-- Cute Doctor Face -->
        <circle cx="43" cy="50" r="3" fill="#ffffff"/>
        <circle cx="43" cy="50" r="1.5" fill="#2f2a26"/>
        <circle cx="57" cy="50" r="3" fill="#ffffff"/>
        <circle cx="57" cy="50" r="1.5" fill="#2f2a26"/>
        <path d="M47 57q3 3 6 0" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="38" cy="54" r="2.5" fill="#fca5a5"/>
        <circle cx="62" cy="54" r="2.5" fill="#fca5a5"/>
      </svg>
    `
  },

  lungs: {
    id: 'lungs',
    story: 'Tarik napas panjaaaang... Fiuuuh! Segarnya! Halo Dokter Cilik! Kami si Paru-Paru Peniup Oksigen! Kami mengembang seperti balon ajaib yang menyerap udara segar dan membuang udara kotor! Yuk hirup udara sejuk di taman, asyik sekali!',
    name: 'Paru-Paru',
    latinName: 'Pulmo',
    system: 'pernapasan',
    systemName: 'Sistem Pernapasan',
    funTitle: 'Paru-paru si Pabrik Oksigen',
    emoji: '🫁',
    primaryColor: '#38bdf8',
    secondaryColor: '#0284c7',
    summary: 'Menghirup oksigen segar (O2) dari udara dan membuang karbon dioksida (CO2) saat menghembuskan napas.',
    description: 'Di dalam paru-paru terdapat jutaan kantung udara kecil bernama Alveolus. Paru-paru kiri sedikit lebih kecil daripada paru-paru kanan untuk memberikan ruang bagi letak jantung.',
    funFacts: [
      'Kita bernapas sekitar 20.000 kali dalam satu hari tanpa perlu mengingatnya!',
      'Jika seluruh alveolus di dalam kedua paru-paru dibentangkan, luasnya setara dengan ukuran lapangan tenis!',
      'Paru-paru adalah satu-satunya organ di tubuh manusia yang bisa mengapung di atas air karena berisi udara.'
    ],
    healthTips: 'Jauhi asap rokok dan polusi kendaraan, serta seringlah menghirup udara pagi segar di taman penuh pepohonan!',
    soundType: 'breath',
    targetPos: { x: 50, y: 35, width: 62, height: 42 },
    realisticImage: '/assets/realistic_lungs_3d.png',
    clinicalMetrics: {
      'Kapasitas Vital': '4.500 mL',
      'Jumlah Alveolus': '~480 Juta Alveoli',
      'Frekuensi Napas': '12-20 kali / menit'
    },
    renderSVG: (size = 80, animate = true) => `
      <svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" class="organ-svg ${animate ? 'organ-breathe' : ''}">
        <circle cx="50" cy="50" r="46" fill="#f0f9ff" stroke="#0284c7" stroke-width="2.5" stroke-dasharray="4 2"/>
        <!-- Trachea (Windpipe) with rings -->
        <path d="M50 16v18" stroke="#2f2a26" stroke-width="4.5" stroke-linecap="round"/>
        <path d="M46 22h8m-8 5h8" stroke="#38bdf8" stroke-width="2"/>
        <!-- Left & Right Bronchi -->
        <path d="M50 34c-4 5-10 7-14 8" stroke="#2f2a26" stroke-width="3.5" stroke-linecap="round"/>
        <path d="M50 34c4 5 10 7 14 8" stroke="#2f2a26" stroke-width="3.5" stroke-linecap="round"/>
        <!-- Left Lung Lobe -->
        <path d="M36 38c-8 2-16 10-16 22 0 14 8 22 18 22 6 0 10-4 10-10V42c0-3-6-5-12-4z" fill="#7dd3fc" stroke="#2f2a26" stroke-width="3"/>
        <!-- Right Lung Lobe -->
        <path d="M64 38c8 2 16 10 16 22 0 14-8 22-18 22-6 0-10-4-10-10V42c0-3 6-5 12-4z" fill="#38bdf8" stroke="#2f2a26" stroke-width="3"/>
        <!-- Bronchial tree branches inside -->
        <path d="M28 50c4 3 8 2 10 5m-6 8c3 2 6 0 8 3" stroke="#0284c7" stroke-width="2" stroke-linecap="round"/>
        <path d="M72 50c-4 3-8 2-10 5m6 8c-3 2-6 0-8 3" stroke="#0369a1" stroke-width="2" stroke-linecap="round"/>
        <!-- Cute Eyes on Lungs -->
        <circle cx="32" cy="56" r="2.5" fill="#2f2a26"/>
        <circle cx="68" cy="56" r="2.5" fill="#2f2a26"/>
        <path d="M48 64q2 2 4 0" stroke="#0284c7" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `
  },

  stomach: {
    id: 'stomach',
    story: 'Kruuuk kruuuk, nyam nyam lezat! Halo Dokter Cilik! Aku si Lambung Pengolah Makanan Ajaib! Makanan enak yang kamu kunyah langsung kusulap jadi sari tenaga yang bikin kamu bertenaga dan bisa lari kencang! Nyam nyam, rajin makan sayur ya!',
    name: 'Lambung',
    latinName: 'Gaster / Ventriculus',
    system: 'pencernaan',
    systemName: 'Sistem Pencernaan',
    funTitle: 'Lambung si Pengolah Makanan',
    emoji: '🥣',
    primaryColor: '#f59e0b',
    secondaryColor: '#d97706',
    summary: 'Mencampur dan melumat makanan dengan cairan asam berkekuatan tinggi serta enzim pencernaan.',
    description: 'Bentuknya menyerupai huruf J yang elastis. Lambung meremas makanan menjadi bubur halus (kimus) selama 2-4 jam sebelum dialirkan ke usus halus untuk diserap nutrisinya.',
    funFacts: [
      'Asam lambung (asam klorida) sangat kuat sehingga bisa melarutkan logam tipis dan membunuh bakteri jahat!',
      'Dinding lambung dilindungi lendir tebal khusus agar tidak rusak oleh asamnya sendiri.',
      'Suara perut berbunyi "kruuuk" (borborygmi) terjadi karena otot lambung meremas udara dan cairan saat kosong.'
    ],
    healthTips: 'Makan tepat waktu, kunyah makanan 20-30 kali hingga lembut, dan batasi makanan yang terlalu pedas atau asam!',
    soundType: 'digestive',
    targetPos: { x: 54, y: 48, width: 38, height: 32 },
    realisticImage: '/assets/realistic_digestive_3d.png',
    clinicalMetrics: {
      'pH Asam Lambung': '1.5 - 2.0 (HCl Kuat)',
      'Kapasitas Maks': '1.5 - 2.0 Liter',
      'Waktu Pencernaan': '2-4 Jam'
    },
    renderSVG: (size = 80, animate = true) => `
      <svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" class="organ-svg ${animate ? 'organ-bubble' : ''}">
        <circle cx="50" cy="50" r="46" fill="#fffbeb" stroke="#f59e0b" stroke-width="2.5" stroke-dasharray="4 2"/>
        <!-- Esophagus pipe top -->
        <path d="M42 16v14" stroke="#2f2a26" stroke-width="4.5" stroke-linecap="round"/>
        <!-- J-shaped Stomach pouch -->
        <path d="M42 30c-8 0-18 8-18 22 0 16 10 28 26 28 14 0 26-8 26-22 0-8-6-14-14-14-6 0-10 6-12 12" fill="#fbbf24" stroke="#2f2a26" stroke-width="3"/>
        <!-- Liquid Chyme with bubbles -->
        <path d="M28 58c4-2 10 2 16 0s10-2 18 1c0 8-6 17-18 17-10 0-16-8-16-18z" fill="#f59e0b"/>
        <circle cx="38" cy="64" r="2.5" fill="#fef3c7"/>
        <circle cx="48" cy="60" r="2" fill="#fef3c7"/>
        <circle cx="54" cy="66" r="1.5" fill="#fef3c7"/>
        <!-- Cute Eyes -->
        <circle cx="40" cy="46" r="3" fill="#2f2a26"/>
        <circle cx="54" cy="46" r="3" fill="#2f2a26"/>
        <path d="M44 51q3 3 6 0" stroke="#2f2a26" stroke-width="2.5" stroke-linecap="round"/>
      </svg>
    `
  },

  liver: {
    id: 'liver',
    story: 'Cling cling! Bersih berkilau! Halo Dokter Cilik! Aku si Hati Pahlawan Pembersih Tubuh! Aku menyaring racun jahat dan menyimpan cadangan tenaga agar kamu selalu riang bermain! Tubuhmu jadi sehat bugar setiap saat! Hebat kan!',
    name: 'Hati & Empedu',
    latinName: 'Hepar',
    system: 'pencernaan',
    systemName: 'Sistem Pencernaan & Metabolisme',
    funTitle: 'Hati si Pabrik Penawar Racun',
    emoji: '🛡️',
    primaryColor: '#b45309',
    secondaryColor: '#78350f',
    summary: 'Organ dalam terbesar yang membersihkan racun dari darah dan memproduksi cairan empedu pencerna lemak.',
    description: 'Hati bertindak sebagai laboratorium kimia ajaib tubuh yang melakukan lebih dari 500 fungsi penting sekaligus, termasuk menyimpan vitamin dan energi gula (glikogen).',
    funFacts: [
      'Hati adalah satu-satunya organ dalam tubuh yang mampu menumbuhkan kembali bagiannya yang hilang (regenerasi)!',
      'Hati menyaring sekitar 1,4 liter darah setiap menitnya.',
      'Cairan empedu berwarna kuning kehijauan yang dibuat hati bertugas mencerna lemak susu dan mentega.'
    ],
    healthTips: 'Banyak minum air putih bersih, hindari obat tanpa anjuran dokter, dan konsumsi sayuran hijau segar!',
    soundType: 'pop',
    targetPos: { x: 44, y: 46, width: 42, height: 30 },
    realisticImage: '/assets/realistic_digestive_3d.png',
    clinicalMetrics: {
      'Aliran Darah': '1.4 Liter / menit',
      'Fungsi Sintesis': '>500 Proses Biokimia',
      'Kapasitas Glikogen': '100 - 120 gram'
    },
    renderSVG: (size = 80, animate = true) => `
      <svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" class="organ-svg ${animate ? 'organ-float' : ''}">
        <circle cx="50" cy="50" r="46" fill="#fefce8" stroke="#b45309" stroke-width="2.5" stroke-dasharray="4 2"/>
        <!-- Liver Shape: Wedge / Triangular reddish brown -->
        <path d="M22 42c6-14 36-16 56-6 4 8 2 26-10 32-18 10-38 6-44-6-3-6-4-14-2-20z" fill="#d97706" stroke="#2f2a26" stroke-width="3"/>
        <!-- Gallbladder (Kantung Empedu) green sac -->
        <path d="M48 64c-2 6 2 12 6 12s8-4 6-10-4-8-8-8c-2 0-3 3-4 6z" fill="#22c55e" stroke="#2f2a26" stroke-width="2"/>
        <!-- Fissure line -->
        <path d="M52 38c-2 8-1 18 2 24" stroke="#92400e" stroke-width="2.5" stroke-linecap="round"/>
        <!-- Cute Face -->
        <circle cx="42" cy="46" r="3" fill="#ffffff"/>
        <circle cx="42" cy="46" r="1.5" fill="#2f2a26"/>
        <circle cx="62" cy="46" r="3" fill="#ffffff"/>
        <circle cx="62" cy="46" r="1.5" fill="#2f2a26"/>
        <path d="M48 52q4 3 8 0" stroke="#2f2a26" stroke-width="2.5" stroke-linecap="round"/>
      </svg>
    `
  },

  intestines: {
    id: 'intestines',
    story: 'Wuuush, meluncur di perosotan panjang yang seru! Halo Dokter Cilik! Kami Usus Halus dan Usus Besar! Panjang kami sampai tujuh meter loh, seperti ular ramah yang menyerap semua vitamin lezat dari makananmu! Slurp, lezatnya vitamin!',
    name: 'Usus Halus & Besar',
    latinName: 'Intestinum Tenue & Crassum',
    system: 'pencernaan',
    systemName: 'Sistem Pencernaan & Penyerapan',
    funTitle: 'Usus si Jalur Penyerapan Nutrisi',
    emoji: '〰️',
    primaryColor: '#f97316',
    secondaryColor: '#c2410c',
    summary: 'Menyerap 90% sari makanan, vitamin, dan air agar kita punya tenaga untuk berlari dan bermain.',
    description: 'Usus halus memiliki panjang sekitar 6 meter yang berkelok rapi di dalam perut. Di sekelilingnya ada usus besar yang menyerap sisa air dan dihuni miliaran bakteri baik (probiotik).',
    funFacts: [
      'Panjang usus halus manusia dewasa mencapai sekitar 6-7 meter, lebih panjang dari seekor jerapah dewasa!',
      'Dinding usus halus dipenuhi jutaan tonjolan kecil bernama vili yang menyerap nutrisi ke dalam darah.',
      'Bakteri baik di usus besar membantu tubuh memproduksi vitamin K yang penting untuk membekukan darah saat luka.'
    ],
    healthTips: 'Konsumsi makanan berserat tinggi seperti pepaya, pisang, sayur bayam, dan yogurt untuk menjaga usus lancar!',
    soundType: 'digestive',
    targetPos: { x: 50, y: 58, width: 46, height: 38 },
    realisticImage: '/assets/realistic_digestive_3d.png',
    clinicalMetrics: {
      'Panjang Usus Halus': '6.0 - 6.5 Meter',
      'Luas Area Absorpsi': '~250 m² (Selapangan Tenis)',
      'Mikrobioma Baik': '>100 Triliun Sel'
    },
    renderSVG: (size = 80, animate = true) => `
      <svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" class="organ-svg ${animate ? 'organ-wiggle' : ''}">
        <circle cx="50" cy="50" r="46" fill="#fff7ed" stroke="#f97316" stroke-width="2.5" stroke-dasharray="4 2"/>
        <!-- Large Intestine (Usus Besar Outer Frame) -->
        <path d="M26 66V38c0-8 8-14 16-14h16c8 0 16 6 16 14v28c0 6-6 10-12 10h-4" stroke="#ea580c" stroke-width="9" stroke-linecap="round" fill="none"/>
        <path d="M26 66V38c0-8 8-14 16-14h16c8 0 16 6 16 14v28c0 6-6 10-12 10h-4" stroke="#2f2a26" stroke-width="2" stroke-linecap="round" fill="none"/>
        <!-- Small Intestine (Usus Halus Coils Inside) -->
        <path d="M38 46c4-3 10-3 14 0s10 3 14 0m-28 8c4-3 10-3 14 0s10 3 14 0m-26 8c4-3 8-3 12 0s8 3 12 0" stroke="#f97316" stroke-width="6" stroke-linecap="round"/>
        <path d="M38 46c4-3 10-3 14 0s10 3 14 0m-28 8c4-3 10-3 14 0s10 3 14 0m-26 8c4-3 8-3 12 0s8 3 12 0" stroke="#2f2a26" stroke-width="1.8" stroke-linecap="round"/>
        <!-- Cute Face -->
        <circle cx="44" cy="40" r="2.5" fill="#2f2a26"/>
        <circle cx="56" cy="40" r="2.5" fill="#2f2a26"/>
        <path d="M47 43q3 2 6 0" stroke="#2f2a26" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `
  },

  kidneys: {
    id: 'kidneys',
    story: 'Syuuur! Filter air ajaib aktif! Halo Dokter Cilik! Kami sepasang Ginjal si Penyaring Super! Bentuk kami imut seperti kacang merah kembar! Kami rajin menyaring air agar tubuhmu selalu segar dan bersih! Yuk banyak minum air putih!',
    name: 'Ginjal',
    latinName: 'Ren',
    system: 'ekskresi',
    systemName: 'Sistem Ekskresi & Saluran Kemih',
    funTitle: 'Ginjal si Sepasang Penyaring Hebat',
    emoji: '🫘',
    primaryColor: '#8b5cf6',
    secondaryColor: '#6d28d9',
    summary: 'Menyaring darah sepanjang hari untuk membuang zat sisa dan menjaga keseimbangan air tubuh.',
    description: 'Kita memiliki sepasang ginjal berbentuk seperti kacang merah di bagian punggung bawah. Setiap ginjal memiliki sekitar satu juta nefron penyaring yang sangat cermat.',
    funFacts: [
      'Sepasang ginjal menyaring sekitar 180 liter darah setiap hari dan menghasilkan 1-2 liter air seni (urine).',
      'Ginjal mengatur jumlah garam, air, dan mineral agar sel-sel tubuh bekerja seimbang.',
      'Seseorang bisa hidup sehat normal bahkan hanya dengan satu buah ginjal saja!'
    ],
    healthTips: 'Minum minimal 6-8 gelas air putih setiap hari dan jangan suka menahan buang air kecil!',
    soundType: 'pop',
    targetPos: { x: 50, y: 50, width: 44, height: 26 },
    realisticImage: '/assets/realistic_kidneys_3d.png',
    clinicalMetrics: {
      'Filtrasi Harian': '180 Liter Darah / hari',
      'Jumlah Nefron': '~2.000.000 Nefron',
      'Ekskresi Urine': '1.5 Liter / hari'
    },
    renderSVG: (size = 80, animate = true) => `
      <svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" class="organ-svg ${animate ? 'organ-bounce' : ''}">
        <circle cx="50" cy="50" r="46" fill="#f5f3ff" stroke="#8b5cf6" stroke-width="2.5" stroke-dasharray="4 2"/>
        <!-- Aorta & Vena Cava in the middle -->
        <path d="M47 22v56" stroke="#ef4444" stroke-width="4" stroke-linecap="round"/>
        <path d="M53 22v56" stroke="#3b82f6" stroke-width="4" stroke-linecap="round"/>
        <!-- Left Kidney (Bean shape) -->
        <path d="M36 38c-8 0-14 6-14 14 0 10 8 16 14 16 4 0 8-4 8-10 0-8-4-20-8-20z" fill="#a78bfa" stroke="#2f2a26" stroke-width="2.5"/>
        <!-- Right Kidney (Bean shape) -->
        <path d="M64 38c8 0 14 6 14 14 0 10-8 16-14 16-4 0-8-4-8-10 0-8 4-20 8-20z" fill="#8b5cf6" stroke="#2f2a26" stroke-width="2.5"/>
        <!-- Ureters going down -->
        <path d="M38 58c2 8 8 16 10 20" stroke="#ca8a04" stroke-width="2" stroke-linecap="round"/>
        <path d="M62 58c-2 8-8 16-10 20" stroke="#ca8a04" stroke-width="2" stroke-linecap="round"/>
        <!-- Cute faces -->
        <circle cx="30" cy="48" r="2" fill="#2f2a26"/>
        <circle cx="70" cy="48" r="2" fill="#2f2a26"/>
        <path d="M28 53q2 2 4 0" stroke="#2f2a26" stroke-width="1.8"/>
        <path d="M68 53q2 2 4 0" stroke="#2f2a26" stroke-width="1.8"/>
      </svg>
    `
  },

  skeleton: {
    id: 'skeleton',
    story: 'Klak klak klak! Kokoh dan gagah! Halo Dokter Cilik! Aku si Rangka Tulang Pahlawan Tubuh! Ada dua ratus enam tulang hebat yang bikin kamu bisa berdiri tegak, melompat tinggi, dan menari ceria! Tanpa aku, tubuhmu lemas seperti agar-agar loh! Hehehe!',
    name: 'Rangka Tulang',
    latinName: 'Systema Skeletale',
    system: 'gerak',
    systemName: 'Sistem Gerak & Rangka',
    funTitle: 'Rangka si Benteng Penopang Tubuh',
    emoji: '🦴',
    primaryColor: '#e2e8f0',
    secondaryColor: '#94a3b8',
    summary: '206 tulang yang menopang postur tubuh berdiri tegak, melindungi organ lunak, dan tempat melekatnya otot.',
    description: 'Tengkorak melindungi otak, tulang rusuk membentuk sangkar pelindung jantung dan paru, serta tulang belakang menjaga tubuh tegap dan fleksibel saat membungkuk.',
    funFacts: [
      'Bayi baru lahir memiliki sekitar 300 tulang yang seiring tumbuh akan menyatu menjadi 206 tulang saat dewasa.',
      'Tulang terpanjang dan terkuat adalah tulang paha (femur), sedangkan tulang terkecil ada di dalam telinga (stapes/sanggurdi).',
      'Di dalam sumsum tulang kita, tubuh memproduksi jutaan sel darah baru setiap detik!'
    ],
    healthTips: 'Minum susu berkalsium, berjemur sinar matahari pagi untuk vitamin D, dan biasakan duduk tegak!',
    soundType: 'bone_snap',
    targetPos: { x: 50, y: 50, width: 70, height: 90 },
    realisticImage: '/assets/realistic_skeleton_3d.png',
    clinicalMetrics: {
      'Jumlah Tulang Dewasa': '206 Tulang',
      'Kandungan Mineral': 'Kalsium & Fosfat',
      'Tulang Terbesar': 'Femur (Paha)'
    },
    renderSVG: (size = 80, animate = true) => `
      <svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" class="organ-svg ${animate ? 'organ-shake' : ''}">
        <circle cx="50" cy="50" r="46" fill="#f8fafc" stroke="#64748b" stroke-width="2.5" stroke-dasharray="4 2"/>
        <!-- Skull -->
        <path d="M50 18c-9 0-15 7-15 15 0 6 4 9 7 11v4h16v-4c3-2 7-5 7-11 0-8-6-15-15-15z" fill="#ffffff" stroke="#2f2a26" stroke-width="2.5"/>
        <circle cx="44" cy="30" r="3.5" fill="#2f2a26"/>
        <circle cx="56" cy="30" r="3.5" fill="#2f2a26"/>
        <path d="M47 43h6" stroke="#2f2a26" stroke-width="2"/>
        <!-- Spine Vertebrae -->
        <path d="M50 48v32" stroke="#64748b" stroke-width="4" stroke-linecap="round"/>
        <!-- Ribcage (Tulang Rusuk) -->
        <path d="M38 52c6-3 18-3 24 0M34 58c8-3 24-3 32 0M36 64c7-2 21-2 28 0" stroke="#2f2a26" stroke-width="2.5" stroke-linecap="round"/>
        <!-- Pelvis (Panggul) -->
        <path d="M36 78c4-4 24-4 28 0-4 6-24 6-28 0z" fill="#ffffff" stroke="#2f2a26" stroke-width="2.5"/>
        <!-- Femur Bones -->
        <path d="M40 82l-4 14m24-14l4 14" stroke="#2f2a26" stroke-width="3" stroke-linecap="round"/>
      </svg>
    `
  },

  blood_cells: {
    id: 'blood_cells',
    story: 'Siaga satu, pasukan siap meluncur! Wuuush! Halo Dokter Cilik! Kami si Pasukan Sel Darah Ajaib! Sel darah merah mengantar oksigen, dan sel darah putih siap membasmi kuman jahat! Kami pahlawan kecil pelindungmu! Horeee!',
    name: 'Sel Darah & Imun',
    latinName: 'Sanguis & Systema Immunitatis',
    system: 'sirkulasi',
    systemName: 'Sistem Sirkulasi & Pertahanan',
    funTitle: 'Pahlawan Darah & Pasukan Imun',
    emoji: '🩸',
    primaryColor: '#f43f5e',
    secondaryColor: '#e11d48',
    summary: 'Eritrosit kurir oksigen, Leukosit tentara penumpas kuman, dan Trombosit penutup luka berdarah.',
    description: 'Setiap tetes darah mengandung jutaan prajurit kecil hebat. Sel darah putih mendeteksi bakteri jahat dan memakannya, sedangkan trombosit membekukan darah saat kita lecet tergores.',
    funFacts: [
      'Dalam satu tetes darah kecil terdapat sekitar 5 juta sel darah merah dan ribuan sel darah putih pembela tubuh!',
      'Sel darah merah berbentuk cakram berlekuk (bikonkaf) agar fleksibel melewati pembuluh kapiler yang sangat sempit.',
      'Sistem kekebalan tubuh punya memori cerdas untuk mengingat kuman lama sehingga kita kebal setelah vaksinasi.'
    ],
    healthTips: 'Cuci tangan dengan sabun sebelum makan, istirahat cukup, dan dapatkan imunisasi lengkap agar tentara tubuh selalu siap tempur!',
    soundType: 'neural',
    targetPos: { x: 50, y: 72, width: 36, height: 36 },
    realisticImage: '/assets/realistic_blood_3d.png',
    clinicalMetrics: {
      'Populasi Eritrosit': '4.5 - 5.5 Juta / μL',
      'Masa Hidup Sel': '120 Hari',
      'Waktu Sirkulasi': '60 Detik / Siklus'
    },
    renderSVG: (size = 80, animate = true) => `
      <svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" class="organ-svg ${animate ? 'organ-float' : ''}">
        <circle cx="50" cy="50" r="46" fill="#fff1f2" stroke="#f43f5e" stroke-width="2.5" stroke-dasharray="4 2"/>
        <!-- Red Blood Cell (Eritrosit) -->
        <circle cx="38" cy="44" r="20" fill="#f43f5e" stroke="#2f2a26" stroke-width="2.5"/>
        <circle cx="38" cy="44" r="9" fill="#e11d48" opacity="0.8"/>
        <!-- RBC Face -->
        <circle cx="33" cy="42" r="2" fill="#ffffff"/>
        <circle cx="43" cy="42" r="2" fill="#ffffff"/>
        <path d="M36 48q2 2 4 0" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round"/>
        <!-- White Blood Cell Superhero (Leukosit) with shield -->
        <circle cx="66" cy="62" r="16" fill="#f8fafc" stroke="#2f2a26" stroke-width="2.5"/>
        <circle cx="63" cy="60" r="2" fill="#2f2a26"/>
        <circle cx="71" cy="60" r="2" fill="#2f2a26"/>
        <path d="M65 65q2 2 4 0" stroke="#2f2a26" stroke-width="1.8"/>
        <!-- Superhero cape / star on leukosit -->
        <polygon points="67 48 69 52 73 53 70 56 71 60 67 58 63 60 64 56 61 53 65 52" fill="#ffd60a" stroke="#ca8a04" stroke-width="1"/>
        <!-- Platelet (Trombosit) band-aid star -->
        <rect x="22" y="66" width="16" height="8" rx="2" transform="rotate(-20 22 66)" fill="#fed7aa" stroke="#2f2a26" stroke-width="1.5"/>
      </svg>
    `
  },

  senses_eye: {
    id: 'senses_eye',
    story: 'Ciluk baaa! Cling! Halo Dokter Cilik! Kami si Mata Jendela Dunia yang bersinar! Kedip-kedip, kami bisa melihat warna-warni pelangi yang indah, wajah tersenyum ayah bunda, dan buku cerita seru! Kedip-kedip ceria!',
    name: 'Mata (Penglihatan)',
    latinName: 'Oculus',
    system: 'indera',
    systemName: 'Panca Indera',
    funTitle: 'Mata si Kamera Ajaib',
    emoji: '👁️',
    primaryColor: '#0ea5e9',
    secondaryColor: '#0369a1',
    summary: 'Menangkap cahaya dunia luar dan mengirim gambaran warna-warni indah ke otak kita.',
    description: 'Kornea dan lensa mata memfokuskan cahaya ke retina. Retina memiliki jutaan sel penerima cahaya (batang dan kerucut) yang mendeteksi warna merah, hijau, dan biru.',
    funFacts: [
      'Mata kita berkedip rata-rata 15-20 kali setiap menit untuk menjaga bola mata tetap basah dan bersih.',
      'Otot mata adalah otot yang paling aktif bergerak di seluruh tubuh kita.',
      'Mata manusia dapat membedakan sekitar 10 juta variasi warna yang berbeda!'
    ],
    healthTips: 'Jangan membaca di tempat gelap, batasi waktu bermain gawai (screen time), dan makan wortel serta tomat!',
    soundType: 'pop',
    targetPos: { x: 45, y: 16, width: 22, height: 22 },
    realisticImage: '/assets/realistic_sensory_3d.png',
    clinicalMetrics: {
      'Resolusi Visual': '~576 Megapiksel',
      'Fotoreseptor': '130 Juta Sel',
      'Spektrum Cahaya': '380 - 740 nm'
    },
    renderSVG: (size = 80, animate = true) => `
      <svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" class="organ-svg ${animate ? 'organ-pulse-slow' : ''}">
        <circle cx="50" cy="50" r="46" fill="#f0f9ff" stroke="#0ea5e9" stroke-width="2.5" stroke-dasharray="4 2"/>
        <!-- Eyeball Contour -->
        <path d="M16 50c12-16 56-16 68 0-12 16-56 16-68 0z" fill="#ffffff" stroke="#2f2a26" stroke-width="3"/>
        <!-- Iris (Turquoise Blue) -->
        <circle cx="50" cy="50" r="16" fill="#0ea5e9" stroke="#2f2a26" stroke-width="2"/>
        <!-- Pupil -->
        <circle cx="50" cy="50" r="9" fill="#0f172a"/>
        <!-- Glint reflections -->
        <circle cx="46" cy="46" r="3.5" fill="#ffffff"/>
        <circle cx="54" cy="53" r="1.5" fill="#ffffff"/>
        <!-- Eyelashes -->
        <path d="M38 34l-4-6m16 4v-7m16 7l4-6" stroke="#2f2a26" stroke-width="2.5" stroke-linecap="round"/>
      </svg>
    `
  },

  senses_ear: {
    id: 'senses_ear',
    story: 'Ting-tung-ting! Musik ceria berdering! Halo Dokter Cilik! Kami si Telinga Penangkap Suara Ajaib! Kami bisa mendengar suara kicau burung, lagu gembira, sampai tawa bahagiamu bersama teman-teman! Dengarkan nada merdunya ya!',
    name: 'Telinga (Pendengaran)',
    latinName: 'Auris',
    system: 'indera',
    systemName: 'Panca Indera',
    funTitle: 'Telinga si Penangkap Gelombang Suara',
    emoji: '👂',
    primaryColor: '#f59e0b',
    secondaryColor: '#b45309',
    summary: 'Menangkap getaran suara musik, bisikan, dan suara alam serta menjaga keseimbangan tubuh.',
    description: 'Getaran suara masuk lewat daun telinga, menggetarkan gendang telinga, diteruskan oleh 3 tulang kecil (martil, landasan, sanggurdi) ke rumah siput (koklea) menuju saraf pendengaran.',
    funFacts: [
      'Telinga tidak hanya untuk mendengar, tetapi cairan di saluran setengah lingkaran di telinga dalam menjaga kamu tidak jatuh saat berdiri tegak!',
      'Telinga kita tidak pernah tidur; mereka tetap menangkap getaran suara bahkan saat kita sedang tertidur lelap.',
      'Tulang sanggurdi di dalam telinga adalah tulang terkecil di seluruh tubuh manusia (hanya 3 milimeter!).'
    ],
    healthTips: 'Hindari mendengarkan musik lewat earphone terlalu kencang dan jangan memasukkan benda keras ke lubang telinga!',
    soundType: 'pop',
    targetPos: { x: 30, y: 17, width: 20, height: 22 },
    realisticImage: '/assets/realistic_sensory_3d.png',
    clinicalMetrics: {
      'Frekuensi Pendengaran': '20 Hz - 20.000 Hz',
      'Tulang Terkecil': 'Stapes (3 mm)',
      'Sel Rambut Koklea': '~16.000 Sel'
    },
    renderSVG: (size = 80, animate = true) => `
      <svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" class="organ-svg ${animate ? 'organ-wiggle' : ''}">
        <circle cx="50" cy="50" r="46" fill="#fefce8" stroke="#f59e0b" stroke-width="2.5" stroke-dasharray="4 2"/>
        <!-- Outer Ear Cartilage Pinna -->
        <path d="M42 22c16 0 26 12 26 26 0 16-10 28-22 28-10 0-14-8-14-14 0-4 4-8 8-8 6 0 8 4 10 8" fill="#fed7aa" stroke="#2f2a26" stroke-width="3" stroke-linecap="round"/>
        <!-- Inner ear folds (Antihelix & Tragus) -->
        <path d="M44 32c8 4 12 10 10 18m-4 6c-2 2-6 2-6-2" stroke="#ea580c" stroke-width="2.5" stroke-linecap="round"/>
        <!-- Sound waves coming in -->
        <path d="M74 36c4 4 6 9 6 14s-2 10-6 14" stroke="#f59e0b" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M82 30c6 6 9 13 9 20s-3 14-9 20" stroke="#f59e0b" stroke-width="2.5" stroke-linecap="round"/>
      </svg>
    `
  },

  senses_skin: {
    id: 'senses_skin',
    story: 'Ciluk ba! Sentuhan lembut dan hangat! Halo Dokter Cilik! Aku si Kulit Jubah Pelindung Super! Aku bisa merasakan angin sepoi-sepoi, hangatnya pelukan ibu, dan melindungimu dari kuman jahat! Rasakan pelukan hangat!',
    name: 'Kulit (Peraba & Pelindung)',
    latinName: 'Cutis & Integumentum',
    system: 'indera',
    systemName: 'Panca Indera & Pelindung',
    funTitle: 'Kulit si Perisai Mantel Tubuh',
    emoji: '🧴',
    primaryColor: '#f97316',
    secondaryColor: '#ea580c',
    summary: 'Organ terluas yang melindungi organ dalam dari kuman, mengatur suhu tubuh, dan merasakan sentuhan.',
    description: 'Kulit terdiri atas lapisan epidermis, dermis, dan hipodermis. Kulit kita dilengkapi sensor sentuhan halus, tekanan, getaran, suhu hangat/dingin, serta rasa nyeri yang melindungi kita dari bahaya.',
    funFacts: [
      'Kulit adalah organ tubuh manusia yang paling berat dan terluas (mencapai sekitar 2 meter persegi)!',
      'Kulit melepaskan sekitar 30.000 hingga 40.000 sel kulit mati setiap menitnya dan menggantinya dengan yang baru.',
      'Keringat yang keluar dari pori-pori kulit membantu mendinginkan suhu tubuh saat udara panas.'
    ],
    healthTips: 'Mandi dua kali sehari dengan sabun lembut, gunakan tabir surya saat terik, dan minum air putih agar kulit tetap lembap!',
    soundType: 'pop',
    targetPos: { x: 50, y: 50, width: 80, height: 95 },
    realisticImage: '/assets/realistic_anatomy_hero.png',
    clinicalMetrics: {
      'Luas Permukaan': '1.5 - 2.0 m²',
      'Reseptor Sentuhan': '~5 Juta Sensor',
      'Siklus Regenerasi': 'Setiap 28 Hari'
    },
    renderSVG: (size = 80, animate = true) => `
      <svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" class="organ-svg ${animate ? 'organ-float' : ''}">
        <circle cx="50" cy="50" r="46" fill="#fff7ed" stroke="#f97316" stroke-width="2.5" stroke-dasharray="4 2"/>
        <!-- Skin Layer Block Diagram -->
        <rect x="20" y="32" width="60" height="14" rx="3" fill="#fed7aa" stroke="#2f2a26" stroke-width="2.5"/>
        <text x="50" y="42" font-size="8" font-weight="bold" fill="#7c2d12" text-anchor="middle">Epidermis</text>
        <rect x="20" y="46" width="60" height="20" rx="2" fill="#fca5a5" stroke="#2f2a26" stroke-width="2.5"/>
        <text x="50" y="58" font-size="8" font-weight="bold" fill="#881337" text-anchor="middle">Dermis</text>
        <rect x="20" y="66" width="60" height="14" rx="3" fill="#fef08a" stroke="#2f2a26" stroke-width="2.5"/>
        <text x="50" y="76" font-size="8" font-weight="bold" fill="#713f12" text-anchor="middle">Hipodermis (Lemak)</text>
        <!-- Hair Strand extending up -->
        <path d="M42 60c4-16-2-34 8-42" stroke="#2f2a26" stroke-width="3" stroke-linecap="round"/>
        <!-- Touch Receptor Star -->
        <circle cx="64" cy="54" r="3" fill="#38bdf8" stroke="#0369a1" stroke-width="1.5"/>
      </svg>
    `
  }
};

// 2. Progressive Learning Curriculum (5 Educational Levels)
export const CURRICULUM_LEVELS: CurriculumLevel[] = [
  {
    id: 1,
    title: 'Tingkat 1: Panca Indera & Pelindung Luar',
    subtitle: 'Mengenal Mata, Telinga, dan Perisai Kulit',
    description: 'Jelajahi bagaimana panca indera menangkap indahnya dunia dan kulit melindungimu!',
    badge: '🌟 Detektif Indera Cilik',
    xpReward: 200,
    organs: ['senses_eye', 'senses_ear', 'senses_skin'],
    isLockedDefault: false // Free Demo
  },
  {
    id: 2,
    title: 'Tingkat 2: Mesin Pompa & Paru-Paru Nafas',
    subtitle: 'Rahasia Jantung dan Pabrik Oksigen Alveolus',
    description: 'Dengarkan suara detak jantung stetoskop dan pelajari sirkulasi udara bernapas!',
    badge: '🫀 Ahli Jantung & Paru',
    xpReward: 350,
    organs: ['heart', 'lungs'],
    isLockedDefault: false // Free Demo
  },
  {
    id: 3,
    title: 'Tingkat 3: Pabrik Pengolah Makanan & Sari Nutrisi',
    subtitle: 'Perjalanan Lambung, Hati Penawar Racun & Usus',
    description: 'Telusuri bagaimana makanan diubah menjadi energi gerak yang melimpah!',
    badge: '🥗 Ahli Pencernaan Sehat',
    xpReward: 500,
    organs: ['stomach', 'liver', 'intestines'],
    isLockedDefault: true // VIP Gate
  },
  {
    id: 4,
    title: 'Tingkat 4: Markas Komando Otak, Ginjal & Pahlawan Imun',
    subtitle: 'Saraf Pikiran, Penyaring Darah & Pasukan Sel Darah',
    description: 'Pelajari miliaran neuron listrik dan pertempuran leukosit melawan kuman penyakit!',
    badge: '🧠 Spesialis Saraf & Imun',
    xpReward: 750,
    organs: ['brain', 'kidneys', 'blood_cells'],
    isLockedDefault: true // VIP Gate
  },
  {
    id: 5,
    title: 'Tingkat 5: Benteng Tulang & Bedah Presisi Dokter Cilik',
    subtitle: 'Menyusun Rangka 206 Tulang & Ujian Spesialis Medis',
    description: 'Rakit seluruh organ tubuh secara presisi dan pecahkan tantangan diagnosa pasien!',
    badge: '🏆 Profesor Anatomi Indonesia',
    xpReward: 1000,
    organs: ['skeleton', 'heart', 'lungs', 'brain', 'stomach', 'liver', 'intestines', 'kidneys'],
    isLockedDefault: true // VIP Gate
  }
];

// 3. Clinical Cases for Mode 3: Klinik Diagnostik Dokter Cilik
export const CLINICAL_CASES: ClinicalCase[] = [
  {
    id: 'case_1',
    patientName: 'Doni (8 Tahun)',
    patientAge: '8 Tahun - Murid Kelas 2 SD',
    avatar: '👦',
    chiefComplaint: 'Dada berdegup kencang dan nafas terengah-engah setelah lomba lari',
    story: 'Doni baru saja menyelesaikan lari cepat di sekolah. Dadanya berdenyut cepat dan ia bernafas terengah-engah.',
    correctOrganId: 'heart',
    examinationTool: 'stethoscope',
    toolFinding: 'Detak jantung terdeteksi 135 bpm (laju normal saat olahraga). Tidak ada kelainan katup, jantung bekerja memompa oksigen ekstra.',
    treatment: 'Istirahat duduk bersandar, atur napas perlahan dan minum air putih suhu ruang.',
    doctorTip: 'Saat berlari, otot tubuh membutuhkan lebih banyak oksigen sehingga jantung otomatis memompa lebih cepat!'
  },
  {
    id: 'case_2',
    patientName: 'Alya (6 Tahun)',
    patientAge: '6 Tahun - TK B',
    avatar: '👧',
    chiefComplaint: 'Perut sakit melilit dan kembung setelah jajan tanpa cuci tangan',
    story: 'Alya jajan bakso pedas di pinggir jalan tanpa mencuci tangan terlebih dahulu. Sekarang perutnya perih melilit.',
    correctOrganId: 'stomach',
    examinationTool: 'stethoscope',
    toolFinding: 'Terdengar suara bising usus dan asam lambung meningkat akibat iritasi makanan pedas dan kuman.',
    treatment: 'Minum air hangat, makan bubur halus, dan minum obat antasida sesuai resep dokter.',
    doctorTip: 'Selalu cuci tangan dengan sabun sebelum makan untuk mematikan kuman yang bisa menginfeksi lambung!'
  },
  {
    id: 'case_3',
    patientName: 'Rian (10 Tahun)',
    patientAge: '10 Tahun - Kelas 4 SD',
    avatar: '🧒',
    chiefComplaint: 'Lutut dan kaki ngilu saat ditekuk setelah terjatuh dari sepeda',
    story: 'Rian terjatuh dari sepeda saat melompati gundukan. Kaki bagian bawahnya terasa sakit saat digerakkan.',
    correctOrganId: 'skeleton',
    examinationTool: 'xray',
    toolFinding: 'Pemeriksaan Sinar-X menunjukkan tidak ada tulang patah (fraktur), hanya memar pada jaringan sekitar sendi lutut.',
    treatment: 'Kompres dingin dengan es batu yang dibungkus kain bersih selama 15 menit dan istirahatkan kaki.',
    doctorTip: 'Selalu kenakan helm dan pelindung lutut saat bersepeda agar benteng tulangmu selalu aman!'
  },
  {
    id: 'case_4',
    patientName: 'Siti (7 Tahun)',
    patientAge: '7 Tahun - Kelas 1 SD',
    avatar: '👧',
    chiefComplaint: 'Batuk kering dan dada terasa sesak saat udara berdebu',
    story: 'Siti bermain di jalanan berdebu tebal. Ia mulai batuk-batuk dan merasa tarikan nafasnya tidak lega.',
    correctOrganId: 'lungs',
    examinationTool: 'stethoscope',
    toolFinding: 'Terdengar suara mengi halus di saluran bronkus paru-paru akibat iritasi partikel debu halus.',
    treatment: 'Pindahkan pasien ke ruangan berventilasi bersih, berikan uap hangat dan minum air putih hangat.',
    doctorTip: 'Paru-paru memiliki rambut halus (silia) yang menyapu debu, tetapi masker melindungi paru-paru dari debu berlebih!'
  },
  {
    id: 'case_5',
    patientName: 'Bima (9 Tahun)',
    patientAge: '9 Tahun - Kelas 3 SD',
    avatar: '👦',
    chiefComplaint: 'Badan demam meriang dan tenggorokan merah melawan kuman flu',
    story: 'Bima tertular flu dari temannya. Suhu badannya naik menjadi 38,5°C dan merasa lemas.',
    correctOrganId: 'blood_cells',
    examinationTool: 'thermometer',
    toolFinding: 'Suhu tubuh 38,5°C menandakan tentara sel darah putih (leukosit) sedang aktif memproduksi antibodi membunuh virus flu.',
    treatment: 'Kompres air hangat di dahi, minum banyak air putih, dan tidur istirahat penuh.',
    doctorTip: 'Demam adalah tanda pertahanan alami bahwa pasukan leukositmu sedang bekerja keras mengalahkan kuman!'
  },
  {
    id: 'case_6',
    patientName: 'Nadia (11 Tahun)',
    patientAge: '11 Tahun - Kelas 5 SD',
    avatar: '👧',
    chiefComplaint: 'Kepala pusing berdenyut dan sulit fokus setelah belajar semalaman tanpa tidur',
    story: 'Nadia belajar terlalu larut malam untuk ujian sekolah dan hanya tidur 3 jam. Kepalanya pusing dan sulit berpikir jernih.',
    correctOrganId: 'brain',
    examinationTool: 'thermometer',
    toolFinding: 'Tekanan dan kelelahan mental, saraf otak mengalami kelelahan akibat kekurangan istirahat REM tidur.',
    treatment: 'Tidur nyenyak 8 jam, minum air putih, dan istirahatkan mata dari layar monitor atau gawai.',
    doctorTip: 'Otak kita membutuhkan tidur lelap untuk merapikan memori belajar dan mengisi ulang tenaga neuron!'
  }
];
