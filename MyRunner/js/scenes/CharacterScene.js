class CharacterScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CharacterScene' });
    }

    create() {
        const { width, height } = this.cameras.main;

        // Modern gradient background
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x0f3460, 0x0f3460, 0x1a1a2e, 0x1a1a2e, 1);
        bg.fillRect(0, 0, width, height);

        // Grid
        const grid = this.add.graphics();
        grid.lineStyle(1, 0x9d4edd, 0.1);
        for (let i = 0; i < width; i += 40) {
            grid.lineBetween(i, 0, i, height);
        }

        // Title
        const title = this.add.text(width / 2, 60, 'CHARACTER', {
            fontSize: '56px',
            fontFamily: 'Segoe UI',
            color: '#9d4edd',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        title.setShadow(0, 0, '#9d4edd', 15);

        // Username section
        this.add.text(width / 2, 140, 'Username:', {
            fontSize: '24px',
            fontFamily: 'Segoe UI',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Username display/button
        this.usernameButton = this.add.rectangle(width / 2, 180, 300, 50, 0x9d4edd, 0.3)
            .setStrokeStyle(2, 0x9d4edd)
            .setInteractive({ useHandCursor: true });

        this.usernameText = this.add.text(width / 2, 180, gameState.username, {
            fontSize: '28px',
            fontFamily: 'Segoe UI',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.usernameButton.on('pointerdown', () => this.changeUsername());
        this.usernameButton.on('pointerover', () => {
            this.usernameButton.setFillStyle(0x9d4edd, 0.6);
            this.usernameText.setShadow(0, 0, '#9d4edd', 10);
        });
        this.usernameButton.on('pointerout', () => {
            this.usernameButton.setFillStyle(0x9d4edd, 0.3);
            this.usernameText.setShadow(0, 0, '#000000', 0);
        });

        this.add.text(width / 2, 215, 'Click to change', {
            fontSize: '16px',
            fontFamily: 'Segoe UI',
            color: '#a0a0a0',
            fontStyle: 'italic'
        }).setOrigin(0.5);

        // Character preview
        this.characterPreview = this.add.container(width / 2, 320);
        this.drawCharacter();

        // Customization options
        this.createColorPicker('Hair', 450, GAME_SETTINGS.character.hairColors, 'hairColor');
        this.createColorPicker('Shirt', 540, GAME_SETTINGS.character.shirtColors, 'shirtColor');
        this.createColorPicker('Pants', 630, GAME_SETTINGS.character.pantsColors, 'pantsColor');

        // Accessory picker on new line
        this.add.text(120, 690, 'Accessory:', {
            fontSize: '26px',
            fontFamily: 'Segoe UI',
            color: '#ffffff',
            fontStyle: 'bold'
        });

        GAME_SETTINGS.character.accessories.forEach((accessory, index) => {
            const x = 280 + (index * 130);
            
            const btn = this.add.rectangle(x, 690, 120, 50, 0x9d4edd, 0.3)
                .setStrokeStyle(2, 0x9d4edd)
                .setInteractive({ useHandCursor: true });
            
            const label = this.add.text(x, 690, accessory, {
                fontSize: '20px',
                fontFamily: 'Segoe UI',
                color: '#ffffff'
            }).setOrigin(0.5);

            btn.on('pointerdown', () => {
                gameState.character.accessory = accessory;
                this.drawCharacter();
                CharacterManager.saveCharacter();
            });

            btn.on('pointerover', () => {
                btn.setFillStyle(0x9d4edd, 0.7);
                label.setShadow(0, 0, '#9d4edd', 10);
            });
            btn.on('pointerout', () => {
                btn.setFillStyle(0x9d4edd, 0.3);
                label.setShadow(0, 0, '#000000', 0);
            });
        });

        // Back button
        const backBtn = this.createButton(width / 2, height - 40, 'BACK', 0x9d4edd);
        backBtn.on('pointerdown', () => this.scene.start('MenuScene'));
    }

    changeUsername() {
        const newUsername = prompt('Enter your username (max 12 characters):', gameState.username);
        if (newUsername !== null && newUsername.trim() !== '') {
            gameState.username = newUsername.trim().substring(0, 12);
            this.usernameText.setText(gameState.username);
            CharacterManager.saveCharacter();
        }
    }

    drawCharacter() {
        this.characterPreview.removeAll(true);
        const char = gameState.character;

        // Scale up for preview
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

    createColorPicker(label, y, colors, property) {
        this.add.text(120, y, label + ':', {
            fontSize: '26px',
            fontFamily: 'Segoe UI',
            color: '#ffffff',
            fontStyle: 'bold'
        });

        colors.forEach((color, index) => {
            const x = 280 + (index * 70);
            const colorBox = this.add.rectangle(x, y, 55, 55, Phaser.Display.Color.HexStringToColor(color).color)
                .setStrokeStyle(3, 0x9d4edd, 0.5)
                .setInteractive({ useHandCursor: true });
            
            colorBox.on('pointerdown', () => {
                gameState.character[property] = color;
                this.drawCharacter();
                CharacterManager.saveCharacter();
            });

            colorBox.on('pointerover', () => {
                colorBox.setStrokeStyle(3, 0x00d4ff, 1);
                this.tweens.add({
                    targets: colorBox,
                    scaleX: 1.1,
                    scaleY: 1.1,
                    duration: 100
                });
            });
            colorBox.on('pointerout', () => {
                colorBox.setStrokeStyle(3, 0x9d4edd, 0.5);
                this.tweens.add({
                    targets: colorBox,
                    scaleX: 1,
                    scaleY: 1,
                    duration: 100
                });
            });
        });
    }



    createButton(x, y, text, color) {
        const button = this.add.container(x, y);
        
        const bg = this.add.rectangle(0, 0, 220, 60, color, 0.3)
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
