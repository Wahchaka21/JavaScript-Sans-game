// On définit les couleurs des boutons du jeu Simon
const colors = ["green", "red", "yellow", "blue"];

// Variables pour stocker la séquence que Simon génère
let simonSequence = [];
// La séquence que le joueur a entrée
let playerSequence = [];
// Score du joueur (nombre de bonnes séquences répétées)
let score = 0;
// Booléen qui dit si la partie est finie ou pas
let gameOver = false;
// Booléen qui contrôle si le joueur peut cliquer sur les boutons (évite clics intempestifs)
let canClick = false;
// Identifiant du timer pour le temps que le joueur a pour répondre
let timeoutId = null;

// On récupère dans le DOM (page web) l'élément qui affichera les messages (ex: "Good luck", "Trop lent !")
const messageEl = document.querySelector(".message");
// Idem pour le score affiché
const scoreEl = document.getElementById("score");
// Bouton démarrer
const startBtn = document.getElementById("start");

// On crée un objet vide pour stocker les références aux boutons (éléments HTML) pour chaque couleur
const buttons = {};
colors.forEach((color) => {
  // On associe à buttons[color] l'élément HTML avec l'id égal à la couleur (ex: "green")
  buttons[color] = document.getElementById(color);
});

// Même principe que pour les boutons mais pour les sons associés aux couleurs
const sounds = {};
colors.forEach((color) => {
  // On crée un nouvel objet Audio (pour jouer un son) pour chaque couleur, avec le chemin du fichier son
  sounds[color] = new Audio(
    "sounds/" + color + "Undertale Death Sound Effect.mp3"
  );
});

// Musique de fond pendant la partie, boucle en continue et volume réglé à 30%
const music = new Audio("sounds/Undertale - Megalovania.mp3");
music.loop = true;
music.volume = 0.3;

// Sons spécifiques pour la fin du jeu ou autres événements
const soulsDeath = new Audio("sounds/Mario Death - Sound Effect (HD).mp3"); // Son quand le joueur perd
const fanfare = new Audio("sounds/fanfare.mp3"); // Son de victoire
const tesNul = new Audio("sounds/Mario Death - Sound Effect (HD).mp3"); // Son si le joueur met trop de temps

// Fonction pour "allumer" un bouton : ajouter une classe CSS, jouer le son et l'éteindre après un délai
function lightUp(color) {
  // Ajoute la classe "active" (pour changer visuellement le bouton, ex: couleur plus claire)
  buttons[color].classList.add("active");

  // Remet le son au début (au cas où il était déjà en train de jouer)
  sounds[color].currentTime = 0;
  // Joue le son associé à cette couleur
  sounds[color].play();

  // Après 500 ms (0.5s), enlève la classe "active" pour "éteindre" le bouton visuellement
  setTimeout(() => {
    buttons[color].classList.remove("active");
  }, 500);
}

// Fonction récursive qui fait jouer la séquence Simon étape par étape, en allumant chaque bouton avec délai
function playSimonStep(index) {
  // Condition de fin : si on a joué toute la séquence
  if (index >= simonSequence.length) {
    // Permettre au joueur de cliquer
    canClick = true;
    // Démarrer le timer pour que le joueur ait un temps limité pour répondre
    startPlayerTimer();
    return;
  }
  // Allume le bouton correspondant à l'élément courant dans la séquence
  lightUp(simonSequence[index]);

  // Après 700 ms, on appelle la fonction pour jouer l'étape suivante (index + 1)
  setTimeout(() => {
    playSimonStep(index + 1);
  }, 700);
}

// Fonction qui lance la séquence Simon complète (interdit au joueur de cliquer pendant la séquence)
function startSimonSequence() {
  canClick = false; // Pas le droit de cliquer
  playSimonStep(0); // Démarre la séquence à l'étape 0
}

// Génère une séquence aléatoire de couleurs de longueur donnée
function generateSequence(length) {
  let seq = [];
  for (let i = 0; i < length; i++) {
    // Choisit un index aléatoire entre 0 et nombre de couleurs -1
    let randomIndex = Math.floor(Math.random() * colors.length);
    // Ajoute la couleur choisie dans la séquence
    seq.push(colors[randomIndex]);
  }
  return seq; // Retourne la séquence générée
}

// Démarre le timer du joueur, s'il dépasse 5 secondes sans cliquer, le jeu se termine
function startPlayerTimer() {
  clearTimeout(timeoutId); // On enlève tout ancien timer pour éviter doublons
  timeoutId = setTimeout(() => {
    // Si le timer arrive à son terme, fin de jeu avec message "trop lent"
    endGame("HAHAHAHA TROP LENT", true);
  }, 5000); // 5000 ms = 5 secondes
}

// Remet à zéro et redémarre le timer joueur (appelé à chaque clic correct pour éviter la fin prématurée)
function resetPlayerTimer() {
  clearTimeout(timeoutId);
  startPlayerTimer();
}

// Fonction principale qui gère quand le joueur clique sur un bouton
function handlePlayerClick(color) {
  // Si c'est pas le moment de cliquer ou si la partie est finie, on ignore le clic
  if (!canClick || gameOver) return;

  // On allume le bouton cliqué (effet visuel + son)
  lightUp(color);

  // On ajoute la couleur cliquée dans la séquence du joueur
  playerSequence.push(color);

  // On récupère l'index de la dernière couleur jouée par le joueur (la plus récente)
  let currentIndex = playerSequence.length - 1;

  // On vérifie si la couleur jouée correspond à la même étape dans la séquence Simon
  if (playerSequence[currentIndex] !== simonSequence[currentIndex]) {
    // Si erreur, fin du jeu avec message "mauvaise couleur"
    endGame("HAHAHAHAH LES COMPTES SONT PAS BONS LA !", false);
    return;
  }

  // Si le joueur a reproduit toute la séquence correctement
  if (playerSequence.length === simonSequence.length) {
    score++; // On augmente le score (séquence réussie)
    scoreEl.textContent = "Score : " + score; // On affiche le nouveau score
    playerSequence = []; // On vide la séquence joueur pour la prochaine manche
    canClick = false; // Le joueur ne peut plus cliquer pendant la séquence Simon qui arrive
    clearTimeout(timeoutId); // On supprime le timer joueur

    // Si le joueur atteint le score 8 (gagné)
    if (score === 8) {
      gameOver = true; // Fin du jeu
      canClick = false; // Plus de clics autorisés
      // Message de victoire avec score
      messageEl.textContent =
        "GG T'AS GAGNÉ ! Ton score final est de : " + score;
      // On coupe la musique de fond
      music.pause();
      music.currentTime = 0;
      // On joue la fanfare de victoire
      fanfare.currentTime = 0;
      fanfare.play();
      return; // On arrête la fonction, pas besoin de générer une nouvelle séquence
    } else {
      // Sinon, on s'assure que la musique de fond continue
      if (!gameOver) music.play();
    }

    // On attend 1 seconde, puis on génère une nouvelle séquence plus longue (+1 couleur)
    setTimeout(() => {
      simonSequence = generateSequence(score + 1);
      startSimonSequence(); // Et on joue la séquence Simon à nouveau
    }, 1000);
  } else {
    // Si la séquence n'est pas encore complète, on remet à zéro le timer joueur
    resetPlayerTimer();
  }
}

// Fonction qui termine la partie avec un message, et joue le son adapté selon la cause (timeout ou erreur)
function endGame(message, isTimeout = false) {
  gameOver = true; // On bloque la partie
  canClick = false; // On bloque les clics
  clearTimeout(timeoutId); // On supprime le timer

  // Affiche le message reçu + le score final
  messageEl.textContent = message + " Ton score final est de : " + score;

  // Coupe la musique de fond
  music.pause();
  music.currentTime = 0;

  // Si c'est un timeout (joueur trop lent), joue le son "t'es nul"
  if (isTimeout) {
    tesNul.currentTime = 0;
    tesNul.play();
  } else {
    // Sinon, joue le son "mort" classique (erreur)
    soulsDeath.currentTime = 0;
    soulsDeath.play();
  }
}

// Fonction qui démarre une nouvelle partie
function startGame() {
  simonSequence = generateSequence(1); // Génère une première séquence d'une couleur
  playerSequence = []; // Vide la séquence joueur
  score = 0; // Remet le score à zéro
  gameOver = false; // Partie active
  canClick = false; // Interdit de cliquer au départ (jusqu'à la première séquence jouée)
  messageEl.textContent = "Good Luck !"; // Message d'accueil
  scoreEl.textContent = "Score : 0"; // Affiche le score

  // On stoppe et réinitialise les sons de fin/échec au cas où
  fanfare.pause();
  fanfare.currentTime = 0;
  tesNul.pause();
  tesNul.currentTime = 0;
  soulsDeath.pause();
  soulsDeath.currentTime = 0;

  music.play(); // On lance la musique de fond
  startSimonSequence(); // On lance la première séquence Simon
}

// Événement : au clic sur le bouton démarrer, on lance une nouvelle partie
startBtn.addEventListener("click", startGame);

// Pour chaque bouton couleur, on écoute le clic du joueur pour envoyer la couleur cliquée
colors.forEach((color) => {
  buttons[color].addEventListener("click", () => handlePlayerClick(color));
});
