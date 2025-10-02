/**
 * 🎮 던전 오딧세이 - 타입 정의
 *
 * 게임의 모든 타입을 중앙에서 관리합니다.
 */

// ============================================
// 게임 모드
// ============================================
export enum GameMode {
    LOADING = 'LOADING',
    TITLE = 'TITLE',
    CHARACTER_CREATE = 'CHARACTER_CREATE',
    CREDITS = 'CREDITS',
    HOW_TO_PLAY = 'HOW_TO_PLAY',
    TUTORIAL = 'TUTORIAL',
    INTRO = 'INTRO',
    PLAYING = 'PLAYING',
    TRAIT_SELECTION = 'TRAIT_SELECTION',
    SOUL_CHAMBER = 'SOUL_CHAMBER',
    PAUSED = 'PAUSED',
    GAME_OVER = 'GAME_OVER',
    VICTORY = 'VICTORY'
}

// ============================================
// 위치 & 벡터
// ============================================
export interface Position {
    x: number;
    y: number;
}

export interface Vector2D {
    x: number;
    y: number;
}

export interface Size {
    width: number;
    height: number;
}

export interface Hitbox {
    x: number;
    y: number;
    width: number;
    height: number;
}

// ============================================
// 플레이어
// ============================================
export interface PlayerStats {
    health: number;
    maxHealth: number;
    mana: number;
    maxMana: number;
    stamina: number;
    maxStamina: number;
    attack: number;
    defense: number;
    speed: number;
    criticalChance: number;
    criticalDamage: number;
    luck: number;
}

export interface PlayerState {
    position: Position;
    velocity: Vector2D;
    stats: PlayerStats;
    experience: number;
    level: number;
    soulPoints: number;
    floor: number;
    deaths: number;
    enemiesKilled: number;
}

// 무기 타입 (디자인 문서 기준)
export type WeaponType = 'sword' | 'dagger' | 'staff' | 'bow' | 'hammer';
export type SkillType = 'fireball' | 'lightning' | 'iceSpike' | 'heal' | 'dash' | 'shield';

// 무기 데이터 인터페이스
export interface WeaponData {
    id: WeaponType;
    name: string;
    description: string;
    category: 'melee' | 'ranged' | 'magic';

    // 기본 스탯
    baseDamage: number;
    attackSpeed: number; // 초당 공격 횟수
    range: number; // 픽셀
    criticalChance: number;

    // 특성
    comboBonus?: number; // 콤보 보너스 (검)
    backstabBonus?: number; // 백스탭 보너스 (단검)
    penetration?: boolean; // 관통 여부
    knockback?: number; // 넉백 거리
    aoeRadius?: number; // 광역 범위 (망치)

    // 차지 공격
    chargedAttack: {
        chargeTime: number; // 초
        damageMultiplier: number;
        specialEffect: string;
        effectValue?: number;
    };

    // 잠금 상태
    unlocked: boolean;
    unlockCost?: number; // 소울 포인트
}

// 장착 가능한 무기 슬롯
export interface EquippedWeapon {
    weapon: WeaponData;
    level: number;
    upgradeCount: number;
}

// ============================================
// 적 (Enemy)
// ============================================
export type EnemyType = 'goblin' | 'orc' | 'skeleton' | 'troll' | 'wraith';
export type BossType =
    | 'goblin_king'        // 5층 보스
    | 'orc_warlord'        // 10층 보스
    | 'undead_lord'        // 15층 보스
    | 'chaos_dragon'       // 20층 최종 보스
    | 'true_chaos';        // 25층 히든 보스 (추후)

export type AIState = 'idle' | 'patrol' | 'chase' | 'attack' | 'retreat';
export type BehaviorPattern = 'basic' | 'aggressive' | 'ranged' | 'tank' | 'ghost';

export interface EnemyData {
    health: number;
    attack: number;
    defense: number;
    speed: number;
    experience: number;
    soulPoints: number;
    color: string;
    width?: number;
    height?: number;
    detectionRange?: number;
    attackRange?: number;
    attackCooldown?: number;
    patrolRadius?: number;
    behavior?: BehaviorPattern;
    dropTable?: ItemDrop[];
}

export interface ItemDrop {
    item: string;
    chance: number;
}

// ============================================
// 전투 시스템
// ============================================
export interface CombatResult {
    damage: number;
    isCritical: boolean;
    isBackstab: boolean;
    comboMultiplier: number;
}

export interface StatusEffect {
    type: 'burning' | 'frozen' | 'poisoned' | 'stunned';
    duration: number;
    intensity: number;
}

export type DamageType = 'physical' | 'fire' | 'ice' | 'lightning' | 'poison';

// ============================================
// 빌드 시스템 (특성, 룬)
// ============================================
export interface Trait {
    id: string;
    name: string;
    description: string;
    category: 'attack' | 'defense' | 'utility';
    effect: TraitEffect;
    tradeoff?: TraitEffect;
    synergies?: string[];
}

export interface TraitEffect {
    stat: string;
    value: number;
    isMultiplier: boolean;
}

export interface Rune {
    id: string;
    name: string;
    type: 'element' | 'effect';
    effect: string;
    synergy?: string;
}

// ============================================
// 퀘스트 시스템
// ============================================
export enum QuestType {
    MAIN = 'MAIN',
    SIDE = 'SIDE'
}

export interface QuestObjective {
    id: string;
    text: string;
    target?: number;
    progress?: number;
    completed: boolean;
}

export interface Quest {
    id: string;
    type: QuestType;
    act: number;
    title: string;
    description: string;
    objectives: QuestObjective[];
    rewards: QuestRewards;
    storyText?: string;
    completionText?: string;
    isActive?: boolean;
    startTime?: number;
}

export interface QuestRewards {
    experience?: number;
    soulPoints?: number;
    items?: string[];
    skills?: string[];
    unlocks?: string[];
}

// ============================================
// 맵 시스템
// ============================================
export interface FloorData {
    theme: string;
    enemyTypes: (EnemyType | BossType)[];
    enemyCount: number;
    boss: BossType | null;
    difficulty: number;
}

export interface SpawnPoint {
    x: number;
    y: number;
    type: EnemyType | BossType | string;
    isBoss?: boolean;
}

export interface SpawnPoints {
    player: Position;
    enemies: SpawnPoint[];
    items: ItemSpawnPoint[];
    npcs: Position[];
    exits: ExitPoint[];
}

export interface ItemSpawnPoint {
    x: number;
    y: number;
    type: string;
}

export interface ExitPoint {
    x: number;
    y: number;
    type: 'next_floor' | 'soul_chamber';
    targetFloor?: number | string;
}

// ============================================
// BSP 던전 생성 시스템
// ============================================
export enum TileType {
    WALL = 0,
    FLOOR = 1,
    CORRIDOR = 2,
    DOOR = 3
}

export enum RoomType {
    START = 'start',
    EXIT = 'exit',
    COMBAT = 'combat',
    BOSS = 'boss',
    TREASURE = 'treasure',
    SHOP = 'shop',
    SHRINE = 'shrine',
    SECRET = 'secret'
}

export interface Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface Room {
    bounds: Rectangle;
    center: Position;
    type: RoomType;
    connections: Room[];
}

export interface BSPNode {
    bounds: Rectangle;
    room: Room | null;
    leftChild: BSPNode | null;
    rightChild: BSPNode | null;
}

export interface DungeonMap {
    width: number;
    height: number;
    tiles: TileType[][];
    rooms: Room[];
    startRoom: Room;
    exitRoom: Room;
    spawnPoints: SpawnPoints;
}

export interface MapGenerationConfig {
    width: number;
    height: number;
    minRoomSize: Size;
    maxRoomSize: Size;
    roomCount: { min: number; max: number };
    corridorWidth: number;
    maxDepth: number;
}

// ============================================
// NPC & 대화 시스템
// ============================================
export interface DialogueLine {
    id?: string;
    text: string;
    portrait?: string;
    next?: string | null;
    choices?: DialogueChoice[];
}

export interface DialogueChoice {
    text: string;
    next: string | null;
    flag?: string;
}

export interface NPC {
    id: string;
    name: string;
    sprite: string;
    location: NPCLocation;
    dialogues: Record<string, DialogueTree>;
    services?: NPCService;
}

export interface NPCLocation {
    floor: number | string;
    x: number;
    y: number;
    area?: string;
}

export interface DialogueTree {
    condition?: string;
    lines: DialogueLine[];
    onComplete?: string;
    startQuest?: string;
    reward?: QuestRewards;
}

export interface NPCService {
    type: 'shop' | 'upgrade' | 'quest';
    items?: any[];
}

// ============================================
// 아이템 시스템
// ============================================
export enum ItemRarity {
    COMMON = 'common',
    UNCOMMON = 'uncommon',
    RARE = 'rare',
    EPIC = 'epic',
    LEGENDARY = 'legendary'
}

export type ItemType = 'weapon' | 'armor' | 'consumable' | 'material' | 'quest';
export type ArmorSlot = 'helmet' | 'chest' | 'legs' | 'boots' | 'accessory';

export interface ItemEffect {
    type: 'heal' | 'mana' | 'buff' | 'damage' | 'stat';
    value: number;
    duration?: number; // 버프 지속시간 (초)
    stat?: 'attack' | 'defense' | 'speed' | 'critChance' | 'critDamage';
}

export interface Item {
    id: string;
    name: string;
    type: ItemType;
    rarity: ItemRarity;
    description: string;
    stackable?: boolean;
    maxStack?: number;

    // 장비 아이템 (무기/방어구)
    slot?: ArmorSlot;
    stats?: {
        attack?: number;
        defense?: number;
        health?: number;
        speed?: number;
        critChance?: number;
        critDamage?: number;
    };

    // 소모품
    effects?: ItemEffect[];

    // 가치
    sellPrice?: number;
    buyPrice?: number;
}

// ============================================
// 게임 상태
// ============================================
export interface GameState {
    mode: GameMode;
    currentFloor: number;
    playerStats: PlayerStats;
    equippedWeapon: WeaponType | null;
    equippedSkills: SkillType[];
    equippedTraits: string[];
    equippedRunes: string[];
    flags: Record<string, boolean>;
    progress: GameProgress;
}

export interface GameProgress {
    highestFloor: number;
    totalRuns: number;
    totalDeaths: number;
    totalKills: number;
    soulsEarned: number;
    soulsSpent: number;
    completedQuests: string[];
    unlockedWeapons: WeaponType[];
    unlockedSkills: SkillType[];
    unlocks: string[];
}

// ============================================
// 보스 패턴
// ============================================
export interface BossPattern {
    id: string;
    name: string;
    frequency: 'main' | 'filler' | 'special';
    cooldown: number;
    lastUsed?: number;
    sequence: PatternSequence[];
    counterplay: string;
}

export interface PatternSequence {
    action: 'telegraph' | 'attack' | 'move' | 'summon' | 'buff' | 'projectile' | 'aoe' | 'recovery';
    duration: number;
    damage?: number;
    hitbox?: string;
    visual?: string;
    audio?: string;
    vulnerable?: boolean;
    interrupt?: boolean;
    invulnerable?: boolean;
    // 공격 관련
    range?: number;
    aoeRadius?: number;
    knockback?: number;
    // 이동 관련
    speed?: number;
    distance?: number;
    targetPlayer?: boolean;
    // 소환 관련
    summonType?: EnemyType;
    summonCount?: number;
    // 투사체 관련
    projectileCount?: number;
    projectileSpeed?: number;
    homing?: boolean;
    // 버프 관련
    buffType?: string;
    buffDuration?: number;
    buffValue?: number;
}

export interface BossPhase {
    phase: number;
    healthRange: [number, number]; // [min%, max%]
    patterns: BossPattern[];
    phaseTransition?: {
        animation: string;
        duration: number;
        message: string;
        invulnerable: boolean;
        effect?: string;
    };
    modifiers?: {
        speed?: number;
        attackSpeed?: number;
        damage?: number;
        defense?: number;
    };
}

export interface BossData {
    id: BossType;
    name: string;
    floor: number;
    difficulty: 'easy' | 'medium' | 'hard' | 'extreme';

    // 기본 스탯
    health: number;
    attack: number;
    defense: number;
    speed: number;

    // 크기
    width: number;
    height: number;

    // 페이즈
    totalPhases: number;
    phases: BossPhase[];

    // 보상
    rewards: {
        soulPoints: number;
        gold: number;
        guaranteedDrops?: string[];
        questProgress?: string;
        unlocks?: string[];
    };

    // 렌더링
    color: string;
    spriteKey?: string;
}

// ============================================
// 입력 시스템
// ============================================
export interface InputState {
    keys: Record<string, boolean>;
    mouse: {
        x: number;
        y: number;
        leftButton: boolean;
        rightButton: boolean;
    };
}

// ============================================
// 카메라
// ============================================
export interface CameraState {
    x: number;
    y: number;
    zoom: number;
    target: Position | null;
}

// ============================================
// 렌더링
// ============================================
export interface RenderContext {
    ctx: CanvasRenderingContext2D;
    camera: CameraState;
    deltaTime: number;
}

// ============================================
// 파티클 시스템
// ============================================
export interface Particle {
    x: number;
    y: number;
    velocityX: number;
    velocityY: number;
    life: number;
    maxLife: number;
    color: string;
    size: number;
    alpha: number;
}

// ============================================
// 투사체 시스템
// ============================================
export interface Projectile {
    id: string;
    x: number;
    y: number;
    velocityX: number;
    velocityY: number;
    damage: number;
    radius: number;
    color: string;
    owner: 'player' | 'enemy' | 'boss';
    lifetime: number;
    maxLifetime: number;
    homing: boolean;
    target?: Position;
    piercing?: boolean;
    hitCount?: number;
    maxHits?: number;
}

// ============================================
// 버프 시스템
// ============================================
export type BuffType =
    | 'attack_up'
    | 'attack_down'
    | 'defense_up'
    | 'defense_down'
    | 'speed_up'
    | 'speed_down'
    | 'invulnerable'
    | 'stun'
    | 'burning'
    | 'frozen'
    | 'poisoned'
    | 'regeneration';

export interface Buff {
    id: string;
    type: BuffType;
    duration: number;
    remainingTime: number;
    value: number;
    isMultiplier: boolean; // true면 곱연산, false면 덧셈
    stackable: boolean;
    stacks: number;
    maxStacks: number;
}

// ============================================
// 저장 데이터
// ============================================
export interface SaveData {
    version: string;
    timestamp: number;
    gameState: GameState;
    playerState: PlayerState;
    questData: any;
    metaProgress: GameProgress;
}

// ============================================
// 설정
// ============================================
export interface GameSettings {
    volume: {
        master: number;
        bgm: number;
        sfx: number;
    };
    graphics: {
        particleQuality: 'low' | 'medium' | 'high';
        screenShake: boolean;
    };
    controls: {
        moveUp: string;
        moveDown: string;
        moveLeft: string;
        moveRight: string;
        attack: string;
        dodge: string;
        skill1: string;
        skill2: string;
        skill3: string;
    };
}