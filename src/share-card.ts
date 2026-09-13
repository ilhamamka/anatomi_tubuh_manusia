// Share Card Generator for WhatsApp & Social Media Bragging Rights

import { leaderboard } from './leaderboard';

export class ShareCardGenerator {
  public static async generateCard(): Promise<HTMLCanvasElement> {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 450;
    const ctx = canvas.getContext('2d')!;

    const profile = leaderboard.getProfile();

    // 1. Background Gradient
    const grad = ctx.createLinearGradient(0, 0, 800, 450);
    grad.addColorStop(0, '#fdf6ec');
    grad.addColorStop(1, '#fee2e2');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 800, 450);

    // 2. Playful Border
    ctx.strokeStyle = '#2f2a26';
    ctx.lineWidth = 8;
    ctx.strokeRect(16, 16, 768, 418);

    // 3. Header Badge
    ctx.fillStyle = '#ff4d4f';
    ctx.fillRect(40, 40, 240, 42);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('🩺 DOKTER CILIK INDONESIA', 52, 67);

    // 4. Player Name & Title
    ctx.fillStyle = '#2f2a26';
    ctx.font = '900 36px sans-serif';
    ctx.fillText(profile.name, 40, 130);

    ctx.fillStyle = '#0284c7';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText(profile.rankTitle, 40, 168);

    // 5. Statistics Pills
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#2f2a26';
    ctx.lineWidth = 3;

    // XP Pill
    ctx.beginPath();
    ctx.roundRect(40, 200, 180, 70, 16);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#e11d48';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('PENGALAMAN (XP)', 56, 226);
    ctx.fillStyle = '#2f2a26';
    ctx.font = '900 28px sans-serif';
    ctx.fillText(`${profile.xp} XP`, 56, 258);

    // Stars Pill
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(240, 200, 180, 70, 16);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#d97706';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('BINTANG MEDIS', 256, 226);
    ctx.fillStyle = '#2f2a26';
    ctx.font = '900 28px sans-serif';
    ctx.fillText(`${profile.stars} ⭐`, 256, 258);

    // 6. Right Side Big Doctor Emblem
    ctx.fillStyle = '#0f172a';
    ctx.font = '72px sans-serif';
    ctx.fillText('🫀 🧠 🫁', 460, 230);

    // 7. Footer Tagline
    ctx.fillStyle = '#475569';
    ctx.font = 'italic 16px sans-serif';
    ctx.fillText('Belajar Anatomi Tubuh Manusia Interaktif · Kurikulum Merdeka Indonesia', 40, 390);

    return canvas;
  }
}
