/**
 * 🗺️ 던전 생성 시스템 (BSP 알고리즘)
 *
 * Binary Space Partitioning을 사용한 절차적 던전 생성
 */

import { TileType, RoomType } from '../types';
import type {
    DungeonMap,
    MapGenerationConfig,
    BSPNode,
    Room,
    Rectangle,
    Position,
    SpawnPoints,
    EnemyType,
    BossType
} from '../types';
import { GAMEPLAY } from '../utils/Constants';

export class DungeonGenerator {
    private config: MapGenerationConfig;
    private tiles: TileType[][];
    private rooms: Room[] = [];
    private rootNode: BSPNode | null = null;

    constructor(config?: Partial<MapGenerationConfig>) {
        // 기본 설정
        this.config = {
            width: config?.width ?? 80,
            height: config?.height ?? 60,
            minRoomSize: config?.minRoomSize ?? { width: 10, height: 10 },
            maxRoomSize: config?.maxRoomSize ?? { width: 18, height: 18 },
            roomCount: config?.roomCount ?? { min: 6, max: 10 },
            corridorWidth: config?.corridorWidth ?? 2,
            maxDepth: config?.maxDepth ?? 4
        };

        // 타일 초기화 (모두 벽으로)
        this.tiles = Array(this.config.height)
            .fill(null)
            .map(() => Array(this.config.width).fill(TileType.WALL));
    }

    /**
     * 던전 생성 메인 메서드
     */
    generate(floor: number, isBossFloor: boolean = false): DungeonMap {
        console.log(`🗺️ ${floor}층 던전 생성 시작...`);

        // 1. BSP로 공간 분할
        this.rootNode = this.createBSPNode({
            x: 0,
            y: 0,
            width: this.config.width,
            height: this.config.height
        });

        this.splitNode(this.rootNode, 0);

        // 2. 각 리프 노드에 방 생성
        this.rooms = [];
        this.createRooms(this.rootNode);

        // 3. 방들을 복도로 연결
        this.connectRooms(this.rootNode);

        // 4. 방 타입 할당
        this.assignRoomTypes(isBossFloor);

        // 5. 스폰 포인트 생성
        const spawnPoints = this.generateSpawnPoints(floor, isBossFloor);

        // 6. 최종 던전 맵 반환
        const startRoom = this.rooms.find(r => r.type === RoomType.START)!;
        const exitRoom = this.rooms.find(r => r.type === RoomType.EXIT)!;

        console.log(`✅ 던전 생성 완료: ${this.rooms.length}개 방`);

        return {
            width: this.config.width,
            height: this.config.height,
            tiles: this.tiles,
            rooms: this.rooms,
            startRoom,
            exitRoom,
            spawnPoints
        };
    }

    /**
     * BSP 노드 생성
     */
    private createBSPNode(bounds: Rectangle): BSPNode {
        return {
            bounds,
            room: null,
            leftChild: null,
            rightChild: null
        };
    }

    /**
     * BSP 노드를 재귀적으로 분할
     */
    private splitNode(node: BSPNode, depth: number): void {
        // 최대 깊이 도달 또는 공간이 너무 작으면 중단
        if (depth >= this.config.maxDepth ||
            node.bounds.width < this.config.minRoomSize.width * 2 ||
            node.bounds.height < this.config.minRoomSize.height * 2) {
            return;
        }

        // 수평/수직 분할 결정
        const splitHorizontal = Math.random() > 0.5;

        if (splitHorizontal) {
            // 수평 분할 (위/아래)
            const splitY = Math.floor(
                node.bounds.y +
                this.config.minRoomSize.height +
                Math.random() * (node.bounds.height - this.config.minRoomSize.height * 2)
            );

            node.leftChild = this.createBSPNode({
                x: node.bounds.x,
                y: node.bounds.y,
                width: node.bounds.width,
                height: splitY - node.bounds.y
            });

            node.rightChild = this.createBSPNode({
                x: node.bounds.x,
                y: splitY,
                width: node.bounds.width,
                height: node.bounds.y + node.bounds.height - splitY
            });
        } else {
            // 수직 분할 (좌/우)
            const splitX = Math.floor(
                node.bounds.x +
                this.config.minRoomSize.width +
                Math.random() * (node.bounds.width - this.config.minRoomSize.width * 2)
            );

            node.leftChild = this.createBSPNode({
                x: node.bounds.x,
                y: node.bounds.y,
                width: splitX - node.bounds.x,
                height: node.bounds.height
            });

            node.rightChild = this.createBSPNode({
                x: splitX,
                y: node.bounds.y,
                width: node.bounds.x + node.bounds.width - splitX,
                height: node.bounds.height
            });
        }

        // 자식 노드도 재귀적으로 분할
        if (node.leftChild) this.splitNode(node.leftChild, depth + 1);
        if (node.rightChild) this.splitNode(node.rightChild, depth + 1);
    }

    /**
     * 리프 노드에 방 생성
     */
    private createRooms(node: BSPNode): void {
        if (node.leftChild || node.rightChild) {
            // 내부 노드면 자식들 처리
            if (node.leftChild) this.createRooms(node.leftChild);
            if (node.rightChild) this.createRooms(node.rightChild);
        } else {
            // 리프 노드면 방 생성
            const bounds = node.bounds;
            const roomWidth = Math.floor(
                this.config.minRoomSize.width +
                Math.random() * (Math.min(this.config.maxRoomSize.width, bounds.width - 2) - this.config.minRoomSize.width)
            );
            const roomHeight = Math.floor(
                this.config.minRoomSize.height +
                Math.random() * (Math.min(this.config.maxRoomSize.height, bounds.height - 2) - this.config.minRoomSize.height)
            );

            const roomX = bounds.x + Math.floor((bounds.width - roomWidth) / 2);
            const roomY = bounds.y + Math.floor((bounds.height - roomHeight) / 2);

            const room: Room = {
                bounds: { x: roomX, y: roomY, width: roomWidth, height: roomHeight },
                center: {
                    x: roomX + Math.floor(roomWidth / 2),
                    y: roomY + Math.floor(roomHeight / 2)
                },
                type: RoomType.COMBAT,
                connections: []
            };

            // 타일에 방 그리기
            this.carveRoom(room.bounds);

            node.room = room;
            this.rooms.push(room);
        }
    }

    /**
     * 방을 타일에 새김
     */
    private carveRoom(bounds: Rectangle): void {
        for (let y = bounds.y; y < bounds.y + bounds.height; y++) {
            for (let x = bounds.x; x < bounds.x + bounds.width; x++) {
                if (y >= 0 && y < this.config.height && x >= 0 && x < this.config.width) {
                    this.tiles[y][x] = TileType.FLOOR;
                }
            }
        }
    }

    /**
     * BSP 트리를 순회하며 방들을 복도로 연결
     */
    private connectRooms(node: BSPNode): void {
        if (!node.leftChild || !node.rightChild) return;

        // 왼쪽/오른쪽 자식의 방 찾기
        const leftRoom = this.getRandomLeafRoom(node.leftChild);
        const rightRoom = this.getRandomLeafRoom(node.rightChild);

        if (leftRoom && rightRoom) {
            this.createCorridor(leftRoom.center, rightRoom.center);
            leftRoom.connections.push(rightRoom);
            rightRoom.connections.push(leftRoom);
        }

        // 자식 노드들도 연결
        this.connectRooms(node.leftChild);
        this.connectRooms(node.rightChild);
    }

    /**
     * 리프 노드에서 랜덤 방 가져오기
     */
    private getRandomLeafRoom(node: BSPNode): Room | null {
        if (node.room) return node.room;

        const rooms: Room[] = [];
        if (node.leftChild) {
            const leftRoom = this.getRandomLeafRoom(node.leftChild);
            if (leftRoom) rooms.push(leftRoom);
        }
        if (node.rightChild) {
            const rightRoom = this.getRandomLeafRoom(node.rightChild);
            if (rightRoom) rooms.push(rightRoom);
        }

        return rooms.length > 0 ? rooms[Math.floor(Math.random() * rooms.length)] : null;
    }

    /**
     * 두 지점을 L자 복도로 연결
     */
    private createCorridor(from: Position, to: Position): void {
        const corridorWidth = this.config.corridorWidth;

        // 수평 먼저, 그다음 수직 (L자 형태)
        if (Math.random() > 0.5) {
            // 수평 → 수직
            this.carveHorizontalCorridor(from.x, to.x, from.y, corridorWidth);
            this.carveVerticalCorridor(from.y, to.y, to.x, corridorWidth);
        } else {
            // 수직 → 수평
            this.carveVerticalCorridor(from.y, to.y, from.x, corridorWidth);
            this.carveHorizontalCorridor(from.x, to.x, to.y, corridorWidth);
        }
    }

    /**
     * 수평 복도 새김
     */
    private carveHorizontalCorridor(x1: number, x2: number, y: number, width: number): void {
        const startX = Math.min(x1, x2);
        const endX = Math.max(x1, x2);

        for (let x = startX; x <= endX; x++) {
            for (let dy = 0; dy < width; dy++) {
                const ty = y + dy - Math.floor(width / 2);
                if (ty >= 0 && ty < this.config.height && x >= 0 && x < this.config.width) {
                    this.tiles[ty][x] = TileType.CORRIDOR;
                }
            }
        }
    }

    /**
     * 수직 복도 새김
     */
    private carveVerticalCorridor(y1: number, y2: number, x: number, width: number): void {
        const startY = Math.min(y1, y2);
        const endY = Math.max(y1, y2);

        for (let y = startY; y <= endY; y++) {
            for (let dx = 0; dx < width; dx++) {
                const tx = x + dx - Math.floor(width / 2);
                if (y >= 0 && y < this.config.height && tx >= 0 && tx < this.config.width) {
                    this.tiles[y][tx] = TileType.CORRIDOR;
                }
            }
        }
    }

    /**
     * 방 타입 할당
     */
    private assignRoomTypes(isBossFloor: boolean): void {
        if (this.rooms.length === 0) return;

        // 1. 시작 방 (첫 번째 방)
        this.rooms[0].type = RoomType.START;

        // 2. 출구 방 (가장 먼 방)
        let maxDist = 0;
        let exitRoomIndex = this.rooms.length - 1;

        for (let i = 1; i < this.rooms.length; i++) {
            const dist = this.manhattanDistance(this.rooms[0].center, this.rooms[i].center);
            if (dist > maxDist) {
                maxDist = dist;
                exitRoomIndex = i;
            }
        }

        this.rooms[exitRoomIndex].type = RoomType.EXIT;

        // 3. 보스 방 (보스층만)
        if (isBossFloor && this.rooms.length > 2) {
            // 출구 바로 앞 방을 보스방으로
            let bossRoomIndex = exitRoomIndex - 1;
            if (bossRoomIndex === 0) bossRoomIndex = 1;
            this.rooms[bossRoomIndex].type = RoomType.BOSS;
        }

        // 4. 특수 방 랜덤 배치
        for (let i = 1; i < this.rooms.length; i++) {
            if (this.rooms[i].type !== RoomType.COMBAT) continue;

            const rand = Math.random();
            if (rand < 0.15) {
                this.rooms[i].type = RoomType.SHOP;
            } else if (rand < 0.30) {
                this.rooms[i].type = RoomType.TREASURE;
            } else if (rand < 0.40) {
                this.rooms[i].type = RoomType.SHRINE;
            }
        }
    }

    /**
     * 맨해튼 거리 계산
     */
    private manhattanDistance(a: Position, b: Position): number {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }

    /**
     * 스폰 포인트 생성
     */
    private generateSpawnPoints(floor: number, isBossFloor: boolean): SpawnPoints {
        const startRoom = this.rooms.find(r => r.type === RoomType.START)!;
        const exitRoom = this.rooms.find(r => r.type === RoomType.EXIT)!;

        const spawnPoints: SpawnPoints = {
            player: {
                x: startRoom.center.x * 32, // 타일 크기 32px
                y: startRoom.center.y * 32
            },
            enemies: [],
            items: [],
            npcs: [],
            exits: [{
                x: exitRoom.center.x * 32,
                y: exitRoom.center.y * 32,
                type: 'next_floor',
                targetFloor: floor + 1
            }]
        };

        // 적 스폰
        for (const room of this.rooms) {
            if (room.type === RoomType.START) continue;

            const enemyCount = this.getEnemyCountForRoom(room.type);

            for (let i = 0; i < enemyCount; i++) {
                const spawnX = room.bounds.x + 2 + Math.floor(Math.random() * (room.bounds.width - 4));
                const spawnY = room.bounds.y + 2 + Math.floor(Math.random() * (room.bounds.height - 4));

                spawnPoints.enemies.push({
                    x: spawnX * 32,
                    y: spawnY * 32,
                    type: this.getRandomEnemyType(floor),
                    isBoss: room.type === RoomType.BOSS
                });
            }
        }

        return spawnPoints;
    }

    /**
     * 방 타입별 적 수
     */
    private getEnemyCountForRoom(type: RoomType): number {
        switch (type) {
            case RoomType.COMBAT: return 3 + Math.floor(Math.random() * 3);
            case RoomType.TREASURE: return 2 + Math.floor(Math.random() * 2);
            case RoomType.BOSS: return 3; // 보스 + 졸개
            default: return 0;
        }
    }

    /**
     * 층수별 랜덤 적 타입
     */
    private getRandomEnemyType(floor: number): EnemyType | BossType {
        if (floor <= 2) {
            return Math.random() < 0.7 ? 'goblin' : 'skeleton';
        } else if (floor <= 4) {
            const rand = Math.random();
            if (rand < 0.5) return 'goblin';
            if (rand < 0.8) return 'orc';
            return 'skeleton';
        } else if (floor <= 6) {
            const rand = Math.random();
            if (rand < 0.4) return 'orc';
            if (rand < 0.7) return 'skeleton';
            return 'troll';
        } else {
            const rand = Math.random();
            if (rand < 0.4) return 'troll';
            if (rand < 0.7) return 'skeleton';
            return 'wraith';
        }
    }
}