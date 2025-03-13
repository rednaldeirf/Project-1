// Variables

let gamePattern = [];
let userPattern = [];
let level = 0;
// let gameStart = false;
let gameEnd = false;
let soundOn = true;
let timerOn = true;
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
// divElement.addEventListener("click", handleReaction);
// commentBtn.addEventListener("click", commentHandler);    

//Functions
function startGame() {
    resetGame();
    computerIsPlaying = true;
    statusDisplay.innerText = "watch the sequence!";
    //after chercking both patterns and if correct score incrise 
    score++;

    const randomColor = getRandomColor();
    gamePattern.push(randomColor);
    playSequence();
}

function resetGame() {
    gamePattern = [];
    userPattern = [];
    score = 0;
    statusDisplay.innerText = "press start to play";
    resetButtonEl.style.display = "none";
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
            // playSound(color);
            // highlightButton(color);
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
    }, delay);
}

function playSound(color) {
    if (!soundOn) return; 
    console.log(`Playing sound for ${color}`);
}

function highlightButton(color) {
    const button = document.getElementById(color);
    button.classList.add("active");
    setTimeout(() => {
        button.classList.remove("active");
    }, 500);
}


// function highlightButton(color) {
//     const button = document.getElementById(color);
    
//     // Fade in effect (brighten the button)
//     button.style.transition = "opacity 0.3s ease-in-out";
//     button.style.opacity = "1"; 
    
//     setTimeout(() => {
//         // Fade out effect (dim the button back)
//         button.style.opacity = "0.5"; 
//     }, 500);
// }

// function handleUserClick(color) {
//     if (computerIsPlaying) return;

//     userPattern.push(color);
//     playSound(color);
//     highlightButton(color);

//     const currentIdx = userPattern.length - 1;
//     if (userPattern[currentIdx] !== gamePattern[currentIdx]) {
//         gameOver();
//         return;
//     }

//     if (userPattern.length === gamePattern.length) {
//     setTimeout(nextRound, stepDelay); //do i have to change it to 1000?
// }
// }
//  checkUserSequence(); // Check if the sequence is correct
// }

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
    setTimeout(nextRound, stepDelay); 
}
}


function nextRound() {
    userPattern = [];
    const randomColor = getRandomColor();
    gamePattern.push(randomColor);
    statusDisplay.innerText = `Level ${gamePattern.length}`;
    computerIsPlaying = true;
    setTimeout(playSequence, 1000);
}


function playSound(color) {
    console.log(`Playing sound for ${color}`);
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
fadeOut(randomColor);
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

