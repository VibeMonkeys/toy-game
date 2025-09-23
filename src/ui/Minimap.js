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
        
        console.log('🗺️ M키 눌림! displayMode 변경:', this.displayMode);
        
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

        // 디스플레이 모드에 따른 설정 (40:30 비율 맞춤)
        let mapWidth, mapHeight, mapX, mapY, showBackground = false;
        const mapRatio = 40 / 30; // 게임 맵 비율
        
        if (this.displayMode === 1) {
            // 작은 미니맵 (우측 상단) - 비율에 맞는 직사각형
            mapHeight = Math.min(120, this.canvas.height * 0.2);
            mapWidth = mapHeight * mapRatio;
            mapX = this.canvas.width - mapWidth - 10;
            mapY = 30; // 맵 이름 공간 확보
        } else if (this.displayMode === 2) {
            // 대형 지도 (중앙) - 비율에 맞는 직사각형
            const maxSize = Math.min(this.canvas.width * 0.7, this.canvas.height * 0.6);
            if (mapRatio > 1) {
                mapWidth = maxSize;
                mapHeight = maxSize / mapRatio;
            } else {
                mapHeight = maxSize;
                mapWidth = maxSize * mapRatio;
            }
            mapX = (this.canvas.width - mapWidth) / 2;
            mapY = (this.canvas.height - mapHeight) / 2;
            showBackground = true;
        }

        // 대형 지도일 때 전체 화면 반투명 배경
        if (showBackground) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }

        // 맵 이름 표시 (미니맵 상단)
        this.drawMapName(currentMapData, mapX, mapY, mapWidth);

        // 미니맵 배경 (어두운 테마)
        this.ctx.fillStyle = this.displayMode === 2 ? 'rgba(25, 25, 35, 0.95)' : 'rgba(20, 20, 30, 0.9)';
        this.ctx.fillRect(mapX, mapY, mapWidth, mapHeight);

        // 미니맵 테두리
        this.ctx.strokeStyle = this.displayMode === 2 ? '#FFD700' : '#87CEEB';
        this.ctx.lineWidth = this.displayMode === 2 ? 3 : 2;
        this.ctx.strokeRect(mapX, mapY, mapWidth, mapHeight);

        // 맵 데이터 그리기
        this.drawMapContent(currentMapData, mapX, mapY, mapWidth, mapHeight);

        // 게임 오브젝트들 그리기
        this.drawMapObjects(currentMapData, gameState, mapX, mapY, mapWidth, mapHeight);

        // 플레이어 위치 표시 (맨 위에)
        this.drawPlayerPosition(player, currentMapData, mapX, mapY, mapWidth, mapHeight);

        // 대형 지도일 때 추가 정보 표시
        if (this.displayMode === 2) {
            this.drawMapInfo(currentMapData, mapX, mapY, mapWidth, mapHeight);
        }
    }

    drawMapContent(mapData, mapX, mapY, mapWidth, mapHeight) {
        if (!mapData) return;

        // 맵 크기 설정 (게임 맵 크기 기준)
        const gameMapWidth = 40;  // CONSTANTS.MAP_WIDTH
        const gameMapHeight = 30; // CONSTANTS.MAP_HEIGHT
        const cellWidth = mapWidth / gameMapWidth;
        const cellHeight = mapHeight / gameMapHeight;

        // 기본 바닥 그리기 (자연스러운 베이지색)
        this.ctx.fillStyle = '#8B7355';
        this.ctx.fillRect(mapX, mapY, mapWidth, mapHeight);

        // 벽 그리기 (진한 회색)
        if (mapData.walls) {
            this.ctx.fillStyle = '#2F2F2F';
            for (let wall of mapData.walls) {
                const wallX = mapX + (wall.x * cellWidth);
                const wallY = mapY + (wall.y * cellHeight);
                this.ctx.fillRect(wallX, wallY, cellWidth, cellHeight);
            }
        }

        // 사무용품들을 벽처럼 표시 (갈색 계열)
        if (mapData.officeItems) {
            this.ctx.fillStyle = '#5D4E37';
            
            // 책상, 의자, 컴퓨터 등을 모두 표시
            const allItems = [
                ...(mapData.officeItems.desks || []),
                ...(mapData.officeItems.chairs || []),
                ...(mapData.officeItems.computers || []),
                ...(mapData.officeItems.monitors || []),
                ...(mapData.officeItems.printers || []),
                ...(mapData.officeItems.meetingTables || [])
            ];
            
            for (let item of allItems) {
                const itemX = mapX + (item.x * cellWidth);
                const itemY = mapY + (item.y * cellHeight);
                this.ctx.fillRect(itemX, itemY, cellWidth, cellHeight);
            }
        }
    }

    drawMapObjects(mapData, gameState, mapX, mapY, mapWidth, mapHeight) {
        if (!mapData) return;

        // 맵 크기 설정 (게임 맵 크기 기준)
        const gameMapWidth = 40;  // CONSTANTS.MAP_WIDTH
        const gameMapHeight = 30; // CONSTANTS.MAP_HEIGHT
        const cellWidth = mapWidth / gameMapWidth;
        const cellHeight = mapHeight / gameMapHeight;

        // NPC 그리기
        if (mapData.npcs) {
            this.ctx.fillStyle = '#FFD700'; // 금색
            for (let npc of mapData.npcs) {
                const npcX = mapX + (npc.x * cellWidth);
                const npcY = mapY + (npc.y * cellHeight);
                
                this.ctx.beginPath();
                this.ctx.arc(npcX + cellWidth/2, npcY + cellHeight/2, Math.max(cellWidth/4, 2), 0, Math.PI * 2);
                this.ctx.fill();
                
                // 대형 지도에서는 NPC 이름 표시
                if (this.displayMode === 2 && npc.name) {
                    this.ctx.fillStyle = '#FFFFFF';
                    this.ctx.font = '10px Arial';
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText(npc.name, npcX + cellWidth/2, npcY - 2);
                    this.ctx.fillStyle = '#FFD700'; // 색상 복원
                }
            }
        }

        // 아이템 그리기 (수집되지 않은 것만)
        if (mapData.items) {
            this.ctx.fillStyle = '#00FF00'; // 녹색
            for (let item of mapData.items) {
                if (!item.collected && !this.isItemCollected(item, gameState)) {
                    const itemX = mapX + (item.x * cellWidth);
                    const itemY = mapY + (item.y * cellHeight);
                    
                    this.ctx.fillRect(itemX + cellWidth/3, itemY + cellHeight/3, cellWidth/3, cellHeight/3);
                    
                    // 대형 지도에서는 아이템 이름 표시
                    if (this.displayMode === 2 && item.name) {
                        this.ctx.fillStyle = '#FFFFFF';
                        this.ctx.font = '9px Arial';
                        this.ctx.textAlign = 'center';
                        this.ctx.fillText(item.name, itemX + cellWidth/2, itemY - 2);
                        this.ctx.fillStyle = '#00FF00'; // 색상 복원
                    }
                }
            }
        }

        // 포털 그리기
        if (mapData.portals) {
            this.ctx.fillStyle = '#00AAFF'; // 파란색
            for (let portal of mapData.portals) {
                const portalX = mapX + (portal.x * cellWidth);
                const portalY = mapY + (portal.y * cellHeight);
                
                this.ctx.fillRect(portalX, portalY, cellWidth, cellHeight);
                
                // 포털 테두리
                this.ctx.strokeStyle = '#FFFFFF';
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(portalX, portalY, cellWidth, cellHeight);
                
                // 대형 지도에서는 포털 목적지 표시
                if (this.displayMode === 2 && portal.targetMap) {
                    this.ctx.fillStyle = '#FFFFFF';
                    this.ctx.font = '9px Arial';
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText(portal.targetMap, portalX + cellWidth/2, portalY - 2);
                    this.ctx.fillStyle = '#00AAFF'; // 색상 복원
                }
            }
        }

        // 엘리베이터 그리기
        if (mapData.elevatorPanel) {
            const elevator = mapData.elevatorPanel;
            const elevatorX = mapX + (elevator.x * cellWidth);
            const elevatorY = mapY + (elevator.y * cellHeight);
            
            this.ctx.fillStyle = '#FF8C00'; // 주황색
            this.ctx.fillRect(elevatorX, elevatorY, cellWidth, cellHeight);
            
            // 엘리베이터 테두리
            this.ctx.strokeStyle = '#FFD700';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(elevatorX, elevatorY, cellWidth, cellHeight);
            
            // 대형 지도에서는 "엘리베이터" 텍스트 표시
            if (this.displayMode === 2) {
                this.ctx.fillStyle = '#FFFFFF';
                this.ctx.font = '10px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText('엘리베이터', elevatorX + cellWidth/2, elevatorY - 2);
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

    drawPlayerPosition(player, mapData, mapX, mapY, mapWidth, mapHeight) {
        if (!mapData) return;

        // 맵 크기 설정 (게임 맵 크기 기준)
        const gameMapWidth = 40;  // CONSTANTS.MAP_WIDTH
        const gameMapHeight = 30; // CONSTANTS.MAP_HEIGHT
        const cellWidth = mapWidth / gameMapWidth;
        const cellHeight = mapHeight / gameMapHeight;

        // 플레이어 위치 계산
        const playerX = mapX + (player.x * cellWidth);
        const playerY = mapY + (player.y * cellHeight);

        // 플레이어 표시 (빨간 원)
        this.ctx.fillStyle = '#FF0000';
        this.ctx.beginPath();
        this.ctx.arc(playerX + cellWidth/2, playerY + cellHeight/2, Math.max(cellWidth/3, 3), 0, Math.PI * 2);
        this.ctx.fill();

        // 플레이어 테두리 (더 눈에 띄게)
        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // 대형 지도에서 플레이어 주변 하이라이트
        if (this.displayMode === 2) {
            this.ctx.strokeStyle = '#FF0000';
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([5, 5]);
            this.ctx.strokeRect(playerX, playerY, cellWidth, cellHeight);
            this.ctx.setLineDash([]);
        }
    }

    drawMapName(mapData, mapX, mapY, mapWidth) {
        if (!mapData || !mapData.name) return;

        // 맵 이름을 한국어로 변환
        const koreanNames = {
            'Lobby': '1층 로비',
            'Floor_7_Corridor': '7층 복도', 
            'Floor_7_709_Affiliates': '7층 709호 계열사',
            'Floor_7_710_Main_IT': '7층 710호 본사IT',
            'Floor_8_Corridor': '8층 복도',
            'Floor_8_IT_Division': '8층 IT본부',
            'Floor_8_HR_Office': '8층 인경실',
            'Floor_8_AI_Research': '8층 인공지능연구소',
            'Floor_8_Education_Service': '8층 교육서비스본부',
            'Floor_8_Sales_Support': '8층 영업+교육지원본부',
            'Floor_9_Corridor': '9층 복도',
            'Floor_9_CEO_Office': '9층 CEO실',
            'Rooftop': '옥상'
        };

        const displayName = koreanNames[mapData.name] || mapData.name;

        // 맵 이름 배경 (반투명 박스)
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        const textWidth = this.ctx.measureText(displayName).width + 20;
        const textHeight = this.displayMode === 2 ? 25 : 20;
        const nameX = mapX + (mapWidth - textWidth) / 2;
        const nameY = mapY - textHeight - 5;
        
        this.ctx.fillRect(nameX, nameY, textWidth, textHeight);

        // 맵 이름 테두리
        this.ctx.strokeStyle = this.displayMode === 2 ? '#FFD700' : '#87CEEB';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(nameX, nameY, textWidth, textHeight);

        // 맵 이름 텍스트
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = this.displayMode === 2 ? 'bold 14px Arial' : 'bold 12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(displayName, mapX + mapWidth/2, nameY + textHeight - 5);
    }

    drawMapInfo(mapData, mapX, mapY, mapWidth, mapHeight) {
        // 대형 지도에서는 추가 정보를 표시할 수 있지만, 현재는 맵 이름만 표시
        // 추후 확장 가능: 층 정보, 특수 구역 정보 등
    }
}