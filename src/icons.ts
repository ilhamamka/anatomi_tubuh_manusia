// Custom Vector SVG Icon & Brand Suite for Anatomi Tubuh Manusia
// Zero external image dependencies, crystal clear on Retina / 4K displays

export const ICONS: Record<string, (size?: number, color?: string) => string> = {
  // Stethoscope / Brand Icon & Clinical Tools
  stethoscope: (size = 20, color = 'currentColor') => `
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="svg-icon icon-stethoscope">
      <path d="M4.5 3v6a4.5 4.5 0 0 0 9 0V3" stroke="#0284c7" stroke-width="2.5"/>
      <path d="M9 13.5V17a3 3 0 0 0 6 0v-3.5" stroke="#0284c7" stroke-width="2.5"/>
      <circle cx="18" cy="12" r="3" fill="#38bdf8" stroke="#0f172a" stroke-width="2"/>
      <circle cx="18" cy="12" r="1" fill="#0f172a"/>
      <circle cx="4.5" cy="3" r="1.5" fill="#f43f5e"/>
      <circle cx="13.5" cy="3" r="1.5" fill="#f43f5e"/>
    </svg>
  `,

  // Heart with ECG heartbeat pulse wave
  heart: (size = 20, color = 'currentColor') => `
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon icon-heart">
      <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" fill="#ff4d4f" stroke="#2f2a26" stroke-width="2"/>
      <path d="M6 12h3l1.5 -3l3 6l2 -3h2.5" stroke="#ffffff" stroke-width="2" stroke-linejoin="round"/>
    </svg>
  `,

  // Lungs
  lungs: (size = 20, color = 'currentColor') => `
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon icon-lungs">
      <path d="M12 3v8" stroke="#2f2a26" stroke-width="2.5"/>
      <path d="M12 7c-2 2 -4 3 -7 3a4 4 0 0 0 -4 4c0 4 3 7 7 7c2 0 4 -1 4 -3" fill="#fbcfe8" stroke="#2f2a26"/>
      <path d="M12 7c2 2 4 3 7 3a4 4 0 0 1 4 4c0 4 -3 7 -7 7c-2 0 -4 -1 -4 -3" fill="#fbcfe8" stroke="#2f2a26"/>
      <circle cx="8" cy="14" r="1" fill="#f43f5e"/>
      <circle cx="16" cy="14" r="1" fill="#f43f5e"/>
    </svg>
  `,

  // Brain
  brain: (size = 20, color = 'currentColor') => `
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon icon-brain">
      <path d="M15.5 13a3.5 3.5 0 0 0 -3.5 3.5v1a3.5 3.5 0 0 1 -7 0v-1.8a3 3 0 0 1 -.6 -4.7a3.5 3.5 0 0 1 1.6 -5.5a3.5 3.5 0 0 1 6 0a3.5 3.5 0 0 1 6 0a3.5 3.5 0 0 1 1.6 5.5a3 3 0 0 1 -.6 4.7v1.8a3.5 3.5 0 0 1 -7 0v-1a3.5 3.5 0 0 0 -3.5 -3.5" fill="#f472b6" stroke="#2f2a26" stroke-width="2"/>
      <path d="M12 6v14" stroke="#2f2a26" stroke-width="2"/>
    </svg>
  `,

  // Skeleton / Bone
  bone: (size = 20, color = 'currentColor') => `
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon icon-bone">
      <path d="M18.5 3a2.5 2.5 0 0 1 2.5 2.5a2.5 2.5 0 0 1 -1.5 2.3l-10.7 10.7a2.5 2.5 0 1 1 -3.3 -3.3l10.7 -10.7a2.5 2.5 0 0 1 2.3 -1.5z" fill="#f8fafc" stroke="#2f2a26" stroke-width="2"/>
      <circle cx="5.5" cy="18.5" r="1.5" fill="#cbd5e1"/>
      <circle cx="18.5" cy="5.5" r="1.5" fill="#cbd5e1"/>
    </svg>
  `,

  // Microscope / Lab
  microscope: (size = 20, color = 'currentColor') => `
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon icon-microscope">
      <path d="M5 21h14" stroke="#2f2a26" stroke-width="2.5"/>
      <path d="M6 18h2" stroke="#2f2a26" stroke-width="2"/>
      <path d="M7 18v3" stroke="#2f2a26" stroke-width="2"/>
      <path d="M9 11l3 3l6 -6l-3 -3z" fill="#38bdf8" stroke="#2f2a26" stroke-width="2"/>
      <path d="M10.5 12.5l-1.5 1.5" stroke="#2f2a26"/>
      <path d="M17 3l3 3" stroke="#2f2a26" stroke-width="2"/>
      <circle cx="12" cy="18" r="3" fill="#a7f3d0" stroke="#2f2a26" stroke-width="2"/>
    </svg>
  `,

  // Chart / Atlas Anatomi
  chart: (size = 20, color = 'currentColor') => `
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon icon-chart">
      <rect x="3" y="3" width="18" height="18" rx="3" fill="#f0fdf4" stroke="#2f2a26" stroke-width="2"/>
      <circle cx="12" cy="8" r="2.5" fill="#fb7185" stroke="#2f2a26" stroke-width="1.5"/>
      <path d="M12 11v6" stroke="#2f2a26" stroke-width="2"/>
      <path d="M9 13l3 -1l3 1" stroke="#2f2a26" stroke-width="1.8"/>
      <path d="M10 19l2 -2l2 2" stroke="#2f2a26" stroke-width="1.8"/>
    </svg>
  `,

  // Sandbox / Lab Bedah
  sandbox: (size = 20, color = 'currentColor') => `
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon icon-sandbox">
      <path d="M4 19a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2l-2 -10h-12z" fill="#fdf4ff" stroke="#2f2a26" stroke-width="2"/>
      <path d="M12 3v6" stroke="#c084fc" stroke-width="2.5"/>
      <circle cx="12" cy="14" r="2" fill="#ec4899"/>
      <path d="M9 9h6" stroke="#2f2a26" stroke-width="2"/>
    </svg>
  `,

  // Trophy / Ranking
  trophy: (size = 20, color = 'currentColor') => `
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon icon-trophy">
      <path d="M6 9H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2" stroke="#2f2a26"/>
      <path d="M18 9h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2" stroke="#2f2a26"/>
      <path d="M6 3h12v7a6 6 0 0 1-12 0V3z" fill="#ffd60a" stroke="#2f2a26" stroke-width="2"/>
      <path d="M12 16v4" stroke="#2f2a26" stroke-width="3"/>
      <path d="M8 21h8" stroke="#2f2a26" stroke-width="3"/>
      <circle cx="12" cy="8" r="2" fill="#ff3b30"/>
    </svg>
  `,

  // Guide / Panduan Guru & Ortu
  guide: (size = 20, color = 'currentColor') => `
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon icon-guide">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="#2f2a26"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" fill="#fef3c7" stroke="#2f2a26" stroke-width="2"/>
      <path d="M12 2v8l3-2.5L18 10V2" fill="#f59e0b" stroke="#2f2a26" stroke-width="1.8"/>
    </svg>
  `,

  // Print / Cetak Lembar Belajar
  print: (size = 20, color = 'currentColor') => `
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon icon-print">
      <path d="M6 9V2h12v7" stroke="#2f2a26" stroke-width="2"/>
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" fill="#e0f2fe" stroke="#2f2a26" stroke-width="2"/>
      <rect x="6" y="14" width="12" height="8" rx="1.5" fill="#ffffff" stroke="#2f2a26" stroke-width="2"/>
      <line x1="9" y1="18" x2="15" y2="18" stroke="#0284c7" stroke-width="2"/>
    </svg>
  `,

  // Report / Rapor Pembelajaran
  parents: (size = 20, color = 'currentColor') => `
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon icon-parents">
      <rect x="3" y="4" width="18" height="16" rx="2" fill="#f0f9ff" stroke="#2f2a26" stroke-width="2"/>
      <line x1="7" y1="9" x2="17" y2="9" stroke="#0284c7" stroke-width="2"/>
      <line x1="7" y1="13" x2="14" y2="13" stroke="#0284c7" stroke-width="2"/>
      <circle cx="17" cy="14" r="1.5" fill="#22c55e"/>
    </svg>
  `,

  // VIP Pass / Golden Stethoscope Crown
  vip: (size = 20, color = 'currentColor') => `
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon icon-vip">
      <path d="M2 19h20v2H2z" fill="#2f2a26" stroke="#2f2a26"/>
      <path d="M3 18l2-11 5 5 2-8 2 8 5-5 2 11H3z" fill="#ffd60a" stroke="#2f2a26" stroke-width="2"/>
      <circle cx="5" cy="7" r="1.5" fill="#ff3b30"/>
      <circle cx="12" cy="4" r="1.8" fill="#3b82f6"/>
      <circle cx="19" cy="7" r="1.5" fill="#ff3b30"/>
    </svg>
  `,

  // Sound & Music
  sound: (size = 20, color = 'currentColor') => `
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon icon-sound">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="#60a5fa" stroke="#2f2a26" stroke-width="2"/>
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke="#2f2a26" stroke-width="2"/>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" stroke="#2f2a26" stroke-width="2"/>
    </svg>
  `,

  soundOff: (size = 20, color = 'currentColor') => `
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon icon-sound-off">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="#94a3b8" stroke="#2f2a26" stroke-width="2"/>
      <line x1="23" y1="9" x2="17" y2="15" stroke="#ef4444" stroke-width="2.5"/>
      <line x1="17" y1="9" x2="23" y2="15" stroke="#ef4444" stroke-width="2.5"/>
    </svg>
  `,

  music: (size = 20, color = 'currentColor') => `
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon icon-music">
      <path d="M9 18V5l12-2v13" stroke="#2f2a26" stroke-width="2"/>
      <circle cx="6" cy="18" r="3" fill="#a78bfa" stroke="#2f2a26" stroke-width="2"/>
      <circle cx="18" cy="16" r="3" fill="#a78bfa" stroke="#2f2a26" stroke-width="2"/>
    </svg>
  `,

  musicOff: (size = 20, color = 'currentColor') => `
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon icon-music-off">
      <path d="M9 18V5l12-2v13" stroke="#94a3b8" stroke-width="2"/>
      <circle cx="6" cy="18" r="3" fill="#cbd5e1" stroke="#2f2a26" stroke-width="2"/>
      <circle cx="18" cy="16" r="3" fill="#cbd5e1" stroke="#2f2a26" stroke-width="2"/>
      <line x1="3" y1="3" x2="21" y2="21" stroke="#ef4444" stroke-width="2.5"/>
    </svg>
  `,

  fullscreen: (size = 20, color = 'currentColor') => `
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon icon-fullscreen">
      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" stroke="#2f2a26" stroke-width="2.5"/>
    </svg>
  `,

  xray: (size = 20, color = 'currentColor') => `
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon icon-xray">
      <rect x="3" y="3" width="18" height="18" rx="3" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
      <path d="M12 7v10M8 10l8 4M16 10l-8 4" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="12" cy="12" r="2" fill="#ffffff"/>
    </svg>
  `,

  check: (size = 20, color = 'currentColor') => `
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="svg-icon icon-check">
      <polyline points="20 6 9 17 4 12" stroke="#22c55e"/>
    </svg>
  `,

  arrowLeft: (size = 20, color = 'currentColor') => `
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="svg-icon icon-back">
      <line x1="19" y1="12" x2="5" y2="12"/>
      <polyline points="12 19 5 12 12 5"/>
    </svg>
  `,

  star: (size = 20, color = 'currentColor') => `
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="#ffd60a" stroke="#2f2a26" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon icon-star">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  `,

  quiz: (size = 20, color = 'currentColor') => `
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="svg-icon icon-quiz">
      <circle cx="12" cy="12" r="9" fill="#fef08a" stroke="#ca8a04"/>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="#854d0e"/>
      <line x1="12" y1="17" x2="12.01" y2="17" stroke="#854d0e"/>
    </svg>
  `,

  flow: (size = 20, color = 'currentColor') => `
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="svg-icon icon-flow">
      <path d="M4 12h16m-6-6l6 6l-6 6" stroke="#0284c7"/>
      <circle cx="6" cy="12" r="2.5" fill="#38bdf8"/>
    </svg>
  `
};

// Render Brand Logo Banner for the Top Bar
export function renderBrandLogo(): string {
  return `
    <div class="brand-badge-container">
      <div class="brand-avatar-box">
        <span class="brand-doc-badge">🩺</span>
        <svg class="brand-heart-pulse" width="18" height="18" viewBox="0 0 24 24" fill="#ff4d4f" stroke="#2f2a26" stroke-width="2">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </div>
      <div class="brand-titles">
        <h1 class="brand-main-title">ANATOMI TUBUH KITA</h1>
        <span class="brand-subtitle">PETUALANGAN DOKTER CILIK INDONESIA</span>
      </div>
    </div>
  `;
}

export function getIcon(name: string, size = 20, color = 'currentColor'): string {
  if (ICONS[name]) {
    return ICONS[name](size, color);
  }
  return `<span style="font-size:${size}px;">✨</span>`;
}
