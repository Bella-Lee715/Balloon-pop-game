class InteractivePhonicsBalloonPopGame {
  constructor() {
    this.gameArea = document.getElementById("game-area");
    this.scoreElement = document.getElementById("score");
    this.roundElement = document.getElementById("round");
    this.correctFoundElement = document.getElementById("correct-found");
    this.startBtn = document.getElementById("start-btn");
    this.restartBtn = document.getElementById("restart-btn");
    this.popSound = document.getElementById("pop-sound");
    this.confettiContainer = document.getElementById("confetti-container");
    this.incorrectMessage = document.getElementById("incorrect-message");
    
    this.score = 0;
    this.currentRound = 1;
    this.correctFound = 0;
    this.gameRunning = false;
    this.balloons = [];
    
    // Phonics words - some start with /s/ sound, some don't
    this.words = [
      // Words that start with /s/ sound (should pop)
      { word: "sun", startsWithS: true },
      { word: "sock", startsWithS: true },
      { word: "snake", startsWithS: true },
      { word: "star", startsWithS: true },
      { word: "sail", startsWithS: true },
      { word: "soup", startsWithS: true },
      { word: "sand", startsWithS: true },
      { word: "snow", startsWithS: true },
      { word: "ship", startsWithS: true },
      { word: "seed", startsWithS: true },
      { word: "sink", startsWithS: true },
      { word: "soap", startsWithS: true },
      { word: "sail", startsWithS: true },
      { word: "sock", startsWithS: true },
      { word: "soup", startsWithS: true },
      
      // Words that don't start with /s/ sound (should not pop)
      { word: "cat", startsWithS: false },
      { word: "dog", startsWithS: false },
      { word: "hat", startsWithS: false },
      { word: "run", startsWithS: false },
      { word: "jump", startsWithS: false },
      { word: "play", startsWithS: false },
      { word: "book", startsWithS: false },
      { word: "tree", startsWithS: false },
      { word: "ball", startsWithS: false },
      { word: "fish", startsWithS: false },
      { word: "milk", startsWithS: false },
      { word: "cake", startsWithS: false },
      { word: "bird", startsWithS: false },
      { word: "house", startsWithS: false },
      { word: "car", startsWithS: false },
      { word: "door", startsWithS: false },
      { word: "window", startsWithS: false },
      { word: "table", startsWithS: false },
      { word: "chair", startsWithS: false }
    ];
    
    this.balloonColors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'cyan'];
    
    this.bindEvents();
  }
  
  bindEvents() {
    this.startBtn.addEventListener('click', () => this.startGame());
    this.restartBtn.addEventListener('click', () => this.restartGame());
  }
  
  startGame() {
    this.gameRunning = true;
    this.score = 0;
    this.currentRound = 1;
    this.correctFound = 0;
    this.updateDisplay();
    
    this.startBtn.style.display = 'none';
    this.restartBtn.style.display = 'none';
    
    this.createRound();
  }
  
  restartGame() {
    this.clearGameArea();
    this.startGame();
  }
  
  createRound() {
    this.clearGameArea();
    this.correctFound = 0;
    this.updateDisplay();
    
    // Create exactly 10 balloons with exactly 2 correct ones
    this.createBalloons();
  }
  
  createBalloons() {
    // Separate S-words and non-S-words
    const sWords = this.words.filter(w => w.startsWithS);
    const nonSWords = this.words.filter(w => !w.startsWithS);
    
    // Select exactly 2 random S-words
    const selectedSWords = this.shuffleArray([...sWords]).slice(0, 2);
    
    // Select 8 random non-S-words
    const selectedNonSWords = this.shuffleArray([...nonSWords]).slice(0, 8);
    
    // Combine and shuffle all selected words
    const allSelectedWords = this.shuffleArray([...selectedSWords, ...selectedNonSWords]);
    
    // Create 10 balloons
    for (let i = 0; i < 10; i++) {
      const wordData = allSelectedWords[i];
      const balloon = this.createBalloon(wordData.word, wordData.startsWithS);
      this.balloons.push(balloon);
    }
  }
  
  createBalloon(word, startsWithS) {
    const balloon = document.createElement("div");
    balloon.classList.add("balloon");
    
    // Random color
    const color = this.balloonColors[Math.floor(Math.random() * this.balloonColors.length)];
    balloon.classList.add(color);
    
    // Larger size (120-160px)
    const size = Math.floor(Math.random() * 40) + 120;
    balloon.style.width = size + 'px';
    balloon.style.height = size + 'px';
    
    // Position in bottom half of screen
    const maxX = this.gameArea.clientWidth - size;
    const maxY = this.gameArea.clientHeight - size;
    const minY = this.gameArea.clientHeight * 0.4; // Start from 40% down
    const availableY = maxY - minY;
    
    balloon.style.left = Math.random() * maxX + 'px';
    balloon.style.top = minY + Math.random() * availableY + 'px';
    
    // Add the word text
    balloon.textContent = word;
    
    // Store the word data
    balloon.setAttribute('data-word', word);
    balloon.setAttribute('data-starts-with-s', startsWithS);
    
    // Add click event
    balloon.addEventListener('click', () => this.handleBalloonClick(balloon, startsWithS));
    
    this.gameArea.appendChild(balloon);
    return balloon;
  }
  
  handleBalloonClick(balloon, startsWithS) {
    if (!this.gameRunning) return;
    
    if (startsWithS) {
      // Correct balloon - pop it!
      this.score += 10;
      this.correctFound++;
      balloon.classList.add('popped');
      
      // Play pop sound
      this.playPopSound();
      
      // Create confetti animation
      this.createConfetti();
      
      // Remove balloon after animation
      setTimeout(() => {
        balloon.remove();
        this.balloons = this.balloons.filter(b => b !== balloon);
        
        // Check if both correct balloons are popped
        if (this.correctFound >= 2) {
          this.nextRound();
        }
      }, 800);
      
    } else {
      // Wrong balloon - show incorrect message
      this.showIncorrectMessage();
    }
    
    this.updateDisplay();
  }
  
  nextRound() {
    this.currentRound++;
    this.updateDisplay();
    
    // Brief delay before next round
    setTimeout(() => {
      this.createRound();
    }, 1500);
  }
  
  showIncorrectMessage() {
    this.incorrectMessage.classList.add('show');
    
    setTimeout(() => {
      this.incorrectMessage.classList.remove('show');
    }, 1000);
  }
  
  createConfetti() {
    // Create 20 confetti pieces
    for (let i = 0; i < 20; i++) {
      const confetti = document.createElement('div');
      confetti.classList.add('confetti');
      
      // Random position across the screen
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.animationDelay = Math.random() * 0.5 + 's';
      
      this.confettiContainer.appendChild(confetti);
      
      // Remove confetti after animation
      setTimeout(() => {
        confetti.remove();
      }, 3000);
    }
  }
  
  playPopSound() {
    // Reset and play the pop sound
    this.popSound.currentTime = 0;
    this.popSound.play().catch(e => {
      // Fallback if audio fails
      console.log('Pop!');
    });
  }
  
  updateDisplay() {
    this.scoreElement.textContent = this.score;
    this.roundElement.textContent = this.currentRound;
    this.correctFoundElement.textContent = this.correctFound;
  }
  
  clearGameArea() {
    this.gameArea.innerHTML = '';
    this.balloons = [];
  }
  
  endGame() {
    this.gameRunning = false;
    
    const gameOverDiv = document.createElement('div');
    gameOverDiv.className = 'game-over';
    gameOverDiv.innerHTML = `
      <h2>🎉 Amazing Job! 🎉</h2>
      <p>You completed ${this.currentRound} rounds!</p>
      <p>Final Score: ${this.score}</p>
      <p>Great phonics practice!</p>
    `;
    
    this.gameArea.appendChild(gameOverDiv);
    
    setTimeout(() => {
      this.restartBtn.style.display = 'inline-block';
    }, 2000);
  }
  
  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
  new InteractivePhonicsBalloonPopGame();
});
