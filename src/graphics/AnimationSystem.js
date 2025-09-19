export class AnimationSystem {
    constructor() {
        this.globalTime = 0;
    }

    update() {
        this.globalTime += 1;
    }

    // 캐릭터 이동 애니메이션을 위한 특별 메서드
    updateCharacterAnimation(character) {
        if (character.isMoving) {
            character.animTimer++;
            if (character.animTimer > 8) {
                character.animFrame = (character.animFrame + 1) % 4;
                character.animTimer = 0;
            }
        } else {
            character.animFrame = 0;
            character.animTimer = 0;
        }
    }

    // 아이템 반짝임 효과 (현재 사용중)
    getItemAlpha() {
        return 0.7 + 0.3 * Math.sin(this.globalTime * 0.1);
    }
};