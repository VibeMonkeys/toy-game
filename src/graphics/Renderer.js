import { CONSTANTS } from '../utils/Constants.js';
import { RetroSpriteManager } from './RetroSpriteManager.js';

export class Renderer {
    constructor(canvas, ctx, animationSystem = null, spriteManager = null) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.tileSize = CONSTANTS.TILE_SIZE;
        this.animationSystem = animationSystem;
        this.spriteManager = spriteManager;

        // 레트로 스프라이트 매니저 초기화
        this.retroSpriteManager = new RetroSpriteManager();
        this.retroSpritesLoaded = false;

        // 레트로 스프라이트 로드 시작
        this.loadRetroSprites();

        // 스프라이트 사용 여부 (폴백 지원)
        this.useSprites = false;
    }

    // 레트로 스프라이트 로드
    async loadRetroSprites() {
        try {
            await this.retroSpriteManager.loadSprites();
            this.retroSpritesLoaded = true;
            console.log('🎨 Renderer: 레트로 스프라이트 로드 완료!');
        } catch (error) {
            console.error('❌ Renderer: 레트로 스프라이트 로드 실패:', error);
            this.retroSpritesLoaded = false;
        }
    }

    // 스프라이트 매니저 설정
    setSpriteManager(spriteManager) {
        this.spriteManager = spriteManager;
        this.useSprites = spriteManager && spriteManager.isLoaded();
        console.log('🎨 Renderer: 스프라이트 매니저 설정 완료');
        console.log('🎨 Renderer: 스프라이트 사용 가능:', this.useSprites);
        if (this.spriteManager) {
            console.log('🎨 Renderer: 스프라이트 매니저 로딩 상태:', this.spriteManager.isLoaded());
            console.log('🎨 Renderer: 캐릭터 타일셋 사용 가능:', this.spriteManager.hasTileset('characters'));
            console.log('🎨 Renderer: 탑다운 타일셋 사용 가능:', this.spriteManager.hasTileset('topdown_tiles'));
            console.log('🎨 Renderer: 모든 타일셋:', Object.keys(this.spriteManager.tilesets || {}));
        } else {
            console.error('❌ Renderer: 스프라이트 매니저가 null입니다!');
        }
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

        // 스프라이트를 사용할 수 있는 경우
        if (this.spriteManager && this.spriteManager.hasTileset('topdown_tiles')) {
            this.drawSpritedFloorTile(screenX, screenY, x, y, currentMap);
            return;
        }

        // 폴백: 단순한 단색 바닥
        this.drawSolidFloorTile(screenX, screenY);
    }

    // 스프라이트를 사용한 바닥 타일 렌더링
    drawSpritedFloorTile(screenX, screenY, x, y, currentMap) {
        // 스프라이트 대신 단순한 단색 바닥 사용
        this.drawSolidFloorTile(screenX, screenY);
    }

    // 1999 레트로 바닥 패턴
    drawRetroFloorTile(screenX, screenY, x, y, currentMap) {
        const mapName = currentMap.name;

        // 맵별 90년대 레트로 테마
        if (mapName.includes('로비') || mapName === 'Lobby') {
            this.drawRetroLobbyTile(screenX, screenY, x, y);
        } else if (mapName.includes('카페') || mapName.includes('커피') || mapName.includes('스타벅스') || mapName.includes('메머드') || mapName.includes('국밥') || mapName.includes('팀홀턴')) {
            this.drawRetroCafeTile(screenX, screenY, x, y);
        } else if (mapName.includes('CEO') || mapName.includes('9층')) {
            this.drawRetroExecutiveTile(screenX, screenY, x, y);
        } else if (mapName.includes('옥상')) {
            this.drawRetroRooftopTile(screenX, screenY, x, y);
        } else {
            this.drawRetroOfficeTile(screenX, screenY, x, y);
        }
    }

    // 90년대 로비 타일 (대리석 패턴)
    drawRetroLobbyTile(screenX, screenY, x, y) {
        const baseColors = ['#f5f5dc', '#f0f8ff', '#faf0e6']; // 베이지, 앨리스블루, 리넨
        const colorIndex = (x + y) % baseColors.length;

        this.ctx.fillStyle = baseColors[colorIndex];
        this.ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);

        // 90년대 대리석 패턴
        this.ctx.strokeStyle = '#d3d3d3';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(screenX, screenY, this.tileSize, this.tileSize);

        // 대리석 베인 효과
        if ((x + y) % 4 === 0) {
            this.ctx.strokeStyle = '#c0c0c0';
            this.ctx.beginPath();
            this.ctx.moveTo(screenX + 2, screenY + this.tileSize - 2);
            this.ctx.lineTo(screenX + this.tileSize - 2, screenY + 2);
            this.ctx.stroke();
        }
    }

    // 90년대 오피스 타일 (카펫 패턴)
    drawRetroOfficeTile(screenX, screenY, x, y) {
        // 90년대 특유의 브라운/베이지 카펫
        const carpetColors = ['#d2b48c', '#deb887', '#f5deb3', '#d2b48c'];
        const colorIndex = (x * 3 + y * 7) % carpetColors.length;

        this.ctx.fillStyle = carpetColors[colorIndex];
        this.ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);

        // 카펫 텍스처 (수직 선)
        this.ctx.strokeStyle = 'rgba(139, 69, 19, 0.15)';
        this.ctx.lineWidth = 1;
        for (let i = 0; i < 3; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(screenX + (i * this.tileSize / 3), screenY);
            this.ctx.lineTo(screenX + (i * this.tileSize / 3), screenY + this.tileSize);
            this.ctx.stroke();
        }

        // 카펫 패턴 점
        if ((x + y) % 8 === 0) {
            this.ctx.fillStyle = 'rgba(160, 82, 45, 0.3)';
            this.ctx.beginPath();
            this.ctx.arc(screenX + this.tileSize/2, screenY + this.tileSize/2, 2, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    // 90년대 카페 타일 (나무 패턴)
    drawRetroCafeTile(screenX, screenY, x, y) {
        // 따뜻한 나무 색상
        const woodColors = ['#8b4513', '#a0522d', '#cd853f'];
        const colorIndex = (x * 5 + y * 3) % woodColors.length;

        this.ctx.fillStyle = woodColors[colorIndex];
        this.ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);

        // 나무 결 패턴
        this.ctx.strokeStyle = 'rgba(101, 67, 33, 0.4)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        for (let i = 0; i < 2; i++) {
            this.ctx.moveTo(screenX, screenY + (i * this.tileSize / 2) + 3);
            this.ctx.lineTo(screenX + this.tileSize, screenY + (i * this.tileSize / 2));
        }
        this.ctx.stroke();
    }

    // 90년대 임원실 타일 (고급 마룻바닥)
    drawRetroExecutiveTile(screenX, screenY, x, y) {
        // 고급스러운 마호가니 색상
        const mahoganyColors = ['#c04000', '#a0311c', '#8b2500'];
        const colorIndex = (x * 7 + y * 11) % mahoganyColors.length;

        this.ctx.fillStyle = mahoganyColors[colorIndex];
        this.ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);

        // 고급 나무 결
        this.ctx.strokeStyle = 'rgba(160, 49, 28, 0.6)';
        this.ctx.lineWidth = 1;

        // 나무 판자 효과
        this.ctx.strokeRect(screenX + 1, screenY + 1, this.tileSize - 2, this.tileSize - 2);

        // 고급 나무 결 패턴
        if ((x + y) % 3 === 0) {
            this.ctx.strokeStyle = 'rgba(139, 37, 0, 0.3)';
            this.ctx.beginPath();
            this.ctx.moveTo(screenX + 4, screenY);
            this.ctx.quadraticCurveTo(screenX + this.tileSize/2, screenY + this.tileSize/2, screenX + this.tileSize - 4, screenY + this.tileSize);
            this.ctx.stroke();
        }
    }

    // 90년대 옥상 타일 (콘크리트)
    drawRetroRooftopTile(screenX, screenY, x, y) {
        // 콘크리트 색상
        const concreteColors = ['#a9a9a9', '#b0b0b0', '#989898'];
        const colorIndex = (x + y) % concreteColors.length;

        this.ctx.fillStyle = concreteColors[colorIndex];
        this.ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);

        // 콘크리트 비비바닥 텍처
        this.ctx.strokeStyle = 'rgba(128, 128, 128, 0.5)';
        this.ctx.lineWidth = 1;

        // 규칙적인 비비바닥 패턴
        for (let i = 0; i < 4; i++) {
            this.ctx.strokeRect(
                screenX + (i * this.tileSize / 4),
                screenY,
                this.tileSize / 4,
                this.tileSize
            );
        }

        // 비비바닥 어두운 선
        if ((x + y) % 6 === 0) {
            this.ctx.strokeStyle = 'rgba(105, 105, 105, 0.7)';
            this.ctx.beginPath();
            this.ctx.moveTo(screenX, screenY + this.tileSize/2);
            this.ctx.lineTo(screenX + this.tileSize, screenY + this.tileSize/2);
            this.ctx.stroke();
        }
    }

    // 단순한 단색 바닥 타일 (폴백용)
    drawSolidFloorTile(screenX, screenY) {
        // 깔끔한 갈색 단색 바닥
        this.ctx.fillStyle = '#D2B48C'; // 연한 갈색 (tan)
        this.ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);

        // 타일 경계선 (아주 옅게)
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(screenX, screenY, this.tileSize, this.tileSize);
    }

    // 통일된 갈색 마룻바닥 타일 (폴백용)
    drawWoodenFloorTile(screenX, screenY, x, y) {
        // 고급 우드 패턴 - 갈색 계열로 통일
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
        this.drawOfficeItemType(camera, currentMap.officeItems.elevatorDoors, '#C0C0C0', '엘리베이터문');
    }

    // 상호작용 오브젝트 렌더링
    drawInteractableObjects(camera, mapManager) {
        const objects = mapManager.getCurrentMapObjects();

        objects.forEach(obj => {
            if (!camera.isInView(obj.x, obj.y)) return;

            const screenPos = camera.worldToScreen(obj.x, obj.y);
            const screenX = screenPos.x;
            const screenY = screenPos.y;

            this.drawInteractableObject(obj, screenX, screenY);
        });
    }

    drawInteractableObject(obj, screenX, screenY) {
        // 스프라이트 사용 가능 시 실제 가구 스프라이트 그리기
        if (this.spriteManager) {
            let furnitureType = null;

            switch (obj.type) {
                case CONSTANTS.OBJECT_TYPES.VENDING_MACHINE:
                    // 자판기 타입에 따라 다른 스프라이트 사용
                    const vendingSprite = obj.machineType === 'drink' ? 'vending_machine_drink' : 'vending_machine_snack';
                    if (this.spriteManager.hasSprite(vendingSprite)) {
                        // 상호작용 중일 때 효과
                        if (obj.isInteracting) {
                            const pulse = Math.sin(Date.now() * 0.01) * 0.1 + 0.9;
                            this.ctx.globalAlpha = pulse;
                        }

                        const sprite = this.spriteManager.getSprite(vendingSprite);
                        this.ctx.drawImage(sprite, screenX, screenY, this.tileSize, this.tileSize);

                        // 상호작용 표시
                        if (obj.canInteract()) {
                            this.ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
                            this.ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);
                        }

                        this.ctx.globalAlpha = 1.0;
                        this.ctx.fillStyle = '#000000';
                        this.ctx.font = '10px Arial';
                        this.ctx.textAlign = 'center';
                        this.ctx.fillText(obj.name, screenX + this.tileSize/2, screenY + this.tileSize + 12);
                        return; // 완료
                    } else {
                        furnitureType = 'bookshelf'; // 폴백
                    }
                    break;
                case CONSTANTS.OBJECT_TYPES.COMPUTER:
                    furnitureType = 'monitor';
                    break;
                case CONSTANTS.OBJECT_TYPES.PRINTER:
                    furnitureType = 'desk';
                    break;
            }

            if (furnitureType && this.spriteManager.hasSprite(`office_${furnitureType}`)) {
                // 상호작용 중일 때 효과
                if (obj.isInteracting) {
                    const pulse = Math.sin(Date.now() * 0.01) * 0.1 + 0.9;
                    this.ctx.globalAlpha = pulse;
                }

                // 가구 스프라이트 그리기
                this.spriteManager.drawOfficeFurniture(this.ctx, furnitureType, screenX, screenY, this.tileSize, this.tileSize);

                // 상호작용 가능 표시
                if (obj.canInteract()) {
                    this.ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
                    this.ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);
                } else {
                    this.ctx.fillStyle = 'rgba(100, 100, 100, 0.5)';
                    this.ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);
                }

                // 투명도 초기화
                this.ctx.globalAlpha = 1.0;

                // 오브젝트 이름 표시
                this.ctx.fillStyle = '#000000';
                this.ctx.font = '10px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(obj.name, screenX + this.tileSize/2, screenY + this.tileSize + 12);
                return; // 스프라이트 그리기 완료
            }
        }

        // 폴백: 기존 이모지 방식
        let backgroundColor, emoji, textColor = '#000000';

        switch (obj.type) {
            case CONSTANTS.OBJECT_TYPES.VENDING_MACHINE:
                backgroundColor = obj.machineType === 'drink' ? '#4169E1' : '#FF6347';
                emoji = obj.machineType === 'drink' ? '🥤' : '🍫';
                break;
            case CONSTANTS.OBJECT_TYPES.COMPUTER:
                backgroundColor = '#2F4F4F';
                emoji = '💻';
                textColor = '#FFFFFF';
                break;
            case CONSTANTS.OBJECT_TYPES.PRINTER:
                backgroundColor = '#A9A9A9';
                emoji = '🖨️';
                break;
            default:
                backgroundColor = '#808080';
                emoji = '📦';
        }

        // 상호작용 가능 상태에 따른 시각적 효과
        if (!obj.canInteract()) {
            backgroundColor = '#666666';
            textColor = '#CCCCCC';
        } else if (obj.isInteracting) {
            // 상호작용 중일 때 애니메이션 효과
            const pulse = Math.sin(Date.now() * 0.01) * 0.1 + 0.9;
            this.ctx.globalAlpha = pulse;
        }

        // 오브젝트 배경
        this.ctx.fillStyle = backgroundColor;
        this.ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);

        // 테두리
        this.ctx.strokeStyle = obj.canInteract() ? '#000000' : '#444444';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(screenX, screenY, this.tileSize, this.tileSize);

        // 이모지
        this.ctx.fillStyle = textColor;
        this.ctx.font = 'bold 20px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(emoji, screenX + this.tileSize/2, screenY + this.tileSize/2 + 7);

        // 상태 표시 (쿨다운, 에러 등)
        if (!obj.canInteract()) {
            this.ctx.fillStyle = 'rgba(255, 0, 0, 0.6)';
            this.ctx.fillRect(screenX, screenY + this.tileSize - 8, this.tileSize, 8);
        }

        // 상호작용 중일 때 특별한 표시
        if (obj.isInteracting) {
            this.ctx.fillStyle = 'rgba(255, 255, 0, 0.8)';
            this.ctx.strokeStyle = '#FFD700';
            this.ctx.lineWidth = 3;
            this.ctx.strokeRect(screenX - 2, screenY - 2, this.tileSize + 4, this.tileSize + 4);
        }

        // 투명도 초기화
        this.ctx.globalAlpha = 1.0;

        // 오브젝트 이름 표시 (작은 글씨)
        this.ctx.fillStyle = '#000000';
        this.ctx.font = '10px Arial';
        this.ctx.fillText(obj.name, screenX + this.tileSize/2, screenY + this.tileSize + 12);
    }

    drawElevatorPanel(camera, currentMap) {
        if (!currentMap || !currentMap.elevatorPanel) return;

        const panel = currentMap.elevatorPanel;
        if (!camera.isInView(panel.x, panel.y)) return;

        const screenPos = camera.worldToScreen(panel.x, panel.y);
        const screenX = screenPos.x;
        const screenY = screenPos.y;

        // 엘리베이터 패널 배경
        this.ctx.fillStyle = '#FFD700';
        this.ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);

        // 엘리베이터 패널 테두리
        this.ctx.strokeStyle = '#B8860B';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(screenX, screenY, this.tileSize, this.tileSize);

        // 엘리베이터 아이콘
        this.ctx.fillStyle = '#000000';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('🛗', screenX + this.tileSize/2, screenY + this.tileSize/2 + 5);

        // 엘리베이터 텍스트
        this.ctx.fillStyle = '#000000';
        this.ctx.font = 'bold 12px Arial';
        this.ctx.fillText('엘리베이터', screenX + this.tileSize/2, screenY + this.tileSize + 15);
    }

    drawOfficeItemType(camera, items, color, type) {
        if (!items) return;

        for (let item of items) {
            if (camera.isInView(item.x, item.y)) {
                const screenPos = camera.worldToScreen(item.x, item.y);
                const frame = this.retroSpriteManager ? this.retroSpriteManager.getAnimationFrame() : 0;

                // 레트로 스프라이트 우선 사용
                if (this.retroSpritesLoaded) {
                    if (type === '컴퓨터' || type === '모니터') {
                        this.retroSpriteManager.drawRetroObject(
                            this.ctx, 'computer', screenPos.x, screenPos.y, this.tileSize, this.tileSize, 'working', frame
                        );
                        return;
                    }
                }

                // 기존 스프라이트 시스템 폴백
                if (this.useSprites && this.spriteManager) {
                    if (type === '데스크') {
                        this.spriteManager.drawOfficeFurniture(this.ctx, 'desk', screenPos.x, screenPos.y, this.tileSize, this.tileSize);
                    } else if (type === '의자') {
                        this.spriteManager.drawOfficeFurniture(this.ctx, 'chair', screenPos.x, screenPos.y, this.tileSize, this.tileSize);
                    } else if (type === '컴퓨터' || type === '모니터') {
                        this.spriteManager.drawOfficeFurniture(this.ctx, 'monitor', screenPos.x, screenPos.y, this.tileSize, this.tileSize);
                    } else if (type === '화분') {
                        this.spriteManager.drawOfficeFurniture(this.ctx, 'plant', screenPos.x, screenPos.y, this.tileSize, this.tileSize);
                    } else {
                        // 기본 폴백
                        this.ctx.fillStyle = color;
                        this.ctx.fillRect(screenPos.x + 4, screenPos.y + 4, this.tileSize - 8, this.tileSize - 8);
                    }
                } else {
                    // 폴백: 기존 방식
                    this.ctx.fillStyle = color;
                    if (type === '화분') {
                        this.drawPlant(screenPos.x, screenPos.y);
                    } else if (type === '모니터') {
                        this.drawMonitor(screenPos.x, screenPos.y);
                    } else if (type === '의자') {
                        this.drawChair(screenPos.x, screenPos.y);
                    } else if (type === '엘리베이터문') {
                        this.drawElevatorDoor(screenPos.x, screenPos.y);
                    } else {
                        this.ctx.fillRect(screenPos.x + 4, screenPos.y + 4, this.tileSize - 8, this.tileSize - 8);
                    }
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

    drawElevatorDoor(screenX, screenY) {
        // 엘리베이터 문 배경
        this.ctx.fillStyle = '#C0C0C0';
        this.ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);

        // 왼쪽 문
        this.ctx.fillStyle = '#A0A0A0';
        this.ctx.fillRect(screenX + 2, screenY + 4, this.tileSize/2 - 3, this.tileSize - 8);

        // 오른쪽 문
        this.ctx.fillRect(screenX + this.tileSize/2 + 1, screenY + 4, this.tileSize/2 - 3, this.tileSize - 8);

        // 문 테두리
        this.ctx.strokeStyle = '#808080';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(screenX + 2, screenY + 4, this.tileSize/2 - 3, this.tileSize - 8);
        this.ctx.strokeRect(screenX + this.tileSize/2 + 1, screenY + 4, this.tileSize/2 - 3, this.tileSize - 8);

        // 가운데 구분선
        this.ctx.strokeStyle = '#606060';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(screenX + this.tileSize/2, screenY + 2);
        this.ctx.lineTo(screenX + this.tileSize/2, screenY + this.tileSize - 2);
        this.ctx.stroke();

        // 버튼 패널
        this.ctx.fillStyle = '#FFD700';
        this.ctx.beginPath();
        this.ctx.arc(screenX + this.tileSize - 8, screenY + 8, 3, 0, Math.PI * 2);
        this.ctx.fill();

        // 엘리베이터 아이콘
        this.ctx.fillStyle = '#404040';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('🛗', screenX + this.tileSize/2, screenY + this.tileSize/2 + 4);
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

        // 90년대 레트로 아이템 전용 렌더링
        if (item.type === 'retro') {
            this.drawRetroItem(screenX, screenY, item);
            return;
        }

        // 아이템 타입별 색상
        const colors = {
            'treasure': '#FFD700',
            'key': '#C0C0C0',
            'document': '#87CEEB',
            'badge': '#FF6347',
            'quest': '#32CD32',
            'currency': '#FFD700',
            'food': '#FF6347',
            'health': '#00FF00'
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

        // 아이콘 표시 (icon 속성이 있는 경우)
        if (item.icon) {
            this.ctx.fillStyle = '#000000';
            this.ctx.font = '16px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(item.icon, centerX, centerY + 5);
        }

        // 아이템 이름 표시
        this.ctx.fillStyle = '#000000';
        this.ctx.font = '10px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(item.name, centerX, screenY - 5);
    }

    // 90년대 레트로 아이템 렌더링
    drawRetroItem(screenX, screenY, item) {
        const centerX = screenX + this.tileSize/2;
        const centerY = screenY + this.tileSize/2;

        // 90년대 레트로 테마 색상 (노스탤지어 키치한 색상)
        const retroColors = {
            '플로피': '#4169E1',      // 로얄 블루
            'CD': '#CD853F',           // 퍼루
            '전화': '#8B4513',         // 새들 브라운
            '테이프': '#2F4F4F',       // 다크 슬레이트 그레이
            '노트북': '#696969',       // 딩 그레이
            '게임': '#8A2BE2',         // 블루 바이올렛
            '담배': '#F5DEB3',         // 휘트
            '음악': '#DA70D6'          // 오키드
        };

        // 아이템 이름에서 색상 결정
        let bgColor = '#D2B48C'; // 기본 베이지 색상
        for (let [key, color] of Object.entries(retroColors)) {
            if (item.name.includes(key)) {
                bgColor = color;
                break;
            }
        }

        // 90년대 특유의 베벨 박스 스타일
        this.ctx.fillStyle = bgColor;
        this.ctx.fillRect(screenX + 4, screenY + 4, this.tileSize - 8, this.tileSize - 8);

        // 베벨 효과
        this.ctx.strokeStyle = '#F5F5DC';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(screenX + 2, screenY + 2, this.tileSize - 4, this.tileSize - 4);

        this.ctx.strokeStyle = '#696969';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(screenX + 6, screenY + 6, this.tileSize - 12, this.tileSize - 12);

        // 90년대 스타일 아이콘
        if (item.icon) {
            this.ctx.fillStyle = '#000000';
            this.ctx.font = 'bold 14px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(item.icon, centerX, centerY + 4);
        }

        // 반짝이는 효과 (레트로 아이템용)
        const time = Date.now();
        const pulse = Math.sin(time * 0.003) * 0.2 + 0.8;
        this.ctx.globalAlpha = pulse;
        this.ctx.strokeStyle = '#FFD700';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(screenX + 1, screenY + 1, this.tileSize - 2, this.tileSize - 2);
        this.ctx.globalAlpha = 1;

        // 아이템 이름 (더 눈에 띄게)
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 10px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 3;
        this.ctx.strokeText(item.name, centerX, screenY - 8);
        this.ctx.fillText(item.name, centerX, screenY - 8);

        // 설명 표시 (마우스 호버 효과 대신)
        if (item.description) {
            this.ctx.fillStyle = '#FFFFE0';
            this.ctx.font = '8px Arial';
            this.ctx.fillText(item.description, centerX, screenY + this.tileSize + 12);
        }
    }

    drawPixelCharacter(x, y, direction, isPlayer = false, customColor = null, camera, bobOffset = 0, npcIndex = 0) {
        const screenPos = camera.worldToScreen(x, y);
        const screenX = screenPos.x;
        const screenY = screenPos.y + (bobOffset || 0);

        // 레트로 스프라이트 우선 사용
        if (this.retroSpritesLoaded) {
            const frame = this.retroSpriteManager.getAnimationFrame();

            if (isPlayer) {
                this.retroSpriteManager.drawRetroPlayer(
                    this.ctx, screenX, screenY, this.tileSize, this.tileSize, direction, frame
                );
            } else {
                this.retroSpriteManager.drawRetroNPC(
                    this.ctx, npcIndex, screenX, screenY, this.tileSize, this.tileSize, 'idle', frame
                );
            }
            return;
        }

        // 기존 스프라이트 시스템 폴백
        if (this.spriteManager && this.spriteManager.hasTileset('characters')) {
            this.drawCharacterSprite(screenX, screenY, direction, isPlayer, customColor, npcIndex);
            return;
        }

        // 폴백: 기존 픽셀 아트 방식
        const centerX = screenX + this.tileSize/2;
        const centerY = screenY + this.tileSize/2;

        // 캐릭터 색상
        let characterColor = customColor || (isPlayer ? '#0000FF' : '#FF0000');

        // 몸체
        this.ctx.fillStyle = characterColor;
        this.ctx.fillRect(centerX - 8, centerY - 8, 16, 20);

        // 머리
        this.ctx.fillStyle = '#FFDBAC';
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY - 12, 8, 0, Math.PI * 2);
        this.ctx.fill();

        // 방향 표시 (화살표)
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.beginPath();

        switch (direction) {
            case CONSTANTS.DIRECTIONS.UP:
                this.ctx.moveTo(centerX, centerY - 18);
                this.ctx.lineTo(centerX - 4, centerY - 14);
                this.ctx.lineTo(centerX + 4, centerY - 14);
                break;
            case CONSTANTS.DIRECTIONS.DOWN:
                this.ctx.moveTo(centerX, centerY - 6);
                this.ctx.lineTo(centerX - 4, centerY - 10);
                this.ctx.lineTo(centerX + 4, centerY - 10);
                break;
            case CONSTANTS.DIRECTIONS.LEFT:
                this.ctx.moveTo(centerX - 12, centerY - 12);
                this.ctx.lineTo(centerX - 8, centerY - 8);
                this.ctx.lineTo(centerX - 8, centerY - 16);
                break;
            case CONSTANTS.DIRECTIONS.RIGHT:
                this.ctx.moveTo(centerX + 12, centerY - 12);
                this.ctx.lineTo(centerX + 8, centerY - 8);
                this.ctx.lineTo(centerX + 8, centerY - 16);
                break;
        }

        this.ctx.closePath();
        this.ctx.fill();
    }

    // 캐릭터 스프라이트 그리기
    drawCharacterSprite(screenX, screenY, direction, isPlayer = false, customColor = null, npcIndex = 0) {
        if (isPlayer) {
            // 플레이어는 기본 캐릭터 시트의 첫 번째 캐릭터
            this.spriteManager.drawTile(this.ctx, 'characters', 0, screenX, screenY, this.tileSize, this.tileSize);
        } else {
            // NPC는 기존 16x16 캐릭터 시트들만 사용 (간단하고 안정적)
            const characterSets = [
                'characters',
                'office_workers_1',
                'office_workers_2',
                'eight_bit_rpg'
            ];

            // NPC 인덱스에 따라 다른 캐릭터 시트와 인덱스 선택
            const setIndex = npcIndex % characterSets.length;
            const tilesetName = characterSets[setIndex];
            const characterIndex = Math.floor(npcIndex / characterSets.length) % 8; // 0-7번 캐릭터 사용

            if (this.spriteManager.hasTileset(tilesetName)) {
                // 타일셋 정보 확인 (디버깅용)
                const tilesetInfo = this.spriteManager.getTilesetInfo(tilesetName);
                console.log(`🔍 NPC ${npcIndex}: ${tilesetName}, index ${characterIndex}, tileset info:`, tilesetInfo);

                this.spriteManager.drawTile(this.ctx, tilesetName, characterIndex, screenX, screenY, this.tileSize, this.tileSize);
            } else {
                // 폴백: 기본 캐릭터 시트 사용
                console.log(`⚠️ NPC ${npcIndex}: ${tilesetName} not found, using fallback`);
                this.spriteManager.drawTile(this.ctx, 'characters', characterIndex, screenX, screenY, this.tileSize, this.tileSize);
            }
        }
    }

    // 방향과 행에 따른 캐릭터 인덱스 계산
    getCharacterIndex(direction, row, cols) {
        let colOffset = 0;

        switch (direction) {
            case CONSTANTS.DIRECTIONS.DOWN:
                colOffset = 0; // 정면
                break;
            case CONSTANTS.DIRECTIONS.UP:
                colOffset = cols === 8 ? 6 : 9; // 뒷면
                break;
            case CONSTANTS.DIRECTIONS.LEFT:
                colOffset = cols === 8 ? 2 : 3; // 왼쪽
                break;
            case CONSTANTS.DIRECTIONS.RIGHT:
                colOffset = cols === 8 ? 4 : 6; // 오른쪽
                break;
            default:
                colOffset = 0;
                break;
        }

        return row * cols + colOffset;
    }

    drawNPCs(camera, currentMap, questSystem = null) {
        if (!currentMap || !currentMap.npcs) return;

        for (let i = 0; i < currentMap.npcs.length; i++) {
            const npc = currentMap.npcs[i];
            if (camera.isInView(npc.x, npc.y)) {
                this.drawNPC(npc, i, camera, questSystem);
            }
        }
    }

    drawNPC(npc, index, camera, questSystem = null) {
        // NPC마다 다른 캐릭터 사용
        const characterColor = null; // 스프라이트의 원래 색상 사용

        this.drawPixelCharacter(npc.x, npc.y, 'down', false, characterColor, camera, 0, index);

        const screenPos = camera.worldToScreen(npc.x, npc.y);

        // 퀘스트 NPC 위에 특별한 표시 (느낌표) - 완료되지 않은 퀘스트만
        if (npc.questGiver && questSystem && !this.isNPCQuestCompleted(npc, questSystem)) {
            this.ctx.fillStyle = '#FFD700';
            this.ctx.font = 'bold 16px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.strokeStyle = '#000000';
            this.ctx.lineWidth = 2;

            // 느낌표 배경 원
            this.ctx.beginPath();
            this.ctx.arc(screenPos.x + this.tileSize/2, screenPos.y - 20, 10, 0, Math.PI * 2);
            this.ctx.fillStyle = '#FFD700';
            this.ctx.fill();
            this.ctx.strokeStyle = '#000000';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();

            // 느낌표
            this.ctx.fillStyle = '#000000';
            this.ctx.font = 'bold 14px Arial';
            this.ctx.fillText('!', screenPos.x + this.tileSize/2, screenPos.y - 15);
        }

        // NPC 이름 항상 표시
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 2;

        const nameX = screenPos.x + this.tileSize/2;
        const nameY = screenPos.y - 5;

        this.ctx.strokeText(npc.name, nameX, nameY);
        this.ctx.fillText(npc.name, nameX, nameY);
    }

    isNPCQuestCompleted(npc, questSystem) {
        if (!npc.questGiver || !questSystem) return false;

        // NPC의 questId를 사용하여 해당 퀘스트가 완료되었는지 확인
        if (typeof npc.questId === 'number') {
            const quest = questSystem.quests[npc.questId];
            return quest ? quest.completed : false;
        }

        // questId가 없는 경우, NPC ID를 사용하여 questGiver로 찾기
        const quest = questSystem.quests.find(q => q.questGiver === npc.id);
        return quest ? quest.completed : false;
    }
};