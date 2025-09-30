/**
 * 🗺️ 맵 관리 시스템
 *
 * 던전 생성 및 타일 렌더링을 담당합니다.
 */

import { DungeonGenerator } from './DungeonGenerator';
import { Renderer } from './Renderer';
import { TileType } from '../types';
import type { DungeonMap, Position } from '../types';
import { SCREEN, COLORS } from '../utils/Constants';

export class MapManager {
    private dungeonGenerator: DungeonGenerator;
    private currentMap: DungeonMap | null = null;
    private tileSize: number = 32; // 타일 크기 (픽셀)

    // 타일 색상
    private readonly TILE_COLORS = {
        WALL: '#1a1a2e',
        FLOOR: '#2d3142',
        CORRIDOR: '#3a3f51',
        DOOR: '#5c4a42'
    };

    constructor() {
        this.dungeonGenerator = new DungeonGenerator({
            width: 80,
            height: 60,
            minRoomSize: { width: 6, height: 6 },
            maxRoomSize: { width: 14, height: 14 },
            roomCount: { min: 6, max: 10 },
            corridorWidth: 2,
            maxDepth: 4
        });
    }

    /**
     * 새로운 층 생성
     */
    generateFloor(floor: number): DungeonMap {
        console.log(`🗺️ MapManager: ${floor}층 생성`);

        const isBossFloor = floor % 5 === 0; // 5층마다 보스
        this.currentMap = this.dungeonGenerator.generate(floor, isBossFloor);

        return this.currentMap;
    }

    /**
     * 현재 맵 가져오기
     */
    getCurrentMap(): DungeonMap | null {
        return this.currentMap;
    }

    /**
     * 맵 렌더링
     */
    render(renderer: Renderer, cameraX: number = 0, cameraY: number = 0): void {
        if (!this.currentMap) return;

        const ctx = renderer.getContext();

        // 화면에 보이는 타일만 렌더링 (최적화)
        const startTileX = Math.max(0, Math.floor(cameraX / this.tileSize));
        const endTileX = Math.min(this.currentMap.width, Math.ceil((cameraX + SCREEN.WIDTH) / this.tileSize));
        const startTileY = Math.max(0, Math.floor(cameraY / this.tileSize));
        const endTileY = Math.min(this.currentMap.height, Math.ceil((cameraY + SCREEN.HEIGHT) / this.tileSize));

        for (let y = startTileY; y < endTileY; y++) {
            for (let x = startTileX; x < endTileX; x++) {
                const tile = this.currentMap.tiles[y][x];
                const screenX = x * this.tileSize - cameraX;
                const screenY = y * this.tileSize - cameraY;

                // 타일 그리기
                const color = this.getTileColor(tile);
                renderer.drawRect(screenX, screenY, this.tileSize, this.tileSize, color);

                // 벽 테두리 (깊이감)
                if (tile === 0) {
                    renderer.drawRectOutline(screenX, screenY, this.tileSize, this.tileSize, '#000000', 1);
                }
            }
        }

        // 방 디버그 렌더링 (개발용)
        if (process.env.NODE_ENV === 'development') {
            this.renderRoomsDebug(renderer, cameraX, cameraY);
        }
    }

    /**
     * 타일 타입별 색상
     */
    private getTileColor(tileType: TileType): string {
        switch (tileType) {
            case 0: return this.TILE_COLORS.WALL;
            case 1: return this.TILE_COLORS.FLOOR;
            case 2: return this.TILE_COLORS.CORRIDOR;
            case 3: return this.TILE_COLORS.DOOR;
            default: return this.TILE_COLORS.WALL;
        }
    }

    /**
     * 방 경계 디버그 렌더링
     */
    private renderRoomsDebug(renderer: Renderer, cameraX: number, cameraY: number): void {
        if (!this.currentMap) return;

        for (const room of this.currentMap.rooms) {
            const screenX = room.bounds.x * this.tileSize - cameraX;
            const screenY = room.bounds.y * this.tileSize - cameraY;
            const width = room.bounds.width * this.tileSize;
            const height = room.bounds.height * this.tileSize;

            // 방 타입별 색상
            let color = COLORS.DEBUG;
            switch (room.type) {
                case 'start': color = '#00ff00'; break;
                case 'exit': color = '#ff0000'; break;
                case 'boss': color = '#ff00ff'; break;
                case 'treasure': color = '#ffff00'; break;
                case 'shop': color = '#00ffff'; break;
            }

            renderer.drawRectOutline(screenX, screenY, width, height, color, 2);

            // 방 중앙에 타입 표시
            renderer.drawText(
                room.type,
                screenX + width / 2,
                screenY + height / 2,
                '12px Arial',
                color,
                'center'
            );
        }
    }

    /**
     * 충돌 체크 (타일 좌표)
     */
    isWall(x: number, y: number): boolean {
        if (!this.currentMap) return true;

        const tileX = Math.floor(x / this.tileSize);
        const tileY = Math.floor(y / this.tileSize);

        if (tileX < 0 || tileX >= this.currentMap.width ||
            tileY < 0 || tileY >= this.currentMap.height) {
            return true;
        }

        return this.currentMap.tiles[tileY][tileX] === 0; // WALL
    }

    /**
     * 충돌 체크 (사각형)
     */
    isColliding(x: number, y: number, width: number, height: number): boolean {
        // 사각형의 4개 모서리 체크
        return (
            this.isWall(x, y) ||
            this.isWall(x + width, y) ||
            this.isWall(x, y + height) ||
            this.isWall(x + width, y + height)
        );
    }

    /**
     * 플레이어 스폰 위치 가져오기
     */
    getPlayerSpawnPosition(): Position {
        if (!this.currentMap) {
            return { x: SCREEN.CENTER_X, y: SCREEN.CENTER_Y };
        }

        return this.currentMap.spawnPoints.player;
    }

    /**
     * 적 스폰 포인트 가져오기
     */
    getEnemySpawnPoints() {
        return this.currentMap?.spawnPoints.enemies ?? [];
    }

    /**
     * 출구 위치 가져오기
     */
    getExitPositions() {
        return this.currentMap?.spawnPoints.exits ?? [];
    }

    /**
     * 타일 크기
     */
    getTileSize(): number {
        return this.tileSize;
    }

    /**
     * 맵 크기 (픽셀)
     */
    getMapSize(): { width: number; height: number } {
        if (!this.currentMap) {
            return { width: 0, height: 0 };
        }

        return {
            width: this.currentMap.width * this.tileSize,
            height: this.currentMap.height * this.tileSize
        };
    }
}