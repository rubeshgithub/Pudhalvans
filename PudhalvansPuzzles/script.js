// Kid-friendly puzzle images from Unsplash
const puzzles = [
    {
        name: 'Cute Animals',
        image: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=600&h=600&fit=crop'
    },
    {
        name: 'Colorful Parrot',
        image: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=600&h=600&fit=crop'
    },
    {
        name: 'Happy Dog',
        image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&h=600&fit=crop'
    },
    {
        name: 'Cute Cat',
        image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=600&fit=crop'
    },
    {
        name: 'Beautiful Butterfly',
        image: 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=600&h=600&fit=crop'
    },
    {
        name: 'Colorful Flowers',
        image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&h=600&fit=crop'
    },
    {
        name: 'Rainbow',
        image: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=600&h=600&fit=crop'
    },
    {
        name: 'Beach Scene',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=600&fit=crop'
    }
];

let currentPuzzle = null;
let currentDifficulty = 'easy';
let gridSize = 2;
let placedPieces = 0;
let draggedPiece = null;
let puzzlePieces = [];

// Initialize game
function initGame() {
    setupEventListeners();
    showDifficultyScreen();
}

function setupEventListeners() {
    document.getElementById('newPuzzleBtn').addEventListener('click', startNewPuzzle);
    document.getElementById('hintBtn').addEventListener('click', toggleHint);
    document.getElementById('changeDifficultyBtn').addEventListener('click', backToDifficulty);
}

function showDifficultyScreen() {
    document.getElementById('difficultyScreen').style.display = 'flex';
    document.getElementById('gameArea').style.display = 'none';
}

function selectDifficulty(difficulty) {
    currentDifficulty = difficulty;
    
    // Set grid size based on difficulty
    if (difficulty === 'easy') {
        gridSize = 2; // 2x2 = 4 pieces
    } else if (difficulty === 'medium') {
        gridSize = 3; // 3x3 = 9 pieces
    } else if (difficulty === 'hard') {
        gridSize = 4; // 4x4 = 16 pieces
    }
    
    // Hide difficulty screen and show game
    document.getElementById('difficultyScreen').style.display = 'none';
    document.getElementById('gameArea').style.display = 'block';
    
    startNewPuzzle();
}

function backToDifficulty() {
    document.getElementById('victoryScreen').classList.remove('show');
    showDifficultyScreen();
}

function startNewPuzzle() {
    // Hide victory screen
    document.getElementById('victoryScreen').classList.remove('show');
    
    // Select random puzzle
    currentPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
    placedPieces = 0;
    
    const totalPieces = gridSize * gridSize;
    
    // Update UI
    document.getElementById('piecesPlaced').textContent = '0';
    document.getElementById('totalPieces').textContent = totalPieces;
    document.getElementById('hintImg').src = currentPuzzle.image;
    document.getElementById('hintImage').classList.remove('show');
    
    // Update grid layout
    const puzzleBoard = document.getElementById('puzzleBoard');
    const piecesBox = document.getElementById('piecesBox');
    puzzleBoard.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    piecesBox.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    
    // Create puzzle pieces from image
    createImagePuzzle();
}

function createImagePuzzle() {
    const board = document.getElementById('puzzleBoard');
    const piecesBox = document.getElementById('piecesBox');
    board.innerHTML = '';
    piecesBox.innerHTML = '';
    
    puzzlePieces = [];
    const totalPieces = gridSize * gridSize;
    const pieceWidth = 100 / gridSize;
    const pieceHeight = 100 / gridSize;
    
    // Create puzzle pieces data
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const index = row * gridSize + col;
            puzzlePieces.push({
                index: index,
                row: row,
                col: col,
                backgroundPosition: `${col * pieceWidth}% ${row * pieceHeight}%`
            });
        }
    }
    
    // Create board slots
    puzzlePieces.forEach((piece) => {
        const slot = document.createElement('div');
        slot.className = 'puzzle-slot';
        slot.dataset.index = piece.index;
        
        // Add drop event listeners
        slot.addEventListener('dragover', handleDragOver);
        slot.addEventListener('dragleave', handleDragLeave);
        slot.addEventListener('drop', handleDrop);
        
        board.appendChild(slot);
    });
    
    // Shuffle and create pieces
    const shuffled = [...puzzlePieces].sort(() => Math.random() - 0.5);
    
    shuffled.forEach((piece) => {
        const pieceElement = document.createElement('div');
        pieceElement.className = 'puzzle-piece';
        pieceElement.draggable = true;
        pieceElement.dataset.index = piece.index;
        
        // Set background image
        pieceElement.style.backgroundImage = `url(${currentPuzzle.image})`;
        pieceElement.style.backgroundSize = `${gridSize * 100}% ${gridSize * 100}%`;
        pieceElement.style.backgroundPosition = piece.backgroundPosition;
        
        // Add drag event listeners
        pieceElement.addEventListener('dragstart', handleDragStart);
        pieceElement.addEventListener('dragend', handleDragEnd);
        
        piecesBox.appendChild(pieceElement);
    });
}

function handleDragStart(e) {
    draggedPiece = e.target;
    e.target.style.opacity = '0.5';
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.innerHTML);
}

function handleDragEnd(e) {
    e.target.style.opacity = '1';
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    e.target.classList.add('drag-over');
    return false;
}

function handleDragLeave(e) {
    e.target.classList.remove('drag-over');
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    e.preventDefault();
    
    const slot = e.target.closest('.puzzle-slot');
    slot.classList.remove('drag-over');
    
    // Check if slot is already filled
    if (slot.classList.contains('filled')) {
        return false;
    }
    
    // Check if piece matches
    const droppedPiece = draggedPiece.dataset.piece;
    const correctPiece = slot.dataset.correctPiece;
    
    if (droppedPiece === correctPiece) {
        // Correct placement!
        slot.textContent = droppedPiece;
        slot.classList.add('filled');
        draggedPiece.classList.add('placed');
        
        placedPieces++;
        document.getElementById('piecesPlaced').textContent = placedPieces;
        
        // Play success sound (visual feedback)
        slot.style.animation = 'bounceIn 0.5s ease';
        setTimeout(() => {
            slot.style.animation = '';
        }, 500);
        
        // Check if puzzle is complete
        if (placedPieces === currentPuzzle.pieces.length) {
            setTimeout(showVictory, 500);
        }
    } else {
        // Wrong placement - shake animation
        slot.style.animation = 'shake 0.5s ease';
        setTimeout(() => {
            slot.style.animation = '';
        }, 500);
    }
    
    return false;
}

function toggleHint() {
    const hintImage = document.getElementById('hintImage');
    hintImage.classList.toggle('show');
}

function showVictory() {
    document.getElementById('victoryScreen').classList.add('show');
    
    // Play victory sound (visual feedback)
    const victoryContent = document.querySelector('.victory-content');
    victoryContent.style.animation = 'bounceIn 0.6s ease';
}

// Add shake animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
        20%, 40%, 60%, 80% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);

// Start game when page loads
window.addEventListener('DOMContentLoaded', initGame);
