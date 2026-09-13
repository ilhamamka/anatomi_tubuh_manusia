// Interactive Physiology Pathway Simulator
// Animates Food Digestion, Blood Circulation, and Oxygen Respiration
// Aligned with Indonesian National Science Curriculum (IPAS SD & SMP)

import { sound } from './audio';

export interface PathwayStep {
  stepNumber: number;
  title: string;
  organName: string;
  organEmoji: string;
  summary: string;
  soundType: 'pop' | 'swallow' | 'digestive' | 'heartbeat' | 'breath' | 'neural' | 'bone_snap';
  narration: string;
  posX: number; // SVG viewbox percent 0-100
  posY: number;
}

export interface PathwayDefinition {
  id: 'digestion' | 'circulation' | 'respiration';
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  curriculumBadge: string;
  steps: PathwayStep[];
}

export const PATHWAYS: Record<string, PathwayDefinition> = {
  digestion: {
    id: 'digestion',
    title: 'Alur Perjalanan Makanan (Sistem Pencernaan)',
    subtitle: 'Ikuti petualangan makanan lezat dari gigitan pertama hingga menjadi sari tenaga tubuh!',
    icon: '🥪',
    color: '#f59e0b',
    curriculumBadge: 'IPAS SD Kelas 5: Alur Organ Pencernaan Manusia',
    steps: [
      {
        stepNumber: 1,
        title: 'Pos 1: Rongga Mulut (Oral Cavity)',
        organName: 'Mulut & Gigi',
        organEmoji: '👄',
        summary: 'Makanan dikunyah menjadi potongan kecil oleh gigi dan dibasahi enzim ptialin air liur.',
        soundType: 'pop',
        narration: 'Krak nyam nyam! Makanan lezat pertama kali digigit oleh gigi seri, dikunyah gigi geraham, dan dibasahi enzim ptialin agar manis dan lembut!',
        posX: 50,
        posY: 12
      },
      {
        stepNumber: 2,
        title: 'Pos 2: Kerongkongan (Esofagus)',
        organName: 'Kerongkongan',
        organEmoji: '🥖',
        summary: 'Gerak peristaltik meremas dan mendorong gumpalan makanan (bolus) menuju lambung.',
        soundType: 'pop',
        narration: 'Wuuush! Otot kerongkongan melakukan gerak peristaltik seperti meremas gelombang, meluncurkan makanan langsung ke pintu lambung!',
        posX: 50,
        posY: 26
      },
      {
        stepNumber: 3,
        title: 'Pos 3: Lambung (Gaster)',
        organName: 'Lambung Ajaib',
        organEmoji: '🥣',
        summary: 'Asam lambung (HCl) dan enzim pepsin mengaduk makanan menjadi bubur halus (kimus).',
        soundType: 'digestive',
        narration: 'Kruuuk kruuuk! Jus asam lambung yang super kuat melumat makanan dan membunuh kuman jahat, mengubahnya jadi bubur halus bergizi!',
        posX: 46,
        posY: 44
      },
      {
        stepNumber: 4,
        title: 'Pos 4: Usus Halus (Intestinum Tenue)',
        organName: 'Usus Halus 6 Meter',
        organEmoji: '🌀',
        summary: 'Jutaan vili menyerap 90% sari pati vitamin, protein, dan gula ke dalam pembuluh darah.',
        soundType: 'digestive',
        narration: 'Slurp! Meluncur di perosotan usus halus sepanjang enam meter! Jutaan vili menyerap vitamin dan protein ke darahmu agar kamu tumbuh tinggi dan kuat!',
        posX: 50,
        posY: 60
      },
      {
        stepNumber: 5,
        title: 'Pos 5: Usus Besar (Kolon)',
        organName: 'Usus Besar & Probiotik',
        organEmoji: '〰️',
        summary: 'Menyerap kembali kelebihan air dan mineral serta memadatkan sisa serat makanan.',
        soundType: 'pop',
        narration: 'Syuuur! Usus besar menyerap kelebihan air agar tubuh tidak dehidrasi, dibantu oleh triliunan bakteri baik probiotik yang ramah!',
        posX: 50,
        posY: 76
      },
      {
        stepNumber: 6,
        title: 'Pos 6: Rektum & Anus',
        organName: 'Anus (Pembuangan Akhir)',
        organEmoji: '🚽',
        summary: 'Mengeluarkan ampas sisa makanan yang sudah tidak terpakai dari tubuh secara teratur.',
        soundType: 'pop',
        narration: 'Pemberhentian terakhir! Tubuh kita membuang sisa ampas makanan secara teratur agar perut selalu terasa lega, bersih, dan nyaman!',
        posX: 50,
        posY: 90
      }
    ]
  },

  circulation: {
    id: 'circulation',
    title: 'Alur Sirkulasi Peredaran Darah (Besar & Kecil)',
    subtitle: 'Menjelajahi siklus darah mengantar oksigen ke seluruh sel tubuh dan membersihkan karbondioksida!',
    icon: '🫀',
    color: '#ef4444',
    curriculumBadge: 'IPAS SD Kelas 5: Sirkulasi Pulmonal & Sistemik',
    steps: [
      {
        stepNumber: 1,
        title: 'Pos 1: Bilik Kanan Jantung (Ventrikel Kanan)',
        organName: 'Bilik Kanan Jantung',
        organEmoji: '❤️',
        summary: 'Memompa darah yang kaya karbon dioksida (CO2) menuju paru-paru lewat arteri pulmonalis.',
        soundType: 'heartbeat',
        narration: 'Dug-dug! Bilik kanan jantung memompa darah yang lelah membawa karbondioksida melesat menuju paru-paru untuk dicuci bersih!',
        posX: 46,
        posY: 36
      },
      {
        stepNumber: 2,
        title: 'Pos 2: Paru-Paru (Pertukaran Gas Oksigen)',
        organName: 'Kantung Paru-Paru',
        organEmoji: '🫁',
        summary: 'Darah melepaskan gas CO2 dan menyerap jutaan molekul oksigen segar (O2) menjadi merah cerah.',
        soundType: 'breath',
        narration: 'Fiuuuh! Segarnya! Di dalam paru-paru, sel darah merah membuang karbondioksida dan memeluk oksigen segar, membuat darah kembali merah menyala!',
        posX: 32,
        posY: 30
      },
      {
        stepNumber: 3,
        title: 'Pos 3: Serambi Kiri & Bilik Kiri Jantung',
        organName: 'Bilik Kiri Otot Super',
        organEmoji: '💖',
        summary: 'Bilik terkuat memompa darah bertekanan tinggi melalui pembuluh darah utama Aorta.',
        soundType: 'heartbeat',
        narration: 'Dug-dug super kencang! Bilik kiri adalah otot terkuat di jantung, siap menyemprotkan darah segar beroksigen ke pembuluh aorta raksasa!',
        posX: 54,
        posY: 40
      },
      {
        stepNumber: 4,
        title: 'Pos 4: Otak & Kepala (Sirkulasi Atas)',
        organName: 'Kapiler Otak Cerdas',
        organEmoji: '🧠',
        summary: 'Oksigen dan nutrisi glukosa memberi daya berpikir pada 86 miliar sel saraf otak.',
        soundType: 'neural',
        narration: 'Ting! Aliran darah segar melesat ke atas menuju otak! Sel saraf bersorak gembira mendapat oksigen untuk berpikir cerdas dan belajar!',
        posX: 50,
        posY: 14
      },
      {
        stepNumber: 5,
        title: 'Pos 5: Organ Tubuh & Otot (Sirkulasi Bawah)',
        organName: 'Otot & Sel Seluruh Tubuh',
        organEmoji: '🏃',
        summary: 'Oksigen dipakai otot untuk berlari, bermain, dan menggerakkan seluruh tubuh.',
        soundType: 'pop',
        narration: 'Wuuush! Darah mengalir ke tangan, perut, dan kaki! Ototmu mendapatkan tenaga penuh untuk berlari kencang dan melompat gembira!',
        posX: 50,
        posY: 68
      },
      {
        stepNumber: 6,
        title: 'Pos 6: Serambi Kanan Jantung (Vena Cava)',
        organName: 'Pintu Masuk Serambi Kanan',
        organEmoji: '🔄',
        summary: 'Darah kembali ke jantung membawa sisa metabolisme untuk memulai siklus baru.',
        soundType: 'heartbeat',
        narration: 'Dug-dug! Darah kembali pulang ke serambi kanan melalui pembuluh vena cava, siap memulai petualangan putaran berikutnya tanpa henti!',
        posX: 46,
        posY: 32
      }
    ]
  },

  respiration: {
    id: 'respiration',
    title: 'Alur Pernapasan Oksigen (Sistem Respirasi)',
    subtitle: 'Menelusuri hembusan udara bersih dari lubang hidung hingga menembus alveolus!',
    icon: '🌬️',
    color: '#0284c7',
    curriculumBadge: 'IPAS SD & SMP: Struktur Jalur Saluran Pernapasan',
    steps: [
      {
        stepNumber: 1,
        title: 'Pos 1: Rongga Hidung (Cavum Nasi)',
        organName: 'Hidung & Rambut Hidung',
        organEmoji: '👃',
        summary: 'Udara disaring oleh bulu hidung, dilembapkan, dan dihangatkan sesuai suhu tubuh.',
        soundType: 'breath',
        narration: 'Tarik napas! Hidungmu punya bulu-bulu halus penyaring debu dan mukosa yang menghangatkan udara dingin agar pas dengan suhu tubuhmu!',
        posX: 50,
        posY: 14
      },
      {
        stepNumber: 2,
        title: 'Pos 2: Faring & Laring (Pita Suara)',
        organName: 'Katup Epiglotis & Pita Suara',
        organEmoji: '🗣️',
        summary: 'Katup epiglotis otomatis menutup saat menelan agar makanan tidak tersedak ke paru-paru.',
        soundType: 'pop',
        narration: 'Ada gerbang ajaib bernama epiglotis! Saat kamu menelan, katup ini menutup rapi agar makanan tidak salah masuk ke paru-paru!',
        posX: 50,
        posY: 24
      },
      {
        stepNumber: 3,
        title: 'Pos 3: Batang Tenggorokan (Trakea)',
        organName: 'Trakea Cincin Rawan',
        organEmoji: '🦯',
        summary: 'Pipa kokoh dengan cincin tulang rawan dan rambut silia pembersih kotoran.',
        soundType: 'breath',
        narration: 'Trakea seperti terowongan berpagar cincin tulang rawan yang kuat! Rambut silia mikro terus menyapu bersih kotoran ke atas!',
        posX: 50,
        posY: 34
      },
      {
        stepNumber: 4,
        title: 'Pos 4: Percabangan Bronkus (Bronchus)',
        organName: 'Bronkus Kanan & Kiri',
        organEmoji: '🌿',
        summary: 'Membagi aliran udara segar menuju paru-paru sebelah kanan dan sebelah kiri.',
        soundType: 'breath',
        narration: 'Jalan bercabang dua! Satu cabang bronkus menuju paru-paru kanan, dan satu cabang menuju paru-paru kiri seperti ranting pohon yang rindang!',
        posX: 50,
        posY: 44
      },
      {
        stepNumber: 5,
        title: 'Pos 5: Alveolus (Kantung Udara Emas)',
        organName: 'Jutaan Kantung Alveolus',
        organEmoji: '🍇',
        summary: 'Oksigen berdifusi menembus dinding tipis alveolus langsung diserap hemoglobin darah.',
        soundType: 'breath',
        narration: 'Horeee sampai di alveolus! Bentuknya seperti seikat buah anggur mini! Oksigen langsung melompat memeluk sel darah merah, wuuush!',
        posX: 40,
        posY: 54
      }
    ]
  }
};

export class PhysiologyFlowSimulator {
  private container: HTMLElement;
  private currentPathwayId: 'digestion' | 'circulation' | 'respiration' = 'digestion';
  private currentStepIndex: number = 0;
  private isAutoPlaying: boolean = false;
  private autoPlayTimer: number | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  public render(pathwayId: 'digestion' | 'circulation' | 'respiration' = 'digestion') {
    this.currentPathwayId = pathwayId;
    const pathway = PATHWAYS[this.currentPathwayId];
    const currentStep = pathway.steps[this.currentStepIndex] || pathway.steps[0];

    this.container.innerHTML = `
      <div class="flow-simulator-wrapper">
        <!-- Top Mode Selector -->
        <div class="flow-header neo-card">
          <div class="flow-tabs">
            <button class="flow-tab-btn ${this.currentPathwayId === 'digestion' ? 'active' : ''}" data-pathway="digestion" type="button">
              🥪 Alur Pencernaan Makanan
            </button>
            <button class="flow-tab-btn ${this.currentPathwayId === 'circulation' ? 'active' : ''}" data-pathway="circulation" type="button">
              🫀 Alur Peredaran Darah
            </button>
            <button class="flow-tab-btn ${this.currentPathwayId === 'respiration' ? 'active' : ''}" data-pathway="respiration" type="button">
              🌬️ Alur Pernapasan Oksigen
            </button>
          </div>

          <div class="flow-title-row">
            <div>
              <span class="curriculum-tag">${pathway.curriculumBadge}</span>
              <h2 class="flow-title">${pathway.title}</h2>
              <p class="flow-desc">${pathway.subtitle}</p>
            </div>
            <div class="flow-controls-top">
              <button id="btn-flow-autoplay" class="btn-neo-secondary" type="button">
                ${this.isAutoPlaying ? '⏸️ Jeda Simulasi' : '▶️ Putar Otomatis'}
              </button>
            </div>
          </div>
        </div>

        <!-- Simulation Arena -->
        <div class="flow-arena-grid">
          <!-- Left: SVG Animated Visual Highway -->
          <div class="flow-visual-card neo-card">
            <div class="flow-canvas-container">
              <svg viewBox="0 0 100 100" class="flow-svg-map">
                <!-- Background Silhouette Guide -->
                <path d="M50 8 C44 8 40 12 40 18 C40 23 44 26 44 30 C34 33 26 44 26 60 C26 72 32 86 40 96 L60 96 C68 86 74 72 74 60 C74 44 66 33 56 30 C56 26 60 23 60 18 C60 12 56 8 50 8 Z"
                      fill="#fef3c7" opacity="0.35" stroke="#d97706" stroke-width="0.8" stroke-dasharray="2 2"/>

                <!-- Connecting Flow Pathway Polyline -->
                <polyline points="${pathway.steps.map(s => `${s.posX},${s.posY}`).join(' ')}"
                          fill="none" stroke="${pathway.color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"
                          class="flow-highway-line"/>

                <!-- Animated Flow Particle Pulse -->
                <circle cx="${currentStep.posX}" cy="${currentStep.posY}" r="5.5"
                        fill="${pathway.color}" class="flow-moving-probe">
                  <animate attributeName="r" values="4;7;4" dur="1.2s" repeatCount="indefinite"/>
                </circle>

                <!-- Station Hotspots -->
                ${pathway.steps.map((s, idx) => `
                  <g class="flow-station-node ${idx === this.currentStepIndex ? 'is-active-station' : ''}"
                     data-step-index="${idx}" style="cursor: pointer;">
                    <circle cx="${s.posX}" cy="${s.posY}" r="${idx === this.currentStepIndex ? '5' : '3.8'}"
                            fill="${idx === this.currentStepIndex ? '#ffffff' : pathway.color}"
                            stroke="#2f2a26" stroke-width="1.6"/>
                    <text x="${s.posX + (s.posX > 50 ? 5 : -5)}" y="${s.posY + 1.5}"
                          font-size="4" font-weight="bold" fill="#2f2a26"
                          text-anchor="${s.posX > 50 ? 'start' : 'end'}">
                      ${s.stepNumber}. ${s.organName.split(' ')[0]}
                    </text>
                  </g>
                `).join('')}
              </svg>
            </div>

            <!-- Step Progress Track -->
            <div class="flow-step-dots">
              ${pathway.steps.map((s, idx) => `
                <button class="flow-dot ${idx === this.currentStepIndex ? 'active' : ''} ${idx < this.currentStepIndex ? 'passed' : ''}"
                        data-step-index="${idx}" title="${s.title}" type="button">
                  ${s.stepNumber}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Right: Interactive Step Dossier & Spoken Science Guide -->
          <div class="flow-dossier-card neo-card">
            <div class="dossier-header">
              <span class="dossier-step-tag">LANGKAH ${currentStep.stepNumber} DARI ${pathway.steps.length}</span>
              <span class="dossier-emoji">${currentStep.organEmoji}</span>
            </div>

            <h3 class="dossier-title">${currentStep.title}</h3>
            <div class="dossier-organ-badge">🏛️ Organ Terlibat: <strong>${currentStep.organName}</strong></div>

            <div class="dossier-summary-box">
              <h4 class="box-label">🔍 Proses Fisiologis:</h4>
              <p class="box-text">${currentStep.summary}</p>
            </div>

            <div class="dossier-voice-box">
              <div class="voice-box-header">
                <span class="voice-icon">📢</span>
                <strong>Penjelasan Suara Edukasi:</strong>
              </div>
              <p class="voice-text">"${currentStep.narration}"</p>
              <button id="btn-flow-speak" class="btn-voice-hero speaking-pulse" type="button">
                🔊 Putar Ulang Suara Pemandu
              </button>
            </div>

            <!-- Navigation Controls -->
            <div class="dossier-nav-actions">
              <button id="btn-flow-prev" class="btn-neo-secondary" ${this.currentStepIndex === 0 ? 'disabled' : ''} type="button">
                ⬅️ Pos Sebelumnya
              </button>
              <button id="btn-flow-next" class="btn-neo-primary" type="button">
                ${this.currentStepIndex + 1 < pathway.steps.length ? 'Lanjut ke Pos Berikutnya ➡️' : '🔁 Mulai Lagi dari Awal'}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
    this.playStepSoundAndNarration(currentStep);
  }

  private bindEvents() {
    // Pathway switcher tabs
    this.container.querySelectorAll('[data-pathway]').forEach(btn => {
      btn.addEventListener('click', () => {
        sound.playPop();
        this.stopAutoPlay();
        const pId = btn.getAttribute('data-pathway') as 'digestion' | 'circulation' | 'respiration';
        this.currentStepIndex = 0;
        this.render(pId);
      });
    });

    // Station nodes click
    this.container.querySelectorAll('[data-step-index]').forEach(node => {
      node.addEventListener('click', () => {
        sound.playPop();
        this.stopAutoPlay();
        const idx = Number(node.getAttribute('data-step-index'));
        this.goToStep(idx);
      });
    });

    // Next / Prev buttons
    this.container.querySelector('#btn-flow-next')?.addEventListener('click', () => {
      sound.playPop();
      const pathway = PATHWAYS[this.currentPathwayId];
      if (this.currentStepIndex + 1 < pathway.steps.length) {
        this.goToStep(this.currentStepIndex + 1);
      } else {
        this.goToStep(0);
      }
    });

    this.container.querySelector('#btn-flow-prev')?.addEventListener('click', () => {
      sound.playPop();
      if (this.currentStepIndex > 0) {
        this.goToStep(this.currentStepIndex - 1);
      }
    });

    // Speak button
    this.container.querySelector('#btn-flow-speak')?.addEventListener('click', () => {
      const pathway = PATHWAYS[this.currentPathwayId];
      const step = pathway.steps[this.currentStepIndex];
      this.playStepSoundAndNarration(step);
    });

    // Autoplay toggle
    this.container.querySelector('#btn-flow-autoplay')?.addEventListener('click', () => {
      sound.playPop();
      if (this.isAutoPlaying) {
        this.stopAutoPlay();
      } else {
        this.startAutoPlay();
      }
      this.render(this.currentPathwayId);
    });
  }

  private goToStep(index: number) {
    this.currentStepIndex = index;
    this.render(this.currentPathwayId);
  }

  private playStepSoundAndNarration(step: PathwayStep) {
    sound.stopSpeaking();
    switch (step.soundType) {
      case 'heartbeat':
        sound.playHeartbeat(85);
        break;
      case 'breath':
        sound.playBreath();
        break;
      case 'digestive':
        sound.playDigestive();
        break;
      case 'neural':
        sound.playNeural();
        break;
      case 'bone_snap':
        sound.playBoneSnap();
        break;
      default:
        sound.playPop();
    }
    sound.speakStory(step.narration, step.title);
  }

  private startAutoPlay() {
    this.isAutoPlaying = true;
    const pathway = PATHWAYS[this.currentPathwayId];

    this.autoPlayTimer = window.setInterval(() => {
      if (this.currentStepIndex + 1 < pathway.steps.length) {
        this.goToStep(this.currentStepIndex + 1);
      } else {
        this.goToStep(0);
      }
    }, 9000);
  }

  private stopAutoPlay() {
    this.isAutoPlaying = false;
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
      this.autoPlayTimer = null;
    }
  }

  public destroy() {
    this.stopAutoPlay();
    sound.stopSpeaking();
  }
}
