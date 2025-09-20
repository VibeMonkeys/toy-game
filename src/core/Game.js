import { CONSTANTS } from '../utils/Constants.js';
import { SaveSystem } from '../utils/SaveSystem.js';
import { AudioManager } from '../utils/AudioManager.js';
import { Player } from '../entities/Player.js';
import { GameState } from './GameState.js';
import { QuestSystem } from './QuestSystem.js';
import { TitleScreen } from '../ui/TitleScreen.js';
import { LoadingScreen } from '../ui/LoadingScreen.js';
import { CelebrationScreen } from '../ui/CelebrationScreen.js';
import { QuestUI } from '../ui/QuestUI.js';
import { Minimap } from '../ui/Minimap.js';
import { Inventory } from '../ui/Inventory.js';
import { PauseMenu } from '../ui/PauseMenu.js';
import { ElevatorUI } from '../ui/ElevatorUI.js';
import { MiniGameSystem } from '../ui/MiniGameSystem.js';
import { MapManager } from '../maps/MapManager.js';
import { Camera } from '../maps/Camera.js';
import { Renderer } from '../graphics/Renderer.js';
import { AnimationSystem } from '../graphics/AnimationSystem.js';

export class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');

        // 게임 상태 관리
        this.gameMode = CONSTANTS.GAME_MODES.LOADING;

        // 시스템 초기화
        this.audioManager = new AudioManager();
        this.player = new Player();
        this.gameState = new GameState();
        this.questSystem = new QuestSystem(this.audioManager);
        this.mapManager = new MapManager();
        this.camera = new Camera(this.canvas);
        this.animationSystem = new AnimationSystem();
        this.renderer = new Renderer(this.canvas, this.ctx, this.animationSystem);

        // UI 시스템
        this.loadingScreen = new LoadingScreen(this.canvas, this.ctx);
        this.celebrationScreen = new CelebrationScreen(this.canvas, this.ctx, this.audioManager);
        this.titleScreen = new TitleScreen(this.canvas, this.ctx, this.audioManager);
        this.questUI = new QuestUI(this.canvas, this.ctx);
        this.minimap = new Minimap(this.canvas, this.ctx);
        this.inventory = new Inventory(this.canvas, this.ctx);
        this.pauseMenu = new PauseMenu(this.canvas, this.ctx, this.audioManager);
        this.elevatorUI = new ElevatorUI(this.canvas, this.ctx, this.audioManager);
        this.miniGameSystem = new MiniGameSystem(this.canvas, this.ctx, this.audioManager);

        // 다이얼로그 시스템
        this.currentDialog = null;
        this.currentNPC = null;
        this.dialogIndex = 0;

        // 상호작용 시스템
        this.nearbyNPC = null;
        this.nearbyPortal = null;
        this.nearbyElevator = null;
        this.showInteractionHint = false;

        // 게임 완료 체크
        this.gameCompleted = false;

        // 히든 요소들
        this.konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
        this.konamiIndex = 0;
        this.konamiActivated = false;
        this.secretClickCount = 0;
        this.debugMode = false;

        // 초기화
        this.init();
    }

    init() {
        console.log('🚀 게임 초기화 시작...');

        // 로딩 화면 시작
        this.loadingScreen.show();
        console.log('✅ 로딩 화면 초기화 완료');

        // 저장된 게임 확인 후 타이틀 옵션 설정
        const hasSavedGame = SaveSystem.checkSavedGame();
        const titleOptions = hasSavedGame ?
            ['게임 계속하기', '새 게임 시작', '게임 정보'] :
            ['새 게임 시작', '게임 정보'];

        this.titleScreen.setMenuOptions(titleOptions);
        console.log('✅ 타이틀 화면 옵션 설정 완료');

        // 오디오 초기화
        this.audioManager.init();
        console.log('✅ 오디오 매니저 초기화 완료');

        // 이벤트 리스너 설정
        this.setupEventListeners();
        console.log('✅ 이벤트 리스너 설정 완료');

        // 게임 루프 시작
        console.log('🔄 게임 루프 시작...');
        this.gameLoop();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (event) => {
            this.handleInput(event);
        });

        this.canvas.addEventListener('mousemove', (event) => {
            if (this.gameMode === CONSTANTS.GAME_MODES.TITLE) {
                this.titleScreen.handleMouseMove(event);
            } else if (this.gameMode === CONSTANTS.GAME_MODES.PLAYING && this.elevatorUI.isVisible) {
                this.elevatorUI.handleMouseMove(event);
            }
        });

        this.canvas.addEventListener('click', (event) => {
            if (this.gameMode === CONSTANTS.GAME_MODES.TITLE) {
                this.handleTitleClick(event);
                const result = this.titleScreen.handleMouseClick(event);
                if (result) {
                    this.handleTitleSelection(result);
                }
            } else if (this.gameMode === CONSTANTS.GAME_MODES.PLAYING) {
                if (this.miniGameSystem.isVisible) {
                    const gameResult = this.miniGameSystem.handleMouseClick(event);
                    if (gameResult === 'close') {
                        this.miniGameSystem.hide();
                    }
                } else if (this.elevatorUI.isVisible) {
                    const elevatorResult = this.elevatorUI.handleMouseClick(event);
                    if (elevatorResult) {
                        this.handleElevatorAction(elevatorResult);
                    }
                }
            }
        });
    }

    handleInput(event) {
        if (this.gameMode === CONSTANTS.GAME_MODES.LOADING) {
            // 로딩 중에는 입력 무시
            return;
        } else if (this.gameMode === CONSTANTS.GAME_MODES.CELEBRATION) {
            this.handleCelebrationInput(event);
        } else if (this.gameMode === CONSTANTS.GAME_MODES.TITLE) {
            const result = this.titleScreen.handleKeyDown(event);
            if (result) {
                this.handleTitleSelection(result);
            }
        } else if (this.gameMode === CONSTANTS.GAME_MODES.PLAYING) {
            this.handleGameInput(event);
        }
    }

    handleCelebrationInput(event) {
        if (event.key === 'Escape') {
            this.celebrationScreen.hide();
            this.gameMode = CONSTANTS.GAME_MODES.TITLE;
        }
    }

    handleTitleClick(event) {
        // 로고 클릭 시 비밀 카운터
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        // 로고 영역 체크 (대략적)
        const logoX = this.canvas.width / 2;
        const logoY = 80;
        const logoRadius = 50;

        const distance = Math.sqrt((mouseX - logoX) ** 2 + (mouseY - logoY) ** 2);
        if (distance <= logoRadius) {
            this.secretClickCount++;

            if (this.secretClickCount === 10) {
                this.audioManager.playGameComplete();
                this.titleScreen.showSecretMessage = true;
                setTimeout(() => {
                    this.titleScreen.showSecretMessage = false;
                }, 5000);
            } else if (this.secretClickCount === 26) {
                // 26번 클릭 시 특별 메시지
                this.audioManager.playGameComplete();
                this.titleScreen.specialMessage = '🎉 휴넷 26주년 특별 메시지: 미래를 함께 만들어갑시다! 🎉';
                setTimeout(() => {
                    this.titleScreen.specialMessage = null;
                }, 8000);
            }
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
        // 코나미 코드 체크
        this.checkKonamiCode(event);

        // 미니게임이 열려있을 때
        if (this.miniGameSystem.isVisible) {
            const gameResult = this.miniGameSystem.handleKeyDown(event);
            if (gameResult === 'close') {
                this.miniGameSystem.hide();
            }
            return;
        }

        // 엘리베이터 UI가 열려있을 때
        if (this.elevatorUI.isVisible) {
            const elevatorResult = this.elevatorUI.handleKeyDown(event);
            if (elevatorResult) {
                this.handleElevatorAction(elevatorResult);
            }
            return;
        }

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

        // 다이얼로그 처리
        if (this.currentDialog) {
            if (event.key === ' ' || event.key === 'Enter') {
                this.continueDialog();
                return;
            }
            return; // 대화 중에는 다른 입력 무시
        }

        // UI 토글 기능들
        if (event.key === 'i' || event.key === 'I') {
            this.inventory.toggle();
            return;
        }

        if (event.key === 'q' || event.key === 'Q') {
            this.questSystem.toggleQuestUI();
            return;
        }

        if (event.key === 'm' || event.key === 'M') {
            this.minimap.toggle();
            return;
        }

        // 히든 기능들
        if (event.key === 'h' || event.key === 'H') {
            this.showHiddenMessage();
            return;
        }

        if (event.key === 'd' || event.key === 'D') {
            this.toggleDebugMode();
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
                if (!this.currentDialog) {
                    this.interact();
                }
                break;
            case 's':
            case 'S':
                this.saveGame();
                break;
        }
    }

    checkKonamiCode(event) {
        if (event.code === this.konamiCode[this.konamiIndex]) {
            this.konamiIndex++;
            if (this.konamiIndex === this.konamiCode.length) {
                this.activateKonamiCode();
                this.konamiIndex = 0;
            }
        } else {
            this.konamiIndex = 0;
        }
    }

    activateKonamiCode() {
        if (!this.konamiActivated) {
            this.konamiActivated = true;
            this.audioManager.playGameComplete();
            this.inventory.showItemNotification({
                name: '🎮 코나미 코드 발견! 무적 모드 활성화! 🎮'
            });

            // 무적 모드 효과 - 더 빠른 이동과 벽 통과
            this.player.invincible = true;
            this.player.speedBoost = true;
        }
    }

    showHiddenMessage() {
        const messages = [
            '🔍 숨겨진 메시지를 발견했습니다!',
            '🎂 휴넷 26주년 축하합니다!',
            '👨‍💻 이 게임은 Claude AI가 만들었어요!',
            '🌟 계속 탐험해보세요, 더 많은 비밀이 있을지도...',
            '💎 개발자: Claude & User의 협업작품'
        ];

        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        this.inventory.showItemNotification({ name: randomMessage });
        this.audioManager.playMenuSelect();
    }

    toggleDebugMode() {
        this.debugMode = !this.debugMode;
        this.inventory.showItemNotification({
            name: this.debugMode ? '🔧 디버그 모드 ON' : '🔧 디버그 모드 OFF'
        });
        this.audioManager.playUIClick();
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

    handleElevatorAction(action) {
        if (typeof action === 'string') {
            if (action === 'close') {
                this.elevatorUI.hide();
            }
        } else if (action && action.action === 'move_to_floor') {
            this.moveToFloor(action.targetFloor);
        }
    }

    moveToFloor(targetFloor) {
        let targetMapId = null;
        let targetX = 20, targetY = 15;

        // 층별 맵 매핑
        switch (targetFloor) {
            case 1:
                targetMapId = CONSTANTS.MAPS.LOBBY;
                targetX = 35;
                targetY = 15;
                break;
            case 7:
                targetMapId = CONSTANTS.MAPS.FLOOR_7_CORRIDOR;
                targetX = 20;
                targetY = 8;
                break;
            case 8:
                targetMapId = CONSTANTS.MAPS.FLOOR_8_MAIN;
                targetX = 20;
                targetY = 29;
                break;
            case 9:
                targetMapId = CONSTANTS.MAPS.FLOOR_9_CORRIDOR;
                targetX = 20;
                targetY = 8;
                break;
            case 'R':
                targetMapId = CONSTANTS.MAPS.ROOFTOP;
                targetX = 19;
                targetY = 27;
                break;
        }

        if (targetMapId && this.mapManager.setCurrentMap(targetMapId)) {
            this.player.setPosition(targetX, targetY);
            this.camera.update(this.player.x, this.player.y);
            this.gameState.visitMap(targetMapId);

            // 층 이동 알림
            const mapName = this.mapManager.getCurrentMap().name;
            this.inventory.showItemNotification({
                name: `${targetFloor}층 ${mapName}(으)로 이동했습니다!`
            });
        }
    }

    movePlayer(dx, dy) {
        const newX = this.player.x + dx;
        const newY = this.player.y + dy;

        // 코나미 코드 활성화 시 벽 통과 가능
        const canMove = this.konamiActivated ||
                       this.mapManager.isValidPosition(newX, newY, false, this.player.getPosition());

        if (canMove) {
            this.player.move(dx, dy);

            // 발걸음 소리
            this.audioManager.playFootstep();

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

        // 이동 후 주변 상호작용 요소 확인
        this.checkNearbyNPC();
        this.checkNearbyPortal();
        this.checkNearbyElevator();
        this.player.stopMoving();
    }

    usePortal(portal) {
        if (this.mapManager.setCurrentMap(portal.targetMap)) {
            this.player.setPosition(portal.targetX, portal.targetY);
            this.camera.update(this.player.x, this.player.y);
            this.gameState.visitMap(portal.targetMap);

            // 포털 사용 효과음
            this.audioManager.playPortalSound();

            // 맵 이동 알림
            const mapName = this.mapManager.getCurrentMap().name;
            this.inventory.showItemNotification({ name: `${mapName}(으)로 이동했습니다!` });
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
        this.updateInteractionHint();
    }

    checkNearbyPortal() {
        this.nearbyPortal = this.mapManager.getNearbyPortal(this.player.x, this.player.y);
        this.updateInteractionHint();
    }

    checkNearbyElevator() {
        // 엘리베이터 맵에서 패널 근처에 있는지 확인
        const currentMap = this.mapManager.getCurrentMap();
        if (currentMap && currentMap.elevatorPanel) {
            const panel = currentMap.elevatorPanel;
            const distance = Math.abs(panel.x - this.player.x) + Math.abs(panel.y - this.player.y);
            this.nearbyElevator = distance <= 1 ? panel : null;
        } else {
            this.nearbyElevator = null;
        }
        this.updateInteractionHint();
    }

    updateInteractionHint() {
        this.showInteractionHint = this.nearbyNPC !== null || this.nearbyPortal !== null || this.nearbyElevator !== null;
    }

    interact() {
        if (this.nearbyNPC) {
            // 특별한 액션이 있는 NPC 체크
            if (this.nearbyNPC.specialAction === 'arcade') {
                this.miniGameSystem.show();
                return;
            }

            // 퀘스트 아이템 자동 제출 확인
            const submission = this.questSystem.canSubmitToNPC(this.nearbyNPC.id, this.gameState.inventory);
            if (submission.canSubmit) {
                // 자동으로 아이템 제출 처리
                const result = this.questSystem.submitItemsToNPC(
                    this.nearbyNPC.id,
                    this.gameState.inventory,
                    this.gameState
                );

                if (result.success) {
                    // 성공 대화 표시
                    let itemText = '';
                    if (result.quest.requiredItem) {
                        itemText = `'${result.quest.requiredItem}'`;
                    } else if (result.quest.requiredItems) {
                        itemText = result.quest.requiredItems.map(item => `'${item}'`).join(', ');
                    }

                    this.currentDialog = [
                        `${itemText}을(를) 가져오셨군요!`,
                        `퀘스트 완료: ${result.quest.title}`,
                        `감사합니다! '${result.quest.rewardItem}'을(를) 드립니다.`
                    ];
                    this.currentNPC = this.nearbyNPC;
                    this.dialogIndex = 0;
                    this.audioManager.playDialogOpen();
                    this.showDialog();

                    // 알림도 표시
                    this.inventory.showItemNotification({ name: result.message });
                } else {
                    // 실패시 일반 대화
                    this.startDialog(this.nearbyNPC);
                }
            } else {
                // 일반 대화
                this.startDialog(this.nearbyNPC);
            }

            // 퀘스트 진행
            if (this.nearbyNPC.questTarget) {
                this.questSystem.completeQuest(this.nearbyNPC.questTarget);

                // CEO와 대화하면 게임 완료 체크
                if (this.nearbyNPC.questTarget === CONSTANTS.QUEST_TARGETS.TALK_TO_CEO) {
                    this.checkGameCompletion();
                }
            }
        } else if (this.nearbyElevator) {
            this.openElevator();
        } else if (this.nearbyPortal) {
            this.usePortal(this.nearbyPortal);
        }
    }

    openElevator() {
        // 현재 층 계산
        let currentFloor = 1;
        const currentMapId = this.mapManager.getCurrentMapId();

        if (currentMapId.includes('floor_7')) currentFloor = 7;
        else if (currentMapId.includes('floor_8')) currentFloor = 8;
        else if (currentMapId.includes('floor_9')) currentFloor = 9;
        else if (currentMapId.includes('rooftop')) currentFloor = 'R';
        this.elevatorUI.show(currentFloor);
    }

    checkGameCompletion() {
        // 모든 퀘스트가 완료되었는지 확인
        const allQuestsCompleted = this.questSystem.areAllQuestsCompleted();

        if (allQuestsCompleted && !this.gameCompleted) {
            this.gameCompleted = true;

            // 잠시 후 축하 화면으로 전환
            setTimeout(() => {
                this.gameMode = CONSTANTS.GAME_MODES.CELEBRATION;
                this.celebrationScreen.show();
            }, 3000); // 3초 후에 축하 화면
        }
    }

    startDialog(npc) {
        this.currentDialog = npc.dialog;
        this.currentNPC = npc; // NPC 정보 저장
        this.dialogIndex = 0;
        this.audioManager.playDialogOpen();
        this.showDialog();
    }


    continueDialog() {
        if (this.dialogIndex < this.currentDialog.length - 1) {
            this.dialogIndex++;
        } else {
            this.closeDialog();
        }
    }

    showDialog() {
        if (!this.currentDialog || this.dialogIndex >= this.currentDialog.length) {
            this.closeDialog();
            return;
        }
        // 이제 Canvas에서 그려질 예정이므로 HTML 조작 제거
    }

    nextDialog() {
        this.dialogIndex++;
        this.showDialog();
    }

    closeDialog() {
        this.currentDialog = null;
        this.currentNPC = null; // NPC 정보 정리
        this.dialogIndex = 0;
        this.audioManager.playDialogClose();
        // HTML 조작 제거, Canvas에서 그려짐
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
        console.log('🎮 새 게임 시작...');

        // 초기 상태로 리셋 - 로비에서 시작 (엘리베이터 바로 앞)
        const mapSet = this.mapManager.setCurrentMap(CONSTANTS.MAPS.LOBBY);
        console.log('맵 설정 결과:', mapSet, '현재 맵:', this.mapManager.getCurrentMapId());

        this.player = new Player(33, 15);
        console.log('플레이어 생성:', this.player.x, this.player.y);

        this.gameState = new GameState();
        this.questSystem = new QuestSystem(this.audioManager);

        this.camera.update(this.player.x, this.player.y);
        console.log('카메라 업데이트 완료');

        this.gameMode = CONSTANTS.GAME_MODES.PLAYING;
        console.log('게임 모드 변경:', this.gameMode);

        this.inventory.showItemNotification({ name: '휴넷 26주년 엘리베이터 게임을 시작합니다!' });
        console.log('✅ 새 게임 시작 완료');
    }

    update() {
        this.animationSystem.update();

        if (this.gameMode === CONSTANTS.GAME_MODES.LOADING) {
            this.loadingScreen.update();

            // 로딩 완료 시 타이틀로 전환
            if (this.loadingScreen.isComplete()) {
                this.gameMode = CONSTANTS.GAME_MODES.TITLE;
            }
        } else if (this.gameMode === CONSTANTS.GAME_MODES.CELEBRATION) {
            this.celebrationScreen.update();
        } else if (this.gameMode === CONSTANTS.GAME_MODES.TITLE) {
            this.titleScreen.update();
        } else if (this.gameMode === CONSTANTS.GAME_MODES.PLAYING) {
            this.animationSystem.updateCharacterAnimation(this.player);
            this.elevatorUI.update();
            this.miniGameSystem.update();
        }
    }

    draw() {
        try {
            this.renderer.clearScreen();

            // 게임 모드별 렌더링
            if (this.gameMode === CONSTANTS.GAME_MODES.LOADING) {
                this.loadingScreen.draw();
                return;
            } else if (this.gameMode === CONSTANTS.GAME_MODES.CELEBRATION) {
                this.celebrationScreen.draw();
                return;
            } else if (this.gameMode === CONSTANTS.GAME_MODES.TITLE) {
                this.titleScreen.draw();
                return;
            }
        } catch (error) {
            console.error('❌ Draw 메서드 오류 (첫 부분):', error);
            console.log('현재 게임 모드:', this.gameMode);
        }

        if (this.gameMode === CONSTANTS.GAME_MODES.PLAYING) {
            try {
                const currentMap = this.mapManager.getCurrentMap();

                if (!currentMap) {
                    console.error('현재 맵이 로딩되지 않았습니다:', this.mapManager.getCurrentMapId());
                    return;
                }

                // 월드 렌더링
                this.renderer.drawFloor(this.camera, currentMap);
                this.renderer.drawOfficeItems(this.camera, currentMap);
                this.renderer.drawWalls(this.camera, currentMap);
                this.renderer.drawPortals(this.camera, currentMap);
                this.renderer.drawElevatorPanel(this.camera, currentMap);
                this.renderer.drawItems(this.camera, currentMap);
                this.renderer.drawNPCs(this.camera, currentMap);
            } catch (error) {
                console.error('❌ 월드 렌더링 오류:', error);
            }

            try {
                // 플레이어 렌더링 (애니메이션 위치 사용)
                const animPos = this.player.getAnimatedPosition();
                this.renderer.drawPixelCharacter(
                    animPos.x,
                    animPos.y,
                    this.player.direction,
                    true,
                    null,
                    this.camera,
                    animPos.bobOffset
                );
            } catch (error) {
                console.error('❌ 플레이어 렌더링 오류:', error);
            }

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

            // 게임 안내 메시지
            this.drawGameInstructions();

            // UI 렌더링
            this.questUI.draw(this.questSystem);
            this.minimap.draw(this.player, this.mapManager.getCurrentMapId(), this.mapManager.maps, this.gameState);
            this.inventory.draw(this.gameState);

            // 대화창 렌더링 (UI보다 위에)
            if (this.currentDialog) {
                this.drawDialog();
            }

            // 일시정지 메뉴 (최상위 레이어)
            this.pauseMenu.draw();

            // 엘리베이터 UI (최상위 레이어)
            this.elevatorUI.draw();

            // 미니게임 시스템 (최상위 레이어)
            this.miniGameSystem.draw();

            // 디버그 정보 표시
            if (this.debugMode) {
                this.drawDebugInfo();
            }

            // 코나미 코드 활성화 효과
            if (this.konamiActivated) {
                this.drawInvincibleEffect();
            }
        }
    }

    drawInteractionHint() {
        let message = '';
        let icon = '';

        if (this.nearbyNPC) {
            message = `${this.nearbyNPC.name}과(와) 대화하기`;
            icon = '💬';
        } else if (this.nearbyElevator) {
            message = '엘리베이터 - 층 선택하기';
            icon = '🛗';
        } else if (this.nearbyPortal) {
            message = `${this.nearbyPortal.name}(으)로 이동하기`;
            icon = '🚪';
        }

        if (message) {
            // 메시지 박스 크기 계산
            this.ctx.font = 'bold 18px Arial';
            const textWidth = this.ctx.measureText(message).width + 60;
            const boxHeight = 50;
            const boxX = this.canvas.width/2 - textWidth/2;
            const boxY = this.canvas.height - 120;

            // 그림자 효과
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            this.ctx.fillRect(boxX + 3, boxY + 3, textWidth, boxHeight);

            // 메인 박스 배경
            this.ctx.fillStyle = 'rgba(25, 25, 60, 0.95)';
            this.ctx.fillRect(boxX, boxY, textWidth, boxHeight);

            // 황금색 테두리
            this.ctx.strokeStyle = '#FFD700';
            this.ctx.lineWidth = 3;
            this.ctx.strokeRect(boxX, boxY, textWidth, boxHeight);

            // 반짝이는 내부 테두리
            const sparkle = Math.sin(Date.now() * 0.008) * 0.3 + 0.7;
            this.ctx.strokeStyle = `rgba(255, 255, 255, ${sparkle})`;
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(boxX + 2, boxY + 2, textWidth - 4, boxHeight - 4);

            // 아이콘과 메시지
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.font = 'bold 18px Arial';
            this.ctx.textAlign = 'center';

            // 그림자 텍스트
            this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
            this.ctx.lineWidth = 3;
            this.ctx.strokeText(`${icon} 스페이스`, this.canvas.width/2, boxY + 20);
            this.ctx.strokeText(message, this.canvas.width/2, boxY + 38);

            // 메인 텍스트
            this.ctx.fillStyle = '#FFD700';
            this.ctx.fillText(`${icon} 스페이스`, this.canvas.width/2, boxY + 20);

            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.fillText(message, this.canvas.width/2, boxY + 38);
        }
    }

    drawDebugInfo() {
        const debugInfo = [
            `Position: (${this.player.x}, ${this.player.y})`,
            `Map: ${this.mapManager.getCurrentMapId()}`,
            `FPS: ${Math.round(1000 / 16.67)}`, // 대략적인 FPS
            `Quest: ${this.questSystem.currentQuest + 1}/${this.questSystem.quests.length}`,
            `Items: ${this.gameState.itemsCollected}`,
            `Konami: ${this.konamiActivated ? 'ON' : 'OFF'}`
        ];

        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(10, 10, 200, 120);

        this.ctx.fillStyle = '#00ff00';
        this.ctx.font = '12px monospace';
        this.ctx.textAlign = 'left';

        debugInfo.forEach((info, index) => {
            this.ctx.fillText(info, 15, 25 + index * 15);
        });
    }

    drawInvincibleEffect() {
        const time = Date.now() * 0.01;
        const alpha = Math.sin(time) * 0.3 + 0.7;

        // 화면 테두리에 무지개색 효과
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, 0);
        gradient.addColorStop(0, `rgba(255, 0, 0, ${alpha * 0.3})`);
        gradient.addColorStop(0.17, `rgba(255, 165, 0, ${alpha * 0.3})`);
        gradient.addColorStop(0.33, `rgba(255, 255, 0, ${alpha * 0.3})`);
        gradient.addColorStop(0.5, `rgba(0, 255, 0, ${alpha * 0.3})`);
        gradient.addColorStop(0.67, `rgba(0, 0, 255, ${alpha * 0.3})`);
        gradient.addColorStop(0.83, `rgba(75, 0, 130, ${alpha * 0.3})`);
        gradient.addColorStop(1, `rgba(238, 130, 238, ${alpha * 0.3})`);

        this.ctx.strokeStyle = gradient;
        this.ctx.lineWidth = 5;
        this.ctx.strokeRect(2, 2, this.canvas.width - 4, this.canvas.height - 4);

        // 무적 모드 텍스트
        this.ctx.fillStyle = `rgba(255, 255, 0, ${alpha})`;
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('🎮 INVINCIBLE MODE 🎮', this.canvas.width / 2, 30);
    }

    drawGameInstructions() {
        // 하단에 게임 조작법 안내
        const instructionY = this.canvas.height - 30;

        // 반투명 배경
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        this.ctx.fillRect(0, instructionY - 20, this.canvas.width, 40);

        // 안내 텍스트
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'center';

        let message = '방향키: 이동 | 스페이스: 상호작용 | I: 인벤토리 | Q: 퀘스트 | M: 미니맵 | S: 저장 | ESC: 메뉴';

        // 디버그 모드일 때 추가 안내
        if (this.debugMode) {
            message += ' | H: 숨겨진 메시지 | D: 디버그';
        }

        // 코나미 코드 활성화 시 다른 메시지
        if (this.konamiActivated) {
            message = '🌟 무적 모드 활성화! 벽을 통과할 수 있습니다! 🌟';
            this.ctx.fillStyle = 'rgba(255, 215, 0, 0.9)';
        }

        this.ctx.fillText(message, this.canvas.width / 2, instructionY);
    }

    drawDialog() {
        if (!this.currentDialog || this.dialogIndex >= this.currentDialog.length) return;

        const currentText = this.currentDialog[this.dialogIndex];

        // 대화창 크기와 위치
        const dialogWidth = 800;
        const dialogHeight = 150;
        const dialogX = (this.canvas.width - dialogWidth) / 2;
        const dialogY = this.canvas.height - 200;

        // 반투명 전체 배경 (대화 중임을 강조)
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 대화창 그림자
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(dialogX + 5, dialogY + 5, dialogWidth, dialogHeight);

        // 대화창 배경
        this.ctx.fillStyle = 'rgba(15, 25, 50, 0.95)';
        this.ctx.fillRect(dialogX, dialogY, dialogWidth, dialogHeight);

        // 대화창 테두리
        this.ctx.strokeStyle = '#FFD700';
        this.ctx.lineWidth = 4;
        this.ctx.strokeRect(dialogX, dialogY, dialogWidth, dialogHeight);

        // 내부 테두리
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(dialogX + 3, dialogY + 3, dialogWidth - 6, dialogHeight - 6);

        // NPC 이름 표시
        if (this.currentNPC) {
            this.ctx.fillStyle = '#FFD700';
            this.ctx.font = 'bold 16px Arial';
            this.ctx.textAlign = 'left';
            this.ctx.fillText(`💬 ${this.currentNPC.name}`, dialogX + 20, dialogY + 25);

            // NPC 이름 아래 구분선
            this.ctx.strokeStyle = 'rgba(255, 215, 0, 0.5)';
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(dialogX + 20, dialogY + 35);
            this.ctx.lineTo(dialogX + dialogWidth - 20, dialogY + 35);
            this.ctx.stroke();
        }

        // 대화 텍스트
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 18px Arial';
        this.ctx.textAlign = 'left';

        // 텍스트 줄바꿈 처리
        const maxWidth = dialogWidth - 40;
        const lineHeight = 25;
        const lines = this.wrapText(currentText, maxWidth);

        // NPC 이름이 있으면 텍스트를 더 아래에 표시
        const textStartY = this.currentNPC ? dialogY + 55 : dialogY + 35;

        lines.forEach((line, index) => {
            this.ctx.fillText(line, dialogX + 20, textStartY + index * lineHeight);
        });

        // 진행 표시
        const progressText = `${this.dialogIndex + 1} / ${this.currentDialog.length}`;
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'right';
        this.ctx.fillText(progressText, dialogX + dialogWidth - 20, dialogY + dialogHeight - 15);

        // 계속하기 안내
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'center';

        const continueText = this.dialogIndex < this.currentDialog.length - 1 ?
            '▶️ 스페이스나 엔터를 눌러 계속하기' :
            '✅ 스페이스나 엔터를 눌러 닫기';

        // 반짝이는 효과
        const blinkAlpha = Math.sin(Date.now() * 0.005) * 0.3 + 0.7;
        this.ctx.fillStyle = `rgba(255, 215, 0, ${blinkAlpha})`;
        this.ctx.fillText(continueText, this.canvas.width / 2, dialogY + dialogHeight + 25);
    }


    wrapText(text, maxWidth) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';

        this.ctx.font = 'bold 18px Arial'; // 측정을 위해 폰트 설정

        for (let i = 0; i < words.length; i++) {
            const testLine = currentLine + words[i] + ' ';
            const metrics = this.ctx.measureText(testLine);
            const testWidth = metrics.width;

            if (testWidth > maxWidth && i > 0) {
                lines.push(currentLine.trim());
                currentLine = words[i] + ' ';
            } else {
                currentLine = testLine;
            }
        }
        lines.push(currentLine.trim());

        return lines;
    }

    gameLoop() {
        try {
            this.update();
            this.draw();
            requestAnimationFrame(() => this.gameLoop());
        } catch (error) {
            console.error('❌ 게임 루프 오류:', error);
        }
    }
};