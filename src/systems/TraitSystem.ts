/**
 * 🌟 특성 시스템
 *
 * 레벨업 시 선택 가능한 강화 특성
 */

import type { PlayerStats } from '../types';

export enum TraitType {
    COMBAT = 'combat',
    DEFENSE = 'defense',
    UTILITY = 'utility',
    SPECIAL = 'special'
}

export interface Trait {
    id: string;
    name: string;
    description: string;
    type: TraitType;
    apply: (stats: PlayerStats) => void;
    icon?: string;
}

export class TraitSystem {
    private availableTraits: Trait[] = [];
    private acquiredTraits: Trait[] = [];

    constructor() {
        this.initializeTraits();
    }

    /**
     * 모든 특성 초기화
     */
    private initializeTraits(): void {
        this.availableTraits = [
            // 전투 특성
            {
                id: 'berserker',
                name: '광전사',
                description: '공격력 +10, 크리티컬 확률 +5%',
                type: TraitType.COMBAT,
                apply: (stats) => {
                    stats.attack += 10;
                    stats.criticalChance += 0.05;
                }
            },
            {
                id: 'assassin',
                name: '암살자',
                description: '크리티컬 데미지 +50%, 속도 +20',
                type: TraitType.COMBAT,
                apply: (stats) => {
                    stats.criticalDamage += 0.5;
                    stats.speed += 20;
                }
            },
            {
                id: 'warrior',
                name: '전사',
                description: '공격력 +15, 방어력 +5',
                type: TraitType.COMBAT,
                apply: (stats) => {
                    stats.attack += 15;
                    stats.defense += 5;
                }
            },
            {
                id: 'swift_striker',
                name: '신속한 타격',
                description: '속도 +30, 공격력 +5',
                type: TraitType.COMBAT,
                apply: (stats) => {
                    stats.speed += 30;
                    stats.attack += 5;
                }
            },

            // 방어 특성
            {
                id: 'tank',
                name: '탱커',
                description: '체력 +50, 방어력 +10',
                type: TraitType.DEFENSE,
                apply: (stats) => {
                    stats.maxHealth += 50;
                    stats.health += 50;
                    stats.defense += 10;
                }
            },
            {
                id: 'iron_skin',
                name: '강철 피부',
                description: '방어력 +15, 체력 +30',
                type: TraitType.DEFENSE,
                apply: (stats) => {
                    stats.defense += 15;
                    stats.maxHealth += 30;
                    stats.health += 30;
                }
            },
            {
                id: 'regeneration',
                name: '재생',
                description: '체력 +80, 스태미나 +30',
                type: TraitType.DEFENSE,
                apply: (stats) => {
                    stats.maxHealth += 80;
                    stats.health += 80;
                    stats.maxStamina += 30;
                    stats.stamina += 30;
                }
            },

            // 유틸리티 특성
            {
                id: 'mage',
                name: '마법사',
                description: '마나 +50, 공격력 +8',
                type: TraitType.UTILITY,
                apply: (stats) => {
                    stats.maxMana += 50;
                    stats.mana += 50;
                    stats.attack += 8;
                }
            },
            {
                id: 'lucky',
                name: '행운아',
                description: '행운 +10, 크리티컬 확률 +10%',
                type: TraitType.UTILITY,
                apply: (stats) => {
                    stats.luck += 10;
                    stats.criticalChance += 0.1;
                }
            },
            {
                id: 'athlete',
                name: '운동선수',
                description: '속도 +40, 스태미나 +40',
                type: TraitType.UTILITY,
                apply: (stats) => {
                    stats.speed += 40;
                    stats.maxStamina += 40;
                    stats.stamina += 40;
                }
            },
            {
                id: 'balanced',
                name: '균형잡힌',
                description: '모든 스탯 +5',
                type: TraitType.UTILITY,
                apply: (stats) => {
                    stats.attack += 5;
                    stats.defense += 5;
                    stats.speed += 10;
                    stats.maxHealth += 20;
                    stats.health += 20;
                    stats.maxMana += 10;
                    stats.mana += 10;
                }
            },

            // 특수 특성
            {
                id: 'vampire',
                name: '흡혈귀',
                description: '공격 시 체력 회복 (데미지의 10%), 체력 +40',
                type: TraitType.SPECIAL,
                apply: (stats) => {
                    stats.maxHealth += 40;
                    stats.health += 40;
                    // 흡혈 효과는 전투 시스템에서 처리
                }
            },
            {
                id: 'glass_cannon',
                name: '유리 대포',
                description: '공격력 +25, 크리티컬 데미지 +30%, 체력 -20',
                type: TraitType.SPECIAL,
                apply: (stats) => {
                    stats.attack += 25;
                    stats.criticalDamage += 0.3;
                    stats.maxHealth -= 20;
                    stats.health = Math.min(stats.health, stats.maxHealth);
                }
            },
            {
                id: 'thorns',
                name: '가시 갑옷',
                description: '방어력 +8, 피격 시 데미지 반사',
                type: TraitType.SPECIAL,
                apply: (stats) => {
                    stats.defense += 8;
                    // 반사 효과는 전투 시스템에서 처리
                }
            }
        ];
    }

    /**
     * 랜덤 특성 선택지 생성 (3개)
     */
    getRandomTraits(count: number = 3): Trait[] {
        // 아직 획득하지 않은 특성만 선택
        const notAcquired = this.availableTraits.filter(
            trait => !this.acquiredTraits.some(acquired => acquired.id === trait.id)
        );

        if (notAcquired.length === 0) {
            return []; // 모든 특성 획득
        }

        // 랜덤 섞기
        const shuffled = [...notAcquired].sort(() => Math.random() - 0.5);

        return shuffled.slice(0, Math.min(count, shuffled.length));
    }

    /**
     * 특성 획득
     */
    acquireTrait(traitId: string, playerStats: PlayerStats): boolean {
        const trait = this.availableTraits.find(t => t.id === traitId);
        if (!trait) return false;

        // 이미 획득했는지 체크
        if (this.acquiredTraits.some(t => t.id === traitId)) {
            return false;
        }

        // 특성 효과 적용
        trait.apply(playerStats);

        // 획득 목록에 추가
        this.acquiredTraits.push(trait);

        console.log(`✨ 특성 획득: ${trait.name}`);
        return true;
    }

    /**
     * 획득한 특성 목록
     */
    getAcquiredTraits(): Trait[] {
        return this.acquiredTraits;
    }

    /**
     * 특정 특성 보유 여부
     */
    hasTrait(traitId: string): boolean {
        return this.acquiredTraits.some(t => t.id === traitId);
    }

    /**
     * 특성 타입별 색상
     */
    getTraitTypeColor(type: TraitType): string {
        const colors: Record<TraitType, string> = {
            combat: '#FF4444',
            defense: '#4444FF',
            utility: '#44FF44',
            special: '#FF44FF'
        };

        return colors[type];
    }

    /**
     * 초기화
     */
    reset(): void {
        this.acquiredTraits = [];
    }
}