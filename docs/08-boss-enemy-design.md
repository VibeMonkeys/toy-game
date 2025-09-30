# 🏆 08. 보스 & 적 설계

## 📋 문서 정보
- **문서 버전**: v1.0
- **작성일**: 2025-09-28
- **담당 영역**: 적 AI 및 보스 전투 설계

---

## 👹 적 유형 분류

### 기본 적 카테고리

#### 티어 1: 일반 적 (1-3층)
```javascript
const Tier1Enemies = {
    GOBLIN: {
        name: '고블린',
        health: 40,
        damage: 12,
        speed: 1.2,
        behavior: 'aggressive',
        abilities: ['charge_attack'],
        dropRate: 'common'
    },

    SKELETON: {
        name: '해골병사',
        health: 35,
        damage: 15,
        speed: 0.9,
        behavior: 'defensive',
        abilities: ['shield_block'],
        dropRate: 'common'
    },

    SLIME: {
        name: '슬라임',
        health: 25,
        damage: 8,
        speed: 0.7,
        behavior: 'swarm',
        abilities: ['split_on_death'],
        dropRate: 'high'
    }
};
```

#### 티어 2: 정예 적 (4-6층)
```javascript
const Tier2Enemies = {
    ORC_WARRIOR: {
        name: '오크 전사',
        health: 80,
        damage: 25,
        speed: 1.0,
        behavior: 'berserker',
        abilities: ['rage_mode', 'heavy_slam'],
        dropRate: 'uncommon'
    },

    DARK_MAGE: {
        name: '암흑 마법사',
        health: 60,
        damage: 30,
        speed: 0.8,
        behavior: 'caster',
        abilities: ['fireball', 'teleport'],
        dropRate: 'rare'
    },

    ARMORED_KNIGHT: {
        name: '갑옷 기사',
        health: 120,
        damage: 20,
        speed: 0.6,
        behavior: 'tank',
        abilities: ['shield_wall', 'counter_attack'],
        dropRate: 'uncommon'
    }
};
```

#### 티어 3: 강력한 적 (7-9층)
```javascript
const Tier3Enemies = {
    DEMON_ASSASSIN: {
        name: '악마 암살자',
        health: 90,
        damage: 45,
        speed: 1.8,
        behavior: 'stealth',
        abilities: ['invisible', 'backstab', 'shadow_clone'],
        dropRate: 'rare'
    },

    ELEMENTAL_GUARDIAN: {
        name: '원소 수호자',
        health: 150,
        damage: 35,
        speed: 0.7,
        behavior: 'elemental',
        abilities: ['element_swap', 'area_blast'],
        dropRate: 'epic'
    },

    LICH: {
        name: '리치',
        health: 100,
        damage: 50,
        speed: 0.5,
        behavior: 'summoner',
        abilities: ['raise_skeleton', 'death_ray', 'life_drain'],
        dropRate: 'epic'
    }
};
```

---

## 🤖 적 AI 행동 시스템

### 행동 상태 머신

#### 기본 AI 상태
```javascript
const EnemyAIStates = {
    IDLE: {
        name: '대기',
        behavior: 'patrol_or_stand',
        transitionConditions: {
            playerDetected: 'ALERT',
            damageTaken: 'COMBAT'
        }
    },

    ALERT: {
        name: '경계',
        behavior: 'investigate_disturbance',
        duration: 3000,
        transitionConditions: {
            playerFound: 'COMBAT',
            timeout: 'IDLE'
        }
    },

    COMBAT: {
        name: '전투',
        behavior: 'engage_player',
        transitionConditions: {
            playerOutOfRange: 'CHASE',
            healthLow: 'RETREAT',
            playerDead: 'VICTORY'
        }
    },

    CHASE: {
        name: '추격',
        behavior: 'pursue_player',
        maxDistance: 300,
        transitionConditions: {
            playerInRange: 'COMBAT',
            tooFar: 'RETURN'
        }
    },

    RETREAT: {
        name: '후퇴',
        behavior: 'flee_from_player',
        triggerHealth: 0.2,  // 체력 20% 이하
        transitionConditions: {
            safeDistance: 'HEAL',
            cornered: 'DESPERATE'
        }
    }
};
```

#### 고급 AI 패턴
```javascript
const AdvancedAIPatterns = {
    FLANKING: {
        description: '측면 공격',
        condition: 'multiple_enemies_present',
        behavior: 'circle_around_player',
        coordination: true
    },

    KITING: {
        description: '견제',
        condition: 'ranged_enemy + low_health',
        behavior: 'maintain_distance_while_attacking',
        minDistance: 100
    },

    AMBUSH: {
        description: '매복',
        condition: 'stealth_capable',
        behavior: 'hide_until_player_close',
        triggerDistance: 50
    },

    BERSERKER: {
        description: '광전사 모드',
        condition: 'health_below_50_percent',
        behavior: 'ignore_damage_attack_rapidly',
        damageBonus: 1.5,
        speedBonus: 1.3
    }
};
```

### 그룹 전술 시스템

#### 적 조합 패턴
```javascript
const EnemyFormations = {
    BASIC_PATROL: {
        composition: [
            { type: 'GOBLIN', count: 2 },
            { type: 'SKELETON', count: 1 }
        ],
        formation: 'line',
        tactics: 'simple_rush'
    },

    MIXED_SQUAD: {
        composition: [
            { type: 'ORC_WARRIOR', count: 1, role: 'tank' },
            { type: 'DARK_MAGE', count: 1, role: 'dps' },
            { type: 'GOBLIN', count: 2, role: 'fodder' }
        ],
        formation: 'protected_caster',
        tactics: 'tank_and_spank'
    },

    ELITE_FORMATION: {
        composition: [
            { type: 'ARMORED_KNIGHT', count: 2, role: 'frontline' },
            { type: 'DARK_MAGE', count: 1, role: 'support' },
            { type: 'DEMON_ASSASSIN', count: 1, role: 'flanker' }
        ],
        formation: 'tactical_square',
        tactics: 'coordinated_assault'
    }
};
```

#### 전술 실행 시스템
```javascript
const TacticalAI = {
    // 역할 기반 행동
    roleBasedBehavior: {
        TANK: {
            priority: 'protect_allies',
            positioning: 'frontline',
            abilities: ['taunt', 'shield_wall']
        },
        DPS: {
            priority: 'damage_player',
            positioning: 'optimal_range',
            abilities: ['heavy_attack', 'burst_damage']
        },
        SUPPORT: {
            priority: 'assist_allies',
            positioning: 'backline',
            abilities: ['heal', 'buff', 'debuff']
        },
        FLANKER: {
            priority: 'flank_player',
            positioning: 'mobile',
            abilities: ['stealth', 'mobility']
        }
    },

    // 동적 전술 변경
    adaptiveTactics: {
        playerLowHealth: 'aggressive_push',
        allyLowHealth: 'defensive_formation',
        playerRanged: 'spread_formation',
        playerMelee: 'surround_formation'
    }
};
```

---

## 👑 보스 설계

### 층별 보스 (스토리 막별 배치)

#### 층 2: 고블린 족장 (1막 - 튜토리얼 보스)
```javascript
const GoblinChief = {
    name: '고블린 족장',
    health: 200,
    phases: 1,

    phase1: {
        healthRange: [100, 0],
        abilities: [
            {
                name: '돌진 공격',
                damage: 30,
                cooldown: 4000,
                pattern: 'charge_straight_line',
                telegraph: 1000    // 1초 예고
            },
            {
                name: '도끼 휘두르기',
                damage: 25,
                cooldown: 3000,
                pattern: 'melee_cone_attack',
                range: 120
            },
            {
                name: '고블린 소환',
                summons: 2,
                cooldown: 8000,
                pattern: 'spawn_minions'
            }
        ]
    },

    mechanics: {
        vulnerability: 'none',
        immunities: ['poison'],
        specialRules: 'tutorial_boss_reduced_damage'
    }
};
```

#### 층 4: 오크 족장 (2막 - 첫 번째 진짜 보스)
```javascript
const OrcChieftain = {
    name: '오크 족장',
    health: 400,
    phases: 2,

    phase1: {
        healthRange: [100, 50],
        abilities: [
            {
                name: '대지 강타',
                damage: 40,
                cooldown: 5000,
                pattern: 'ground_slam_shockwave',
                aoeRadius: 150
            },
            {
                name: '분노의 함성',
                effect: 'buff_nearby_enemies',
                cooldown: 10000,
                buffDuration: 8000
            }
        ]
    },

    phase2: {
        healthRange: [50, 0],
        trigger: 'berserker_mode',
        changes: {
            attackSpeed: '+50%',
            movementSpeed: '+30%',
            newAbility: 'whirlwind_attack'
        },
        abilities: [
            {
                name: '회전 베기',
                damage: 35,
                cooldown: 3000,
                pattern: 'spinning_melee_attack',
                duration: 2000
            }
        ]
    }
};
```

#### 층 6: 어둠의 마법사 (3막 - 마법 보스)
```javascript
const DarkSorcerer = {
    name: '어둠의 마법사',
    health: 350,
    phases: 2,

    phase1: {
        healthRange: [100, 60],
        abilities: [
            {
                name: '파이어볼',
                damage: 45,
                cooldown: 2500,
                pattern: 'projectile_with_explosion',
                projectileSpeed: 200
            },
            {
                name: '텔레포트',
                cooldown: 6000,
                pattern: 'blink_to_random_location',
                invulnerabilityFrames: 500
            },
            {
                name: '마법 미사일',
                damage: 20,
                projectiles: 5,
                cooldown: 4000,
                pattern: 'homing_missiles'
            }
        ]
    },

    phase2: {
        healthRange: [60, 0],
        changes: {
            newAbility: 'shadow_clones',
            spellPower: '+25%'
        },
        abilities: [
            {
                name: '분신술',
                clones: 3,
                cooldown: 15000,
                duration: 10000,
                cloneHealth: 50
            },
            {
                name: '암흑 폭발',
                damage: 60,
                cooldown: 8000,
                pattern: 'delayed_large_aoe',
                warningTime: 2000
            }
        ]
    }
};
```

#### 층 8: 드래곤 기사 (3막 - 하이브리드 보스)
```javascript
const DragonKnight = {
    name: '드래곤 기사',
    health: 600,
    phases: 3,

    phase1: {
        healthRange: [100, 70],
        style: 'melee_focused',
        abilities: [
            {
                name: '용의 검격',
                damage: 50,
                cooldown: 3500,
                pattern: 'flame_sword_slash',
                fireTrail: true
            },
            {
                name: '화염 방패',
                effect: 'reflect_damage',
                cooldown: 12000,
                duration: 5000
            }
        ]
    },

    phase2: {
        healthRange: [70, 30],
        style: 'mixed_combat',
        changes: {
            newAbility: 'dragon_breath',
            mobility: '+40%'
        },
        abilities: [
            {
                name: '드래곤 브레스',
                damage: 40,
                cooldown: 6000,
                pattern: 'cone_of_fire',
                range: 250
            },
            {
                name: '비행 돌진',
                damage: 60,
                cooldown: 8000,
                pattern: 'aerial_charge_attack'
            }
        ]
    },

    phase3: {
        healthRange: [30, 0],
        style: 'desperate_final_form',
        changes: {
            size: '+50%',
            allAbilities: 'enhanced',
            newAbility: 'meteor_rain'
        },
        abilities: [
            {
                name: '메테오 레인',
                damage: 80,
                cooldown: 10000,
                pattern: 'multiple_falling_meteors',
                meteorCount: 8,
                duration: 6000
            }
        ]
    }
};
```

#### 층 9: 데스 나이트 (4막 - 최종 관문)
```javascript
const DeathKnight = {
    name: '데스 나이트',
    health: 800,
    phases: 2,

    phase1: {
        healthRange: [100, 50],
        style: 'heavy_armor_tank',
        abilities: [
            {
                name: '사신의 낫',
                damage: 70,
                cooldown: 4000,
                pattern: 'wide_sweep_attack',
                range: 180
            },
            {
                name: '언데드 소환',
                summons: 3,
                cooldown: 8000,
                minionType: 'skeleton_warrior',
                minionHealth: 40
            },
            {
                name: '죽음의 시선',
                damage: 50,
                cooldown: 6000,
                pattern: 'targeted_beam_attack',
                debuff: 'movement_slow'
            }
        ]
    },

    phase2: {
        healthRange: [50, 0],
        trigger: 'death_rage_mode',
        changes: {
            attackSpeed: '+40%',
            movementSpeed: '+25%',
            newAbility: 'death_aura'
        },
        abilities: [
            {
                name: '죽음의 오라',
                effect: 'continuous_damage_field',
                damage: 15,
                radius: 120,
                duration: 'permanent'
            },
            {
                name: '절망의 일격',
                damage: 120,
                cooldown: 8000,
                pattern: 'charging_massive_attack',
                warningTime: 2000
            },
            {
                name: '영혼 흡수',
                effect: 'heal_self_by_damage_dealt',
                healRatio: 0.3,
                cooldown: 12000
            }
        ]
    },

    mechanics: {
        vulnerability: 'holy_damage',
        immunities: ['poison', 'fear'],
        specialRules: 'test_all_player_skills'
    }
};
```

#### 층 10: 최종 보스 - 카오스 로드
```javascript
const ChaosLord = {
    name: '카오스 로드',
    health: 1000,
    phases: 4,

    phase1: {
        name: '진실의 공개',
        healthRange: [100, 80],
        style: 'testing_player_resolve',
        storyElement: 'reveals_true_nature_and_purpose',
        abilities: [
            {
                name: '암흑 파동',
                damage: 60,
                cooldown: 4000,
                pattern: 'expanding_dark_ring'
            },
            {
                name: '그림자 창',
                damage: 70,
                cooldown: 5000,
                pattern: 'targeted_spear_from_ground'
            }
        ]
    },

    phase2: {
        name: '시험의 시작',
        healthRange: [80, 60],
        storyElement: 'begins_true_test_of_heroism',
        changes: {
            attackSpeed: '+30%',
            newAbility: 'heroism_testing'
        },
        abilities: [
            {
                name: '그림자 병사 소환',
                summons: 4,
                cooldown: 12000,
                minionType: 'shadow_warrior'
            },
            {
                name: '어둠의 검',
                damage: 85,
                cooldown: 3000,
                pattern: 'giant_sword_slash'
            }
        ]
    },

    phase3: {
        name: '진정한 시험',
        healthRange: [60, 30],
        storyElement: 'ultimate_test_of_worthiness',
        changes: {
            invulnerabilityPeriods: true,
            newAbility: 'reality_manipulation'
        },
        abilities: [
            {
                name: '차원 균열',
                effect: 'split_arena_into_sections',
                cooldown: 15000,
                duration: 8000
            },
            {
                name: '절망의 오라',
                effect: 'continuous_health_drain',
                damage: 10,
                interval: 1000
            }
        ]
    },

    phase4: {
        name: '영웅의 증명',
        healthRange: [30, 0],
        style: 'mutual_respect_battle',
        storyElement: 'final_test_and_recognition',
        changes: {
            allPreviousAbilities: 'enhanced',
            newAbility: 'heroic_challenge'
        },
        abilities: [
            {
                name: '종말의 일격',
                damage: 200,
                cooldown: 20000,
                pattern: 'screen_wide_attack',
                warningTime: 5000,
                avoidable: true
            }
        ]
    }
};
```

---

## ⚔️ 보스 패턴 상세 설계

### 공격 패턴 라이브러리

#### 기본 공격 패턴
```javascript
const AttackPatterns = {
    STRAIGHT_LINE: {
        name: '직선 공격',
        implementation: 'linear_projectile',
        parameters: {
            speed: 300,
            width: 20,
            maxRange: 400
        }
    },

    CONE_ATTACK: {
        name: '부채꼴 공격',
        implementation: 'cone_area_damage',
        parameters: {
            angle: 60,
            range: 150,
            segments: 5
        }
    },

    CIRCLE_EXPLOSION: {
        name: '원형 폭발',
        implementation: 'expanding_circle',
        parameters: {
            maxRadius: 200,
            expansionSpeed: 400,
            duration: 1000
        }
    },

    HOMING_MISSILE: {
        name: '유도 미사일',
        implementation: 'tracking_projectile',
        parameters: {
            speed: 250,
            turnRate: 180,
            maxLifetime: 5000
        }
    },

    GROUND_SLAM: {
        name: '대지 강타',
        implementation: 'shockwave_from_point',
        parameters: {
            waves: 3,
            waveSpeed: 300,
            waveSpacing: 100
        }
    }
};
```

#### 고급 패턴 조합
```javascript
const ComboPatterns = {
    TRIPLE_SHOT: {
        name: '3연발',
        sequence: [
            { pattern: 'STRAIGHT_LINE', delay: 0 },
            { pattern: 'STRAIGHT_LINE', delay: 300 },
            { pattern: 'STRAIGHT_LINE', delay: 600 }
        ]
    },

    SPIRAL_BARRAGE: {
        name: '나선 연발',
        implementation: 'rotating_projectile_spawn',
        parameters: {
            projectileCount: 12,
            rotationSpeed: 90,
            spawnInterval: 200
        }
    },

    CROSS_EXPLOSION: {
        name: '십자 폭발',
        sequence: [
            { pattern: 'STRAIGHT_LINE', direction: 0 },
            { pattern: 'STRAIGHT_LINE', direction: 90 },
            { pattern: 'STRAIGHT_LINE', direction: 180 },
            { pattern: 'STRAIGHT_LINE', direction: 270 }
        ]
    }
};
```

### 보스 AI 고급 시스템

#### 적응형 난이도
```javascript
const AdaptiveDifficulty = {
    // 플레이어 성능 추적
    performanceMetrics: {
        averageDodgeTime: 0,
        damagePerSecond: 0,
        healthLossRate: 0,
        accuracyRate: 0
    },

    // 실시간 조정
    difficultyAdjustments: {
        tooEasy: {
            condition: 'player_dominating',
            adjustments: {
                attackSpeed: '+20%',
                newAttackPatterns: true,
                reducedTelegraph: 200
            }
        },
        tooHard: {
            condition: 'player_struggling',
            adjustments: {
                attackSpeed: '-15%',
                increasedTelegraph: 500,
                reducedDamage: 0.8
            }
        }
    }
};
```

#### 학습 AI 시스템
```javascript
const LearningAI = {
    // 플레이어 패턴 인식
    playerPatternRecognition: {
        movementPreference: 'clockwise',    // 시계방향 선호
        dodgeDirection: 'backward',         // 후진 회피 선호
        attackTiming: 'conservative',       // 보수적 공격
        positionPreference: 'ranged'        // 원거리 선호
    },

    // 대응 전략 조정
    counterStrategies: {
        predictiveAttacks: {
            enabled: true,
            targetPredictedPosition: true,
            leadTime: 300
        },

        exploitWeaknesses: {
            forceUncomfortablePositions: true,
            punishPredictablePatterns: true,
            adaptAttackTiming: true
        }
    }
};
```

---

## 🎭 특수 메커니즘

### 환경 상호작용

#### 보스전 환경 요소
```javascript
const EnvironmentalMechanics = {
    COLLAPSING_FLOOR: {
        trigger: 'boss_ground_slam',
        effect: 'create_holes_in_arena',
        duration: 'permanent',
        impact: 'reduces_safe_space'
    },

    FIRE_PILLARS: {
        trigger: 'boss_rage_mode',
        effect: 'spawn_damage_zones',
        duration: 10000,
        damage: 20,
        interval: 1000
    },

    MOVING_WALLS: {
        trigger: 'boss_phase_change',
        effect: 'walls_close_in_slowly',
        speed: 10,
        finalSize: '50%_of_original'
    },

    DARKNESS: {
        trigger: 'boss_health_below_25%',
        effect: 'reduce_vision_radius',
        visionRadius: 100,
        duration: 'until_boss_defeat'
    }
};
```

#### 상호작용 오브젝트
```javascript
const InteractiveObjects = {
    EXPLOSIVE_BARRELS: {
        health: 1,
        explosionRadius: 80,
        explosionDamage: 100,
        placement: 'scattered_around_arena',
        respawn: false
    },

    HEALING_CRYSTALS: {
        healAmount: 50,
        cooldown: 15000,
        usage: 'limited_uses',
        maxUses: 3
    },

    SHIELD_GENERATORS: {
        effect: 'temporary_invulnerability',
        duration: 3000,
        cooldown: 30000,
        vulnerability: 'can_be_destroyed_by_boss'
    }
};
```

### 보스 특수 능력

#### 페이즈 전환 시스템
```javascript
const PhaseTransition = {
    // 전환 트리거
    triggers: {
        healthThreshold: [75, 50, 25],
        timeElapsed: 120000,    // 2분 경과
        playerAction: 'special_condition_met'
    },

    // 전환 애니메이션
    transitionEffect: {
        duration: 3000,
        invulnerability: true,
        visualEffect: 'dramatic_transformation',
        audioEffect: 'boss_roar',
        cameraShake: 'intense'
    },

    // 능력 변화
    abilityChanges: {
        newAbilities: 'unlock_phase_specific_attacks',
        enhancedAbilities: 'increase_existing_power',
        disabledAbilities: 'remove_early_phase_attacks'
    }
};
```

#### 소환 시스템
```javascript
const SummonSystem = {
    // 소환물 유형
    summonTypes: {
        MINIONS: {
            count: 3,
            health: 30,
            damage: 15,
            behavior: 'swarm_player',
            lifetime: 15000
        },

        LIEUTENANT: {
            count: 1,
            health: 120,
            damage: 35,
            behavior: 'tank_and_protect_boss',
            specialAbilities: ['taunt', 'damage_share']
        },

        TOTEMS: {
            count: 2,
            health: 60,
            effect: 'buff_boss_continuously',
            behavior: 'stationary_support',
            mustDestroy: true
        }
    },

    // 소환 전략
    summonStrategy: {
        overwhelm: 'many_weak_enemies',
        support: 'few_strong_supporters',
        distraction: 'mix_of_types',
        desperate: 'all_available_summons'
    }
};
```

---

## 🎯 적 스폰 & 인카운터 시스템

### 적 생성 규칙

#### 방별 적 배치
```javascript
const RoomEncounters = {
    SMALL_ROOM: {
        size: '3x3_tiles',
        enemyCount: { min: 1, max: 3 },
        composition: 'single_type_or_pair',
        difficulty: 'standard'
    },

    MEDIUM_ROOM: {
        size: '5x5_tiles',
        enemyCount: { min: 3, max: 6 },
        composition: 'mixed_types',
        difficulty: 'standard_to_hard'
    },

    LARGE_ROOM: {
        size: '7x7_tiles',
        enemyCount: { min: 5, max: 10 },
        composition: 'tactical_formations',
        difficulty: 'hard',
        specialFeatures: 'environmental_hazards'
    },

    BOSS_ROOM: {
        size: '10x10_tiles',
        enemyCount: 1,
        composition: 'single_boss',
        difficulty: 'very_hard',
        specialFeatures: 'boss_mechanics'
    }
};
```

#### 적 밀도 조절
```javascript
const EnemyDensity = {
    // 층별 적 밀도
    floorDensity: {
        1: 0.6,    // 60% - 튜토리얼
        3: 0.8,    // 80% - 표준
        5: 1.0,    // 100% - 기본
        7: 1.2,    // 120% - 높음
        10: 1.5    // 150% - 최고
    },

    // 동적 조절
    dynamicAdjustment: {
        playerStruggling: -0.2,    // 20% 감소
        playerDominating: +0.3,    // 30% 증가
        timeSpentInLevel: +0.1     // 시간당 10% 증가
    }
};
```

### 인카운터 설계

#### 인카운터 유형
```javascript
const EncounterTypes = {
    AMBUSH: {
        description: '기습 공격',
        setup: 'enemies_spawn_when_player_enters_center',
        enemyAdvantage: 'first_strike',
        playerWarning: 'minimal'
    },

    PATROL: {
        description: '순찰 중인 적',
        setup: 'enemies_moving_in_predictable_pattern',
        playerAdvantage: 'stealth_approach_possible',
        detection: 'line_of_sight_based'
    },

    GUARD_POST: {
        description: '경비 초소',
        setup: 'stationary_enemies_protecting_treasure',
        enemyAdvantage: 'defensive_position',
        objective: 'defeat_all_or_sneak_past'
    },

    GAUNTLET: {
        description: '연속 전투',
        setup: 'waves_of_enemies_spawn_sequentially',
        challenge: 'resource_management',
        reward: 'bonus_loot_for_completion'
    }
};
```

#### 인카운터 난이도 곡선
```javascript
const DifficultyProgression = {
    // 층 내 진행도
    withinFloor: {
        earlyRooms: 0.8,     // 80% 난이도
        middleRooms: 1.0,    // 100% 난이도
        lateRooms: 1.1,      // 110% 난이도
        bossRoom: 2.0        // 200% 난이도
    },

    // 특별 방 보정
    specialRoomModifiers: {
        treasureRoom: 1.3,   // 보물방은 어려움
        shopRoom: 0.0,       // 상점은 안전
        secretRoom: 1.5,     // 비밀방은 매우 어려움
        restRoom: 0.0        // 휴식방은 안전
    }
};
```

---

## 🧠 적 집단 AI

### 협력 행동 시스템

#### 그룹 전술
```javascript
const GroupTactics = {
    PINCER_MOVEMENT: {
        name: '협공',
        requiredEnemies: 3,
        formation: 'surround_player',
        execution: 'simultaneous_attack_from_multiple_angles'
    },

    PROTECT_THE_CASTER: {
        name: '술사 보호',
        requiredEnemies: ['caster', 'melee'],
        formation: 'bodyguard_formation',
        execution: 'melee_blocks_player_access_to_caster'
    },

    SACRIFICE_PLAY: {
        name: '희생 전술',
        condition: 'low_health_ally_present',
        execution: 'weak_enemy_charges_to_create_opening'
    },

    RETREAT_AND_REGROUP: {
        name: '후퇴 및 재편성',
        condition: 'heavy_casualties',
        execution: 'surviving_enemies_fall_back_and_wait_for_reinforcements'
    }
};
```

#### 커뮤니케이션 시스템
```javascript
const EnemyCommunication = {
    // 신호 시스템
    signals: {
        SPOTTED_PLAYER: {
            range: 200,
            effect: 'alert_nearby_enemies',
            duration: 5000
        },

        NEED_HELP: {
            range: 150,
            effect: 'call_for_backup',
            condition: 'health_below_30_percent'
        },

        PLAYER_FLANKING: {
            range: 100,
            effect: 'warn_about_player_position',
            triggers: 'defensive_repositioning'
        }
    },

    // 그룹 의사결정
    groupDecisionMaking: {
        democraticVoting: false,
        alphaLeader: true,
        leaderSelection: 'highest_tier_enemy',
        leaderAbilities: ['issue_commands', 'coordinate_attacks']
    }
};
```

---

## 📊 적 밸런싱 지표

### 전투 시간 목표

#### 적 유형별 교전 시간
```javascript
const CombatDuration = {
    TRASH_MOB: {
        targetTime: '2-4 seconds',
        acceptableRange: '1-6 seconds',
        balanceFactors: ['player_gear', 'skill_level']
    },

    ELITE_ENEMY: {
        targetTime: '8-15 seconds',
        acceptableRange: '5-20 seconds',
        considerations: ['ability_usage', 'positioning']
    },

    MINI_BOSS: {
        targetTime: '30-60 seconds',
        acceptableRange: '20-90 seconds',
        phases: 'single_phase_preferred'
    },

    MAJOR_BOSS: {
        targetTime: '2-4 minutes',
        acceptableRange: '90s-6min',
        phases: 'multiple_phases_expected'
    }
};
```

#### 위험도 평가
```javascript
const ThreatAssessment = {
    // 위협 수준 계산
    calculateThreatLevel(enemy) {
        const baseThreat = enemy.damage * enemy.health / 1000;
        const mobilityFactor = enemy.speed > 1.2 ? 1.3 : 1.0;
        const specialAbilityFactor = enemy.abilities.length * 0.2 + 1;

        return baseThreat * mobilityFactor * specialAbilityFactor;
    },

    // 그룹 위협도
    groupThreatMultiplier: {
        1: 1.0,    // 단독
        2: 1.3,    // 2마리 = 30% 추가 위험
        3: 1.7,    // 3마리 = 70% 추가 위험
        4: 2.2,    // 4마리 = 120% 추가 위험
        5: 2.8     // 5마리+ = 180% 추가 위험
    }
};
```

---

**문서 관리 정보:**
- **다음 문서**: [09. 밸런싱 & 난이도](./09-balancing-difficulty.md)
- **관련 문서**: [03. 게임플레이 시스템](./03-gameplay-systems.md)
- **최종 수정**: 2025-09-28