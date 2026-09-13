// Klinik Dokter Cilik & Diagnostik Medis Interaktif
// Clinical diagnosis simulation for children: symptom check, medical tool examination, organ diagnosis, and healthy treatment

import { CLINICAL_CASES, type ClinicalCase, ORGANS } from './organs-data';
import { sound } from './audio';
import { confetti } from './confetti';

export interface ClinicCallbacks {
  onCaseSolved: (clinicalCase: ClinicalCase, stars: number, xp: number) => void;
  onExit: () => void;
}

export class ClinicGame {
  private container: HTMLElement;
  private callbacks: ClinicCallbacks;
  private currentCaseIndex: number = 0;
  private examined: boolean = false;
  private diagnosed: boolean = false;
  private solvedCasesCount: number = 0;

  constructor(container: HTMLElement, callbacks: ClinicCallbacks) {
    this.container = container;
    this.callbacks = callbacks;
  }

  public start() {
    this.currentCaseIndex = 0;
    this.solvedCasesCount = 0;
    this.loadCase(0);
  }

  public destroy() {
    sound.stopSpeaking();
  }

  private loadCase(index: number) {
    this.currentCaseIndex = index % CLINICAL_CASES.length;
    this.examined = false;
    this.diagnosed = false;
    this.render();

    const currentCase = CLINICAL_CASES[this.currentCaseIndex];
    sound.speakStory(currentCase.story, `Pasien ${currentCase.patientName} (${currentCase.patientAge})`, currentCase.id);
  }

  private render() {
    const c = CLINICAL_CASES[this.currentCaseIndex];
    const correctOrgan = ORGANS[c.correctOrganId];

    // Generate 4 candidate organ choices (1 correct + 3 random distractors)
    const organIds = Object.keys(ORGANS);
    const distractors = organIds.filter(id => id !== c.correctOrganId).sort(() => 0.5 - Math.random()).slice(0, 3);
    const choices = [c.correctOrganId, ...distractors].sort();

    this.container.innerHTML = `
      <div class="clinic-game-wrapper">
        <div class="clinic-header">
          <div class="clinic-title-box">
            <h2 class="clinic-title">🏥 Klinik Dokter Cilik & Ruang Periksa</h2>
            <p class="clinic-subtitle">Pasien Ke-${this.currentCaseIndex + 1} dari ${CLINICAL_CASES.length} · Diagnosa Gejala & Bantu Pasien Sembuh</p>
          </div>
          <div class="clinic-stats-capsule">
            <span class="pill-badge">Sembuh: ${this.solvedCasesCount} Pasien</span>
            <button id="btn-clinic-exit" class="btn-neo-secondary btn-sm" type="button">Kembali</button>
          </div>
        </div>

        <div class="clinic-board-layout">
          <!-- Left: Patient Chart Card -->
          <div class="patient-chart-card">
            <div class="patient-card-header">
              <span class="patient-avatar-emoji">${c.avatar}</span>
              <div class="patient-id-col">
                <h3 class="patient-name">${c.patientName}</h3>
                <span class="patient-age">${c.patientAge}</span>
              </div>
              <span class="status-medical-badge ${this.diagnosed ? 'badge-cured' : 'badge-exam'}">
                ${this.diagnosed ? '✅ Sudah Ditangani' : '⚠️ Perlu Diagnosa'}
              </span>
            </div>

            <div class="patient-story-box">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                <h4 class="complaint-title">🗣️ Keluhan Pasien:</h4>
                <button id="btn-replay-complaint" class="btn-neo-secondary btn-xs" type="button" style="display:inline-flex; align-items:center; gap:4px; font-size:11px; padding:3px 8px;">
                  🔊 Dengarkan Suara
                </button>
              </div>
              <p class="complaint-text">"${c.chiefComplaint}"</p>
              <p class="story-text">${c.story}</p>
            </div>

            <!-- Examination Phase -->
            <div class="examination-phase-box">
              <h4 class="step-label">Langkah 1: Periksa Pasien dengan Alat Medis</h4>
              <div class="tools-grid">
                <button class="tool-btn ${c.examinationTool === 'stethoscope' && this.examined ? 'tool-active' : ''}" data-tool="stethoscope" type="button">
                  🩺 Stetoskop
                </button>
                <button class="tool-btn ${c.examinationTool === 'xray' && this.examined ? 'tool-active' : ''}" data-tool="xray" type="button">
                  🦴 Sinar-X
                </button>
                <button class="tool-btn ${c.examinationTool === 'thermometer' && this.examined ? 'tool-active' : ''}" data-tool="thermometer" type="button">
                  🌡️ Termometer
                </button>
              </div>

              ${this.examined ? `
                <div class="exam-result-banner">
                  <strong>📋 Hasil Pemeriksaan:</strong>
                  <p>${c.toolFinding}</p>
                </div>
              ` : `
                <p class="exam-hint">Ketuk alat medis di atas untuk memeriksa kondisi pasien!</p>
              `}
            </div>
          </div>

          <!-- Right: Organ Diagnostic & Solution Panel -->
          <div class="diagnostic-action-card">
            <h4 class="step-label">Langkah 2: Tentukan Organ yang Terganggu</h4>
            <div class="organ-choices-grid">
              ${choices.map(id => {
                const organ = ORGANS[id];
                const isSelectedAndCorrect = this.diagnosed && id === c.correctOrganId;
                return `
                  <div class="organ-choice-card ${isSelectedAndCorrect ? 'choice-correct' : ''}" 
                       data-organ-choice="${id}" 
                       role="button" 
                       tabindex="0">
                    <div class="choice-preview">
                      ${organ.renderSVG(60, false)}
                    </div>
                    <span class="choice-name">${organ.name}</span>
                    <span class="choice-system">${organ.systemName}</span>
                  </div>
                `;
              }).join('')}
            </div>

            <!-- Doctor Prescription & Healthy Cure Solution -->
            ${this.diagnosed ? `
              <div class="prescription-box">
                <div class="rx-header">
                  <span class="rx-symbol">℞</span>
                  <h4 class="rx-title">Resep & Solusi Sehat Dokter Cilik:</h4>
                </div>
                <p class="rx-treatment">${c.treatment}</p>
                <div class="rx-tip">
                  <strong>💡 Catatan Dokter Cilik:</strong>
                  <p>${c.doctorTip}</p>
                </div>

                <div class="rx-next-row">
                  <button id="btn-next-patient" class="btn-neo-primary" type="button">
                    Pasien Berikutnya 🩺 ➡️
                  </button>
                </div>
              </div>
            ` : `
              <div class="waiting-diagnosis-box">
                <p>👉 Lakukan pemeriksaan alat, lalu pilih organ yang mengalami keluhan!</p>
              </div>
            `}
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  private bindEvents() {
    const exitBtn = this.container.querySelector('#btn-clinic-exit');
    if (exitBtn) {
      exitBtn.addEventListener('click', () => {
        sound.playPop();
        this.callbacks.onExit();
      });
    }

    const c = CLINICAL_CASES[this.currentCaseIndex];

    const replayBtn = this.container.querySelector('#btn-replay-complaint');
    if (replayBtn) {
      replayBtn.addEventListener('click', () => {
        sound.speakStory(c.story, `Pasien ${c.patientName} (${c.patientAge})`, c.id);
      });
    }

    // Tool examination buttons
    const toolBtns = this.container.querySelectorAll('[data-tool]');
    toolBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tool = btn.getAttribute('data-tool');
        if (!tool) return;

        if (tool === c.examinationTool) {
          this.examined = true;
          if (tool === 'stethoscope') {
            sound.playHeartbeat(110);
          } else if (tool === 'xray') {
            sound.playScannerBeep(700);
          } else {
            sound.playScannerBeep(1200);
          }
          sound.speak(`Pemeriksaan berhasil. ${c.toolFinding}`);
          this.render();
        } else {
          sound.playWrong();
          sound.speak(`Untuk keluhan ini, coba pilih alat medis yang lebih tepat!`);
        }
      });
    });

    // Organ choices
    const choices = this.container.querySelectorAll('[data-organ-choice]');
    choices.forEach(card => {
      card.addEventListener('click', () => {
        const organId = card.getAttribute('data-organ-choice');
        if (!organId) return;

        if (!this.examined) {
          sound.playWrong();
          sound.speak(`Periksa pasien menggunakan alat medis terlebih dahulu sebelum mendiagnosa!`);
          return;
        }

        if (organId === c.correctOrganId) {
          this.diagnosed = true;
          this.solvedCasesCount++;
          sound.playFanfare();
          confetti.burst(60);
          sound.speakPraise();
          this.render();
          this.callbacks.onCaseSolved(c, 3, 250);
        } else {
          sound.playWrong();
          const picked = ORGANS[organId];
          sound.speak(`Bukan ${picked.name}. Perhatikan kembali keluhan pasien dan hasil pemeriksaannya!`);
        }
      });
    });

    // Next Patient Button
    const nextBtn = this.container.querySelector('#btn-next-patient');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        sound.playPop();
        this.loadCase(this.currentCaseIndex + 1);
      });
    }
  }
}
