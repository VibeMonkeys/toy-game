import { CONSTANTS } from '../utils/Constants.js';
import { Logger } from '../utils/Logger.js';

export class Minimap {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        
        // 미니맵 상태: 0=숨김, 1=작은미니맵, 2=대형지도
        this.displayMode = 0;
    }

    toggle() {
        // 0 → 1 → 2 → 0 순환
        this.displayMode = (this.displayMode + 1) % 3;
        
        switch(this.displayMode) {
            case 0:
                Logger.debug('🗺️ 미니맵 완전 숨김');
                break;
            case 1:
                Logger.debug('🗺️ 우측 상단 작은 미니맵 표시');
                break;
            case 2:
                Logger.debug('🗺️ 중앙 대형 지도 표시');
                break;
        }
    }

    hide() {
        this.displayMode = 0;
    }

    show() {
        this.displayMode = 1;
    }

    get isVisible() {
        return this.displayMode > 0;
    }

    draw(player, mapManager, gameState) {
        // 숨김 상태면 아무것도 그리지 않음
        if (this.displayMode === 0) {
            return;
        }

        const currentMapData = mapManager.getCurrentMap();
        if (!currentMapData) return;

        // 디스플레이 모드에 따른 설정
        let mapSize, mapX, mapY, showBackground = false;
        
        if (this.displayMode === 1) {
            // 작은 미니맵 (우측 상단)
            mapSize = 180;
            mapX = this.canvas.width - mapSize - 15;
            mapY = 15;
        } else if (this.displayMode === 2) {
            // 대형 지도 (중앙)
            mapSize = Math.min(this.canvas.width * 0.8, this.canvas.height * 0.8);
            mapX = (this.canvas.width - mapSize) / 2;
            mapY = (this.canvas.height - mapSize) / 2;
            showBackground = true;
        }

        // 대형 지도일 때 전체 화면 반투명 배경
        if (showBackground) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }

        // 미니맵 배경
        this.ctx.fillStyle = this.displayMode === 2 ? 'rgba(50, 50, 50, 0.95)' : 'rgba(30, 30, 30, 0.85)';
        this.ctx.fillRect(mapX, mapY, mapSize, mapSize);

        // 미니맵 테두리
        this.ctx.strokeStyle = this.displayMode === 2 ? '#FFD700' : '#FFFFFF';
        this.ctx.lineWidth = this.displayMode === 2 ? 3 : 2;
        this.ctx.strokeRect(mapX, mapY, mapSize, mapSize);

        // 맵 데이터 그리기
        this.drawMapContent(currentMapData, mapX, mapY, mapSize);

        // 게임 오브젝트들 그리기
        this.drawMapObjects(currentMapData, gameState, mapX, mapY, mapSize);

        // 플레이어 위치 표시 (맨 위에)
        this.drawPlayerPosition(player, currentMapData, mapX, mapY, mapSize);

        // 대형 지도일 때 추가 정보 표시
        if (this.displayMode === 2) {
            this.drawMapInfo(currentMapData, mapX, mapY, mapSize);
        }
    }

    drawMapContent(mapData, mapX, mapY, mapSize) {
        if (!mapData || !mapData.data) return;

        const mapWidth = mapData.data[0].length;
        const mapHeight = mapData.data.length;
        const cellSize = mapSize / Math.max(mapWidth, mapHeight);

        // 맵 타일 그리기
        for (let y = 0; y < mapHeight; y++) {
            for (let x = 0; x < mapWidth; x++) {
                const tile = mapData.data[y][x];
                const drawX = mapX + (x * cellSize);
                const drawY = mapY + (y * cellSize);

                // 타일 타입에 따른 색상
                let color = '#333333'; // 기본 어두운 색
                
                switch(tile) {
                    case 0: // 벽
                        color = '#666666';
                        break;
                    case 1: // 바닥
                        color = '#cccccc';
                        break;
                    case 2: // 문
                        color = '#8B4513';
                        break;
                    case 3: // 엘리베이터
                        color = '#FFD700';
                        break;
                    case 4: // 특수 지역
                        color = '#4169E1';
                        break;
                }

                this.ctx.fillStyle = color;
                this.ctx.fillRect(drawX, drawY, cellSize, cellSize);
            }
        }
    }

    drawMapObjects(mapData, gameState, mapX, mapY, mapSize) {
        if (!mapData || !mapData.data) return;

        const mapWidth = mapData.data[0].length;
        const mapHeight = mapData.data.length;
        const cellSize = mapSize / Math.max(mapWidth, mapHeight);

        // NPC 그리기
        if (mapData.npcs) {
            this.ctx.fillStyle = '#FFD700'; // 금색
            for (let npc of mapData.npcs) {
                const npcX = mapX + (npc.x * cellSize);
                const npcY = mapY + (npc.y * cellSize);
                
                this.ctx.beginPath();
                this.ctx.arc(npcX + cellSize/2, npcY + cellSize/2, cellSize/4, 0, Math.PI * 2);
                this.ctx.fill();
                
                // 대형 지도에서는 NPC 이름 표시
                if (this.displayMode === 2 && npc.name) {
                    this.ctx.fillStyle = '#FFFFFF';
                    this.ctx.font = '10px Arial';
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText(npc.name, npcX + cellSize/2, npcY - 2);
                    this.ctx.fillStyle = '#FFD700'; // 색상 복원
                }
            }
        }

        // 아이템 그리기 (수집되지 않은 것만)
        if (mapData.items) {
            this.ctx.fillStyle = '#00FF00'; // 녹색
            for (let item of mapData.items) {
                if (!item.collected && !this.isItemCollected(item, gameState)) {
                    const itemX = mapX + (item.x * cellSize);
                    const itemY = mapY + (item.y * cellSize);
                    
                    this.ctx.fillRect(itemX + cellSize/3, itemY + cellSize/3, cellSize/3, cellSize/3);
                    
                    // 대형 지도에서는 아이템 이름 표시
                    if (this.displayMode === 2 && item.name) {
                        this.ctx.fillStyle = '#FFFFFF';
                        this.ctx.font = '9px Arial';
                        this.ctx.textAlign = 'center';
                        this.ctx.fillText(item.name, itemX + cellSize/2, itemY - 2);
                        this.ctx.fillStyle = '#00FF00'; // 색상 복원
                    }
                }
            }
        }

        // 포털 그리기
        if (mapData.portals) {
            this.ctx.fillStyle = '#00AAFF'; // 파란색
            for (let portal of mapData.portals) {
                const portalX = mapX + (portal.x * cellSize);
                const portalY = mapY + (portal.y * cellSize);
                
                this.ctx.fillRect(portalX, portalY, cellSize, cellSize);
                
                // 포털 테두리
                this.ctx.strokeStyle = '#FFFFFF';
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(portalX, portalY, cellSize, cellSize);
                
                // 대형 지도에서는 포털 목적지 표시
                if (this.displayMode === 2 && portal.targetMap) {
                    this.ctx.fillStyle = '#FFFFFF';
                    this.ctx.font = '9px Arial';
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText(portal.targetMap, portalX + cellSize/2, portalY - 2);
                    this.ctx.fillStyle = '#00AAFF'; // 색상 복원
                }
            }
        }

        // 엘리베이터 그리기
        if (mapData.elevatorPanel) {
            const elevator = mapData.elevatorPanel;
            const elevatorX = mapX + (elevator.x * cellSize);
            const elevatorY = mapY + (elevator.y * cellSize);
            
            this.ctx.fillStyle = '#FF8C00'; // 주황색
            this.ctx.fillRect(elevatorX, elevatorY, cellSize, cellSize);
            
            // 엘리베이터 테두리
            this.ctx.strokeStyle = '#FFD700';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(elevatorX, elevatorY, cellSize, cellSize);
            
            // 대형 지도에서는 "엘리베이터" 텍스트 표시
            if (this.displayMode === 2) {
                this.ctx.fillStyle = '#FFFFFF';
                this.ctx.font = '10px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText('엘리베이터', elevatorX + cellSize/2, elevatorY - 2);
            }
        }
    }

    // 아이템이 이미 수집되었는지 확인
    isItemCollected(item, gameState) {
        if (!gameState || !gameState.inventory) return false;
        return gameState.inventory.some(invItem => 
            invItem.name === item.name && invItem.x === item.x && invItem.y === item.y
        );
    }

    drawPlayerPosition(player, mapData, mapX, mapY, mapSize) {
        if (!mapData || !mapData.data) return;

        const mapWidth = mapData.data[0].length;
        const mapHeight = mapData.data.length;
        const cellSize = mapSize / Math.max(mapWidth, mapHeight);

        // 플레이어 위치 계산
        const playerX = mapX + (player.x * cellSize);
        const playerY = mapY + (player.y * cellSize);

        // 플레이어 표시 (빨간 점)
        this.ctx.fillStyle = '#FF0000';
        this.ctx.beginPath();
        this.ctx.arc(playerX + cellSize/2, playerY + cellSize/2, cellSize/3, 0, Math.PI * 2);
        this.ctx.fill();

        // 플레이어 주변 하이라이트 (대형 지도에서만)
        if (this.displayMode === 2) {
            this.ctx.strokeStyle = '#FF0000';
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([5, 5]);
            this.ctx.strokeRect(playerX, playerY, cellSize, cellSize);
            this.ctx.setLineDash([]);
        }
    }

    drawMapInfo(mapData, mapX, mapY, mapSize) {
        // 맵 이름 표시
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 20px Arial';
        this.ctx.textAlign = 'center';
        
        const mapName = mapData.name || '알 수 없는 지역';
        this.ctx.fillText(mapName, mapX + mapSize/2, mapY - 10);

        // 조작 가이드 표시
        this.ctx.font = '14px Arial';
        this.ctx.fillStyle = '#CCCCCC';
        this.ctx.fillText('M키를 눌러 닫기', mapX + mapSize/2, mapY + mapSize + 25);
    }
}