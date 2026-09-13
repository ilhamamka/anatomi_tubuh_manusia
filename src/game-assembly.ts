// Laboratorium Pasang Organ (Anatomy Assembly Game)
// Drag & drop or tap-to-place organs into accurate human silhouette slots

import { ORGANS, type OrganInfo } from './organs-data';
import { sound } from './audio';
import { confetti } from './confetti';

export interface AssemblyCallbacks {
  onOrganPlaced: (organ: OrganInfo, remaining: number) => void;
  onLevelComplete: (stars: number, xp: number) => void;
  onExit: () => void;
}

export class OrganAssemblyGame {
  private container: HTMLElement;
  private callbacks: AssemblyCallbacks;
  private requiredOrgans: string[] = ['brain', 'heart', 'lungs', 'stomach', 'liver', 'intestines', 'kidneys', 'skeleton'];
  private placedOrgans: Set<string> = new Set();
  private selectedOrganId: string | null = null;

  constructor(container: HTMLElement, callbacks: AssemblyCallbacks) {
    this.container = container;
    this.callbacks = callbacks;
  }

  public startLevel(organIds?: string[]) {
    this.requiredOrgans = organIds && organIds.length > 0 ? organIds : ['brain', 'heart', 'lungs', 'stomach', 'liver', 'intestines', 'kidneys', 'skeleton'];
    this.placedOrgans.clear();
    this.selectedOrganId = null;
    this.render();
  }

  private render() {
    this.container.innerHTML = `
      <div class="assembly-game-wrapper">
        <div class="assembly-header">
          <div class="assembly-title-box">
            <h2 class="assembly-title">🧪 Laboratorium Bedah & Pasang Organ</h2>
            <p class="assembly-desc">Pasangkan organ ke posisi tubuh yang tepat!</p>
          </div>
          <div class="assembly-progress-capsule">
            <span class="progress-pill-label">Progres:</span>
            <span class="progress-pill-val" id="assembly-count">${this.placedOrgans.size} / ${this.requiredOrgans.length}</span>
            <div class="progress-pill-track">
              <div class="progress-pill-fill" style="width: ${(this.placedOrgans.size / this.requiredOrgans.length) * 100}%"></div>
            </div>
          </div>
          <button id="btn-assembly-exit" class="btn-neo-secondary btn-sm" type="button">Kembali</button>
        </div>

        <div class="assembly-stage-layout">
          <!-- Left: Human Body Silhouette Target Area -->
          <div class="silhouette-container">
            <div class="silhouette-canvas" id="silhouette-dropzone">
              <!-- Human Body SVG Silhouette with designated organ drop targets -->
              <svg viewBox="0 0 300 560" class="human-silhouette-svg">
                <defs>
                  <linearGradient id="bodySkinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#070e1b" />
                    <stop offset="100%" stop-color="#0f1f38" />
                  </linearGradient>
                  <filter id="glowDrop" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#00f0ff" flood-opacity="0.4"/>
                  </filter>
                </defs>

                <!-- Human Outline Silhouette (Cyber-Medical Hologram) -->
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
                  fill="url(#bodySkinGrad)" 
                  stroke="#00f0ff" 
                  stroke-width="2.5"
                  stroke-linejoin="round"
                />

                <!-- Spine & Ribcage Holographic Guide -->
                <line x1="150" y1="120" x2="150" y2="340" stroke="#38bdf8" stroke-width="4" opacity="0.4" stroke-linecap="round"/>
                <path d="M 130,170 C 145,165 155,165 170,170 M 125,185 C 145,180 155,180 175,185 M 128,200 C 145,195 155,195 172,200" stroke="#38bdf8" stroke-width="2" opacity="0.4" stroke-linecap="round"/>

                <!-- Interactive Drop Target Zones -->
                ${this.requiredOrgans.map(id => {
                  const organ = ORGANS[id];
                  if (!organ) return '';
                  const isPlaced = this.placedOrgans.has(id);
                  const isSelected = this.selectedOrganId === id;
                  // Map target percentages to 300x560 canvas
                  const cx = (organ.targetPos.x / 100) * 300;
                  const cy = (organ.targetPos.y / 100) * 560;
                  const rx = (organ.targetPos.width / 100) * 150;
                  const ry = (organ.targetPos.height / 100) * 280;

                  return `
                    <g class="drop-target-group ${isPlaced ? 'placed' : 'unplaced'} ${isSelected ? 'targeted' : ''}" 
                       data-organ-id="${id}" 
                       role="button" 
                       tabindex="0"
                       aria-label="Zona Organ ${organ.name}">
                      <!-- Dashed Target Outline -->
                      <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" 
                               class="target-slot-ellipse ${isPlaced ? 'slot-filled' : 'slot-empty'}"
                               fill="${isPlaced ? 'rgba(255,255,255,0.92)' : 'rgba(255, 255, 255, 0.45)'}"
                               stroke="${isPlaced ? organ.primaryColor : '#94a3b8'}" 
                               stroke-width="${isPlaced ? '3' : '2'}" 
                               stroke-dasharray="${isPlaced ? 'none' : '5 4'}"/>
                      
                      ${!isPlaced ? `
                        <!-- Target Ghost Label Icon -->
                        <text x="${cx}" y="${cy + 5}" text-anchor="middle" font-size="16" opacity="0.65" pointer-events="none">${organ.emoji}</text>
                      ` : `
                        <!-- Rendered In-Place Mini Vector Graphic -->
                        <g transform="translate(${cx - 26}, ${cy - 26})">
                          <foreignObject width="52" height="52">
                            ${organ.renderSVG(52, true)}
                          </foreignObject>
                        </g>
                      `}
                    </g>
                  `;
                }).join('')}
              </svg>
            </div>
          </div>

          <!-- Right: Organ Tray / Dock -->
          <div class="organ-tray-panel">
            <h3 class="tray-title">Pilih Organ untuk Dipasang:</h3>
            <div class="tray-grid" id="organ-tray-items">
              ${this.requiredOrgans.map(id => {
                const organ = ORGANS[id];
                if (!organ) return '';
                const isPlaced = this.placedOrgans.has(id);
                const isSelected = this.selectedOrganId === id;

                return `
                  <div class="organ-tray-card ${isPlaced ? 'placed-card' : ''} ${isSelected ? 'selected' : ''}" 
                       data-organ-id="${id}" 
                       tabindex="0"
                       role="button"
                       title="${organ.funTitle}">
                    <div class="tray-card-preview">
                      ${organ.renderSVG(64, !isPlaced)}
                    </div>
                    <div class="tray-card-info">
                      <span class="card-organ-name">${organ.name}</span>
                      <span class="card-latin-name">${organ.latinName}</span>
                    </div>
                    ${isPlaced ? `
                      <span class="tray-placed-check">✓ Terpasang</span>
                    ` : `
                      <button class="btn-tray-action" type="button">${isSelected ? 'Dipilih' : 'Pasang'}</button>
                    `}
                  </div>
                `;
              }).join('')}
            </div>

            <!-- Organ Inspection Drawer / Facts Popup -->
            <div class="organ-info-drawer" id="organ-info-drawer" style="display:none;">
              <!-- Injected on organ click -->
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  private bindEvents() {
    const exitBtn = this.container.querySelector('#btn-assembly-exit');
    if (exitBtn) {
      exitBtn.addEventListener('click', () => {
        sound.playPop();
        this.callbacks.onExit();
      });
    }

    // Organ Tray Cards Click
    const cards = this.container.querySelectorAll('.organ-tray-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-organ-id');
        if (!id) return;
        const organ = ORGANS[id];
        if (!organ) return;

        sound.playPop(1.1);
        this.selectedOrganId = id;
        this.showOrganFactDrawer(organ);
        this.updateSelectedCardStyles();
      });
    });

    // Silhouette Drop Target Click
    const targets = this.container.querySelectorAll('.drop-target-group');
    targets.forEach(target => {
      target.addEventListener('click', () => {
        const targetId = target.getAttribute('data-organ-id');
        if (!targetId) return;

        if (this.placedOrgans.has(targetId)) {
          // Organ is already placed, inspect it
          const organ = ORGANS[targetId];
          if (organ) {
            this.playOrganSound(organ);
            this.showOrganFactDrawer(organ);
          }
          return;
        }

        // If an organ is selected from the tray
        if (this.selectedOrganId) {
          if (this.selectedOrganId === targetId) {
            this.placeOrgan(targetId);
          } else {
            sound.playWrong();
            const wrongOrgan = ORGANS[this.selectedOrganId];
            sound.speak(`Kurang tepat, itu bukan tempat ${wrongOrgan.name}. Coba cari posisinya yang sesuai!`);
          }
        } else {
          // If no organ selected yet, prompt user to select from tray
          this.selectedOrganId = targetId;
          this.updateSelectedCardStyles();
          const organ = ORGANS[targetId];
          if (organ) {
            sound.speak(`Pilih ${organ.name} dari daftar di sebelah kanan untuk dipasang!`);
          }
        }
      });
    });
  }

  private updateSelectedCardStyles() {
    const cards = this.container.querySelectorAll('.organ-tray-card');
    cards.forEach(c => {
      const id = c.getAttribute('data-organ-id');
      if (id === this.selectedOrganId) {
        c.classList.add('selected');
      } else {
        c.classList.remove('selected');
      }
    });

    const targets = this.container.querySelectorAll('.drop-target-group');
    targets.forEach(t => {
      const id = t.getAttribute('data-organ-id');
      if (id === this.selectedOrganId) {
        t.classList.add('targeted');
      } else {
        t.classList.remove('targeted');
      }
    });
  }

  private placeOrgan(organId: string) {
    const organ = ORGANS[organId];
    if (!organ) return;

    this.placedOrgans.add(organId);
    this.selectedOrganId = null;

    // Trigger specific sound effects
    sound.playBoneSnap();
    this.playOrganSound(organ);

    // Friendly TTS speech
    sound.speak(`Hebat! Kamu berhasil memasang ${organ.name} dengan tepat!`);

    // Show fact drawer
    this.showOrganFactDrawer(organ);

    // Re-render UI to update silhouette & tray
    this.render();

    const remaining = this.requiredOrgans.length - this.placedOrgans.size;
    this.callbacks.onOrganPlaced(organ, remaining);

    if (remaining === 0) {
      setTimeout(() => {
        this.handleAllPlacedWin();
      }, 500);
    }
  }

  private playOrganSound(organ: OrganInfo) {
    switch (organ.soundType) {
      case 'heartbeat':
        sound.playHeartbeat(75);
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
        sound.playCorrect();
        break;
    }
  }

  private showOrganFactDrawer(organ: OrganInfo) {
    const drawer = this.container.querySelector('#organ-info-drawer') as HTMLElement;
    if (!drawer) return;

    drawer.style.display = 'block';
    drawer.innerHTML = `
      <div class="drawer-inner" style="border-top: 4px solid ${organ.primaryColor};">
        <div class="drawer-header">
          <div class="drawer-title-col">
            <span class="drawer-badge" style="background:${organ.primaryColor}20; color:${organ.secondaryColor};">${organ.systemName}</span>
            <h4 class="drawer-organ-name">${organ.funTitle} (${organ.name})</h4>
            <span class="drawer-latin-italic">${organ.latinName}</span>
          </div>
          <button id="btn-listen-organ" class="btn-neo-sound" title="Dengarkan Suara Organ" type="button">
            🔊 Dengar Suara
          </button>
        </div>

        ${organ.realisticImage ? `
          <div class="drawer-real-render-box">
            <img src="${organ.realisticImage}" alt="${organ.name}" class="drawer-real-img" />
          </div>
        ` : ''}

        <p class="drawer-summary">${organ.summary}</p>
        
        ${organ.clinicalMetrics ? `
          <div class="drawer-metrics-chips">
            ${Object.entries(organ.clinicalMetrics).map(([k, v]) => `
              <span class="drawer-metric-item"><strong>${k}:</strong> ${v}</span>
            `).join('')}
          </div>
        ` : ''}

        <div class="drawer-fun-fact">
          <strong>💡 Tahukah Kamu?</strong>
          <p>${organ.funFacts[0]}</p>
        </div>
        <div class="drawer-health-tip">
          <strong>🩺 Tips Sehat Dokter Cilik:</strong>
          <p>${organ.healthTips}</p>
        </div>
      </div>
    `;

    const listenBtn = drawer.querySelector('#btn-listen-organ');
    if (listenBtn) {
      listenBtn.addEventListener('click', () => {
        this.playOrganSound(organ);
        sound.speak(`${organ.name}. ${organ.summary}`);
      });
    }
  }

  private handleAllPlacedWin() {
    sound.playFanfare();
    confetti.burst(100);

    const xp = 350;
    const stars = 3;

    const modal = document.createElement('div');
    modal.className = 'neo-modal-overlay';
    modal.innerHTML = `
      <div class="neo-modal-card">
        <div class="modal-star-award">⭐⭐⭐</div>
        <h2 class="modal-title">Luar Biasa, Dokter Cilik!</h2>
        <p class="modal-desc">Kamu telah berhasil menyusun seluruh organ tubuh manusia dengan presisi dan sempurna!</p>
        
        <div class="modal-reward-pills">
          <div class="reward-pill">+${xp} XP Dokter</div>
          <div class="reward-pill">+${stars} Bintang Medis</div>
        </div>

        <button id="btn-modal-win-continue" class="btn-neo-primary" type="button">
          Lanjut ke Misi Berikutnya 🚀
        </button>
      </div>
    `;

    document.body.appendChild(modal);

    const contBtn = modal.querySelector('#btn-modal-win-continue');
    if (contBtn) {
      contBtn.addEventListener('click', () => {
        modal.remove();
        sound.playPop();
        this.callbacks.onLevelComplete(stars, xp);
      });
    }
  }
}
