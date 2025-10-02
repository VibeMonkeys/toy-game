/**
 * 👑 보스 데이터베이스
 *
 * 모든 보스 데이터 정의
 */

import { BossType, BossData, BossPhase, BossPattern } from '../types';
import { COLORS } from '../utils/Constants';

// ============================================
// 5층 보스: 고블린 킹
// ============================================
const GOBLIN_KING: BossData = {
    id: 'goblin_king',
    name: '고블린 킹',
    floor: 5,
    difficulty: 'easy',

    health: 800,
    attack: 25,
    defense: 10,
    speed: 100,

    width: 48,
    height: 48,

    totalPhases: 1,
    phases: [
        {
            phase: 1,
            healthRange: [100, 0],
            patterns: [
                {
                    id: 'charge',
                    name: '돌진 공격',
                    frequency: 'main',
                    cooldown: 4000,
                    counterplay: '좌우 회피',
                    sequence: [
                        {
                            action: 'telegraph',
                            duration: 1000,
                            visual: '붉은 선 표시'
                        },
                        {
                            action: 'move',
                            duration: 500,
                            speed: 400,
                            distance: 200,
                            targetPlayer: true
                        },
                        {
                            action: 'attack',
                            duration: 100,
                            damage: 30,
                            range: 60
                        },
                        {
                            action: 'recovery',
                            duration: 1000,
                            vulnerable: true
                        }
                    ]
                },
                {
                    id: 'cleave',
                    name: '회전 베기',
                    frequency: 'filler',
                    cooldown: 3000,
                    counterplay: '후퇴',
                    sequence: [
                        {
                            action: 'telegraph',
                            duration: 500,
                            visual: '도끼 들어올림'
                        },
                        {
                            action: 'aoe',
                            duration: 300,
                            damage: 25,
                            aoeRadius: 80
                        },
                        {
                            action: 'recovery',
                            duration: 800
                        }
                    ]
                },
                {
                    id: 'summon',
                    name: '고블린 소환',
                    frequency: 'special',
                    cooldown: 15000,
                    counterplay: '채널링 중 공격',
                    sequence: [
                        {
                            action: 'telegraph',
                            duration: 2000,
                            visual: '땅에서 빛나는 원',
                            interrupt: true
                        },
                        {
                            action: 'summon',
                            duration: 500,
                            summonType: 'goblin',
                            summonCount: 2
                        }
                    ]
                }
            ]
        }
    ],

    rewards: {
        soulPoints: 100,
        gold: 200,
        guaranteedDrops: ['iron_sword']
    },

    color: '#8B4513',
    spriteKey: 'goblin_king'
};

// ============================================
// 10층 보스: 오크 워로드 (2페이즈)
// ============================================
const ORC_WARLORD: BossData = {
    id: 'orc_warlord',
    name: '오크 워로드',
    floor: 10,
    difficulty: 'medium',

    health: 1800,
    attack: 40,
    defense: 20,
    speed: 90,

    width: 56,
    height: 56,

    totalPhases: 2,
    phases: [
        // Phase 1
        {
            phase: 1,
            healthRange: [100, 50],
            patterns: [
                {
                    id: 'ground_slam',
                    name: '대지 강타',
                    frequency: 'main',
                    cooldown: 6000,
                    counterplay: '충격파 사이로 이동',
                    sequence: [
                        {
                            action: 'telegraph',
                            duration: 800,
                            visual: '공중으로 점프'
                        },
                        {
                            action: 'aoe',
                            duration: 200,
                            damage: 50,
                            aoeRadius: 150
                        },
                        {
                            action: 'recovery',
                            duration: 1500,
                            vulnerable: true
                        }
                    ]
                },
                {
                    id: 'rage_roar',
                    name: '분노의 함성',
                    frequency: 'special',
                    cooldown: 12000,
                    counterplay: '버프 중 거리 유지',
                    sequence: [
                        {
                            action: 'telegraph',
                            duration: 500,
                            visual: '붉은 오라'
                        },
                        {
                            action: 'buff',
                            duration: 500,
                            buffType: 'speed_up', // 공격 속도 증가 → 이동 속도 증가로 해석
                            buffDuration: 10000,
                            buffValue: 1.5
                        }
                    ]
                },
                {
                    id: 'axe_combo',
                    name: '도끼 연타',
                    frequency: 'filler',
                    cooldown: 5000,
                    counterplay: '중간에 회피',
                    sequence: [
                        {
                            action: 'attack',
                            duration: 300,
                            damage: 30,
                            range: 70
                        },
                        {
                            action: 'attack',
                            duration: 300,
                            damage: 35,
                            range: 70
                        },
                        {
                            action: 'attack',
                            duration: 400,
                            damage: 45,
                            range: 70
                        }
                    ]
                }
            ]
        },
        // Phase 2
        {
            phase: 2,
            healthRange: [50, 0],
            phaseTransition: {
                animation: 'transformation',
                duration: 2000,
                message: '분노가 폭발한다!',
                invulnerable: true,
                effect: '화면 붉게'
            },
            modifiers: {
                speed: 1.5,
                attackSpeed: 1.8,
                damage: 1.3
            },
            patterns: [
                {
                    id: 'berserk_rush',
                    name: '광폭 돌진',
                    frequency: 'main',
                    cooldown: 8000,
                    counterplay: '빠른 회피',
                    sequence: [
                        {
                            action: 'move',
                            duration: 400,
                            speed: 500,
                            distance: 200,
                            targetPlayer: true
                        },
                        {
                            action: 'attack',
                            duration: 200,
                            damage: 60,
                            range: 80
                        },
                        {
                            action: 'move',
                            duration: 400,
                            speed: 500,
                            distance: 200,
                            targetPlayer: true
                        },
                        {
                            action: 'attack',
                            duration: 200,
                            damage: 60,
                            range: 80
                        },
                        {
                            action: 'recovery',
                            duration: 1500,
                            vulnerable: true
                        }
                    ]
                },
                // Phase 1 패턴도 사용 (더 빠르게)
                {
                    id: 'ground_slam_fast',
                    name: '빠른 대지 강타',
                    frequency: 'filler',
                    cooldown: 4000,
                    counterplay: '빠른 판단',
                    sequence: [
                        {
                            action: 'telegraph',
                            duration: 500,
                            visual: '빠른 점프'
                        },
                        {
                            action: 'aoe',
                            duration: 200,
                            damage: 70,
                            aoeRadius: 150
                        }
                    ]
                },
                {
                    id: 'axe_combo_fast',
                    name: '빠른 도끼 연타',
                    frequency: 'filler',
                    cooldown: 3000,
                    counterplay: '즉시 회피',
                    sequence: [
                        {
                            action: 'attack',
                            duration: 200,
                            damage: 40,
                            range: 70
                        },
                        {
                            action: 'attack',
                            duration: 200,
                            damage: 50,
                            range: 70
                        },
                        {
                            action: 'attack',
                            duration: 300,
                            damage: 70,
                            range: 70
                        }
                    ]
                }
            ]
        }
    ],

    rewards: {
        soulPoints: 250,
        gold: 500,
        guaranteedDrops: ['steel_axe'],
        questProgress: 'main_quest_10'
    },

    color: '#2F4F2F',
    spriteKey: 'orc_warlord'
};

// ============================================
// 15층 보스: 언데드 로드 (마법 보스, 2페이즈)
// ============================================
const UNDEAD_LORD: BossData = {
    id: 'undead_lord',
    name: '언데드 로드',
    floor: 15,
    difficulty: 'hard',

    health: 3000,
    attack: 55,
    defense: 25,
    speed: 80,

    width: 60,
    height: 60,

    totalPhases: 2,
    phases: [
        // Phase 1
        {
            phase: 1,
            healthRange: [100, 60],
            patterns: [
                {
                    id: 'dark_projectile',
                    name: '암흑 구체',
                    frequency: 'main',
                    cooldown: 2000,
                    counterplay: '패턴 읽고 회피',
                    sequence: [
                        {
                            action: 'telegraph',
                            duration: 500,
                            visual: '암흑 기운'
                        },
                        {
                            action: 'projectile',
                            duration: 100,
                            damage: 40,
                            projectileCount: 3,
                            projectileSpeed: 200,
                            homing: false
                        }
                    ]
                },
                {
                    id: 'shadow_spear',
                    name: '그림자 창',
                    frequency: 'filler',
                    cooldown: 5000,
                    counterplay: '표시 보고 이동',
                    sequence: [
                        {
                            action: 'telegraph',
                            duration: 1500,
                            visual: '땅에 붉은 원'
                        },
                        {
                            action: 'aoe',
                            duration: 200,
                            damage: 80,
                            aoeRadius: 60
                        }
                    ]
                },
                {
                    id: 'summon_skeleton',
                    name: '스켈레톤 소환',
                    frequency: 'special',
                    cooldown: 12000,
                    counterplay: '빠르게 처치',
                    sequence: [
                        {
                            action: 'telegraph',
                            duration: 1000,
                            visual: '소환진'
                        },
                        {
                            action: 'summon',
                            duration: 500,
                            summonType: 'skeleton',
                            summonCount: 4
                        }
                    ]
                }
            ]
        },
        // Phase 2
        {
            phase: 2,
            healthRange: [60, 0],
            phaseTransition: {
                animation: 'dark_transformation',
                duration: 2500,
                message: '어둠의 힘이 폭발한다!',
                invulnerable: true,
                effect: '화면 어두워짐'
            },
            modifiers: {
                speed: 1.2,
                damage: 1.4
            },
            patterns: [
                {
                    id: 'dark_rain',
                    name: '암흑의 비',
                    frequency: 'special',
                    cooldown: 10000,
                    counterplay: '끊임없이 이동',
                    sequence: [
                        {
                            action: 'telegraph',
                            duration: 1000,
                            visual: '하늘이 어두워짐'
                        },
                        {
                            action: 'projectile',
                            duration: 5000,
                            damage: 35,
                            projectileCount: 30
                        }
                    ]
                },
                // Phase 1 강화 패턴
                {
                    id: 'dark_projectile_homing',
                    name: '추적 암흑 구체',
                    frequency: 'main',
                    cooldown: 2500,
                    counterplay: '계속 이동',
                    sequence: [
                        {
                            action: 'projectile',
                            duration: 100,
                            damage: 50,
                            projectileCount: 5,
                            projectileSpeed: 150,
                            homing: true
                        }
                    ]
                },
                {
                    id: 'summon_skeleton_mass',
                    name: '대량 소환',
                    frequency: 'special',
                    cooldown: 15000,
                    counterplay: '광역 공격',
                    sequence: [
                        {
                            action: 'summon',
                            duration: 500,
                            summonType: 'skeleton',
                            summonCount: 6
                        }
                    ]
                }
            ]
        }
    ],

    rewards: {
        soulPoints: 500,
        gold: 1000,
        guaranteedDrops: ['undead_staff'],
        questProgress: 'main_quest_15'
    },

    color: '#4B0082',
    spriteKey: 'undead_lord'
};

// ============================================
// 20층 보스: 카오스 드래곤 (최종 보스, 3페이즈)
// ============================================
const CHAOS_DRAGON: BossData = {
    id: 'chaos_dragon',
    name: '카오스 드래곤',
    floor: 20,
    difficulty: 'extreme',

    health: 5000,
    attack: 70,
    defense: 35,
    speed: 110,

    width: 80,
    height: 80,

    totalPhases: 3,
    phases: [
        // Phase 1
        {
            phase: 1,
            healthRange: [100, 70],
            patterns: [
                {
                    id: 'fire_breath',
                    name: '화염 브레스',
                    frequency: 'main',
                    cooldown: 5000,
                    counterplay: '측면 회피',
                    sequence: [
                        {
                            action: 'telegraph',
                            duration: 1000,
                            visual: '입에서 불빛'
                        },
                        {
                            action: 'aoe',
                            duration: 1000,
                            damage: 60,
                            aoeRadius: 200,
                            range: 300
                        }
                    ]
                },
                {
                    id: 'tail_swipe',
                    name: '꼬리 후려치기',
                    frequency: 'filler',
                    cooldown: 4000,
                    counterplay: '점프 or 후퇴',
                    sequence: [
                        {
                            action: 'telegraph',
                            duration: 600,
                            visual: '꼬리 회전'
                        },
                        {
                            action: 'aoe',
                            duration: 300,
                            damage: 70,
                            aoeRadius: 120,
                            knockback: 150
                        }
                    ]
                },
                {
                    id: 'aerial_dive',
                    name: '공중 급강하',
                    frequency: 'special',
                    cooldown: 12000,
                    counterplay: '붉은 원 밖으로',
                    sequence: [
                        {
                            action: 'move',
                            duration: 1000,
                            visual: '공중으로 날아오름',
                            invulnerable: true
                        },
                        {
                            action: 'telegraph',
                            duration: 1500,
                            visual: '플레이어 위치에 붉은 원'
                        },
                        {
                            action: 'aoe',
                            duration: 300,
                            damage: 100,
                            aoeRadius: 100
                        },
                        {
                            action: 'recovery',
                            duration: 2000,
                            vulnerable: true
                        }
                    ]
                }
            ]
        },
        // Phase 2
        {
            phase: 2,
            healthRange: [70, 40],
            phaseTransition: {
                animation: 'enrage',
                duration: 3000,
                message: '드래곤의 분노가 하늘을 태운다!',
                invulnerable: true,
                effect: '화면 붉게 변함'
            },
            modifiers: {
                speed: 1.3,
                damage: 1.3
            },
            patterns: [
                {
                    id: 'meteor',
                    name: '메테오 낙하',
                    frequency: 'special',
                    cooldown: 10000,
                    counterplay: '낙하 위치 회피',
                    sequence: [
                        {
                            action: 'telegraph',
                            duration: 2000,
                            visual: '하늘에서 붉은 표시'
                        },
                        {
                            action: 'aoe',
                            duration: 500,
                            damage: 90,
                            aoeRadius: 80
                        }
                    ]
                },
                {
                    id: 'flame_pillar',
                    name: '화염 기둥',
                    frequency: 'main',
                    cooldown: 8000,
                    counterplay: '기둥 사이로 이동',
                    sequence: [
                        {
                            action: 'telegraph',
                            duration: 1000,
                            visual: '원형 배치 표시'
                        },
                        {
                            action: 'aoe',
                            duration: 4000,
                            damage: 50,
                            aoeRadius: 50
                        }
                    ]
                },
                // Phase 1 강화 패턴
                {
                    id: 'fire_breath_wide',
                    name: '강화 화염 브레스',
                    frequency: 'filler',
                    cooldown: 4000,
                    counterplay: '멀리 도망',
                    sequence: [
                        {
                            action: 'telegraph',
                            duration: 800,
                            visual: '더 큰 불빛'
                        },
                        {
                            action: 'aoe',
                            duration: 1000,
                            damage: 80,
                            aoeRadius: 250,
                            range: 400
                        }
                    ]
                }
            ]
        },
        // Phase 3 (최후의 발악)
        {
            phase: 3,
            healthRange: [40, 0],
            phaseTransition: {
                animation: 'chaos_awakening',
                duration: 3500,
                message: '혼돈의 진정한 힘이 깨어난다!',
                invulnerable: true,
                effect: '화면 격렬하게 흔들림'
            },
            modifiers: {
                speed: 1.5,
                attackSpeed: 2.0,
                damage: 1.5
            },
            patterns: [
                {
                    id: 'chaos_ultimate',
                    name: '카오스 노바',
                    frequency: 'special',
                    cooldown: 20000,
                    counterplay: '안전 지대로 5초 안에',
                    sequence: [
                        {
                            action: 'telegraph',
                            duration: 5000,
                            visual: '화면 전체 붉은색 + 경고음'
                        },
                        {
                            action: 'aoe',
                            duration: 1000,
                            damage: 300,
                            aoeRadius: 9999  // 화면 전체
                        }
                    ]
                },
                // 모든 이전 패턴 빠르게 사용
                {
                    id: 'fire_breath_rapid',
                    name: '연속 화염 브레스',
                    frequency: 'main',
                    cooldown: 3000,
                    counterplay: '계속 이동',
                    sequence: [
                        {
                            action: 'aoe',
                            duration: 500,
                            damage: 90,
                            aoeRadius: 200
                        }
                    ]
                },
                {
                    id: 'tail_swipe_rapid',
                    name: '연속 꼬리 공격',
                    frequency: 'filler',
                    cooldown: 2500,
                    counterplay: '빠른 회피',
                    sequence: [
                        {
                            action: 'aoe',
                            duration: 200,
                            damage: 85,
                            aoeRadius: 120
                        }
                    ]
                }
            ]
        }
    ],

    rewards: {
        soulPoints: 1000,
        gold: 2000,
        guaranteedDrops: ['dragon_scale', 'chaos_essence'],
        unlocks: ['true_ending', 'new_game_plus']
    },

    color: '#8B0000',
    spriteKey: 'chaos_dragon'
};

// ============================================
// 보스 데이터베이스
// ============================================
export const BOSS_DATABASE: Record<BossType, BossData> = {
    goblin_king: GOBLIN_KING,
    orc_warlord: ORC_WARLORD,
    undead_lord: UNDEAD_LORD,
    chaos_dragon: CHAOS_DRAGON,
    true_chaos: CHAOS_DRAGON  // TODO: 25층 히든 보스 추후 추가
};

/**
 * 층수로 보스 데이터 가져오기
 */
export function getBossDataByFloor(floor: number): BossData | null {
    const bossId = getBossIdByFloor(floor);
    return bossId ? BOSS_DATABASE[bossId] : null;
}

/**
 * 층수로 보스 ID 가져오기
 */
export function getBossIdByFloor(floor: number): BossType | null {
    switch(floor) {
        case 5: return 'goblin_king';
        case 10: return 'orc_warlord';
        case 15: return 'undead_lord';
        case 20: return 'chaos_dragon';
        default: return null;
    }
}

/**
 * 보스 체력 계산 (층수 기반)
 */
export function calculateBossHealth(floor: number): number {
    return 500 + (floor * 200) + (floor * floor * 10);
}
