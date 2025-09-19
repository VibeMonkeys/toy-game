import { CONSTANTS } from '../utils/Constants.js';
import { SaveSystem } from '../utils/SaveSystem.js';
import { AudioManager } from '../utils/AudioManager.js';
import { Player } from '../entities/Player.js';
import { GameState } from './GameState.js';
import { QuestSystem } from './QuestSystem.js';
import { TitleScreen } from '../ui/TitleScreen.js';
import { QuestUI } from '../ui/QuestUI.js';
import { Minimap } from '../ui/Minimap.js';
import { Inventory } from '../ui/Inventory.js';
import { PauseMenu } from '../ui/PauseMenu.js';
import { MapManager } from '../maps/MapManager.js';
import { Camera } from '../maps/Camera.js';
import { Renderer } from '../graphics/Renderer.js';
import { AnimationSystem } from '../graphics/AnimationSystem.js';

export class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');

        // 게임 상태 관리
        this.gameMode = CONSTANTS.GAME_MODES.TITLE;

        // 시스템 초기화
        this.audioManager = new AudioManager();
        this.player = new Player();
        this.gameState = new GameState();
        this.questSystem = new QuestSystem();
        this.mapManager = new MapManager();
        this.camera = new Camera(this.canvas);
        this.animationSystem = new AnimationSystem();
        this.renderer = new Renderer(this.canvas, this.ctx, this.animationSystem);

        // UI 시스템
        this.titleScreen = new TitleScreen(this.canvas, this.ctx, this.audioManager);
        this.questUI = new QuestUI(this.canvas, this.ctx);
        this.minimap = new Minimap(this.canvas, this.ctx);
        this.inventory = new Inventory(this.canvas, this.ctx);
        this.pauseMenu = new PauseMenu(this.canvas, this.ctx, this.audioManager);

        // 다이얼로그 시스템
        this.currentDialog = null;
        this.dialogIndex = 0;

        // 상호작용 시스템
        this.nearbyNPC = null;
        this.showInteractionHint = false;

        // 초기화
        this.init();
    }

    init() {
        // 저장된 게임 확인 후 타이틀 옵션 설정
        const hasSavedGame = SaveSystem.checkSavedGame();
        const titleOptions = hasSavedGame ?
            ['게임 계속하기', '새 게임 시작', '게임 정보'] :
            ['새 게임 시작', '게임 정보'];

        this.titleScreen.setMenuOptions(titleOptions);

        // 오디오 초기화
        this.audioManager.init();

        // 이벤트 리스너 설정
        this.setupEventListeners();

        // 게임 루프 시작
        this.gameLoop();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (event) => {
            this.handleInput(event);
        });

        this.canvas.addEventListener('mousemove', (event) => {
            if (this.gameMode === CONSTANTS.GAME_MODES.TITLE) {
                this.titleScreen.handleMouseMove(event);
            }
        });

        this.canvas.addEventListener('click', (event) => {
            if (this.gameMode === CONSTANTS.GAME_MODES.TITLE) {
                const result = this.titleScreen.handleMouseClick(event);
                if (result) {
                    this.handleTitleSelection(result);
                }
            }
        });
    }

    handleInput(event) {
        if (this.gameMode === CONSTANTS.GAME_MODES.TITLE) {
            const result = this.titleScreen.handleKeyDown(event);
            if (result) {
                this.handleTitleSelection(result);
            }
        } else if (this.gameMode === CONSTANTS.GAME_MODES.PLAYING) {
            this.handleGameInput(event);
        }
    }

    handleTitleSelection(selection) {
        switch (selection) {
            case '게임 계속하기':
                this.loadGame();
                break;
            case '새 게임 시작':
                this.startNewGame();
                break;
        }
    }

    handleGameInput(event) {
        // 일시정지 메뉴가 열려있을 때
        const pauseResult = this.pauseMenu.handleKeyDown(event);
        if (pauseResult) {
            this.handlePauseMenuAction(pauseResult);
            return;
        }

        // ESC 키로 일시정지 메뉴 열기
        if (event.key === 'Escape') {
            this.pauseMenu.show();
            return;
        }

        // 다이얼로그가 열려있을 때
        if (this.currentDialog) {
            if (event.key === ' ' || event.key === 'Enter') {
                this.nextDialog();
                event.preventDefault();
            }
            return;
        }

        // 일반 게임 입력
        switch (event.key) {
            case 'ArrowUp':
                this.movePlayer(0, -1);
                break;
            case 'ArrowDown':
                this.movePlayer(0, 1);
                break;
            case 'ArrowLeft':
                this.movePlayer(-1, 0);
                break;
            case 'ArrowRight':
                this.movePlayer(1, 0);
                break;
            case ' ':
                this.interact();
                break;
            case 's':
            case 'S':
                this.saveGame();
                break;
        }
    }

    handlePauseMenuAction(action) {
        switch (action) {
            case 'resume':
                // 게임 계속하기
                this.applyPauseMenuSettings();
                break;
            case 'save':
                this.saveGame();
                this.pauseMenu.hide();
                this.applyPauseMenuSettings();
                break;
            case 'title':
                // 타이틀로 돌아가기
                this.gameMode = CONSTANTS.GAME_MODES.TITLE;
                this.pauseMenu.hide();
                break;
            case 'quit':
                // 게임 종료 (브라우저에서는 탭 닫기 안내)
                if (confirm('정말로 게임을 종료하시겠습니까?')) {
                    window.close() || alert('브라우저 탭을 닫아주세요.');
                }
                break;
        }
    }

    applyPauseMenuSettings() {
        const settings = this.pauseMenu.getSettings();

        // 오디오 설정 적용
        this.audioManager.setSoundEnabled(settings.soundEnabled);

        // UI 표시 설정 (향후 구현 가능)
        // this.showMinimap = settings.showMinimap;
        // this.showQuestUI = settings.showQuestUI;
    }

    movePlayer(dx, dy) {
        const newX = this.player.x + dx;
        const newY = this.player.y + dy;

        if (this.mapManager.isValidPosition(newX, newY, false, this.player.getPosition())) {
            this.player.move(dx, dy);

            // 포털 확인
            const portal = this.mapManager.findPortalAt(newX, newY);
            if (portal) {
                this.usePortal(portal);
                return;
            }

            // 아이템 확인
            const item = this.mapManager.findItemAt(newX, newY);
            if (item) {
                this.collectItem(item);
            }

            // 카메라 업데이트
            this.camera.update(this.player.x, this.player.y);

            // 현재 맵을 게임 상태에 기록
            this.gameState.visitMap(this.mapManager.getCurrentMapId());
        }

        // 이동 후 주변 NPC 확인
        this.checkNearbyNPC();
        this.player.stopMoving();
    }

    usePortal(portal) {
        if (this.mapManager.setCurrentMap(portal.targetMap)) {
            this.player.setPosition(portal.targetX, portal.targetY);
            this.camera.update(this.player.x, this.player.y);
            this.gameState.visitMap(portal.targetMap);
        }
    }

    collectItem(item) {
        const collectedItem = this.mapManager.collectItem(item.x, item.y);
        if (collectedItem) {
            this.gameState.addItem(collectedItem);
            this.inventory.showItemNotification(collectedItem);
            this.audioManager.playItemCollect();

            // 퀘스트 진행 업데이트
            this.questSystem.updateProgress(
                CONSTANTS.QUEST_TARGETS.COLLECT_ALL_ITEMS,
                this.gameState.itemsCollected
            );
        }
    }

    checkNearbyNPC() {
        this.nearbyNPC = this.mapManager.getNearbyNPC(this.player.x, this.player.y);
        this.showInteractionHint = this.nearbyNPC !== null;
    }

    interact() {
        if (this.nearbyNPC) {
            this.startDialog(this.nearbyNPC);

            // 퀘스트 진행
            if (this.nearbyNPC.questTarget) {
                this.questSystem.completeQuest(this.nearbyNPC.questTarget);
            }
        }
    }

    startDialog(npc) {
        this.currentDialog = npc.dialog;
        this.dialogIndex = 0;
        this.showDialog();
    }

    showDialog() {
        if (!this.currentDialog || this.dialogIndex >= this.currentDialog.length) {
            this.closeDialog();
            return;
        }

        const dialogBox = document.getElementById('dialogBox');
        const dialogText = document.getElementById('dialogText');

        dialogBox.classList.remove('hidden');
        dialogText.textContent = this.currentDialog[this.dialogIndex];
    }

    nextDialog() {
        this.dialogIndex++;
        this.showDialog();
    }

    closeDialog() {
        this.currentDialog = null;
        this.dialogIndex = 0;
        const dialogBox = document.getElementById('dialogBox');
        dialogBox.classList.add('hidden');
    }

    saveGame() {
        const gameData = {
            currentMapId: this.mapManager.getCurrentMapId(),
            player: this.player.serialize(),
            gameState: this.gameState.serialize(),
            questSystem: this.questSystem.serialize()
        };

        if (SaveSystem.saveGame(gameData)) {
            this.inventory.showItemNotification({ name: '게임이 저장되었습니다!' });
        } else {
            this.inventory.showItemNotification({ name: '게임 저장에 실패했습니다.' });
        }
    }

    loadGame() {
        const gameData = SaveSystem.loadGame();
        if (gameData) {
            this.mapManager.setCurrentMap(gameData.currentMapId);
            this.player.deserialize(gameData.player);
            this.gameState.deserialize(gameData.gameState);
            this.questSystem.deserialize(gameData.questSystem);

            this.camera.update(this.player.x, this.player.y);
            this.gameMode = CONSTANTS.GAME_MODES.PLAYING;
            this.inventory.showItemNotification({ name: '게임이 로드되었습니다!' });
        }
    }

    startNewGame() {
        // 초기 상태로 리셋
        this.mapManager.setCurrentMap(CONSTANTS.MAPS.BUILDING_ENTRANCE);
        this.player = new Player(12, 15);
        this.gameState = new GameState();
        this.questSystem = new QuestSystem();

        this.camera.update(this.player.x, this.player.y);
        this.gameMode = CONSTANTS.GAME_MODES.PLAYING;
        this.inventory.showItemNotification({ name: '새 게임을 시작합니다!' });
    }

    update() {
        this.animationSystem.update();

        if (this.gameMode === CONSTANTS.GAME_MODES.TITLE) {
            this.titleScreen.update();
        } else if (this.gameMode === CONSTANTS.GAME_MODES.PLAYING) {
            this.animationSystem.updateCharacterAnimation(this.player);
        }
    }

    draw() {
        this.renderer.clearScreen();

        if (this.gameMode === CONSTANTS.GAME_MODES.TITLE) {
            this.titleScreen.draw();
            return;
        }

        if (this.gameMode === CONSTANTS.GAME_MODES.PLAYING) {
            const currentMap = this.mapManager.getCurrentMap();

            // 월드 렌더링
            this.renderer.drawFloor(this.camera, currentMap);
            this.renderer.drawOfficeItems(this.camera, currentMap);
            this.renderer.drawWalls(this.camera, currentMap);
            this.renderer.drawPortals(this.camera, currentMap);
            this.renderer.drawItems(this.camera, currentMap);
            this.renderer.drawNPCs(this.camera, currentMap);

            // 플레이어 렌더링
            this.renderer.drawPixelCharacter(
                this.player.x,
                this.player.y,
                this.player.direction,
                true,
                null,
                this.camera
            );

            // 플레이어 이름 표시
            const playerScreenPos = this.camera.worldToScreen(this.player.x, this.player.y);
            this.ctx.fillStyle = 'white';
            this.ctx.font = '18px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.strokeStyle = 'black';
            this.ctx.lineWidth = 4;
            this.ctx.strokeText('나', playerScreenPos.x + CONSTANTS.TILE_SIZE/2, playerScreenPos.y - 15);
            this.ctx.fillText('나', playerScreenPos.x + CONSTANTS.TILE_SIZE/2, playerScreenPos.y - 15);

            // 상호작용 힌트
            if (this.showInteractionHint) {
                this.drawInteractionHint();
            }

            // UI 렌더링
            this.questUI.draw(this.questSystem);
            this.minimap.draw(this.player, this.mapManager.getCurrentMapId(), this.mapManager.maps, this.gameState);
            this.inventory.draw(this.gameState);

            // 일시정지 메뉴 (최상위 레이어)
            this.pauseMenu.draw();
        }
    }

    drawInteractionHint() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(this.canvas.width/2 - 100, this.canvas.height - 80, 200, 30);

        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('스페이스바를 눌러 대화하기', this.canvas.width/2, this.canvas.height - 60);
    }

    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
};