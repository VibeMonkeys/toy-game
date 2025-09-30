# 🎵 06. 오디오 & 비주얼

## 📋 문서 정보
- **문서 버전**: v1.0
- **작성일**: 2025-09-28
- **담당 영역**: 시각 및 청각 요소 설계

---

## 🎨 아트 스타일 & 색상 팔레트

### 전체 아트 디렉션

#### 스타일 컨셉
- **장르**: 픽셀 아트 (16-bit 스타일)
- **해상도**: 64x64 기본 스프라이트
- **애니메이션**: 8-16 프레임 루핑
- **색상 제한**: 팔레트당 최대 32색

#### 시각적 톤
- **분위기**: 다크 판타지 + 현대적 감각
- **대비**: 높은 명암 대비로 가독성 확보
- **조명**: 동적 그림자와 빛 효과
- **질감**: 픽셀 단위의 세밀한 디테일

### 색상 팔레트 시스템

#### 메인 팔레트
```css
/* 기본 게임 월드 */
:root {
    --bg-dark: #1a1a2e;      /* 어두운 배경 */
    --bg-mid: #16213e;       /* 중간 배경 */
    --accent-blue: #0f3460;   /* 블루 강조 */
    --accent-cyan: #533483;   /* 시안 강조 */
    --light: #e94560;        /* 밝은 강조 */
}
```

#### UI 팔레트
```css
/* 인터페이스 요소 */
:root {
    --ui-primary: #2c3e50;   /* 메인 UI */
    --ui-secondary: #34495e; /* 보조 UI */
    --ui-accent: #3498db;    /* 강조 색상 */
    --ui-success: #2ecc71;   /* 성공 표시 */
    --ui-warning: #f39c12;   /* 경고 표시 */
    --ui-error: #e74c3c;     /* 오류 표시 */
}
```

#### 아이템 등급별 색상
```css
/* 아이템 희귀도 */
:root {
    --common: #9e9e9e;       /* 일반 (회색) */
    --uncommon: #4caf50;     /* 비일반 (초록) */
    --rare: #2196f3;         /* 레어 (파랑) */
    --epic: #9c27b0;         /* 에픽 (보라) */
    --legendary: #ff9800;    /* 전설 (주황) */
    --mythic: #f44336;       /* 신화 (빨강) */
}
```

### 환경별 색상 테마

#### 층별 분위기 연출
1. **1-2층 (튜토리얼)**: 밝은 톤, 안전한 느낌
   - 주색상: `#4a90a4` (차분한 청록)
   - 보조색: `#83c5be` (연한 청록)

2. **3-4층 (초급)**: 표준 던전 분위기
   - 주색상: `#2d3436` (어두운 회색)
   - 보조색: `#636e72` (중간 회색)

3. **5-6층 (중급)**: 위험 신호 시작
   - 주색상: `#a29bfe` (연한 보라)
   - 보조색: `#6c5ce7` (진한 보라)

4. **7-8층 (고급)**: 적대적 환경
   - 주색상: `#fd79a8` (연한 빨강)
   - 보조색: `#e84393` (진한 빨강)

5. **9-10층 (최종)**: 극한의 위험
   - 주색상: `#2d3436` (거의 검정)
   - 보조색: `#e17055` (주황 악센트)

---

## 🎵 사운드 디자인 & 배경음악

### 음악 구성

#### BGM 트랙 리스트
1. **메인 메뉴**: "Calm Before Storm" (2분 루프)
   - 장르: Ambient Electronic
   - 템포: 80 BPM
   - 악기: 신스패드, 피아노, 스트링

2. **던전 탐험**: "Into the Depths" (3분 루프)
   - 장르: Dark Ambient
   - 템포: 95 BPM
   - 악기: 드럼, 베이스, 신스리드

3. **전투 음악**: "Battle Surge" (2.5분 루프)
   - 장르: Electronic Rock
   - 템포: 140 BPM
   - 악기: 일렉기타, 드럼, 신스

4. **보스 전투**: "Final Confrontation" (4분)
   - 장르: Orchestral Electronic
   - 템포: 160 BPM
   - 악기: 오케스트라 + 신스

5. **승리/완료**: "Triumph" (1분)
   - 장르: Uplifting Ambient
   - 템포: 110 BPM
   - 악기: 피아노, 스트링, 신스

#### 적응형 음악 시스템
```javascript
const AdaptiveAudio = {
    // 상황별 음악 레이어
    layers: {
        base: 'ambient_base.ogg',
        tension: 'tension_layer.ogg',
        combat: 'combat_layer.ogg',
        victory: 'victory_layer.ogg'
    },

    // 크로스페이드 시간
    fadeTime: 2000, // 2초

    // 상황 감지
    updateMusic(gameState) {
        if (gameState.inCombat) {
            this.fadeTo('combat');
        } else if (gameState.nearEnemies) {
            this.fadeTo('tension');
        } else {
            this.fadeTo('base');
        }
    }
};
```

### 효과음 설계

#### 액션 사운드
- **플레이어 이동**: 부드러운 발걸음 (0.1초)
- **기본 공격**: 칼날 스와시 (0.3초)
- **스킬 사용**: 마법 에너지 폭발 (0.5초)
- **피격**: 임팩트 + 그런트 (0.2초)
- **회피/대쉬**: 바람 소리 (0.4초)

#### 인터페이스 사운드
- **버튼 클릭**: 깔끔한 탭 (0.1초)
- **메뉴 열기**: 부드러운 슬라이드 (0.3초)
- **오류**: 낮은 비프음 (0.2초)
- **성공**: 밝은 딩 (0.4초)
- **알림**: 차임벨 (0.5초)

#### 게임플레이 사운드
- **아이템 획득**: 반짝이는 링 (0.3초)
- **적 처치**: 무거운 임팩트 (0.4초)
- **레벨업**: 마법적 상승음 (1.0초)
- **보스 출현**: 위협적 등장음 (2.0초)
- **층 클리어**: 승리 팡파레 (1.5초)

### 오디오 기술 사양

#### 파일 포맷
- **BGM**: OGG Vorbis (품질 Q6, ~160kbps)
- **효과음**: OGG Vorbis (품질 Q8, ~256kbps)
- **압축**: 고품질 유지하며 파일 크기 최소화
- **루프**: 완벽한 심리스 루프 포인트

#### 동적 로딩
```javascript
const AudioLoader = {
    // 미리 로드할 핵심 사운드
    preload: [
        'ui_click.ogg',
        'player_attack.ogg',
        'enemy_hit.ogg'
    ],

    // 지연 로딩할 BGM
    lazyLoad: [
        'bgm_dungeon.ogg',
        'bgm_boss.ogg'
    ],

    // 메모리 관리
    unloadUnused() {
        // 현재 사용하지 않는 오디오 언로드
    }
};
```

---

## ✨ 시각적 효과 & 애니메이션

### 파티클 시스템

#### 아이템 획득 효과
```javascript
const ItemCollectEffect = {
    particles: 15,
    duration: 1000,
    startPos: 'item_location',
    endPos: 'ui_inventory',

    animation: {
        scale: [0.5, 1.2, 0.8],
        opacity: [1, 1, 0],
        rotation: 360
    },

    colors: {
        common: ['#ffffff'],
        rare: ['#2196f3', '#64b5f6'],
        epic: ['#9c27b0', '#ba68c8'],
        legendary: ['#ff9800', '#ffb74d']
    }
};
```

#### 전투 임팩트 효과
```javascript
const CombatEffects = {
    // 기본 공격
    meleeHit: {
        type: 'burst',
        particles: 8,
        color: '#ffffff',
        velocity: [50, 100],
        life: 300
    },

    // 크리티컬 히트
    criticalHit: {
        type: 'explosion',
        particles: 20,
        color: '#ffff00',
        velocity: [80, 150],
        life: 500,
        screenShake: true
    },

    // 마법 공격
    magicHit: {
        type: 'spiral',
        particles: 12,
        color: '#4fc3f7',
        velocity: [30, 80],
        life: 800
    }
};
```

### 캐릭터 애니메이션

#### 플레이어 스프라이트
- **Idle**: 8프레임, 호흡 애니메이션
- **Walk**: 6프레임, 순환 이동
- **Attack**: 4프레임, 빠른 공격 모션
- **Cast**: 5프레임, 스킬 시전 모션
- **Hit**: 2프레임, 피격 반응
- **Death**: 6프레임, 사망 애니메이션

#### 적 스프라이트
- **기본 적**: 4-6프레임 기본 세트
- **정예 적**: 6-8프레임 + 특수 공격
- **보스**: 10-12프레임 + 페이즈별 변화

#### 애니메이션 시스템
```javascript
class SpriteAnimator {
    constructor(spriteSheet, frameData) {
        this.spriteSheet = spriteSheet;
        this.animations = frameData;
        this.currentAnimation = 'idle';
        this.frameIndex = 0;
        this.frameTimer = 0;
    }

    update(deltaTime) {
        const anim = this.animations[this.currentAnimation];
        this.frameTimer += deltaTime;

        if (this.frameTimer >= anim.frameDelay) {
            this.frameIndex = (this.frameIndex + 1) % anim.frames.length;
            this.frameTimer = 0;
        }
    }

    setAnimation(name, force = false) {
        if (this.currentAnimation !== name || force) {
            this.currentAnimation = name;
            this.frameIndex = 0;
            this.frameTimer = 0;
        }
    }
}
```

### 환경 효과

#### 조명 시스템
```javascript
const LightingSystem = {
    // 동적 조명
    playerLight: {
        radius: 150,
        intensity: 0.8,
        color: '#ffffff',
        flicker: false
    },

    // 스킬 조명
    skillLights: {
        fireball: {
            radius: 80,
            intensity: 1.2,
            color: '#ff4500',
            duration: 300
        },

        lightning: {
            radius: 200,
            intensity: 1.5,
            color: '#00ffff',
            duration: 100,
            flicker: true
        }
    },

    // 환경 조명
    ambientLight: {
        level: 0.3, // 층수에 따라 감소
        color: '#4a4a6a'
    }
};
```

#### 날씨/환경 효과
- **1-3층**: 맑음, 기본 조명
- **4-6층**: 어두워짐, 그림자 증가
- **7-9층**: 붉은 기운, 불안정한 조명
- **10층**: 극한의 어둠, 최소 조명

---

## 🎬 화면 전환 및 시네마틱

### 전환 효과 종류

#### 페이드 전환
```css
.fade-transition {
    transition: opacity 0.5s ease-in-out;
}

.fade-enter {
    opacity: 0;
}

.fade-enter-active {
    opacity: 1;
}

.fade-exit {
    opacity: 1;
}

.fade-exit-active {
    opacity: 0;
}
```

#### 슬라이드 전환
```css
.slide-transition {
    transition: transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
}

.slide-enter {
    transform: translateX(100%);
}

.slide-enter-active {
    transform: translateX(0);
}

.slide-exit {
    transform: translateX(0);
}

.slide-exit-active {
    transform: translateX(-100%);
}
```

### 인트로 시퀀스

#### 오프닝 시네마틱 (30초)
1. **0-5초**: 로고 페이드인 + 사운드로고
2. **5-15초**: 게임 세계 전경 팬 + BGM 시작
3. **15-25초**: 캐릭터 등장 + 간단한 액션
4. **25-30초**: 타이틀 등장 + 메뉴 페이드인

#### 층 이동 연출 (3초)
1. **0-1초**: 현재 화면 페이드아웃
2. **1-2초**: 로딩 애니메이션 + 층 정보 표시
3. **2-3초**: 새 층 페이드인

### 보스 등장 연출

#### 드라마틱 등장 (5초)
```javascript
const BossIntroSequence = {
    steps: [
        {
            duration: 1000,
            action: 'screen_shake',
            intensity: 'heavy'
        },
        {
            duration: 1500,
            action: 'boss_silhouette',
            position: 'center'
        },
        {
            duration: 1000,
            action: 'name_reveal',
            text: 'BOSS_NAME',
            effect: 'typewriter'
        },
        {
            duration: 1500,
            action: 'full_reveal',
            lighting: 'dramatic'
        }
    ]
};
```

---

## 📊 시각적 정보 표시

### 데미지 넘버 시스템

#### 데미지 표시 방식
```javascript
const DamageDisplay = {
    // 일반 데미지
    normal: {
        color: '#ffffff',
        size: '18px',
        duration: 1000,
        movement: 'float_up'
    },

    // 크리티컬 데미지
    critical: {
        color: '#ffff00',
        size: '24px',
        duration: 1500,
        movement: 'bounce_up',
        effect: 'glow'
    },

    // 치유
    heal: {
        color: '#00ff00',
        size: '16px',
        duration: 1200,
        movement: 'float_up',
        prefix: '+'
    },

    // 미스/회피
    miss: {
        color: '#888888',
        size: '16px',
        duration: 800,
        text: 'MISS',
        movement: 'fade'
    }
};
```

#### 상태 효과 아이콘
- **독**: 🟢 초록 기포 + 펄스 애니메이션
- **화상**: 🔥 불꽃 아이콘 + 깜빡임
- **빙결**: ❄️ 얼음 아이콘 + 서리 효과
- **기절**: 💫 별 아이콘 + 회전
- **무적**: ✨ 반짝임 + 투명도 변화

### 진행도 표시

#### 경험치/레벨 바
```css
.progress-bar {
    background: linear-gradient(90deg,
        transparent 0%,
        var(--progress-color) 100%);
    animation: pulse 2s infinite;
    border-radius: 10px;
    overflow: hidden;
}

.progress-fill {
    transition: width 0.5s ease-out;
    background: linear-gradient(90deg,
        rgba(255,255,255,0.1) 0%,
        rgba(255,255,255,0.3) 50%,
        rgba(255,255,255,0.1) 100%);
}
```

#### 쿨다운 인디케이터
```css
.cooldown-overlay {
    background: conic-gradient(
        from 0deg,
        transparent 0deg,
        rgba(0,0,0,0.7) var(--cooldown-angle),
        transparent var(--cooldown-angle)
    );
    border-radius: 50%;
}
```

---

## 🎨 UI 비주얼 테마

### 버튼 스타일

#### 기본 버튼
```css
.button-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: 2px solid #5a67d8;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
    transition: all 0.2s ease;
}

.button-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.3);
}

.button-primary:active {
    transform: translateY(0);
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
}
```

#### 위험/중요 버튼
```css
.button-danger {
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
    border: 2px solid #e53e3e;
    animation: pulse-red 2s infinite;
}

@keyframes pulse-red {
    0%, 100% { box-shadow: 0 0 0 0 rgba(231, 76, 60, 0.4); }
    50% { box-shadow: 0 0 0 10px rgba(231, 76, 60, 0); }
}
```

### 패널 및 창 디자인

#### 정보 패널
```css
.info-panel {
    background: rgba(44, 62, 80, 0.95);
    border: 1px solid #34495e;
    border-radius: 8px;
    backdrop-filter: blur(10px);
    box-shadow:
        0 8px 32px rgba(0,0,0,0.3),
        inset 0 1px 0 rgba(255,255,255,0.1);
}
```

#### 모달 창
```css
.modal {
    background: rgba(0,0,0,0.8);
    backdrop-filter: blur(5px);
}

.modal-content {
    background: linear-gradient(145deg, #2c3e50, #34495e);
    border-radius: 12px;
    box-shadow:
        0 20px 60px rgba(0,0,0,0.5),
        inset 0 1px 0 rgba(255,255,255,0.1);
}
```

---

## 🔊 사운드 관리 시스템

### 오디오 관리자

#### 볼륨 제어
```javascript
class AudioManager {
    constructor() {
        this.volumes = {
            master: 1.0,
            music: 0.7,
            sfx: 0.8,
            voice: 0.9
        };

        this.audioNodes = new Map();
        this.currentBGM = null;
    }

    setVolume(category, value) {
        this.volumes[category] = Math.max(0, Math.min(1, value));
        this.updateAllVolumes();
    }

    playSound(soundId, category = 'sfx') {
        const audio = this.getAudioNode(soundId);
        audio.volume = this.volumes.master * this.volumes[category];
        audio.play();
    }

    crossfade(fromTrack, toTrack, duration = 2000) {
        // 부드러운 BGM 전환
        const steps = 20;
        const stepTime = duration / steps;
        let currentStep = 0;

        const fadeInterval = setInterval(() => {
            const progress = currentStep / steps;
            fromTrack.volume = (1 - progress) * this.volumes.music;
            toTrack.volume = progress * this.volumes.music;

            currentStep++;
            if (currentStep >= steps) {
                clearInterval(fadeInterval);
                fromTrack.pause();
            }
        }, stepTime);
    }
}
```

### 동적 오디오 로딩

#### 메모리 효율적 관리
```javascript
const AudioPreloader = {
    // 즉시 필요한 오디오
    essential: [
        'ui_click.ogg',
        'ui_hover.ogg',
        'player_step.ogg'
    ],

    // 게임 시작 시 로드
    gameplay: [
        'player_attack.ogg',
        'enemy_hit.ogg',
        'item_pickup.ogg'
    ],

    // 필요시 로드
    contextual: [
        'boss_music.ogg',
        'victory_fanfare.ogg'
    ],

    loadEssential() {
        return Promise.all(
            this.essential.map(file => this.loadAudio(file))
        );
    }
};
```

---

## 🎭 접근성을 위한 시각적 대안

### 색맹 지원

#### 대체 시각 표현
```javascript
const AccessibilityOptions = {
    colorBlindSupport: {
        // 패턴으로 구분
        itemRarity: {
            common: 'solid',
            uncommon: 'dots',
            rare: 'stripes',
            epic: 'waves',
            legendary: 'stars'
        },

        // 모양으로 구분
        statusEffects: {
            poison: 'triangle',
            fire: 'diamond',
            ice: 'hexagon',
            stun: 'star'
        }
    },

    // 높은 대비 모드
    highContrast: {
        background: '#000000',
        foreground: '#ffffff',
        accent: '#ffff00',
        danger: '#ff0000',
        success: '#00ff00'
    }
};
```

### 청각 장애 지원

#### 시각적 피드백 강화
```javascript
const VisualNotifications = {
    // 소리를 시각으로 변환
    audioToVisual: {
        footsteps: 'ripple_effect',
        attack: 'screen_flash',
        hit: 'red_border_pulse',
        pickup: 'item_glow',
        levelup: 'golden_explosion'
    },

    // 중요 이벤트 표시
    importantEvents: {
        bossAppear: 'screen_shake + red_warning',
        lowHealth: 'health_bar_pulse + red_overlay',
        skillReady: 'button_glow + bounce'
    }
};
```

---

## 📈 성능 최적화

### 그래픽 최적화

#### 렌더링 효율화
```javascript
const RenderOptimization = {
    // 오브젝트 풀링
    particlePool: new ObjectPool(ParticleEffect, 100),

    // 뷰포트 컬링
    frustumCulling: {
        enabled: true,
        margin: 50 // 화면 밖 여유 공간
    },

    // LOD (Level of Detail)
    lodSystem: {
        near: 'full_detail',    // 64x64 풀 스프라이트
        mid: 'reduced_detail',  // 32x32 축소 스프라이트
        far: 'minimal_detail'   // 16x16 최소 스프라이트
    },

    // 배치 렌더링
    batchRendering: {
        maxBatchSize: 1000,
        sortByTexture: true,
        sortByDepth: true
    }
};
```

### 오디오 최적화

#### 효율적 오디오 처리
```javascript
const AudioOptimization = {
    // 오디오 압축 설정
    compression: {
        bgm: 'ogg_q6',      // 배경음악: 중간 품질
        sfx: 'ogg_q8',      // 효과음: 높은 품질
        voice: 'ogg_q7'     // 음성: 높은 품질
    },

    // 동시 재생 제한
    concurrentLimits: {
        bgm: 1,
        sfx: 8,
        voice: 2
    },

    // 거리별 볼륨 조절
    spatialAudio: {
        maxDistance: 500,
        rolloffFactor: 0.5
    }
};
```

---

**문서 관리 정보:**
- **다음 문서**: [07. 아이템 & 보상 시스템](./07-items-rewards.md)
- **관련 문서**: [05. UI/UX 디자인](./05-ui-ux-design.md)
- **최종 수정**: 2025-09-28