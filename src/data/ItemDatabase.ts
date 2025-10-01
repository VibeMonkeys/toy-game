/**
 * 📦 아이템 데이터베이스
 *
 * 게임의 모든 아이템 정의
 */

import { Item, ItemRarity } from '../types';

export const ITEM_DATABASE: Record<string, Item> = {
    // ============================================
    // 소모품 (Consumables)
    // ============================================
    health_potion_small: {
        id: 'health_potion_small',
        name: '작은 체력 물약',
        type: 'consumable',
        rarity: ItemRarity.COMMON,
        description: '체력을 30 회복합니다.',
        stackable: true,
        maxStack: 10,
        effects: [
            { type: 'heal', value: 30 }
        ],
        sellPrice: 10,
        buyPrice: 20
    },

    health_potion_medium: {
        id: 'health_potion_medium',
        name: '체력 물약',
        type: 'consumable',
        rarity: ItemRarity.UNCOMMON,
        description: '체력을 70 회복합니다.',
        stackable: true,
        maxStack: 10,
        effects: [
            { type: 'heal', value: 70 }
        ],
        sellPrice: 25,
        buyPrice: 50
    },

    health_potion_large: {
        id: 'health_potion_large',
        name: '큰 체력 물약',
        type: 'consumable',
        rarity: ItemRarity.RARE,
        description: '체력을 150 회복합니다.',
        stackable: true,
        maxStack: 5,
        effects: [
            { type: 'heal', value: 150 }
        ],
        sellPrice: 60,
        buyPrice: 120
    },

    mana_potion: {
        id: 'mana_potion',
        name: '마나 물약',
        type: 'consumable',
        rarity: ItemRarity.UNCOMMON,
        description: '마나를 50 회복합니다.',
        stackable: true,
        maxStack: 10,
        effects: [
            { type: 'mana', value: 50 }
        ],
        sellPrice: 20,
        buyPrice: 40
    },

    strength_elixir: {
        id: 'strength_elixir',
        name: '힘의 영약',
        type: 'consumable',
        rarity: ItemRarity.RARE,
        description: '30초간 공격력이 50% 증가합니다.',
        stackable: true,
        maxStack: 3,
        effects: [
            { type: 'buff', stat: 'attack', value: 0.5, duration: 30 }
        ],
        sellPrice: 80,
        buyPrice: 160
    },

    defense_elixir: {
        id: 'defense_elixir',
        name: '수비의 영약',
        type: 'consumable',
        rarity: ItemRarity.RARE,
        description: '30초간 방어력이 50% 증가합니다.',
        stackable: true,
        maxStack: 3,
        effects: [
            { type: 'buff', stat: 'defense', value: 0.5, duration: 30 }
        ],
        sellPrice: 80,
        buyPrice: 160
    },

    speed_elixir: {
        id: 'speed_elixir',
        name: '신속의 영약',
        type: 'consumable',
        rarity: ItemRarity.RARE,
        description: '30초간 이동속도가 40% 증가합니다.',
        stackable: true,
        maxStack: 3,
        effects: [
            { type: 'buff', stat: 'speed', value: 0.4, duration: 30 }
        ],
        sellPrice: 70,
        buyPrice: 140
    },

    // ============================================
    // 방어구 - 헬멧 (Helmets)
    // ============================================
    leather_helmet: {
        id: 'leather_helmet',
        name: '가죽 모자',
        type: 'armor',
        rarity: ItemRarity.COMMON,
        description: '기본적인 방어력을 제공합니다.',
        slot: 'helmet',
        stats: {
            defense: 3,
            health: 10
        },
        sellPrice: 30,
        buyPrice: 60
    },

    iron_helmet: {
        id: 'iron_helmet',
        name: '철 투구',
        type: 'armor',
        rarity: ItemRarity.UNCOMMON,
        description: '단단한 철로 만든 투구입니다.',
        slot: 'helmet',
        stats: {
            defense: 6,
            health: 20
        },
        sellPrice: 70,
        buyPrice: 140
    },

    knight_helmet: {
        id: 'knight_helmet',
        name: '기사 투구',
        type: 'armor',
        rarity: ItemRarity.RARE,
        description: '기사들이 착용하는 정교한 투구입니다.',
        slot: 'helmet',
        stats: {
            defense: 10,
            health: 35
        },
        sellPrice: 150,
        buyPrice: 300
    },

    // ============================================
    // 방어구 - 갑옷 (Chest)
    // ============================================
    leather_armor: {
        id: 'leather_armor',
        name: '가죽 갑옷',
        type: 'armor',
        rarity: ItemRarity.COMMON,
        description: '가벼운 가죽 갑옷입니다.',
        slot: 'chest',
        stats: {
            defense: 5,
            health: 15
        },
        sellPrice: 50,
        buyPrice: 100
    },

    iron_armor: {
        id: 'iron_armor',
        name: '철 갑옷',
        type: 'armor',
        rarity: ItemRarity.UNCOMMON,
        description: '튼튼한 철 갑옷입니다.',
        slot: 'chest',
        stats: {
            defense: 10,
            health: 30
        },
        sellPrice: 120,
        buyPrice: 240
    },

    knight_armor: {
        id: 'knight_armor',
        name: '기사 갑옷',
        type: 'armor',
        rarity: ItemRarity.RARE,
        description: '기사들이 착용하는 고급 갑옷입니다.',
        slot: 'chest',
        stats: {
            defense: 18,
            health: 50
        },
        sellPrice: 250,
        buyPrice: 500
    },

    dragon_armor: {
        id: 'dragon_armor',
        name: '드래곤 갑옷',
        type: 'armor',
        rarity: ItemRarity.EPIC,
        description: '드래곤의 비늘로 만든 전설적인 갑옷입니다.',
        slot: 'chest',
        stats: {
            defense: 30,
            health: 80,
            critChance: 0.05
        },
        sellPrice: 600,
        buyPrice: 1200
    },

    // ============================================
    // 방어구 - 신발 (Boots)
    // ============================================
    leather_boots: {
        id: 'leather_boots',
        name: '가죽 신발',
        type: 'armor',
        rarity: ItemRarity.COMMON,
        description: '편안한 가죽 신발입니다.',
        slot: 'boots',
        stats: {
            defense: 2,
            speed: 20
        },
        sellPrice: 25,
        buyPrice: 50
    },

    swift_boots: {
        id: 'swift_boots',
        name: '신속의 장화',
        type: 'armor',
        rarity: ItemRarity.UNCOMMON,
        description: '이동속도가 증가합니다.',
        slot: 'boots',
        stats: {
            defense: 4,
            speed: 50
        },
        sellPrice: 80,
        buyPrice: 160
    },

    winged_boots: {
        id: 'winged_boots',
        name: '날개 달린 신발',
        type: 'armor',
        rarity: ItemRarity.RARE,
        description: '마치 날아다니는 듯한 속도를 제공합니다.',
        slot: 'boots',
        stats: {
            defense: 6,
            speed: 100
        },
        sellPrice: 200,
        buyPrice: 400
    },

    // ============================================
    // 액세서리 (Accessories)
    // ============================================
    bronze_ring: {
        id: 'bronze_ring',
        name: '청동 반지',
        type: 'armor',
        rarity: ItemRarity.COMMON,
        description: '약간의 공격력을 부여합니다.',
        slot: 'accessory',
        stats: {
            attack: 3
        },
        sellPrice: 40,
        buyPrice: 80
    },

    power_ring: {
        id: 'power_ring',
        name: '힘의 반지',
        type: 'armor',
        rarity: ItemRarity.UNCOMMON,
        description: '공격력이 증가합니다.',
        slot: 'accessory',
        stats: {
            attack: 7,
            critChance: 0.03
        },
        sellPrice: 100,
        buyPrice: 200
    },

    critical_amulet: {
        id: 'critical_amulet',
        name: '치명타 부적',
        type: 'armor',
        rarity: ItemRarity.RARE,
        description: '치명타 확률과 피해가 증가합니다.',
        slot: 'accessory',
        stats: {
            attack: 5,
            critChance: 0.08,
            critDamage: 0.3
        },
        sellPrice: 250,
        buyPrice: 500
    },

    vampire_amulet: {
        id: 'vampire_amulet',
        name: '흡혈 부적',
        type: 'armor',
        rarity: ItemRarity.EPIC,
        description: '공격력과 체력이 대폭 증가합니다.',
        slot: 'accessory',
        stats: {
            attack: 12,
            health: 40,
            critChance: 0.05
        },
        sellPrice: 500,
        buyPrice: 1000
    },

    // ============================================
    // 재료 (Materials)
    // ============================================
    iron_ore: {
        id: 'iron_ore',
        name: '철광석',
        type: 'material',
        rarity: ItemRarity.COMMON,
        description: '무기와 방어구 제작에 사용됩니다.',
        stackable: true,
        maxStack: 99,
        sellPrice: 5,
        buyPrice: 10
    },

    leather_scrap: {
        id: 'leather_scrap',
        name: '가죽 조각',
        type: 'material',
        rarity: ItemRarity.COMMON,
        description: '가죽 장비 제작에 사용됩니다.',
        stackable: true,
        maxStack: 99,
        sellPrice: 3,
        buyPrice: 6
    },

    magic_crystal: {
        id: 'magic_crystal',
        name: '마법 수정',
        type: 'material',
        rarity: ItemRarity.RARE,
        description: '강력한 장비 강화에 사용됩니다.',
        stackable: true,
        maxStack: 50,
        sellPrice: 50,
        buyPrice: 100
    },

    dragon_scale: {
        id: 'dragon_scale',
        name: '드래곤 비늘',
        type: 'material',
        rarity: ItemRarity.EPIC,
        description: '전설적인 장비 제작에 필요합니다.',
        stackable: true,
        maxStack: 20,
        sellPrice: 200,
        buyPrice: 400
    }
};

/**
 * 아이템 ID로 아이템 가져오기
 */
export function getItemById(id: string): Item | undefined {
    return ITEM_DATABASE[id];
}

/**
 * 희귀도별 아이템 필터링
 */
export function getItemsByRarity(rarity: ItemRarity): Item[] {
    return Object.values(ITEM_DATABASE).filter(item => item.rarity === rarity);
}

/**
 * 타입별 아이템 필터링
 */
export function getItemsByType(type: string): Item[] {
    return Object.values(ITEM_DATABASE).filter(item => item.type === type);
}
