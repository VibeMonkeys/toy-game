/**
 * ⬆️ 업그레이드 시스템
 *
 * 소울 포인트를 사용한 영구 업그레이드 시스템
 */

import { PlayerStats } from '../types';

export interface Upgrade {
    id: string;
    name: string;
    description: string;
    category: 'offense' | 'defense' | 'utility';
    currentLevel: number;
    maxLevel: number;
    baseCost: number;
    costMultiplier: number;
    effect: UpgradeEffect;
}

export interface UpgradeEffect {
    stat: keyof PlayerStats | 'potion_capacity' | 'luck';
    baseValue: number;
    perLevel: number;
}

export class UpgradeSystem {
    private upgrades: Map<string, Upgrade> = new Map();
    private totalSpent: number = 0;

    constructor() {
        this.initializeUpgrades();
    }

    /**
     * 업그레이드 초기화
     */
    private initializeUpgrades(): void {
        const upgradeList: Upgrade[] = [
            // 공격 업그레이드
            {
                id: 'attack_power',
                name: '공격력 강화',
                description: '기본 공격력을 증가시킵니다',
                category: 'offense',
                currentLevel: 0,
                maxLevel: 10,
                baseCost: 10,
                costMultiplier: 1.5,
                effect: { stat: 'attack', baseValue: 25, perLevel: 5 }
            },
            {
                id: 'critical_chance',
                name: '치명타 확률',
                description: '치명타 확률을 증가시킵니다',
                category: 'offense',
                currentLevel: 0,
                maxLevel: 5,
                baseCost: 15,
                costMultiplier: 2.0,
                effect: { stat: 'criticalChance', baseValue: 0.15, perLevel: 0.05 }
            },
            {
                id: 'critical_damage',
                name: '치명타 피해',
                description: '치명타 피해량을 증가시킵니다',
                category: 'offense',
                currentLevel: 0,
                maxLevel: 5,
                baseCost: 20,
                costMultiplier: 2.0,
                effect: { stat: 'criticalDamage', baseValue: 1.5, perLevel: 0.2 }
            },

            // 방어 업그레이드
            {
                id: 'max_health',
                name: '최대 체력',
                description: '최대 체력을 증가시킵니다',
                category: 'defense',
                currentLevel: 0,
                maxLevel: 10,
                baseCost: 8,
                costMultiplier: 1.4,
                effect: { stat: 'maxHealth', baseValue: 100, perLevel: 20 }
            },
            {
                id: 'defense_power',
                name: '방어력 강화',
                description: '방어력을 증가시킵니다',
                category: 'defense',
                currentLevel: 0,
                maxLevel: 10,
                baseCost: 10,
                costMultiplier: 1.5,
                effect: { stat: 'defense', baseValue: 5, perLevel: 3 }
            },
            {
                id: 'max_stamina',
                name: '최대 스태미나',
                description: '최대 스태미나를 증가시킵니다',
                category: 'defense',
                currentLevel: 0,
                maxLevel: 5,
                baseCost: 12,
                costMultiplier: 1.6,
                effect: { stat: 'maxStamina', baseValue: 100, perLevel: 20 }
            },

            // 유틸리티 업그레이드
            {
                id: 'move_speed',
                name: '이동 속도',
                description: '이동 속도를 증가시킵니다',
                category: 'utility',
                currentLevel: 0,
                maxLevel: 5,
                baseCost: 15,
                costMultiplier: 1.8,
                effect: { stat: 'speed', baseValue: 250, perLevel: 20 }
            },
            {
                id: 'max_mana',
                name: '최대 마나',
                description: '최대 마나를 증가시킵니다',
                category: 'utility',
                currentLevel: 0,
                maxLevel: 8,
                baseCost: 10,
                costMultiplier: 1.5,
                effect: { stat: 'maxMana', baseValue: 50, perLevel: 10 }
            },
            {
                id: 'luck',
                name: '행운',
                description: '아이템 드롭률과 골드 획득량을 증가시킵니다',
                category: 'utility',
                currentLevel: 0,
                maxLevel: 5,
                baseCost: 25,
                costMultiplier: 2.0,
                effect: { stat: 'luck', baseValue: 0, perLevel: 5 }
            }
        ];

        upgradeList.forEach(upgrade => {
            this.upgrades.set(upgrade.id, upgrade);
        });
    }

    /**
     * 업그레이드 비용 계산
     */
    getUpgradeCost(upgradeId: string): number {
        const upgrade = this.upgrades.get(upgradeId);
        if (!upgrade) return 0;

        return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.currentLevel));
    }

    /**
     * 업그레이드 가능 여부 확인
     */
    canUpgrade(upgradeId: string, soulPoints: number): boolean {
        const upgrade = this.upgrades.get(upgradeId);
        if (!upgrade) return false;

        if (upgrade.currentLevel >= upgrade.maxLevel) return false;

        const cost = this.getUpgradeCost(upgradeId);
        return soulPoints >= cost;
    }

    /**
     * 업그레이드 구매
     */
    purchaseUpgrade(upgradeId: string, soulPoints: number): { success: boolean; newSoulPoints: number; message: string } {
        const upgrade = this.upgrades.get(upgradeId);
        if (!upgrade) {
            return { success: false, newSoulPoints: soulPoints, message: '업그레이드를 찾을 수 없습니다' };
        }

        if (upgrade.currentLevel >= upgrade.maxLevel) {
            return { success: false, newSoulPoints: soulPoints, message: '이미 최대 레벨입니다' };
        }

        const cost = this.getUpgradeCost(upgradeId);
        if (soulPoints < cost) {
            return { success: false, newSoulPoints: soulPoints, message: '소울 포인트가 부족합니다' };
        }

        // 업그레이드 적용
        upgrade.currentLevel++;
        this.totalSpent += cost;

        return {
            success: true,
            newSoulPoints: soulPoints - cost,
            message: `${upgrade.name} 레벨 ${upgrade.currentLevel}로 업그레이드!`
        };
    }

    /**
     * 모든 업그레이드 가져오기
     */
    getAllUpgrades(): Upgrade[] {
        return Array.from(this.upgrades.values());
    }

    /**
     * 카테고리별 업그레이드 가져오기
     */
    getUpgradesByCategory(category: 'offense' | 'defense' | 'utility'): Upgrade[] {
        return Array.from(this.upgrades.values()).filter(u => u.category === category);
    }

    /**
     * 특정 업그레이드 가져오기
     */
    getUpgrade(upgradeId: string): Upgrade | undefined {
        return this.upgrades.get(upgradeId);
    }

    /**
     * 플레이어 스탯에 업그레이드 적용
     */
    applyUpgradesToStats(baseStats: PlayerStats): PlayerStats {
        const upgradedStats = { ...baseStats };

        this.upgrades.forEach(upgrade => {
            if (upgrade.currentLevel > 0) {
                const stat = upgrade.effect.stat;
                const bonusValue = upgrade.effect.perLevel * upgrade.currentLevel;

                // 스탯 타입에 따라 적용
                if (stat === 'luck') {
                    // luck은 가산 방식
                    upgradedStats.luck += bonusValue;
                } else if (stat === 'potion_capacity') {
                    // 특수 스탯 (필요시 구현)
                } else if (stat in upgradedStats) {
                    // 나머지 스탯은 기본값에 보너스 추가 (타입 가드)
                    const key = stat as keyof PlayerStats;
                    if (typeof upgradedStats[key] === 'number') {
                        (upgradedStats[key] as number) += bonusValue;
                    }

                    // maxHealth가 증가하면 health도 같이 증가
                    if (stat === 'maxHealth') {
                        upgradedStats.health += bonusValue;
                    }
                    // maxMana가 증가하면 mana도 같이 증가
                    if (stat === 'maxMana') {
                        upgradedStats.mana += bonusValue;
                    }
                    // maxStamina가 증가하면 stamina도 같이 증가
                    if (stat === 'maxStamina') {
                        upgradedStats.stamina += bonusValue;
                    }
                }
            }
        });

        return upgradedStats;
    }

    /**
     * 업그레이드 데이터 저장용 객체
     */
    getSaveData(): { levels: Record<string, number>; totalSpent: number } {
        const levels: Record<string, number> = {};
        this.upgrades.forEach((upgrade, id) => {
            levels[id] = upgrade.currentLevel;
        });
        return { levels, totalSpent: this.totalSpent };
    }

    /**
     * 업그레이드 데이터 로드
     */
    loadSaveData(data: { levels: Record<string, number>; totalSpent: number }): void {
        Object.entries(data.levels).forEach(([id, level]) => {
            const upgrade = this.upgrades.get(id);
            if (upgrade) {
                upgrade.currentLevel = level;
            }
        });
        this.totalSpent = data.totalSpent;
    }

    /**
     * 총 소비한 소울 포인트
     */
    getTotalSpent(): number {
        return this.totalSpent;
    }

    /**
     * 업그레이드 리셋 (테스트용)
     */
    reset(): void {
        this.upgrades.forEach(upgrade => {
            upgrade.currentLevel = 0;
        });
        this.totalSpent = 0;
    }
}
