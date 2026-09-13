// Lab Bebas Anatomi & Eksperimen Organ Tubuh (Sandbox Mode)
// Free experimentation lab for children: heart rate control, breathing simulator, organ acoustic comparison

import { ORGANS, type OrganInfo } from './organs-data';
import { sound } from './audio';

export class SandboxManager {
  private container: HTMLElement;
  private currentOrganId: string = 'heart';
  private zoomLevel: number = 1.0;
  private bpm: number = 80;
  private isBeating: boolean = true;
  private bpmTimer: number | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  public render() {
    const organ = ORGANS[this.currentOrganId] || ORGANS['heart'];

    this.container.innerHTML = `
      <div class="sandbox-view-wrapper">
        <div class="sandbox-header-bar">
          <div class="sandbox-title-col">
            <h2 class="sandbox-title">🎪 Lab Bebas Eksperimen Organ</h2>
            <p class="sandbox-subtitle">Eksplorasi bebas tanpa batas waktu: atur detak jantung, hembusan nafas, dan dengarkan suara organ secara langsung!</p>
          </div>
          <div class="sandbox-controls-row">
            <button id="btn-sandbox-heartbeat" class="btn-neo-secondary btn-sm" type="button">
              ${this.isBeating ? '⏹️ Hentikan Loop Suara' : '▶️ Putar Loop Detak'}
            </button>
          </div>
        </div>

        <div class="sandbox-workbench-grid">
          <!-- Left: Organ Selector Dock -->
          <div class="sandbox-dock-card">
            <h3 class="dock-title">Pilih Organ Laboratorium:</h3>
            <div class="dock-items-scroll">
              ${Object.values(ORGANS).map(o => `
                <button class="dock-organ-btn ${o.id === this.currentOrganId ? 'active' : ''}" data-sandbox-organ="${o.id}" type="button">
                  <span class="dock-organ-emoji">${o.emoji}</span>
                  <div class="dock-organ-text">
                    <strong>${o.name}</strong>
                    <span>${o.systemName}</span>
                  </div>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Center: Interactive Specimen Stage -->
          <div class="sandbox-stage-card">
            <div class="specimen-viewfinder">
              <div class="specimen-svg-container" id="specimen-svg-box" style="transform: scale(${this.zoomLevel});">
                ${organ.renderSVG(140, true)}
              </div>
            </div>

            <!-- Experiment Controls -->
            <div class="sandbox-sliders-box">
              <div class="slider-field">
                <div class="slider-label-row">
                  <span>❤️ Laju Detak Jantung / Ritme:</span>
                  <strong id="sandbox-bpm-val">${this.bpm} BPM</strong>
                </div>
                <input type="range" id="sandbox-bpm-slider" min="50" max="180" value="${this.bpm}" class="slider-neo">
              </div>

              <div class="slider-field">
                <div class="slider-label-row">
                  <span>🔍 Pembesaran Mikroskop:</span>
                  <strong id="sandbox-zoom-val">${Math.round(this.zoomLevel * 100)}%</strong>
                </div>
                <input type="range" id="sandbox-zoom-slider" min="80" max="160" value="${Math.round(this.zoomLevel * 100)}" class="slider-neo">
              </div>
            </div>

            <div class="stage-sound-actions">
              <button id="btn-sandbox-play-sound" class="btn-neo-sound-large" type="button">
                🔊 Dengarkan Akustik ${organ.name}
              </button>
              <button id="btn-sandbox-voice" class="btn-neo-primary" type="button">
                🗣️ Pelafalan & Info Sains
              </button>
            </div>
          </div>

          <!-- Right: Interactive Laboratory Notes -->
          <div class="sandbox-notes-card">
            <div class="notes-header">
              <span class="notes-badge" style="background:${organ.primaryColor}20; color:${organ.secondaryColor};">
                ${organ.systemName}
              </span>
              <h3 class="notes-title">${organ.funTitle}</h3>
              <span class="notes-latin">${organ.latinName}</span>
            </div>

            <div class="notes-body">
              <div class="note-section">
                <h4>🔬 Catatan Pengamatan Lab:</h4>
                <p>${organ.description}</p>
              </div>

              <div class="note-section fact-note">
                <h4>✨ Fakta Ilmiah Utama:</h4>
                <ul>
                  ${organ.funFacts.map(f => `<li>${f}</li>`).join('')}
                </ul>
              </div>

              <div class="note-section rx-note">
                <h4>🌱 Saran Perawatan Organ:</h4>
                <p>${organ.healthTips}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
    if (this.isBeating && this.currentOrganId === 'heart') {
      this.startHeartbeatLoop();
    }
  }

  public destroy() {
    this.isBeating = false;
    if (this.bpmTimer) {
      clearInterval(this.bpmTimer);
      this.bpmTimer = null;
    }
    sound.stopSpeaking();
  }

  private startHeartbeatLoop() {
    if (this.bpmTimer) clearInterval(this.bpmTimer);
    const ms = (60 / this.bpm) * 1000;
    this.bpmTimer = window.setInterval(() => {
      if (this.isBeating && this.currentOrganId === 'heart') {
        sound.playHeartbeat(this.bpm);
      }
    }, ms);
  }

  private bindEvents() {
    const organBtns = this.container.querySelectorAll('[data-sandbox-organ]');
    organBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-sandbox-organ');
        if (!id) return;
        sound.playPop();
        sound.stopSpeaking();
        this.destroy();
        this.currentOrganId = id;
        this.render();
      });
    });

    const bpmSlider = this.container.querySelector('#sandbox-bpm-slider') as HTMLInputElement;
    if (bpmSlider) {
      bpmSlider.addEventListener('input', () => {
        this.bpm = parseInt(bpmSlider.value, 10);
        const bpmVal = this.container.querySelector('#sandbox-bpm-val');
        if (bpmVal) bpmVal.textContent = `${this.bpm} BPM`;
        if (this.isBeating && this.currentOrganId === 'heart') {
          this.startHeartbeatLoop();
        }
      });
    }

    const zoomSlider = this.container.querySelector('#sandbox-zoom-slider') as HTMLInputElement;
    if (zoomSlider) {
      zoomSlider.addEventListener('input', () => {
        this.zoomLevel = parseInt(zoomSlider.value, 10) / 100;
        const zoomVal = this.container.querySelector('#sandbox-zoom-val');
        if (zoomVal) zoomVal.textContent = `${Math.round(this.zoomLevel * 100)}%`;
        const svgBox = this.container.querySelector('#specimen-svg-box') as HTMLElement;
        if (svgBox) svgBox.style.transform = `scale(${this.zoomLevel})`;
      });
    }

    const soundBtn = this.container.querySelector('#btn-sandbox-play-sound');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        const organ = ORGANS[this.currentOrganId];
        this.playOrganAcoustic(organ);
      });
    }

    const voiceBtn = this.container.querySelector('#btn-sandbox-voice');
    if (voiceBtn) {
      voiceBtn.addEventListener('click', () => {
        const organ = ORGANS[this.currentOrganId];
        sound.speak(`Organ ${organ.name}. Nama Latin: ${organ.latinName}. ${organ.summary}. ${organ.description}. Fakta penting: ${organ.funFacts[0]}. Saran dokter: ${organ.healthTips}`);
      });
    }

    const toggleHeartBtn = this.container.querySelector('#btn-sandbox-heartbeat');
    if (toggleHeartBtn) {
      toggleHeartBtn.addEventListener('click', () => {
        this.isBeating = !this.isBeating;
        sound.playPop();
        if (this.isBeating) {
          this.startHeartbeatLoop();
        } else {
          this.destroy();
        }
        toggleHeartBtn.textContent = this.isBeating ? '⏹️ Hentikan Loop Suara' : '▶️ Putar Loop Detak';
      });
    }
  }

  private playOrganAcoustic(organ: OrganInfo) {
    switch (organ.soundType) {
      case 'heartbeat':
        sound.playHeartbeat(this.bpm);
        break;
      case 'breath':
        sound.playBreath();
        break;
      case 'neural':
        sound.playNeural();
        break;
      case 'digestive':
        sound.playDigestive();
        break;
      case 'bone_snap':
        sound.playBoneSnap();
        break;
      default:
        sound.playPop(1.1);
        break;
    }
  }
}
