class TrainingScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TrainingScene' });
    }

    create() {
        const { width, height } = this.cameras.main;

        // Modern gradient background
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x0f3460, 0x0f3460, 0x1a1a2e, 0x1a1a2e, 1);
        bg.fillRect(0, 0, width, height);

        // Grid
        const grid = this.add.graphics();
        grid.lineStyle(1, 0xff006e, 0.1);
        for (let i = 0; i < width; i += 40) {
            grid.lineBetween(i, 0, i, height);
        }

        // Title
        const title = this.add.text(width / 2, 80, 'TRAINING', {
            fontSize: '64px',
            fontFamily: 'Segoe UI',
            color: '#ff006e',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        title.setShadow(0, 0, '#ff006e', 20);

        // Speed display panel
        const speedPanel = this.add.rectangle(width / 2, 200, 400, 100, 0x1a1a2e, 0.8);
        speedPanel.setStrokeStyle(3, 0xff006e);

        this.speedText = this.add.text(width / 2, 200, `SPEED: ${gameState.playerSpeed}`, {
            fontSize: '42px',
            fontFamily: 'Segoe UI',
            color: '#00d4ff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Info
        this.add.text(width / 2, 280, `Each training adds +${GAME_SETTINGS.runner.speedUpgradeAmount} speed`, {
            fontSize: '24px',
            fontFamily: 'Segoe UI',
            color: '#a0a0a0'
        }).setOrigin(0.5);

        // Character preview
        this.characterPreview = this.add.container(width / 2, 420);
        this.drawCharacter();

        // Train button
        const trainBtn = this.createButton(width / 2, 560, `TRAIN (+${GAME_SETTINGS.runner.speedUpgradeAmount})`, 0xff006e);
        trainBtn.on('pointerdown', () => this.train());

        // Back button
        const backBtn = this.createButton(width / 2, height - 60, 'BACK', 0xff006e);
        backBtn.on('pointerdown', () => this.scene.start('MenuScene'));
    }

    train() {
        gameState.playerSpeed += GAME_SETTINGS.runner.speedUpgradeAmount;
        this.speedText.setText(`SPEED: ${gameState.playerSpeed}`);

        // Flash effect
        this.cameras.main.flash(200, 255, 0, 110);

        // Character animation
        this.tweens.add({
            targets: this.characterPreview,
            scaleX: 1.3,
            scaleY: 1.3,
            duration: 150,
            yoyo: true,
            onComplete: () => {
                // Show speed boost text
                const boostText = this.add.text(this.cameras.main.width / 2, 350, `+${GAME_SETTINGS.runner.speedUpgradeAmount} SPEED!`, {
                    fontSize: '38px',
                    fontFamily: 'Segoe UI',
                    color: '#00ff00',
                    fontStyle: 'bold'
                }).setOrigin(0.5).setAlpha(0);
                boostText.setShadow(0, 0, '#00ff00', 15);

                this.tweens.add({
                    targets: boostText,
                    alpha: 1,
                    y: 320,
                    duration: 400,
                    ease: 'Back.easeOut',
                    onComplete: () => {
                        this.time.delayedCall(1200, () => {
                            this.tweens.add({
                                targets: boostText,
                                alpha: 0,
                                y: 300,
                                duration: 300,
                                onComplete: () => boostText.destroy()
                            });
                        });
                    }
                });
            }
        });
    }

    drawCharacter() {
        const char = gameState.character;
        const scale = 2;

        const head = this.add.circle(0, -50 * scale, 18 * scale, Phaser.Display.Color.HexStringToColor(char.hairColor).color);
        head.setStrokeStyle(2, 0x000000, 0.3);
        
        const hair = this.add.rectangle(0, -62 * scale, 30 * scale, 12 * scale, Phaser.Display.Color.HexStringToColor(char.hairColor).color);
        hair.setStrokeStyle(2, 0x000000, 0.3);
        
        const body = this.add.rectangle(0, -20 * scale, 28 * scale, 35 * scale, Phaser.Display.Color.HexStringToColor(char.shirtColor).color);
        body.setStrokeStyle(2, 0x000000, 0.3);
        
        const leftLeg = this.add.rectangle(-8 * scale, 5 * scale, 12 * scale, 25 * scale, Phaser.Display.Color.HexStringToColor(char.pantsColor).color);
        leftLeg.setStrokeStyle(2, 0x000000, 0.3);
        
        const rightLeg = this.add.rectangle(8 * scale, 5 * scale, 12 * scale, 25 * scale, Phaser.Display.Color.HexStringToColor(char.pantsColor).color);
        rightLeg.setStrokeStyle(2, 0x000000, 0.3);

        const leftShoe = this.add.rectangle(-8 * scale, 20 * scale, 14 * scale, 8 * scale, 0x333333);
        const rightShoe = this.add.rectangle(8 * scale, 20 * scale, 14 * scale, 8 * scale, 0x333333);

        this.characterPreview.add([head, hair, body, leftLeg, rightLeg, leftShoe, rightShoe]);

        // Accessories
        if (char.accessory === 'cap') {
            const cap = this.add.rectangle(0, -70 * scale, 25 * scale, 6 * scale, 0xFF0000);
            cap.setStrokeStyle(2, 0x000000, 0.3);
            this.characterPreview.add(cap);
        } else if (char.accessory === 'glasses') {
            const glasses = this.add.rectangle(0, -50 * scale, 24 * scale, 4 * scale, 0x000000);
            this.characterPreview.add(glasses);
        } else if (char.accessory === 'headband') {
            const headband = this.add.rectangle(0, -58 * scale, 30 * scale, 5 * scale, 0xFFFF00);
            this.characterPreview.add(headband);
        } else if (char.accessory === 'watch') {
            const watch = this.add.circle(12 * scale, -15 * scale, 4 * scale, 0xC0C0C0);
            this.characterPreview.add(watch);
        }
    }

    createButton(x, y, text, color) {
        const button = this.add.container(x, y);
        
        const bg = this.add.rectangle(0, 0, 280, 65, color, 0.3)
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
