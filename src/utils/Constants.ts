/**
 * 🎮 최진안의 이세계 모험기 - 게임 상수 정의 (TypeScript)
 *
 * 모든 게임 상수를 중앙에서 관리합니다.
 * 기획서 문서와 일치하도록 설계되었습니다.
 */

import { GameMode, WeaponType, SkillType, EnemyType, BossType, ItemRarity } from '../types';

// 게임 모드 정의
export const GAME_MODES = {
    LOADING: GameMode.LOADING,
    TITLE: GameMode.TITLE,
    INTRO: GameMode.INTRO,
    PLAYING: GameMode.PLAYING,
    PAUSED: GameMode.PAUSED,
    GAME_OVER: GameMode.GAME_OVER,
    VICTORY: GameMode.VICTORY,
    SOUL_CHAMBER: GameMode.SOUL_CHAMBER
} as const;

// 화면 설정
export const SCREEN = {
    WIDTH: 1280,
    HEIGHT: 720,
    CENTER_X: 640,
    CENTER_Y: 360
} as const;

// 게임플레이 설정
export const GAMEPLAY = {
    TARGET_FPS: 60,
    MAX_FLOORS: 10,

    // 플레이어 기본 스탯
    PLAYER_BASE: {
        HEALTH: 100,
        MANA: 50,
        STAMINA: 100,
        ATTACK: 25,
        DEFENSE: 5,
        SPEED: 250,  // pixels per second (RPG 스타일로 증가)
        CRITICAL_CHANCE: 0.15,
        CRITICAL_DAMAGE: 1.5,
        LUCK: 0,
        COLOR: '#4A90E2'  // 파란색
    },

    // 소울 포인트 계산
    SOUL_POINTS: {
        PER_ENEMY: 2,
        PER_FLOOR: 10,
        PER_BOSS: 30
    },

    // 전투 시스템
    COMBAT: {
        COMBO_TIMEOUT: 1500, // ms
        COMBO_DAMAGE_MULTIPLIERS: [1.0, 1.1, 1.25, 1.5],
        DODGE_COOLDOWN: 1000, // ms
        DODGE_DISTANCE: 80,
        DODGE_INVULNERABLE_TIME: 150, // ms
        DODGE_STAMINA_COST: 20,
        PARRY_WINDOW: 200, // ms
        PARRY_STAMINA_COST: 30,
        BACKSTAB_MULTIPLIER: 2.0,
        HIT_STOP_DURATION: 50 // ms
    },

    // 스태미나
    STAMINA: {
        REGEN_RATE: 25, // per second
        DODGE_COST: 20,
        DASH_COST: 15,
        PARRY_COST: 30,
        HEAVY_ATTACK_COST: 25
    }
} as const;

// 무기 타입
export const WEAPON_TYPES: Record<string, WeaponType> = {
    SWORD: 'sword',
    DAGGER: 'dagger',
    AXE: 'axe',
    BOW: 'bow',
    STAFF: 'staff'
} as const;

// 스킬 타입
export const SKILL_TYPES: Record<string, SkillType> = {
    FIREBALL: 'fireball',
    LIGHTNING: 'lightning',
    ICE_SPIKE: 'iceSpike',
    HEAL: 'heal',
    DASH: 'dash',
    SHIELD: 'shield'
} as const;

// 적 타입
export const ENEMIES: Record<string, EnemyType> = {
    GOBLIN: 'goblin',
    ORC: 'orc',
    SKELETON: 'skeleton',
    TROLL: 'troll',
    WRAITH: 'wraith'
} as const;

// 보스 타입
export const BOSSES: Record<string, BossType> = {
    GOBLIN_CHIEFTAIN: 'goblin_chieftain',
    ORC_CHIEFTAIN: 'orc_chieftain',
    TROLL_KING: 'troll_king',
    SKELETON_LORD: 'skeleton_lord',
    DEATH_KNIGHT: 'death_knight',
    CHAOS_LORD: 'chaos_lord'
} as const;

// 방 타입
export const ROOM_TYPES = {
    ENTRANCE: 'entrance',
    COMBAT: 'combat',
    TREASURE: 'treasure',
    SHOP: 'shop',
    REST: 'rest',
    BOSS: 'boss',
    SECRET: 'secret',
    EXIT: 'exit'
} as const;

// 아이템 희귀도
export const ITEM_RARITY: Record<string, ItemRarity> = {
    COMMON: ItemRarity.COMMON,
    UNCOMMON: ItemRarity.UNCOMMON,
    RARE: ItemRarity.RARE,
    EPIC: ItemRarity.EPIC,
    LEGENDARY: ItemRarity.LEGENDARY
} as const;

// 아이템 희귀도별 색상
export const RARITY_COLORS: Record<ItemRarity, string> = {
    [ItemRarity.COMMON]: '#9e9e9e',
    [ItemRarity.UNCOMMON]: '#4caf50',
    [ItemRarity.RARE]: '#2196f3',
    [ItemRarity.EPIC]: '#9c27b0',
    [ItemRarity.LEGENDARY]: '#ff9800'
} as const;

// 퀘스트 타입
export const QUEST_TYPES = {
    MAIN: 'MAIN',
    SIDE: 'SIDE'
} as const;

// 아이템 타입
export const ITEMS = {
    // 포션
    HEALING_POTION: 'healing_potion',
    MANA_POTION: 'mana_potion',
    GREATER_HEALING_POTION: 'greater_healing_potion',

    // 무기
    IRON_SWORD: 'iron_sword',
    STEEL_AXE: 'steel_axe',
    SILVER_BOW: 'silver_bow',
    CRYSTAL_STAFF: 'crystal_staff',
    LEGENDARY_HAMMER: 'legendary_hammer',
    DIVINE_BLADE: 'divine_blade',

    // 재료
    COPPER_COIN: 'copper_coin',
    SILVER_COIN: 'silver_coin',
    BONE_ARROW: 'bone_arrow',
    TROLL_HIDE: 'troll_hide',
    SPIRIT_ESSENCE: 'spirit_essence',
    MAGIC_SCROLL: 'magic_scroll'
} as const;

// 컨트롤 키 매핑
export const CONTROLS = {
    // 이동
    MOVE_UP: 'KeyW',
    MOVE_DOWN: 'KeyS',
    MOVE_LEFT: 'KeyA',
    MOVE_RIGHT: 'KeyD',

    // 액션
    ATTACK: 'Space',
    DODGE: 'KeyX',
    PARRY: 'KeyC',
    SKILL_1: 'Digit1',
    SKILL_2: 'Digit2',
    SKILL_3: 'Digit3',
    POTION_1: 'Digit4',
    POTION_2: 'Digit5',
    WEAPON_SWITCH: 'KeyQ',

    // UI
    INVENTORY: 'KeyI',
    SKILLS: 'KeyK',
    MAP: 'KeyM',
    PAUSE: 'Escape',
    INTERACT: 'KeyE'
} as const;

// 스토리 막 구성
export const STORY_ACTS = {
    ACT_1: {
        name: '깨어남',
        floors: [1, 2],
        theme: '혼란과 적응',
        description: '이상한 곳에서 눈을 뜬 당신. 생존을 위해 싸워야 합니다.'
    },
    ACT_2: {
        name: '각성',
        floors: [3, 4, 5],
        theme: '자신감과 성장',
        description: '힘을 얻고 진정한 모험가로 거듭납니다.'
    },
    ACT_3: {
        name: '시련',
        floors: [6, 7, 8, 9],
        theme: '좌절과 성숙',
        description: '강력한 적들과 맞서며 한계를 극복합니다.'
    },
    ACT_4: {
        name: '완성',
        floors: [10],
        theme: '깨달음과 완성',
        description: '최종 시험을 통과하고 진정한 영웅이 됩니다.'
    }
} as const;

// 사운드 볼륨 설정
export const AUDIO = {
    MASTER_VOLUME: 1.0,
    MUSIC_VOLUME: 0.7,
    SFX_VOLUME: 0.8,
    VOICE_VOLUME: 0.9
} as const;

// 디버그 설정
export const DEBUG = {
    ENABLED: false,
    SHOW_FPS: false,
    SHOW_HITBOXES: false,
    SHOW_GRID: false,
    GOD_MODE: false,
    SHOW_AI_STATE: false
} as const;

// 색상 팔레트
export const COLORS = {
    // 기본 색상
    PRIMARY: '#2196F3',
    SECONDARY: '#FF9800',
    SUCCESS: '#4CAF50',
    WARNING: '#FF5722',
    ERROR: '#F44336',

    // 게임 요소
    PLAYER: '#4CAF50',
    ENEMY: '#F44336',
    BOSS: '#9C27B0',
    GOBLIN: '#8BC34A',
    ORC: '#FF5722',
    SKELETON: '#9E9E9E',
    TROLL: '#795548',
    WRAITH: '#673AB7',

    // UI 색상
    BACKGROUND: '#212121',
    PANEL: '#424242',
    TEXT: '#FFFFFF',
    TEXT_SECONDARY: '#BDBDBD',
    BORDER: '#616161',

    // 게임플레이 색상
    HEALTH: '#4CAF50',
    MANA: '#2196F3',
    STAMINA: '#FFD700',
    EXPERIENCE: '#FF9800',
    SOUL: '#9C27B0',
    DAMAGE: '#FF4444',
    HEALING: '#44FF44',
    GOLD: '#FFD700',

    // 효과 색상
    HIT_EFFECT: '#FFFF00',
    CRITICAL_HIT: '#FF0000',
    LEVEL_UP: '#FFD700',
    QUEST_COMPLETE: '#00FF00',
    ITEM: '#FFAA00',
    DEBUG: '#00FF00'
} as const;

// 애니메이션 상수
export const ANIMATIONS = {
    FADE_DURATION: 500,
    SLIDE_DURATION: 300,
    BOUNCE_DURATION: 400,
    PULSE_DURATION: 1000,
    HIT_STOP: {
        NORMAL: 50,
        CRITICAL: 100,
        COMBO_FINISH: 150,
        BOSS_FINISH: 300
    }
} as const;

// ============================================
// 유틸리티 함수들
// ============================================

/**
 * 업그레이드 비용 계산
 */
export function calculateUpgradeCost(
    baseCost: number,
    currentLevel: number,
    scalingFactor: number = 1.4
): number {
    return Math.floor(baseCost * Math.pow(scalingFactor, currentLevel));
}

/**
 * 적 스케일링 계산
 */
export function calculateEnemyScaling(baseValue: number, floor: number): number {
    return Math.floor(baseValue * (1 + (floor - 1) * 0.15));
}

/**
 * 소울 포인트 계산
 */
export function calculateSoulPoints(
    floor: number,
    enemiesKilled: number,
    bossKilled: boolean = false
): number {
    let points = floor * GAMEPLAY.SOUL_POINTS.PER_FLOOR;
    points += enemiesKilled * GAMEPLAY.SOUL_POINTS.PER_ENEMY;
    if (bossKilled) {
        points += GAMEPLAY.SOUL_POINTS.PER_BOSS;
    }
    return points;
}

/**
 * 콤보 데미지 계산
 */
export function getComboMultiplier(comboCount: number): number {
    const multipliers = GAMEPLAY.COMBAT.COMBO_DAMAGE_MULTIPLIERS;
    const index = Math.min(comboCount - 1, multipliers.length - 1);
    return multipliers[Math.max(0, index)];
}

/**
 * 크리티컬 데미지 계산
 */
export function calculateCriticalDamage(
    baseDamage: number,
    criticalMultiplier: number = 1.5
): number {
    return Math.floor(baseDamage * criticalMultiplier);
}

/**
 * 백스탭 데미지 계산
 */
export function calculateBackstabDamage(baseDamage: number): number {
    return Math.floor(baseDamage * GAMEPLAY.COMBAT.BACKSTAB_MULTIPLIER);
}