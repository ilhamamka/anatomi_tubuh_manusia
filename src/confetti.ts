// Celebration Confetti Particle Engine for Medical Achievements

interface ConfettiParticle {
  x: number;
  y: number;
  size: number;
  color: string;
  vx: number;
  vy: number;
  rotation: number;
  vRot: number;
  shape: 'rect' | 'circle' | 'star';
  opacity: number;
}

class ConfettiEngine {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private particles: ConfettiParticle[] = [];
  private animId: number | null = null;

  private colors = ['#ff4d4f', '#38bdf8', '#facc15', '#22c55e', '#a855f7', '#f43f5e', '#fb923c'];

  private initCanvas() {
    if (this.canvas) return;
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'confetti-canvas';
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100vw';
    this.canvas.style.height = '100vh';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '9999';
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  private resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth * window.devicePixelRatio;
    this.canvas.height = window.innerHeight * window.devicePixelRatio;
    if (this.ctx) {
      this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
  }

  public burst(count: number = 80) {
    this.initCanvas();
    if (!this.ctx) return;

    const w = window.innerWidth;
    const h = window.innerHeight;

    for (let i = 0; i < count; i++) {
      const shapeRand = Math.random();
      this.particles.push({
        x: w * 0.5 + (Math.random() - 0.5) * 160,
        y: h * 0.4 + (Math.random() - 0.5) * 80,
        size: Math.random() * 8 + 6,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        vx: (Math.random() - 0.5) * 16,
        vy: -Math.random() * 14 - 6,
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 12,
        shape: shapeRand > 0.6 ? 'star' : (shapeRand > 0.3 ? 'rect' : 'circle'),
        opacity: 1
      });
    }

    if (!this.animId) {
      this.animate();
    }
  }

  private animate() {
    if (!this.ctx || !this.canvas) return;
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.45; // gravity
      p.vx *= 0.98; // air resistance
      p.rotation += p.vRot;
      p.opacity -= 0.008;

      if (p.opacity <= 0 || p.y > window.innerHeight + 50) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.globalAlpha = Math.max(0, p.opacity);
      this.ctx.fillStyle = p.color;

      if (p.shape === 'rect') {
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.4);
      } else if (p.shape === 'circle') {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        this.ctx.fill();
      } else {
        // Star particle
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        this.ctx.fill();
      }
      this.ctx.restore();
    }

    if (this.particles.length > 0) {
      this.animId = requestAnimationFrame(() => this.animate());
    } else {
      this.animId = null;
      if (this.canvas) {
        this.canvas.remove();
        this.canvas = null;
        this.ctx = null;
      }
    }
  }
}

export const confetti = new ConfettiEngine();
