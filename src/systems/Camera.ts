/**
 * 📹 카메라 시스템
 *
 * 플레이어를 따라다니는 부드러운 카메라 구현
 */

import type { Position } from '../types';
import { SCREEN } from '../utils/Constants';

export class Camera {
    x: number = 0;
    y: number = 0;
    private targetX: number = 0;
    private targetY: number = 0;

    // 카메라 따라가기 속도 (0 ~ 1, 1에 가까울수록 빠름)
    private smoothness: number = 0.1;

    // 맵 경계
    private mapWidth: number = 0;
    private mapHeight: number = 0;

    constructor() {
        console.log('📹 Camera 초기화');
    }

    /**
     * 맵 크기 설정 (카메라 경계 제한용)
     */
    setMapBounds(width: number, height: number): void {
        this.mapWidth = width;
        this.mapHeight = height;
    }

    /**
     * 타겟 설정 (플레이어 위치)
     */
    setTarget(position: Position): void {
        // 카메라를 화면 중앙에 맞추기 위해 플레이어 위치에서 화면 절반만큼 빼기
        this.targetX = position.x - SCREEN.WIDTH / 2;
        this.targetY = position.y - SCREEN.HEIGHT / 2;
    }

    /**
     * 카메라 즉시 이동 (순간이동)
     */
    snapToTarget(position: Position): void {
        this.setTarget(position);
        this.x = this.targetX;
        this.y = this.targetY;
        this.clampToMapBounds();
    }

    /**
     * 카메라 업데이트 (부드러운 이동)
     */
    update(): void {
        // 선형 보간 (Lerp)
        this.x += (this.targetX - this.x) * this.smoothness;
        this.y += (this.targetY - this.y) * this.smoothness;

        // 맵 경계 제한
        this.clampToMapBounds();
    }

    /**
     * 맵 경계 내로 제한
     */
    private clampToMapBounds(): void {
        // 맵이 화면보다 작으면 중앙 정렬
        if (this.mapWidth < SCREEN.WIDTH) {
            this.x = -(SCREEN.WIDTH - this.mapWidth) / 2;
        } else {
            this.x = Math.max(0, Math.min(this.x, this.mapWidth - SCREEN.WIDTH));
        }

        if (this.mapHeight < SCREEN.HEIGHT) {
            this.y = -(SCREEN.HEIGHT - this.mapHeight) / 2;
        } else {
            this.y = Math.max(0, Math.min(this.y, this.mapHeight - SCREEN.HEIGHT));
        }
    }

    /**
     * 화면 좌표를 월드 좌표로 변환
     */
    screenToWorld(screenX: number, screenY: number): Position {
        return {
            x: screenX + this.x,
            y: screenY + this.y
        };
    }

    /**
     * 월드 좌표를 화면 좌표로 변환
     */
    worldToScreen(worldX: number, worldY: number): Position {
        return {
            x: worldX - this.x,
            y: worldY - this.y
        };
    }

    /**
     * 카메라 흔들림 효과 (데미지 받을 때 등)
     */
    shake(intensity: number = 10, duration: number = 200): void {
        const originalX = this.x;
        const originalY = this.y;
        const startTime = Date.now();

        const shakeInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;

            if (elapsed >= duration) {
                this.x = originalX;
                this.y = originalY;
                clearInterval(shakeInterval);
                return;
            }

            // 랜덤 흔들림
            const progress = elapsed / duration;
            const currentIntensity = intensity * (1 - progress);

            this.x = originalX + (Math.random() - 0.5) * currentIntensity;
            this.y = originalY + (Math.random() - 0.5) * currentIntensity;
        }, 16); // ~60 FPS
    }

    /**
     * 부드러움 정도 설정
     */
    setSmoothness(value: number): void {
        this.smoothness = Math.max(0, Math.min(1, value));
    }

    /**
     * 현재 위치
     */
    getPosition(): Position {
        return { x: this.x, y: this.y };
    }
}