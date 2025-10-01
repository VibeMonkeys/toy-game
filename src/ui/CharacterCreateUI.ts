/**
 * 👤 캐릭터 생성 UI
 *
 * 닉네임 입력 및 캐릭터 생성 화면
 */

import { Renderer } from '../systems/Renderer';
import { GAME_INFO } from '../utils/Constants';

export class CharacterCreateUI {
    private playerName: string = '';
    private isInputActive: boolean = true;
    private cursorVisible: boolean = true;
    private cursorBlinkTime: number = 0;
    private animationTime: number = 0;
    private errorMessage: string = '';
    private errorTimer: number = 0;
    private hiddenInput: HTMLInputElement | null = null;

    private readonly MAX_NAME_LENGTH = 12;
    private readonly MIN_NAME_LENGTH = 2;

    constructor() {
        this.createHiddenInput();
    }

    /**
     * 숨겨진 input 생성 (한글 입력용)
     */
    private createHiddenInput(): void {
        this.hiddenInput = document.createElement('input');
        this.hiddenInput.type = 'text';
        this.hiddenInput.style.position = 'absolute';
        this.hiddenInput.style.left = '-9999px';
        this.hiddenInput.style.opacity = '0';
        this.hiddenInput.maxLength = this.MAX_NAME_LENGTH;

        this.hiddenInput.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            const value = target.value;

            // 영문, 숫자만 허용 (한글 제거)
            const filtered = value.replace(/[^a-zA-Z0-9]/g, '');

            if (filtered.length <= this.MAX_NAME_LENGTH) {
                this.playerName = filtered;
                target.value = filtered;
                this.errorMessage = '';
            } else {
                target.value = this.playerName;
                this.showError(`닉네임은 ${this.MAX_NAME_LENGTH}자까지 입력 가능합니다`);
            }
        });

        document.body.appendChild(this.hiddenInput);
    }

    /**
     * 입력 활성화
     */
    activateInput(): void {
        if (this.hiddenInput) {
            this.hiddenInput.value = this.playerName;
            this.hiddenInput.focus();
        }
    }

    /**
     * 입력 비활성화
     */
    deactivateInput(): void {
        if (this.hiddenInput) {
            this.hiddenInput.blur();
        }
    }

    /**
     * 업데이트
     */
    update(deltaTime: number): void {
        this.animationTime += deltaTime;

        // 커서 깜빡임
        this.cursorBlinkTime += deltaTime;
        if (this.cursorBlinkTime >= 500) {
            this.cursorVisible = !this.cursorVisible;
            this.cursorBlinkTime = 0;
        }

        // 에러 메시지 타이머
        if (this.errorTimer > 0) {
            this.errorTimer -= deltaTime;
            if (this.errorTimer <= 0) {
                this.errorMessage = '';
            }
        }

        // 숨겨진 input과 동기화
        if (this.hiddenInput && this.isInputActive) {
            this.playerName = this.hiddenInput.value;
        }
    }

    /**
     * 문자 입력 처리 (더 이상 사용 안함 - 숨겨진 input 사용)
     */
    handleInput(char: string): void {
        // 숨겨진 input이 처리함
    }

    /**
     * 백스페이스 처리
     */
    handleBackspace(): void {
        // 숨겨진 input이 처리함
    }

    /**
     * 엔터 처리 (확인)
     */
    handleConfirm(): boolean {
        if (!this.isInputActive) return false;

        // 길이 체크
        if (this.playerName.length < this.MIN_NAME_LENGTH) {
            this.showError(`닉네임은 최소 ${this.MIN_NAME_LENGTH}자 이상이어야 합니다`);
            return false;
        }

        if (this.playerName.trim().length === 0) {
            this.showError('닉네임을 입력해주세요');
            return false;
        }

        return true;
    }

    /**
     * ESC 처리 (기본 이름 사용)
     */
    handleUseDefault(): void {
        this.playerName = GAME_INFO.DEFAULT_PLAYER_NAME;
    }

    /**
     * 에러 메시지 표시
     */
    private showError(message: string): void {
        this.errorMessage = message;
        this.errorTimer = 2000; // 2초간 표시
    }

    /**
     * 입력된 이름 가져오기
     */
    getPlayerName(): string {
        return this.playerName.trim() || GAME_INFO.DEFAULT_PLAYER_NAME;
    }

    /**
     * 렌더링
     */
    render(renderer: Renderer): void {
        const ctx = renderer.getContext();

        // 배경 그라데이션
        const bgGradient = ctx.createLinearGradient(0, 0, 0, 720);
        bgGradient.addColorStop(0, '#0a0a1a');
        bgGradient.addColorStop(0.5, '#1a1a3e');
        bgGradient.addColorStop(1, '#0a0a1a');
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, 1280, 720);

        // 배경 별
        this.drawStars(ctx);

        // 게임 타이틀
        const titlePulse = Math.sin(this.animationTime * 2) * 0.3 + 0.7;
        renderer.drawText(
            GAME_INFO.TITLE,
            640,
            120,
            'bold 56px Arial',
            `rgba(233, 69, 96, ${titlePulse})`,
            'center'
        );

        renderer.drawText(
            GAME_INFO.TITLE_EN,
            640,
            170,
            'bold 28px Arial',
            'rgba(255, 255, 255, 0.6)',
            'center'
        );

        // 메인 패널
        const panelX = 240;
        const panelY = 240;
        const panelWidth = 800;
        const panelHeight = 400;

        ctx.fillStyle = 'rgba(20, 20, 30, 0.95)';
        ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);

        // 안내 문구
        renderer.drawText(
            '👤 캐릭터 생성',
            640,
            300,
            'bold 32px Arial',
            '#FFD700',
            'center'
        );

        renderer.drawText(
            '던전을 탐험할 모험가의 이름을 정해주세요',
            640,
            350,
            '18px Arial',
            '#AAAAAA',
            'center'
        );

        // 입력 필드
        const inputX = 340;
        const inputY = 400;
        const inputWidth = 600;
        const inputHeight = 60;

        // 입력 필드 배경
        ctx.fillStyle = 'rgba(40, 40, 50, 0.9)';
        ctx.fillRect(inputX, inputY, inputWidth, inputHeight);

        const inputPulse = Math.sin(this.animationTime * 4) * 0.3 + 0.7;
        ctx.strokeStyle = `rgba(255, 215, 0, ${inputPulse})`;
        ctx.lineWidth = 2;
        ctx.strokeRect(inputX, inputY, inputWidth, inputHeight);

        // 입력된 텍스트
        const displayName = this.playerName || '';
        renderer.drawText(
            displayName,
            inputX + 20,
            inputY + 38,
            'bold 24px Arial',
            '#FFFFFF',
            'left'
        );

        // 커서
        if (this.cursorVisible && this.isInputActive) {
            const textWidth = ctx.measureText(displayName).width * 1.5; // bold 폰트 보정
            ctx.fillStyle = '#FFD700';
            ctx.fillRect(inputX + 20 + textWidth, inputY + 18, 3, 30);
        }

        // 글자 수 표시
        renderer.drawText(
            `${this.playerName.length} / ${this.MAX_NAME_LENGTH}`,
            inputX + inputWidth - 20,
            inputY + 38,
            '16px Arial',
            this.playerName.length >= this.MAX_NAME_LENGTH ? '#FF5722' : '#888888',
            'right'
        );

        // 에러 메시지
        if (this.errorMessage) {
            renderer.drawText(
                this.errorMessage,
                640,
                inputY + inputHeight + 30,
                'bold 16px Arial',
                '#FF5722',
                'center'
            );
        }

        // 조작 힌트
        const hints = [
            '⚠️ 영문/숫자만 입력 가능 (한글 지원 안됨)',
            'Enter: 확인',
            'ESC: 기본 이름 사용',
            'Backspace: 지우기'
        ];

        hints.forEach((hint, index) => {
            renderer.drawText(
                hint,
                640,
                520 + index * 25,
                '14px Arial',
                '#888888',
                'center'
            );
        });

        // 하단 장식
        const bottomY = 680;
        renderer.drawText(
            '✨ 당신만의 전설을 시작하세요 ✨',
            640,
            bottomY,
            'bold 18px Arial',
            `rgba(255, 215, 0, ${titlePulse})`,
            'center'
        );
    }

    /**
     * 배경 별
     */
    private drawStars(ctx: CanvasRenderingContext2D): void {
        const starCount = 100;

        for (let i = 0; i < starCount; i++) {
            const seed = i * 34567;
            const x = (seed * 9301 + 49297) % 1280;
            const y = (seed * 3571 + 29573) % 720;
            const size = ((seed * 7919) % 2) + 1;
            const twinkle = Math.sin(this.animationTime * 1.5 + i) * 0.5 + 0.5;

            ctx.fillStyle = `rgba(200, 200, 255, ${twinkle * 0.7})`;
            ctx.fillRect(x, y, size, size);
        }
    }

    /**
     * 입력 활성 상태 설정
     */
    setInputActive(active: boolean): void {
        this.isInputActive = active;
    }

    /**
     * 초기화
     */
    reset(): void {
        this.playerName = '';
        this.errorMessage = '';
        this.errorTimer = 0;
        this.isInputActive = true;
        this.cursorVisible = true;
        this.cursorBlinkTime = 0;

        // 숨겨진 input 초기화 및 포커스
        if (this.hiddenInput) {
            this.hiddenInput.value = '';
            this.hiddenInput.focus();
        }
    }

    /**
     * 정리
     */
    destroy(): void {
        if (this.hiddenInput && this.hiddenInput.parentNode) {
            this.hiddenInput.parentNode.removeChild(this.hiddenInput);
            this.hiddenInput = null;
        }
    }
}
