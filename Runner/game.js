// Game Configuration
const config = {
    canvas: document.getElementById('gameCanvas'),
    width: 900,
    height: 650,
    gravity: 0.8,
    jumpForce: -16,
    groundLevel: 520,
    playerSize: 80,
    obstacleWidth: 40,
    obstacleHeight: 50,
    baseSpeed: 5,
    speedIncrement: 0.5
};

// Game State
const game = {
    ctx: null,
    isRunning: false,
    isPaused: false,
    score: 0,
    lives: 1,
    currentLevel: 1,
    speed: config.baseSpeed,
    frameCount: 0,
    player: null,
    obstacles: [],
    particles: [],
    selectedCharacter: 'runner',
    cameraAngle: 'side',
    cameraMode: 'side'
};

// Level Configuration - Progressive difficulty curve with longer levels
const levels = [
    // Level 1: Very Easy - Tutorial level (kept short)
    { number: 1, targetScore: 300, obstacleFrequency: 180, speed: 4, obstacleTypes: ['car'] },
    
    // Level 2-3: Easy - Learning phase (longer)
    { number: 2, targetScore: 1200, obstacleFrequency: 150, speed: 4.5, obstacleTypes: ['car'] },
    { number: 3, targetScore: 1800, obstacleFrequency: 130, speed: 5, obstacleTypes: ['car', 'table'] },
    
    // Level 4-6: Medium - Building skills (longer)
    { number: 4, targetScore: 2500, obstacleFrequency: 110, speed: 5.5, obstacleTypes: ['car', 'table'] },
    { number: 5, targetScore: 3200, obstacleFrequency: 95, speed: 6, obstacleTypes: ['car', 'table', 'barrier'] },
    { number: 6, targetScore: 4000, obstacleFrequency: 85, speed: 6.5, obstacleTypes: ['car', 'table', 'barrier'] },
    
    // Level 7-10: Challenging - Getting harder (longer)
    { number: 7, targetScore: 5000, obstacleFrequency: 75, speed: 7, obstacleTypes: ['car', 'table', 'barrier'] },
    { number: 8, targetScore: 6000, obstacleFrequency: 68, speed: 7.5, obstacleTypes: ['car', 'table', 'barrier', 'spike'] },
    { number: 9, targetScore: 7000, obstacleFrequency: 62, speed: 8, obstacleTypes: ['car', 'table', 'barrier', 'spike'] },
    { number: 10, targetScore: 8000, obstacleFrequency: 58, speed: 8.5, obstacleTypes: ['car', 'table', 'barrier', 'spike'] },
    
    // Level 11-15: Hard - Expert territory (longer)
    { number: 11, targetScore: 9200, obstacleFrequency: 54, speed: 9, obstacleTypes: ['car', 'table', 'barrier', 'spike'] },
    { number: 12, targetScore: 10500, obstacleFrequency: 50, speed: 9.5, obstacleTypes: ['car', 'table', 'barrier', 'spike'] },
    { number: 13, targetScore: 11800, obstacleFrequency: 47, speed: 10, obstacleTypes: ['car', 'table', 'barrier', 'spike'] },
    { number: 14, targetScore: 13000, obstacleFrequency: 44, speed: 10.5, obstacleTypes: ['car', 'table', 'barrier', 'spike'] },
    { number: 15, targetScore: 14500, obstacleFrequency: 41, speed: 11, obstacleTypes: ['car', 'table', 'barrier', 'spike'] },
    
    // Level 16-20: Very Hard - Master challenge (longest)
    { number: 16, targetScore: 16000, obstacleFrequency: 38, speed: 11.5, obstacleTypes: ['car', 'table', 'barrier', 'spike'] },
    { number: 17, targetScore: 17500, obstacleFrequency: 36, speed: 12, obstacleTypes: ['car', 'table', 'barrier', 'spike'] },
    { number: 18, targetScore: 19000, obstacleFrequency: 34, speed: 12.5, obstacleTypes: ['car', 'table', 'barrier', 'spike'] },
    { number: 19, targetScore: 21000, obstacleFrequency: 32, speed: 13, obstacleTypes: ['car', 'table', 'barrier', 'spike'] },
    { number: 20, targetScore: 23000, obstacleFrequency: 30, speed: 13.5, obstacleTypes: ['car', 'table', 'barrier', 'spike'] }
];

// Player Class
class Player {
    constructor(character = 'runner') {
        this.x = 100;
        this.y = config.groundLevel;
        this.width = config.playerSize;
        this.height = config.playerSize;
        this.velocityY = 0;
        this.isJumping = false;
        this.character = character;
        this.animationFrame = 0;
        
        // Character colors and properties
        this.characters = {
            runner: { 
                color: '#FF6B6B', 
                name: 'Runner',
                power: 'speed',
                powerCooldown: 0,
                powerDuration: 0
            },
            ninja: { 
                color: '#2C3E50', 
                name: 'Ninja',
                power: 'dash',
                powerCooldown: 0,
                powerDuration: 0
            },
            robot: { 
                color: '#95A5A6', 
                name: 'Robot',
                power: 'shield',
                powerCooldown: 0,
                powerDuration: 0
            },
            alien: { 
                color: '#9B59B6', 
                name: 'Alien',
                power: 'float',
                powerCooldown: 0,
                powerDuration: 0
            },
            // New characters unlocked at level 20
            cyborg: {
                color: '#00D9FF',
                name: 'Cyborg',
                power: 'timeslow',
                powerCooldown: 0,
                powerDuration: 0
            },
            wizard: {
                color: '#9C27B0',
                name: 'Wizard',
                power: 'teleport',
                powerCooldown: 0,
                powerDuration: 0
            },
            samurai: {
                color: '#D32F2F',
                name: 'Samurai',
                power: 'slash',
                powerCooldown: 0,
                powerDuration: 0
            },
            phoenix: {
                color: '#FF6F00',
                name: 'Phoenix',
                power: 'revive',
                powerCooldown: 0,
                powerDuration: 0
            }
        };
        
        this.color = this.characters[character].color;
        this.power = this.characters[character].power;
        this.powerCooldown = 0;
        this.powerDuration = 0;
        this.hasShield = false;
    }

    jump() {
        if (!this.isJumping) {
            this.velocityY = config.jumpForce;
            this.isJumping = true;
        }
    }
    
    activatePower() {
        if (this.powerCooldown > 0) return;
        
        switch(this.power) {
            case 'speed':
                // Runner: Double speed for 3 seconds
                this.powerDuration = 180;
                this.powerCooldown = 600;
                game.speed = config.baseSpeed * 2;
                break;
            case 'dash':
                // Ninja: Instant forward dash
                this.x += 150;
                this.powerCooldown = 300;
                break;
            case 'shield':
                // Robot: Shield for 5 seconds
                this.hasShield = true;
                this.powerDuration = 300;
                this.powerCooldown = 600;
                break;
            case 'float':
                // Alien: Slow fall for 4 seconds
                this.powerDuration = 240;
                this.powerCooldown = 480;
                break;
            // New powers for level 20+ characters
            case 'timeslow':
                // Cyborg: Slow down time for 5 seconds
                this.powerDuration = 300;
                this.powerCooldown = 720;
                game.timeSlowActive = true;
                break;
            case 'teleport':
                // Wizard: Teleport past 3 obstacles
                this.powerCooldown = 420;
                game.obstacles.splice(0, 3);
                this.x += 200;
                break;
            case 'slash':
                // Samurai: Destroy next 2 obstacles
                this.powerCooldown = 360;
                game.obstacles.splice(0, 2);
                break;
            case 'revive':
                // Phoenix: Auto-revive on next death
                this.powerCooldown = 900;
                this.hasRevive = true;
                break;
        }
    }
    
    updatePower() {
        // Update power duration
        if (this.powerDuration > 0) {
            this.powerDuration--;
            
            // Handle power effects
            if (this.power === 'float' && this.isJumping) {
                this.velocityY *= 0.7; // Slow fall
            }
            
            // Power ended
            if (this.powerDuration === 0) {
                if (this.power === 'speed') {
                    const levelConfig = levels[game.currentLevel - 1];
                    game.speed = levelConfig.speed;
                }
                if (this.power === 'shield') {
                    this.hasShield = false;
                }
            }
        }
        
        // Update cooldown
        if (this.powerCooldown > 0) {
            this.powerCooldown--;
        }
    }

    update() {
        this.velocityY += config.gravity;
        this.y += this.velocityY;

        if (this.y >= config.groundLevel) {
            this.y = config.groundLevel;
            this.velocityY = 0;
            this.isJumping = false;
        }
        
        // Update animation frame for running
        if (!this.isJumping) {
            this.animationFrame = (this.animationFrame + 0.2) % 2;
        }
        
        // Update power effects
        this.updatePower();
    }

    draw(ctx) {
        switch(this.character) {
            case 'runner':
                this.drawRunner(ctx);
                break;
            case 'ninja':
                this.drawNinja(ctx);
                break;
            case 'robot':
                this.drawRobot(ctx);
                break;
            case 'alien':
                this.drawAlien(ctx);
                break;
        }
    }
    
    drawRunner(ctx) {
        const legOffset = Math.floor(this.animationFrame) === 0 ? 5 : -5;
        const armSwing = Math.floor(this.animationFrame) === 0 ? 5 : -5;
        const scale = 1.4;
        const bobbing = Math.sin(this.animationFrame * 3) * 2;
        
        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.ellipse(this.x + 25, this.y + 58, 12, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Head (circular with shading)
        const headGradient = ctx.createRadialGradient(this.x + 22, this.y + 8, 2, this.x + 25, this.y + 10, 10);
        headGradient.addColorStop(0, '#FFD4C4');
        headGradient.addColorStop(1, '#FDBCB4');
        ctx.fillStyle = headGradient;
        ctx.beginPath();
        ctx.arc(this.x + 25, this.y + 10, 10 * scale, 0, Math.PI * 2);
        ctx.fill();
        
        // Hair with realistic texture and highlights
        const hairGradient = ctx.createLinearGradient(this.x + 20, this.y, this.x + 40, this.y + 10);
        hairGradient.addColorStop(0, '#6B3410');
        hairGradient.addColorStop(0.5, '#8B4513');
        hairGradient.addColorStop(1, '#5A2A0A');
        ctx.fillStyle = hairGradient;
        ctx.beginPath();
        ctx.arc(this.x + 30, this.y + 6 + bobbing, 13 * scale, Math.PI, 0);
        ctx.fill();
        
        // Hair strands for detail
        ctx.strokeStyle = '#5A2A0A';
        ctx.lineWidth = 2;
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.moveTo(this.x + 20 + i * 5, this.y + 6 + bobbing);
            ctx.lineTo(this.x + 20 + i * 5, this.y + 2 + bobbing);
            ctx.stroke();
        }
        
        // Hair highlight
        ctx.fillStyle = 'rgba(139, 90, 43, 0.3)';
        ctx.beginPath();
        ctx.arc(this.x + 25, this.y + 4 + bobbing, 6, Math.PI, 0);
        ctx.fill();
        
        // Eyes with realistic depth
        // Eye sockets (shadow)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.beginPath();
        ctx.ellipse(this.x + 24, this.y + 12 + bobbing, 3.5, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(this.x + 36, this.y + 12 + bobbing, 3.5, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Eye whites
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.ellipse(this.x + 24, this.y + 12 + bobbing, 3, 3.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(this.x + 36, this.y + 12 + bobbing, 3, 3.5, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Iris
        ctx.fillStyle = '#4A90E2';
        ctx.beginPath();
        ctx.arc(this.x + 24, this.y + 12 + bobbing, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + 36, this.y + 12 + bobbing, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Pupils
        ctx.fillStyle = '#1A1A1A';
        ctx.beginPath();
        ctx.arc(this.x + 24, this.y + 12 + bobbing, 1.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + 36, this.y + 12 + bobbing, 1.2, 0, Math.PI * 2);
        ctx.fill();
        
        // Eye shine (multiple layers)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.beginPath();
        ctx.arc(this.x + 24.5, this.y + 11 + bobbing, 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + 36.5, this.y + 11 + bobbing, 1, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.beginPath();
        ctx.arc(this.x + 23.5, this.y + 13 + bobbing, 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + 35.5, this.y + 13 + bobbing, 0.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Eyebrows
        ctx.strokeStyle = '#6B3410';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(this.x + 20, this.y + 8 + bobbing);
        ctx.quadraticCurveTo(this.x + 24, this.y + 7 + bobbing, this.x + 28, this.y + 8 + bobbing);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(this.x + 32, this.y + 8 + bobbing);
        ctx.quadraticCurveTo(this.x + 36, this.y + 7 + bobbing, this.x + 40, this.y + 8 + bobbing);
        ctx.stroke();
        
        // Nose with shadow
        ctx.fillStyle = '#E8A89A';
        ctx.beginPath();
        ctx.moveTo(this.x + 30, this.y + 15 + bobbing);
        ctx.lineTo(this.x + 28, this.y + 17 + bobbing);
        ctx.lineTo(this.x + 32, this.y + 17 + bobbing);
        ctx.closePath();
        ctx.fill();
        
        // Nose highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.ellipse(this.x + 30, this.y + 15 + bobbing, 1, 1.5, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Smile with depth
        ctx.strokeStyle = '#C97A6B';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(this.x + 30, this.y + 18 + bobbing, 5, 0.3, Math.PI - 0.3);
        ctx.stroke();
        
        // Smile highlight
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(this.x + 30, this.y + 17.5 + bobbing, 5, 0.4, Math.PI - 0.4);
        ctx.stroke();
        
        // Neck with gradient
        const neckGradient = ctx.createLinearGradient(this.x + 25, this.y + 22 + bobbing, this.x + 35, this.y + 26 + bobbing);
        neckGradient.addColorStop(0, '#FDBCB4');
        neckGradient.addColorStop(1, '#E8A89A');
        ctx.fillStyle = neckGradient;
        ctx.fillRect(this.x + 25, this.y + 22 + bobbing, 10, 6);
        
        // Body/Shirt (with gradient)
        const shirtGradient = ctx.createLinearGradient(this.x + 15, this.y + 25, this.x + 35, this.y + 35);
        shirtGradient.addColorStop(0, this.color);
        shirtGradient.addColorStop(1, '#E85555');
        ctx.fillStyle = shirtGradient;
        ctx.beginPath();
        ctx.ellipse(this.x + 25, this.y + 32, 12 * scale, 10 * scale, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Shirt collar
        ctx.strokeStyle = '#D84545';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x + 21, this.y + 23);
        ctx.lineTo(this.x + 25, this.y + 26);
        ctx.lineTo(this.x + 29, this.y + 23);
        ctx.stroke();
        
        // Arms (rounded, swinging with shading)
        ctx.fillStyle = '#FDBCB4';
        ctx.beginPath();
        ctx.ellipse(this.x + 10, this.y + 28 + armSwing, 4 * scale, 10 * scale, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(this.x + 40, this.y + 28 - armSwing, 4 * scale, 10 * scale, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Hands
        ctx.fillStyle = '#FDBCB4';
        ctx.beginPath();
        ctx.arc(this.x + 10, this.y + 36 + armSwing, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + 40, this.y + 36 - armSwing, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Pants/Legs (rounded, alternating)
        ctx.fillStyle = '#2C3E50';
        ctx.beginPath();
        ctx.ellipse(this.x + 19, this.y + 48 + legOffset, 4.5 * scale, 10 * scale, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(this.x + 31, this.y + 48 - legOffset, 4.5 * scale, 10 * scale, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Shoes (rounded with detail)
        ctx.fillStyle = '#34495E';
        ctx.beginPath();
        ctx.ellipse(this.x + 19, this.y + 56 + legOffset, 5, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(this.x + 31, this.y + 56 - legOffset, 5, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Shoe laces
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(this.x + 17, this.y + 55 + legOffset);
        ctx.lineTo(this.x + 21, this.y + 55 + legOffset);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(this.x + 29, this.y + 55 - legOffset);
        ctx.lineTo(this.x + 33, this.y + 55 - legOffset);
        ctx.stroke();
    }
    
    drawNinja(ctx) {
        const legOffset = Math.floor(this.animationFrame) === 0 ? 5 : -5;
        const armSwing = Math.floor(this.animationFrame) === 0 ? 5 : -5;
        const scale = 1.4;
        const bobbing = Math.sin(this.animationFrame * 3) * 2;
        
        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.ellipse(this.x + 25, this.y + 58, 12, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Head (circular with shading)
        const headGradient = ctx.createRadialGradient(this.x + 22, this.y + 8, 2, this.x + 25, this.y + 10, 10);
        headGradient.addColorStop(0, '#FFD4C4');
        headGradient.addColorStop(1, '#FDBCB4');
        ctx.fillStyle = headGradient;
        ctx.beginPath();
        ctx.arc(this.x + 25, this.y + 10, 10 * scale, 0, Math.PI * 2);
        ctx.fill();
        
        // Ninja mask (covers lower face with gradient)
        const maskGradient = ctx.createLinearGradient(this.x + 15, this.y + 10, this.x + 35, this.y + 15);
        maskGradient.addColorStop(0, this.color);
        maskGradient.addColorStop(1, '#1A1A1A');
        ctx.fillStyle = maskGradient;
        ctx.beginPath();
        ctx.arc(this.x + 25, this.y + 13, 10 * scale, 0, Math.PI);
        ctx.fill();
        
        // Headband with texture
        ctx.fillStyle = '#E74C3C';
        ctx.fillRect(this.x + 13, this.y + 5, 24, 4);
        ctx.fillStyle = '#C0392B';
        ctx.fillRect(this.x + 13, this.y + 7, 24, 1);
        
        // Headband knot
        ctx.fillStyle = '#E74C3C';
        ctx.beginPath();
        ctx.ellipse(this.x + 38, this.y + 7, 3, 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(this.x + 38, this.y + 7, 6, 2);
        
        // Eyes (narrow slits with glow)
        ctx.fillStyle = 'white';
        ctx.shadowColor = 'white';
        ctx.shadowBlur = 3;
        ctx.fillRect(this.x + 19, this.y + 10, 5, 2);
        ctx.fillRect(this.x + 26, this.y + 10, 5, 2);
        ctx.shadowBlur = 0;
        
        // Neck
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x + 21, this.y + 19, 8, 4);
        
        // Body/Ninja suit (with gradient)
        const suitGradient = ctx.createLinearGradient(this.x + 15, this.y + 25, this.x + 35, this.y + 35);
        suitGradient.addColorStop(0, this.color);
        suitGradient.addColorStop(1, '#1A1A1A');
        ctx.fillStyle = suitGradient;
        ctx.beginPath();
        ctx.ellipse(this.x + 25, this.y + 32, 12 * scale, 10 * scale, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Belt
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(this.x + 15, this.y + 32, 20, 3);
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(this.x + 23, this.y + 31, 4, 5);
        
        // Arms (rounded, swinging with shading)
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(this.x + 10, this.y + 28 + armSwing, 4 * scale, 10 * scale, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(this.x + 40, this.y + 28 - armSwing, 4 * scale, 10 * scale, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Hands with wraps
        ctx.fillStyle = '#1A1A1A';
        ctx.beginPath();
        ctx.arc(this.x + 10, this.y + 36 + armSwing, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + 40, this.y + 36 - armSwing, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Pants/Legs (rounded, alternating)
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(this.x + 19, this.y + 48 + legOffset, 4.5 * scale, 10 * scale, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(this.x + 31, this.y + 48 - legOffset, 4.5 * scale, 10 * scale, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Ninja shoes (tabi boots)
        ctx.fillStyle = '#1A1A1A';
        ctx.beginPath();
        ctx.ellipse(this.x + 19, this.y + 56 + legOffset, 5, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(this.x + 31, this.y + 56 - legOffset, 5, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Toe separation on tabi
        ctx.strokeStyle = '#2C3E50';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(this.x + 19, this.y + 54 + legOffset);
        ctx.lineTo(this.x + 19, this.y + 58 + legOffset);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(this.x + 31, this.y + 54 - legOffset);
        ctx.lineTo(this.x + 31, this.y + 58 - legOffset);
        ctx.stroke();
    }
    
    drawRobot(ctx) {
        const legOffset = Math.floor(this.animationFrame) === 0 ? 5 : -5;
        const armSwing = Math.floor(this.animationFrame) === 0 ? 5 : -5;
        const scale = 1.4;
        const bobbing = Math.sin(this.animationFrame * 3) * 1;
        
        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.ellipse(this.x + 25, this.y + 58, 12, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Head (metallic with gradient)
        const headGradient = ctx.createLinearGradient(this.x + 15, this.y, this.x + 35, this.y + 15);
        headGradient.addColorStop(0, '#BDC3C7');
        headGradient.addColorStop(0.5, this.color);
        headGradient.addColorStop(1, '#7F8C8D');
        ctx.fillStyle = headGradient;
        ctx.beginPath();
        ctx.roundRect(this.x + 15, this.y, 20, 16, 5);
        ctx.fill();
        
        // Head border/panel lines
        ctx.strokeStyle = '#5D6D7E';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(this.x + 15, this.y, 20, 16, 5);
        ctx.stroke();
        
        // Antenna with light
        ctx.fillStyle = '#7F8C8D';
        ctx.fillRect(this.x + 23, this.y - 7, 4, 7);
        ctx.fillStyle = '#E74C3C';
        ctx.beginPath();
        ctx.arc(this.x + 25, this.y - 8, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FF6B6B';
        ctx.beginPath();
        ctx.arc(this.x + 25, this.y - 8, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Eyes (LED with glow)
        ctx.fillStyle = '#3498DB';
        ctx.shadowColor = '#3498DB';
        ctx.shadowBlur = 5;
        ctx.beginPath();
        ctx.arc(this.x + 20, this.y + 8, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + 30, this.y + 8, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // Eye highlights
        ctx.fillStyle = '#5DADE2';
        ctx.beginPath();
        ctx.arc(this.x + 21, this.y + 7, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + 31, this.y + 7, 1.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Mouth panel (speaker grille)
        ctx.fillStyle = '#34495E';
        ctx.fillRect(this.x + 19, this.y + 12, 12, 3);
        ctx.strokeStyle = '#2C3E50';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.moveTo(this.x + 20 + i * 2, this.y + 12);
            ctx.lineTo(this.x + 20 + i * 2, this.y + 15);
            ctx.stroke();
        }
        
        // Neck joint with bolts
        ctx.fillStyle = '#7F8C8D';
        ctx.fillRect(this.x + 21, this.y + 16, 8, 5);
        ctx.fillStyle = '#5D6D7E';
        ctx.beginPath();
        ctx.arc(this.x + 23, this.y + 18, 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + 27, this.y + 18, 1, 0, Math.PI * 2);
        ctx.fill();
        
        // Body (metallic with gradient)
        const bodyGradient = ctx.createLinearGradient(this.x + 15, this.y + 25, this.x + 35, this.y + 40);
        bodyGradient.addColorStop(0, '#BDC3C7');
        bodyGradient.addColorStop(0.5, this.color);
        bodyGradient.addColorStop(1, '#7F8C8D');
        ctx.fillStyle = bodyGradient;
        ctx.beginPath();
        ctx.roundRect(this.x + 13, this.y + 21, 24, 18, 6);
        ctx.fill();
        
        // Chest panel with details
        ctx.fillStyle = '#5D6D7E';
        ctx.beginPath();
        ctx.roundRect(this.x + 18, this.y + 25, 14, 10, 3);
        ctx.fill();
        
        // Power indicator lights
        ctx.fillStyle = '#2ECC71';
        ctx.beginPath();
        ctx.arc(this.x + 20, this.y + 28, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#F39C12';
        ctx.beginPath();
        ctx.arc(this.x + 25, this.y + 28, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#E74C3C';
        ctx.beginPath();
        ctx.arc(this.x + 30, this.y + 28, 1.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Arms (metallic, swinging)
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(this.x + 10, this.y + 28 + armSwing, 4 * scale, 10 * scale, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(this.x + 40, this.y + 28 - armSwing, 4 * scale, 10 * scale, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Arm joints
        ctx.fillStyle = '#5D6D7E';
        ctx.beginPath();
        ctx.arc(this.x + 10, this.y + 26 + armSwing, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + 40, this.y + 26 - armSwing, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Hands (claws)
        ctx.fillStyle = '#7F8C8D';
        ctx.beginPath();
        ctx.arc(this.x + 10, this.y + 36 + armSwing, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + 40, this.y + 36 - armSwing, 3.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Legs (metallic, alternating)
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(this.x + 19, this.y + 48 + legOffset, 4.5 * scale, 10 * scale, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(this.x + 31, this.y + 48 - legOffset, 4.5 * scale, 10 * scale, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Knee joints
        ctx.fillStyle = '#5D6D7E';
        ctx.beginPath();
        ctx.arc(this.x + 19, this.y + 48 + legOffset, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + 31, this.y + 48 - legOffset, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Feet (metallic boots)
        ctx.fillStyle = '#5D6D7E';
        ctx.beginPath();
        ctx.ellipse(this.x + 19, this.y + 56 + legOffset, 5, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(this.x + 31, this.y + 56 - legOffset, 5, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Foot treads
        ctx.strokeStyle = '#34495E';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(this.x + 17, this.y + 57 + legOffset);
        ctx.lineTo(this.x + 21, this.y + 57 + legOffset);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(this.x + 29, this.y + 57 - legOffset);
        ctx.lineTo(this.x + 33, this.y + 57 - legOffset);
        ctx.stroke();
    }
    
    drawAlien(ctx) {
        const legOffset = Math.floor(this.animationFrame) === 0 ? 5 : -5;
        const armSwing = Math.floor(this.animationFrame) === 0 ? 5 : -5;
        const scale = 1.4;
        const bobbing = Math.sin(this.animationFrame * 3) * 3;
        
        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.ellipse(this.x + 25, this.y + 58, 12, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Large alien head (oval with gradient)
        const headGradient = ctx.createRadialGradient(this.x + 22, this.y + 5, 3, this.x + 25, this.y + 10, 14);
        headGradient.addColorStop(0, '#B39DDB');
        headGradient.addColorStop(1, this.color);
        ctx.fillStyle = headGradient;
        ctx.beginPath();
        ctx.ellipse(this.x + 25, this.y + 8, 13 * scale, 11 * scale, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Head veins/texture
        ctx.strokeStyle = '#7B1FA2';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(this.x + 18, this.y + 5);
        ctx.quadraticCurveTo(this.x + 22, this.y + 8, this.x + 20, this.y + 12);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(this.x + 32, this.y + 5);
        ctx.quadraticCurveTo(this.x + 28, this.y + 8, this.x + 30, this.y + 12);
        ctx.stroke();
        
        // Large alien eyes (ovals with depth)
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.ellipse(this.x + 19, this.y + 9, 5 * scale, 7 * scale, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(this.x + 31, this.y + 9, 5 * scale, 7 * scale, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Eye reflections (multiple layers)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.ellipse(this.x + 17, this.y + 6, 2.5, 3.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(this.x + 29, this.y + 6, 2.5, 3.5, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x + 17, this.y + 5, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + 29, this.y + 5, 1.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Small antennae (with glow)
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x + 18, this.y - 5, 2, 6);
        ctx.fillRect(this.x + 30, this.y - 5, 2, 6);
        
        ctx.fillStyle = '#E91E63';
        ctx.shadowColor = '#E91E63';
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.arc(this.x + 19, this.y - 6, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + 31, this.y - 6, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // Antenna tips glow
        ctx.fillStyle = '#FF4081';
        ctx.beginPath();
        ctx.arc(this.x + 19, this.y - 6, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + 31, this.y - 6, 1.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Thin neck
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x + 21, this.y + 18, 8, 5);
        
        // Body (rounded with gradient)
        const bodyGradient = ctx.createRadialGradient(this.x + 23, this.y + 28, 2, this.x + 25, this.y + 32, 12);
        bodyGradient.addColorStop(0, '#B39DDB');
        bodyGradient.addColorStop(1, this.color);
        ctx.fillStyle = bodyGradient;
        ctx.beginPath();
        ctx.ellipse(this.x + 25, this.y + 30, 11 * scale, 9 * scale, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Chest markings
        ctx.strokeStyle = '#7B1FA2';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(this.x + 25, this.y + 30, 6, 0, Math.PI * 2);
        ctx.stroke();
        
        // Arms (thin alien arms, swinging)
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(this.x + 10, this.y + 28 + armSwing, 3 * scale, 9 * scale, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(this.x + 40, this.y + 28 - armSwing, 3 * scale, 9 * scale, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Three-fingered hands
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x + 10, this.y + 36 + armSwing, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + 40, this.y + 36 - armSwing, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Fingers
        ctx.fillRect(this.x + 8, this.y + 37 + armSwing, 1, 3);
        ctx.fillRect(this.x + 10, this.y + 38 + armSwing, 1, 3);
        ctx.fillRect(this.x + 12, this.y + 37 + armSwing, 1, 3);
        ctx.fillRect(this.x + 38, this.y + 37 - armSwing, 1, 3);
        ctx.fillRect(this.x + 40, this.y + 38 - armSwing, 1, 3);
        ctx.fillRect(this.x + 42, this.y + 37 - armSwing, 1, 3);
        
        // Legs (thin, alternating)
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(this.x + 19, this.y + 48 + legOffset, 4 * scale, 10 * scale, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(this.x + 31, this.y + 48 - legOffset, 4 * scale, 10 * scale, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Feet (large alien feet)
        ctx.fillStyle = '#7B1FA2';
        ctx.beginPath();
        ctx.ellipse(this.x + 19, this.y + 56 + legOffset, 6, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(this.x + 31, this.y + 56 - legOffset, 6, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Toe details
        ctx.fillStyle = '#6A1B9A';
        ctx.beginPath();
        ctx.arc(this.x + 16, this.y + 56 + legOffset, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + 22, this.y + 56 + legOffset, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + 28, this.y + 56 - legOffset, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + 34, this.y + 56 - legOffset, 1.5, 0, Math.PI * 2);
        ctx.fill();
    }

    getBounds() {
        // Smaller hitbox for player (80% of actual size for more forgiving collision)
        const hitboxReduction = 0.2;
        const xOffset = this.width * hitboxReduction / 2;
        const yOffset = this.height * hitboxReduction / 2;
        
        return {
            x: this.x + xOffset,
            y: this.y + yOffset,
            width: this.width * (1 - hitboxReduction),
            height: this.height * (1 - hitboxReduction)
        };
    }
}

// Obstacle Class
class Obstacle {
    constructor(type) {
        this.x = config.width;
        this.type = type;
        this.passed = false;
        
        switch(type) {
            case 'car':
                this.width = 60;
                this.height = 40;
                this.y = config.groundLevel + config.playerSize - this.height;
                this.color = '#4ECDC4';
                break;
            case 'table':
                this.width = 50;
                this.height = 45;
                this.y = config.groundLevel + config.playerSize - this.height;
                this.color = '#8B4513';
                break;
            case 'barrier':
                this.width = 30;
                this.height = 60;
                this.y = config.groundLevel + config.playerSize - this.height;
                this.color = '#FF6B35';
                break;
            case 'spike':
                this.width = 40;
                this.height = 30;
                this.y = config.groundLevel + config.playerSize - this.height;
                this.color = '#C70039';
                break;
        }
    }

    update() {
        this.x -= game.speed;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        
        if (this.type === 'car') {
            // Car body with gradient
            const carGradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
            const darkerColor = this.getDarkerColor ? this.getDarkerColor(this.color) : this.color;
            carGradient.addColorStop(0, this.color);
            carGradient.addColorStop(1, darkerColor);
            ctx.fillStyle = carGradient;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            
            // Car outline
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.lineWidth = 2;
            ctx.strokeRect(this.x, this.y, this.width, this.height);
            
            // Windows with reflection
            const windowGradient = ctx.createLinearGradient(this.x + 10, this.y + 5, this.x + 10, this.y + 17);
            windowGradient.addColorStop(0, 'rgba(135, 206, 235, 0.8)');
            windowGradient.addColorStop(1, 'rgba(44, 62, 80, 0.9)');
            ctx.fillStyle = windowGradient;
            ctx.fillRect(this.x + 10, this.y + 5, 15, 12);
            ctx.fillRect(this.x + 35, this.y + 5, 15, 12);
            
            // Window highlights
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.fillRect(this.x + 11, this.y + 6, 6, 4);
            ctx.fillRect(this.x + 36, this.y + 6, 6, 4);
            
            // Wheels with depth
            ctx.fillStyle = '#1A1A1A';
            ctx.beginPath();
            ctx.arc(this.x + 10, this.y + this.height, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(this.x + this.width - 10, this.y + this.height, 6, 0, Math.PI * 2);
            ctx.fill();
            
            // Wheel rims
            ctx.fillStyle = '#7F8C8D';
            ctx.beginPath();
            ctx.arc(this.x + 10, this.y + this.height, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(this.x + this.width - 10, this.y + this.height, 3, 0, Math.PI * 2);
            ctx.fill();
            
        } else if (this.type === 'table') {
            // Table top with wood texture
            const tableGradient = ctx.createLinearGradient(this.x, this.y, this.x + this.width, this.y);
            tableGradient.addColorStop(0, '#8B4513');
            tableGradient.addColorStop(0.5, '#A0522D');
            tableGradient.addColorStop(1, '#8B4513');
            ctx.fillStyle = tableGradient;
            ctx.fillRect(this.x, this.y, this.width, 12);
            
            // Table edge shadow
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.fillRect(this.x, this.y + 12, this.width, 2);
            
            // Wood grain lines
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.lineWidth = 1;
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.moveTo(this.x + 10 + i * 15, this.y + 2);
                ctx.lineTo(this.x + 10 + i * 15, this.y + 10);
                ctx.stroke();
            }
            
            // Legs with gradient
            const legGradient = ctx.createLinearGradient(this.x + 5, this.y + 14, this.x + 13, this.y + 14);
            legGradient.addColorStop(0, '#6B3410');
            legGradient.addColorStop(1, '#8B4513');
            ctx.fillStyle = legGradient;
            ctx.fillRect(this.x + 5, this.y + 14, 8, 35);
            ctx.fillRect(this.x + 37, this.y + 14, 8, 35);
            
            // Leg highlights
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.fillRect(this.x + 6, this.y + 15, 2, 33);
            ctx.fillRect(this.x + 38, this.y + 15, 2, 33);
            
        } else if (this.type === 'barrier') {
            // Barrier with 3D effect
            const barrierGradient = ctx.createLinearGradient(this.x, this.y, this.x + this.width, this.y);
            const darkerColor = this.getDarkerColor ? this.getDarkerColor(this.color) : this.color;
            barrierGradient.addColorStop(0, darkerColor);
            barrierGradient.addColorStop(0.5, this.color);
            barrierGradient.addColorStop(1, darkerColor);
            ctx.fillStyle = barrierGradient;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            
            // Barrier outline
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
            ctx.lineWidth = 2;
            ctx.strokeRect(this.x, this.y, this.width, this.height);
            
            // Warning stripes with glow
            ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
            ctx.shadowBlur = 5;
            for (let i = 0; i < 4; i++) {
                ctx.fillStyle = i % 2 === 0 ? '#FFE66D' : '#2C3E50';
                ctx.fillRect(this.x + 3, this.y + 5 + i * 14, this.width - 6, 10);
            }
            ctx.shadowBlur = 0;
            
            // Reflective highlights
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.fillRect(this.x + 2, this.y + 2, 3, this.height - 4);
            
        } else if (this.type === 'spike') {
            // Spike with metallic effect
            const spikeGradient = ctx.createLinearGradient(this.x, this.y, this.x + this.width, this.y + this.height);
            const darkerColor = this.getDarkerColor ? this.getDarkerColor(this.color) : this.color;
            spikeGradient.addColorStop(0, darkerColor);
            spikeGradient.addColorStop(0.5, this.color);
            spikeGradient.addColorStop(1, darkerColor);
            ctx.fillStyle = spikeGradient;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y + this.height);
            ctx.lineTo(this.x + this.width / 2, this.y);
            ctx.lineTo(this.x + this.width, this.y + this.height);
            ctx.closePath();
            ctx.fill();
            
            // Spike outline
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Spike highlight
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.beginPath();
            ctx.moveTo(this.x + this.width / 2 - 3, this.y + 10);
            ctx.lineTo(this.x + this.width / 2, this.y);
            ctx.lineTo(this.x + this.width / 2 + 3, this.y + 10);
            ctx.closePath();
            ctx.fill();
        }
    }
    
    getDarkerColor(color) {
        // Simple color darkening function
        if (!color || typeof color !== 'string') return '#000000';
        const hex = color.replace('#', '');
        if (hex.length !== 6) return color;
        const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - 40);
        const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - 40);
        const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - 40);
        return `rgb(${r}, ${g}, ${b})`;
    }

    getBounds() {
        // Smaller hitbox for obstacles (70% of actual size for more forgiveness)
        const hitboxReduction = 0.3;
        const xOffset = this.width * hitboxReduction / 2;
        const yOffset = this.height * hitboxReduction / 2;
        
        return {
            x: this.x + xOffset,
            y: this.y + yOffset,
            width: this.width * (1 - hitboxReduction),
            height: this.height * (1 - hitboxReduction)
        };
    }

    isOffScreen() {
        return this.x + this.width < 0;
    }
}

// Collision Detection - More forgiving with buffer zone
function checkCollision(rect1, rect2) {
    // Add a small buffer (5px) to make collisions less sensitive
    const buffer = 5;
    
    return rect1.x + buffer < rect2.x + rect2.width &&
           rect1.x + rect1.width - buffer > rect2.x &&
           rect1.y + buffer < rect2.y + rect2.height &&
           rect1.y + rect1.height - buffer > rect2.y;
}

// Initialize Game
function init() {
    config.canvas.width = config.width;
    config.canvas.height = config.height;
    game.ctx = config.canvas.getContext('2d');
    
    // Enable image smoothing for better quality
    game.ctx.imageSmoothingEnabled = true;
    game.ctx.imageSmoothingQuality = 'high';
    
    // Music System
    game.currentSong = null;
    game.maxLevelReached = parseInt(localStorage.getItem('maxLevelReached')) || 1;
    game.songs = {
        song1: document.getElementById('song1'),
        song2: document.getElementById('song2'),
        song3: document.getElementById('song3'),
        song4: document.getElementById('song4'),
        song5: document.getElementById('song5'),
        song6: document.getElementById('song6'),
        song7: document.getElementById('song7'),
        song8: document.getElementById('song8')
    };
    
    // Set initial volume for all songs
    Object.values(game.songs).forEach(song => {
        song.volume = 0.3;
    });
    
    // Crash Sound
    game.crashSound = document.getElementById('crash-sound');
    game.crashSound.volume = 0.15;
    
    // Music Menu Toggle
    const musicToggleBtn = document.getElementById('music-toggle-btn');
    const musicPanel = document.getElementById('music-panel');
    
    musicToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        musicPanel.classList.toggle('hidden');
    });
    
    // Close music panel when clicking outside
    document.addEventListener('click', (e) => {
        if (!musicPanel.contains(e.target) && e.target !== musicToggleBtn) {
            musicPanel.classList.add('hidden');
        }
    });
    
    // Song selection with unlock check
    const songItems = document.querySelectorAll('.song-item');
    songItems.forEach(item => {
        const playBtn = item.querySelector('.play-btn');
        const unlockLevel = parseInt(item.getAttribute('data-unlock-level')) || 0;
        
        // Check if song is unlocked
        if (unlockLevel > 0 && game.maxLevelReached >= unlockLevel) {
            item.classList.remove('locked');
            item.querySelector('.song-name').textContent = item.querySelector('.song-name').textContent.replace('🔒 ', '').replace(/ \(Lvl \d+\)/, '');
        }
        
        playBtn.addEventListener('click', () => {
            if (item.classList.contains('locked')) {
                alert(`Unlock this song by reaching level ${unlockLevel}!`);
                return;
            }
            const songId = item.getAttribute('data-song');
            playSong(songId);
        });
    });
    
    // Stop music button
    document.getElementById('stop-music-btn').addEventListener('click', () => {
        stopAllMusic();
    });
    
    // Volume control
    const volumeSlider = document.getElementById('volume-slider');
    const volumeValue = document.getElementById('volume-value');
    
    volumeSlider.addEventListener('input', (e) => {
        const volume = e.target.value / 100;
        volumeValue.textContent = e.target.value;
        Object.values(game.songs).forEach(song => {
            song.volume = volume;
        });
    });
    
    // Camera Menu Toggle
    const cameraToggleBtn = document.getElementById('camera-toggle-btn');
    const cameraPanel = document.getElementById('camera-panel');
    
    cameraToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        cameraPanel.classList.toggle('hidden');
    });
    
    // Close camera panel when clicking outside
    document.addEventListener('click', (e) => {
        if (!cameraPanel.contains(e.target) && e.target !== cameraToggleBtn) {
            cameraPanel.classList.add('hidden');
        }
    });
    
    // Camera angle selection
    const cameraOptions = document.querySelectorAll('.camera-option');
    cameraOptions.forEach(option => {
        option.addEventListener('click', () => {
            const angle = option.getAttribute('data-angle');
            game.cameraAngle = angle;
            
            // Update active state
            cameraOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            
            // Apply camera settings
            applyCameraAngle(angle);
        });
    });
    
    // Draw character previews
    drawCharacterPreviews();
    
    // Character Selection - Start game immediately on click
    const characterOptions = document.querySelectorAll('.character-option');
    characterOptions.forEach(option => {
        option.addEventListener('click', () => {
            game.selectedCharacter = option.getAttribute('data-character');
            
            // Ensure menu music is playing before starting
            if (game.menuMusic && game.menuMusic.paused) {
                game.menuMusic.play().catch(e => console.log('Menu music play failed:', e));
            }
            
            startGame();
        });
    });
    
    // Event Listeners
    document.getElementById('restart-btn').addEventListener('click', restartGame);
    document.getElementById('next-level-btn').addEventListener('click', nextLevel);
    
    document.addEventListener('keydown', (e) => {
        if ((e.code === 'Space' || e.code === 'KeyW') && game.isRunning && !game.isPaused) {
            e.preventDefault();
            game.player.jump();
        }
        if (e.code === 'KeyE' && game.isRunning && !game.isPaused) {
            e.preventDefault();
            game.player.activatePower();
        }
    });
}

function startGame() {
    document.getElementById('menu-screen').classList.add('hidden');
    
    resetGame();
    game.isRunning = true;
    
    // Music continues playing from music menu selection
    
    gameLoop();
}

function restartGame() {
    document.getElementById('game-over-screen').classList.add('hidden');
    game.currentLevel = 1;
    resetGame();
    game.isRunning = true;
    
    // Music continues from music menu
    
    gameLoop();
}

function nextLevel() {
    document.getElementById('level-complete-screen').classList.add('hidden');
    game.currentLevel++;
    if (game.currentLevel > levels.length) {
        game.currentLevel = levels.length;
    }
    resetGame();
    game.isRunning = true;
    
    // Music continues from music menu
    
    gameLoop();
}

function resetGame() {
    game.score = 0;
    game.lives = 1;
    game.frameCount = 0;
    game.obstacles = [];
    game.player = new Player(game.selectedCharacter || 'runner');
    
    const levelConfig = levels[game.currentLevel - 1] || levels[0];
    game.speed = levelConfig ? levelConfig.speed : config.baseSpeed;
    
    // Don't reset camera mode - keep user's selection
    
    updateUI();
}

function updateUI() {
    const levelConfig = levels[game.currentLevel - 1] || levels[0];
    const targetScore = levelConfig.targetScore;
    const progress = Math.min((game.score / targetScore) * 100, 100);
    
    document.getElementById('level-display').textContent = `Level: ${game.currentLevel}`;
    document.getElementById('level-target').textContent = `Target: ${targetScore}`;
    document.getElementById('level-progress-fill').style.width = `${progress}%`;
    document.getElementById('score-display').textContent = `Score: ${game.score}`;
    document.getElementById('lives-display').textContent = '❤️'.repeat(game.lives);
}

function drawPowerEffects() {
    if (!game.player) return;
    
    const ctx = game.ctx;
    
    // Draw shield effect
    if (game.player.hasShield) {
        ctx.strokeStyle = '#3498DB';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#3498DB';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(game.player.x + 25, game.player.y + 30, 40, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
    }
    
    // Draw speed effect
    if (game.player.power === 'speed' && game.player.powerDuration > 0) {
        ctx.strokeStyle = '#FF6B6B';
        ctx.lineWidth = 2;
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(game.player.x - 20 - i * 10, game.player.y + 20 + i * 10);
            ctx.lineTo(game.player.x - 10 - i * 10, game.player.y + 20 + i * 10);
            ctx.stroke();
        }
    }
    
    // Draw float effect
    if (game.player.power === 'float' && game.player.powerDuration > 0) {
        ctx.fillStyle = 'rgba(155, 89, 182, 0.3)';
        ctx.beginPath();
        ctx.ellipse(game.player.x + 25, game.player.y + 50, 15, 5, 0, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Draw power cooldown indicator
    const powerBarX = 10;
    const powerBarY = 50;
    const powerBarWidth = 100;
    const powerBarHeight = 8;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(powerBarX, powerBarY, powerBarWidth, powerBarHeight);
    
    if (game.player.powerCooldown > 0) {
        const cooldownPercent = game.player.powerCooldown / 600;
        ctx.fillStyle = '#E74C3C';
        ctx.fillRect(powerBarX, powerBarY, powerBarWidth * cooldownPercent, powerBarHeight);
    } else {
        ctx.fillStyle = '#2ECC71';
        ctx.fillRect(powerBarX, powerBarY, powerBarWidth, powerBarHeight);
    }
    
    // Power label
    ctx.fillStyle = 'white';
    ctx.font = 'bold 12px Orbitron';
    ctx.fillText('Power (E)', powerBarX, powerBarY - 5);
}

function spawnObstacle() {
    const levelConfig = levels[game.currentLevel - 1];
    const randomType = levelConfig.obstacleTypes[Math.floor(Math.random() * levelConfig.obstacleTypes.length)];
    game.obstacles.push(new Obstacle(randomType));
}

function gameLoop() {
    if (!game.isRunning) return;
    
    game.ctx.clearRect(0, 0, config.width, config.height);
    
    // Draw based on camera mode
    if (game.cameraMode === 'back') {
        drawBackViewScene();
        return; // Back view handles its own game loop
    }
    
    // Side view rendering
    // Draw background
    drawBackground();
    
    // Ground is now part of the city background (sidewalk)
    
    // Update and draw player
    game.player.update();
    game.player.draw(game.ctx);
    
    // Draw power effects
    drawPowerEffects();
    
    // Spawn obstacles
    const levelConfig = levels[game.currentLevel - 1];
    if (game.frameCount % levelConfig.obstacleFrequency === 0) {
        spawnObstacle();
    }
    
    // Update and draw obstacles
    for (let i = game.obstacles.length - 1; i >= 0; i--) {
        const obstacle = game.obstacles[i];
        obstacle.update();
        obstacle.draw(game.ctx);
        
        // Check collision
        if (checkCollision(game.player.getBounds(), obstacle.getBounds())) {
            if (!obstacle.passed) {
                obstacle.passed = true;
                
                // Check if player has shield
                if (game.player.hasShield) {
                    // Shield absorbs hit
                    game.player.hasShield = false;
                    game.player.powerDuration = 0;
                    continue;
                }
                
                // Play crash sound
                if (game.crashSound) {
                    game.crashSound.currentTime = 0;
                    game.crashSound.play().catch(e => console.log('Crash sound failed:', e));
                }
                
                gameOver();
                return;
            }
        }
        
        // Score points for passing obstacles
        if (obstacle.x + obstacle.width < game.player.x && !obstacle.passed) {
            obstacle.passed = true;
            game.score += 10;
            updateUI();
        }
        
        // Remove off-screen obstacles
        if (obstacle.isOffScreen()) {
            game.obstacles.splice(i, 1);
        }
    }
    
    // Check level completion
    if (game.score >= levelConfig.targetScore) {
        levelComplete();
        return;
    }
    
    game.frameCount++;
    game.score++;
    
    if (game.frameCount % 10 === 0) {
        updateUI();
    }
    
    requestAnimationFrame(gameLoop);
}

// City background elements
const cityElements = {
    buildings: [],
    cars: [],
    pedestrians: [],
    streetLights: [],
    trees: []
};

// Initialize city elements
function initCityElements() {
    // Clear existing elements
    cityElements.buildings = [];
    cityElements.cars = [];
    cityElements.streetLights = [];
    cityElements.trees = [];
    
    // Create buildings
    for (let i = 0; i < 8; i++) {
        cityElements.buildings.push({
            x: i * 150,
            width: 120 + Math.random() * 50,
            height: 150 + Math.random() * 100,
            color: `hsl(${200 + Math.random() * 40}, 20%, ${30 + Math.random() * 20}%)`,
            windows: []
        });
        
        // Add windows to building
        const building = cityElements.buildings[i];
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 4; col++) {
                building.windows.push({
                    x: col * 25 + 10,
                    y: row * 25 + 20,
                    lit: Math.random() > 0.3
                });
            }
        }
    }
    
    // Create trees in foreground
    for (let i = 0; i < 12; i++) {
        cityElements.trees.push({
            x: i * 120 + Math.random() * 40,
            y: 280 + Math.random() * 30,
            trunkHeight: 80 + Math.random() * 40,
            trunkWidth: 15 + Math.random() * 10,
            foliageSize: 60 + Math.random() * 40,
            foliageColor: `hsl(${100 + Math.random() * 40}, ${40 + Math.random() * 20}%, ${30 + Math.random() * 15}%)`
        });
    }
    
    // Create cars (appear behind buildings in the distance)
    for (let i = 0; i < 4; i++) {
        cityElements.cars.push({
            x: Math.random() * 800,
            y: 220 + Math.random() * 20, // Higher up, behind buildings
            width: 40 + Math.random() * 20, // Smaller (perspective)
            height: 20,
            speed: 1.5 + Math.random() * 1.5,
            color: ['#E74C3C', '#3498DB', '#F39C12', '#2ECC71', '#9B59B6'][Math.floor(Math.random() * 5)]
        });
    }
    
    // Create street lights
    for (let i = 0; i < 5; i++) {
        cityElements.streetLights.push({
            x: i * 200 + 50,
            y: 300
        });
    }
}

function drawBackground() {
    const ctx = game.ctx;
    
    // Different sky colors for each level
    const backgrounds = [
        { sky1: '#87CEEB', sky2: '#E0F6FF', time: 'day' }, // Level 1 - Day
        { sky1: '#FF6B9D', sky2: '#FFA07A', time: 'sunset' }, // Level 2 - Sunset
        { sky1: '#4A148C', sky2: '#7B1FA2', time: 'night' }, // Level 3 - Night
        { sky1: '#FF5722', sky2: '#FF9800', time: 'dusk' }, // Level 4 - Dusk
        { sky1: '#1A237E', sky2: '#283593', time: 'night' }  // Level 5 - Deep Night
    ];
    
    const bgColors = backgrounds[game.currentLevel - 1] || backgrounds[0];
    
    // Sky gradient
    const skyGradient = ctx.createLinearGradient(0, 0, 0, 250);
    skyGradient.addColorStop(0, bgColors.sky1);
    skyGradient.addColorStop(1, bgColors.sky2);
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, config.width, 250);
    
    // Draw buildings (parallax effect)
    const buildingOffset = (game.frameCount * 0.3) % 150;
    cityElements.buildings.forEach((building, index) => {
        const x = building.x - buildingOffset + (index * 150);
        if (x > -building.width && x < config.width) {
            // Building body with gradient
            const buildingGradient = ctx.createLinearGradient(x, 250 - building.height, x + building.width, 250);
            buildingGradient.addColorStop(0, building.color);
            buildingGradient.addColorStop(0.5, building.color);
            buildingGradient.addColorStop(1, `hsl(${200 + Math.random() * 40}, 20%, ${20 + Math.random() * 15}%)`);
            ctx.fillStyle = buildingGradient;
            ctx.fillRect(x, 250 - building.height, building.width, building.height);
            
            // Building outline with depth
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.lineWidth = 3;
            ctx.strokeRect(x, 250 - building.height, building.width, building.height);
            
            // Building edge highlight
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x + 2, 250 - building.height);
            ctx.lineTo(x + 2, 250);
            ctx.stroke();
            
            // Windows with realistic lighting
            building.windows.forEach(window => {
                if (window.lit) {
                    // Lit window with glow
                    const windowGradient = ctx.createRadialGradient(
                        x + window.x + 7, 250 - building.height + window.y + 7, 2,
                        x + window.x + 7, 250 - building.height + window.y + 7, 10
                    );
                    if (bgColors.time === 'night' || bgColors.time === 'dusk') {
                        windowGradient.addColorStop(0, '#FFF4D6');
                        windowGradient.addColorStop(1, '#FFE66D');
                        ctx.shadowColor = '#FFE66D';
                        ctx.shadowBlur = 8;
                    } else {
                        windowGradient.addColorStop(0, '#B8E6FF');
                        windowGradient.addColorStop(1, '#87CEEB');
                    }
                    ctx.fillStyle = windowGradient;
                } else {
                    // Dark window with reflection
                    const darkGradient = ctx.createLinearGradient(
                        x + window.x, 250 - building.height + window.y,
                        x + window.x + 15, 250 - building.height + window.y + 15
                    );
                    darkGradient.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
                    darkGradient.addColorStop(1, 'rgba(0, 0, 0, 0.9)');
                    ctx.fillStyle = darkGradient;
                }
                ctx.fillRect(x + window.x, 250 - building.height + window.y, 15, 15);
                ctx.shadowBlur = 0;
                
                // Window frame
                ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
                ctx.lineWidth = 1;
                ctx.strokeRect(x + window.x, 250 - building.height + window.y, 15, 15);
                
                // Window reflection
                if (!window.lit) {
                    ctx.fillStyle = 'rgba(135, 206, 235, 0.1)';
                    ctx.fillRect(x + window.x + 1, 250 - building.height + window.y + 1, 6, 6);
                }
            });
        }
    });
    
    // Road is now invisible - cars appear to be in the distance behind buildings
    
    // Draw cars (moving in the distance, partially visible behind buildings)
    cityElements.cars.forEach(car => {
        car.x -= car.speed;
        if (car.x < -car.width) {
            car.x = config.width + Math.random() * 200;
            car.y = 220 + Math.random() * 20;
        }
        
        // Car body (smaller, in distance)
        ctx.fillStyle = car.color;
        ctx.fillRect(car.x, car.y, car.width, car.height);
        
        // Car windows
        ctx.fillStyle = 'rgba(100, 150, 200, 0.6)';
        ctx.fillRect(car.x + 5, car.y + 3, car.width * 0.3, car.height * 0.4);
        ctx.fillRect(car.x + car.width * 0.6, car.y + 3, car.width * 0.3, car.height * 0.4);
        
        // Wheels (smaller)
        ctx.fillStyle = '#2C3E50';
        ctx.beginPath();
        ctx.arc(car.x + 8, car.y + car.height, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(car.x + car.width - 8, car.y + car.height, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Headlights (at night)
        if (bgColors.time === 'night' || bgColors.time === 'dusk') {
            ctx.fillStyle = 'rgba(255, 255, 200, 0.8)';
            ctx.fillRect(car.x - 2, car.y + 6, 2, 6);
        }
    });
    
    // Draw sidewalk with realistic texture
    const sidewalkY = Math.min(450, config.groundLevel);
    const sidewalkGradient = ctx.createLinearGradient(0, sidewalkY, 0, config.groundLevel + config.playerSize);
    sidewalkGradient.addColorStop(0, '#BDC3C7');
    sidewalkGradient.addColorStop(0.5, '#95A5A6');
    sidewalkGradient.addColorStop(1, '#7F8C8D');
    ctx.fillStyle = sidewalkGradient;
    ctx.fillRect(0, sidewalkY, config.width, config.groundLevel + config.playerSize - sidewalkY);
    
    // Sidewalk tiles with depth
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.lineWidth = 2;
    const tileOffset = (game.frameCount * game.speed * 0.5) % 60;
    const tileY = Math.min(450, config.groundLevel);
    for (let i = -1; i < config.width / 60 + 1; i++) {
        const x = i * 60 - tileOffset;
        // Tile outline
        ctx.strokeRect(x, tileY, 60, config.groundLevel + config.playerSize - tileY);
        
        // Tile texture (cracks and details)
        if (config.groundLevel > 460) {
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x + 10, tileY + 10);
            ctx.lineTo(x + 15, tileY + 20);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x + 45, tileY + 30);
            ctx.lineTo(x + 50, tileY + 40);
            ctx.stroke();
            
            // Tile highlight
            ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.fillRect(x + 2, tileY + 2, 56, 20);
        }
        
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.lineWidth = 2;
    }
    
    // Sidewalk edge
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(0, tileY - 2, config.width, 2);
    
    // Draw street lights
    const lightOffset = (game.frameCount * 0.3) % 200;
    cityElements.streetLights.forEach((light, index) => {
        const x = light.x - lightOffset + (index * 200);
        if (x > -50 && x < config.width) {
            // Pole
            ctx.fillStyle = '#7F8C8D';
            ctx.fillRect(x, light.y, 8, 60);
            
            // Light fixture
            ctx.fillStyle = '#34495E';
            ctx.fillRect(x - 5, light.y, 18, 10);
            
            // Light glow (at night)
            if (bgColors.time === 'night' || bgColors.time === 'dusk') {
                ctx.fillStyle = 'rgba(255, 230, 109, 0.3)';
                ctx.beginPath();
                ctx.arc(x + 4, light.y + 10, 30, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.fillStyle = '#FFE66D';
                ctx.beginPath();
                ctx.arc(x + 4, light.y + 5, 6, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    });
    
    // Draw trees in foreground (covering cars and road)
    const treeOffset = (game.frameCount * 0.4) % 120;
    cityElements.trees.forEach((tree, index) => {
        const x = tree.x - treeOffset + (index * 120);
        if (x > -100 && x < config.width + 50) {
            // Tree trunk
            const trunkGradient = ctx.createLinearGradient(x, tree.y, x + tree.trunkWidth, tree.y + tree.trunkHeight);
            trunkGradient.addColorStop(0, '#6B4423');
            trunkGradient.addColorStop(1, '#4A2F1A');
            ctx.fillStyle = trunkGradient;
            ctx.fillRect(x, tree.y, tree.trunkWidth, tree.trunkHeight);
            
            // Trunk texture
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.lineWidth = 1;
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.moveTo(x + 3, tree.y + 20 + i * 20);
                ctx.lineTo(x + tree.trunkWidth - 3, tree.y + 25 + i * 20);
                ctx.stroke();
            }
            
            // Tree foliage (multiple layers for depth)
            const foliageX = x + tree.trunkWidth / 2;
            const foliageY = tree.y - tree.foliageSize / 2;
            
            // Shadow layer
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.beginPath();
            ctx.arc(foliageX + 5, foliageY + 5, tree.foliageSize / 2, 0, Math.PI * 2);
            ctx.fill();
            
            // Main foliage
            ctx.fillStyle = tree.foliageColor;
            ctx.beginPath();
            ctx.arc(foliageX, foliageY, tree.foliageSize / 2, 0, Math.PI * 2);
            ctx.fill();
            
            // Additional foliage clusters for natural look
            ctx.beginPath();
            ctx.arc(foliageX - tree.foliageSize / 3, foliageY - tree.foliageSize / 4, tree.foliageSize / 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(foliageX + tree.foliageSize / 3, foliageY - tree.foliageSize / 4, tree.foliageSize / 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(foliageX - tree.foliageSize / 4, foliageY + tree.foliageSize / 4, tree.foliageSize / 3.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(foliageX + tree.foliageSize / 4, foliageY + tree.foliageSize / 4, tree.foliageSize / 3.5, 0, Math.PI * 2);
            ctx.fill();
            
            // Highlight on foliage
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.beginPath();
            ctx.arc(foliageX - tree.foliageSize / 6, foliageY - tree.foliageSize / 6, tree.foliageSize / 4, 0, Math.PI * 2);
            ctx.fill();
            
            // Leaves detail
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            for (let i = 0; i < 5; i++) {
                const leafX = foliageX + (Math.random() - 0.5) * tree.foliageSize * 0.6;
                const leafY = foliageY + (Math.random() - 0.5) * tree.foliageSize * 0.6;
                ctx.beginPath();
                ctx.arc(leafX, leafY, 3, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    });
}

function levelComplete() {
    game.isRunning = false;
    
    // Update level complete screen
    document.getElementById('completed-level').textContent = `Level ${game.currentLevel} Completed!`;
    document.getElementById('level-score').textContent = `Score: ${game.score}`;
    document.getElementById('next-level-preview').textContent = `Next: Level ${game.currentLevel + 1}`;
    
    // Save max level reached
    if (game.currentLevel > game.maxLevelReached) {
        game.maxLevelReached = game.currentLevel;
        localStorage.setItem('maxLevelReached', game.maxLevelReached);
        
        // Show unlock message at level 20
        if (game.currentLevel === 20) {
            setTimeout(() => {
                alert('🎉 CONGRATULATIONS! 🎉\n\nYou\'ve unlocked:\n• 4 New Characters (Cyborg, Wizard, Samurai, Phoenix)\n• 3 New Epic Songs\n• New Powers!\n\nCheck the character selection and music menu!');
            }, 500);
        }
    }
    
    document.getElementById('level-complete-screen').classList.remove('hidden');
    
    // Menu music keeps playing
}

function gameOver() {
    game.isRunning = false;
    document.getElementById('final-score').textContent = `Score: ${game.score}`;
    document.getElementById('final-level').textContent = `Level Reached: ${game.currentLevel}`;
    document.getElementById('game-over-screen').classList.remove('hidden');
    
    // Menu music keeps playing throughout
}

// Draw character previews on menu
function drawCharacterPreviews() {
    const characterOptions = document.querySelectorAll('.character-option');
    
    characterOptions.forEach(option => {
        const canvas = option.querySelector('.character-preview-canvas');
        const ctx = canvas.getContext('2d');
        const characterType = option.getAttribute('data-character');
        
        // Create a temporary player for preview
        const previewPlayer = new Player(characterType);
        previewPlayer.x = 15;
        previewPlayer.y = 15;
        previewPlayer.animationFrame = 0;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw character
        previewPlayer.draw(ctx);
    });
}

// Music control functions
function playSong(songId) {
    // Stop all other songs
    Object.keys(game.songs).forEach(id => {
        if (game.songs[id]) {
            game.songs[id].pause();
            game.songs[id].currentTime = 0;
        }
    });
    
    // Remove playing class from all items
    document.querySelectorAll('.song-item').forEach(item => {
        item.classList.remove('playing');
    });
    
    // Play selected song
    if (game.songs[songId]) {
        game.songs[songId].play().catch(e => console.log('Song play failed:', e));
        game.currentSong = songId;
        
        // Add playing class to selected item
        const selectedItem = document.querySelector(`[data-song="${songId}"]`);
        if (selectedItem) {
            selectedItem.classList.add('playing');
        }
    }
}

function stopAllMusic() {
    Object.values(game.songs).forEach(song => {
        if (song) {
            song.pause();
            song.currentTime = 0;
        }
    });
    
    // Remove playing class from all items
    document.querySelectorAll('.song-item').forEach(item => {
        item.classList.remove('playing');
    });
    
    game.currentSong = null;
}

// Camera angle functions
function applyCameraAngle(angle) {
    console.log('Applying camera angle:', angle);
    
    switch(angle) {
        case 'side':
            // Default side view
            config.canvas.style.transform = 'scale(1)';
            config.canvas.style.transformOrigin = 'center';
            game.cameraMode = 'side';
            game.cameraAngle = 'side';
            break;
        case 'close':
            // Zoomed in close-up
            config.canvas.style.transform = 'scale(1.3)';
            config.canvas.style.transformOrigin = 'center left';
            game.cameraMode = 'side';
            game.cameraAngle = 'close';
            break;
        case 'far':
            // Zoomed out wide view
            config.canvas.style.transform = 'scale(0.85)';
            config.canvas.style.transformOrigin = 'center';
            game.cameraMode = 'side';
            game.cameraAngle = 'far';
            break;
        case 'back':
            // Behind the player view (3D perspective)
            config.canvas.style.transform = 'scale(1)';
            config.canvas.style.transformOrigin = 'center';
            game.cameraMode = 'back';
            game.cameraAngle = 'back';
            console.log('Back view activated, cameraMode:', game.cameraMode);
            break;
    }
}

// Loading screen
const loadingTips = [
    "Press SPACE or W to jump over obstacles!",
    "Press E to activate your character's special power!",
    "Each character has unique abilities - try them all!",
    "Collect points by passing obstacles safely!",
    "Complete levels to unlock harder challenges!",
    "Use the music menu to play your favorite tracks!",
    "Change camera angles for different perspectives!",
    "The Robot's shield can save you from one hit!",
    "The Ninja can dash forward to avoid danger!",
    "The Alien can float to slow down falls!"
];

function showLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const loadingBarFill = document.querySelector('.loading-bar-fill');
    const loadingTip = document.getElementById('loading-tip');
    const loadingDots = document.querySelector('.loading-dots');
    const skipBtn = document.getElementById('skip-loading-btn');
    
    let loadingInterval;
    let dotsInterval;
    let isSkipped = false;
    
    // Function to complete loading
    function completeLoading() {
        if (loadingInterval) clearInterval(loadingInterval);
        if (dotsInterval) clearInterval(dotsInterval);
        loadingScreen.classList.add('hidden');
        document.getElementById('menu-screen').classList.remove('hidden');
    }
    
    // Skip button functionality - use event listener immediately
    if (skipBtn) {
        skipBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (!isSkipped) {
                isSkipped = true;
                loadingBarFill.style.width = '100%';
                loadingBarFill.style.transition = 'width 0.3s ease';
                setTimeout(completeLoading, 300);
            }
        };
    }
    
    // Animate loading dots
    let dotCount = 0;
    dotsInterval = setInterval(() => {
        if (!isSkipped) {
            dotCount = (dotCount + 1) % 4;
            loadingDots.textContent = '.'.repeat(dotCount);
        }
    }, 500);
    
    // Random loading tip
    loadingTip.textContent = loadingTips[Math.floor(Math.random() * loadingTips.length)];
    
    // Simulate loading progress
    let progress = 0;
    loadingInterval = setInterval(() => {
        if (!isSkipped) {
            progress += Math.random() * 15 + 5;
            if (progress >= 100) {
                progress = 100;
                loadingBarFill.style.width = '100%';
                
                setTimeout(completeLoading, 500);
            } else {
                loadingBarFill.style.width = progress + '%';
            }
        }
    }, 200);
}

// Draw back view scene (3D perspective from behind player)
function drawBackViewScene() {
    const ctx = game.ctx;
    
    // Safety check - ensure player exists
    if (!game.player) {
        requestAnimationFrame(gameLoop);
        return;
    }
    
    // Sky with perspective
    const skyGradient = ctx.createLinearGradient(0, 0, 0, config.height * 0.6);
    skyGradient.addColorStop(0, '#87CEEB');
    skyGradient.addColorStop(1, '#E0F6FF');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, config.width, config.height * 0.6);
    
    // Road with perspective (vanishing point)
    const roadGradient = ctx.createLinearGradient(0, config.height * 0.6, 0, config.height);
    roadGradient.addColorStop(0, '#7F8C8D');
    roadGradient.addColorStop(1, '#95A5A6');
    ctx.fillStyle = roadGradient;
    
    // Draw road with perspective
    ctx.beginPath();
    ctx.moveTo(config.width * 0.3, config.height * 0.6);
    ctx.lineTo(0, config.height);
    ctx.lineTo(config.width, config.height);
    ctx.lineTo(config.width * 0.7, config.height * 0.6);
    ctx.closePath();
    ctx.fill();
    
    // Road lines with perspective
    ctx.strokeStyle = '#FFE66D';
    ctx.lineWidth = 3;
    const lineOffset = (game.frameCount * game.speed * 2) % 100;
    for (let i = 0; i < 10; i++) {
        const y = config.height * 0.6 + (i * 50) - lineOffset;
        if (y < config.height) {
            const scale = (y - config.height * 0.6) / (config.height * 0.4);
            const xLeft = config.width * 0.3 + (config.width * 0.2 * scale);
            const xRight = config.width * 0.7 - (config.width * 0.2 * scale);
            const lineWidth = (xRight - xLeft) * 0.05;
            
            ctx.beginPath();
            ctx.moveTo(config.width / 2 - lineWidth / 2, y);
            ctx.lineTo(config.width / 2 + lineWidth / 2, y);
            ctx.stroke();
        }
    }
    
    // Update player
    if (game.player) {
        game.player.update();
    }
    
    for (let i = game.obstacles.length - 1; i >= 0; i--) {
        const obstacle = game.obstacles[i];
        obstacle.update();
        
        // Calculate perspective position
        const distance = obstacle.x - game.player.x + 200;
        if (distance > 0 && distance < 800) {
            const scale = Math.max(0.3, 1 - (distance / 800));
            const perspectiveY = config.height * 0.6 + (config.height * 0.35 * (1 - scale));
            const perspectiveX = config.width / 2 - (obstacle.width * scale / 2);
            
            // Draw obstacle with perspective
            ctx.save();
            ctx.translate(perspectiveX, perspectiveY);
            ctx.scale(scale, scale);
            
            // Simple obstacle representation
            ctx.fillStyle = obstacle.color;
            ctx.fillRect(0, 0, obstacle.width, obstacle.height);
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.lineWidth = 2;
            ctx.strokeRect(0, 0, obstacle.width, obstacle.height);
            
            ctx.restore();
        }
        
        // Check collision
        if (checkCollision(game.player.getBounds(), obstacle.getBounds())) {
            if (!obstacle.passed) {
                obstacle.passed = true;
                
                if (game.player.hasShield) {
                    game.player.hasShield = false;
                    game.player.powerDuration = 0;
                    continue;
                }
                
                if (game.crashSound) {
                    game.crashSound.currentTime = 0;
                    game.crashSound.play().catch(e => console.log('Crash sound failed:', e));
                }
                
                gameOver();
                return;
            }
        }
        
        if (obstacle.x + obstacle.width < game.player.x && !obstacle.passed) {
            obstacle.passed = true;
            game.score += 10;
            updateUI();
        }
        
        if (obstacle.isOffScreen()) {
            game.obstacles.splice(i, 1);
        }
    }
    
    // Draw player from behind (centered at bottom)
    const playerScale = 1.5;
    const playerX = config.width / 2 - (game.player.width * playerScale / 2);
    const playerY = config.height - (game.player.height * playerScale) - 50;
    
    ctx.save();
    ctx.translate(playerX, playerY);
    ctx.scale(playerScale, playerScale);
    
    // Draw simplified back view of player
    drawPlayerBack(ctx, game.player);
    
    ctx.restore();
    
    // Draw power effects
    drawPowerEffects();
    
    // Spawn obstacles
    const levelConfig = levels[game.currentLevel - 1] || levels[0];
    if (game.frameCount % levelConfig.obstacleFrequency === 0) {
        spawnObstacle();
    }
    
    if (game.score >= levelConfig.targetScore) {
        levelComplete();
        return;
    }
    
    game.frameCount++;
    game.score++;
    
    if (game.frameCount % 10 === 0) {
        updateUI();
    }
    
    requestAnimationFrame(gameLoop);
}

// Draw player from behind
function drawPlayerBack(ctx, player) {
    const bobbing = Math.sin(player.animationFrame * 3) * 2;
    
    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(20, 65, 15, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Head from behind
    const headColor = player.character === 'runner' ? '#8B4513' : 
                      player.character === 'ninja' ? '#2C3E50' :
                      player.character === 'robot' ? '#95A5A6' :
                      player.character === 'alien' ? '#9B59B6' : player.color;
    ctx.fillStyle = headColor;
    ctx.beginPath();
    ctx.arc(20, 10 + bobbing, 12, 0, Math.PI * 2);
    ctx.fill();
    
    // Body
    ctx.fillStyle = player.color;
    ctx.fillRect(10, 25, 20, 20);
    
    // Body shading
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(10, 25, 20, 5);
    
    // Arms
    const armOffset = Math.floor(player.animationFrame) === 0 ? 3 : -3;
    ctx.fillStyle = player.character === 'robot' ? player.color : '#FDBCB4';
    ctx.fillRect(5, 28 + armOffset, 5, 15);
    ctx.fillRect(30, 28 - armOffset, 5, 15);
    
    // Legs
    const legOffset = Math.floor(player.animationFrame) === 0 ? 4 : -4;
    ctx.fillStyle = '#2C3E50';
    ctx.fillRect(12, 45, 7, 15 + legOffset);
    ctx.fillRect(21, 45, 7, 15 - legOffset);
    
    // Shoes
    ctx.fillStyle = '#34495E';
    ctx.fillRect(11, 58 + legOffset, 8, 3);
    ctx.fillRect(21, 58 - legOffset, 8, 3);
}

// Initialize and start the game
window.addEventListener('load', () => {
    showLoadingScreen();
    initCityElements();
    init();
    applyCameraAngle('side');
});
