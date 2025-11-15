// Character Manager - handles character customization persistence
class CharacterManager {
    static saveCharacter() {
        localStorage.setItem('myRunnerCharacter', JSON.stringify({
            character: gameState.character,
            username: gameState.username
        }));
    }

    static loadCharacter() {
        const saved = localStorage.getItem('myRunnerCharacter');
        if (saved) {
            const data = JSON.parse(saved);
            gameState.character = data.character;
            if (data.username) {
                gameState.username = data.username;
            }
        }
    }

    static resetCharacter() {
        gameState.character = {
            hairColor: '#8B4513',
            shirtColor: '#FF0000',
            pantsColor: '#000080',
            accessory: 'none'
        };
        gameState.username = 'Player';
        this.saveCharacter();
    }
}
