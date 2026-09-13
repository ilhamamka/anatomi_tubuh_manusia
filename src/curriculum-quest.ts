// Interactive Curriculum Mission Quest Runner
// Implements full Kurikulum Merdeka IPAS SD (Fase B & C) and Biologi SMP (Fase D)
// Multi-step interactive guided journey: 1. Story & Voice -> 2. Assembly -> 3. Sensory/Stethoscope Experiment -> 4. Targeted Quiz -> 5. Graduation & Trophy

import { ORGANS, CURRICULUM_LEVELS, type CurriculumLevel, type OrganInfo } from './organs-data';
import { sound } from './audio';
import { confetti } from './confetti';
import { leaderboard } from './leaderboard';
import { MEDICAL_QUESTIONS, getOptionIcon, type MedicalQuestion } from './questions-engine';

export interface QuestCallbacks {
  onComplete: (levelId: number, xpEarned: number, starsEarned: number) => void;
  onExit: () => void;
  onGoToWorksheets: () => void;
}

export class CurriculumQuestRunner {
  private level: CurriculumLevel;
  private currentStep: number = 1; // 1: Story/Voice, 2: Assembly, 3: Sensory Experiment, 4: Quiz, 5: Celebration
  private callbacks: QuestCallbacks;
  private modalElement: HTMLElement | null = null;
  
  // Step 1 state
  private listenedOrgans: Set<string> = new Set();
  
  // Step 2 state (Assembly)
  private placedOrgans: Set<string> = new Set();
  private selectedOrganToPlace: string | null = null;

  // Step 3 state (Experiment)
  private experimentBpm: number = 75;
  private experimentState: Record<string, any> = {};

  // Step 4 state (Quiz)
  private currentQuestion: MedicalQuestion | null = null;
  private quizAnswered: boolean = false;
  private quizSelectedOption: number | null = null;

  constructor(levelId: number, callbacks: QuestCallbacks) {
    this.level = CURRICULUM_LEVELS.find(l => l.id === levelId) || CURRICULUM_LEVELS[0];
    this.callbacks = callbacks;
    this.initQuestion();
  }

  private initQuestion() {
    // Pick the most relevant Kurikulum question matching the level's organs
    const matched = MEDICAL_QUESTIONS.filter(q => this.level.organs.includes(q.organId));
    if (matched.length > 0) {
      this.currentQuestion = matched[Math.floor(Math.random() * matched.length)];
    } else {
      this.currentQuestion = MEDICAL_QUESTIONS[0];
    }
  }

  public start() {
    this.modalElement = document.createElement('div');
    this.modalElement.className = 'neo-modal-overlay quest-modal-overlay';
    document.body.appendChild(this.modalElement);
    this.render();
    sound.playExcitedChime();
    sound.playNaturalSpeech(`Selamat datang di petualangan ${this.level.title}! Yuk selesaikan 4 langkah seru untuk menjadi dokter juara!`);
  }

  public destroy() {
    sound.stopSpeaking();
    if (this.modalElement) {
      this.modalElement.remove();
      this.modalElement = null;
    }
  }

  private render() {
    if (!this.modalElement) return;

    this.modalElement.innerHTML = `
      <div class="neo-modal-card quest-runner-modal" style="max-width:920px; width:95%; max-height:92vh; overflow-y:auto; padding:24px;">
        <!-- Top Quest Stepper Header -->
        <div class="quest-header-bar" style="display:flex; justify-content:space-between; align-items:center; border-bottom:3px solid var(--ink-line); padding-bottom:14px; margin-bottom:18px;">
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="background:#fef08a; color:#854d0e; font-size:11px; font-weight:900; padding:3px 8px; border-radius:999px; border:2px solid var(--ink-line);">
                🏆 MISI KURIKULUM TINGKAT ${this.level.id}
              </span>
              <span style="font-size:12px; font-weight:800; color:#0284c7;">${this.level.badge}</span>
            </div>
            <h2 style="font-family:var(--font-display); font-size:22px; font-weight:1000; margin:4px 0 0; color:var(--ink-line);">
              ${this.level.title}
            </h2>
          </div>
          <button id="btn-quest-close" class="btn-neo-secondary btn-sm" type="button" style="padding:6px 12px; font-size:16px;">✕ Keluar</button>
        </div>

        <!-- 5-Step Visual Progression Pills -->
        <div class="quest-stepper-row" style="display:flex; justify-content:space-between; gap:6px; margin-bottom:20px; background:#f8fafc; padding:8px 12px; border:2px solid var(--ink-line); border-radius:12px;">
          ${this.renderStepPill(1, '1. Kenalan Organ')}
          ${this.renderStepPill(2, '2. Pasang Tubuh')}
          ${this.renderStepPill(3, '3. Cek Stetoskop')}
          ${this.renderStepPill(4, '4. Kuis Cerdas')}
          ${this.renderStepPill(5, '5. Wisuda Juara')}
        </div>

        <!-- Step Dynamic Content Body -->
        <div class="quest-body-stage">
          ${this.renderStepContent()}
        </div>
      </div>
    `;

    this.bindEvents();
  }

  private renderStepPill(stepNum: number, label: string): string {
    const isCompleted = this.currentStep > stepNum;
    const isCurrent = this.currentStep === stepNum;
    const bg = isCurrent ? '#0284c7' : (isCompleted ? '#22c55e' : '#ffffff');
    const color = (isCurrent || isCompleted) ? '#ffffff' : '#64748b';

    return `
      <div style="flex:1; text-align:center; padding:6px 4px; border-radius:8px; background:${bg}; color:${color}; font-weight:900; font-size:11px; border:2px solid var(--ink-line); transition:all 0.2s;">
        ${isCompleted ? '✓' : ''} ${label}
      </div>
    `;
  }

  private renderStepContent(): string {
    switch (this.currentStep) {
      case 1:
        return this.renderStep1Story();
      case 2:
        return this.renderStep2Assembly();
      case 3:
        return this.renderStep3Experiment();
      case 4:
        return this.renderStep4Quiz();
      case 5:
        return this.renderStep5Celebration();
      default:
        return '';
    }
  }

  // STEP 1: Interactive Character Story & Audio Exploration
  private renderStep1Story(): string {
    const organs = this.level.organs.map(id => ORGANS[id]).filter(Boolean);
    const allListened = organs.every(o => this.listenedOrgans.has(o.id));

    return `
      <div class="quest-step-box">
        <div style="text-align:center; margin-bottom:18px;">
          <h3 style="font-family:var(--font-display); font-size:20px; font-weight:1000; margin:0 0 6px;">
            Langkah 1: Kenalan dengan Pasukan Organ Tubuh! 🗣️✨
          </h3>
          <p style="font-size:13px; font-weight:700; color:#64748b; margin:0;">
            Sentuh atau klik setiap organ di bawah ini untuk mendengar suara serunya memperkenalkan diri!
          </p>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:16px; margin-bottom:20px;">
          ${organs.map(organ => {
            const hasListened = this.listenedOrgans.has(organ.id);
            return `
              <div class="quest-organ-card ${hasListened ? 'listened' : ''}" data-quest-organ="${organ.id}" style="background:#ffffff; border:3px solid var(--ink-line); border-radius:14px; padding:16px; text-align:center; cursor:pointer; box-shadow:var(--shadow-sm); position:relative;">
                ${hasListened ? `<span style="position:absolute; top:8px; right:8px; font-size:16px;">✅</span>` : ''}
                <div style="margin-bottom:10px;">
                  ${organ.renderSVG(80, true)}
                </div>
                <h4 style="font-family:var(--font-display); font-size:16px; font-weight:900; margin:0 0 4px;">${organ.name}</h4>
                <span style="font-size:11px; font-weight:800; color:#64748b; display:block; margin-bottom:8px;">${organ.funTitle}</span>
                <button class="btn-neo-accent btn-sm" type="button" style="width:100%; font-size:11px; padding:6px 10px;">
                  🔊 Dengarkan Suaraku!
                </button>
              </div>
            `;
          }).join('')}
        </div>

        <div style="text-align:center; border-top:2px dashed #cbd5e1; padding-top:16px;">
          <button id="btn-next-to-step2" class="btn-neo-primary" type="button" ${allListened ? '' : 'disabled'} style="font-size:14px; padding:10px 24px;">
            ${allListened ? 'Hebat! Lanjut ke Langkah 2: Pasang Tubuh ➡️' : 'Dengarkan semua organ untuk melanjutkan (Tekan kartu di atas) 🔒'}
          </button>
        </div>
      </div>
    `;
  }

  // STEP 2: Guided Targeted Mannequin Assembly
  private renderStep2Assembly(): string {
    const organs = this.level.organs.map(id => ORGANS[id]).filter(Boolean);
    const allPlaced = organs.every(o => this.placedOrgans.has(o.id));

    return `
      <div class="quest-step-box">
        <div style="text-align:center; margin-bottom:14px;">
          <h3 style="font-family:var(--font-display); font-size:20px; font-weight:1000; margin:0 0 6px;">
            Langkah 2: Misi Pasang Organ ke Tubuh Manekin! 🧪🩺
          </h3>
          <p style="font-size:13px; font-weight:700; color:#64748b; margin:0;">
            Pilih organ dari nampan, lalu sentuh titik lingkaran yang berdenyut di dalam tubuh!
          </p>
        </div>

        <div style="display:flex; gap:20px; flex-wrap:wrap; justify-content:center; align-items:center; margin-bottom:18px;">
          <!-- Mannequin Outline with Sockets -->
          <div style="position:relative; width:280px; height:340px; background:#f0f9ff; border:3px solid var(--ink-line); border-radius:18px; box-shadow:var(--shadow-md); overflow:hidden;">
            <img src="/assets/assembly_mannequin_table.png" alt="Manekin Tubuh" style="width:100%; height:100%; object-fit:contain; opacity:0.85;" />
            
            ${organs.map((organ, idx) => {
              const isPlaced = this.placedOrgans.has(organ.id);
              const isSelected = this.selectedOrganToPlace === organ.id;
              // Coordinates mapped to mannequin
              const positions: Record<string, { top: number; left: number }> = {
                senses_eye: { top: 12, left: 47 },
                senses_ear: { top: 13, left: 54 },
                senses_skin: { top: 38, left: 60 },
                heart: { top: 28, left: 52 },
                lungs: { top: 25, left: 48 },
                stomach: { top: 37, left: 54 },
                liver: { top: 36, left: 45 },
                intestines: { top: 45, left: 50 },
                brain: { top: 10, left: 50 },
                kidneys: { top: 40, left: 50 },
                blood_cells: { top: 30, left: 40 },
                skeleton: { top: 22, left: 50 }
              };
              const pos = positions[organ.id] || { top: 20 + idx * 10, left: 50 };

              return `
                <div class="quest-socket ${isPlaced ? 'placed' : 'active-beacon'} ${isSelected ? 'targeted' : ''}" 
                     data-quest-socket="${organ.id}"
                     style="position:absolute; top:${pos.top}%; left:${pos.left}%; transform:translate(-50%, -50%); width:52px; height:52px; border-radius:50%; border:3px dashed ${isPlaced ? '#16a34a' : '#0284c7'}; background:${isPlaced ? '#dcfce7' : '#ffffffcc'}; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:22px; box-shadow:var(--shadow-sm);">
                  ${isPlaced ? organ.emoji : (isSelected ? '🎯' : organ.emoji)}
                </div>
              `;
            }).join('')}
          </div>

          <!-- Organ Tray -->
          <div style="flex:1; min-width:240px; max-width:360px;">
            <div style="background:#ffffff; border:3px solid var(--ink-line); border-radius:14px; padding:14px; box-shadow:var(--shadow-sm);">
              <h4 style="margin:0 0 10px; font-size:14px; font-weight:900;">Nampan Organ Pasien:</h4>
              <div style="display:flex; flex-direction:column; gap:10px;">
                ${organs.map(organ => {
                  const isPlaced = this.placedOrgans.has(organ.id);
                  const isSelected = this.selectedOrganToPlace === organ.id;
                  return `
                    <div class="tray-organ-item ${isPlaced ? 'done' : ''} ${isSelected ? 'selected' : ''}"
                         data-tray-organ="${organ.id}"
                         style="display:flex; align-items:center; justify-content:space-between; padding:8px 12px; border:2px solid var(--ink-line); border-radius:10px; background:${isPlaced ? '#f1f5f9' : (isSelected ? '#e0f2fe' : '#ffffff')}; cursor:${isPlaced ? 'default' : 'pointer'}; opacity:${isPlaced ? 0.6 : 1};">
                      <div style="display:flex; align-items:center; gap:8px;">
                        <span style="font-size:24px;">${organ.emoji}</span>
                        <div>
                          <strong style="font-size:13px; display:block;">${organ.name}</strong>
                          <small style="color:#64748b; font-weight:700;">${organ.systemName}</small>
                        </div>
                      </div>
                      <span style="font-size:12px; font-weight:900; color:${isPlaced ? '#16a34a' : '#0284c7'};">
                        ${isPlaced ? '✅ Terpasang' : (isSelected ? '▶️ Siap Pasang' : 'Pilih 👆')}
                      </span>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          </div>
        </div>

        <div style="text-align:center; border-top:2px dashed #cbd5e1; padding-top:16px;">
          <button id="btn-next-to-step3" class="btn-neo-primary" type="button" ${allPlaced ? '' : 'disabled'} style="font-size:14px; padding:10px 24px;">
            ${allPlaced ? 'Sempurna! Lanjut ke Langkah 3: Uji Stetoskop ➡️' : 'Pasangkan semua organ ke dalam manekin untuk lanjut 🔒'}
          </button>
        </div>
      </div>
    `;
  }

  // STEP 3: Sensory & Acoustic Stethoscope Hands-on Lab
  private renderStep3Experiment(): string {
    return `
      <div class="quest-step-box">
        <div style="text-align:center; margin-bottom:16px;">
          <h3 style="font-family:var(--font-display); font-size:20px; font-weight:1000; margin:0 0 6px;">
            Langkah 3: Eksperimen Stetoskop & Akustik Tubuh! 🎧🫀
          </h3>
          <p style="font-size:13px; font-weight:700; color:#64748b; margin:0;">
            Ayo coba alat dokter cilik: dengarkan bunyi organ dan rasakan ritme fisiologisnya!
          </p>
        </div>

        <div style="background:#ffffff; border:3px solid var(--ink-line); border-radius:16px; padding:20px; max-width:640px; margin:0 auto 20px; box-shadow:var(--shadow-sm);">
          ${this.renderLevelSpecificExperiment()}
        </div>

        <div style="text-align:center; border-top:2px dashed #cbd5e1; padding-top:16px;">
          <button id="btn-next-to-step4" class="btn-neo-primary" type="button" style="font-size:14px; padding:10px 24px;">
            Lanjut ke Langkah 4: Kuis Cerdas Juara ➡️
          </button>
        </div>
      </div>
    `;
  }

  private renderLevelSpecificExperiment(): string {
    if (this.level.id === 1) {
      // Level 1: Sensory Test (Mata, Telinga, Kulit)
      return `
        <div style="text-align:center;">
          <span style="font-size:42px; display:block; margin-bottom:8px;">👁️ 👂 🖐️</span>
          <h4 style="font-size:16px; font-weight:900; margin-bottom:8px;">Uji Refleks Sensorik Panca Indera</h4>
          <p style="font-size:13px; color:#475569; font-weight:700; margin-bottom:16px;">
            Coba tekan masing-masing tombol panca indera di bawah ini untuk menguji bagaimana tubuh menangkap rangsangan dunia luar:
          </p>
          <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">
            <button id="btn-exp-eye" class="btn-neo-secondary btn-sm" type="button">👁️ Uji Penglihatan Mata</button>
            <button id="btn-exp-ear" class="btn-neo-secondary btn-sm" type="button">👂 Uji Frekuensi Bunyi</button>
            <button id="btn-exp-skin" class="btn-neo-secondary btn-sm" type="button">🖐️ Uji Reseptor Sentuhan</button>
          </div>
          <div id="exp-feedback-box" style="margin-top:14px; font-weight:800; font-size:13px; color:#0284c7; min-height:24px;">
            Tekan salah satu tombol untuk menguji!
          </div>
        </div>
      `;
    } else if (this.level.id === 2) {
      // Level 2: Heart Stethoscope & Lungs
      return `
        <div style="text-align:center;">
          <span style="font-size:42px; display:block; margin-bottom:8px;">🩺 🫀</span>
          <h4 style="font-size:16px; font-weight:900; margin-bottom:8px;">Stetoskop Akustik Jantung & Napas Paru</h4>
          <p style="font-size:13px; color:#475569; font-weight:700; margin-bottom:14px;">
            Geser kecepatan detak jantung, atau dengarkan paru-paru mengembang saat menarik napas segar:
          </p>
          
          <div style="margin-bottom:16px;">
            <label style="font-size:13px; font-weight:900; display:block; margin-bottom:6px;">
              Detak Jantung: <span id="label-quest-bpm" style="color:#e11d48; font-size:16px;">${this.experimentBpm} BPM</span>
            </label>
            <input type="range" id="input-quest-bpm" min="60" max="160" value="${this.experimentBpm}" style="width:80%; max-width:320px;">
          </div>

          <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">
            <button id="btn-exp-heart" class="btn-neo-primary btn-sm" type="button">💓 Dengarkan Detak Jantung</button>
            <button id="btn-exp-lungs" class="btn-neo-secondary btn-sm" type="button">🌬️ Tarik Napas Paru-Paru</button>
          </div>
          <div id="exp-feedback-box" style="margin-top:14px; font-weight:800; font-size:13px; color:#e11d48; min-height:24px;">
            Siap mendengarkan denyut stetoskop!
          </div>
        </div>
      `;
    } else if (this.level.id === 3) {
      // Level 3: Digestion
      return `
        <div style="text-align:center;">
          <span style="font-size:42px; display:block; margin-bottom:8px;">🥪 🥣 🌭</span>
          <h4 style="font-size:16px; font-weight:900; margin-bottom:8px;">Laboratorium Asam Lambung & Pencernaan</h4>
          <p style="font-size:13px; color:#475569; font-weight:700; margin-bottom:14px;">
            Kira-kira apa bunyi yang terdengar saat makanan masuk ke dalam lambung dan diaduk dengan enzim asam kuat?
          </p>
          <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">
            <button id="btn-exp-stomach" class="btn-neo-primary btn-sm" type="button">🥣 Lumat Makanan di Lambung</button>
            <button id="btn-exp-intestine" class="btn-neo-secondary btn-sm" type="button">🌭 Serap Sari Makanan di Usus</button>
          </div>
          <div id="exp-feedback-box" style="margin-top:14px; font-weight:800; font-size:13px; color:#d97706; min-height:24px;">
            Tekan tombol untuk memulai pencernaan!
          </div>
        </div>
      `;
    } else {
      // Level 4 & 5: Brain Neural & Skeleton
      return `
        <div style="text-align:center;">
          <span style="font-size:42px; display:block; margin-bottom:8px;">🧠 🩸 🦴</span>
          <h4 style="font-size:16px; font-weight:900; margin-bottom:8px;">Pusat Komando Saraf & Benteng Rangka</h4>
          <p style="font-size:13px; color:#475569; font-weight:700; margin-bottom:14px;">
            Uji transmisi impuls listrik neuron otak dan dengarkan kekuatan penopang 206 tulang tubuh:
          </p>
          <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">
            <button id="btn-exp-brain" class="btn-neo-primary btn-sm" type="button">⚡ Kilatan Impuls Otak</button>
            <button id="btn-exp-bone" class="btn-neo-secondary btn-sm" type="button">🦴 Uji Kepadatan Rangka</button>
          </div>
          <div id="exp-feedback-box" style="margin-top:14px; font-weight:800; font-size:13px; color:#7c3aed; min-height:24px;">
            Siap menguji sistem komando tubuh!
          </div>
        </div>
      `;
    }
  }

  // STEP 4: Targeted Curriculum Quiz
  private renderStep4Quiz(): string {
    if (!this.currentQuestion) return '';
    const q = this.currentQuestion;

    return `
      <div class="quest-step-box">
        <div style="text-align:center; margin-bottom:16px;">
          <span style="font-size:11px; font-weight:900; background:#fefce8; color:#a16207; padding:3px 10px; border-radius:999px; border:2px solid var(--ink-line);">
            🎯 TANTANGAN KURIKULUM MERDEKA
          </span>
          <h3 style="font-family:var(--font-display); font-size:20px; font-weight:1000; margin:6px 0 2px;">
            Uji Cerdas Dokter Cilik 🌟
          </h3>
          <p style="font-size:12px; font-weight:700; color:#64748b; margin:0;">
            ${q.curriculumStandard}
          </p>
        </div>

        <div style="background:#ffffff; border:3px solid var(--ink-line); border-radius:16px; padding:20px; max-width:680px; margin:0 auto 20px; box-shadow:var(--shadow-sm);">
          <div style="display:flex; justify-content:space-between; align-items:center; gap:12px; margin-bottom:16px; flex-wrap:wrap;">
            <div style="display:flex; align-items:center; gap:12px; flex:1; min-width:260px;">
              <span style="font-size:36px;">${q.icon}</span>
              <h4 style="font-family:var(--font-display); font-size:16px; font-weight:900; margin:0; line-height:1.35;">
                ${q.question}
              </h4>
            </div>
            <button id="btn-speak-quest-q" class="btn-neo-accent btn-speak-question" type="button" title="Dengarkan Suara Pertanyaan">
              🔊 Dengarkan Soal
            </button>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:14px;">
            ${q.options.map((opt, idx) => {
              const optIcon = getOptionIcon(opt);
              let optStyle = 'background:#ffffff; border:2px solid var(--ink-line); color:#1e293b;';
              if (this.quizAnswered) {
                if (idx === q.correctIndex) {
                  optStyle = 'background:#dcfce7; border:2px solid #16a34a; color:#15803d; font-weight:900; box-shadow:3px 3px 0 #16a34a;';
                } else if (idx === this.quizSelectedOption) {
                  optStyle = 'background:#fee2e2; border:2px solid #e11d48; color:#b91c1c; box-shadow:3px 3px 0 #e11d48;';
                } else {
                  optStyle += ' opacity: 0.6;';
                }
              }

              return `
                <button class="quest-quiz-opt-btn" 
                        data-quiz-opt="${idx}" 
                        type="button" 
                        ${this.quizAnswered ? 'disabled' : ''}
                        style="padding:12px 14px; border-radius:12px; display:flex; align-items:center; gap:12px; cursor:pointer; box-shadow:var(--shadow-sm); ${optStyle}">
                  <div class="option-icon-badge">${optIcon}</div>
                  <div style="flex:1; display:flex; align-items:center; gap:8px;">
                    <span class="option-letter" style="width:28px; height:28px; font-size:12px;">${['A', 'B', 'C', 'D'][idx]}</span>
                    <span class="option-text" style="font-size:14px;">${opt}</span>
                  </div>
                  <span class="btn-listen-opt" data-quest-listen-opt="${idx}" role="button" tabindex="0" title="Dengarkan kata: ${opt}">
                    🔈
                  </span>
                </button>
              `;
            }).join('')}
          </div>

          ${this.quizAnswered ? `
            <div style="background:#f8fafc; border:2px solid var(--ink-line); border-radius:10px; padding:12px 14px; margin-top:10px;">
              <strong style="color:${this.quizSelectedOption === q.correctIndex ? '#15803d' : '#b91c1c'}; font-size:13px; display:block; margin-bottom:4px;">
                ${this.quizSelectedOption === q.correctIndex ? '🎉 Luar Biasa! Jawabanmu Benar!' : '💡 Jawaban Belum Tepat, Ini Penjelasannya:'}
              </strong>
              <p style="font-size:12px; font-weight:700; color:#475569; margin:0;">
                ${q.explanation}
              </p>
            </div>
          ` : ''}
        </div>

        <div style="text-align:center; border-top:2px dashed #cbd5e1; padding-top:16px;">
          <button id="btn-next-to-step5" class="btn-neo-primary" type="button" ${this.quizAnswered ? '' : 'disabled'} style="font-size:14px; padding:10px 24px;">
            ${this.quizAnswered ? 'Hebat! Lihat Hasil & Wisuda Dokter Cilik 🏆' : 'Pilih salah satu jawaban di atas untuk lanjut 🔒'}
          </button>
        </div>
      </div>
    `;
  }

  // STEP 5: Graduation Celebration & Trophy
  private renderStep5Celebration(): string {
    return `
      <div class="quest-step-box" style="text-align:center; padding:10px 0;">
        <span style="font-size:64px; display:block; margin-bottom:10px; animation:floatSubtle 3s infinite ease-in-out;">🏆</span>
        <span style="background:#fef08a; color:#854d0e; font-size:12px; font-weight:900; padding:4px 12px; border-radius:999px; border:2px solid var(--ink-line); display:inline-block; margin-bottom:8px;">
          MISI RESMI TUNTAS 100%
        </span>
        <h2 style="font-family:var(--font-display); font-size:26px; font-weight:1000; margin:0 0 6px;">
          Selamat! Kamu Lulus Misi ${this.level.title}!
        </h2>
        <p style="font-size:14px; font-weight:700; color:#475569; max-width:560px; margin:0 auto 20px;">
          Kamu telah membuktikan kemampuan dokter cilik hebat dengan memahami anatomi organ, memasang struktur tubuh dengan presisi, dan lulus tantangan Kurikulum Merdeka!
        </p>

        <div style="display:flex; justify-content:center; gap:16px; margin-bottom:24px;">
          <div style="background:#ffffff; border:3px solid var(--ink-line); border-radius:14px; padding:14px 20px; box-shadow:var(--shadow-sm);">
            <div style="font-size:24px; font-weight:1000; color:#e11d48; font-family:var(--font-display);">+${this.level.xpReward} XP</div>
            <span style="font-size:11px; font-weight:800; color:#64748b;">Pengalaman Medis</span>
          </div>
          <div style="background:#ffffff; border:3px solid var(--ink-line); border-radius:14px; padding:14px 20px; box-shadow:var(--shadow-sm);">
            <div style="font-size:24px; font-weight:1000; color:#d97706; font-family:var(--font-display);">+1 ⭐</div>
            <span style="font-size:11px; font-weight:800; color:#64748b;">Bintang Prestasi</span>
          </div>
          <div style="background:#ffffff; border:3px solid var(--ink-line); border-radius:14px; padding:14px 20px; box-shadow:var(--shadow-sm);">
            <div style="font-size:16px; font-weight:1000; color:#0284c7; font-family:var(--font-display);">${this.level.badge}</div>
            <span style="font-size:11px; font-weight:800; color:#64748b;">Lencana Terbuka</span>
          </div>
        </div>

        <div style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap;">
          <button id="btn-quest-finish" class="btn-neo-primary" type="button" style="padding:12px 24px; font-size:14px;">
            🏠 Kembali ke Hub Misi
          </button>
          <button id="btn-quest-print" class="btn-neo-secondary" type="button" style="padding:12px 24px; font-size:14px;">
            🎖️ Cetak Sertifikat Kelulusan Resmi A4
          </button>
        </div>
      </div>
    `;
  }

  private bindEvents() {
    if (!this.modalElement) return;

    // Close button
    this.modalElement.querySelector('#btn-quest-close')?.addEventListener('click', () => {
      sound.playPop();
      this.destroy();
      this.callbacks.onExit();
    });

    // STEP 1 Events
    if (this.currentStep === 1) {
      this.modalElement.querySelectorAll('[data-quest-organ]').forEach(card => {
        card.addEventListener('click', () => {
          const id = card.getAttribute('data-quest-organ');
          if (!id) return;
          const organ = ORGANS[id];
          if (!organ) return;

          sound.playExcitedChime();
          this.listenedOrgans.add(id);
          sound.speakStory(organ.story, organ.name, organ.id);
          this.render();
        });
      });

      this.modalElement.querySelector('#btn-next-to-step2')?.addEventListener('click', () => {
        sound.playPop();
        sound.speakPraise();
        this.currentStep = 2;
        this.render();
        sound.playNaturalSpeech('Bagus sekali! Sekarang pasangkan organ-organ ini ke posisi manekin tubuh yang tepat!');
      });
    }

    // STEP 2 Events (Assembly)
    if (this.currentStep === 2) {
      this.modalElement.querySelectorAll('[data-tray-organ]').forEach(item => {
        item.addEventListener('click', () => {
          const id = item.getAttribute('data-tray-organ');
          if (!id || this.placedOrgans.has(id)) return;
          sound.playPop();
          this.selectedOrganToPlace = id;
          const organ = ORGANS[id];
          sound.playNaturalSpeech(`Kamu memilih ${organ.name}. Di mana letaknya di tubuh? Sentuh lingkaran targetnya!`);
          this.render();
        });
      });

      this.modalElement.querySelectorAll('[data-quest-socket]').forEach(sock => {
        sock.addEventListener('click', () => {
          const id = sock.getAttribute('data-quest-socket');
          if (!id || this.placedOrgans.has(id)) return;

          if (this.selectedOrganToPlace === id) {
            // Correct placement!
            this.placedOrgans.add(id);
            this.selectedOrganToPlace = null;
            sound.playBoneSnap();
            sound.speakPraise();
            confetti.burst(50);
            this.render();
          } else if (this.selectedOrganToPlace) {
            // Wrong socket
            sound.playWrong();
            sound.playNaturalSpeech('Bukan di situ tempatnya, cari lingkaran lain yang sesuai ya!');
          } else {
            // Auto select socket organ
            this.selectedOrganToPlace = id;
            sound.playPop();
            this.render();
          }
        });
      });

      this.modalElement.querySelector('#btn-next-to-step3')?.addEventListener('click', () => {
        sound.playPop();
        sound.speakPraise();
        this.currentStep = 3;
        this.render();
        sound.playNaturalSpeech('Hebat! Seluruh organ berhasil dipasang dengan presisi! Sekarang ayo uji di laboratorium sensorik!');
      });
    }

    // STEP 3 Events (Experiment)
    if (this.currentStep === 3) {
      const feedbackBox = this.modalElement.querySelector('#exp-feedback-box') as HTMLElement;

      this.modalElement.querySelector('#btn-exp-eye')?.addEventListener('click', () => {
        sound.playPop();
        sound.playNaturalSpeech('Mata menangkap cahaya dan mengirim gambar ke otak hanya dalam 13 milidetik!');
        if (feedbackBox) feedbackBox.textContent = '👀 Sensor Mata: Sinyal visual 13 milidetik diterima!';
      });

      this.modalElement.querySelector('#btn-exp-ear')?.addEventListener('click', () => {
        sound.playExcitedChime();
        sound.playNaturalSpeech('Telinga menggetarkan gendang telinga dan tulang sanggurdi untuk mendengar suara merdu!');
        if (feedbackBox) feedbackBox.textContent = '👂 Sensor Telinga: Frekuensi gelombang suara bergetar!';
      });

      this.modalElement.querySelector('#btn-exp-skin')?.addEventListener('click', () => {
        sound.playPop();
        sound.playNaturalSpeech('Kulit memiliki jutaan saraf peraba yang mendeteksi sentuhan lembut dan suhu hangat!');
        if (feedbackBox) feedbackBox.textContent = '🖐️ Sensor Kulit: Reseptor taktil & suhu aktif!';
      });

      // Level 2 Heart slider
      const bpmSlider = this.modalElement.querySelector('#input-quest-bpm') as HTMLInputElement;
      bpmSlider?.addEventListener('input', () => {
        this.experimentBpm = parseInt(bpmSlider.value, 10);
        const bpmLabel = this.modalElement?.querySelector('#label-quest-bpm');
        if (bpmLabel) bpmLabel.textContent = `${this.experimentBpm} BPM`;
      });

      this.modalElement.querySelector('#btn-exp-heart')?.addEventListener('click', () => {
        sound.playHeartbeat(this.experimentBpm);
        sound.playNaturalSpeech(`Detak jantung berdenyut pada frekuensi ${this.experimentBpm} ketukan per menit!`);
        if (feedbackBox) feedbackBox.textContent = `💓 Detak Jantung ${this.experimentBpm} BPM: Lub-dub!`;
      });

      this.modalElement.querySelector('#btn-exp-lungs')?.addEventListener('click', () => {
        sound.playBreath();
        sound.playNaturalSpeech('Tarik napas dalam-dalam! Alveolus menyerap gas oksigen segar ke dalam darah!');
        if (feedbackBox) feedbackBox.textContent = '🌬️ Paru-paru: Oksigen O2 diserap, CO2 dilepaskan!';
      });

      // Level 3 Stomach
      this.modalElement.querySelector('#btn-exp-stomach')?.addEventListener('click', () => {
        sound.playDigestive();
        sound.playNaturalSpeech('Kruuuk! Asam lambung melumatkan makanan menjadi bubur halus kimus!');
        if (feedbackBox) feedbackBox.textContent = '🥣 Asam Lambung HCl melumatkan makanan!';
      });

      this.modalElement.querySelector('#btn-exp-intestine')?.addEventListener('click', () => {
        sound.playPop();
        sound.playNaturalSpeech('Usus halus menyerap nutrisi makanan untuk dialirkan menjadi tenaga bermain!');
        if (feedbackBox) feedbackBox.textContent = '🌭 Usus Halus: Sari nutrisi masuk ke pembuluh darah!';
      });

      // Level 4 & 5 Brain & Bone
      this.modalElement.querySelector('#btn-exp-brain')?.addEventListener('click', () => {
        sound.playNeural();
        sound.playNaturalSpeech('Bzzzzt! Saraf otak mengirimkan jutaan impuls listrik pikiranmu!');
        if (feedbackBox) feedbackBox.textContent = '⚡ Neuron Otak: 86 miliar sel berkomunikasi!';
      });

      this.modalElement.querySelector('#btn-exp-bone')?.addEventListener('click', () => {
        sound.playBoneSnap();
        sound.playNaturalSpeech('Krak! 206 tulang saling mengunci membentuk benteng yang kokoh dan lentur!');
        if (feedbackBox) feedbackBox.textContent = '🦴 Rangka: 206 tulang menopang tubuh tegak!';
      });

      this.modalElement.querySelector('#btn-next-to-step4')?.addEventListener('click', () => {
        sound.playPop();
        sound.speakPraise();
        this.currentStep = 4;
        this.render();
        sound.playNaturalSpeech('Sekarang saatnya membuktikan kepintaranmu di Uji Cerdas Kurikulum Merdeka!');
      });
    }

    // STEP 4 Events (Quiz)
    if (this.currentStep === 4) {
      const q = this.currentQuestion;

      // Speak question button
      this.modalElement.querySelector('#btn-speak-quest-q')?.addEventListener('click', () => {
        sound.playPop();
        if (q) sound.playNaturalSpeech(q.question);
      });

      // Listen to individual option pronunciation
      this.modalElement.querySelectorAll('[data-quest-listen-opt]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          sound.playPop();
          const idx = Number(btn.getAttribute('data-quest-listen-opt'));
          if (q && q.options[idx]) {
            sound.playNaturalSpeech(q.options[idx]);
          }
        });
      });

      this.modalElement.querySelectorAll('[data-quiz-opt]').forEach(btn => {
        btn.addEventListener('click', () => {
          if (this.quizAnswered || !this.currentQuestion) return;
          const idx = parseInt(btn.getAttribute('data-quiz-opt') || '0', 10);
          this.quizAnswered = true;
          this.quizSelectedOption = idx;

          if (idx === this.currentQuestion.correctIndex) {
            sound.speakPraise();
            confetti.burst(80);
          } else {
            sound.playWrong();
          }

          this.render();
        });
      });

      this.modalElement.querySelector('#btn-next-to-step5')?.addEventListener('click', () => {
        sound.playFanfare();
        confetti.burst(120);
        this.currentStep = 5;

        // Reward player in leaderboard
        leaderboard.addRewards(this.level.xpReward, 1, this.level.id, `Juara ${this.level.title}`);
        this.callbacks.onComplete(this.level.id, this.level.xpReward, 1);
        this.render();
      });
    }

    // STEP 5 Events (Celebration)
    if (this.currentStep === 5) {
      this.modalElement.querySelector('#btn-quest-finish')?.addEventListener('click', () => {
        sound.playPop();
        this.destroy();
        this.callbacks.onExit();
      });

      this.modalElement.querySelector('#btn-quest-print')?.addEventListener('click', () => {
        sound.playPop();
        this.destroy();
        this.callbacks.onGoToWorksheets();
      });
    }
  }
}
