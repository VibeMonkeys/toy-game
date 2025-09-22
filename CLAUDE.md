# 휴넷 26주년 창립 기념 게임 - Claude Code 프로젝트 가이드

## 🎮 프로젝트 개요

휴넷 26주년 창립 기념 포켓몬스터 스타일 2D RPG 보물찾기 게임입니다. HTML5 Canvas와 바닐라 JavaScript ES6 모듈을 사용하여 제작된 웹 기반 게임입니다.

### 📊 프로젝트 통계
- **총 코드 라인**: 10,077줄 (33개 JavaScript 파일)
- **아키텍처**: 모듈화된 MVC 패턴 + 렌더링 분리
- **기술 스택**: HTML5 Canvas, ES6 Modules, Vanilla JavaScript, 파티클 시스템
- **브라우저 지원**: Chrome 61+, Firefox 60+, Safari 10.1+, Edge 16+

## 🏗️ 아키텍처 구조

```
toy-game/
├── index.html              # 메인 HTML (게임 엔트리 포인트)
├── style.css              # 글로벌 스타일
├── README.md              # 프로젝트 문서
├── GAME_IMPROVEMENT_PLAN.md # 게임 개선 계획서
└── src/                   # 소스 코드
    ├── core/              # 게임 핵심 로직 (7 파일)
    │   ├── Game.js            # 메인 게임 클래스 (1.1K줄)
    │   ├── GameState.js       # 상태 관리
    │   ├── QuestSystem.js     # 퀘스트 시스템 (리팩토링됨)
    │   ├── QuestManager.js    # 퀘스트 관리 로직
    │   ├── QuestSystemOld.js  # 이전 버전 백업
    │   ├── GameUIRenderer.js  # UI 렌더링 전용
    │   └── DialogRenderer.js  # 대화창 렌더링 전용
    ├── data/              # 게임 데이터 (2 파일)
    │   ├── QuestData.js       # 퀘스트 데이터 정의
    │   └── QuizData.js        # 퀴즈 데이터
    ├── effects/           # 시각 효과 시스템 (2 파일)
    │   ├── ParticleSystem.js  # 파티클 효과 (수집, 완료 등)
    │   └── TransitionManager.js # 화면 전환 효과
    ├── entities/          # 게임 엔티티 (1 파일)
    │   └── Player.js          # 플레이어 클래스
    ├── maps/              # 맵 시스템 (3 파일)
    │   ├── MapManager.js      # 맵 관리
    │   ├── MapData.js         # 맵 데이터
    │   └── Camera.js          # 카메라 시스템
    ├── graphics/          # 렌더링 시스템 (2 파일)
    │   ├── Renderer.js        # 메인 렌더링 엔진
    │   └── AnimationSystem.js # 애니메이션
    ├── ui/                # UI 컴포넌트 (13 파일)
    │   ├── TitleScreen.js     # 타이틀 화면
    │   ├── LoadingScreen.js   # 로딩 화면
    │   ├── IntroScreen.js     # 인트로 화면
    │   ├── QuestUI.js         # 퀘스트 UI
    │   ├── QuestGuide.js      # 퀘스트 가이드
    │   ├── Minimap.js         # 미니맵
    │   ├── Inventory.js       # 인벤토리
    │   ├── PauseMenu.js       # 일시정지 메뉴
    │   ├── ElevatorUI.js      # 엘리베이터 UI
    │   ├── MiniGameSystem.js  # 미니게임 시스템
    │   ├── TutorialSystem.js  # 튜토리얼 시스템
    │   ├── CelebrationScreen.js # 축하 화면
    │   └── CertificateScreen.js # 수료증 화면
    └── utils/             # 유틸리티 (3 파일)
        ├── Constants.js       # 상수 정의
        ├── SaveSystem.js      # 저장/로드
        └── AudioManager.js    # 사운드 관리
```

## 🎯 핵심 게임 기능

### 게임 모드
- **LOADING**: 초기 로딩 화면
- **TITLE**: 타이틀 메뉴 (새 게임/이어하기)
- **INTRO**: 게임 소개 화면
- **PLAYING**: 메인 게임플레이
- **PAUSED**: 일시정지 상태
- **CELEBRATION**: 축하 화면
- **CERTIFICATE**: 수료증 화면

### 퀘스트 시스템
- **메인 퀘스트**: 6개 주요 미션
- **서브 퀘스트**: 다수의 보조 미션
- **아이템 수집**: 특정 아이템 요구 퀘스트
- **NPC 상호작용**: 대화 기반 퀘스트 진행

### UI 시스템
- **반응형 UI**: 스크롤 없는 고정 화면
- **미니맵**: 실시간 위치 표시
- **인벤토리**: 아이템 관리
- **퀘스트 가이드**: 진행 상황 추적
- **튜토리얼**: 게임 방법 안내

## 🔧 개발 가이드

### 실행 방법
```bash
# 로컬 서버 실행
python3 -m http.server 8000
# 또는
npx serve .
```

### 핵심 클래스 이해

#### Game.js (메인 게임 클래스) - 1,100+ 줄
- 게임 전체 상태 관리 및 조율
- 모든 시스템 초기화 (렌더링, UI, 효과 시스템)
- 게임 루프 및 프레임 최적화 (60 FPS)
- 복합 이벤트 처리 (키보드, 마우스, 한글 지원)
- 히든 기능 (코나미 코드, 디버그 모드)

#### QuestSystem.js + QuestManager.js (리팩토링된 퀘스트 시스템)
- **QuestSystem.js**: 레거시 호환성 유지하는 프록시 클래스
- **QuestManager.js**: 실제 퀘스트 로직 관리
- **QuestData.js**: 퀘스트 데이터 정의 (타입, 검증 규칙)
- 메인 퀘스트 진행 상황 추적
- 아이템 요구사항 검증 및 자동 제출
- NPC별 퀘스트 관리

#### 렌더링 시스템 분리
- **Renderer.js**: 메인 월드 렌더링 (맵, 캐릭터, 오브젝트)
- **GameUIRenderer.js**: 게임 UI 전용 렌더링 (힌트, 디버그 정보)
- **DialogRenderer.js**: 대화창 전용 렌더링 (NPC 대화)

#### 효과 시스템 (새로 추가)
- **ParticleSystem.js**: 아이템 수집, 퀘스트 완료, 보상 파티클 효과
- **TransitionManager.js**: 페이드, 슬라이드 등 화면 전환 효과

#### MapManager.js & MapData.js
- 타일 기반 맵 시스템
- 충돌 감지 및 상호작용 요소 관리
- NPC, 아이템, 포털 배치
- 층별 맵 데이터 관리

### 개발 패턴

#### 모듈 시스템
```javascript
// 모든 파일은 ES6 모듈 형태
export class ClassName {
    constructor() {
        // 초기화
    }
}

// 다른 파일에서 import
import { ClassName } from './path/to/file.js';
```

#### 상수 관리
```javascript
// Constants.js에서 모든 상수 중앙 관리
export const CONSTANTS = {
    GAME_MODES: { /* ... */ },
    QUEST_TARGETS: { /* ... */ }
};
```

#### 이벤트 처리
```javascript
// Game.js에서 중앙 집중 이벤트 처리
handleKeyDown(event) {
    switch(this.gameMode) {
        case CONSTANTS.GAME_MODES.PLAYING:
            this.handleGameInput(event);
            break;
        // ...
    }
}
```

## 🛠️ 개발 시 주의사항

### 아키텍처 원칙
- **렌더링 분리**: UI, 월드, 대화창을 각각 분리된 렌더러로 처리
- **효과 시스템**: 파티클과 전환 효과는 독립적 시스템으로 관리
- **퀘스트 시스템**: Manager 패턴으로 데이터와 로직 분리
- **단일 책임**: 각 클래스는 하나의 기능만 담당

### 게임 상태 관리
- 게임 모드 전환은 반드시 `Game.js`를 통해
- 퀘스트 상태는 `QuestManager.js`에서만 변경
- 렌더링은 각 전용 렌더러 클래스 활용
- 효과는 ParticleSystem과 TransitionManager 활용

### 성능 최적화
- 60 FPS 프레임 제한 적용 (`targetFPS`, `frameInterval`)
- Canvas 렌더링 최적화 (clearScreen → 필요 부분만 redraw)
- 파티클 시스템 생명주기 관리
- 이벤트 리스너 적절한 등록/해제

### 새로운 기능 개발 가이드
- **UI 추가**: GameUIRenderer.js에 메서드 추가
- **대화 기능**: DialogRenderer.js 확장
- **시각 효과**: ParticleSystem.js에 새 이펙트 추가
- **전환 효과**: TransitionManager.js에 새 전환 타입 추가
- **퀘스트**: QuestData.js에 데이터 추가, QuestManager.js에 로직 구현

## 🎨 UI/UX 개선 가이드

### 현재 구현된 UI 컴포넌트
- **TitleScreen**: 게임 시작 메뉴
- **QuestUI**: 퀘스트 진행 상황 표시
- **Minimap**: 현재 위치 및 목표 표시
- **Inventory**: 아이템 관리 인터페이스
- **PauseMenu**: 게임 설정 및 저장

### UI 개선 포인트
- 모바일 반응형 지원 강화
- 접근성 개선 (키보드 내비게이션)
- 애니메이션 효과 추가
- 다국어 지원 준비

## 📈 향후 개발 계획

### 1단계: 시각적 효과 완성
- ✅ **파티클 시스템 구현**: 아이템 수집, 퀘스트 완료 효과
- ✅ **전환 효과 시스템**: 페이드, 슬라이드 애니메이션
- ✅ **렌더링 시스템 분리**: UI, 월드, 대화창 독립화
- 🔄 **파티클 효과 확장**: 더 다양한 효과 추가

### 2단계: 퀘스트 시스템 고도화
- ✅ **퀘스트 시스템 리팩토링**: Manager 패턴 적용
- ✅ **데이터 분리**: QuestData.js로 데이터 독립화
- 🔄 **서브 퀘스트 재활성화**: 현재 비활성화된 시스템 복구
- 🔄 **동적 퀘스트**: 랜덤 또는 조건부 퀘스트

### 3단계: 게임성 확장
- 🔄 **NPC 다양화**: 층당 5-8명으로 증가
- 🔄 **미니게임 확장**: 다양한 장르의 미니게임
- 🔄 **업적 시스템**: 히든 업적 및 컬렉션 요소

## 🐛 알려진 이슈 및 해결 방법

### 공통 문제
1. **모듈 로딩 실패**: ES6 모듈 지원 브라우저 확인
2. **Canvas 렌더링 지연**: requestAnimationFrame 사용
3. **메모리 누수**: 이벤트 리스너 정리

### 디버깅 팁
- 브라우저 개발자 도구 Console 활용
- `console.log`를 통한 상태 추적
- 네트워크 탭에서 모듈 로딩 확인

## 🔗 참고 자료

- [HTML5 Canvas API](https://developer.mozilla.org/ko/docs/Web/API/Canvas_API)
- [ES6 Modules](https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Modules)
- [JavaScript 게임 개발](https://developer.mozilla.org/ko/docs/Games)

## 🔧 주요 업데이트 (최신)

### v1.1 - 렌더링 시스템 고도화
- **파티클 시스템 추가**: 시각적 피드백 강화
- **전환 효과 시스템**: 부드러운 화면 전환
- **렌더링 분리**: GameUIRenderer, DialogRenderer 독립화
- **퀘스트 시스템 리팩토링**: Manager 패턴 적용
- **성능 최적화**: 60 FPS 프레임 제한

### 새로운 파일들
```javascript
// 효과 시스템
src/effects/ParticleSystem.js      // 파티클 효과
src/effects/TransitionManager.js   // 화면 전환

// 렌더링 분리
src/core/GameUIRenderer.js         // UI 렌더링
src/core/DialogRenderer.js         // 대화창 렌더링

// 퀘스트 시스템 개선
src/core/QuestManager.js           // 퀘스트 관리자
src/data/QuestData.js             // 퀘스트 데이터
```

### 개발자 노트
- 코드베이스가 **10,077줄**로 증가 (이전 8,816줄)
- **33개 파일**로 모듈화 (이전 26개)
- 렌더링 성능 및 시각적 효과 대폭 개선
- 코드 구조 더욱 체계화 및 확장 가능성 증대

---

**최종 업데이트**: 2025-09-22
**게임 버전**: v1.1 (렌더링 시스템 고도화)
**개발 환경**: Vanilla JavaScript + HTML5 Canvas + 파티클 시스템