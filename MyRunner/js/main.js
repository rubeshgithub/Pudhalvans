// Global game state
const gameState = {
    playerSpeed: GAME_SETTINGS.runner.baseSpeed,
    currentLevel: 1,
    trophies: 0,
    username: 'Player',
    character: {
        hairColor: '#8B4513',
        shirtColor: '#FF0000',
        pantsColor: '#000080',
        accessory: 'none'
    }
};

// Load saved data
LevelManager.loadProgress();
CharacterManager.loadCharacter();

// Initialize game scenes
GameConfig.scene = [MenuScene, CharacterScene, TrainingScene, GameScene];

// Create game instance
const game = new Phaser.Game(GameConfig);
