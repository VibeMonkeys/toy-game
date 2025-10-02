/**
 * 🎒 아이템 시스템
 *
 * 아이템 생성, 드롭, 관리를 담당합니다.
 */

import { getDistance } from '../utils/MathUtils';

export enum ItemType {
    WEAPON = 'weapon',
    ARMOR = 'armor',
    CONSUMABLE = 'consumable',
    MATERIAL = 'material'
}

export enum ItemRarity {
    COMMON = 'common',
    UNCOMMON = 'uncommon',
    RARE = 'rare',
    EPIC = 'epic',
    LEGENDARY = 'legendary'
}

export interface ItemStats {
    attack?: number;
    defense?: number;
    health?: number;
    mana?: number;
    speed?: number;
    criticalChance?: number;
    criticalDamage?: number;
}

export interface Item {
    id: string;
    name: string;
    type: ItemType;
    rarity: ItemRarity;
    stats: ItemStats;
    description: string;
    icon?: string;
    stackable: boolean;
    maxStack: number;
}

export interface DroppedItem {
    item: Item;
    x: number;
    y: number;
    lifetime: number; // 시간 경과 (0 ~ 1)
}

export class ItemSystem {
    private droppedItems: DroppedItem[] = [];
    private readonly itemLifetime = 30000; // 30초

    /**
     * 아이템 드롭
     */
    dropItem(item: Item, x: number, y: number): void {
        this.droppedItems.push({
            item,
            x,
            y,
            lifetime: 0
        });
    }

    /**
     * 랜덤 아이템 드롭
     */
    dropRandomItem(x: number, y: number, enemyType: string, floor: number): void {
        // 드롭 확률 (30%)
        if (Math.random() > 0.3) return;

        const item = this.generateRandomItem(enemyType, floor);
        if (item) {
            this.dropItem(item, x, y);
        }
    }

    /**
     * 랜덤 아이템 생성
     */
    private generateRandomItem(enemyType: string, floor: number): Item | null {
        const rand = Math.random();

        // 아이템 타입 결정
        if (rand < 0.4) {
            // 무기 (40%)
            return this.generateWeapon(floor);
        } else if (rand < 0.7) {
            // 방어구 (30%)
            return this.generateArmor(floor);
        } else {
            // 소비템 (30%)
            return this.generateConsumable();
        }
    }

    /**
     * 무기 생성
     */
    private generateWeapon(floor: number): Item {
        const rarity = this.rollRarity(floor);
        const rarityMultiplier = this.getRarityMultiplier(rarity);

        const baseAttack = 5 + floor * 2;
        const attack = Math.floor(baseAttack * rarityMultiplier);

        const weaponNames: Record<ItemRarity, string[]> = {
            common: ['낡은 검', '무딘 도끼', '나무 활'],
            uncommon: ['강철 검', '날카로운 도끼', '단단한 활'],
            rare: ['마법 검', '이중 도끼', '정밀 활'],
            epic: ['영웅의 검', '분노의 도끼', '저격수의 활'],
            legendary: ['전설의 검', '파멸의 도끼', '신궁의 활']
        };

        const names = weaponNames[rarity];
        const name = names[Math.floor(Math.random() * names.length)];

        return {
            id: `weapon_${Date.now()}_${Math.random()}`,
            name,
            type: ItemType.WEAPON,
            rarity,
            stats: {
                attack,
                criticalChance: rarity === ItemRarity.LEGENDARY ? 0.05 : 0
            },
            description: `공격력 +${attack}`,
            stackable: false,
            maxStack: 1
        };
    }

    /**
     * 방어구 생성
     */
    private generateArmor(floor: number): Item {
        const rarity = this.rollRarity(floor);
        const rarityMultiplier = this.getRarityMultiplier(rarity);

        const baseDefense = 3 + floor;
        const defense = Math.floor(baseDefense * rarityMultiplier);
        const health = Math.floor(10 * rarityMultiplier);

        const armorNames: Record<ItemRarity, string[]> = {
            common: ['가죽 갑옷', '천 로브'],
            uncommon: ['강화 가죽', '철제 갑옷'],
            rare: ['마법 갑옷', '용비늘 갑옷'],
            epic: ['영웅의 갑옷', '불멸의 갑옷'],
            legendary: ['전설의 갑옷', '신의 갑옷']
        };

        const names = armorNames[rarity];
        const name = names[Math.floor(Math.random() * names.length)];

        return {
            id: `armor_${Date.now()}_${Math.random()}`,
            name,
            type: ItemType.ARMOR,
            rarity,
            stats: {
                defense,
                health
            },
            description: `방어력 +${defense}, 체력 +${health}`,
            stackable: false,
            maxStack: 1
        };
    }

    /**
     * 소비템 생성
     */
    private generateConsumable(): Item {
        const consumables = [
            {
                name: '체력 포션',
                stats: { health: 50 },
                description: '체력 50 회복'
            },
            {
                name: '마나 포션',
                stats: { mana: 30 },
                description: '마나 30 회복'
            },
            {
                name: '큰 체력 포션',
                stats: { health: 100 },
                description: '체력 100 회복'
            }
        ];

        const consumable = consumables[Math.floor(Math.random() * consumables.length)];

        return {
            id: `consumable_${Date.now()}_${Math.random()}`,
            name: consumable.name,
            type: ItemType.CONSUMABLE,
            rarity: ItemRarity.COMMON,
            stats: consumable.stats,
            description: consumable.description,
            stackable: true,
            maxStack: 99
        };
    }

    /**
     * 희귀도 결정 (층수에 따라 확률 증가)
     */
    private rollRarity(floor: number): ItemRarity {
        const rand = Math.random() * 100;
        const floorBonus = floor * 2; // 층당 +2% 레어 확률

        if (rand < 1 + floorBonus / 5) return ItemRarity.LEGENDARY; // 1-3%
        if (rand < 5 + floorBonus / 2) return ItemRarity.EPIC; // 4-10%
        if (rand < 15 + floorBonus) return ItemRarity.RARE; // 10-25%
        if (rand < 40) return ItemRarity.UNCOMMON; // 25%
        return ItemRarity.COMMON; // 나머지
    }

    /**
     * 희귀도별 스탯 배율
     */
    private getRarityMultiplier(rarity: ItemRarity): number {
        const multipliers: Record<ItemRarity, number> = {
            common: 1,
            uncommon: 1.3,
            rare: 1.7,
            epic: 2.2,
            legendary: 3.0
        };

        return multipliers[rarity];
    }

    /**
     * 희귀도별 색상
     */
    getRarityColor(rarity: ItemRarity): string {
        const colors: Record<ItemRarity, string> = {
            common: '#FFFFFF',
            uncommon: '#1EFF00',
            rare: '#0070DD',
            epic: '#A335EE',
            legendary: '#FF8000'
        };

        return colors[rarity];
    }

    /**
     * 업데이트 (아이템 수명 관리)
     */
    update(deltaTime: number): void {
        for (let i = this.droppedItems.length - 1; i >= 0; i--) {
            const droppedItem = this.droppedItems[i];
            droppedItem.lifetime += deltaTime / (this.itemLifetime / 1000);

            // 수명 다하면 제거
            if (droppedItem.lifetime >= 1) {
                this.droppedItems.splice(i, 1);
            }
        }
    }

    /**
     * 플레이어가 아이템 획득 범위 체크
     */
    checkPickup(playerX: number, playerY: number, pickupRange: number = 50): DroppedItem | null {
        for (let i = 0; i < this.droppedItems.length; i++) {
            const droppedItem = this.droppedItems[i];
            const distance = getDistance(playerX, playerY, droppedItem.x, droppedItem.y);

            if (distance <= pickupRange) {
                // 아이템 제거하고 반환
                this.droppedItems.splice(i, 1);
                return droppedItem;
            }
        }

        return null;
    }

    /**
     * 드롭된 아이템 목록
     */
    getDroppedItems(): DroppedItem[] {
        return this.droppedItems;
    }

    /**
     * 모든 아이템 제거
     */
    clear(): void {
        this.droppedItems = [];
    }
}