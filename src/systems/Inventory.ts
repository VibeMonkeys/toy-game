/**
 * 🎒 인벤토리 시스템
 *
 * 플레이어 아이템 관리 (획득, 장착, 사용)
 */

import { Item, ItemType } from './ItemSystem';
import type { PlayerStats } from '../types';

export interface InventorySlot {
    item: Item;
    quantity: number;
}

export interface EquippedItems {
    weapon: Item | null;
    armor: Item | null;
}

export class Inventory {
    private slots: InventorySlot[] = [];
    private maxSlots: number = 20;
    private equipped: EquippedItems = {
        weapon: null,
        armor: null
    };

    /**
     * 아이템 추가
     */
    addItem(item: Item): boolean {
        // 스택 가능한 아이템이면 기존 슬롯에 추가
        if (item.stackable) {
            const existingSlot = this.slots.find(
                slot => slot.item.id === item.id && slot.quantity < item.maxStack
            );

            if (existingSlot) {
                existingSlot.quantity++;
                return true;
            }
        }

        // 새 슬롯 추가
        if (this.slots.length < this.maxSlots) {
            this.slots.push({
                item,
                quantity: 1
            });
            return true;
        }

        // 인벤토리 꽉 참
        return false;
    }

    /**
     * 아이템 제거
     */
    removeItem(slotIndex: number, quantity: number = 1): Item | null {
        if (slotIndex < 0 || slotIndex >= this.slots.length) return null;

        const slot = this.slots[slotIndex];
        slot.quantity -= quantity;

        if (slot.quantity <= 0) {
            const item = slot.item;
            this.slots.splice(slotIndex, 1);
            return item;
        }

        return slot.item;
    }

    /**
     * 아이템 장착
     */
    equipItem(slotIndex: number, playerStats: PlayerStats): boolean {
        if (slotIndex < 0 || slotIndex >= this.slots.length) return false;

        const slot = this.slots[slotIndex];
        const item = slot.item;

        // 장착 가능한 아이템만
        if (item.type === ItemType.WEAPON) {
            // 기존 무기 해제
            if (this.equipped.weapon) {
                this.unapplyItemStats(this.equipped.weapon, playerStats);
                this.addItem(this.equipped.weapon);
            }

            // 새 무기 장착
            this.equipped.weapon = item;
            this.applyItemStats(item, playerStats);
            this.removeItem(slotIndex);

            console.log(`⚔️ ${item.name} 장착!`);
            return true;
        } else if (item.type === ItemType.ARMOR) {
            // 기존 방어구 해제
            if (this.equipped.armor) {
                this.unapplyItemStats(this.equipped.armor, playerStats);
                this.addItem(this.equipped.armor);
            }

            // 새 방어구 장착
            this.equipped.armor = item;
            this.applyItemStats(item, playerStats);
            this.removeItem(slotIndex);

            console.log(`🛡️ ${item.name} 장착!`);
            return true;
        }

        return false;
    }

    /**
     * 아이템 장착 해제
     */
    unequipItem(type: 'weapon' | 'armor', playerStats: PlayerStats): boolean {
        const item = this.equipped[type];
        if (!item) return false;

        // 인벤토리 공간 체크
        if (this.slots.length >= this.maxSlots) {
            console.log('❌ 인벤토리 공간이 부족합니다');
            return false;
        }

        // 스탯 제거
        this.unapplyItemStats(item, playerStats);

        // 인벤토리로 반환
        this.addItem(item);
        this.equipped[type] = null;

        console.log(`📦 ${item.name} 장착 해제`);
        return true;
    }

    /**
     * 소비템 사용
     */
    useConsumable(slotIndex: number, playerStats: PlayerStats): boolean {
        if (slotIndex < 0 || slotIndex >= this.slots.length) return false;

        const slot = this.slots[slotIndex];
        const item = slot.item;

        if (item.type !== ItemType.CONSUMABLE) return false;

        // 즉시 효과 적용
        if (item.stats.health) {
            playerStats.health = Math.min(playerStats.maxHealth, playerStats.health + item.stats.health);
        }
        if (item.stats.mana) {
            playerStats.mana = Math.min(playerStats.maxMana, playerStats.mana + item.stats.mana);
        }

        // 아이템 소비
        this.removeItem(slotIndex);

        console.log(`💊 ${item.name} 사용!`);
        return true;
    }

    /**
     * 아이템 스탯 적용
     */
    private applyItemStats(item: Item, playerStats: PlayerStats): void {
        if (item.stats.attack) playerStats.attack += item.stats.attack;
        if (item.stats.defense) playerStats.defense += item.stats.defense;
        if (item.stats.speed) playerStats.speed += item.stats.speed;
        if (item.stats.criticalChance) playerStats.criticalChance += item.stats.criticalChance;
        if (item.stats.criticalDamage) playerStats.criticalDamage += item.stats.criticalDamage;
        if (item.stats.health) {
            playerStats.maxHealth += item.stats.health;
            playerStats.health += item.stats.health;
        }
        if (item.stats.mana) {
            playerStats.maxMana += item.stats.mana;
            playerStats.mana += item.stats.mana;
        }
    }

    /**
     * 아이템 스탯 제거
     */
    private unapplyItemStats(item: Item, playerStats: PlayerStats): void {
        if (item.stats.attack) playerStats.attack -= item.stats.attack;
        if (item.stats.defense) playerStats.defense -= item.stats.defense;
        if (item.stats.speed) playerStats.speed -= item.stats.speed;
        if (item.stats.criticalChance) playerStats.criticalChance -= item.stats.criticalChance;
        if (item.stats.criticalDamage) playerStats.criticalDamage -= item.stats.criticalDamage;
        if (item.stats.health) {
            playerStats.maxHealth -= item.stats.health;
            playerStats.health = Math.min(playerStats.health, playerStats.maxHealth);
        }
        if (item.stats.mana) {
            playerStats.maxMana -= item.stats.mana;
            playerStats.mana = Math.min(playerStats.mana, playerStats.maxMana);
        }
    }

    /**
     * 인벤토리 슬롯 가져오기
     */
    getSlots(): InventorySlot[] {
        return this.slots;
    }

    /**
     * 장착 아이템 가져오기
     */
    getEquipped(): EquippedItems {
        return this.equipped;
    }

    /**
     * 인벤토리 클리어
     */
    clear(): void {
        this.slots = [];
        this.equipped = {
            weapon: null,
            armor: null
        };
    }
}