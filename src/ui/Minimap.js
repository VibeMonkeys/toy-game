import { CONSTANTS } from '../utils/Constants.js';

export class Minimap {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.size = 180;
        this.x = this.canvas.width - this.size - 20;
        this.y = 20;
        this.scale = this.size / Math.max(CONSTANTS.MAP_WIDTH, CONSTANTS.MAP_HEIGHT);
        this.isVisible = true;
    }

    toggle() {
        this.isVisible = !this.isVisible;
    }

    hide() {
        this.isVisible = false;
    }

    show() {
        this.isVisible = true;
    }

    draw(player, currentMapId, mapData, gameState) {
        if (!this.isVisible) return;

        const currentMap = mapData[currentMapId];
        if (!currentMap) return;

        // 미니맵 배경 (더 어둡게)
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        this.ctx.fillRect(this.x, this.y, this.size, this.size);

        // 미니맵 테두리 (더 굵게)
        this.ctx.strokeStyle = '#FFD700';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(this.x, this.y, this.size, this.size);

        // 내부 테두리
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(this.x + 2, this.y + 2, this.size - 4, this.size - 4);

        // 제목 (검은색 배경 추가)
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(this.x + this.size/2 - 30, this.y - 20, 60, 18);

        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 3;
        this.ctx.font = 'bold 14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.strokeText('미니맵', this.x + this.size/2, this.y - 5);

        this.ctx.fillStyle = '#FFD700';
        this.ctx.fillText('미니맵', this.x + this.size/2, this.y - 5);

        // 맵 내용물 그리기
        this.drawMapContent(currentMap, player);

        // 맵 이름 (배경과 테두리 추가)
        const mapName = this.getMapDisplayName(currentMapId);
        this.ctx.font = 'bold 12px Arial';
        const textWidth = this.ctx.measureText(mapName).width;

        // 배경
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(this.x + this.size/2 - textWidth/2 - 5, this.y + this.size + 3, textWidth + 10, 16);

        // 테두리
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 3;
        this.ctx.textAlign = 'center';
        this.ctx.strokeText(mapName, this.x + this.size/2, this.y + this.size + 15);

        // 텍스트
        this.ctx.fillStyle = '#FFD700';
        this.ctx.fillText(mapName, this.x + this.size/2, this.y + this.size + 15);
    }

    drawMapContent(currentMap, player) {
        const mapCenterX = this.x + this.size / 2;
        const mapCenterY = this.y + this.size / 2;

        // 플레이어 중심으로 맵을 그리기 위한 오프셋 계산
        const viewRange = 15; // 미니맵에서 보여줄 타일 범위
        const playerMapX = (player.x - CONSTANTS.MAP_WIDTH/2) * this.scale;
        const playerMapY = (player.y - CONSTANTS.MAP_HEIGHT/2) * this.scale;

        // 벽 그리기 (더 어둡게)
        if (currentMap.walls) {
            this.ctx.fillStyle = '#333333';
            for (let wall of currentMap.walls) {
                const wallX = mapCenterX + (wall.x - player.x) * this.scale;
                const wallY = mapCenterY + (wall.y - player.y) * this.scale;

                if (wallX >= this.x && wallX <= this.x + this.size &&
                    wallY >= this.y && wallY <= this.y + this.size) {
                    this.ctx.fillRect(wallX, wallY, this.scale, this.scale);
                }
            }
        }

        // 포털 그리기 (더 밝은 녹색)
        if (currentMap.portals) {
            this.ctx.fillStyle = '#00FF88';
            for (let portal of currentMap.portals) {
                const portalX = mapCenterX + (portal.x - player.x) * this.scale;
                const portalY = mapCenterY + (portal.y - player.y) * this.scale;

                if (portalX >= this.x && portalX <= this.x + this.size &&
                    portalY >= this.y && portalY <= this.y + this.size) {
                    this.ctx.fillRect(portalX, portalY, this.scale, this.scale);

                    // 포털 테두리
                    this.ctx.strokeStyle = '#FFFFFF';
                    this.ctx.lineWidth = 1;
                    this.ctx.strokeRect(portalX, portalY, this.scale, this.scale);
                }
            }
        }

        // NPC 그리기
        if (currentMap.npcs) {
            this.ctx.fillStyle = '#ffff00';
            for (let npc of currentMap.npcs) {
                const npcX = mapCenterX + (npc.x - player.x) * this.scale;
                const npcY = mapCenterY + (npc.y - player.y) * this.scale;

                if (npcX >= this.x && npcX <= this.x + this.size &&
                    npcY >= this.y && npcY <= this.y + this.size) {
                    this.ctx.beginPath();
                    this.ctx.arc(npcX + this.scale/2, npcY + this.scale/2, this.scale/2, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            }
        }

        // 아이템 그리기
        if (currentMap.items) {
            this.ctx.fillStyle = '#ff0000';
            for (let item of currentMap.items) {
                if (!item.collected) {
                    const itemX = mapCenterX + (item.x - player.x) * this.scale;
                    const itemY = mapCenterY + (item.y - player.y) * this.scale;

                    if (itemX >= this.x && itemX <= this.x + this.size &&
                        itemY >= this.y && itemY <= this.y + this.size) {
                        this.ctx.beginPath();
                        this.ctx.arc(itemX + this.scale/2, itemY + this.scale/2, this.scale/3, 0, Math.PI * 2);
                        this.ctx.fill();
                    }
                }
            }
        }

        // 엘리베이터 패널 그리기
        if (currentMap.elevatorPanel) {
            const elevator = currentMap.elevatorPanel;
            const elevatorX = mapCenterX + (elevator.x - player.x) * this.scale;
            const elevatorY = mapCenterY + (elevator.y - player.y) * this.scale;

            if (elevatorX >= this.x && elevatorX <= this.x + this.size &&
                elevatorY >= this.y && elevatorY <= this.y + this.size) {
                this.ctx.fillStyle = '#FFD700';
                this.ctx.fillRect(elevatorX, elevatorY, this.scale, this.scale);

                // 엘리베이터 테두리
                this.ctx.strokeStyle = '#B8860B';
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(elevatorX, elevatorY, this.scale, this.scale);
            }
        }

        // 플레이어 그리기 (항상 중앙, 더 크고 밝게)
        this.ctx.fillStyle = '#00AAFF';
        this.ctx.fillRect(mapCenterX - this.scale/2, mapCenterY - this.scale/2, this.scale, this.scale);

        // 플레이어 테두리
        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(mapCenterX - this.scale/2, mapCenterY - this.scale/2, this.scale, this.scale);

        // 플레이어 방향 표시
        this.ctx.fillStyle = '#ffffff';
        const dirX = mapCenterX;
        const dirY = mapCenterY;
        const arrowSize = this.scale * 0.3;

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