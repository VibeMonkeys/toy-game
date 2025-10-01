# 🎨 게임 에셋 가이드

## 📁 폴더 구조

```
assets/
├── sprites/
│   ├── characters/    # 플레이어 스프라이트 (32x32)
│   ├── enemies/       # 적 스프라이트 (32x32)
│   ├── npcs/          # NPC 스프라이트 (32x32)
│   ├── items/         # 아이템 아이콘 (16x16)
│   └── effects/       # 파티클 효과
├── tilesets/          # 맵 타일셋
└── README.md          # 이 파일
```

## 🎮 필요한 스프라이트 목록

### 1. 플레이어 (characters/)
- `player.png` - 최진안 캐릭터 (32x32, 4방향 애니메이션)

### 2. 적들 (enemies/)
- `goblin.png` - 고블린 (32x32)
- `orc.png` - 오크 (32x32)
- `skeleton.png` - 스켈레톤 (32x32)
- `troll.png` - 트롤 (32x32)
- `wraith.png` - 레이스 (32x32)

### 3. NPC (npcs/)
- `soul_keeper.png` - 영혼 수호자 (검은 로브, 해골 마스크)
- `blacksmith.png` - 대장장이 (앞치마, 망치)
- `skill_master.png` - 기술 스승 (마법사 로브, 지팡이)
- `sage.png` - 현자 (흰 수염, 긴 로브)
- `merchant.png` - 상인 (모자, 배낭)

### 4. 보스 (enemies/)
- `goblin_chieftain.png` - 고블린 족장 (48x48)
- `orc_chieftain.png` - 오크 족장 (48x48)
- `troll_king.png` - 트롤 킹 (64x64)
- `skeleton_lord.png` - 스켈레톤 로드 (64x64)
- `death_knight.png` - 데스 나이트 (64x64)
- `chaos_lord.png` - 카오스 로드 (128x128)

## 📥 스프라이트 다운로드 방법

### 옵션 1: LPC Character Generator (추천!)
1. 사이트: https://liberatedpixelcup.github.io/Universal-LPC-Spritesheet-Character-Generator/
2. 왼쪽 메뉴에서 Body, Hair, Clothing 등 선택
3. 원하는 조합 완성
4. "Download Sheet" 클릭
5. `public/assets/sprites/` 해당 폴더에 저장

### 옵션 2: Anokolisa 16x16 Pack
1. 사이트: https://anokolisa.itch.io/free-pixel-art-asset-pack-topdown-tileset-rpg-16x16-sprites
2. "Download Now" 클릭 (무료)
3. ZIP 압축 해제
4. `Characters/` 폴더에서 필요한 스프라이트 복사

### 옵션 3: OpenGameArt
1. 사이트: https://opengameart.org/
2. 검색: "32x32 character" 또는 "RPG NPC"
3. 라이선스 확인 (CC0, CC-BY 추천)
4. 다운로드 후 적절한 폴더에 저장

## 🎨 스프라이트 시트 형식

모든 캐릭터 스프라이트는 다음 형식을 따릅니다:

```
Row 1: 위로 걷기 (4프레임)
Row 2: 왼쪽으로 걷기 (4프레임)
Row 3: 아래로 걷기 (4프레임)
Row 4: 오른쪽으로 걷기 (4프레임)
```

각 프레임 크기: 32x32 픽셀
전체 시트 크기: 128x128 픽셀

## 📝 라이선스 정보

- **LPC Assets**: CC-BY-SA 3.0, GPL 3.0
- **Anokolisa Pack**: 무료, 영구 사용 가능
- **OpenGameArt**: 각 에셋마다 라이선스 확인 필요

프로젝트에 사용 시 크레딧 표기:
```
- Liberated Pixel Cup (LPC) Contributors
- Anokolisa (itch.io)
- OpenGameArt.org
```

## 🚀 다음 단계

1. 위 사이트들에서 스프라이트 다운로드
2. `public/assets/sprites/` 폴더에 정리
3. `SpriteManager.ts` 시스템이 자동으로 로드

---

**참고**: 스프라이트 파일명은 위 목록과 정확히 일치해야 합니다!
