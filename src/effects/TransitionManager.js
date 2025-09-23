// 화면 전환 및 애니메이션 관리자
export class TransitionManager {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.transitions = [];
        this.activeTransition = null;
    }

    // 페이드 전환
    fadeTransition(fromCallback, toCallback, duration = 1000, color = 'black') {
        this.activeTransition = {
            type: 'fade',
            startTime: Date.now(),
            duration: duration,
            color: color,
            phase: 'fadeOut', // fadeOut -> fadeIn
            fromCallback: fromCallback,
            toCallback: toCallback,
            switched: false
        };
    }

    // 슬라이드 전환
    slideTransition(direction, fromCallback, toCallback, duration = 800) {
        this.activeTransition = {
            type: 'slide',
            startTime: Date.now(),
            duration: duration,
            direction: direction, // 'left', 'right', 'up', 'down'
            fromCallback: fromCallback,
            toCallback: toCallback,
            progress: 0
        };
    }

    // 줌 전환
    zoomTransition(fromCallback, toCallback, duration = 600) {
        this.activeTransition = {
            type: 'zoom',
            startTime: Date.now(),
            duration: duration,
            fromCallback: fromCallback,
            toCallback: toCallback,
            phase: 'zoomOut',
            switched: false
        };
    }

    // UI 요소 등장 애니메이션
    animateUIEntry(element, animationType = 'slideUp', duration = 500) {
        const animation = {
            type: 'uiEntry',
            subType: animationType,
            startTime: Date.now(),
            duration: duration,
            element: element,
            progress: 0
        };

        this.transitions.push(animation);
        return animation;
    }

    // 텍스트 타이핑 애니메이션
    typewriterText(text, x, y, speed = 50, font = '16px Arial', color = '#ffffff') {
        const animation = {
            type: 'typewriter',
            text: text,
            x: x,
            y: y,
            speed: speed,
            font: font,
            color: color,
            startTime: Date.now(),
            currentChar: 0
        };

        this.transitions.push(animation);
        return animation;
    }

    // 카운터 애니메이션 (숫자 증가)
    animateCounter(fromValue, toValue, x, y, duration = 1000, font = '24px Arial', color = '#FFD700') {
        const animation = {
            type: 'counter',
            fromValue: fromValue,
            toValue: toValue,
            currentValue: fromValue,
            x: x,
            y: y,
            duration: duration,
            font: font,
            color: color,
            startTime: Date.now()
        };

        this.transitions.push(animation);
        return animation;
    }

    update() {
        const now = Date.now();

        // 메인 전환 업데이트
        if (this.activeTransition) {
            const elapsed = now - this.activeTransition.startTime;
            const progress = Math.min(elapsed / this.activeTransition.duration, 1);

            this.updateMainTransition(this.activeTransition, progress);

            if (progress >= 1) {
                this.activeTransition = null;
            }
        }

        // UI 애니메이션 업데이트
        for (let i = this.transitions.length - 1; i >= 0; i--) {
            const transition = this.transitions[i];
            const elapsed = now - transition.startTime;

            this.updateUIAnimation(transition, elapsed);

            // 완료된 애니메이션 제거
            if (this.isAnimationComplete(transition, elapsed)) {
                this.transitions.splice(i, 1);
            }
        }
    }

    updateMainTransition(transition, progress) {
        switch (transition.type) {
            case 'fade':
                if (transition.phase === 'fadeOut') {
                    if (progress >= 0.5 && !transition.switched) {
                        transition.fromCallback();
                        transition.toCallback();
                        transition.switched = true;
                        transition.phase = 'fadeIn';
                    }
                }
                break;

            case 'slide':
                transition.progress = this.easeInOutCubic(progress);
                if (progress >= 0.5 && !transition.switched) {
                    transition.fromCallback();
                    transition.toCallback();
                    transition.switched = true;
                }
                break;

            case 'zoom':
                if (transition.phase === 'zoomOut') {
                    if (progress >= 0.5 && !transition.switched) {
                        transition.fromCallback();
                        transition.toCallback();
                        transition.switched = true;
                        transition.phase = 'zoomIn';
                    }
                }
                break;
        }
    }

    updateUIAnimation(animation, elapsed) {
        switch (animation.type) {
            case 'typewriter':
                const charsToShow = Math.floor(elapsed / animation.speed);
                animation.currentChar = Math.min(charsToShow, animation.text.length);
                break;

            case 'counter':
                const progress = Math.min(elapsed / animation.duration, 1);
                const easedProgress = this.easeOutCubic(progress);
                animation.currentValue = animation.fromValue +
                    (animation.toValue - animation.fromValue) * easedProgress;
                break;

            case 'uiEntry':
                animation.progress = Math.min(elapsed / animation.duration, 1);
                break;
        }
    }

    drawTransitions() {
        // 메인 전환 그리기
        if (this.activeTransition) {
            this.drawMainTransition(this.activeTransition);
        }

        // UI 애니메이션 그리기
        this.transitions.forEach(animation => {
            this.drawUIAnimation(animation);
        });
    }

    drawMainTransition(transition) {
        const elapsed = Date.now() - transition.startTime;
        const progress = Math.min(elapsed / transition.duration, 1);

        switch (transition.type) {
            case 'fade':
                let alpha;
                if (transition.phase === 'fadeOut') {
                    alpha = progress * 2; // 0 to 1 in first half
                } else {
                    alpha = 2 - (progress * 2); // 1 to 0 in second half
                }
                alpha = Math.max(0, Math.min(1, alpha));

                this.ctx.save();
                this.ctx.fillStyle = transition.color;
                this.ctx.globalAlpha = alpha;
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                this.ctx.restore();
                break;

            case 'slide':
                const slideAmount = this.canvas.width * transition.progress;
                this.ctx.save();
                this.ctx.fillStyle = 'black';

                switch (transition.direction) {
                    case 'left':
                        this.ctx.fillRect(this.canvas.width - slideAmount, 0, slideAmount, this.canvas.height);
                        break;
                    case 'right':
                        this.ctx.fillRect(0, 0, slideAmount, this.canvas.height);
                        break;
                }
                this.ctx.restore();
                break;

            case 'zoom':
                let scale;
                if (transition.phase === 'zoomOut') {
                    scale = 1 - (progress * 2);
                } else {
                    scale = (progress * 2) - 1;
                }
                scale = Math.max(0, Math.min(1, scale));

                // 줌 효과는 주로 컨텐츠 스케일링으로 구현
                break;
        }
    }

    drawUIAnimation(animation) {
        this.ctx.save();

        switch (animation.type) {
            case 'typewriter':
                this.ctx.font = animation.font;
                this.ctx.fillStyle = animation.color;
                this.ctx.textAlign = 'left';
                const visibleText = animation.text.substring(0, animation.currentChar);
                this.ctx.fillText(visibleText, animation.x, animation.y);
                break;

            case 'counter':
                this.ctx.font = animation.font;
                this.ctx.fillStyle = animation.color;
                this.ctx.textAlign = 'center';
                const displayValue = Math.round(animation.currentValue);
                this.ctx.fillText(displayValue.toString(), animation.x, animation.y);
                break;

            case 'uiEntry':
                // UI 엔트리 애니메이션은 주로 변환 행렬 조작
                const easedProgress = this.easeOutBack(animation.progress);

                switch (animation.subType) {
                    case 'slideUp':
                        this.ctx.translate(0, (1 - easedProgress) * 50);
                        this.ctx.globalAlpha = easedProgress;
                        break;
                    case 'scale':
                        const scale = easedProgress;
                        this.ctx.scale(scale, scale);
                        this.ctx.globalAlpha = easedProgress;
                        break;
                }
                break;
        }

        this.ctx.restore();
    }

    isAnimationComplete(animation, elapsed) {
        switch (animation.type) {
            case 'typewriter':
                return animation.currentChar >= animation.text.length;
            case 'counter':
            case 'uiEntry':
                return elapsed >= animation.duration;
            default:
                return false;
        }
    }

    // 이징 함수들
    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    easeOutBack(t) {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    }

    // 진행 중인 전환이 있는지 확인
    isTransitioning() {
        return this.activeTransition !== null;
    }

    // 모든 전환 정리
    clear() {
        this.activeTransition = null;
        this.transitions = [];
    }
}