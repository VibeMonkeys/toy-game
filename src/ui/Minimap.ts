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

        // 배경 (반투명 패널)
        ctx.fillStyle = 'rgba(44, 62, 80, 0.9)';
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // 내부 그림자 효과
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(this.x + 2, this.y + 2, this.width - 4, this.height - 4);

        // 테두리 (금색)
        ctx.strokeStyle = '#5D6D7E';
        ctx.lineWidth = 3;
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

            // 방 배경
            ctx.fillStyle = color;
            ctx.fillRect(roomX, roomY, Math.max(2, roomW), Math.max(2, roomH));

            // 방 테두리 (약간 어둡게)
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
            ctx.lineWidth = 1;
            ctx.strokeRect(roomX, roomY, Math.max(2, roomW), Math.max(2, roomH));
        }

        // 플레이어 위치 (발광 효과)
        const playerMinimapX = offsetX + (playerPos.x / tileSize) * tileSize * scale;
        const playerMinimapY = offsetY + (playerPos.y / tileSize) * tileSize * scale;

        // 플레이어 외곽 발광
        const gradient = ctx.createRadialGradient(
            playerMinimapX, playerMinimapY, 0,
            playerMinimapX, playerMinimapY, 6
        );
        gradient.addColorStop(0, 'rgba(74, 144, 226, 0.8)');
        gradient.addColorStop(1, 'rgba(74, 144, 226, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(playerMinimapX - 6, playerMinimapY - 6, 12, 12);

        // 플레이어 점
        ctx.fillStyle = '#4A90E2';
        ctx.beginPath();
        ctx.arc(playerMinimapX, playerMinimapY, 3, 0, Math.PI * 2);
        ctx.fill();

        // 플레이어 테두리
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1;
        ctx.stroke();

        // 적 위치 (작은 빨간 점)
        for (const enemy of enemies) {
            const enemyX = offsetX + (enemy.x / tileSize) * tileSize * scale;
            const enemyY = offsetY + (enemy.y / tileSize) * tileSize * scale;

            ctx.fillStyle = '#ff4444';
            ctx.beginPath();
            ctx.arc(enemyX, enemyY, 2, 0, Math.PI * 2);
            ctx.fill();
        }

        // 타이틀 바
        ctx.fillStyle = 'rgba(52, 73, 94, 0.95)';
        ctx.fillRect(this.x, this.y - 25, this.width, 25);
        ctx.strokeStyle = '#5D6D7E';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y - 25, this.width, 25);

        // 라벨
        ctx.fillStyle = '#ECF0F1';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🗺️ MAP', this.x + this.width / 2, this.y - 7);
    }
}