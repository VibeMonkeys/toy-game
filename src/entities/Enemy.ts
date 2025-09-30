/**
 * 👹 적 엔티티
 *
 * 기본 적 AI와 전투를 관리합니다.
 */

import { Position, EnemyType, EnemyData, AIState } from '../types';
import { COLORS } from '../utils/Constants';
import { Renderer } from '../systems/Renderer';
import { Player } from './Player';

export class Enemy {
    x: number;
    y: number;
    type: EnemyType;

    // 스탯
    health: number;
    maxHealth: number;
    attack: number;
    defense: number;
    speed: number;

    // 크기
    width: number = 32;
    height: number = 32;

    // AI
    aiState: AIState = 'patrol';
    targetPlayer: boolean = false;
    detectionRange: number = 150;
    attackRange: number = 40;

    // 순찰
    private patrolCenter: Position;
    private patrolRadius: number = 60;

    // 공격
    private lastAttackTime: number = 0;
    private attackCooldown: number = 1000;

    // 애니메이션
    private animationTime: number = 0;

    constructor(x: number, y: number, type: EnemyType) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.patrolCenter = { x, y };

        // 타입별 스탯 설정
        const data = this.getEnemyData(type);
        this.health = data.health;
        this.maxHealth = data.health;
        this.attack = data.attack;
        this.defense = data.defense;
        this.speed = data.speed;
    }

    /**
     * 적 타입별 데이터
     */
    private getEnemyData(type: EnemyType): EnemyData {
        const enemyDataMap: Record<EnemyType, EnemyData> = {
            goblin: {
                health: 30,
                attack: 8,
                defense: 2,
                speed: 80,
                experience: 15,
                soulPoints: 2,
                color: COLORS.GOBLIN
            },
            orc: {
                health: 60,
                attack: 15,
                defense: 5,
                speed: 60,
                experience: 25,
                soulPoints: 4,
                color: COLORS.ORC
            },
            skeleton: {
                health: 40,
                attack: 12,
                defense: 3,
                speed: 70,
                experience: 20,
                soulPoints: 3,
                color: COLORS.SKELETON
            },
            troll: {
                health: 120,
                attack: 25,
                defense: 8,
                speed: 40,
                experience: 40,
                soulPoints: 8,
                color: COLORS.TROLL
            },
            wraith: {
                health: 80,
                attack: 20,
                defense: 2,
                speed: 100,
                experience: 35,
                soulPoints: 6,
                color: COLORS.WRAITH
            }
        };

        return enemyDataMap[type];
    }

    /**
     * 업데이트
     */
    update(deltaTime: number, player: Player): void {
        if (this.health <= 0) return;

        this.animationTime += deltaTime;

        const distanceToPlayer = this.getDistanceToPlayer(player);

        // AI 상태 결정
        if (distanceToPlayer <= this.attackRange) {
            this.aiState = 'attack';
            this.attackPlayer(player);
        } else if (distanceToPlayer <= this.detectionRange) {
            this.aiState = 'chase';
            this.moveTowardsPlayer(player, deltaTime);
        } else {
            this.aiState = 'patrol';
            this.patrol(deltaTime);
        }
    }

    /**
     * 플레이어와의 거리
     */
    private getDistanceToPlayer(player: Player): number {
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * 플레이어 추적
     */
    private moveTowardsPlayer(player: Player, deltaTime: number): void {
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            this.x += (dx / distance) * this.speed * deltaTime;
            this.y += (dy / distance) * this.speed * deltaTime;
        }
    }

    /**
     * 순찰
     */
    private patrol(deltaTime: number): void {
        const dx = this.patrolCenter.x - this.x;
        const dy = this.patrolCenter.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > this.patrolRadius) {
            // 순찰 영역으로 돌아가기
            this.x += (dx / distance) * this.speed * 0.5 * deltaTime;
            this.y += (dy / distance) * this.speed * 0.5 * deltaTime;
        }
    }

    /**
     * 플레이어 공격
     */
    private attackPlayer(player: Player): void {
        const now = Date.now();

        if (now - this.lastAttackTime < this.attackCooldown) {
            return;
        }

        this.lastAttackTime = now;
        player.takeDamage(this.attack);
    }

    /**
     * 데미지 받기
     */
    takeDamage(damage: number): void {
        const actualDamage = Math.max(1, damage - this.defense);
        this.health -= actualDamage;
    }

    /**
     * 렌더링
     */
    render(renderer: Renderer): void {
        this.renderAtPosition(renderer, this.x, this.y);
    }

    /**
     * 특정 위치에 렌더링 (카메라용)
     */
    renderAtPosition(renderer: Renderer, x: number, y: number): void {
        const data = this.getEnemyData(this.type);

        // 적 몸체 (x, y는 좌상단)
        renderer.drawRect(
            x,
            y,
            this.width,
            this.height,
            data.color
        );

        // 테두리
        renderer.drawRectOutline(
            x,
            y,
            this.width,
            this.height,
            '#000000',
            2
        );

        // 체력바
        if (this.health < this.maxHealth) {
            renderer.drawHealthBar(
                x,
                y - 8,
                this.width,
                4,
                this.health,
                this.maxHealth
            );
        }
    }

    /**
     * 죽었는지 확인
     */
    isDead(): boolean {
        return this.health <= 0;
    }

    /**
     * 히트박스
     */
    getHitbox(): { x: number; y: number; width: number; height: number } {
        return {
            x: this.x - this.width / 2,
            y: this.y - this.height / 2,
            width: this.width,
            height: this.height
        };
    }
}