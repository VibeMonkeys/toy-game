class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.tileSize = 48;
        this.mapWidth = 40;
        this.mapHeight = 30;

        this.camera = {
            x: 0,
            y: 0,
            viewWidth: Math.floor(this.canvas.width / this.tileSize),
            viewHeight: Math.floor(this.canvas.height / this.tileSize)
        };

        this.currentMap = 'lobby';
        this.player = {
            x: 12,
            y: 15,
            direction: 'down',
            animFrame: 0,
            animTimer: 0,
            isMoving: false
        };

        this.inventory = [];
        this.gameState = {
            itemsCollected: 0,
            totalItems: 4,
            visitedMaps: ['lobby'],
            completedQuests: []
        };

        this.showInventory = false;
        this.showMinimap = true;

        this.initializeMaps();
        this.currentDialog = null;
        this.dialogIndex = 0;

        this.setupEventListeners();
        this.gameLoop();
    }

    generateWalls() {
        const walls = [];

        for (let x = 0; x < this.mapWidth; x++) {
            walls.push({x: x, y: 0});
            walls.push({x: x, y: this.mapHeight - 1});
        }

        for (let y = 0; y < this.mapHeight; y++) {
            walls.push({x: 0, y: y});
            walls.push({x: this.mapWidth - 1, y: y});
        }

        return walls;
    }

    initializeMaps() {
        this.maps = {
            lobby: {
                name: '로비',
                background: '#2ECC71',
                walls: this.generateWalls().concat([
                    {x: 15, y: 10}, {x: 16, y: 10}, {x: 17, y: 10}, {x: 18, y: 10},
                    {x: 15, y: 11}, {x: 18, y: 11},
                    {x: 15, y: 12}, {x: 18, y: 12},
                    {x: 15, y: 13}, {x: 16, y: 13}, {x: 17, y: 13}, {x: 18, y: 13}
                ]),
                npcs: [
                    { x: 8, y: 8, type: 'employee', name: '김대리', dialog: ['안녕하세요! 26주년을 축하합니다!', '회의실에 첫 번째 단서가 있어요. 북쪽 문으로 가보세요!'] },
                    { x: 25, y: 15, type: 'employee', name: '박대리', dialog: ['여기서 휴식을 취하세요!', '더 큰 세계를 탐험해보세요!'] }
                ],
                items: [
                    { x: 6, y: 6, type: 'key', name: '로비 열쇠', collected: false },
                    { x: 30, y: 20, type: 'key', name: '비밀 열쇠', collected: false }
                ],
                portals: [
                    { x: 20, y: 1, targetMap: 'meeting_room', targetX: 20, targetY: 28, name: '회의실' }
                ]
            },
            meeting_room: {
                name: '회의실',
                background: '#3498DB',
                walls: this.generateWalls().concat([
                    {x: 8, y: 8}, {x: 9, y: 8}, {x: 11, y: 8}, {x: 12, y: 8}, {x: 13, y: 8}, {x: 14, y: 8}, {x: 15, y: 8}, {x: 16, y: 8},
                    {x: 8, y: 9}, {x: 16, y: 9}, {x: 8, y: 10}, {x: 16, y: 10}, {x: 8, y: 11}, {x: 9, y: 11}, {x: 15, y: 11}, {x: 16, y: 11}
                ]),
                npcs: [
                    { x: 12, y: 10, type: 'manager', name: '박과장', dialog: ['여기는 회의실입니다.', '다음 단서는 카페테리아에서 찾을 수 있어요!'] }
                ],
                items: [
                    { x: 10, y: 10, type: 'document', name: '회의록', collected: false }
                ],
                portals: [
                    { x: 20, y: 29, targetMap: 'lobby', targetX: 20, targetY: 1, name: '로비' },
                    { x: 38, y: 15, targetMap: 'cafeteria', targetX: 2, targetY: 15, name: '카페테리아' }
                ]
            },
            cafeteria: {
                name: '카페테리아',
                background: '#E67E22',
                walls: this.generateWalls(),
                npcs: [
                    { x: 15, y: 12, type: 'director', name: '이부장', dialog: ['카페테리아에 오신 걸 환영합니다!', '마지막 보물은 CEO실에 숨겨져 있답니다.'] }
                ],
                items: [
                    { x: 20, y: 5, type: 'coffee', name: '특별한 커피', collected: false }
                ],
                portals: [
                    { x: 2, y: 15, targetMap: 'meeting_room', targetX: 38, targetY: 15, name: '회의실' },
                    { x: 38, y: 15, targetMap: 'ceo_office', targetX: 2, targetY: 15, name: 'CEO실' }
                ]
            },
            ceo_office: {
                name: 'CEO실',
                background: '#9B59B6',
                walls: this.generateWalls().concat([
                    {x: 18, y: 10}, {x: 19, y: 10}, {x: 20, y: 10}, {x: 21, y: 10}, {x: 22, y: 10},
                    {x: 18, y: 11}, {x: 22, y: 11}, {x: 18, y: 12}, {x: 22, y: 12}, {x: 18, y: 13}, {x: 19, y: 13}, {x: 21, y: 13}, {x: 22, y: 13}
                ]),
                npcs: [
                    { x: 20, y: 12, type: 'ceo', name: 'CEO', dialog: ['축하합니다! 보물을 찾으셨네요!', '26주년 기념품을 받아가세요!'] }
                ],
                items: [
                    { x: 20, y: 11, type: 'treasure', name: '26주년 기념품', collected: false }
                ],
                portals: [
                    { x: 2, y: 15, targetMap: 'cafeteria', targetX: 38, targetY: 15, name: '카페테리아' },
                    { x: 20, y: 29, targetMap: 'lobby', targetX: 20, targetY: 1, name: '로비' }
                ]
            }
        };
    }

    getCurrentMap() {
        return this.maps[this.currentMap];
    }

    updateCamera() {
        this.camera.x = this.player.x - Math.floor(this.camera.viewWidth / 2);
        this.camera.y = this.player.y - Math.floor(this.camera.viewHeight / 2);

        this.camera.x = Math.max(0, Math.min(this.camera.x, this.mapWidth - this.camera.viewWidth));
        this.camera.y = Math.max(0, Math.min(this.camera.y, this.mapHeight - this.camera.viewHeight));
    }

    setupEventListeners() {
        // 게임 관련 키들의 기본 동작을 방지
        document.addEventListener('keydown', (e) => {
            // 게임에서 사용하는 키들의 기본 동작 방지
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'KeyI', 'KeyM', 'Escape', 'Enter'].includes(e.code)) {
                e.preventDefault();
            }
            if (this.currentDialog) {
                if (e.code === 'Space' || e.code === 'Enter') {
                    this.nextDialog();
                    return;
                }
                if (e.code === 'Escape') {
                    this.hideDialog();
                    return;
                }
                return;
            }

            if (e.code === 'KeyI') {
                this.showInventory = !this.showInventory;
                return;
            }

            if (e.code === 'KeyM') {
                this.showMinimap = !this.showMinimap;
                return;
            }

            if (e.code === 'Escape') {
                if (this.showInventory) {
                    this.showInventory = false;
                    return;
                }
            }

            let newX = this.player.x;
            let newY = this.player.y;

            switch(e.code) {
                case 'ArrowUp':
                    newY--;
                    this.player.direction = 'up';
                    break;
                case 'ArrowDown':
                    newY++;
                    this.player.direction = 'down';
                    break;
                case 'ArrowLeft':
                    newX--;
                    this.player.direction = 'left';
                    break;
                case 'ArrowRight':
                    newX++;
                    this.player.direction = 'right';
                    break;
                case 'Space':
                    this.interactWithNPC();
                    this.checkItemCollection();
                    return;
            }

            if (this.canMoveTo(newX, newY)) {
                this.player.x = newX;
                this.player.y = newY;
                this.player.isMoving = true;
                this.player.animTimer = Date.now();

                this.checkPortal();
                this.checkNPCInteraction();
                this.checkItemCollection();
            }
        });

        document.getElementById('dialogNext').addEventListener('click', () => {
            this.nextDialog();
        });

        // 캔버스 클릭 시 포커스 설정
        this.canvas.addEventListener('click', () => {
            this.canvas.focus();
        });

        // 캔버스를 포커스 가능하게 설정
        this.canvas.setAttribute('tabindex', '0');
        this.canvas.focus();

        // 마우스 휠 스크롤 방지 (게임 영역에서)
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
        }, { passive: false });

        // 터치 스크롤 방지 (모바일)
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
        }, { passive: false });
    }

    canMoveTo(x, y) {
        if (x < 0 || x >= this.mapWidth || y < 0 || y >= this.mapHeight) {
            return false;
        }

        const currentMap = this.getCurrentMap();
        return !currentMap.walls.some(wall => wall.x === x && wall.y === y);
    }

    checkPortal() {
        const currentMap = this.getCurrentMap();
        const portal = currentMap.portals.find(p => p.x === this.player.x && p.y === this.player.y);

        if (portal) {
            this.currentMap = portal.targetMap;
            this.player.x = portal.targetX;
            this.player.y = portal.targetY;

            if (!this.gameState.visitedMaps.includes(portal.targetMap)) {
                this.gameState.visitedMaps.push(portal.targetMap);
            }
        }
    }

    checkItemCollection() {
        const currentMap = this.getCurrentMap();
        const item = currentMap.items.find(item =>
            item.x === this.player.x && item.y === this.player.y && !item.collected
        );

        if (item) {
            item.collected = true;
            this.inventory.push({
                name: item.name,
                type: item.type,
                mapFound: this.currentMap
            });
            this.gameState.itemsCollected++;
            this.showDialog(`${item.name}을(를) 획득했습니다!`);
        }
    }

    checkNPCInteraction() {
        const currentMap = this.getCurrentMap();
        const nearbyNPC = currentMap.npcs.find(npc =>
            Math.abs(npc.x - this.player.x) <= 1 &&
            Math.abs(npc.y - this.player.y) <= 1
        );

        if (nearbyNPC && !this.currentDialog) {
            this.startDialog(nearbyNPC);
        }
    }

    interactWithNPC() {
        this.checkNPCInteraction();
    }

    startDialog(npc) {
        this.currentDialog = npc.dialog;
        this.dialogIndex = 0;
        this.showDialog(npc.name + ': ' + this.currentDialog[this.dialogIndex]);
    }

    nextDialog() {
        this.dialogIndex++;
        if (this.dialogIndex < this.currentDialog.length) {
            this.showDialog(this.currentDialog[this.dialogIndex]);
        } else {
            this.hideDialog();
        }
    }

    showDialog(text) {
        const dialogBox = document.getElementById('dialogBox');
        const dialogText = document.getElementById('dialogText');
        dialogText.textContent = text;
        dialogBox.classList.remove('hidden');
    }

    hideDialog() {
        const dialogBox = document.getElementById('dialogBox');
        dialogBox.classList.add('hidden');
        this.currentDialog = null;
        this.dialogIndex = 0;
    }

    drawPixelCharacter(x, y, direction, isPlayer = false) {
        const screenX = (x - this.camera.x) * this.tileSize + this.tileSize / 2;
        const screenY = (y - this.camera.y) * this.tileSize + this.tileSize / 2;

        this.ctx.save();
        this.ctx.translate(screenX, screenY);

        if (isPlayer) {
            this.ctx.fillStyle = '#4A90E2';
        } else {
            this.ctx.fillStyle = '#8E44AD';
        }

        this.ctx.fillRect(-6, -8, 12, 8);

        this.ctx.fillStyle = '#F4D1AE';
        this.ctx.fillRect(-4, -12, 8, 6);

        this.ctx.fillStyle = '#2C3E50';
        this.ctx.fillRect(-3, -11, 2, 2);
        this.ctx.fillRect(1, -11, 2, 2);

        this.ctx.fillStyle = '#34495E';
        this.ctx.fillRect(-2, -7, 4, 1);

        this.ctx.fillStyle = isPlayer ? '#3498DB' : '#9B59B6';
        this.ctx.fillRect(-5, 0, 10, 8);

        this.ctx.fillStyle = '#2C3E50';
        this.ctx.fillRect(-3, 8, 2, 6);
        this.ctx.fillRect(1, 8, 2, 6);

        this.ctx.fillStyle = '#34495E';
        this.ctx.fillRect(-4, 13, 3, 2);
        this.ctx.fillRect(1, 13, 3, 2);

        if (direction === 'left') {
            this.ctx.fillStyle = '#F4D1AE';
            this.ctx.fillRect(-7, -4, 3, 6);
        } else if (direction === 'right') {
            this.ctx.fillStyle = '#F4D1AE';
            this.ctx.fillRect(4, -4, 3, 6);
        } else {
            this.ctx.fillStyle = '#F4D1AE';
            this.ctx.fillRect(-7, -4, 3, 6);
            this.ctx.fillRect(4, -4, 3, 6);
        }

        this.ctx.restore();
    }

    drawItem(item) {
        if (item.collected) return;
        if (item.x < this.camera.x || item.x >= this.camera.x + this.camera.viewWidth + 1 ||
            item.y < this.camera.y || item.y >= this.camera.y + this.camera.viewHeight + 1) return;

        const screenX = (item.x - this.camera.x) * this.tileSize + this.tileSize / 2;
        const screenY = (item.y - this.camera.y) * this.tileSize + this.tileSize / 2;

        this.ctx.save();
        this.ctx.translate(screenX, screenY);

        switch(item.type) {
            case 'key':
                this.ctx.fillStyle = '#F1C40F';
                this.ctx.fillRect(-4, -6, 8, 4);
                this.ctx.fillRect(-6, -4, 4, 8);
                break;
            case 'document':
                this.ctx.fillStyle = '#ECF0F1';
                this.ctx.fillRect(-6, -8, 12, 16);
                this.ctx.strokeStyle = '#2C3E50';
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(-6, -8, 12, 16);
                break;
            case 'coffee':
                this.ctx.fillStyle = '#8B4513';
                this.ctx.fillRect(-4, -6, 8, 12);
                this.ctx.fillStyle = '#D2691E';
                this.ctx.fillRect(-3, -5, 6, 8);
                break;
            case 'treasure':
                this.ctx.fillStyle = '#F39C12';
                this.ctx.fillRect(-8, -6, 16, 12);
                this.ctx.fillStyle = '#E67E22';
                this.ctx.fillRect(-6, -4, 12, 8);
                break;
        }

        this.ctx.restore();

        this.ctx.fillStyle = 'white';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 2;
        this.ctx.strokeText(item.name, screenX, screenY + 30);
        this.ctx.fillText(item.name, screenX, screenY + 30);
    }

    drawPortal(portal) {
        if (portal.x < this.camera.x || portal.x >= this.camera.x + this.camera.viewWidth + 1 ||
            portal.y < this.camera.y || portal.y >= this.camera.y + this.camera.viewHeight + 1) return;

        const screenX = (portal.x - this.camera.x) * this.tileSize;
        const screenY = (portal.y - this.camera.y) * this.tileSize;

        this.ctx.fillStyle = '#E74C3C';
        this.ctx.fillRect(screenX + 8, screenY + 8, this.tileSize - 16, this.tileSize - 16);

        this.ctx.fillStyle = 'white';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 3;
        this.ctx.strokeText(
            portal.name,
            screenX + this.tileSize/2,
            screenY - 8
        );
        this.ctx.fillText(
            portal.name,
            screenX + this.tileSize/2,
            screenY - 8
        );
    }

    drawNPC(npc) {
        if (npc.x < this.camera.x || npc.x >= this.camera.x + this.camera.viewWidth + 1 ||
            npc.y < this.camera.y || npc.y >= this.camera.y + this.camera.viewHeight + 1) return;

        this.drawPixelCharacter(npc.x, npc.y, 'down', false);

        const screenX = (npc.x - this.camera.x) * this.tileSize + this.tileSize/2;
        const screenY = (npc.y - this.camera.y) * this.tileSize - 15;

        this.ctx.fillStyle = 'white';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 3;
        this.ctx.strokeText(npc.name, screenX, screenY);
        this.ctx.fillText(npc.name, screenX, screenY);
    }

    drawTileMap() {
        const currentMap = this.getCurrentMap();

        for (let y = this.camera.y; y < this.camera.y + this.camera.viewHeight + 1; y++) {
            for (let x = this.camera.x; x < this.camera.x + this.camera.viewWidth + 1; x++) {
                if (x < 0 || x >= this.mapWidth || y < 0 || y >= this.mapHeight) continue;

                const screenX = (x - this.camera.x) * this.tileSize;
                const screenY = (y - this.camera.y) * this.tileSize;

                this.ctx.fillStyle = currentMap.background;
                this.ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);

                if ((x + y) % 2 === 0) {
                    this.ctx.globalAlpha = 0.1;
                    this.ctx.fillStyle = '#000000';
                    this.ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);
                    this.ctx.globalAlpha = 1.0;
                }

                this.ctx.strokeStyle = 'rgba(0,0,0,0.1)';
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(screenX, screenY, this.tileSize, this.tileSize);
            }
        }
    }

    drawWalls() {
        const currentMap = this.getCurrentMap();
        currentMap.walls.forEach(wall => {
            if (wall.x < this.camera.x || wall.x >= this.camera.x + this.camera.viewWidth + 1 ||
                wall.y < this.camera.y || wall.y >= this.camera.y + this.camera.viewHeight + 1) return;

            const screenX = (wall.x - this.camera.x) * this.tileSize;
            const screenY = (wall.y - this.camera.y) * this.tileSize;

            this.ctx.fillStyle = '#8B4513';
            this.ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);

            this.ctx.fillStyle = '#A0522D';
            this.ctx.fillRect(screenX + 2, screenY + 2, this.tileSize - 4, this.tileSize - 4);

            this.ctx.strokeStyle = '#654321';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(screenX, screenY, this.tileSize, this.tileSize);
        });
    }

    drawMinimap() {
        if (!this.showMinimap) return;

        const minimapSize = 150;
        const minimapX = this.canvas.width - minimapSize - 10;
        const minimapY = 10;
        const scale = minimapSize / (this.mapWidth * 4);

        this.ctx.save();

        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(minimapX - 10, minimapY - 10, minimapSize + 20, minimapSize + 60);

        this.ctx.strokeStyle = '#3498DB';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(minimapX - 10, minimapY - 10, minimapSize + 20, minimapSize + 60);

        this.ctx.fillStyle = 'white';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(
            this.getCurrentMap().name,
            minimapX + minimapSize/2,
            minimapY - 15
        );

        this.ctx.translate(minimapX, minimapY);
        this.ctx.scale(scale, scale);

        const currentMap = this.getCurrentMap();

        this.ctx.fillStyle = currentMap.background;
        this.ctx.fillRect(0, 0, this.mapWidth * 4, this.mapHeight * 4);

        this.ctx.fillStyle = '#8B4513';
        currentMap.walls.forEach(wall => {
            this.ctx.fillRect(wall.x * 4, wall.y * 4, 4, 4);
        });

        this.ctx.fillStyle = '#E74C3C';
        currentMap.portals.forEach(portal => {
            this.ctx.fillRect(portal.x * 4, portal.y * 4, 4, 4);
        });

        this.ctx.fillStyle = '#9B59B6';
        currentMap.npcs.forEach(npc => {
            this.ctx.fillRect(npc.x * 4, npc.y * 4, 4, 4);
        });

        this.ctx.fillStyle = '#F1C40F';
        currentMap.items.forEach(item => {
            if (!item.collected) {
                this.ctx.fillRect(item.x * 4, item.y * 4, 4, 4);
            }
        });

        this.ctx.fillStyle = '#3498DB';
        this.ctx.fillRect(this.player.x * 4, this.player.y * 4, 6, 6);

        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.lineWidth = 1;
        const viewX = this.camera.x * 4;
        const viewY = this.camera.y * 4;
        const viewW = this.camera.viewWidth * 4;
        const viewH = this.camera.viewHeight * 4;
        this.ctx.strokeRect(viewX, viewY, viewW, viewH);

        this.ctx.restore();
    }

    drawInventory() {
        if (!this.showInventory) return;

        const invWidth = 350;
        const invHeight = 250;
        const invX = (this.canvas.width - invWidth) / 2;
        const invY = (this.canvas.height - invHeight) / 2;

        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(invX, invY, invWidth, invHeight);

        this.ctx.strokeStyle = '#F39C12';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(invX, invY, invWidth, invHeight);

        this.ctx.fillStyle = 'white';
        this.ctx.font = '20px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('인벤토리 (I키로 닫기)', invX + invWidth/2, invY + 30);

        this.ctx.textAlign = 'left';
        this.ctx.font = '16px Arial';

        if (this.inventory.length === 0) {
            this.ctx.fillText('아이템이 없습니다.', invX + 25, invY + 80);
        } else {
            this.inventory.forEach((item, index) => {
                this.ctx.fillText(
                    `${index + 1}. ${item.name} (${item.mapFound}에서 발견)`,
                    invX + 25,
                    invY + 80 + index * 25
                );
            });
        }

        this.ctx.fillText(
            `수집한 아이템: ${this.gameState.itemsCollected}/${this.gameState.totalItems}`,
            invX + 25,
            invY + invHeight - 30
        );
    }

    drawUI() {
        this.ctx.fillStyle = 'white';
        this.ctx.font = '18px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 2;

        const uiTexts = [
            `현재 위치: ${this.getCurrentMap().name}`,
            `아이템: ${this.gameState.itemsCollected}/${this.gameState.totalItems}`,
            `방문한 지역: ${this.gameState.visitedMaps.length}/4`,
            'I: 인벤토리, M: 미니맵 토글'
        ];

        uiTexts.forEach((text, index) => {
            this.ctx.strokeText(text, 15, 35 + index * 25);
            this.ctx.fillText(text, 15, 35 + index * 25);
        });
    }

    updateAnimation() {
        if (this.player.isMoving) {
            const now = Date.now();
            if (now - this.player.animTimer > 200) {
                this.player.isMoving = false;
            }
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawTileMap();
        this.drawWalls();

        const currentMap = this.getCurrentMap();

        currentMap.portals.forEach(portal => {
            this.drawPortal(portal);
        });

        currentMap.items.forEach(item => {
            this.drawItem(item);
        });

        currentMap.npcs.forEach(npc => {
            this.drawNPC(npc);
        });

        this.drawPixelCharacter(this.player.x, this.player.y, this.player.direction, true);

        const playerScreenX = (this.player.x - this.camera.x) * this.tileSize + this.tileSize/2;
        const playerScreenY = (this.player.y - this.camera.y) * this.tileSize - 15;

        this.ctx.fillStyle = 'white';
        this.ctx.font = '18px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 4;
        this.ctx.strokeText('나', playerScreenX, playerScreenY);
        this.ctx.fillText('나', playerScreenX, playerScreenY);

        this.drawUI();
        this.drawMinimap();
        this.drawInventory();
    }

    gameLoop() {
        this.updateAnimation();
        this.updateCamera();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

window.addEventListener('load', () => {
    new Game();
});