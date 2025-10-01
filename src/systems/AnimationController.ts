/**
 * 🎬 애니메이션 컨트롤러
 *
 * 캐릭터의 4방향 걷기 애니메이션을 관리합니다.
 */

export type Direction = 'up' | 'down' | 'left' | 'right';
export type AnimationState = 'idle' | 'walk' | 'attack' | 'hurt' | 'death';

export class AnimationController {
    private currentFrame: number = 0;
    private frameTimer: number = 0;
    private currentDirection: Direction = 'down';
    private currentState: AnimationState = 'idle';
    private isPlaying: boolean = false;

    // 애니메이션 설정
    private frameDelay: number = 150; // ms (프레임당 시간)
    private totalFrames: number = 4;

    constructor(
        frameDelay: number = 150,
        totalFrames: number = 4
    ) {
        this.frameDelay = frameDelay;
        this.totalFrames = totalFrames;
    }

    /**
     * 업데이트 (deltaTime은 초 단위)
     */
    update(deltaTime: number): void {
        if (!this.isPlaying) {
            this.currentFrame = 0;
            return;
        }

        this.frameTimer += deltaTime * 1000; // 초 -> ms 변환

        if (this.frameTimer >= this.frameDelay) {
            this.frameTimer = 0;
            this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
        }
    }

    /**
     * 방향 설정
     */
    setDirection(direction: Direction): void {
        this.currentDirection = direction;
    }

    /**
     * 애니메이션 상태 설정
     */
    setState(state: AnimationState): void {
        if (this.currentState !== state) {
            this.currentState = state;
            this.currentFrame = 0;
            this.frameTimer = 0;
        }
    }

    /**
     * 애니메이션 재생
     */
    play(): void {
        this.isPlaying = true;
    }

    /**
     * 애니메이션 정지
     */
    stop(): void {
        this.isPlaying = false;
        this.currentFrame = 0;
        this.frameTimer = 0;
    }

    /**
     * 현재 프레임 가져오기
     */
    getCurrentFrame(): number {
        return this.currentFrame;
    }

    /**
     * 현재 방향 가져오기
     */
    getCurrentDirection(): Direction {
        return this.currentDirection;
    }

    /**
     * 현재 상태 가져오기
     */
    getCurrentState(): AnimationState {
        return this.currentState;
    }

    /**
     * 재생 중인지 확인
     */
    isAnimating(): boolean {
        return this.isPlaying;
    }

    /**
     * 이동 벡터로 방향 결정
     */
    setDirectionFromMovement(dx: number, dy: number): void {
        if (dx === 0 && dy === 0) {
            this.stop();
            return;
        }

        this.play();

        // 우선순위: 세로 > 가로
        if (Math.abs(dy) > Math.abs(dx)) {
            this.setDirection(dy < 0 ? 'up' : 'down');
        } else {
            this.setDirection(dx < 0 ? 'left' : 'right');
        }
    }

    /**
     * 프레임 속도 변경
     */
    setFrameDelay(delay: number): void {
        this.frameDelay = delay;
    }

    /**
     * 리셋
     */
    reset(): void {
        this.currentFrame = 0;
        this.frameTimer = 0;
        this.currentDirection = 'down';
        this.currentState = 'idle';
        this.isPlaying = false;
    }
}
