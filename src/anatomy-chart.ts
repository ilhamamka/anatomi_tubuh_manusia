// Bagan Format Atlas Anatomi Tubuh Manusia Interaktif
// Elevated with Interactive 4-Layer Body Peeler, Comic Poke Reactions, Feed Simulation & Interactive Stethoscope
// 100% offline, zero external dependencies, responsive neo-brutalist kid-friendly design

import { ORGANS, type OrganInfo } from './organs-data';
import { sound } from './audio';

export interface BodyLayerConfig {
  id: string;
  name: string;
  icon: string;
  badgeTitle: string;
  bgImage: string;
  description: string;
  touchpoints: Array<{
    id: string;
    label: string;
    top: number;
    left: number;
    expression: string;
    sfx: 'giggle' | 'pop' | 'snap' | 'chime' | 'heartbeat' | 'breath' | 'digestive' | 'neural';
    speech: string;
  }>;
}

export const BODY_LAYERS: BodyLayerConfig[] = [
  {
    id: 'kulit',
    name: 'Kulit & Sensori',
    icon: '🖐️',
    badgeTitle: 'LAPISAN 1: EPIDERMIS & RESEPTOR INDERA',
    bgImage: '/assets/realistic_sensory_3d.png',
    description: 'Kulit melindungi seluruh tubuh dari kuman dan memiliki jutaan saraf peraba yang peka terhadap sentuhan dan suhu!',
    touchpoints: [
      { id: 'mata', label: '👀 Mata', top: 13, left: 45, expression: '😉', sfx: 'pop', speech: 'Kedip-kedip! Matamu berkedip 20.000 kali sehari agar tetap basah dan jernih!' },
      { id: 'telinga', label: '👂 Telinga', top: 15, left: 56, expression: '🎧', sfx: 'chime', speech: 'Telingamu menangkap gelombang suara merdu lewat getaran gendang telinga!' },
      { id: 'ketiak', label: '😂 Ketiak Geli', top: 29, left: 62, expression: '🤣', sfx: 'giggle', speech: 'Hahaha geliii! Ketiak punya banyak ujung saraf yang sangat peka sentuhan!' },
      { id: 'perut_kulit', label: '🖐️ Kulit Perut', top: 43, left: 50, expression: '😄', sfx: 'pop', speech: 'Kulit perutmu sangat lentur dan melindungi organ di dalamnya dengan aman!' }
    ]
  },
  {
    id: 'otot',
    name: 'Otot & Sirkulasi',
    icon: '💪',
    badgeTitle: 'LAPISAN 2: SISTEM OTOT & PEMBULUH DARAH',
    bgImage: '/assets/realistic_blood_3d.png',
    description: 'Lebih dari 600 otot menggerakkan tubuhmu, dialiri darah merah kaya oksigen melalui pembuluh darah!',
    touchpoints: [
      { id: 'bisep', label: '💪 Otot Bisep', top: 31, left: 34, expression: '💪', sfx: 'pop', speech: 'Kuat! Otot bisep berkontraksi saat kamu mengangkat buku atau melipat lengan!' },
      { id: 'darah_arteri', label: '🩸 Jalur Darah Merah', top: 36, left: 52, expression: '⚡', sfx: 'neural', speech: 'Wuush! Pembuluh darah mengalirkan sari makanan dan oksigen ke seluruh sel tubuh!' },
      { id: 'otot_jantung', label: '💓 Otot Jantung', top: 29, left: 49, expression: '💓', sfx: 'heartbeat', speech: 'Otot jantung memompa darah berirama tanpa pernah lelah seumur hidupmu!' }
    ]
  },
  {
    id: 'rangka',
    name: 'Rangka Tulang',
    icon: '🦴',
    badgeTitle: 'LAPISAN 3: 206 TULANG PELINDUNG',
    bgImage: '/assets/realistic_skeleton_3d.png',
    description: 'Benteng kokoh 206 tulang yang menopang tubuh tegak, tempat melekatnya otot, dan pelindung organ vital!',
    touchpoints: [
      { id: 'tengkorak', label: '💀 Helm Tengkorak', top: 12, left: 50, expression: '🧠', sfx: 'snap', speech: 'Krak! Tulang tengkorak seperti helm baja yang melindungi otak jeniusmu!' },
      { id: 'rusuk', label: '🦴 Sangkar Rusuk', top: 28, left: 50, expression: '🛡️', sfx: 'snap', speech: '12 pasang tulang rusuk membentuk sangkar kokoh menjaga jantung dan paru-paru!' },
      { id: 'femur', label: '🦴 Tulang Paha (Femur)', top: 64, left: 46, expression: '🏃', sfx: 'snap', speech: 'Tulang paha femur adalah tulang terpanjang dan terkuat untuk melompat tinggi!' }
    ]
  },
  {
    id: 'organ',
    name: 'Organ Dalam',
    icon: '🫀',
    badgeTitle: 'LAPISAN 4: PUSAT MESIN ORGAN VITAL',
    bgImage: '/assets/assembly_mannequin_table.png',
    description: 'Mesin utama kehidupan manusia: otak pengendali, jantung pemompa, paru penyerap oksigen, dan lambung pencerna makanan!',
    touchpoints: [
      { id: 'otak', label: '🧠 Otak Pusat', top: 11, left: 50, expression: '💡', sfx: 'neural', speech: 'Bzzzt! 86 miliar neuron otak bekerja memproses ide, ingatan, dan gerakanmu!' },
      { id: 'jantung', label: '🫀 Pompa Jantung', top: 28, left: 52, expression: '💓', sfx: 'heartbeat', speech: 'Lub-dub! Jantung memompa 5 liter darah beroksigen setiap menit tanpa henti!' },
      { id: 'paru', label: '🫁 Paru-paru', top: 25, left: 46, expression: '🌬️', sfx: 'breath', speech: 'Tarik napas dalam! Paru-paru menyerap oksigen bersih O2 dan membuang CO2!' },
      { id: 'lambung', label: '🥣 Kuali Lambung', top: 38, left: 54, expression: '😋', sfx: 'digestive', speech: 'Kruuuk! Asam lambung melumatkan makanan menjadi bubur halus kimus!' }
    ]
  }
];

export class AnatomyChartManager {
  private container: HTMLElement;
  private currentFilter: string = 'all';
  private currentLayerIndex: number = 3; // Default Organ Dalam
  private stethoscopeActive: boolean = false;
  private mannequinExpression: string = '😊';
  private comicBubbleText: string = 'Hai Dokter Cilik! Geser lapisan tubuhku atau colek titik mana pun untuk mendengar ceritaku!';
  private feedingFood: { emoji: string; name: string } | null = null;
  private feedingTopPercent: number = 14;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  public render(filter: string = 'all') {
    this.currentFilter = filter;
    const organList = Object.values(ORGANS);
    const filtered = this.currentFilter === 'all' 
      ? organList 
      : organList.filter(o => o.system === this.currentFilter);

    const activeLayer = BODY_LAYERS[this.currentLayerIndex];

    this.container.innerHTML = `
      <div class="chart-view-wrapper">
        
        <!-- SECTION 1: INTERACTIVE BODY LAYER PEELER & DOCTOR SIMULATOR -->
        <div class="layer-peeler-card">
          <div class="peeler-header">
            <div class="peeler-title-badge">
              <span class="pulse-dot"></span> LABORATORIUM PENGUPAS LAPISAN TUBUH
            </div>
            <h3 class="peeler-title">🔬 Eksplorasi 4 Lapisan Ajaib Tubuh Manusia</h3>
            <p class="peeler-subtitle">
              Pilih lapisan di bawah, geser slider, lalu colek bagian tubuh untuk melihat reaksi lucu dan mendengar suaranya!
            </p>
          </div>

          <!-- 4 Big Layer Visual Tabs -->
          <div class="peeler-tabs-row" role="tablist">
            ${BODY_LAYERS.map((layer, idx) => `
              <button class="peeler-tab-btn ${this.currentLayerIndex === idx ? 'active' : ''}" data-layer-index="${idx}" type="button">
                <span style="font-size:22px;">${layer.icon}</span>
                <span>${layer.name}</span>
              </button>
            `).join('')}
          </div>

          <!-- Smooth Layer Slider -->
          <div class="peeler-slider-container">
            <span class="slider-end-label">🖐️ Kulit</span>
            <input type="range" id="input-layer-slider" min="0" max="3" step="1" value="${this.currentLayerIndex}" class="peeler-slider-range" aria-label="Slider Lapisan Tubuh" />
            <span class="slider-end-label">🫀 Organ Dalam</span>
          </div>

          <!-- Main Stage: Mannequin + Touchpoints + Comic Bubble + Tools Sidebar -->
          <div class="peeler-stage-grid">
            
            <!-- Left: Interactive Mannequin Display Box -->
            <div class="peeler-mannequin-box">
              <img src="${activeLayer.bgImage}" alt="${activeLayer.name}" class="peeler-layer-image" />
              
              <!-- Reactive Mannequin Expression Face -->
              <div class="mannequin-face-bubble" title="Ekspresi Manekin">
                ${this.mannequinExpression}
              </div>

              <!-- Animated Food Ingestion Particle (When feeding) -->
              ${this.feedingFood ? `
                <div class="feeding-particle" style="top: ${this.feedingTopPercent}%;">
                  ${this.feedingFood.emoji}
                </div>
              ` : ''}

              <!-- Layer Interactive Poke Touchpoints -->
              ${activeLayer.touchpoints.map(pt => `
                <button class="peeler-touchpoint" 
                        data-poke-id="${pt.id}" 
                        style="top: ${pt.top}%; left: ${pt.left}%;" 
                        title="${pt.label} (Sentuh aku!)" 
                        type="button">
                  ✨
                </button>
              `).join('')}

              <!-- Stethoscope Heart & Lung Targets (When Stethoscope is Active) -->
              ${this.stethoscopeActive ? `
                <button id="btn-steth-heart" 
                        class="peeler-touchpoint" 
                        style="top: 28%; left: 52%; width: 50px; height: 50px; background: #fee2e2; border-color: #ef4444; font-size: 24px; animation: pulseCard 1s infinite;" 
                        title="Dengarkan Detak Jantung di sini!" 
                        type="button">
                  🩺
                </button>
                <button id="btn-steth-lungs" 
                        class="peeler-touchpoint" 
                        style="top: 25%; left: 45%; width: 44px; height: 44px; background: #e0f2fe; border-color: #0284c7; font-size: 20px; animation: floatSubtle 2s infinite ease-in-out;" 
                        title="Dengarkan Suara Napas di sini!" 
                        type="button">
                  🌬️
                </button>
              ` : ''}
            </div>

            <!-- Right: Comic Speech Bubble & Interactive Play Tools -->
            <div class="peeler-tools-sidebar">
              
              <!-- Comic Speech Bubble -->
              <div class="comic-speech-bubble">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                  <span style="font-size:11px; font-weight:900; color:#0284c7; text-transform:uppercase;">
                    💬 Kata Manekin Dokter Cilik:
                  </span>
                  <button id="btn-repeat-comic-speech" class="btn-neo-accent" style="padding:4px 8px; font-size:11px;" type="button" title="Ulangi Suara">
                    🔊 Baca Suara
                  </button>
                </div>
                <p class="comic-bubble-text">"${this.comicBubbleText}"</p>
              </div>

              <!-- Tool Card 1: Feed the Body (Beri Makan & Minum) -->
              <div class="tool-action-card">
                <h4 class="tool-card-title">
                  <span>🍽️</span> Beri Makan & Minum Manekin
                </h4>
                <p style="font-size:12px; font-weight:700; color:#64748b; margin:0 0 10px;">
                  Pilih camilan sehat untuk melihat jalannya makanan masuk ke lambung!
                </p>
                <div class="food-btns-grid">
                  <button class="food-choice-btn" data-feed-type="apple" type="button">
                    <span class="food-emoji">🍎</span>
                    <span>Apel Renyah</span>
                  </button>
                  <button class="food-choice-btn" data-feed-type="broccoli" type="button">
                    <span class="food-emoji">🥦</span>
                    <span>Brokoli Segar</span>
                  </button>
                  <button class="food-choice-btn" data-feed-type="water" type="button">
                    <span class="food-emoji">💧</span>
                    <span>Air Mineral</span>
                  </button>
                </div>
              </div>

              <!-- Tool Card 2: Interactive Stethoscope -->
              <div class="tool-action-card">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <h4 class="tool-card-title" style="margin:0;">
                    <span>🩺</span> Stetoskop Dokter Cilik
                  </h4>
                  <button id="btn-toggle-stethoscope" class="btn-neo-primary" style="padding:6px 14px; font-size:12px;" type="button">
                    ${this.stethoscopeActive ? 'Matikan ❌' : 'Tempelkan 🩺'}
                  </button>
                </div>
                <p style="font-size:12px; font-weight:700; color:#64748b; margin:8px 0 0;">
                  ${this.stethoscopeActive 
                    ? 'Ketuk ikon stetoskop 🩺 di dada kiri (jantung) atau 🌬️ di dada kanan (paru-paru)!' 
                    : 'Aktifkan stetoskop untuk mendengarkan denyut jantung & hembusan napas!'}
                </p>
                ${this.stethoscopeActive ? `
                  <div class="stethoscope-pulse-badge">
                    <span style="font-size:20px;">💓</span>
                    <div>
                      <strong>Stetoskop Aktif: 75 BPM</strong>
                      <div style="font-size:11px; opacity:0.9;">Detak jantung teratur (Lub-Dub)</div>
                    </div>
                  </div>
                ` : ''}
              </div>

            </div>

          </div>
        </div>

        <!-- SECTION 2: BAGAN ATLAS LENGKAP ORGAN & DATA KLINIS -->
        <div class="chart-header-card">
          <div class="chart-title-col">
            <h2 class="chart-title">📊 Bagan Atlas Lengkap Seluruh Organ</h2>
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
                <button class="btn-atlas-audio" data-sound-organ="${organ.id}" title="Dengarkan Cerita Ceria Organ" type="button">
                  📖 Cerita
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

                <button class="btn-card-narrate" data-sound-organ="${organ.id}" type="button" style="width:100%; margin-top:12px;">
                  📖 Dengarkan Cerita Ceria: ${organ.funTitle}
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

  private switchLayer(newIndex: number) {
    if (newIndex < 0 || newIndex >= BODY_LAYERS.length) return;
    this.currentLayerIndex = newIndex;
    const layer = BODY_LAYERS[this.currentLayerIndex];
    sound.playPop();
    sound.playExcitedChime();
    this.mannequinExpression = '😮';
    this.comicBubbleText = `Waaah! Sekarang kita melihat ${layer.name}! ${layer.description}`;
    this.render(this.currentFilter);
    sound.playNaturalSpeech(this.comicBubbleText);
  }

  private handleFeed(type: 'apple' | 'broccoli' | 'water') {
    const foodMap = {
      apple: { emoji: '🍎', name: 'Apel Renyah', text: 'Nyam nyam kriuk! Apel kaya serat membuat lambung dan ususmu sehat bertenaga!' },
      broccoli: { emoji: '🥦', name: 'Brokoli Segar', text: 'Kriuk kriuk! Sayuran hijau memberi kalsium dan vitamin hebat untuk tulang dan gigimu!' },
      water: { emoji: '💧', name: 'Air Mineral Segar', text: 'Gluk gluk gluk! Air segar membuat sel tubuh segar dan ginjal bersih!' }
    };
    const choice = foodMap[type];

    sound.playPop();
    if (type === 'water') {
      sound.playGulp();
    } else {
      sound.playCrunch();
    }

    this.mannequinExpression = '😋';
    this.feedingFood = { emoji: choice.emoji, name: choice.name };
    this.feedingTopPercent = 14;
    this.comicBubbleText = choice.text;
    this.render(this.currentFilter);
    sound.playNaturalSpeech(choice.text);

    // Animate swallowing down into stomach
    setTimeout(() => {
      this.feedingTopPercent = 38;
      const particle = this.container.querySelector('.feeding-particle') as HTMLElement;
      if (particle) {
        particle.style.top = '38%';
      }
      setTimeout(() => {
        sound.playDigestive();
        this.feedingFood = null;
        this.render(this.currentFilter);
      }, 950);
    }, 100);
  }

  private bindEvents() {
    // 1. Layer Tabs
    this.container.querySelectorAll('[data-layer-index]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-layer-index') || '0', 10);
        this.switchLayer(idx);
      });
    });

    // 2. Layer Slider
    const slider = this.container.querySelector('#input-layer-slider') as HTMLInputElement;
    slider?.addEventListener('change', () => {
      const idx = parseInt(slider.value, 10);
      this.switchLayer(idx);
    });

    // 3. Repeat Comic Speech Audio
    this.container.querySelector('#btn-repeat-comic-speech')?.addEventListener('click', () => {
      sound.playPop();
      sound.playNaturalSpeech(this.comicBubbleText);
    });

    // 4. Poke Touchpoints
    const activeLayer = BODY_LAYERS[this.currentLayerIndex];
    this.container.querySelectorAll('[data-poke-id]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const ptId = btn.getAttribute('data-poke-id');
        const pt = activeLayer.touchpoints.find(t => t.id === ptId);
        if (!pt) return;

        // Play SFX
        switch (pt.sfx) {
          case 'giggle':
            sound.playGiggle();
            break;
          case 'snap':
            sound.playBoneSnap();
            break;
          case 'heartbeat':
            sound.playHeartbeat(80);
            break;
          case 'breath':
            sound.playBreath();
            break;
          case 'digestive':
            sound.playDigestive();
            break;
          case 'neural':
            sound.playNeural();
            break;
          case 'chime':
            sound.playExcitedChime();
            break;
          default:
            sound.playPop();
            break;
        }

        this.mannequinExpression = pt.expression;
        this.comicBubbleText = pt.speech;
        this.render(this.currentFilter);
        sound.playNaturalSpeech(pt.speech);
      });
    });

    // 5. Feeding Choices
    this.container.querySelectorAll('[data-feed-type]').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.getAttribute('data-feed-type') as 'apple' | 'broccoli' | 'water';
        if (type) this.handleFeed(type);
      });
    });

    // 6. Stethoscope Toggle & Targets
    this.container.querySelector('#btn-toggle-stethoscope')?.addEventListener('click', () => {
      sound.playPop();
      this.stethoscopeActive = !this.stethoscopeActive;
      if (this.stethoscopeActive) {
        sound.playExcitedChime();
        this.comicBubbleText = 'Stetoskop aktif! Sentuh dada kiri untuk mendengar jantung (lub-dub) atau dada kanan untuk napas paru-paru!';
      } else {
        this.comicBubbleText = 'Stetoskop disimpan kembali ke saku jas dokter.';
      }
      this.render(this.currentFilter);
      sound.playNaturalSpeech(this.comicBubbleText);
    });

    this.container.querySelector('#btn-steth-heart')?.addEventListener('click', (e) => {
      e.stopPropagation();
      sound.playHeartbeat(75);
      this.mannequinExpression = '💓';
      this.comicBubbleText = 'Lub-dub! Lub-dub! Detak jantung berdenyut 75 BPM, memompa darah beroksigen dengan irama yang sangat sehat!';
      this.render(this.currentFilter);
      sound.playNaturalSpeech(this.comicBubbleText);
    });

    this.container.querySelector('#btn-steth-lungs')?.addEventListener('click', (e) => {
      e.stopPropagation();
      sound.playBreath();
      this.mannequinExpression = '🌬️';
      this.comicBubbleText = 'Fyuuuh... Suara hembusan napas terdengar bersih dan lancar di saluran pernapasan paru-paru!';
      this.render(this.currentFilter);
      sound.playNaturalSpeech(this.comicBubbleText);
    });

    // 7. Standard Atlas Organ Filter Tabs
    const tabs = this.container.querySelectorAll('.filter-pill');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const filter = tab.getAttribute('data-filter') || 'all';
        sound.playPop();
        sound.stopSpeaking();
        this.render(filter);
      });
    });

    // 8. Organ Story Buttons
    const audioBtns = this.container.querySelectorAll('[data-sound-organ]');
    audioBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-sound-organ');
        if (!id) return;
        const organ = ORGANS[id];
        if (!organ) return;

        this.playOrganAcoustic(organ);
        sound.speakStory(organ.story, `${organ.name} (${organ.funTitle})`, organ.id);
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
