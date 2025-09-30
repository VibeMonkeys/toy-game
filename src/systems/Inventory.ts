/**
 * 🎒 인벤토리 시스템
 *
 * 플레이어 아이템 관리 (획득, 장착, 사용)
 */

import { Item, ItemType, ItemRarity } from './ItemSystem';
import type { PlayerStats } from '../types';
import { Renderer } from './Renderer';
import { RARITY_COLORS } from '../utils/Constants';

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

    /**
     * 인벤토리 UI 렌더링
     */
    render(renderer: Renderer, isOpen: boolean = false): void {
        if (!isOpen) return;

        const ctx = renderer.getContext();
        const centerX = 640;
        const centerY = 360;
        const panelWidth = 600;
        const panelHeight = 500;
        const panelX = centerX - panelWidth / 2;
        const panelY = centerY - panelHeight / 2;

        // 반투명 배경 (전체 화면)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, 1280, 720);

        // 인벤토리 패널
        ctx.fillStyle = 'rgba(44, 62, 80, 0.95)';
        ctx.fillRect(panelX, panelY, panelWidth, panelHeight);

        // 패널 테두리
        ctx.strokeStyle = '#5D6D7E';
        ctx.lineWidth = 3;
        ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);

        // 타이틀 바
        ctx.fillStyle = 'rgba(52, 73, 94, 0.95)';
        ctx.fillRect(panelX, panelY, panelWidth, 50);
        ctx.strokeStyle = '#5D6D7E';
        ctx.lineWidth = 2;
        ctx.strokeRect(panelX, panelY, panelWidth, 50);

        // 타이틀
        ctx.fillStyle = '#ECF0F1';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('🎒 인벤토리', panelX + 20, panelY + 35);

        // 슬롯 정보
        ctx.font = '14px Arial';
        ctx.fillStyle = '#95A5A6';
        ctx.textAlign = 'right';
        ctx.fillText(`${this.slots.length} / ${this.maxSlots}`, panelX + panelWidth - 20, panelY + 35);

        // 장착 아이템 영역
        const equipX = panelX + 20;
        const equipY = panelY + 70;

        ctx.fillStyle = '#34495E';
        ctx.fillRect(equipX, equipY, 250, 150);
        ctx.strokeStyle = '#5D6D7E';
        ctx.lineWidth = 2;
        ctx.strokeRect(equipX, equipY, 250, 150);

        ctx.fillStyle = '#ECF0F1';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('⚔️ 장착 아이템', equipX + 10, equipY + 25);

        // 무기 슬롯
        this.renderEquipmentSlot(ctx, equipX + 10, equipY + 40, '무기', this.equipped.weapon);

        // 방어구 슬롯
        this.renderEquipmentSlot(ctx, equipX + 10, equipY + 90, '방어구', this.equipped.armor);

        // 인벤토리 슬롯 그리드
        const slotSize = 60;
        const slotGap = 10;
        const slotsPerRow = 8;
        const gridX = panelX + 20;
        const gridY = panelY + 240;

        ctx.fillStyle = '#ECF0F1';
        ctx.font = 'bold 16px Arial';
        ctx.fillText('📦 보유 아이템', gridX, gridY - 10);

        for (let i = 0; i < this.maxSlots; i++) {
            const row = Math.floor(i / slotsPerRow);
            const col = i % slotsPerRow;
            const x = gridX + col * (slotSize + slotGap);
            const y = gridY + row * (slotSize + slotGap);

            const slot = this.slots[i];
            this.renderInventorySlot(ctx, x, y, slotSize, slot);
        }

        // 안내 문구
        ctx.fillStyle = '#95A5A6';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('ESC 또는 I 키를 눌러 닫기', centerX, panelY + panelHeight - 15);
    }

    /**
     * 장착 슬롯 렌더링
     */
    private renderEquipmentSlot(ctx: CanvasRenderingContext2D, x: number, y: number, label: string, item: Item | null): void {
        // 슬롯 배경
        ctx.fillStyle = 'rgba(52, 73, 94, 0.8)';
        ctx.fillRect(x, y, 230, 40);
        ctx.strokeStyle = item ? RARITY_COLORS[item.rarity] : '#7F8C8D';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, 230, 40);

        // 라벨
        ctx.fillStyle = '#BDC3C7';
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(label, x + 5, y + 15);

        // 아이템 정보
        if (item) {
            ctx.fillStyle = RARITY_COLORS[item.rarity];
            ctx.font = 'bold 14px Arial';
            ctx.fillText(item.name, x + 5, y + 32);
        } else {
            ctx.fillStyle = '#7F8C8D';
            ctx.font = 'italic 12px Arial';
            ctx.fillText('- 비어있음 -', x + 5, y + 32);
        }
    }

    /**
     * 인벤토리 슬롯 렌더링
     */
    private renderInventorySlot(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, slot?: InventorySlot): void {
        if (slot) {
            // 아이템이 있는 슬롯
            ctx.fillStyle = 'rgba(52, 73, 94, 0.9)';
            ctx.fillRect(x, y, size, size);

            // 희귀도 테두리
            ctx.strokeStyle = RARITY_COLORS[slot.item.rarity];
            ctx.lineWidth = 3;
            ctx.strokeRect(x, y, size, size);

            // 아이템 이름 (첫 글자)
            ctx.fillStyle = RARITY_COLORS[slot.item.rarity];
            ctx.font = 'bold 24px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(slot.item.name.charAt(0), x + size / 2, y + size / 2 + 8);

            // 수량 표시
            if (slot.quantity > 1) {
                ctx.fillStyle = '#ECF0F1';
                ctx.font = 'bold 12px Arial';
                ctx.textAlign = 'right';
                ctx.fillText(`x${slot.quantity}`, x + size - 5, y + size - 5);
            }
        } else {
            // 빈 슬롯
            ctx.fillStyle = 'rgba(52, 73, 94, 0.5)';
            ctx.fillRect(x, y, size, size);
            ctx.strokeStyle = '#5D6D7E';
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, size, size);
        }
    }
}