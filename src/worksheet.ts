// Lembar Kerja Belajar Cetak & Sertifikat Dokter Cilik Resmi (Printable A4 Worksheets)
// 100% Kurikulum Merdeka Compliant: Labeling, Mewarnai, Teka-Teki Silang & Raport Evaluasi

import { ORGANS } from './organs-data';
import { leaderboard } from './leaderboard';
import { sound } from './audio';

export class WorksheetGenerator {
  private container: HTMLElement;
  private currentTab: 'certificate' | 'labeling' | 'coloring' | 'crossword' | 'report' = 'certificate';

  constructor(container: HTMLElement) {
    this.container = container;
  }

  public render(tab: 'certificate' | 'labeling' | 'coloring' | 'crossword' | 'report' = 'certificate') {
    this.currentTab = tab;
    const profile = leaderboard.getProfile();

    this.container.innerHTML = `
      <div class="worksheet-view-wrapper">
        <div class="worksheet-header no-print">
          <div class="worksheet-title-col">
            <h2 class="worksheet-title">🖨️ Lembar Kerja Cetak & Sertifikat Resmi</h2>
            <p class="worksheet-desc">Cetak lembar aktivitas sains dan sertifikat dokter cilik langsung dari browsermu!</p>
          </div>
          <div class="worksheet-tabs">
            <button class="ws-tab-btn ${this.currentTab === 'certificate' ? 'active' : ''}" data-ws-tab="certificate" type="button">
              🎖️ Sertifikat Dokter Cilik
            </button>
            <button class="ws-tab-btn ${this.currentTab === 'labeling' ? 'active' : ''}" data-ws-tab="labeling" type="button">
              📝 Lembar Label Organ
            </button>
            <button class="ws-tab-btn ${this.currentTab === 'coloring' ? 'active' : ''}" data-ws-tab="coloring" type="button">
              🎨 Lembar Mewarnai Rangka
            </button>
            <button class="ws-tab-btn ${this.currentTab === 'crossword' ? 'active' : ''}" data-ws-tab="crossword" type="button">
              🧩 Teka-Teki Silang Sains
            </button>
            <button class="ws-tab-btn ${this.currentTab === 'report' ? 'active' : ''}" data-ws-tab="report" type="button">
              📊 Raport Hasil Belajar
            </button>
          </div>
          <button id="btn-print-page" class="btn-neo-primary" type="button">
            🖨️ Cetak Dokumen Ini (Print A4)
          </button>
        </div>

        <div class="print-document-stage" id="print-sheet-content">
          ${this.renderPrintContent(profile.name, profile.rankTitle, profile.xp, profile.stars)}
        </div>
      </div>
    `;

    this.bindEvents();
  }

  private renderPrintContent(playerName: string, rankTitle: string, xp: number, stars: number): string {
    const today = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    if (this.currentTab === 'certificate') {
      return `
        <!-- Printable Official Doctor Certificate -->
        <div class="print-sheet certificate-sheet">
          <div class="certificate-border-outer">
            <div class="certificate-border-inner">
              <div class="cert-header">
                <span class="cert-crest">🩺</span>
                <h1 class="cert-main-title">PIAGAM PENGHARGAAN DOKTER CILIK</h1>
                <span class="cert-subtitle">PROGRAM LITERASI SAINS BIOLOGI & ANATOMI INDONESIA</span>
              </div>

              <div class="cert-body">
                <p class="cert-statement">Diberikan dengan bangga dan rasa hormat kepada:</p>
                <div class="cert-recipient-box">
                  <h2 class="cert-recipient-name" contenteditable="true" title="Klik untuk mengubah nama">${playerName}</h2>
                </div>
                <p class="cert-reason">
                  Telah berhasil menyelesaikan rangkaian simulasi bedah rekonstruksi organ, eksplorasi radiologi tubuh, 
                  serta menguasai kurikulum literasi kesehatan biologi dengan predikat kehormatan:
                </p>
                <div class="cert-rank-award">
                  <span>🎖️ ${rankTitle} 🎖️</span>
                </div>
              </div>

              <div class="cert-footer">
                <div class="cert-signature-col">
                  <span class="sign-date">${today}</span>
                  <div class="sign-line"></div>
                  <span class="sign-name">Dewan Kurikulum Anatomi</span>
                  <span class="sign-role">Tim Ahli Biologi & Edukasi Sains</span>
                </div>

                <div class="cert-seal-box">
                  <div class="cert-gold-seal">
                    <span>★ RESMI ★</span>
                    <strong>DOKTER</strong>
                    <small>INDONESIA</small>
                  </div>
                </div>

                <div class="cert-signature-col">
                  <span class="sign-date">Kota: ${leaderboard.getProfile().city}</span>
                  <div class="sign-line"></div>
                  <span class="sign-name">Pembina Sains Cilik</span>
                  <span class="sign-role">Kementerian Generasi Sehat</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    if (this.currentTab === 'labeling') {
      return `
        <!-- Printable Labeling Worksheet -->
        <div class="print-sheet labeling-sheet">
          <div class="sheet-title-header">
            <h2>LEMBAR KERJA SISWA: MENGENAL ORGAN TUBUH MANUSIA</h2>
            <div class="student-meta-row">
              <span>Nama Siswa: ____________________</span>
              <span>Kelas: _________</span>
              <span>Tanggal: ${today}</span>
            </div>
          </div>

          <div class="sheet-instructions">
            <strong>Petunjuk Pengerjaan:</strong>
            <p>Tarik garis lurus dari nama organ di sebelah kiri dan kanan menuju letak organ yang tepat pada tubuh manusia!</p>
          </div>

          <div class="sheet-diagram-layout">
            <div class="labeling-names-left">
              <div class="label-box-line">1. 🧠 OTAK</div>
              <div class="label-box-line">2. 🫁 PARU-PARU</div>
              <div class="label-box-line">3. 🥣 LAMBUNG</div>
              <div class="label-box-line">4. 🫘 GINJAL</div>
            </div>

            <div class="labeling-silhouette-center">
              <svg viewBox="0 0 200 380" class="print-body-svg">
                <path d="M 100,20 C 115,20 125,35 125,55 C 125,70 120,80 115,85 C 125,90 145,100 155,120 C 165,140 170,190 168,220 C 167,225 158,226 154,220 C 150,200 142,160 135,145 C 133,165 133,200 133,225 C 133,240 140,270 140,310 C 140,350 133,375 121,375 C 113,375 109,360 106,320 C 103,280 98,250 93,250 C 88,250 83,280 80,320 C 77,360 73,375 65,375 C 53,375 46,350 46,310 C 46,270 53,240 53,225 C 53,200 53,165 51,145 C 44,160 36,200 32,220 C 28,226 19,225 18,220 C 16,190 21,140 31,120 C 41,100 61,90 71,85 C 66,80 61,70 61,55 C 61,35 71,20 86,20 Z" fill="#ffffff" stroke="#000000" stroke-width="2"/>
                <circle cx="100" cy="55" r="4" fill="#000000"/>
                <circle cx="95" cy="125" r="4" fill="#000000"/>
                <circle cx="105" cy="135" r="4" fill="#000000"/>
                <circle cx="103" cy="170" r="4" fill="#000000"/>
                <circle cx="92" cy="165" r="4" fill="#000000"/>
                <circle cx="100" cy="190" r="4" fill="#000000"/>
                <circle cx="100" cy="215" r="4" fill="#000000"/>
              </svg>
            </div>

            <div class="labeling-names-right">
              <div class="label-box-line">5. 🫀 JANTUNG</div>
              <div class="label-box-line">6. 🛡️ HATI</div>
              <div class="label-box-line">7. 〰️ USUS</div>
              <div class="label-box-line">8. 🦴 RANGKA TULANG</div>
            </div>
          </div>
        </div>
      `;
    }

    if (this.currentTab === 'coloring') {
      return `
        <!-- Printable Coloring Sheet -->
        <div class="print-sheet coloring-sheet">
          <div class="sheet-title-header">
            <h2>LEMBAR MEWARNAI SAINS: RANGKA TULANG MANUSIA</h2>
            <div class="student-meta-row">
              <span>Nama Siswa: ____________________</span>
              <span>Kelas: _________</span>
              <span>Tanggal: ${today}</span>
            </div>
          </div>

          <div class="sheet-instructions">
            <strong>Aktivitas Kreatif:</strong>
            <p>Warnai tengkorak dengan warna krem, tulang rusuk dengan kuning muda, dan beri warna cerah pada organ pelindung di dalamnya!</p>
          </div>

          <div class="coloring-canvas-frame">
            <svg viewBox="0 0 300 460" class="print-coloring-svg">
              <ellipse cx="150" cy="70" rx="36" ry="42" fill="none" stroke="#000000" stroke-width="3"/>
              <circle cx="138" cy="65" r="8" fill="none" stroke="#000000" stroke-width="2.5"/>
              <circle cx="162" cy="65" r="8" fill="none" stroke="#000000" stroke-width="2.5"/>
              <path d="M 142,92 L 158,92" stroke="#000000" stroke-width="3"/>
              <line x1="150" y1="112" x2="150" y2="280" stroke="#000000" stroke-width="8" stroke-linecap="round"/>
              ${[135, 155, 175, 195, 215].map(y => `
                <path d="M 115,${y} C 135,${y - 8} 165,${y - 8} 185,${y}" stroke="#000000" stroke-width="3.5" stroke-linecap="round" fill="none"/>
              `).join('')}
              <path d="M 115,280 C 130,260 170,260 185,280 C 170,305 130,305 115,280 Z" fill="none" stroke="#000000" stroke-width="3"/>
              <line x1="130" y1="305" x2="115" y2="420" stroke="#000000" stroke-width="6" stroke-linecap="round"/>
              <line x1="170" y1="305" x2="185" y2="420" stroke="#000000" stroke-width="6" stroke-linecap="round"/>
            </svg>
          </div>
        </div>
      `;
    }

    if (this.currentTab === 'crossword') {
      return `
        <!-- Printable Crossword Puzzle -->
        <div class="print-sheet crossword-sheet">
          <div class="sheet-title-header">
            <h2>TEKA-TEKI SILANG SAINS: PETUALANGAN ANATOMI TUBUH</h2>
            <div class="student-meta-row">
              <span>Nama Siswa: ____________________</span>
              <span>Kelas: _________</span>
              <span>Tanggal: ${today}</span>
            </div>
          </div>

          <div class="sheet-instructions">
            <strong>Petunjuk:</strong> Isi kotak-kotak kosong berdasarkan petunjuk mendatar dan menurun di bawah ini!
          </div>

          <div class="crossword-grid-layout">
            <div class="crossword-visual-box">
              <table class="crossword-table">
                ${[
                  ['J', 'A', 'N', 'T', 'U', 'N', 'G'],
                  [' ', ' ', ' ', 'U', ' ', ' ', ' '],
                  [' ', ' ', 'O', 'T', 'A', 'K', ' '],
                  [' ', ' ', ' ', 'A', ' ', ' ', ' '],
                  ['P', 'A', 'R', 'U', 'P', 'A', 'R', 'U'],
                  [' ', ' ', ' ', 'T', ' ', ' ', ' '],
                  ['G', 'I', 'N', 'J', 'A', 'L', ' ']
                ].map(row => `
                  <tr>
                    ${row.map(cell => `
                      <td class="${cell.trim() ? 'cw-cell filled' : 'cw-cell empty'}">
                        ${cell.trim() ? `<span class="cw-letter">${cell}</span>` : ''}
                      </td>
                    `).join('')}
                  </tr>
                `).join('')}
              </table>
            </div>

            <div class="crossword-clues-col">
              <div class="clue-section">
                <h4>➡️ MENDATAR:</h4>
                <ol>
                  <li>Organ pemompa darah beroksigen 24 jam nonstop (7 Huruf).</li>
                  <li>Pusat berpikir, ingatan, dan mimpi indah saat tidur (4 Huruf).</li>
                  <li>Organ pernapasan yang mengembang menyerap oksigen (8 Huruf).</li>
                  <li>Sepasang penyaring darah berbentuk biji kacang merah (6 Huruf).</li>
                </ol>
              </div>

              <div class="clue-section">
                <h4>⬇️ MENURUN:</h4>
                <ol>
                  <li>Penyangga tubuh berjumlah 206 buah yang sangat kokoh (6 Huruf: TULANG).</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    return `
      <!-- Printable Student Assessment Report Card -->
      <div class="print-sheet report-sheet">
        <div class="sheet-title-header">
          <h2>RAPORT EVALUASI HASIL BELAJAR DOKTER CILIK</h2>
          <span class="cert-subtitle">Laporan Capaian Pembelajaran Kurikulum Merdeka IPAS & Biologi</span>
          <div class="student-meta-row" style="margin-top: 10px;">
            <span>Nama Siswa: <strong>${playerName}</strong></span>
            <span>Gelar Medis: <strong>${rankTitle}</strong></span>
            <span>Tanggal: ${today}</span>
          </div>
        </div>

        <div class="report-table-wrapper">
          <table class="report-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Bidang Kompetensi & Sistem Tubuh</th>
                <th>Nilai & Status</th>
                <th>Kategori Capaian</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Sistem Peredaran Darah & Jantung (Cor)</td>
                <td>100 (Tuntas)</td>
                <td><span class="badge-grade">Sangat Mahir ★★★</span></td>
              </tr>
              <tr>
                <td>2</td>
                <td>Sistem Saraf Pusat & Otak (Cerebrum)</td>
                <td>95 (Tuntas)</td>
                <td><span class="badge-grade">Sangat Mahir ★★★</span></td>
              </tr>
              <tr>
                <td>3</td>
                <td>Sistem Pernapasan & Paru-Paru (Pulmo)</td>
                <td>98 (Tuntas)</td>
                <td><span class="badge-grade">Sangat Mahir ★★★</span></td>
              </tr>
              <tr>
                <td>4</td>
                <td>Sistem Pencernaan (Mulut, Lambung, Usus)</td>
                <td>96 (Tuntas)</td>
                <td><span class="badge-grade">Sangat Mahir ★★★</span></td>
              </tr>
              <tr>
                <td>5</td>
                <td>Sistem Ekskresi & Ginjal (Ren)</td>
                <td>94 (Tuntas)</td>
                <td><span class="badge-grade">Sangat Mahir ★★★</span></td>
              </tr>
              <tr>
                <td>6</td>
                <td>Sistem Gerak & Rangka Tulang (Skeleton)</td>
                <td>100 (Tuntas)</td>
                <td><span class="badge-grade">Sangat Mahir ★★★</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="report-summary-box">
          <h4>Catatan Pembimbing Sains:</h4>
          <p>
            Ananda <strong>${playerName}</strong> menunjukkan pemahaman yang sangat mendalam terhadap fungsi organ dan alur fisiologi tubuh manusia. 
            Mampu mengidentifikasi keluhan pasien anak dengan cermat, serta memiliki motivasi belajar literasi sains yang istimewa.
          </p>
        </div>

        <div class="cert-footer" style="margin-top: 25px;">
          <div class="cert-signature-col">
            <span class="sign-date">Orang Tua / Wali Siswa</span>
            <div class="sign-line"></div>
            <span class="sign-name">( .................................................. )</span>
          </div>
          <div class="cert-seal-box">
            <div class="cert-gold-seal">
              <span>NILAI</span>
              <strong>A+</strong>
              <small>LULUS</small>
            </div>
          </div>
          <div class="cert-signature-col">
            <span class="sign-date">Guru Pembimbing Sains / IPAS</span>
            <div class="sign-line"></div>
            <span class="sign-name">( .................................................. )</span>
          </div>
        </div>
      </div>
    `;
  }

  private bindEvents() {
    const tabs = this.container.querySelectorAll('[data-ws-tab]');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const t = tab.getAttribute('data-ws-tab') as 'certificate' | 'labeling' | 'coloring' | 'crossword' | 'report';
        if (!t) return;
        sound.playPop();
        this.render(t);
      });
    });

    const printBtn = this.container.querySelector('#btn-print-page');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        sound.playPop();
        window.print();
      });
    }
  }
}
