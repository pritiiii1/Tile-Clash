// Theme Data & Animated Background Characters Configuration
const themeData = {
  spiderman: {
    tagline: "With great memory comes great high scores!",
    icons: ['🕷️', '🕸️', '🏙️', '⚡', '🦸‍♂️', '💥', '🛡️', '🎯'],
    walkingChar: '<i class="fa-solid fa-spider"></i>',
    sittingChar: '<i class="fa-solid fa-mask"></i>'
  },
  harrypotter: {
    tagline: "Cast spells and unlock magic pairs!",
    icons: ['⚡', '🧙‍♂️', '🦉', '🧹', '🔮', '📜', '🏰', '✨'],
    walkingChar: '<i class="fa-solid fa-hat-wizard"></i>',
    sittingChar: '<i class="fa-solid fa-wand-magic-sparkles"></i>'
  },
  animals: {
    tagline: "Match the cute wild animal pairs!",
    icons: ['🐶', '🐱', '🐼', '🦊', '🦁', '🦄', '🐙', '🐨'],
    walkingChar: '<i class="fa-solid fa-dog"></i>',
    sittingChar: '<i class="fa-solid fa-cat"></i>'
  },
  candy: {
    tagline: "A sweet challenge for your brain!",
    icons: ['🍩', '🧁', '🍦', '🍓', '🍬', '🍭', '🍕', '🥞'],
    walkingChar: '<i class="fa-solid fa-cookie-bite"></i>',
    sittingChar: '<i class="fa-solid fa-ice-cream"></i>'
  },
  arcade: {
    tagline: "Level up your memory skills!",
    icons: ['🎮', '🕹️', '👾', '🎲', '⚔️', '👑', '💎', '🚀'],
    walkingChar: '<i class="fa-solid fa-gamepad"></i>',
    sittingChar: '<i class="fa-solid fa-ghost"></i>'
  }
};

// Daily Quotes Array
const quotes = [
  '"Memory is the treasury and guardian of all things." – Cicero',
  '"Small daily progress leads to huge long-term results!"',
  '"The more you exercise your brain, the sharper it gets."',
  '"Challenge your brain every day to unlock your potential!"',
  '"Focus, flip, match, and repeat. You’ve got this!"'
];

// -------------------------------------------------------------
// WEB AUDIO API SOUND EFFECTS SYNTHESIZER
// -------------------------------------------------------------
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// 1. Soft Card Flip Sound
function playFlipSound() {
  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(300, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.08);

  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.08);
}

// 2. Pair Match Sound
function playMatchSound() {
  const ctx = getAudioContext();
  const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 major chord
  
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);

    gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.08);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.08 + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime + i * 0.08);
    osc.stop(ctx.currentTime + i * 0.08 + 0.2);
  });
}

// 3. Mismatch Sound
function playMismatchSound() {
  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(160, ctx.currentTime);
  osc.frequency.setValueAtTime(120, ctx.currentTime + 0.1);

  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.25);
}

// 4. "Hurray!" Cheering Victory Melody Sound
function playHurraySound() {
  const ctx = getAudioContext();
  const notes = [
    { freq: 440.00, time: 0.00, dur: 0.12 }, // A4
    { freq: 554.37, time: 0.12, dur: 0.12 }, // C#5
    { freq: 659.25, time: 0.24, dur: 0.15 }, // E5
    { freq: 880.00, time: 0.39, dur: 0.50 }  // A5 ("Hurray!")
  ];

  notes.forEach((note) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(note.freq, ctx.currentTime + note.time);

    gain.gain.setValueAtTime(0.3, ctx.currentTime + note.time);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + note.time + note.dur);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime + note.time);
    osc.stop(ctx.currentTime + note.time + note.dur);
  });
}

// -------------------------------------------------------------
// CONFETTI ANIMATION CANNON
// -------------------------------------------------------------
function triggerConfetti() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 80,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 }
    });
    confetti({
      particleCount: 80,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 }
    });
  }
}

// -------------------------------------------------------------
// DOM ELEMENTS & GAME LOGIC
// -------------------------------------------------------------
const gameGrid = document.getElementById('gameGrid');
const movesCountDisplay = document.getElementById('movesCount');
const timerDisplay = document.getElementById('timerDisplay');
const bestScoreDisplay = document.getElementById('bestScoreDisplay');
const restartBtn = document.getElementById('restartBtn');
const themeSelect = document.getElementById('themeSelect');
const themeTagline = document.getElementById('themeTagline');
const dailyQuote = document.getElementById('dailyQuote');
const playerGreeting = document.getElementById('playerGreeting');
const walkingChar = document.getElementById('walkingChar');
const sittingChar = document.getElementById('sittingChar');

// Menu Elements
const menuBtn = document.getElementById('menuBtn');
const closeMenuBtn = document.getElementById('closeMenuBtn');
const sideMenu = document.getElementById('sideMenu');
const menuOverlay = document.getElementById('menuOverlay');
const changePlayerBtn = document.getElementById('changePlayerBtn');
const resetScoreBtn = document.getElementById('resetScoreBtn');

// Modals
const nameModal = document.getElementById('nameModal');
const playerNameInput = document.getElementById('playerNameInput');
const saveNameBtn = document.getElementById('saveNameBtn');
const victoryModal = document.getElementById('victoryModal');
const victoryTitle = document.getElementById('victoryTitle');
const victoryMessage = document.getElementById('victoryMessage');
const playAgainBtn = document.getElementById('playAgainBtn');

// Game State Variables
let currentTheme = 'spiderman';
let playerName = 'Player';
let flippedCards = [];
let matchedCount = 0;
let moves = 0;
let timer = null;
let secondsElapsed = 0;
let isGameStarted = false;
let isLockBoard = false;

// Application Initialization
document.addEventListener('DOMContentLoaded', () => {
  displayQuote();
  checkPlayerName();
  loadHighScore();
  updateBgCharacters();
  initGame();
});

// Sidebar Navigation Drawer Controls
menuBtn.addEventListener('click', toggleMenu);
closeMenuBtn.addEventListener('click', toggleMenu);
menuOverlay.addEventListener('click', toggleMenu);

function toggleMenu() {
  sideMenu.classList.toggle('hidden-menu');
  menuOverlay.classList.toggle('hidden');
}

// Display Random Quote
function displayQuote() {
  const idx = Math.floor(Math.random() * quotes.length);
  dailyQuote.textContent = quotes[idx];
}

// Update Centered Player Name Badge
function updatePlayerBadge(name) {
  playerGreeting.innerHTML = `<i class="fa-solid fa-user-ninja"></i> ${name}`;
}

// Show Login Pop-Up Always on Page Reload
function checkPlayerName() {
  const savedName = localStorage.getItem('tileclash_player_name');
  if (savedName) {
    playerNameInput.value = savedName; // Pre-fill with last used name
  }
  nameModal.classList.remove('hidden'); // ALWAYS show modal popup on refresh
}

saveNameBtn.addEventListener('click', () => {
  const val = playerNameInput.value.trim();
  if (val !== "") {
    playerName = val;
    localStorage.setItem('tileclash_player_name', playerName);
    updatePlayerBadge(playerName);
    nameModal.classList.add('hidden');
    loadHighScore();
    getAudioContext();
  }
});

changePlayerBtn.addEventListener('click', () => {
  toggleMenu();
  nameModal.classList.remove('hidden');
});

// Update Background Characters per Theme
function updateBgCharacters() {
  walkingChar.innerHTML = themeData[currentTheme].walkingChar;
  sittingChar.innerHTML = themeData[currentTheme].sittingChar;
}

// Theme Change Handler
themeSelect.addEventListener('change', (e) => {
  currentTheme = e.target.value;
  document.body.setAttribute('data-theme', currentTheme);
  themeTagline.textContent = themeData[currentTheme].tagline;
  updateBgCharacters();
  initGame();
});

// Fisher-Yates Card Shuffling
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Initialize & Render Game Grid
function initGame() {
  gameGrid.innerHTML = '';
  flippedCards = [];
  matchedCount = 0;
  moves = 0;
  secondsElapsed = 0;
  isGameStarted = false;
  isLockBoard = false;

  movesCountDisplay.textContent = '0';
  timerDisplay.textContent = '00:00';
  stopTimer();

  const icons = themeData[currentTheme].icons;
  const shuffledCards = shuffle([...icons, ...icons]);

  shuffledCards.forEach((icon) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.value = icon;

    card.innerHTML = `
      <div class="card-face card-front"><i class="fa-solid fa-question"></i></div>
      <div class="card-face card-back">${icon}</div>
    `;

    card.addEventListener('click', handleCardClick);
    gameGrid.appendChild(card);
  });
}

// Card Click Event Listener
function handleCardClick(e) {
  const card = e.currentTarget;

  if (isLockBoard || card.classList.contains('flipped') || card.classList.contains('matched')) return;

  playFlipSound();

  if (!isGameStarted) {
    startTimer();
    isGameStarted = true;
  }

  card.classList.add('flipped');
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    moves++;
    movesCountDisplay.textContent = moves;
    checkForMatch();
  }
}

// Match Checking Logic
function checkForMatch() {
  isLockBoard = true;
  const [card1, card2] = flippedCards;
  const isMatch = card1.dataset.value === card2.dataset.value;

  if (isMatch) {
    setTimeout(playMatchSound, 150);

    card1.classList.add('matched');
    card2.classList.add('matched');
    matchedCount += 2;
    flippedCards = [];
    isLockBoard = false;

    if (matchedCount === 16) {
      setTimeout(handleWin, 400);
    }
  } else {
    setTimeout(playMismatchSound, 200);

    setTimeout(() => {
      card1.classList.remove('flipped');
      card2.classList.remove('flipped');
      flippedCards = [];
      isLockBoard = false;
    }, 900);
  }
}

// Timer Controls
function startTimer() {
  stopTimer();
  timer = setInterval(() => {
    secondsElapsed++;
    const mins = Math.floor(secondsElapsed / 60).toString().padStart(2, '0');
    const secs = (secondsElapsed % 60).toString().padStart(2, '0');
    timerDisplay.textContent = `${mins}:${secs}`;
  }, 1000);
}

function stopTimer() {
  if (timer) clearInterval(timer);
}

// Win Handling
function handleWin() {
  stopTimer();

  playHurraySound();
  triggerConfetti();

  const key = `tileclash_score_${playerName}`;
  const currentBest = localStorage.getItem(key);
  let isNewHigh = false;

  if (!currentBest || moves < parseInt(currentBest)) {
    localStorage.setItem(key, moves.toString());
    bestScoreDisplay.textContent = moves;
    isNewHigh = true;
  }

  victoryTitle.textContent = `HURRAY, ${playerName.toUpperCase()}! 🎉`;
  victoryMessage.textContent = `Outstanding memory! You mastered the ${currentTheme.toUpperCase()} theme deck!`;
  document.getElementById('modalMoves').textContent = moves;
  document.getElementById('modalTime').textContent = timerDisplay.textContent;
  document.getElementById('modalHighScore').textContent = isNewHigh ? '🏆 NEW RECORD!' : 'No';

  victoryModal.classList.remove('hidden');
}

function loadHighScore() {
  const key = `tileclash_score_${playerName}`;
  const saved = localStorage.getItem(key);
  bestScoreDisplay.textContent = saved ? saved : '--';
}

resetScoreBtn.addEventListener('click', () => {
  const key = `tileclash_score_${playerName}`;
  localStorage.removeItem(key);
  bestScoreDisplay.textContent = '--';
  toggleMenu();
});

restartBtn.addEventListener('click', () => {
  playFlipSound();
  initGame();
});

playAgainBtn.addEventListener('click', () => {
  playFlipSound();
  victoryModal.classList.add('hidden');
  initGame();
});