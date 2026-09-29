/**
 * Level 4: Catch The Hearts Mini Arcade
 * Smooth HTML5 Canvas arcade game where Suggu catches falling hearts, stars, and tulips!
 */

class CatchHeartsGame {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.score = 0;
    this.targetScore = 100;
    this.isGameOver = false;
    this.isRunning = false;

    this.items = [];
    this.particles = [];
    this.spawnTimer = 0;

    // Catcher Basket properties
    this.basket = {
      x: 0,
      y: 0,
      width: 90,
      height: 38,
      speed: 15
    };

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Mouse Controls
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      this.basket.x = Math.max(10, Math.min(this.width - this.basket.width - 10, mouseX - this.basket.width / 2));
    });

    // Touch Controls for mobile
    this.canvas.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const rect = this.canvas.getBoundingClientRect();
        const touchX = e.touches[0].clientX - rect.left;
        this.basket.x = Math.max(10, Math.min(this.width - this.basket.width - 10, touchX - this.basket.width / 2));
      }
    }, { passive: true });
  }

  resize() {
    const parent = this.canvas.parentElement;
    const parentWidth = parent ? parent.clientWidth : 0;
    const availableWidth = parentWidth > 50 ? parentWidth : (window.innerWidth > 640 ? 560 : window.innerWidth - 40);
    this.width = this.canvas.width = Math.min(availableWidth, 600);
    this.height = this.canvas.height = 420;
    this.basket.y = this.height - 50;
    this.basket.x = this.width / 2 - this.basket.width / 2;
  }

  start() {
    this.resize();
    this.score = 0;
    this.isGameOver = false;
    this.isRunning = true;
    this.items = [];
    this.particles = [];
    this.updateProgress();
    this.loop();
  }

  spawnItem() {
    const types = [
      { emoji: "💖", points: 10, size: 28, speed: 2.2 },
      { emoji: "🥞", points: 15, size: 28, speed: 2.4 },
      { emoji: "🔔", points: 15, size: 26, speed: 2.5 },
      { emoji: "🌷", points: 20, size: 30, speed: 2.3 },
      { emoji: "🚪", points: 25, size: 30, speed: 2.8 }
    ];

    const chosen = types[Math.floor(Math.random() * types.length)];
    this.items.push({
      x: Math.random() * (this.width - 40) + 20,
      y: -30,
      emoji: chosen.emoji,
      points: chosen.points,
      size: chosen.size,
      speed: chosen.speed + Math.random() * 0.8,
      rotation: (Math.random() - 0.5) * 0.2
    });
  }

  createCatchParticles(x, y, emoji) {
    for (let i = 0; i < 7; i++) {
      this.particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 5,
        vy: (Math.random() - 0.8) * 4,
        size: Math.random() * 8 + 4,
        alpha: 1,
        life: 0,
        maxLife: 25,
        color: emoji === '🔔' ? '#fef08a' : (emoji === '🌷' ? '#f472b6' : (emoji === '🚪' ? '#ec4899' : (emoji === '🥞' ? '#f59e0b' : '#f43f5e')))
      });
    }
  }

  loop() {
    if (!this.isRunning) return;

    this.ctx.clearRect(0, 0, this.width, this.height);

    // Spawn items
    this.spawnTimer++;
    if (this.spawnTimer > 35) {
      this.spawnItem();
      this.spawnTimer = 0;
    }

    // Draw & update items
    for (let i = this.items.length - 1; i >= 0; i--) {
      const item = this.items[i];
      item.y += item.speed;

      this.ctx.font = `${item.size}px Arial`;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(item.emoji, item.x, item.y);

      // Check collision with basket
      if (
        item.y + item.size / 2 >= this.basket.y &&
        item.y - item.size / 2 <= this.basket.y + this.basket.height &&
        item.x >= this.basket.x - 10 &&
        item.x <= this.basket.x + this.basket.width + 10
      ) {
        // Caught!
        this.score += item.points;
        this.createCatchParticles(item.x, item.y, item.emoji);
        if (window.AudioEffects) window.AudioEffects.playCatchTone();
        this.items.splice(i, 1);
        this.updateProgress();

        if (this.score >= this.targetScore) {
          this.handleVictory();
          return;
        }
        continue;
      }

      // Remove off screen
      if (item.y > this.height + 40) {
        this.items.splice(i, 1);
      }
    }

    // Update and draw catch particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life++;
      p.x += p.vx;
      p.y += p.vy;
      p.alpha = 1 - p.life / p.maxLife;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = Math.max(0, p.alpha);
      this.ctx.fill();

      if (p.life >= p.maxLife) {
        this.particles.splice(i, 1);
      }
    }
    this.ctx.globalAlpha = 1;

    // Draw Basket
    this.drawBasket();

    requestAnimationFrame(() => this.loop());
  }

  drawBasket() {
    const { x, y, width, height } = this.basket;

    // Glowing Basket body
    this.ctx.save();
    this.ctx.shadowBlur = 15;
    this.ctx.shadowColor = '#ec4899';

    // Rounded glowing glass cart
    this.ctx.fillStyle = 'rgba(236, 72, 153, 0.35)';
    this.ctx.strokeStyle = '#fda4af';
    this.ctx.lineWidth = 2.5;

    this.roundRect(this.ctx, x, y, width, height, 14, true, true);

    // Basket interior decoration
    this.ctx.font = '18px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('🧺 Suggu', x + width / 2, y + height / 2 + 1);

    this.ctx.restore();
  }

  roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if (fill) ctx.fill();
    if (stroke) ctx.stroke();
  }

  updateProgress() {
    const percent = Math.min(100, Math.round((this.score / this.targetScore) * 100));
    const fillEl = document.getElementById('hearts-meter-fill');
    const textEl = document.getElementById('hearts-meter-text');

    if (fillEl) fillEl.style.width = `${percent}%`;
    if (textEl) textEl.innerText = `Love Meter: ${percent}% (Score: ${this.score}/${this.targetScore})`;
  }

  handleVictory() {
    this.isRunning = false;
    this.isGameOver = true;

    if (window.confetti) {
      window.confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }

    if (window.AudioEffects) window.AudioEffects.playFanfare();

    setTimeout(() => {
      // Unlock Token #4 Love Note
      if (window.App) window.App.unlockLoveLetter(4);
    }, 1200);
  }
}

window.CatchHeartsGame = CatchHeartsGame;
