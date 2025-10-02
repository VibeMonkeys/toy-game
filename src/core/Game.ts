/**
 * 🎮 던전 오딧세이 - 메인 게임 클래스
 *
 * docs/OPTIMIZED_GAME_DESIGN.md 기반으로 완전 새로 구현
 */

import { GameMode, PlayerStats, Vector2D } from '../types';
import { GAME_MODES, SCREEN, GAMEPLAY, GAME_INFO } from '../utils/Constants';
import { InputManager } from '../systems/InputManager';
import { Renderer } from '../systems/Renderer';
import { MapManager } from '../systems/MapManager';
import { Camera } from '../systems/Camera';
import { DamageNumberSystem } from '../systems/DamageNumberSystem';
import { ParticleSystem } from '../systems/ParticleSystem';
import { ProjectileSystem } from '../systems/ProjectileSystem';
import { BuffSystem } from '../systems/BuffSystem';
import { AudioManager } from '../systems/AudioManager';
import { ItemSystem } from '../systems/ItemSystem';
import { Inventory } from '../systems/Inventory';
import { Trait } from '../systems/TraitSystem';
import { QuestSystem } from '../systems/QuestSystem';
import { DialogueSystem } from '../systems/DialogueSystem';
import { Minimap } from '../ui/Minimap';
import { TitleScreen } from '../ui/TitleScreen';
import { CreditsScreen } from '../ui/CreditsScreen';
import { HowToPlayScreen } from '../ui/HowToPlayScreen';
import { TutorialPopup } from '../ui/TutorialPopup';
import { SoulChamberUI } from '../ui/SoulChamberUI';
import { WeaponSelectUI } from '../ui/WeaponSelectUI';
import { CharacterCreateUI } from '../ui/CharacterCreateUI';
import { QuestUI } from '../ui/QuestUI';
import { UpgradeSystem } from '../systems/UpgradeSystem';
import { WeaponSystem } from '../systems/WeaponSystem';
import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';
import { Boss } from '../entities/Boss';
import { NPC } from '../entities/NPC';
import { SpriteManager } from '../systems/SpriteManager';
import { QUEST_DATABASE, getQuestsForFloor, getQuestsForNPC } from '../data/QuestData';
import { BossUI } from '../ui/BossUI';
import { getBossDataByFloor } from '../data/BossDatabase';

class Game {
    // 캔버스
    private canvas: HTMLCanvasElement;
    private renderer: Renderer;

    // 시스템
    private inputManager: InputManager;
    private mapManager: MapManager;
    private camera: Camera;
    private damageNumberSystem: DamageNumberSystem;
    private particleSystem: ParticleSystem;
    private projectileSystem: ProjectileSystem;
    private buffSystem: BuffSystem;
    private audioManager: AudioManager;
    private itemSystem: ItemSystem;
    private inventory: Inventory;
    private questSystem: QuestSystem;
    private dialogueSystem: DialogueSystem;
    private minimap: Minimap;
    private spriteManager: SpriteManager;
    private titleScreen: TitleScreen;
    private creditsScreen: CreditsScreen;
    private howToPlayScreen: HowToPlayScreen;
    private tutorialPopup: TutorialPopup;
    private soulChamberUI: SoulChamberUI;
    private weaponSelectUI: WeaponSelectUI;
    private characterCreateUI: CharacterCreateUI;
    private questUI: QuestUI;
    private upgradeSystem: UpgradeSystem;
    private bossUI: BossUI;

    // 게임 상태
    private gameMode: GameMode = GameMode.LOADING;
    private previousGameMode: GameMode = GameMode.PLAYING; // Soul Chamber 토글용
    private isRunning: boolean = false;
    private currentFloor: number = 1;
    private inventoryOpen: boolean = false;
    private soulChamberOpen: boolean = false;

    // 플레이어 정보
    private playerName: string = GAME_INFO.DEFAULT_PLAYER_NAME;

    // 메타 진행도
    private soulPoints: number = 0;
    private totalRuns: number = 0;
    private highestFloor: number = 0;

    // 엔티티
    private player: Player | null = null;
    private enemies: Enemy[] = [];
    private npcs: NPC[] = [];

    // 특성 선택
    private traitChoices: Trait[] = [];
    private selectedTraitIndex: number = 0;

    // 프레임 관리
    private targetFPS: number = GAMEPLAY.TARGET_FPS;
    private frameInterval: number = 1000 / this.targetFPS;
    private lastFrameTime: number = 0;
    private deltaTime: number = 0;

    // FPS 표시
    private fps: number = 0;
    private fpsCounter: number = 0;
    private fpsTime: number = 0;

    constructor() {
        console.log(`🎮 ${GAME_INFO.TITLE} (${GAME_INFO.TITLE_EN}) 시작!`);

        // 캔버스 가져오기
        this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
        if (!this.canvas) {
            throw new Error('Canvas element not found!');
        }

        // 시스템 초기화
        this.renderer = new Renderer(this.canvas);
        this.inputManager = new InputManager();
        this.mapManager = new MapManager();
        this.camera = new Camera();
        this.damageNumberSystem = new DamageNumberSystem();
        this.particleSystem = new ParticleSystem();
        this.projectileSystem = new ProjectileSystem();
        this.buffSystem = new BuffSystem();
        this.audioManager = new AudioManager();
        this.itemSystem = new ItemSystem();
        this.inventory = new Inventory();
        this.questSystem = new QuestSystem();
        this.dialogueSystem = new DialogueSystem();
        this.minimap = new Minimap();
        this.spriteManager = new SpriteManager();
        this.titleScreen = new TitleScreen();
        this.creditsScreen = new CreditsScreen();
        this.howToPlayScreen = new HowToPlayScreen();
        this.tutorialPopup = new TutorialPopup();
        this.soulChamberUI = new SoulChamberUI();
        this.weaponSelectUI = new WeaponSelectUI();
        this.characterCreateUI = new CharacterCreateUI();
        this.questUI = new QuestUI(this.questSystem);
        this.upgradeSystem = new UpgradeSystem();
        this.bossUI = new BossUI();

        // 로컬스토리지에서 플레이어 이름 로드
        this.loadPlayerName();

        // 게임 초기화
        this.init();
    }

    /**
     * 초기화
     */
    private async init(): Promise<void> {
        console.log('🔧 게임 초기화 중...');

        // 스프라이트 로드
        try {
            await this.spriteManager.loadAll();
            console.log('✅ 스프라이트 로드 완료!');
        } catch (error) {
            console.error('❌ 스프라이트 로드 실패:', error);
        }

        // 로딩 화면 숨기기
        this.hideLoadingScreen();

        // 타이틀 화면으로 전환
        this.changeGameMode(GameMode.TITLE);

        // 게임 시작
        this.start();
    }

    /**
     * 로딩 화면 숨기기
     */
    private hideLoadingScreen(): void {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
    }

    /**
     * 게임 시작
     */
    private start(): void {
        console.log('🚀 게임 시작!');
        this.isRunning = true;
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    /**
     * 메인 게임 루프
     */
    private gameLoop(currentTime: number): void {
        if (!this.isRunning) return;

        // FPS 계산
        this.fpsCounter++;
        if (currentTime - this.fpsTime >= 1000) {
            this.fps = this.fpsCounter;
            this.fpsCounter = 0;
            this.fpsTime = currentTime;
        }

        // 프레임 제한
        if (currentTime - this.lastFrameTime >= this.frameInterval) {
            this.deltaTime = (currentTime - this.lastFrameTime) / 1000;
            this.lastFrameTime = currentTime;

            // 업데이트 & 렌더링
            this.update();
            this.render();
        }

        requestAnimationFrame((time) => this.gameLoop(time));
    }

    /**
     * 업데이트
     */
    private update(): void {
        switch (this.gameMode) {
            case GameMode.TITLE:
                this.updateTitleScreen();
                break;

            case GameMode.CHARACTER_CREATE:
                this.updateCharacterCreate();
                break;

            case GameMode.CREDITS:
                this.updateCreditsScreen();
                break;

            case GameMode.HOW_TO_PLAY:
                this.updateHowToPlayScreen();
                break;

            case GameMode.TUTORIAL:
                this.updateTutorial();
                break;

            case GameMode.SOUL_CHAMBER:
                this.updateSoulChamber();
                break;

            case GameMode.PLAYING:
                this.updateGameplay();
                break;
        }

        // 프레임 끝에 just pressed 클리어
        this.inputManager.clearJustPressed();
    }

    /**
     * 타이틀 화면 업데이트
     */
    private updateTitleScreen(): void {
        this.titleScreen.update(this.deltaTime);

        // 방향키로 메뉴 이동 (한 번만 눌렸을 때)
        if (this.inputManager.isKeyJustPressed('ArrowUp')) {
            this.titleScreen.moveUp();
        }
        if (this.inputManager.isKeyJustPressed('ArrowDown')) {
            this.titleScreen.moveDown();
        }

        // Enter 또는 Space로 선택 (한 번만 눌렸을 때)
        if (this.inputManager.isKeyJustPressed('Enter') || this.inputManager.isKeyJustPressed('Space')) {
            const selected = this.titleScreen.getSelectedOption();

            switch (selected) {
                case 'start':
                    // 캐릭터 생성 화면으로 이동
                    this.characterCreateUI.reset();
                    this.gameMode = GameMode.CHARACTER_CREATE;
                    break;
                case 'how_to_play':
                    this.gameMode = GameMode.HOW_TO_PLAY;
                    break;
                case 'credits':
                    this.gameMode = GameMode.CREDITS;
                    break;
            }
        }
    }

    /**
     * 캐릭터 생성 화면 업데이트
     */
    private updateCharacterCreate(): void {
        this.characterCreateUI.update(this.deltaTime);

        // Backspace 처리
        if (this.inputManager.isKeyJustPressed('Backspace')) {
            this.characterCreateUI.handleBackspace();
        }

        // ESC로 기본 이름 사용 후 시작
        if (this.inputManager.isKeyJustPressed('Escape')) {
            this.characterCreateUI.handleUseDefault();
            this.playerName = this.characterCreateUI.getPlayerName();
            this.savePlayerName();
            console.log(`✅ 플레이어: ${this.playerName}`);
            this.characterCreateUI.deactivateInput();
            // 튜토리얼로 이동
            this.tutorialPopup.setPlayerName(this.playerName);
            this.gameMode = GameMode.TUTORIAL;
            this.tutorialPopup.start();
            return;
        }

        // Enter로 확인
        if (this.inputManager.isKeyJustPressed('Enter')) {
            if (this.characterCreateUI.handleConfirm()) {
                this.playerName = this.characterCreateUI.getPlayerName();
                this.savePlayerName();
                console.log(`✅ 플레이어: ${this.playerName}`);
                this.characterCreateUI.deactivateInput();
                // 튜토리얼로 이동
                this.tutorialPopup.setPlayerName(this.playerName);
                this.gameMode = GameMode.TUTORIAL;
                this.tutorialPopup.start();
            }
            return;
        }
    }

    /**
     * 크레딧 화면 업데이트
     */
    private updateCreditsScreen(): void {
        this.creditsScreen.update(this.deltaTime);

        // ESC로 타이틀로 돌아가기 (한 번만 눌렸을 때)
        if (this.inputManager.isKeyJustPressed('Escape')) {
            this.gameMode = GameMode.TITLE;
        }
    }

    /**
     * 조작법 화면 업데이트
     */
    private updateHowToPlayScreen(): void {
        this.howToPlayScreen.update(this.deltaTime);

        // ESC로 타이틀로 돌아가기 (한 번만 눌렸을 때)
        if (this.inputManager.isKeyJustPressed('Escape')) {
            this.gameMode = GameMode.TITLE;
        }
    }

    /**
     * 튜토리얼 업데이트
     */
    private updateTutorial(): void {
        this.tutorialPopup.update(this.deltaTime);

        // ESC로 스킵 (한 번만 눌렸을 때)
        if (this.inputManager.isKeyJustPressed('Escape')) {
            this.tutorialPopup.skip();
            this.startNewGame();
            return;
        }

        // 방향키로 이동 (한 번만 눌렸을 때)
        if (this.inputManager.isKeyJustPressed('ArrowLeft')) {
            this.tutorialPopup.previousStep();
        }
        if (this.inputManager.isKeyJustPressed('ArrowRight')) {
            if (this.tutorialPopup.getCurrentStep() === this.tutorialPopup.getTotalSteps() - 1) {
                // 마지막 단계에서 다음 누르면 게임 시작
                this.tutorialPopup.end();
                this.startNewGame();
            } else {
                this.tutorialPopup.nextStep();
            }
        }

        // Space 또는 Enter로 진행 (한 번만 눌렸을 때)
        if (this.inputManager.isKeyJustPressed('Space') || this.inputManager.isKeyJustPressed('Enter')) {
            if (this.tutorialPopup.getCurrentStep() === this.tutorialPopup.getTotalSteps() - 1) {
                this.tutorialPopup.end();
                // 튜토리얼 완료 후 바로 게임 시작
                this.soulPoints = 500; // 초기 소울 포인트 지급 (테스트용)
                this.startNewGame();
            } else {
                this.tutorialPopup.nextStep();
            }
        }
    }

    /**
     * 무기 선택 UI 업데이트
     */
    private updateWeaponSelect(): void {
        if (!this.player) return;

        const weaponSystem = this.player.getWeaponSystem();

        // ESC 또는 W로 닫기
        if (this.inputManager.isKeyJustPressed('Escape') || this.inputManager.isKeyJustPressed('KeyW')) {
            this.weaponSelectUI.close();
            return;
        }

        // 선택 이동
        if (this.inputManager.isKeyJustPressed('ArrowUp')) {
            this.weaponSelectUI.moveUp();
        }
        if (this.inputManager.isKeyJustPressed('ArrowDown')) {
            const weapons = weaponSystem.getAllWeapons();
            this.weaponSelectUI.moveDown(weapons.length - 1);
        }

        // 무기 해금 또는 장착
        if (this.inputManager.isKeyJustPressed('Enter') || this.inputManager.isKeyJustPressed('Space')) {
            const selectedIndex = this.weaponSelectUI.getSelectedIndex();
            const weapons = weaponSystem.getAllWeapons();

            if (selectedIndex < weapons.length) {
                const weapon = weapons[selectedIndex];

                if (!weapon.unlocked) {
                    // 해금 시도
                    const result = weaponSystem.unlockWeapon(weapon.id, this.soulPoints);
                    console.log(`🔓 무기 해금 시도:`, result);
                    if (result.success) {
                        this.soulPoints = result.newSoulPoints;
                    }
                } else {
                    // 장착 시도
                    this.player.changeWeapon(weapon.id);
                    this.weaponSelectUI.close();
                }
            }
        }
    }

    /**
     * Soul Chamber 업데이트
     */
    private updateSoulChamber(): void {
        this.soulChamberUI.update(this.deltaTime);
        this.soulChamberUI.setSoulPoints(this.soulPoints);
        this.soulChamberUI.setStats(this.totalRuns, this.highestFloor);

        const currentTab = this.soulChamberUI.getCurrentTab();

        // 마우스 처리
        const mousePos = this.inputManager.getMousePosition(this.canvas);

        // 마우스 커서 변경 (호버 효과)
        const isOverClickable = this.soulChamberUI.isMouseOverClickable(mousePos.x, mousePos.y, this.upgradeSystem);
        this.canvas.style.cursor = isOverClickable ? 'pointer' : 'default';

        // 마우스 클릭 처리
        if (this.inputManager.isKeyJustPressed('MouseLeft')) {
            const clickResult = this.soulChamberUI.handleClick(mousePos.x, mousePos.y, this.upgradeSystem);

            if (clickResult.action === 'upgrade' && clickResult.upgradeId) {
                const result = this.upgradeSystem.purchaseUpgrade(clickResult.upgradeId, this.soulPoints);
                console.log('🛒 업그레이드 구매 시도:', clickResult.upgradeId, result);
                if (result.success) {
                    this.soulPoints = result.newSoulPoints;
                    const upgrade = this.upgradeSystem.getUpgrade(clickResult.upgradeId);
                    console.log('✅ 구매 완료! 현재 레벨:', upgrade?.currentLevel);
                } else {
                    console.log('❌ 구매 실패:', result.message);
                }
            } else if (clickResult.action === 'start') {
                this.startNewGame();
                return;
            }
        }

        // 탭 이동 (Q/E 키)
        if (this.inputManager.isKeyJustPressed('KeyQ')) {
            this.soulChamberUI.moveTabLeft();
        }
        if (this.inputManager.isKeyJustPressed('KeyE')) {
            this.soulChamberUI.moveTabRight();
        }

        if (currentTab === 'upgrades') {
            // 카테고리 변경 (좌우 화살표)
            if (this.inputManager.isKeyJustPressed('ArrowLeft')) {
                const categories: ('offense' | 'defense' | 'utility')[] = ['offense', 'defense', 'utility'];
                const currentIndex = categories.indexOf(this.soulChamberUI.getCurrentCategory());
                const newIndex = (currentIndex - 1 + categories.length) % categories.length;
                this.soulChamberUI.changeCategory(categories[newIndex]);
            }
            if (this.inputManager.isKeyJustPressed('ArrowRight')) {
                const categories: ('offense' | 'defense' | 'utility')[] = ['offense', 'defense', 'utility'];
                const currentIndex = categories.indexOf(this.soulChamberUI.getCurrentCategory());
                const newIndex = (currentIndex + 1) % categories.length;
                this.soulChamberUI.changeCategory(categories[newIndex]);
            }

            // 업그레이드 선택 이동
            if (this.inputManager.isKeyJustPressed('ArrowUp')) {
                this.soulChamberUI.moveUpgradeUp();
            }
            if (this.inputManager.isKeyJustPressed('ArrowDown')) {
                const category = this.soulChamberUI.getCurrentCategory();
                const upgrades = this.upgradeSystem.getUpgradesByCategory(category);
                this.soulChamberUI.moveUpgradeDown(upgrades.length - 1);
            }

            // 업그레이드 구매
            if (this.inputManager.isKeyJustPressed('Enter') || this.inputManager.isKeyJustPressed('Space')) {
                const category = this.soulChamberUI.getCurrentCategory();
                const upgrades = this.upgradeSystem.getUpgradesByCategory(category);
                const selectedIndex = this.soulChamberUI.getSelectedUpgradeIndex();

                if (selectedIndex < upgrades.length) {
                    const upgrade = upgrades[selectedIndex];
                    const result = this.upgradeSystem.purchaseUpgrade(upgrade.id, this.soulPoints);
                    console.log('🛒 업그레이드 구매 시도 (키보드):', upgrade.id, result);

                    if (result.success) {
                        this.soulPoints = result.newSoulPoints;
                        console.log('✅ 구매 완료! 현재 레벨:', upgrade.currentLevel);
                    } else {
                        console.log(result.message);
                    }
                }
            }
        }

        // 도전 시작 탭에서 Enter
        if (currentTab === 'start' && this.inputManager.isKeyJustPressed('Enter')) {
            this.startNewGame();
        }

        // ESC로 돌아가기
        if (this.inputManager.isKeyJustPressed('Escape')) {
            if (this.soulChamberOpen) {
                // 게임 중에 연 경우 게임으로 복귀 (업그레이드 재적용)
                if (this.player) {
                    const baseStats: PlayerStats = {
                        health: GAMEPLAY.PLAYER_BASE.HEALTH,
                        maxHealth: GAMEPLAY.PLAYER_BASE.HEALTH,
                        mana: GAMEPLAY.PLAYER_BASE.MANA,
                        maxMana: GAMEPLAY.PLAYER_BASE.MANA,
                        stamina: GAMEPLAY.PLAYER_BASE.STAMINA,
                        maxStamina: GAMEPLAY.PLAYER_BASE.STAMINA,
                        attack: GAMEPLAY.PLAYER_BASE.ATTACK,
                        defense: GAMEPLAY.PLAYER_BASE.DEFENSE,
                        speed: GAMEPLAY.PLAYER_BASE.SPEED,
                        criticalChance: GAMEPLAY.PLAYER_BASE.CRITICAL_CHANCE,
                        criticalDamage: GAMEPLAY.PLAYER_BASE.CRITICAL_DAMAGE,
                        luck: GAMEPLAY.PLAYER_BASE.LUCK
                    };
                    const upgradedStats = this.upgradeSystem.applyUpgradesToStats(baseStats);
                    console.log('🔄 영혼의 성소 닫기 - 업그레이드 재적용');
                    console.log('  기본:', baseStats);
                    console.log('  업그레이드 후:', upgradedStats);
                    this.player.applyUpgradedStats(upgradedStats);
                    console.log('  플레이어 최종:', this.player.stats);
                }
                this.gameMode = this.previousGameMode;
                this.soulChamberOpen = false;
            } else {
                // 사망 후 자동으로 온 경우 타이틀로
                this.gameMode = GameMode.TITLE;
            }
        }
    }

    /**
     * 게임플레이 업데이트
     */
    private updateGameplay(): void {
        if (!this.player) return;

        // 대화 시스템이 활성화되어 있으면 대화 입력만 처리
        if (this.dialogueSystem.isDialogueActive()) {
            this.dialogueSystem.update(this.deltaTime);

            // Space로 텍스트 스킵 또는 진행
            if (this.inputManager.isKeyJustPressed('Space')) {
                if (this.dialogueSystem.isTextComplete()) {
                    if (!this.dialogueSystem.hasChoices()) {
                        this.dialogueSystem.confirmChoice();
                    }
                } else {
                    this.dialogueSystem.skipTyping();
                }
            }

            // 선택지가 있을 때 화살표 키로 선택
            if (this.dialogueSystem.hasChoices() && this.dialogueSystem.isTextComplete()) {
                if (this.inputManager.isKeyJustPressed('ArrowUp')) {
                    this.dialogueSystem.moveChoiceUp();
                }
                if (this.inputManager.isKeyJustPressed('ArrowDown')) {
                    this.dialogueSystem.moveChoiceDown();
                }
                if (this.inputManager.isKeyJustPressed('Enter')) {
                    this.dialogueSystem.confirmChoice();
                }
            }

            this.inputManager.clearJustPressed();
            return;
        }

        // 무기 선택 UI 처리 (W 키)
        if (this.inputManager.isKeyJustPressed('KeyW')) {
            this.weaponSelectUI.toggle();
            return;
        }

        // 무기 선택 UI가 열려있으면 해당 입력만 처리
        if (this.weaponSelectUI.isOpened()) {
            this.updateWeaponSelect();
            return;
        }

        // 퀘스트 UI 토글 (Q 키)
        if (this.inputManager.isKeyJustPressed('KeyQ')) {
            this.questUI.toggle();
        }

        // 퀘스트 UI가 열려있으면 일부 입력 차단
        if (this.questUI.isQuestUIOpen()) {
            // ESC로 닫기
            if (this.inputManager.isKeyJustPressed('Escape')) {
                this.questUI.close();
                return;
            }
            // 다른 입력은 차단
            this.inputManager.clearJustPressed();
            return;
        }

        // ESC로 Soul Chamber 토글
        if (this.inputManager.isKeyJustPressed('Escape')) {
            this.previousGameMode = this.gameMode;
            this.gameMode = GameMode.SOUL_CHAMBER;
            this.soulChamberOpen = true;
            return;
        }

        // 인벤토리 토글 (I 키)
        if (this.inputManager.isInventoryToggled()) {
            this.inventoryOpen = !this.inventoryOpen;
        }

        // 인벤토리가 열려있으면 게임 일시정지
        if (this.inventoryOpen) {
            this.inputManager.clearJustPressed();
            return;
        }

        // 플레이어 이동 (충돌 체크 포함)
        const movement = this.inputManager.getMovementInput();
        this.player.move(movement, this.deltaTime, (x, y, w, h) => {
            return this.mapManager.isColliding(x, y, w, h);
        });

        // 플레이어 공격 (스페이스바)
        if (this.inputManager.isAttackPressed()) {
            if (this.player.attack()) {
                this.handlePlayerAttack();
            }
        }

        // 플레이어 회피
        if (this.inputManager.isDodgePressed()) {
            this.player.dodge(movement);
        }

        // 플레이어 업데이트
        this.player.update(this.deltaTime);

        // 카메라 업데이트 (플레이어 따라가기)
        this.camera.setTarget(this.player.getPosition());
        this.camera.update();

        // 적 업데이트
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            enemy.update(this.deltaTime, this.player);

            // 죽은 적 제거 및 보상
            if (enemy.isDead()) {
                this.handleEnemyKilled(enemy);
                this.enemies.splice(i, 1);
            }
        }

        // NPC 업데이트
        for (const npc of this.npcs) {
            npc.update(this.deltaTime);
        }

        // NPC 상호작용 체크 (E 키)
        if (this.inputManager.isKeyJustPressed('KeyE')) {
            this.checkNPCInteraction();
        }

        // 데미지 숫자 업데이트
        this.damageNumberSystem.update(this.deltaTime);

        // 파티클 시스템 업데이트
        this.particleSystem.update(this.deltaTime);

        // 투사체 시스템 업데이트
        this.projectileSystem.update(this.deltaTime, this.player, this.enemies);

        // 버프 시스템 업데이트
        this.buffSystem.update(this.deltaTime);

        // 아이템 시스템 업데이트
        this.itemSystem.update(this.deltaTime);

        // 아이템 획득 체크
        const pickedItem = this.itemSystem.checkPickup(this.player.x, this.player.y);
        if (pickedItem) {
            const added = this.inventory.addItem(pickedItem.item);
            if (added) {
                console.log(`📦 ${pickedItem.item.name} 획득!`);
                // 아이템 획득 효과음
                this.audioManager.playSFX('item_pickup');
                // 아이템 획득 파티클
                this.particleSystem.emit('item_collect', pickedItem.x, pickedItem.y);
                // 퀘스트 진행도 업데이트
                this.questSystem.onItemCollected(pickedItem.item.id, 1);
            } else {
                console.log('❌ 인벤토리가 가득 찼습니다');
            }
        }

        // 플레이어 사망 체크
        if (this.player.stats.health <= 0) {
            this.handlePlayerDeath();
        }

        // 층 클리어 체크
        if (this.enemies.length === 0) {
            this.handleFloorClear();
        }
    }

    /**
     * 플레이어 공격 처리
     */
    private handlePlayerAttack(): void {
        if (!this.player) return;

        const playerPos = this.player.getPosition();
        const attackRange = this.player.getAttackRange();

        // 공격 슬래시 파티클
        this.particleSystem.emit('attack_slash', playerPos.x, playerPos.y, { count: 10 });

        // 범위 내 적 탐지
        for (const enemy of this.enemies) {
            const dx = enemy.x - playerPos.x;
            const dy = enemy.y - playerPos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= attackRange) {
                // 무기 시스템으로 데미지 계산
                const baseDamage = this.player.getAttackDamage(false);
                const isCritical = this.player.rollCritical(false);
                const finalDamage = isCritical ? baseDamage * this.player.stats.criticalDamage : baseDamage;

                enemy.takeDamage(finalDamage);

                // 데미지 숫자 표시 (화면 좌표로 변환)
                const enemyScreen = this.camera.worldToScreen(enemy.x, enemy.y);
                this.damageNumberSystem.spawn(
                    enemyScreen.x,
                    enemyScreen.y - 20,
                    finalDamage,
                    isCritical
                );

                // 공격 히트 파티클
                this.particleSystem.emit('attack_hit', enemy.x, enemy.y, {
                    count: isCritical ? 20 : 12,
                    color: isCritical ? '#FFFF00' : '#FFFFFF'
                });

                console.log(`💥 데미지: ${finalDamage}${isCritical ? ' (크리티컬!)' : ''}`);

                // 카메라 흔들림 (크리티컬이면 강하게)
                if (isCritical) {
                    this.camera.shake(15, 200);
                } else {
                    this.camera.shake(5, 100);
                }
            }
        }
    }

    /**
     * 적 처치 보상
     */
    private handleEnemyKilled(enemy: Enemy): void {
        if (!this.player) return;

        // 보스 처치 확인
        const isBoss = enemy instanceof Boss;
        if (isBoss) {
            console.log(`👑 보스 처치! ${(enemy as Boss).getBossData().name}`);
            this.bossUI.setBoss(null); // 보스 UI 비활성화
            this.camera.shake(30, 500); // 강한 화면 흔들림
            // 보스 처치 폭발 파티클 (대규모)
            this.particleSystem.emit('explosion', enemy.x, enemy.y, { count: 50 });
            // BGM을 일반 floor BGM으로 변경
            this.audioManager.fadeBGMIn('floor', 2000);
        } else {
            // 일반 적 처치 폭발 파티클
            this.particleSystem.emit('explosion', enemy.x, enemy.y, { count: 25 });
        }

        // 경험치 획득
        const expGain = this.calculateExperienceReward(enemy.type);
        const leveledUp = this.player.gainExperience(expGain);

        // 경험치 획득 표시
        const enemyScreen = this.camera.worldToScreen(enemy.x, enemy.y);
        this.damageNumberSystem.spawn(
            enemyScreen.x,
            enemyScreen.y - 40,
            expGain,
            false
        );

        // 아이템 드롭
        this.itemSystem.dropRandomItem(enemy.x, enemy.y, enemy.type, this.currentFloor);
        // 아이템 드롭 반짝임 파티클
        this.particleSystem.emit('sparkle', enemy.x, enemy.y, { count: 8 });

        // 퀘스트 진행도 업데이트
        this.questSystem.onEnemyKilled(enemy.type);

        if (leveledUp) {
            console.log(`✨ 레벨업! 현재 레벨: ${this.player.level}`);
            // 레벨업 이펙트 (화면 번쩍임)
            this.camera.shake(20, 300);
            // 레벨업 효과음
            this.audioManager.playSFX('level_up');
            // 레벨업 파티클
            this.particleSystem.emit('level_up', this.player.x, this.player.y);
        }
    }

    /**
     * 적 타입별 경험치 계산
     */
    private calculateExperienceReward(enemyType: string): number {
        const baseExp: Record<string, number> = {
            goblin: 15,
            orc: 25,
            skeleton: 20,
            troll: 40,
            wraith: 35
        };

        const exp = baseExp[enemyType] || 10;
        // 층수에 따라 보너스 (+10% per floor)
        return Math.floor(exp * (1 + this.currentFloor * 0.1));
    }

    /**
     * NPC 상호작용 체크
     */
    private checkNPCInteraction(): void {
        if (!this.player) return;

        // 가까운 NPC 찾기
        for (const npc of this.npcs) {
            if (npc.isPlayerInRange(this.player.x, this.player.y)) {
                this.startNPCDialogue(npc);
                return;
            }
        }
    }

    /**
     * NPC 대화 시작
     */
    private startNPCDialogue(npc: NPC): void {
        console.log(`💬 ${npc.data.name}와 대화 시작`);

        // NPC가 제공하는 퀘스트 확인
        const npcQuests = getQuestsForNPC(npc.type);
        let dialogue = npc.data.dialogues.default;
        let questChoices: string[] = [];

        // 퀘스트 상태에 따라 대화 변경
        for (const quest of npcQuests) {
            const canStart = this.questSystem.canStartQuest(quest.id);
            const isActive = this.questSystem.getActiveQuests().some(q => q.id === quest.id);
            const isReady = this.questSystem.isQuestReadyToComplete(quest.id);

            if (canStart && !isActive) {
                // 새 퀘스트 제공 가능
                dialogue = npc.data.dialogues.questAvailable || dialogue;
                questChoices.push(`[퀘스트] ${quest.title}`);
            } else if (isActive && isReady) {
                // 퀘스트 완료 가능
                dialogue = npc.data.dialogues.questComplete || dialogue;
                questChoices.push(`[완료] ${quest.title}`);
            } else if (isActive) {
                // 퀘스트 진행 중
                dialogue = npc.data.dialogues.questInProgress || dialogue;
            }
        }

        // 대화 시스템 시작
        const choices: string[] = [];

        // 퀘스트 선택지 추가
        choices.push(...questChoices);

        // 서비스 선택지 추가
        if (npc.data.services?.includes('shop')) {
            choices.push('🛒 상점');
        }
        if (npc.data.services?.includes('upgrade')) {
            choices.push('⚡ 업그레이드');
        }

        choices.push('👋 작별 인사');

        // DialogueChoice 배열 생성
        const dialogueChoices: { text: string; action: () => void }[] = choices.map((text, index) => ({
            text,
            action: () => this.handleNPCChoice(npc, index, questChoices.length)
        }));

        this.dialogueSystem.startDialogue(npc, dialogue, dialogueChoices);
    }

    /**
     * NPC 대화 선택 처리
     */
    private handleNPCChoice(npc: NPC, choiceIndex: number, questChoiceCount: number): void {
        if (choiceIndex < questChoiceCount) {
            // 퀘스트 선택
            const npcQuests = getQuestsForNPC(npc.type);
            let questIndex = 0;

            for (const quest of npcQuests) {
                const canStart = this.questSystem.canStartQuest(quest.id);
                const isActive = this.questSystem.getActiveQuests().some(q => q.id === quest.id);
                const isReady = this.questSystem.isQuestReadyToComplete(quest.id);

                if ((canStart && !isActive) || (isActive && isReady)) {
                    if (questIndex === choiceIndex) {
                        if (canStart && !isActive) {
                            // 퀘스트 시작
                            const started = this.questSystem.startQuest(quest);
                            if (started) {
                                console.log(`📜 퀘스트 시작: ${quest.title}`);
                                this.dialogueSystem.startDialogue(
                                    npc,
                                    quest.storyText || `${quest.title} 퀘스트를 시작합니다.`,
                                    [{
                                        text: '확인',
                                        action: () => {
                                            npc.endInteraction();
                                        }
                                    }]
                                );
                            }
                        } else if (isReady) {
                            // 퀘스트 완료
                            const rewards = this.questSystem.completeQuest(quest.id, this.player!, this.inventory);
                            if (rewards) {
                                console.log(`✅ 퀘스트 완료: ${quest.title}`);
                                // 퀘스트 완료 효과
                                this.audioManager.playSFX('quest_complete');
                                this.particleSystem.emit('level_up', this.player.x, this.player.y, { count: 40 });
                                this.camera.shake(15, 300);

                                let rewardText = quest.completionText || '퀘스트를 완료했습니다!\n\n보상:\n';
                                if (rewards.experience) rewardText += `경험치 +${rewards.experience}\n`;
                                if (rewards.soulPoints) rewardText += `소울 포인트 +${rewards.soulPoints}\n`;
                                if (rewards.items) rewardText += `아이템: ${rewards.items.join(', ')}\n`;

                                this.dialogueSystem.startDialogue(
                                    npc,
                                    rewardText,
                                    [{
                                        text: '감사합니다',
                                        action: () => {
                                            npc.endInteraction();
                                        }
                                    }]
                                );
                            }
                        }
                        return;
                    }
                    questIndex++;
                }
            }
        } else {
            // 서비스 또는 작별 인사
            const serviceIndex = choiceIndex - questChoiceCount;
            const services = [];
            if (npc.data.services?.includes('shop')) services.push('shop');
            if (npc.data.services?.includes('upgrade')) services.push('upgrade');

            if (serviceIndex < services.length) {
                const service = services[serviceIndex];
                if (service === 'shop') {
                    console.log('🛒 상점 기능은 아직 구현되지 않았습니다');
                } else if (service === 'upgrade') {
                    console.log('⚡ 업그레이드 기능은 아직 구현되지 않았습니다');
                }
            } else {
                // 작별 인사
                this.dialogueSystem.startDialogue(
                    npc,
                    npc.data.dialogues.farewell,
                    []
                );
            }
        }

        npc.endInteraction();
    }

    /**
     * 플레이어 사망 처리
     */
    private handlePlayerDeath(): void {
        console.log('💀 플레이어 사망');

        // 사망 효과
        this.audioManager.playSFX('player_death');
        this.particleSystem.emit('explosion', this.player.x, this.player.y, { count: 30, color: '#8B0000' });
        this.camera.shake(25, 400);

        // 소울 포인트 획득 (진행한 층수에 비례)
        const earnedSouls = this.currentFloor * 5;
        this.soulPoints += earnedSouls;
        console.log(`💜 소울 포인트 ${earnedSouls} 획득! (총: ${this.soulPoints})`);

        // 통계 업데이트
        this.totalRuns++;
        if (this.currentFloor > this.highestFloor) {
            this.highestFloor = this.currentFloor;
        }

        // Soul Chamber로 복귀 (사망으로 인한 자동 복귀)
        this.soulChamberOpen = false;
        this.changeGameMode(GameMode.SOUL_CHAMBER);
    }

    /**
     * 층 클리어 처리
     */
    private handleFloorClear(): void {
        console.log(`✅ ${this.currentFloor}층 클리어!`);

        // 다음 층으로
        this.currentFloor++;

        if (this.currentFloor > GAMEPLAY.MAX_FLOORS) {
            // 게임 클리어!
            this.changeGameMode(GameMode.VICTORY);
        } else {
            // 다음 층 생성
            this.generateFloor(this.currentFloor);
        }
    }

    /**
     * 렌더링
     */
    private render(): void {
        // 화면 클리어
        this.renderer.clear();

        switch (this.gameMode) {
            case GameMode.TITLE:
                this.renderTitleScreen();
                break;

            case GameMode.CHARACTER_CREATE:
                this.renderCharacterCreate();
                break;

            case GameMode.CREDITS:
                this.renderCreditsScreen();
                break;

            case GameMode.HOW_TO_PLAY:
                this.renderHowToPlayScreen();
                break;

            case GameMode.TUTORIAL:
                this.renderTutorial();
                break;

            case GameMode.SOUL_CHAMBER:
                this.renderSoulChamber();
                break;

            case GameMode.PLAYING:
                this.renderGameplay();
                break;

            case GameMode.GAME_OVER:
                this.renderGameOver();
                break;

            case GameMode.VICTORY:
                this.renderVictory();
                break;
        }
    }

    /**
     * 타이틀 화면 렌더링
     */
    private renderTitleScreen(): void {
        this.titleScreen.render(this.renderer);
    }

    /**
     * 캐릭터 생성 화면 렌더링
     */
    private renderCharacterCreate(): void {
        this.characterCreateUI.render(this.renderer);
    }

    /**
     * 크레딧 화면 렌더링
     */
    private renderCreditsScreen(): void {
        this.creditsScreen.render(this.renderer);
    }

    /**
     * 조작법 화면 렌더링
     */
    private renderHowToPlayScreen(): void {
        this.howToPlayScreen.render(this.renderer);
    }

    /**
     * 튜토리얼 렌더링
     */
    private renderTutorial(): void {
        // 기본 배경 (검정색)
        const ctx = this.renderer.getContext();
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, SCREEN.WIDTH, SCREEN.HEIGHT);

        // 튜토리얼 팝업
        this.tutorialPopup.render(this.renderer);
    }

    /**
     * Soul Chamber 렌더링
     */
    private renderSoulChamber(): void {
        const weaponSystem = this.player?.getWeaponSystem();
        this.soulChamberUI.render(this.renderer, this.upgradeSystem, weaponSystem);
    }

    /**
     * 게임플레이 렌더링
     */
    private renderGameplay(): void {
        if (!this.player) return;

        const cameraPos = this.camera.getPosition();

        // 맵 렌더링 (카메라 적용)
        this.mapManager.render(this.renderer, cameraPos.x, cameraPos.y);

        // 플레이어 렌더링 (화면 좌표로 변환)
        const playerScreen = this.camera.worldToScreen(this.player.x, this.player.y);
        const ctx = this.renderer.getContext();

        // 플레이어 스프라이트로 렌더링
        const animController = this.player.getAnimationController();
        this.spriteManager.drawAnimatedSprite(
            ctx,
            'player',
            playerScreen.x - 16, // 중앙 정렬
            playerScreen.y - 16,
            animController.getCurrentDirection(),
            animController.getCurrentFrame()
        );

        // 적 렌더링 (화면 좌표로 변환)
        for (const enemy of this.enemies) {
            const enemyScreen = this.camera.worldToScreen(enemy.x, enemy.y);

            // 적 스프라이트로 렌더링
            const enemyAnimController = enemy.getAnimationController();
            const spriteKey = enemy.isBoss ? `${enemy.type}_chieftain` : enemy.type;

            this.spriteManager.drawAnimatedSprite(
                ctx,
                spriteKey,
                enemyScreen.x - 16,
                enemyScreen.y - 16,
                enemyAnimController.getCurrentDirection(),
                enemyAnimController.getCurrentFrame()
            );

            // 체력바 (항상 표시)
            const barWidth = 32;
            const barHeight = 4;
            const barX = enemyScreen.x - 16;
            const barY = enemyScreen.y - 20;

            // 배경
            ctx.fillStyle = 'rgba(50, 50, 50, 0.8)';
            ctx.fillRect(barX, barY, barWidth, barHeight);

            // 체력
            const healthPercent = enemy.health / enemy.maxHealth;
            const healthColor = healthPercent > 0.5 ? '#4CAF50' : healthPercent > 0.25 ? '#FF9800' : '#F44336';
            ctx.fillStyle = healthColor;
            ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);

            // 테두리
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.lineWidth = 1;
            ctx.strokeRect(barX, barY, barWidth, barHeight);

            // 몬스터 이름 표시 (체력바 위)
            const enemyData = enemy.getEnemyData();
            const enemyName = enemyData.name || enemy.type;
            const displayName = enemy.isBoss ? `👑 ${enemyName} BOSS` : enemyName;
            const nameY = barY - 10;

            // 이름 폰트 설정
            ctx.font = enemy.isBoss ? 'bold 11px Arial' : 'bold 10px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // 이름 배경
            const nameWidth = ctx.measureText(displayName).width;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
            ctx.fillRect(enemyScreen.x - nameWidth / 2 - 3, nameY - 7, nameWidth + 6, 14);

            // 이름 테두리
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.lineWidth = 1;
            ctx.strokeRect(enemyScreen.x - nameWidth / 2 - 3, nameY - 7, nameWidth + 6, 14);

            // 이름 텍스트
            ctx.shadowColor = 'rgba(0, 0, 0, 1)';
            ctx.shadowBlur = 3;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;

            if (enemy.isBoss) {
                const pulse = Math.sin(Date.now() / 200) * 0.3 + 0.7;
                ctx.fillStyle = `rgba(255, ${Math.floor(pulse * 150)}, 0, 1)`;
            } else {
                ctx.fillStyle = '#FFFFFF';
            }

            ctx.fillText(displayName, enemyScreen.x, nameY);

            // 그림자 리셋
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
        }

        // 드롭된 아이템 렌더링
        for (const droppedItem of this.itemSystem.getDroppedItems()) {
            const itemScreen = this.camera.worldToScreen(droppedItem.x, droppedItem.y);
            const color = this.itemSystem.getRarityColor(droppedItem.item.rarity);

            // 아이템 상자 (반짝임 효과)
            const pulse = Math.sin(Date.now() / 200) * 0.2 + 0.8;
            this.renderer.drawRect(
                itemScreen.x - 8,
                itemScreen.y - 8,
                16,
                16,
                color
            );

            // 테두리
            this.renderer.drawRectOutline(
                itemScreen.x - 8,
                itemScreen.y - 8,
                16,
                16,
                '#000000',
                2
            );

            // 소멸 시간 임박 시 깜빡임
            if (droppedItem.lifetime > 0.8) {
                const blink = Math.floor(Date.now() / 200) % 2 === 0;
                if (blink) {
                    this.renderer.drawText(
                        '!',
                        itemScreen.x,
                        itemScreen.y - 20,
                        'bold 16px Arial',
                        '#FF0000',
                        'center'
                    );
                }
            }
        }

        // NPC 렌더링 (화면 좌표로 변환)
        for (const npc of this.npcs) {
            const npcScreen = this.camera.worldToScreen(npc.x, npc.y);

            // NPC 스프라이트로 렌더링
            const npcAnimController = npc.getAnimationController();
            this.spriteManager.drawAnimatedSprite(
                ctx,
                npc.data.spriteKey,
                npcScreen.x - 16,
                npcScreen.y - 16,
                npcAnimController.getCurrentDirection(),
                npcAnimController.getCurrentFrame()
            );

            // NPC 이름 표시 (NPC: 현자 형태)
            const npcLabel = `NPC: ${npc.data.name}`;
            const nameY = npcScreen.y - 30;

            // 이름 폰트 설정
            ctx.font = 'bold 11px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // 이름 배경
            const nameWidth = ctx.measureText(npcLabel).width;
            ctx.fillStyle = 'rgba(50, 200, 100, 0.95)'; // 초록색으로 변경
            ctx.fillRect(npcScreen.x - nameWidth / 2 - 4, nameY - 8, nameWidth + 8, 16);

            // 이름 테두리
            ctx.strokeStyle = 'rgba(150, 255, 150, 0.9)';
            ctx.lineWidth = 2;
            ctx.strokeRect(npcScreen.x - nameWidth / 2 - 4, nameY - 8, nameWidth + 8, 16);

            // 이름 텍스트
            ctx.fillStyle = '#FFFFFF';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
            ctx.shadowBlur = 3;
            ctx.fillText(npcLabel, npcScreen.x, nameY);

            // 그림자 리셋
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;

            // 상호작용 가능 힌트 표시 (플레이어가 가까이 있을 때)
            if (npc.isPlayerInRange(this.player.x, this.player.y)) {
                const hintY = npcScreen.y + 25;
                ctx.font = 'bold 10px Arial';
                ctx.fillStyle = '#FFD700';
                ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
                ctx.shadowBlur = 2;
                ctx.fillText('[E] 대화하기', npcScreen.x, hintY);
                ctx.shadowColor = 'transparent';
                ctx.shadowBlur = 0;
            }
        }

        // 투사체 렌더링
        this.projectileSystem.render(this.renderer, this.camera);

        // 파티클 렌더링
        this.particleSystem.render(this.renderer, this.camera);

        // 데미지 숫자 렌더링
        this.damageNumberSystem.render(this.renderer);

        // HUD 렌더링
        this.renderHUD();

        // 미니맵 렌더링
        this.minimap.render(
            this.renderer,
            this.mapManager.getCurrentMap(),
            this.player.getPosition(),
            this.enemies
        );

        // 인벤토리 렌더링 (I 키로 토글)
        if (this.inventory) {
            this.inventory.render(this.renderer, this.inventoryOpen);
        }

        // 무기 선택 UI 렌더링 (W 키로 토글)
        if (this.player && this.weaponSelectUI.isOpened()) {
            const weaponSystem = this.player.getWeaponSystem();
            this.weaponSelectUI.render(this.renderer, weaponSystem, this.soulPoints);
        }

        // 퀘스트 UI 렌더링 (Q 키로 토글, 간단한 뷰는 항상 표시)
        this.questUI.render(this.renderer);

        // 보스 UI 렌더링 (보스 전투 시)
        if (this.bossUI.isBossActive()) {
            this.bossUI.render(this.renderer);
        }

        // 대화 시스템 렌더링 (활성화 시)
        this.dialogueSystem.render(this.renderer);
    }

    /**
     * HUD 렌더링
     */
    private renderHUD(): void {
        if (!this.player) return;

        const stats = this.player.stats;
        const levelInfo = this.player.getLevelInfo();
        const ctx = this.renderer.getContext();

        // HUD 배경 (반투명 패널)
        ctx.fillStyle = 'rgba(44, 62, 80, 0.85)';
        ctx.fillRect(10, 10, 280, 150);
        ctx.strokeStyle = '#34495E';
        ctx.lineWidth = 2;
        ctx.strokeRect(10, 10, 280, 150);

        // 레벨 표시 (큰 원형 배지)
        ctx.fillStyle = '#2C3E50';
        ctx.beginPath();
        ctx.arc(40, 40, 25, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        ctx.stroke();

        this.renderer.drawText(
            `${levelInfo.level}`,
            40,
            48,
            'bold 24px Arial',
            '#FFD700',
            'center'
        );

        // 플레이어 이름
        this.renderer.drawText(
            this.playerName,
            75,
            35,
            'bold 16px Arial',
            '#ECF0F1',
            'left'
        );

        this.renderer.drawText(
            `Lv.${this.player.level}`,
            75,
            50,
            '12px Arial',
            '#BDC3C7',
            'left'
        );

        // 체력바 (그라데이션)
        this.renderer.drawHealthBar(20, 70, 260, 18, stats.health, stats.maxHealth);
        this.renderer.drawText(
            `HP ${Math.floor(stats.health)} / ${stats.maxHealth}`,
            25,
            82,
            'bold 11px Arial',
            '#FFFFFF',
            'left'
        );

        // 마나바
        this.renderer.drawManaBar(20, 95, 260, 14, stats.mana, stats.maxMana);
        this.renderer.drawText(
            `MP ${Math.floor(stats.mana)}`,
            25,
            105,
            '10px Arial',
            '#FFFFFF',
            'left'
        );

        // 스태미나바
        this.renderer.drawStaminaBar(20, 115, 260, 14, stats.stamina, stats.maxStamina);
        this.renderer.drawText(
            `SP ${Math.floor(stats.stamina)}`,
            25,
            125,
            '10px Arial',
            '#FFFFFF',
            'left'
        );

        // 경험치바
        this.renderer.drawExperienceBar(20, 135, 260, 12, levelInfo.experience, levelInfo.experienceToNextLevel);
        this.renderer.drawText(
            `EXP ${levelInfo.experience} / ${levelInfo.experienceToNextLevel}`,
            25,
            144,
            '9px Arial',
            '#FFFFFF',
            'left'
        );

        // 층수 및 적 수 패널 (우측 상단)
        ctx.fillStyle = 'rgba(44, 62, 80, 0.85)';
        ctx.fillRect(SCREEN.WIDTH - 170, 10, 160, 80);
        ctx.strokeStyle = '#34495E';
        ctx.lineWidth = 2;
        ctx.strokeRect(SCREEN.WIDTH - 170, 10, 160, 80);

        // 층수 표시
        this.renderer.drawText(
            `🏰 층수`,
            SCREEN.WIDTH - 150,
            30,
            'bold 14px Arial',
            '#ECF0F1',
            'left'
        );

        this.renderer.drawText(
            `${this.currentFloor} / ${GAMEPLAY.MAX_FLOORS}`,
            SCREEN.WIDTH - 150,
            50,
            'bold 24px Arial',
            '#3498DB',
            'left'
        );

        // 적 수
        this.renderer.drawText(
            `👹 적`,
            SCREEN.WIDTH - 150,
            70,
            '12px Arial',
            '#ECF0F1',
            'left'
        );

        this.renderer.drawText(
            `${this.enemies.length}`,
            SCREEN.WIDTH - 40,
            70,
            'bold 16px Arial',
            this.enemies.length > 0 ? '#E74C3C' : '#27AE60',
            'center'
        );

        // 콤보 카운트
        const comboCount = this.player.getCombatSystem().getComboCount();
        if (comboCount > 0) {
            this.renderer.drawText(
                `${comboCount} COMBO!`,
                SCREEN.CENTER_X,
                100,
                'bold 32px Arial',
                '#ffff00',
                'center'
            );
        }

        // FPS 표시
        this.renderer.drawText(
            `FPS: ${this.fps}`,
            20,
            SCREEN.HEIGHT - 20,
            '14px Arial',
            '#888888'
        );
    }

    /**
     * 게임 오버 렌더링
     */
    private renderGameOver(): void {
        this.renderer.drawText(
            'GAME OVER',
            SCREEN.CENTER_X,
            200,
            'bold 64px Arial',
            '#ff4444',
            'center'
        );

        this.renderer.drawText(
            `도달 층: ${this.currentFloor}`,
            SCREEN.CENTER_X,
            300,
            '24px Arial',
            '#ffffff',
            'center'
        );

        this.renderer.drawText(
            'Press SPACE to Restart',
            SCREEN.CENTER_X,
            400,
            '20px Arial',
            '#cccccc',
            'center'
        );

        // 재시작
        if (this.inputManager.isKeyPressed('Space')) {
            this.startNewGame();
        }
    }

    /**
     * 승리 렌더링
     */
    private renderVictory(): void {
        this.renderer.drawText(
            '🎉 VICTORY!',
            SCREEN.CENTER_X,
            200,
            'bold 64px Arial',
            '#4CAF50',
            'center'
        );

        this.renderer.drawText(
            '모든 층을 클리어했습니다!',
            SCREEN.CENTER_X,
            300,
            '24px Arial',
            '#ffffff',
            'center'
        );

        this.renderer.drawText(
            'Press SPACE to Restart',
            SCREEN.CENTER_X,
            400,
            '20px Arial',
            '#cccccc',
            'center'
        );

        // 재시작
        if (this.inputManager.isKeyPressed('Space')) {
            this.startNewGame();
        }
    }

    /**
     * 플레이어 이름 저장
     */
    private savePlayerName(): void {
        try {
            localStorage.setItem('dungeonOdyssey_playerName', this.playerName);
            console.log(`💾 플레이어 이름 저장: ${this.playerName}`);
        } catch (error) {
            console.error('❌ 플레이어 이름 저장 실패:', error);
        }
    }

    /**
     * 플레이어 이름 로드
     */
    private loadPlayerName(): void {
        try {
            const savedName = localStorage.getItem('dungeonOdyssey_playerName');
            if (savedName) {
                this.playerName = savedName;
                console.log(`💾 플레이어 이름 로드: ${this.playerName}`);
            }
        } catch (error) {
            console.error('❌ 플레이어 이름 로드 실패:', error);
        }
    }

    /**
     * 가장 가까운 적 찾기
     */
    private findNearestEnemy(): Enemy | null {
        if (!this.player || this.enemies.length === 0) {
            return null;
        }

        const playerPos = this.player.getPosition();
        let nearestEnemy: Enemy | null = null;
        let minDistance = Infinity;

        for (const enemy of this.enemies) {
            const dx = enemy.x - playerPos.x;
            const dy = enemy.y - playerPos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < minDistance) {
                minDistance = distance;
                nearestEnemy = enemy;
            }
        }

        return nearestEnemy;
    }

    /**
     * 게임 모드 변경
     */
    private changeGameMode(newMode: GameMode): void {
        console.log(`🔄 게임 모드 변경: ${this.gameMode} → ${newMode}`);
        const oldMode = this.gameMode;
        this.gameMode = newMode;

        // BGM 변경
        if (oldMode !== newMode) {
            switch (newMode) {
                case GameMode.TITLE:
                case GameMode.CHARACTER_CREATE:
                case GameMode.CREDITS:
                case GameMode.HOW_TO_PLAY:
                    this.audioManager.fadeBGMIn('title', 1000);
                    break;

                case GameMode.PLAYING:
                    // 보스층이면 boss BGM, 아니면 floor BGM
                    const hasBoss = this.bossUI.isBossActive();
                    this.audioManager.fadeBGMIn(hasBoss ? 'boss' : 'floor', 1000);
                    break;

                case GameMode.VICTORY:
                    this.audioManager.fadeBGMIn('victory', 1000);
                    break;

                case GameMode.GAME_OVER:
                    this.audioManager.fadeBGMIn('gameover', 1000);
                    break;

                case GameMode.SOUL_CHAMBER:
                    // Soul Chamber는 타이틀 BGM 사용
                    this.audioManager.fadeBGMIn('title', 1000);
                    break;
            }
        }
    }

    /**
     * 새 게임 시작
     */
    private startNewGame(): void {
        console.log('🆕 새 게임 시작!');

        this.currentFloor = 1;

        // 첫 번째 층 생성
        this.generateFloor(1);

        // 플레이어 생성 (맵 스폰 위치)
        const spawnPos = this.mapManager.getPlayerSpawnPosition();
        this.player = new Player(spawnPos.x, spawnPos.y);

        // 업그레이드된 스탯 적용
        const baseStats: PlayerStats = {
            health: GAMEPLAY.PLAYER_BASE.HEALTH,
            maxHealth: GAMEPLAY.PLAYER_BASE.HEALTH,
            mana: GAMEPLAY.PLAYER_BASE.MANA,
            maxMana: GAMEPLAY.PLAYER_BASE.MANA,
            stamina: GAMEPLAY.PLAYER_BASE.STAMINA,
            maxStamina: GAMEPLAY.PLAYER_BASE.STAMINA,
            attack: GAMEPLAY.PLAYER_BASE.ATTACK,
            defense: GAMEPLAY.PLAYER_BASE.DEFENSE,
            speed: GAMEPLAY.PLAYER_BASE.SPEED,
            criticalChance: GAMEPLAY.PLAYER_BASE.CRITICAL_CHANCE,
            criticalDamage: GAMEPLAY.PLAYER_BASE.CRITICAL_DAMAGE,
            luck: GAMEPLAY.PLAYER_BASE.LUCK
        };
        const upgradedStats = this.upgradeSystem.applyUpgradesToStats(baseStats);
        console.log('⚡ 업그레이드 적용 전:', baseStats);
        console.log('⚡ 업그레이드 적용 후:', upgradedStats);
        this.player.applyUpgradedStats(upgradedStats);
        console.log('⚡ 플레이어 최종 스탯:', this.player.stats);

        // 카메라를 플레이어 위치로 즉시 이동
        this.camera.snapToTarget(this.player.getPosition());

        // 게임플레이 모드로 전환
        this.changeGameMode(GameMode.PLAYING);
    }

    /**
     * 층 생성
     */
    private generateFloor(floor: number): void {
        console.log(`🗺️ ${floor}층 생성 중...`);

        // 던전 맵 생성
        const dungeonMap = this.mapManager.generateFloor(floor);

        // 카메라 맵 경계 설정
        const mapSize = this.mapManager.getMapSize();
        this.camera.setMapBounds(mapSize.width, mapSize.height);

        // 적 초기화
        this.enemies = [];
        this.bossUI.setBoss(null); // 보스 UI 초기화

        // 맵에서 생성된 적 스폰 포인트로 적 배치
        const enemySpawns = this.mapManager.getEnemySpawnPoints();
        const bossData = getBossDataByFloor(floor);
        let bossSpawned = false;

        for (const spawn of enemySpawns) {
            const isBoss = spawn.isBoss || false;

            if (isBoss && bossData) {
                // 보스 생성
                const boss = new Boss(spawn.x, spawn.y, bossData);
                boss.setProjectileSystem(this.projectileSystem); // ProjectileSystem 연결
                boss.setBuffSystem(this.buffSystem); // BuffSystem 연결

                // 보스 페이즈 변경 콜백 설정
                boss.setOnPhaseChange((phase: number, bossX: number, bossY: number) => {
                    // 페이즈 변경 효과
                    this.audioManager.playSFX('boss_phase');
                    this.particleSystem.emit('boss_telegraph', bossX, bossY, { count: 30 });
                    this.camera.shake(20, 400);
                    console.log(`🔥 보스 페이즈 ${phase} 돌입!`);
                });

                this.enemies.push(boss);
                this.bossUI.setBoss(boss);
                bossSpawned = true;
                console.log(`👑 보스 생성: ${bossData.name} (${floor}층)`);

                // 보스 등장 효과음 & BGM 변경
                this.audioManager.playSFX('boss_appear');
                this.audioManager.fadeBGMIn('boss', 2000);
            } else {
                // 일반 적 생성
                this.enemies.push(new Enemy(spawn.x, spawn.y, spawn.type as any, false));
            }
        }

        console.log(`✅ ${this.enemies.length}마리 적 생성 완료 (보스층: ${bossSpawned ? 'YES' : 'NO'})`);

        // NPC 스폰
        this.npcs = [];
        const npcSpawns = dungeonMap.spawnPoints.npcs;
        const npcTypes: Array<'sage' | 'merchant' | 'blacksmith' | 'skill_master' | 'soul_keeper'> = [];

        // 층별 NPC 타입 결정
        if (floor === 1) {
            npcTypes.push('sage', 'merchant');
        } else if (floor === 2) {
            npcTypes.push('blacksmith', 'merchant');
        } else if (floor === 3) {
            npcTypes.push('skill_master', 'merchant');
        } else if (floor === 4) {
            npcTypes.push('soul_keeper', 'blacksmith', 'merchant');
        } else if (floor === 5) {
            npcTypes.push('sage', 'soul_keeper', 'merchant');
        } else {
            // 6층 이상은 랜덤
            npcTypes.push('merchant', 'blacksmith');
        }

        // NPC 생성
        for (let i = 0; i < Math.min(npcSpawns.length, npcTypes.length); i++) {
            const spawn = npcSpawns[i];
            const npcType = npcTypes[i];
            this.npcs.push(new NPC(spawn.x, spawn.y, npcType));
        }

        console.log(`👤 ${this.npcs.length}명 NPC 생성 완료`);

        // 해당 층의 퀘스트 활성화 (첫 방문 시)
        const floorQuests = getQuestsForFloor(floor);
        floorQuests.forEach(quest => {
            if (this.questSystem.canStartQuest(quest.id)) {
                // 자동 시작하지 않고, NPC와 대화 시 시작하도록 함
                console.log(`📜 ${floor}층 퀘스트 준비: ${quest.title}`);
            }
        });
    }

    /**
     * 층수에 따른 랜덤 적 타입
     */
    private getRandomEnemyType(floor: number): 'goblin' | 'orc' | 'skeleton' | 'troll' | 'wraith' {
        if (floor <= 2) return 'goblin';
        if (floor <= 4) return Math.random() < 0.5 ? 'goblin' : 'orc';
        if (floor <= 6) return Math.random() < 0.5 ? 'orc' : 'skeleton';
        if (floor <= 8) return Math.random() < 0.5 ? 'skeleton' : 'troll';
        return Math.random() < 0.5 ? 'troll' : 'wraith';
    }
}

// 게임 시작
window.addEventListener('load', () => {
    try {
        console.log('🎮 게임 로딩 시작...');
        new Game();
    } catch (error) {
        console.error('❌ 게임 초기화 실패:', error);

        // 로딩 화면에 에러 표시
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.innerHTML = `
                <div class="loading-content">
                    <h1 style="color: #ff4444;">❌ 게임 로딩 실패</h1>
                    <p style="color: #ffffff;">${error instanceof Error ? error.message : String(error)}</p>
                    <p style="color: #aaa; margin-top: 20px;">브라우저 콘솔(F12)을 확인하세요.</p>
                </div>
            `;
        }
    }
});