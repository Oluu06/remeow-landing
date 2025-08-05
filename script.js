// --- TYPEWRITER EFFECT FOR STORY ---
const storyText = `In the ashes of forgotten rug pulls, one meme refused to die.\nHe wasn’t just any cat — he was ReMeow, forged in FOMO, trained by the whales, and raised by validators in the depths of DeFi.\nLeft for dead, he clawed his way back through dusty wallets and broken blockchains.\nNow, his eyes burn with laser vengeance. His fur sparkles with LP dust.\nAnd he's here to remind every degen:\nYou can’t kill a meme with nine lives.`;
const storyBlock = document.getElementById('story-block');
let i = 0;
function typeWriter() {
  if (i < storyText.length) {
    storyBlock.textContent += storyText.charAt(i);
    i++;
    setTimeout(typeWriter, 18);
  } else {
    storyBlock.classList.add('visible');
  }
}
window.addEventListener('DOMContentLoaded', typeWriter);

// --- COPY TO CLIPBOARD ---
const copyBtn = document.getElementById('copy-btn');
const tokenAddr = document.getElementById('token-address');
const tooltip = document.getElementById('copy-tooltip');
copyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(tokenAddr.textContent);
  tooltip.classList.add('active');
  setTimeout(() => tooltip.classList.remove('active'), 1200);
});

// --- SOUND EFFECTS ---
const catImg = document.getElementById('cat-img');
const meowSound = new Audio('https://cdn.pixabay.com/audio/2022/07/26/audio_12c6b7b2b7.mp3'); // meow
catImg.addEventListener('mouseenter', () => {
  meowSound.currentTime = 0;
  meowSound.play();
});
catImg.addEventListener('touchstart', () => {
  meowSound.currentTime = 0;
  meowSound.play();
});

// --- PARTICLES / FLOATING EMOJIS ---
const particlesBg = document.getElementById('particles-bg');
const emojis = ['🐾','😺','💸','😼','💰','😻','😹','🔥','🟣','🟢','🔵','💎','😽','😾','😿','👾','🪙','🔫','🌑','🚀'];
function createParticle() {
  const el = document.createElement('span');
  el.textContent = emojis[Math.floor(Math.random()*emojis.length)];
  el.style.position = 'absolute';
  el.style.fontSize = `${Math.random()*2+1.2}rem`;
  el.style.left = `${Math.random()*100}vw`;
  el.style.top = `${Math.random()*100}vh`;
  el.style.opacity = Math.random()*0.7+0.3;
  el.style.filter = 'drop-shadow(0 0 8px #8f00ff)';
  el.style.transition = 'top 12s linear, left 12s linear, opacity 2s';
  particlesBg.appendChild(el);
  setTimeout(() => {
    el.style.top = `${Math.random()*100}vh`;
    el.style.left = `${Math.random()*100}vw`;
    el.style.opacity = 0.1;
  }, 100);
  setTimeout(() => el.remove(), 12000);
}
setInterval(createParticle, 600);
for(let j=0;j<18;j++) createParticle();

// --- SCROLL ANIMATIONS ---
function revealOnScroll() {
  document.querySelectorAll('.fade-in, .slide-up').forEach(el => {
    const rect = el.getBoundingClientRect();
    if(rect.top < window.innerHeight - 60) {
      el.classList.add('visible');
    }
  });
}
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('DOMContentLoaded', revealOnScroll);

// --- ANIMATE SECTIONS ---
document.querySelectorAll('.tokenomics, .roadmap, .token-address').forEach((el,i) => {
  el.classList.add(i%2===0 ? 'fade-in' : 'slide-up');
});

// --- GAME FUNCTIONALITY ---
class ReMeowGame {
  constructor() {
    this.score = 0;
    this.timeLeft = 30;
    this.level = 1;
    this.lives = 9;
    this.maxLives = 9;
    this.isPlaying = false;
    this.gameInterval = null;
    this.spawnInterval = null;
    this.baseSpeed = 3; // Starting speed (seconds)
    this.currentSpeed = this.baseSpeed;
    this.speedIncrement = 0.2; // Speed increase per level
    this.coins = []; // Track active coins
    this.gameContainer = document.getElementById('game-container');
    this.cat = document.getElementById('game-cat');
    this.scoreDisplay = document.getElementById('game-score');
    this.timeDisplay = document.getElementById('game-time');
    this.levelDisplay = document.getElementById('game-level');
    this.livesDisplay = document.getElementById('game-lives');
    this.gameOver = document.getElementById('game-over');
    this.finalScore = document.getElementById('final-score');
    this.achievement = document.getElementById('achievement');
    this.startBtn = document.getElementById('start-game-btn');
    this.restartBtn = document.getElementById('restart-game-btn');
    
    this.initializeGame();
  }

  initializeGame() {
    this.startBtn.addEventListener('click', () => this.startGame());
    this.restartBtn.addEventListener('click', () => this.restartGame());
    
    // Move cat with mouse
    this.gameContainer.addEventListener('mousemove', (e) => {
      if (this.isPlaying) {
        const rect = this.gameContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const catWidth = this.cat.offsetWidth;
        const maxX = this.gameContainer.offsetWidth - catWidth;
        const newX = Math.max(0, Math.min(maxX, x - catWidth / 2));
        this.cat.style.left = newX + 'px';
        this.cat.style.transform = 'none';
      }
    });
  }

  startGame() {
    this.isPlaying = true;
    this.score = 0;
    this.timeLeft = 60; // Más tiempo para más niveles
    this.level = 1;
    this.lives = this.maxLives;
    this.currentSpeed = this.baseSpeed;
    this.coins = [];
    this.coinsPerLevel = 0; // Contador de monedas por nivel
    this.coinsRequiredForNextLevel = 5; // Monedas necesarias para subir de nivel
    this.startBtn.style.display = 'none';
    this.gameOver.style.display = 'none';
    this.updateDisplay();
    
    // Start game timer
    this.gameInterval = setInterval(() => {
      this.timeLeft--;
      this.updateDisplay();
      
      if (this.timeLeft <= 0) {
        this.endGame();
      }
    }, 1000);
    
    // Start spawning coins
    this.spawnCoins();
  }

  levelUp() {
    this.level++;
    
    // Aumentar dificultad de manera progresiva
    this.currentSpeed = Math.max(this.baseSpeed - (this.level - 1) * 0.3, 0.5); // Más rápido
    this.coinsRequiredForNextLevel = Math.floor(this.coinsRequiredForNextLevel * 1.4); // Más monedas necesarias
    this.coinsPerLevel = 0; // Resetear contador
    
    // Bonus de tiempo por subir de nivel
    const timeBonus = Math.max(10 - this.level, 3);
    this.timeLeft += timeBonus;
    
    // Efectos especiales por nivel
    this.applyLevelEffects();
    
    this.showNotification(`🎉 LEVEL ${this.level}! Speed: x${(this.baseSpeed/this.currentSpeed).toFixed(1)} | +${timeBonus}s`, '#00ff88');
    
    // Restart spawn interval with new speed
    if (this.spawnInterval) {
      clearInterval(this.spawnInterval);
      this.spawnCoins();
    }
  }

  applyLevelEffects() {
    // Efectos especiales basados en el nivel
    if (this.level === 3) {
      this.showNotification('💰 Double Points Activated!', '#ffd700');
    } else if (this.level === 5) {
      this.showNotification('🔥 Speed Boost Unlocked!', '#ff4444');
    } else if (this.level === 7) {
      this.showNotification('⚡ Triple Points Mode!', '#00ffff');
    } else if (this.level === 10) {
      this.showNotification('🌟 LEGENDARY MODE! Mega Rewards!', '#ff00ff');
    } else if (this.level >= 15) {
      this.showNotification('🚀 IMPOSSIBLE MODE! You are insane!', '#ffffff');
    }
  }

  getPointsMultiplier() {
    // Multiplicador de puntos basado en nivel
    if (this.level >= 15) return 8; // Modo imposible
    if (this.level >= 10) return 5; // Modo legendario
    if (this.level >= 7) return 3;  // Triple points
    if (this.level >= 3) return 2;  // Double points
    return 1; // Normal
  }

  spawnCoins() {
    // Velocidad de spawn más agresiva basada en nivel
    let baseSpawnRate = 1200;
    let spawnRate = Math.max(baseSpawnRate - (this.level * 100), 300); // Mínimo 300ms
    
    // A partir del nivel 5, spawn múltiple ocasional
    const multiSpawnChance = Math.min(this.level * 0.05, 0.3); // Max 30% chance
    
    this.spawnInterval = setInterval(() => {
      if (this.isPlaying) {
        this.createCoin();
        
        // Spawn múltiple en niveles altos
        if (this.level >= 5 && Math.random() < multiSpawnChance) {
          setTimeout(() => {
            if (this.isPlaying) this.createCoin();
          }, 200);
        }
        
        // Spawn triple en niveles muy altos
        if (this.level >= 10 && Math.random() < 0.15) {
          setTimeout(() => {
            if (this.isPlaying) this.createCoin();
          }, 400);
        }
      }
    }, spawnRate);
  }

  createCoin() {
    const coin = document.createElement('div');
    coin.className = 'falling-coin';
    coin.textContent = '🪙';
    coin.style.left = Math.random() * (this.gameContainer.offsetWidth - 50) + 'px';
    coin.style.animationDuration = this.currentSpeed + 's';
    coin.dataset.collected = 'false';
    
    // Add click event to collect coin
    coin.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.collectCoin(coin, e);
    });
    
    this.gameContainer.appendChild(coin);
    this.coins.push(coin);
    
    // Start collision detection for this coin
    this.startCollisionDetection(coin);
    
    // Remove coin after animation and check if missed
    const removeTimeout = setTimeout(() => {
      if (coin.parentNode && coin.dataset.collected === 'false') {
        this.loseLive();
        this.removeCoin(coin);
      }
    }, this.currentSpeed * 1000 + 200);
    
    // Store timeout reference to clear it if coin is collected
    coin.removeTimeout = removeTimeout;
  }

  startCollisionDetection(coin) {
    const collisionInterval = setInterval(() => {
      if (!coin.parentNode || coin.dataset.collected === 'true' || !this.isPlaying) {
        clearInterval(collisionInterval);
        return;
      }
      
      if (this.checkCollision(coin, this.cat)) {
        clearInterval(collisionInterval);
        this.collectCoinCollision(coin);
      }
    }, 50); // Check every 50ms for smooth collision detection
    
    // Store interval reference to clear it when coin is removed
    coin.collisionInterval = collisionInterval;
  }

  checkCollision(coin, cat) {
    const coinRect = coin.getBoundingClientRect();
    const catRect = cat.getBoundingClientRect();
    
    // Expanded collision area for better gameplay
    const buffer = 10;
    
    return coinRect.left < catRect.right + buffer &&
           coinRect.right > catRect.left - buffer &&
           coinRect.top < catRect.bottom + buffer &&
           coinRect.bottom > catRect.top - buffer;
  }

  collectCoinCollision(coin) {
    if (!this.isPlaying || coin.dataset.collected === 'true') return;
    
    // Mark coin as collected immediately
    coin.dataset.collected = 'true';
    
    const basePoints = this.level * 10;
    const multiplier = this.getPointsMultiplier();
    const points = basePoints * multiplier;
    
    this.score += points;
    this.coinsPerLevel++;
    this.updateDisplay();
    
    // Check for level up
    if (this.coinsPerLevel >= this.coinsRequiredForNextLevel) {
      this.levelUp();
    }
    
    // Create collection effect at coin position
    const coinRect = coin.getBoundingClientRect();
    const containerRect = this.gameContainer.getBoundingClientRect();
    
    let effectText = `+${points}`;
    if (multiplier > 1) {
      effectText = `+${points} (x${multiplier})`;
    }
    
    this.createCollectEffect(
      coinRect.left + coinRect.width / 2, 
      coinRect.top + coinRect.height / 2, 
      effectText
    );
    
    // Play sound effect
    this.playCollectSound();
    
    // Remove coin immediately from DOM
    this.removeCoin(coin);
    
    // Extra time bonus for high scores (less frequent)
    if (this.score % 1000 === 0) {
      this.timeLeft += 8;
      this.showNotification('+8 seconds! 🎉', '#ffaa00');
    }
  }

  collectCoin(coin, event) {
    if (!this.isPlaying || coin.dataset.collected === 'true') return;
    
    // Mark coin as collected immediately
    coin.dataset.collected = 'true';
    
    const basePoints = this.level * 10;
    const multiplier = this.getPointsMultiplier();
    const points = basePoints * multiplier;
    
    this.score += points;
    this.coinsPerLevel++;
    this.updateDisplay();
    
    // Check for level up
    if (this.coinsPerLevel >= this.coinsRequiredForNextLevel) {
      this.levelUp();
    }
    
    // Create collection effect
    let effectText = `+${points}`;
    if (multiplier > 1) {
      effectText = `+${points} (x${multiplier})`;
    }
    
    this.createCollectEffect(event.clientX, event.clientY, effectText);
    
    // Play sound effect
    this.playCollectSound();
    
    // Remove coin immediately from DOM
    this.removeCoin(coin);
    
    // Extra time bonus for high scores (less frequent)
    if (this.score % 1000 === 0) {
      this.timeLeft += 8;
      this.showNotification('+8 seconds! 🎉', '#ffaa00');
    }
  }

  removeCoin(coin) {
    // Clear timeout if it exists
    if (coin.removeTimeout) {
      clearTimeout(coin.removeTimeout);
    }
    
    // Clear collision detection interval if it exists
    if (coin.collisionInterval) {
      clearInterval(coin.collisionInterval);
    }
    
    // Remove from DOM immediately
    if (coin && coin.parentNode) {
      coin.parentNode.removeChild(coin);
    }
    
    // Remove from coins array
    const index = this.coins.indexOf(coin);
    if (index > -1) {
      this.coins.splice(index, 1);
    }
  }

  loseLive() {
    this.lives--;
    this.updateDisplay();
    
    if (this.lives <= 0) {
      this.endGame();
    } else {
      // Show life lost notification
      this.showNotification(`Life Lost! ${this.lives} remaining`, '#ff4444');
      
      // Flash screen red briefly
      this.gameContainer.style.boxShadow = '0 0 30px #ff4444';
      setTimeout(() => {
        this.gameContainer.style.boxShadow = '0 0 20px rgba(0, 255, 136, 0.2)';
      }, 300);
    }
  }

  createCollectEffect(x, y, text) {
    const effect = document.createElement('div');
    effect.className = 'coin-collect-effect';
    effect.textContent = text;
    effect.style.left = (x - this.gameContainer.getBoundingClientRect().left) + 'px';
    effect.style.top = (y - this.gameContainer.getBoundingClientRect().top) + 'px';
    
    this.gameContainer.appendChild(effect);
    
    setTimeout(() => {
      if (effect.parentNode) {
        effect.parentNode.removeChild(effect);
      }
    }, 1000);
  }

  playCollectSound() {
    // Create a simple beep sound using Web Audio API
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800 + (this.level * 100); // Higher pitch per level
      oscillator.type = 'square';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
      // Fallback for browsers that don't support Web Audio API
      console.log('Coin collected!');
    }
  }

  showNotification(text, color) {
    const notification = document.createElement('div');
    notification.style.position = 'absolute';
    notification.style.top = '20px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.color = color;
    notification.style.fontSize = '1.5em';
    notification.style.fontWeight = 'bold';
    notification.style.zIndex = '1000';
    notification.style.animation = 'collectEffect 2s ease-out forwards';
    notification.style.textShadow = '0 0 10px rgba(0,0,0,0.8)';
    notification.textContent = text;
    
    this.gameContainer.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 2000);
  }

  updateDisplay() {
    this.scoreDisplay.textContent = this.score;
    this.timeDisplay.textContent = this.timeLeft;
    this.levelDisplay.textContent = this.level;
    this.livesDisplay.textContent = this.lives;
    
    // Mostrar progreso del nivel
    const progress = this.coinsPerLevel / this.coinsRequiredForNextLevel;
    const progressText = ` (${this.coinsPerLevel}/${this.coinsRequiredForNextLevel})`;
    this.levelDisplay.textContent = this.level + progressText;
    
    // Update lives color based on remaining lives (9 lives system)
    if (this.lives <= 2) {
      this.livesDisplay.parentElement.style.background = 'rgba(255, 68, 68, 0.3)';
      this.livesDisplay.parentElement.style.borderColor = '#ff4444';
    } else if (this.lives <= 4) {
      this.livesDisplay.parentElement.style.background = 'rgba(255, 170, 0, 0.3)';
      this.livesDisplay.parentElement.style.borderColor = '#ffaa00';
    } else if (this.lives <= 6) {
      this.livesDisplay.parentElement.style.background = 'rgba(255, 255, 0, 0.3)';
      this.livesDisplay.parentElement.style.borderColor = '#ffff00';
    } else {
      this.livesDisplay.parentElement.style.background = 'rgba(102, 126, 234, 0.3)';
      this.livesDisplay.parentElement.style.borderColor = '#667eea';
    }
    
    // Update level display color based on multiplier
    const multiplier = this.getPointsMultiplier();
    if (multiplier >= 8) {
      this.levelDisplay.parentElement.style.background = 'rgba(255, 255, 255, 0.4)';
      this.levelDisplay.parentElement.style.borderColor = '#ffffff';
      this.levelDisplay.parentElement.style.boxShadow = '0 0 20px #ffffff';
    } else if (multiplier >= 5) {
      this.levelDisplay.parentElement.style.background = 'rgba(255, 0, 255, 0.4)';
      this.levelDisplay.parentElement.style.borderColor = '#ff00ff';
      this.levelDisplay.parentElement.style.boxShadow = '0 0 15px #ff00ff';
    } else if (multiplier >= 3) {
      this.levelDisplay.parentElement.style.background = 'rgba(0, 255, 255, 0.4)';
      this.levelDisplay.parentElement.style.borderColor = '#00ffff';
      this.levelDisplay.parentElement.style.boxShadow = '0 0 10px #00ffff';
    } else if (multiplier >= 2) {
      this.levelDisplay.parentElement.style.background = 'rgba(255, 215, 0, 0.4)';
      this.levelDisplay.parentElement.style.borderColor = '#ffd700';
      this.levelDisplay.parentElement.style.boxShadow = '0 0 8px #ffd700';
    }
  }

  endGame() {
    this.isPlaying = false;
    clearInterval(this.gameInterval);
    clearInterval(this.spawnInterval);
    
    // Remove all remaining coins and clear their intervals
    this.coins.forEach(coin => {
      if (coin.collisionInterval) {
        clearInterval(coin.collisionInterval);
      }
      if (coin.removeTimeout) {
        clearTimeout(coin.removeTimeout);
      }
      if (coin.parentNode) {
        coin.parentNode.removeChild(coin);
      }
    });
    this.coins = [];
    
    // Show game over screen
    this.finalScore.textContent = this.score;
    this.showAchievement();
    this.gameOver.style.display = 'block';
    
    // Update leaderboard
    this.updateLeaderboard();
  }

  showAchievement() {
    let achievement = '';
    if (this.level >= 20) achievement = '� COSMIC LEGEND! You transcended reality!';
    else if (this.level >= 15) achievement = '🚀 IMPOSSIBLE MASTER! You broke the matrix!';
    else if (this.level >= 12) achievement = '💫 LEGENDARY WARRIOR! Incredible skills!';
    else if (this.level >= 10) achievement = '🏆 MEME EMPEROR! You rule the blockchain!';
    else if (this.level >= 8) achievement = '👑 DIAMOND CLAWS! You are unstoppable!';
    else if (this.level >= 6) achievement = '� GOLDEN WHISKERS! Amazing reflexes!';
    else if (this.level >= 4) achievement = '� SILVER PAWS! Great improvement!';
    else if (this.level >= 3) achievement = '🥉 BRONZE TAIL! You are getting good!';
    else if (this.score >= 1000) achievement = '😺 Cat Apprentice! Keep practicing!';
    else if (this.score >= 100) achievement = '🐱 Future Millionaire! Nice start!';
    else achievement = '😿 Keep trying! Every legend starts somewhere!';
    
    // Extra achievement for high scores
    if (this.score >= 10000) achievement += ' | 💎 10K CLUB!';
    else if (this.score >= 5000) achievement += ' | 🔥 5K MASTER!';
    
    this.achievement.textContent = achievement;
  }

  updateLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem('remeowLeaderboard') || '[]');
    leaderboard.push({ 
      score: this.score, 
      level: this.level,
      date: new Date().toLocaleDateString() 
    });
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard.splice(5); // Keep only top 5
    localStorage.setItem('remeowLeaderboard', JSON.stringify(leaderboard));
    
    this.displayLeaderboard(leaderboard);
  }

  displayLeaderboard(scores) {
    const leaderboardElement = document.getElementById('leaderboard');
    leaderboardElement.innerHTML = '';
    
    scores.forEach((entry, index) => {
      const li = document.createElement('li');
      li.textContent = `Player ${index + 1}: ${entry.score} points (Lv.${entry.level || 1})`;
      leaderboardElement.appendChild(li);
    });
    
    // Fill remaining slots with default entries
    for (let i = scores.length; i < 3; i++) {
      const li = document.createElement('li');
      const defaultScores = [
        'Anonymous: 2850 points (Lv.4)', 
        'CryptoKitty: 2340 points (Lv.3)', 
        'MoonCat: 1990 points (Lv.3)'
      ];
      li.textContent = defaultScores[i] || `Player ${i + 1}: 0 points (Lv.1)`;
      leaderboardElement.appendChild(li);
    }
  }

  restartGame() {
    // Reset cat position
    this.cat.style.left = '50%';
    this.cat.style.transform = 'translateX(-50%)';
    
    // Reset container style
    this.gameContainer.style.boxShadow = '0 0 20px rgba(0, 255, 136, 0.2)';
    
    this.startGame();
  }
}

// Initialize game when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  // Initialize game
  const game = new ReMeowGame();
  
  // Initialize enhanced features
  initializeEnhancedFeatures();
});

// Enhanced Features Implementation
function initializeEnhancedFeatures() {
  createScrollProgress();
  new EnhancedParticles();
  setupLazyLoading();
  setupIntersectionObserver();
  addSparkleEffects();
}

// Scroll Progress Bar
function createScrollProgress() {
  const progressBar = document.querySelector('.scroll-progress');
  
  window.addEventListener('scroll', () => {
    const scrolled = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    progressBar.style.width = Math.min(scrolled, 100) + '%';
  });
}

// Enhanced Particle System
class EnhancedParticles {
  constructor() {
    this.floatingEmojis = ['🐱', '🚀', '💎', '🌙', '⚡', '🔥', '💰', '😸', '🪙', '🌟'];
    this.driftingEmojis = ['🐾', '💫', '✨', '🎯', '🎮', '🏆', '🔮', '💝'];
    this.container = document.getElementById('particles-bg');
    this.init();
  }

  init() {
    // Create initial particles
    for (let i = 0; i < 5; i++) {
      setTimeout(() => this.createFloatingParticle(), i * 1000);
    }
    
    // Create drifting particles
    setInterval(() => this.createDriftingParticle(), 8000);
    
    // Create floating particles periodically
    setInterval(() => this.createFloatingParticle(), 4000);
  }

  createFloatingParticle() {
    const particle = document.createElement('div');
    particle.className = 'floating-emoji';
    particle.textContent = this.floatingEmojis[Math.floor(Math.random() * this.floatingEmojis.length)];
    
    // Random position
    particle.style.left = Math.random() * window.innerWidth + 'px';
    particle.style.top = Math.random() * window.innerHeight + 'px';
    
    // Random animation properties
    particle.style.animationDelay = Math.random() * 2 + 's';
    particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
    
    document.body.appendChild(particle);
    
    // Remove after animation
    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    }, 10000);
  }

  createDriftingParticle() {
    const particle = document.createElement('div');
    particle.className = 'drifting-emoji';
    particle.textContent = this.driftingEmojis[Math.floor(Math.random() * this.driftingEmojis.length)];
    
    // Random vertical position
    particle.style.top = (Math.random() * 80 + 10) + '%';
    
    // Random animation duration
    particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
    
    document.body.appendChild(particle);
    
    // Remove after animation
    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    }, 25000);
  }
}

// Lazy Loading for Images
function setupLazyLoading() {
  const images = document.querySelectorAll('img');
  
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.classList.add('loaded');
        imageObserver.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
}

// Enhanced Intersection Observer for Animations
function setupIntersectionObserver() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        
        // Add staggered animation to list items
        if (entry.target.querySelector('li')) {
          const items = entry.target.querySelectorAll('li');
          items.forEach((item, index) => {
            setTimeout(() => {
              item.style.animation = `slideInUp 0.6s ease-out ${index * 0.1}s both`;
            }, index * 100);
          });
        }
      }
    });
  }, observerOptions);

  // Observe all sections
  document.querySelectorAll('section').forEach(section => {
    section.classList.add('fade-in');
    observer.observe(section);
  });
}

// Add Sparkle Effects
function addSparkleEffects() {
  const createSparkle = (element) => {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle-effect';
    
    const rect = element.getBoundingClientRect();
    sparkle.style.left = (rect.left + Math.random() * rect.width) + 'px';
    sparkle.style.top = (rect.top + Math.random() * rect.height) + 'px';
    
    document.body.appendChild(sparkle);
    
    setTimeout(() => {
      if (sparkle.parentNode) {
        sparkle.parentNode.removeChild(sparkle);
      }
    }, 2000);
  };

  // Add sparkles to important elements on hover
  const sparkleElements = document.querySelectorAll('.buy-btn, .game-btn, h1, h2');
  
  sparkleElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
      for (let i = 0; i < 3; i++) {
        setTimeout(() => createSparkle(element), i * 200);
      }
    });
  });
}

// Performance Monitoring
function monitorPerformance() {
  // Reduce particles on low-end devices
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
    const particles = document.querySelectorAll('.floating-emoji, .drifting-emoji');
    particles.forEach((particle, index) => {
      if (index % 2 === 0) {
        particle.style.display = 'none';
      }
    });
  }
  
  // Reduce animations on slow connections
  if ('connection' in navigator && navigator.connection.effectiveType === 'slow-2g') {
    document.body.classList.add('reduced-motion');
  }
}

// Page Visibility API for performance
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Pause heavy animations when tab is not visible
    document.body.style.animationPlayState = 'paused';
  } else {
    document.body.style.animationPlayState = 'running';
  }
});

// Initialize performance monitoring
setTimeout(monitorPerformance, 1000);
