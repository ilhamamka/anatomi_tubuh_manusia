// Main Application Orchestrator & State Manager for Anatomi Tubuh Manusia

import './style.css';
import { sound } from './audio';
import { confetti } from './confetti';
import { leaderboard } from './leaderboard';
import { commercial, COMMERCIAL_PLANS } from './commercial';
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
import { QuizManager } from './questions-engine';
import { PhysiologyFlowSimulator } from './physiology-flow';
import { CurriculumQuestRunner } from './curriculum-quest';

class App {
  private currentScreen: string = 'screen-home';
  private assemblyGame!: OrganAssemblyGame;
  private scannerGame!: BodyScannerGame;
  private clinicGame!: ClinicGame;
  private chartManager!: AnatomyChartManager;
  private sandboxManager!: SandboxManager;
  private guideRenderer!: ParentGuideRenderer;
  private worksheetGen!: WorksheetGenerator;
  private quizManager!: QuizManager;
  private flowSimulator!: PhysiologyFlowSimulator;

  public init() {
    this.renderBrandAndIcons();
    this.initEngines();
    this.renderHeroMascots();
    this.renderCurriculumLevels();
    this.renderPlayerProfilePill();
    this.bindGlobalEvents();
    this.updateAudioIcons();
    this.setupPWAAndWakeLock();
    this.setupHashRouting();
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

    const quizRoot = document.getElementById('quiz-root')!;
    const flowRoot = document.getElementById('flow-root')!;

    this.chartManager = new AnatomyChartManager(chartRoot);
    this.sandboxManager = new SandboxManager(sandboxRoot);
    this.guideRenderer = new ParentGuideRenderer(guideRoot);
    this.worksheetGen = new WorksheetGenerator(worksheetsRoot);
    this.quizManager = new QuizManager(quizRoot);
    this.flowSimulator = new PhysiologyFlowSimulator(flowRoot);
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
      <div style="background:#ffffff; border:2px solid var(--ink-line); border-radius:var(--radius-pill); padding:6px 14px; display:flex; align-items:center; gap:8px; box-shadow:var(--shadow-sm); cursor:pointer;">
        <span style="font-size:18px;">${profile.avatar}</span>
        <div style="line-height:1.2;">
          <strong style="font-size:13px; display:block; color:var(--ink-line);">${profile.name}</strong>
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
    const runner = new CurriculumQuestRunner(levelId, {
      onComplete: (_lvlId, _xp, _stars) => {
        this.renderPlayerProfilePill();
        this.renderCurriculumLevels();
      },
      onExit: () => {
        this.renderPlayerProfilePill();
        this.renderCurriculumLevels();
      },
      onGoToWorksheets: () => {
        this.switchScreen('screen-worksheets');
      }
    });
    runner.start();
  }

  public switchScreen(screenId: string, updateHash = true) {
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
    if (screenId !== 'screen-flow') {
      this.flowSimulator?.destroy();
    }
    if (screenId !== 'screen-quiz') {
      this.quizManager?.destroy();
    }

    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(screenId);
    if (target) {
      target.classList.add('active');
      this.currentScreen = screenId;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (updateHash) {
      const hashName = screenId.replace('screen-', '');
      try {
        history.replaceState(null, '', `#${hashName}`);
      } catch {
        // Fallback for strict sandbox iframe environments
      }
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
    } else if (screenId === 'screen-quiz') {
      this.quizManager.render();
    } else if (screenId === 'screen-flow') {
      this.flowSimulator.render();
    } else if (screenId === 'screen-home') {
      this.renderPlayerProfilePill();
      this.renderCurriculumLevels();
    }
  }

  private setupHashRouting() {
    window.addEventListener('hashchange', () => this.handleHashRoute());
    if (window.location.hash) {
      this.handleHashRoute();
    }
  }

  private handleHashRoute() {
    const raw = (window.location.hash || '').replace('#', '').trim();
    if (!raw) return;

    if (raw === 'assembly') {
      this.switchScreen('screen-assembly', false);
      this.assemblyGame.startLevel();
    } else if (raw === 'scanner') {
      this.switchScreen('screen-scanner', false);
      this.scannerGame.start();
    } else if (raw === 'clinic') {
      this.switchScreen('screen-clinic', false);
      this.clinicGame.start();
    } else if (raw === 'chart') {
      this.switchScreen('screen-chart', false);
    } else if (raw === 'sandbox') {
      this.switchScreen('screen-sandbox', false);
    } else if (raw === 'guide') {
      this.switchScreen('screen-guide', false);
    } else if (raw === 'leaderboard') {
      this.switchScreen('screen-leaderboard', false);
    } else if (raw === 'worksheets') {
      this.switchScreen('screen-worksheets', false);
    } else if (raw === 'quiz') {
      this.switchScreen('screen-quiz', false);
    } else if (raw === 'flow') {
      this.switchScreen('screen-flow', false);
    } else if (raw === 'home') {
      this.switchScreen('screen-home', false);
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
    // One-time gesture audio unlocker for mobile/desktop browsers
    const unlock = () => {
      sound.unlockAudio();
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });

    // Navigation items
    document.getElementById('btn-nav-home')?.addEventListener('click', () => {
      sound.playPop();
      this.switchScreen('screen-home');
    });

    document.getElementById('btn-nav-chart')?.addEventListener('click', () => {
      sound.playPop();
      this.switchScreen('screen-chart');
    });

    document.getElementById('btn-nav-flow')?.addEventListener('click', () => {
      sound.playPop();
      this.switchScreen('screen-flow');
    });

    document.getElementById('btn-nav-quiz')?.addEventListener('click', () => {
      sound.playPop();
      this.switchScreen('screen-quiz');
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

    document.getElementById('card-mode-flow')?.addEventListener('click', () => {
      sound.playPop();
      this.switchScreen('screen-flow');
    });

    document.getElementById('card-mode-quiz')?.addEventListener('click', () => {
      sound.playPop();
      this.switchScreen('screen-quiz');
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
    const profile = leaderboard.getProfile();
    const challenge = commercial.generateParentalChallenge();
    let isParentUnlocked = false;

    const modal = document.createElement('div');
    modal.className = 'neo-modal-overlay';

    const renderModalContent = () => {
      const currentLimit = commercial.getScreenTimeLimit();

      modal.innerHTML = `
        <div class="neo-modal-card commercial-checkout-modal" style="max-width:860px; max-height:92vh; overflow-y:auto; text-align:left;">
          <!-- Top Header -->
          <div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom:2px solid var(--ink-line); padding-bottom:14px; margin-bottom:16px;">
            <div>
              <span style="font-size:11px; font-weight:900; background:#fef3c7; color:#b45309; padding:4px 10px; border-radius:999px; border:2px solid var(--ink-line); display:inline-block; margin-bottom:6px;">👑 LISENSI RESMI & UPGRADE VIP</span>
              <h2 style="font-family:var(--font-display); font-size:24px; font-weight:1000; margin:4px 0;">
                Akses Penuh Seluruh Laboratorium Anatomi & Kuis Medis
              </h2>
              <p style="font-size:13px; font-weight:700; color:#64748b; margin:0;">
                Buka seluruh 5 Tingkat Misi Bedah Organ, Bank Soal Kurikulum Merdeka, Simulator Fisiologi, & Lembar Kerja Cetak A4.
              </p>
            </div>
            <button id="btn-close-vip-x" class="btn-neo-secondary btn-sm" type="button" style="padding:4px 10px; font-size:16px;">✕</button>
          </div>

          <!-- Parental Gate Check -->
          ${!isParentUnlocked ? `
            <div class="parental-gate-card" style="background:#fffbeb; border:2px dashed #f59e0b; border-radius:12px; padding:14px 18px; margin-bottom:20px;">
              <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
                <span style="font-size:24px;">🔒</span>
                <div>
                  <strong style="font-size:14px; color:#92400e; display:block;">Pintu Pengaman Orang Tua & Guru (Parental Gate)</strong>
                  <span style="font-size:12px; color:#78350f;">Mohon selesaikan perhitungan berikut sebelum memesan lisensi atau mengatur batas waktu:</span>
                </div>
              </div>
              <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
                <label style="font-weight:900; font-size:15px; color:#1e293b;">${challenge.question}</label>
                <input type="number" id="input-parental-answer" placeholder="Jawaban" style="width:100px; padding:6px 10px; border:2px solid var(--ink-line); border-radius:8px; font-weight:900; font-size:15px; text-align:center;">
                <button id="btn-verify-parent" class="btn-neo-primary btn-sm" type="button">Buka Akses Orang Tua 🔓</button>
              </div>
              <p id="parental-error-msg" style="color:#e11d48; font-size:12px; font-weight:800; margin:6px 0 0; display:none;">
                Jawaban belum tepat, silakan coba lagi ya Ayah/Bunda/Guru!
              </p>
            </div>
          ` : `
            <div style="background:#f0fdf4; border:2px solid #22c55e; border-radius:10px; padding:8px 14px; margin-bottom:18px; display:flex; align-items:center; gap:8px;">
              <span style="font-size:18px;">✅</span>
              <span style="font-size:12px; font-weight:800; color:#15803d;">Verifikasi Orang Tua Berhasil. Menu Pembelian & Batas Waktu Terbuka.</span>
            </div>
          `}

          <!-- Pricing Packages Grid -->
          <div class="commercial-plans-grid" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:18px; margin-bottom:24px;">
            ${COMMERCIAL_PLANS.map(plan => `
              <div class="commercial-plan-card ${plan.isPopular ? 'popular-plan' : ''}" style="background:#ffffff; border:3px solid var(--ink-line); border-radius:14px; padding:18px; display:flex; flex-direction:column; justify-content:space-between; box-shadow:var(--shadow-sm); position:relative;">
                ${plan.isPopular ? `<span style="position:absolute; top:-12px; right:16px; background:#e11d48; color:#ffffff; font-size:11px; font-weight:900; padding:3px 10px; border-radius:999px; border:2px solid var(--ink-line);">⭐ PALING LARIS</span>` : ''}
                <div>
                  <span style="display:inline-block; font-size:11px; font-weight:900; background:#f1f5f9; color:#475569; padding:3px 8px; border-radius:6px; margin-bottom:6px;">${plan.badge}</span>
                  <h3 style="font-family:var(--font-display); font-size:18px; font-weight:900; margin:0 0 4px;">${plan.name}</h3>
                  <div style="margin-bottom:8px;">
                    <span style="text-decoration:line-through; color:#94a3b8; font-size:13px; font-weight:700;">${plan.originalPrice}</span>
                    <span style="background:#fee2e2; color:#b91c1c; font-size:11px; font-weight:900; padding:2px 6px; border-radius:4px; margin-left:6px;">${plan.discountBadge}</span>
                    <div style="font-size:26px; font-weight:1000; color:#e11d48; font-family:var(--font-display);">${plan.price}</div>
                  </div>
                  <p style="font-size:12px; font-weight:700; color:#64748b; margin-bottom:12px; border-bottom:1px dashed #cbd5e1; padding-bottom:8px;">${plan.targetAudience}</p>
                  
                  <ul style="margin:0 0 16px; padding-left:18px; font-size:12px; font-weight:700; color:#334155; line-height:1.5;">
                    ${plan.features.map(f => `<li style="margin-bottom:4px;">${f}</li>`).join('')}
                  </ul>
                </div>

                <div>
                  ${isParentUnlocked ? `
                    <a href="${commercial.getWhatsAppOrderUrl(plan.id, profile.name)}" target="_blank" rel="noopener noreferrer" class="btn-neo-primary" style="display:block; text-align:center; text-decoration:none; padding:10px 14px; font-size:13px; background:#22c55e; border-color:var(--ink-line); color:#ffffff; margin-top:10px;">
                      💬 Pesan via WhatsApp Sekarang
                    </a>
                  ` : `
                    <button class="btn-neo-secondary btn-locked-plan" type="button" style="width:100%; font-size:12px; padding:8px 12px; margin-top:10px;" data-plan-id="${plan.id}">
                      🔒 Buka Pengaman untuk Pesan
                    </button>
                  `}
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Section: Screen Time Limiter (For Parents) -->
          <div style="background:#f8fafc; border:2px solid var(--ink-line); border-radius:12px; padding:14px 18px; margin-bottom:20px;">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
              <div>
                <h4 style="margin:0; font-size:14px; font-weight:900;">⏱️ Pembatas Waktu Layar Sehat (Screen Time)</h4>
                <p style="margin:2px 0 0; font-size:11px; color:#64748b; font-weight:700;">Batasi durasi anak bermain demi kesehatan mata dan kebiasaan digital yang seimbang.</p>
              </div>
              <div style="display:flex; align-items:center; gap:8px;">
                <select id="select-screen-limit" style="padding:6px 10px; border:2px solid var(--ink-line); border-radius:8px; font-weight:800; font-size:13px;" ${!isParentUnlocked ? 'disabled' : ''}>
                  <option value="0" ${currentLimit === 0 ? 'selected' : ''}>Tidak Dibatasi (Bebas)</option>
                  <option value="15" ${currentLimit === 15 ? 'selected' : ''}>15 Menit / Hari</option>
                  <option value="30" ${currentLimit === 30 ? 'selected' : ''}>30 Menit / Hari</option>
                  <option value="45" ${currentLimit === 45 ? 'selected' : ''}>45 Menit / Hari</option>
                  <option value="60" ${currentLimit === 60 ? 'selected' : ''}>60 Menit / Hari</option>
                </select>
                <button id="btn-save-limit" class="btn-neo-secondary btn-sm" type="button" ${!isParentUnlocked ? 'disabled' : ''}>Simpan 💾</button>
              </div>
            </div>
          </div>

          <!-- Section: License Code Activation -->
          <div style="background:#ffffff; border:2px solid var(--ink-line); border-radius:12px; padding:16px;">
            <label style="font-size:13px; font-weight:900; color:#0f172a; display:block; margin-bottom:6px;">Sudah Punya Kode Lisensi VIP?</label>
            <div style="display:flex; gap:10px; flex-wrap:wrap;">
              <input type="text" id="input-vip-code" placeholder="Contoh: ANATOMI-VIP-2026" style="flex:1; min-width:200px; padding:10px 12px; border:2px solid var(--ink-line); border-radius:8px; font-family:var(--font-display); font-weight:900; font-size:14px; text-transform:uppercase;">
              <button id="btn-submit-code" class="btn-neo-primary" type="button">Aktifkan Lisensi ⭐</button>
            </div>
            <small style="color:#64748b; font-size:11px; font-weight:700; display:block; margin-top:6px;">
              💡 Kode aktivasi uji coba: <strong>ANATOMI-VIP-2026</strong> atau <strong>DOKTER-INDONESIA</strong>
            </small>
          </div>
        </div>
      `;

      // Bind events inside modal
      modal.querySelector('#btn-close-vip-x')?.addEventListener('click', () => {
        sound.playPop();
        modal.remove();
      });

      modal.querySelector('#btn-verify-parent')?.addEventListener('click', () => {
        const input = modal.querySelector('#input-parental-answer') as HTMLInputElement;
        const ans = parseInt(input?.value || '0', 10);
        if (commercial.verifyParentalChallenge(ans)) {
          isParentUnlocked = true;
          sound.playPop();
          renderModalContent();
        } else {
          sound.playWrong();
          const err = modal.querySelector('#parental-error-msg') as HTMLElement;
          if (err) err.style.display = 'block';
        }
      });

      modal.querySelectorAll('.btn-locked-plan').forEach(btn => {
        btn.addEventListener('click', () => {
          const input = modal.querySelector('#input-parental-answer') as HTMLInputElement;
          input?.focus();
        });
      });

      modal.querySelector('#btn-save-limit')?.addEventListener('click', () => {
        const sel = modal.querySelector('#select-screen-limit') as HTMLSelectElement;
        const mins = parseInt(sel?.value || '0', 10);
        commercial.setScreenTimeLimit(mins);
        sound.playPop();
        alert(`Batas waktu berhasil disimpan: ${mins === 0 ? 'Tidak Dibatasi' : mins + ' Menit'}!`);
      });

      modal.querySelector('#btn-submit-code')?.addEventListener('click', () => {
        const codeInput = modal.querySelector('#input-vip-code') as HTMLInputElement;
        const code = codeInput?.value || '';
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
    };

    renderModalContent();
    document.body.appendChild(modal);
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
