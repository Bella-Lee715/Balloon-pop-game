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
    this.totalRounds = 5;
    
    // Phonics words - some start with /s/ sound, some don't
    this.words = [
      // Words that start with /s/ sound (should pop)
      { word: "sun", startsWithS: true, img: "images/sun.jpg" },
      { word: "sock", startsWithS: true, img: "images/sock.jpg" },
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
      { word: "sock", startsWithS: true, img: "images/sock.jpg" },
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
    
    // Create balloons for the current round
    this.createBalloons();
  }
  
  createBalloons() {
    // Separate S-words and non-S-words
    const sWords = this.words.filter(w => w.startsWithS);
    const nonSWords = this.words.filter(w => !w.startsWithS);
    
    // Ensure we have S-words available
    if (sWords.length === 0) {
      console.error('No S-words available for the game!');
      return;
    }
    
    // Select the correct word based on current round
    let correctWord;
    if (this.currentRound === 1) {
      // Round 1: Always "sock" with image
      correctWord = this.words.find(w => w.word === "sock");
    } else if (this.currentRound === 2) {
      // Round 2: Always "sun" with image
      correctWord = this.words.find(w => w.word === "sun");
    } else if (this.currentRound >= 3 && this.currentRound <= 5) {
      // Rounds 3-5: Random S-word from the list
      const availableSWords = sWords.filter(w => w.word !== "sock" && w.word !== "sun"); // Exclude already used words
      if (availableSWords.length > 0) {
        correctWord = availableSWords[Math.floor(Math.random() * availableSWords.length)];
      } else {
        // Fallback to any S-word if no others available
        correctWord = sWords[Math.floor(Math.random() * sWords.length)];
      }
    }
    
    // Fallback: If the specific word is not found, use a random S-word
    if (!correctWord) {
      console.warn(`Specific word for round ${this.currentRound} not found, using random S-word`);
      correctWord = sWords[Math.floor(Math.random() * sWords.length)];
    }
    
    // Ensure we have a valid correct word
    if (!correctWord || !correctWord.startsWithS) {
      console.error(`Invalid correct word for round ${this.currentRound}, using first S-word`);
      correctWord = sWords[0];
    }
    
    // Select 5-7 random non-S-words (incorrect answers)
    const numIncorrect = Math.floor(Math.random() * 3) + 5; // 5-7 incorrect balloons
    const selectedNonSWords = this.shuffleArray([...nonSWords]).slice(0, numIncorrect);
    
    // Ensure we have enough non-S-words
    if (selectedNonSWords.length < numIncorrect) {
      console.warn(`Not enough non-S-words available, using ${selectedNonSWords.length} distractors`);
    }
    
    // Combine the selected words: 1 correct + incorrect = total
    const allSelectedWords = [correctWord, ...selectedNonSWords];
    
    // Shuffle the combined list to randomize positions
    const shuffledWords = this.shuffleArray(allSelectedWords);
    
    // Create balloons with proper spacing
    const placedBalloons = [];
    let correctBalloonCreated = false;
    
    for (let i = 0; i < shuffledWords.length; i++) {
      const wordData = shuffledWords[i];
      const balloon = this.createBalloonWithSpacing(wordData.word, wordData.startsWithS, placedBalloons);
      if (balloon) {
        this.balloons.push(balloon);
        placedBalloons.push(balloon);
        
        // Track if we've created the correct balloon
        if (wordData.startsWithS) {
          correctBalloonCreated = true;
        }
      }
    }
    
    // Verify that we have exactly one correct balloon
    const correctBalloons = this.balloons.filter(b => b.getAttribute('data-starts-with-s') === 'true');
    if (correctBalloons.length !== 1) {
      console.error(`Round ${this.currentRound}: Expected 1 correct balloon, found ${correctBalloons.length}`);
      
      // Emergency fix: If no correct balloon was created, force create one
      if (correctBalloons.length === 0 && !correctBalloonCreated) {
        console.warn('No correct balloon created, forcing creation of correct balloon');
        const emergencyBalloon = this.createBalloonWithSpacing(correctWord.word, true, placedBalloons);
        if (emergencyBalloon) {
          this.balloons.push(emergencyBalloon);
        }
      }
    } else {
      console.log(`Round ${this.currentRound}: Successfully created 1 correct balloon with word "${correctWord.word}"`);
    }
  }
  
  createBalloonWithSpacing(word, startsWithS, placedBalloons) {
    const balloon = document.createElement("div");
    balloon.classList.add("balloon");
    
    // Random color
    const color = this.balloonColors[Math.floor(Math.random() * this.balloonColors.length)];
    balloon.classList.add(color);
    
    // Consistent size for better spacing (130-150px)
    const size = Math.floor(Math.random() * 20) + 130;
    balloon.style.width = size + 'px';
    balloon.style.height = size + 'px';
    
    // Find the word data to check for image
    const wordData = this.words.find(w => w.word === word);
    
    // Add content based on whether image is available
    if (wordData && wordData.img) {
      // Create image element - ONLY the image, no text
      const img = document.createElement("img");
      img.src = wordData.img;
      img.alt = word;
      img.classList.add("balloon-img");
      
      // Clear any existing content and add image
      balloon.innerHTML = '';
      balloon.appendChild(img);
    } else {
      // Add the word text only (no image)
      balloon.textContent = word;
    }
    
    // Store the word data
    balloon.setAttribute('data-word', word);
    balloon.setAttribute('data-starts-with-s', startsWithS);
    
    // Find a position that doesn't overlap with existing balloons
    const position = this.findNonOverlappingPosition(size, placedBalloons);
    if (!position) {
      // If we can't find a position, try with a smaller size
      const smallerSize = Math.max(110, size - 20);
      balloon.style.width = smallerSize + 'px';
      balloon.style.height = smallerSize + 'px';
      const smallerPosition = this.findNonOverlappingPosition(smallerSize, placedBalloons);
      if (!smallerPosition) {
        // For correct balloons, try even smaller size or force placement
        if (startsWithS) {
          console.warn(`Could not place correct balloon for word "${word}", trying forced placement`);
          // Force placement at a random position
          const gameAreaWidth = this.gameArea.clientWidth;
          const gameAreaHeight = this.gameArea.clientHeight;
          const minY = gameAreaHeight * 0.5;
          const maxY = gameAreaHeight - smallerSize - 20;
          const availableY = maxY - minY;
          
          balloon.style.left = Math.random() * (gameAreaWidth - smallerSize) + 'px';
          balloon.style.top = minY + Math.random() * availableY + 'px';
        } else {
          console.warn(`Could not place balloon for word "${word}"`);
          return null; // Skip this balloon if we can't place it
        }
      } else {
        balloon.style.left = smallerPosition.x + 'px';
        balloon.style.top = smallerPosition.y + 'px';
      }
    } else {
      balloon.style.left = position.x + 'px';
      balloon.style.top = position.y + 'px';
    }
    
    // Add click event
    balloon.addEventListener('click', () => this.handleBalloonClick(balloon, startsWithS));
    
    this.gameArea.appendChild(balloon);
    return balloon;
  }
  
  findNonOverlappingPosition(size, placedBalloons) {
    const maxAttempts = 200; // Increased attempts for better placement
    const gameAreaWidth = this.gameArea.clientWidth;
    const gameAreaHeight = this.gameArea.clientHeight;
    
    // Place balloons only in the lower half of the screen
    const minY = gameAreaHeight * 0.5; // Start from 50% down (lower half only)
    const maxY = gameAreaHeight - size - 20; // Leave 20px margin from bottom
    const availableY = maxY - minY;
    
    // Generous spacing to ensure no overlap and text visibility
    const minSpacing = size + 40; // Increased spacing for better separation
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const x = Math.random() * (gameAreaWidth - size);
      const y = minY + Math.random() * availableY;
      
      // Check if this position overlaps with any existing balloon
      let overlaps = false;
      
      for (const existingBalloon of placedBalloons) {
        const existingRect = existingBalloon.getBoundingClientRect();
        const gameAreaRect = this.gameArea.getBoundingClientRect();
        
        const existingX = existingRect.left - gameAreaRect.left;
        const existingY = existingRect.top - gameAreaRect.top;
        const existingSize = parseInt(existingBalloon.style.width);
        
        // Calculate distance between balloon centers
        const centerX1 = x + size / 2;
        const centerY1 = y + size / 2;
        const centerX2 = existingX + existingSize / 2;
        const centerY2 = existingY + existingSize / 2;
        
        const distance = Math.sqrt(
          Math.pow(centerX1 - centerX2, 2) + Math.pow(centerY1 - centerY2, 2)
        );
        
        // Check for overlap using rectangle intersection as well
        const rect1 = { x, y, width: size, height: size };
        const rect2 = { x: existingX, y: existingY, width: existingSize, height: existingSize };
        
        if (distance < minSpacing || this.rectanglesOverlap(rect1, rect2)) {
          overlaps = true;
          break;
        }
      }
      
      if (!overlaps) {
        return { x, y };
      }
    }
    
    return null; // Could not find a non-overlapping position
  }
  
  rectanglesOverlap(rect1, rect2) {
    // Check if two rectangles overlap
    return !(rect1.x + rect1.width < rect2.x || 
             rect2.x + rect2.width < rect1.x || 
             rect1.y + rect1.height < rect2.y || 
             rect2.y + rect2.height < rect1.y);
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
      
      // Create explosion effect
      this.createExplosion();
      
      // Remove balloon after animation
      setTimeout(() => {
        balloon.remove();
        this.balloons = this.balloons.filter(b => b !== balloon);
        
        // Check if the correct balloon is popped (only 1 correct balloon now)
        if (this.correctFound >= 1) {
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
    
    // Check if game is complete
    if (this.currentRound > this.totalRounds) {
      this.endGame();
      return;
    }
    
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
  
  createExplosion() {
    // Create full-screen firework explosion effect
    const explosionColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFEAA7', '#A29BFE', '#FDCB6E', '#FD79A8', '#FFD93D', '#6BCF7F', '#4D96FF'];
    
    // Create multiple explosion particles across the entire screen
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.classList.add('explosion-particle');
      
      // Random color from explosion palette
      const color = explosionColors[Math.floor(Math.random() * explosionColors.length)];
      particle.style.backgroundColor = color;
      
      // Random position across the entire screen
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      
      particle.style.left = x + 'px';
      particle.style.top = y + 'px';
      
      // Random size and animation delay
      const size = Math.random() * 12 + 6;
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      particle.style.animationDelay = Math.random() * 0.5 + 's';
      
      this.confettiContainer.appendChild(particle);
      
      // Remove particle after animation
      setTimeout(() => {
        particle.remove();
      }, 3000);
    }
    
    // Play celebratory sound effect
    this.playCelebrationSound();
  }
  
  playCelebrationSound() {
    // Create a celebratory sound using Web Audio API
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Create a fanfare-like sound with multiple tones
      const frequencies = [523.25, 659.25, 783.99, 1046.50]; // C, E, G, C (higher)
      const duration = 0.3;
      
      frequencies.forEach((freq, index) => {
        setTimeout(() => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
          oscillator.type = 'sine';
          
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + duration);
        }, index * 150); // Stagger the notes
      });
    } catch (e) {
      // Fallback if Web Audio API is not supported
      console.log('🎉 Celebration! 🎉');
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
      <h2>🎉 Congratulations! 🎉</h2>
      <p>You completed all ${this.totalRounds} rounds!</p>
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
const sound = new Audio("sounds/fanfare.mp3");
sound.play();


