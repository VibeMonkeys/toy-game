// 파티클 시스템 - 시각적 효과용
export class ParticleSystem {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.particles = [];
    }

    // 아이템 수집 효과
    createItemCollectEffect(x, y, itemName) {
        const particleCount = 8;
        const baseColor = this.getItemColor(itemName);

        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4 - 2,
                life: 1.0,
                maxLife: 1.0,
                size: Math.random() * 3 + 2,
                color: baseColor,
                type: 'collect',
                gravity: 0.1
            });
        }

        // 텍스트 파티클 추가
        this.particles.push({
            x: x,
            y: y - 30,
            vx: 0,
            vy: -1,
            life: 2.0,
            maxLife: 2.0,
            text: `+${itemName}`,
            type: 'text',
            color: '#FFD700'
        });
    }

    // 퀘스트 완료 효과
    createQuestCompleteEffect(centerX, centerY) {
        const particleCount = 15;

        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2;
            this.particles.push({
                x: centerX,
                y: centerY,
                vx: Math.cos(angle) * 3,
                vy: Math.sin(angle) * 3,
                life: 1.5,
                maxLife: 1.5,
                size: Math.random() * 4 + 3,
                color: '#FFD700',
                type: 'burst',
                sparkle: true
            });
        }

        // 중앙 텍스트
        this.particles.push({
            x: centerX,
            y: centerY,
            vx: 0,
            vy: -0.5,
            life: 3.0,
            maxLife: 3.0,
            text: '퀘스트 완료!',
            type: 'quest-text',
            color: '#FFD700',
            size: 24
        });
    }

    // 레벨업/보상 효과
    createRewardEffect(x, y, rewardName) {
        const particleCount = 12;

        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: x + (Math.random() - 0.5) * 20,
                y: y + (Math.random() - 0.5) * 20,
                vx: (Math.random() - 0.5) * 2,
                vy: -Math.random() * 3 - 1,
                life: 2.0,
                maxLife: 2.0,
                size: Math.random() * 5 + 3,
                color: '#00FF00',
                type: 'reward',
                sparkle: true
            });
        }

        // 보상 텍스트
        this.particles.push({
            x: x,
            y: y - 40,
            vx: 0,
            vy: -0.8,
            life: 2.5,
            maxLife: 2.5,
            text: `보상: ${rewardName}`,
            type: 'reward-text',
            color: '#00FF00'
        });
    }

    // 상호작용 힌트 반짝임 효과
    createInteractionHint(x, y) {
        this.particles.push({
            x: x,
            y: y,
            life: 1.0,
            maxLife: 1.0,
            size: 10,
            type: 'hint',
            color: '#FFD700',
            pulse: true
        });
    }

    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];

            // 위치 업데이트
            if (particle.vx !== undefined) particle.x += particle.vx;
            if (particle.vy !== undefined) particle.y += particle.vy;

            // 중력 적용
            if (particle.gravity) {
                particle.vy += particle.gravity;
            }

            // 생명력 감소
            particle.life -= 0.016; // 60fps 기준

            // 속도 감쇠
            if (particle.vx) particle.vx *= 0.98;
            if (particle.vy && particle.type !== 'collect') particle.vy *= 0.98;

            // 파티클 제거
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    draw() {
        this.particles.forEach(particle => {
            const alpha = particle.life / particle.maxLife;

            this.ctx.save();

            if (particle.type === 'text' || particle.type === 'quest-text' || particle.type === 'reward-text') {
                // 텍스트 파티클
                this.ctx.fillStyle = particle.color;
                this.ctx.globalAlpha = alpha;
                this.ctx.font = `bold ${particle.size || 16}px Arial`;
                this.ctx.textAlign = 'center';
                this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
                this.ctx.lineWidth = 2;
                this.ctx.strokeText(particle.text, particle.x, particle.y);
                this.ctx.fillText(particle.text, particle.x, particle.y);
            } else if (particle.type === 'hint') {
                // 힌트 파티클 (펄스 효과)
                const pulse = 0.8 + 0.2 * Math.sin(Date.now() * 0.01);
                this.ctx.globalAlpha = alpha * pulse;
                this.ctx.fillStyle = particle.color;
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size * pulse, 0, Math.PI * 2);
                this.ctx.fill();
            } else {
                // 일반 파티클
                this.ctx.globalAlpha = alpha;

                if (particle.sparkle) {
                    // 반짝임 효과
                    const sparkle = 0.7 + 0.3 * Math.sin(Date.now() * 0.02 + particle.x);
                    this.ctx.globalAlpha = alpha * sparkle;
                }

                this.ctx.fillStyle = particle.color;
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                this.ctx.fill();

                // 추가 광채 효과
                if (particle.type === 'burst' || particle.type === 'reward') {
                    this.ctx.globalAlpha = alpha * 0.3;
                    this.ctx.beginPath();
                    this.ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            }

            this.ctx.restore();
        });
    }

    // 아이템별 색상 결정
    getItemColor(itemName) {
        if (itemName.includes('보고서') || itemName.includes('문서')) return '#87CEEB';
        if (itemName.includes('파일')) return '#98FB98';
        if (itemName.includes('자료')) return '#DDA0DD';
        if (itemName.includes('추천서') || itemName.includes('도장') || itemName.includes('감사장')) return '#FFD700';
        return '#FFA500'; // 기본 색상
    }

    // 모든 파티클 제거
    clear() {
        this.particles = [];
    }
}