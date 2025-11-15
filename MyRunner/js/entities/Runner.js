class Runner {
    constructor(scene, x, y, lane, isPlayer = true) {
        this.scene = scene;
        this.isPlayer = isPlayer;
        this.lane = lane; // 0 = left, 1 = center, 2 = right
        this.targetLane = lane;
        
        // Create container
        this.container = scene.add.container(x, y);
        
        // Get character customization
        const char = gameState.character;
        
        // Create modern runner with better proportions
        this.head = scene.add.circle(0, -50, 18, Phaser.Display.Color.HexStringToColor(char.hairColor).color);
        this.head.setStrokeStyle(2, 0x000000, 0.3);
        
        this.hair = scene.add.rectangle(0, -62, 30, 12, Phaser.Display.Color.HexStringToColor(char.hairColor).color);
        this.hair.setStrokeStyle(1, 0x000000, 0.3);
        
        this.body = scene.add.rectangle(0, -20, 28, 35, Phaser.Display.Color.HexStringToColor(char.shirtColor).color);
        this.body.setStrokeStyle(2, 0x000000, 0.3);
        
        this.leftLeg = scene.add.rectangle(-8, 5, 12, 25, Phaser.Display.Color.HexStringToColor(char.pantsColor).color);
        this.leftLeg.setStrokeStyle(2, 0x000000, 0.3);
        
        this.rightLeg = scene.add.rectangle(8, 5, 12, 25, Phaser.Display.Color.HexStringToColor(char.pantsColor).color);
        this.rightLeg.setStrokeStyle(2, 0x000000, 0.3);
        
        // Shoes
        this.leftShoe = scene.add.rectangle(-8, 20, 14, 8, 0x333333);
        this.rightShoe = scene.add.rectangle(8, 20, 14, 8, 0x333333);
        
        this.container.add([this.head, this.hair, this.body, this.leftLeg, this.rightLeg, this.leftShoe, this.rightShoe]);
        
        // Add accessory
        if (char.accessory === 'cap') {
            const cap = scene.add.rectangle(0, -70, 25, 6, 0xFF0000);
            cap.setStrokeStyle(1, 0x000000, 0.3);
            this.container.add(cap);
        } else if (char.accessory === 'glasses') {
            const glasses = scene.add.rectangle(0, -50, 24, 4, 0x000000);
            this.container.add(glasses);
        } else if (char.accessory === 'headband') {
            const headband = scene.add.rectangle(0, -58, 30, 5, 0xFFFF00);
            this.container.add(headband);
        } else if (char.accessory === 'watch') {
            const watch = scene.add.circle(12, -15, 4, 0xC0C0C0);
            this.container.add(watch);
        }
        
        // Add username label above character
        if (isPlayer) {
            this.nameLabel = scene.add.text(0, -85, gameState.username, {
                fontSize: '16px',
                fontFamily: 'Segoe UI',
                color: '#00d4ff',
                fontStyle: 'bold',
                backgroundColor: '#000000',
                padding: { x: 6, y: 2 }
            }).setOrigin(0.5);
            this.nameLabel.setShadow(0, 0, '#00d4ff', 5);
            this.container.add(this.nameLabel);
        }
        
        // Physics
        scene.physics.add.existing(this.container);
        this.container.body.setSize(35, 70);
        
        // Properties
        this.speed = 0;
        this.maxSpeed = isPlayer ? gameState.playerSpeed : this.calculateBotSpeed();
        this.isMoving = false;
        this.isJumping = false;
        this.jumpCooldown = 0;
        
        // Animation
        this.animationTimer = 0;
        this.legOffset = 0;
    }
    
    calculateBotSpeed() {
        const baseSpeed = GAME_SETTINGS.bot.baseSpeed;
        const levelBonus = (gameState.currentLevel - 1) * GAME_SETTINGS.bot.speedIncreasePerLevel;
        return baseSpeed + levelBonus + Phaser.Math.Between(-15, 15);
    }
    
    update(delta, cursors) {
        // Handle player controls
        if (this.isPlayer) {
            if (cursors.up.isDown) {
                this.isMoving = true;
                this.speed = Phaser.Math.Clamp(
                    this.speed + GAME_SETTINGS.runner.runAcceleration * (delta / 1000),
                    0,
                    this.maxSpeed
                );
            } else {
                this.isMoving = false;
                this.speed = Phaser.Math.Clamp(this.speed - 400 * (delta / 1000), 0, this.maxSpeed);
            }
        } else {
            // Bot auto-runs
            this.isMoving = true;
            this.speed = this.maxSpeed;
        }
        
        // Move upward
        this.container.body.setVelocityY(-this.speed);
        
        // Lane switching
        const targetX = this.scene.getLaneX(this.targetLane);
        const currentX = this.container.x;
        if (Math.abs(targetX - currentX) > 2) {
            const moveSpeed = 400;
            if (currentX < targetX) {
                this.container.x += moveSpeed * (delta / 1000);
            } else {
                this.container.x -= moveSpeed * (delta / 1000);
            }
        } else {
            this.container.x = targetX;
        }
        
        // Running animation
        if (this.isMoving && this.speed > 50) {
            this.animationTimer += delta * (this.speed / 100);
            this.legOffset = Math.sin(this.animationTimer * 0.01) * 8;
            this.leftLeg.y = 5 + this.legOffset;
            this.rightLeg.y = 5 - this.legOffset;
            this.leftShoe.y = 20 + this.legOffset;
            this.rightShoe.y = 20 - this.legOffset;
            
            // Body bob
            this.body.y = -20 + Math.abs(Math.sin(this.animationTimer * 0.01)) * 2;
        }
        
        // Jump cooldown
        if (this.jumpCooldown > 0) {
            this.jumpCooldown -= delta;
        }
        
        // Bot random lane changes
        if (!this.isPlayer && Math.random() < 0.005) {
            this.changeLane(Phaser.Math.Between(0, 2));
        }
    }
    
    changeLane(newLane) {
        if (this.jumpCooldown <= 0 && newLane >= 0 && newLane <= 2) {
            this.targetLane = newLane;
            this.jumpCooldown = 500;
            
            // Jump animation
            this.scene.tweens.add({
                targets: this.container,
                scaleX: 1.1,
                scaleY: 0.9,
                duration: 100,
                yoyo: true
            });
        }
    }
    
    getY() {
        return this.container.y;
    }
    
    getX() {
        return this.container.x;
    }
    
    destroy() {
        this.container.destroy();
    }
}
