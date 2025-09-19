# 휴넷 26주년 창립 기념 게임

포켓몬스터 스타일의 2D RPG 보물찾기 게임입니다.

## 🎮 게임 방법
- 방향키로 캐릭터 이동
- 스페이스바로 NPC와 대화
- S키로 게임 저장
- 김대리 → 박과장 → 이부장 → CEO 순서로 찾아가며 보물을 찾으세요!

## 🏗️ 프로젝트 구조
```
src/
├── core/           # 게임 핵심 로직
│   ├── Game.js          # 메인 게임 클래스
│   ├── GameState.js     # 상태 관리
│   └── QuestSystem.js   # 퀘스트 시스템
├── entities/       # 게임 엔티티
│   └── Player.js        # 플레이어 관련
├── ui/            # UI 컴포넌트
│   ├── TitleScreen.js   # 타이틀 화면
│   ├── QuestUI.js      # 퀘스트 UI
│   ├── Minimap.js      # 미니맵
│   └── Inventory.js    # 인벤토리
├── maps/          # 맵 시스템
│   ├── MapManager.js    # 맵 관리
│   ├── MapData.js      # 맵 데이터
│   └── Camera.js       # 카메라 시스템
├── graphics/      # 렌더링 시스템
│   ├── Renderer.js     # 렌더링 엔진
│   └── AnimationSystem.js # 애니메이션
└── utils/         # 유틸리티
    ├── Constants.js    # 상수 정의
    ├── SaveSystem.js   # 저장/로드
    └── AudioManager.js # 사운드
```

## 🚀 실행하기

### 온라인에서 플레이
🎮 **[여기서 바로 게임하기](https://yourusername.github.io/toy-game/)**

### 로컬에서 실행
```bash
python3 -m http.server 8000
```
http://localhost:8000 접속

### 브라우저 호환성
- ✅ Chrome 61+
- ✅ Firefox 60+
- ✅ Safari 10.1+
- ✅ Edge 16+

## 📊 통계
- **총 코드 라인**: 2,119줄 (16개 모듈)
- **원본 대비**: 681줄 감소 (모듈화 + 불필요한 코드 제거)

## ✨ 기술 스택
- **Frontend**: HTML5 Canvas, ES6 Modules
- **Language**: JavaScript (Vanilla)
- **Styling**: CSS3
- **Architecture**: 모듈화된 MVC 패턴

## 🎯 주요 기능
- ✅ 타이틀 화면 & 메뉴 시스템
- ✅ 저장/로드 기능
- ✅ 퀘스트 & 진행도 추적
- ✅ 미니맵 & 인벤토리
- ✅ NPC 상호작용 시스템
- ✅ 반응형 UI (스크롤 없는 고정 화면)