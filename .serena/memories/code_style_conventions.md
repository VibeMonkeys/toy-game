# 코드 스타일 및 개발 규칙

## 📝 코드 스타일 규칙
### 네이밍 컨벤션
- **클래스명**: PascalCase (예: `QuestManager`, `ParticleSystem`)
- **함수/메서드명**: camelCase (예: `getCurrentQuest`, `handleGameInput`)
- **변수명**: camelCase (예: `currentQuest`, `interactionHint`)
- **상수명**: SCREAMING_SNAKE_CASE (예: `GAME_MODES`, `QUEST_TARGETS`)
- **파일명**: PascalCase.js (예: `Game.js`, `QuestManager.js`)

### 모듈 시스템 패턴
```javascript
// 모든 파일은 ES6 모듈 형태
export class ClassName {
    constructor() {
        // 초기화
    }
}

// import 패턴
import { ClassName } from './path/to/file.js';
import { CONSTANTS } from '../utils/Constants.js';
```

### 상수 관리 패턴
```javascript
// Constants.js에서 모든 상수 중앙 관리
export const CONSTANTS = {
    GAME_MODES: { /* ... */ },
    QUEST_TARGETS: { /* ... */ }
};
```

## 🏗️ 아키텍처 패턴
### 단일 책임 원칙
- **렌더링 분리**: UI, 월드, 대화창을 각각 분리된 렌더러로 처리
- **효과 시스템**: 파티클과 전환 효과는 독립적 시스템으로 관리
- **퀘스트 시스템**: Manager 패턴으로 데이터와 로직 분리
- **각 클래스는 하나의 기능만 담당**

### 이벤트 처리 패턴
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

### Manager 패턴
```javascript
// QuestManager.js 예시
export class QuestManager {
    constructor() {
        this.quests = JSON.parse(JSON.stringify(QUEST_DATA));
    }
    
    getCurrentQuest() { /* ... */ }
    completeQuest(questId) { /* ... */ }
}
```

## 🎨 렌더링 패턴
### 렌더링 책임 분리
1. **Renderer.js**: 월드 렌더링 (맵, 캐릭터, 오브젝트)
2. **GameUIRenderer.js**: UI 렌더링 (힌트, 디버그)
3. **DialogRenderer.js**: 대화창 렌더링

### Canvas 렌더링 패턴
```javascript
// 표준 렌더링 메서드 구조
draw(/* parameters */) {
    // 1. 상태 확인
    if (!this.isVisible) return;
    
    // 2. 컨텍스트 설정
    this.ctx.save();
    
    // 3. 렌더링 로직
    // ...
    
    // 4. 컨텍스트 복원
    this.ctx.restore();
}
```

## 📊 로깅 및 디버깅
### Logger 사용 패턴
```javascript
import { Logger } from '../utils/Logger.js';

// 로그 레벨별 사용
Logger.info('✅ 퀘스트 완료:', quest.title);
Logger.debug('🔍 NPC 상호작용:', npcId);
Logger.error('❌ 오류 발생:', error);
```

### 디버그 모드 지원
- 코나미 코드로 디버그 모드 활성화
- 개발자 도구 Console 활용
- 상태 추적을 위한 로깅

## 🔧 개발 시 주의사항
### 게임 상태 관리
- **게임 모드 전환**: 반드시 `Game.js`를 통해
- **퀘스트 상태**: `QuestManager.js`에서만 변경
- **렌더링**: 각 전용 렌더러 클래스 활용
- **효과**: ParticleSystem과 TransitionManager 활용

### 성능 고려사항
- **60 FPS 프레임 제한** 적용
- **Canvas 렌더링 최적화** (부분 redraw)
- **파티클 시스템 생명주기** 관리
- **이벤트 리스너 적절한 등록/해제**

### 새로운 기능 개발 가이드
- **UI 추가**: GameUIRenderer.js에 메서드 추가
- **대화 기능**: DialogRenderer.js 확장
- **시각 효과**: ParticleSystem.js에 새 이펙트 추가
- **전환 효과**: TransitionManager.js에 새 전환 타입 추가
- **퀘스트**: QuestData.js에 데이터 추가, QuestManager.js에 로직 구현

## 📁 파일 구조 패턴
### 기능별 디렉토리 분리
- **core/**: 게임 핵심 로직
- **ui/**: UI 컴포넌트들
- **graphics/**: 렌더링 관련
- **effects/**: 시각 효과
- **data/**: 게임 데이터
- **utils/**: 유틸리티 함수

### import 경로 패턴
```javascript
// 상대 경로 사용
import { Game } from './core/Game.js';
import { CONSTANTS } from '../utils/Constants.js';
```