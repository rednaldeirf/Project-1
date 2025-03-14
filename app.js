// Variables
window.onload = loadHighScore;

let gamePattern = [];
let userPattern = [];
let level = 0;
// let gameStart = false;
let gameEnd = false;
let soundOn = true;
let timerOn = true;
let clickTimer;
//5 second timer after every click
//option to turn timer off (boolean)
//mute audio (boolean)
//result message

// Cached elements
const buttonColors = ["red", "blue", "green", "yellow"];
const resetButtonEl = document.querySelector("button");
const startButton = document.getElementById('begin');
const stepDelay = 1000
const statusDisplay = document.getElementById("status"); 
const soundToggleButton = document.getElementById('sound-toggle');
const levelDisplay = document.getElementById("level-display");
const timeLimit = 3000;
const soundFiles = {
    red: "./sounds/red.wav",
    blue: "./sounds/blue.wav",
    green: "./sounds/green.wav",
    yellow: "./sounds/yellow.wav"
};

// const buttonSound = new Audio("/simon-music.mp3");
// Event listeners
startButton.addEventListener('click', startGame)
soundToggleButton.addEventListener('click', toggleSound);

document.querySelectorAll(".color-button").forEach(button => {
    button.addEventListener("click", handleUserClick);
});

buttonColors.forEach(color => {
    const button = document.getElementById(color);
    button.addEventListener("click", () => handleUserClick(color))
})

document.getElementById("toggle-timer").addEventListener("click", toggleTimer);
// divElement.addEventListener("click", handleReaction);
// commentBtn.addEventListener("click", commentHandler);    

// Add event listener to a button
document.getElementById("begin").addEventListener("click", playSound);

//Functions
function startGame() {
    resetGame();
    level = 1;
    updateLevelDisplay();

    computerIsPlaying = true;
    statusDisplay.innerText = "watch the sequence!";
    //after chercking both patterns and if correct score incrise 
    // startButton.style.position = "fixed";
    // startButton.style.zIndex = "1000";
    // score++;

    const randomColor = getRandomColor();
    gamePattern.push(randomColor);
    playSequence();
}

function resetGame() {
    gamePattern = [];
    userPattern = [];
    score = 0;
    statusDisplay.innerText = "press start to play";
    // resetButtonEl.style.display = "none";
    // statusDisplay.classList.remove("bouncing"); 
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
            document.querySelectorAll(".color-button").forEach(btn => {
                btn.style.opacity = "0.5";
            });
            highlightButton(color);
            playSound(color);
        }, delay);
        delay += stepDelay;
    }
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
    document.getElementById("toggle-timer").innerText = timerOn ? `Timer: ON`  : "Timer: OFF";
    
}

function playSound(color) {
    let soundPath = `./sounds/${color}.wav`; // Ensure correct file path
    console.log("Loading sound from:", soundPath); // Debugging

    let audio = new Audio(soundPath);
    audio.play()
        .then(() => console.log(`Playing ${color} sound`))
        .catch(error => console.error("Audio playback error:", error));
}
   
    // if (!soundOn) return; 
    // const audio = new Audio(soundFiles[color]);
    // sound.currentTime = 0; // Reset sound playback
    // audio.play();
    // sound.play();
    // buttonSound.play();
// }

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
//  checkUserSequence(); // Check if the sequence is correct
// }

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
    level ++;
    updateLevelDisplay();

    const randomColor = getRandomColor();
    gamePattern.push(randomColor);
    // statusDisplay.innerText = `Level ${gamePattern.length}`;
    computerIsPlaying = true;
    setTimeout(playSequence, 1000);

    // let currentLevel = gamePattern.length;
    // statusDisplay.innerText = `Level ${currentLevel}`;
    // levelDisplay.innerText = `Level ${currentLevel}`;

    // computerIsPlaying = true;
    // setTimeout(playSequence, 1000);
}


function updateLevelDisplay() {
    document.getElementById("level-counter").innerText = level;
}

// function playSound(color) {
//     console.log(`Playing sound for ${color}`);
// }

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
    computerIsPlaying = true; // Prevent further clicks

    statusDisplay.classList.add("bouncing");
}


function toggleSound() {
    soundOn = !soundOn;
    if (soundOn) {
        soundToggleButton.innerText = "Sound: ON";
    } else {
        soundToggleButton.innerText = "Sound: OFF";
    }
}
// function startGame() {
//     if (!started) {
//         level = 0;
//         gamePattern = [];
//         userPattern = [];
//         started = true;
//         document.getElementById('level-title').innerText = "Level " + level;
//         nextSequence();
//     }
// }

// function nextSequence() {
//   let randomNum = Math.floor(Math.random() * 4);
//   let randomColor = buttonColors[randomNum];

//   gamePattern.push(randomColor);
//   console.log("Game pattern:", gamePattern);
// }

// for (let i = 0; i <= 3; i++) {
//   nextSequence();
// }

// function handleButtonClick(color) {
//   userPattern.push(color);
//   checkAnswer(userPattern.length - 1);
// }

function fadeOut(randomColor) {
    let element = document.querySelector('#' + randomColor);
    let opacity = 1;

    function decreaseOpacity() {
        if (opacity > 0) {
            opacity -= 0.02;
            element.style.opacity = opacity;
            requestAnimationFrame(decreaseOpacity);
        } else {
            element.computedStyleMap.display = 'none'
        }
    }
    decreaseOpacity();
}
// fadeOut(randomColor);
function fadeOut(randomColor) {
  let element = document.querySelector("#" + randomColor);
  element.classList.add("fade-out");
}

// function startGame() {
//   for (let i = 0; i <= 3; i++) {
//     nextSequence();
//   }
  // Take the Game pattern, and figure out how to display it
  // gamePattern.forEach((color) => {
  //  do something here to incrementally apply css to buttons
  // })

  // Prompt the user to click the same sequence
  // Capture user clicks using event handlers

// document.querySelectorAll('box').forEach((btn) => {
//     btn.addEventListener('click', play);
// })


// Function to play the sound
// function playSound() {
//     buttonSound.play();
// }

function saveHighScore(score) {
    let highScore = localStorage.getItem("highScore"); // Get stored high score

    if (!highScore || score > highScore) { // If no high score exists OR new score is higher
        localStorage.setItem("highScore", score); // Save new high score
        console.log("New High Score:", score);
    }
}

function loadHighScore() {
    let highScore = localStorage.getItem("highScore") || 0; // Default to 0 if no score
    document.getElementById("high-score").textContent = highScore;
}

function endGame(finalScore) {
    saveHighScore(finalScore); // Save if it's the highest score
    alert(`Game Over! Your score: ${finalScore}`);
}


