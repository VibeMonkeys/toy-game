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

    // 타일 색상 (동굴 스타일 - 벽은 갈색, 바닥은 회색)
    private readonly TILE_COLORS = {
        WALL: '#5c4033',        // 갈색 동굴 벽
        FLOOR: '#2d3142',       // 회색 돌바닥
        CORRIDOR: '#3a3f51',    // 복도
        DOOR: '#8b6f47'         // 나무 문
    };

    // 타일 테두리 색상
    private readonly TILE_BORDERS = {
        WALL: '#3d2b1f',        // 진한 갈색
        FLOOR: '#1a1d2e',
        CORRIDOR: '#252836',
        DOOR: '#5c4a30'
    };

    // 벽 하이라이트 색상 (흙/바위 느낌)
    private readonly WALL_HIGHLIGHTS = [
        '#7d5c4a',
        '#6b4e3d',
        '#8a6a52'
    ];

    constructor() {
        this.dungeonGenerator = new DungeonGenerator({
            width: 150,  // 맵 크기 대폭 증가 (RPG 스타일)
            height: 100,
            minRoomSize: { width: 20, height: 20 },  // 방 크기 크게 증가
            maxRoomSize: { width: 35, height: 35 },
            roomCount: { min: 10, max: 15 },  // 방 개수 증가
            corridorWidth: 4,  // 복도 폭 증가
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

                const ctx = renderer.getContext();

                // 타일 기본 색상
                const color = this.getTileColor(tile);
                renderer.drawRect(screenX, screenY, this.tileSize, this.tileSize, color);

                // 벽 타일 (동굴 갈색 텍스처)
                if (tile === 0) {
                    // 갈색 그라데이션 (흙/바위 느낌)
                    const gradient = ctx.createLinearGradient(screenX, screenY, screenX + this.tileSize, screenY + this.tileSize);
                    gradient.addColorStop(0, 'rgba(139, 90, 43, 0.4)');  // 밝은 갈색
                    gradient.addColorStop(0.5, 'rgba(92, 64, 51, 0.1)');  // 중간 갈색
                    gradient.addColorStop(1, 'rgba(61, 43, 31, 0.3)');    // 어두운 갈색
                    ctx.fillStyle = gradient;
                    ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);

                    // 바위/흙 텍스처 (랜덤 점들 - 갈색 톤)
                    const seed = x * 1000 + y;
                    ctx.fillStyle = 'rgba(139, 90, 43, 0.15)';  // 밝은 갈색 점
                    for (let i = 0; i < 5; i++) {
                        const px = screenX + ((seed * (i + 1) * 13) % this.tileSize);
                        const py = screenY + ((seed * (i + 2) * 17) % this.tileSize);
                        ctx.fillRect(px, py, 3, 3);
                    }

                    // 어두운 얼룩 (동굴 느낌)
                    ctx.fillStyle = 'rgba(61, 43, 31, 0.3)';
                    for (let i = 0; i < 2; i++) {
                        const px = screenX + ((seed * (i + 3) * 19) % this.tileSize);
                        const py = screenY + ((seed * (i + 4) * 23) % this.tileSize);
                        ctx.fillRect(px, py, 4, 4);
                    }

                    // 벽 윤곽선 하이라이트 (갈색 톤)
                    const highlightColor = this.WALL_HIGHLIGHTS[seed % this.WALL_HIGHLIGHTS.length];
                    ctx.strokeStyle = highlightColor;
                    ctx.lineWidth = 1;
                    ctx.strokeRect(screenX + 1, screenY + 1, this.tileSize - 2, this.tileSize - 2);
                }

                // 바닥 타일 (돌 패턴)
                if (tile === 1 || tile === 2) {
                    // 교차 패턴
                    const tileX_checker = x % 2;
                    const tileY_checker = y % 2;
                    if ((tileX_checker + tileY_checker) % 2 === 0) {
                        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
                        ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);
                    }

                    // 돌 금 (균열)
                    const seed = x * 1000 + y;
                    if (seed % 7 === 0) {
                        ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(screenX + 5, screenY + 10);
                        ctx.lineTo(screenX + this.tileSize - 5, screenY + 20);
                        ctx.stroke();
                    }

                    // 미묘한 하이라이트
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
                    ctx.fillRect(screenX, screenY, this.tileSize / 2, this.tileSize / 2);
                }

                // 문 타일 (나무 질감)
                if (tile === 3) {
                    // 나무 결
                    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
                    ctx.lineWidth = 2;
                    for (let i = 0; i < 3; i++) {
                        ctx.beginPath();
                        ctx.moveTo(screenX, screenY + i * 10 + 5);
                        ctx.lineTo(screenX + this.tileSize, screenY + i * 10 + 5);
                        ctx.stroke();
                    }

                    // 문 손잡이
                    ctx.fillStyle = '#3d3d3d';
                    ctx.beginPath();
                    ctx.arc(screenX + this.tileSize - 8, screenY + this.tileSize / 2, 3, 0, Math.PI * 2);
                    ctx.fill();
                }

                // 타일 테두리
                const borderColor = this.getTileBorderColor(tile);
                ctx.strokeStyle = borderColor;
                ctx.lineWidth = 1;
                ctx.strokeRect(screenX, screenY, this.tileSize, this.tileSize);
            }
        }

        // 방 디버그 렌더링 (개발용) - 주석 처리
        // if (process.env.NODE_ENV === 'development') {
        //     this.renderRoomsDebug(renderer, cameraX, cameraY);
        // }
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
     * 타일 테두리 색상
     */
    private getTileBorderColor(tileType: TileType): string {
        switch (tileType) {
            case 0: return this.TILE_BORDERS.WALL;
            case 1: return this.TILE_BORDERS.FLOOR;
            case 2: return this.TILE_BORDERS.CORRIDOR;
            case 3: return this.TILE_BORDERS.DOOR;
            default: return this.TILE_BORDERS.WALL;
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