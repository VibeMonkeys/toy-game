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

        this.questSystem = {
            currentQuest: 0,
            showQuestUI: true,
            quests: [
                {
                    id: 0,
                    title: "회사 탐험 시작",
                    description: "김대리와 대화하여 첫 번째 단서를 얻으세요",
                    target: "talk_to_kim",
                    completed: false,
                    progress: 0,
                    maxProgress: 1
                },
                {
                    id: 1,
                    title: "회의실 조사",
                    description: "회의실로 이동하여 박과장과 대화하세요",
                    target: "talk_to_park",
                    completed: false,
                    progress: 0,
                    maxProgress: 1
                },
                {
                    id: 2,
                    title: "카페테리아 방문",
                    description: "카페테리아에서 이부장과 대화하세요",
                    target: "talk_to_lee",
                    completed: false,
                    progress: 0,
                    maxProgress: 1
                },
                {
                    id: 3,
                    title: "CEO와의 만남",
                    description: "CEO실에서 CEO와 대화하여 보물을 찾으세요",
                    target: "talk_to_ceo",
                    completed: false,
                    progress: 0,
                    maxProgress: 1
                },
                {
                    id: 4,
                    title: "보물 수집",
                    description: "모든 아이템을 수집하세요",
                    target: "collect_all_items",
                    completed: false,
                    progress: 0,
                    maxProgress: 4
                }
            ]
        };

        this.showInventory = false;
        this.showMinimap = true;

        this.nearbyNPC = null;
        this.showInteractionHint = false;
        this.itemNotification = null;
        this.itemNotificationTimer = 0;

        this.audioContext = null;
        this.soundEnabled = true;
        this.initializeAudio();

        this.initializeMaps();
        this.currentDialog = null;
        this.dialogIndex = 0;

        this.setupEventListeners();
        this.gameLoop();
    }

    initializeAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.warn('Web Audio API not supported:', error);
            this.soundEnabled = false;
        }
    }

    playSound(type, frequency = 440, duration = 200, volume = 0.1) {
        if (!this.soundEnabled || !this.audioContext) return;

        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration / 1000);

            switch(type) {
                case 'step':
                    oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
                    oscillator.type = 'square';
                    break;
                case 'item':
                    oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(1200, this.audioContext.currentTime + 0.1);
                    oscillator.type = 'sine';
                    break;
                case 'dialog':
                    oscillator.frequency.setValueAtTime(300, this.audioContext.currentTime);
                    oscillator.type = 'triangle';
                    break;
                case 'portal':
                    oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(600, this.audioContext.currentTime + 0.2);
                    oscillator.type = 'sawtooth';
                    break;
            }

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration / 1000);
        } catch (error) {
            console.warn('Error playing sound:', error);
        }
    }

    updateQuest(target, npcName = null) {
        const currentQuest = this.questSystem.quests[this.questSystem.currentQuest];
        if (!currentQuest || currentQuest.completed) return;

        let questCompleted = false;

        switch(target) {
            case 'talk_to_kim':
                if (currentQuest.target === 'talk_to_kim' && npcName === '김대리') {
                    currentQuest.progress = 1;
                    questCompleted = true;
                }
                break;
            case 'talk_to_park':
                if (currentQuest.target === 'talk_to_park' && npcName === '박과장') {
                    currentQuest.progress = 1;
                    questCompleted = true;
                }
                break;
            case 'talk_to_lee':
                if (currentQuest.target === 'talk_to_lee' && npcName === '이부장') {
                    currentQuest.progress = 1;
                    questCompleted = true;
                }
                break;
            case 'talk_to_ceo':
                if (currentQuest.target === 'talk_to_ceo' && npcName === 'CEO') {
                    currentQuest.progress = 1;
                    questCompleted = true;
                }
                break;
            case 'collect_item':
                const collectQuest = this.questSystem.quests.find(q => q.target === 'collect_all_items');
                if (collectQuest) {
                    collectQuest.progress = this.gameState.itemsCollected;
                    if (collectQuest.progress >= collectQuest.maxProgress) {
                        collectQuest.completed = true;
                        this.showItemNotification('모든 아이템 수집 완료!');
                    }
                }
                break;
        }

        if (questCompleted) {
            currentQuest.completed = true;
            this.showItemNotification(`퀘스트 완료: ${currentQuest.title}`);
            this.playSound('item', 1000, 500, 0.2);

            // 다음 퀘스트로 이동
            if (this.questSystem.currentQuest < this.questSystem.quests.length - 1) {
                this.questSystem.currentQuest++;
            }
        }
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

    generateOfficeItems() {
        return {
            desks: [
                {x: 5, y: 5}, {x: 6, y: 5}, {x: 8, y: 5}, {x: 9, y: 5},
                {x: 5, y: 8}, {x: 6, y: 8}, {x: 8, y: 8}, {x: 9, y: 8},
                {x: 12, y: 5}, {x: 13, y: 5}, {x: 15, y: 5}, {x: 16, y: 5},
                {x: 12, y: 8}, {x: 13, y: 8}, {x: 15, y: 8}, {x: 16, y: 8},
                {x: 25, y: 10}, {x: 26, y: 10}, {x: 28, y: 10}, {x: 29, y: 10},
                {x: 25, y: 13}, {x: 26, y: 13}, {x: 28, y: 13}, {x: 29, y: 13},
                {x: 32, y: 15}, {x: 33, y: 15}, {x: 35, y: 15}, {x: 36, y: 15}
            ],
            chairs: [
                {x: 5, y: 4}, {x: 6, y: 4}, {x: 8, y: 4}, {x: 9, y: 4},
                {x: 5, y: 9}, {x: 6, y: 9}, {x: 8, y: 9}, {x: 9, y: 9},
                {x: 12, y: 4}, {x: 13, y: 4}, {x: 15, y: 4}, {x: 16, y: 4},
                {x: 12, y: 9}, {x: 13, y: 9}, {x: 15, y: 9}, {x: 16, y: 9},
                {x: 25, y: 9}, {x: 26, y: 9}, {x: 28, y: 9}, {x: 29, y: 9},
                {x: 25, y: 14}, {x: 26, y: 14}, {x: 28, y: 14}, {x: 29, y: 14},
                {x: 32, y: 14}, {x: 33, y: 14}, {x: 35, y: 14}, {x: 36, y: 14}
            ],
            plants: [
                {x: 3, y: 3}, {x: 18, y: 3}, {x: 22, y: 7}, {x: 37, y: 12}, {x: 2, y: 20}
            ],
            printers: [
                {x: 19, y: 6}, {x: 31, y: 18}
            ],
            meetingTables: [
                {x: 15, y: 15, width: 3, height: 2},
                {x: 20, y: 20, width: 4, height: 3}
            ]
        };
    }

    initializeMaps() {
        const officeItems = this.generateOfficeItems();

        this.maps = {
            lobby: {
                name: '로비',
                background: '#F5F5F0',
                walls: this.generateWalls().concat([
                    {x: 15, y: 15}, {x: 16, y: 15}, {x: 17, y: 15},
                    {x: 15, y: 16}, {x: 17, y: 16},
                    {x: 15, y: 17}, {x: 16, y: 17}, {x: 17, y: 17}
                ]),
                officeItems: officeItems,
                npcs: [
                    { x: 7, y: 7, type: 'employee', name: '김대리', dialog: ['안녕하세요! 26주년을 축하합니다!', '회의실에 첫 번째 단서가 있어요. 북쪽 문으로 가보세요!'] },
                    { x: 27, y: 12, type: 'employee', name: '박대리', dialog: ['여기서 휴식을 취하세요!', '더 큰 세계를 탐험해보세요!'] },
                    { x: 34, y: 16, type: 'employee', name: '이사원', dialog: ['이곳은 오픈 오피스예요!', '자유롭게 돌아다니며 동료들과 대화해보세요!'] }
                ],
                items: [
                    { x: 10, y: 6, type: 'key', name: '로비 열쇠', collected: false },
                    { x: 30, y: 25, type: 'key', name: '비밀 열쇠', collected: false }
                ],
                portals: [
                    { x: 20, y: 1, targetMap: 'meeting_room', targetX: 20, targetY: 28, name: '회의실' }
                ]
            },
            meeting_room: {
                name: '회의실',
                background: '#E8F4FD',
                walls: this.generateWalls().concat([
                    {x: 8, y: 8}, {x: 9, y: 8}, {x: 11, y: 8}, {x: 12, y: 8}, {x: 13, y: 8}, {x: 14, y: 8}, {x: 15, y: 8}, {x: 16, y: 8},
                    {x: 8, y: 9}, {x: 16, y: 9}, {x: 8, y: 10}, {x: 16, y: 10}, {x: 8, y: 11}, {x: 9, y: 11}, {x: 15, y: 11}, {x: 16, y: 11}
                ]),
                officeItems: {
                    meetingTables: [{x: 10, y: 9, width: 5, height: 2}],
                    chairs: [{x: 9, y: 10}, {x: 10, y: 10}, {x: 11, y: 10}, {x: 12, y: 10}, {x: 13, y: 10}, {x: 14, y: 10}, {x: 15, y: 10}],
                    desks: [],
                    plants: [{x: 20, y: 5}, {x: 25, y: 15}],
                    printers: []
                },
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
                background: '#FFF8E1',
                walls: this.generateWalls(),
                officeItems: {
                    meetingTables: [{x: 10, y: 10, width: 4, height: 3}, {x: 25, y: 8, width: 3, height: 2}],
                    chairs: [{x: 9, y: 10}, {x: 10, y: 9}, {x: 13, y: 9}, {x: 14, y: 10}, {x: 24, y: 8}, {x: 25, y: 7}, {x: 27, y: 7}, {x: 28, y: 8}],
                    desks: [],
                    plants: [{x: 5, y: 5}, {x: 35, y: 10}],
                    printers: [{x: 20, y: 15}]
                },
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
                background: '#F3E5F5',
                walls: this.generateWalls().concat([
                    {x: 18, y: 10}, {x: 19, y: 10}, {x: 20, y: 10}, {x: 21, y: 10}, {x: 22, y: 10},
                    {x: 18, y: 11}, {x: 22, y: 11}, {x: 18, y: 12}, {x: 22, y: 12}, {x: 18, y: 13}, {x: 19, y: 13}, {x: 21, y: 13}, {x: 22, y: 13}
                ]),
                officeItems: {
                    desks: [{x: 19, y: 11}, {x: 20, y: 11}, {x: 21, y: 11}],
                    chairs: [{x: 20, y: 13}],
                    meetingTables: [],
                    plants: [{x: 15, y: 8}, {x: 25, y: 8}, {x: 30, y: 20}],
                    printers: []
                },
                npcs: [
                    { x: 20, y: 15, type: 'ceo', name: 'CEO', dialog: ['축하합니다! 보물을 찾으셨네요!', '26주년 기념품을 받아가세요!'] }
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
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'KeyI', 'KeyM', 'KeyQ', 'Escape', 'Enter'].includes(e.code)) {
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

            if (e.code === 'KeyQ') {
                this.questSystem.showQuestUI = !this.questSystem.showQuestUI;
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

                this.playSound('step', 200, 100, 0.05);

                this.checkPortal();
                this.checkNearbyNPC();
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
            this.playSound('portal', 400, 400, 0.12);
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
            this.playSound('item', 800, 300, 0.15);
            this.showItemNotification(`${item.name}을(를) 획득했습니다!`);
            this.updateQuest('collect_item');
        }
    }

    showItemNotification(text) {
        this.itemNotification = text;
        this.itemNotificationTimer = Date.now();
    }

    checkNearbyNPC() {
        const currentMap = this.getCurrentMap();
        const nearbyNPC = currentMap.npcs.find(npc =>
            Math.abs(npc.x - this.player.x) <= 1 &&
            Math.abs(npc.y - this.player.y) <= 1
        );

        if (nearbyNPC) {
            this.nearbyNPC = nearbyNPC;
            this.showInteractionHint = true;
        } else {
            this.nearbyNPC = null;
            this.showInteractionHint = false;
        }
    }

    interactWithNPC() {
        if (this.nearbyNPC && !this.currentDialog) {
            this.startDialog(this.nearbyNPC);
            this.showInteractionHint = false;
        }
    }

    startDialog(npc) {
        this.currentDialog = npc.dialog;
        this.dialogIndex = 0;
        this.playSound('dialog', 300, 200, 0.1);
        this.showDialog(npc.name + ': ' + this.currentDialog[this.dialogIndex]);

        // 퀘스트 업데이트
        switch(npc.name) {
            case '김대리':
                this.updateQuest('talk_to_kim', npc.name);
                break;
            case '박과장':
                this.updateQuest('talk_to_park', npc.name);
                break;
            case '이부장':
                this.updateQuest('talk_to_lee', npc.name);
                break;
            case 'CEO':
                this.updateQuest('talk_to_ceo', npc.name);
                break;
        }
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

        // 애니메이션 계산
        let bobOffset = 0;
        let legOffset = 0;
        if (isPlayer && this.player.isMoving) {
            const animTime = (Date.now() - this.player.animTimer) / 100;
            bobOffset = Math.sin(animTime * 8) * 1;
            legOffset = Math.sin(animTime * 8) * 2;
        }

        // 몸 위치 조정
        this.ctx.translate(0, bobOffset);

        if (isPlayer) {
            this.ctx.fillStyle = '#4A90E2';
        } else {
            this.ctx.fillStyle = '#8E44AD';
        }

        // 몸통
        this.ctx.fillRect(-6, -8, 12, 8);

        // 머리
        this.ctx.fillStyle = '#F4D1AE';
        this.ctx.fillRect(-4, -12, 8, 6);

        // 눈
        this.ctx.fillStyle = '#2C3E50';
        this.ctx.fillRect(-3, -11, 2, 2);
        this.ctx.fillRect(1, -11, 2, 2);

        // 입
        this.ctx.fillStyle = '#34495E';
        this.ctx.fillRect(-2, -7, 4, 1);

        // 셔츠/옷
        this.ctx.fillStyle = isPlayer ? '#3498DB' : '#9B59B6';
        this.ctx.fillRect(-5, 0, 10, 8);

        // 다리 (애니메이션 적용)
        this.ctx.fillStyle = '#2C3E50';
        if (isPlayer && this.player.isMoving) {
            // 걸을 때 다리 애니메이션
            this.ctx.fillRect(-3, 8 - legOffset, 2, 6 + legOffset);
            this.ctx.fillRect(1, 8 + legOffset, 2, 6 - legOffset);
        } else {
            // 정지 상태
            this.ctx.fillRect(-3, 8, 2, 6);
            this.ctx.fillRect(1, 8, 2, 6);
        }

        // 신발
        this.ctx.fillStyle = '#34495E';
        if (isPlayer && this.player.isMoving) {
            this.ctx.fillRect(-4, 13 - legOffset, 3, 2);
            this.ctx.fillRect(1, 13 + legOffset, 3, 2);
        } else {
            this.ctx.fillRect(-4, 13, 3, 2);
            this.ctx.fillRect(1, 13, 3, 2);
        }

        // 팔 (방향에 따라)
        this.ctx.fillStyle = '#F4D1AE';
        if (direction === 'left') {
            this.ctx.fillRect(-7, -4, 3, 6);
        } else if (direction === 'right') {
            this.ctx.fillRect(4, -4, 3, 6);
        } else {
            // 걸을 때 팔 흔들림
            if (isPlayer && this.player.isMoving) {
                const armSwing = Math.sin((Date.now() - this.player.animTimer) / 100 * 8) * 1;
                this.ctx.fillRect(-7, -4 + armSwing, 3, 6);
                this.ctx.fillRect(4, -4 - armSwing, 3, 6);
            } else {
                this.ctx.fillRect(-7, -4, 3, 6);
                this.ctx.fillRect(4, -4, 3, 6);
            }
        }

        this.ctx.restore();
    }

    drawItem(item) {
        if (item.collected) return;
        if (item.x < this.camera.x || item.x >= this.camera.x + this.camera.viewWidth + 1 ||
            item.y < this.camera.y || item.y >= this.camera.y + this.camera.viewHeight + 1) return;

        const screenX = (item.x - this.camera.x) * this.tileSize + this.tileSize / 2;
        const screenY = (item.y - this.camera.y) * this.tileSize + this.tileSize / 2;

        // 반짝임 효과
        const sparkleTime = Date.now() / 200;
        const sparkleIntensity = (Math.sin(sparkleTime) + 1) / 2;
        const bobEffect = Math.sin(Date.now() / 300) * 2;

        this.ctx.save();
        this.ctx.translate(screenX, screenY + bobEffect);

        // 글로우 효과
        this.ctx.shadowColor = 'rgba(255, 255, 255, ' + (sparkleIntensity * 0.8) + ')';
        this.ctx.shadowBlur = 8 + sparkleIntensity * 4;

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

        // 반짝이 입자 효과
        if (sparkleIntensity > 0.7) {
            this.ctx.shadowColor = 'transparent';
            this.ctx.shadowBlur = 0;
            this.ctx.fillStyle = 'rgba(255, 255, 255, ' + sparkleIntensity + ')';

            for (let i = 0; i < 3; i++) {
                const angle = (Date.now() / 100 + i * 120) * Math.PI / 180;
                const sparkleX = Math.cos(angle) * 12;
                const sparkleY = Math.sin(angle) * 12;
                this.ctx.fillRect(sparkleX - 1, sparkleY - 1, 2, 2);
            }
        }

        this.ctx.restore();

        // 아이템 이름 (반짝임 효과 포함)
        this.ctx.fillStyle = 'rgba(255, 255, 255, ' + (0.8 + sparkleIntensity * 0.2) + ')';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.lineWidth = 2;
        this.ctx.strokeText(item.name, screenX, screenY + 30 + bobEffect);
        this.ctx.fillText(item.name, screenX, screenY + 30 + bobEffect);
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

    drawFloor() {
        const currentMap = this.getCurrentMap();

        // 전체 바닥을 부드럽게 그리기
        const startX = this.camera.x * this.tileSize;
        const startY = this.camera.y * this.tileSize;
        const viewWidth = this.canvas.width + this.tileSize;
        const viewHeight = this.canvas.height + this.tileSize;

        // 기본 바닥 색상
        this.ctx.fillStyle = currentMap.background;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 맵별 바닥 텍스처 패턴 추가
        this.ctx.globalAlpha = 0.05;

        switch(this.currentMap) {
            case 'lobby':
                // 로비 - 대리석 패턴
                this.drawMarblePattern(0, 0, this.canvas.width, this.canvas.height);
                break;
            case 'meeting_room':
                // 회의실 - 카펫 패턴
                this.drawCarpetPattern(0, 0, this.canvas.width, this.canvas.height);
                break;
            case 'cafeteria':
                // 카페테리아 - 타일 패턴 (부드럽게)
                this.drawSoftTilePattern(0, 0, this.canvas.width, this.canvas.height);
                break;
            case 'ceo_office':
                // CEO실 - 고급 우드 패턴
                this.drawWoodPattern(0, 0, this.canvas.width, this.canvas.height);
                break;
        }

        this.ctx.globalAlpha = 1.0;

        // 영역 경계 표시 (벽이 아닌 곳에서만)
        this.drawAreaBoundaries();
    }

    drawMarblePattern(x, y, width, height) {
        // 대리석 베인 패턴 (시드 기반으로 일관성 있게)
        const seed = 42; // 고정 시드
        for (let i = 0; i < 20; i++) {
            this.ctx.strokeStyle = 'rgba(200, 200, 200, 0.3)';
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();

            // 시드 기반 의사 랜덤
            const r1 = Math.sin(seed + i * 1.1) * 0.5 + 0.5;
            const r2 = Math.sin(seed + i * 2.3) * 0.5 + 0.5;
            const r3 = Math.sin(seed + i * 3.7) * 0.5 + 0.5;

            this.ctx.moveTo(x + r1 * width, y);
            this.ctx.quadraticCurveTo(
                x + r2 * width,
                y + height * 0.5,
                x + r3 * width,
                y + height
            );
            this.ctx.stroke();
        }
    }

    drawCarpetPattern(x, y, width, height) {
        // 카펫 텍스처 (시드 기반)
        for (let i = 0; i < width; i += 8) {
            for (let j = 0; j < height; j += 8) {
                const seedValue = Math.sin(i * 0.1 + j * 0.1 + 100) * 0.5 + 0.5;
                if (seedValue > 0.7) {
                    this.ctx.fillStyle = 'rgba(100, 100, 100, 0.2)';
                    this.ctx.fillRect(x + i, y + j, 2, 2);
                }
            }
        }
    }

    drawSoftTilePattern(x, y, width, height) {
        // 부드러운 타일 구분선
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.lineWidth = 1;

        for (let i = 0; i < width; i += this.tileSize * 2) {
            this.ctx.beginPath();
            this.ctx.moveTo(x + i, y);
            this.ctx.lineTo(x + i, y + height);
            this.ctx.stroke();
        }

        for (let j = 0; j < height; j += this.tileSize * 2) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, y + j);
            this.ctx.lineTo(x + width, y + j);
            this.ctx.stroke();
        }
    }

    drawWoodPattern(x, y, width, height) {
        // 나무 결 패턴
        this.ctx.strokeStyle = 'rgba(139, 69, 19, 0.1)';
        this.ctx.lineWidth = 1;

        for (let i = 0; i < 10; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, y + i * height / 10 + Math.sin(i) * 5);
            this.ctx.lineTo(x + width, y + i * height / 10 + Math.sin(i + width/50) * 5);
            this.ctx.stroke();
        }
    }

    drawAreaBoundaries() {
        // 특별한 영역이나 전환점에 미묘한 경계선 추가 (필요시)
        const currentMap = this.getCurrentMap();

        // 포털 주변에 미묘한 표시
        currentMap.portals.forEach(portal => {
            if (portal.x >= this.camera.x && portal.x < this.camera.x + this.camera.viewWidth &&
                portal.y >= this.camera.y && portal.y < this.camera.y + this.camera.viewHeight) {

                const screenX = (portal.x - this.camera.x) * this.tileSize;
                const screenY = (portal.y - this.camera.y) * this.tileSize;

                this.ctx.strokeStyle = 'rgba(231, 76, 60, 0.2)';
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(screenX - 10, screenY - 10, this.tileSize + 20, this.tileSize + 20);
            }
        });
    }

    drawOfficeItems() {
        const currentMap = this.getCurrentMap();
        if (!currentMap.officeItems) return;

        // 책상 그리기
        currentMap.officeItems.desks.forEach(desk => {
            if (desk.x < this.camera.x || desk.x >= this.camera.x + this.camera.viewWidth + 1 ||
                desk.y < this.camera.y || desk.y >= this.camera.y + this.camera.viewHeight + 1) return;

            const screenX = (desk.x - this.camera.x) * this.tileSize;
            const screenY = (desk.y - this.camera.y) * this.tileSize;

            this.ctx.fillStyle = '#8B4513';
            this.ctx.fillRect(screenX + 4, screenY + 4, this.tileSize - 8, this.tileSize - 8);
            this.ctx.fillStyle = '#A0522D';
            this.ctx.fillRect(screenX + 6, screenY + 6, this.tileSize - 12, this.tileSize - 12);
        });

        // 의자 그리기
        currentMap.officeItems.chairs.forEach(chair => {
            if (chair.x < this.camera.x || chair.x >= this.camera.x + this.camera.viewWidth + 1 ||
                chair.y < this.camera.y || chair.y >= this.camera.y + this.camera.viewHeight + 1) return;

            const screenX = (chair.x - this.camera.x) * this.tileSize;
            const screenY = (chair.y - this.camera.y) * this.tileSize;

            this.ctx.fillStyle = '#34495E';
            this.ctx.fillRect(screenX + 8, screenY + 8, this.tileSize - 16, this.tileSize - 16);
            this.ctx.fillStyle = '#2C3E50';
            this.ctx.fillRect(screenX + 10, screenY + 6, this.tileSize - 20, 8);
        });

        // 화분 그리기
        currentMap.officeItems.plants.forEach(plant => {
            if (plant.x < this.camera.x || plant.x >= this.camera.x + this.camera.viewWidth + 1 ||
                plant.y < this.camera.y || plant.y >= this.camera.y + this.camera.viewHeight + 1) return;

            const screenX = (plant.x - this.camera.x) * this.tileSize;
            const screenY = (plant.y - this.camera.y) * this.tileSize;

            this.ctx.fillStyle = '#8B4513';
            this.ctx.fillRect(screenX + 10, screenY + 20, this.tileSize - 20, 12);
            this.ctx.fillStyle = '#27AE60';
            this.ctx.fillRect(screenX + 8, screenY + 8, this.tileSize - 16, 16);
        });

        // 프린터 그리기
        currentMap.officeItems.printers.forEach(printer => {
            if (printer.x < this.camera.x || printer.x >= this.camera.x + this.camera.viewWidth + 1 ||
                printer.y < this.camera.y || printer.y >= this.camera.y + this.camera.viewHeight + 1) return;

            const screenX = (printer.x - this.camera.x) * this.tileSize;
            const screenY = (printer.y - this.camera.y) * this.tileSize;

            this.ctx.fillStyle = '#95A5A6';
            this.ctx.fillRect(screenX + 6, screenY + 8, this.tileSize - 12, this.tileSize - 16);
            this.ctx.fillStyle = '#2C3E50';
            this.ctx.fillRect(screenX + 8, screenY + 10, this.tileSize - 16, 4);
        });

        // 회의 테이블 그리기
        currentMap.officeItems.meetingTables.forEach(table => {
            const endX = table.x + table.width;
            const endY = table.y + table.height;

            if (endX < this.camera.x || table.x >= this.camera.x + this.camera.viewWidth + 1 ||
                endY < this.camera.y || table.y >= this.camera.y + this.camera.viewHeight + 1) return;

            const screenX = (table.x - this.camera.x) * this.tileSize;
            const screenY = (table.y - this.camera.y) * this.tileSize;
            const width = table.width * this.tileSize;
            const height = table.height * this.tileSize;

            this.ctx.fillStyle = '#8B4513';
            this.ctx.fillRect(screenX, screenY, width, height);
            this.ctx.fillStyle = '#A0522D';
            this.ctx.fillRect(screenX + 4, screenY + 4, width - 8, height - 8);
        });
    }

    drawWalls() {
        const currentMap = this.getCurrentMap();
        currentMap.walls.forEach(wall => {
            if (wall.x < this.camera.x || wall.x >= this.camera.x + this.camera.viewWidth + 1 ||
                wall.y < this.camera.y || wall.y >= this.camera.y + this.camera.viewHeight + 1) return;

            const screenX = (wall.x - this.camera.x) * this.tileSize;
            const screenY = (wall.y - this.camera.y) * this.tileSize;

            this.ctx.fillStyle = '#34495E';
            this.ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);

            this.ctx.fillStyle = '#2C3E50';
            this.ctx.fillRect(screenX + 2, screenY + 2, this.tileSize - 4, this.tileSize - 4);

            this.ctx.strokeStyle = '#1A252F';
            this.ctx.lineWidth = 1;
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

    drawQuestUI() {
        if (!this.questSystem.showQuestUI) return;

        const questWidth = 400;
        const questHeight = 200;
        const questX = 10;
        const questY = 10;

        // 배경
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(questX, questY, questWidth, questHeight);

        // 테두리
        this.ctx.strokeStyle = '#3498DB';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(questX, questY, questWidth, questHeight);

        // 제목
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 18px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('퀘스트 (Q키로 닫기)', questX + questWidth/2, questY + 25);

        // 현재 퀘스트
        const currentQuest = this.questSystem.quests[this.questSystem.currentQuest];
        if (currentQuest && !currentQuest.completed) {
            this.ctx.textAlign = 'left';
            this.ctx.font = 'bold 16px Arial';
            this.ctx.fillStyle = '#F39C12';
            this.ctx.fillText('현재 목표:', questX + 15, questY + 55);

            this.ctx.font = '14px Arial';
            this.ctx.fillStyle = 'white';
            this.ctx.fillText(currentQuest.title, questX + 15, questY + 80);

            this.ctx.font = '12px Arial';
            this.ctx.fillStyle = '#BDC3C7';
            this.ctx.fillText(currentQuest.description, questX + 15, questY + 100);

            // 진행률 바
            const progressBarWidth = 350;
            const progressBarHeight = 8;
            const progressBarX = questX + 15;
            const progressBarY = questY + 115;

            // 배경 바
            this.ctx.fillStyle = '#34495E';
            this.ctx.fillRect(progressBarX, progressBarY, progressBarWidth, progressBarHeight);

            // 진행률 바
            const progress = currentQuest.progress / currentQuest.maxProgress;
            this.ctx.fillStyle = '#2ECC71';
            this.ctx.fillRect(progressBarX, progressBarY, progressBarWidth * progress, progressBarHeight);

            // 진행률 텍스트
            this.ctx.fillStyle = 'white';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'right';
            this.ctx.fillText(`${currentQuest.progress}/${currentQuest.maxProgress}`, questX + questWidth - 15, progressBarY + progressBarHeight + 12);
        } else {
            // 모든 퀘스트 완료
            this.ctx.textAlign = 'center';
            this.ctx.font = 'bold 16px Arial';
            this.ctx.fillStyle = '#2ECC71';
            this.ctx.fillText('모든 퀘스트 완료!', questX + questWidth/2, questY + 80);

            this.ctx.font = '14px Arial';
            this.ctx.fillStyle = '#BDC3C7';
            this.ctx.fillText('축하합니다! 26주년 기념 보물찾기를 완료했습니다!', questX + questWidth/2, questY + 110);
        }

        // 완료된 퀘스트 수
        const completedQuests = this.questSystem.quests.filter(q => q.completed).length;
        this.ctx.textAlign = 'center';
        this.ctx.font = '12px Arial';
        this.ctx.fillStyle = '#95A5A6';
        this.ctx.fillText(`완료된 퀘스트: ${completedQuests}/${this.questSystem.quests.length}`, questX + questWidth/2, questY + questHeight - 15);
    }

    drawInteractionHint() {
        if (!this.showInteractionHint || this.currentDialog) return;

        const playerScreenX = (this.player.x - this.camera.x) * this.tileSize + this.tileSize/2;
        const playerScreenY = (this.player.y - this.camera.y) * this.tileSize - 40;

        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(playerScreenX - 60, playerScreenY - 15, 120, 25);

        this.ctx.strokeStyle = '#F39C12';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(playerScreenX - 60, playerScreenY - 15, 120, 25);

        this.ctx.fillStyle = 'white';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('스페이스(말걸기)', playerScreenX, playerScreenY);
    }

    drawItemNotification() {
        if (!this.itemNotification) return;

        const elapsed = Date.now() - this.itemNotificationTimer;
        if (elapsed > 3000) {
            this.itemNotification = null;
            return;
        }

        const centerX = this.canvas.width / 2;
        const centerY = 100;
        const alpha = elapsed < 2500 ? 1 : (3000 - elapsed) / 500;

        this.ctx.save();
        this.ctx.globalAlpha = alpha;

        this.ctx.fillStyle = 'rgba(46, 204, 113, 0.9)';
        this.ctx.fillRect(centerX - 150, centerY - 20, 300, 40);

        this.ctx.strokeStyle = '#27AE60';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(centerX - 150, centerY - 20, 300, 40);

        this.ctx.fillStyle = 'white';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(this.itemNotification, centerX, centerY + 5);

        this.ctx.restore();
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
            'I: 인벤토리, M: 미니맵, Q: 퀘스트, 스페이스: 대화'
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

        // 아이템 알림 자동 제거
        if (this.itemNotification && Date.now() - this.itemNotificationTimer > 3000) {
            this.itemNotification = null;
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawFloor();
        this.drawOfficeItems();
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

        this.drawInteractionHint();
        this.drawItemNotification();
        this.drawUI();
        this.drawMinimap();
        this.drawInventory();
        this.drawQuestUI();
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