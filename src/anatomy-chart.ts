// Bagan Format Atlas Anatomi Tubuh Manusia Interaktif
// Full interactive atlas for exploring all body systems, organs, and medical facts

import { ORGANS, type OrganInfo } from './organs-data';
import { sound } from './audio';

export class AnatomyChartManager {
  private container: HTMLElement;
  private currentFilter: string = 'all';

  constructor(container: HTMLElement) {
    this.container = container;
  }

  public render(filter: string = 'all') {
    this.currentFilter = filter;
    const organList = Object.values(ORGANS);

    const filtered = this.currentFilter === 'all' 
      ? organList 
      : organList.filter(o => o.system === this.currentFilter);

    this.container.innerHTML = `
      <div class="chart-view-wrapper">
        <div class="chart-header-card">
          <div class="chart-title-col">
            <h2 class="chart-title">📊 Bagan Atlas Lengkap Anatomi Tubuh</h2>
            <p class="chart-desc">Eksplorasi visual resolusi tinggi seluruh organ, sistem biologi, dan fakta ilmiah tubuh manusia.</p>
          </div>
          <div class="chart-stats-badge">
            Total Organ: <strong>${organList.length} Organ Terdata</strong>
          </div>
        </div>

        <!-- Filter Pill Tabs -->
        <div class="chart-filter-tabs" role="tablist">
          <button class="filter-pill ${this.currentFilter === 'all' ? 'active' : ''}" data-filter="all" type="button">
            Semua Organ (${organList.length})
          </button>
          <button class="filter-pill ${this.currentFilter === 'sirkulasi' ? 'active' : ''}" data-filter="sirkulasi" type="button">
            🫀 Jantung & Sirkulasi
          </button>
          <button class="filter-pill ${this.currentFilter === 'pernapasan' ? 'active' : ''}" data-filter="pernapasan" type="button">
            🫁 Pernapasan Paru
          </button>
          <button class="filter-pill ${this.currentFilter === 'pencernaan' ? 'active' : ''}" data-filter="pencernaan" type="button">
            🥣 Pencernaan Makanan
          </button>
          <button class="filter-pill ${this.currentFilter === 'saraf' ? 'active' : ''}" data-filter="saraf" type="button">
            🧠 Otak & Saraf
          </button>
          <button class="filter-pill ${this.currentFilter === 'gerak' ? 'active' : ''}" data-filter="gerak" type="button">
            🦴 Rangka & Tulang
          </button>
          <button class="filter-pill ${this.currentFilter === 'indera' ? 'active' : ''}" data-filter="indera" type="button">
            👁️ Panca Indera
          </button>
        </div>

        <!-- Grid of Organ Anatomy Cards -->
        <div class="chart-cards-grid">
          ${filtered.map(organ => `
            <div class="anatomy-atlas-card" style="border-top: 5px solid ${organ.primaryColor};" data-organ-id="${organ.id}">
              <div class="atlas-card-top">
                <span class="atlas-system-badge" style="background:${organ.primaryColor}15; color:${organ.secondaryColor};">
                  ${organ.systemName}
                </span>
                <button class="btn-atlas-audio" data-sound-organ="${organ.id}" title="Dengarkan Suara Organ" type="button">
                  🔊 Dengar
                </button>
              </div>

              <div class="atlas-preview-box">
                ${organ.realisticImage ? `
                  <div class="atlas-real-render-wrapper">
                    <img src="${organ.realisticImage}" alt="${organ.name}" class="atlas-real-img" />
                    <span class="atlas-3d-badge">3D MEDICAL RENDER</span>
                  </div>
                ` : `
                  ${organ.renderSVG(88, true)}
                `}
              </div>

              <div class="atlas-card-body">
                <h3 class="atlas-organ-title">${organ.name}</h3>
                <span class="atlas-latin-name">${organ.latinName}</span>

                ${organ.clinicalMetrics ? `
                  <div class="atlas-metrics-row">
                    ${Object.entries(organ.clinicalMetrics).map(([k, v]) => `
                      <div class="atlas-metric-chip">
                        <span>${k}:</span>
                        <strong>${v}</strong>
                      </div>
                    `).join('')}
                  </div>
                ` : ''}

                <p class="atlas-summary-text">${organ.summary}</p>
                
                <div class="atlas-fun-fact-box">
                  <strong>💡 Fakta Sains Medis:</strong>
                  <p>${organ.funFacts[0]}</p>
                </div>

                <div class="atlas-health-tip-box">
                  <strong>🥗 Rekomendasi Kesehatan:</strong>
                  <p>${organ.healthTips}</p>
                </div>

                <button class="btn-neo-accent btn-sm w-full btn-card-narrate" data-sound-organ="${organ.id}" type="button" style="width:100%; margin-top:12px; display:flex; align-items:center; justify-content:center; gap:8px;">
                  🔊 Dengarkan Penjelasan Suara Dokter
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    this.bindEvents();
  }

  public destroy() {
    sound.stopSpeaking();
  }

  private bindEvents() {
    const tabs = this.container.querySelectorAll('.filter-pill');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const filter = tab.getAttribute('data-filter') || 'all';
        sound.playPop();
        sound.stopSpeaking();
        this.render(filter);
      });
    });

    const audioBtns = this.container.querySelectorAll('[data-sound-organ]');
    audioBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-sound-organ');
        if (!id) return;
        const organ = ORGANS[id];
        if (!organ) return;

        this.playOrganAcoustic(organ);
        sound.speak(`Organ ${organ.name}. Nama Latin: ${organ.latinName}. ${organ.summary}. ${organ.description}. Fakta penting: ${organ.funFacts[0]}. Saran dokter: ${organ.healthTips}`);
      });
    });
  }

  private playOrganAcoustic(organ: OrganInfo) {
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
        sound.playPop(1.2);
        break;
    }
  }
}
