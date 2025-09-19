import { CONSTANTS } from '../utils/Constants.js';

export class Renderer {
    constructor(canvas, ctx, animationSystem = null) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.tileSize = CONSTANTS.TILE_SIZE;
        this.animationSystem = animationSystem;
    }

    clearScreen() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawFloor(camera, currentMap) {
        if (!currentMap) return;

        for (let x = camera.x; x < camera.x + camera.viewWidth + 1; x++) {
            for (let y = camera.y; y < camera.y + camera.viewHeight + 1; y++) {
                if (x >= 0 && x < CONSTANTS.MAP_WIDTH && y >= 0 && y < CONSTANTS.MAP_HEIGHT) {
                    this.drawFloorTile(x, y, currentMap, camera);
                }
            }
        }
    }

    drawFloorTile(x, y, currentMap, camera) {
        const screenPos = camera.worldToScreen(x, y);
        const screenX = screenPos.x;
        const screenY = screenPos.y;

        // 맵별 타일 스타일
        switch (currentMap.name) {
            case '휴넷 로비':
                this.drawLobbyTile(screenX, screenY, x, y);
                break;
            case 'CEO실':
                this.drawExecutiveTile(screenX, screenY, x, y);
                break;
            case '회의실':
            case '카페테리아':
                this.drawOfficeTile(screenX, screenY, x, y);
                break;
            default:
                this.drawDefaultTile(screenX, screenY, x, y);
                break;
        }
    }

    drawLobbyTile(screenX, screenY, x, y) {
        // 고급스러운 대리석 패턴
        const baseColor = (x + y) % 2 === 0 ? '#f8f8f8' : '#e8e8e8';

        this.ctx.fillStyle = baseColor;
        this.ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);

        // 대리석 무늬
        this.ctx.strokeStyle = '#d0d0d0';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(screenX, screenY + this.tileSize * 0.3);
        this.ctx.quadraticCurveTo(
            screenX + this.tileSize * 0.5,
            screenY + this.tileSize * 0.1,
            screenX + this.tileSize,
            screenY + this.tileSize * 0.7
        );
        this.ctx.stroke();
    }

    drawOfficeTile(screenX, screenY, x, y) {
        // 카펫 패턴
        const primaryColor = '#f0e6d2';
        const secondaryColor = '#e8dcc0';

        this.ctx.fillStyle = (x + y) % 2 === 0 ? primaryColor : secondaryColor;
        this.ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);

        // 카펫 텍스처
        this.ctx.fillStyle = 'rgba(0,0,0,0.05)';
        for (let i = 0; i < 3; i++) {
            this.ctx.fillRect(
                screenX + (i * this.tileSize / 3),
                screenY,
                1,
                this.tileSize
            );
        }
    }

    drawExecutiveTile(screenX, screenY, x, y) {
        // 고급 우드 패턴
        const woodColors = ['#d4a574', '#c19660', '#b8874c'];
        const colorIndex = (x * 3 + y * 7) % woodColors.length;

        this.ctx.fillStyle = woodColors[colorIndex];
        this.ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);

        // 나무 결
        this.ctx.strokeStyle = 'rgba(139, 69, 19, 0.2)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        for (let i = 0; i < 3; i++) {
            this.ctx.moveTo(screenX, screenY + (i * this.tileSize / 3));
            this.ctx.lineTo(screenX + this.tileSize, screenY + (i * this.tileSize / 3) + 5);
        }
        this.ctx.stroke();
    }

    drawDefaultTile(screenX, screenY, x, y) {
        // 기본 타일
        const gray1 = '#f0f0f0';
        const gray2 = '#e0e0e0';

        this.ctx.fillStyle = (x + y) % 2 === 0 ? gray1 : gray2;
        this.ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);
    }

    drawWalls(camera, currentMap) {
        if (!currentMap || !currentMap.walls) return;

        this.ctx.fillStyle = '#8B4513';
        this.ctx.strokeStyle = '#654321';
        this.ctx.lineWidth = 2;

        for (let wall of currentMap.walls) {
            if (camera.isInView(wall.x, wall.y)) {
                const screenPos = camera.worldToScreen(wall.x, wall.y);
                this.ctx.fillRect(screenPos.x, screenPos.y, this.tileSize, this.tileSize);
                this.ctx.strokeRect(screenPos.x, screenPos.y, this.tileSize, this.tileSize);
            }
        }
    }

    drawOfficeItems(camera, currentMap) {
        if (!currentMap || !currentMap.officeItems) return;

        this.drawOfficeItemType(camera, currentMap.officeItems.desks, '#8B4513', '데스크');
        this.drawOfficeItemType(camera, currentMap.officeItems.chairs, '#654321', '의자');
        this.drawOfficeItemType(camera, currentMap.officeItems.computers, '#2F4F4F', '컴퓨터');
        this.drawOfficeItemType(camera, currentMap.officeItems.monitors, '#000000', '모니터');
        this.drawOfficeItemType(camera, currentMap.officeItems.plants, '#228B22', '화분');
        this.drawOfficeItemType(camera, currentMap.officeItems.printers, '#A9A9A9', '프린터');
        this.drawOfficeItemType(camera, currentMap.officeItems.meetingTables, '#D2B48C', '회의테이블');
    }

    drawOfficeItemType(camera, items, color, type) {
        if (!items) return;

        this.ctx.fillStyle = color;

        for (let item of items) {
            if (camera.isInView(item.x, item.y)) {
                const screenPos = camera.worldToScreen(item.x, item.y);

                if (type === '화분') {
                    this.drawPlant(screenPos.x, screenPos.y);
                } else if (type === '모니터') {
                    this.drawMonitor(screenPos.x, screenPos.y);
                } else if (type === '의자') {
                    this.drawChair(screenPos.x, screenPos.y);
                } else {
                    this.ctx.fillRect(screenPos.x + 4, screenPos.y + 4, this.tileSize - 8, this.tileSize - 8);
                }
            }
        }
    }

    drawPlant(screenX, screenY) {
        // 화분
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(screenX + 12, screenY + 32, 24, 12);

        // 식물
        this.ctx.fillStyle = '#228B22';
        this.ctx.beginPath();
        this.ctx.arc(screenX + 24, screenY + 20, 15, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawMonitor(screenX, screenY) {
        // 모니터 베이스
        this.ctx.fillStyle = '#2F4F4F';
        this.ctx.fillRect(screenX + 8, screenY + 8, 32, 24);

        // 화면
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(screenX + 10, screenY + 10, 28, 20);

        // 스탠드
        this.ctx.fillStyle = '#696969';
        this.ctx.fillRect(screenX + 20, screenY + 32, 8, 8);
    }

    drawChair(screenX, screenY) {
        // 의자 등받이
        this.ctx.fillStyle = '#654321';
        this.ctx.fillRect(screenX + 8, screenY + 8, 32, 8);

        // 의자 좌석
        this.ctx.fillRect(screenX + 8, screenY + 16, 32, 16);
    }

    drawPortals(camera, currentMap) {
        if (!currentMap || !currentMap.portals) return;

        for (let portal of currentMap.portals) {
            if (camera.isInView(portal.x, portal.y)) {
                const screenPos = camera.worldToScreen(portal.x, portal.y);

                if (portal.name && portal.name.includes('엘리베이터')) {
                    this.drawElevator(screenPos.x, screenPos.y, portal);
                } else {
                    this.drawRegularPortal(screenPos.x, screenPos.y, portal);
                }
            }
        }
    }

    drawElevator(screenX, screenY, portal) {
        // 엘리베이터 문
        this.ctx.fillStyle = '#C0C0C0';
        this.ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);

        // 문 구분선
        this.ctx.strokeStyle = '#808080';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(screenX + this.tileSize/2, screenY);
        this.ctx.lineTo(screenX + this.tileSize/2, screenY + this.tileSize);
        this.ctx.stroke();

        // 버튼
        this.ctx.fillStyle = '#FFD700';
        this.ctx.beginPath();
        this.ctx.arc(screenX + this.tileSize - 10, screenY + 10, 4, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawRegularPortal(screenX, screenY, portal) {
        // 일반 포털 (문)
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);

        // 문 장식
        this.ctx.strokeStyle = '#654321';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(screenX + 4, screenY + 4, this.tileSize - 8, this.tileSize - 8);

        // 포털 표시 (빛나는 효과)
        this.ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
        this.ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);

        // 문 손잡이
        this.ctx.fillStyle = '#FFD700';
        this.ctx.beginPath();
        this.ctx.arc(screenX + this.tileSize - 8, screenY + this.tileSize/2, 3, 0, Math.PI * 2);
        this.ctx.fill();

        // 포털 이름 표시
        if (portal.name) {
            this.ctx.fillStyle = 'white';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.strokeStyle = 'black';
            this.ctx.lineWidth = 3;
            this.ctx.strokeText(portal.name, screenX + this.tileSize/2, screenY - 5);
            this.ctx.fillText(portal.name, screenX + this.tileSize/2, screenY - 5);
        }
    }

    drawItems(camera, currentMap) {
        if (!currentMap || !currentMap.items) return;

        for (let item of currentMap.items) {
            if (!item.collected && camera.isInView(item.x, item.y)) {
                const screenPos = camera.worldToScreen(item.x, item.y);
                this.drawItem(screenPos.x, screenPos.y, item);
            }
        }
    }

    drawItem(screenX, screenY, item) {
        const centerX = screenX + this.tileSize/2;
        const centerY = screenY + this.tileSize/2;

        // 아이템 타입별 색상
        const colors = {
            'treasure': '#FFD700',
            'key': '#C0C0C0',
            'document': '#87CEEB',
            'badge': '#FF6347'
        };

        const color = colors[item.type] || '#FFFFFF';

        // 반짝이는 효과
        const alpha = this.animationSystem ? this.animationSystem.getItemAlpha() : 0.8;

        this.ctx.fillStyle = color;
        this.ctx.globalAlpha = alpha;

        // 아이템 모양
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
        this.ctx.fill();

        // 외곽선
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        this.ctx.globalAlpha = 1;

        // 아이템 이름 표시
        this.ctx.fillStyle = '#000000';
        this.ctx.font = '10px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(item.name, centerX, screenY - 5);
    }

    drawPixelCharacter(x, y, direction, isPlayer = false, customColor = null, camera, bobOffset = 0) {
        const screenPos = camera.worldToScreen(x, y);
        const screenX = screenPos.x + this.tileSize/2;
        const screenY = screenPos.y + this.tileSize/2 + (bobOffset || 0);

        // 캐릭터 색상
        let characterColor = customColor || (isPlayer ? '#0000FF' : '#FF0000');

        // 몸체
        this.ctx.fillStyle = characterColor;
        this.ctx.fillRect(screenX - 8, screenY - 8, 16, 20);

        // 머리
        this.ctx.fillStyle = '#FFDBAC';
        this.ctx.beginPath();
        this.ctx.arc(screenX, screenY - 12, 8, 0, Math.PI * 2);
        this.ctx.fill();

        // 방향 표시 (화살표)
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.beginPath();

        switch (direction) {
            case CONSTANTS.DIRECTIONS.UP:
                this.ctx.moveTo(screenX, screenY - 18);
                this.ctx.lineTo(screenX - 4, screenY - 14);
                this.ctx.lineTo(screenX + 4, screenY - 14);
                break;
            case CONSTANTS.DIRECTIONS.DOWN:
                this.ctx.moveTo(screenX, screenY - 6);
                this.ctx.lineTo(screenX - 4, screenY - 10);
                this.ctx.lineTo(screenX + 4, screenY - 10);
                break;
            case CONSTANTS.DIRECTIONS.LEFT:
                this.ctx.moveTo(screenX - 12, screenY - 12);
                this.ctx.lineTo(screenX - 8, screenY - 8);
                this.ctx.lineTo(screenX - 8, screenY - 16);
                break;
            case CONSTANTS.DIRECTIONS.RIGHT:
                this.ctx.moveTo(screenX + 12, screenY - 12);
                this.ctx.lineTo(screenX + 8, screenY - 8);
                this.ctx.lineTo(screenX + 8, screenY - 16);
                break;
        }

        this.ctx.closePath();
        this.ctx.fill();
    }

    drawNPCs(camera, currentMap) {
        if (!currentMap || !currentMap.npcs) return;

        for (let i = 0; i < currentMap.npcs.length; i++) {
            const npc = currentMap.npcs[i];
            if (camera.isInView(npc.x, npc.y)) {
                this.drawNPC(npc, i, camera);
            }
        }
    }

    drawNPC(npc, index, camera) {
        // NPC 색상 (직급별)
        const rankColors = {
            'employee': '#3498db',
            'senior': '#2ecc71',
            'manager': '#f39c12',
            'director': '#e74c3c',
            'ceo': '#9b59b6'
        };

        const characterColor = rankColors[npc.rank] || '#95a5a6';
        this.drawPixelCharacter(npc.x, npc.y, 'down', false, characterColor, camera);

        // NPC 이름 표시
        const screenPos = camera.worldToScreen(npc.x, npc.y);
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 3;

        const nameX = screenPos.x + this.tileSize/2;
        const nameY = screenPos.y - 10;

        this.ctx.strokeText(npc.name, nameX, nameY);
        this.ctx.fillText(npc.name, nameX, nameY);
    }
};