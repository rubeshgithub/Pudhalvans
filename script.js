// Grand Opening Functions
const CORRECT_MONTH = 6; // June - Change this to the correct month (1-12)

// Check if this is the first visit
function checkFirstVisit() {
    const hasVisited = localStorage.getItem('pudhalvansOpened');
    
    if (!hasVisited) {
        // First visit - show grand opening
        document.getElementById('grandOpening').style.display = 'flex';
    } else {
        // Not first visit - hide grand opening
        document.getElementById('grandOpening').style.display = 'none';
    }
}

// Verify the month
function verifyMonth() {
    const selectedMonth = parseInt(document.getElementById('monthInput').value);
    const errorDiv = document.getElementById('verificationError');
    
    if (!selectedMonth) {
        errorDiv.textContent = '⚠️ Please select a month!';
        return;
    }
    
    if (selectedMonth === CORRECT_MONTH) {
        // Correct month!
        errorDiv.textContent = '';
        document.getElementById('verificationBox').style.display = 'none';
        document.getElementById('ribbonContainer').style.display = 'block';
        
        // Add click event to scissors
        document.getElementById('scissors').addEventListener('click', cutRibbon);
    } else {
        // Wrong month
        errorDiv.textContent = '❌ Incorrect month. Please try again!';
        setTimeout(() => {
            errorDiv.textContent = '';
        }, 2000);
    }
}

// Cut the ribbon animation
function cutRibbon() {
    const scissors = document.getElementById('scissors');
    const ribbonLeft = document.getElementById('ribbonLeft');
    const ribbonRight = document.getElementById('ribbonRight');
    
    // Animate scissors
    scissors.classList.add('cutting');
    
    // Play cutting sound effect (visual feedback)
    setTimeout(() => {
        // Cut the ribbons
        ribbonLeft.classList.add('cut');
        ribbonRight.classList.add('cut');
        
        // Create confetti
        createConfetti();
        
        // Wait for animation, then close grand opening
        setTimeout(() => {
            // Mark as opened
            localStorage.setItem('pudhalvansOpened', 'true');
            
            // Fade out grand opening
            const grandOpening = document.getElementById('grandOpening');
            grandOpening.classList.add('fade-out');
            
            // Remove from DOM after fade
            setTimeout(() => {
                grandOpening.style.display = 'none';
            }, 1500);
        }, 2000);
    }, 500);
}

// Create confetti animation
function createConfetti() {
    const confettiContainer = document.getElementById('confettiContainer');
    const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#1dd1a1', '#a29bfe', '#fd79a8'];
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        
        confettiContainer.appendChild(confetti);
        
        // Remove confetti after animation
        setTimeout(() => {
            confetti.remove();
        }, 4000);
    }
}

// Check on page load
window.addEventListener('DOMContentLoaded', checkFirstVisit);

// Hidden Reset Button Feature
let titleClickCount = 0;
let resetTimeout = null;

// Add click listener to Contact Us heading
document.addEventListener('DOMContentLoaded', function() {
    // Find the Contact Us h2 in the contact section
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        const contactHeading = contactSection.querySelector('h2');
        if (contactHeading) {
            contactHeading.style.cursor = 'pointer';
            contactHeading.addEventListener('click', handleTitleClick);
        }
    }
});

function handleTitleClick() {
    titleClickCount++;
    
    // Clear previous timeout
    if (resetTimeout) {
        clearTimeout(resetTimeout);
    }
    
    // Reset counter after 3 seconds of no clicks
    resetTimeout = setTimeout(() => {
        titleClickCount = 0;
    }, 3000);
    
    // Show reset button after 5 clicks
    if (titleClickCount === 5) {
        const resetContainer = document.getElementById('resetButtonContainer');
        if (resetContainer) {
            resetContainer.style.display = 'block';
            resetContainer.style.animation = 'popIn 0.5s ease';
            
            // Show success message
            const contactHeading = document.querySelector('#contact h2');
            const originalText = contactHeading.textContent;
            contactHeading.textContent = '🎉 Secret Unlocked! 🎉';
            
            setTimeout(() => {
                contactHeading.textContent = originalText;
            }, 2000);
        }
        titleClickCount = 0;
    }
}

// Reset Grand Opening Function
function resetGrandOpening() {
    // Remove the localStorage item
    localStorage.removeItem('pudhalvansOpened');
    
    // Show confirmation
    const resetBtn = document.querySelector('.reset-opening-btn');
    const originalText = resetBtn.textContent;
    resetBtn.textContent = '✅ Reset Complete!';
    resetBtn.style.background = 'linear-gradient(135deg, #1dd1a1, #10ac84)';
    
    // Show alert
    setTimeout(() => {
        alert('🎊 Grand Opening has been reset!\n\nRefresh the page to see it again! 🎉');
        resetBtn.textContent = originalText;
        resetBtn.style.background = 'linear-gradient(135deg, #ff6b6b, #feca57)';
    }, 500);
}

// Show section function
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Remove active class from all nav buttons
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => btn.classList.remove('active'));
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
    
    // Hide all category contents when switching sections
    const categoryContents = document.querySelectorAll('.category-content');
    categoryContents.forEach(content => content.classList.remove('active'));
}

// Show category function
function showCategory(categoryId) {
    // Hide all category contents
    const categoryContents = document.querySelectorAll('.category-content');
    categoryContents.forEach(content => content.classList.remove('active'));
    
    // Show selected category
    document.getElementById(categoryId).classList.add('active');
}

// Subscribe to YouTube
function subscribeYoutube() {
    const youtubeChannelUrl = 'https://www.youtube.com/@pudhalvans_canada?sub_confirmation=1';
    window.open(youtubeChannelUrl, '_blank');
}

// Handle form submission
function handleSubmit(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const message = document.getElementById('message').value;
    
    // Here you would typically send this data to a server
    // For now, we'll just show an alert
    alert(`Thank you ${name}! Your message has been submitted.\n\nWe'll contact you at ${email} or ${phone} soon.`);
    
    // Clear the form
    document.getElementById('contactForm').reset();
}

// Cancel form
function cancelForm() {
    if (confirm('Are you sure you want to cancel? All entered data will be lost.')) {
        document.getElementById('contactForm').reset();
    }
}

// Carousel functionality
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

// Auto-advance carousel
let carouselInterval;
function startCarousel() {
    carouselInterval = setInterval(nextSlide, 4000);
}

function stopCarousel() {
    clearInterval(carouselInterval);
}

// Math Activity Functions
let currentAnswer = 3;
const animalEmojis = ['🐵', '🐯', '🐘', '🦁', '🐼', '🦊', '🐻', '🐨', '🐸', '🦋'];

function showMathLevel(level) {
    // Hide all level contents
    const levelContents = document.querySelectorAll('.level-content');
    levelContents.forEach(content => content.classList.remove('active'));
    
    // Show selected level
    document.getElementById('math-' + level).classList.add('active');
    
    // If kindergarten, start the game
    if (level === 'kindergarten') {
        nextQuestion();
    }
}

function nextQuestion() {
    // Generate random number between 1 and 5
    currentAnswer = Math.floor(Math.random() * 5) + 1;
    
    // Pick random animal
    const randomAnimal = animalEmojis[Math.floor(Math.random() * animalEmojis.length)];
    
    // Display animals
    const animalsDisplay = document.getElementById('animalsDisplay');
    animalsDisplay.innerHTML = '';
    for (let i = 0; i < currentAnswer; i++) {
        animalsDisplay.innerHTML += randomAnimal + ' ';
    }
    
    // Clear result
    document.getElementById('result').innerHTML = '';
}

function checkAnswer(selectedNumber) {
    const resultDiv = document.getElementById('result');
    
    if (selectedNumber === currentAnswer) {
        resultDiv.innerHTML = '🎉 Correct! Great job! 🌟';
        resultDiv.className = 'result-message correct';
        
        // Play victory sound
        playVictorySound();
        
        // Celebrate with confetti effect
        setTimeout(() => {
            nextQuestion();
        }, 2000);
    } else {
        resultDiv.innerHTML = '❌ Try again! Count carefully! 🤔';
        resultDiv.className = 'result-message incorrect';
    }
}

// Victory sound function
function playVictorySound() {
    // Create audio context for victory sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Play a cheerful melody
    const notes = [
        { freq: 523.25, time: 0 },      // C5
        { freq: 659.25, time: 0.15 },   // E5
        { freq: 783.99, time: 0.3 },    // G5
        { freq: 1046.50, time: 0.45 }   // C6
    ];
    
    notes.forEach(note => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = note.freq;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime + note.time);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + note.time + 0.15);
        
        oscillator.start(audioContext.currentTime + note.time);
        oscillator.stop(audioContext.currentTime + note.time + 0.15);
    });
}

// Reading Activity Functions
let currentLetter = '';
let letterSounds = {
    'A': { sound: 'ay', word: 'Apple 🍎' },
    'B': { sound: 'buh', word: 'Ball ⚽' },
    'C': { sound: 'kuh', word: 'Cat 🐱' },
    'D': { sound: 'duh', word: 'Dog 🐕' },
    'E': { sound: 'eh', word: 'Egg 🥚' },
    'F': { sound: 'fuh', word: 'Fish 🐟' },
    'G': { sound: 'guh', word: 'Goat 🐐' },
    'H': { sound: 'huh', word: 'Hat 🎩' },
    'M': { sound: 'muh', word: 'Monkey 🐵' },
    'S': { sound: 'sss', word: 'Sun ☀️' }
};

function showReadingLevel(level) {
    // Hide all level contents
    const levelContents = document.querySelectorAll('.level-content');
    levelContents.forEach(content => content.classList.remove('active'));
    
    // Show selected level
    document.getElementById('reading-' + level).classList.add('active');
    
    // If kindergarten, start the game
    if (level === 'kindergarten') {
        nextLetterQuestion();
    }
}

function nextLetterQuestion() {
    // Pick random letter
    const letters = Object.keys(letterSounds);
    currentLetter = letters[Math.floor(Math.random() * letters.length)];
    
    // Reset display
    document.getElementById('soundText').innerHTML = 'Click "Play Sound" to hear the letter!';
    document.getElementById('readingResult').innerHTML = '';
    
    // Generate letter options (correct + 3 random)
    const options = [currentLetter];
    while (options.length < 4) {
        const randomLetter = letters[Math.floor(Math.random() * letters.length)];
        if (!options.includes(randomLetter)) {
            options.push(randomLetter);
        }
    }
    
    // Shuffle options
    options.sort(() => Math.random() - 0.5);
    
    // Display options
    const letterOptionsDiv = document.getElementById('letterOptions');
    letterOptionsDiv.innerHTML = '';
    options.forEach(letter => {
        const btn = document.createElement('button');
        btn.className = 'letter-btn';
        btn.textContent = letter;
        btn.onclick = () => checkLetterAnswer(letter);
        letterOptionsDiv.appendChild(btn);
    });
}

function playLetterSound() {
    const soundText = document.getElementById('soundText');
    soundText.innerHTML = `The letter says "${letterSounds[currentLetter].sound}"<br>Like in ${letterSounds[currentLetter].word}`;
    
    // Speak the letter sound using Web Speech API
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(currentLetter);
        utterance.rate = 0.7;
        utterance.pitch = 1.2;
        window.speechSynthesis.speak(utterance);
    }
}

function checkLetterAnswer(selectedLetter) {
    const resultDiv = document.getElementById('readingResult');
    
    if (selectedLetter === currentLetter) {
        resultDiv.innerHTML = `🎉 Correct! The letter is ${currentLetter}! 🌟`;
        resultDiv.className = 'result-message correct';
        
        // Play victory sound
        playVictorySound();
        
        // Auto-advance
        setTimeout(() => {
            nextLetterQuestion();
        }, 2000);
    } else {
        resultDiv.innerHTML = '❌ Try again! Listen carefully! 👂';
        resultDiv.className = 'result-message incorrect';
    }
}

// E-book Functions
let currentEbook = '';
let currentPage = 0;

const ebooks = {
    'monkey-adventure': {
        title: 'The Monkey\'s Adventure 🐵',
        pages: [
            {
                text: 'Once upon a time, there was a curious little monkey named Milo who lived in a big, green jungle.',
                image: 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=600&h=400&fit=crop'
            },
            {
                text: 'One sunny morning, Milo decided to explore beyond his favorite banana tree. "I wonder what\'s out there!" he said excitedly.',
                image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&h=400&fit=crop'
            },
            {
                text: 'Along the way, Milo met a colorful parrot named Polly. "Hello, Milo! Where are you going?" asked Polly.',
                image: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=600&h=400&fit=crop'
            },
            {
                text: '"I\'m going on an adventure!" said Milo. "Would you like to come with me?" Polly happily agreed!',
                image: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=600&h=400&fit=crop'
            },
            {
                text: 'They walked and walked until they found a beautiful waterfall. "Wow! This is amazing!" they both shouted.',
                image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=600&h=400&fit=crop'
            },
            {
                text: 'After their adventure, Milo and Polly returned home, tired but happy. They had made wonderful memories together!',
                image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=400&fit=crop'
            },
            {
                text: 'From that day on, Milo learned that adventures are even better when shared with friends. The End!',
                image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&h=400&fit=crop'
            }
        ]
    },
    'space-explorer': {
        title: 'Space Explorer 🚀',
        pages: [
            {
                text: 'Captain Luna was the bravest space explorer in the galaxy. She loved discovering new planets!',
                image: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=600&h=400&fit=crop'
            },
            {
                text: 'One day, Luna received a special mission: to find a planet with colorful stars.',
                image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600&h=400&fit=crop'
            },
            {
                text: 'She flew her spaceship through the Milky Way, passing by twinkling stars and bright comets.',
                image: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600&h=400&fit=crop'
            },
            {
                text: 'Luna discovered a beautiful planet with rings made of rainbow colors! "This is incredible!" she said.',
                image: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=600&h=400&fit=crop'
            },
            {
                text: 'On the planet, she met friendly aliens who loved to dance and sing. They welcomed Luna with joy!',
                image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop'
            },
            {
                text: 'Luna taught the aliens Earth songs, and they taught her their space dances. Everyone had so much fun!',
                image: 'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=600&h=400&fit=crop'
            },
            {
                text: 'Luna returned home with amazing stories and new friends across the galaxy. The End!',
                image: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=600&h=400&fit=crop'
            }
        ]
    },
    'tiger-tale': {
        title: 'The Brave Tiger 🐯',
        pages: [
            {
                text: 'In a peaceful forest lived a young tiger named Tara. She was kind and loved helping others.',
                image: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=600&h=400&fit=crop'
            },
            {
                text: 'One day, a little rabbit came running. "Help! My family is stuck in a cave!" cried the rabbit.',
                image: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=600&h=400&fit=crop'
            },
            {
                text: 'Tara didn\'t hesitate. "Don\'t worry, I\'ll help you!" she said bravely.',
                image: 'https://images.unsplash.com/photo-1456926631375-92c8ce872def?w=600&h=400&fit=crop'
            },
            {
                text: 'They climbed up the rocky mountain together. It was hard, but Tara never gave up!',
                image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop'
            },
            {
                text: 'When they reached the cave, Tara used her strength to move the big rocks blocking the entrance.',
                image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600&h=400&fit=crop'
            },
            {
                text: 'The rabbit family was free! They all cheered for Tara. "Thank you, brave tiger!" they said.',
                image: 'https://images.unsplash.com/photo-1535083783855-76ae62b2914e?w=600&h=400&fit=crop'
            },
            {
                text: 'Tara learned that true bravery means helping others when they need you. The End!',
                image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop'
            }
        ]
    }
};

function openEbook(ebookId) {
    currentEbook = ebookId;
    currentPage = 0;
    
    const modal = document.getElementById('ebookModal');
    const title = document.getElementById('ebookTitle');
    
    title.textContent = ebooks[ebookId].title;
    displayPage();
    
    modal.classList.add('active');
}

function closeEbook() {
    const modal = document.getElementById('ebookModal');
    modal.classList.remove('active');
    
    // Stop any playing audio
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }
}

function displayPage() {
    const content = document.getElementById('ebookContent');
    const pageNumber = document.getElementById('pageNumber');
    const pages = ebooks[currentEbook].pages;
    const page = pages[currentPage];
    
    content.innerHTML = `
        <img src="${page.image}" alt="Story illustration" class="page-image">
        <p class="page-text">${page.text}</p>
    `;
    pageNumber.textContent = `Page ${currentPage + 1} of ${pages.length}`;
    
    // Stop any currently playing audio
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }
}

function readAloud() {
    const pages = ebooks[currentEbook].pages;
    const text = pages[currentPage].text;
    
    // Stop any currently playing audio
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        return;
    }
    
    // Create speech synthesis
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8; // Slower for kids
    utterance.pitch = 1.1; // Slightly higher pitch
    utterance.volume = 1.0;
    
    // Highlight the read button while speaking
    const readBtn = document.querySelector('.read-aloud-btn');
    readBtn.textContent = '⏸️ Stop Reading';
    
    utterance.onend = () => {
        readBtn.textContent = '🔊 Read Aloud';
    };
    
    window.speechSynthesis.speak(utterance);
}

function nextPage() {
    const pages = ebooks[currentEbook].pages;
    if (currentPage < pages.length - 1) {
        currentPage++;
        displayPage();
    }
}

function previousPage() {
    if (currentPage > 0) {
        currentPage--;
        displayPage();
    }
}

// Elementary Math Activities
let additionNum1, additionNum2, additionCorrect;
let subtractionNum1, subtractionNum2, subtractionCorrect;
let multiplicationNum1, multiplicationNum2, multiplicationCorrect;

function showElementaryMath(type) {
    // Hide all elementary activities
    const activities = document.querySelectorAll('.elementary-activity');
    activities.forEach(activity => activity.classList.remove('active'));
    
    // Show selected activity
    document.getElementById(type + '-activity').classList.add('active');
    
    // Generate first problem
    if (type === 'addition') {
        nextAddition();
    } else if (type === 'subtraction') {
        nextSubtraction();
    } else if (type === 'multiplication') {
        nextMultiplication();
    }
}

// Addition Functions
function nextAddition() {
    additionNum1 = Math.floor(Math.random() * 20) + 1;
    additionNum2 = Math.floor(Math.random() * 20) + 1;
    additionCorrect = additionNum1 + additionNum2;
    
    document.getElementById('additionProblem').textContent = `${additionNum1} + ${additionNum2} = ?`;
    document.getElementById('additionAnswer').value = '';
    document.getElementById('additionResult').innerHTML = '';
}

function checkAddition() {
    const userAnswer = parseInt(document.getElementById('additionAnswer').value);
    const resultDiv = document.getElementById('additionResult');
    
    if (isNaN(userAnswer)) {
        resultDiv.innerHTML = '⚠️ Please enter a number!';
        resultDiv.className = 'result-message incorrect';
        return;
    }
    
    if (userAnswer === additionCorrect) {
        resultDiv.innerHTML = `🎉 Correct! ${additionNum1} + ${additionNum2} = ${additionCorrect}! 🌟`;
        resultDiv.className = 'result-message correct';
        playVictorySound();
        
        setTimeout(() => {
            nextAddition();
        }, 2000);
    } else {
        resultDiv.innerHTML = '❌ Try again! Check your addition! 🤔';
        resultDiv.className = 'result-message incorrect';
    }
}

// Subtraction Functions
function nextSubtraction() {
    subtractionNum1 = Math.floor(Math.random() * 20) + 10;
    subtractionNum2 = Math.floor(Math.random() * subtractionNum1) + 1;
    subtractionCorrect = subtractionNum1 - subtractionNum2;
    
    document.getElementById('subtractionProblem').textContent = `${subtractionNum1} - ${subtractionNum2} = ?`;
    document.getElementById('subtractionAnswer').value = '';
    document.getElementById('subtractionResult').innerHTML = '';
}

function checkSubtraction() {
    const userAnswer = parseInt(document.getElementById('subtractionAnswer').value);
    const resultDiv = document.getElementById('subtractionResult');
    
    if (isNaN(userAnswer)) {
        resultDiv.innerHTML = '⚠️ Please enter a number!';
        resultDiv.className = 'result-message incorrect';
        return;
    }
    
    if (userAnswer === subtractionCorrect) {
        resultDiv.innerHTML = `🎉 Correct! ${subtractionNum1} - ${subtractionNum2} = ${subtractionCorrect}! 🌟`;
        resultDiv.className = 'result-message correct';
        playVictorySound();
        
        setTimeout(() => {
            nextSubtraction();
        }, 2000);
    } else {
        resultDiv.innerHTML = '❌ Try again! Check your subtraction! 🤔';
        resultDiv.className = 'result-message incorrect';
    }
}

// Multiplication Functions
function nextMultiplication() {
    multiplicationNum1 = Math.floor(Math.random() * 10) + 1;
    multiplicationNum2 = Math.floor(Math.random() * 10) + 1;
    multiplicationCorrect = multiplicationNum1 * multiplicationNum2;
    
    document.getElementById('multiplicationProblem').textContent = `${multiplicationNum1} × ${multiplicationNum2} = ?`;
    document.getElementById('multiplicationAnswer').value = '';
    document.getElementById('multiplicationResult').innerHTML = '';
}

function checkMultiplication() {
    const userAnswer = parseInt(document.getElementById('multiplicationAnswer').value);
    const resultDiv = document.getElementById('multiplicationResult');
    
    if (isNaN(userAnswer)) {
        resultDiv.innerHTML = '⚠️ Please enter a number!';
        resultDiv.className = 'result-message incorrect';
        return;
    }
    
    if (userAnswer === multiplicationCorrect) {
        resultDiv.innerHTML = `🎉 Correct! ${multiplicationNum1} × ${multiplicationNum2} = ${multiplicationCorrect}! 🌟`;
        resultDiv.className = 'result-message correct';
        playVictorySound();
        
        setTimeout(() => {
            nextMultiplication();
        }, 2000);
    } else {
        resultDiv.innerHTML = '❌ Try again! Check your multiplication! 🤔';
        resultDiv.className = 'result-message incorrect';
    }
}

// Middle School Math Activities
let fractionNum, fractionDenom, fractionCorrect;
let algebraX, algebraConstant, algebraSum;
let geometryWidth, geometryHeight, geometryCorrect;

function showMiddleMath(type) {
    // Hide all middle school activities
    const activities = document.querySelectorAll('.middle-activity');
    activities.forEach(activity => activity.classList.remove('active'));
    
    // Show selected activity
    document.getElementById(type + '-activity').classList.add('active');
    
    // Generate first problem
    if (type === 'fractions') {
        nextFraction();
    } else if (type === 'algebra') {
        nextAlgebra();
    } else if (type === 'geometry') {
        nextGeometry();
    }
}

// Fractions Functions
function nextFraction() {
    const fractions = [
        { num: 1, denom: 2, decimal: 0.5 },
        { num: 1, denom: 4, decimal: 0.25 },
        { num: 3, denom: 4, decimal: 0.75 },
        { num: 1, denom: 5, decimal: 0.2 },
        { num: 2, denom: 5, decimal: 0.4 },
        { num: 3, denom: 5, decimal: 0.6 },
        { num: 4, denom: 5, decimal: 0.8 },
        { num: 1, denom: 10, decimal: 0.1 },
        { num: 3, denom: 10, decimal: 0.3 },
        { num: 7, denom: 10, decimal: 0.7 }
    ];
    
    const selected = fractions[Math.floor(Math.random() * fractions.length)];
    fractionNum = selected.num;
    fractionDenom = selected.denom;
    fractionCorrect = selected.decimal;
    
    document.getElementById('fractionProblem').textContent = `${fractionNum}/${fractionDenom} = ?`;
    document.getElementById('fractionAnswer').value = '';
    document.getElementById('fractionResult').innerHTML = '';
}

function checkFraction() {
    const userAnswer = parseFloat(document.getElementById('fractionAnswer').value);
    const resultDiv = document.getElementById('fractionResult');
    
    if (isNaN(userAnswer)) {
        resultDiv.innerHTML = '⚠️ Please enter a number!';
        resultDiv.className = 'result-message incorrect';
        return;
    }
    
    if (Math.abs(userAnswer - fractionCorrect) < 0.01) {
        resultDiv.innerHTML = `🎉 Correct! ${fractionNum}/${fractionDenom} = ${fractionCorrect}! 🌟`;
        resultDiv.className = 'result-message correct';
        playVictorySound();
        
        setTimeout(() => {
            nextFraction();
        }, 2000);
    } else {
        resultDiv.innerHTML = '❌ Try again! Divide the numerator by the denominator! 🤔';
        resultDiv.className = 'result-message incorrect';
    }
}

// Algebra Functions
function nextAlgebra() {
    algebraX = Math.floor(Math.random() * 15) + 1;
    algebraConstant = Math.floor(Math.random() * 10) + 1;
    algebraSum = algebraX + algebraConstant;
    
    document.getElementById('algebraProblem').textContent = `x + ${algebraConstant} = ${algebraSum}`;
    document.getElementById('algebraAnswer').value = '';
    document.getElementById('algebraResult').innerHTML = '';
}

function checkAlgebra() {
    const userAnswer = parseInt(document.getElementById('algebraAnswer').value);
    const resultDiv = document.getElementById('algebraResult');
    
    if (isNaN(userAnswer)) {
        resultDiv.innerHTML = '⚠️ Please enter a number!';
        resultDiv.className = 'result-message incorrect';
        return;
    }
    
    if (userAnswer === algebraX) {
        resultDiv.innerHTML = `🎉 Correct! x = ${algebraX}! 🌟`;
        resultDiv.className = 'result-message correct';
        playVictorySound();
        
        setTimeout(() => {
            nextAlgebra();
        }, 2000);
    } else {
        resultDiv.innerHTML = '❌ Try again! Subtract to isolate x! 🤔';
        resultDiv.className = 'result-message incorrect';
    }
}

// Geometry Functions
function nextGeometry() {
    geometryWidth = Math.floor(Math.random() * 10) + 3;
    geometryHeight = Math.floor(Math.random() * 10) + 3;
    geometryCorrect = geometryWidth * geometryHeight;
    
    document.getElementById('widthLabel').textContent = geometryWidth;
    document.getElementById('heightLabel').textContent = geometryHeight;
    document.getElementById('geometryProblem').textContent = `Area = ?`;
    document.getElementById('geometryAnswer').value = '';
    document.getElementById('geometryResult').innerHTML = '';
    
    // Update rectangle size visually
    const rect = document.getElementById('rectangle');
    rect.style.width = (geometryWidth * 30) + 'px';
    rect.style.height = (geometryHeight * 30) + 'px';
}

function checkGeometry() {
    const userAnswer = parseInt(document.getElementById('geometryAnswer').value);
    const resultDiv = document.getElementById('geometryResult');
    
    if (isNaN(userAnswer)) {
        resultDiv.innerHTML = '⚠️ Please enter a number!';
        resultDiv.className = 'result-message incorrect';
        return;
    }
    
    if (userAnswer === geometryCorrect) {
        resultDiv.innerHTML = `🎉 Correct! Area = ${geometryWidth} × ${geometryHeight} = ${geometryCorrect}! 🌟`;
        resultDiv.className = 'result-message correct';
        playVictorySound();
        
        setTimeout(() => {
            nextGeometry();
        }, 2000);
    } else {
        resultDiv.innerHTML = '❌ Try again! Area = width × height! 🤔';
        resultDiv.className = 'result-message incorrect';
    }
}

// High School Math Activities
let quadraticA, quadraticB, quadraticC, quadraticX1, quadraticX2;
let trigAngle, trigFunction, trigCorrect;

function showHighMath(type) {
    // Hide all high school activities
    const activities = document.querySelectorAll('.high-activity');
    activities.forEach(activity => activity.classList.remove('active'));
    
    // Show selected activity
    document.getElementById(type + '-activity').classList.add('active');
    
    // Generate first problem
    if (type === 'advanced-algebra') {
        nextQuadratic();
    } else if (type === 'trigonometry') {
        nextTrig();
    }
}

// Advanced Algebra - Quadratic Equations
function nextQuadratic() {
    // Generate simple quadratic: (x - a)(x - b) = 0
    const root1 = Math.floor(Math.random() * 10) - 5; // -5 to 4
    const root2 = Math.floor(Math.random() * 10) - 5;
    
    // Expand to ax² + bx + c
    quadraticA = 1;
    quadraticB = -(root1 + root2);
    quadraticC = root1 * root2;
    quadraticX1 = Math.min(root1, root2);
    quadraticX2 = Math.max(root1, root2);
    
    let equation = 'x²';
    if (quadraticB !== 0) {
        equation += quadraticB > 0 ? ` + ${quadraticB}x` : ` - ${Math.abs(quadraticB)}x`;
    }
    if (quadraticC !== 0) {
        equation += quadraticC > 0 ? ` + ${quadraticC}` : ` - ${Math.abs(quadraticC)}`;
    }
    equation += ' = 0';
    
    document.getElementById('quadraticProblem').textContent = equation;
    document.getElementById('quadraticAnswer1').value = '';
    document.getElementById('quadraticAnswer2').value = '';
    document.getElementById('quadraticResult').innerHTML = '';
}

function checkQuadratic() {
    const userAnswer1 = parseInt(document.getElementById('quadraticAnswer1').value);
    const userAnswer2 = parseInt(document.getElementById('quadraticAnswer2').value);
    const resultDiv = document.getElementById('quadraticResult');
    
    if (isNaN(userAnswer1) || isNaN(userAnswer2)) {
        resultDiv.innerHTML = '⚠️ Please enter both solutions!';
        resultDiv.className = 'result-message incorrect';
        return;
    }
    
    const sortedAnswers = [userAnswer1, userAnswer2].sort((a, b) => a - b);
    const correctAnswers = [quadraticX1, quadraticX2];
    
    if (sortedAnswers[0] === correctAnswers[0] && sortedAnswers[1] === correctAnswers[1]) {
        resultDiv.innerHTML = `🎉 Correct! x = ${quadraticX1} and x = ${quadraticX2}! 🌟`;
        resultDiv.className = 'result-message correct';
        playVictorySound();
        
        setTimeout(() => {
            nextQuadratic();
        }, 2000);
    } else {
        resultDiv.innerHTML = '❌ Try again! Factor the equation or use the quadratic formula! 🤔';
        resultDiv.className = 'result-message incorrect';
    }
}

// Trigonometry
function nextTrig() {
    const angles = [0, 30, 45, 60, 90];
    const functions = ['sin', 'cos', 'tan'];
    
    trigAngle = angles[Math.floor(Math.random() * angles.length)];
    trigFunction = functions[Math.floor(Math.random() * functions.length)];
    
    // Skip tan(90) as it's undefined
    if (trigFunction === 'tan' && trigAngle === 90) {
        trigAngle = 45;
    }
    
    // Calculate correct answer
    const radians = trigAngle * Math.PI / 180;
    if (trigFunction === 'sin') {
        trigCorrect = Math.sin(radians);
    } else if (trigFunction === 'cos') {
        trigCorrect = Math.cos(radians);
    } else {
        trigCorrect = Math.tan(radians);
    }
    
    // Round to 2 decimal places
    trigCorrect = Math.round(trigCorrect * 100) / 100;
    
    document.getElementById('trigProblem').textContent = `${trigFunction}(${trigAngle}°) = ?`;
    document.getElementById('trigAnswer').value = '';
    document.getElementById('trigResult').innerHTML = '';
    
    // Update unit circle visual
    updateUnitCircle(trigAngle);
}

function updateUnitCircle(angle) {
    const radians = angle * Math.PI / 180;
    const x = Math.cos(radians) * 80;
    const y = -Math.sin(radians) * 80; // Negative because canvas y is inverted
    
    const point = document.getElementById('anglePoint');
    point.style.left = (100 + x) + 'px';
    point.style.top = (100 + y) + 'px';
    
    const line = document.getElementById('angleLine');
    line.style.transform = `rotate(${-angle}deg)`;
}

function checkTrig() {
    const userAnswer = parseFloat(document.getElementById('trigAnswer').value);
    const resultDiv = document.getElementById('trigResult');
    
    if (isNaN(userAnswer)) {
        resultDiv.innerHTML = '⚠️ Please enter a number!';
        resultDiv.className = 'result-message incorrect';
        return;
    }
    
    if (Math.abs(userAnswer - trigCorrect) < 0.02) {
        resultDiv.innerHTML = `🎉 Correct! ${trigFunction}(${trigAngle}°) = ${trigCorrect}! 🌟`;
        resultDiv.className = 'result-message correct';
        playVictorySound();
        
        setTimeout(() => {
            nextTrig();
        }, 2000);
    } else {
        resultDiv.innerHTML = `❌ Try again! Round to 2 decimal places! 🤔`;
        resultDiv.className = 'result-message incorrect';
    }
}

// Elementary Reading Activities
let sightWordCount = 0;
let currentRhymeWord = '';
let currentRhymeAnswer = '';

const sightWords = [
    'the', 'and', 'a', 'to', 'said', 'in', 'he', 'I', 'of', 'it',
    'was', 'you', 'they', 'on', 'she', 'is', 'for', 'at', 'his', 'but',
    'that', 'with', 'all', 'we', 'can', 'are', 'up', 'had', 'my', 'her'
];

const stories = {
    'sunny-day': {
        title: '☀️ A Sunny Day',
        content: `It was a sunny day. Sam went to the park. He saw his friend Lily. "Let's play!" said Sam. They played on the swings. They had so much fun. Then they ate ice cream. It was the best day ever!`
    },
    'best-friends': {
        title: '👫 Best Friends',
        content: `Emma and Jake are best friends. They do everything together. They read books. They draw pictures. They help each other. One day, Emma was sad. Jake gave her a flower. Emma smiled. "Thank you, friend!" she said. Friends make everything better!`
    },
    'magic-garden': {
        title: '🌺 The Magic Garden',
        content: `Behind the old house was a magic garden. The flowers could talk! "Hello!" said a red rose. "Welcome!" said a yellow sunflower. A little girl named Mia visited every day. She watered the flowers. She sang to them. The garden was always happy when Mia was there.`
    }
};

const rhymePairs = [
    { word: 'cat', rhymes: ['hat', 'bat', 'mat'], wrong: ['dog', 'car', 'sun'] },
    { word: 'dog', rhymes: ['log', 'frog', 'hog'], wrong: ['cat', 'bird', 'fish'] },
    { word: 'sun', rhymes: ['run', 'fun', 'bun'], wrong: ['moon', 'star', 'sky'] },
    { word: 'tree', rhymes: ['bee', 'see', 'free'], wrong: ['leaf', 'bird', 'nest'] },
    { word: 'ball', rhymes: ['call', 'fall', 'tall'], wrong: ['toy', 'game', 'play'] },
    { word: 'book', rhymes: ['look', 'cook', 'hook'], wrong: ['read', 'page', 'word'] },
    { word: 'rain', rhymes: ['train', 'pain', 'main'], wrong: ['cloud', 'water', 'drop'] },
    { word: 'night', rhymes: ['light', 'right', 'sight'], wrong: ['dark', 'moon', 'star'] }
];

function showElementaryReading(type) {
    // Hide all elementary reading activities
    const activities = document.querySelectorAll('.elementary-reading-activity');
    activities.forEach(activity => activity.classList.remove('active'));
    
    // Show selected activity
    document.getElementById(type + '-activity').classList.add('active');
    
    // Initialize activity
    if (type === 'sight-words') {
        sightWordCount = 0;
        document.getElementById('sightWordCount').textContent = '0';
        nextSightWord();
    } else if (type === 'rhyming') {
        nextRhyme();
    }
}

// Sight Words Functions
function nextSightWord() {
    const randomWord = sightWords[Math.floor(Math.random() * sightWords.length)];
    document.getElementById('sightWordDisplay').textContent = randomWord;
    
    // Speak the word
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(randomWord);
        utterance.rate = 0.7;
        window.speechSynthesis.speak(utterance);
    }
    
    sightWordCount++;
    document.getElementById('sightWordCount').textContent = sightWordCount;
}

// Short Stories Functions
function loadStory(storyId) {
    const story = stories[storyId];
    const storyContent = document.getElementById('storyContent');
    
    storyContent.innerHTML = `
        <h3>${story.title}</h3>
        <p class="story-text">${story.content}</p>
        <button class="read-aloud-btn" onclick="readStory('${storyId}')">🔊 Read Story Aloud</button>
    `;
}

function readStory(storyId) {
    const story = stories[storyId];
    
    // Stop any currently playing audio
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        return;
    }
    
    const utterance = new SpeechSynthesisUtterance(story.content);
    utterance.rate = 0.8;
    utterance.pitch = 1.1;
    window.speechSynthesis.speak(utterance);
}

// Rhyming Words Functions
function nextRhyme() {
    const rhymePair = rhymePairs[Math.floor(Math.random() * rhymePairs.length)];
    currentRhymeWord = rhymePair.word;
    currentRhymeAnswer = rhymePair.rhymes[Math.floor(Math.random() * rhymePair.rhymes.length)];
    
    // Create options (1 correct + 3 wrong)
    const options = [currentRhymeAnswer];
    const wrongWords = [...rhymePair.wrong];
    for (let i = 0; i < 3; i++) {
        options.push(wrongWords[i]);
    }
    
    // Shuffle options
    options.sort(() => Math.random() - 0.5);
    
    // Display
    document.getElementById('rhymeWord').textContent = currentRhymeWord;
    document.getElementById('rhymeResult').innerHTML = '';
    
    const optionsDiv = document.getElementById('rhymeOptions');
    optionsDiv.innerHTML = '';
    options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'rhyme-option-btn';
        btn.textContent = option;
        btn.onclick = () => checkRhyme(option);
        optionsDiv.appendChild(btn);
    });
}

function checkRhyme(selectedWord) {
    const resultDiv = document.getElementById('rhymeResult');
    
    if (selectedWord === currentRhymeAnswer) {
        resultDiv.innerHTML = `🎉 Correct! "${currentRhymeWord}" rhymes with "${currentRhymeAnswer}"! 🌟`;
        resultDiv.className = 'result-message correct';
        playVictorySound();
        
        setTimeout(() => {
            nextRhyme();
        }, 2000);
    } else {
        resultDiv.innerHTML = `❌ Try again! Listen to the sounds! 🤔`;
        resultDiv.className = 'result-message incorrect';
    }
}

// Middle School Reading Activities
let currentVocabWord = '';
let currentVocabAnswer = '';

const vocabWords = [
    { word: 'Persevere', correct: 'B', options: ['To give up easily', 'To continue despite difficulties', 'To run very fast', 'To speak loudly'] },
    { word: 'Eloquent', correct: 'C', options: ['Very quiet', 'Confused', 'Fluent and persuasive in speaking', 'Angry'] },
    { word: 'Diligent', correct: 'A', options: ['Hardworking and careful', 'Lazy', 'Forgetful', 'Loud'] },
    { word: 'Resilient', correct: 'B', options: ['Weak', 'Able to recover quickly from difficulties', 'Scared', 'Happy'] },
    { word: 'Meticulous', correct: 'D', options: ['Careless', 'Fast', 'Messy', 'Very careful and precise'] },
    { word: 'Ambitious', correct: 'A', options: ['Having strong desire to succeed', 'Lazy', 'Tired', 'Confused'] },
    { word: 'Compassionate', correct: 'C', options: ['Mean', 'Selfish', 'Showing sympathy and concern', 'Angry'] },
    { word: 'Innovative', correct: 'B', options: ['Old-fashioned', 'Introducing new ideas', 'Boring', 'Traditional'] }
];

function showMiddleReading(type) {
    // Hide all middle reading activities
    const activities = document.querySelectorAll('.middle-reading-activity');
    activities.forEach(activity => activity.classList.remove('active'));
    
    // Show selected activity
    document.getElementById(type + '-activity').classList.add('active');
    
    // Initialize activity
    if (type === 'vocabulary') {
        nextVocab();
    }
}

// Comprehension Functions
function checkComprehension(answer) {
    const resultDiv = document.getElementById('comprehensionResult');
    
    if (answer === 'B') {
        resultDiv.innerHTML = '🎉 Correct! The Northern Lights are caused by charged particles colliding with gases in Earth\'s atmosphere! 🌟';
        resultDiv.className = 'result-message correct';
        playVictorySound();
    } else {
        resultDiv.innerHTML = '❌ Try again! Read the passage carefully! 🤔';
        resultDiv.className = 'result-message incorrect';
    }
}

// Vocabulary Functions
function nextVocab() {
    const vocab = vocabWords[Math.floor(Math.random() * vocabWords.length)];
    currentVocabWord = vocab.word;
    currentVocabAnswer = vocab.correct;
    
    document.getElementById('vocabWord').textContent = currentVocabWord;
    document.getElementById('vocabResult').innerHTML = '';
    
    const optionsDiv = document.getElementById('vocabOptions');
    optionsDiv.innerHTML = '';
    
    vocab.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'vocab-option-btn';
        btn.textContent = option;
        btn.onclick = () => checkVocab(String.fromCharCode(65 + index));
        optionsDiv.appendChild(btn);
    });
}

function checkVocab(answer) {
    const resultDiv = document.getElementById('vocabResult');
    
    if (answer === currentVocabAnswer) {
        resultDiv.innerHTML = `🎉 Correct! You know what "${currentVocabWord}" means! 🌟`;
        resultDiv.className = 'result-message correct';
        playVictorySound();
        
        setTimeout(() => {
            nextVocab();
        }, 2000);
    } else {
        resultDiv.innerHTML = '❌ Try again! Think about the meaning! 🤔';
        resultDiv.className = 'result-message incorrect';
    }
}

// Story Analysis Functions
const analysisAnswers = {
    1: 'B', // Main conflict
    2: 'B'  // Mood
};

function checkAnalysis(questionNum, answer) {
    const resultDiv = document.getElementById('analysisResult' + questionNum);
    
    if (answer === analysisAnswers[questionNum]) {
        if (questionNum === 1) {
            resultDiv.innerHTML = '🎉 Correct! The main conflict is that Sarah can\'t find the key! 🌟';
        } else {
            resultDiv.innerHTML = '🎉 Correct! The mood is anxious and worried! 🌟';
        }
        resultDiv.className = 'result-message correct';
        playVictorySound();
    } else {
        resultDiv.innerHTML = '❌ Try again! Think about the story elements! 🤔';
        resultDiv.className = 'result-message incorrect';
    }
}

// High School Reading Activities
const literatureAnswers = {
    1: 'B', // Metaphor
    2: 'B'  // Life choices
};

const criticalAnswers = {
    1: 'B', // Balanced
    2: 'B'  // Both sides
};

function showHighReading(type) {
    // Hide all high reading activities
    const activities = document.querySelectorAll('.high-reading-activity');
    activities.forEach(activity => activity.classList.remove('active'));
    
    // Show selected activity
    document.getElementById(type + '-activity').classList.add('active');
}

// Literature Analysis Functions
function checkLiterature(questionNum, answer) {
    const resultDiv = document.getElementById('litResult' + questionNum);
    
    if (answer === literatureAnswers[questionNum]) {
        if (questionNum === 1) {
            resultDiv.innerHTML = '🎉 Correct! The roads serve as a metaphor for life choices! 🌟';
        } else {
            resultDiv.innerHTML = '🎉 Correct! The theme is about making difficult life choices! 🌟';
        }
        resultDiv.className = 'result-message correct';
        playVictorySound();
    } else {
        resultDiv.innerHTML = '❌ Try again! Consider the deeper meaning of the poem! 🤔';
        resultDiv.className = 'result-message incorrect';
    }
}

// Critical Reading Functions
function checkCritical(questionNum, answer) {
    const resultDiv = document.getElementById('criticalResult' + questionNum);
    
    if (answer === criticalAnswers[questionNum]) {
        if (questionNum === 1) {
            resultDiv.innerHTML = '🎉 Correct! The author presents a balanced, objective view! 🌟';
        } else {
            resultDiv.innerHTML = '🎉 Correct! The argument presents both sides with evidence! 🌟';
        }
        resultDiv.className = 'result-message correct';
        playVictorySound();
    } else {
        resultDiv.innerHTML = '❌ Try again! Analyze the author\'s approach carefully! 🤔';
        resultDiv.className = 'result-message incorrect';
    }
}

// Essay Writing Functions
function saveEssay() {
    const intro = document.getElementById('essayIntro').value;
    const body1 = document.getElementById('essayBody1').value;
    const body2 = document.getElementById('essayBody2').value;
    const conclusion = document.getElementById('essayConclusion').value;
    
    if (!intro && !body1 && !body2 && !conclusion) {
        document.getElementById('essayFeedback').innerHTML = '⚠️ Please write something before saving!';
        document.getElementById('essayFeedback').className = 'essay-feedback warning';
        return;
    }
    
    // Save to localStorage
    const essay = { intro, body1, body2, conclusion, timestamp: new Date().toLocaleString() };
    localStorage.setItem('essayDraft', JSON.stringify(essay));
    
    let wordCount = (intro + ' ' + body1 + ' ' + body2 + ' ' + conclusion).split(/\s+/).filter(word => word.length > 0).length;
    
    document.getElementById('essayFeedback').innerHTML = `✅ Essay saved! Word count: ${wordCount} words. Saved at ${essay.timestamp}`;
    document.getElementById('essayFeedback').className = 'essay-feedback success';
}

function clearEssay() {
    if (confirm('Are you sure you want to clear all your work?')) {
        document.getElementById('essayIntro').value = '';
        document.getElementById('essayBody1').value = '';
        document.getElementById('essayBody2').value = '';
        document.getElementById('essayConclusion').value = '';
        document.getElementById('essayFeedback').innerHTML = '';
    }
}

// Load saved essay on page load
document.addEventListener('DOMContentLoaded', function() {
    const savedEssay = localStorage.getItem('essayDraft');
    if (savedEssay) {
        const essay = JSON.parse(savedEssay);
        if (document.getElementById('essayIntro')) {
            document.getElementById('essayIntro').value = essay.intro || '';
            document.getElementById('essayBody1').value = essay.body1 || '';
            document.getElementById('essayBody2').value = essay.body2 || '';
            document.getElementById('essayConclusion').value = essay.conclusion || '';
        }
    }
});

// Mascot Messages
const mascotMessages = [
    'Welcome! 👋',
    'Keep learning! 📚',
    'You\'re doing great! ⭐',
    'Have fun! 🎉',
    'Explore more! 🚀',
    'Great job! 🌟',
    'Keep going! 💪',
    'You\'re awesome! 😊'
];

let currentMessageIndex = 0;
let currentMascotIndex = 1;

function changeMascotMessage() {
    const bubble = document.querySelector('.mascot-speech-bubble');
    if (bubble) {
        currentMessageIndex = (currentMessageIndex + 1) % mascotMessages.length;
        bubble.textContent = mascotMessages[currentMessageIndex];
    }
}

function switchMascot() {
    const mascot1 = document.getElementById('mascot1');
    const mascot2 = document.getElementById('mascot2');
    
    if (currentMascotIndex === 1) {
        mascot1.classList.remove('active');
        mascot2.classList.add('active');
        currentMascotIndex = 2;
    } else {
        mascot2.classList.remove('active');
        mascot1.classList.add('active');
        currentMascotIndex = 1;
    }
}

// Change mascot message every 5 seconds
setInterval(changeMascotMessage, 5000);

// Switch mascot every 10 seconds with fade transition
setInterval(switchMascot, 10000);

// Initialize - show home section on load
document.addEventListener('DOMContentLoaded', function() {
    showSection('home');
    if (slides.length > 0) {
        showSlide(0);
        startCarousel();
    }
});
