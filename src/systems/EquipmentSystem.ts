/**
 * ⚔️ 장비 시스템
 *
 * 플레이어 장비 관리 및 스탯 계산
 */

import { Item, ArmorSlot, PlayerStats } from '../types';

export interface EquippedItems {
    helmet: Item | null;
    chest: Item | null;
    legs: Item | null;
    boots: Item | null;
    accessory: Item | null;
}

export class EquipmentSystem {
    private equipped: EquippedItems = {
        helmet: null,
        chest: null,
        legs: null,
        boots: null,
        accessory: null
    };

    /**
     * 장비 착용
     */
    equip(item: Item): Item | null {
        if (item.type !== 'armor' || !item.slot) {
            console.warn('착용할 수 없는 아이템입니다:', item.name);
            return null;
        }

        const slot = item.slot;
        const previousItem = this.equipped[slot];
        this.equipped[slot] = item;

        console.log(`✅ ${item.name} 착용!`);
        return previousItem; // 기존 장비 반환 (인벤토리에 다시 넣기 위해)
    }

    /**
     * 장비 해제
     */
    unequip(slot: ArmorSlot): Item | null {
        const item = this.equipped[slot];
        if (item) {
            this.equipped[slot] = null;
            console.log(`❌ ${item.name} 해제!`);
        }
        return item;
    }

    /**
     * 특정 슬롯의 장비 가져오기
     */
    getEquipped(slot: ArmorSlot): Item | null {
        return this.equipped[slot];
    }

    /**
     * 모든 장비 가져오기
     */
    getAllEquipped(): EquippedItems {
        return { ...this.equipped };
    }

    /**
     * 장비로부터 추가 스탯 계산
     */
    calculateBonusStats(): Partial<PlayerStats> {
        const bonus: Partial<PlayerStats> = {
            attack: 0,
            defense: 0,
            maxHealth: 0,
            speed: 0,
            criticalChance: 0,
            criticalDamage: 0
        };

        // 모든 장비의 스탯 합산
        Object.values(this.equipped).forEach(item => {
            if (item && item.stats) {
                if (item.stats.attack) bonus.attack! += item.stats.attack;
                if (item.stats.defense) bonus.defense! += item.stats.defense;
                if (item.stats.health) bonus.maxHealth! += item.stats.health;
                if (item.stats.speed) bonus.speed! += item.stats.speed;
                if (item.stats.critChance) bonus.criticalChance! += item.stats.critChance;
                if (item.stats.critDamage) bonus.criticalDamage! += item.stats.critDamage;
            }
        });

        return bonus;
    }

    /**
     * 장비 중인 아이템 개수
     */
    getEquippedCount(): number {
        return Object.values(this.equipped).filter(item => item !== null).length;
    }

    /**
     * 특정 슬롯에 장비가 있는지
     */
    hasEquipped(slot: ArmorSlot): boolean {
        return this.equipped[slot] !== null;
    }

    /**
     * 모든 장비 해제
     */
    unequipAll(): Item[] {
        const items: Item[] = [];

        (Object.keys(this.equipped) as ArmorSlot[]).forEach(slot => {
            const item = this.unequip(slot);
            if (item) items.push(item);
        });

        return items;
    }

    /**
     * 저장 데이터로 변환
     */
    toSaveData(): Record<string, string | null> {
        const data: Record<string, string | null> = {};

        (Object.keys(this.equipped) as ArmorSlot[]).forEach(slot => {
            data[slot] = this.equipped[slot]?.id || null;
        });

        return data;
    }

    /**
     * 저장 데이터에서 복원
     */
    fromSaveData(data: Record<string, string | null>, getItemById: (id: string) => Item | undefined): void {
        (Object.keys(data) as ArmorSlot[]).forEach(slot => {
            const itemId = data[slot];
            if (itemId) {
                const item = getItemById(itemId);
                if (item) {
                    this.equipped[slot] = item;
                }
            }
        });
    }
}
