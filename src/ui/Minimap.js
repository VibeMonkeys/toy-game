import { CONSTANTS } from '../utils/Constants.js';

export class Minimap {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.size = 150;
        this.x = this.canvas.width - this.size - 20;
        this.y = 20;
        this.scale = this.size / Math.max(CONSTANTS.MAP_WIDTH, CONSTANTS.MAP_HEIGHT);
    }

    draw(player, currentMapId, mapData, gameState) {
        const currentMap = mapData[currentMapId];
        if (!currentMap) return;

        // 미니맵 배경
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(this.x, this.y, this.size, this.size);

        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(this.x, this.y, this.size, this.size);

        // 제목
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('미니맵', this.x + this.size/2, this.y - 5);

        // 맵 내용물 그리기
        this.drawMapContent(currentMap, player);

        // 맵 이름
        this.ctx.fillStyle = '#ffff00';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(this.getMapDisplayName(currentMapId), this.x + this.size/2, this.y + this.size + 15);
    }

    drawMapContent(currentMap, player) {
        const mapCenterX = this.x + this.size / 2;
        const mapCenterY = this.y + this.size / 2;

        // 플레이어 중심으로 맵을 그리기 위한 오프셋 계산
        const viewRange = 15; // 미니맵에서 보여줄 타일 범위
        const playerMapX = (player.x - CONSTANTS.MAP_WIDTH/2) * this.scale;
        const playerMapY = (player.y - CONSTANTS.MAP_HEIGHT/2) * this.scale;

        // 벽 그리기
        if (currentMap.walls) {
            this.ctx.fillStyle = '#666666';
            for (let wall of currentMap.walls) {
                const wallX = mapCenterX + (wall.x - player.x) * this.scale;
                const wallY = mapCenterY + (wall.y - player.y) * this.scale;

                if (wallX >= this.x && wallX <= this.x + this.size &&
                    wallY >= this.y && wallY <= this.y + this.size) {
                    this.ctx.fillRect(wallX, wallY, this.scale, this.scale);
                }
            }
        }

        // 포털 그리기
        if (currentMap.portals) {
            this.ctx.fillStyle = '#00ff00';
            for (let portal of currentMap.portals) {
                const portalX = mapCenterX + (portal.x - player.x) * this.scale;
                const portalY = mapCenterY + (portal.y - player.y) * this.scale;

                if (portalX >= this.x && portalX <= this.x + this.size &&
                    portalY >= this.y && portalY <= this.y + this.size) {
                    this.ctx.fillRect(portalX, portalY, this.scale, this.scale);
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

        // 플레이어 그리기 (항상 중앙)
        this.ctx.fillStyle = '#0000ff';
        this.ctx.fillRect(mapCenterX - this.scale/2, mapCenterY - this.scale/2, this.scale, this.scale);

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
            [CONSTANTS.MAPS.BUILDING_ENTRANCE]: '건물 입구',
            [CONSTANTS.MAPS.LOBBY]: '로비',
            [CONSTANTS.MAPS.MEETING_ROOM]: '회의실',
            [CONSTANTS.MAPS.CAFETERIA]: '카페테리아',
            [CONSTANTS.MAPS.CEO_OFFICE]: 'CEO실'
        };
        return mapNames[mapId] || mapId;
    }
};