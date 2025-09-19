export class AnimationSystem {
    constructor() {
        this.globalTime = 0;
    }

    update() {
        this.globalTime += 1;
    }

    // 캐릭터 이동 애니메이션을 위한 특별 메서드
    updateCharacterAnimation(character) {
        character.updateAnimation();
    }

    // 아이템 반짝임 효과 (현재 사용중)
    getItemAlpha() {
        return 0.7 + 0.3 * Math.sin(this.globalTime * 0.1);
    }
};