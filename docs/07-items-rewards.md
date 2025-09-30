# 📦 07. 아이템 & 보상 시스템

## 📋 문서 정보
- **문서 버전**: v1.0
- **작성일**: 2025-09-28
- **담당 영역**: 아이템 체계 및 보상 경제 설계

---

## 🏆 아이템 등급 체계

### 희귀도 시스템

#### 6단계 등급 분류
```javascript
const ItemRarity = {
    COMMON: {
        name: '일반',
        color: '#9e9e9e',
        dropChance: 0.6,    // 60%
        statMultiplier: 1.0,
        sellPrice: 1.0
    },
    UNCOMMON: {
        name: '비일반',
        color: '#4caf50',
        dropChance: 0.25,   // 25%
        statMultiplier: 1.3,
        sellPrice: 2.5
    },
    RARE: {
        name: '레어',
        color: '#2196f3',
        dropChance: 0.1,    // 10%
        statMultiplier: 1.6,
        sellPrice: 5.0
    },
    EPIC: {
        name: '에픽',
        color: '#9c27b0',
        dropChance: 0.04,   // 4%
        statMultiplier: 2.0,
        sellPrice: 12.0
    },
    LEGENDARY: {
        name: '전설',
        color: '#ff9800',
        dropChance: 0.009,  // 0.9%
        statMultiplier: 2.5,
        sellPrice: 25.0
    },
    MYTHIC: {
        name: '신화',
        color: '#f44336',
        dropChance: 0.001,  // 0.1%
        statMultiplier: 3.0,
        sellPrice: 50.0
    }
};
```

#### 등급별 시각적 효과
- **일반**: 기본 반짝임
- **비일반**: 초록 빛 오라
- **레어**: 파란 에너지 파동
- **에픽**: 보라색 번개 효과
- **전설**: 황금 불꽃 + 화면 진동
- **신화**: 무지개 폭발 + 시간 정지

### 아이템 접두사/접미사 시스템

#### 접두사 (Prefix) - 공격 관련
```javascript
const ItemPrefixes = {
    // 공격력 증가
    SHARP: {
        name: '날카로운',
        effect: { attackPower: '+15%' },
        rarity: ['UNCOMMON', 'RARE']
    },
    FLAMING: {
        name: '작열하는',
        effect: {
            attackPower: '+20%',
            fireChance: '+25%'
        },
        rarity: ['RARE', 'EPIC']
    },
    VAMPIRIC: {
        name: '흡혈하는',
        effect: {
            attackPower: '+10%',
            lifeSteal: '+15%'
        },
        rarity: ['EPIC', 'LEGENDARY']
    },
    DIVINE: {
        name: '신성한',
        effect: {
            attackPower: '+30%',
            critChance: '+20%',
            holyDamage: '+50%'
        },
        rarity: ['LEGENDARY', 'MYTHIC']
    }
};
```

#### 접미사 (Suffix) - 방어 관련
```javascript
const ItemSuffixes = {
    // 방어력 증가
    OF_PROTECTION: {
        name: '보호의',
        effect: { defense: '+12%' },
        rarity: ['UNCOMMON', 'RARE']
    },
    OF_WARDING: {
        name: '수호의',
        effect: {
            defense: '+18%',
            magicResist: '+20%'
        },
        rarity: ['RARE', 'EPIC']
    },
    OF_TITANS: {
        name: '거인의',
        effect: {
            defense: '+25%',
            health: '+30%',
            knockbackResist: '+50%'
        },
        rarity: ['EPIC', 'LEGENDARY']
    },
    OF_ETERNITY: {
        name: '영원의',
        effect: {
            defense: '+40%',
            health: '+50%',
            regenRate: '+100%',
            deathProtection: true
        },
        rarity: ['MYTHIC']
    }
};
```

---

## ⚔️ 무기 시스템

### 무기 카테고리

#### 근접 무기
```javascript
const MeleeWeapons = {
    SWORD: {
        name: '검',
        baseAttack: 25,
        attackSpeed: 1.0,
        range: 1.2,
        critChance: 0.15,
        skills: ['돌진 베기', '회전 베기']
    },
    AXE: {
        name: '도끼',
        baseAttack: 35,
        attackSpeed: 0.8,
        range: 1.0,
        critChance: 0.20,
        skills: ['강력한 일격', '분쇄 타격']
    },
    DAGGER: {
        name: '단검',
        baseAttack: 18,
        attackSpeed: 1.5,
        range: 0.8,
        critChance: 0.25,
        skills: ['독 바르기', '은신 공격']
    }
};
```

#### 원거리 무기
```javascript
const RangedWeapons = {
    BOW: {
        name: '활',
        baseAttack: 22,
        attackSpeed: 1.2,
        range: 4.0,
        critChance: 0.18,
        skills: ['관통 화살', '화염 화살']
    },
    STAFF: {
        name: '지팡이',
        baseAttack: 20,
        attackSpeed: 1.1,
        range: 3.5,
        critChance: 0.12,
        manaBonus: 20,
        skills: ['마법 미사일', '얼음 창']
    }
};
```

### 무기 업그레이드 시스템

#### 강화 단계
```javascript
const WeaponUpgrade = {
    maxLevel: 10,

    getUpgradeCost(currentLevel) {
        return Math.floor(100 * Math.pow(1.5, currentLevel));
    },

    getStatBonus(level) {
        return {
            attackPower: level * 0.1,      // 레벨당 10% 증가
            critChance: level * 0.02,      // 레벨당 2% 증가
            durability: level * 0.05       // 레벨당 5% 증가
        };
    },

    // 특별 효과 (특정 레벨에서 해금)
    specialEffects: {
        5: 'weapon_glow',              // +5: 무기 빛남
        7: 'enhanced_particle',        // +7: 강화된 파티클
        10: 'legendary_aura'           // +10: 전설 오라
    }
};
```

---

## 🛡️ 방어구 시스템

### 방어구 종류

#### 갑옷 세트
```javascript
const ArmorSets = {
    LEATHER: {
        name: '가죽 갑옷',
        pieces: ['helmet', 'chest', 'legs', 'boots'],
        baseDefense: 15,
        weight: 'light',
        setBonus: {
            2: { movementSpeed: '+10%' },
            4: { dodgeChance: '+15%' }
        }
    },
    CHAINMAIL: {
        name: '사슬 갑옷',
        pieces: ['helmet', 'chest', 'legs', 'boots'],
        baseDefense: 25,
        weight: 'medium',
        setBonus: {
            2: { defense: '+20%' },
            4: { damageReduction: '+10%' }
        }
    },
    PLATE: {
        name: '판금 갑옷',
        pieces: ['helmet', 'chest', 'legs', 'boots'],
        baseDefense: 40,
        weight: 'heavy',
        setBonus: {
            2: { health: '+30%' },
            4: { thorns: '+25%', slowResist: '+50%' }
        }
    }
};
```

#### 액세서리
```javascript
const Accessories = {
    RING: {
        name: '반지',
        slots: 2,
        effects: [
            { type: 'stat_boost', values: ['str', 'int', 'dex'] },
            { type: 'resistance', values: ['fire', 'ice', 'poison'] },
            { type: 'special', values: ['regen', 'crit', 'speed'] }
        ]
    },
    NECKLACE: {
        name: '목걸이',
        slots: 1,
        effects: [
            { type: 'major_stat', boost: '25-50%' },
            { type: 'skill_boost', enhancement: '1-2_levels' },
            { type: 'unique_ability', custom: true }
        ]
    },
    BELT: {
        name: '벨트',
        slots: 1,
        effects: [
            { type: 'inventory_expansion', slots: '+5-10' },
            { type: 'potion_efficiency', boost: '+25-50%' },
            { type: 'movement_enhancement', various: true }
        ]
    }
};
```

---

## 🧪 소비 아이템 시스템

### 포션 종류

#### 기본 포션
```javascript
const BasicPotions = {
    HEALTH_SMALL: {
        name: '작은 체력 포션',
        effect: { heal: 30 },
        duration: 'instant',
        cooldown: 2000,
        stackSize: 10,
        cost: 15
    },
    HEALTH_LARGE: {
        name: '큰 체력 포션',
        effect: { heal: 80 },
        duration: 'instant',
        cooldown: 3000,
        stackSize: 5,
        cost: 50
    },
    MANA_SMALL: {
        name: '작은 마나 포션',
        effect: { restoreMana: 25 },
        duration: 'instant',
        cooldown: 1500,
        stackSize: 10,
        cost: 20
    },
    MANA_LARGE: {
        name: '큰 마나 포션',
        effect: { restoreMana: 60 },
        duration: 'instant',
        cooldown: 2500,
        stackSize: 5,
        cost: 65
    }
};
```

#### 버프 포션
```javascript
const BuffPotions = {
    STRENGTH: {
        name: '힘의 물약',
        effect: { attackPower: '+30%' },
        duration: 60000,    // 60초
        stackSize: 3,
        cost: 80
    },
    SWIFTNESS: {
        name: '신속의 물약',
        effect: {
            movementSpeed: '+40%',
            attackSpeed: '+25%'
        },
        duration: 45000,    // 45초
        stackSize: 3,
        cost: 70
    },
    RESISTANCE: {
        name: '저항의 물약',
        effect: {
            damageReduction: '+25%',
            statusResist: '+50%'
        },
        duration: 90000,    // 90초
        stackSize: 2,
        cost: 120
    }
};
```

### 특수 아이템

#### 스크롤 & 룬
```javascript
const ScrollsAndRunes = {
    TELEPORT_SCROLL: {
        name: '순간이동 스크롤',
        effect: 'instant_teleport_to_exit',
        uses: 1,
        rarity: 'RARE',
        cost: 200
    },
    IDENTIFY_SCROLL: {
        name: '감정 스크롤',
        effect: 'reveal_item_properties',
        uses: 1,
        rarity: 'UNCOMMON',
        cost: 75
    },
    RUNE_OF_POWER: {
        name: '힘의 룬',
        effect: 'permanent_stat_increase',
        statType: 'strength',
        increase: '+2',
        uses: 1,
        rarity: 'LEGENDARY',
        cost: 1000
    }
};
```

---

## 🎁 드랍 시스템 & 확률

### 기본 드랍 메커니즘

#### 적별 드랍 테이블
```javascript
const DropTables = {
    COMMON_ENEMY: {
        soulPoints: { min: 2, max: 5, chance: 1.0 },
        items: [
            { type: 'HEALTH_SMALL', chance: 0.3 },
            { type: 'MANA_SMALL', chance: 0.2 },
            { type: 'COMMON_WEAPON', chance: 0.1 },
            { type: 'COINS', amount: [5, 15], chance: 0.8 }
        ]
    },

    ELITE_ENEMY: {
        soulPoints: { min: 8, max: 15, chance: 1.0 },
        items: [
            { type: 'HEALTH_LARGE', chance: 0.4 },
            { type: 'UNCOMMON_WEAPON', chance: 0.3 },
            { type: 'RARE_WEAPON', chance: 0.1 },
            { type: 'BUFF_POTION', chance: 0.25 },
            { type: 'COINS', amount: [20, 50], chance: 1.0 }
        ]
    },

    BOSS: {
        soulPoints: { min: 25, max: 40, chance: 1.0 },
        guaranteedRewards: [
            { type: 'RARE_WEAPON', count: 1 },
            { type: 'EPIC_ARMOR', count: 1 }
        ],
        bonusItems: [
            { type: 'LEGENDARY_ITEM', chance: 0.2 },
            { type: 'RUNE', chance: 0.15 },
            { type: 'SPECIAL_SCROLL', chance: 0.3 }
        ]
    }
};
```

#### 럭 팩터 시스템
```javascript
const LuckSystem = {
    baseLuck: 1.0,

    // 연속 실패 보정 (Pity System)
    pitySystem: {
        enabled: true,
        threshold: 10,      // 10번 연속 일반 아이템
        bonusLuck: 0.5      // 50% 럭 보너스
    },

    // 층수별 럭 보너스
    floorBonus: {
        1: 1.0,     // 1층: 기본
        5: 1.2,     // 5층: 20% 증가
        10: 1.5     // 10층: 50% 증가
    },

    // 플레이어 럭 스탯
    playerLuckBonus: {
        base: 0,
        fromItems: 0,
        fromSkills: 0
    },

    calculateFinalLuck() {
        return this.baseLuck *
               this.floorBonus[currentFloor] *
               (1 + this.playerLuckBonus.total);
    }
};
```

---

## 🏪 상점 & 거래 시스템

### 층별 상점

#### 상점 재고 시스템
```javascript
const ShopSystem = {
    // 층별 상점 등급
    shopTiers: {
        1: 'basic',      // 기본 아이템만
        3: 'improved',   // 비일반 아이템 추가
        5: 'advanced',   // 레어 아이템 추가
        7: 'premium',    // 에픽 아이템 추가
        10: 'legendary'  // 전설 아이템 추가
    },

    // 재고 갱신 주기
    restockPolicy: {
        enterShop: true,        // 상점 입장 시 갱신
        itemSold: false,        // 판매 시 갱신 안함
        floorClear: true        // 층 클리어 시 갱신
    },

    // 가격 계산
    priceCalculation: {
        buyMultiplier: 1.0,     // 기본 구매 가격
        sellMultiplier: 0.4,    // 판매 시 40% 가격

        // 층수별 가격 조정
        floorMultiplier: {
            1: 0.8,     // 초반 할인
            5: 1.0,     // 기본 가격
            10: 1.3     // 후반 프리미엄
        }
    }
};
```

#### 특수 상인

##### 신비한 상인 (랜덤 등장)
```javascript
const MysticMerchant = {
    appearChance: 0.15,         // 15% 확률로 등장
    location: 'random_room',

    specialInventory: [
        {
            item: 'CURSED_WEAPON',
            description: '강력하지만 위험한 무기',
            effect: {
                attackPower: '+100%',
                healthDrain: '-1hp_per_second'
            },
            price: 500
        },
        {
            item: 'LUCKY_CHARM',
            description: '운을 영구히 증가',
            effect: { luck: '+0.2' },
            price: 800
        },
        {
            item: 'REROLL_TOKEN',
            description: '다음 층 보상 재선택 기회',
            effect: 'reroll_next_reward',
            price: 300
        }
    ]
};
```

##### 소울 상인 (소울 포인트 거래)
```javascript
const SoulMerchant = {
    location: 'soul_chamber',   // 특별한 방에서만 등장
    currency: 'soul_points',

    permanentUpgrades: [
        {
            name: '기본 체력 증가',
            cost: 50,
            effect: { baseHealth: '+10' },
            maxPurchases: 10
        },
        {
            name: '기본 마나 증가',
            cost: 40,
            effect: { baseMana: '+5' },
            maxPurchases: 8
        },
        {
            name: '시작 아이템',
            cost: 200,
            effect: 'start_with_random_weapon',
            maxPurchases: 1
        }
    ]
};
```

---

## 💰 보상 경제 설계

### 화폐 시스템

#### 다중 화폐 체계
```javascript
const CurrencyTypes = {
    GOLD: {
        name: '골드',
        primary: true,
        sources: ['enemy_drops', 'treasure_chests', 'item_sales'],
        uses: ['shop_purchases', 'upgrades', 'repairs']
    },

    SOUL_POINTS: {
        name: '소울 포인트',
        primary: false,
        sources: ['enemy_kills', 'floor_completion', 'achievements'],
        uses: ['permanent_upgrades', 'soul_merchant', 'meta_progression'],
        persistent: true        // 죽어도 유지
    },

    CRYSTALS: {
        name: '마법 수정',
        primary: false,
        sources: ['boss_kills', 'rare_chests', 'daily_rewards'],
        uses: ['premium_upgrades', 'cosmetics', 'special_items'],
        persistent: true
    }
};
```

#### 경제 밸런스

##### 수입 분석 (층당 예상)
```javascript
const IncomeProjection = {
    perFloor: {
        gold: {
            enemies: 150,       // 일반 적 처치
            chests: 80,         // 보물상자
            boss: 200,          // 보스 보상
            total: 430
        },
        soulPoints: {
            enemies: 12,        // 적 처치 (6마리 × 2pt)
            exploration: 5,     // 탐험 보너스
            boss: 10,           // 보스 보너스
            total: 27
        }
    },

    // 10층 완주 시 총 수입
    fullRun: {
        gold: 4300,         // 골드 총합
        soulPoints: 270,    // 소울 포인트 총합
        crystals: 25        // 보스 5마리 × 5개
    }
};
```

##### 지출 분석
```javascript
const ExpenseProjection = {
    essential: {
        healthPotions: 800,     // 체력 회복 비용
        equipment: 1500,        // 장비 업그레이드
        repairs: 300,           // 장비 수리
        total: 2600
    },

    optional: {
        buffs: 400,             // 버프 포션
        convenience: 200,       // 편의 아이템
        gambling: 300,          // 랜덤 상자
        total: 900
    },

    // 남는 골드: 4300 - 3500 = 800 (여유분)
    surplus: 800
};
```

---

## 🎰 랜덤 보상 시스템

### 보물상자 시스템

#### 상자 종류별 보상
```javascript
const TreasureChests = {
    WOODEN: {
        rarity: 'common',
        contents: {
            gold: { min: 20, max: 50 },
            items: [
                { type: 'COMMON_ITEM', chance: 0.7 },
                { type: 'UNCOMMON_ITEM', chance: 0.25 },
                { type: 'HEALTH_POTION', chance: 0.5 }
            ]
        }
    },

    SILVER: {
        rarity: 'uncommon',
        contents: {
            gold: { min: 60, max: 120 },
            items: [
                { type: 'UNCOMMON_ITEM', chance: 0.6 },
                { type: 'RARE_ITEM', chance: 0.3 },
                { type: 'BUFF_POTION', chance: 0.4 }
            ]
        }
    },

    GOLDEN: {
        rarity: 'rare',
        contents: {
            gold: { min: 150, max: 300 },
            guaranteedRare: true,
            items: [
                { type: 'RARE_ITEM', chance: 0.7 },
                { type: 'EPIC_ITEM', chance: 0.2 },
                { type: 'SPECIAL_SCROLL', chance: 0.3 }
            ]
        }
    },

    MYTHIC: {
        rarity: 'legendary',
        contents: {
            gold: { min: 400, max: 800 },
            soulPoints: { min: 20, max: 40 },
            guaranteedLegendary: true,
            items: [
                { type: 'LEGENDARY_ITEM', chance: 0.8 },
                { type: 'MYTHIC_ITEM', chance: 0.1 },
                { type: 'ARTIFACT', chance: 0.15 }
            ]
        }
    }
};
```

### 선택형 보상 시스템

#### 층 클리어 보상
```javascript
const FloorRewards = {
    // 3개 중 1개 선택
    rewardSelection: {
        count: 3,
        categories: [
            {
                type: 'equipment',
                weight: 0.4,
                generator: 'generateWeaponOrArmor'
            },
            {
                type: 'consumable',
                weight: 0.3,
                generator: 'generatePotionsAndScrolls'
            },
            {
                type: 'permanent',
                weight: 0.2,
                generator: 'generateStatBonus'
            },
            {
                type: 'currency',
                weight: 0.1,
                generator: 'generateGoldAndSouls'
            }
        ]
    },

    // 보상 품질 (층수에 비례)
    qualityScaling: {
        formula: 'baseQuality + (floor * 0.1)',
        minimumRarity: {
            1: 'COMMON',
            3: 'UNCOMMON',
            6: 'RARE',
            9: 'EPIC'
        }
    }
};
```

---

## 🔄 메타 프로그레션

### 영구 업그레이드 시스템

#### 캐릭터 스탯 업그레이드
```javascript
const PermanentUpgrades = {
    HEALTH: {
        name: '체력 증가',
        baseCost: 30,
        costScaling: 1.3,
        effect: '+10 최대 체력',
        maxLevel: 20,
        totalCost: 2847  // 20레벨까지 총 비용
    },

    MANA: {
        name: '마나 증가',
        baseCost: 25,
        costScaling: 1.3,
        effect: '+5 최대 마나',
        maxLevel: 15,
        totalCost: 1384
    },

    ATTACK: {
        name: '공격력 증가',
        baseCost: 40,
        costScaling: 1.4,
        effect: '+5% 공격력',
        maxLevel: 15,
        totalCost: 2983
    },

    CRITICAL: {
        name: '치명타 확률',
        baseCost: 50,
        costScaling: 1.5,
        effect: '+2% 치명타 확률',
        maxLevel: 10,
        totalCost: 2818
    },

    LUCK: {
        name: '행운',
        baseCost: 80,
        costScaling: 1.6,
        effect: '+5% 아이템 발견율',
        maxLevel: 8,
        totalCost: 3534
    }
};
```

#### 스킬 트리 시스템
```javascript
const SkillTree = {
    branches: {
        WARRIOR: {
            name: '전사',
            skills: [
                {
                    id: 'berserker_rage',
                    name: '광전사의 분노',
                    cost: 100,
                    prerequisite: null,
                    effect: '체력이 낮을수록 공격력 증가'
                },
                {
                    id: 'armor_mastery',
                    name: '갑옷 숙련',
                    cost: 150,
                    prerequisite: 'berserker_rage',
                    effect: '무거운 갑옷 착용 시 보너스'
                }
            ]
        },

        MAGE: {
            name: '마법사',
            skills: [
                {
                    id: 'mana_efficiency',
                    name: '마나 효율',
                    cost: 80,
                    prerequisite: null,
                    effect: '모든 스킬 마나 소모 -20%'
                },
                {
                    id: 'elemental_mastery',
                    name: '원소 숙련',
                    cost: 200,
                    prerequisite: 'mana_efficiency',
                    effect: '원소 스킬 데미지 +50%'
                }
            ]
        }
    }
};
```

---

## 📊 아이템 밸런싱

### 파워 레벨 시스템

#### 아이템 파워 계산
```javascript
const ItemPowerCalculation = {
    // 기본 파워 공식
    calculateBasePower(itemLevel, rarity) {
        const basePower = itemLevel * 10;
        const rarityMultiplier = ItemRarity[rarity].statMultiplier;
        return Math.floor(basePower * rarityMultiplier);
    },

    // 스탯 분배
    statDistribution: {
        weapon: {
            attackPower: 0.6,    // 60%
            critChance: 0.2,     // 20%
            special: 0.2         // 20%
        },
        armor: {
            defense: 0.5,        // 50%
            health: 0.3,         // 30%
            resistance: 0.2      // 20%
        }
    },

    // 인플레이션 방지
    powerCap: {
        maxStatIncrease: 0.8,   // 최대 80% 스탯 증가
        diminishingReturns: 0.5, // 50% 지점부터 감소
        levelCap: 100           // 아이템 레벨 상한
    }
};
```

### 밸런싱 검증

#### 시뮬레이션 데이터
```javascript
const BalanceTest = {
    // 플레이어 파워 진행도
    playerPowerProgression: [
        { floor: 1, expectedPower: 100 },
        { floor: 3, expectedPower: 150 },
        { floor: 5, expectedPower: 220 },
        { floor: 7, expectedPower: 320 },
        { floor: 10, expectedPower: 500 }
    ],

    // 적 파워와 비교
    enemyPowerComparison: {
        normalEnemy: 0.8,       // 플레이어 파워의 80%
        eliteEnemy: 1.2,        // 플레이어 파워의 120%
        boss: 2.0               // 플레이어 파워의 200%
    },

    // 전투 시간 목표
    combatDuration: {
        normalEnemy: '3-5초',
        eliteEnemy: '8-12초',
        boss: '30-60초'
    }
};
```

---

**문서 관리 정보:**
- **다음 문서**: [08. 보스 & 적 설계](./08-boss-enemy-design.md)
- **관련 문서**: [03. 게임플레이 시스템](./03-gameplay-systems.md)
- **최종 수정**: 2025-09-28