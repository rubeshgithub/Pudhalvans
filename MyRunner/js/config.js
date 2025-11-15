const GameConfig = {
    width: 1280,
    height: 720,
    type: Phaser.AUTO,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },
            debug: false
        }
    },
    scene: []
};

const GAME_SETTINGS = {
    runner: {
        baseSpeed: 200,
        jumpPower: 400,
        speedUpgradeAmount: 10,
        runAcceleration: 300
    },
    bot: {
        baseSpeed: 180,
        speedIncreasePerLevel: 15
    },
    race: {
        trackLength: 3000,
        botsPerRace: 3,
        laneWidth: 150
    },
    character: {
        hairColors: ['#000000', '#8B4513', '#FFD700', '#FF6347', '#4169E1', '#9370DB'],
        shirtColors: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'],
        pantsColors: ['#000080', '#8B4513', '#2F4F4F', '#696969', '#000000', '#4B0082'],
        accessories: ['none', 'cap', 'glasses', 'headband', 'watch']
    }
};
