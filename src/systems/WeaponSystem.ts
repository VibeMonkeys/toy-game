/**
 * ⚔️ 무기 시스템
 *
 * 5가지 무기 타입 관리 및 공격 로직
 */

import { WeaponData, WeaponType } from '../types';

export class WeaponSystem {
    private weapons: Map<WeaponType, WeaponData> = new Map();
    private currentWeapon: WeaponType = 'sword'; // 기본 무기

    constructor() {
        this.initializeWeapons();
    }

    /**
     * 무기 데이터 초기화
     */
    private initializeWeapons(): void {
        const weaponList: WeaponData[] = [
            // 검 (밸런스형) - 기본 무기
            {
                id: 'sword',
                name: '검',
                description: '모든 상황에서 안정적인 밸런스형 무기',
                category: 'melee',
                baseDamage: 15,
                attackSpeed: 1.2, // 1.2초당 1회
                range: 80, // 32 → 80 (2.5배 증가)
                criticalChance: 0.08,
                comboBonus: 0.5, // 3연속 공격 시 마지막 공격 +50%
                knockback: 10,
                chargedAttack: {
                    chargeTime: 1.5,
                    damageMultiplier: 2.0,
                    specialEffect: 'penetration', // 관통
                    effectValue: 1 // 관통 대상 수
                },
                unlocked: true // 기본 무기
            },

            // 단검 (속도형)
            {
                id: 'dagger',
                name: '단검',
                description: '빠른 공격과 높은 치명타의 속도형 무기',
                category: 'melee',
                baseDamage: 10,
                attackSpeed: 2.0, // 2.0초당 1회 (빠름)
                range: 60, // 20 → 60 (3배 증가)
                criticalChance: 0.15,
                backstabBonus: 0.20, // 뒤에서 공격 시 크리티컬 +20%
                knockback: 5,
                chargedAttack: {
                    chargeTime: 1.0,
                    damageMultiplier: 1.5,
                    specialEffect: 'triple_strike', // 3연속 공격
                    effectValue: 3
                },
                unlocked: false,
                unlockCost: 100 // 소울 100
            },

            // 지팡이 (마법형)
            {
                id: 'staff',
                name: '지팡이',
                description: '안전한 거리에서 마법 투사체를 발사',
                category: 'magic',
                baseDamage: 12,
                attackSpeed: 1.0, // 1.0초당 1회 (느림)
                range: 150,
                criticalChance: 0.06,
                penetration: true, // 관통 효과
                chargedAttack: {
                    chargeTime: 2.0,
                    damageMultiplier: 2.5,
                    specialEffect: 'explosion', // 폭발 범위 공격
                    effectValue: 50 // 폭발 반경
                },
                unlocked: false,
                unlockCost: 150
            },

            // 활 (원거리형)
            {
                id: 'bow',
                name: '활',
                description: '최장 사거리로 안전하게 공격',
                category: 'ranged',
                baseDamage: 14,
                attackSpeed: 1.5, // 1.5초당 1회
                range: 200, // 최장 사거리
                criticalChance: 0.10,
                penetration: true,
                chargedAttack: {
                    chargeTime: 2.0,
                    damageMultiplier: 2.0,
                    specialEffect: 'multi_shot', // 3발 동시 발사
                    effectValue: 3
                },
                unlocked: false,
                unlockCost: 150
            },

            // 망치 (파워형)
            {
                id: 'hammer',
                name: '망치',
                description: '강력한 파워와 광역 공격',
                category: 'melee',
                baseDamage: 25,
                attackSpeed: 0.8, // 0.8초당 1회 (느림)
                range: 70, // 28 → 70 (2.5배 증가)
                criticalChance: 0.05,
                knockback: 30, // 강력한 넉백
                aoeRadius: 40, // 광역 범위
                chargedAttack: {
                    chargeTime: 2.5,
                    damageMultiplier: 3.0,
                    specialEffect: 'earthquake', // 지진 파동
                    effectValue: 80 // 범위
                },
                unlocked: false,
                unlockCost: 200
            }
        ];

        weaponList.forEach(weapon => {
            this.weapons.set(weapon.id, weapon);
        });
    }

    /**
     * 무기 해금
     */
    unlockWeapon(weaponType: WeaponType, soulPoints: number): { success: boolean; newSoulPoints: number; message: string } {
        const weapon = this.weapons.get(weaponType);
        if (!weapon) {
            return { success: false, newSoulPoints: soulPoints, message: '무기를 찾을 수 없습니다' };
        }

        if (weapon.unlocked) {
            return { success: false, newSoulPoints: soulPoints, message: '이미 해금된 무기입니다' };
        }

        const cost = weapon.unlockCost || 0;
        if (soulPoints < cost) {
            return { success: false, newSoulPoints: soulPoints, message: '소울 포인트가 부족합니다' };
        }

        weapon.unlocked = true;
        return {
            success: true,
            newSoulPoints: soulPoints - cost,
            message: `${weapon.name} 해금!`
        };
    }

    /**
     * 무기 장착
     */
    equipWeapon(weaponType: WeaponType): boolean {
        const weapon = this.weapons.get(weaponType);
        if (!weapon || !weapon.unlocked) {
            return false;
        }

        this.currentWeapon = weaponType;
        console.log(`⚔️ ${weapon.name} 장착!`);
        return true;
    }

    /**
     * 현재 무기 가져오기
     */
    getCurrentWeapon(): WeaponData | undefined {
        return this.weapons.get(this.currentWeapon);
    }

    /**
     * 모든 무기 가져오기
     */
    getAllWeapons(): WeaponData[] {
        return Array.from(this.weapons.values());
    }

    /**
     * 해금된 무기만 가져오기
     */
    getUnlockedWeapons(): WeaponData[] {
        return Array.from(this.weapons.values()).filter(w => w.unlocked);
    }

    /**
     * 무기 가져오기
     */
    getWeapon(weaponType: WeaponType): WeaponData | undefined {
        return this.weapons.get(weaponType);
    }

    /**
     * 공격 데미지 계산
     */
    calculateDamage(baseAttack: number, isCharged: boolean = false, comboCount: number = 0): number {
        const weapon = this.getCurrentWeapon();
        if (!weapon) return baseAttack;

        let damage = baseAttack + weapon.baseDamage;

        // 차지 공격
        if (isCharged) {
            damage *= weapon.chargedAttack.damageMultiplier;
        }

        // 콤보 보너스 (검)
        if (weapon.comboBonus && comboCount >= 3) {
            damage *= (1 + weapon.comboBonus);
        }

        return Math.floor(damage);
    }

    /**
     * 크리티컬 확률 계산
     */
    getCriticalChance(baseCritChance: number, isBackstab: boolean = false): number {
        const weapon = this.getCurrentWeapon();
        if (!weapon) return baseCritChance;

        let critChance = baseCritChance + weapon.criticalChance;

        // 백스탭 보너스 (단검)
        if (weapon.backstabBonus && isBackstab) {
            critChance += weapon.backstabBonus;
        }

        return Math.min(1.0, critChance); // 최대 100%
    }

    /**
     * 공격 범위
     */
    getAttackRange(): number {
        const weapon = this.getCurrentWeapon();
        return weapon?.range || 32;
    }

    /**
     * 공격 속도 (쿨다운)
     */
    getAttackCooldown(): number {
        const weapon = this.getCurrentWeapon();
        if (!weapon) return 1000;

        return Math.floor(1000 / weapon.attackSpeed); // ms로 변환
    }

    /**
     * 관통 여부
     */
    hasPenetration(): boolean {
        const weapon = this.getCurrentWeapon();
        return weapon?.penetration || false;
    }

    /**
     * 넉백 거리
     */
    getKnockback(): number {
        const weapon = this.getCurrentWeapon();
        return weapon?.knockback || 0;
    }

    /**
     * 광역 범위 (망치)
     */
    getAoERadius(): number {
        const weapon = this.getCurrentWeapon();
        return weapon?.aoeRadius || 0;
    }

    /**
     * 차지 시간
     */
    getChargeTime(): number {
        const weapon = this.getCurrentWeapon();
        return weapon?.chargedAttack.chargeTime || 2;
    }

    /**
     * 저장 데이터
     */
    getSaveData(): { currentWeapon: WeaponType; unlockedWeapons: WeaponType[] } {
        return {
            currentWeapon: this.currentWeapon,
            unlockedWeapons: this.getUnlockedWeapons().map(w => w.id)
        };
    }

    /**
     * 데이터 로드
     */
    loadSaveData(data: { currentWeapon: WeaponType; unlockedWeapons: WeaponType[] }): void {
        this.currentWeapon = data.currentWeapon;

        data.unlockedWeapons.forEach(weaponType => {
            const weapon = this.weapons.get(weaponType);
            if (weapon) {
                weapon.unlocked = true;
            }
        });
    }

    /**
     * 리셋 (테스트용)
     */
    reset(): void {
        this.weapons.forEach(weapon => {
            weapon.unlocked = weapon.id === 'sword'; // 검만 기본 해금
        });
        this.currentWeapon = 'sword';
    }
}
