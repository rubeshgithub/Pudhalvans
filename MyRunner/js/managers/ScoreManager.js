// Score Manager - handles trophy tracking
class ScoreManager {
    static addTrophy() {
        gameState.trophies++;
        LevelManager.saveProgress();
    }

    static getTrophyCount() {
        return gameState.trophies;
    }

    static getHighestLevel() {
        return gameState.currentLevel;
    }
}
