/**
 * 💥 데미지 숫자 표시 시스템
 *
 * 전투 피드백을 위한 떠오르는 데미지 숫자
 */

import { Renderer } from './Renderer';

export interface DamageNumber {
    x: number;
    y: number;
    damage: number;
    isCritical: boolean;
    lifetime: number; // 0 ~ 1 (0 = 생성, 1 = 소멸)
    velocityY: number;
    velocityX: number;
    scale: number; // 크기 애니메이션
    isHeal: boolean; // 치유 표시
}

export class DamageNumberSystem {
    private damageNumbers: DamageNumber[] = [];
    private readonly duration = 1000; // 1초
    private readonly floatSpeed = -60; // 위로 떠오르는 속도 (픽셀/초)

    /**
     * 데미지 숫자 생성
     */
    spawn(x: number, y: number, damage: number, isCritical: boolean = false): void {
        const angle = (Math.random() - 0.5) * Math.PI / 3; // -30도 ~ +30도
        const speed = isCritical ? 80 : 60;

        this.damageNumbers.push({
            x: x + (Math.random() - 0.5) * 30, // 더 넓게 퍼뜨림
            y: y,
            damage,
            isCritical,
            lifetime: 0,
            velocityY: Math.cos(angle) * -speed, // 위로
            velocityX: Math.sin(angle) * speed, // 좌우로
            scale: isCritical ? 1.5 : 1.0,
            isHeal: false
        });
    }

    /**
     * 치유 숫자 생성
     */
    spawnHeal(x: number, y: number, amount: number): void {
        this.damageNumbers.push({
            x: x,
            y: y,
            damage: amount,
            isCritical: false,
            lifetime: 0,
            velocityY: -50,
            velocityX: 0,
            scale: 1.2,
            isHeal: true
        });
    }

    /**
     * 업데이트
     */
    update(deltaTime: number): void {
        for (let i = this.damageNumbers.length - 1; i >= 0; i--) {
            const dmg = this.damageNumbers[i];

            // 수명 증가
            dmg.lifetime += deltaTime / (this.duration / 1000);

            // 이동 (중력 효과)
            dmg.y += dmg.velocityY * deltaTime;
            dmg.x += dmg.velocityX * deltaTime;

            // 속도 감소 (공기 저항)
            dmg.velocityY += 100 * deltaTime; // 중력 (아래로)
            dmg.velocityX *= 0.95; // 마찰

            // 크기 애니메이션 (처음에는 커지고 나중에 작아짐)
            if (dmg.lifetime < 0.2) {
                dmg.scale = 1.0 + dmg.lifetime * 2; // 0.2초간 커짐
            } else {
                dmg.scale = 1.4 - (dmg.lifetime - 0.2) * 0.5; // 서서히 작아짐
            }

            // 수명 다하면 제거
            if (dmg.lifetime >= 1) {
                this.damageNumbers.splice(i, 1);
            }
        }
    }

    /**
     * 렌더링
     */
    render(renderer: Renderer): void {
        const ctx = renderer.getContext();

        for (const dmg of this.damageNumbers) {
            // 페이드아웃 (수명에 따라 투명도 감소)
            const alpha = 1 - dmg.lifetime;

            // 스케일에 따른 폰트 크기 계산
            let baseFontSize = dmg.isCritical ? 28 : 20;
            if (dmg.isHeal) baseFontSize = 22;
            const fontSize = Math.floor(baseFontSize * dmg.scale);
            const font = `bold ${fontSize}px Arial`;

            // 색상 결정
            let color = '#ffffff';
            let glowColor = 'rgba(255, 255, 255, 0.5)';

            if (dmg.isHeal) {
                color = '#00ff88'; // 밝은 청록색 (치유)
                glowColor = 'rgba(0, 255, 136, 0.8)';
            } else if (dmg.isCritical) {
                color = '#ffff00'; // 노란색 (크리티컬)
                glowColor = 'rgba(255, 255, 0, 0.8)';
            }

            // 텍스트 준비
            const text = dmg.isHeal
                ? `+${Math.floor(dmg.damage)}`
                : dmg.isCritical
                    ? `${Math.floor(dmg.damage)}!`
                    : Math.floor(dmg.damage).toString();

            ctx.save();
            ctx.globalAlpha = alpha;

            // 외곽선 효과 (그림자)
            ctx.shadowColor = glowColor;
            ctx.shadowBlur = 8 * dmg.scale;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;

            // 테두리 그리기 (가독성 향상)
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
            ctx.lineWidth = 3 * dmg.scale;
            ctx.font = font;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.strokeText(text, dmg.x, dmg.y);

            // 메인 텍스트
            ctx.fillStyle = color;
            ctx.fillText(text, dmg.x, dmg.y);

            ctx.restore();
        }
    }

    /**
     * 모든 데미지 숫자 제거
     */
    clear(): void {
        this.damageNumbers = [];
    }

    /**
     * 현재 활성 데미지 숫자 수
     */
    getCount(): number {
        return this.damageNumbers.length;
    }
}