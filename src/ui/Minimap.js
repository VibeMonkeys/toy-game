import { CONSTANTS } from '../utils/Constants.js';

import { Logger } from '../utils/Logger.js';

export class Minimap {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.visible = true;
        this.expanded = false; // 확장 모드
        this.lastToggleTime = 0; // 더블클릭 감지용
        this.toggleDelay = 300; // 300ms 내에 두 번 토글하면 확장
    }

    toggle() {
        const currentTime = Date.now();
        
        // 더블클릭 감지 (300ms 내에 두 번 토글)
        if (currentTime - this.lastToggleTime < this.toggleDelay) {
            // 더블클릭: 확장 모드 토글
            this.expanded = !this.expanded;
            Logger.debug(`🗺️ 미니맵 확장 모드: ${this.expanded ? '켜짐' : '꺼짐'}`);
        } else {
            // 단일클릭: 일반 표시/숨김 토글
            this.visible = !this.visible;
            Logger.debug(`🗺️ 미니맵 표시: ${this.visible ? '켜짐' : '꺼짐'}`);
        }
        
        this.lastToggleTime = currentTime;
    }

    hide() {
        this.isVisible = false;
    }

    show() {
        this.isVisible = true;
    }

    draw(player, mapManager, gameState) {
        if (!this.visible) return;

        const currentMapData = mapManager.getCurrentMap();
        if (!currentMapData) return;

        // 확장 모드에 따른 크기와 위치 설정
        let minimapSize, minimapX, minimapY;
        
        if (this.expanded) {
            // 확장 모드: 화면 중앙에 큰 지도
            minimapSize = Math.min(this.canvas.width * 0.7, this.canvas.height * 0.7);
            minimapX = (this.canvas.width - minimapSize) / 2;
            minimapY = (this.canvas.height - minimapSize) / 2;
        } else {
            // 일반 모드: 우상단에 작은 지도
            minimapSize = 200;
            minimapX = this.canvas.width - minimapSize - 20;
            minimapY = 20;
        }

        // 배경
        this.ctx.fillStyle = this.expanded ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.7)';
        if (this.expanded) {
            // 확장 모드에서는 전체 화면에 반투명 배경
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
        
        // 미니맵 배경
        this.ctx.fillStyle = this.expanded ? 'rgba(40, 40, 40, 0.95)' : 'rgba(30, 30, 30, 0.8)';
        this.ctx.fillRect(minimapX, minimapY, minimapSize, minimapSize);

        // 테두리
        this.ctx.strokeStyle = this.expanded ? '#FFD700' : '#ffffff';
        this.ctx.lineWidth = this.expanded ? 3 : 2;
        this.ctx.strokeRect(minimapX, minimapY, minimapSize, minimapSize);

        // 맵 제목
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = this.expanded ? 'bold 18px Arial' : 'bold 14px Arial';
        this.ctx.textAlign = 'center';
        const mapName = this.getMapDisplayName(currentMapData.name);
        this.ctx.fillText(mapName, minimapX + minimapSize / 2, minimapY - 10);

        // 맵 내용 그리기
        this.drawMapContent(minimapX, minimapY, minimapSize, currentMapData, player, mapManager, gameState);
        
        // 확장 모드 안내 텍스트
        if (this.expanded) {
            this.ctx.fillStyle = '#FFD700';
            this.ctx.font = '16px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('M키를 두 번 눌러 닫기', this.canvas.width / 2, minimapY + minimapSize + 30);
        } else {
            // 일반 모드 안내
            this.ctx.fillStyle = '#cccccc';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('M: 숨김/표시, MM: 확대', minimapX + minimapSize / 2, minimapY + minimapSize + 15);
        }
    }

    drawMapContent(minimapX, minimapY, minimapSize, currentMapData, player, mapManager, gameState) {
        const mapCenterX = minimapX + minimapSize / 2;
        const mapCenterY = minimapY + minimapSize / 2;
        
        // 확장 모드에 따른 스케일 조정
        const scale = this.expanded ? 
            minimapSize / (CONSTANTS.MAP_WIDTH * 0.6) :  // 확장 모드: 더 자세하게
            minimapSize / CONSTANTS.MAP_WIDTH;           // 일반 모드

        // 플레이어 중심으로 맵을 그리기 위한 오프셋 계산
        const viewRange = this.expanded ? 25 : 15; // 확장 모드에서 더 넓은 범위

        // 맵 배경 (확장 모드에서는 격자 추가)
        if (this.expanded) {
            this.ctx.strokeStyle = 'rgba(100, 100, 100, 0.3)';
            this.ctx.lineWidth = 1;
            for (let i = 0; i <= 20; i++) {
                const x = minimapX + (i * minimapSize / 20);
                const y = minimapY + (i * minimapSize / 20);
                this.ctx.beginPath();
                this.ctx.moveTo(x, minimapY);
                this.ctx.lineTo(x, minimapY + minimapSize);
                this.ctx.moveTo(minimapX, y);
                this.ctx.lineTo(minimapX + minimapSize, y);
                this.ctx.stroke();
            }
        }

        // 벽 그리기
        if (currentMapData.walls) {
            this.ctx.fillStyle = this.expanded ? '#555555' : '#333333';
            for (let wall of currentMapData.walls) {
                const wallX = mapCenterX + (wall.x - player.x) * scale;
                const wallY = mapCenterY + (wall.y - player.y) * scale;

                if (wallX >= minimapX && wallX <= minimapX + minimapSize &&
                    wallY >= minimapY && wallY <= minimapY + minimapSize) {
                    this.ctx.fillRect(wallX, wallY, Math.max(1, scale), Math.max(1, scale));
                }
            }
        }

        // 포털 그리기 (확장 모드에서는 이름 표시)
        if (currentMapData.portals) {
            this.ctx.fillStyle = '#00FF88';
            for (let portal of currentMapData.portals) {
                const portalX = mapCenterX + (portal.x - player.x) * scale;
                const portalY = mapCenterY + (portal.y - player.y) * scale;

                if (portalX >= minimapX && portalX <= minimapX + minimapSize &&
                    portalY >= minimapY && portalY <= minimapY + minimapSize) {
                    
                    const portalSize = Math.max(2, scale);
                    this.ctx.fillRect(portalX, portalY, portalSize, portalSize);
                    
                    // 포털 테두리
                    this.ctx.strokeStyle = '#FFFFFF';
                    this.ctx.lineWidth = 1;
                    this.ctx.strokeRect(portalX, portalY, portalSize, portalSize);
                    
                    // 확장 모드에서는 포털 이름 표시
                    if (this.expanded && portal.name) {
                        this.ctx.fillStyle = '#FFFFFF';
                        this.ctx.font = '10px Arial';
                        this.ctx.textAlign = 'center';
                        this.ctx.fillText(portal.name, portalX + portalSize/2, portalY - 5);
                    }
                }
            }
        }

        // NPC 그리기 (확장 모드에서는 이름 표시)
        if (currentMapData.npcs) {
            this.ctx.fillStyle = '#FFFF00';
            for (let npc of currentMapData.npcs) {
                const npcX = mapCenterX + (npc.x - player.x) * scale;
                const npcY = mapCenterY + (npc.y - player.y) * scale;

                if (npcX >= minimapX && npcX <= minimapX + minimapSize &&
                    npcY >= minimapY && npcY <= minimapY + minimapSize) {
                    
                    const npcRadius = Math.max(2, scale / 2);
                    this.ctx.beginPath();
                    this.ctx.arc(npcX + scale/2, npcY + scale/2, npcRadius, 0, Math.PI * 2);
                    this.ctx.fill();
                    
                    // 확장 모드에서는 NPC 이름 표시
                    if (this.expanded && npc.name) {
                        this.ctx.fillStyle = '#FFFFFF';
                        this.ctx.font = '10px Arial';
                        this.ctx.textAlign = 'center';
                        this.ctx.fillText(npc.name, npcX + scale/2, npcY - 5);
                        this.ctx.fillStyle = '#FFFF00'; // 다음 NPC를 위해 색상 복원
                    }
                }
            }
        }

        // 아이템 그리기
        if (currentMapData.items) {
            this.ctx.fillStyle = '#FF0000';
            for (let item of currentMapData.items) {
                if (!item.collected) {
                    const itemX = mapCenterX + (item.x - player.x) * scale;
                    const itemY = mapCenterY + (item.y - player.y) * scale;

                    if (itemX >= minimapX && itemX <= minimapX + minimapSize &&
                        itemY >= minimapY && itemY <= minimapY + minimapSize) {
                        
                        const itemRadius = Math.max(1, scale / 3);
                        this.ctx.beginPath();
                        this.ctx.arc(itemX + scale/2, itemY + scale/2, itemRadius, 0, Math.PI * 2);
                        this.ctx.fill();
                        
                        // 확장 모드에서는 아이템 이름 표시
                        if (this.expanded && item.name) {
                            this.ctx.fillStyle = '#FFFFFF';
                            this.ctx.font = '9px Arial';
                            this.ctx.textAlign = 'center';
                            this.ctx.fillText(item.name, itemX + scale/2, itemY - 3);
                            this.ctx.fillStyle = '#FF0000'; // 색상 복원
                        }
                    }
                }
            }
        }

        // 엘리베이터 패널 그리기
        if (currentMapData.elevatorPanel) {
            const elevator = currentMapData.elevatorPanel;
            const elevatorX = mapCenterX + (elevator.x - player.x) * scale;
            const elevatorY = mapCenterY + (elevator.y - player.y) * scale;

            if (elevatorX >= minimapX && elevatorX <= minimapX + minimapSize &&
                elevatorY >= minimapY && elevatorY <= minimapY + minimapSize) {
                
                this.ctx.fillStyle = '#FFD700';
                const elevatorSize = Math.max(2, scale);
                this.ctx.fillRect(elevatorX, elevatorY, elevatorSize, elevatorSize);

                // 엘리베이터 테두리
                this.ctx.strokeStyle = '#B8860B';
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(elevatorX, elevatorY, elevatorSize, elevatorSize);
                
                // 확장 모드에서는 "엘리베이터" 텍스트 표시
                if (this.expanded) {
                    this.ctx.fillStyle = '#FFFFFF';
                    this.ctx.font = '10px Arial';
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText('엘리베이터', elevatorX + elevatorSize/2, elevatorY - 5);
                }
            }
        }

        // 플레이어 그리기 (항상 중앙, 더 크고 밝게)
        const playerSize = Math.max(3, scale);
        this.ctx.fillStyle = '#00AAFF';
        this.ctx.fillRect(mapCenterX - playerSize/2, mapCenterY - playerSize/2, playerSize, playerSize);

        // 플레이어 테두리
        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.lineWidth = this.expanded ? 3 : 2;
        this.ctx.strokeRect(mapCenterX - playerSize/2, mapCenterY - playerSize/2, playerSize, playerSize);

        // 플레이어 방향 표시
        this.ctx.fillStyle = '#FFFFFF';
        const dirX = mapCenterX;
        const dirY = mapCenterY;
        const arrowSize = playerSize * 0.4;

        this.ctx.beginPath();
        switch (player.direction) {
            case CONSTANTS.DIRECTIONS.UP:
                this.ctx.moveTo(dirX, dirY - arrowSize);
                this.ctx.lineTo(dirX - arrowSize/2, dirY);
                this.ctx.lineTo(dirX + arrowSize/2, dirY);
                break;
            case CONSTANTS.DIRECTIONS.DOWN:
                this.ctx.moveTo(dirX, dirY + arrowSize);
                this.ctx.lineTo(dirX - arrowSize/2, dirY);
                this.ctx.lineTo(dirX + arrowSize/2, dirY);
                break;
            case CONSTANTS.DIRECTIONS.LEFT:
                this.ctx.moveTo(dirX - arrowSize, dirY);
                this.ctx.lineTo(dirX, dirY - arrowSize/2);
                this.ctx.lineTo(dirX, dirY + arrowSize/2);
                break;
            case CONSTANTS.DIRECTIONS.RIGHT:
                this.ctx.moveTo(dirX + arrowSize, dirY);
                this.ctx.lineTo(dirX, dirY - arrowSize/2);
                this.ctx.lineTo(dirX, dirY + arrowSize/2);
                break;
        }
        this.ctx.closePath();
        this.ctx.fill();
    }

    getMapDisplayName(mapId) {
        const mapNames = {
            [CONSTANTS.MAPS.LOBBY]: '1층 로비',
            [CONSTANTS.MAPS.FLOOR_7_CORRIDOR]: '7층 복도',
            [CONSTANTS.MAPS.FLOOR_7_709_AFFILIATES]: '709호 계열사',
            [CONSTANTS.MAPS.FLOOR_7_710_MAIN_IT]: '710호 본사 IT',
            [CONSTANTS.MAPS.FLOOR_8_CORRIDOR]: '8층 복도',
            [CONSTANTS.MAPS.FLOOR_8_IT_DIVISION]: 'IT본부',
            [CONSTANTS.MAPS.FLOOR_8_HR_OFFICE]: '인경실',
            [CONSTANTS.MAPS.FLOOR_8_AI_RESEARCH]: '인공지능연구소',
            [CONSTANTS.MAPS.FLOOR_8_EDUCATION_SERVICE]: '교육서비스본부',
            [CONSTANTS.MAPS.FLOOR_8_SALES_SUPPORT]: '영업+교육지원본부',
            [CONSTANTS.MAPS.FLOOR_9_CORRIDOR]: '9층 복도',
            [CONSTANTS.MAPS.FLOOR_9_CEO_OFFICE]: '9층 CEO실',
            [CONSTANTS.MAPS.MEETING_ROOM]: '회의실',
            [CONSTANTS.MAPS.CAFETERIA]: '카페테리아',
            [CONSTANTS.MAPS.CEO_OFFICE]: 'CEO실'
        };
        return mapNames[mapId] || mapId;
    }
};