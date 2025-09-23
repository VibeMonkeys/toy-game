import { Logger } from '../utils/Logger.js';

export class CertificateScreen {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.isActive = false;
        this.animationPhase = 0; // 0: 페이드인, 1: 메인 표시, 2: 반짝임
        this.startTime = 0;
        this.playerName = '';
        this.completionTime = '';
        this.itemsCollected = 0;
        this.questsCompleted = 0;
        this.onClose = null;
    }

    show(playerStats, onClose) {
        this.isActive = true;
        this.animationPhase = 0;
        this.startTime = Date.now();
        this.playerName = playerStats.name || '플레이어';
        this.completionTime = playerStats.completionTime || '30분';
        this.itemsCollected = playerStats.itemsCollected || 0;
        this.questsCompleted = playerStats.questsCompleted || 0;
        this.onClose = onClose;
        Logger.info('🏆 인증서 화면 표시!', playerStats);
    }

    update() {
        if (!this.isActive) return;

        const elapsed = Date.now() - this.startTime;

        if (this.animationPhase === 0 && elapsed >= 1000) { // 1초 페이드인
            this.animationPhase = 1;
            this.startTime = Date.now();
        } else if (this.animationPhase === 1 && elapsed >= 2000) { // 2초 후 반짝임 시작
            this.animationPhase = 2;
            this.startTime = Date.now();
        }
    }

    draw() {
        if (!this.isActive) return;

        const elapsed = Date.now() - this.startTime;
        let alpha = 1;

        // 페이드 효과
        if (this.animationPhase === 0) {
            alpha = Math.min(1, elapsed / 1000);
        }

        // 배경
        this.ctx.fillStyle = `rgba(0, 0, 50, ${alpha * 0.95})`;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 인증서 메인 배경
        const certWidth = 600;
        const certHeight = 450;
        const certX = (this.canvas.width - certWidth) / 2;
        const certY = (this.canvas.height - certHeight) / 2;

        // 인증서 배경 (금색 테두리)
        this.ctx.fillStyle = `rgba(255, 248, 220, ${alpha})`;
        this.ctx.fillRect(certX, certY, certWidth, certHeight);

        // 금색 테두리
        this.ctx.strokeStyle = `rgba(255, 215, 0, ${alpha})`;
        this.ctx.lineWidth = 8;
        this.ctx.strokeRect(certX, certY, certWidth, certHeight);

        // 내부 테두리
        this.ctx.strokeStyle = `rgba(184, 134, 11, ${alpha})`;
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(certX + 20, certY + 20, certWidth - 40, certHeight - 40);

        // 제목 - 휴넷 26주년
        this.ctx.fillStyle = `rgba(255, 0, 0, ${alpha})`;
        this.ctx.font = 'bold 32px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('🎉 휴넷 26주년 기념 🎉', this.canvas.width / 2, certY + 80);

        // 인증서 제목
        this.ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
        this.ctx.font = 'bold 24px Arial';
        this.ctx.fillText('게임 완주 인증서', this.canvas.width / 2, certY + 120);

        // 플레이어 이름 (입력 받지 않으므로 기본값)
        this.ctx.fillStyle = `rgba(255, 100, 100, ${alpha})`;
        this.ctx.font = 'bold 28px Arial';
        this.ctx.fillText(`${this.playerName} 님`, this.canvas.width / 2, certY + 170);

        // 완주 메시지
        this.ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
        this.ctx.font = '18px Arial';
        this.ctx.fillText('휴넷 26주년 기념 게임을 성공적으로 완주하였습니다!', this.canvas.width / 2, certY + 210);

        // 통계 정보
        const statsY = certY + 250;
        this.ctx.fillStyle = `rgba(50, 50, 50, ${alpha})`;
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'left';

        const statsX = certX + 80;
        this.ctx.fillText(`⏱️ 완료 시간: ${this.completionTime}`, statsX, statsY);
        this.ctx.fillText(`📦 수집한 아이템: ${this.itemsCollected}개`, statsX, statsY + 30);
        this.ctx.fillText(`🎯 완료한 퀘스트: ${this.questsCompleted}개`, statsX, statsY + 60);

        // 특별 메시지
        this.ctx.fillStyle = `rgba(255, 140, 0, ${alpha})`;
        this.ctx.font = 'bold 14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('축하합니다! 휴넷의 모든 층을 탐험하고 26주년을 함께 축하해주셨습니다!',
                         this.canvas.width / 2, certY + 350);

        // 날짜
        const today = new Date();
        const dateStr = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;
        this.ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'right';
        this.ctx.fillText(dateStr, certX + certWidth - 40, certY + certHeight - 30);

        // 휴넷 로고/서명
        this.ctx.textAlign = 'left';
        this.ctx.fillText('휴넷 Inc.', certX + 40, certY + certHeight - 30);

        // 반짝임 효과 (완료 후)
        if (this.animationPhase === 2) {
            const sparkleAlpha = 0.3 + 0.7 * Math.sin(elapsed * 0.005);
            this.drawSparkles(alpha * sparkleAlpha);
        }

        // 조작 안내
        this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('[Space] 키를 눌러 메인으로 돌아가기', this.canvas.width / 2, this.canvas.height - 50);

        // 공유 안내
        this.ctx.fillStyle = `rgba(200, 200, 200, ${alpha * 0.6})`;
        this.ctx.font = '12px Arial';
        this.ctx.fillText('스크린샷을 찍어서 SNS에 공유해보세요!', this.canvas.width / 2, this.canvas.height - 20);
    }

    drawSparkles(alpha) {
        // 반짝이는 별들
        this.ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;
        this.ctx.font = '20px Arial';
        this.ctx.textAlign = 'center';

        const sparkles = [
            {x: this.canvas.width / 2 - 200, y: 150},
            {x: this.canvas.width / 2 + 200, y: 150},
            {x: this.canvas.width / 2 - 150, y: 300},
            {x: this.canvas.width / 2 + 150, y: 300},
            {x: this.canvas.width / 2 - 250, y: 250},
            {x: this.canvas.width / 2 + 250, y: 250}
        ];

        sparkles.forEach((sparkle, index) => {
            const delay = index * 200;
            const sparkleTime = (Date.now() - this.startTime - delay) * 0.01;
            if (sparkleTime > 0) {
                const scale = 1 + 0.3 * Math.sin(sparkleTime);
                this.ctx.save();
                this.ctx.translate(sparkle.x, sparkle.y);
                this.ctx.scale(scale, scale);
                this.ctx.fillText('✨', 0, 0);
                this.ctx.restore();
            }
        });
    }

    handleKeyPress(key) {
        if (!this.isActive) return false;

        if (key === ' ' || key === 'Enter' || key === 'Escape') {
            this.close();
            return true;
        }
        return false;
    }

    close() {
        this.isActive = false;
        Logger.info('🏆 인증서 화면 닫기');
        if (this.onClose) {
            this.onClose();
        }
    }

    isVisible() {
        return this.isActive;
    }
}
