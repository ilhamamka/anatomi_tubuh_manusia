// Laboratorium Pasang Organ (High-Ticket 3D Holographic Surgical Assembly Workstation)
// Photorealistic 3D medical renders, precision docking ports, authentic audio physics & voiceover

import { ORGANS, type OrganInfo } from './organs-data';
import { sound } from './audio';
import { confetti } from './confetti';

export interface AssemblyCallbacks {
  onOrganPlaced: (organ: OrganInfo, remaining: number) => void;
  onLevelComplete: (stars: number, xp: number) => void;
  onExit: () => void;
}

interface DockingPortConfig {
  x: number; // percentage of mannequin stage width (0-100)
  y: number; // percentage of mannequin stage height (0-100)
  size: number; // visual slot size in px
  label: string;
}

const DOCKING_PORTS: Record<string, DockingPortConfig> = {
  brain: { x: 50, y: 11, size: 68, label: 'Kranium Kepala: Otak' },
  senses_eye: { x: 46.5, y: 13, size: 42, label: 'Orbita Wajah: Mata' },
  senses_ear: { x: 53.5, y: 13, size: 42, label: 'Temporal: Telinga' },
  lungs: { x: 50, y: 25.5, size: 82, label: 'Rongga Toraks: Paru-Paru' },
  heart: { x: 53, y: 27.5, size: 64, label: 'Mediastinum Dada: Jantung' },
  blood_cells: { x: 38, y: 29, size: 52, label: 'Sirkulasi Brakialis: Darah' },
  skeleton: { x: 50, y: 22, size: 76, label: 'Kolom Vertebra: Rangka' },
  liver: { x: 45.5, y: 35.5, size: 68, label: 'Hipokondrium Kanan: Hati' },
  stomach: { x: 54, y: 36.5, size: 64, label: 'Epigastrium Kiri: Lambung' },
  kidneys: { x: 50, y: 39, size: 60, label: 'Retroperitoneal: Ginjal' },
  intestines: { x: 50, y: 44.5, size: 76, label: 'Rongga Abdomen: Usus' },
  senses_skin: { x: 62, y: 41, size: 56, label: 'Sensor Epidermis: Kulit' }
};

export class OrganAssemblyGame {
  private container: HTMLElement;
  private callbacks: AssemblyCallbacks;
  private requiredOrgans: string[] = ['brain', 'heart', 'lungs', 'stomach', 'liver', 'intestines', 'kidneys', 'skeleton'];
  private placedOrgans: Set<string> = new Set();
  private selectedOrganId: string | null = null;
  private activeInspectedOrgan: OrganInfo | null = null;

  constructor(container: HTMLElement, callbacks: AssemblyCallbacks) {
    this.container = container;
    this.callbacks = callbacks;
  }

  public startLevel(organIds?: string[]) {
    this.requiredOrgans = organIds && organIds.length > 0 ? organIds : ['brain', 'heart', 'lungs', 'stomach', 'liver', 'intestines', 'kidneys', 'skeleton'];
    this.placedOrgans.clear();
    this.selectedOrganId = null;
    this.activeInspectedOrgan = null;
    this.render();

    // Friendly opening voice prompt
    sound.speak(`Selamat datang di Laboratorium Bedah Anatomi. Silakan pilih organ di panel sebelah kanan untuk dipasang ke tubuh manekin holografis.`);
  }

  public destroy() {
    sound.stopSpeaking();
  }

  private render() {
    const total = this.requiredOrgans.length;
    const placed = this.placedOrgans.size;
    const progressPct = Math.round((placed / total) * 100);

    this.container.innerHTML = `
      <div class="assembly-game-wrapper dark-medical-workstation">
        <!-- Workstation Top Header -->
        <div class="assembly-header">
          <div class="assembly-title-box">
            <div class="medical-tag-row">
              <span class="medical-telemetry-badge">🔬 WORKSTATION BEDAH & DOCKING ANATOMI 3D</span>
              <span class="medical-fps-badge">PRESISI TINGGI</span>
            </div>
            <h2 class="assembly-title">🧪 Laboratorium Bedah & Rekonstruksi Tubuh</h2>
            <p class="assembly-desc">Pasangkan spesimen organ 3D fotorealistis ke soket anatomi tubuh manekin holografis.</p>
          </div>

          <div class="assembly-header-actions">
            <div class="assembly-progress-capsule">
              <span class="progress-pill-label">Rekonstruksi:</span>
              <span class="progress-pill-val" id="assembly-count">${placed} / ${total} Organ</span>
              <div class="progress-pill-track">
                <div class="progress-pill-fill" style="width: ${progressPct}%"></div>
              </div>
              <span class="progress-pct-badge">${progressPct}%</span>
            </div>
            <button id="btn-assembly-exit" class="btn-neo-secondary btn-sm" type="button">Kembali ke Beranda</button>
          </div>
        </div>

        <!-- Main Assembly Stage -->
        <div class="assembly-stage-layout">
          <!-- Left: 3D Holographic Surgical Mannequin Operating Table -->
          <div class="assembly-operating-theater">
            <div class="theater-glow-halo"></div>

            <div class="mannequin-viewport-box">
              <img src="/assets/assembly_mannequin_table.png" alt="Manekin Holografik 3D" class="mannequin-base-img" />
              <div class="theater-scan-grid"></div>
              <div class="theater-laser-sweep"></div>

              <!-- Interactive Docking Port Sockets -->
              <div class="docking-ports-overlay" id="docking-ports-overlay">
                ${this.requiredOrgans.map(id => {
                  const organ = ORGANS[id];
                  const cfg = DOCKING_PORTS[id] || { x: 50, y: 30, size: 60, label: organ.name };
                  const isPlaced = this.placedOrgans.has(id);
                  const isSelected = this.selectedOrganId === id;

                  return `
                    <div class="docking-socket ${isPlaced ? 'placed' : 'unplaced'} ${isSelected ? 'is-targeted' : ''}"
                         style="left: ${cfg.x}%; top: ${cfg.y}%; width: ${cfg.size}px; height: ${cfg.size}px;"
                         data-target-socket="${id}"
                         role="button"
                         tabindex="0"
                         title="${cfg.label}">
                      
                      ${!isPlaced ? `
                        <!-- Empty Holographic Target Beacon -->
                        <div class="socket-beacon-ring ${isSelected ? 'beacon-pulse-active' : ''}"></div>
                        <div class="socket-crosshair">+</div>
                        <span class="socket-emoji">${organ.emoji}</span>
                        ${isSelected ? `
                          <div class="target-prompt-tooltip">🎯 PASANG DI SINI!</div>
                        ` : ''}
                      ` : `
                        <!-- Placed Photorealistic 3D Specimen inside Body -->
                        <div class="placed-organ-embedded">
                          <img src="${organ.realisticImage || '/assets/realistic_heart_3d.png'}" 
                               alt="${organ.name}" 
                               class="embedded-3d-render" />
                          <div class="embedded-organ-halo" style="background: radial-gradient(circle, ${organ.primaryColor}55 0%, transparent 70%);"></div>
                          <span class="placed-check-dot">✓</span>
                        </div>
                      `}
                    </div>
                  `;
                }).join('')}
              </div>

              <div class="theater-telemetry-hud">
                <span class="theater-hud-line">● BIO-CONTAINMENT: STABIL</span>
                <span class="theater-hud-line">● DOCKING PORT: SIAP</span>
              </div>
            </div>
          </div>

          <!-- Right: 3D Surgical Specimen Tray -->
          <div class="assembly-tray-column">
            <div class="tray-column-header">
              <h3 class="tray-heading">📦 Baki Spesimen Bedah Organ:</h3>
              <p class="tray-sub">Pilih organ untuk dipasang atau dengarkan suara penjelasannya</p>
            </div>

            <div class="tray-cards-scrollable" id="tray-cards-container">
              ${this.requiredOrgans.map(id => {
                const organ = ORGANS[id];
                if (!organ) return '';
                const isPlaced = this.placedOrgans.has(id);
                const isSelected = this.selectedOrganId === id;

                return `
                  <div class="surgical-specimen-card ${isPlaced ? 'is-placed-specimen' : ''} ${isSelected ? 'is-selected-specimen' : ''}"
                       data-specimen-id="${id}"
                       role="button"
                       tabindex="0"
                       style="border-left: 4px solid ${organ.primaryColor};">
                    
                    <div class="specimen-card-visual">
                      <img src="${organ.realisticImage || '/assets/realistic_heart_3d.png'}" 
                           alt="${organ.name}" 
                           class="specimen-3d-thumb" />
                      <span class="specimen-3d-badge">3D HD</span>
                      ${isPlaced ? '<span class="specimen-docked-tag">✓ DOCKED</span>' : ''}
                    </div>

                    <div class="specimen-card-content">
                      <div class="specimen-meta-row">
                        <span class="specimen-system-tag" style="color:${organ.primaryColor};">${organ.systemName}</span>
                        <span class="specimen-latin">LATIN: ${organ.latinName}</span>
                      </div>
                      <h4 class="specimen-title">${organ.name}</h4>
                      <p class="specimen-summary">${organ.summary}</p>

                      <div class="specimen-actions-row">
                        ${!isPlaced ? `
                          <button class="btn-dock-organ ${isSelected ? 'btn-dock-active' : ''}" data-action-dock="${id}" type="button">
                            ${isSelected ? '🎯 Klik Target di Tubuh!' : '📥 Ambil & Pasang Organ'}
                          </button>
                        ` : `
                          <button class="btn-inspect-docked" data-action-inspect="${id}" type="button">
                            🔍 Inspeksi Detail & Fakta
                          </button>
                        `}
                        <button class="btn-listen-mini" data-action-voice="${id}" type="button" title="Dengarkan Cerita Ceria Organ">
                          📖 Cerita
                        </button>
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>

        <!-- Bottom: Active Organ Clinical Inspection Drawer -->
        ${this.activeInspectedOrgan ? `
          <div class="assembly-drawer-card" id="assembly-active-drawer">
            <div class="drawer-header">
              <div class="drawer-title-group">
                <span class="drawer-badge" style="background:${this.activeInspectedOrgan.primaryColor}25; color:${this.activeInspectedOrgan.primaryColor};">
                  ${this.activeInspectedOrgan.systemName}
                </span>
                <h3 class="drawer-name">${this.activeInspectedOrgan.name} <span class="drawer-latin">(${this.activeInspectedOrgan.latinName})</span></h3>
              </div>
              <div class="drawer-actions">
                <button id="btn-drawer-speak" class="btn-neo-accent btn-sm" type="button">
                  📖 Dengarkan Cerita Dokter Cilik
                </button>
                <button id="btn-close-drawer" class="btn-neo-secondary btn-sm" type="button">Tutup</button>
              </div>
            </div>

            <div class="drawer-body-grid">
              <div class="drawer-render-col">
                <img src="${this.activeInspectedOrgan.realisticImage || '/assets/realistic_heart_3d.png'}" 
                     alt="${this.activeInspectedOrgan.name}" 
                     class="drawer-render-large" />
              </div>
              <div class="drawer-details-col">
                <p class="drawer-desc">${this.activeInspectedOrgan.description}</p>
                <div class="drawer-fact-box">
                  <strong>💡 Fakta Medis:</strong> ${this.activeInspectedOrgan.funFacts[0]}
                </div>
                <div class="drawer-tip-box">
                  <strong>🩺 Tips Sehat:</strong> ${this.activeInspectedOrgan.healthTips}
                </div>
              </div>
            </div>
          </div>
        ` : ''}
      </div>
    `;

    this.bindEvents();
  }

  private bindEvents() {
    // Exit button
    this.container.querySelector('#btn-assembly-exit')?.addEventListener('click', () => {
      this.destroy();
      sound.playPop();
      this.callbacks.onExit();
    });

    // Tray card clicks
    const specimenCards = this.container.querySelectorAll('[data-specimen-id]');
    specimenCards.forEach(card => {
      card.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const id = card.getAttribute('data-specimen-id');
        if (!id) return;

        // If clicking voice button
        if (target.closest('[data-action-voice]')) {
          e.stopPropagation();
          const organ = ORGANS[id];
          if (organ) {
            this.playOrganSound(organ);
            sound.speakStory(organ.story, `${organ.name} (${organ.funTitle})`);
          }
          return;
        }

        // If organ is already placed, open inspection drawer
        if (this.placedOrgans.has(id)) {
          this.activeInspectedOrgan = ORGANS[id] || null;
          this.render();
          return;
        }

        // Select organ to place
        sound.playPop();
        this.selectedOrganId = id;
        const organ = ORGANS[id];
        sound.speak(`Pilih lokasi yang tepat untuk ${organ.name}.`);
        this.render();
      });
    });

    // Docking port socket clicks
    const sockets = this.container.querySelectorAll('[data-target-socket]');
    sockets.forEach(sock => {
      sock.addEventListener('click', () => {
        const targetId = sock.getAttribute('data-target-socket');
        if (!targetId) return;

        // If already placed, show drawer
        if (this.placedOrgans.has(targetId)) {
          this.activeInspectedOrgan = ORGANS[targetId] || null;
          sound.playPop();
          this.render();
          return;
        }

        // If an organ is selected from tray
        if (this.selectedOrganId) {
          if (this.selectedOrganId === targetId) {
            this.placeOrgan(targetId);
          } else {
            sound.playWrong();
            const wrongOrgan = ORGANS[this.selectedOrganId];
            sound.speak(`Kurang tepat, itu bukan tempat ${wrongOrgan.name}. Cari lokasi yang sesuai!`);
          }
        } else {
          // No organ selected yet: select this target organ directly from tray
          this.selectedOrganId = targetId;
          const organ = ORGANS[targetId];
          sound.playPop();
          sound.speak(`Organ ${organ.name} dipilih. Tekan pasang untuk merekonstruksi!`);
          this.placeOrgan(targetId);
        }
      });
    });

    // Drawer action buttons
    this.container.querySelector('#btn-close-drawer')?.addEventListener('click', () => {
      this.activeInspectedOrgan = null;
      sound.playPop();
      this.render();
    });

    this.container.querySelector('#btn-drawer-speak')?.addEventListener('click', () => {
      if (!this.activeInspectedOrgan) return;
      const o = this.activeInspectedOrgan;
      this.playOrganSound(o);
      sound.speakStory(o.story, `${o.name} (${o.funTitle})`);
    });
  }

  private placeOrgan(organId: string) {
    const organ = ORGANS[organId];
    if (!organ) return;

    this.placedOrgans.add(organId);
    this.selectedOrganId = null;
    this.activeInspectedOrgan = organ;

    // Authentic surgical dock sounds
    sound.playBoneSnap();
    this.playOrganSound(organ);
    confetti.burst(50);

    // Spoken educational feedback in natural Indonesian
    sound.speak(`Hebat! Kamu berhasil merekonstruksi ${organ.name} ke posisi yang tepat. ${organ.summary}`);

    this.render();

    const remaining = this.requiredOrgans.length - this.placedOrgans.size;
    this.callbacks.onOrganPlaced(organ, remaining);

    if (remaining === 0) {
      setTimeout(() => {
        this.handleAllPlacedWin();
      }, 700);
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
        sound.playScannerBeep(880);
        break;
    }
  }

  private handleAllPlacedWin() {
    sound.playFanfare();
    confetti.burst(120);

    const xp = 350;
    const stars = 3;

    const modal = document.createElement('div');
    modal.className = 'neo-modal-overlay dark-modal-overlay';
    modal.innerHTML = `
      <div class="neo-modal-card dark-modal-card">
        <div class="modal-star-award">⭐⭐⭐</div>
        <h2 class="modal-title" style="color:#00f0ff;">🎉 Rekonstruksi Sempurna, Dokter Cilik!</h2>
        <p class="modal-desc" style="color:#cbd5e1;">Kamu telah berhasil merekonstruksi seluruh organ tubuh manusia ke posisi anatomi yang tepat!</p>
        
        <div class="modal-reward-pills">
          <div class="reward-pill">+${xp} XP Dokter</div>
          <div class="reward-pill">+${stars} Bintang Medis</div>
        </div>

        <button id="btn-modal-win-continue" class="btn-neo-primary btn-glow-cyan" type="button">
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
