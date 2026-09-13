// Panduan Pendamping Belajar Orang Tua & Guru (Kurikulum Merdeka Sains Biologi)

export class ParentGuideRenderer {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  public render() {
    this.container.innerHTML = `
      <div class="parent-guide-wrapper">
        <div class="guide-hero-banner">
          <div class="guide-hero-titles">
            <span class="guide-tag">📚 PANDUAN PENDAMPINGAN ORANG TUA & GURU</span>
            <h2 class="guide-heading">Mendampingi Si Kecil Menjelajahi Keajaiban Tubuh Manusia</h2>
            <p class="guide-intro">
              Disusun selaras dengan Kurikulum Merdeka mata pelajaran <strong>IPAS SD (Ilmu Pengetahuan Alam dan Sosial)</strong> serta pengayaan biologi tingkat lanjut. Membantu anak membangun rasa takjub, pemahaman ilmiah, dan kebiasaan hidup sehat sejak dini.
            </p>
          </div>
        </div>

        <!-- Section 1: Pemetaan Kurikulum Fase Belajar -->
        <div class="guide-card-section">
          <h3 class="section-badge-title">🎯 Pemetaan Capaian Pembelajaran Kurikulum Merdeka</h3>
          <div class="phases-grid">
            <div class="phase-card">
              <span class="phase-badge">FASE A (Kelas 1 - 2 SD)</span>
              <h4>Panca Indera & Anggota Tubuh Luar</h4>
              <p>Mengenal fungsi mata, telinga, hidung, lidah, kulit, serta cara merawat kebersihan tubuh setiap hari.</p>
              <div class="phase-organs">Modul Relevan: <em>Tingkat 1 - Panca Indera & Kulit</em></div>
            </div>

            <div class="phase-card">
              <span class="phase-badge">FASE B (Kelas 3 - 4 SD)</span>
              <h4>Rangka Tulang & Otot Penggerak</h4>
              <p>Memahami bagaimana 206 tulang dan otot bekerja sama menciptakan gerakan berlari, melompat, dan melindungi organ.</p>
              <div class="phase-organs">Modul Relevan: <em>Tingkat 3 - Rangka Tulang & Sendi</em></div>
            </div>

            <div class="phase-card">
              <span class="phase-badge">FASE C (Kelas 5 - 6 SD)</span>
              <h4>Sistem Organ Dalam & Metabolisme</h4>
              <p>Menjelajahi siklus peredaran darah jantung, pernapasan paru-paru, pencernaan lambung, dan sistem ekskresi ginjal.</p>
              <div class="phase-organs">Modul Relevan: <em>Tingkat 2, 4, 5 - Organ Vital & Bedah</em></div>
            </div>
          </div>
        </div>

        <!-- Section 2: 4 Eksperimen STEM Praktis di Rumah -->
        <div class="guide-card-section">
          <h3 class="section-badge-title">🧪 4 Ide Eksperimen STEM Sederhana Bersama Anak di Rumah</h3>
          <div class="experiments-grid">
            <div class="experiment-card">
              <div class="exp-icon">🫀</div>
              <div class="exp-content">
                <h4>1. Detektif Denyut Nadi (Jantung)</h4>
                <p><strong>Cara:</strong> Ajak anak meletakkan dua jari di pergelangan tangan atau leher. Hitung denyut selama 1 menit saat duduk tenang (sekitar 70-90 bpm), lalu ajak melompat 30 kali dan hitung kembali (meningkat ke 120-140 bpm!).</p>
                <span class="exp-lesson">Pelajaran: Otot jantung memompa lebih cepat untuk menyuplai oksigen ke otot yang aktif.</span>
              </div>
            </div>

            <div class="experiment-card">
              <div class="exp-icon">🫁</div>
              <div class="exp-content">
                <h4>2. Model Paru-Paru Botol & Balon (Pernapasan)</h4>
                <p><strong>Cara:</strong> Potong bagian bawah botol plastik bekas, pasang balon di leher botol sebagai paru-paru, dan tutup potongan bawah botol dengan karet balon sebagai diafragma. Tarik diafragma ke bawah: balon di dalam akan mengembang!</p>
                <span class="exp-lesson">Pelajaran: Menunjukkan cara kerja otot diafragma yang menarik udara masuk ke paru-paru.</span>
              </div>
            </div>

            <div class="experiment-card">
              <div class="exp-icon">👅</div>
              <div class="exp-content">
                <h4>3. Peta Pengecap Rasa Lidah (Panca Indera)</h4>
                <p><strong>Cara:</strong> Siapkan 4 sendok kecil berisi air gula (manis), air garam (asin), air perasan lemon (asam), dan sedikit teh pekat tanpa gula (pahit). Teteskan perlahan ke ujung dan samping lidah anak dengan mata tertutup.</p>
                <span class="exp-lesson">Pelajaran: Mengenal bintil papila lidah dan cara saraf pengecap membedakan aneka rasa makanan.</span>
              </div>
            </div>

            <div class="experiment-card">
              <div class="exp-icon">🦴</div>
              <div class="exp-content">
                <h4>4. Uji Kekuatan Tulang Silinder Kertas (Rangka)</h4>
                <p><strong>Cara:</strong> Gulung 4 lembar kertas menjadi bentuk silinder (seperti tulang paha), rekatkan dengan selotip. Berdirikan keempatnya dan letakkan beberapa buku tebal di atasnya. Tabung kertas mampu menopang beban berat!</p>
                <span class="exp-lesson">Pelajaran: Struktur tabung silinder tulang sangat kokoh namun ringan untuk bergerak.</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 3: Tips Gaya Hidup Sehat untuk Keluarga -->
        <div class="guide-card-section tips-family">
          <h3 class="section-badge-title">🌱 5 Kunci Emas Tubuh Sehat untuk Anak Indonesia</h3>
          <ul class="healthy-pillars-list">
            <li><strong>💧 Hidrasi Air Putih:</strong> Minum minimal 6-8 gelas air putih per hari agar ginjal lancar menyaring racun.</li>
            <li><strong>🌈 Piring Warna-Warni:</strong> Pastikan setiap makan ada sayur hijau, buah cerah, dan protein telur/ikan/tempe untuk sel darah.</li>
            <li><strong>🏃 Gerak Aktif 60 Menit:</strong> Kurangi screen-time, perbanyak olahraga outdoor untuk memperkuat kepadatan tulang dan otot.</li>
            <li><strong>🧼 Cuci Tangan 6 Langkah:</strong> Biasakan cuci tangan dengan sabun air mengalir sebelum menyentuh makanan.</li>
            <li><strong>🛌 Tidur Nyenyak 9 Jam:</strong> Hormon pertumbuhan bekerja optimal saat anak tertidur lelap di malam hari.</li>
          </ul>
        </div>
      </div>
    `;
  }
}
