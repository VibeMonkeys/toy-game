/**
 * 🗺️ 미니맵 시스템
 *
 * 현재 맵을 간략하게 표시
 */

import { Renderer } from '../systems/Renderer';
import type { DungeonMap, Position } from '../types';
import { SCREEN } from '../utils/Constants';

export class Minimap {
    private width: number = 150;
    private height: number = 150;
    private x: number;
    private y: number;
    private scale: number = 2; // 타일당 픽셀

    constructor() {
        // 우측 하단에 배치
        this.x = SCREEN.WIDTH - this.width - 20;
        this.y = SCREEN.HEIGHT - this.height - 20;
    }

    /**
     * 미니맵 렌더링
     */
    render(
        renderer: Renderer,
        dungeonMap: DungeonMap | null,
        playerPos: Position,
        enemies: { x: number; y: number }[]
    ): void {
        if (!dungeonMap) return;

        const ctx = renderer.getContext();

        // 배경
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // 테두리
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);

        // 맵 렌더링 (축소)
        const tileSize = 32;
        const mapPixelWidth = dungeonMap.width * tileSize;
        const mapPixelHeight = dungeonMap.height * tileSize;

        // 축소 비율 계산
        const scaleX = (this.width - 20) / mapPixelWidth;
        const scaleY = (this.height - 20) / mapPixelHeight;
        const scale = Math.min(scaleX, scaleY);

        // 중앙 정렬 오프셋
        const offsetX = this.x + 10 + (this.width - 20 - mapPixelWidth * scale) / 2;
        const offsetY = this.y + 10 + (this.height - 20 - mapPixelHeight * scale) / 2;

        // 방 렌더링
        for (const room of dungeonMap.rooms) {
            const roomX = offsetX + room.bounds.x * tileSize * scale;
            const roomY = offsetY + room.bounds.y * tileSize * scale;
            const roomW = room.bounds.width * tileSize * scale;
            const roomH = room.bounds.height * tileSize * scale;

            // 방 타입별 색상
            let color = '#444444';
            switch (room.type) {
                case 'start':
                    color = '#00ff00';
                    break;
                case 'exit':
                    color = '#ff0000';
                    break;
                case 'boss':
                    color = '#ff00ff';
                    break;
                case 'treasure':
                    color = '#ffff00';
                    break;
                case 'shop':
                    color = '#00ffff';
                    break;
                default:
                    color = '#666666';
            }

            ctx.fillStyle = color;
            ctx.fillRect(roomX, roomY, Math.max(2, roomW), Math.max(2, roomH));
        }

        // 플레이어 위치 (빨간 점)
        const playerMinimapX = offsetX + (playerPos.x / tileSize) * tileSize * scale;
        const playerMinimapY = offsetY + (playerPos.y / tileSize) * tileSize * scale;

        ctx.fillStyle = '#4A90E2'; // 플레이어 색상
        ctx.beginPath();
        ctx.arc(playerMinimapX, playerMinimapY, 3, 0, Math.PI * 2);
        ctx.fill();

        // 적 위치 (작은 빨간 점)
        ctx.fillStyle = '#ff4444';
        for (const enemy of enemies) {
            const enemyX = offsetX + (enemy.x / tileSize) * tileSize * scale;
            const enemyY = offsetY + (enemy.y / tileSize) * tileSize * scale;

            ctx.beginPath();
            ctx.arc(enemyX, enemyY, 1.5, 0, Math.PI * 2);
            ctx.fill();
        }

        // 라벨
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('MINIMAP', this.x + this.width / 2, this.y - 5);
    }
}