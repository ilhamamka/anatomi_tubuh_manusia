// Main Application Orchestrator & State Manager for Anatomi Tubuh Manusia

import './style.css';
import { sound } from './audio';
import { confetti } from './confetti';
import { leaderboard } from './leaderboard';
import { commercial } from './commercial';
import { ORGANS, CURRICULUM_LEVELS } from './organs-data';
import { OrganAssemblyGame } from './game-assembly';
import { BodyScannerGame } from './game-scanner';
import { ClinicGame } from './game-clinic';
import { AnatomyChartManager } from './anatomy-chart';
import { SandboxManager } from './sandbox';
import { ParentGuideRenderer } from './parent-guide';
import { WorksheetGenerator } from './worksheet';
import { ShareCardGenerator } from './share-card';
import { getIcon, renderBrandLogo } from './icons';

class App {
  private currentScreen: string = 'screen-home';
  private assemblyGame!: OrganAssemblyGame;
  private scannerGame!: BodyScannerGame;
  private clinicGame!: ClinicGame;
  private chartManager!: AnatomyChartManager;
  private sandboxManager!: SandboxManager;
  private guideRenderer!: ParentGuideRenderer;
  private worksheetGen!: WorksheetGenerator;

  public init() {
    this.renderBrandAndIcons();
    this.initEngines();
    this.renderHeroMascots();
    this.renderCurriculumLevels();
    this.renderPlayerProfilePill();
    this.bindGlobalEvents();
    this.updateAudioIcons();
    this.setupPWAAndWakeLock();
  }

  private renderBrandAndIcons() {
    const brandBox = document.getElementById('btn-nav-home');
    if (brandBox) {
      brandBox.innerHTML = renderBrandLogo();
    }

    // Inject vector SVG icons by data-icon attribute
    document.querySelectorAll('[data-icon]').forEach(el => {
      const iconName = el.getAttribute('data-icon');
      if (iconName) {
        el.innerHTML = getIcon(iconName, 18);
      }
    });
  }

  private initEngines() {
    const assemblyRoot = document.getElementById('assembly-game-root')!;
    const scannerRoot = document.getElementById('scanner-game-root')!;
    const clinicRoot = document.getElementById('clinic-game-root')!;
    const chartRoot = document.getElementById('chart-root')!;
    const sandboxRoot = document.getElementById('sandbox-root')!;
    const guideRoot = document.getElementById('guide-root')!;
    const worksheetsRoot = document.getElementById('worksheets-root')!;

    this.assemblyGame = new OrganAssemblyGame(assemblyRoot, {
      onOrganPlaced: (_organ, remaining) => {
        const countLabel = document.getElementById('assembly-count');
        if (countLabel) {
          countLabel.textContent = `${8 - remaining} / 8`;
        }
      },
      onLevelComplete: (stars, xp) => {
        leaderboard.addRewards(xp, stars, 1, 'Juara Lab Bedah');
        this.renderPlayerProfilePill();
        this.renderCurriculumLevels();
        this.switchScreen('screen-home');
      },
      onExit: () => {
        this.switchScreen('screen-home');
      }
    });

    this.scannerGame = new BodyScannerGame(scannerRoot, {
      onOrganInspected: (_organ) => {
        leaderboard.addRewards(15, 0);
        this.renderPlayerProfilePill();
      },
      onComplete: (stars, xp) => {
        leaderboard.addRewards(xp, stars, 2, 'Pakar Sinar-X');
        this.renderPlayerProfilePill();
      },
      onExit: () => {
        this.switchScreen('screen-home');
      }
    });

    this.clinicGame = new ClinicGame(clinicRoot, {
      onCaseSolved: (_clinicalCase, stars, xp) => {
        leaderboard.addRewards(xp, stars, 3, 'Dokter Cilik Penyembuh');
        this.renderPlayerProfilePill();
        this.renderCurriculumLevels();
      },
      onExit: () => {
        this.switchScreen('screen-home');
      }
    });

    this.chartManager = new AnatomyChartManager(chartRoot);
    this.sandboxManager = new SandboxManager(sandboxRoot);
    this.guideRenderer = new ParentGuideRenderer(guideRoot);
    this.worksheetGen = new WorksheetGenerator(worksheetsRoot);
  }

  private renderHeroMascots() {
    const box = document.getElementById('hero-mascots-box');
    if (!box) return;

    box.innerHTML = `
      <div class="mascot-avatar-circle" title="Jantung">
        ${ORGANS.heart.renderSVG(72, true)}
      </div>
      <div class="mascot-avatar-circle" title="Otak">
        ${ORGANS.brain.renderSVG(72, true)}
      </div>
      <div class="mascot-avatar-circle" title="Paru-paru">
        ${ORGANS.lungs.renderSVG(72, true)}
      </div>
    `;
  }

  public renderPlayerProfilePill() {
    const container = document.getElementById('player-profile-pill');
    if (!container) return;

    const profile = leaderboard.getProfile();
    container.innerHTML = `
      <div style="background:#ffffff; border:2px solid var(--ink-line); border-radius:var(--radius-pill); padding:6px 14px; display:flex; align-items:center; gap:8px; box-shadow:var(--shadow-sm);">
        <span style="font-size:18px;">${profile.avatar}</span>
        <div style="line-height:1.2;">
          <strong style="font-size:13px; display:block;">${profile.name}</strong>
          <span style="font-size:11px; color:#e11d48; font-weight:800;">${profile.xp} XP · ${profile.stars} ⭐</span>
        </div>
      </div>
    `;

    container.onclick = () => this.openProfileEditorModal();
  }

  public renderCurriculumLevels() {
    const listContainer = document.getElementById('levels-list-container');
    if (!listContainer) return;

    const profile = leaderboard.getProfile();

    listContainer.innerHTML = CURRICULUM_LEVELS.map(level => {
      const isLocked = commercial.isLevelLocked(level.id);
      const isCompleted = profile.completedLevels.includes(level.id);

      return `
        <div class="level-item-card ${isLocked ? 'locked' : ''}" data-level-id="${level.id}" role="button" tabindex="0">
          <div class="level-card-top">
            <span class="level-num-pill">Tingkat ${level.id}</span>
            <span style="font-size:12px; font-weight:900; color:${isCompleted ? '#16a34a' : (isLocked ? '#e11d48' : '#0284c7')};">
              ${isCompleted ? '✅ Selesai' : (isLocked ? '🔒 VIP Terkunci' : '▶️ Siap Main')}
            </span>
          </div>
          <h4 class="level-title">${level.title}</h4>
          <p class="level-subtitle">${level.subtitle}</p>
          <div class="level-organs-chips">
            ${level.organs.map(id => {
              const organ = ORGANS[id];
              return organ ? `<span class="organ-mini-chip">${organ.emoji} ${organ.name}</span>` : '';
            }).join('')}
          </div>
        </div>
      `;
    }).join('');

    // Bind click to start level or trigger VIP modal
    const cards = listContainer.querySelectorAll('.level-item-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const id = parseInt(card.getAttribute('data-level-id') || '1', 10);
        this.handleLevelCardClick(id);
      });
    });
  }

  private handleLevelCardClick(levelId: number) {
    if (commercial.isLevelLocked(levelId)) {
      sound.playWrong();
      this.openVipModal();
      return;
    }

    sound.playPop();
    const level = CURRICULUM_LEVELS.find(l => l.id === levelId);
    if (!level) return;

    // Start assembly game with specific level organs
    this.assemblyGame.startLevel(level.organs);
    this.switchScreen('screen-assembly');
  }

  public switchScreen(screenId: string) {
    // Clean up ongoing loops, speech, and component states
    sound.stopSpeaking();

    if (screenId !== 'screen-scanner') {
      this.scannerGame?.destroy();
    }
    if (screenId !== 'screen-sandbox') {
      this.sandboxManager?.destroy();
    }
    if (screenId !== 'screen-assembly') {
      this.assemblyGame?.destroy();
    }
    if (screenId !== 'screen-clinic') {
      this.clinicGame?.destroy();
    }
    if (screenId !== 'screen-chart') {
      this.chartManager?.destroy();
    }

    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(screenId);
    if (target) {
      target.classList.add('active');
      this.currentScreen = screenId;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (screenId === 'screen-chart') {
      this.chartManager.render('all');
    } else if (screenId === 'screen-sandbox') {
      this.sandboxManager.render();
    } else if (screenId === 'screen-guide') {
      this.guideRenderer.render();
    } else if (screenId === 'screen-worksheets') {
      this.worksheetGen.render('certificate');
    } else if (screenId === 'screen-leaderboard') {
      this.renderLeaderboardView();
    } else if (screenId === 'screen-home') {
      this.renderPlayerProfilePill();
      this.renderCurriculumLevels();
    }
  }

  private renderLeaderboardView() {
    const listContainer = document.getElementById('leaderboard-list-container');
    if (!listContainer) return;

    const data = leaderboard.getLeaderboard();

    listContainer.innerHTML = data.map(item => `
      <div class="rank-row rank-${item.rank} ${item.isCurrentPlayer ? 'current-player' : ''}">
        <div style="display:flex; align-items:center; gap:16px;">
          <strong style="font-size:22px; width:36px; text-align:center;">#${item.rank}</strong>
          <span style="font-size:32px;">${item.avatar}</span>
          <div>
            <h4 style="font-family:var(--font-display); font-size:18px; font-weight:900;">${item.name}</h4>
            <span style="font-size:12px; color:#64748b; font-weight:700;">📍 ${item.city} · ${item.rankTitle}</span>
          </div>
        </div>
        <div style="text-align:right;">
          <strong style="font-size:18px; color:#e11d48; display:block;">${item.xp} XP</strong>
          <span style="font-size:13px; font-weight:800; color:#d97706;">${item.stars} ⭐</span>
        </div>
      </div>
    `).join('');
  }

  private bindGlobalEvents() {
    // Navigation items
    document.getElementById('btn-nav-home')?.addEventListener('click', () => {
      sound.playPop();
      this.switchScreen('screen-home');
    });

    document.getElementById('btn-nav-chart')?.addEventListener('click', () => {
      sound.playPop();
      this.switchScreen('screen-chart');
    });

    document.getElementById('btn-nav-sandbox')?.addEventListener('click', () => {
      sound.playPop();
      this.switchScreen('screen-sandbox');
    });

    document.getElementById('btn-nav-leaderboard')?.addEventListener('click', () => {
      sound.playPop();
      this.switchScreen('screen-leaderboard');
    });

    document.getElementById('btn-nav-guide')?.addEventListener('click', () => {
      sound.playPop();
      this.switchScreen('screen-guide');
    });

    document.getElementById('btn-nav-worksheets')?.addEventListener('click', () => {
      sound.playPop();
      this.switchScreen('screen-worksheets');
    });

    document.getElementById('btn-nav-vip')?.addEventListener('click', () => {
      sound.playPop();
      this.openVipModal();
    });

    // Home Mode Cards
    document.getElementById('btn-hero-play-assembly')?.addEventListener('click', () => {
      sound.playPop();
      this.assemblyGame.startLevel();
      this.switchScreen('screen-assembly');
    });

    document.getElementById('btn-hero-play-scanner')?.addEventListener('click', () => {
      sound.playPop();
      this.scannerGame.start();
      this.switchScreen('screen-scanner');
    });

    document.getElementById('card-mode-assembly')?.addEventListener('click', () => {
      sound.playPop();
      this.assemblyGame.startLevel();
      this.switchScreen('screen-assembly');
    });

    document.getElementById('card-mode-scanner')?.addEventListener('click', () => {
      sound.playPop();
      this.scannerGame.start();
      this.switchScreen('screen-scanner');
    });

    document.getElementById('card-mode-clinic')?.addEventListener('click', () => {
      sound.playPop();
      this.clinicGame.start();
      this.switchScreen('screen-clinic');
    });

    // Audio / BGM / Lang / Fullscreen controls
    document.getElementById('btn-toggle-sound')?.addEventListener('click', () => {
      const isEnabled = sound.toggleSound();
      this.updateAudioIcons();
      if (isEnabled) sound.playPop();
    });

    document.getElementById('btn-toggle-bgm')?.addEventListener('click', () => {
      sound.toggleBgm();
      this.updateAudioIcons();
    });

    document.getElementById('btn-toggle-lang')?.addEventListener('click', () => {
      const current = sound.getLanguage();
      const next = current === 'id' ? 'en' : 'id';
      sound.setLanguage(next);
      const label = document.getElementById('lang-label');
      if (label) label.textContent = next.toUpperCase();
      sound.playPop();
    });

    document.getElementById('btn-toggle-fullscreen')?.addEventListener('click', () => {
      sound.playPop();
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });

    // Share Card Generator on Leaderboard
    document.getElementById('btn-share-card')?.addEventListener('click', async () => {
      sound.playPop();
      const canvas = await ShareCardGenerator.generateCard();
      const modal = document.createElement('div');
      modal.className = 'neo-modal-overlay';
      modal.innerHTML = `
        <div class="neo-modal-card" style="max-width:640px;">
          <h3 style="font-family:var(--font-display); font-size:22px; font-weight:1000; margin-bottom:12px;">
            🎉 Kartu Prestasi Dokter Cilik
          </h3>
          <img src="${canvas.toDataURL('image/png')}" alt="Kartu Dokter Cilik" style="width:100%; border:2px solid var(--ink-line); border-radius:12px; margin-bottom:16px;">
          <div style="display:flex; gap:12px; justify-content:center;">
            <a href="${canvas.toDataURL('image/png')}" download="kartu-dokter-cilik.png" class="btn-neo-primary btn-sm" style="text-decoration:none;">
              💾 Simpan Gambar
            </a>
            <button id="btn-close-share-modal" class="btn-neo-secondary btn-sm" type="button">Tutup</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
      modal.querySelector('#btn-close-share-modal')?.addEventListener('click', () => modal.remove());
    });
  }

  private updateAudioIcons() {
    const sSlot = document.getElementById('icon-sound-slot');
    if (sSlot) {
      sSlot.innerHTML = getIcon(sound.isSoundEnabled() ? 'sound' : 'soundOff', 18);
    }
    const bgmSlot = document.getElementById('icon-bgm-slot');
    if (bgmSlot) {
      bgmSlot.innerHTML = getIcon(sound.isBgmEnabled() ? 'music' : 'musicOff', 18);
    }
    const vipLabel = document.getElementById('vip-status-label');
    if (vipLabel) {
      vipLabel.textContent = commercial.hasVipAccess() ? '👑 VIP Aktif' : 'Akses VIP';
    }
  }

  public openVipModal() {
    const modal = document.createElement('div');
    modal.className = 'neo-modal-overlay';
    modal.innerHTML = `
      <div class="neo-modal-card">
        <div style="font-size:42px; margin-bottom:8px;">👑</div>
        <h2 style="font-family:var(--font-display); font-size:26px; font-weight:1000; margin-bottom:8px;">
          Akses Penuh VIP Dokter Spesialis
        </h2>
        <p style="font-size:14px; font-weight:700; color:#475569; margin-bottom:18px;">
          Buka seluruh misi Tingkat 3, 4, 5 (Bedah Akurat, Otak & Imun, Rangka 206 Tulang), seluruh lembar kerja cetak, serta fitur laboratorium tak terbatas!
        </p>

        <div style="background:#f8fafc; border:2px solid var(--ink-line); border-radius:14px; padding:16px; margin-bottom:16px; text-align:left;">
          <label style="font-size:12px; font-weight:900; color:#0f172a; display:block; margin-bottom:6px;">Masukkan Kode Aktivasi / Lisensi:</label>
          <input type="text" id="input-vip-code" placeholder="Contoh: ANATOMI-VIP-2026" style="width:100%; padding:10px 12px; border:2px solid var(--ink-line); border-radius:8px; font-family:var(--font-display); font-weight:900; font-size:14px; text-transform:uppercase; margin-bottom:8px;">
          <small style="color:#64748b; font-size:11px; font-weight:700;">💡 Kode aktivasi uji coba: <strong>ANATOMI-VIP-2026</strong> atau <strong>DOKTER-INDONESIA</strong></small>
        </div>

        <div style="display:flex; gap:10px; justify-content:center;">
          <button id="btn-submit-code" class="btn-neo-primary" type="button">Aktifkan Lisensi ⭐</button>
          <button id="btn-close-vip" class="btn-neo-secondary" type="button">Tutup</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const submitBtn = modal.querySelector('#btn-submit-code');
    const input = modal.querySelector('#input-vip-code') as HTMLInputElement;

    submitBtn?.addEventListener('click', () => {
      const code = input.value;
      const res = commercial.activateWithCode(code);
      if (res.success) {
        sound.playFanfare();
        confetti.burst(100);
        alert(res.message);
        modal.remove();
        this.updateAudioIcons();
        this.renderCurriculumLevels();
      } else {
        sound.playWrong();
        alert(res.message);
      }
    });

    modal.querySelector('#btn-close-vip')?.addEventListener('click', () => {
      sound.playPop();
      modal.remove();
    });
  }

  private openProfileEditorModal() {
    const profile = leaderboard.getProfile();
    const modal = document.createElement('div');
    modal.className = 'neo-modal-overlay';
    modal.innerHTML = `
      <div class="neo-modal-card">
        <div style="font-size:42px; margin-bottom:8px;">🩺</div>
        <h2 style="font-family:var(--font-display); font-size:24px; font-weight:1000; margin-bottom:8px;">
          Edit Profil Dokter Cilik
        </h2>
        <div style="text-align:left; margin-bottom:16px;">
          <label style="font-size:12px; font-weight:900; display:block; margin-bottom:4px;">Nama Lengkap Siswa:</label>
          <input type="text" id="input-edit-name" value="${profile.name}" style="width:100%; padding:10px 12px; border:2px solid var(--ink-line); border-radius:8px; font-family:var(--font-body); font-weight:800; font-size:14px; margin-bottom:12px;">
          
          <label style="font-size:12px; font-weight:900; display:block; margin-bottom:4px;">Kota Asal / Sekolah:</label>
          <input type="text" id="input-edit-city" value="${profile.city}" style="width:100%; padding:10px 12px; border:2px solid var(--ink-line); border-radius:8px; font-family:var(--font-body); font-weight:800; font-size:14px;">
        </div>

        <div style="display:flex; gap:10px; justify-content:center;">
          <button id="btn-save-profile" class="btn-neo-primary" type="button">Simpan Profil 💾</button>
          <button id="btn-cancel-profile" class="btn-neo-secondary" type="button">Batal</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('#btn-save-profile')?.addEventListener('click', () => {
      const name = (modal.querySelector('#input-edit-name') as HTMLInputElement).value;
      const city = (modal.querySelector('#input-edit-city') as HTMLInputElement).value;
      leaderboard.setPlayerName(name, city);
      sound.playPop();
      modal.remove();
      this.renderPlayerProfilePill();
    });

    modal.querySelector('#btn-cancel-profile')?.addEventListener('click', () => {
      modal.remove();
    });
  }

  private setupPWAAndWakeLock() {
    if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
    if ('wakeLock' in navigator) {
      document.addEventListener('visibilitychange', async () => {
        if (document.visibilityState === 'visible') {
          try {
            await (navigator as unknown as { wakeLock: { request: (type: string) => Promise<unknown> } }).wakeLock.request('screen');
          } catch {
            // Ignore if wake lock denied
          }
        }
      });
    }
  }
}

// Instantiate on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
