/**
 * 👹 적 엔티티
 *
 * 기본 적 AI와 전투를 관리합니다.
 */

import { Position, EnemyType, EnemyData, AIState } from '../types';
import { COLORS } from '../utils/Constants';
import { Renderer } from '../systems/Renderer';
import { Player } from './Player';
import { AnimationController, Direction } from '../systems/AnimationController';

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

    // 보스 여부
    isBoss: boolean = false;

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
    private animationController: AnimationController;

    constructor(x: number, y: number, type: EnemyType, isBoss: boolean = false) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.isBoss = isBoss;
        this.patrolCenter = { x, y };

        // 타입별 스탯 설정
        const data = this.getEnemyDataInternal(type);
        this.health = data.health;
        this.maxHealth = data.health;
        this.attack = data.attack;
        this.defense = data.defense;
        this.speed = data.speed;

        // 보스면 스탯 대폭 증가
        if (isBoss) {
            this.health *= 5;
            this.maxHealth *= 5;
            this.attack *= 2;
            this.defense *= 2;
            this.width = 48;
            this.height = 48;
            this.detectionRange = 300; // 보스는 더 먼 거리에서 감지
        }

        // 애니메이션 컨트롤러 초기화
        this.animationController = new AnimationController(200, 4); // 적은 조금 느리게
    }

    /**
     * 적 타입별 데이터 (public)
     */
    getEnemyData(): EnemyData & { name: string } {
        return this.getEnemyDataInternal(this.type);
    }

    /**
     * 적 타입별 데이터 (internal)
     */
    private getEnemyDataInternal(type: EnemyType): EnemyData & { name: string } {
        const enemyDataMap: Record<EnemyType, EnemyData & { name: string }> = {
            goblin: {
                name: '고블린',
                health: 50, // 30 → 50
                attack: 8,
                defense: 2,
                speed: 80,
                experience: 15,
                soulPoints: 2,
                color: COLORS.GOBLIN
            },
            orc: {
                name: '오크',
                health: 100, // 60 → 100
                attack: 15,
                defense: 5,
                speed: 60,
                experience: 25,
                soulPoints: 4,
                color: COLORS.ORC
            },
            skeleton: {
                name: '스켈레톤',
                health: 70, // 40 → 70
                attack: 12,
                defense: 3,
                speed: 70,
                experience: 20,
                soulPoints: 3,
                color: COLORS.SKELETON
            },
            troll: {
                name: '트롤',
                health: 180, // 120 → 180
                attack: 25,
                defense: 8,
                speed: 40,
                experience: 40,
                soulPoints: 8,
                color: COLORS.TROLL
            },
            wraith: {
                name: '레이스',
                health: 120, // 80 → 120
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
        this.animationController.update(deltaTime);

        const distanceToPlayer = this.getDistanceToPlayer(player);

        // AI 상태 결정
        if (distanceToPlayer <= this.attackRange) {
            this.aiState = 'attack';
            this.attackPlayer(player);
            this.animationController.stop();
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
            const moveX = (dx / distance) * this.speed * deltaTime;
            const moveY = (dy / distance) * this.speed * deltaTime;

            this.x += moveX;
            this.y += moveY;

            // 애니메이션 방향 설정
            this.animationController.setDirectionFromMovement(dx, dy);
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
            const moveX = (dx / distance) * this.speed * 0.5 * deltaTime;
            const moveY = (dy / distance) * this.speed * 0.5 * deltaTime;

            this.x += moveX;
            this.y += moveY;

            // 애니메이션 방향 설정
            this.animationController.setDirectionFromMovement(dx, dy);
        } else {
            this.animationController.stop();
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
        const data = this.getEnemyDataInternal(this.type);
        const ctx = renderer.getContext();
        const centerX = x + this.width / 2;
        const centerY = y + this.height / 2;

        // 그림자
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(centerX, y + this.height + 2, this.width / 2, this.height / 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // 보스면 붉은 오라 (발광 효과)
        if (this.isBoss) {
            const pulse = Math.sin(Date.now() / 200) * 0.3 + 0.7;
            const auraGradient = ctx.createRadialGradient(
                centerX, centerY, 0,
                centerX, centerY, this.width
            );
            auraGradient.addColorStop(0, `rgba(255, 0, 0, ${pulse * 0.3})`);
            auraGradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
            ctx.fillStyle = auraGradient;
            ctx.fillRect(x - 10, y - 10, this.width + 20, this.height + 20);
        }

        // 적 몸체 (그라데이션)
        const bodyGradient = ctx.createRadialGradient(
            centerX, centerY - 5,
            0,
            centerX, centerY,
            this.width / 2
        );
        const baseColor = this.isBoss ? '#8B0000' : data.color;
        bodyGradient.addColorStop(0, this.lightenColor(baseColor, 20));
        bodyGradient.addColorStop(0.7, baseColor);
        bodyGradient.addColorStop(1, this.darkenColor(baseColor, 20));

        ctx.fillStyle = bodyGradient;
        ctx.fillRect(x, y, this.width, this.height);

        // 하이라이트
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.beginPath();
        ctx.arc(x + this.width * 0.3, y + this.height * 0.3, this.width * 0.2, 0, Math.PI * 2);
        ctx.fill();

        // 테두리 (이중)
        ctx.strokeStyle = this.darkenColor(baseColor, 30);
        ctx.lineWidth = this.isBoss ? 3 : 2;
        ctx.strokeRect(x, y, this.width, this.height);

        if (this.isBoss) {
            ctx.strokeStyle = '#FF0000';
            ctx.lineWidth = 1;
            ctx.strokeRect(x - 1, y - 1, this.width + 2, this.height + 2);
        }

        // 눈 (위협적인 느낌)
        ctx.fillStyle = this.isBoss ? '#FFFF00' : '#FF0000';
        const eyeY = y + this.height * 0.4;
        ctx.beginPath();
        ctx.arc(x + this.width * 0.35, eyeY, 3, 0, Math.PI * 2);
        ctx.arc(x + this.width * 0.65, eyeY, 3, 0, Math.PI * 2);
        ctx.fill();

        // 체력바 먼저 그리기
        const barWidth = this.width;
        const barHeight = 6;
        const barX = x;
        const barY = y - 12;

        // 배경 (어두운 회색)
        ctx.fillStyle = 'rgba(50, 50, 50, 0.8)';
        ctx.fillRect(barX, barY, barWidth, barHeight);

        // 체력 (색상 변화)
        const healthRatio = this.health / this.maxHealth;
        const healthColor = healthRatio > 0.5 ? '#4CAF50' : healthRatio > 0.25 ? '#FF9800' : '#F44336';
        ctx.fillStyle = healthColor;
        ctx.fillRect(barX, barY, barWidth * healthRatio, barHeight);

        // 테두리 (흰색)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, barWidth, barHeight);

        // 몬스터 이름 표시 (체력바 위에)
        const enemyName = data.name || this.type; // fallback
        const displayName = this.isBoss ? `👑 ${enemyName} BOSS` : enemyName;
        const nameY = barY - 10; // 체력바 위 10px

        // 이름 폰트 설정
        ctx.font = this.isBoss ? 'bold 12px Arial' : 'bold 11px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // 이름 배경 (검은색)
        const nameWidth = ctx.measureText(displayName).width;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.fillRect(centerX - nameWidth / 2 - 3, nameY - 7, nameWidth + 6, 14);

        // 이름 테두리
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1;
        ctx.strokeRect(centerX - nameWidth / 2 - 3, nameY - 7, nameWidth + 6, 14);

        // 이름 텍스트 (그림자 효과)
        ctx.shadowColor = 'rgba(0, 0, 0, 1)';
        ctx.shadowBlur = 3;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;

        if (this.isBoss) {
            const pulse = Math.sin(Date.now() / 200) * 0.3 + 0.7;
            ctx.fillStyle = `rgba(255, ${Math.floor(pulse * 150)}, 0, 1)`;
        } else {
            ctx.fillStyle = '#FFFFFF';
        }

        ctx.fillText(displayName, centerX, nameY);

        // 그림자 리셋
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    }

    /**
     * 색상 밝게
     */
    private lightenColor(color: string, percent: number): string {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.min(255, (num >> 16) + amt);
        const G = Math.min(255, (num >> 8 & 0x00FF) + amt);
        const B = Math.min(255, (num & 0x0000FF) + amt);
        return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
    }

    /**
     * 색상 어둡게
     */
    private darkenColor(color: string, percent: number): string {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.max(0, (num >> 16) - amt);
        const G = Math.max(0, (num >> 8 & 0x00FF) - amt);
        const B = Math.max(0, (num & 0x0000FF) - amt);
        return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
    }

    /**
     * 애니메이션 컨트롤러 가져오기
     */
    getAnimationController(): AnimationController {
        return this.animationController;
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