/**
 * ✨ 파티클 시스템
 *
 * 다양한 시각 효과 파티클 관리
 */

import { Particle } from '../types';
import { Renderer } from './Renderer';
import { Camera } from './Camera';

type ParticlePreset =
    | 'attack_slash'
    | 'attack_hit'
    | 'level_up'
    | 'item_collect'
    | 'explosion'
    | 'heal'
    | 'boss_telegraph'
    | 'sparkle';

export class ParticleSystem {
    private particles: Particle[] = [];

    constructor() {}

    /**
     * 프리셋 파티클 생성
     */
    emit(preset: ParticlePreset, x: number, y: number, options?: { count?: number; color?: string }): void {
        const count = options?.count || this.getDefaultCount(preset);
        const color = options?.color || this.getDefaultColor(preset);

        for (let i = 0; i < count; i++) {
            const particle = this.createParticle(preset, x, y, color);
            this.particles.push(particle);
        }
    }

    /**
     * 커스텀 파티클 생성
     */
    createCustom(
        x: number,
        y: number,
        velocityX: number,
        velocityY: number,
        life: number,
        color: string,
        size: number
    ): void {
        this.particles.push({
            x,
            y,
            velocityX,
            velocityY,
            life: 0,
            maxLife: life,
            color,
            size,
            alpha: 1.0
        });
    }

    /**
     * 업데이트
     */
    update(deltaTime: number): void {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];

            // 위치 업데이트
            p.x += p.velocityX * deltaTime;
            p.y += p.velocityY * deltaTime;

            // 중력 적용 (일부 파티클)
            p.velocityY += 200 * deltaTime;

            // 생명 시간 증가
            p.life += deltaTime;

            // 투명도 감소
            const lifePercent = p.life / p.maxLife;
            p.alpha = 1 - lifePercent;

            // 만료된 파티클 제거
            if (p.life >= p.maxLife) {
                this.particles.splice(i, 1);
            }
        }
    }

    /**
     * 렌더링
     */
    render(renderer: Renderer, camera: Camera): void {
        const ctx = renderer.getContext();

        for (const p of this.particles) {
            const screenPos = camera.worldToScreen(p.x, p.y);

            ctx.save();
            ctx.globalAlpha = p.alpha;

            // 파티클 그리기
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(screenPos.x, screenPos.y, p.size, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        }
    }

    /**
     * 파티클 개수
     */
    getParticleCount(): number {
        return this.particles.length;
    }

    /**
     * 모든 파티클 제거
     */
    clear(): void {
        this.particles = [];
    }

    /**
     * 프리셋별 파티클 생성
     */
    private createParticle(preset: ParticlePreset, x: number, y: number, color: string): Particle {
        switch (preset) {
            case 'attack_slash':
                return {
                    x,
                    y,
                    velocityX: (Math.random() - 0.5) * 200,
                    velocityY: (Math.random() - 0.5) * 200,
                    life: 0,
                    maxLife: 0.3,
                    color,
                    size: 4 + Math.random() * 4,
                    alpha: 1.0
                };

            case 'attack_hit':
                const angle = Math.random() * Math.PI * 2;
                const speed = 100 + Math.random() * 100;
                return {
                    x,
                    y,
                    velocityX: Math.cos(angle) * speed,
                    velocityY: Math.sin(angle) * speed,
                    life: 0,
                    maxLife: 0.4,
                    color,
                    size: 3 + Math.random() * 3,
                    alpha: 1.0
                };

            case 'level_up':
                const upAngle = Math.random() * Math.PI * 2;
                const upSpeed = 50 + Math.random() * 50;
                return {
                    x: x + (Math.random() - 0.5) * 30,
                    y: y + (Math.random() - 0.5) * 30,
                    velocityX: Math.cos(upAngle) * upSpeed,
                    velocityY: -100 - Math.random() * 100, // 위로 상승
                    life: 0,
                    maxLife: 1.5,
                    color: ['#FFD700', '#FFFF00', '#FFA500'][Math.floor(Math.random() * 3)],
                    size: 6 + Math.random() * 6,
                    alpha: 1.0
                };

            case 'item_collect':
                return {
                    x: x + (Math.random() - 0.5) * 20,
                    y: y + (Math.random() - 0.5) * 20,
                    velocityX: (Math.random() - 0.5) * 50,
                    velocityY: -150 - Math.random() * 50,
                    life: 0,
                    maxLife: 0.8,
                    color: color,
                    size: 4 + Math.random() * 4,
                    alpha: 1.0
                };

            case 'explosion':
                const expAngle = Math.random() * Math.PI * 2;
                const expSpeed = 150 + Math.random() * 150;
                return {
                    x,
                    y,
                    velocityX: Math.cos(expAngle) * expSpeed,
                    velocityY: Math.sin(expAngle) * expSpeed,
                    life: 0,
                    maxLife: 0.6,
                    color: ['#FF4500', '#FF6347', '#FFA500'][Math.floor(Math.random() * 3)],
                    size: 8 + Math.random() * 8,
                    alpha: 1.0
                };

            case 'heal':
                return {
                    x: x + (Math.random() - 0.5) * 20,
                    y: y + Math.random() * 20,
                    velocityX: (Math.random() - 0.5) * 30,
                    velocityY: -80 - Math.random() * 40,
                    life: 0,
                    maxLife: 1.0,
                    color: '#00FF00',
                    size: 4 + Math.random() * 4,
                    alpha: 1.0
                };

            case 'sparkle':
                return {
                    x: x + (Math.random() - 0.5) * 10,
                    y: y + (Math.random() - 0.5) * 10,
                    velocityX: (Math.random() - 0.5) * 20,
                    velocityY: (Math.random() - 0.5) * 20,
                    life: 0,
                    maxLife: 0.5,
                    color: '#FFFFFF',
                    size: 2 + Math.random() * 2,
                    alpha: 1.0
                };

            case 'boss_telegraph':
                return {
                    x: x + (Math.random() - 0.5) * 50,
                    y: y + (Math.random() - 0.5) * 50,
                    velocityX: 0,
                    velocityY: 0,
                    life: 0,
                    maxLife: 1.0,
                    color: '#FF0000',
                    size: 6 + Math.random() * 6,
                    alpha: 1.0
                };

            default:
                return {
                    x,
                    y,
                    velocityX: 0,
                    velocityY: 0,
                    life: 0,
                    maxLife: 1.0,
                    color: '#FFFFFF',
                    size: 4,
                    alpha: 1.0
                };
        }
    }

    /**
     * 프리셋별 기본 개수
     */
    private getDefaultCount(preset: ParticlePreset): number {
        switch (preset) {
            case 'attack_slash': return 8;
            case 'attack_hit': return 12;
            case 'level_up': return 30;
            case 'item_collect': return 15;
            case 'explosion': return 25;
            case 'heal': return 10;
            case 'sparkle': return 5;
            case 'boss_telegraph': return 20;
            default: return 10;
        }
    }

    /**
     * 프리셋별 기본 색상
     */
    private getDefaultColor(preset: ParticlePreset): string {
        switch (preset) {
            case 'attack_slash': return '#FFFFFF';
            case 'attack_hit': return '#FFFF00';
            case 'level_up': return '#FFD700';
            case 'item_collect': return '#00FFFF';
            case 'explosion': return '#FF4500';
            case 'heal': return '#00FF00';
            case 'sparkle': return '#FFFFFF';
            case 'boss_telegraph': return '#FF0000';
            default: return '#FFFFFF';
        }
    }
}
