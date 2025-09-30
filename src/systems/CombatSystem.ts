/**
 * ⚔️ 전투 시스템
 *
 * 콤보, 회피, 패링 등 전투 메카닉을 관리합니다.
 * docs/OPTIMIZED_GAME_DESIGN.md 기반으로 구현
 */

import { CombatResult, StatusEffect } from '../types';
import { GAMEPLAY, getComboMultiplier, calculateCriticalDamage, calculateBackstabDamage } from '../utils/Constants';

export class CombatSystem {
    // 콤보 시스템
    private comboCount: number = 0;
    private lastAttackTime: number = 0;

    // 회피 시스템
    private lastDodgeTime: number = 0;
    private isDodging: boolean = false;
    private perfectDodgeWindow: number = 0;

    // 패링 시스템
    private lastParryTime: number = 0;
    private isParrying: boolean = false;

    /**
     * 공격 처리
     */
    attack(
        baseDamage: number,
        criticalChance: number,
        isBackstab: boolean = false
    ): CombatResult {
        const now = Date.now();

        // 콤보 체크
        if (now - this.lastAttackTime > GAMEPLAY.COMBAT.COMBO_TIMEOUT) {
            this.comboCount = 0;
        }

        this.comboCount++;
        this.lastAttackTime = now;

        // 콤보 배율
        const comboMultiplier = getComboMultiplier(this.comboCount);

        // 크리티컬 체크
        const isCritical = Math.random() < criticalChance;

        // 최종 데미지 계산
        let damage = baseDamage * comboMultiplier;

        if (isCritical) {
            damage = calculateCriticalDamage(damage);
        }

        if (isBackstab) {
            damage = calculateBackstabDamage(damage);
        }

        return {
            damage: Math.floor(damage),
            isCritical,
            isBackstab,
            comboMultiplier
        };
    }

    /**
     * 회피 시도
     */
    tryDodge(): { success: boolean; isPerfect: boolean } {
        const now = Date.now();

        // 쿨다운 체크
        if (now - this.lastDodgeTime < GAMEPLAY.COMBAT.DODGE_COOLDOWN) {
            return { success: false, isPerfect: false };
        }

        this.lastDodgeTime = now;
        this.isDodging = true;

        // 완벽 회피 윈도우 설정
        this.perfectDodgeWindow = now + GAMEPLAY.COMBAT.DODGE_INVULNERABLE_TIME;

        // 회피 종료 타이머
        setTimeout(() => {
            this.isDodging = false;
        }, GAMEPLAY.COMBAT.DODGE_INVULNERABLE_TIME);

        return { success: true, isPerfect: false };
    }

    /**
     * 패링 시도
     */
    tryParry(): boolean {
        const now = Date.now();

        this.lastParryTime = now;
        this.isParrying = true;

        // 패링 윈도우 종료
        setTimeout(() => {
            this.isParrying = false;
        }, GAMEPLAY.COMBAT.PARRY_WINDOW);

        return true;
    }

    /**
     * 무적 상태 체크
     */
    isInvulnerable(): boolean {
        return this.isDodging;
    }

    /**
     * 패링 중인지 체크
     */
    isInParryWindow(): boolean {
        return this.isParrying;
    }

    /**
     * 완벽 회피 체크
     */
    checkPerfectDodge(enemyAttackTime: number): boolean {
        const timeDiff = Math.abs(enemyAttackTime - this.lastDodgeTime);
        return timeDiff < 100; // 0.1초 이내
    }

    /**
     * 콤보 카운트 가져오기
     */
    getComboCount(): number {
        return this.comboCount;
    }

    /**
     * 콤보 리셋
     */
    resetCombo(): void {
        this.comboCount = 0;
    }

    /**
     * 히트스탑 효과 시간 계산
     */
    getHitStopDuration(isCritical: boolean, isComboFinish: boolean): number {
        if (isComboFinish) return 150;
        if (isCritical) return 100;
        return 50;
    }
}