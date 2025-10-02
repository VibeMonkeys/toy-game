/**
 * 🔮 투사체 시스템
 *
 * 보스, 적, 플레이어의 투사체 관리
 */

import { Projectile, Position } from '../types';
import { Renderer } from './Renderer';
import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';
import { Camera } from './Camera';
import { ParticleSystem } from './ParticleSystem';

export class ProjectileSystem {
    private projectiles: Projectile[] = [];
    private nextId: number = 0;
    private particleSystem: ParticleSystem | null = null;

    constructor() {}

    /**
     * ParticleSystem 연결
     */
    setParticleSystem(system: ParticleSystem): void {
        this.particleSystem = system;
    }

    /**
     * 투사체 생성
     */
    createProjectile(
        x: number,
        y: number,
        angle: number,
        speed: number,
        damage: number,
        owner: 'player' | 'enemy' | 'boss',
        options?: {
            radius?: number;
            color?: string;
            lifetime?: number;
            homing?: boolean;
            target?: Position;
            piercing?: boolean;
            maxHits?: number;
        }
    ): void {
        const velocityX = Math.cos(angle) * speed;
        const velocityY = Math.sin(angle) * speed;

        const projectile: Projectile = {
            id: `proj_${this.nextId++}`,
            x,
            y,
            velocityX,
            velocityY,
            damage,
            radius: options?.radius || 8,
            color: options?.color || this.getDefaultColor(owner),
            owner,
            lifetime: 0,
            maxLifetime: options?.lifetime || 3000, // 3초 기본
            homing: options?.homing || false,
            target: options?.target,
            piercing: options?.piercing || false,
            hitCount: 0,
            maxHits: options?.maxHits || 1
        };

        this.projectiles.push(projectile);
    }

    /**
     * 다중 투사체 생성 (부채꼴 패턴)
     */
    createSpread(
        x: number,
        y: number,
        baseAngle: number,
        count: number,
        spreadAngle: number,
        speed: number,
        damage: number,
        owner: 'player' | 'enemy' | 'boss',
        options?: any
    ): void {
        if (count === 1) {
            this.createProjectile(x, y, baseAngle, speed, damage, owner, options);
            return;
        }

        const startAngle = baseAngle - spreadAngle / 2;
        const angleStep = spreadAngle / (count - 1);

        for (let i = 0; i < count; i++) {
            const angle = startAngle + angleStep * i;
            this.createProjectile(x, y, angle, speed, damage, owner, options);
        }
    }

    /**
     * 원형 패턴 투사체 생성
     */
    createCircle(
        x: number,
        y: number,
        count: number,
        speed: number,
        damage: number,
        owner: 'player' | 'enemy' | 'boss',
        options?: any
    ): void {
        const angleStep = (Math.PI * 2) / count;

        for (let i = 0; i < count; i++) {
            const angle = angleStep * i;
            this.createProjectile(x, y, angle, speed, damage, owner, options);
        }
    }

    /**
     * 업데이트
     */
    update(deltaTime: number, player: Player, enemies: Enemy[]): void {
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const proj = this.projectiles[i];

            // 생명 시간 체크
            proj.lifetime += deltaTime * 1000;
            if (proj.lifetime >= proj.maxLifetime) {
                this.projectiles.splice(i, 1);
                continue;
            }

            // 호밍 기능
            if (proj.homing && proj.target) {
                this.updateHoming(proj, deltaTime);
            }

            // 위치 업데이트
            proj.x += proj.velocityX * deltaTime;
            proj.y += proj.velocityY * deltaTime;

            // 충돌 감지
            let shouldRemove = false;

            if (proj.owner === 'player') {
                // 플레이어 투사체 -> 적 충돌
                for (const enemy of enemies) {
                    if (this.checkCollision(proj, enemy.x, enemy.y, enemy.width / 2)) {
                        enemy.takeDamage(proj.damage);
                        proj.hitCount = (proj.hitCount || 0) + 1;

                        // 충돌 파티클 (적 피격)
                        if (this.particleSystem) {
                            this.particleSystem.emit('attack_hit', enemy.x, enemy.y, {
                                count: 8,
                                color: proj.color
                            });
                        }

                        if (!proj.piercing || proj.hitCount >= (proj.maxHits || 1)) {
                            shouldRemove = true;
                            break;
                        }
                    }
                }
            } else {
                // 적/보스 투사체 -> 플레이어 충돌
                // Player width is private, using default 32/2 = 16
                if (this.checkCollision(proj, player.x, player.y, 16)) {
                    player.takeDamage(proj.damage);

                    // 충돌 파티클 (플레이어 피격은 Player.takeDamage 콜백에서 처리됨)
                    // 여기서는 투사체 소멸 효과만 추가
                    if (this.particleSystem) {
                        this.particleSystem.emit('sparkle', proj.x, proj.y, {
                            count: 6,
                            color: proj.color
                        });
                    }

                    shouldRemove = true;
                }
            }

            if (shouldRemove) {
                // 투사체 소멸 파티클
                if (this.particleSystem && proj.owner === 'player') {
                    this.particleSystem.emit('sparkle', proj.x, proj.y, {
                        count: 5,
                        color: proj.color
                    });
                }
                this.projectiles.splice(i, 1);
            }
        }
    }

    /**
     * 호밍 업데이트
     */
    private updateHoming(proj: Projectile, deltaTime: number): void {
        if (!proj.target) return;

        const dx = proj.target.x - proj.x;
        const dy = proj.target.y - proj.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            const targetAngle = Math.atan2(dy, dx);
            const currentAngle = Math.atan2(proj.velocityY, proj.velocityX);

            // 각도 차이 계산
            let angleDiff = targetAngle - currentAngle;
            while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
            while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

            // 부드러운 회전 (초당 3 라디안)
            const turnSpeed = 3.0;
            const turn = Math.sign(angleDiff) * Math.min(Math.abs(angleDiff), turnSpeed * deltaTime);
            const newAngle = currentAngle + turn;

            // 속도 유지하며 방향만 변경
            const speed = Math.sqrt(proj.velocityX * proj.velocityX + proj.velocityY * proj.velocityY);
            proj.velocityX = Math.cos(newAngle) * speed;
            proj.velocityY = Math.sin(newAngle) * speed;
        }
    }

    /**
     * 충돌 감지
     */
    private checkCollision(proj: Projectile, targetX: number, targetY: number, targetRadius: number): boolean {
        const dx = proj.x - targetX;
        const dy = proj.y - targetY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        return distance < proj.radius + targetRadius;
    }

    /**
     * 기본 색상
     */
    private getDefaultColor(owner: 'player' | 'enemy' | 'boss'): string {
        switch (owner) {
            case 'player': return '#00FFFF'; // 청록색
            case 'boss': return '#FF00FF'; // 마젠타
            case 'enemy': return '#FF4444'; // 빨강
        }
    }

    /**
     * 렌더링
     */
    render(renderer: Renderer, camera: Camera): void {
        const ctx = renderer.getContext();

        for (const proj of this.projectiles) {
            const screenPos = camera.worldToScreen(proj.x, proj.y);

            // 생명 시간 기반 투명도
            const lifePercent = proj.lifetime / proj.maxLifetime;
            const alpha = 1 - lifePercent * 0.3; // 점점 투명해짐

            ctx.save();
            ctx.globalAlpha = alpha;

            // 투사체 그리기
            ctx.fillStyle = proj.color;
            ctx.beginPath();
            ctx.arc(screenPos.x, screenPos.y, proj.radius, 0, Math.PI * 2);
            ctx.fill();

            // 외곽선
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 2;
            ctx.stroke();

            // 호밍 투사체는 꼬리 효과
            if (proj.homing) {
                const tailLength = 20;
                const tailX = screenPos.x - (proj.velocityX / Math.abs(proj.velocityX + proj.velocityY)) * tailLength;
                const tailY = screenPos.y - (proj.velocityY / Math.abs(proj.velocityX + proj.velocityY)) * tailLength;

                ctx.strokeStyle = proj.color;
                ctx.lineWidth = proj.radius;
                ctx.globalAlpha = alpha * 0.5;
                ctx.beginPath();
                ctx.moveTo(tailX, tailY);
                ctx.lineTo(screenPos.x, screenPos.y);
                ctx.stroke();
            }

            ctx.restore();
        }
    }

    /**
     * 투사체 수 가져오기
     */
    getProjectileCount(): number {
        return this.projectiles.length;
    }

    /**
     * 모든 투사체 제거
     */
    clear(): void {
        this.projectiles = [];
    }

    /**
     * 특정 소유자의 투사체만 제거
     */
    clearByOwner(owner: 'player' | 'enemy' | 'boss'): void {
        this.projectiles = this.projectiles.filter(p => p.owner !== owner);
    }
}
