# 📊 09. 밸런싱 & 난이도

## 📋 문서 정보
- **문서 버전**: v1.0
- **작성일**: 2025-09-28
- **담당 영역**: 게임 밸런스 및 난이도 조절 시스템

---

## 🎯 학습 곡선 설계

### 난이도 진행 철학

#### 핵심 설계 원칙
```javascript
const DifficultyPhilosophy = {
    FAIR_CHALLENGE: {
        principle: '공정한 도전',
        description: '플레이어 실력으로 극복 가능한 난이도',
        implementation: [
            'clear_visual_telegraphs',
            'consistent_mechanics',
            'learnable_patterns'
        ]
    },

    PROGRESSIVE_MASTERY: {
        principle: '점진적 숙달',
        description: '이전 기술을 바탕으로 새로운 도전 제시',
        implementation: [
            'skill_building_sequence',
            'mechanic_introduction_order',
            'complexity_gradual_increase'
        ]
    },

    MEANINGFUL_FAILURE: {
        principle: '의미있는 실패',
        description: '실패를 통한 학습과 성장',
        implementation: [
            'death_as_teacher',
            'meta_progression_rewards',
            'failure_analysis_feedback'
        ]
    }
};
```

#### 학습 단계별 목표
```javascript
const LearningStages = {
    STAGE_1_BASIC: {
        floors: [1, 2],
        learningGoals: [
            'movement_controls',
            'basic_attack',
            'enemy_pattern_recognition',
            'health_management'
        ],
        difficultyModifier: 0.6,
        allowedFailures: 'unlimited_with_gentle_guidance'
    },

    STAGE_2_COMBAT: {
        floors: [3, 4],
        learningGoals: [
            'skill_usage',
            'enemy_variety_adaptation',
            'resource_management',
            'basic_boss_patterns'
        ],
        difficultyModifier: 0.8,
        allowedFailures: 'frequent_with_clear_feedback'
    },

    STAGE_3_STRATEGY: {
        floors: [5, 6],
        learningGoals: [
            'build_optimization',
            'risk_reward_decisions',
            'advanced_combat_techniques',
            'environmental_awareness'
        ],
        difficultyModifier: 1.0,
        allowedFailures: 'moderate_with_adaptive_hints'
    },

    STAGE_4_MASTERY: {
        floors: [7, 8],
        learningGoals: [
            'perfect_execution',
            'complex_boss_mechanics',
            'multi_enemy_management',
            'optimization_strategies'
        ],
        difficultyModifier: 1.3,
        allowedFailures: 'limited_with_minimal_assistance'
    },

    STAGE_5_EXPERT: {
        floors: [9, 10],
        learningGoals: [
            'flawless_performance',
            'all_mechanics_mastery',
            'creative_problem_solving',
            'endgame_content'
        ],
        difficultyModifier: 1.6,
        allowedFailures: 'rare_with_no_assistance'
    }
};
```

---

## 📈 층별 난이도 설계

### 수치적 스케일링

#### 기본 스케일링 공식
```javascript
const ScalingFormulas = {
    // 적 체력 스케일링
    enemyHealth: (baseHealth, floor) => {
        return Math.floor(baseHealth * Math.pow(1.15, floor - 1));
    },

    // 적 공격력 스케일링
    enemyDamage: (baseDamage, floor) => {
        return Math.floor(baseDamage * Math.pow(1.12, floor - 1));
    },

    // 플레이어 파워 스케일링 (아이템/업그레이드)
    playerPower: (basePower, floor) => {
        return Math.floor(basePower * Math.pow(1.18, floor - 1));
    },

    // 보상 스케일링
    rewardValue: (baseValue, floor) => {
        return Math.floor(baseValue * Math.pow(1.25, floor - 1));
    }
};
```

#### 층별 상세 밸런싱
```javascript
const FloorBalancing = {
    FLOOR_1: {
        playerExpectedPower: 100,
        enemyAveragePower: 60,
        difficultyRating: 'very_easy',
        newMechanics: ['basic_movement', 'basic_attack'],
        timeToComplete: '8-12 minutes',
        deathRate: '< 5%'
    },

    FLOOR_3: {
        playerExpectedPower: 150,
        enemyAveragePower: 120,
        difficultyRating: 'easy',
        newMechanics: ['skill_usage', 'dodge_timing'],
        timeToComplete: '10-15 minutes',
        deathRate: '10-20%'
    },

    FLOOR_5: {
        playerExpectedPower: 220,
        enemyAveragePower: 200,
        difficultyRating: 'medium',
        newMechanics: ['multi_enemy_combat', 'positioning'],
        timeToComplete: '12-18 minutes',
        deathRate: '25-35%'
    },

    FLOOR_7: {
        playerExpectedPower: 320,
        enemyAveragePower: 300,
        difficultyRating: 'hard',
        newMechanics: ['complex_patterns', 'resource_pressure'],
        timeToComplete: '15-25 minutes',
        deathRate: '40-50%'
    },

    FLOOR_10: {
        playerExpectedPower: 500,
        enemyAveragePower: 480,
        difficultyRating: 'very_hard',
        newMechanics: ['mastery_test', 'all_previous_skills'],
        timeToComplete: '20-35 minutes',
        deathRate: '60-80%'
    }
};
```

### 적응형 난이도 시스템

#### 성능 기반 조정
```javascript
const AdaptiveDifficulty = {
    // 플레이어 성능 지표
    performanceMetrics: {
        deathCount: 0,
        damagePerSecond: 0,
        dodgeSuccessRate: 0,
        timePerFloor: 0,
        resourceEfficiency: 0
    },

    // 조정 트리거
    adjustmentTriggers: {
        STRUGGLING: {
            condition: 'deaths > 3 AND dps < expected * 0.7',
            adjustments: {
                enemyHealth: 0.85,      // 15% 감소
                enemyDamage: 0.9,       // 10% 감소
                dropRate: 1.2,          // 20% 증가
                hintFrequency: 2.0      // 힌트 2배 증가
            }
        },

        DOMINATING: {
            condition: 'deaths < 1 AND dps > expected * 1.3',
            adjustments: {
                enemyHealth: 1.15,      // 15% 증가
                enemyDamage: 1.1,       // 10% 증가
                enemySpeed: 1.05,       // 5% 증가
                bonusEnemies: true      // 추가 적 스폰
            }
        },

        OPTIMAL: {
            condition: 'performance within target range',
            adjustments: {
                // 변경 없음, 현재 난이도 유지
            }
        }
    }
};
```

---

## ⚖️ 플레이어 파워 밸런싱

### 능력치 성장 시스템

#### 기본 스탯 진행
```javascript
const StatProgression = {
    HEALTH: {
        base: 100,
        perLevel: 8,
        fromItems: '20-50%',
        maxPossible: 300,
        balanceTarget: 'survive_3-4_enemy_hits'
    },

    MANA: {
        base: 30,
        perLevel: 3,
        fromItems: '15-30%',
        maxPossible: 80,
        balanceTarget: 'cast_3-5_skills_per_combat'
    },

    ATTACK_POWER: {
        base: 25,
        perLevel: 2,
        fromItems: '50-150%',
        maxPossible: 100,
        balanceTarget: 'kill_trash_mob_in_2-4_hits'
    },

    DEFENSE: {
        base: 5,
        perLevel: 1,
        fromItems: '30-80%',
        maxPossible: 35,
        balanceTarget: 'reduce_damage_by_20-40%'
    }
};
```

#### 무기 밸런싱
```javascript
const WeaponBalance = {
    SWORD: {
        dps: 100,           // 기준점
        range: 1.2,
        special: 'balanced_all_around',
        balanceNote: 'reference_weapon'
    },

    AXE: {
        dps: 110,           // 10% 높은 DPS
        range: 1.0,         // 짧은 사거리
        attackSpeed: 0.8,   // 느린 공격속도
        special: 'high_damage_slow_attack'
    },

    DAGGER: {
        dps: 90,            // 10% 낮은 DPS
        range: 0.8,         // 매우 짧은 사거리
        attackSpeed: 1.5,   // 빠른 공격속도
        special: 'high_crit_chance'
    },

    BOW: {
        dps: 95,            // 5% 낮은 DPS
        range: 4.0,         // 긴 사거리
        special: 'safe_distance_combat',
        weakness: 'vulnerable_when_cornered'
    },

    STAFF: {
        dps: 85,            // 15% 낮은 DPS
        range: 3.5,         // 중간 사거리
        manaCost: true,     // 마나 소모
        special: 'aoe_damage_potential'
    }
};
```

### 스킬 밸런싱

#### 스킬 파워 레벨
```javascript
const SkillBalance = {
    FIREBALL: {
        baseDamage: 40,
        manaCost: 8,
        cooldown: 3000,
        dpsContribution: 13.3,  // damage / cooldown
        manaEfficiency: 5.0,    // damage / mana
        balanceRating: 'standard'
    },

    LIGHTNING_BOLT: {
        baseDamage: 60,
        manaCost: 12,
        cooldown: 5000,
        dpsContribution: 12.0,
        manaEfficiency: 5.0,
        balanceRating: 'burst_damage'
    },

    HEAL: {
        healAmount: 30,
        manaCost: 10,
        cooldown: 4000,
        utilityValue: 'high',
        balanceNote: 'defensive_option'
    },

    DASH: {
        distance: 150,
        manaCost: 5,
        cooldown: 2000,
        utilityValue: 'very_high',
        balanceNote: 'mobility_and_safety'
    },

    SHIELD: {
        absorb: 50,
        duration: 8000,
        manaCost: 15,
        cooldown: 12000,
        utilityValue: 'high',
        balanceNote: 'damage_mitigation'
    }
};
```

---

## 🎲 경제 밸런싱

### 자원 경제 설계

#### 골드 경제 분석
```javascript
const GoldEconomy = {
    // 층당 예상 수입
    incomePerFloor: {
        enemyDrops: 120,        // 적 처치 보상
        treasureChests: 80,     // 보물상자
        bossReward: 200,        // 보스 보상
        total: 400
    },

    // 층당 예상 지출
    expensesPerFloor: {
        healthPotions: 150,     // 체력 회복
        equipmentUpgrade: 100,  // 장비 강화
        utilityItems: 50,       // 유틸리티 아이템
        total: 300
    },

    // 경제 건전성 지표
    economicHealth: {
        netIncomePerFloor: 100,     // 100골드 흑자
        inflationRate: 0.05,        // 층당 5% 가격 상승
        purchasingPowerDecay: 0.03  // 구매력 3% 감소
    }
};
```

#### 소울 포인트 경제
```javascript
const SoulPointEconomy = {
    // 획득 방법별 기여도
    acquisitionSources: {
        enemyKills: 0.6,        // 60% - 적 처치
        floorCompletion: 0.25,  // 25% - 층 클리어
        achievements: 0.15      // 15% - 업적 달성
    },

    // 지출 우선순위
    spendingPriorities: {
        essentialUpgrades: 0.4,    // 40% - 필수 업그레이드
        qualityOfLife: 0.3,        // 30% - 편의성 개선
        powerSpikes: 0.2,          // 20% - 파워 증가
        cosmetics: 0.1             // 10% - 외형 변경
    },

    // 밸런스 목표
    balanceTargets: {
        runsToMaxUpgrade: 15,      // 15회 플레이로 최대 업그레이드
        meaningfulChoices: true,    // 항상 여러 선택지 존재
        progressFeel: 'steady'      // 꾸준한 발전 느낌
    }
};
```

---

## 🎮 적 출현 분포

### 적 스폰 확률

#### 층별 적 구성비
```javascript
const EnemyComposition = {
    FLOOR_1_3: {
        basicEnemies: 0.8,      // 80% 기본 적
        eliteEnemies: 0.15,     // 15% 정예 적
        specialEnemies: 0.05,   // 5% 특수 적
        bossEnemies: 0.0        // 보스 없음
    },

    FLOOR_4_6: {
        basicEnemies: 0.6,      // 60% 기본 적
        eliteEnemies: 0.3,      // 30% 정예 적
        specialEnemies: 0.1,    // 10% 특수 적
        bossEnemies: 0.0        // 보스 없음
    },

    FLOOR_7_9: {
        basicEnemies: 0.4,      // 40% 기본 적
        eliteEnemies: 0.4,      // 40% 정예 적
        specialEnemies: 0.2,    // 20% 특수 적
        bossEnemies: 0.0        // 보스 없음
    },

    BOSS_FLOORS: {
        basicEnemies: 0.2,      // 20% 기본 적
        eliteEnemies: 0.3,      // 30% 정예 적
        specialEnemies: 0.4,    // 40% 특수 적
        bossEnemies: 0.1        // 10% 미니보스
    }
};
```

#### 방별 적 밀도
```javascript
const RoomDensity = {
    ENTRANCE_ROOM: {
        enemyCount: { min: 0, max: 1 },
        purpose: 'safe_introduction',
        difficulty: 0.5
    },

    SMALL_COMBAT: {
        enemyCount: { min: 1, max: 3 },
        purpose: 'quick_encounters',
        difficulty: 0.8
    },

    MEDIUM_COMBAT: {
        enemyCount: { min: 3, max: 6 },
        purpose: 'standard_fights',
        difficulty: 1.0
    },

    LARGE_COMBAT: {
        enemyCount: { min: 5, max: 10 },
        purpose: 'major_encounters',
        difficulty: 1.3
    },

    TREASURE_ROOM: {
        enemyCount: { min: 2, max: 5 },
        purpose: 'high_risk_high_reward',
        difficulty: 1.2,
        specialReward: true
    }
};
```

---

## 📊 보상 경제 시스템

### 드랍률 밸런싱

#### 아이템 희귀도별 확률
```javascript
const DropRates = {
    COMMON_ENEMY: {
        nothing: 0.3,           // 30% 아무것도 없음
        consumable: 0.4,        // 40% 소비 아이템
        common: 0.25,           // 25% 일반 아이템
        uncommon: 0.05,         // 5% 비일반 아이템
        rare: 0.0,              // 0% 레어 아이템
        epic: 0.0,              // 0% 에픽 아이템
        legendary: 0.0          // 0% 전설 아이템
    },

    ELITE_ENEMY: {
        nothing: 0.1,           // 10% 아무것도 없음
        consumable: 0.3,        // 30% 소비 아이템
        common: 0.35,           // 35% 일반 아이템
        uncommon: 0.2,          // 20% 비일반 아이템
        rare: 0.05,             // 5% 레어 아이템
        epic: 0.0,              // 0% 에픽 아이템
        legendary: 0.0          // 0% 전설 아이템
    },

    BOSS_ENEMY: {
        nothing: 0.0,           // 0% 아무것도 없음 (보장 드랍)
        consumable: 0.2,        // 20% 소비 아이템
        common: 0.1,            // 10% 일반 아이템
        uncommon: 0.3,          // 30% 비일반 아이템
        rare: 0.3,              // 30% 레어 아이템
        epic: 0.09,             // 9% 에픽 아이템
        legendary: 0.01         // 1% 전설 아이템
    }
};
```

#### 드랍률 수정자
```javascript
const DropModifiers = {
    // 층수 보정
    floorBonus: {
        1: 1.0,     // 기본
        3: 1.1,     // 10% 증가
        5: 1.2,     // 20% 증가
        7: 1.4,     // 40% 증가
        10: 1.6     // 60% 증가
    },

    // 플레이어 럭 스탯
    luckBonus: (luckStat) => {
        return 1 + (luckStat * 0.02); // 럭 1당 2% 증가
    },

    // 연속 실패 보정 (Pity System)
    pitySystem: {
        enabled: true,
        threshold: 10,          // 10번 연속 일반 아이템
        bonusMultiplier: 2.0    // 2배 확률 증가
    },

    // 특수 이벤트
    eventModifiers: {
        treasureRoom: 1.5,      // 보물방 50% 증가
        secretRoom: 2.0,        // 비밀방 100% 증가
        firstKill: 1.3,         // 첫 처치 30% 증가
        killStreak: 1.1         // 연속 처치 10% 증가
    }
};
```

---

## 🔄 메타 프로그레션 밸런싱

### 영구 업그레이드 비용

#### 업그레이드 비용 곡선
```javascript
const UpgradeCosts = {
    // 기본 비용 공식
    calculateCost: (baseCost, currentLevel, scalingFactor = 1.4) => {
        return Math.floor(baseCost * Math.pow(scalingFactor, currentLevel));
    },

    // 업그레이드별 상세 설정
    HEALTH_UPGRADE: {
        baseCost: 30,
        scaling: 1.3,
        maxLevel: 20,
        totalCost: 2847,        // 20레벨까지 총 비용
        costPerBenefit: 284.7   // 체력 10당 비용
    },

    ATTACK_UPGRADE: {
        baseCost: 40,
        scaling: 1.4,
        maxLevel: 15,
        totalCost: 2983,
        costPerBenefit: 397.7   // 공격력 5%당 비용
    },

    LUCK_UPGRADE: {
        baseCost: 80,
        scaling: 1.6,
        maxLevel: 8,
        totalCost: 3534,
        costPerBenefit: 441.75  // 럭 5%당 비용
    }
};
```

#### 소울 포인트 수급 밸런싱
```javascript
const SoulPointBalance = {
    // 런당 획득량 (평균)
    perRunAcquisition: {
        shortRun: 80,       // 3층까지 실패
        mediumRun: 180,     // 6층까지 진행
        longRun: 320,       // 9층까지 진행
        fullRun: 500        // 10층 완주
    },

    // 의미있는 업그레이드 주기
    upgradeFrequency: {
        smallUpgrade: 2,    // 2런마다 소형 업그레이드
        mediumUpgrade: 5,   // 5런마다 중형 업그레이드
        majorUpgrade: 12,   // 12런마다 대형 업그레이드
        maxedBuild: 45      // 45런으로 완전체
    }
};
```

---

## 🎯 난이도 검증 시스템

### 플레이테스트 지표

#### 핵심 측정 항목
```javascript
const TestingMetrics = {
    COMPLETION_RATES: {
        floor1: { target: '>95%', acceptable: '>90%' },
        floor3: { target: '80-90%', acceptable: '>70%' },
        floor5: { target: '60-75%', acceptable: '>50%' },
        floor7: { target: '40-60%', acceptable: '>30%' },
        floor10: { target: '20-40%', acceptable: '>15%' }
    },

    SESSION_LENGTH: {
        perFloor: { target: '10-15min', max: '20min' },
        fullRun: { target: '90-120min', max: '150min' },
        retryRate: { target: '<30%', concern: '>50%' }
    },

    PLAYER_SATISFACTION: {
        frustrationRate: { target: '<20%', concern: '>40%' },
        challengeSatisfaction: { target: '>70%', min: '>60%' },
        replayIntention: { target: '>80%', min: '>70%' }
    }
};
```

#### 자동 밸런싱 시스템
```javascript
const AutoBalancing = {
    // 실시간 데이터 수집
    dataCollection: {
        playerDeaths: 'location_and_cause',
        combatDuration: 'per_encounter_timing',
        resourceUsage: 'health_mana_consumption',
        playerProgression: 'power_level_tracking'
    },

    // 자동 조정 트리거
    adjustmentTriggers: {
        highFailureRate: {
            condition: 'death_rate > target + 20%',
            action: 'reduce_enemy_stats_by_10%'
        },
        lowEngagement: {
            condition: 'combat_too_easy_or_short',
            action: 'increase_challenge_mechanics'
        },
        progressionStall: {
            condition: 'players_stuck_at_same_point',
            action: 'review_specific_encounter'
        }
    },

    // 밸런싱 안전장치
    safeguards: {
        maxAdjustment: 0.2,         // 최대 20% 변경
        adjustmentCooldown: 3600,   // 1시간 쿨다운
        rollbackCapability: true,   // 롤백 가능
        humanOverride: true         // 개발자 개입 가능
    }
};
```

---

## 📈 장기 밸런싱 전략

### 지속적 개선 시스템

#### 밸런싱 사이클
```javascript
const BalancingCycle = {
    // 4주 사이클
    WEEK_1: {
        phase: 'data_collection',
        activities: [
            'player_behavior_analysis',
            'completion_rate_tracking',
            'feedback_gathering'
        ]
    },

    WEEK_2: {
        phase: 'analysis_and_planning',
        activities: [
            'bottleneck_identification',
            'balance_adjustment_planning',
            'test_scenario_creation'
        ]
    },

    WEEK_3: {
        phase: 'implementation_and_testing',
        activities: [
            'balance_changes_implementation',
            'internal_testing',
            'beta_player_testing'
        ]
    },

    WEEK_4: {
        phase: 'deployment_and_monitoring',
        activities: [
            'balance_patch_deployment',
            'impact_monitoring',
            'emergency_hotfixes'
        ]
    }
};
```

#### 커뮤니티 피드백 통합
```javascript
const CommunityFeedback = {
    // 피드백 채널
    feedbackChannels: {
        ingameReports: { weight: 0.4, reliability: 'high' },
        communityForums: { weight: 0.3, reliability: 'medium' },
        socialMedia: { weight: 0.2, reliability: 'low' },
        directSurveys: { weight: 0.1, reliability: 'very_high' }
    },

    // 피드백 분류
    feedbackCategories: {
        too_easy: 'increase_difficulty',
        too_hard: 'reduce_difficulty',
        unfair: 'improve_clarity',
        boring: 'add_variety',
        confusing: 'improve_communication'
    },

    // 의사결정 프로세스
    decisionMaking: {
        dataDriven: 0.6,        // 60% 데이터 기반
        communityVoice: 0.25,   // 25% 커뮤니티 의견
        designVision: 0.15      // 15% 설계 철학
    }
};
```

---

## 🎪 특별 이벤트 밸런싱

### 시즌 이벤트

#### 난이도 변형 이벤트
```javascript
const SeasonalEvents = {
    DOUBLE_TROUBLE: {
        description: '모든 방에 적 2배 출현',
        duration: '1주',
        difficultyIncrease: 1.8,
        rewardIncrease: 2.2,
        playerExpectation: 'significant_challenge'
    },

    PACIFIST_RUN: {
        description: '특정 적 처치 금지',
        duration: '3일',
        difficultyIncrease: 1.3,
        rewardIncrease: 1.8,
        playerExpectation: 'strategic_thinking'
    },

    SPEED_RUN: {
        description: '제한 시간 내 클리어',
        duration: '5일',
        timeLimit: '60분',
        difficultyIncrease: 1.1,
        rewardIncrease: 2.0,
        playerExpectation: 'efficiency_focus'
    }
};
```

#### 파워 레벨 이벤트
```javascript
const PowerEvents = {
    OVERPOWERED_WEEKEND: {
        description: '모든 스탯 200% 증가',
        effect: 'player_power * 2.0',
        balanceAdjustment: 'enemy_health * 1.5',
        purpose: 'power_fantasy_fulfillment'
    },

    HARDCORE_MODE: {
        description: '1회 사망으로 게임 오버',
        effect: 'permadeath_enabled',
        balanceAdjustment: 'enemy_damage * 0.7',
        purpose: 'tension_and_mastery'
    },

    RANDOM_STATS: {
        description: '매 층마다 랜덤 스탯 변경',
        effect: 'random_stat_modifiers',
        balanceAdjustment: 'adaptive_enemy_scaling',
        purpose: 'adaptability_challenge'
    }
};
```

---

**문서 관리 정보:**
- **다음 문서**: [10. 확장성 & 성공 지표](./10-expansion-metrics.md)
- **관련 문서**: [08. 보스 & 적 설계](./08-boss-enemy-design.md)
- **최종 수정**: 2025-09-28