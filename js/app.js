/**
 * Main Application Orchestrator
 * State machine, level navigation bar with lock checks,
 * reference lock screen handler, typewriter handwritten letters,
 * and grand finale unboxing!
 */

class BirthdayApp {
  constructor() {
    this.config = window.SURPRISE_CONFIG;
    this.currentScreen = 'screen-intro';
    this.maxUnlockedLevel = 0; // 0 = Gate, 1 = Trivia1, 2 = Trivia2, 3 = Ludo, 4 = Catch, 5 = Finale
    this.trivia1Index = 0;
    this.trivia1Attempts = 0;
    this.trivia2Index = 0;
    this.trivia2Attempts = 0;
    this.hintIndex = 0;

    this.init();
  }

  init() {
    this.bindEvents();
    this.initNavbar();
    this.initScratchCard();
  }

  bindEvents() {
    // Music Button
    const musicBtn = document.getElementById('music-toggle-btn');
    if (musicBtn) {
      musicBtn.onclick = () => {
        if (window.AudioEffects) window.AudioEffects.toggleMusic();
      };
    }

    // Password Check
    const unlockBtn = document.getElementById('unlock-password-btn');
    const passwordInput = document.getElementById('password-input');
    if (unlockBtn && passwordInput) {
      unlockBtn.onclick = () => this.checkPassword();
      passwordInput.onkeypress = (e) => {
        if (e.key === 'Enter') this.checkPassword();
      };
      // Nobita, Shizuka & Gian playfully react while she types
      const friendsCorner = document.getElementById('friends-corner');
      passwordInput.oninput = () => {
        if (!friendsCorner) return;
        friendsCorner.classList.remove('reacting');
        void friendsCorner.offsetWidth;
        friendsCorner.classList.add('reacting');
      };
    }

    // Trivia 1 (Level 1)
    const t1Submit = document.getElementById('trivia1-submit-btn');
    const t1Input = document.getElementById('trivia1-input');
    if (t1Submit && t1Input) {
      t1Submit.onclick = () => this.checkTrivia1();
      t1Input.onkeypress = (e) => {
        if (e.key === 'Enter') this.checkTrivia1();
      };
    }

    // Trivia 2 (Level 2)
    const t2Submit = document.getElementById('trivia2-submit-btn');
    const t2Input = document.getElementById('trivia2-input');
    if (t2Submit && t2Input) {
      t2Submit.onclick = () => this.checkTrivia2();
      t2Input.onkeypress = (e) => {
        if (e.key === 'Enter') this.checkTrivia2();
      };
    }

    // Love Letter Modal Next Button
    const letterNextBtn = document.getElementById('letter-next-btn');
    if (letterNextBtn) {
      letterNextBtn.onclick = () => this.handleLetterNext();
    }

    // Lock Warning Modal Close Button
    const lockCloseBtn = document.getElementById('lock-warning-close-btn');
    const lockModal = document.getElementById('lock-warning-modal');
    if (lockCloseBtn && lockModal) {
      lockCloseBtn.onclick = () => {
        lockModal.style.display = 'none';
        lockModal.classList.add('hidden');
      };
      lockModal.onclick = (e) => {
        if (e.target === lockModal) {
          lockModal.style.display = 'none';
          lockModal.classList.add('hidden');
        }
      };
    }

    // Gift Box Unbox
    const giftBox = document.getElementById('gift-box-3d');
    if (giftBox) {
      giftBox.onclick = () => this.unboxGift();
    }
  }

  // --- Top Level Navigation Bar ---
  initNavbar() {
    const navItems = document.querySelectorAll('.nav-level-item');
    navItems.forEach(item => {
      item.onclick = () => {
        const targetScreen = item.getAttribute('data-screen');
        const targetLevel = parseInt(item.getAttribute('data-level'), 10);

        if (targetLevel > this.maxUnlockedLevel) {
          // Locked level attempt -> Trigger the requested popup!
          this.showLockedWarningPopup();
        } else {
          // Unlocked level -> smooth transition!
          this.goToScreen(targetScreen);

          // Handle special screen initializations if navigating back/forth
          if (targetScreen === 'screen-trivia1' && this.trivia1Index < this.config.trivia1.questions.length) {
            this.loadTrivia1Question();
          } else if (targetScreen === 'screen-trivia2' && this.trivia2Index < this.config.trivia2.questions.length) {
            this.loadTrivia2Question();
          } else if (targetScreen === 'screen-ludo') {
            if (!this.ludoGame) this.ludoGame = new window.MiniLudoGame();
          } else if (targetScreen === 'screen-catch') {
            if (!this.catchGame) this.catchGame = new window.CatchHeartsGame('catch-canvas');
            this.catchGame.start();
          }
        }
      };
    });

    this.updateNavbarUI();
  }

  showLockedWarningPopup() {
    if (window.AudioEffects) window.AudioEffects.playWrongTone();
    const modal = document.getElementById('lock-warning-modal');
    if (modal) {
      modal.style.display = 'flex';
      modal.classList.remove('hidden');
    }
  }

  updateNavbarUI() {
    const navItems = document.querySelectorAll('.nav-level-item');
    navItems.forEach(item => {
      const level = parseInt(item.getAttribute('data-level'), 10);
      const screenId = item.getAttribute('data-screen');
      const iconSpan = item.querySelector('.nav-icon');

      if (level <= this.maxUnlockedLevel) {
        item.classList.remove('locked');
        item.classList.add('unlocked');
        const gadgetIcons = { 0: '🚪', 1: '🍞', 2: '😼', 3: '🎲', 4: '💖', 5: '🔔' };
        if (iconSpan) iconSpan.innerText = gadgetIcons[level] || '✨';
      } else {
        item.classList.add('locked');
        item.classList.remove('unlocked');
        if (iconSpan) iconSpan.innerText = '🔒';
      }

      if (screenId === this.currentScreen) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  // --- Password Gatekeeper ---
  checkPassword() {
    const input = document.getElementById('password-input');
    const pillBox = document.getElementById('password-pill-container');
    const hintBox = document.getElementById('password-hint-box');
    const userVal = input.value.trim().toLowerCase();
    const correctVal = this.config.auth.password.toLowerCase();

    if (userVal === correctVal) {
      // Correct!
      if (window.AudioEffects) window.AudioEffects.playSuccessTone();
      if (pillBox) pillBox.classList.remove('shake');
      input.classList.add('correct');
      hintBox.innerHTML = `<span style="color: #059669; font-weight: 700;">🎉 Aree waah meri Gochu! Pulling ribbon... ❤️</span>`;

      if (window.confetti) {
        window.confetti({ particleCount: 90, spread: 65 });
      }

      // Auto start music
      if (window.AudioEffects && !window.AudioEffects.isPlaying) {
        window.AudioEffects.playMusic();
        const musicBtn = document.getElementById('music-toggle-btn');
        if (musicBtn) musicBtn.classList.add('playing');
        document.querySelectorAll('.eq-bar').forEach(b => b.classList.add('animating'));
      }

      // Unlock Level 1!
      this.maxUnlockedLevel = Math.max(this.maxUnlockedLevel, 1);
      this.updateNavbarUI();

      // The 3D Pink Anywhere Door zooms in, turns its knob, and swings open!
      this.openAnywhereDoor(() => {
        this.goToScreen('screen-trivia1');
        this.loadTrivia1Question();
      });
    } else {
      // Wrong password - show requested playful hints
      if (window.AudioEffects) window.AudioEffects.playWrongTone();
      if (pillBox) {
        pillBox.classList.remove('shake');
        void pillBox.offsetWidth;
        pillBox.classList.add('shake');
      }

      const hints = this.config.auth.hints;
      const currentHint = hints[this.hintIndex % hints.length];
      this.hintIndex++;

      hintBox.innerHTML = `<div class="hint-bubble animate-pop">${currentHint}</div>`;
    }
  }

  // --- 3D Anywhere Door Transition ---
  openAnywhereDoor(onComplete) {
    const overlay = document.getElementById('anywhere-door-overlay');
    if (!overlay) { onComplete(); return; }

    overlay.classList.add('open');

    // Door zooms in, then the knob turns and it swings open with light rays
    setTimeout(() => {
      overlay.classList.add('swing');
      if (window.confetti) {
        window.confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 }, colors: ['#0ea5e9', '#ef4444', '#f59e0b', '#ec4899', '#ffffff'] });
      }
    }, 550);

    setTimeout(() => {
      overlay.classList.remove('open', 'swing');
      onComplete();
    }, 1900);
  }

  // --- Trivia 1: Level 1 ---
  loadTrivia1Question() {
    const qData = this.config.trivia1.questions[this.trivia1Index];
    const qText = document.getElementById('trivia1-question-text');
    const qCount = document.getElementById('trivia1-q-count');
    const input = document.getElementById('trivia1-input');
    const feedback = document.getElementById('trivia1-feedback');
    const revealBtn = document.getElementById('trivia1-reveal-btn');
    const heartsContainer = document.getElementById('trivia1-hearts');

    if (qText) qText.innerText = qData.question;
    if (qCount) qCount.innerText = `Question ${this.trivia1Index + 1} of ${this.config.trivia1.questions.length}`;
    if (input) {
      input.value = '';
      input.focus();
    }
    if (feedback) feedback.innerHTML = '';
    if (revealBtn) {
      revealBtn.style.display = 'none';
      revealBtn.classList.add('hidden');
    }
    if (heartsContainer) heartsContainer.innerHTML = '<span>🔔</span><span>🔔</span><span>🔔</span>';
    this.trivia1Attempts = 0;
  }

  checkTrivia1() {
    const qData = this.config.trivia1.questions[this.trivia1Index];
    const input = document.getElementById('trivia1-input');
    const feedback = document.getElementById('trivia1-feedback');
    const revealBtn = document.getElementById('trivia1-reveal-btn');
    const heartsContainer = document.getElementById('trivia1-hearts');
    const userVal = input.value.trim().toLowerCase();

    if (!userVal) return;

    const isCorrect = qData.acceptedAnswers.some(ans => userVal.includes(ans) || ans.includes(userVal));

    if (isCorrect) {
      if (window.AudioEffects) window.AudioEffects.playSuccessTone();
      feedback.innerHTML = `<div style="margin-top: 14px; padding: 12px 18px; background: #dcfce7; border: 1px solid #86efac; border-radius: 14px; color: #166534; font-weight: 700;">🎉 Sahi jawaab! ${qData.displayAnswer}</div>`;
      if (window.confetti) window.confetti({ particleCount: 50, spread: 50 });

      setTimeout(() => {
        this.trivia1Index++;
        if (this.trivia1Index < this.config.trivia1.questions.length) {
          this.loadTrivia1Question();
        } else {
          // Level 1 Complete! Unlock Level 2 in navbar & show Token 1
          this.maxUnlockedLevel = Math.max(this.maxUnlockedLevel, 2);
          this.updateNavbarUI();
          this.unlockLoveLetter(1);
        }
      }, 1200);
    } else {
      this.trivia1Attempts++;
      if (window.AudioEffects) window.AudioEffects.playWrongTone();

      // Update hearts
      if (heartsContainer) {
        if (this.trivia1Attempts === 1) heartsContainer.innerHTML = '<span>🔔</span><span>🔔</span><span>🔕</span>';
        else if (this.trivia1Attempts === 2) heartsContainer.innerHTML = '<span>🔔</span><span>🔕</span><span>🔕</span>';
        else heartsContainer.innerHTML = '<span>🤍</span><span>🤍</span><span>🤍</span>';
      }

      if (this.trivia1Attempts >= 3) {
        feedback.innerHTML = `
          <div style="margin-top: 14px; padding: 16px 20px; background: #fee2e2; border: 1px solid #f87171; border-radius: 16px; color: #991b1b; font-weight: 700; font-size: 1.05rem;">
            ${this.config.trivia1.penaltyPrompt}
          </div>
        `;
        if (revealBtn) {
          revealBtn.style.display = 'inline-flex';
          revealBtn.classList.remove('hidden');
          revealBtn.onclick = () => {
            feedback.innerHTML = `<div style="margin-top: 12px; padding: 12px; background: #eff6ff; border: 1px solid #93c5fd; border-radius: 12px; color: #1e40af; font-weight: 600;">Answer is: <b>${qData.displayAnswer}</b> (Chalo ab aage badho!)</div>`;
            setTimeout(() => {
              this.trivia1Index++;
              if (this.trivia1Index < this.config.trivia1.questions.length) {
                this.loadTrivia1Question();
              } else {
                this.maxUnlockedLevel = Math.max(this.maxUnlockedLevel, 2);
                this.updateNavbarUI();
                this.unlockLoveLetter(1);
              }
            }, 1600);
          };
        }
      } else {
        feedback.innerHTML = `<div style="margin-top: 12px; padding: 10px 16px; background: #ffe4e6; border: 1px solid #fecdd3; border-radius: 12px; color: #be185d; font-weight: 600;">Galat jawab babu! Dubara socho... (${3 - this.trivia1Attempts} tries left)</div>`;
      }
    }
  }

  // --- Trivia 2: Level 2 ---
  loadTrivia2Question() {
    const qData = this.config.trivia2.questions[this.trivia2Index];
    const qText = document.getElementById('trivia2-question-text');
    const qCount = document.getElementById('trivia2-q-count');
    const input = document.getElementById('trivia2-input');
    const feedback = document.getElementById('trivia2-feedback');
    const revealBtn = document.getElementById('trivia2-reveal-btn');
    const heartsContainer = document.getElementById('trivia2-hearts');

    if (qText) qText.innerText = qData.question;
    if (qCount) qCount.innerText = `Question ${this.trivia2Index + 1} of ${this.config.trivia2.questions.length}`;
    if (input) {
      input.value = '';
      input.focus();
    }
    if (feedback) feedback.innerHTML = '';
    if (revealBtn) {
      revealBtn.style.display = 'none';
      revealBtn.classList.add('hidden');
    }
    if (heartsContainer) heartsContainer.innerHTML = '<span>🔔</span><span>🔔</span><span>🔔</span>';
    this.trivia2Attempts = 0;
  }

  checkTrivia2() {
    const qData = this.config.trivia2.questions[this.trivia2Index];
    const input = document.getElementById('trivia2-input');
    const feedback = document.getElementById('trivia2-feedback');
    const revealBtn = document.getElementById('trivia2-reveal-btn');
    const heartsContainer = document.getElementById('trivia2-hearts');
    const userVal = input.value.trim().toLowerCase();

    if (!userVal) return;

    const isCorrect = qData.acceptedAnswers.some(ans => userVal.includes(ans) || ans.includes(userVal));

    if (isCorrect) {
      if (window.AudioEffects) window.AudioEffects.playSuccessTone();
      feedback.innerHTML = `<div style="margin-top: 14px; padding: 12px 18px; background: #dcfce7; border: 1px solid #86efac; border-radius: 14px; color: #166534; font-weight: 700;">🎉 Wahh shabit kar diya! ${qData.displayAnswer}</div>`;
      if (window.confetti) window.confetti({ particleCount: 50, spread: 50 });

      setTimeout(() => {
        this.trivia2Index++;
        if (this.trivia2Index < this.config.trivia2.questions.length) {
          this.loadTrivia2Question();
        } else {
          // Level 2 Complete! Unlock Level 3 in navbar & show Token 2
          this.maxUnlockedLevel = Math.max(this.maxUnlockedLevel, 3);
          this.updateNavbarUI();
          this.unlockLoveLetter(2);
        }
      }, 1200);
    } else {
      this.trivia2Attempts++;
      if (window.AudioEffects) window.AudioEffects.playWrongTone();

      if (heartsContainer) {
        if (this.trivia2Attempts === 1) heartsContainer.innerHTML = '<span>🔔</span><span>🔔</span><span>🔕</span>';
        else if (this.trivia2Attempts === 2) heartsContainer.innerHTML = '<span>🔔</span><span>🔕</span><span>🔕</span>';
        else heartsContainer.innerHTML = '<span>🤍</span><span>🤍</span><span>🤍</span>';
      }

      if (this.trivia2Attempts >= 3) {
        feedback.innerHTML = `
          <div style="margin-top: 14px; padding: 16px 20px; background: #fee2e2; border: 1px solid #f87171; border-radius: 16px; color: #991b1b; font-weight: 700; font-size: 1.05rem;">
            ${this.config.trivia2.penaltyPrompt}
          </div>
        `;
        if (revealBtn) {
          revealBtn.style.display = 'inline-flex';
          revealBtn.classList.remove('hidden');
          revealBtn.onclick = () => {
            feedback.innerHTML = `<div style="margin-top: 12px; padding: 12px; background: #eff6ff; border: 1px solid #93c5fd; border-radius: 12px; color: #1e40af; font-weight: 600;">Answer is: <b>${qData.displayAnswer}</b></div>`;
            setTimeout(() => {
              this.trivia2Index++;
              if (this.trivia2Index < this.config.trivia2.questions.length) {
                this.loadTrivia2Question();
              } else {
                this.maxUnlockedLevel = Math.max(this.maxUnlockedLevel, 3);
                this.updateNavbarUI();
                this.unlockLoveLetter(2);
              }
            }, 1600);
          };
        }
      } else {
        feedback.innerHTML = `<div style="margin-top: 12px; padding: 10px 16px; background: #ffe4e6; border: 1px solid #fecdd3; border-radius: 12px; color: #be185d; font-weight: 600;">Are re galat! Socho socho... (${3 - this.trivia2Attempts} tries left)</div>`;
      }
    }
  }

  // --- Typewriter Handwritten Love Letters ---
  unlockLoveLetter(levelNumber) {
    const letterData = this.config.loveNotes.find(n => n.level === levelNumber);
    if (!letterData) return;

    this.activeLetterLevel = levelNumber;
    const modal = document.getElementById('letter-modal');
    const badgeEl = document.getElementById('letter-modal-badge');
    const titleEl = document.getElementById('letter-modal-title');
    const contentEl = document.getElementById('letter-modal-content');
    const nextBtn = document.getElementById('letter-next-btn');

    if (badgeEl) badgeEl.innerText = letterData.badge;
    if (titleEl) titleEl.innerText = letterData.title;
    if (contentEl) contentEl.innerHTML = '';
    if (nextBtn) {
      nextBtn.style.opacity = '0';
      nextBtn.disabled = true;
    }

    modal.style.display = 'flex';
    modal.classList.remove('hidden');
    modal.classList.add('animate-fade-in');

    if (window.confetti) {
      window.confetti({ particleCount: 70, spread: 75, origin: { y: 0.4 } });
    }

    let charIdx = 0;
    const rawText = letterData.content;
    const speed = 25;

    if (this.typeInterval) clearInterval(this.typeInterval);

    // Click on modal anywhere to instantly complete note
    const finishInstant = () => {
      clearInterval(this.typeInterval);
      contentEl.innerHTML = rawText.replace(/\n/g, '<br>');
      if (nextBtn) {
        nextBtn.style.opacity = '1';
        nextBtn.disabled = false;
      }
    };
    modal.onclick = (e) => {
      if (e.target !== nextBtn && !nextBtn.contains(e.target)) {
        finishInstant();
      }
    };

    this.typeInterval = setInterval(() => {
      if (charIdx < rawText.length) {
        const char = rawText[charIdx];
        if (char === '\n') {
          contentEl.innerHTML += '<br>';
        } else {
          contentEl.innerHTML += char;
        }
        charIdx++;
        contentEl.scrollTop = contentEl.scrollHeight;
      } else {
        clearInterval(this.typeInterval);
        if (nextBtn) {
          nextBtn.style.opacity = '1';
          nextBtn.disabled = false;
        }
      }
    }, speed);
  }

  handleLetterNext() {
    const modal = document.getElementById('letter-modal');
    modal.style.display = 'none';
    modal.classList.add('hidden');
    modal.onclick = null;
    if (this.typeInterval) clearInterval(this.typeInterval);

    const level = this.activeLetterLevel;
    if (level === 1) {
      this.maxUnlockedLevel = Math.max(this.maxUnlockedLevel, 2);
      this.updateNavbarUI();
      this.goToScreen('screen-trivia2');
      this.loadTrivia2Question();
    } else if (level === 2) {
      this.maxUnlockedLevel = Math.max(this.maxUnlockedLevel, 3);
      this.updateNavbarUI();
      this.goToScreen('screen-ludo');
      if (!this.ludoGame) {
        this.ludoGame = new window.MiniLudoGame();
      }
    } else if (level === 3) {
      this.maxUnlockedLevel = Math.max(this.maxUnlockedLevel, 4);
      this.updateNavbarUI();
      this.goToScreen('screen-catch');
      if (!this.catchGame) {
        this.catchGame = new window.CatchHeartsGame('catch-canvas');
      }
      this.catchGame.start();
    } else if (level === 4) {
      this.maxUnlockedLevel = Math.max(this.maxUnlockedLevel, 5);
      this.updateNavbarUI();
      this.goToScreen('screen-finale');
      if (window.confetti) {
        window.confetti({ particleCount: 70, spread: 60, origin: { y: 0.5 } });
      }
    }
  }

  // --- Grand Finale Unboxing & Scratch Card ---
  unboxGift() {
    const giftBox = document.getElementById('gift-box-3d');
    const revealedStage = document.getElementById('gift-revealed-stage');

    if (!giftBox || giftBox.classList.contains('opened')) return;
    giftBox.classList.add('opened');

    if (window.AudioEffects) window.AudioEffects.playFanfare();

    this.triggerGrandFireworks();

    setTimeout(() => {
      giftBox.style.display = 'none';
      if (revealedStage) {
        revealedStage.style.display = 'block';
        revealedStage.classList.remove('hidden');
        revealedStage.classList.add('animate-pop');
        this.initScratchCard();
      }
    }, 900);
  }

  initScratchCard() {
    const canvas = document.getElementById('scratch-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const width = (canvas.width = 300);
    const height = (canvas.height = 140);

    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#f59e0b');
    grad.addColorStop(0.5, '#fef08a');
    grad.addColorStop(1, '#d97706');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    ctx.font = 'bold 16px Plus Jakarta Sans, sans-serif';
    ctx.fillStyle = '#78350f';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✨ Scratch Here to Reveal! ✨', width / 2, height / 2);

    let isScratching = false;

    const scratch = (x, y) => {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 18, 0, Math.PI * 2);
      ctx.fill();
    };

    const handleScratch = (e) => {
      if (!isScratching) return;
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      scratch(x, y);
    };

    canvas.onmousedown = () => (isScratching = true);
    canvas.onmouseup = () => (isScratching = false);
    canvas.onmouseleave = () => (isScratching = false);
    canvas.onmousemove = handleScratch;

    canvas.ontouchstart = (e) => {
      isScratching = true;
      handleScratch(e);
    };
    canvas.ontouchend = () => (isScratching = false);
    canvas.ontouchmove = handleScratch;
  }

  triggerGrandFireworks() {
    if (!window.confetti) return;

    const duration = 4000;
    const end = Date.now() + duration;

    const interval = setInterval(() => {
      if (Date.now() > end) {
        return clearInterval(interval);
      }

      window.confetti({
        startVelocity: 35,
        spread: 360,
        ticks: 60,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
        colors: ['#f43f5e', '#ec4899', '#fef08a', '#c084fc', '#60a5fa']
      });
    }, 280);
  }

  // --- Screen Navigation Helper ---
  goToScreen(screenId) {
    document.querySelectorAll('.app-screen').forEach(sc => {
      sc.classList.remove('active');
      sc.classList.add('hidden');
    });

    const target = document.getElementById(screenId);
    if (target) {
      target.classList.remove('hidden');
      target.classList.add('active', 'animate-fade-in');
      this.currentScreen = screenId;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    this.updateNavbarUI();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.App = new BirthdayApp();
});
