// Level Manager - handles level progression and difficulty
class LevelManager {
    static saveProgress() {
        localStorage.setItem('myRunnerProgress', JSON.stringify({
            currentLevel: gameState.currentLevel,
            trophies: gameState.trophies,
            playerSpeed: gameState.playerSpeed
        }));
    }

    static loadProgress() {
        const saved = localStorage.getItem('myRunnerProgress');
        if (saved) {
            const progress = JSON.parse(saved);
            gameState.currentLevel = progress.currentLevel;
            gameState.trophies = progress.trophies;
            gameState.playerSpeed = progress.playerSpeed;
        }
    }

    static resetProgress() {
        gameState.currentLevel = 1;
        gameState.trophies = 0;
        gameState.playerSpeed = GAME_SETTINGS.runner.baseSpeed;
        this.saveProgress();
    }

    static getBotDifficulty() {
        return GAME_SETTINGS.bot.baseSpeed + ((gameState.currentLevel - 1) * GAME_SETTINGS.bot.speedIncreasePerLevel);
    }
}
