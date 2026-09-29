/**
 * Supercharged High-Energy Mini Ludo Championship 🎲
 * Suggu 👑 vs Bhondu Bot 🤖
 * Features: Authentic 4-zone board, Rocket speed boosts, Momos extra rolls,
 * speech bubbles, screen shakes, sound effects, and guaranteed victory!
 */

class MiniLudoGame {
  constructor() {
    this.totalSteps = 16;
    this.playerPos = 0; // 0 (Base) -> 1 to 16 (16 is Golden Home!)
    this.botPos = 0;
    this.currentTurn = 'player';
    this.isRolling = false;
    this.gameOver = false;
    this.turnCount = 0;

    // Powerup Tiles configuration
    this.tiles = {
      4: { type: 'rocket', icon: '🚀', name: 'Rocket Boost (+3 steps!)' },
      8: { type: 'momos', icon: '🥟', name: 'Momos Energy (Extra Roll!)' },
      12: { type: 'rocket', icon: '🚀', name: 'Super Turbo Boost (+2 steps!)' },
      2: { type: 'star', icon: '⭐', name: 'Safe Bell Zone' },
      6: { type: 'star', icon: '⭐', name: 'Safe Bell Zone' },
      10: { type: 'star', icon: '⭐', name: 'Safe Bell Zone' },
      14: { type: 'star', icon: '⭐', name: 'Safe Bell Zone' }
    };

    this.botQuotes = [
      "Bhondu Bot is crying in the corner... 🤖😭",
      "Arre yaar 1 kyu aata hai bot ko?! 😤",
      "Suggu itni aage chali gayi?! 🏎️💨",
      "Kismat hi kharab hai bot ki... 🥲",
      "Bot is requesting a restart! (Denied! 😂)"
    ];

    this.sugguQuotes = [
      "Zoom zoom babu! 🏎️✨",
      "Doremon speed activated! 🚀",
      "Momos energy on top! 🥟😋",
      "Bhondu bot ko peeche chhod diya! 😜",
      "Queen moves only! 👑💅"
    ];

    this.initElements();
  }

  initElements() {
    this.diceBtn = document.getElementById('ludo-roll-btn');
    this.diceDisplay = document.getElementById('ludo-dice-face');
    this.statusText = document.getElementById('ludo-status-text');
    this.boardTrack = document.getElementById('ludo-track-cells');
    this.sugguSpeech = document.getElementById('suggu-speech-bubble');
    this.botSpeech = document.getElementById('bot-speech-bubble');
    this.playerBadge = document.getElementById('ludo-player-badge');
    this.botBadge = document.getElementById('ludo-bot-badge');

    if (this.diceBtn) {
      this.diceBtn.onclick = () => this.handlePlayerRoll();
    }

    this.renderTrack();
    this.updateTokens();
  }

  renderTrack() {
    if (!this.boardTrack) return;
    this.boardTrack.innerHTML = '';

    for (let i = 0; i <= this.totalSteps; i++) {
      const cell = document.createElement('div');
      cell.className = 'ludo-cell';
      cell.dataset.step = i;

      if (i === 0) {
        cell.classList.add('cell-start');
        cell.innerHTML = '<span class="cell-label">🏰 START</span>';
      } else if (i === this.totalSteps) {
        cell.classList.add('cell-home');
        cell.innerHTML = '<span class="cell-label">👑 HOME 🏆</span>';
      } else if (this.tiles[i]) {
        const t = this.tiles[i];
        cell.classList.add(`cell-${t.type}`);
        cell.innerHTML = `<span class="tile-icon">${t.icon}</span><span class="cell-number">${i}</span>`;
      } else {
        cell.innerHTML = `<span class="cell-number">${i}</span>`;
      }

      this.boardTrack.appendChild(cell);
    }
  }

  showSpeech(who, text) {
    const el = who === 'player' ? this.sugguSpeech : this.botSpeech;
    if (!el) return;
    el.innerText = text;
    el.classList.remove('hidden');
    el.classList.add('pop-speech');
    clearTimeout(el.speechTimeout);
    el.speechTimeout = setTimeout(() => {
      el.classList.remove('pop-speech');
      el.classList.add('hidden');
    }, 2400);
  }

  handlePlayerRoll() {
    if (this.isRolling || this.currentTurn !== 'player' || this.gameOver) return;

    this.isRolling = true;
    this.diceBtn.disabled = true;
    this.turnCount++;

    const remaining = this.totalSteps - this.playerPos;

    // Rigged high-energy rolls for Suggu
    let roll;
    if (remaining <= 6) {
      roll = remaining; // Perfect finish!
    } else {
      // Lucky 6s, 5s and 4s
      const rolls = [6, 5, 6, 4, 5, 6];
      roll = rolls[Math.floor(Math.random() * rolls.length)];
      if (this.playerPos + roll > this.totalSteps) {
        roll = this.totalSteps - this.playerPos;
      }
    }

    // Trigger Screen Shake on 6!
    if (roll === 6) {
      document.body.classList.add('screen-shake');
      setTimeout(() => document.body.classList.remove('screen-shake'), 400);
    }

    this.animateDice(roll, () => {
      const quote = this.sugguQuotes[Math.floor(Math.random() * this.sugguQuotes.length)];
      this.showSpeech('player', quote);

      this.moveToken('player', roll, () => {
        // Check for Powerup Tile!
        const tile = this.tiles[this.playerPos];
        if (tile && tile.type === 'rocket') {
          this.statusText.innerText = "🚀 ROCKET BOOST ACTIVATED! +3 Tiles! 🏎️💨";
          this.showSpeech('player', "Turborocket babyyy! 🚀");
          if (window.AudioEffects) window.AudioEffects.playSuccessTone();

          setTimeout(() => {
            const boost = Math.min(3, this.totalSteps - this.playerPos);
            this.moveToken('player', boost, () => this.afterPlayerMove(roll));
          }, 500);
        } else if (tile && tile.type === 'momos') {
          this.statusText.innerText = "🥟 MOMOS POWER! Extra roll for Suggu! 😋";
          this.showSpeech('player', "Momos khila diye tune! Free roll! 🥟");
          if (window.AudioEffects) window.AudioEffects.playSuccessTone();
          setTimeout(() => {
            this.isRolling = false;
            this.diceBtn.disabled = false;
            this.statusText.innerText = "Chalo Suggu baby, ek aur roll karo! 🎲";
          }, 600);
        } else {
          this.afterPlayerMove(roll);
        }
      });
    });
  }

  afterPlayerMove(roll) {
    if (this.playerPos >= this.totalSteps) {
      this.handleVictory();
      return;
    }

    // Bonus roll on 6
    if (roll === 6 && (this.totalSteps - this.playerPos) > 3) {
      this.statusText.innerText = "🎉 6 AAYA HAI! Ek aur roll banta hai Suggu ka! 🔥";
      this.showSpeech('player', "6 aaya re! Hat jao aage se! 💅");
      this.isRolling = false;
      this.diceBtn.disabled = false;
    } else {
      this.currentTurn = 'bot';
      this.statusText.innerText = "🤖 Bhondu Bot koshish kar raha hai...";
      if (this.playerBadge) this.playerBadge.classList.remove('active');
      if (this.botBadge) this.botBadge.classList.add('active');
      setTimeout(() => this.botTurn(), 900);
    }
  }

  botTurn() {
    if (this.gameOver) return;

    // Bot rolls poorly (1 or 2)
    const roll = Math.random() > 0.6 ? 2 : 1;
    const botQuote = this.botQuotes[Math.floor(Math.random() * this.botQuotes.length)];
    this.showSpeech('bot', botQuote);

    this.animateDice(roll, () => {
      this.moveToken('bot', roll, () => {
        this.currentTurn = 'player';
        this.isRolling = false;
        this.diceBtn.disabled = false;
        if (this.playerBadge) this.playerBadge.classList.add('active');
        if (this.botBadge) this.botBadge.classList.remove('active');
        this.statusText.innerText = `Chalo meri Ludo Queen, tumhari baari! Roll The Dice! 🎲`;
      });
    });
  }

  animateDice(finalValue, callback) {
    let count = 0;
    this.diceDisplay.classList.add('rolling');
    if (window.AudioEffects) window.AudioEffects.playClick();

    const interval = setInterval(() => {
      const tempRoll = Math.floor(Math.random() * 6) + 1;
      this.diceDisplay.innerText = this.getDiceIcon(tempRoll);
      count++;
      if (count > 7) {
        clearInterval(interval);
        this.diceDisplay.classList.remove('rolling');
        this.diceDisplay.innerText = this.getDiceIcon(finalValue);
        if (window.AudioEffects) window.AudioEffects.playSuccessTone();
        setTimeout(callback, 260);
      }
    }, 75);
  }

  getDiceIcon(val) {
    const diceIcons = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
    return diceIcons[val - 1] || '🎲';
  }

  moveToken(who, steps, callback) {
    let currentStep = 0;
    const interval = setInterval(() => {
      if (who === 'player') {
        if (this.playerPos < this.totalSteps) this.playerPos++;
      } else {
        if (this.botPos < this.totalSteps - 3) this.botPos++; // Bot never reaches Home
      }
      this.updateTokens();
      if (window.AudioEffects) window.AudioEffects.playClick();
      currentStep++;

      if (currentStep >= steps || (who === 'player' && this.playerPos >= this.totalSteps)) {
        clearInterval(interval);
        setTimeout(callback, 260);
      }
    }, 200);
  }

  updateTokens() {
    document.querySelectorAll('.ludo-token').forEach(el => el.remove());

    const playerCell = document.querySelector(`.ludo-cell[data-step="${this.playerPos}"]`);
    const botCell = document.querySelector(`.ludo-cell[data-step="${this.botPos}"]`);

    if (playerCell) {
      const pToken = document.createElement('div');
      pToken.className = 'ludo-token token-player pulse-jump';
      pToken.innerHTML = '👑<span class="token-name">Suggu</span>';
      playerCell.appendChild(pToken);
    }

    if (botCell) {
      const bToken = document.createElement('div');
      bToken.className = 'ludo-token token-bot';
      bToken.innerHTML = '🤖<span class="token-name">Bot</span>';
      botCell.appendChild(bToken);
    }
  }

  handleVictory() {
    this.gameOver = true;
    this.diceBtn.disabled = true;
    this.statusText.innerHTML = "🏆 <b>SUGGU IS THE LUDO CHAMPION!</b> 👑✨";
    this.showSpeech('player', "Trophy meri hai! Bhondu Bot haar gaya! 🏆🎉");

    if (window.confetti) {
      window.confetti({ particleCount: 140, spread: 90, origin: { y: 0.6 } });
    }

    if (window.AudioEffects) window.AudioEffects.playFanfare();

    setTimeout(() => {
      if (window.App) window.App.unlockLoveLetter(3);
    }, 1400);
  }
}

window.MiniLudoGame = MiniLudoGame;
