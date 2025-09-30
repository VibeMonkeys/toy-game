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
}

export class DamageNumberSystem {
    private damageNumbers: DamageNumber[] = [];
    private readonly duration = 1000; // 1초
    private readonly floatSpeed = -60; // 위로 떠오르는 속도 (픽셀/초)

    /**
     * 데미지 숫자 생성
     */
    spawn(x: number, y: number, damage: number, isCritical: boolean = false): void {
        this.damageNumbers.push({
            x: x + (Math.random() - 0.5) * 20, // 약간 랜덤하게 퍼뜨림
            y: y,
            damage,
            isCritical,
            lifetime: 0,
            velocityY: this.floatSpeed
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

            // 위로 이동
            dmg.y += dmg.velocityY * deltaTime;

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
        for (const dmg of this.damageNumbers) {
            // 페이드아웃 (수명에 따라 투명도 감소)
            const alpha = 1 - dmg.lifetime;

            // 크리티컬은 더 크고 노란색
            if (dmg.isCritical) {
                renderer.drawTextWithAlpha(
                    `${Math.floor(dmg.damage)}!`,
                    dmg.x,
                    dmg.y,
                    'bold 28px Arial',
                    '#ffff00',
                    alpha,
                    'center'
                );
            } else {
                // 일반 데미지는 흰색
                renderer.drawTextWithAlpha(
                    Math.floor(dmg.damage).toString(),
                    dmg.x,
                    dmg.y,
                    'bold 20px Arial',
                    '#ffffff',
                    alpha,
                    'center'
                );
            }
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