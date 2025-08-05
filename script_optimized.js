// --- OPTIMIZED STORY LOADING ---
// Fast load - story is already in HTML, just add visibility
function quickLoadStory() {
  const storyBlock = document.getElementById('story-block');
  if (storyBlock) {
    storyBlock.classList.add('visible');
  }
}

// Initialize immediately when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', quickLoadStory);
} else {
  quickLoadStory();
}

// --- COPY TO CLIPBOARD ---
const copyBtn = document.getElementById('copy-btn');
const tokenAddr = document.getElementById('token-address');
const tooltip = document.getElementById('copy-tooltip');
copyBtn?.addEventListener('click', () => {
  navigator.clipboard.writeText(tokenAddr.textContent);
  tooltip.classList.add('active');
  setTimeout(() => tooltip.classList.remove('active'), 1200);
});

// --- OPTIMIZED SOUND EFFECTS ---
const catImg = document.getElementById('cat-img');
let meowSound;

// Lazy load sound
function loadSound() {
  if (!meowSound) {
    meowSound = new Audio('https://cdn.pixabay.com/audio/2022/07/26/audio_12c6b7b2b7.mp3');
    meowSound.volume = 0.3; // Lower volume
  }
}

catImg?.addEventListener('mouseenter', () => {
  loadSound();
  meowSound.currentTime = 0;
  meowSound.play().catch(() => {}); // Ignore autoplay errors
});

catImg?.addEventListener('touchstart', () => {
  loadSound();
  meowSound.currentTime = 0;
  meowSound.play().catch(() => {}); // Ignore autoplay errors
});

// --- OPTIMIZED PARTICLES / FLOATING EMOJIS ---
const particlesBg = document.getElementById('particles-bg');
const emojis = ['🐾','😺','💸','😼','💰','😻','😹','🔥','🟣','🟢','🔵','💎','😽','😾','😿','👾','🪙','🔫','🌑','🚀'];

let particleCount = 0;
const maxParticles = 15; // Limit particles for performance

function createParticle() {
  if (particleCount >= maxParticles) return;
  
  const el = document.createElement('span');
  el.textContent = emojis[Math.floor(Math.random()*emojis.length)];
  el.style.position = 'absolute';
  el.style.fontSize = `${Math.random()*2+1.2}rem`;
  el.style.left = `${Math.random()*100}vw`;
  el.style.top = `${Math.random()*100}vh`;
  el.style.opacity = Math.random()*0.7+0.3;
  el.style.filter = 'drop-shadow(0 0 8px #8f00ff)';
  el.style.transition = 'top 12s linear, left 12s linear, opacity 2s';
  el.style.pointerEvents = 'none'; // Performance optimization
  
  particlesBg.appendChild(el);
  particleCount++;
  
  setTimeout(() => {
    el.style.top = `${Math.random()*100}vh`;
    el.style.left = `${Math.random()*100}vw`;
    el.style.opacity = 0.1;
  }, 100);
  
  setTimeout(() => {
    if (el.parentNode) {
      el.remove();
      particleCount--;
    }
  }, 12000);
}

// Reduced particle frequency for better performance
setInterval(createParticle, 1000);
for(let j=0;j<8;j++) createParticle(); // Fewer initial particles

// --- OPTIMIZED SCROLL ANIMATIONS ---
let isScrolling = false;
function revealOnScroll() {
  if (isScrolling) return;
  isScrolling = true;
  
  requestAnimationFrame(() => {
    document.querySelectorAll('.fade-in, .slide-up').forEach(el => {
      const rect = el.getBoundingClientRect();
      if(rect.top < window.innerHeight - 60) {
        el.classList.add('visible');
      }
    });
    isScrolling = false;
  });
}

window.addEventListener('scroll', revealOnScroll, { passive: true });
window.addEventListener('DOMContentLoaded', revealOnScroll);

// --- ANIMATE SECTIONS ---
document.querySelectorAll('.tokenomics, .roadmap, .token-address').forEach((el,i) => {
  el.classList.add(i%2===0 ? 'fade-in' : 'slide-up');
});

// --- OPTIMIZED GAME FUNCTIONALITY ---
class ReMeowGame {
  constructor() {
    this.score = 0;
    this.timeLeft = 60;
    this.level = 1;
    this.lives = 9;
    this.maxLives = 9;
    this.isPlaying = false;
    this.gameInterval = null;
    this.spawnInterval = null;
    this.baseSpeed = 3;
    this.currentSpeed = this.baseSpeed;
    this.speedIncrement = 0.2;
    this.coins = [];
    this.coinsPerLevel = 0;
    this.coinsRequiredForNextLevel = 5;
    
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
    this.startBtn?.addEventListener('click', () => this.startGame());
    this.restartBtn?.addEventListener('click', () => this.restartGame());
    
    // Optimized mouse movement with throttling
    let mouseMoveThrottle = false;
    this.gameContainer?.addEventListener('mousemove', (e) => {
      if (this.isPlaying && !mouseMoveThrottle) {
        mouseMoveThrottle = true;
        requestAnimationFrame(() => {
          const rect = this.gameContainer.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const catWidth = this.cat.offsetWidth;
          const maxX = this.gameContainer.offsetWidth - catWidth;
          const newX = Math.max(0, Math.min(maxX, x - catWidth / 2));
          this.cat.style.left = newX + 'px';
          this.cat.style.transform = 'none';
          mouseMoveThrottle = false;
        });
      }
    });
  }

  startGame() {
    this.isPlaying = true;
    this.score = 0;
    this.timeLeft = 60;
    this.level = 1;
    this.lives = this.maxLives;
    this.currentSpeed = this.baseSpeed;
    this.coins = [];
    this.coinsPerLevel = 0;
    this.coinsRequiredForNextLevel = 5;
    this.startBtn.style.display = 'none';
    this.gameOver.style.display = 'none';
    this.updateDisplay();
    
    this.gameInterval = setInterval(() => {
      this.timeLeft--;
      this.updateDisplay();
      
      if (this.timeLeft <= 0) {
        this.endGame();
      }
    }, 1000);
    
    this.spawnCoins();
  }

  levelUp() {
    this.level++;
    
    this.currentSpeed = Math.max(this.baseSpeed - (this.level - 1) * 0.3, 0.5);
    this.coinsRequiredForNextLevel = Math.floor(this.coinsRequiredForNextLevel * 1.4);
    this.coinsPerLevel = 0;
    
    const timeBonus = Math.max(10 - this.level, 3);
    this.timeLeft += timeBonus;
    
    this.applyLevelEffects();
    this.showNotification(`🎉 LEVEL ${this.level}! Speed: x${(this.baseSpeed/this.currentSpeed).toFixed(1)} | +${timeBonus}s`, '#00ff88');
    
    if (this.spawnInterval) {
      clearInterval(this.spawnInterval);
      this.spawnCoins();
    }
  }

  applyLevelEffects() {
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
    if (this.level >= 15) return 8;
    if (this.level >= 10) return 5;
    if (this.level >= 7) return 3;
    if (this.level >= 3) return 2;
    return 1;
  }

  spawnCoins() {
    let baseSpawnRate = 1200;
    let spawnRate = Math.max(baseSpawnRate - (this.level * 100), 300);
    
    const multiSpawnChance = Math.min(this.level * 0.05, 0.3);
    
    this.spawnInterval = setInterval(() => {
      if (this.isPlaying) {
        this.createCoin();
        
        if (this.level >= 5 && Math.random() < multiSpawnChance) {
          setTimeout(() => {
            if (this.isPlaying) this.createCoin();
          }, 200);
        }
        
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
    
    coin.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.collectCoin(coin, e);
    });
    
    this.gameContainer.appendChild(coin);
    this.coins.push(coin);
    
    this.startCollisionDetection(coin);
    
    const removeTimeout = setTimeout(() => {
      if (coin.parentNode && coin.dataset.collected === 'false') {
        this.loseLive();
        this.removeCoin(coin);
      }
    }, this.currentSpeed * 1000 + 200);
    
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
    }, 50);
    
    coin.collisionInterval = collisionInterval;
  }

  checkCollision(coin, cat) {
    const coinRect = coin.getBoundingClientRect();
    const catRect = cat.getBoundingClientRect();
    
    const buffer = 10;
    
    return coinRect.left < catRect.right + buffer &&
           coinRect.right > catRect.left - buffer &&
           coinRect.top < catRect.bottom + buffer &&
           coinRect.bottom > catRect.top - buffer;
  }

  collectCoin(coin, event) {
    if (!this.isPlaying || coin.dataset.collected === 'true') return;
    
    coin.dataset.collected = 'true';
    
    const basePoints = this.level * 10;
    const multiplier = this.getPointsMultiplier();
    const points = basePoints * multiplier;
    
    this.score += points;
    this.coinsPerLevel++;
    this.updateDisplay();
    
    if (this.coinsPerLevel >= this.coinsRequiredForNextLevel) {
      this.levelUp();
    }
    
    let effectText = `+${points}`;
    if (multiplier > 1) {
      effectText = `+${points} (x${multiplier})`;
    }
    
    this.createCollectEffect(event.clientX, event.clientY, effectText);
    this.playCollectSound();
    this.removeCoin(coin);
    
    if (this.score % 1000 === 0) {
      this.timeLeft += 8;
      this.showNotification('+8 seconds! 🎉', '#ffaa00');
    }
  }

  collectCoinCollision(coin) {
    if (!this.isPlaying || coin.dataset.collected === 'true') return;
    
    coin.dataset.collected = 'true';
    
    const basePoints = this.level * 10;
    const multiplier = this.getPointsMultiplier();
    const points = basePoints * multiplier;
    
    this.score += points;
    this.coinsPerLevel++;
    this.updateDisplay();
    
    if (this.coinsPerLevel >= this.coinsRequiredForNextLevel) {
      this.levelUp();
    }
    
    const coinRect = coin.getBoundingClientRect();
    
    let effectText = `+${points}`;
    if (multiplier > 1) {
      effectText = `+${points} (x${multiplier})`;
    }
    
    this.createCollectEffect(
      coinRect.left + coinRect.width / 2, 
      coinRect.top + coinRect.height / 2, 
      effectText
    );
    
    this.playCollectSound();
    this.removeCoin(coin);
    
    if (this.score % 1000 === 0) {
      this.timeLeft += 8;
      this.showNotification('+8 seconds! 🎉', '#ffaa00');
    }
  }

  removeCoin(coin) {
    if (coin.removeTimeout) {
      clearTimeout(coin.removeTimeout);
    }
    
    if (coin.collisionInterval) {
      clearInterval(coin.collisionInterval);
    }
    
    if (coin && coin.parentNode) {
      coin.parentNode.removeChild(coin);
    }
    
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
      this.showNotification(`Life Lost! ${this.lives} remaining`, '#ff4444');
      
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
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800 + (this.level * 100);
      oscillator.type = 'square';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
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
    this.livesDisplay.textContent = this.lives;
    
    const progress = this.coinsPerLevel / this.coinsRequiredForNextLevel;
    const progressText = ` (${this.coinsPerLevel}/${this.coinsRequiredForNextLevel})`;
    this.levelDisplay.textContent = this.level + progressText;
    
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
    
    this.finalScore.textContent = this.score;
    this.showAchievement();
    this.gameOver.style.display = 'block';
    
    this.updateLeaderboard();
  }

  showAchievement() {
    let achievement = '';
    if (this.level >= 20) achievement = '🌟 COSMIC LEGEND! You transcended reality!';
    else if (this.level >= 15) achievement = '🚀 IMPOSSIBLE MASTER! You broke the matrix!';
    else if (this.level >= 12) achievement = '💫 LEGENDARY WARRIOR! Incredible skills!';
    else if (this.level >= 10) achievement = '🏆 MEME EMPEROR! You rule the blockchain!';
    else if (this.level >= 8) achievement = '👑 DIAMOND CLAWS! You are unstoppable!';
    else if (this.level >= 6) achievement = '🥇 GOLDEN WHISKERS! Amazing reflexes!';
    else if (this.level >= 4) achievement = '🥈 SILVER PAWS! Great improvement!';
    else if (this.level >= 3) achievement = '🥉 BRONZE TAIL! You are getting good!';
    else if (this.score >= 1000) achievement = '😺 Cat Apprentice! Keep practicing!';
    else if (this.score >= 100) achievement = '🐱 Future Millionaire! Nice start!';
    else achievement = '😿 Keep trying! Every legend starts somewhere!';
    
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
    leaderboard.splice(5);
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
    this.cat.style.left = '50%';
    this.cat.style.transform = 'translateX(-50%)';
    this.gameContainer.style.boxShadow = '0 0 20px rgba(0, 255, 136, 0.2)';
    this.startGame();
  }
}

// --- PERFORMANCE OPTIMIZATIONS ---
// Initialize game when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  const game = new ReMeowGame();
  initializeEnhancedFeatures();
});

function initializeEnhancedFeatures() {
  createScrollProgress();
  new EnhancedParticles();
  setupLazyLoading();
  setupIntersectionObserver();
  addSparkleEffects();
}

function createScrollProgress() {
  const progressBar = document.querySelector('.scroll-progress');
  
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    if (scrollTimeout) return;
    scrollTimeout = setTimeout(() => {
      const scrolled = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      progressBar.style.width = Math.min(scrolled, 100) + '%';
      scrollTimeout = null;
    }, 16); // ~60fps
  }, { passive: true });
}

class EnhancedParticles {
  constructor() {
    this.floatingEmojis = ['🐱', '🚀', '💎', '🌙', '⚡', '🔥', '💰', '😸', '🪙', '🌟'];
    this.driftingEmojis = ['🐾', '💫', '✨', '🎯', '🎮', '🏆', '🔮', '💝'];
    this.container = document.getElementById('particles-bg');
    this.particleCount = 0;
    this.maxParticles = 10;
    this.init();
  }

  init() {
    for (let i = 0; i < 3; i++) {
      setTimeout(() => this.createFloatingParticle(), i * 1000);
    }
    
    setInterval(() => this.createDriftingParticle(), 12000);
    setInterval(() => this.createFloatingParticle(), 6000);
  }

  createFloatingParticle() {
    if (this.particleCount >= this.maxParticles) return;
    
    const particle = document.createElement('div');
    particle.className = 'floating-emoji';
    particle.textContent = this.floatingEmojis[Math.floor(Math.random() * this.floatingEmojis.length)];
    
    particle.style.left = Math.random() * window.innerWidth + 'px';
    particle.style.top = Math.random() * window.innerHeight + 'px';
    particle.style.animationDelay = Math.random() * 2 + 's';
    particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
    particle.style.pointerEvents = 'none';
    
    document.body.appendChild(particle);
    this.particleCount++;
    
    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
        this.particleCount--;
      }
    }, 10000);
  }

  createDriftingParticle() {
    if (this.particleCount >= this.maxParticles) return;
    
    const particle = document.createElement('div');
    particle.className = 'drifting-emoji';
    particle.textContent = this.driftingEmojis[Math.floor(Math.random() * this.driftingEmojis.length)];
    
    particle.style.top = (Math.random() * 80 + 10) + '%';
    particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
    particle.style.pointerEvents = 'none';
    
    document.body.appendChild(particle);
    this.particleCount++;
    
    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
        this.particleCount--;
      }
    }, 25000);
  }
}

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

function setupIntersectionObserver() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        
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

  document.querySelectorAll('section').forEach(section => {
    section.classList.add('fade-in');
    observer.observe(section);
  });
}

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

  const sparkleElements = document.querySelectorAll('.buy-btn, .game-btn, h1, h2');
  
  sparkleElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
      for (let i = 0; i < 2; i++) {
        setTimeout(() => createSparkle(element), i * 200);
      }
    });
  });
}

// Performance monitoring
function monitorPerformance() {
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
    const particles = document.querySelectorAll('.floating-emoji, .drifting-emoji');
    particles.forEach((particle, index) => {
      if (index % 2 === 0) {
        particle.style.display = 'none';
      }
    });
  }
  
  if ('connection' in navigator && navigator.connection.effectiveType === 'slow-2g') {
    document.body.classList.add('reduced-motion');
  }
}

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    document.body.style.animationPlayState = 'paused';
  } else {
    document.body.style.animationPlayState = 'running';
  }
});

setTimeout(monitorPerformance, 1000);
