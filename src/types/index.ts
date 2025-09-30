/**
 * 🎮 최진안의 이세계 모험기 - 타입 정의
 *
 * 게임의 모든 타입을 중앙에서 관리합니다.
 */

// ============================================
// 게임 모드
// ============================================
export enum GameMode {
    LOADING = 'LOADING',
    TITLE = 'TITLE',
    INTRO = 'INTRO',
    PLAYING = 'PLAYING',
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

export type WeaponType = 'sword' | 'dagger' | 'axe' | 'bow' | 'staff';
export type SkillType = 'fireball' | 'lightning' | 'iceSpike' | 'heal' | 'dash' | 'shield';

// ============================================
// 적 (Enemy)
// ============================================
export type EnemyType = 'goblin' | 'orc' | 'skeleton' | 'troll' | 'wraith';
export type BossType = 'goblin_chieftain' | 'orc_chieftain' | 'troll_king' | 'skeleton_lord' | 'death_knight' | 'chaos_lord';

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

export interface Item {
    id: string;
    name: string;
    type: 'weapon' | 'armor' | 'consumable' | 'rune';
    rarity: ItemRarity;
    description: string;
    effect?: any;
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
    name: string;
    frequency: 'main' | 'filler' | 'special';
    cooldown: number;
    sequence: PatternSequence[];
    counterplay: string;
}

export interface PatternSequence {
    action: string;
    duration: number;
    damage?: number;
    hitbox?: string;
    visual?: string;
    audio?: string;
    vulnerable?: boolean;
    interrupt?: boolean;
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