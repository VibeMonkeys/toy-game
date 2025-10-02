/**
 * 👹 적 엔티티
 *
 * 기본 적 AI와 전투를 관리합니다.
 */

import { Position, EnemyType, EnemyData, AIState, Vector2D } from '../types';
import { COLORS } from '../utils/Constants';
import { Renderer } from '../systems/Renderer';
import { Player } from './Player';
import { AnimationController, Direction } from '../systems/AnimationController';
import { getDistance } from '../utils/MathUtils';
import { MapManager } from '../systems/MapManager';

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

    // 맵 참조 (충돌 체크용)
    private mapManager: MapManager | null = null;

    // 보스 여부
    isBoss: boolean = false;

    // AI
    aiState: AIState = 'patrol';
    targetPlayer: boolean = false;
    detectionRange: number = 150;
    attackRange: number = 40;
    fleeHealthThreshold: number = 0.3; // 30% 이하면 도망

    // 순찰
    private patrolCenter: Position;
    private patrolRadius: number = 60;
    private patrolWaitTime: number = 0;
    private patrolWaitDuration: number = 2000; // 2초간 대기
    private isWaiting: boolean = false;

    // 공격
    private lastAttackTime: number = 0;
    private attackCooldown: number = 1000;
    private attackWindupTime: number = 300; // 공격 예비동작 시간
    private isWindingUp: boolean = false;
    private windupStartTime: number = 0;

    // 회피/도망
    private fleeDirection: Vector2D = { x: 0, y: 0 };
    private lastFleeUpdate: number = 0;

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
            this.attackRange = 50; // 보스 공격 범위 증가
            this.attackCooldown = 800; // 보스는 더 빠르게 공격
            this.attackWindupTime = 500; // 보스 예비동작 시간 증가 (회피 가능)
            this.fleeHealthThreshold = 0; // 보스는 도망치지 않음
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
     * 맵 매니저 설정 (충돌 체크용)
     */
    setMapManager(mapManager: MapManager): void {
        this.mapManager = mapManager;
    }

    /**
     * 업데이트
     */
    update(deltaTime: number, player: Player): void {
        if (this.health <= 0) return;

        this.animationTime += deltaTime;
        this.animationController.update(deltaTime);

        const distanceToPlayer = this.getDistanceToPlayer(player);
        const healthRatio = this.health / this.maxHealth;

        // AI 상태 결정 (우선순위: 도망 > 공격 > 추적 > 순찰)
        if (healthRatio <= this.fleeHealthThreshold && !this.isBoss) {
            // 체력이 낮으면 도망 (보스는 도망치지 않음)
            this.aiState = 'retreat';
            this.flee(player, deltaTime);
        } else if (distanceToPlayer <= this.attackRange) {
            // 공격 범위 안
            this.aiState = 'attack';
            this.attackPlayer(player, deltaTime);
            this.animationController.stop();
        } else if (distanceToPlayer <= this.detectionRange) {
            // 감지 범위 안 - 추적
            this.aiState = 'chase';
            this.moveTowardsPlayer(player, deltaTime);
        } else {
            // 평화로운 순찰
            this.aiState = 'patrol';
            this.patrol(deltaTime);
        }
    }

    /**
     * 플레이어와의 거리
     */
    protected getDistanceToPlayer(player: Player): number {
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
        const distance = getDistance(this.x, this.y, player.x, player.y);

        if (distance > 0) {
            const moveX = (dx / distance) * this.speed * deltaTime;
            const moveY = (dy / distance) * this.speed * deltaTime;

            // 벽 충돌 체크하면서 이동 (히트박스 중심점 기준)
            const newX = this.x + moveX;
            const newY = this.y + moveY;

            // X축 이동 체크 (히트박스의 왼쪽 상단 좌표 기준)
            const hitboxX = newX - this.width / 2;
            const hitboxY = this.y - this.height / 2;
            if (!this.mapManager || !this.mapManager.isColliding(hitboxX, hitboxY, this.width, this.height)) {
                this.x = newX;
            }

            // Y축 이동 체크
            const hitboxX2 = this.x - this.width / 2;
            const hitboxY2 = newY - this.height / 2;
            if (!this.mapManager || !this.mapManager.isColliding(hitboxX2, hitboxY2, this.width, this.height)) {
                this.y = newY;
            }

            // 애니메이션 방향 설정
            this.animationController.setDirectionFromMovement(dx, dy);
        }
    }

    /**
     * 순찰 (개선됨 - 랜덤 대기 추가)
     */
    private patrol(deltaTime: number): void {
        const now = Date.now();

        // 대기 중이면 시간 체크
        if (this.isWaiting) {
            if (now - this.patrolWaitTime >= this.patrolWaitDuration) {
                this.isWaiting = false;
            } else {
                this.animationController.stop();
                return;
            }
        }

        const dx = this.patrolCenter.x - this.x;
        const dy = this.patrolCenter.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > this.patrolRadius) {
            // 순찰 영역으로 돌아가기
            const moveX = (dx / distance) * this.speed * 0.5 * deltaTime;
            const moveY = (dy / distance) * this.speed * 0.5 * deltaTime;

            // 벽 충돌 체크하면서 이동 (히트박스 중심점 기준)
            const newX = this.x + moveX;
            const newY = this.y + moveY;

            // X축 이동 체크
            const hitboxX = newX - this.width / 2;
            const hitboxY = this.y - this.height / 2;
            if (!this.mapManager || !this.mapManager.isColliding(hitboxX, hitboxY, this.width, this.height)) {
                this.x = newX;
            }

            // Y축 이동 체크
            const hitboxX2 = this.x - this.width / 2;
            const hitboxY2 = newY - this.height / 2;
            if (!this.mapManager || !this.mapManager.isColliding(hitboxX2, hitboxY2, this.width, this.height)) {
                this.y = newY;
            }

            // 애니메이션 방향 설정
            this.animationController.setDirectionFromMovement(dx, dy);
        } else {
            // 순찰 영역 안에 있으면 가끔 멈춤
            if (Math.random() < 0.01) { // 1% 확률로 멈춤
                this.isWaiting = true;
                this.patrolWaitTime = now;
            }
            this.animationController.stop();
        }
    }

    /**
     * 도망 (새로운 기능)
     */
    private flee(player: Player, deltaTime: number): void {
        const now = Date.now();

        // 1초마다 도망 방향 재계산
        if (now - this.lastFleeUpdate > 1000) {
            const dx = this.x - player.x;
            const dy = this.y - player.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 0) {
                this.fleeDirection.x = dx / distance;
                this.fleeDirection.y = dy / distance;
            }
            this.lastFleeUpdate = now;
        }

        // 플레이어 반대 방향으로 빠르게 도망
        const fleeSpeed = this.speed * 1.5; // 1.5배 빠르게
        const moveX = this.fleeDirection.x * fleeSpeed * deltaTime;
        const moveY = this.fleeDirection.y * fleeSpeed * deltaTime;

        // 벽 충돌 체크하면서 이동 (히트박스 중심점 기준)
        const newX = this.x + moveX;
        const newY = this.y + moveY;

        // X축 이동 체크
        const hitboxX = newX - this.width / 2;
        const hitboxY = this.y - this.height / 2;
        if (!this.mapManager || !this.mapManager.isColliding(hitboxX, hitboxY, this.width, this.height)) {
            this.x = newX;
        }

        // Y축 이동 체크
        const hitboxX2 = this.x - this.width / 2;
        const hitboxY2 = newY - this.height / 2;
        if (!this.mapManager || !this.mapManager.isColliding(hitboxX2, hitboxY2, this.width, this.height)) {
            this.y = newY;
        }

        // 애니메이션 방향
        this.animationController.setDirectionFromMovement(
            this.fleeDirection.x,
            this.fleeDirection.y
        );
    }

    /**
     * 플레이어 공격 (개선됨 - 예비동작 추가)
     */
    private attackPlayer(player: Player, deltaTime: number): void {
        const now = Date.now();

        // 공격 쿨다운 체크
        if (now - this.lastAttackTime < this.attackCooldown) {
            return;
        }

        // 예비동작 시작
        if (!this.isWindingUp) {
            this.isWindingUp = true;
            this.windupStartTime = now;
            return;
        }

        // 예비동작 중
        if (now - this.windupStartTime < this.attackWindupTime) {
            return;
        }

        // 실제 공격 실행
        this.isWindingUp = false;
        this.lastAttackTime = now;

        // 타입별 공격력 보정
        let finalDamage = this.attack;

        switch(this.type) {
            case 'goblin':
                // 고블린: 빠른 약한 공격
                finalDamage = this.attack * (Math.random() < 0.2 ? 1.5 : 1.0);
                break;
            case 'orc':
                // 오크: 강력한 일격
                finalDamage = this.attack * (Math.random() < 0.3 ? 2.0 : 1.2);
                break;
            case 'skeleton':
                // 스켈레톤: 안정적인 데미지
                finalDamage = this.attack * 1.1;
                break;
            case 'troll':
                // 트롤: 매우 강력하지만 느림
                finalDamage = this.attack * 1.5;
                break;
            case 'wraith':
                // 레이스: 변칙적인 데미지
                finalDamage = this.attack * (0.8 + Math.random() * 0.8);
                break;
        }

        // 보스는 더 강함
        if (this.isBoss) {
            finalDamage *= 1.5;
        }

        player.takeDamage(Math.floor(finalDamage));
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

        // AI 상태에 따른 오라 효과
        const pulse = Math.sin(Date.now() / 200) * 0.3 + 0.7;

        if (this.isBoss) {
            // 보스 - 붉은 오라
            const auraGradient = ctx.createRadialGradient(
                centerX, centerY, 0,
                centerX, centerY, this.width
            );
            auraGradient.addColorStop(0, `rgba(255, 0, 0, ${pulse * 0.3})`);
            auraGradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
            ctx.fillStyle = auraGradient;
            ctx.fillRect(x - 10, y - 10, this.width + 20, this.height + 20);
        } else if (this.aiState === 'retreat') {
            // 도망 - 노란색 오라
            const auraGradient = ctx.createRadialGradient(
                centerX, centerY, 0,
                centerX, centerY, this.width * 0.8
            );
            auraGradient.addColorStop(0, `rgba(255, 255, 0, ${pulse * 0.2})`);
            auraGradient.addColorStop(1, 'rgba(255, 255, 0, 0)');
            ctx.fillStyle = auraGradient;
            ctx.fillRect(x - 5, y - 5, this.width + 10, this.height + 10);
        } else if (this.aiState === 'attack' || this.isWindingUp) {
            // 공격 - 주황색 깜빡임
            const attackPulse = this.isWindingUp ? Math.sin(Date.now() / 100) * 0.5 + 0.5 : 0.3;
            const auraGradient = ctx.createRadialGradient(
                centerX, centerY, 0,
                centerX, centerY, this.width * 0.7
            );
            auraGradient.addColorStop(0, `rgba(255, 100, 0, ${attackPulse * 0.4})`);
            auraGradient.addColorStop(1, 'rgba(255, 100, 0, 0)');
            ctx.fillStyle = auraGradient;
            ctx.fillRect(x - 3, y - 3, this.width + 6, this.height + 6);
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