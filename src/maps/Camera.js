import { CONSTANTS } from '../utils/Constants.js';

export class Camera {
    constructor(canvas) {
        this.x = 0;
        this.y = 0;
        this.viewWidth = Math.floor(canvas.width / CONSTANTS.TILE_SIZE);
        this.viewHeight = Math.floor(canvas.height / CONSTANTS.TILE_SIZE);
    }

    update(targetX, targetY) {
        // 카메라를 플레이어 중심으로 이동
        this.x = targetX - Math.floor(this.viewWidth / 2);
        this.y = targetY - Math.floor(this.viewHeight / 2);

        // 맵 경계 제한
        this.x = Math.max(0, Math.min(CONSTANTS.MAP_WIDTH - this.viewWidth, this.x));
        this.y = Math.max(0, Math.min(CONSTANTS.MAP_HEIGHT - this.viewHeight, this.y));
    }

    worldToScreen(worldX, worldY) {
        return {
            x: (worldX - this.x) * CONSTANTS.TILE_SIZE,
            y: (worldY - this.y) * CONSTANTS.TILE_SIZE
        };
    }

    screenToWorld(screenX, screenY) {
        return {
            x: Math.floor(screenX / CONSTANTS.TILE_SIZE) + this.x,
            y: Math.floor(screenY / CONSTANTS.TILE_SIZE) + this.y
        };
    }

    isInView(worldX, worldY) {
        return worldX >= this.x && worldX < this.x + this.viewWidth &&
               worldY >= this.y && worldY < this.y + this.viewHeight;
    }
};