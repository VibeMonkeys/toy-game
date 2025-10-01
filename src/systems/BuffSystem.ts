/**
 * ✨ 버프 시스템
 *
 * 임시 스탯 증가 효과 관리
 */

import { PlayerStats } from '../types';

export interface Buff {
    id: string;
    name: string;
    stat: 'attack' | 'defense' | 'speed' | 'critChance' | 'critDamage';
    value: number; // 배율 (0.5 = 50% 증가)
    duration: number; // 초
    startTime: number; // Date.now()
}

export class BuffSystem {
    private buffs: Buff[] = [];

    /**
     * 버프 추가
     */
    addBuff(buff: Omit<Buff, 'id' | 'startTime'>): void {
        const newBuff: Buff = {
            ...buff,
            id: `${buff.name}_${Date.now()}`,
            startTime: Date.now()
        };

        this.buffs.push(newBuff);
        console.log(`✨ 버프 적용: ${buff.name} (+${(buff.value * 100).toFixed(0)}% ${buff.stat}, ${buff.duration}초)`);
    }

    /**
     * 업데이트 (만료된 버프 제거)
     */
    update(): void {
        const now = Date.now();
        const expiredCount = this.buffs.length;

        this.buffs = this.buffs.filter(buff => {
            const elapsed = (now - buff.startTime) / 1000; // 초 단위
            return elapsed < buff.duration;
        });

        const removedCount = expiredCount - this.buffs.length;
        if (removedCount > 0) {
            console.log(`⏰ ${removedCount}개 버프 만료`);
        }
    }

    /**
     * 활성 버프 목록
     */
    getActiveBuffs(): Buff[] {
        return [...this.buffs];
    }

    /**
     * 특정 스탯의 총 버프 배율 계산
     */
    getBuffMultiplier(stat: 'attack' | 'defense' | 'speed' | 'critChance' | 'critDamage'): number {
        let multiplier = 1.0;

        this.buffs.forEach(buff => {
            if (buff.stat === stat) {
                multiplier += buff.value;
            }
        });

        return multiplier;
    }

    /**
     * 버프 적용된 스탯 계산
     */
    applyBuffs(baseStats: PlayerStats): PlayerStats {
        const buffedStats = { ...baseStats };

        buffedStats.attack = Math.floor(baseStats.attack * this.getBuffMultiplier('attack'));
        buffedStats.defense = Math.floor(baseStats.defense * this.getBuffMultiplier('defense'));
        buffedStats.speed = Math.floor(baseStats.speed * this.getBuffMultiplier('speed'));
        buffedStats.criticalChance = baseStats.criticalChance * this.getBuffMultiplier('critChance');
        buffedStats.criticalDamage = baseStats.criticalDamage * this.getBuffMultiplier('critDamage');

        return buffedStats;
    }

    /**
     * 모든 버프 제거
     */
    clearAll(): void {
        this.buffs = [];
        console.log('❌ 모든 버프 제거');
    }

    /**
     * 활성 버프 개수
     */
    getActiveBuffCount(): number {
        return this.buffs.length;
    }

    /**
     * 특정 버프의 남은 시간 (초)
     */
    getBuffRemainingTime(buff: Buff): number {
        const now = Date.now();
        const elapsed = (now - buff.startTime) / 1000;
        return Math.max(0, buff.duration - elapsed);
    }
}
