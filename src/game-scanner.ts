// Pemindai Tubuh Multi-Layer & Stasiun Bedah 3D Interaktif (WebGL Three.js)
// 3D Holographic Orbit, Real-Time Dissection Explode, CT-Scan Slicing & Clinical Telemetry

import { ORGANS, type OrganInfo } from './organs-data';
import { sound } from './audio';
import { confetti } from './confetti';
import { ThreeAnatomyViewport } from './three-viewport';

export type ScannerLayer = '3d_viewport' | 'skin' | 'skeleton' | 'organs' | 'circulation' | 'nervous';

export interface ScannerCallbacks {
  onOrganInspected: (organ: OrganInfo) => void;
  onComplete: (stars: number, xp: number) => void;
  onExit: () => void;
}

export class BodyScannerGame {
  private container: HTMLElement;
  private callbacks: ScannerCallbacks;
  private currentLayer: ScannerLayer = '3d_viewport';
  private currentBpm: number = 75;
  private activeOrganId: string = 'heart';
  private inspectedOrgans: Set<string> = new Set();
  private bpmIntervalId: number | null = null;
  private threeViewport: ThreeAnatomyViewport | null = null;

  constructor(container: HTMLElement, callbacks: ScannerCallbacks) {
    this.container = container;
    this.callbacks = callbacks;
  }

  public start() {
    this.inspectedOrgans.clear();
    this.currentLayer = '3d_viewport';
    this.activeOrganId = 'heart';
    this.render();
    this.startHeartbeatLoop();
  }

  public destroy() {
    if (this.bpmIntervalId) {
      clearInterval(this.bpmIntervalId);
      this.bpmIntervalId = null;
    }
    if (this.threeViewport) {
      this.threeViewport.destroy();
      this.threeViewport = null;
    }
  }

  private startHeartbeatLoop() {
    if (this.bpmIntervalId) clearInterval(this.bpmIntervalId);
    const intervalMs = (60 / this.currentBpm) * 1000;
    this.bpmIntervalId = window.setInterval(() => {
      if (this.activeOrganId === 'heart') {
        sound.playHeartbeat(this.currentBpm);
        const ecg = this.container.querySelector('.ecg-wave-svg');
        if (ecg) {
          ecg.classList.add('pulse-spike');
          setTimeout(() => ecg.classList.remove('pulse-spike'), 180);
        }
      }
    }, intervalMs);
  }

  private render() {
    const activeOrgan = ORGANS[this.activeOrganId] || ORGANS['heart'];

    this.container.innerHTML = `
      <div class="scanner-game-wrapper dark-medical-theme">
        <div class="scanner-header">
          <div class="scanner-title-box">
            <div class="medical-tag-row">
              <span class="medical-telemetry-badge">⚡ WORKSTATION MEDIS 3D REAL-TIME</span>
              <span class="medical-fps-badge">60 FPS WEBGL</span>
            </div>
            <h2 class="scanner-title">🔬 Pemindai Anatomi 3D & Stetoskop Telemetri</h2>
            <p class="scanner-subtitle">Putar 360°, geser slider bedah organ, lakukan irisan CT-Scan, dan dengarkan ritme akustik organ tubuh manusia.</p>
          </div>
          <div class="scanner-status-capsule">
            <span class="inspected-badge">Diperiksa: ${this.inspectedOrgans.size} / ${Object.keys(ORGANS).length}</span>
            <button id="btn-scanner-exit" class="btn-neo-secondary btn-sm" type="button">Kembali ke Beranda</button>
          </div>
        </div>

        <!-- Layer Selector Toolbar -->
        <div class="scanner-layer-tabs" role="tablist">
          <button class="layer-tab ${this.currentLayer === '3d_viewport' ? 'active' : ''}" data-layer="3d_viewport" type="button">
            🌐 Hologram 3D & Bedah 360°
          </button>
          <button class="layer-tab ${this.currentLayer === 'organs' ? 'active' : ''}" data-layer="organs" type="button">
            🫀 Organ Vital Dalam
          </button>
          <button class="layer-tab ${this.currentLayer === 'skeleton' ? 'active' : ''}" data-layer="skeleton" type="button">
            🦴 Sinar-X Rangka Tulang
          </button>
          <button class="layer-tab ${this.currentLayer === 'circulation' ? 'active' : ''}" data-layer="circulation" type="button">
            🩸 Aliran Pembuluh Darah
          </button>
          <button class="layer-tab ${this.currentLayer === 'nervous' ? 'active' : ''}" data-layer="nervous" type="button">
            ⚡ Jaringan Saraf & Sinapsis
          </button>
        </div>

        <div class="scanner-main-stage">
          <!-- Left: 3D WebGL / Multi-layer Viewport -->
          <div class="scanner-viewport-card">
            <div class="scanner-screen-frame">
              ${this.currentLayer === '3d_viewport' ? `
                <div id="three-canvas-holder" class="three-canvas-holder">
                  <!-- Injected by ThreeAnatomyViewport -->
                  <div class="three-viewport-overlay-hints">
                    <span>🖱️ Drag Mouse / Sentuh: Putar 360°</span>
                    <span>🔍 Scroll Wheel: Zoom Detail</span>
                  </div>
                </div>
              ` : `
                <div class="scanner-grid-overlay"></div>
                <div class="scanner-laser-line"></div>
                <svg viewBox="0 0 300 560" class="scanner-body-svg">
                  <!-- Holographic transparent silhouette -->
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
                    fill="#070b14" 
                    stroke="#00f0ff" 
                    stroke-width="2.5"
                  />
                  ${this.render2DLayerGraphic()}
                </svg>
              `}

              <!-- Live Heart Rate Telemetry Monitor HUD -->
              <div class="hud-monitor-box">
                <div class="hud-monitor-header">
                  <span class="hud-label">TELEMETRI JANTUNG (ECG REAL-TIME):</span>
                  <span class="hud-bpm-val">${this.currentBpm} BPM · SpO2 99%</span>
                </div>
                <svg class="ecg-wave-svg" viewBox="0 0 200 40">
                  <path d="M 0,20 L 40,20 L 50,20 L 55,4 L 60,36 L 65,10 L 70,20 L 100,20 L 140,20 L 150,20 L 155,4 L 160,36 L 165,10 L 170,20 L 200,20" 
                        fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round"/>
                </svg>
              </div>
            </div>

            <!-- 3D Interactive Workbench Controls -->
            <div class="workstation-controls-panel">
              ${this.currentLayer === '3d_viewport' ? `
                <div class="slider-field">
                  <div class="slider-label-row">
                    <span>💥 Pemisahan Bedah Organ 3D (Explode View):</span>
                    <strong id="explode-val">0% (Assembling)</strong>
                  </div>
                  <input type="range" id="slider-explode" min="0" max="100" value="0" class="slider-neo">
                </div>

                <div class="camera-presets-row">
                  <button id="btn-cam-front" class="btn-neo-secondary btn-sm" type="button">Tampak Depan</button>
                  <button id="btn-cam-side" class="btn-neo-secondary btn-sm" type="button">Tampak Samping</button>
                  <button id="btn-cam-back" class="btn-neo-secondary btn-sm" type="button">Tampak Belakang</button>
                  <button id="btn-cam-reset" class="btn-neo-secondary btn-sm" type="button">🔄 Reset 3D</button>
                </div>
              ` : ''}

              <!-- Heart Rate Slider -->
              <div class="slider-field">
                <div class="slider-label-row">
                  <span>⚡ Simulasi Laju Denyut Jantung:</span>
                  <strong id="bpm-val-text">${this.currentBpm} BPM</strong>
                </div>
                <input type="range" id="slider-bpm" min="60" max="160" value="${this.currentBpm}" class="slider-neo">
                <span class="bpm-state-text" id="bpm-state-desc">
                  ${this.currentBpm < 90 ? '🛌 Fase Istirahat / Santai' : (this.currentBpm < 130 ? '🚶 Fase Berjalan / Olahraga Ringan' : '🏃 Fase Lari Cepat & Pacu Kardiovaskular!')}
                </span>
              </div>
            </div>
          </div>

          <!-- Right: Organ Clinical Inspection Panel with Photorealistic Medical Renders -->
          <div class="scanner-info-panel">
            <div class="organ-spotlight-card realistic-clinical-card" style="border-top: 5px solid ${activeOrgan.primaryColor}">
              <div class="spotlight-top-meta">
                <span class="spotlight-badge" style="background:${activeOrgan.primaryColor}25; color:${activeOrgan.primaryColor}; border:1px solid ${activeOrgan.primaryColor};">
                  ${activeOrgan.systemName}
                </span>
                <span class="organ-id-chip">LATIN: ${activeOrgan.latinName}</span>
              </div>

              <div class="spotlight-header">
                <!-- High-Resolution Photorealistic 3D Medical Render Asset -->
                <div class="realistic-render-frame">
                  ${activeOrgan.realisticImage ? `
                    <img src="${activeOrgan.realisticImage}" alt="${activeOrgan.name}" class="realistic-organ-img" />
                  ` : `
                    <div class="spotlight-svg-box">
                      ${activeOrgan.renderSVG(100, true)}
                    </div>
                  `}
                  <span class="render-watermark">3D MEDICAL HD</span>
                </div>

                <div class="spotlight-title-col">
                  <h3 class="spotlight-name">${activeOrgan.name}</h3>
                  <span class="spotlight-latin">${activeOrgan.latinName}</span>
                  <span class="spotlight-tagline">${activeOrgan.funTitle}</span>
                </div>
              </div>

              <!-- Clinical Metrics Telemetry Grid -->
              ${activeOrgan.clinicalMetrics ? `
                <div class="clinical-metrics-grid">
                  ${Object.entries(activeOrgan.clinicalMetrics).map(([label, val]) => `
                    <div class="metric-cell">
                      <span class="metric-label">${label}</span>
                      <strong class="metric-val">${val}</strong>
                    </div>
                  `).join('')}
                </div>
              ` : ''}

              <div class="spotlight-actions">
                <button id="btn-stethoscope-listen" class="btn-neo-sound-large" type="button">
                  🩺 Pasang Stetoskop & Dengarkan Akustik
                </button>
                <button id="btn-voice-explain" class="btn-neo-secondary btn-sm" type="button">
                  🔊 Narasi Ilmiah Dokter
                </button>
              </div>

              <div class="spotlight-body">
                <div class="spotlight-section">
                  <h4 class="section-title">🔍 Fisiologi & Cara Kerja Organ:</h4>
                  <p class="section-text">${activeOrgan.description}</p>
                </div>

                <div class="spotlight-section facts-box">
                  <h4 class="section-title">💡 Fakta Sains Medis Utama:</h4>
                  <ul class="facts-list">
                    ${activeOrgan.funFacts.map(fact => `<li>${fact}</li>`).join('')}
                  </ul>
                </div>

                <div class="spotlight-section tip-box">
                  <h4 class="section-title">🥗 Rekomendasi Kesehatan Spesialis:</h4>
                  <p class="tip-text">${activeOrgan.healthTips}</p>
                </div>
              </div>

              <div class="spotlight-footer">
                <button id="btn-inspect-next" class="btn-neo-primary" type="button">
                  Periksa Organ Spesimen Berikutnya ➡️
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();

    if (this.currentLayer === '3d_viewport') {
      this.initThreeViewport();
    }
  }

  private initThreeViewport() {
    const holder = this.container.querySelector('#three-canvas-holder') as HTMLElement;
    if (!holder) return;

    if (this.threeViewport) {
      this.threeViewport.destroy();
      this.threeViewport = null;
    }

    this.threeViewport = new ThreeAnatomyViewport(holder, (organ) => {
      this.selectOrgan(organ.id);
    });
  }

  private render2DLayerGraphic(): string {
    if (this.currentLayer === 'skeleton') {
      return `
        <g class="xray-group" role="button" data-organ="skeleton" style="cursor:pointer;">
          <ellipse cx="150" cy="72" rx="34" ry="40" fill="#0f172a" stroke="#38bdf8" stroke-width="2.5"/>
          <circle cx="138" cy="70" r="7" fill="#38bdf8" opacity="0.6"/>
          <circle cx="162" cy="70" r="7" fill="#38bdf8" opacity="0.6"/>
          <line x1="150" y1="115" x2="150" y2="320" stroke="#bae6fd" stroke-width="12" stroke-linecap="round"/>
          ${[140, 160, 180, 200, 220].map(y => `
            <path d="M 115,${y} C 135,${y - 8} 165,${y - 8} 185,${y}" stroke="#38bdf8" stroke-width="3.5" stroke-linecap="round" fill="none"/>
          `).join('')}
          <path d="M 115,310 C 130,290 170,290 185,310 C 170,340 130,340 115,310 Z" fill="#0f172a" stroke="#38bdf8" stroke-width="2.5"/>
        </g>
      `;
    }

    if (this.currentLayer === 'circulation') {
      return `
        <g class="circulation-group">
          <circle cx="155" cy="190" r="16" fill="#ef4444" stroke="#ffffff" stroke-width="2"/>
          <path d="M 152,120 V 310 M 152,190 L 95,260 M 152,190 L 205,260 M 152,310 L 120,460 M 152,310 L 180,460" 
                stroke="#ef4444" stroke-width="4.5" stroke-linecap="round" fill="none"/>
          <path d="M 158,120 V 310 M 158,190 L 89,260 M 158,190 L 211,260 M 158,310 L 114,460 M 158,310 L 186,460" 
                stroke="#3b82f6" stroke-width="4" stroke-linecap="round" fill="none"/>
        </g>
      `;
    }

    if (this.currentLayer === 'nervous') {
      return `
        <g class="nervous-group">
          <ellipse cx="150" cy="72" rx="30" ry="34" fill="#f472b6" stroke="#db2777" stroke-width="2.5"/>
          <line x1="150" y1="106" x2="150" y2="330" stroke="#facc15" stroke-width="6" stroke-linecap="round"/>
        </g>
      `;
    }

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
    `;
  }

  private bindEvents() {
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

    // 3D Explode slider
    const explodeSlider = this.container.querySelector('#slider-explode') as HTMLInputElement;
    if (explodeSlider) {
      explodeSlider.addEventListener('input', () => {
        const val = parseInt(explodeSlider.value, 10);
        const label = this.container.querySelector('#explode-val');
        if (label) label.textContent = `${val}% (Dissecting)`;
        if (this.threeViewport) {
          this.threeViewport.setExplodeFactor(val / 100);
        }
      });
    }

    // Camera Presets
    this.container.querySelector('#btn-cam-front')?.addEventListener('click', () => {
      this.threeViewport?.setPresetView('front');
      sound.playPop();
    });
    this.container.querySelector('#btn-cam-side')?.addEventListener('click', () => {
      this.threeViewport?.setPresetView('side');
      sound.playPop();
    });
    this.container.querySelector('#btn-cam-back')?.addEventListener('click', () => {
      this.threeViewport?.setPresetView('back');
      sound.playPop();
    });
    this.container.querySelector('#btn-cam-reset')?.addEventListener('click', () => {
      this.threeViewport?.resetView();
      sound.playPop();
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
        const bpmText = this.container.querySelector('#bpm-val-text');
        if (bpmText) bpmText.textContent = `${this.currentBpm} BPM`;
        const hudBpm = this.container.querySelector('.hud-bpm-val');
        if (hudBpm) hudBpm.textContent = `${this.currentBpm} BPM · SpO2 99%`;
      });
    }

    // Listen button
    const listenBtn = this.container.querySelector('#btn-stethoscope-listen');
    if (listenBtn) {
      listenBtn.addEventListener('click', () => {
        const organ = ORGANS[this.activeOrganId] || ORGANS['heart'];
        this.playOrganAcoustic(organ);
      });
    }

    // Voice button
    const voiceBtn = this.container.querySelector('#btn-voice-explain');
    if (voiceBtn) {
      voiceBtn.addEventListener('click', () => {
        const organ = ORGANS[this.activeOrganId] || ORGANS['heart'];
        sound.speak(`${organ.name}, nama ilmiah ${organ.latinName}. ${organ.summary}. ${organ.funFacts[0]}`);
      });
    }

    // Next button
    const nextBtn = this.container.querySelector('#btn-inspect-next');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const allIds = Object.keys(ORGANS);
        const idx = allIds.indexOf(this.activeOrganId);
        const nextId = allIds[(idx + 1) % allIds.length];
        this.selectOrgan(nextId);
      });
    }
  }

  private selectOrgan(organId: string) {
    const organ = ORGANS[organId];
    if (!organ) return;

    this.activeOrganId = organId;
    this.inspectedOrgans.add(organId);
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
        sound.playScannerBeep(850);
        break;
    }
  }
}
