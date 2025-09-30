/**
 * 🎮 입력 관리 시스템
 *
 * 키보드, 마우스 입력을 처리합니다.
 */

import { InputState } from '../types';
import { CONTROLS } from '../utils/Constants';

export class InputManager {
    private keys: Set<string> = new Set();
    private mousePos: { x: number; y: number } = { x: 0, y: 0 };
    private mouseButtons: { left: boolean; right: boolean } = { left: false, right: false };
    private keyJustPressed: Set<string> = new Set();

    constructor() {
        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        // 키보드 이벤트
        window.addEventListener('keydown', (e) => {
            if (!this.keys.has(e.code)) {
                this.keyJustPressed.add(e.code);
            }
            this.keys.add(e.code);
        });

        window.addEventListener('keyup', (e) => {
            this.keys.delete(e.code);
        });

        // 마우스 이벤트
        window.addEventListener('mousemove', (e) => {
            this.mousePos.x = e.clientX;
            this.mousePos.y = e.clientY;
        });

        window.addEventListener('mousedown', (e) => {
            if (e.button === 0) this.mouseButtons.left = true;
            if (e.button === 2) this.mouseButtons.right = true;
        });

        window.addEventListener('mouseup', (e) => {
            if (e.button === 0) this.mouseButtons.left = false;
            if (e.button === 2) this.mouseButtons.right = false;
        });

        // 우클릭 메뉴 방지
        window.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    // 키 상태 체크
    isKeyPressed(code: string): boolean {
        return this.keys.has(code);
    }

    // 방향키 입력
    getMovementInput(): { x: number; y: number } {
        let x = 0;
        let y = 0;

        if (this.isKeyPressed(CONTROLS.MOVE_LEFT)) x -= 1;
        if (this.isKeyPressed(CONTROLS.MOVE_RIGHT)) x += 1;
        if (this.isKeyPressed(CONTROLS.MOVE_UP)) y -= 1;
        if (this.isKeyPressed(CONTROLS.MOVE_DOWN)) y += 1;

        // 대각선 이동 정규화
        if (x !== 0 && y !== 0) {
            const length = Math.sqrt(x * x + y * y);
            x /= length;
            y /= length;
        }

        return { x, y };
    }

    // 액션 키
    isAttackPressed(): boolean {
        return this.isKeyPressed(CONTROLS.ATTACK) || this.mouseButtons.left;
    }

    isDodgePressed(): boolean {
        return this.isKeyPressed(CONTROLS.DODGE) || this.mouseButtons.right;
    }

    isParryPressed(): boolean {
        return this.isKeyPressed(CONTROLS.PARRY);
    }

    isSkill1Pressed(): boolean {
        return this.isKeyPressed(CONTROLS.SKILL_1);
    }

    isSkill2Pressed(): boolean {
        return this.isKeyPressed(CONTROLS.SKILL_2);
    }

    isSkill3Pressed(): boolean {
        return this.isKeyPressed(CONTROLS.SKILL_3);
    }

    // 한 번만 눌림 체크 (토글용)
    isKeyJustPressed(code: string): boolean {
        return this.keyJustPressed.has(code);
    }

    // 인벤토리 토글
    isInventoryToggled(): boolean {
        return this.isKeyJustPressed(CONTROLS.INVENTORY);
    }

    // 프레임 끝에 호출 (just pressed 클리어)
    clearJustPressed(): void {
        this.keyJustPressed.clear();
    }

    // 마우스 위치 (캔버스 기준)
    getMousePosition(canvas: HTMLCanvasElement): { x: number; y: number } {
        const rect = canvas.getBoundingClientRect();
        return {
            x: this.mousePos.x - rect.left,
            y: this.mousePos.y - rect.top
        };
    }

    // 정리
    destroy(): void {
        this.keys.clear();
        this.keyJustPressed.clear();
    }
}