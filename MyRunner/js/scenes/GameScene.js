class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        const { width, height } = this.cameras.main;

        // Create 3 lanes
        this.laneWidth = GAME_SETTINGS.race.laneWidth;
        this.lanes = [
            width / 2 - this.laneWidth,
            width / 2,
            width / 2 + this.laneWidth
        ];

        // Draw background and track
        this.createBackground();
        this.drawTrack();

        // Finish line
        this.finishLine = -GAME_SETTINGS.race.trackLength;
        this.drawFinishLine();

        // Create player in center lane
        this.player = new Runner(this, this.lanes[1], height - 150, 1, true);

        // Create 1 bot in random lane
        const botLane = Phaser.Math.Between(0, 2);
        this.bot = new Bot(this, this.lanes[botLane], height - 150, botLane, 0);

        // Set world bounds
        this.physics.world.setBounds(0, -GAME_SETTINGS.race.trackLength - 1000, width, GAME_SETTINGS.race.trackLength + height + 1000);

        // Camera setup
        this.cameras.main.setBackgroundColor('#1a1a2e');
        this.cameras.main.startFollow(this.player.container, false, 0, 0.1);
        this.cameras.main.setLerp(0, 0.1);
        this.cameras.main.setBounds(0, -GAME_SETTINGS.race.trackLength - 1000, width, GAME_SETTINGS.race.trackLength + height + 1000);

        // UI
        this.createUI();

        // Controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // Race state
        this.raceFinished = false;
        this.playerPosition = 1;

        // Instructions
        this.showInstructions();
    }

    createBackground() {
        const { width, height } = this.cameras.main;
        const trackStart = -GAME_SETTINGS.race.trackLength - 1000;
        const trackEnd = height;
        
        // Create multiple background rectangles for better coverage
        for (let y = trackEnd; y > trackStart; y -= 1000) {
            const bgRect = this.add.rectangle(width / 2, y - 500, width, 1000, 0x1a1a2e);
            bgRect.setOrigin(0.5);
        }
        
        // Add grid lines for visual effect
        const grid = this.add.graphics();
        grid.lineStyle(1, 0x00d4ff, 0.08);
        for (let y = trackEnd; y > trackStart; y -= 80) {
            grid.lineBetween(0, y, width, y);
        }
    }

    drawTrack() {
        const { width, height } = this.cameras.main;
        const trackGraphics = this.add.graphics();
        
        // Draw lanes with modern style
        for (let y = height; y > -GAME_SETTINGS.race.trackLength - 1000; y -= 100) {
            // Lane dividers
            trackGraphics.lineStyle(2, 0x00d4ff, 0.3);
            trackGraphics.lineBetween(this.lanes[0] - this.laneWidth / 2, y, this.lanes[0] - this.laneWidth / 2, y - 50);
            trackGraphics.lineBetween(this.lanes[1] - this.laneWidth / 2, y, this.lanes[1] - this.laneWidth / 2, y - 50);
            trackGraphics.lineBetween(this.lanes[1] + this.laneWidth / 2, y, this.lanes[1] + this.laneWidth / 2, y - 50);
            trackGraphics.lineBetween(this.lanes[2] + this.laneWidth / 2, y, this.lanes[2] + this.laneWidth / 2, y - 50);
        }

        // Side barriers
        trackGraphics.lineStyle(4, 0xff006e, 0.8);
        trackGraphics.lineBetween(this.lanes[0] - this.laneWidth, height, this.lanes[0] - this.laneWidth, -GAME_SETTINGS.race.trackLength - 1000);
        trackGraphics.lineBetween(this.lanes[2] + this.laneWidth, height, this.lanes[2] + this.laneWidth, -GAME_SETTINGS.race.trackLength - 1000);
    }

    drawFinishLine() {
        const finishGraphics = this.add.graphics();
        finishGraphics.fillStyle(0xFFD700, 0.8);
        finishGraphics.fillRect(this.lanes[0] - this.laneWidth, this.finishLine - 20, this.laneWidth * 3, 40);
        
        // Checkered pattern
        for (let i = 0; i < 10; i++) {
            const x = this.lanes[0] - this.laneWidth + (i * 45);
            finishGraphics.fillStyle(i % 2 === 0 ? 0x000000 : 0xFFFFFF, 0.8);
            finishGraphics.fillRect(x, this.finishLine - 20, 45, 40);
        }

        // Finish text
        this.add.text(this.lanes[1], this.finishLine - 80, 'FINISH', {
            fontSize: '48px',
            fontFamily: 'Segoe UI',
            color: '#FFD700',
            fontStyle: 'bold'
        }).setOrigin(0.5).setShadow(0, 0, '#FFD700', 15);
    }

    getLaneX(lane) {
        return this.lanes[lane];
    }

    createUI() {
        const { width } = this.cameras.main;

        // Modern UI panel
        const uiPanel = this.add.rectangle(20, 20, 280, 180, 0x1a1a2e, 0.8).setOrigin(0).setScrollFactor(0);
        uiPanel.setStrokeStyle(2, 0x00d4ff, 0.5);

        // Level
        this.levelText = this.add.text(30, 30, `LEVEL ${gameState.currentLevel}`, {
            fontSize: '28px',
            fontFamily: 'Segoe UI',
            color: '#00d4ff',
            fontStyle: 'bold'
        }).setScrollFactor(0);

        // Position
        this.positionText = this.add.text(30, 70, 'Position: 1st', {
            fontSize: '24px',
            fontFamily: 'Segoe UI',
            color: '#ffffff'
        }).setScrollFactor(0);

        // Distance
        this.distanceText = this.add.text(30, 105, 'Distance: 0m', {
            fontSize: '24px',
            fontFamily: 'Segoe UI',
            color: '#ffffff'
        }).setScrollFactor(0);

        // Speed
        this.speedText = this.add.text(30, 140, 'Speed: 0', {
            fontSize: '24px',
            fontFamily: 'Segoe UI',
            color: '#00ff00'
        }).setScrollFactor(0);

        // Controls hint
        this.controlsText = this.add.text(30, 175, '↑ RUN  SPACE JUMP', {
            fontSize: '18px',
            fontFamily: 'Segoe UI',
            color: '#a0a0a0'
        }).setScrollFactor(0);
    }

    showInstructions() {
        const { width, height } = this.cameras.main;
        const instructions = this.add.text(width / 2, height / 2, 'Hold UP ARROW to run\nPress SPACE to jump lanes\n\nReady?', {
            fontSize: '36px',
            fontFamily: 'Segoe UI',
            color: '#ffffff',
            align: 'center',
            backgroundColor: '#000000',
            padding: { x: 30, y: 20 }
        }).setOrigin(0.5).setScrollFactor(0).setDepth(100);

        this.time.delayedCall(3000, () => {
            instructions.destroy();
        });
    }

    update(time, delta) {
        if (this.raceFinished) return;

        // Update player
        this.player.update(delta, this.cursors);

        // Update bot
        this.bot.update(delta);

        // Lane jumping with SPACE
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            // Jump to next lane (cycle through)
            const currentLane = this.player.targetLane;
            const nextLane = (currentLane + 1) % 3;
            this.player.changeLane(nextLane);
        }

        // Alternative: Left/Right arrow keys for lane selection
        if (Phaser.Input.Keyboard.JustDown(this.leftKey)) {
            const newLane = Math.max(0, this.player.targetLane - 1);
            this.player.changeLane(newLane);
        }
        if (Phaser.Input.Keyboard.JustDown(this.rightKey)) {
            const newLane = Math.min(2, this.player.targetLane + 1);
            this.player.changeLane(newLane);
        }

        // Update UI
        this.updatePosition();
        const distance = Math.floor(Math.abs(this.player.getY() - (this.cameras.main.height - 150)));
        this.distanceText.setText(`Distance: ${distance}m`);
        this.speedText.setText(`Speed: ${Math.floor(this.player.speed)}`);

        // Check finish
        if (this.player.getY() <= this.finishLine) {
            this.finishRace(true);
        } else if (this.bot.getY() <= this.finishLine) {
            this.finishRace(false);
        }
    }

    updatePosition() {
        const playerY = this.player.getY();
        const botY = this.bot.getY();
        
        const position = botY < playerY ? 2 : 1;
        this.playerPosition = position;
        
        const suffix = position === 1 ? 'st' : 'nd';
        const color = position === 1 ? '#00ff00' : '#ff6347';
        this.positionText.setText(`Position: ${position}${suffix}`);
        this.positionText.setColor(color);
    }

    finishRace(playerWon) {
        this.raceFinished = true;

        // Stop movement
        this.player.container.body.setVelocity(0, 0);
        this.bot.container.body.setVelocity(0, 0);

        // Result screen
        const { width, height } = this.cameras.main;
        
        const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.85)
            .setScrollFactor(0).setDepth(100);

        if (playerWon) {
            gameState.trophies++;
            gameState.currentLevel++;

            const winText = this.add.text(width / 2, height / 2 - 100, 'VICTORY!', {
                fontSize: '80px',
                fontFamily: 'Segoe UI',
                color: '#00d4ff',
                fontStyle: 'bold'
            }).setOrigin(0.5).setScrollFactor(0).setDepth(101);
            winText.setShadow(0, 0, '#00d4ff', 30);

            this.add.text(width / 2, height / 2 - 10, '🏆 Trophy Earned!', {
                fontSize: '42px',
                fontFamily: 'Segoe UI',
                color: '#FFD700'
            }).setOrigin(0.5).setScrollFactor(0).setDepth(101);

            this.add.text(width / 2, height / 2 + 50, `Next Level: ${gameState.currentLevel}`, {
                fontSize: '32px',
                fontFamily: 'Segoe UI',
                color: '#4CAF50'
            }).setOrigin(0.5).setScrollFactor(0).setDepth(101);
        } else {
            const loseText = this.add.text(width / 2, height / 2 - 80, 'DEFEAT', {
                fontSize: '80px',
                fontFamily: 'Segoe UI',
                color: '#ff006e',
                fontStyle: 'bold'
            }).setOrigin(0.5).setScrollFactor(0).setDepth(101);
            loseText.setShadow(0, 0, '#ff006e', 30);

            this.add.text(width / 2, height / 2 + 20, 'Train to improve your speed!', {
                fontSize: '28px',
                fontFamily: 'Segoe UI',
                color: '#ffffff'
            }).setOrigin(0.5).setScrollFactor(0).setDepth(101);
        }

        // Buttons
        const retryBtn = this.createButton(width / 2 - 140, height / 2 + 140, 'RETRY', 0x00d4ff);
        retryBtn.on('pointerdown', () => this.scene.restart());

        const menuBtn = this.createButton(width / 2 + 140, height / 2 + 140, 'MENU', 0x9d4edd);
        menuBtn.on('pointerdown', () => this.scene.start('MenuScene'));
    }

    createButton(x, y, text, color) {
        const button = this.add.container(x, y).setScrollFactor(0).setDepth(101);
        
        const bg = this.add.rectangle(0, 0, 220, 60, color, 0.3)
            .setStrokeStyle(2, color)
            .setInteractive({ useHandCursor: true });
        
        const label = this.add.text(0, 0, text, {
            fontSize: '28px',
            fontFamily: 'Segoe UI',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        button.add([bg, label]);

        bg.on('pointerover', () => {
            bg.setFillStyle(color, 0.7);
            label.setShadow(0, 0, color, 10);
        });
        bg.on('pointerout', () => {
            bg.setFillStyle(color, 0.3);
            label.setShadow(0, 0, '#000000', 0);
        });

        return bg;
    }
}
