// Upgrade Manager - handles training and speed upgrades
class UpgradeManager {
    static trainPlayer() {
        gameState.playerSpeed += GAME_SETTINGS.runner.speedUpgradeAmount;
        LevelManager.saveProgress();
        return gameState.playerSpeed;
    }

    static getPlayerSpeed() {
        return gameState.playerSpeed;
    }

    static getSpeedUpgradeAmount() {
        return GAME_SETTINGS.runner.speedUpgradeAmount;
    }
}
