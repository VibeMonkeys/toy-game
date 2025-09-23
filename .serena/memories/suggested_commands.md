# 추천 개발 명령어

## 🚀 프로젝트 실행 명령어
### 로컬 서버 실행
```bash
# Python 기반 (추천)
python3 -m http.server 8000

# Node.js 기반 (대안)
npx serve .
```

### 접속 URL
```
http://localhost:8000
```

## 🧪 테스트 및 검증
### 브라우저 호환성 테스트
```bash
# 다양한 브라우저에서 테스트 필요
# Chrome 61+, Firefox 60+, Safari 10.1+, Edge 16+
```

### 개발자 도구 활용
```javascript
// 브라우저 Console에서 디버깅
console.log('게임 상태 확인');

// 네트워크 탭에서 모듈 로딩 확인
// ES6 모듈 로딩 상태 점검
```

## 🔧 유용한 시스템 명령어 (macOS/Darwin)
### 파일 시스템 탐색
```bash
# 디렉토리 내용 확인
ls -la

# 파일 찾기
find . -name "*.js" -type f

# 텍스트 검색 (ripgrep 추천)
rg "function.*Quest" src/

# 파일 트리 구조 보기
tree src/
```

### Git 관리
```bash
# 상태 확인
git status
git branch

# 변경사항 확인
git diff

# 커밋 히스토리
git log --oneline
```

### 개발 편의 명령어
```bash
# 파일 내용 빠르게 확인
head -20 src/core/Game.js
tail -20 src/core/Game.js

# 코드 라인 수 확인
find src -name "*.js" -exec wc -l {} + | sort -n

# 특정 패턴으로 파일 찾기
find src -name "*Quest*" -type f
```

## 🎮 게임 내 디버깅
### 히든 기능 활용
```
# 코나미 코드로 디버그 모드 활성화
↑ ↑ ↓ ↓ ← → ← → B A

# 게임 내 단축키
S키: 게임 저장
스페이스바: 상호작용
방향키: 캐릭터 이동
```

### 개발자 Console 명령어
```javascript
// 게임 객체 접근 (브라우저 console에서)
// Game 인스턴스가 전역으로 노출되지 않으므로
// 개발 시에는 임시로 window.game = this 추가 고려
```

## 📊 성능 모니터링
### 브라우저 도구 활용
```
# Performance 탭
- 60 FPS 유지 확인
- 메모리 사용량 모니터링
- Canvas 렌더링 성능 체크

# Console 탭
- 로그 메시지 확인
- 에러 메시지 추적
- 모듈 로딩 상태 점검
```

## 🔍 코드 분석 명령어
### 코드 검색 패턴
```bash
# 클래스 정의 찾기
rg "export class" src/

# 특정 메서드 찾기
rg "getCurrentQuest" src/

# 상수 사용 확인
rg "CONSTANTS\." src/

# import 구조 확인
rg "import.*from" src/
```

### 아키텍처 분석
```bash
# 의존성 파악
rg "import.*\.\./" src/ -A 1

# 렌더링 관련 파일
find src -name "*Render*" -type f

# 시스템별 파일 그룹
ls src/core/ src/ui/ src/graphics/ src/effects/
```

## 🚨 문제 해결 명령어
### 일반적인 문제 해결
```bash
# 캐시 문제 해결
# 브라우저에서 Cmd+Shift+R (Hard Reload)

# 모듈 로딩 실패 시
# 브라우저 Network 탭에서 404 에러 확인

# CORS 문제 해결
# 반드시 로컬 서버 사용 (file:// 프로토콜 사용 금지)
```

### 게임별 디버깅
```bash
# 퀘스트 시스템 문제
rg "QuestManager\|QuestData" src/ --type js

# 렌더링 문제
rg "Renderer\|draw\|render" src/ --type js

# 파티클 효과 문제
rg "Particle\|Effect" src/ --type js
```

## 💡 개발 팁
### 효율적인 워크플로우
1. **로컬 서버 항상 실행**: `python3 -m http.server 8000`
2. **브라우저 개발자 도구 상시 활용**
3. **코드 변경 후 Hard Reload**: `Cmd+Shift+R`
4. **Console 로그 활용**: Logger 클래스 적극 사용
5. **Git 상태 주기적 확인**: `git status && git diff`

### 성능 최적화 체크리스트
```bash
# FPS 모니터링
# Performance 탭에서 60 FPS 유지 확인

# 메모리 사용량 체크
# Memory 탭에서 메모리 누수 확인

# 네트워크 로딩 체크
# Network 탭에서 모듈 로딩 시간 확인
```