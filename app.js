// Variables
window.addEventListener("DOMContentLoaded", loadHighScore);

let gamePattern = [];
let userPattern = [];
let level = 0;
let gameEnd = false;
let soundOn = true;
let timerOn = true;
let clickTimer;
let audioContext;

// Cached elements
const buttonColors = ["red", "blue", "green", "yellow"];
const resetButtonEl = document.querySelector("button");
const startButton = document.getElementById("begin");
const stepDelay = 1000;
const statusDisplay = document.getElementById("status");
const soundToggleButton = document.getElementById("sound-toggle");
const levelDisplay = document.getElementById("level-display");
const timeLimit = 3000;
const soundFiles = {
  red: "./sounds/red.wav",
  blue: "./sounds/blue.wav",
  green: "./sounds/green.wav",
  yellow: "./sounds/yellow.wav",
};


const gameOverSound = new Audio("./sounds/gameover.wav");

try {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  console.log("🔊 AudioContext initialized successfully.");
} catch (error) {
  console.error("❌ Error initializing AudioContext:", error);
}



// ******************************
// Event listeners
startButton.addEventListener("click", startGame);
soundToggleButton.addEventListener("click", toggleSound);

document.querySelectorAll(".color-button").forEach((button) => {
  button.addEventListener("click", handleUserClick);
});

buttonColors.forEach((color) => {
  const button = document.getElementById(color);
  button.addEventListener("click", () => handleUserClick(color));
});

document.getElementById("toggle-timer").addEventListener("click", toggleTimer);

document.getElementById("begin").addEventListener("click", playSound);

document.addEventListener(
  "click",
  () => {
    if (!gameEnd) return;
    gameOverSound.play();
  },
  { once: true }
);

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ DOM fully loaded. Ensuring AudioContext is initialized.");
  if (!audioContext) {
      try {
          audioContext = new (window.AudioContext || window.webkitAudioContext)();
          console.log("🔊 AudioContext successfully initialized.");
      } catch (error) {
          console.error("❌ Error initializing AudioContext after DOM load:", error);
      }
  }
});

//Functions
function startGame() {
  resetGame();
  level = 1;
  updateLevelDisplay();
  computerIsPlaying = true;
  statusDisplay.innerText = "watch the sequence!";
  

const randomColor = getRandomColor();
  gamePattern.push(randomColor);
  playSequence();
}

function resetGame() {
  gamePattern = [];
  userPattern = [];
  score = 0;
  statusDisplay.innerText = "press start to play";
  
}

function getRandomColor() {
  return buttonColors[Math.floor(Math.random() * buttonColors.length)];
}

function playSequence() {
  userPattern = [];
  let delay = 0;
  for (let color of gamePattern) {
    setTimeout(() => {
      playSound(color);
      highlightButton(color);
      document.querySelectorAll(".color-button").forEach((btn) => {
        btn.style.opacity = "0.5";
      });
     
    }, delay);
    delay += stepDelay;
  }
  computerIsPlaying = true;
    statusDisplay.innerText = "watch the sequence";

  setTimeout(() => {
    computerIsPlaying = false;
    statusDisplay.innerText = "your turn";
    startClickTimer();
  }, delay);
}

function startClickTimer() {
  clearTimeout(clickTimer); // Clear any existing timer

  if (!timerOn) return; // Exit if the timer is OFF

  let timeLeft = timeLimit / 1000; // Convert to seconds
  const timerDisplay = document.getElementById("timer-display");
  // timerDisplay.innerText = `Time Left: ${timeLeft}s`;

  const countdown = setInterval(() => {
    timeLeft--;
    // timerDisplay.innerText = `Time Left: ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(countdown);
    }
  }, 1000);

  clickTimer = setTimeout(() => {
    gameOver("Time's up!"); // End game if player doesn't click in time
  }, timeLimit);
}

function toggleTimer(timeLimit) {
  timerOn = !timerOn;
  document.getElementById("toggle-timer").innerText = timerOn
    ? `Timer: ON`
    : "Timer: OFF";
}

function playSound(color) {
  if (!soundOn) return;

  let soundPath = `./sounds/${color}.wav`; // Ensure correct file path
  console.log("Loading sound from:", soundPath); // Debugging

  let audio = new Audio(soundPath);
  audio
    .play()
    .then(() => console.log(`Playing ${color} sound`))
    .catch((error) => console.error("Audio playback error:", error));
}

function highlightButton(color) {
  const button = document.getElementById(color);
  button.classList.add("active");
  setTimeout(() => {
    button.classList.remove("active");
  }, 500);
}

function highlightButton(color) {
  const button = document.getElementById(color);

  // Fade in effect (brighten the button)
  button.style.transition = "opacity 0.3s ease-in-out";
  button.style.opacity = "1";

  setTimeout(() => {
    // Fade out effect (dim the button back)
    button.style.opacity = "0.5";
  }, 500);
}

function handleUserClick(color) {
  if (computerIsPlaying) return;

  userPattern.push(color);
  playSound(color);
  highlightButton(color);

  const currentIdx = userPattern.length - 1;
  if (userPattern[currentIdx] !== gamePattern[currentIdx]) {
    gameOver();
    return;
  }

  if (userPattern.length === gamePattern.length) {
    setTimeout(nextRound, stepDelay); //do i have to change it to 1000?
  }
}


function handleUserClick(color) {
  if (computerIsPlaying) return;

  clearTimeout(clickTimer);

  userPattern.push(color);
  playSound(color);
  highlightButton(color);

  const currentIdx = userPattern.length - 1;
  if (userPattern[currentIdx] !== gamePattern[currentIdx]) {
    gameOver();
    return;
  }

  if (userPattern.length === gamePattern.length) {
    setTimeout(nextRound, stepDelay);
  }
}

function nextRound() {
  userPattern = [];
  level++;
  updateLevelDisplay();

  const randomColor = getRandomColor();
  gamePattern.push(randomColor);
  // statusDisplay.innerText = `Level ${gamePattern.length}`;
  computerIsPlaying = true;
  setTimeout(playSequence, 1000);

}

function updateLevelDisplay() {
  document.getElementById("level-counter").innerText = level;
}



function highlightButton(color) {
  const button = document.getElementById(color);
  button.classList.add("active");
  setTimeout(() => {
    button.classList.remove("active");
  }, 500);
}

function gameOver() {
  statusDisplay.innerText = "Game Over! Click Start to Try Again.";
  resetButtonEl.style.display = "block";
  computerIsPlaying = true;
  gameEnd = true;

  let finalScore = level; // Use current level as score
  console.log("🎮 Game Over! Final Score:", finalScore);

  if (soundOn) { // ✅ Only play gameOverSound if sound is ON
    playGameOverSound();
} else {
    console.log("🔇 Sound is OFF, not playing gameOver sound.");
}

  endGame(finalScore); // Ensure score is saved
  // playGameOverSound();
  
  if (!audioContext) {
    console.error("❌ AudioContext is not initialized!");
    return;
}
}

  if (soundOn) {
    console.log("🔊 Checking AudioContext state:", audioContext.state);

        // If the browser has suspended the audio context, resume it
        if (audioContext.state === "suspended") {
            audioContext.resume().then(() => {
                console.log("🔄 AudioContext resumed!");
                playGameOverSound();
            });
        } else {
            playGameOverSound();
    
        }
      }
        function playGameOverSound() {
          gameOverSound.pause(); // Stop any previous play
          gameOverSound.currentTime = 0; // Reset position
          gameOverSound.play()
              .then(() => console.log("✅ Game Over sound played successfully"))
              .catch(error => console.error("Audio playback error:", error));
      }
    

function toggleSound() {
  soundOn = !soundOn;
  if (soundOn) {
    soundToggleButton.innerText = "Sound: ON";
  } else {
    soundToggleButton.innerText = "Sound: OFF";
    console.log("sound is now:", soundOn);
  }
}


function saveHighScore(score) {

  let highScore = localStorage.getItem("highScore");

  if (!highScore || score > highScore) {
      localStorage.setItem("highScore", score);
      document.getElementById("high-score").textContent = score; // ✅ Update UI immediately
  }
}


function loadHighScore() {
  let highScore = localStorage.getItem("highScore") || 0; // Get stored high score or default to 0
  // console.log("🟢 Loading High Score:", highScore);
  document.getElementById("high-score").textContent = highScore;


}


function endGame(finalScore) {
  console.log("End Game triggered! Final Score:", finalScore);
  saveHighScore(finalScore); // Save if it's the highest score
  // alert(`Game Over! Your score: ${finalScore}`);
}
