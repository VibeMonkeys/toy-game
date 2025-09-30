# 🏗️ 기술 아키텍처

## 📋 문서 정보
- **문서**: 04. 기술 아키텍처
- **버전**: v1.0
- **최종 수정**: 2025-09-28

---

## 🗂️ 프로젝트 구조

### 디렉토리 구조
```
toy-game/
├── index.html              # 메인 HTML (게임 엔트리 포인트)
├── style.css              # 글로벌 스타일
├── README.md              # 프로젝트 문서
├── docs/                  # 게임 기획 문서들
│   ├── README.md
│   ├── 01-game-overview.md
│   ├── 02-story-worldbuilding.md
│   └── ...
└── src/                   # 소스 코드
    ├── core/              # 게임 핵심 로직
    │   ├── Game.js            # 메인 게임 클래스
    │   ├── InputManager.js    # 입력 처리
    │   ├── SaveManager.js     # 저장/로드
    │   ├── GameState.js       # 상태 관리
    │   └── Constants.js       # 상수 정의
    ├── systems/           # 게임 시스템
    │   ├── CombatSystem.js    # 전투 로직
    │   ├── DungeonGenerator.js # 던전 생성
    │   ├── ProgressionSystem.js # 메타 프로그레션
    │   ├── EnemySystem.js     # 적 AI 시스템
    │   ├── ItemSystem.js      # 아이템 관리
    │   └── BalanceSystem.js   # 밸런싱 공식
    ├── entities/          # 게임 객체
    │   ├── Player.js          # 플레이어 클래스
    │   ├── Enemy.js           # 적 기본 클래스
    │   ├── Boss.js            # 보스 클래스
    │   ├── Projectile.js      # 투사체 클래스
    │   └── Item.js            # 아이템 클래스
    ├── graphics/          # 렌더링 시스템
    │   ├── Renderer.js        # 메인 렌더링
    │   ├── UIRenderer.js      # UI 렌더링
    │   ├── ParticleSystem.js  # 파티클 효과
    │   ├── AnimationSystem.js # 애니메이션
    │   └── CameraSystem.js    # 카메라 제어
    ├── ui/                # UI 컴포넌트
    │   ├── TitleScreen.js     # 타이틀 화면
    │   ├── HubWorld.js        # 허브 월드 UI
    │   ├── GameHUD.js         # 게임 중 HUD
    │   ├── InventoryScreen.js # 인벤토리
    │   ├── UpgradeScreen.js   # 업그레이드 상점
    │   └── PauseMenu.js       # 일시정지 메뉴
    ├── data/              # 게임 데이터
    │   ├── EnemyData.js       # 적 데이터베이스
    │   ├── ItemData.js        # 아이템 데이터
    │   ├── SkillData.js       # 스킬 데이터
    │   ├── WeaponData.js      # 무기 데이터
    │   └── StoryData.js       # 스토리/대사
    ├── utils/             # 유틸리티
    │   ├── MathUtils.js       # 수학 함수
    │   ├── CollisionUtils.js  # 충돌 감지
    │   ├── RandomUtils.js     # 랜덤 생성
    │   └── AudioManager.js    # 사운드 관리
    └── assets/            # 게임 리소스
        ├── images/            # 이미지 파일
        ├── sounds/            # 사운드 파일
        └── fonts/             # 폰트 파일
```

---

## 🔧 핵심 클래스 설계

### Game 클래스 (메인 게임 매니저)
```javascript
export class Game {
    constructor() {
        this.gameMode = GAME_MODES.LOADING;
        this.canvas = null;
        this.ctx = null;
        this.targetFPS = 60;
        this.frameInterval = 1000 / this.targetFPS;
        this.lastFrameTime = 0;

        // 시스템 매니저들
        this.inputManager = null;
        this.renderer = null;
        this.uiRenderer = null;
        this.saveManager = null;
        this.audioManager = null;

        // 게임 상태
        this.player = null;
        this.currentDungeon = null;
        this.progressionSystem = null;

        // UI 시스템
        this.titleScreen = null;
        this.hubWorld = null;
        this.gameHUD = null;
        this.pauseMenu = null;
    }

    // 게임 초기화
    async initialize() { }

    // 메인 게임 루프
    gameLoop(currentTime) { }

    // 게임 상태 전환
    changeGameMode(newMode) { }

    // 입력 처리
    handleInput(event) { }

    // 업데이트 로직
    update(deltaTime) { }

    // 렌더링
    render() { }
}
```

### DungeonGenerator 클래스 (던전 생성)
```javascript
export class DungeonGenerator {
    constructor() {
        this.seed = null;
        this.currentFloor = 1;
        this.rooms = [];
        this.connections = [];
    }

    // 시드 기반 던전 생성
    generateDungeon(floor, seed) {
        this.seed = seed;
        this.currentFloor = floor;

        // 1. 방 개수 계산
        const roomCount = this.calculateRoomCount(floor);

        // 2. 방 타입 결정
        const roomTypes = this.determineRoomTypes(roomCount);

        // 3. 방 배치
        this.layoutRooms(roomTypes);

        // 4. 연결 생성
        this.createConnections();

        // 5. 적/아이템 배치
        this.populateRooms();

        return {
            rooms: this.rooms,
            connections: this.connections,
            startRoom: this.findStartRoom(),
            bossRoom: this.findBossRoom()
        };
    }

    calculateRoomCount(floor) {
        return Math.floor(8 + floor * 0.7);
    }

    determineRoomTypes(roomCount) { }
    layoutRooms(roomTypes) { }
    createConnections() { }
    populateRooms() { }
}
```

### Player 클래스 (플레이어 캐릭터)
```javascript
export class Player {
    constructor(x, y) {
        // 위치 및 물리
        this.x = x;
        this.y = y;
        this.width = 24;
        this.height = 24;
        this.velocity = { x: 0, y: 0 };
        this.speed = 120; // 픽셀/초

        // 능력치
        this.maxHealth = 100;
        this.health = this.maxHealth;
        this.maxMana = 30;
        this.mana = this.maxMana;
        this.attackPower = 12;
        this.defense = 2;
        this.criticalChance = 0.05;

        // 장비 및 스킬
        this.currentWeapon = null;
        this.skills = { q: null, e: null };
        this.inventory = [];

        // 상태
        this.isInvulnerable = false;
        this.invulnerabilityTime = 0;
        this.isDashing = false;
        this.dashCooldown = 0;

        // 애니메이션
        this.facing = 'down';
        this.isMoving = false;
        this.animationFrame = 0;
    }

    update(deltaTime, inputState) {
        // 이동 처리
        this.handleMovement(deltaTime, inputState);

        // 공격 처리
        this.handleAttack(inputState);

        // 스킬 사용
        this.handleSkills(inputState);

        // 대시 처리
        this.handleDash(inputState);

        // 상태 업데이트
        this.updateStatus(deltaTime);

        // 충돌 처리
        this.handleCollisions();
    }

    handleMovement(deltaTime, inputState) { }
    handleAttack(inputState) { }
    handleSkills(inputState) { }
    handleDash(inputState) { }
    updateStatus(deltaTime) { }
    handleCollisions() { }

    takeDamage(amount) { }
    heal(amount) { }
    equipWeapon(weapon) { }
    learnSkill(skill, slot) { }
}
```

### Enemy 클래스 (적 기본 클래스)
```javascript
export class Enemy {
    constructor(x, y, type) {
        // 기본 속성
        this.x = x;
        this.y = y;
        this.type = type;
        this.width = 20;
        this.height = 20;

        // 능력치 (타입별로 다름)
        this.maxHealth = this.getBaseHealth();
        this.health = this.maxHealth;
        this.attackPower = this.getBaseAttack();
        this.speed = this.getBaseSpeed();
        this.detectionRange = this.getDetectionRange();
        this.attackRange = this.getAttackRange();

        // AI 상태
        this.state = 'idle';
        this.target = null;
        this.lastKnownPlayerPos = null;
        this.stateTimer = 0;
        this.attackCooldown = 0;

        // 이동 및 패턴
        this.velocity = { x: 0, y: 0 };
        this.patrolPath = [];
        this.currentPatrolIndex = 0;
        this.behaviorPattern = this.getBehaviorPattern();
    }

    update(deltaTime, player) {
        // AI 상태 머신 업데이트
        this.updateAI(deltaTime, player);

        // 움직임 적용
        this.applyMovement(deltaTime);

        // 공격 쿨다운
        this.updateCooldowns(deltaTime);

        // 충돌 처리
        this.handleCollisions();
    }

    updateAI(deltaTime, player) {
        switch(this.state) {
            case 'idle':
                this.handleIdleState(deltaTime, player);
                break;
            case 'patrol':
                this.handlePatrolState(deltaTime, player);
                break;
            case 'chase':
                this.handleChaseState(deltaTime, player);
                break;
            case 'attack':
                this.handleAttackState(deltaTime, player);
                break;
            case 'stunned':
                this.handleStunnedState(deltaTime);
                break;
        }
    }

    // 타입별 기본값
    getBaseHealth() { }
    getBaseAttack() { }
    getBaseSpeed() { }
    getDetectionRange() { }
    getAttackRange() { }
    getBehaviorPattern() { }

    // AI 상태 처리
    handleIdleState(deltaTime, player) { }
    handlePatrolState(deltaTime, player) { }
    handleChaseState(deltaTime, player) { }
    handleAttackState(deltaTime, player) { }
    handleStunnedState(deltaTime) { }

    // 행동 패턴
    executeBehaviorPattern(player) { }

    takeDamage(amount, knockback) { }
    die() { }
}
```

---

## 💾 저장 시스템 & 데이터 관리

### SaveManager 클래스
```javascript
export class SaveManager {
    constructor() {
        this.saveSlots = 3;
        this.currentSlot = 0;
        this.autoSaveInterval = 30000; // 30초마다 자동저장
        this.lastAutoSave = 0;
    }

    // 게임 데이터 저장
    saveGame(slot = this.currentSlot) {
        const gameData = this.collectGameData();
        const saveData = {
            version: SAVE_VERSION,
            timestamp: Date.now(),
            checksum: this.calculateChecksum(gameData),
            data: gameData
        };

        try {
            localStorage.setItem(`game_save_${slot}`, JSON.stringify(saveData));
            this.createBackup(saveData, slot);
            return true;
        } catch (error) {
            console.error('Save failed:', error);
            return false;
        }
    }

    // 게임 데이터 로드
    loadGame(slot = this.currentSlot) {
        try {
            const saveData = localStorage.getItem(`game_save_${slot}`);
            if (!saveData) return null;

            const parsed = JSON.parse(saveData);

            // 무결성 검증
            if (!this.verifyChecksum(parsed)) {
                return this.loadBackup(slot);
            }

            // 버전 호환성 확인
            if (parsed.version !== SAVE_VERSION) {
                return this.migrateData(parsed);
            }

            return parsed.data;
        } catch (error) {
            console.error('Load failed:', error);
            return this.loadBackup(slot);
        }
    }

    collectGameData() {
        return {
            // 플레이어 진행도
            playerData: {
                soulPoints: game.progressionSystem.soulPoints,
                totalSoulPointsEarned: game.progressionSystem.totalSoulPointsEarned,
                permanentUpgrades: game.progressionSystem.upgrades,
                unlockedWeapons: game.progressionSystem.unlockedWeapons,
                unlockedSkills: game.progressionSystem.unlockedSkills,
                bestFloor: game.progressionSystem.bestFloor,
                totalRuns: game.progressionSystem.totalRuns,
                totalDeaths: game.progressionSystem.totalDeaths,
                totalKills: game.progressionSystem.totalKills,
                achievements: game.progressionSystem.achievements
            },

            // 현재 런 데이터
            currentRun: game.currentRun ? {
                isActive: true,
                floor: game.currentRun.floor,
                room: game.currentRun.room,
                player: {
                    health: game.player.health,
                    mana: game.player.mana,
                    x: game.player.x,
                    y: game.player.y,
                    currentWeapon: game.player.currentWeapon,
                    skills: game.player.skills,
                    inventory: game.player.inventory
                },
                dungeon: {
                    seed: game.currentDungeon.seed,
                    clearedRooms: game.currentDungeon.clearedRooms,
                    currentRoomEnemies: game.currentDungeon.currentRoomEnemies
                },
                statistics: game.currentRun.statistics
            } : null,

            // 게임 설정
            settings: {
                masterVolume: game.audioManager.masterVolume,
                musicVolume: game.audioManager.musicVolume,
                sfxVolume: game.audioManager.sfxVolume,
                keyBindings: game.inputManager.keyBindings,
                graphicsQuality: game.renderer.quality
            }
        };
    }

    calculateChecksum(data) {
        // 간단한 체크섬 계산
        const str = JSON.stringify(data);
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // 32bit 정수로 변환
        }
        return hash.toString(16);
    }

    verifyChecksum(saveData) {
        const calculatedChecksum = this.calculateChecksum(saveData.data);
        return calculatedChecksum === saveData.checksum;
    }

    createBackup(saveData, slot) {
        // 백업 파일 생성 (최대 3개 유지)
        const backups = this.getBackups(slot);
        backups.unshift(saveData);

        if (backups.length > 3) {
            backups.splice(3);
        }

        localStorage.setItem(`game_backup_${slot}`, JSON.stringify(backups));
    }

    loadBackup(slot) {
        try {
            const backups = this.getBackups(slot);
            if (backups.length > 0) {
                return backups[0].data;
            }
        } catch (error) {
            console.error('Backup load failed:', error);
        }
        return null;
    }

    getBackups(slot) {
        try {
            const backupsData = localStorage.getItem(`game_backup_${slot}`);
            return backupsData ? JSON.parse(backupsData) : [];
        } catch (error) {
            return [];
        }
    }

    migrateData(oldSaveData) {
        // 버전 간 데이터 마이그레이션
        // 필요에 따라 구현
        return oldSaveData.data;
    }

    autoSave() {
        const now = Date.now();
        if (now - this.lastAutoSave > this.autoSaveInterval) {
            this.saveGame();
            this.lastAutoSave = now;
        }
    }

    exportSave(slot) {
        const saveData = localStorage.getItem(`game_save_${slot}`);
        if (saveData) {
            const blob = new Blob([saveData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `jinan_save_${slot}_${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);
        }
    }

    importSave(file, slot) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const saveData = JSON.parse(e.target.result);
                    localStorage.setItem(`game_save_${slot}`, e.target.result);
                    resolve(saveData);
                } catch (error) {
                    reject(error);
                }
            };
            reader.readAsText(file);
        });
    }
}
```

### 데이터 구조 정의
```javascript
// 상수 정의
export const SAVE_VERSION = '1.0';

export const PLAYER_STATS = {
    BASE_HEALTH: 100,
    BASE_MANA: 30,
    BASE_ATTACK: 12,
    BASE_DEFENSE: 2,
    BASE_SPEED: 120,
    BASE_CRITICAL: 0.05
};

export const UPGRADE_COSTS = {
    HEALTH: [50, 70, 100, 140, 200],
    ATTACK: [60, 85, 120, 170, 240, 340, 480, 680],
    SPEED: [80, 115, 165, 235],
    MANA: [70, 100, 145],
    CRITICAL: [40, 60, 85, 120, 170, 240, 340, 480, 680, 960],
    DEFENSE: [65, 95, 135, 190, 270, 380]
};

export const ENEMY_SCALING = {
    HEALTH_MULTIPLIER: 0.15,
    ATTACK_MULTIPLIER: 0.12,
    SPAWN_RATE_MULTIPLIER: 0.1
};

export const GAME_MODES = {
    LOADING: 'loading',
    TITLE: 'title',
    INTRO: 'intro',
    HUB: 'hub',
    DUNGEON: 'dungeon',
    PAUSE: 'pause',
    GAME_OVER: 'game_over',
    VICTORY: 'victory'
};

export const ROOM_TYPES = {
    COMBAT: 'combat',
    TREASURE: 'treasure',
    SHOP: 'shop',
    ALTAR: 'altar',
    REST: 'rest',
    PUZZLE: 'puzzle',
    BOSS: 'boss'
};

export const WEAPON_TYPES = {
    SWORD: 'sword',
    DAGGER: 'dagger',
    STAFF: 'staff',
    BOW: 'bow',
    HAMMER: 'hammer'
};

export const SKILL_TYPES = {
    FIREBALL: 'fireball',
    ICE_SPIKE: 'ice_spike',
    LIGHTNING: 'lightning',
    HEALING: 'healing',
    BERSERKER: 'berserker',
    SHIELD: 'shield'
};

export const ENEMY_TYPES = {
    GOBLIN: 'goblin',
    ORC: 'orc',
    SKELETON: 'skeleton',
    WOLF: 'wolf',
    SHADOW: 'shadow'
};
```

---

## ⚡ 성능 최적화 전략

### 렌더링 최적화

#### 객체 풀링 시스템
```javascript
export class ObjectPool {
    constructor(createFn, resetFn, initialSize = 10) {
        this.createFn = createFn;
        this.resetFn = resetFn;
        this.pool = [];
        this.active = [];

        // 초기 풀 생성
        for (let i = 0; i < initialSize; i++) {
            this.pool.push(this.createFn());
        }
    }

    get() {
        let obj;
        if (this.pool.length > 0) {
            obj = this.pool.pop();
        } else {
            obj = this.createFn();
        }

        this.active.push(obj);
        return obj;
    }

    release(obj) {
        const index = this.active.indexOf(obj);
        if (index > -1) {
            this.active.splice(index, 1);
            this.resetFn(obj);
            this.pool.push(obj);
        }
    }

    releaseAll() {
        while (this.active.length > 0) {
            this.release(this.active[0]);
        }
    }
}

// 파티클 풀 예시
const particlePool = new ObjectPool(
    () => new Particle(),
    (particle) => particle.reset(),
    50
);
```

#### 화면 밖 객체 컬링
```javascript
export class CullingSystem {
    constructor(camera) {
        this.camera = camera;
        this.cullingMargin = 50; // 화면 밖 여유 공간
    }

    shouldRender(obj) {
        const cameraRect = this.camera.getViewRect();
        const objRect = {
            x: obj.x - this.cullingMargin,
            y: obj.y - this.cullingMargin,
            width: obj.width + this.cullingMargin * 2,
            height: obj.height + this.cullingMargin * 2
        };

        return this.rectIntersects(cameraRect, objRect);
    }

    rectIntersects(rect1, rect2) {
        return !(rect1.x + rect1.width < rect2.x ||
                rect2.x + rect2.width < rect1.x ||
                rect1.y + rect1.height < rect2.y ||
                rect2.y + rect2.height < rect1.y);
    }

    cullObjects(objects) {
        return objects.filter(obj => this.shouldRender(obj));
    }
}
```

#### 프레임 제한 시스템
```javascript
export class FrameRateManager {
    constructor(targetFPS = 60) {
        this.targetFPS = targetFPS;
        this.frameInterval = 1000 / targetFPS;
        this.lastFrameTime = 0;
        this.frameCount = 0;
        this.fpsCounter = 0;
        this.lastFpsTime = 0;
    }

    shouldUpdate(currentTime) {
        if (currentTime - this.lastFrameTime >= this.frameInterval) {
            this.lastFrameTime = currentTime;
            return true;
        }
        return false;
    }

    calculateFPS(currentTime) {
        this.frameCount++;

        if (currentTime - this.lastFpsTime >= 1000) {
            this.fpsCounter = this.frameCount;
            this.frameCount = 0;
            this.lastFpsTime = currentTime;
        }

        return this.fpsCounter;
    }

    getDeltaTime(currentTime) {
        const deltaTime = (currentTime - this.lastFrameTime) / 1000;
        return Math.min(deltaTime, 0.016); // 최대 16ms로 제한
    }
}
```

### 메모리 관리

#### 이벤트 리스너 관리
```javascript
export class EventManager {
    constructor() {
        this.listeners = new Map();
    }

    addEventListener(element, event, handler, options) {
        const key = `${element.constructor.name}_${event}`;

        if (!this.listeners.has(key)) {
            this.listeners.set(key, []);
        }

        this.listeners.get(key).push({ element, handler, options });
        element.addEventListener(event, handler, options);
    }

    removeEventListener(element, event, handler) {
        const key = `${element.constructor.name}_${event}`;
        const listeners = this.listeners.get(key);

        if (listeners) {
            const index = listeners.findIndex(l =>
                l.element === element && l.handler === handler
            );

            if (index > -1) {
                listeners.splice(index, 1);
                element.removeEventListener(event, handler);
            }
        }
    }

    removeAllListeners() {
        for (const [key, listeners] of this.listeners) {
            listeners.forEach(({ element, handler, event }) => {
                element.removeEventListener(event, handler);
            });
        }

        this.listeners.clear();
    }
}
```

#### 리소스 관리
```javascript
export class ResourceManager {
    constructor() {
        this.images = new Map();
        this.sounds = new Map();
        this.loadPromises = new Map();
    }

    async loadImage(name, src) {
        if (this.images.has(name)) {
            return this.images.get(name);
        }

        if (this.loadPromises.has(name)) {
            return this.loadPromises.get(name);
        }

        const promise = new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.images.set(name, img);
                this.loadPromises.delete(name);
                resolve(img);
            };
            img.onerror = reject;
            img.src = src;
        });

        this.loadPromises.set(name, promise);
        return promise;
    }

    async loadSound(name, src) {
        if (this.sounds.has(name)) {
            return this.sounds.get(name);
        }

        const audio = new Audio(src);
        await new Promise((resolve, reject) => {
            audio.oncanplaythrough = resolve;
            audio.onerror = reject;
            audio.load();
        });

        this.sounds.set(name, audio);
        return audio;
    }

    getImage(name) {
        return this.images.get(name);
    }

    getSound(name) {
        return this.sounds.get(name);
    }

    dispose() {
        this.images.clear();
        this.sounds.clear();
        this.loadPromises.clear();
    }
}
```

### 게임 로직 최적화

#### 공간 분할 시스템 (충돌 감지 최적화)
```javascript
export class SpatialGrid {
    constructor(width, height, cellSize = 64) {
        this.width = width;
        this.height = height;
        this.cellSize = cellSize;
        this.cols = Math.ceil(width / cellSize);
        this.rows = Math.ceil(height / cellSize);
        this.grid = [];

        this.clear();
    }

    clear() {
        this.grid = [];
        for (let i = 0; i < this.cols * this.rows; i++) {
            this.grid[i] = [];
        }
    }

    insert(obj) {
        const cells = this.getCells(obj);
        cells.forEach(cellIndex => {
            this.grid[cellIndex].push(obj);
        });
    }

    getCells(obj) {
        const startX = Math.floor(obj.x / this.cellSize);
        const startY = Math.floor(obj.y / this.cellSize);
        const endX = Math.floor((obj.x + obj.width) / this.cellSize);
        const endY = Math.floor((obj.y + obj.height) / this.cellSize);

        const cells = [];
        for (let y = startY; y <= endY; y++) {
            for (let x = startX; x <= endX; x++) {
                if (x >= 0 && x < this.cols && y >= 0 && y < this.rows) {
                    cells.push(y * this.cols + x);
                }
            }
        }

        return cells;
    }

    query(obj) {
        const cells = this.getCells(obj);
        const results = new Set();

        cells.forEach(cellIndex => {
            this.grid[cellIndex].forEach(other => {
                if (other !== obj) {
                    results.add(other);
                }
            });
        });

        return Array.from(results);
    }
}
```

#### 업데이트 빈도 최적화
```javascript
export class UpdateScheduler {
    constructor() {
        this.systems = [];
        this.frameCount = 0;
    }

    addSystem(system, updateFrequency = 1) {
        this.systems.push({
            system,
            updateFrequency,
            lastUpdate: 0
        });
    }

    update(deltaTime) {
        this.frameCount++;

        this.systems.forEach(({ system, updateFrequency, lastUpdate }, index) => {
            if (this.frameCount - lastUpdate >= updateFrequency) {
                system.update(deltaTime * updateFrequency);
                this.systems[index].lastUpdate = this.frameCount;
            }
        });
    }
}

// 사용 예시
const scheduler = new UpdateScheduler();
scheduler.addSystem(enemyAI, 2);        // 30 FPS로 업데이트
scheduler.addSystem(particleSystem, 1); // 60 FPS로 업데이트
scheduler.addSystem(audioSystem, 4);    // 15 FPS로 업데이트
```

---

**문서 관리 정보**
- **연관 문서**: [03. 게임플레이 시스템](./03-gameplay-systems.md), [05. UI/UX 디자인](./05-ui-ux-design.md)
- **업데이트 이력**: v1.0 (2025-09-28) - 초기 생성
- **리뷰 상태**: 검토 필요