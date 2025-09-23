// 상호작용 가능한 오브젝트 기본 클래스
export class InteractableObject {
    constructor(x, y, type, name) {
        this.x = x;
        this.y = y;
        this.type = type; // 'vending_machine', 'computer', 'printer' 등
        this.name = name;
        this.isInteracting = false;
        this.cooldown = 0; // 재사용 대기시간 (밀리초)
        this.lastInteraction = 0;
        this.enabled = true;
    }

    // 플레이어가 상호작용 범위 내에 있는지 확인
    isPlayerNearby(playerX, playerY, range = 1) {
        const distance = Math.abs(this.x - playerX) + Math.abs(this.y - playerY);
        return distance <= range;
    }

    // 상호작용 가능한지 확인 (쿨다운 체크)
    canInteract() {
        if (!this.enabled) return false;
        const now = Date.now();
        return (now - this.lastInteraction) >= this.cooldown;
    }

    // 상호작용 시작 (하위 클래스에서 오버라이드)
    interact(gameState, audioManager) {
        if (!this.canInteract()) {
            return {
                success: false,
                message: '잠시 후에 다시 사용해주세요.'
            };
        }

        this.lastInteraction = Date.now();
        this.isInteracting = true;

        return this.performInteraction(gameState, audioManager);
    }

    // 실제 상호작용 로직 (하위 클래스에서 구현)
    performInteraction(gameState, audioManager) {
        return {
            success: true,
            message: '상호작용 완료!'
        };
    }

    // 상호작용 종료
    endInteraction() {
        this.isInteracting = false;
    }

    // 오브젝트 업데이트 (애니메이션 등)
    update(deltaTime) {
        // 하위 클래스에서 구현
    }

    // 힌트 텍스트 반환
    getHintText() {
        if (!this.canInteract()) {
            return `${this.name} (사용 중...)`;
        }
        return `${this.name} (스페이스바로 상호작용)`;
    }

    // 오브젝트 상태 정보
    getStatus() {
        return {
            type: this.type,
            name: this.name,
            enabled: this.enabled,
            interacting: this.isInteracting,
            canInteract: this.canInteract()
        };
    }
}