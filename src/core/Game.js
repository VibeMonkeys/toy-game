import { CONSTANTS } from '../utils/Constants.js';
import { AudioManager } from '../utils/AudioManager.js';
import { Logger } from '../utils/Logger.js';
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
import { MINIGAME_CHALLENGES } from '../data/QuestData.js';
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
import { NPCRelationshipSystem } from './NPCRelationshipSystem.js';
import { DynamicQuestHints } from './DynamicQuestHints.js';
import { TransitionManager } from '../effects/TransitionManager.js';
// import { FloorAtmosphereSystem } from '../systems/FloorAtmosphereSystem.js'; // 백그라운드 소음 제거
// import { SpecialNPCSystem } from '../systems/SpecialNPCSystem.js'; // 백그라운드 자동 스폰 제거

export class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');

        // 전역 참조 설정
        window.game = this;

        // 핵심 시스템 초기화
        this.audioManager = new AudioManager();
        this.player = new Player();
        this.gameState = new GameState();
        this.questSystem = new QuestSystem(this.audioManager, this);

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

        // 상태 플래그
        this.secretClickCount = 0;
        this.konamiActivated = false;
        this.debugMode = false;

        // 이벤트 핸들러 바인딩 (해제 대비)
        this.boundKeyDownHandler = this.handleInput.bind(this);
        this.boundMouseMoveHandler = this.onCanvasMouseMove.bind(this);
        this.boundClickHandler = this.onCanvasClick.bind(this);

        // UI 시스템
        this.loadingScreen = new LoadingScreen(this.canvas, this.ctx, this.audioManager);
        this.celebrationScreen = new CelebrationScreen(this.canvas, this.ctx, this.audioManager);
        this.titleScreen = new TitleScreen(this.canvas, this.ctx, this.audioManager);
        this.questUI = new QuestUI(this.canvas, this.ctx);
        this.minimap = new Minimap(this.canvas, this.ctx);
        this.inventory = new Inventory(this.canvas, this.ctx);
        this.pauseMenu = new PauseMenu(this.canvas, this.ctx, this.audioManager);
        this.elevatorUI = new ElevatorUI(this.canvas, this.ctx, this.audioManager);
        this.miniGameSystem = new MiniGameSystem(this.canvas, this.ctx, this.audioManager, this);
        this.tutorialSystem = new TutorialSystem(this.canvas, this.ctx);
        this.introScreen = new IntroScreen(this.canvas, this.ctx, this.audioManager);
        this.certificateScreen = new CertificateScreen(this.canvas, this.ctx);
        this.questGuide = new QuestGuide(this.canvas, this.ctx);

        this.setupInputRouters();

        // 퀘스트 피드백 시스템
        this.currentQuestFeedback = null;
        this.nextStepInfo = null;

        // 타이머 관리 (메모리 누수 방지)
        this.activeTimers = new Set();
        this.nextStepTimer = null;

        // 층별 분위기 시스템
        // this.floorAtmosphereSystem = new FloorAtmosphereSystem(this.audioManager); // 백그라운드 소음 제거
        
        // 특별 NPC 시스템
        // this.specialNPCSystem = new SpecialNPCSystem(this); // 백그라운드 자동 스폰 제거

        // 대화 선택지 시스템
        this.showingChoices = false;
        
        // 동적 힌트 시스템
        this.currentDynamicHint = null;
        this.selectedChoice = 0;
        this.currentChoiceNPC = null;

        // 미니게임 챌린지 시스템
        this.currentMinigameChallenge = null;

        // 성능 최적화
        this.lastFrameTime = 0;
        this.targetFPS = 60;
        this.frameInterval = 1000 / this.targetFPS;
        this.animationFrameId = null;

        // 코나미 코드 (↑↑↓↓←→←→BA)
        this.konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
        this.konamiIndex = 0;

        // 26주년 특별 이스터 에그들
        this.easterEggs = {
            hunetCode: ['KeyH', 'KeyU', 'KeyN', 'KeyE', 'KeyT'], // "HUNET" 타이핑
            hunetIndex: 0,
            foundEggs: new Set(),
            specialClickCount: 0,
            birthdayMode: false,
            secretMessages: [
                "🎂 휴넷 26주년을 축하합니다! 🎂",
                "📚 교육으로 세상을 바꾸는 휴넷! 📚", 
                "🚀 혁신과 성장의 26년 여정! 🚀",
                "👥 함께여서 더 빛나는 휴넷 가족! 👥",
                "🌟 미래를 만드는 교육 기술! 🌟"
            ]
        };


        // 초기화
        this.init();
    }
    // 미니게임 챌린지 완료 체크
    checkMinigameChallenge(npcId) {
        const quest = this.questSystem.questManager.getQuestByNPC(npcId);
        if (!quest || !quest.minigameChallenge || !quest.minigameChallenge.required) {
            return { canProceed: true };
        }

        // 퀘스트가 시작되지 않았으면 미니게임 챌린지 불필요
        if (!quest.started) {
            return { canProceed: true };
        }

        if (quest.minigameChallenge.completed) {
            return { canProceed: true };
        }

        return {
            canProceed: false,
            challengeType: quest.minigameChallenge.type,
            description: quest.minigameChallenge.description,
            quest: quest
        };
    }

    // 미니게임 완료 시 호출되는 함수
    onMinigameCompleted(gameType, score = 0, lines = 0) {
        // 안전성 체크
        if (!this.questSystem?.questManager?.quests) {
            console.warn('QuestSystem이 초기화되지 않았습니다.');
            return false;
        }

        // 현재 진행 중인 퀘스트들 중에서 해당 미니게임이 필요한 퀘스트 찾기
        const allQuests = this.questSystem.questManager.quests;
        
        for (let quest of allQuests) {
            if (quest.minigameChallenge && 
                quest.minigameChallenge.type === gameType && 
                quest.started && 
                !quest.minigameChallenge.completed) {
                
                let challengeMet = false;

                switch (gameType) {
                    case 'memory_match':
                        challengeMet = true; // 메모리 게임은 완료하면 성공
                        break;
                    case 'tetris_lines':
                        challengeMet = lines >= (quest.minigameChallenge.targetScore || 10);
                        break;
                    case 'breakout_win':
                        challengeMet = true; // 브레이크아웃은 승리하면 성공
                        break;
                    case 'snake_score':
                        challengeMet = score >= (quest.minigameChallenge.targetScore || 100);
                        break;
                    case 'flappy_score':
                        challengeMet = score >= (quest.minigameChallenge.targetScore || 10);
                        break;
                    default:
                        console.warn(`알 수 없는 게임 타입: ${gameType}`);
                        return false;
                }

                if (challengeMet) {
                    quest.minigameChallenge.completed = true;
                    
                    // 파티클 효과 생성 (안전성 체크)
                    if (this.particleSystem?.createQuestCompleteEffect) {
                        this.particleSystem.createQuestCompleteEffect(
                            this.canvas.width / 2, 
                            this.canvas.height / 2,
                            `${quest.minigameChallenge.description} 완료!`
                        );
                    }

                    // 성공 메시지 표시 (안전성 체크)
                    if (this.showDialog) {
                        this.showDialog([
                            '🎮 미니게임 챌린지 완료!',
                            quest.minigameChallenge.description,
                            '이제 퀘스트를 진행할 수 있습니다!'
                        ]);
                    }

                    // 오디오 재생 (안전성 체크)
                    this.audioManager?.playGameComplete?.();
                    
                    return true;
                }
            }
        }

        return false;
    }

    // 안전한 타이머 설정 함수
    setSafeTimeout(callback, delay) {
        const timerId = setTimeout(() => {
            this.activeTimers.delete(timerId);
            callback();
        }, delay);
        this.activeTimers.add(timerId);
        return timerId;
    }

    // 타이머 정리 함수
    clearAllTimers() {
        // 활성 타이머들 정리
        for (const timerId of this.activeTimers) {
            clearTimeout(timerId);
        }
        this.activeTimers.clear();

        // 특정 타이머들 정리
        if (this.nextStepTimer) {
            clearTimeout(this.nextStepTimer);
            this.nextStepTimer = null;
        }

        // 분위기 시스템 정리
        // this.floorAtmosphereSystem?.clearAllTimers(); // 백그라운드 소음 제거
        
        // 특별 NPC 시스템 정리
        // this.specialNPCSystem?.destroy(); // 백그라운드 자동 스폰 제거
    }

    // 다음 단계 정보 표시 (메모리 누수 방지 버전)
    showNextStepInfo(stepInfo, duration = 5000) {
        // 기존 타이머 정리
        if (this.nextStepTimer) {
            clearTimeout(this.nextStepTimer);
        }

        this.nextStepInfo = stepInfo;
        
        // 새 타이머 설정
        this.nextStepTimer = this.setSafeTimeout(() => {
            this.nextStepInfo = null;
            this.nextStepTimer = null;
        }, duration);
    }

    async init() {
        Logger.info('🚀 게임 초기화 시작...');

        // 로딩 화면 시작
        this.loadingScreen.show();
        Logger.debug('✅ 로딩 화면 초기화 완료');

        // 타이틀 옵션 설정
        const titleOptions = ['새 게임 시작', '게임 정보', '크레딧'];
        this.titleScreen.setMenuOptions(titleOptions);
        Logger.debug('✅ 타이틀 화면 옵션 설정 완료');


        // 오디오 초기화
        this.audioManager.init();
        Logger.debug('✅ 오디오 매니저 초기화 완료');

        // 이벤트 리스너 설정
        this.setupEventListeners();
        Logger.debug('✅ 이벤트 리스너 설정 완료');

        // 게임 루프 시작
        Logger.info('🔄 게임 루프 시작...');
        this.gameLoop();
    }

    setupInputRouters() {
        this.mouseMoveHandlers = [
            {
                isActive: () => this.gameMode === CONSTANTS.GAME_MODES.TITLE,
                handle: (event) => this.titleScreen.handleMouseMove(event)
            },
            {
                isActive: () => this.gameMode === CONSTANTS.GAME_MODES.PLAYING && this.elevatorUI.isVisible,
                handle: (event) => this.elevatorUI.handleMouseMove(event)
            }
        ];

        this.clickHandlers = [
            {
                isActive: () => this.gameMode === CONSTANTS.GAME_MODES.TITLE,
                handle: (event) => {
                    this.handleTitleClick(event);
                    const result = this.titleScreen.handleMouseClick(event);
                    if (result) {
                        this.handleTitleSelection(result);
                    }
                }
            },
            {
                isActive: () => this.gameMode === CONSTANTS.GAME_MODES.PLAYING && this.miniGameSystem.isVisible,
                handle: (event) => {
                    const gameResult = this.miniGameSystem.handleMouseClick(event);
                    if (gameResult === 'close') {
                        this.miniGameSystem.hide();
                    }
                }
            },
            {
                isActive: () => this.gameMode === CONSTANTS.GAME_MODES.PLAYING && this.elevatorUI.isVisible,
                handle: (event) => {
                    const elevatorResult = this.elevatorUI.handleMouseClick(event);
                    if (elevatorResult) {
                        this.handleElevatorAction(elevatorResult);
                    }
                }
            }
        ];
    }

    setupEventListeners() {
        document.addEventListener('keydown', this.boundKeyDownHandler);
        this.canvas.addEventListener('mousemove', this.boundMouseMoveHandler);
        this.canvas.addEventListener('click', this.boundClickHandler);
        
        // 분위기 이벤트 리스너
        window.addEventListener('floorAtmosphereEvent', (event) => {
            this.handleAtmosphereEvent(event.detail);
        });
    }

    onCanvasMouseMove(event) {
        for (const handler of this.mouseMoveHandlers) {
            if (handler.isActive()) {
                handler.handle(event);
                return;
            }
        }
    }

    onCanvasClick(event) {
        for (const handler of this.clickHandlers) {
            if (handler.isActive()) {
                handler.handle(event);
                return;
            }
        }
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
                this.setSafeTimeout(() => {
                    this.titleScreen.showSecretMessage = false;
                }, 5000);
            } else if (this.secretClickCount === 26) {
                // 26번 클릭 시 특별 메시지
                this.audioManager.playGameComplete();
                this.titleScreen.specialMessage = '🎉 휴넷 26주년 특별 메시지: 미래를 함께 만들어갑시다! 🎉';
                this.setSafeTimeout(() => {
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

    // 튜토리얼에 UI 상태 업데이트 (UI 토글 후 호출)
    updateTutorialAfterKeyPress(key) {
        if (this.tutorialSystem && this.tutorialSystem.isVisible()) {
            // UI 토글 후 업데이트된 상태를 튜토리얼에 전달
            this.tutorialSystem.handleKeyPress(
                key,
                this.questSystem.showQuestUI,
                this.inventory.isVisible,
                this.minimap.isVisible
            );
        }
    }

    handleGameInput(event) {
        // 튜토리얼은 UI 토글 후에 별도로 업데이트됨

        // 코나미 코드 체크
        this.checkKonamiCode(event);
        
        // HUNET 이스터 에그 체크
        this.checkHunetCode(event);

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
            return; // 일시정지 메뉴에서 처리됨
        }

        // UI 토글 먼저 처리
        switch(event.key) {
            case 'q':
            case 'Q':
            case 'ㅂ':
            case 'ㅃ':
                this.questSystem.toggleQuestUI();
                this.updateTutorialAfterKeyPress('q');
                return;
                
            case 'i':
            case 'I':
            case 'ㅑ':
            case 'ㅣ':
                this.inventory.toggle();
                this.updateTutorialAfterKeyPress('i');
                return;
                
            case 'm':
            case 'M':
            case 'ㅡ':
                this.minimap.toggle();
                this.updateTutorialAfterKeyPress('m');
                return;
                
            case 'Escape':
                this.pauseMenu.toggle();
                return;
        }

        // 플레이어 이동 및 상호작용
        switch(event.key) {
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
                console.log('🔍 스페이스바 눌림! currentDialog:', this.currentDialog, 'nearbyNPC:', this.nearbyNPC, 'tutorial:', this.tutorialSystem.isVisible());
                
                // 튜토리얼이 활성화되어 있으면 튜토리얼 처리
                if (this.tutorialSystem.isVisible()) {
                    console.log('📚 튜토리얼 모드에서 스페이스바 처리');
                    this.tutorialSystem.nextStep();
                    return;
                }
                
                // 대화창이 있으면 대화 진행
                if (this.currentDialog) {
                    console.log('💬 대화창에서 스페이스바 처리 - 다음 대화로');
                    this.continueDialog();
                    return;
                }
                
                // 대화창이 없으면 상호작용
                this.interact();
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
        // 기본 메시지에 26주년 특별 메시지 추가
        const messages = [
            '🔍 숨겨진 메시지를 발견했습니다!',
            '🎂 휴넷 26주년 축하합니다!',
            '👨‍💻 이 게임은 Claude AI가 만들었어요!',
            '🌟 계속 탐험해보세요, 더 많은 비밀이 있을지도...',
            '💎 개발자: Claude & User의 협업작품',
            ...this.easterEggs.secretMessages
        ];

        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        this.inventory.showItemNotification({ name: randomMessage });
        this.audioManager.playMenuSelect();
        
        // 이스터 에그 발견 카운트
        this.easterEggs.foundEggs.add('hidden_message');
        this.checkEasterEggAchievements();
    }

    // HUNET 타이핑 이스터 에그 체크
    checkHunetCode(event) {
        if (event.code === this.easterEggs.hunetCode[this.easterEggs.hunetIndex]) {
            this.easterEggs.hunetIndex++;
            
            if (this.easterEggs.hunetIndex >= this.easterEggs.hunetCode.length) {
                this.activateHunetEasterEgg();
                this.easterEggs.hunetIndex = 0;
            }
        } else {
            this.easterEggs.hunetIndex = 0;
        }
    }

    // HUNET 이스터 에그 활성화
    activateHunetEasterEgg() {
        this.easterEggs.birthdayMode = true;
        this.easterEggs.foundEggs.add('hunet_code');
        
        // 26주년 특별 메시지
        const birthdayMessages = [
            '🎉 "HUNET" 이스터 에그 발견! 🎉',
            '🎂 1998년부터 2024년까지 26년의 여정! 🎂',
            '🎊 생일 축하 모드가 활성화되었습니다! 🎊',
            '🎁 특별한 26주년 기념 효과가 시작됩니다! 🎁'
        ];
        
        birthdayMessages.forEach((message, index) => {
            this.setSafeTimeout(() => {
                this.inventory.showItemNotification({ name: message });
                if (index === 0) this.audioManager.playGameComplete();
            }, index * 1500);
        });
        
        // 파티클 효과 생성
        this.createBirthdayParticles();
        
        // 5분 후 자동 비활성화
        this.setSafeTimeout(() => {
            this.easterEggs.birthdayMode = false;
            this.inventory.showItemNotification({ name: '🎈 생일 축하 모드가 종료되었습니다!' });
        }, 300000);
        
        this.checkEasterEggAchievements();
    }

    // 26주년 기념 파티클 효과
    createBirthdayParticles() {
        for (let i = 0; i < 26; i++) {
            this.setSafeTimeout(() => {
                const x = Math.random() * this.canvas.width;
                const y = Math.random() * this.canvas.height;
                this.particleSystem.createRewardEffect(x, y, '🎉');
            }, i * 200);
        }
    }

    // 특별한 NPC 클릭 이벤트
    handleSpecialNPCClick(npcId) {
        this.easterEggs.specialClickCount++;
        
        const specialMessages = {
            'guard': ['🛡️ 26년간 휴넷을 지켜온 든든한 보안!', '🔒 안전한 휴넷, 믿을 수 있는 교육!'],
            'ceo_kim': ['👑 비전을 현실로 만든 26년!', '🌟 휴넷의 꿈은 계속됩니다!'],
            'reception': ['📞 언제나 정확한 안내!', '💼 휴넷의 첫인상을 책임집니다!']
        };
        
        if (specialMessages[npcId]) {
            const messages = specialMessages[npcId];
            const message = messages[Math.floor(Math.random() * messages.length)];
            this.inventory.showItemNotification({ name: message });
            this.easterEggs.foundEggs.add(`special_${npcId}`);
        }
        
        // 26번 클릭 시 특별 이벤트
        if (this.easterEggs.specialClickCount === 26) {
            this.activate26thAnniversaryEvent();
        }
        
        this.checkEasterEggAchievements();
    }

    // 26주년 특별 이벤트
    activate26thAnniversaryEvent() {
        const specialEvent = [
            '🏆 26번 클릭 달성! 26주년 특별 이벤트! 🏆',
            '📜 휴넷 26년 연혁이 시작됩니다...',
            '1998년: 꿈을 품고 시작한 작은 회사',
            '2000년대: 디지털 교육의 선구자',
            '2010년대: 온라인 교육 혁신 리더',
            '2020년대: AI와 함께하는 미래 교육',
            '2024년: 26주년, 새로운 도약을 준비!'
        ];
        
        specialEvent.forEach((message, index) => {
            this.setSafeTimeout(() => {
                this.inventory.showItemNotification({ name: message });
                if (index === 1) this.audioManager.playGameComplete();
            }, index * 2000);
        });
        
        this.easterEggs.foundEggs.add('anniversary_event');
        this.createSpecialTimeline();
    }

    // 특별한 타임라인 시각 효과
    createSpecialTimeline() {
        const years = [1998, 2024];
        years.forEach((year, index) => {
            this.setSafeTimeout(() => {
                for (let i = 0; i < 10; i++) {
                    const x = 100 + (index * 600) + (Math.random() * 200);
                    const y = 200 + (Math.random() * 300);
                    this.particleSystem.createQuestCompleteEffect(x, y);
                }
            }, index * 3000);
        });
    }

    // 이스터 에그 업적 체크
    checkEasterEggAchievements() {
        const totalFound = this.easterEggs.foundEggs.size;
        
        const achievements = {
            3: '🎯 이스터 에그 탐험가! (3개 발견)',
            5: '🕵️ 비밀 탐정! (5개 발견)', 
            7: '🏆 휴넷 마스터! (7개 발견)',
            10: '👑 26주년 전설! (모든 이스터 에그 발견!)'
        };
        
        if (achievements[totalFound]) {
            this.setSafeTimeout(() => {
                this.inventory.showItemNotification({ name: achievements[totalFound] });
                this.audioManager.playMenuSelect();
            }, 1000);
        }
    }

    // 특별한 시간대 이스터 에그 (실제 시간 기반)
    checkTimeBasedEasterEggs() {
        const now = new Date();
        const hour = now.getHours();
        const month = now.getMonth() + 1;
        const date = now.getDate();
        
        // 오전 9시-6시 업무시간
        if (hour >= 9 && hour <= 18) {
            if (!this.easterEggs.foundEggs.has('work_hours')) {
                this.inventory.showItemNotification({ name: '⏰ 업무시간에 게임을? 휴넷 직원들은 열심히 일하는 중! 😄' });
                this.easterEggs.foundEggs.add('work_hours');
            }
        }
        
        // 26일에 플레이
        if (date === 26) {
            if (!this.easterEggs.foundEggs.has('date_26')) {
                this.inventory.showItemNotification({ name: '📅 26일에 26주년 게임을! 운명적이네요! ✨' });
                this.easterEggs.foundEggs.add('date_26');
            }
        }
        
        // 12월 (연말)
        if (month === 12) {
            if (!this.easterEggs.foundEggs.has('year_end')) {
                this.inventory.showItemNotification({ name: '🎄 연말에 26주년을 되돌아보는 특별한 시간! 🎊' });
                this.easterEggs.foundEggs.add('year_end');
            }
        }
    }

    toggleDebugMode() {
        this.debugMode = !this.debugMode;
        Logger.enableDebug(this.debugMode);
        this.inventory.showItemNotification({
            name: this.debugMode ? '🔧 디버그 모드 ON' : '🔧 디버그 모드 OFF'
        });
        this.audioManager.playUIClick();
        Logger.info(this.debugMode ? '🔧 디버그 모드가 활성화되었습니다.' : '🔧 디버그 모드가 비활성화되었습니다.');
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
        } else {
            this.player.stopMoving();
        }

        // 이동 후 주변 상호작용 요소 확인
        this.checkNearbyNPC();
        this.checkNearbyPortal();
        this.checkNearbyElevator();
        this.checkNearbyObject();
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

                    // 층별 분위기 변경
                    // this.floorAtmosphereSystem.changeFloor(portal.targetMap); // 백그라운드 소음 제거

                    // 맵 이동 알림
                    const mapName = this.mapManager.getCurrentMap().name;
                    this.inventory.showItemNotification({ name: `${mapName}(으)로 이동했습니다!` });
                }
            },
            600, // 0.6초 전환
            'rgba(0, 20, 40, 1)' // 어두운 파란색
        );
    }

    // 분위기 이벤트 처리
    handleAtmosphereEvent(eventDetail) {
        if (this.gameMode !== CONSTANTS.GAME_MODES.PLAYING) return;
        
        const { type, message, duration, floor } = eventDetail;
        
        // 인벤토리 알림으로 이벤트 표시
        this.inventory.showItemNotification({ 
            name: message,
            duration: Math.min(duration, 4000) // 최대 4초로 제한
        });
        
        // 특정 이벤트에 대한 추가 효과
        switch(type) {
            case 'visitor_arrival':
                // 방문객 도착 시 파티클 효과
                this.particleSystem.createRewardEffect(
                    this.canvas.width / 2, 
                    this.canvas.height / 4, 
                    '👥'
                );
                break;
                
            case 'urgent_call':
                // 긴급 전화 시 화면 깜빡임 효과
                this.createUrgentCallEffect();
                break;
                
            case 'presentation_prep':
                // 프레젠테이션 준비 시 집중 효과
                this.createFocusEffect();
                break;
                
            case 'weather_change':
                // 날씨 변화 시 전체 파티클 효과
                this.createWeatherEffect();
                break;
        }
        
        Logger.info(`🎭 분위기 이벤트: ${message} (${floor})`);
    }

    // 긴급 전화 시각 효과
    createUrgentCallEffect() {
        let flashCount = 0;
        const maxFlashes = 3;
        
        const flash = () => {
            if (flashCount >= maxFlashes) return;
            
            // 화면 테두리 붉은색 깜빡임
            this.ctx.save();
            this.ctx.strokeStyle = '#ff4444';
            this.ctx.lineWidth = 8;
            this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.restore();
            
            flashCount++;
            this.setSafeTimeout(() => {
                if (flashCount < maxFlashes) {
                    this.setSafeTimeout(flash, 200);
                }
            }, 200);
        };
        
        this.setSafeTimeout(flash, 100);
    }

    // 집중 효과 (프레젠테이션 준비)
    createFocusEffect() {
        // 중앙에 집중 아이콘 파티클
        this.particleSystem.createQuestCompleteEffect(
            this.canvas.width / 2,
            this.canvas.height / 2
        );
    }

    // 날씨 변화 효과
    createWeatherEffect() {
        // 여러 위치에서 날씨 파티클 생성
        for (let i = 0; i < 8; i++) {
            this.setSafeTimeout(() => {
                const x = Math.random() * this.canvas.width;
                const y = Math.random() * this.canvas.height * 0.3; // 상단에서만
                this.particleSystem.createRewardEffect(x, y, '🌤️');
            }, i * 150);
        }
    }

    collectItem(item) {
        const collectedItem = this.mapManager.collectItem(item.x, item.y);
        if (collectedItem) {
            Logger.debug(`✅ 아이템 수집: ${collectedItem.name}`);

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
            const questFeedback = this.questSystem.onItemCollected(collectedItem, this.gameState);
            
            // 퀘스트 피드백 저장
            if (questFeedback) {
                this.currentQuestFeedback = questFeedback;
            }

            // 기존 퀘스트 진행 업데이트도 유지
            this.questSystem.updateProgress(
                CONSTANTS.QUEST_TARGETS.COLLECT_ALL_ITEMS,
                this.gameState.itemsCollected
            );
        }
    }

    checkNearbyNPC() {
        this.nearbyNPC = this.mapManager.getNearbyNPC(this.player.x, this.player.y);
        if (this.nearbyNPC) {
            console.log('🤖 NPC 감지됨:', this.nearbyNPC.id, '위치:', this.nearbyNPC.x, this.nearbyNPC.y, '플레이어:', this.player.x, this.player.y);
        }
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

    // 특별 NPC 상호작용 처리
    handleSpecialNPCInteraction(npc) {
        // const dialogue = this.specialNPCSystem.interactWithSpecialNPC(npc.id); // 백그라운드 자동 스폰 제거
        const dialogue = null; // 특별 NPC 기능 비활성화
        if (!dialogue) return;

        // 선택지가 있는 대화
        if (dialogue.choices) {
            this.showingChoices = true;
            this.selectedChoice = 0;
            this.currentChoiceNPC = npc;
            this.currentDialog = [dialogue.text];
            this.currentChoices = dialogue.choices;
        } else {
            // 일반 대화
            this.currentDialog = [dialogue.text];
            this.currentChoices = null;
            this.showingChoices = false;
        }

        this.currentNPC = npc;
        this.dialogIndex = 0;
        this.audioManager.playDialogOpen();
        this.showDialog();

        // 특별 NPC 발견 파티클 효과
        if (npc.rarity === 'legendary') {
            this.particleSystem.createRewardEffect(
                this.canvas.width / 2,
                this.canvas.height / 3,
                '💫'
            );
        }
    }

    // 특별 NPC 선택지 처리
    handleSpecialNPCChoice(choiceResponse) {
        if (!this.currentChoiceNPC) return;

        // const dialogue = this.specialNPCSystem.processChoice(this.currentChoiceNPC.id, choiceResponse); // 백그라운드 자동 스폰 제거
        const dialogue = null; // 특별 NPC 기능 비활성화
        if (dialogue) {
            this.currentDialog = [dialogue.text];
            this.currentChoices = null;
            this.showingChoices = false;
            this.dialogIndex = 0;
            this.showDialog();
        }
    }

    interact() {
        console.log('🎯 interact() 호출됨! nearbyNPC:', this.nearbyNPC, '플레이어 위치:', this.player.x, this.player.y);
        
        // 튜토리얼에 상호작용 알림
        if (this.tutorialSystem.isVisible()) {
            this.tutorialSystem.handleInteraction();
        }

        if (this.nearbyNPC) {
            console.log('✅ nearbyNPC 발견:', this.nearbyNPC.id, this.nearbyNPC.name);
            // 특별 NPC 처리
            if (this.nearbyNPC.isSpecial) {
                this.handleSpecialNPCInteraction(this.nearbyNPC);
                return;
            }
            // 특별한 액션이 있는 NPC 체크
            if (this.nearbyNPC.specialAction === 'arcade') {
                this.miniGameSystem.show();
                return;
            }

            // 메인 퀘스트 아이템 자동 제출 확인
            const submission = this.questSystem.canSubmitToNPC(this.nearbyNPC.id, this.gameState.inventory);

            // 미니게임 챌린지 체크 (퀘스트 제출 전에)
            const minigameCheck = this.checkMinigameChallenge(this.nearbyNPC.id);
            if (!minigameCheck.canProceed) {
                this.currentDialog = [
                    '잠깐! 먼저 챌린지를 완료해야 합니다.',
                    minigameCheck.description,
                    '[Space]키를 누르면 미니게임이 시작됩니다!'
                ];
                this.currentNPC = this.nearbyNPC;
                this.currentMinigameChallenge = minigameCheck; // 챌린지 정보 저장
                this.dialogIndex = 0;
                this.audioManager.playDialogOpen();
                this.showDialog();
                return;
            }

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
                    // NPC 관계 개선 (메인 퀘스트 완료)
                    this.npcRelationshipSystem.processInteraction(this.nearbyNPC.id, 'questComplete');
                    
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

                    // 다음 단계 정보 저장
                    if (result.nextStepInfo) {
                        this.nextStepInfo = result.nextStepInfo;
                        // 5초 후에 다음 단계 정보 자동 숨김
                        this.showNextStepInfo(result.nextStepInfo);
                    }

                    // 알림도 표시
                    this.inventory.showItemNotification({ name: result.message });
                } else {
                    // 실패시 일반 대화
                    this.startDialog(this.nearbyNPC);
                }
            } else if (subSubmission.canSubmit) {
                // 서브 퀘스트 자동으로 아이템 제출 처리
                Logger.debug(`🔍 서브퀘스트 처리: NPC ${this.nearbyNPC.id}, 인벤토리:`, this.gameState.inventory.map(item => item.name));
                const result = this.questSystem.submitItemsToSubQuestGiver(
                    this.nearbyNPC.id,
                    this.gameState.inventory,
                    this.gameState
                );
                Logger.debug(`📋 서브퀘스트 결과:`, result);

                if (result.success) {
                    // NPC 관계 개선 (서브 퀘스트 진행/완료)
                    const interactionType = result.quest.completed ? 'questComplete' : 'questSubmit';
                    this.npcRelationshipSystem.processInteraction(this.nearbyNPC.id, interactionType);
                    
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
                // 퀘스트를 받을 수 있는지 확인
                const questStart = this.questSystem.questManager.startQuestFromNPC(this.nearbyNPC.id);
                
                if (questStart.success) {
                    // 새 퀘스트 받기
                    this.npcRelationshipSystem.processInteraction(this.nearbyNPC.id, 'questSubmit');
                    
                    this.currentDialog = [
                        `🎯 새로운 퀘스트를 받았습니다!`,
                        `${questStart.quest.title}`,
                        questStart.quest.description,
                        `📍 ${questStart.quest.hint}`
                    ];
                    this.currentNPC = this.nearbyNPC;
                    this.dialogIndex = 0;
                    this.audioManager.playDialogOpen();
                    this.showDialog();
                    
                    // 퀘스트 시작 알림
                    this.inventory.showItemNotification({ name: questStart.message });
                } else {
                    // 일반 대화 - 관계 개선 (작은 폭)
                    this.npcRelationshipSystem.processInteraction(this.nearbyNPC.id, 'normalTalk');
                    this.startDialog(this.nearbyNPC);
                }
                
                // 특별 NPC 클릭 이스터 에그 체크
                this.handleSpecialNPCClick(this.nearbyNPC.id);

                // 일반 대화에서만 기존 퀘스트 완료 확인
                if (this.nearbyNPC.questTarget) {
                    this.questSystem.completeQuest(this.nearbyNPC.questTarget);

                    // CEO와 대화하면 게임 완료 체크
                    if (this.nearbyNPC.questTarget === CONSTANTS.QUEST_TARGETS.TALK_TO_CEO) {
                        this.checkGameCompletion();
                    }
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
            this.setSafeTimeout(() => {
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
        // 퀘스트 상태에 따른 동적 대화 선택
        const contextualDialog = this.getContextualDialog(npc);

        if (contextualDialog) {
            // 퀘스트 상태 기반 대화
            this.currentDialog = contextualDialog;
            this.currentNPC = npc;
            this.dialogIndex = 0;
            this.audioManager.playDialogOpen();
            this.showDialog();
        } else if (npc.hasChoices && npc.dialogChoices) {
            // 퀘스트 상태 기반 선택지 필터링
            const filteredChoices = this.getFilteredChoices(npc);
            this.showChoices(npc, filteredChoices);
        } else {
            // 기존 일반 대화
            this.currentDialog = npc.dialog;
            this.currentNPC = npc;
            this.dialogIndex = 0;
            this.audioManager.playDialogOpen();
            this.showDialog();
        }
    }

    // 퀘스트 상태에 따른 동적 대화 반환
    getContextualDialog(npc) {
        // NPC가 퀘스트 기버인지 확인
        const npcQuest = this.questSystem.questManager.getQuestByNPC(npc.id);
        const completedQuests = this.questSystem.questManager.getCompletedQuestCount();

        // 기분 기반 인사말 체크 (30% 확률)
        const moodBasedGreeting = this.npcRelationshipSystem.getMoodBasedDialogue(npc.id);
        if (moodBasedGreeting && Math.random() < 0.3) {
            // 관계 상호작용 처리
            this.npcRelationshipSystem.processInteraction(npc.id, 'normalTalk');
            return [moodBasedGreeting];
        }

        // NPC별 특별한 상황 대화
        let contextualDialog = null;
        switch(npc.id) {
            case 'guard':
                contextualDialog = this.getGuardContextualDialog(npcQuest, completedQuests);
                break;
            case 'reception':
                contextualDialog = this.getReceptionContextualDialog(npcQuest, completedQuests);
                break;
            case 'kim_deputy':
                contextualDialog = this.getKimDeputyContextualDialog(npcQuest, completedQuests);
                break;
            case 'manager_lee':
                contextualDialog = this.getManagerLeeContextualDialog(npcQuest, completedQuests);
                break;
            case 'education_manager':
                contextualDialog = this.getEducationManagerContextualDialog(npcQuest, completedQuests);
                break;
            case 'ceo_kim':
                contextualDialog = this.getCEOContextualDialog(npcQuest, completedQuests);
                break;
            default:
                contextualDialog = null;
        }

        // 상황별 대화가 있으면 기분에 따라 수정
        if (contextualDialog) {
            const relationship = this.gameState.getNPCRelationship(npc.id);
            contextualDialog = this.applyMoodToDialogue(contextualDialog, relationship.mood);
        }

        return contextualDialog;
    }

    applyMoodToDialogue(dialogue, mood) {
        if (!dialogue || !Array.isArray(dialogue)) return dialogue;
        
        const moodPrefixes = {
            happy: ["😊 ", "😄 ", "🌟 "],
            friendly: ["🙂 ", "😊 "],
            neutral: [""],
            annoyed: ["😤 ", "💢 "],
            angry: ["😠 ", "😡 "]
        };
        
        const moodSuffixes = {
            happy: [" 정말 기쁘네요!", " 최고예요!", " 환상적이에요!"],
            friendly: [" 좋네요!", " 반갑습니다!", " 감사해요!"],
            neutral: [""],
            annoyed: [" 빨리 처리해주세요.", " 시간이 없어요.", " 좀 바빠요."],
            angry: [" 지금은 힘들어요.", " 나중에 다시 와주세요.", " 기분이 안 좋아요."]
        };
        
        const prefixes = moodPrefixes[mood] || moodPrefixes.neutral;
        const suffixes = moodSuffixes[mood] || moodSuffixes.neutral;
        
        return dialogue.map(line => {
            if (Math.random() < 0.4) { // 40% 확률로 기분 표현 추가
                const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
                const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
                return prefix + line + suffix;
            }
            return line;
        });
    }

    // 경비 아저씨 상황별 대화
    getGuardContextualDialog(npcQuest, completedQuests) {
        // 퀘스트 완료 후 재방문 대화들
        const questCompleteDialogs = [
            '26년간 이 회사를 지켜왔는데, 당신 같은 직원이 있어 든든합니다!',
            '보안이 제일 중요한데, 당신은 정말 신뢰할 만한 분이에요.',
            '휴넷의 미래가 밝아 보이네요. 당신 덕분입니다!',
            '이런 열정적인 신입사원은 처음 봐요. 정말 자랑스럽습니다.',
            '26주년이니까... 옛날 얘기 하나 해드릴까요? 처음엔 정말 작은 회사였어요.'
        ];

        // 시간대별 대화
        const hour = new Date().getHours();
        const timeBasedDialogs = {
            morning: '좋은 아침입니다! 오늘도 안전한 하루 되세요.',
            afternoon: '점심 드셨나요? 오후에도 화이팅하세요!',
            evening: '하루 종일 수고 많으셨어요. 내일 뵙겠습니다!'
        };

        // 퀘스트 상태에 따른 대화
        if (npcQuest && !npcQuest.completed && !npcQuest.started) {
            return [
                '안녕하세요! 휴넷의 새로운 직원이시군요.',
                '출입증을 발급받으셔야 이 건물을 자유롭게 돌아다니실 수 있어요.',
                '로비 바닥에 황금색으로 빛나는 입장 패스를 찾아서 가져다주세요!'
            ];
        } else if (npcQuest && npcQuest.started && !npcQuest.completed) {
            return [
                '입장 패스를 찾고 계시는군요!',
                '로비를 잘 살펴보시면 분명 찾으실 수 있을 거예요.',
                '26년 경력의 직감으로는... 분명 어딘가에 있습니다!'
            ];
        } else if (completedQuests === 0) {
            return [
                '아직 첫 퀘스트도 완료 안 하셨군요.',
                '천천히 하세요. 26년 동안 여기 있었는데 하루 이틀이 뭐 대수겠어요!'
            ];
        } else if (completedQuests >= 1) {
            // 재방문 시 랜덤 대화
            const randomDialog = questCompleteDialogs[Math.floor(Math.random() * questCompleteDialogs.length)];
            
            // 시간대별 추가 대화
            let timeDialog = '';
            if (hour >= 6 && hour < 12) {
                timeDialog = timeBasedDialogs.morning;
            } else if (hour >= 12 && hour < 18) {
                timeDialog = timeBasedDialogs.afternoon;
            } else {
                timeDialog = timeBasedDialogs.evening;
            }

            // 특별한 업적 대화
            if (completedQuests >= 5) {
                return [
                    '와! 벌써 ' + completedQuests + '개나 완료하셨군요!',
                    '이런 열정적인 직원은 26년 만에 처음 봅니다.',
                    '휴넷의 미래가 정말 밝아 보이네요!'
                ];
            } else if (completedQuests >= 3) {
                return [
                    randomDialog,
                    '벌써 절반 이상 완료하셨네요. 대단해요!',
                    timeDialog
                ];
            } else {
                return [
                    randomDialog,
                    timeDialog
                ];
            }
        }

        return [
            '무엇을 도와드릴까요?',
            '오늘도 안전한 하루 되세요!'
        ];
    }

    // 안내 데스크 상황별 대화
    getReceptionContextualDialog(npcQuest, completedQuests) {
        // 퀘스트 완료 후 재방문 대화들
        const questCompleteDialogs = [
            '정확한 정보를 드리는 게 제 역할인데, 당신은 정말 모범적이에요!',
            '26주년 기념 이벤트가 성공적으로 진행되고 있어요. 다 당신 덕분이죠!',
            '휴넷 직원들 중에서도 당신만큼 열심히 하는 분은 드물어요.',
            '제가 안내 데스크에서 일한 지 10년인데, 이렇게 성실한 분은 처음이에요!',
            '다른 층 직원들도 당신 얘기를 많이 해요. 좋은 의미로요!'
        ];

        // 업무 관련 팁들
        const workTips = [
            '💡 팁: 각 층마다 특색이 달라요. 7층은 실무진, 8층은 본부, 9층은 경영진이죠.',
            '💡 팁: 엘리베이터는 출입증이 있어야 이용할 수 있어요.',
            '💡 팁: 미니게임을 통해 직원들과 친해질 수 있어요!',
            '💡 팁: 퀘스트를 빨리 완료할수록 좋은 평가를 받을 수 있어요.',
            '💡 팁: 각 부서마다 고유한 문화가 있으니 잘 관찰해보세요.'
        ];

        // 방문 횟수 추적 (간단한 카운터)
        if (!this.gameState.npcVisitCount) {
            this.gameState.npcVisitCount = {};
        }
        if (!this.gameState.npcVisitCount['reception']) {
            this.gameState.npcVisitCount['reception'] = 0;
        }
        this.gameState.npcVisitCount['reception']++;

        const visitCount = this.gameState.npcVisitCount['reception'];

        // 퀘스트 상태에 따른 대화
        if (npcQuest && !npcQuest.completed && !npcQuest.started) {
            return [
                '26주년 기념 메달을 찾고 계시는군요!',
                '정확한 정보를 드리자면, 로비 바닥 어딘가에 있을 거예요.',
                '황금색으로 반짝이니 놓치기 어려울 것 같은데요?'
            ];
        } else if (npcQuest && npcQuest.started && !npcQuest.completed) {
            return [
                '26주년 기념 메달, 아직 못 찾으셨나요?',
                '제가 정확히 안내해드릴게요. 로비를 샅샅이 둘러보세요!',
                '26년 역사의 소중한 메달이니까 꼭 찾으실 거예요.'
            ];
        } else if (completedQuests === 0) {
            return [
                '아직 시작 단계시군요. 천천히 하세요!',
                '정확한 정보가 필요하시면 언제든 말씀해주세요.'
            ];
        } else if (completedQuests >= 1) {
            // 재방문 특별 대화
            if (visitCount <= 3) {
                const randomDialog = questCompleteDialogs[Math.floor(Math.random() * questCompleteDialogs.length)];
                const randomTip = workTips[Math.floor(Math.random() * workTips.length)];
                
                return [
                    randomDialog,
                    randomTip
                ];
            } else if (visitCount <= 7) {
                return [
                    '또 오셨네요! 뭔가 궁금한 게 있으신가 봐요.',
                    '제가 정확한 정보를 드릴 수 있는 건 언제든 물어보세요!',
                    '이 정도 열정이면 곧 모든 퀘스트를 완료하실 것 같아요.'
                ];
            } else {
                // 자주 방문하는 경우 특별 대화
                return [
                    '정말 자주 오시네요! 저와 친해지고 싶으신 건가요? 😊',
                    '이렇게 소통을 자주 하는 직원은 처음이에요.',
                    '혹시 저희 안내 데스크 팀에 관심 있으시면 언제든 말씀하세요!'
                ];
            }
        }

        // 기본 대화
        return [
            '안녕하세요! 무엇을 도와드릴까요?',
            '정확한 정보를 제공하는 것이 제 역할입니다!'
        ];
    }

    // 김대리 상황별 대화
    getKimDeputyContextualDialog(npcQuest, completedQuests) {
        // 김대리의 성격 반영 대화들
        const casualDialogs = [
            '이야, 진짜 열심히 하시네요! 저도 배워야겠어요.',
            '요즘 신입사원들 중에 이렇게 적극적인 분은 드물어요.',
            '7층 생활 어때요? 적응 잘 되시나요?',
            '커피 한 잔 하면서 얘기할까요? 아, 지금은 바쁘시구나.',
            '대리 생활 5년째인데, 당신 보면서 초심을 되찾게 되네요.'
        ];

        const workAdvice = [
            '💼 대리 꿀팁: 상사한테 보고할 때는 결론부터 말하세요.',
            '💼 대리 꿀팁: 점심시간 30분 전에 미리 계획 세우면 좋아요.',
            '💼 대리 꿀팁: 회의록은 당일에 정리해야 기억이 생생해요.',
            '💼 대리 꿀팁: 업무는 우선순위를 정해서 하는 게 중요해요.',
            '💼 대리 꿀팁: 동료들과 친해지면 일이 훨씬 수월해져요.'
        ];

        // 스트레스 레벨에 따른 대화 (랜덤하게 변함)
        const stressLevel = Math.floor(Math.random() * 3); // 0: 좋음, 1: 보통, 2: 스트레스

        // 퀘스트 상태 확인
        if (npcQuest && !npcQuest.completed && !npcQuest.started) {
            return [
                '어? 새로운 팀원이네요! 반가워요.',
                '제가 김대리라고 해요. 앞으로 잘 부탁드려요!',
                '일단 저한테 맡겨진 업무부터 도와주실 수 있나요?'
            ];
        } else if (npcQuest && npcQuest.started && !npcQuest.completed) {
            return [
                '아직 업무 진행 중이시군요!',
                '처음이라 어려우실 텐데, 천천히 하세요.',
                '궁금한 거 있으면 언제든 물어보세요!'
            ];
        } else if (completedQuests >= 1) {
            // 재방문 시 스트레스 레벨에 따른 대화
            if (stressLevel === 0) { // 좋은 상태
                const randomDialog = casualDialogs[Math.floor(Math.random() * casualDialogs.length)];
                const randomAdvice = workAdvice[Math.floor(Math.random() * workAdvice.length)];
                
                return [
                    randomDialog,
                    randomAdvice,
                    '오늘 컨디션이 좋네요! 같이 화이팅해요!'
                ];
            } else if (stressLevel === 1) { // 보통 상태
                return [
                    '오늘 업무량이 좀 많네요. 그래도 할 만해요.',
                    '당신도 바쁘실 텐데 들러주셔서 고마워요.',
                    '서로 힘내자고요!'
                ];
            } else { // 스트레스 상태
                return [
                    '아... 오늘 진짜 바빠 죽겠어요. 😅',
                    '상사가 갑자기 급한 업무를 맡기셔서...',
                    '그래도 당신 얼굴 보니까 좀 나아지네요. 고마워요!'
                ];
            }
        }

        // 완료한 퀘스트 수에 따른 특별 대화
        if (completedQuests >= 5) {
            return [
                '와! 벌써 그렇게 많이 하셨어요?',
                '저도 당신만큼 일 잘하고 싶네요.',
                '혹시 비결이 있나요? 진짜 궁금해요!'
            ];
        } else if (completedQuests >= 3) {
            return [
                '진짜 대단하세요! 저보다 일 잘하시는 것 같아요.',
                '이런 팀원이 있어서 7층이 든든하네요.',
                '앞으로도 잘 부탁드려요!'
            ];
        }

        return [
            '안녕하세요! 오늘도 화이팅이에요!',
            '7층에서 뭔가 도움 필요한 거 있으면 말씀하세요.'
        ];
    }

    // 이과장 (8층 팀장) 상황별 대화
    getManagerLeeContextualDialog(quest, completedQuests) {
        if (!quest || quest.completed) {
            // 퀘스트 완료 후
            if (completedQuests >= 6) {
                return [
                    "CEO님과의 만남까지! 정말 감동적이네요.",
                    "휴넷의 전체 여정을 체험하신 몇 안 되는 분이에요.",
                    "진정한 휴넷 스피릿을 체험하셨습니다!"
                ];
            } else {
                return [
                    "회의 자료 덕분에 8층 중요 회의가 성공적으로 마무리됐어요!",
                    "팀원들도 모두 만족해했답니다.",
                    "이제 더 상위층으로 가서 경영진들을 만나보세요!"
                ];
            }
        } else if (quest && !quest.itemSubmitted) {
            // 퀘스트 진행 중
            const canAccessFloor8 = completedQuests >= 2;
            if (!canAccessFloor8) {
                return [
                    "8층에 오시려면 먼저 7층 업무를 완료하셔야 해요.",
                    "김대리님과의 협업을 먼저 마치고 오시길 바랍니다!",
                    "순차적으로 진행하시는 게 휴넷의 성장 스토리를 이해하는 데 도움이 돼요."
                ];
            } else {
                return [
                    "8층에 오신 걸 환영합니다! 저는 8층 본부 팀장 이민수입니다.",
                    "26주년 기념 중요 회의를 준비하고 있는데 도움이 필요해요.",
                    "'회의록'과 '프레젠테이션' 자료를 찾아서 가져다 주시겠어요?"
                ];
            }
        }
        return null;
    }

    // 교육매니저 상황별 대화
    getEducationManagerContextualDialog(quest, completedQuests) {
        if (!quest || quest.completed) {
            if (completedQuests >= 6) {
                return [
                    "휴넷의 모든 여정을 완주하셨군요! 축하드려요!",
                    "교육 기업답게 최고의 학습 경험을 제공해드렸나요?",
                    "이제 진정한 휴넷의 교육 철학을 이해하셨을 거예요."
                ];
            } else {
                return [
                    "교육 프로그램 기획 덕분에 정말 도움이 됐어요!",
                    "휴넷의 교육 노하우가 담긴 소중한 자료였답니다.",
                    "9층 CEO님께도 꼭 인사드리고 가세요!"
                ];
            }
        } else if (quest && !quest.itemSubmitted) {
            const canAccessEducation = completedQuests >= 3;
            if (!canAccessEducation) {
                return [
                    "교육서비스본부에 오시려면 먼저 이전 단계들을 완료해주세요.",
                    "휴넷의 성장 과정을 순서대로 체험하시는 게 중요해요!",
                    "7층과 8층 업무를 먼저 완료하고 오시길 바랍니다."
                ];
            } else {
                return [
                    "교육서비스본부에 오신 걸 환영해요!",
                    "휴넷의 핵심인 교육 프로그램을 관리하고 있어요.",
                    "'교육 프로그램 기획서'를 찾아서 가져다 주시면 큰 도움이 될 거예요!"
                ];
            }
        }
        return null;
    }

    // CEO 상황별 대화
    getCEOContextualDialog(quest, completedQuests) {
        if (!quest || quest.completed) {
            return [
                "휴넷 26년의 여정을 모두 체험해주셔서 진심으로 감사합니다!",
                "당신은 이제 진정한 휴넷 가족입니다.",
                "앞으로도 휴넷과 함께 성장해나가길 바랍니다!"
            ];
        } else {
            const canMeetCEO = completedQuests >= 5;
            if (!canMeetCEO) {
                return [
                    "CEO와의 만남은 휴넷 여정의 마지막 단계입니다.",
                    "먼저 모든 부서의 업무를 체험하고 오시길 바랍니다!",
                    "휴넷의 성장 스토리를 완전히 이해한 후에 다시 만나요."
                ];
            } else {
                return [
                    "휴넷 26주년 기념 게임에 참여해주셔서 감사합니다!",
                    "모든 부서를 체험하며 우리의 여정을 함께해주셨군요.",
                    "마지막으로 '휴넷 정신'을 찾아서 가져다 주시겠어요?"
                ];
            }
        }
    }

    // 퀘스트 상태에 따른 선택지 필터링
    getFilteredChoices(npc) {
        if (!npc.dialogChoices || !npc.dialogChoices.choices) {
            return null;
        }

        const completedQuests = this.questSystem.questManager.getCompletedQuestCount();
        const npcQuest = this.questSystem.questManager.getQuestByNPC(npc.id);

        // 선택지에 조건 추가 (각 NPC별로 상황에 맞는 선택지 제공)
        const filteredChoices = npc.dialogChoices.choices.filter(choice => {
            // 기본적으로 모든 선택지를 표시하되, 특별한 조건이 있는 경우만 필터링
            if (choice.requiresQuestCompletion && completedQuests < choice.requiresQuestCompletion) {
                return false;
            }
            if (choice.requiresActiveQuest && (!npcQuest || npcQuest.completed)) {
                return false;
            }
            return true;
        });

        return filteredChoices.length > 0 ? {
            ...npc.dialogChoices,
            choices: filteredChoices
        } : null;
    }

    // 선택지 표시 (필터링된 선택지 지원)
    showChoices(npc, customChoices = null) {
        this.showingChoices = true;
        this.selectedChoice = 0;
        this.currentChoiceNPC = npc;

        // 커스텀 선택지가 있으면 임시로 교체
        if (customChoices) {
            this.currentChoiceNPC = {
                ...npc,
                dialogChoices: customChoices
            };
        }

        this.currentDialog = npc.dialog; // 기본 대화
        this.currentNPC = npc;
        this.dialogIndex = 0;
        this.audioManager.playDialogOpen();
    }

    // 선택지 탐색
    navigateChoices(direction) {
        if (!this.showingChoices || !this.currentChoiceNPC) return;
        
        const choiceCount = this.currentChoiceNPC.dialogChoices.choices.length;
        
        if (direction === 'up') {
            this.selectedChoice = (this.selectedChoice - 1 + choiceCount) % choiceCount;
        } else if (direction === 'down') {
            this.selectedChoice = (this.selectedChoice + 1) % choiceCount;
        }
    }

    // 선택지 확인
    confirmChoice() {
        if (!this.showingChoices || !this.currentChoiceNPC) return;
        
        // 특별 NPC 선택지 처리
        if (this.currentChoiceNPC.isSpecial && this.currentChoices) {
            const choice = this.currentChoices[this.selectedChoice];
            this.handleSpecialNPCChoice(choice.response);
            return;
        }
        
        // 기존 일반 NPC 선택지 처리
        const choice = this.currentChoiceNPC.dialogChoices.choices[this.selectedChoice];
        
        // 선택된 응답으로 대화 시작
        this.currentDialog = choice.response;
        this.dialogIndex = 0;
        this.showingChoices = false;
        this.currentChoiceNPC = null;
        this.showDialog();
    }

    // 선택지 취소
    cancelChoices() {
        if (!this.showingChoices) return;
        
        this.showingChoices = false;
        this.currentChoiceNPC = null;
        this.closeDialog();
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
        // 미니게임 챌린지 대화가 끝났으면 미니게임 시작
        if (this.currentMinigameChallenge) {
            const challenge = this.currentMinigameChallenge;
            this.currentMinigameChallenge = null; // 챌린지 정보 정리

            // 대화창 정리
            this.currentDialog = null;
            this.currentNPC = null;
            this.dialogIndex = 0;
            this.audioManager.playDialogClose();

            // 미니게임 시작
            this.miniGameSystem.show();
            return;
        }

        this.currentDialog = null;
        this.currentNPC = null; // NPC 정보 정리
        this.dialogIndex = 0;
        this.audioManager.playDialogClose();
        // HTML 조작 제거, Canvas에서 그려짐
    }


    startNewGame() {
        Logger.info('🎮 새 게임 시작...');

        // 인트로는 이미 봤으니 바로 게임 시작
        this.startGameAfterIntro();
    }

    startGameAfterIntro() {
        Logger.info('🎮 인트로 완료 후 게임 시작...');

        // 초기 상태로 리셋 - 로비에서 시작 (엘리베이터 바로 앞)
        this.secretClickCount = 0;
        this.konamiActivated = false;
        this.konamiIndex = 0;
        this.debugMode = false;
        Logger.enableDebug(false);

        const mapSet = this.mapManager.setCurrentMap(CONSTANTS.MAPS.LOBBY);
        Logger.debug('맵 설정 결과:', mapSet, '현재 맵:', this.mapManager.getCurrentMapId());

        // 로비 분위기 시작
        // this.floorAtmosphereSystem.changeFloor(CONSTANTS.MAPS.LOBBY); // 백그라운드 소음 제거

        this.player = new Player(33, 15);
        Logger.debug('플레이어 생성:', this.player.x, this.player.y);

        this.gameState = new GameState();
        this.questSystem = new QuestSystem(this.audioManager, this);
        
        // QuestManager에 gameState 설정
        this.questSystem.questManager.setGameState(this.gameState);
        
        // NPC 관계 시스템 초기화
        this.npcRelationshipSystem = new NPCRelationshipSystem(this.gameState);
        
        // 동적 퀘스트 힌트 시스템 초기화
        this.dynamicQuestHints = new DynamicQuestHints(this.gameState, this.questSystem.questManager, this.mapManager);
        
        // UI 시스템들 재초기화 (questGuide는 생성자에서 이미 초기화됨)
        this.uiRenderer = new GameUIRenderer(this.canvas, this.ctx);
        this.dialogRenderer = new DialogRenderer(this.canvas, this.ctx);
        this.tutorialSystem = new TutorialSystem(this.canvas, this.ctx);

        this.camera.update(this.player.x, this.player.y);
        Logger.debug('카메라 업데이트 완료');

        this.gameMode = CONSTANTS.GAME_MODES.PLAYING;
        Logger.debug('게임 모드 변경:', this.gameMode);

        // 게임 시작 시 모든 UI 닫기 (퀘스트 가이드는 제외)
        this.questSystem.hideQuestUIPanel();
        this.inventory.hide();
        this.minimap.hide();
        
        // 퀘스트 가이드는 게임 시작과 함께 즉시 표시 (이미 기본값이 true이므로 별도 호출 불필요)
        // this.questGuide.show(); // 임시 주석 처리

        this.inventory.showItemNotification({ name: '동전 5,000원을 지급받았습니다.' });
        this.inventory.showItemNotification({ name: '휴넷 26주년 게임을 시작합니다!' });

        // 튜토리얼 완료 콜백 설정
        this.tutorialSystem.setOnComplete(() => {
            Logger.info('✅ 튜토리얼 완료! 정상적인 게임플레이 시작');
            // 퀘스트 가이드는 이미 표시되어 있음
        });

        // 튜토리얼 자동 시작
        this.setSafeTimeout(() => {
            this.tutorialSystem.start();
        }, 1000);
        
        // 시간 기반 이스터 에그 체크
        this.setSafeTimeout(() => {
            this.checkTimeBasedEasterEggs();
        }, 3000);

        Logger.info('✅ 새 게임 시작 완료');
    }

    update() {
        this.animationSystem.update();

        if (this.gameMode === CONSTANTS.GAME_MODES.LOADING) {
            this.loadingScreen.update();

            // 로딩 완료 시 1999년 레트로 인트로로 전환
            if (this.loadingScreen.isComplete()) {
                Logger.info('🖥️ 1999년 레트로 부팅 시퀀스 시작...');
                this.gameMode = CONSTANTS.GAME_MODES.INTRO;
                this.introScreen.start(() => {
                    Logger.info('📋 시작하기 화면으로 전환...');
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

            // NPC 관계 시스템 시간 기반 업데이트
            this.npcRelationshipSystem.updateTimeBasedChanges();

            // 동적 퀘스트 힌트 업데이트
            const currentQuest = this.questSystem.getCurrentQuest();
            if (currentQuest) {
                this.currentDynamicHint = this.dynamicQuestHints.getDynamicHint(
                    currentQuest, 
                    this.player, 
                    this.mapManager.getCurrentMapId()
                );
            }

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
            Logger.error('❌ Draw 메서드 오류 (첫 부분):', error);
            Logger.debug('현재 게임 모드:', this.gameMode);
        }

        if (this.gameMode === CONSTANTS.GAME_MODES.PLAYING) {
            try {
                const currentMap = this.mapManager.getCurrentMap();

                if (!currentMap) {
                    Logger.error('현재 맵이 로딩되지 않았습니다:', this.mapManager.getCurrentMapId());
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
                Logger.error('❌ 월드 렌더링 오류:', error);
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
                Logger.error('❌ 플레이어 렌더링 오류:', error);
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
                
                // NPC 관계 정보 표시
                if (this.nearbyNPC) {
                    this.uiRenderer.drawNPCRelationshipIcon(this.nearbyNPC, this.npcRelationshipSystem);
                }
            }

            // 게임 안내 메시지
            this.uiRenderer.drawGameInstructions(this.debugMode, this.konamiActivated);

            // 퀘스트 가이드 (화면 상단) - 항상 호출 (내부에서 visible 체크)
            const gameStateWithMap = {
                ...this.gameState,
                currentMap: this.mapManager.getCurrentMapId()
            };
            this.questGuide.draw(this.questSystem, gameStateWithMap);

            // UI 렌더링 (gameStateWithMap은 위에서 이미 선언됨)
            this.questUI.draw(this.questSystem, gameStateWithMap);
            this.minimap.draw(this.player, this.mapManager, this.gameState);
            this.inventory.draw(this.gameState);

            // 튜토리얼 렌더링 (모든 UI 위에)
            this.tutorialSystem.draw();

            // 대화창 렌더링 (UI보다 위에)
            if (this.showingChoices && this.currentChoiceNPC) {
                // 선택지 표시
                this.dialogRenderer.drawDialogChoices(this.currentChoiceNPC, this.selectedChoice);
            } else if (this.currentDialog) {
                // 일반 대화
                this.dialogRenderer.drawDialog(this.currentDialog, this.dialogIndex, this.currentNPC);
            }

            // 일시정지 메뉴 (최상위 레이어)
            this.pauseMenu.draw();

            // 엘리베이터 UI (최상위 레이어)
            this.elevatorUI.draw();

            // 미니게임 시스템 (최상위 레이어)
            this.miniGameSystem.draw();

            // 퀘스트 피드백 표시
            if (this.currentQuestFeedback) {
                const stillDisplaying = this.uiRenderer.drawQuestFeedback(this.ctx, this.currentQuestFeedback, this.canvas);
                if (!stillDisplaying) {
                    this.currentQuestFeedback = null;
                }
            }

            // 다음 단계 정보 표시
            if (this.nextStepInfo) {
                this.uiRenderer.drawNextStepInfo(this.ctx, this.nextStepInfo, this.canvas);
            }

            // 동적 퀘스트 힌트 표시
            if (this.currentDynamicHint) {
                const isUrgent = this.currentDynamicHint.includes('🆘') || this.currentDynamicHint.includes('🚨');
                this.uiRenderer.drawDynamicQuestHint(this.currentDynamicHint, isUrgent);
            }

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

            // 튜토리얼 시스템 렌더링 (최상위)
            if (this.tutorialSystem && this.tutorialSystem.isVisible()) {
                this.tutorialSystem.draw();
            }

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
            Logger.error('❌ 게임 루프 오류:', error);
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
        document.removeEventListener('keydown', this.boundKeyDownHandler);
        this.canvas.removeEventListener('mousemove', this.boundMouseMoveHandler);
        this.canvas.removeEventListener('click', this.boundClickHandler);

        // 오디오 정리
        if (this.audioManager) {
            this.audioManager.destroy();
        }
    }
};
