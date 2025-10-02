# 🏆 보스 시스템 설계 (20층 확장판)

## 📊 게임 구조 변경

### 기존 (10층)
```
1-2층: 입문
3-5층: 성장
6-8층: 도전
9-10층: 극한

보스: 2층, 4층, 10층 (3개)
```

### 신규 (20층) ⭐
```
1-4층: 입문 단계
5층: 🔥 첫 보스 - 고블린 킹

6-9층: 성장 단계
10층: 🔥 두 번째 보스 - 오크 워로드

11-14층: 숙련 단계
15층: 🔥 세 번째 보스 - 언데드 로드

16-19층: 극한 단계
20층: 🔥 최종 보스 - 카오스 드래곤

추가: 25층 (히든) - 진 최종 보스
```

---

## 👑 보스 디자인

### 🟢 5층 보스: 고블린 킹 (튜토리얼 보스)
```typescript
{
    name: "고블린 킹",
    type: "goblin_king",
    difficulty: "easy",
    health: 800,
    phases: 1,

    patterns: {
        CHARGE: {
            name: "돌진 공격",
            frequency: "main",
            cooldown: 4000,
            telegraph: 1000,  // 1초 예고
            damage: 30,
            counterplay: "좌우 회피"
        },

        CLEAVE: {
            name: "회전 베기",
            frequency: "filler",
            cooldown: 3000,
            telegraph: 500,
            damage: 25,
            aoe: 120,  // 120도 부채꼴
            counterplay: "후퇴"
        },

        SUMMON: {
            name: "고블린 소환",
            frequency: "special",
            cooldown: 15000,
            summonCount: 2,
            summonType: "goblin",
            interruptible: true,  // 공격으로 취소 가능
            counterplay: "채널링 중 공격"
        }
    },

    rewards: {
        soulPoints: 100,
        guaranteedDrop: "iron_sword"
    }
}
```

### 🟡 10층 보스: 오크 워로드 (2페이즈)
```typescript
{
    name: "오크 워로드",
    type: "orc_warlord",
    difficulty: "medium",
    health: 1800,
    phases: 2,

    phase1: {
        healthRange: [100, 50],
        patterns: {
            GROUND_SLAM: {
                name: "대지 강타",
                cooldown: 6000,
                telegraph: 800,
                damage: 50,
                shockwave: {
                    rings: 3,
                    speed: 300,
                    spacing: 60
                },
                counterplay: "충격파 사이로 이동"
            },

            RAGE_ROAR: {
                name: "분노의 함성",
                cooldown: 12000,
                effect: {
                    selfBuff: "공격력 +50%, 공격속도 +30%",
                    duration: 10000
                },
                counterplay: "버프 중 거리 유지"
            },

            AXE_COMBO: {
                name: "도끼 난타",
                cooldown: 5000,
                hits: 3,
                damage: [30, 35, 45],
                counterplay: "중간에 회피"
            }
        }
    },

    phase2: {
        healthRange: [50, 0],
        trigger: {
            animation: "transformation",
            duration: 2000,
            invulnerable: true,
            message: "분노가 폭발한다!"
        },

        changes: {
            speed: 1.5,
            attackSpeed: 1.8,
            newPattern: "BERSERK_RUSH"
        },

        patterns: {
            BERSERK_RUSH: {
                name: "광폭 돌진",
                cooldown: 8000,
                sequence: [
                    { action: "dash", speed: 500, distance: 200 },
                    { action: "slash", damage: 60 },
                    { action: "dash", speed: 500, distance: 200 },
                    { action: "slash", damage: 60 },
                    { action: "recovery", duration: 1500, vulnerable: true }
                ]
            },

            // Phase 1 패턴도 더 빠르게
            GROUND_SLAM: { cooldown: 4000 },
            AXE_COMBO: { cooldown: 3000, damage: [40, 50, 70] }
        }
    },

    rewards: {
        soulPoints: 250,
        guaranteedDrop: "steel_axe",
        questProgress: "main_quest_10"
    }
}
```

### 🔴 15층 보스: 언데드 로드 (마법 보스, 2페이즈)
```typescript
{
    name: "언데드 로드",
    type: "undead_lord",
    difficulty: "hard",
    health: 3000,
    phases: 2,

    phase1: {
        healthRange: [100, 60],
        patterns: {
            DARK_PROJECTILE: {
                name: "암흑 구체",
                cooldown: 2000,
                projectiles: 3,
                speed: 200,
                damage: 40,
                homing: false,
                counterplay: "패턴 읽고 회피"
            },

            SHADOW_SPEAR: {
                name: "그림자 창",
                cooldown: 5000,
                telegraph: 1500,
                damage: 80,
                aoeRadius: 60,
                counterplay: "표시 보고 이동"
            },

            SUMMON_SKELETON: {
                name: "스켈레톤 소환",
                cooldown: 12000,
                summonCount: 4,
                summonType: "skeleton",
                counterplay: "빠르게 처치"
            },

            TELEPORT: {
                name: "순간이동",
                cooldown: 8000,
                telegraph: 500,
                action: "disappear → reappear at random position",
                followUp: "DARK_PROJECTILE"
            }
        }
    },

    phase2: {
        healthRange: [60, 0],
        trigger: {
            animation: "dark_transformation",
            message: "어둠의 힘이 폭발한다!",
            effect: "화면 어두워짐"
        },

        patterns: {
            DARK_RAIN: {
                name: "암흑의 비",
                cooldown: 10000,
                duration: 5000,
                randomProjectiles: {
                    count: 30,
                    interval: 200,
                    damage: 35
                },
                counterplay: "끊임없이 이동"
            },

            DEATH_BEAM: {
                name: "죽음의 광선",
                cooldown: 15000,
                telegraph: 2000,
                sweepDuration: 3000,
                damage: 100,
                counterplay: "회전하는 광선 회피"
            },

            // Phase 1 패턴 강화
            DARK_PROJECTILE: { projectiles: 5, homing: true },
            SUMMON_SKELETON: { summonCount: 6 }
        }
    }
}
```

### 🔥 20층 보스: 카오스 드래곤 (최종 보스, 3페이즈)
```typescript
{
    name: "카오스 드래곤",
    type: "chaos_dragon",
    difficulty: "extreme",
    health: 5000,
    phases: 3,

    phase1: {
        name: "시험의 시작",
        healthRange: [100, 70],
        theme: "기본 메카닉 종합 테스트",

        patterns: {
            FIRE_BREATH: {
                name: "화염 브레스",
                cooldown: 5000,
                telegraph: 1000,
                cone: 90,  // 90도 부채꼴
                range: 300,
                damage: 60,
                burning: { duration: 3000, dps: 10 }
            },

            TAIL_SWIPE: {
                name: "꼬리 후려치기",
                cooldown: 4000,
                telegraph: 600,
                arc: 180,
                damage: 70,
                knockback: 150
            },

            WING_GUST: {
                name: "날개 돌풍",
                cooldown: 8000,
                pushback: 200,
                damage: 40,
                stun: 1000
            },

            AERIAL_DIVE: {
                name: "공중 급강하",
                cooldown: 12000,
                sequence: [
                    { action: "fly_up", duration: 1000, invulnerable: true },
                    { action: "target_player", duration: 1500, telegraph: "붉은 원" },
                    { action: "dive", speed: 800, damage: 100, aoe: 100 },
                    { action: "recovery", duration: 2000, vulnerable: true }
                ]
            }
        }
    },

    phase2: {
        name: "진정한 위협",
        healthRange: [70, 40],
        trigger: {
            animation: "enrage",
            message: "드래곤의 분노가 하늘을 태운다!",
            effect: "화면 붉게 변함"
        },

        changes: {
            speed: 1.3,
            allCooldowns: 0.7,  // 모든 쿨다운 30% 감소
            newPatterns: ["METEOR", "FLAME_PILLAR"]
        },

        patterns: {
            METEOR: {
                name: "메테오 낙하",
                cooldown: 10000,
                meteorCount: 5,
                telegraph: 2000,
                damage: 90,
                aoeRadius: 80,
                counterplay: "낙하 지점 표시 보고 회피"
            },

            FLAME_PILLAR: {
                name: "화염 기둥",
                cooldown: 8000,
                pillars: 8,
                pattern: "원형 배치",
                duration: 4000,
                damage: 50,
                counterplay: "기둥 사이로 이동"
            },

            // Phase 1 패턴 강화
            FIRE_BREATH: { cone: 120, range: 400, damage: 80 },
            AERIAL_DIVE: { cooldown: 8000 }
        }
    },

    phase3: {
        name: "최후의 발악",
        healthRange: [40, 0],
        trigger: {
            animation: "chaos_awakening",
            message: "혼돈의 진정한 힘이 깨어난다!",
            effect: "화면 격렬하게 흔들림"
        },

        patterns: {
            CHAOS_ULTIMATE: {
                name: "카오스 노바",
                cooldown: 20000,
                sequence: [
                    { action: "charge", duration: 5000, visual: "화면 전체 붉은색", audio: "경고음" },
                    { action: "explode", damage: 300, range: "화면 전체" },
                    { action: "safe_zone", count: 3, radius: 80, telegraph: "노란색 원" }
                ],
                counterplay: "5초 안에 안전 지대로"
            },

            RAGE_MODE: {
                name: "분노 모드",
                trigger: "health < 20%",
                duration: 999999,  // 영구
                effect: {
                    attackSpeed: 2.0,
                    moveSpeed: 1.5,
                    allDamage: 1.5,
                    patterns: "모두 쿨다운 50% 감소"
                }
            },

            // 모든 이전 패턴 사용 (빠른 속도)
            allPreviousPatterns: "enhanced"
        }
    },

    onDefeat: {
        animation: "dragon_fall",
        message: "카오스 드래곤을 물리쳤다!",
        rewards: {
            soulPoints: 1000,
            guaranteedDrops: ["dragon_scale", "chaos_essence"],
            unlocks: ["true_ending", "new_game_plus"]
        }
    }
}
```

---

## 🎯 보스 배치 전략

### 난이도 곡선
```
층수    보스             난이도    학습 목표
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5층     고블린 킹         ⭐       기본 패턴 학습
10층    오크 워로드        ⭐⭐     페이즈 전환, 버프 대응
15층    언데드 로드        ⭐⭐⭐   마법 회피, 소환 처리
20층    카오스 드래곤      ⭐⭐⭐⭐  모든 메카닉 종합
```

### 보상 경제
```typescript
const bossRewards = {
    5층:  { souls: 100,  gold: 200,  item: "uncommon" },
    10층: { souls: 250,  gold: 500,  item: "rare" },
    15층: { souls: 500,  gold: 1000, item: "epic" },
    20층: { souls: 1000, gold: 2000, item: "legendary" }
};
```

---

## 🔧 기술 구현 계획

### 1. Boss 클래스 (src/entities/Boss.ts)
```typescript
export class Boss extends Enemy {
    private currentPhase: number = 1;
    private patterns: BossPattern[];
    private patternQueue: PatternSequence[] = [];
    private isExecutingPattern: boolean = false;

    constructor(x, y, bossType: BossType, bossData: BossData) {
        super(x, y, bossType as any, true);
        // 보스 전용 초기화
    }

    update(deltaTime: number, player: Player): void {
        // 페이즈 체크
        this.checkPhaseTransition();

        // 패턴 실행
        if (!this.isExecutingPattern) {
            this.selectNextPattern();
        }

        this.executeCurrentPattern(deltaTime, player);
    }

    private checkPhaseTransition(): void { ... }
    private selectNextPattern(): void { ... }
    private executeCurrentPattern(): void { ... }
}
```

### 2. BossPatternSystem (src/systems/BossPatternSystem.ts)
```typescript
export class BossPatternSystem {
    executePattern(boss: Boss, pattern: BossPattern, player: Player): void {
        for (const sequence of pattern.sequence) {
            await this.executeSequence(boss, sequence, player);
        }
    }

    private executeSequence(boss: Boss, seq: PatternSequence, player: Player): Promise<void> {
        switch(seq.action) {
            case 'telegraph':
                this.showTelegraph(boss, seq);
                break;
            case 'attack':
                this.executeAttack(boss, seq, player);
                break;
            case 'summon':
                this.spawnMinions(boss, seq);
                break;
            // ...
        }
    }
}
```

### 3. BossUI (src/ui/BossUI.ts)
```typescript
export class BossUI {
    private bossName: string;
    private currentHealth: number;
    private maxHealth: number;
    private currentPhase: number;
    private totalPhases: number;

    render(renderer: Renderer): void {
        // 화면 상단 보스 체력바
        this.renderBossHealthBar(renderer);

        // 페이즈 표시
        this.renderPhaseIndicator(renderer);

        // 패턴 경고
        if (this.telegraphActive) {
            this.renderTelegraph(renderer);
        }
    }
}
```

---

## 📈 밸런싱 공식

### 보스 체력 계산
```typescript
const bossHealth = (floor: number) => {
    return 500 + (floor * 200) + (floor * floor * 10);
}

// 5층:  500 + 1000 + 250  = 1750
// 10층: 500 + 2000 + 1000 = 3500
// 15층: 500 + 3000 + 2250 = 5750
// 20층: 500 + 4000 + 4000 = 8500
```

### 일반 몬스터 스케일링 (20층 기준)
```typescript
const enemyScaling = (baseValue: number, floor: number) => {
    return baseValue * (1 + (floor - 1) * 0.08);  // 층당 8% 증가
}

// 체력: 50 → 20층: 126
// 공격: 10 → 20층: 25
```

---

**이 설계대로 진행할까요?** 🚀
