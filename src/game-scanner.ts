// Pemindai Tubuh Multi-Layer & Eksplorasi Stetoskop Interaktif
// X-Ray, Muscular, Skeletal, Vital Organs & Blood Circulation Scanner

import { ORGANS, type OrganInfo } from './organs-data';
import { sound } from './audio';
import { confetti } from './confetti';

export type ScannerLayer = 'skin' | 'skeleton' | 'organs' | 'circulation' | 'nervous';

export interface ScannerCallbacks {
  onOrganInspected: (organ: OrganInfo) => void;
  onComplete: (stars: number, xp: number) => void;
  onExit: () => void;
}

export class BodyScannerGame {
  private container: HTMLElement;
  private callbacks: ScannerCallbacks;
  private currentLayer: ScannerLayer = 'organs';
  private currentBpm: number = 75;
  private activeOrganId: string | null = 'heart';
  private inspectedOrgans: Set<string> = new Set();
  private bpmIntervalId: number | null = null;

  constructor(container: HTMLElement, callbacks: ScannerCallbacks) {
    this.container = container;
    this.callbacks = callbacks;
  }

  public start() {
    this.inspectedOrgans.clear();
    this.currentLayer = 'organs';
    this.activeOrganId = 'heart';
    this.render();
    this.startHeartbeatLoop();
  }

  public destroy() {
    if (this.bpmIntervalId) {
      clearInterval(this.bpmIntervalId);
      this.bpmIntervalId = null;
    }
  }

  private startHeartbeatLoop() {
    if (this.bpmIntervalId) clearInterval(this.bpmIntervalId);
    const intervalMs = (60 / this.currentBpm) * 1000;
    this.bpmIntervalId = window.setInterval(() => {
      if (this.activeOrganId === 'heart' && this.currentLayer === 'organs') {
        sound.playHeartbeat(this.currentBpm);
        const ecg = this.container.querySelector('.ecg-wave-svg');
        if (ecg) {
          ecg.classList.add('pulse-spike');
          setTimeout(() => ecg.classList.remove('pulse-spike'), 200);
        }
      }
    }, intervalMs);
  }

  private render() {
    const activeOrgan = this.activeOrganId ? ORGANS[this.activeOrganId] : ORGANS['heart'];

    this.container.innerHTML = `
      <div class="scanner-game-wrapper">
        <div class="scanner-header">
          <div class="scanner-title-box">
            <h2 class="scanner-title">🔬 Pemindai Tubuh Multi-Layer & Stetoskop</h2>
            <p class="scanner-subtitle">Ganti filter sinar pemindai dan sentuh organ untuk mendengarkan suaranya!</p>
          </div>
          <div class="scanner-status-capsule">
            <span class="inspected-badge">Diperiksa: ${this.inspectedOrgans.size} / ${Object.keys(ORGANS).length}</span>
            <button id="btn-scanner-exit" class="btn-neo-secondary btn-sm" type="button">Kembali</button>
          </div>
        </div>

        <!-- Layer Selector Toolbar -->
        <div class="scanner-layer-tabs" role="tablist">
          <button class="layer-tab ${this.currentLayer === 'skin' ? 'active' : ''}" data-layer="skin" type="button">
            🧴 Lapisan Kulit Luar
          </button>
          <button class="layer-tab ${this.currentLayer === 'skeleton' ? 'active' : ''}" data-layer="skeleton" type="button">
            🦴 Sinar-X Rangka Tulang
          </button>
          <button class="layer-tab ${this.currentLayer === 'organs' ? 'active' : ''}" data-layer="organs" type="button">
            🫀 Organ Vital Dalam
          </button>
          <button class="layer-tab ${this.currentLayer === 'circulation' ? 'active' : ''}" data-layer="circulation" type="button">
            🩸 Peredaran Darah & Sel
          </button>
          <button class="layer-tab ${this.currentLayer === 'nervous' ? 'active' : ''}" data-layer="nervous" type="button">
            ⚡ Saraf & Otak
          </button>
        </div>

        <div class="scanner-main-stage">
          <!-- Left: Interactive Scanner Visualizer -->
          <div class="scanner-viewport-card">
            <div class="scanner-screen-frame">
              <div class="scanner-grid-overlay"></div>
              <div class="scanner-laser-line"></div>

              <svg viewBox="0 0 300 560" class="scanner-body-svg">
                <!-- Outer Body Contour Silhouette -->
                <path d="
                  M 150,25 
                  C 175,25 190,45 190,75 
                  C 190,95 180,110 172,120 
                  C 185,126 215,138 235,165 
                  C 255,195 265,270 262,310 
                  C 260,320 248,322 242,314 
                  C 235,285 224,225 212,205 
                  C 210,230 210,280 210,315 
                  C 210,335 220,380 220,440 
                  C 220,500 210,535 192,535 
                  C 180,535 174,510 170,450 
                  C 165,395 158,355 150,355 
                  C 142,355 135,395 130,450 
                  C 126,510 120,535 108,535 
                  C 90,535 80,500 80,440 
                  C 80,380 90,335 90,315 
                  C 90,280 90,230 88,205 
                  C 76,225 65,285 58,314 
                  C 52,322 40,320 38,310 
                  C 35,270 45,195 65,165 
                  C 85,138 115,126 128,120 
                  C 120,110 110,95 110,75 
                  C 110,45 125,25 150,25 Z" 
                  fill="${this.currentLayer === 'skin' ? '#fbcfe8' : '#0f172a'}" 
                  stroke="#38bdf8" 
                  stroke-width="3"
                />

                ${this.renderLayerGraphic()}
              </svg>

              <!-- Live Heart Rate Monitor HUD (shown if heart active) -->
              <div class="hud-monitor-box">
                <div class="hud-monitor-header">
                  <span class="hud-label">DETAK JANTUNG (ECG):</span>
                  <span class="hud-bpm-val">${this.currentBpm} BPM</span>
                </div>
                <svg class="ecg-wave-svg" viewBox="0 0 200 40">
                  <path d="M 0,20 L 40,20 L 50,20 L 55,5 L 60,35 L 65,12 L 70,20 L 100,20 L 140,20 L 150,20 L 155,5 L 160,35 L 165,12 L 170,20 L 200,20" 
                        fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round"/>
                </svg>
              </div>
            </div>

            <!-- Heart Rate Simulator Slider -->
            <div class="bpm-control-capsule">
              <label for="slider-bpm" class="bpm-label">⚡ Latihan Pompa Jantung:</label>
              <input type="range" id="slider-bpm" min="60" max="160" value="${this.currentBpm}" class="slider-neo">
              <span class="bpm-state-text" id="bpm-state-desc">
                ${this.currentBpm < 90 ? '🛌 Sedang Istirahat / Santai' : (this.currentBpm < 130 ? '🚶 Sedang Berjalan Aktif' : '🏃 Sedang Lari Cepat!')}
              </span>
            </div>
          </div>

          <!-- Right: Organ Clinical Inspection Panel -->
          <div class="scanner-info-panel">
            <div class="organ-spotlight-card" style="border-color:${activeOrgan.primaryColor}">
              <div class="spotlight-badge" style="background:${activeOrgan.primaryColor}20; color:${activeOrgan.secondaryColor};">
                ${activeOrgan.systemName}
              </div>

              <div class="spotlight-header">
                <div class="spotlight-svg-box">
                  ${activeOrgan.renderSVG(80, true)}
                </div>
                <div class="spotlight-title-col">
                  <h3 class="spotlight-name">${activeOrgan.name}</h3>
                  <span class="spotlight-latin">${activeOrgan.latinName}</span>
                  <span class="spotlight-tagline">${activeOrgan.funTitle}</span>
                </div>
              </div>

              <div class="spotlight-actions">
                <button id="btn-stethoscope-listen" class="btn-neo-sound-large" type="button">
                  🩺 Pasang Stetoskop & Dengarkan Suara
                </button>
                <button id="btn-voice-explain" class="btn-neo-secondary btn-sm" type="button">
                  🔊 Penjelasan Suara Dokter
                </button>
              </div>

              <div class="spotlight-body">
                <div class="spotlight-section">
                  <h4 class="section-title">🔍 Fungsi Utama:</h4>
                  <p class="section-text">${activeOrgan.description}</p>
                </div>

                <div class="spotlight-section facts-box">
                  <h4 class="section-title">💡 Fakta Sains Luar Biasa:</h4>
                  <ul class="facts-list">
                    ${activeOrgan.funFacts.map(fact => `<li>${fact}</li>`).join('')}
                  </ul>
                </div>

                <div class="spotlight-section tip-box">
                  <h4 class="section-title">🥗 Tips Hidup Sehat:</h4>
                  <p class="tip-text">${activeOrgan.healthTips}</p>
                </div>
              </div>

              <div class="spotlight-footer">
                <button id="btn-inspect-next" class="btn-neo-primary" type="button">
                  Periksa Organ Lainnya ✨
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  private renderLayerGraphic(): string {
    if (this.currentLayer === 'skeleton') {
      // High-tech X-Ray Skeleton
      return `
        <!-- X-Ray Skull -->
        <g class="xray-group" role="button" data-organ="skeleton" style="cursor:pointer;">
          <ellipse cx="150" cy="72" rx="34" ry="40" fill="#e0f2fe" stroke="#38bdf8" stroke-width="2.5" opacity="0.9"/>
          <circle cx="138" cy="70" r="7" fill="#0f172a"/>
          <circle cx="162" cy="70" r="7" fill="#0f172a"/>
          <path d="M 142,95 L 158,95" stroke="#0f172a" stroke-width="3"/>
          <!-- Spine -->
          <line x1="150" y1="115" x2="150" y2="320" stroke="#bae6fd" stroke-width="12" stroke-linecap="round"/>
          <line x1="150" y1="115" x2="150" y2="320" stroke="#0284c7" stroke-width="2" stroke-dasharray="4 6"/>
          <!-- Ribs -->
          ${[140, 160, 180, 200, 220].map(y => `
            <path d="M 115,${y} C 135,${y - 8} 165,${y - 8} 185,${y}" stroke="#e0f2fe" stroke-width="4" stroke-linecap="round" fill="none"/>
          `).join('')}
          <!-- Pelvis -->
          <path d="M 115,310 C 130,290 170,290 185,310 C 170,340 130,340 115,310 Z" fill="#e0f2fe" stroke="#38bdf8" stroke-width="2.5"/>
          <!-- Leg Bones -->
          <line x1="130" y1="335" x2="115" y2="440" stroke="#e0f2fe" stroke-width="8" stroke-linecap="round"/>
          <line x1="170" y1="335" x2="185" y2="440" stroke="#e0f2fe" stroke-width="8" stroke-linecap="round"/>
        </g>
      `;
    }

    if (this.currentLayer === 'circulation') {
      // Animated Arteries & Veins
      return `
        <!-- Arteries (Red) & Veins (Blue) -->
        <g class="circulation-group">
          <!-- Heart Center -->
          <circle cx="155" cy="190" r="16" fill="#ef4444" stroke="#ffffff" stroke-width="2"/>
          <!-- Major Vessels -->
          <path d="M 152,120 V 310 M 152,190 L 95,260 M 152,190 L 205,260 M 152,310 L 120,460 M 152,310 L 180,460" 
                stroke="#ef4444" stroke-width="4.5" stroke-linecap="round" fill="none"/>
          <path d="M 158,120 V 310 M 158,190 L 89,260 M 158,190 L 211,260 M 158,310 L 114,460 M 158,310 L 186,460" 
                stroke="#3b82f6" stroke-width="4" stroke-linecap="round" fill="none"/>
          <!-- Flowing blood cells circles -->
          <circle cx="152" cy="150" r="4" fill="#ffffff" class="blood-pulse-dot"/>
          <circle cx="152" cy="240" r="4" fill="#ffffff" class="blood-pulse-dot"/>
          <circle cx="158" cy="270" r="4" fill="#60a5fa" class="blood-pulse-dot"/>
        </g>
      `;
    }

    if (this.currentLayer === 'nervous') {
      return `
        <!-- Brain and Central Nervous System -->
        <g class="nervous-group">
          <ellipse cx="150" cy="72" rx="30" ry="34" fill="#f472b6" stroke="#db2777" stroke-width="2.5"/>
          <line x1="150" y1="106" x2="150" y2="330" stroke="#facc15" stroke-width="6" stroke-linecap="round"/>
          ${[130, 155, 180, 205, 230, 255, 280].map(y => `
            <path d="M 110,${y + 10} L 150,${y} L 190,${y + 10}" stroke="#facc15" stroke-width="2" stroke-linecap="round" fill="none"/>
          `).join('')}
        </g>
      `;
    }

    // Default: 'organs' Layer - Show all clickable organs
    return `
      <!-- Brain -->
      <g class="organ-hotspot ${this.activeOrganId === 'brain' ? 'active-hotspot' : ''}" data-organ="brain" style="cursor:pointer;">
        <foreignObject x="120" y="44" width="60" height="60">
          ${ORGANS.brain.renderSVG(56, true)}
        </foreignObject>
      </g>

      <!-- Lungs -->
      <g class="organ-hotspot ${this.activeOrganId === 'lungs' ? 'active-hotspot' : ''}" data-organ="lungs" style="cursor:pointer;">
        <foreignObject x="106" y="150" width="88" height="74">
          ${ORGANS.lungs.renderSVG(74, true)}
        </foreignObject>
      </g>

      <!-- Heart -->
      <g class="organ-hotspot ${this.activeOrganId === 'heart' ? 'active-hotspot' : ''}" data-organ="heart" style="cursor:pointer;">
        <foreignObject x="135" y="172" width="56" height="56">
          ${ORGANS.heart.renderSVG(50, true)}
        </foreignObject>
      </g>

      <!-- Liver -->
      <g class="organ-hotspot ${this.activeOrganId === 'liver' ? 'active-hotspot' : ''}" data-organ="liver" style="cursor:pointer;">
        <foreignObject x="110" y="225" width="56" height="56">
          ${ORGANS.liver.renderSVG(50, true)}
        </foreignObject>
      </g>

      <!-- Stomach -->
      <g class="organ-hotspot ${this.activeOrganId === 'stomach' ? 'active-hotspot' : ''}" data-organ="stomach" style="cursor:pointer;">
        <foreignObject x="145" y="235" width="54" height="54">
          ${ORGANS.stomach.renderSVG(48, true)}
        </foreignObject>
      </g>

      <!-- Kidneys -->
      <g class="organ-hotspot ${this.activeOrganId === 'kidneys' ? 'active-hotspot' : ''}" data-organ="kidneys" style="cursor:pointer;">
        <foreignObject x="122" y="275" width="56" height="40">
          ${ORGANS.kidneys.renderSVG(42, true)}
        </foreignObject>
      </g>

      <!-- Intestines -->
      <g class="organ-hotspot ${this.activeOrganId === 'intestines' ? 'active-hotspot' : ''}" data-organ="intestines" style="cursor:pointer;">
        <foreignObject x="120" y="315" width="60" height="60">
          ${ORGANS.intestines.renderSVG(56, true)}
        </foreignObject>
      </g>
    `;
  }

  private bindEvents() {
    // Exit Button
    const exitBtn = this.container.querySelector('#btn-scanner-exit');
    if (exitBtn) {
      exitBtn.addEventListener('click', () => {
        this.destroy();
        sound.playPop();
        this.callbacks.onExit();
      });
    }

    // Layer Tabs
    const tabs = this.container.querySelectorAll('.layer-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const layer = tab.getAttribute('data-layer') as ScannerLayer;
        if (!layer) return;
        sound.playScannerBeep(600);
        this.currentLayer = layer;
        this.render();
      });
    });

    // Organ Hotspots
    const hotspots = this.container.querySelectorAll('[data-organ]');
    hotspots.forEach(spot => {
      spot.addEventListener('click', () => {
        const organId = spot.getAttribute('data-organ');
        if (!organId) return;
        this.selectOrgan(organId);
      });
    });

    // Heart Rate Slider
    const slider = this.container.querySelector('#slider-bpm') as HTMLInputElement;
    if (slider) {
      slider.addEventListener('input', () => {
        this.currentBpm = parseInt(slider.value, 10);
        this.startHeartbeatLoop();
        const label = this.container.querySelector('.hud-bpm-val');
        if (label) label.textContent = `${this.currentBpm} BPM`;
        const stateDesc = this.container.querySelector('#bpm-state-desc');
        if (stateDesc) {
          stateDesc.textContent = this.currentBpm < 90 ? '🛌 Sedang Istirahat / Santai' : (this.currentBpm < 130 ? '🚶 Sedang Berjalan Aktif' : '🏃 Sedang Lari Cepat!');
        }
      });
    }

    // Stethoscope Listen Button
    const listenBtn = this.container.querySelector('#btn-stethoscope-listen');
    if (listenBtn) {
      listenBtn.addEventListener('click', () => {
        const organ = this.activeOrganId ? ORGANS[this.activeOrganId] : ORGANS['heart'];
        this.playOrganAcoustic(organ);
      });
    }

    // Voice Explanation Button
    const voiceBtn = this.container.querySelector('#btn-voice-explain');
    if (voiceBtn) {
      voiceBtn.addEventListener('click', () => {
        const organ = this.activeOrganId ? ORGANS[this.activeOrganId] : ORGANS['heart'];
        sound.speak(`${organ.name}, ${organ.latinName}. ${organ.summary}. ${organ.funFacts[0]}`);
      });
    }

    // Inspect Next Button
    const nextBtn = this.container.querySelector('#btn-inspect-next');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const allIds = Object.keys(ORGANS);
        const currentIdx = allIds.indexOf(this.activeOrganId || 'heart');
        const nextId = allIds[(currentIdx + 1) % allIds.length];
        this.selectOrgan(nextId);
      });
    }
  }

  private selectOrgan(organId: string) {
    const organ = ORGANS[organId];
    if (!organ) return;

    this.activeOrganId = organId;
    this.inspectedOrgans.add(organId);
    sound.playPop();
    this.playOrganAcoustic(organ);

    this.render();
    this.callbacks.onOrganInspected(organ);

    if (this.inspectedOrgans.size === Object.keys(ORGANS).length) {
      confetti.burst(60);
      sound.playFanfare();
    }
  }

  private playOrganAcoustic(organ: OrganInfo) {
    switch (organ.soundType) {
      case 'heartbeat':
        sound.playHeartbeat(this.currentBpm);
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
        sound.playScannerBeep(750);
        break;
    }
  }
}
