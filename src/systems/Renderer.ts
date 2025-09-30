/**
 * 🎨 렌더링 시스템
 *
 * Canvas 2D 렌더링을 담당합니다.
 */

import { SCREEN, COLORS } from '../utils/Constants';

export class Renderer {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement) {
        console.log('🎨 Renderer constructor 시작');

        this.canvas = canvas;

        console.log('Canvas 설정 중:', canvas);

        // Canvas 크기를 먼저 설정
        canvas.width = SCREEN.WIDTH;
        canvas.height = SCREEN.HEIGHT;

        console.log('getContext 호출 중...');

        // Context 가져오기
        const context = canvas.getContext('2d');

        console.log('Context 결과:', context);

        if (!context) {
            throw new Error('❌ Canvas 2D context를 가져올 수 없습니다!');
        }

        this.ctx = context;

        console.log('✅ Context 할당 완료:', this.ctx);

        // 픽셀 아트 스타일
        this.ctx.imageSmoothingEnabled = false;

        console.log('✅ Renderer 초기화 완료!');
    }

    clear(color: string = COLORS.BACKGROUND): void {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, SCREEN.WIDTH, SCREEN.HEIGHT);
    }

    drawRect(x: number, y: number, width: number, height: number, color: string): void {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, width, height);
    }

    drawRectOutline(x: number, y: number, width: number, height: number, color: string, lineWidth: number = 2): void {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;
        this.ctx.strokeRect(x, y, width, height);
    }

    drawCircle(x: number, y: number, radius: number, color: string): void {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawText(
        text: string,
        x: number,
        y: number,
        font: string = '20px Arial',
        color: string = COLORS.TEXT,
        align: CanvasTextAlign = 'left'
    ): void {
        this.ctx.font = font;
        this.ctx.fillStyle = color;
        this.ctx.textAlign = align;
        this.ctx.fillText(text, x, y);
    }

    drawTextWithAlpha(
        text: string,
        x: number,
        y: number,
        font: string,
        color: string,
        alpha: number,
        align: CanvasTextAlign = 'left'
    ): void {
        const oldAlpha = this.ctx.globalAlpha;
        this.ctx.globalAlpha = alpha;
        this.ctx.font = font;
        this.ctx.fillStyle = color;
        this.ctx.textAlign = align;

        // 테두리 (가독성 향상)
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 3;
        this.ctx.strokeText(text, x, y);

        // 텍스트
        this.ctx.fillText(text, x, y);

        this.ctx.globalAlpha = oldAlpha;
    }

    drawHealthBar(
        x: number,
        y: number,
        width: number,
        height: number,
        current: number,
        max: number
    ): void {
        // 배경
        this.ctx.fillStyle = '#333333';
        this.ctx.fillRect(x, y, width, height);

        // 체력
        const ratio = Math.max(0, Math.min(1, current / max));
        const healthColor = ratio > 0.5 ? COLORS.HEALTH : ratio > 0.25 ? COLORS.WARNING : COLORS.ERROR;

        this.ctx.fillStyle = healthColor;
        this.ctx.fillRect(x, y, width * ratio, height);

        // 테두리
        this.ctx.strokeStyle = COLORS.BORDER;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, width, height);
    }

    drawManaBar(
        x: number,
        y: number,
        width: number,
        height: number,
        current: number,
        max: number
    ): void {
        // 배경
        this.ctx.fillStyle = '#222244';
        this.ctx.fillRect(x, y, width, height);

        // 마나
        const ratio = Math.max(0, Math.min(1, current / max));
        this.ctx.fillStyle = COLORS.MANA;
        this.ctx.fillRect(x, y, width * ratio, height);

        // 테두리
        this.ctx.strokeStyle = COLORS.BORDER;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, width, height);
    }

    drawStaminaBar(
        x: number,
        y: number,
        width: number,
        height: number,
        current: number,
        max: number
    ): void {
        // 배경
        this.ctx.fillStyle = '#444422';
        this.ctx.fillRect(x, y, width, height);

        // 스태미나
        const ratio = Math.max(0, Math.min(1, current / max));
        this.ctx.fillStyle = COLORS.STAMINA;
        this.ctx.fillRect(x, y, width * ratio, height);

        // 테두리
        this.ctx.strokeStyle = COLORS.BORDER;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, width, height);
    }

    drawExperienceBar(
        x: number,
        y: number,
        width: number,
        height: number,
        current: number,
        max: number
    ): void {
        // 배경
        this.ctx.fillStyle = '#2a2a3a';
        this.ctx.fillRect(x, y, width, height);

        // 경험치
        const ratio = Math.max(0, Math.min(1, current / max));
        this.ctx.fillStyle = '#FFD700'; // 금색
        this.ctx.fillRect(x, y, width * ratio, height);

        // 테두리
        this.ctx.strokeStyle = COLORS.BORDER;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, width, height);
    }

    drawDamageNumber(x: number, y: number, damage: number, isCritical: boolean = false): void {
        const color = isCritical ? COLORS.CRITICAL_HIT : COLORS.DAMAGE;
        const font = isCritical ? 'bold 28px Arial' : 'bold 20px Arial';

        this.ctx.font = font;
        this.ctx.fillStyle = color;
        this.ctx.textAlign = 'center';
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 3;

        const text = damage.toString();
        this.ctx.strokeText(text, x, y);
        this.ctx.fillText(text, x, y);
    }

    getContext(): CanvasRenderingContext2D {
        return this.ctx;
    }

    getCanvas(): HTMLCanvasElement {
        return this.canvas;
    }
}