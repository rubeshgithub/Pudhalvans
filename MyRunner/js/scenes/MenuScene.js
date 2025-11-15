class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {
        // Create particle texture
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        graphics.fillStyle(0xffffff);
        graphics.fillCircle(4, 4, 4);
        graphics.generateTexture('particle', 8, 8);
        graphics.destroy();
    }

    create() {
        const { width, height } = this.cameras.main;

        // Modern gradient background
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x0f3460, 0x0f3460, 0x1a1a2e, 0x1a1a2e, 1);
        bg.fillRect(0, 0, width, height);

        // Grid lines for modern look
        const grid = this.add.graphics();
        grid.lineStyle(1, 0x00d4ff, 0.1);
        for (let i = 0; i < width; i += 40) {
            grid.lineBetween(i, 0, i, height);
        }
        for (let i = 0; i < height; i += 40) {
            grid.lineBetween(0, i, width, i);
        }

        // Title with glow
        const title = this.add.text(width / 2, 150, 'MY RUNNER', {
            fontSize: '90px',
            fontFamily: 'Segoe UI',
            color: '#00d4ff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        title.setShadow(0, 0, '#00d4ff', 20, true, true);

        // Subtitle
        this.add.text(width / 2, 230, 'by Pudhalvans Games', {
            fontSize: '28px',
            fontFamily: 'Segoe UI',
            color: '#a0a0a0',
            fontStyle: 'italic'
        }).setOrigin(0.5);

        // Trophy display
        const trophyBg = this.add.rectangle(width / 2, 300, 250, 50, 0x1a1a2e, 0.8);
        trophyBg.setStrokeStyle(2, 0xFFD700);
        this.add.text(width / 2, 300, `🏆 ${gameState.trophies}`, {
            fontSize: '32px',
            fontFamily: 'Segoe UI',
            color: '#FFD700',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Buttons
        const playBtn = this.createButton(width / 2, 420, 'PLAY', 0x00d4ff);
        playBtn.on('pointerdown', () => this.scene.start('GameScene'));

        const characterBtn = this.createButton(width / 2, 510, 'CHARACTER', 0x9d4edd);
        characterBtn.on('pointerdown', () => this.scene.start('CharacterScene'));

        const trainingBtn = this.createButton(width / 2, 600, 'TRAINING', 0xff006e);
        trainingBtn.on('pointerdown', () => this.scene.start('TrainingScene'));
    }

    createButton(x, y, text, color) {
        const button = this.add.container(x, y);
        
        const bg = this.add.rectangle(0, 0, 320, 65, color, 0.2)
            .setStrokeStyle(2, color)
            .setInteractive({ useHandCursor: true });
        
        const label = this.add.text(0, 0, text, {
            fontSize: '32px',
            fontFamily: 'Segoe UI',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        button.add([bg, label]);

        bg.on('pointerover', () => {
            bg.setFillStyle(color, 0.5);
            label.setShadow(0, 0, color, 10);
        });
        bg.on('pointerout', () => {
            bg.setFillStyle(color, 0.2);
            label.setShadow(0, 0, '#000000', 0);
        });

        return bg;
    }
}
