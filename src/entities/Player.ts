/**
 * 🧑 플레이어 엔티티
 *
 * 플레이어 캐릭터를 관리합니다.
 */

import { Position, Vector2D, PlayerStats, WeaponType } from '../types';
import { GAMEPLAY, COLORS } from '../utils/Constants';
import { CombatSystem } from '../systems/CombatSystem';
import { TraitSystem } from '../systems/TraitSystem';
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
    private isAttacking: boolean = false;
    private attackCooldown: number = 500;
    private lastAttackTime: number = 0;

    // 회피
    private isDodging: boolean = false;
    private dodgeDirection: Vector2D = { x: 0, y: 0 };

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

        this.combatSystem = new CombatSystem();
        this.traitSystem = new TraitSystem();
        this.animationController = new AnimationController(150, 4);
    }

    /**
     * 업데이트
     */
    update(deltaTime: number): void {
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

        // 공격 애니메이션 종료
        setTimeout(() => {
            this.isAttacking = false;
        }, 300);

        return true;
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

        // 회피 중이면 반투명
        if (this.isDodging) {
            ctx.globalAlpha = 0.5;
        }

        // 플레이어 몸체
        renderer.drawRect(
            this.x - this.width / 2,
            this.y - this.height / 2,
            this.width,
            this.height,
            COLORS.PLAYER
        );

        // 테두리
        renderer.drawRectOutline(
            this.x - this.width / 2,
            this.y - this.height / 2,
            this.width,
            this.height,
            '#000000',
            2
        );

        // 투명도 리셋
        ctx.globalAlpha = 1.0;

        // 공격 중 이펙트
        if (this.isAttacking) {
            ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, 50, 0, Math.PI * 2);
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
}