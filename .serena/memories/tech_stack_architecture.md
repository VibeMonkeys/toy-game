# 기술 스택 및 아키텍처

## 🛠️ 기술 스택
### 코어 기술
- **HTML5 Canvas**: 게임 렌더링 엔진
- **JavaScript ES6**: 메인 프로그래밍 언어 (Vanilla JS)
- **ES6 Modules**: 모듈 시스템
- **CSS3**: 스타일링 및 레이아웃

### 브라우저 지원
- Chrome 61+ (ES6 모듈 지원)
- Firefox 60+
- Safari 10.1+
- Edge 16+

## 🏗️ 아키텍처 패턴
### 전체 구조
- **모듈화된 MVC 패턴**: 관심사 분리
- **렌더링 시스템 분리**: 책임별 렌더러 클래스
- **Manager 패턴**: 퀘스트, 맵 등 시스템별 관리자
- **효과 시스템**: 파티클, 전환 효과 독립 관리

### 디렉토리 구조 (9개 주요 모듈)
```
src/
├── core/           # 게임 핵심 로직 (7 파일)
├── data/           # 게임 데이터 (2 파일)
├── effects/        # 시각 효과 시스템 (2 파일)
├── entities/       # 게임 엔티티 (1 파일)
├── graphics/       # 렌더링 시스템 (2 파일)
├── maps/           # 맵 시스템 (3 파일)
├── objects/        # 상호작용 오브젝트 (4 파일)
├── ui/             # UI 컴포넌트 (13 파일)
└── utils/          # 유틸리티 (3 파일)
```

## 🎨 렌더링 아키텍처
### 렌더링 분리 전략
1. **Renderer.js**: 메인 월드 렌더링 (맵, 캐릭터, 오브젝트)
2. **GameUIRenderer.js**: 게임 UI 전용 (힌트, 디버그 정보)
3. **DialogRenderer.js**: 대화창 전용 (NPC 대화)

### 효과 시스템
1. **ParticleSystem.js**: 파티클 효과 (수집, 완료 등)
2. **TransitionManager.js**: 화면 전환 효과 (페이드, 슬라이드)

## 🎯 핵심 클래스 구조
### Game.js (메인 컨트롤러) - 1,100+ 줄
- 게임 전체 상태 관리 및 조율
- 모든 시스템 초기화
- 게임 루프 및 60 FPS 프레임 최적화
- 이벤트 처리 (키보드, 마우스, 한글 지원)

### QuestManager.js (퀘스트 시스템)
- Manager 패턴으로 데이터와 로직 분리
- QuestData.js와 연동하여 타입별 퀘스트 관리
- 메인/서브 퀘스트 진행 상황 추적

### MapManager.js & MapData.js (맵 시스템)
- 타일 기반 맵 시스템
- 충돌 감지 및 상호작용 요소 관리
- 층별 맵 데이터 관리

## 📈 성능 최적화 전략
### 프레임 관리
- 60 FPS 타겟 프레임 제한 (`targetFPS`, `frameInterval`)
- `requestAnimationFrame` 사용
- 필요 부분만 리렌더링

### 메모리 관리
- 파티클 시스템 생명주기 관리
- 이벤트 리스너 적절한 등록/해제
- 모듈별 캐시 최적화

### Canvas 최적화
- clearScreen → 부분 redraw
- 스프라이트 배치 최적화
- 렌더링 패스 분리

## 🔗 모듈 의존성
### 핵심 의존성 체인
```
Game.js → 모든 시스템 관리자
├── QuestManager.js → QuestData.js
├── MapManager.js → MapData.js
├── Renderer.js → SpriteManager.js
├── ParticleSystem.js (독립)
└── TransitionManager.js (독립)
```

### 상수 관리
- `Constants.js`: 모든 상수 중앙 관리
- 게임 모드, 방향, 퀘스트 타겟, 맵 정보 등