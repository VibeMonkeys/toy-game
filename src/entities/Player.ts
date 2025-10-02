/**
 * 🧑 플레이어 엔티티
 *
 * 플레이어 캐릭터를 관리합니다.
 */

import { Position, Vector2D, PlayerStats, WeaponType, Item } from '../types';
import { GAMEPLAY, COLORS } from '../utils/Constants';
import { CombatSystem } from '../systems/CombatSystem';
import { TraitSystem } from '../systems/TraitSystem';
import { WeaponSystem } from '../systems/WeaponSystem';
import { EquipmentSystem } from '../systems/EquipmentSystem';
import { BuffSystem } from '../systems/BuffSystem';
import { Renderer } from '../systems/Renderer';
import { AnimationController, Direction } from '../systems/AnimationController';

export class Player {
    // 위치 & 이동
    x: number;
    y: number;
    private velocity: Vector2D = { x: 0, y: 0 };

    // 크기
    private width: number = 32;
    private height: number = 32;

    // 스탯
    stats: PlayerStats;

    // 레벨 & 경험치
    level: number = 1;
    experience: number = 0;
    experienceToNextLevel: number = 100;

    // 전투
    private combatSystem: CombatSystem;
    private traitSystem: TraitSystem;
    private weaponSystem: WeaponSystem;
    private equipmentSystem: EquipmentSystem;
    private buffSystem: BuffSystem;
    private isAttacking: boolean = false;
    private attackCooldown: number = 500;
    private lastAttackTime: number = 0;
    private comboCount: number = 0;
    private lastComboTime: number = 0;

    // 기본 스탯 (장비/버프 적용 전)
    private baseStats: PlayerStats;

    // 회피
    private isDodging: boolean = false;
    private dodgeDirection: Vector2D = { x: 0, y: 0 };

    // 콜백
    private onTakeDamageCallback: ((damage: number, playerX: number, playerY: number) => void) | null = null;

    // 애니메이션
    private animationTime: number = 0;
    private animationController: AnimationController;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;

        // 기본 스탯 설정
        this.stats = {
            health: GAMEPLAY.PLAYER_BASE.HEALTH,
            maxHealth: GAMEPLAY.PLAYER_BASE.HEALTH,
            mana: GAMEPLAY.PLAYER_BASE.MANA,
            maxMana: GAMEPLAY.PLAYER_BASE.MANA,
            stamina: GAMEPLAY.PLAYER_BASE.STAMINA,
            maxStamina: GAMEPLAY.PLAYER_BASE.STAMINA,
            attack: GAMEPLAY.PLAYER_BASE.ATTACK,
            defense: GAMEPLAY.PLAYER_BASE.DEFENSE,
            speed: GAMEPLAY.PLAYER_BASE.SPEED,
            criticalChance: GAMEPLAY.PLAYER_BASE.CRITICAL_CHANCE,
            criticalDamage: GAMEPLAY.PLAYER_BASE.CRITICAL_DAMAGE,
            luck: GAMEPLAY.PLAYER_BASE.LUCK
        };

        // 기본 스탯 백업 (장비/버프 적용 전)
        this.baseStats = { ...this.stats };

        this.combatSystem = new CombatSystem();
        this.traitSystem = new TraitSystem();
        this.weaponSystem = new WeaponSystem();
        this.equipmentSystem = new EquipmentSystem();
        this.buffSystem = new BuffSystem();
        this.animationController = new AnimationController(150, 4);

        // 무기 시스템에 따라 공격 쿨다운 설정
        this.updateAttackCooldown();
    }

    /**
     * 무기에 따른 공격 쿨다운 업데이트
     */
    private updateAttackCooldown(): void {
        this.attackCooldown = this.weaponSystem.getAttackCooldown();
    }

    /**
     * 업데이트
     */
    update(deltaTime: number): void {
        // 버프 시스템 업데이트 (만료된 버프 제거)
        // TODO: 새 BuffSystem API로 통합 필요
        // this.buffSystem.update(deltaTime);

        // 스탯 재계산 (기본 스탯 + 장비 + 버프)
        this.calculateFinalStats();

        // 스태미나 자동 회복
        if (this.stats.stamina < this.stats.maxStamina) {
            this.stats.stamina = Math.min(
                this.stats.maxStamina,
                this.stats.stamina + GAMEPLAY.STAMINA.REGEN_RATE * deltaTime
            );
        }

        // 애니메이션
        this.animationTime += deltaTime;
        this.animationController.update(deltaTime);
    }

    /**
     * 이동
     */
    move(direction: Vector2D, deltaTime: number, collisionCheck?: (x: number, y: number, w: number, h: number) => boolean): void {
        if (this.isDodging) return;

        // 애니메이션 방향 설정
        this.animationController.setDirectionFromMovement(direction.x, direction.y);

        // 이동 방향이 없으면 리턴
        if (direction.x === 0 && direction.y === 0) return;

        this.velocity.x = direction.x * this.stats.speed;
        this.velocity.y = direction.y * this.stats.speed;

        // 새 위치 계산
        const newX = this.x + this.velocity.x * deltaTime;
        const newY = this.y + this.velocity.y * deltaTime;

        // 충돌 체크 (있으면)
        if (collisionCheck) {
            // X축 이동 체크
            if (!collisionCheck(newX, this.y, this.width, this.height)) {
                this.x = newX;
            }

            // Y축 이동 체크
            if (!collisionCheck(this.x, newY, this.width, this.height)) {
                this.y = newY;
            }
        } else {
            // 충돌 체크 없으면 그냥 이동
            this.x = newX;
            this.y = newY;
        }
    }

    /**
     * 공격
     */
    attack(): boolean {
        const now = Date.now();

        if (now - this.lastAttackTime < this.attackCooldown) {
            return false;
        }

        if (this.isAttacking) {
            return false;
        }

        this.isAttacking = true;
        this.lastAttackTime = now;

        // 콤보 카운트 (1.5초 이내 연속 공격)
        if (now - this.lastComboTime < 1500) {
            this.comboCount++;
        } else {
            this.comboCount = 1;
        }
        this.lastComboTime = now;

        console.log(`⚔️ 공격! 콤보: ${this.comboCount}`);

        // 공격 애니메이션 종료
        setTimeout(() => {
            this.isAttacking = false;
        }, 300);

        return true;
    }

    /**
     * 공격 데미지 계산
     */
    getAttackDamage(isCharged: boolean = false): number {
        return this.weaponSystem.calculateDamage(this.stats.attack, isCharged, this.comboCount);
    }

    /**
     * 크리티컬 판정
     */
    rollCritical(isBackstab: boolean = false): boolean {
        const critChance = this.weaponSystem.getCriticalChance(this.stats.criticalChance, isBackstab);
        return Math.random() < critChance;
    }

    /**
     * 공격 범위
     */
    getAttackRange(): number {
        return this.weaponSystem.getAttackRange();
    }

    /**
     * 무기 시스템 가져오기
     */
    getWeaponSystem(): WeaponSystem {
        return this.weaponSystem;
    }

    /**
     * 무기 변경
     */
    changeWeapon(weaponType: WeaponType): boolean {
        const success = this.weaponSystem.equipWeapon(weaponType);
        if (success) {
            this.updateAttackCooldown();
            this.comboCount = 0; // 콤보 리셋
        }
        return success;
    }

    /**
     * 회피
     */
    dodge(direction: Vector2D): boolean {
        // 스태미나 체크
        if (this.stats.stamina < GAMEPLAY.STAMINA.DODGE_COST) {
            return false;
        }

        // 회피 시도
        const dodgeResult = this.combatSystem.tryDodge();
        if (!dodgeResult.success) {
            return false;
        }

        // 스태미나 소비
        this.stats.stamina -= GAMEPLAY.STAMINA.DODGE_COST;

        // 회피 방향 저장
        this.dodgeDirection = direction;
        this.isDodging = true;

        // 회피 이동
        const dodgeDistance = GAMEPLAY.COMBAT.DODGE_DISTANCE;
        this.x += direction.x * dodgeDistance;
        this.y += direction.y * dodgeDistance;

        // 회피 종료
        setTimeout(() => {
            this.isDodging = false;
        }, GAMEPLAY.COMBAT.DODGE_INVULNERABLE_TIME);

        return true;
    }

    /**
     * 데미지 받기
     */
    takeDamage(damage: number): void {
        // 무적 상태 체크
        if (this.combatSystem.isInvulnerable()) {
            return;
        }

        const actualDamage = Math.max(1, damage - this.stats.defense);
        this.stats.health -= actualDamage;

        // 피격 콜백 호출
        if (this.onTakeDamageCallback) {
            this.onTakeDamageCallback(actualDamage, this.x, this.y);
        }

        // 콤보 리셋
        this.combatSystem.resetCombo();
    }

    /**
     * 치유
     */
    heal(amount: number): void {
        this.stats.health = Math.min(this.stats.maxHealth, this.stats.health + amount);
    }

    /**
     * 마나 회복
     */
    restoreMana(amount: number): void {
        this.stats.mana = Math.min(this.stats.maxMana, this.stats.mana + amount);
    }

    /**
     * 렌더링
     */
    render(renderer: Renderer): void {
        const ctx = renderer.getContext();

        // 회피 중이면 반투명 + 잔상 효과
        if (this.isDodging) {
            ctx.globalAlpha = 0.5;

            // 잔상 효과 (3개)
            for (let i = 0; i < 3; i++) {
                const trailAlpha = 0.1 - (i * 0.03);
                const trailOffset = i * 8;
                ctx.globalAlpha = trailAlpha;

                renderer.drawRect(
                    this.x - this.width / 2 - trailOffset,
                    this.y - this.height / 2,
                    this.width,
                    this.height,
                    COLORS.PLAYER
                );
            }
            ctx.globalAlpha = 0.5;
        }

        // 플레이어 몸체 (둥근 모서리)
        ctx.fillStyle = COLORS.PLAYER;
        ctx.beginPath();
        const bodyX = this.x - this.width / 2;
        const bodyY = this.y - this.height / 2;
        const radius = 4;
        ctx.moveTo(bodyX + radius, bodyY);
        ctx.lineTo(bodyX + this.width - radius, bodyY);
        ctx.quadraticCurveTo(bodyX + this.width, bodyY, bodyX + this.width, bodyY + radius);
        ctx.lineTo(bodyX + this.width, bodyY + this.height - radius);
        ctx.quadraticCurveTo(bodyX + this.width, bodyY + this.height, bodyX + this.width - radius, bodyY + this.height);
        ctx.lineTo(bodyX + radius, bodyY + this.height);
        ctx.quadraticCurveTo(bodyX, bodyY + this.height, bodyX, bodyY + this.height - radius);
        ctx.lineTo(bodyX, bodyY + radius);
        ctx.quadraticCurveTo(bodyX, bodyY, bodyX + radius, bodyY);
        ctx.closePath();
        ctx.fill();

        // 그라데이션 효과
        const gradient = ctx.createRadialGradient(this.x, this.y - 8, 0, this.x, this.y, this.width / 2);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fill();

        // 테두리 (더 두껍고 선명)
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // 눈 (애니메이션)
        const eyeBlinkPhase = Math.sin(this.animationTime * 0.002);
        if (eyeBlinkPhase > -0.9) { // 대부분의 시간 눈 뜨고 있음
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.arc(this.x - 6, this.y - 4, 2, 0, Math.PI * 2);
            ctx.arc(this.x + 6, this.y - 4, 2, 0, Math.PI * 2);
            ctx.fill();
        }

        // 투명도 리셋
        ctx.globalAlpha = 1.0;

        // 공격 중 이펙트 (개선)
        if (this.isAttacking) {
            const weapon = this.weaponSystem.getCurrentWeapon();
            const attackRadius = this.weaponSystem.getAttackRange();

            // 무기별 색상
            let effectColor = 'rgba(255, 215, 0, 0.4)'; // 기본 금색
            if (weapon) {
                if (weapon.category === 'magic') effectColor = 'rgba(138, 43, 226, 0.4)'; // 보라색
                if (weapon.category === 'ranged') effectColor = 'rgba(0, 191, 255, 0.4)'; // 청록색
            }

            // 공격 범위 표시 (펄스)
            const pulsePhase = 1 - (Date.now() - this.lastAttackTime) / 300;
            const pulseRadius = attackRadius * (0.7 + pulsePhase * 0.3);

            ctx.fillStyle = effectColor;
            ctx.beginPath();
            ctx.arc(this.x, this.y, pulseRadius, 0, Math.PI * 2);
            ctx.fill();

            // 콤보 표시
            if (this.comboCount >= 2) {
                ctx.fillStyle = 'rgba(255, 69, 0, 0.5)'; // 붉은색
                ctx.beginPath();
                ctx.arc(this.x, this.y, pulseRadius * 0.7, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // 레벨업 파티클 효과 (체력 100%일 때 반짝임)
        if (this.stats.health === this.stats.maxHealth) {
            const sparkle = Math.sin(this.animationTime * 0.005) * 0.5 + 0.5;
            ctx.fillStyle = `rgba(255, 215, 0, ${sparkle * 0.3})`;
            ctx.beginPath();
            ctx.arc(this.x + 12, this.y - 12, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    /**
     * 히트박스 가져오기
     */
    getHitbox(): { x: number; y: number; width: number; height: number } {
        return {
            x: this.x - this.width / 2,
            y: this.y - this.height / 2,
            width: this.width,
            height: this.height
        };
    }

    /**
     * 전투 시스템 가져오기
     */
    getCombatSystem(): CombatSystem {
        return this.combatSystem;
    }

    /**
     * 특성 시스템 가져오기
     */
    getTraitSystem(): TraitSystem {
        return this.traitSystem;
    }

    /**
     * 애니메이션 컨트롤러 가져오기
     */
    getAnimationController(): AnimationController {
        return this.animationController;
    }

    /**
     * 현재 위치
     */
    getPosition(): Position {
        return { x: this.x, y: this.y };
    }

    /**
     * 피격 콜백 설정
     */
    setOnTakeDamage(callback: (damage: number, playerX: number, playerY: number) => void): void {
        this.onTakeDamageCallback = callback;
    }

    /**
     * 플레이어 ID 가져오기 (BuffSystem용)
     */
    getPlayerId(): string {
        return 'player';
    }

    /**
     * 경험치 획득
     */
    gainExperience(amount: number): boolean {
        this.experience += amount;

        // 레벨업 체크
        if (this.experience >= this.experienceToNextLevel) {
            this.levelUp();
            return true;
        }

        return false;
    }

    /**
     * 레벨업
     */
    private levelUp(): void {
        this.level++;
        this.experience -= this.experienceToNextLevel;

        // 다음 레벨 필요 경험치 증가 (1.5배)
        this.experienceToNextLevel = Math.floor(this.experienceToNextLevel * 1.5);

        // 스탯 증가
        this.stats.maxHealth += 20;
        this.stats.health = this.stats.maxHealth; // 체력 완전 회복
        this.stats.maxMana += 10;
        this.stats.mana = this.stats.maxMana; // 마나 완전 회복
        this.stats.maxStamina += 10;
        this.stats.stamina = this.stats.maxStamina;
        this.stats.attack += 5;
        this.stats.defense += 2;
        this.stats.speed += 5;

        console.log(`🎉 레벨업! Lv.${this.level}`);
    }

    /**
     * 레벨 및 경험치 정보
     */
    getLevelInfo(): { level: number; experience: number; experienceToNextLevel: number; progress: number } {
        return {
            level: this.level,
            experience: this.experience,
            experienceToNextLevel: this.experienceToNextLevel,
            progress: this.experience / this.experienceToNextLevel
        };
    }

    /**
     * 업그레이드된 스탯 적용
     */
    applyUpgradedStats(upgradedStats: PlayerStats): void {
        // 현재 체력 비율 유지
        const healthRatio = this.stats.health / this.stats.maxHealth;
        const manaRatio = this.stats.mana / this.stats.maxMana;
        const staminaRatio = this.stats.stamina / this.stats.maxStamina;

        // 업그레이드된 스탯 적용
        this.stats = { ...upgradedStats };

        // 현재 비율로 리소스 재설정
        this.stats.health = this.stats.maxHealth * healthRatio;
        this.stats.mana = this.stats.maxMana * manaRatio;
        this.stats.stamina = this.stats.maxStamina * staminaRatio;
    }

    /**
     * 최종 스탯 계산 (기본 스탯 + 장비 + 버프)
     */
    private calculateFinalStats(): void {
        // 현재 체력/마나/스태미나 비율 유지
        const healthRatio = this.stats.health / this.stats.maxHealth;
        const manaRatio = this.stats.mana / this.stats.maxMana;
        const staminaRatio = this.stats.stamina / this.stats.maxStamina;

        // 1. 기본 스탯에서 시작
        const tempStats = { ...this.baseStats };

        // 2. 장비 보너스 적용
        const equipBonus = this.equipmentSystem.calculateBonusStats();
        if (equipBonus.attack) tempStats.attack += equipBonus.attack;
        if (equipBonus.defense) tempStats.defense += equipBonus.defense;
        if (equipBonus.maxHealth) tempStats.maxHealth += equipBonus.maxHealth;
        if (equipBonus.speed) tempStats.speed += equipBonus.speed;
        if (equipBonus.criticalChance) tempStats.criticalChance += equipBonus.criticalChance;
        if (equipBonus.criticalDamage) tempStats.criticalDamage += equipBonus.criticalDamage;

        // 3. 버프 배율 적용
        // TODO: 새 BuffSystem API로 통합 필요
        // this.stats = this.buffSystem.applyBuffs(tempStats);
        this.stats = tempStats;

        // 4. 현재 리소스를 비율로 복원
        this.stats.health = this.stats.maxHealth * healthRatio;
        this.stats.mana = this.stats.maxMana * manaRatio;
        this.stats.stamina = this.stats.maxStamina * staminaRatio;
    }

    /**
     * 장비 착용
     */
    equipItem(item: Item): Item | null {
        const previousItem = this.equipmentSystem.equip(item);
        this.calculateFinalStats(); // 스탯 재계산
        return previousItem;
    }

    /**
     * 장비 해제
     */
    unequipItem(slot: string): Item | null {
        const item = this.equipmentSystem.unequip(slot as any);
        if (item) {
            this.calculateFinalStats(); // 스탯 재계산
        }
        return item;
    }

    /**
     * 소모품 사용
     */
    useConsumable(item: Item): boolean {
        if (item.type !== 'consumable' || !item.effects) {
            console.warn('소모품이 아니거나 효과가 없습니다:', item.name);
            return false;
        }

        // 각 효과 적용
        item.effects.forEach(effect => {
            switch (effect.type) {
                case 'heal':
                    this.heal(effect.value);
                    console.log(`💚 ${item.name} 사용: 체력 ${effect.value} 회복`);
                    break;

                case 'mana':
                    this.restoreMana(effect.value);
                    console.log(`💙 ${item.name} 사용: 마나 ${effect.value} 회복`);
                    break;

                case 'buff':
                    // TODO: 새 BuffSystem API로 통합 필요
                    // if (effect.stat && effect.duration) {
                    //     this.buffSystem.addBuff({
                    //         name: item.name,
                    //         stat: effect.stat,
                    //         value: effect.value,
                    //         duration: effect.duration
                    //     });
                    //     console.log(`✨ ${item.name} 사용: ${effect.stat} +${(effect.value * 100).toFixed(0)}% (${effect.duration}초)`);
                    // }
                    console.log(`⚠️ 버프 아이템 기능 임시 비활성화: ${item.name}`);
                    break;

                case 'stat':
                    // 영구 스탯 증가 (기본 스탯 수정)
                    if (effect.stat) {
                        switch (effect.stat) {
                            case 'attack':
                                this.baseStats.attack += effect.value;
                                break;
                            case 'defense':
                                this.baseStats.defense += effect.value;
                                break;
                            case 'speed':
                                this.baseStats.speed += effect.value;
                                break;
                        }
                        this.calculateFinalStats();
                        console.log(`📈 ${item.name} 사용: ${effect.stat} +${effect.value} (영구)`);
                    }
                    break;
            }
        });

        return true;
    }

    /**
     * 장비 시스템 가져오기
     */
    getEquipmentSystem(): EquipmentSystem {
        return this.equipmentSystem;
    }

    /**
     * 버프 시스템 가져오기
     */
    getBuffSystem(): BuffSystem {
        return this.buffSystem;
    }

    /**
     * 활성 버프 목록
     */
    getActiveBuffs() {
        // TODO: 새 BuffSystem API로 통합 필요
        // return this.buffSystem.getActiveBuffs();
        return [];
    }
}