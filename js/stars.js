/**
 * Dreamy Pastel Sparkle & Aura Canvas
 * Soft pastel drifting sparkles (✦, ✧), gentle floating hearts, and warm glowing bokeh
 */

class PastelSparkleSky {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.sparkles = [];
    this.hearts = [];
    this.numSparkles = 45;
    this.numHearts = 15;
    this.mouse = { x: null, y: null };
    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    this.createElements();
    this.animate();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
    this.createElements();
  }

  createElements() {
    this.sparkles = [];
    this.hearts = [];

    // Doraemon gadget palette: sky blue, collar red, bell gold, door magenta
    const colors = ['#38bdf8', '#0ea5e9', '#ef4444', '#f59e0b', '#ec4899', '#fde047'];

    for (let i = 0; i < this.numSparkles; i++) {
      this.sparkles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 8 + 6,
        alpha: Math.random() * 0.7 + 0.2,
        baseAlpha: Math.random() * 0.7 + 0.2,
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.4 - 0.1, // Drifting gently upwards
        angle: Math.random() * Math.PI * 2
      });
    }

    for (let i = 0; i < this.numHearts; i++) {
      this.hearts.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 10 + 8,
        alpha: Math.random() * 0.35 + 0.15,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -Math.random() * 0.5 - 0.2,
        color: Math.random() > 0.5 ? '#ec4899' : '#38bdf8',
        rotation: (Math.random() - 0.5) * 0.4
      });
    }
  }

  drawDiamond(ctx, x, y, size, color, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = color;
    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(size * 0.35, -size * 0.15);
    ctx.lineTo(size, 0);
    ctx.lineTo(size * 0.35, size * 0.15);
    ctx.lineTo(0, size);
    ctx.lineTo(-size * 0.35, size * 0.15);
    ctx.lineTo(-size, 0);
    ctx.lineTo(-size * 0.35, -size * 0.15);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  drawHeart(ctx, x, y, size, color, alpha, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.scale(size / 15, size / 15);
    ctx.fillStyle = color;
    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
    ctx.beginPath();
    ctx.moveTo(0, -5);
    ctx.bezierCurveTo(-7, -15, -18, -2, 0, 14);
    ctx.bezierCurveTo(18, -2, 7, -15, 0, -5);
    ctx.fill();
    ctx.restore();
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Draw Floating Hearts
    for (let h of this.hearts) {
      h.x += h.vx;
      h.y += h.vy;
      if (h.y < -20) {
        h.y = this.height + 20;
        h.x = Math.random() * this.width;
      }
      this.drawHeart(this.ctx, h.x, h.y, h.size, h.color, h.alpha, h.rotation);
    }

    // Draw Twinkling 4-Point Diamonds
    for (let s of this.sparkles) {
      s.angle += s.twinkleSpeed;
      s.alpha = s.baseAlpha + Math.sin(s.angle) * 0.3;
      s.x += s.vx;
      s.y += s.vy;

      if (s.y < -20) {
        s.y = this.height + 20;
        s.x = Math.random() * this.width;
      }

      this.drawDiamond(this.ctx, s.x, s.y, s.size, s.color, s.alpha);
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new PastelSparkleSky('star-canvas');
});
