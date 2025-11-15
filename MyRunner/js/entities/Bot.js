class Bot {
    constructor(scene, x, y, lane, botNumber) {
        this.scene = scene;
        this.botNumber = botNumber;
        this.lane = lane;
        this.targetLane = lane;
        
        // Create container
        this.container = scene.add.container(x, y);
        
        // Bot colors - different from player
        const colors = [
            { hair: 0xFF6347, shirt: 0x4169E1, pants: 0x2F4F4F },
            { hair: 0xFFD700, shirt: 0x32CD32, pants: 0x696969 },
            { hair: 0x8B4513, shirt: 0xFF1493, pants: 0x000080 }
        ];
        
        const color = colors[botNumber % colors.length];
        
        // Create modern bot
        this.head = scene.add.circle(0, -50, 18, color.hair);
        this.head.setStrokeStyle(2, 0x000000, 0.3);
        
        this.hair = scene.add.rectangle(0, -62, 30, 12, color.hair);
        this.hair.setStrokeStyle(1, 0x000000, 0.3);
        
        this.body = scene.add.rectangle(0, -20, 28, 35, color.shirt);
        this.body.setStrokeStyle(2, 0x000000, 0.3);
        
        this.leftLeg = scene.add.rectangle(-8, 5, 12, 25, color.pants);
        this.leftLeg.setStrokeStyle(2, 0x000000, 0.3);
        
        this.rightLeg = scene.add.rectangle(8, 5, 12, 25, color.pants);
        this.rightLeg.setStrokeStyle(2, 0x000000, 0.3);
        
        // Shoes
        this.leftShoe = scene.add.rectangle(-8, 20, 14, 8, 0x333333);
        this.rightShoe = scene.add.rectangle(8, 20, 14, 8, 0x333333);
        
        this.container.add([this.head, this.hair, this.body, this.leftLeg, this.rightLeg, this.leftShoe, this.rightShoe]);
        
        // Add bot name label
        const botNames = ['SpeedBot', 'RushBot', 'TurboBot', 'NitroBot', 'BlitzBot'];
        this.nameLabel = scene.add.text(0, -85, botNames[botNumber % botNames.length], {
            fontSize: '16px',
            fontFamily: 'Segoe UI',
            color: '#ff006e',
            fontStyle: 'bold',
            backgroundColor: '#000000',
            padding: { x: 6, y: 2 }
        }).setOrigin(0.5);
        this.nameLabel.setShadow(0, 0, '#ff006e', 5);
        this.container.add(this.nameLabel);
        
        // Physics
        scene.physics.add.existing(this.container);
        this.container.body.setSize(35, 70);
        
        // Properties
        this.speed = this.calculateBotSpeed();
        this.animationTimer = 0;
        this.legOffset = 0;
        this.jumpCooldown = 0;
    }
    
    calculateBotSpeed() {
        const baseSpeed = GAME_SETTINGS.bot.baseSpeed;
        const levelBonus = (gameState.currentLevel - 1) * GAME_SETTINGS.bot.speedIncreasePerLevel;
        return baseSpeed + levelBonus + Phaser.Math.Between(-15, 15);
    }
    
    update(delta) {
        // Bot auto-runs
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
        this.animationTimer += delta * (this.speed / 100);
        this.legOffset = Math.sin(this.animationTimer * 0.01) * 8;
        this.leftLeg.y = 5 + this.legOffset;
        this.rightLeg.y = 5 - this.legOffset;
        this.leftShoe.y = 20 + this.legOffset;
        this.rightShoe.y = 20 - this.legOffset;
        
        // Body bob
        this.body.y = -20 + Math.abs(Math.sin(this.animationTimer * 0.01)) * 2;
        
        // Jump cooldown
        if (this.jumpCooldown > 0) {
            this.jumpCooldown -= delta;
        }
        
        // Random lane changes
        if (Math.random() < 0.008 && this.jumpCooldown <= 0) {
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
