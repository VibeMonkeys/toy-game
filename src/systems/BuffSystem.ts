/**
 * ✨ 버프/디버프 시스템 (v2)
 *
 * 플레이어, 적, 보스의 임시 상태 효과 관리
 */

import { Buff, BuffType } from '../types';
import { Renderer } from './Renderer';

export class BuffSystem {
    private buffs: Map<string, Buff[]> = new Map(); // entityId -> buffs
    private nextId: number = 0;

    constructor() {}

    /**
     * 버프 적용
     */
    applyBuff(
        entityId: string,
        type: BuffType,
        duration: number,
        value: number,
        options?: {
            isMultiplier?: boolean;
            stackable?: boolean;
            maxStacks?: number;
        }
    ): void {
        if (!this.buffs.has(entityId)) {
            this.buffs.set(entityId, []);
        }

        const entityBuffs = this.buffs.get(entityId)!;
        const stackable = options?.stackable || false;
        const maxStacks = options?.maxStacks || 1;

        // 같은 타입의 버프가 있는지 확인
        const existingBuff = entityBuffs.find(b => b.type === type);

        if (existingBuff) {
            if (stackable && existingBuff.stacks < maxStacks) {
                // 스택 증가
                existingBuff.stacks++;
                existingBuff.remainingTime = Math.max(existingBuff.remainingTime, duration);
                console.log(`✨ ${type} 버프 스택: ${existingBuff.stacks}/${maxStacks}`);
            } else {
                // 지속시간 갱신
                existingBuff.remainingTime = duration;
                console.log(`✨ ${type} 버프 갱신: ${duration}ms`);
            }
        } else {
            // 새 버프 추가
            const buff: Buff = {
                id: `buff_${this.nextId++}`,
                type,
                duration,
                remainingTime: duration,
                value,
                isMultiplier: options?.isMultiplier || false,
                stackable,
                stacks: 1,
                maxStacks
            };

            entityBuffs.push(buff);
            console.log(`✨ ${type} 버프 적용: ${duration}ms, 값: ${value}`);
        }
    }

    /**
     * 버프 제거
     */
    removeBuff(entityId: string, buffType: BuffType): void {
        const entityBuffs = this.buffs.get(entityId);
        if (!entityBuffs) return;

        const index = entityBuffs.findIndex(b => b.type === buffType);
        if (index !== -1) {
            entityBuffs.splice(index, 1);
            console.log(`❌ ${buffType} 버프 제거`);
        }
    }

    /**
     * 모든 버프 제거
     */
    clearBuffs(entityId: string): void {
        this.buffs.delete(entityId);
    }

    /**
     * 업데이트
     */
    update(deltaTime: number): void {
        for (const [entityId, entityBuffs] of this.buffs.entries()) {
            for (let i = entityBuffs.length - 1; i >= 0; i--) {
                const buff = entityBuffs[i];

                // 시간 감소
                buff.remainingTime -= deltaTime * 1000;

                // 만료된 버프 제거
                if (buff.remainingTime <= 0) {
                    console.log(`⏰ ${buff.type} 버프 만료`);
                    entityBuffs.splice(i, 1);
                }
            }

            // 버프가 없으면 엔티티 제거
            if (entityBuffs.length === 0) {
                this.buffs.delete(entityId);
            }
        }
    }

    /**
     * 공격력 보정 계산
     */
    getAttackModifier(entityId: string, baseAttack: number): number {
        const buffs = this.buffs.get(entityId);
        if (!buffs) return baseAttack;

        let attack = baseAttack;

        for (const buff of buffs) {
            if (buff.type === 'attack_up') {
                if (buff.isMultiplier) {
                    attack *= (1 + buff.value * buff.stacks);
                } else {
                    attack += buff.value * buff.stacks;
                }
            } else if (buff.type === 'attack_down') {
                if (buff.isMultiplier) {
                    attack *= (1 - buff.value * buff.stacks);
                } else {
                    attack -= buff.value * buff.stacks;
                }
            }
        }

        return Math.max(1, Math.floor(attack));
    }

    /**
     * 방어력 보정 계산
     */
    getDefenseModifier(entityId: string, baseDefense: number): number {
        const buffs = this.buffs.get(entityId);
        if (!buffs) return baseDefense;

        let defense = baseDefense;

        for (const buff of buffs) {
            if (buff.type === 'defense_up') {
                if (buff.isMultiplier) {
                    defense *= (1 + buff.value * buff.stacks);
                } else {
                    defense += buff.value * buff.stacks;
                }
            } else if (buff.type === 'defense_down') {
                if (buff.isMultiplier) {
                    defense *= (1 - buff.value * buff.stacks);
                } else {
                    defense -= buff.value * buff.stacks;
                }
            }
        }

        return Math.max(0, Math.floor(defense));
    }

    /**
     * 속도 보정 계산
     */
    getSpeedModifier(entityId: string, baseSpeed: number): number {
        const buffs = this.buffs.get(entityId);
        if (!buffs) return baseSpeed;

        let speed = baseSpeed;

        for (const buff of buffs) {
            if (buff.type === 'speed_up') {
                if (buff.isMultiplier) {
                    speed *= (1 + buff.value * buff.stacks);
                } else {
                    speed += buff.value * buff.stacks;
                }
            } else if (buff.type === 'speed_down' || buff.type === 'frozen') {
                if (buff.isMultiplier) {
                    speed *= (1 - buff.value * buff.stacks);
                } else {
                    speed -= buff.value * buff.stacks;
                }
            }
        }

        return Math.max(10, Math.floor(speed)); // 최소 속도 10
    }

    /**
     * 버프 확인
     */
    hasBuff(entityId: string, buffType: BuffType): boolean {
        const buffs = this.buffs.get(entityId);
        return buffs ? buffs.some(b => b.type === buffType) : false;
    }

    /**
     * 무적 상태 확인
     */
    isInvulnerable(entityId: string): boolean {
        return this.hasBuff(entityId, 'invulnerable');
    }

    /**
     * 스턴 상태 확인
     */
    isStunned(entityId: string): boolean {
        return this.hasBuff(entityId, 'stun');
    }

    /**
     * DoT (Damage over Time) 계산
     */
    calculateDoT(entityId: string, deltaTime: number): number {
        const buffs = this.buffs.get(entityId);
        if (!buffs) return 0;

        let damage = 0;

        for (const buff of buffs) {
            if (buff.type === 'burning' || buff.type === 'poisoned') {
                // 초당 데미지
                damage += buff.value * buff.stacks * deltaTime;
            }
        }

        return Math.floor(damage);
    }

    /**
     * HoT (Heal over Time) 계산
     */
    calculateHoT(entityId: string, deltaTime: number): number {
        const buffs = this.buffs.get(entityId);
        if (!buffs) return 0;

        let heal = 0;

        for (const buff of buffs) {
            if (buff.type === 'regeneration') {
                // 초당 회복
                heal += buff.value * buff.stacks * deltaTime;
            }
        }

        return Math.floor(heal);
    }

    /**
     * 엔티티의 모든 버프 가져오기
     */
    getBuffs(entityId: string): Buff[] {
        return this.buffs.get(entityId) || [];
    }

    /**
     * 버프 아이콘 렌더링 (엔티티 위에)
     */
    renderBuffIcons(renderer: Renderer, x: number, y: number, entityId: string): void {
        const buffs = this.buffs.get(entityId);
        if (!buffs || buffs.length === 0) return;

        const ctx = renderer.getContext();
        const iconSize = 16;
        const spacing = 2;
        const startX = x - (buffs.length * (iconSize + spacing)) / 2;
        const startY = y - 40;

        for (let i = 0; i < buffs.length; i++) {
            const buff = buffs[i];
            const iconX = startX + i * (iconSize + spacing);

            // 아이콘 배경
            ctx.fillStyle = this.getBuffColor(buff.type);
            ctx.fillRect(iconX, startY, iconSize, iconSize);

            // 테두리
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 1;
            ctx.strokeRect(iconX, startY, iconSize, iconSize);

            // 스택 표시
            if (buff.stacks > 1) {
                ctx.fillStyle = '#FFFFFF';
                ctx.font = 'bold 10px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(
                    buff.stacks.toString(),
                    iconX + iconSize / 2,
                    startY + iconSize - 2
                );
            }

            // 남은 시간 표시 (바 형태)
            const timePercent = buff.remainingTime / buff.duration;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.fillRect(
                iconX,
                startY + iconSize - 2,
                iconSize * timePercent,
                2
            );
        }
    }

    /**
     * 버프 타입별 색상
     */
    private getBuffColor(type: BuffType): string {
        switch (type) {
            case 'attack_up': return '#FF6B6B';
            case 'attack_down': return '#8B0000';
            case 'defense_up': return '#4ECDC4';
            case 'defense_down': return '#006666';
            case 'speed_up': return '#FFD93D';
            case 'speed_down': return '#8B7500';
            case 'invulnerable': return '#FFD700';
            case 'stun': return '#808080';
            case 'burning': return '#FF4500';
            case 'frozen': return '#00BFFF';
            case 'poisoned': return '#9370DB';
            case 'regeneration': return '#00FF00';
            default: return '#FFFFFF';
        }
    }
}
