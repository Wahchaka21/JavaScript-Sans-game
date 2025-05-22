const colors = ["green", "red", "yellow", "blue"];
let simonPlay = [];
let playerPlay = [];
let score = 0;
let gameOver = false;
let canClick = false;

const green = document.getElementById("green");
const red = document.getElementById("red");
const yellow = document.getElementById("yellow");
const blue = document.getElementById("blue");

green.addEventListener("click", () => playerSequence("green"));
red.addEventListener("click", () => playerSequence("red"));
yellow.addEventListener("click", () => playerSequence("yellow"));
blue.addEventListener("click", () => playerSequence("blue"));

function couleurAleatoire() {
  return colors[Math.floor(Math.random() * colors.length)];
}
//console.log(couleurAleatoire());

function simonSequence() {
  simonPlay.push(couleurAleatoire());
  return simonPlay;
}
//console.log(simonSequence());
let interval;

function playSimonSequence() {
  let i = 0;
  clearInterval(interval);
  interval = setInterval(() => {
    buttonActive(simonPlay[i]);
    i++;
    if (i >= simonPlay.length) {
      clearInterval(interval);
      canClick = true;

      responseTimeout = setTimeout(() => {
        if (canClick) {
          gameOver = true;
          canClick = false;
          music.pause();
          music.currentTime = 0;
          timeLess.play();
          document.getElementById("score").textContent =
            "HAHAHA t'es trop lent mec ! ton score est seulement de " +
            score +
            "...";
        }
      }, 5000);
    }
  }, 1000);
}

const buttons = {
  green: green,
  red: red,
  yellow: yellow,
  blue: blue,
};

function buttonActive(color) {
  buttons[color].classList.add("active");

  setTimeout(() => {
    buttons[color].classList.remove("active");
  }, 500);
}

const sounds = {};

const music = new Audio("sounds/Undertale - Megalovania.mp3");
music.loop = true;
music.volume = 0.2;

const perdu = new Audio("sounds/Mario Death - Sound Effect (HD).mp3");
perdu.volume = 0.2;
const gagner = new Audio("sounds/fanfare.mp3");
gagner.volume = 0.2;
const timeLess = new Audio("sounds/Mario Death - Sound Effect (HD).mp3");
timeLess.volume = 0.2;

function playerSequence(color) {
  if (!canClick) return;

  clearTimeout(responseTimeout);

  playerPlay.push(color);
  buttonActive(color);

  const indexActuelle = playerPlay.length - 1;
  if (playerPlay[indexActuelle] !== simonPlay[indexActuelle]) {
    gameOver = true;
    canClick = false;
    clearInterval(interval);
    music.pause();
    music.currentTime = 0;
    perdu.play();
    document.getElementById("score").textContent =
      "Game Over! ton score est de :" + score;
    return;
  }

  if (playerPlay.length === simonPlay.length) {
    score++;
    updateScore();

    if (score === 10) {
      gameOver = true;
      canClick = false;
      clearInterval(interval);
      music.pause();
      music.currentTime = 0;
      gagner.play();
      document.getElementById("score").textContent =
        "GG ! t'as win mon gars ! Score final : " + score;
    } else {
      setTimeout(nextRound, 1000);
    }
  }
}

function nextRound() {
  playerPlay = [];
  canClick = false;
  const couleurSuivante = couleurAleatoire();
  simonPlay.push(couleurSuivante);
  console.log("nouvelle séquence de Simon :", simonPlay);
  playSimonSequence();
}
function updateScore() {
  document.getElementById("score").textContent = "Ton Score est de : " + score;
}

document.getElementById("start").addEventListener("click", () => {
  if (gameOver || simonPlay.length === 0) {
    startGame();
  } else {
    console.log("Ha non non la partie est déjà en cours termine là !!!!");
  }
});

function startGame() {
  playerPlay = [];
  simonPlay = [];
  score = 0;
  gameOver = false;
  canClick = false;
  updateScore();
  nextRound();
  if (music.paused) {
    music.play();
  }
}
