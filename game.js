class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.tileSize = 32;
        this.mapWidth = 25;
        this.mapHeight = 18;

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

    initializeMaps() {
        this.maps = {
            lobby: {
                name: '로비',
                background: '#2ECC71',
                walls: [
                    {x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}, {x: 3, y: 0}, {x: 4, y: 0}, {x: 5, y: 0}, {x: 6, y: 0}, {x: 7, y: 0}, {x: 8, y: 0}, {x: 9, y: 0}, {x: 10, y: 0}, {x: 11, y: 0}, {x: 13, y: 0}, {x: 14, y: 0}, {x: 15, y: 0}, {x: 16, y: 0}, {x: 17, y: 0}, {x: 18, y: 0}, {x: 19, y: 0}, {x: 20, y: 0}, {x: 21, y: 0}, {x: 22, y: 0}, {x: 23, y: 0}, {x: 24, y: 0},
                    {x: 0, y: 1}, {x: 24, y: 1}, {x: 0, y: 2}, {x: 24, y: 2}, {x: 0, y: 3}, {x: 24, y: 3}, {x: 0, y: 4}, {x: 24, y: 4}, {x: 0, y: 5}, {x: 24, y: 5}, {x: 0, y: 6}, {x: 24, y: 6}, {x: 0, y: 7}, {x: 24, y: 7}, {x: 0, y: 8}, {x: 24, y: 8}, {x: 0, y: 9}, {x: 24, y: 9}, {x: 0, y: 10}, {x: 24, y: 10}, {x: 0, y: 11}, {x: 24, y: 11}, {x: 0, y: 12}, {x: 24, y: 12}, {x: 0, y: 13}, {x: 24, y: 13}, {x: 0, y: 14}, {x: 24, y: 14}, {x: 0, y: 15}, {x: 24, y: 15}, {x: 0, y: 16}, {x: 24, y: 16},
                    {x: 0, y: 17}, {x: 1, y: 17}, {x: 2, y: 17}, {x: 3, y: 17}, {x: 4, y: 17}, {x: 5, y: 17}, {x: 6, y: 17}, {x: 7, y: 17}, {x: 8, y: 17}, {x: 9, y: 17}, {x: 10, y: 17}, {x: 11, y: 17}, {x: 12, y: 17}, {x: 13, y: 17}, {x: 14, y: 17}, {x: 15, y: 17}, {x: 16, y: 17}, {x: 17, y: 17}, {x: 18, y: 17}, {x: 19, y: 17}, {x: 20, y: 17}, {x: 21, y: 17}, {x: 22, y: 17}, {x: 23, y: 17}, {x: 24, y: 17}
                ],
                npcs: [
                    { x: 8, y: 8, type: 'employee', name: '김대리', dialog: ['안녕하세요! 26주년을 축하합니다!', '회의실에 첫 번째 단서가 있어요. 북쪽 문으로 가보세요!'] }
                ],
                items: [
                    { x: 6, y: 6, type: 'key', name: '로비 열쇠', collected: false }
                ],
                portals: [
                    { x: 12, y: 0, targetMap: 'meeting_room', targetX: 12, targetY: 16, name: '회의실' }
                ]
            },
            meeting_room: {
                name: '회의실',
                background: '#3498DB',
                walls: [
                    {x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}, {x: 3, y: 0}, {x: 4, y: 0}, {x: 5, y: 0}, {x: 6, y: 0}, {x: 7, y: 0}, {x: 8, y: 0}, {x: 9, y: 0}, {x: 10, y: 0}, {x: 11, y: 0}, {x: 13, y: 0}, {x: 14, y: 0}, {x: 15, y: 0}, {x: 16, y: 0}, {x: 17, y: 0}, {x: 18, y: 0}, {x: 19, y: 0}, {x: 20, y: 0}, {x: 21, y: 0}, {x: 22, y: 0}, {x: 23, y: 0}, {x: 24, y: 0},
                    {x: 0, y: 1}, {x: 24, y: 1}, {x: 0, y: 2}, {x: 24, y: 2}, {x: 0, y: 3}, {x: 24, y: 3}, {x: 0, y: 4}, {x: 24, y: 4}, {x: 0, y: 5}, {x: 24, y: 5}, {x: 0, y: 6}, {x: 24, y: 6}, {x: 0, y: 7}, {x: 24, y: 7}, {x: 0, y: 8}, {x: 24, y: 8}, {x: 0, y: 9}, {x: 24, y: 9}, {x: 0, y: 10}, {x: 24, y: 10}, {x: 0, y: 11}, {x: 24, y: 11}, {x: 0, y: 12}, {x: 24, y: 12}, {x: 0, y: 13}, {x: 24, y: 13}, {x: 0, y: 14}, {x: 24, y: 14}, {x: 0, y: 15}, {x: 24, y: 15}, {x: 0, y: 16}, {x: 24, y: 16},
                    {x: 0, y: 17}, {x: 1, y: 17}, {x: 2, y: 17}, {x: 3, y: 17}, {x: 4, y: 17}, {x: 5, y: 17}, {x: 6, y: 17}, {x: 7, y: 17}, {x: 8, y: 17}, {x: 9, y: 17}, {x: 10, y: 17}, {x: 11, y: 17}, {x: 13, y: 17}, {x: 14, y: 17}, {x: 15, y: 17}, {x: 16, y: 17}, {x: 17, y: 17}, {x: 18, y: 17}, {x: 19, y: 17}, {x: 20, y: 17}, {x: 21, y: 17}, {x: 22, y: 17}, {x: 23, y: 17}, {x: 24, y: 17},
                    {x: 8, y: 8}, {x: 9, y: 8}, {x: 11, y: 8}, {x: 12, y: 8}, {x: 13, y: 8}, {x: 14, y: 8}, {x: 15, y: 8}, {x: 16, y: 8},
                    {x: 8, y: 9}, {x: 16, y: 9}, {x: 8, y: 10}, {x: 16, y: 10}, {x: 8, y: 11}, {x: 9, y: 11}, {x: 15, y: 11}, {x: 16, y: 11}
                ],
                npcs: [
                    { x: 12, y: 10, type: 'manager', name: '박과장', dialog: ['여기는 회의실입니다.', '다음 단서는 카페테리아에서 찾을 수 있어요!'] }
                ],
                items: [
                    { x: 10, y: 10, type: 'document', name: '회의록', collected: false }
                ],
                portals: [
                    { x: 12, y: 17, targetMap: 'lobby', targetX: 12, targetY: 1, name: '로비' },
                    { x: 22, y: 8, targetMap: 'cafeteria', targetX: 2, targetY: 8, name: '카페테리아' }
                ]
            },
            cafeteria: {
                name: '카페테리아',
                background: '#E67E22',
                walls: [
                    {x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}, {x: 3, y: 0}, {x: 4, y: 0}, {x: 5, y: 0}, {x: 6, y: 0}, {x: 7, y: 0}, {x: 8, y: 0}, {x: 9, y: 0}, {x: 10, y: 0}, {x: 11, y: 0}, {x: 12, y: 0}, {x: 13, y: 0}, {x: 14, y: 0}, {x: 15, y: 0}, {x: 16, y: 0}, {x: 17, y: 0}, {x: 18, y: 0}, {x: 19, y: 0}, {x: 20, y: 0}, {x: 21, y: 0}, {x: 22, y: 0}, {x: 23, y: 0}, {x: 24, y: 0},
                    {x: 0, y: 1}, {x: 24, y: 1}, {x: 0, y: 2}, {x: 24, y: 2}, {x: 0, y: 3}, {x: 24, y: 3}, {x: 0, y: 4}, {x: 24, y: 4}, {x: 0, y: 5}, {x: 24, y: 5}, {x: 0, y: 6}, {x: 24, y: 6}, {x: 0, y: 7}, {x: 24, y: 7}, {x: 0, y: 8}, {x: 24, y: 8}, {x: 0, y: 9}, {x: 24, y: 9}, {x: 0, y: 10}, {x: 24, y: 10}, {x: 0, y: 11}, {x: 24, y: 11}, {x: 0, y: 12}, {x: 24, y: 12}, {x: 0, y: 13}, {x: 24, y: 13}, {x: 0, y: 14}, {x: 24, y: 14}, {x: 0, y: 15}, {x: 24, y: 15}, {x: 0, y: 16}, {x: 24, y: 16},
                    {x: 0, y: 17}, {x: 1, y: 17}, {x: 2, y: 17}, {x: 3, y: 17}, {x: 4, y: 17}, {x: 5, y: 17}, {x: 6, y: 17}, {x: 7, y: 17}, {x: 8, y: 17}, {x: 9, y: 17}, {x: 10, y: 17}, {x: 11, y: 17}, {x: 12, y: 17}, {x: 13, y: 17}, {x: 14, y: 17}, {x: 15, y: 17}, {x: 16, y: 17}, {x: 17, y: 17}, {x: 18, y: 17}, {x: 19, y: 17}, {x: 20, y: 17}, {x: 21, y: 17}, {x: 22, y: 17}, {x: 23, y: 17}, {x: 24, y: 17}
                ],
                npcs: [
                    { x: 15, y: 12, type: 'director', name: '이부장', dialog: ['카페테리아에 오신 걸 환영합니다!', '마지막 보물은 CEO실에 숨겨져 있답니다.'] }
                ],
                items: [
                    { x: 20, y: 5, type: 'coffee', name: '특별한 커피', collected: false }
                ],
                portals: [
                    { x: 2, y: 8, targetMap: 'meeting_room', targetX: 22, targetY: 8, name: '회의실' },
                    { x: 22, y: 12, targetMap: 'ceo_office', targetX: 2, targetY: 12, name: 'CEO실' }
                ]
            },
            ceo_office: {
                name: 'CEO실',
                background: '#9B59B6',
                walls: [
                    {x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}, {x: 3, y: 0}, {x: 4, y: 0}, {x: 5, y: 0}, {x: 6, y: 0}, {x: 7, y: 0}, {x: 8, y: 0}, {x: 9, y: 0}, {x: 10, y: 0}, {x: 11, y: 0}, {x: 12, y: 0}, {x: 13, y: 0}, {x: 14, y: 0}, {x: 15, y: 0}, {x: 16, y: 0}, {x: 17, y: 0}, {x: 18, y: 0}, {x: 19, y: 0}, {x: 20, y: 0}, {x: 21, y: 0}, {x: 22, y: 0}, {x: 23, y: 0}, {x: 24, y: 0},
                    {x: 0, y: 1}, {x: 24, y: 1}, {x: 0, y: 2}, {x: 24, y: 2}, {x: 0, y: 3}, {x: 24, y: 3}, {x: 0, y: 4}, {x: 24, y: 4}, {x: 0, y: 5}, {x: 24, y: 5}, {x: 0, y: 6}, {x: 24, y: 6}, {x: 0, y: 7}, {x: 24, y: 7}, {x: 0, y: 8}, {x: 24, y: 8}, {x: 0, y: 9}, {x: 24, y: 9}, {x: 0, y: 10}, {x: 24, y: 10}, {x: 0, y: 11}, {x: 24, y: 11}, {x: 0, y: 12}, {x: 24, y: 12}, {x: 0, y: 13}, {x: 24, y: 13}, {x: 0, y: 14}, {x: 24, y: 14}, {x: 0, y: 15}, {x: 24, y: 15}, {x: 0, y: 16}, {x: 24, y: 16},
                    {x: 0, y: 17}, {x: 1, y: 17}, {x: 2, y: 17}, {x: 3, y: 17}, {x: 4, y: 17}, {x: 5, y: 17}, {x: 6, y: 17}, {x: 7, y: 17}, {x: 8, y: 17}, {x: 9, y: 17}, {x: 10, y: 17}, {x: 11, y: 17}, {x: 13, y: 17}, {x: 14, y: 17}, {x: 15, y: 17}, {x: 16, y: 17}, {x: 17, y: 17}, {x: 18, y: 17}, {x: 19, y: 17}, {x: 20, y: 17}, {x: 21, y: 17}, {x: 22, y: 17}, {x: 23, y: 17}, {x: 24, y: 17},
                    {x: 18, y: 3}, {x: 19, y: 3}, {x: 20, y: 3}, {x: 21, y: 3}, {x: 22, y: 3},
                    {x: 18, y: 4}, {x: 22, y: 4}, {x: 18, y: 5}, {x: 22, y: 5}, {x: 18, y: 6}, {x: 19, y: 6}, {x: 21, y: 6}, {x: 22, y: 6}
                ],
                npcs: [
                    { x: 20, y: 5, type: 'ceo', name: 'CEO', dialog: ['축하합니다! 보물을 찾으셨네요!', '26주년 기념품을 받아가세요!'] }
                ],
                items: [
                    { x: 20, y: 4, type: 'treasure', name: '26주년 기념품', collected: false }
                ],
                portals: [
                    { x: 2, y: 12, targetMap: 'cafeteria', targetX: 22, targetY: 12, name: '카페테리아' },
                    { x: 12, y: 17, targetMap: 'lobby', targetX: 12, targetY: 1, name: '로비' }
                ]
            }
        };
    }

    getCurrentMap() {
        return this.maps[this.currentMap];
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (this.currentDialog) {
                if (e.code === 'Space' || e.code === 'Enter') {
                    this.nextDialog();
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
        const centerX = x * this.tileSize + this.tileSize / 2;
        const centerY = y * this.tileSize + this.tileSize / 2;

        this.ctx.save();
        this.ctx.translate(centerX, centerY);

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

        const x = item.x * this.tileSize + this.tileSize / 2;
        const y = item.y * this.tileSize + this.tileSize / 2;

        this.ctx.save();
        this.ctx.translate(x, y);

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
        this.ctx.font = '8px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 1;
        this.ctx.strokeText(item.name, x, y + 20);
        this.ctx.fillText(item.name, x, y + 20);
    }

    drawPortal(portal) {
        const x = portal.x * this.tileSize;
        const y = portal.y * this.tileSize;

        this.ctx.fillStyle = '#E74C3C';
        this.ctx.fillRect(x + 8, y + 8, this.tileSize - 16, this.tileSize - 16);

        this.ctx.fillStyle = 'white';
        this.ctx.font = '10px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 1;
        this.ctx.strokeText(
            portal.name,
            x + this.tileSize/2,
            y - 5
        );
        this.ctx.fillText(
            portal.name,
            x + this.tileSize/2,
            y - 5
        );
    }

    drawNPC(npc) {
        this.drawPixelCharacter(npc.x, npc.y, 'down', false);

        this.ctx.fillStyle = 'white';
        this.ctx.font = '10px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 2;
        this.ctx.strokeText(
            npc.name,
            npc.x * this.tileSize + this.tileSize/2,
            npc.y * this.tileSize - 10
        );
        this.ctx.fillText(
            npc.name,
            npc.x * this.tileSize + this.tileSize/2,
            npc.y * this.tileSize - 10
        );
    }

    drawTileMap() {
        const currentMap = this.getCurrentMap();

        for (let y = 0; y < this.mapHeight; y++) {
            for (let x = 0; x < this.mapWidth; x++) {
                const tileX = x * this.tileSize;
                const tileY = y * this.tileSize;

                this.ctx.fillStyle = currentMap.background;
                this.ctx.fillRect(tileX, tileY, this.tileSize, this.tileSize);

                if ((x + y) % 2 === 0) {
                    this.ctx.globalAlpha = 0.1;
                    this.ctx.fillStyle = '#000000';
                    this.ctx.fillRect(tileX, tileY, this.tileSize, this.tileSize);
                    this.ctx.globalAlpha = 1.0;
                }

                this.ctx.strokeStyle = 'rgba(0,0,0,0.1)';
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(tileX, tileY, this.tileSize, this.tileSize);
            }
        }
    }

    drawWalls() {
        const currentMap = this.getCurrentMap();
        currentMap.walls.forEach(wall => {
            const x = wall.x * this.tileSize;
            const y = wall.y * this.tileSize;

            this.ctx.fillStyle = '#8B4513';
            this.ctx.fillRect(x, y, this.tileSize, this.tileSize);

            this.ctx.fillStyle = '#A0522D';
            this.ctx.fillRect(x + 2, y + 2, this.tileSize - 4, this.tileSize - 4);

            this.ctx.strokeStyle = '#654321';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(x, y, this.tileSize, this.tileSize);
        });
    }

    drawMinimap() {
        if (!this.showMinimap) return;

        const minimapSize = 150;
        const minimapX = this.canvas.width - minimapSize - 10;
        const minimapY = 10;
        const scale = minimapSize / (this.mapWidth * this.tileSize);

        this.ctx.save();

        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(minimapX - 5, minimapY - 5, minimapSize + 10, minimapSize + 40);

        this.ctx.fillStyle = 'white';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(
            this.getCurrentMap().name,
            minimapX + minimapSize/2,
            minimapY - 10
        );

        this.ctx.translate(minimapX, minimapY);
        this.ctx.scale(scale, scale);

        this.drawTileMap();
        this.drawWalls();

        const currentMap = this.getCurrentMap();

        currentMap.portals.forEach(portal => {
            this.ctx.fillStyle = '#E74C3C';
            this.ctx.fillRect(
                portal.x * this.tileSize,
                portal.y * this.tileSize,
                this.tileSize,
                this.tileSize
            );
        });

        currentMap.npcs.forEach(npc => {
            this.ctx.fillStyle = '#9B59B6';
            this.ctx.fillRect(
                npc.x * this.tileSize,
                npc.y * this.tileSize,
                this.tileSize,
                this.tileSize
            );
        });

        this.ctx.fillStyle = '#3498DB';
        this.ctx.fillRect(
            this.player.x * this.tileSize,
            this.player.y * this.tileSize,
            this.tileSize,
            this.tileSize
        );

        this.ctx.restore();
    }

    drawInventory() {
        if (!this.showInventory) return;

        const invWidth = 300;
        const invHeight = 200;
        const invX = (this.canvas.width - invWidth) / 2;
        const invY = (this.canvas.height - invHeight) / 2;

        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(invX, invY, invWidth, invHeight);

        this.ctx.strokeStyle = '#F39C12';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(invX, invY, invWidth, invHeight);

        this.ctx.fillStyle = 'white';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('인벤토리 (I키로 닫기)', invX + invWidth/2, invY + 25);

        this.ctx.textAlign = 'left';
        this.ctx.font = '12px Arial';

        if (this.inventory.length === 0) {
            this.ctx.fillText('아이템이 없습니다.', invX + 20, invY + 60);
        } else {
            this.inventory.forEach((item, index) => {
                this.ctx.fillText(
                    `${index + 1}. ${item.name} (${item.mapFound}에서 발견)`,
                    invX + 20,
                    invY + 60 + index * 20
                );
            });
        }

        this.ctx.fillText(
            `수집한 아이템: ${this.gameState.itemsCollected}/${this.gameState.totalItems}`,
            invX + 20,
            invY + invHeight - 20
        );
    }

    drawUI() {
        this.ctx.fillStyle = 'white';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 1;

        const uiTexts = [
            `현재 위치: ${this.getCurrentMap().name}`,
            `아이템: ${this.gameState.itemsCollected}/${this.gameState.totalItems}`,
            `방문한 지역: ${this.gameState.visitedMaps.length}/4`,
            'I: 인벤토리, M: 미니맵 토글'
        ];

        uiTexts.forEach((text, index) => {
            this.ctx.strokeText(text, 10, 25 + index * 20);
            this.ctx.fillText(text, 10, 25 + index * 20);
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

        this.ctx.fillStyle = 'white';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 2;
        this.ctx.strokeText(
            '나',
            this.player.x * this.tileSize + this.tileSize/2,
            this.player.y * this.tileSize - 10
        );
        this.ctx.fillText(
            '나',
            this.player.x * this.tileSize + this.tileSize/2,
            this.player.y * this.tileSize - 10
        );

        this.drawUI();
        this.drawMinimap();
        this.drawInventory();
    }

    gameLoop() {
        this.updateAnimation();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

window.addEventListener('load', () => {
    new Game();
});