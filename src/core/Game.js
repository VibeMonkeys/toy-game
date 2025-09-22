import { CONSTANTS } from '../utils/Constants.js';
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
import { TutorialSystem } from '../ui/TutorialSystem.js';
import { IntroScreen } from '../ui/IntroScreen.js';
import { CertificateScreen } from '../ui/CertificateScreen.js';
import { QuestGuide } from '../ui/QuestGuide.js';
import { MapManager } from '../maps/MapManager.js';
import { Camera } from '../maps/Camera.js';
import { Renderer } from '../graphics/Renderer.js';
import { AnimationSystem } from '../graphics/AnimationSystem.js';
import { GameUIRenderer } from './GameUIRenderer.js';
import { DialogRenderer } from './DialogRenderer.js';
import { ParticleSystem } from '../effects/ParticleSystem.js';
import { TransitionManager } from '../effects/TransitionManager.js';

export class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');

        // 핵심 시스템 초기화
        this.audioManager = new AudioManager();
        this.player = new Player();
        this.gameState = new GameState();
        this.questSystem = new QuestSystem(this.audioManager);

        // 게임 상태 관리
        this.gameMode = CONSTANTS.GAME_MODES.LOADING;
        this.mapManager = new MapManager();
        this.camera = new Camera(this.canvas);
        this.animationSystem = new AnimationSystem();
        this.renderer = new Renderer(this.canvas, this.ctx, this.animationSystem);

        // UI 렌더링 시스템
        this.uiRenderer = new GameUIRenderer(this.canvas, this.ctx);
        this.dialogRenderer = new DialogRenderer(this.canvas, this.ctx);

        // 효과 시스템
        this.particleSystem = new ParticleSystem(this.canvas, this.ctx);
        this.transitionManager = new TransitionManager(this.canvas, this.ctx);

        // UI 시스템
        this.loadingScreen = new LoadingScreen(this.canvas, this.ctx, this.audioManager);
        this.celebrationScreen = new CelebrationScreen(this.canvas, this.ctx, this.audioManager);
        this.titleScreen = new TitleScreen(this.canvas, this.ctx, this.audioManager);
        this.questUI = new QuestUI(this.canvas, this.ctx);
        this.minimap = new Minimap(this.canvas, this.ctx);
        this.inventory = new Inventory(this.canvas, this.ctx);
        this.pauseMenu = new PauseMenu(this.canvas, this.ctx, this.audioManager);
        this.elevatorUI = new ElevatorUI(this.canvas, this.ctx, this.audioManager);
        this.miniGameSystem = new MiniGameSystem(this.canvas, this.ctx, this.audioManager);
        this.tutorialSystem = new TutorialSystem(this.canvas, this.ctx);
        this.introScreen = new IntroScreen(this.canvas, this.ctx, this.audioManager);
        this.certificateScreen = new CertificateScreen(this.canvas, this.ctx);
        this.questGuide = new QuestGuide(this.canvas, this.ctx);

        // 성능 최적화
        this.lastFrameTime = 0;
        this.targetFPS = 60;
        this.frameInterval = 1000 / this.targetFPS;
        this.animationFrameId = null;

        // 코나미 코드 (↑↑↓↓←→←→BA)
        this.konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
        this.konamiIndex = 0;


        // 초기화
        this.init();
    }

    async init() {
        console.log('🚀 게임 초기화 시작...');

        // 로딩 화면 시작
        this.loadingScreen.show();
        console.log('✅ 로딩 화면 초기화 완료');

        // 타이틀 옵션 설정 (새 게임만)
        const titleOptions = ['새 게임 시작'];
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
        } else if (this.gameMode === CONSTANTS.GAME_MODES.INTRO) {
            this.introScreen.handleKeyPress(event.key);
        } else if (this.gameMode === CONSTANTS.GAME_MODES.CERTIFICATE) {
            this.certificateScreen.handleKeyPress(event.key);
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
            case '새 게임 시작':
                this.startNewGame();
                break;
        }
    }

    handleGameInput(event) {
        // 튜토리얼이 활성화되어 있을 때는 대부분의 입력을 튜토리얼에서 먼저 처리
        if (this.tutorialSystem.isVisible()) {
            // UI 토글 키들은 먼저 처리하고 튜토리얼에 알림
            if (event.key === 'q' || event.key === 'Q' || event.key === 'ㅂ') {
                this.questSystem.toggleQuestUI();
                const handled = this.tutorialSystem.handleKeyPress(
                    'Q', // 한글키도 영어키로 통일해서 전달
                    this.questSystem.showQuestUI,
                    this.inventory.isVisible,
                    this.minimap.isVisible
                );
                return;
            }
            if (event.key === 'i' || event.key === 'I' || event.key === 'ㅑ') {
                this.inventory.toggle();
                const handled = this.tutorialSystem.handleKeyPress(
                    'I', // 한글키도 영어키로 통일해서 전달
                    this.questSystem.showQuestUI,
                    this.inventory.isVisible,
                    this.minimap.isVisible
                );
                return;
            }
            if (event.key === 'm' || event.key === 'M' || event.key === 'ㅡ') {
                this.minimap.toggle();
                const handled = this.tutorialSystem.handleKeyPress(
                    'M', // 한글키도 영어키로 통일해서 전달
                    this.questSystem.showQuestUI,
                    this.inventory.isVisible,
                    this.minimap.isVisible
                );
                return;
            }

            // 다른 키 입력들
            const handled = this.tutorialSystem.handleKeyPress(
                event.key,
                this.questSystem.showQuestUI,
                this.inventory.isVisible,
                this.minimap.isVisible
            );
            if (handled) return;
        }

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

        // UI 토글 기능들 (한글 키보드 지원)
        if (event.key === 'i' || event.key === 'I' || event.key === 'ㅑ') {
            this.inventory.toggle();
            return;
        }

        if (event.key === 'q' || event.key === 'Q' || event.key === 'ㅂ') {
            this.questSystem.toggleQuestUI();
            return;
        }

        // 퀘스트 UI가 열려있을 때는 이동 차단
        if (this.questSystem.showQuestUI) {
            this.questUI.handleKeyPress(event.code);
            return; // 퀘스트 UI가 열려있으면 다른 입력 차단
        }

        if (event.key === 'm' || event.key === 'M' || event.key === 'ㅡ') {
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
                targetMapId = CONSTANTS.MAPS.FLOOR_8_CORRIDOR;
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

        // 튜토리얼에 이동 알림
        if (this.tutorialSystem.isVisible()) {
            this.tutorialSystem.handleMovement();
        }

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
        this.checkNearbyObject();
        this.player.stopMoving();
    }

    usePortal(portal) {
        // 페이드 전환 효과로 포털 이동
        this.transitionManager.fadeTransition(
            () => {
                // 페이드 아웃 시 (화면이 검게 변할 때)
            },
            () => {
                // 페이드 인 시작 시 (맵 변경)
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
            },
            600, // 0.6초 전환
            'rgba(0, 20, 40, 1)' // 어두운 파란색
        );
    }

    collectItem(item) {
        const collectedItem = this.mapManager.collectItem(item.x, item.y);
        if (collectedItem) {
            console.log(`✅ 아이템 수집: ${collectedItem.name}`);

            // 아이템 수집 파티클 효과
            const worldPos = this.camera.worldToScreen(item.x, item.y);
            this.particleSystem.createItemCollectEffect(
                worldPos.x + CONSTANTS.TILE_SIZE / 2,
                worldPos.y + CONSTANTS.TILE_SIZE / 2,
                collectedItem.name
            );

            this.gameState.addItem(collectedItem);
            this.inventory.showItemNotification(collectedItem);
            this.audioManager.playItemCollect();

            // 퀘스트 시스템에 아이템 수집 알림
            this.questSystem.onItemCollected(collectedItem, this.gameState);

            // 기존 퀘스트 진행 업데이트도 유지
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

    checkNearbyObject() {
        this.nearbyObject = this.mapManager.getNearbyObject(this.player.x, this.player.y);
        this.updateInteractionHint();
    }

    updateInteractionHint() {
        this.showInteractionHint = this.nearbyNPC !== null || this.nearbyPortal !== null || this.nearbyElevator !== null || this.nearbyObject !== null;
    }

    interact() {
        // 튜토리얼에 상호작용 알림
        if (this.tutorialSystem.isVisible()) {
            this.tutorialSystem.handleInteraction();
        }

        if (this.nearbyNPC) {
            // 특별한 액션이 있는 NPC 체크
            if (this.nearbyNPC.specialAction === 'arcade') {
                this.miniGameSystem.show();
                return;
            }

            // 메인 퀘스트 아이템 자동 제출 확인
            const submission = this.questSystem.canSubmitToNPC(this.nearbyNPC.id, this.gameState.inventory);

            // 서브 퀘스트 아이템 자동 제출 확인
            const subSubmission = this.questSystem.canSubmitToSubQuestGiver(this.nearbyNPC.id, this.gameState.inventory);

            if (submission.canSubmit) {
                // 메인 퀘스트 자동으로 아이템 제출 처리
                const result = this.questSystem.submitItemsToNPC(
                    this.nearbyNPC.id,
                    this.gameState.inventory,
                    this.gameState
                );

                if (result.success) {
                    // 퀘스트 완료 파티클 효과
                    const npcScreenPos = this.camera.worldToScreen(this.nearbyNPC.x, this.nearbyNPC.y);
                    this.particleSystem.createQuestCompleteEffect(
                        npcScreenPos.x + CONSTANTS.TILE_SIZE / 2,
                        npcScreenPos.y + CONSTANTS.TILE_SIZE / 2
                    );

                    // 성공 대화 표시
                    let itemText = '';
                    if (result.quest.requiredItem) {
                        itemText = `'${result.quest.requiredItem}'`;
                    } else if (result.quest.requiredItems) {
                        itemText = result.quest.requiredItems.map(item => `'${item}'`).join(', ');
                    }

                    this.currentDialog = [
                        `${itemText}을(를) 가져오셨군요!`,
                        `메인 퀘스트 완료: ${result.quest.title}`,
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
            } else if (subSubmission.canSubmit) {
                // 서브 퀘스트 자동으로 아이템 제출 처리
                console.log(`🔍 서브퀘스트 처리: NPC ${this.nearbyNPC.id}, 인벤토리:`, this.gameState.inventory.map(item => item.name));
                const result = this.questSystem.submitItemsToSubQuestGiver(
                    this.nearbyNPC.id,
                    this.gameState.inventory,
                    this.gameState
                );
                console.log(`📋 서브퀘스트 결과:`, result);

                if (result.success) {
                    // 서브 퀘스트 보상 파티클 효과
                    const npcScreenPos = this.camera.worldToScreen(this.nearbyNPC.x, this.nearbyNPC.y);
                    if (result.quest.completed || result.action === 'progress') {
                        this.particleSystem.createRewardEffect(
                            npcScreenPos.x + CONSTANTS.TILE_SIZE / 2,
                            npcScreenPos.y + CONSTANTS.TILE_SIZE / 2,
                            result.quest.rewardItem || '경험'
                        );
                    }

                    // 성공 대화 표시 - 액션에 따라 다른 메시지
                    let dialogMessage = [];

                    if (result.action === 'start') {
                        // 퀘스트 시작 시
                        dialogMessage = [
                            `${result.quest.title} 퀘스트를 시작하겠습니다!`,
                            result.quest.description,
                            '필요한 작업을 차례대로 진행해주세요.'
                        ];
                    } else if (result.action === 'progress') {
                        // 퀘스트 진행 시
                        if (result.quest.completed) {
                            // 퀘스트 완료
                            dialogMessage = [
                                '훌륭하게 모든 작업을 완료하셨군요!',
                                `서브 퀘스트 완료: ${result.quest.title}`,
                                result.quest.rewardItem ?
                                    `감사합니다! '${result.quest.rewardItem}'을(를) 드립니다.` :
                                    '좋은 경험이 되셨기를 바랍니다!'
                            ];
                        } else {
                            // 중간 단계 완료
                            const nextStep = result.quest.steps ? result.quest.steps[result.quest.progress] : null;
                            dialogMessage = [
                                '이번 단계를 잘 완료하셨네요!',
                                nextStep ? `다음 단계: ${nextStep.description}` : '계속 진행해주세요.',
                                `진행도: ${result.quest.progress}/${result.quest.maxProgress}`
                            ];
                        }
                    }

                    this.currentDialog = dialogMessage;
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
        } else if (this.nearbyObject) {
            this.interactWithObject(this.nearbyObject);
        } else {
            // 아이템 수집 확인
            const item = this.mapManager.findItemAt(this.player.x, this.player.y);
            if (item) {
                this.collectItem(item);
            }
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

    // 상호작용 오브젝트와 상호작용
    interactWithObject(obj) {
        const result = obj.interact(this.gameState, this.audioManager);

        if (result.success) {
            // 자판기 상호작용 시
            if (result.showVendingUI) {
                // 자판기 UI 표시 로직 (향후 구현)
                this.inventory.showItemNotification({ name: result.message });
            }
            // 컴퓨터 상호작용 시
            else if (result.showComputerUI) {
                // 컴퓨터 UI 표시 로직 (향후 구현)
                this.inventory.showItemNotification({ name: result.message });
            }
            // 프린터 상호작용 시
            else if (result.showPrinterUI) {
                // 프린터 UI 표시 로직 (향후 구현)
                this.inventory.showItemNotification({ name: result.message });
            }
            else {
                this.inventory.showItemNotification({ name: result.message });
            }
        } else {
            // 상호작용 실패 시 메시지 표시
            this.inventory.showItemNotification({ name: result.message });
        }
    }

    checkGameCompletion() {
        // 모든 퀘스트가 완료되었는지 확인
        const allQuestsCompleted = this.questSystem.areAllQuestsCompleted();

        if (allQuestsCompleted && !this.gameCompleted) {
            this.gameCompleted = true;

            // 잠시 후 인증서 화면으로 전환
            setTimeout(() => {
                this.showCertificate();
            }, 3000); // 3초 후에 인증서 화면
        }
    }

    showCertificate() {
        // 플레이어 통계 수집
        const playerStats = {
            name: '플레이어', // 실제로는 입력받을 수 있지만 간단히 고정
            completionTime: this.calculatePlayTime(),
            itemsCollected: this.gameState.collectedItems ? this.gameState.collectedItems.length : 0,
            questsCompleted: this.questSystem.getCompletedQuestCount()
        };

        this.gameMode = CONSTANTS.GAME_MODES.CERTIFICATE;
        this.certificateScreen.show(playerStats, () => {
            // 인증서 닫기 후 타이틀로 이동
            this.gameMode = CONSTANTS.GAME_MODES.TITLE;
        });
    }

    calculatePlayTime() {
        // 간단한 플레이 타임 계산 (실제로는 시작 시간을 저장해서 계산)
        return '완주';
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


    startNewGame() {
        console.log('🎮 새 게임 시작...');

        // 인트로는 이미 봤으니 바로 게임 시작
        this.startGameAfterIntro();
    }

    startGameAfterIntro() {
        console.log('🎮 인트로 완료 후 게임 시작...');

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

        // 게임 시작 시 모든 UI 닫기
        this.questSystem.hideQuestUIPanel();
        this.inventory.hide();
        this.minimap.hide();

        this.inventory.showItemNotification({ name: '휴넷 26주년 게임을 시작합니다!' });

        // 튜토리얼 완료 콜백 설정
        this.tutorialSystem.setOnComplete(() => {
            console.log('✅ 튜토리얼 완료! 정상적인 게임플레이 시작');
        });

        // 튜토리얼 자동 시작
        setTimeout(() => {
            this.tutorialSystem.start();
        }, 1000);

        console.log('✅ 새 게임 시작 완료');
    }

    update() {
        this.animationSystem.update();

        if (this.gameMode === CONSTANTS.GAME_MODES.LOADING) {
            this.loadingScreen.update();

            // 로딩 완료 시 1999년 레트로 인트로로 전환
            if (this.loadingScreen.isComplete()) {
                console.log('🖥️ 1999년 레트로 부팅 시퀀스 시작...');
                this.gameMode = CONSTANTS.GAME_MODES.INTRO;
                this.introScreen.start(() => {
                    console.log('📋 시작하기 화면으로 전환...');
                    this.gameMode = CONSTANTS.GAME_MODES.TITLE;
                });
            }
        } else if (this.gameMode === CONSTANTS.GAME_MODES.CELEBRATION) {
            this.celebrationScreen.update();
        } else if (this.gameMode === CONSTANTS.GAME_MODES.TITLE) {
            this.titleScreen.update();
        } else if (this.gameMode === CONSTANTS.GAME_MODES.INTRO) {
            this.introScreen.update();
        } else if (this.gameMode === CONSTANTS.GAME_MODES.CERTIFICATE) {
            this.certificateScreen.update();
        } else if (this.gameMode === CONSTANTS.GAME_MODES.PLAYING) {
            this.animationSystem.updateCharacterAnimation(this.player);
            this.elevatorUI.update();
            this.miniGameSystem.update();

            // 효과 시스템 업데이트
            this.particleSystem.update();
            this.transitionManager.update();

            // 상호작용 오브젝트 업데이트
            this.mapManager.updateObjects(16.67); // 60 FPS 기준 deltaTime
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
            } else if (this.gameMode === CONSTANTS.GAME_MODES.INTRO) {
                this.introScreen.draw();
                return;
            } else if (this.gameMode === CONSTANTS.GAME_MODES.CERTIFICATE) {
                this.certificateScreen.draw();
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
                this.renderer.drawInteractableObjects(this.camera, this.mapManager);
                this.renderer.drawNPCs(this.camera, currentMap, this.questSystem);
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
                this.uiRenderer.drawInteractionHint(this.nearbyNPC, this.nearbyElevator, this.nearbyPortal, this.nearbyObject);
            }

            // 게임 안내 메시지
            this.uiRenderer.drawGameInstructions(this.debugMode, this.konamiActivated);

            // 퀘스트 가이드 (화면 상단)
            if (!this.tutorialSystem.isVisible()) {
                // 현재 맵 정보를 gameState에 추가해서 전달
                const gameStateWithMap = {
                    ...this.gameState,
                    currentMap: this.mapManager.getCurrentMapId()
                };
                this.questGuide.draw(this.questSystem, gameStateWithMap);
            }

            // UI 렌더링
            // QuestUI도 현재 맵 정보가 포함된 gameState 전달
            const gameStateWithMap = {
                ...this.gameState,
                currentMap: this.mapManager.getCurrentMapId()
            };
            this.questUI.draw(this.questSystem, gameStateWithMap);
            this.minimap.draw(this.player, this.mapManager.getCurrentMapId(), this.mapManager.maps, this.gameState);
            this.inventory.draw(this.gameState);

            // 튜토리얼 렌더링 (모든 UI 위에)
            this.tutorialSystem.draw();

            // 대화창 렌더링 (UI보다 위에)
            if (this.currentDialog) {
                this.dialogRenderer.drawDialog(this.currentDialog, this.dialogIndex, this.currentNPC);
            }

            // 일시정지 메뉴 (최상위 레이어)
            this.pauseMenu.draw();

            // 엘리베이터 UI (최상위 레이어)
            this.elevatorUI.draw();

            // 미니게임 시스템 (최상위 레이어)
            this.miniGameSystem.draw();

            // 디버그 정보 표시
            if (this.debugMode) {
                this.uiRenderer.drawDebugInfo(this.player, this.mapManager, this.questSystem, this.gameState, this.konamiActivated);
            }

            // 코나미 코드 활성화 효과
            if (this.konamiActivated) {
                this.uiRenderer.drawInvincibleEffect();
            }

            // 파티클 시스템 렌더링
            this.particleSystem.draw();

            // 전환 효과 렌더링 (최상위)
            this.transitionManager.drawTransitions();
        }
    }

    gameLoop(currentTime = 0) {
        try {
            // 프레임 레이트 제한
            const deltaTime = currentTime - this.lastFrameTime;

            if (deltaTime >= this.frameInterval) {
                this.update();
                this.draw();
                this.lastFrameTime = currentTime;
            }

            // 다음 프레임 요청
            this.animationFrameId = requestAnimationFrame((time) => this.gameLoop(time));
        } catch (error) {
            console.error('❌ 게임 루프 오류:', error);
            // 오류 발생 시에도 게임 루프 계속 실행
            this.animationFrameId = requestAnimationFrame((time) => this.gameLoop(time));
        }
    }

    // 게임 정리 메서드 (메모리 누수 방지)
    destroy() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }

        // 이벤트 리스너 정리
        document.removeEventListener('keydown', this.handleInput);
        this.canvas.removeEventListener('mousemove', this.handleMouseMove);
        this.canvas.removeEventListener('click', this.handleClick);

        // 오디오 정리
        if (this.audioManager) {
            this.audioManager.destroy();
        }
    }
};