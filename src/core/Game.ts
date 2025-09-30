/**
 * 🎮 최진안의 이세계 모험기 - 메인 게임 클래스
 *
 * docs/OPTIMIZED_GAME_DESIGN.md 기반으로 완전 새로 구현
 */

import { GameMode } from '../types';
import { GAME_MODES, SCREEN, GAMEPLAY } from '../utils/Constants';
import { InputManager } from '../systems/InputManager';
import { Renderer } from '../systems/Renderer';
import { MapManager } from '../systems/MapManager';
import { Camera } from '../systems/Camera';
import { DamageNumberSystem } from '../systems/DamageNumberSystem';
import { ItemSystem } from '../systems/ItemSystem';
import { Inventory } from '../systems/Inventory';
import { Trait } from '../systems/TraitSystem';
import { Minimap } from '../ui/Minimap';
import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';

class Game {
    // 캔버스
    private canvas: HTMLCanvasElement;
    private renderer: Renderer;

    // 시스템
    private inputManager: InputManager;
    private mapManager: MapManager;
    private camera: Camera;
    private damageNumberSystem: DamageNumberSystem;
    private itemSystem: ItemSystem;
    private inventory: Inventory;
    private minimap: Minimap;

    // 게임 상태
    private gameMode: GameMode = GameMode.LOADING;
    private isRunning: boolean = false;
    private currentFloor: number = 1;

    // 엔티티
    private player: Player | null = null;
    private enemies: Enemy[] = [];

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
        console.log('🎮 최진안의 이세계 모험기 시작!');

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
        this.itemSystem = new ItemSystem();
        this.inventory = new Inventory();
        this.minimap = new Minimap();

        // 게임 초기화
        this.init();
    }

    /**
     * 초기화
     */
    private async init(): Promise<void> {
        console.log('🔧 게임 초기화 중...');

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

            case GameMode.PLAYING:
                this.updateGameplay();
                break;
        }
    }

    /**
     * 타이틀 화면 업데이트
     */
    private updateTitleScreen(): void {
        // 스페이스바로 게임 시작
        if (this.inputManager.isKeyPressed('Space')) {
            this.startNewGame();
        }
    }

    /**
     * 게임플레이 업데이트
     */
    private updateGameplay(): void {
        if (!this.player) return;

        // 플레이어 이동 (충돌 체크 포함)
        const movement = this.inputManager.getMovementInput();
        this.player.move(movement, this.deltaTime, (x, y, w, h) => {
            return this.mapManager.isColliding(x, y, w, h);
        });

        // 플레이어 공격
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

        // 데미지 숫자 업데이트
        this.damageNumberSystem.update(this.deltaTime);

        // 아이템 시스템 업데이트
        this.itemSystem.update(this.deltaTime);

        // 아이템 획득 체크
        const pickedItem = this.itemSystem.checkPickup(this.player.x, this.player.y);
        if (pickedItem) {
            const added = this.inventory.addItem(pickedItem.item);
            if (added) {
                console.log(`📦 ${pickedItem.item.name} 획득!`);
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
        const attackRange = 60;

        // 범위 내 적 탐지
        for (const enemy of this.enemies) {
            const dx = enemy.x - playerPos.x;
            const dy = enemy.y - playerPos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= attackRange) {
                // 전투 시스템으로 데미지 계산
                const combatResult = this.player.getCombatSystem().attack(
                    this.player.stats.attack,
                    this.player.stats.criticalChance,
                    false
                );

                enemy.takeDamage(combatResult.damage);

                // 데미지 숫자 표시 (화면 좌표로 변환)
                const enemyScreen = this.camera.worldToScreen(enemy.x, enemy.y);
                this.damageNumberSystem.spawn(
                    enemyScreen.x,
                    enemyScreen.y - 20,
                    combatResult.damage,
                    combatResult.isCritical
                );

                // 카메라 흔들림 (크리티컬이면 강하게)
                if (combatResult.isCritical) {
                    this.camera.shake(15, 200);
                } else {
                    this.camera.shake(5, 100);
                }

                console.log(`💥 ${combatResult.damage} 데미지! (콤보: ${combatResult.comboMultiplier.toFixed(1)}x)`);
            }
        }
    }

    /**
     * 적 처치 보상
     */
    private handleEnemyKilled(enemy: Enemy): void {
        if (!this.player) return;

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

        if (leveledUp) {
            console.log(`✨ 레벨업! 현재 레벨: ${this.player.level}`);
            // 레벨업 이펙트 (화면 번쩍임)
            this.camera.shake(20, 300);
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
     * 플레이어 사망 처리
     */
    private handlePlayerDeath(): void {
        console.log('💀 플레이어 사망');
        this.changeGameMode(GameMode.GAME_OVER);
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
        this.renderer.drawText(
            '🗡️ 최진안의 이세계 모험기',
            SCREEN.CENTER_X,
            200,
            'bold 48px Arial',
            '#e94560',
            'center'
        );

        this.renderer.drawText(
            'Press SPACE to Start',
            SCREEN.CENTER_X,
            400,
            '24px Arial',
            '#ffffff',
            'center'
        );

        this.renderer.drawText(
            'TypeScript + Canvas로 만든 로그라이크 게임',
            SCREEN.CENTER_X,
            500,
            '18px Arial',
            '#cccccc',
            'center'
        );
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

        // 플레이어 그림자
        this.renderer.drawCircle(
            playerScreen.x + 16,
            playerScreen.y + 28,
            12,
            'rgba(0, 0, 0, 0.3)'
        );

        // 플레이어 몸체 (원형)
        this.renderer.drawCircle(
            playerScreen.x + 16,
            playerScreen.y + 16,
            14,
            GAMEPLAY.PLAYER_BASE.COLOR
        );

        // 플레이어 테두리
        const ctx = this.renderer.getContext();
        ctx.strokeStyle = '#2C3E50';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(playerScreen.x + 16, playerScreen.y + 16, 14, 0, Math.PI * 2);
        ctx.stroke();

        // 방향 표시 (작은 점)
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(playerScreen.x + 16, playerScreen.y + 10, 3, 0, Math.PI * 2);
        ctx.fill();

        // 적 렌더링 (화면 좌표로 변환)
        for (const enemy of this.enemies) {
            const enemyScreen = this.camera.worldToScreen(enemy.x, enemy.y);
            enemy.renderAtPosition(this.renderer, enemyScreen.x, enemyScreen.y);
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
            '최진안',
            75,
            35,
            'bold 16px Arial',
            '#ECF0F1',
            'left'
        );

        this.renderer.drawText(
            `모험가`,
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
     * 게임 모드 변경
     */
    private changeGameMode(newMode: GameMode): void {
        console.log(`🔄 게임 모드 변경: ${this.gameMode} → ${newMode}`);
        this.gameMode = newMode;
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

        // 맵에서 생성된 적 스폰 포인트로 적 배치
        const enemySpawns = this.mapManager.getEnemySpawnPoints();
        for (const spawn of enemySpawns) {
            const isBoss = spawn.isBoss || false;
            this.enemies.push(new Enemy(spawn.x, spawn.y, spawn.type as any, isBoss));
        }

        console.log(`✅ ${this.enemies.length}마리 적 생성 완료 (보스층: ${floor % 5 === 0})`);
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