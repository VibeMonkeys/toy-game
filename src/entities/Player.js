import { CONSTANTS } from '../utils/Constants.js';

export class Player {
    constructor(x = 12, y = 15) {
        this.x = x;
        this.y = y;
        this.direction = CONSTANTS.DIRECTIONS.DOWN;
        this.animFrame = 0;
        this.animTimer = 0;
        this.isMoving = false;
    }

    move(dx, dy) {
        this.x += dx;
        this.y += dy;
        this.isMoving = true;

        // 방향 설정
        if (dx > 0) this.direction = CONSTANTS.DIRECTIONS.RIGHT;
        else if (dx < 0) this.direction = CONSTANTS.DIRECTIONS.LEFT;
        else if (dy > 0) this.direction = CONSTANTS.DIRECTIONS.DOWN;
        else if (dy < 0) this.direction = CONSTANTS.DIRECTIONS.UP;
    }

    updateAnimation() {
        if (this.isMoving) {
            this.animTimer++;
            if (this.animTimer > 8) {
                this.animFrame = (this.animFrame + 1) % 4;
                this.animTimer = 0;
            }
        } else {
            this.animFrame = 0;
            this.animTimer = 0;
        }
    }

    stopMoving() {
        this.isMoving = false;
    }

    getPosition() {
        return { x: this.x, y: this.y };
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    serialize() {
        return {
            x: this.x,
            y: this.y,
            direction: this.direction,
            animFrame: this.animFrame,
            animTimer: this.animTimer,
            isMoving: this.isMoving
        };
    }

    deserialize(data) {
        this.x = data.x;
        this.y = data.y;
        this.direction = data.direction;
        this.animFrame = data.animFrame || 0;
        this.animTimer = data.animTimer || 0;
        this.isMoving = data.isMoving || false;
    }
};