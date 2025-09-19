export class CelebrationScreen {
    constructor(canvas, ctx, audioManager) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.audioManager = audioManager;

        this.isVisible = false;
        this.animationTime = 0;
        this.celebrationPhase = 0;
        this.fireworks = [];
        this.confetti = [];
        this.sparkles = [];
        this.fadeIn = 0;

        this.messages = [
            '🎉 축하합니다! 🎉',
            '휴넷 26주년 보물찾기를 완료했습니다!',
            '모든 직원들과 대화하고 보물을 찾으셨네요!',
            '휴넷의 26년 여정에 함께해 주셔서 감사합니다!',
            '앞으로도 더 나은 교육 서비스로 함께하겠습니다!'
        ];
        this.currentMessageIndex = 0;
        this.messageTimer = 0;
    }

    show() {
        this.isVisible = true;
        this.animationTime = 0;
        this.celebrationPhase = 0;
        this.fadeIn = 0;
        this.currentMessageIndex = 0;
        this.messageTimer = 0;

        this.initializeEffects();

        // Play celebration music
        if (this.audioManager) {
            this.audioManager.playGameComplete();
        }
    }

    hide() {
        this.isVisible = false;
    }

    initializeEffects() {
        this.fireworks = [];
        this.confetti = [];
        this.sparkles = [];

        // Initialize fireworks
        for (let i = 0; i < 5; i++) {
            this.createFirework();
        }

        // Initialize confetti
        for (let i = 0; i < 100; i++) {
            this.confetti.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height - this.canvas.height,
                vx: (Math.random() - 0.5) * 4,
                vy: Math.random() * 3 + 2,
                color: this.getRandomColor(),
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.2,
                size: Math.random() * 8 + 4
            });
        }

        // Initialize sparkles
        for (let i = 0; i < 50; i++) {
            this.sparkles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                life: Math.random() * 100 + 50,
                maxLife: 100,
                color: '#FFD700',
                size: Math.random() * 4 + 2
            });
        }
    }

    createFirework() {
        return {
            x: Math.random() * this.canvas.width,
            y: this.canvas.height + Math.random() * 200,
            targetY: Math.random() * this.canvas.height * 0.5 + 50,
            vy: -8,
            exploded: false,
            particles: [],
            color: this.getRandomColor(),
            life: 0
        };
    }

    getRandomColor() {
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3', '#54A0FF'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        if (!this.isVisible) return;

        this.animationTime += 0.02;
        this.messageTimer++;
        this.fadeIn = Math.min(this.fadeIn + 0.02, 1);

        // Update message progression
        if (this.messageTimer > 180 && this.currentMessageIndex < this.messages.length - 1) {
            this.currentMessageIndex++;
            this.messageTimer = 0;
        }

        // Update fireworks
        this.fireworks.forEach(firework => {
            if (!firework.exploded) {
                firework.y += firework.vy;
                if (firework.y <= firework.targetY) {
                    firework.exploded = true;
                    this.createFireworkParticles(firework);
                }
            } else {
                firework.life++;
                firework.particles.forEach(particle => {
                    particle.x += particle.vx;
                    particle.y += particle.vy;
                    particle.vy += 0.1; // gravity
                    particle.life--;
                    particle.alpha = Math.max(0, particle.life / particle.maxLife);
                });

                firework.particles = firework.particles.filter(p => p.life > 0);

                if (firework.particles.length === 0) {
                    firework.exploded = false;
                    firework.y = this.canvas.height + Math.random() * 200;
                    firework.targetY = Math.random() * this.canvas.height * 0.5 + 50;
                    firework.vy = -8;
                    firework.life = 0;
                }
            }
        });

        // Update confetti
        this.confetti.forEach(piece => {
            piece.x += piece.vx;
            piece.y += piece.vy;
            piece.rotation += piece.rotationSpeed;
            piece.vy += 0.1; // gravity

            // Wrap around screen
            if (piece.x < -10) piece.x = this.canvas.width + 10;
            if (piece.x > this.canvas.width + 10) piece.x = -10;
            if (piece.y > this.canvas.height + 10) {
                piece.y = -10;
                piece.x = Math.random() * this.canvas.width;
                piece.vy = Math.random() * 3 + 2;
            }
        });

        // Update sparkles
        this.sparkles.forEach(sparkle => {
            sparkle.life--;
            if (sparkle.life <= 0) {
                sparkle.x = Math.random() * this.canvas.width;
                sparkle.y = Math.random() * this.canvas.height;
                sparkle.life = sparkle.maxLife;
            }
        });
    }

    createFireworkParticles(firework) {
        const particleCount = 30;
        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2;
            const speed = Math.random() * 5 + 2;

            firework.particles.push({
                x: firework.x,
                y: firework.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: Math.random() * 60 + 40,
                maxLife: 100,
                alpha: 1,
                color: firework.color
            });
        }
    }

    draw() {
        if (!this.isVisible) return;

        // Semi-transparent background
        this.ctx.fillStyle = `rgba(0, 0, 20, ${this.fadeIn * 0.8})`;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw sparkles
        this.drawSparkles();

        // Draw fireworks
        this.drawFireworks();

        // Draw confetti
        this.drawConfetti();

        // Draw main celebration content
        this.drawCelebrationContent();
    }

    drawFireworks() {
        this.fireworks.forEach(firework => {
            if (!firework.exploded) {
                // Draw rocket
                this.ctx.fillStyle = firework.color;
                this.ctx.beginPath();
                this.ctx.arc(firework.x, firework.y, 3, 0, Math.PI * 2);
                this.ctx.fill();

                // Draw trail
                this.ctx.fillStyle = `${firework.color}80`;
                this.ctx.beginPath();
                this.ctx.arc(firework.x, firework.y + 10, 2, 0, Math.PI * 2);
                this.ctx.fill();
            } else {
                // Draw explosion particles
                firework.particles.forEach(particle => {
                    this.ctx.fillStyle = `${particle.color}${Math.floor(particle.alpha * 255).toString(16).padStart(2, '0')}`;
                    this.ctx.beginPath();
                    this.ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
                    this.ctx.fill();
                });
            }
        });
    }

    drawConfetti() {
        this.confetti.forEach(piece => {
            this.ctx.save();
            this.ctx.translate(piece.x, piece.y);
            this.ctx.rotate(piece.rotation);

            this.ctx.fillStyle = piece.color;
            this.ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size / 2);

            this.ctx.restore();
        });
    }

    drawSparkles() {
        this.sparkles.forEach(sparkle => {
            const alpha = sparkle.life / sparkle.maxLife;
            this.ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;
            this.ctx.beginPath();
            this.ctx.arc(sparkle.x, sparkle.y, sparkle.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    drawCelebrationContent() {
        // Main title with pulsing effect
        const pulseScale = 1 + Math.sin(this.animationTime * 3) * 0.1;

        this.ctx.save();
        this.ctx.translate(this.canvas.width / 2, 150);
        this.ctx.scale(pulseScale, pulseScale);

        // Title shadow
        this.ctx.fillStyle = `rgba(0, 0, 0, ${this.fadeIn * 0.5})`;
        this.ctx.font = 'bold 48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('🎉 게임 완료! 🎉', 3, 3);

        // Title
        const gradient = this.ctx.createLinearGradient(0, -25, 0, 25);
        gradient.addColorStop(0, '#FFD700');
        gradient.addColorStop(0.5, '#FFA500');
        gradient.addColorStop(1, '#FF6347');

        this.ctx.fillStyle = gradient;
        this.ctx.fillText('🎉 게임 완료! 🎉', 0, 0);

        this.ctx.restore();

        // Congratulation messages
        const messageY = 250;
        const messageSpacing = 40;

        for (let i = 0; i <= this.currentMessageIndex && i < this.messages.length; i++) {
            const alpha = this.fadeIn * (i === this.currentMessageIndex ? 1 : 0.8);
            const fontSize = i === 0 ? 32 : (i === 1 ? 24 : 20);

            this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            this.ctx.font = `bold ${fontSize}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.strokeStyle = `rgba(0, 0, 0, ${alpha * 0.8})`;
            this.ctx.lineWidth = 2;
            this.ctx.strokeText(this.messages[i], this.canvas.width / 2, messageY + i * messageSpacing);
            this.ctx.fillText(this.messages[i], this.canvas.width / 2, messageY + i * messageSpacing);
        }

        // Final message and instructions
        if (this.currentMessageIndex >= this.messages.length - 1) {
            this.ctx.fillStyle = `rgba(255, 255, 255, ${this.fadeIn * 0.7})`;
            this.ctx.font = '18px Arial';
            this.ctx.fillText('ESC 키를 눌러 타이틀로 돌아가거나 게임을 종료하세요', this.canvas.width / 2, this.canvas.height - 50);
        }

        // Score/Stats box
        this.drawStatsBox();
    }

    drawStatsBox() {
        if (this.currentMessageIndex < 2) return;

        const boxWidth = 400;
        const boxHeight = 200;
        const boxX = (this.canvas.width - boxWidth) / 2;
        const boxY = this.canvas.height - 300;

        // Box background
        this.ctx.fillStyle = `rgba(0, 0, 0, ${this.fadeIn * 0.7})`;
        this.ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

        this.ctx.strokeStyle = `rgba(255, 215, 0, ${this.fadeIn})`;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

        // Stats content
        this.ctx.fillStyle = `rgba(255, 255, 255, ${this.fadeIn})`;
        this.ctx.font = 'bold 20px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('게임 통계', this.canvas.width / 2, boxY + 30);

        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'left';
        const statsX = boxX + 40;
        const statsY = boxY + 60;
        const lineHeight = 25;

        const stats = [
            '✅ 모든 퀘스트 완료',
            '🗣️ 모든 직원과 대화 완료',
            '🎁 모든 보물 수집 완료',
            '🏢 모든 사무실 탐험 완료',
            '🎯 26주년 기념 이벤트 성공!'
        ];

        stats.forEach((stat, index) => {
            this.ctx.fillText(stat, statsX, statsY + index * lineHeight);
        });
    }
};