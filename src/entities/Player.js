import { CONSTANTS } from '../utils/Constants.js';

export class Player {
    constructor(x = 12, y = 15) {
        this.x = x;
        this.y = y;
        this.direction = CONSTANTS.DIRECTIONS.DOWN;
        this.animFrame = 0;
        this.animTimer = 0;
        this.isMoving = false;

        // 부드러운 애니메이션을 위한 추가 속성
        this.targetX = x;
        this.targetY = y;
        this.moveProgress = 1; // 0-1 사이, 1일 때 이동 완료
        this.moveDuration = 8; // 프레임 단위
        this.idleTimer = 0;
        this.bobOffset = 0;
    }

    move(dx, dy) {
        this.x += dx;
        this.y += dy;
        this.targetX = this.x;
        this.targetY = this.y;

        this.isMoving = true;
        this.moveProgress = 0;
        this.idleTimer = 0;

        // 방향 설정
        if (dx > 0) this.direction = CONSTANTS.DIRECTIONS.RIGHT;
        else if (dx < 0) this.direction = CONSTANTS.DIRECTIONS.LEFT;
        else if (dy > 0) this.direction = CONSTANTS.DIRECTIONS.DOWN;
        else if (dy < 0) this.direction = CONSTANTS.DIRECTIONS.UP;
    }

    updateAnimation() {
        if (this.isMoving) {
            // 이동 프로그레스 업데이트
            this.moveProgress += 1 / this.moveDuration;
            if (this.moveProgress >= 1) {
                this.moveProgress = 1;
                this.isMoving = false;
            }

            // 걷기 애니메이션
            this.animTimer++;
            if (this.animTimer > 6) { // 더 빠른 애니메이션
                this.animFrame = (this.animFrame + 1) % 4;
                this.animTimer = 0;
            }

            // 걷기 시 살짝 위아래 움직임 (bob)
            this.bobOffset = Math.sin(this.moveProgress * Math.PI) * 2;
        } else {
            // 아이들 애니메이션
            this.idleTimer++;

            if (this.idleTimer < 60) {
                this.animFrame = 0; // 기본 프레임
                this.bobOffset = 0;
            } else {
                // 가끔 숨쉬는 듯한 애니메이션
                const breathePhase = (this.idleTimer - 60) * 0.05;
                this.bobOffset = Math.sin(breathePhase) * 0.5;

                // 가끔 깜빡이는 애니메이션
                if (this.idleTimer > 240 && this.idleTimer < 250) {
                    this.animFrame = 1;
                } else {
                    this.animFrame = 0;
                }

                // 아이들 타이머 리셋
                if (this.idleTimer > 300) {
                    this.idleTimer = 0;
                }
            }
        }
    }

    stopMoving() {
        this.isMoving = false;
        this.moveProgress = 1;
    }

    getPosition() {
        return { x: this.x, y: this.y };
    }

    getAnimatedPosition() {
        // 부드러운 이동을 위한 보간된 위치 반환
        return {
            x: this.x,
            y: this.y,
            bobOffset: this.bobOffset
        };
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
        this.targetX = x;
        this.targetY = y;
        this.moveProgress = 1;
        this.isMoving = false;
        this.idleTimer = 0;
    }

    serialize() {
        return {
            x: this.x,
            y: this.y,
            direction: this.direction,
            animFrame: this.animFrame,
            animTimer: this.animTimer,
            isMoving: this.isMoving,
            targetX: this.targetX,
            targetY: this.targetY,
            moveProgress: this.moveProgress,
            idleTimer: this.idleTimer,
            bobOffset: this.bobOffset
        };
    }

    deserialize(data) {
        this.x = data.x;
        this.y = data.y;
        this.direction = data.direction;
        this.animFrame = data.animFrame || 0;
        this.animTimer = data.animTimer || 0;
        this.isMoving = data.isMoving || false;
        this.targetX = data.targetX || data.x;
        this.targetY = data.targetY || data.y;
        this.moveProgress = data.moveProgress || 1;
        this.idleTimer = data.idleTimer || 0;
        this.bobOffset = data.bobOffset || 0;
    }
};