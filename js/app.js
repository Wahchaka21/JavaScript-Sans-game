const colors = ["green", "red", "yellow", "blue"];
let simonSequence = [];
let playerSequence = [];
let score = 0;
let gameOver = false;
let canClick = false;
let timeoutId = null;

const messageEl = document.querySelector(".message");
const scoreEl = document.getElementById("score");
const startBtn = document.getElementById("start");

const buttons = {};
colors.forEach((color) => {
  buttons[color] = document.getElementById(color);
});

const sounds = {};
colors.forEach((color) => {
  sounds[color] = new Audio(
    "sounds/" + color + "Undertale Death Sound Effect.mp3"
  );
});

const music = new Audio("sounds/Undertale - Megalovania.mp3");
music.loop = true;
music.volume = 0.3;

const soulsDeath = new Audio("sounds/Mario Death - Sound Effect (HD).mp3");
const fanfare = new Audio("sounds/fanfare.mp3");
const tesNul = new Audio("sounds/Mario Death - Sound Effect (HD).mp3");
music.volume = 0.3;

function lightUp(color) {
  buttons[color].classList.add("active");
  sounds[color].currentTime = 0;
  sounds[color].play();

  setTimeout(() => {
    buttons[color].classList.remove("active");
  }, 500);
}

function playSimonStep(index) {
  if (index >= simonSequence.length) {
    canClick = true;
    startPlayerTimer();
    return;
  }
  lightUp(simonSequence[index]);
  setTimeout(() => {
    playSimonStep(index + 1);
  }, 700);
}

function startSimonSequence() {
  canClick = false;
  playSimonStep(0);
}

function generateSequence(length) {
  let seq = [];
  for (let i = 0; i < length; i++) {
    let randomIndex = Math.floor(Math.random() * colors.length);
    seq.push(colors[randomIndex]);
  }
  return seq;
}

function startPlayerTimer() {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    endGame("HAHAHAHA TROP LENT", true);
  }, 5000);
}

function resetPlayerTimer() {
  clearTimeout(timeoutId);
  startPlayerTimer();
}

function handlePlayerClick(color) {
  if (!canClick || gameOver) return;

  lightUp(color);
  playerSequence.push(color);

  let currentIndex = playerSequence.length - 1;
  if (playerSequence[currentIndex] !== simonSequence[currentIndex]) {
    endGame("HAHAHAHAH LES COMPTES SONT PAS BONS LA !", false);
    return;
  }

  if (playerSequence.length === simonSequence.length) {
    score++;
    scoreEl.textContent = "Score : " + score;
    playerSequence = [];
    canClick = false;
    clearTimeout(timeoutId);

    if (score === 8) {
      gameOver = true;
      canClick = false;
      messageEl.textContent =
        "GG T'AS GAGNÉ ! Ton score final est de : " + score;
      music.pause();
      music.currentTime = 0;
      fanfare.currentTime = 0;
      fanfare.play();
      return;
    } else {
      if (!gameOver) music.play();
    }

    setTimeout(() => {
      simonSequence = generateSequence(score + 1);
      startSimonSequence();
    }, 1000);
  } else {
    resetPlayerTimer();
  }
}

function endGame(message, isTimeout = false) {
  gameOver = true;
  canClick = false;
  clearTimeout(timeoutId);
  messageEl.textContent = message + " Ton score final est de : " + score;
  music.pause();
  music.currentTime = 0;

  if (isTimeout) {
    tesNul.currentTime = 0;
    tesNul.play();
  } else {
    soulsDeath.currentTime = 0;
    soulsDeath.play();
  }
}

function startGame() {
  simonSequence = generateSequence(1);
  playerSequence = [];
  score = 0;
  gameOver = false;
  canClick = false;
  messageEl.textContent = "Good Luck !";
  scoreEl.textContent = "Score : 0";
  fanfare.pause();
  fanfare.currentTime = 0;
  tesNul.pause();
  tesNul.currentTime = 0;
  soulsDeath.pause();
  soulsDeath.currentTime = 0;
  music.play();
  startSimonSequence();
}

startBtn.addEventListener("click", startGame);

colors.forEach((color) => {
  buttons[color].addEventListener("click", () => handlePlayerClick(color));
});
