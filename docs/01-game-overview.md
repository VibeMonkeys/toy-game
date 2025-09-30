# 🎮 01. 게임 개요 & 핵심 설계

## 📋 문서 정보
- **문서 버전**: v1.0
- **작성일**: 2025-09-28
- **담당 영역**: 게임 컨셉 및 핵심 설계 철학

---

## 🎯 게임 컨셉

### 게임 제목
**"최진안의 이세계 모험기 (Jinan's Isekai Adventure)"**

### 핵심 컨셉
평범한 개발자가 이세계에서 용사가 되어 마왕을 쓰러뜨리는 액션 로그라이트 게임. 죽을 때마다 영혼의 힘으로 강해지며, 매번 다른 전략으로 도전하는 메타 프로그레션 시스템이 핵심.

### 장르 및 플랫폼
- **주 장르**: 액션 로그라이트 (Action Roguelite)
- **부 장르**: 던전 크롤러, 메타프로그레션 RPG
- **플랫폼**: 웹 브라우저 (HTML5 Canvas)
- **입력 방식**: 키보드 + 마우스
- **해상도**: 1280x720 (16:9 비율, 확장 가능)

---

## 🌟 핵심 가치 제안

### 1. "실패해도 성장하는 재미"
```javascript
const MetaProgression = {
    deathRewards: 'soul_points_for_permanent_upgrades',
    learningCurve: 'each_death_teaches_new_strategies',
    powerGrowth: 'visibly_stronger_with_each_attempt',
    motivation: 'failure_becomes_stepping_stone'
};
```

**구현 방식:**
- 사망 시 소울 포인트 획득 (층수 × 10 + 적 처치 × 2)
- 영구 업그레이드로 기본 능력치 향상
- 새로운 무기/스킬 해금 시스템
- 진행도에 따른 스토리 진전

### 2. "완벽한 몰입감"
```javascript
const ImmersiveExperience = {
    sessionLength: '25-35_minutes_per_run',
    pacing: 'intense_action_with_strategic_breaks',
    feedback: 'immediate_visual_and_audio_response',
    flow: 'seamless_progression_without_interruption'
};
```

**구현 방식:**
- 빠른 로딩과 즉시 재시작
- 명확한 목표와 진행도 표시
- 시각적/청각적 피드백 시스템
- 끊김 없는 게임플레이 플로우

### 3. "직관적인 액션"
```javascript
const IntuitiveControls = {
    movement: 'WASD_simple_directional',
    attack: 'spacebar_primary_action',
    skills: 'number_keys_1_through_5',
    dodge: 'shift_for_emergency_escape',
    interact: 'E_for_environment_interaction'
};
```

**구현 방식:**
- 최소한의 키 조합으로 모든 액션 수행
- 시각적 튜토리얼과 힌트 시스템
- 일관된 조작 체계
- 접근성을 고려한 대안 조작법

### 4. "무한한 리플레이성"
```javascript
const ReplayValue = {
    procedural: 'randomly_generated_dungeon_layouts',
    builds: 'multiple_weapon_and_skill_combinations',
    challenges: 'different_strategies_for_each_run',
    discoveries: 'hidden_secrets_and_easter_eggs'
};
```

**구현 방식:**
- 절차적 던전 생성
- 다양한 빌드 조합 (무기 5종 × 스킬 5종)
- 층별 선택형 보상 시스템
- 히든 콘텐츠와 업적 시스템

---

## ⏱️ 타겟 플레이타임 분석

### 세션별 시간 배분

#### 신규 플레이어 (첫 5회 시도)
```javascript
const NewPlayerSession = {
    tutorial: '3-5 minutes',
    floor1_3: '12-18 minutes',
    death_and_upgrade: '2-3 minutes',
    totalPerRun: '17-26 minutes',

    learningPhase: {
        runs: 5,
        totalTime: '85-130 minutes',
        completionRate: '20-40%'
    }
};
```

#### 숙련 플레이어 (6회차 이후)
```javascript
const ExperiencedPlayerSession = {
    floorProgression: '15-20 minutes',
    upgradeDecisions: '1-2 minutes',
    totalPerRun: '16-22 minutes',

    masteryPhase: {
        averageRuns: 3,
        totalTime: '48-66 minutes',
        completionRate: '60-80%'
    }
};
```

### 완주까지의 여정
- **최소 시도 횟수**: 3회 (극도로 숙련된 플레이어)
- **평균 시도 횟수**: 6-8회 (일반적인 완주 경험)
- **최대 시도 횟수**: 15회 (초보자 + 운이 나쁜 경우)
- **총 플레이타임**: 90분 ~ 4시간

---

## 🔄 기본 게임 루프

### 마이크로 루프 (2-3분)
```
방 입장 → 적 발견 → 전투 → 아이템 획득 → 다음 방 이동
```

**세부 단계:**
1. **방 탐색** (10-20초)
   - 환경 파악 및 적 위치 확인
   - 전략적 포지셔닝

2. **전투 실행** (30-90초)
   - 적과의 교전
   - 스킬 사용 및 회피

3. **보상 수집** (10-20초)
   - 아이템 획득
   - 체력/마나 회복

4. **진행 결정** (5-10초)
   - 다음 방 선택
   - 인벤토리 정리

### 메조 루프 (8-12분)
```
층 시작 → 여러 방 클리어 → 보스 전투 → 층 완료 보상 → 다음 층
```

**층별 구성:**
- **일반 방**: 6-8개 (전투, 보물, 상점, 휴식)
- **보스 방**: 1개 (층별 고유 보스)
- **보상 선택**: 3개 중 1개 선택
- **진행 결정**: 계속 또는 은퇴

### 매크로 루프 (25-35분)
```
게임 시작 → 10층 진행 → 사망 또는 완주 → 업그레이드 → 재시작
```

**런 완료 사이클:**
1. **캐릭터 강화** (2-3분)
   - 소울 포인트로 영구 업그레이드
   - 새로운 무기/스킬 해금

2. **전략 계획** (1분)
   - 이번 런의 목표 설정
   - 빌드 방향성 결정

3. **던전 도전** (20-30분)
   - 실제 게임플레이
   - 전투와 탐험

---

## 🏆 메타 프로그레션 시스템

### 소울 포인트 경제

#### 획득 방법
```javascript
const SoulPointSources = {
    enemyKill: 2,           // 적 처치당 2pt
    floorComplete: 10,      // 층 완료당 10pt
    bossKill: 15,           // 보스 처치당 15pt
    firstTime: 5,           // 첫 달성시 5pt 보너스

    // 층별 보너스
    floorBonus: (floor) => floor * 10
};
```

#### 지출 카테고리
```javascript
const UpgradeCategories = {
    HEALTH: {
        baseCost: 30,
        scaling: 1.3,
        maxLevel: 20,
        effect: '+10 최대 체력'
    },

    MANA: {
        baseCost: 25,
        scaling: 1.3,
        maxLevel: 15,
        effect: '+5 최대 마나'
    },

    ATTACK: {
        baseCost: 40,
        scaling: 1.4,
        maxLevel: 15,
        effect: '+5% 공격력'
    },

    CRITICAL: {
        baseCost: 50,
        scaling: 1.5,
        maxLevel: 10,
        effect: '+2% 치명타 확률'
    },

    SPEED: {
        baseCost: 35,
        scaling: 1.35,
        maxLevel: 12,
        effect: '+3% 이동속도'
    },

    LUCK: {
        baseCost: 80,
        scaling: 1.6,
        maxLevel: 8,
        effect: '+5% 아이템 발견율'
    }
};
```

### 진행도 관문 시스템

#### 스토리 진행 관문
- **1층 클리어**: 기본 전투 시스템 학습
- **3층 클리어**: 스킬 시스템 해금
- **5층 클리어**: 고급 무기 해금
- **7층 클리어**: 특수 능력 해금
- **10층 클리어**: 엔딩 및 New Game+ 해금

#### 능력 해금 시스템
```javascript
const UnlockSystem = {
    weapons: {
        sword: { requirement: 'start', cost: 0 },
        axe: { requirement: 'floor_2_clear', cost: 100 },
        dagger: { requirement: 'floor_4_clear', cost: 200 },
        bow: { requirement: 'floor_6_clear', cost: 300 },
        staff: { requirement: 'floor_8_clear', cost: 400 }
    },

    skills: {
        fireball: { requirement: 'start', cost: 0 },
        heal: { requirement: 'floor_3_clear', cost: 150 },
        dash: { requirement: 'floor_5_clear', cost: 250 },
        shield: { requirement: 'floor_7_clear', cost: 350 },
        lightning: { requirement: 'floor_9_clear', cost: 500 }
    }
};
```

---

## 🎲 핵심 게임 메커니즘

### 위험-보상 균형

#### 리스크 계산 시스템
```javascript
const RiskRewardBalance = {
    // 높은 위험 = 높은 보상
    treasureRoom: {
        risk: 'stronger_enemies',
        reward: 'guaranteed_rare_item'
    },

    // 안전한 선택 = 안정적 진행
    restRoom: {
        risk: 'no_combat_rewards',
        reward: 'full_health_mana_restore'
    },

    // 도박적 선택 = 불확실한 결과
    mysteryRoom: {
        risk: 'unknown_encounter',
        reward: 'potential_legendary_item'
    }
};
```

### 플레이어 에이전시 (선택권)

#### 전략적 선택 지점
1. **빌드 구성**: 무기 + 스킬 조합 선택
2. **경로 선택**: 안전/위험 루트 결정
3. **자원 관리**: 언제 포션을 사용할지
4. **업그레이드 순서**: 어떤 능력을 먼저 강화할지
5. **은퇴 타이밍**: 언제 포기하고 소울 포인트를 확보할지

#### 선택의 결과
```javascript
const PlayerChoiceImpact = {
    immediate: 'current_run_performance',
    shortTerm: 'next_few_runs_strategy',
    longTerm: 'overall_progression_speed',
    permanent: 'unlocked_content_and_abilities'
};
```

---

## 🎯 성공 지표

### 플레이어 참여도
- **세션 길이**: 평균 25-35분
- **재방문율**: 7일 내 70% 이상
- **완주율**: 신규 플레이어 30% 이상
- **재플레이율**: 완주 후 80% 이상 재시작

### 게임플레이 품질
- **학습 곡선**: 3시간 내 기본 숙련
- **난이도 만족도**: "어렵지만 공정함" 평가
- **빌드 다양성**: 5가지 이상 유효한 전략
- **발견 요소**: 플레이어당 평균 3개 이상 숨겨진 요소 발견

---

**문서 관리 정보:**
- **다음 문서**: [02. 스토리 & 세계관](./02-story-worldbuilding.md)
- **관련 문서**: [03. 게임플레이 시스템](./03-gameplay-systems.md)
- **최종 수정**: 2025-09-28