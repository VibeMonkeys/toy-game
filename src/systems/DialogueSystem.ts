/**
 * 💬 대화 시스템
 *
 * NPC와의 대화를 관리합니다.
 */

import { Renderer } from './Renderer';
import { NPC } from '../entities/NPC';

export interface DialogueChoice {
    text: string;
    action: () => void;
}

export class DialogueSystem {
    private isActive: boolean = false;
    private currentNPC: NPC | null = null;
    private currentText: string = '';
    private displayedText: string = '';
    private textProgress: number = 0;
    private textSpeed: number = 30; // 글자/초
    private choices: DialogueChoice[] = [];
    private selectedChoiceIndex: number = 0;

    // UI 설정
    private readonly boxX: number = 100;
    private readonly boxY: number = 480;
    private readonly boxWidth: number = 1080;
    private readonly boxHeight: number = 200;
    private readonly padding: number = 20;

    /**
     * 대화 시작
     */
    startDialogue(npc: NPC, text: string, choices: DialogueChoice[] = []): void {
        this.isActive = true;
        this.currentNPC = npc;
        this.currentText = text;
        this.displayedText = '';
        this.textProgress = 0;
        this.choices = choices;
        this.selectedChoiceIndex = 0;

        if (npc) {
            npc.startInteraction();
        }
    }

    /**
     * 대화 종료
     */
    endDialogue(): void {
        this.isActive = false;

        if (this.currentNPC) {
            this.currentNPC.endInteraction();
        }

        this.currentNPC = null;
        this.currentText = '';
        this.displayedText = '';
        this.textProgress = 0;
        this.choices = [];
        this.selectedChoiceIndex = 0;
    }

    /**
     * 업데이트
     */
    update(deltaTime: number): void {
        if (!this.isActive) return;

        // 타이핑 효과
        if (this.textProgress < this.currentText.length) {
            this.textProgress += this.textSpeed * deltaTime;
            const charIndex = Math.floor(this.textProgress);
            this.displayedText = this.currentText.substring(0, charIndex);
        }
    }

    /**
     * 텍스트 전체 표시 (스킵)
     */
    skipTyping(): void {
        if (this.textProgress < this.currentText.length) {
            this.textProgress = this.currentText.length;
            this.displayedText = this.currentText;
        }
    }

    /**
     * 선택지 선택
     */
    selectChoice(index: number): void {
        if (index >= 0 && index < this.choices.length) {
            this.selectedChoiceIndex = index;
        }
    }

    /**
     * 선택지 위로
     */
    moveChoiceUp(): void {
        if (this.selectedChoiceIndex > 0) {
            this.selectedChoiceIndex--;
        }
    }

    /**
     * 선택지 아래로
     */
    moveChoiceDown(): void {
        if (this.selectedChoiceIndex < this.choices.length - 1) {
            this.selectedChoiceIndex++;
        }
    }

    /**
     * 현재 선택 확정
     */
    confirmChoice(): void {
        if (this.choices.length > 0) {
            const choice = this.choices[this.selectedChoiceIndex];
            choice.action();
            this.endDialogue();
        } else {
            // 선택지 없으면 그냥 종료
            this.endDialogue();
        }
    }

    /**
     * 렌더링
     */
    render(renderer: Renderer): void {
        if (!this.isActive) return;

        const ctx = renderer.getContext();

        // 배경 어둡게
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, 1280, 720);

        // 대화창 배경
        ctx.fillStyle = 'rgba(30, 30, 40, 0.95)';
        ctx.fillRect(this.boxX, this.boxY, this.boxWidth, this.boxHeight);

        // 대화창 테두리
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        ctx.strokeRect(this.boxX, this.boxY, this.boxWidth, this.boxHeight);

        // NPC 이름
        if (this.currentNPC) {
            ctx.fillStyle = 'rgba(50, 50, 60, 1)';
            ctx.fillRect(this.boxX, this.boxY - 40, 200, 40);
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 2;
            ctx.strokeRect(this.boxX, this.boxY - 40, 200, 40);

            renderer.drawText(
                this.currentNPC.data.name,
                this.boxX + 100,
                this.boxY - 15,
                'bold 18px Arial',
                '#FFD700',
                'center'
            );
        }

        // 대화 텍스트 (여러 줄 지원)
        const textX = this.boxX + this.padding;
        const textY = this.boxY + this.padding + 20;
        const maxWidth = this.boxWidth - this.padding * 2;

        this.drawWrappedText(
            ctx,
            this.displayedText,
            textX,
            textY,
            maxWidth,
            24,
            '16px Arial',
            '#FFFFFF'
        );

        // 타이핑 중이 아닐 때만 진행 표시
        if (this.textProgress >= this.currentText.length) {
            // 선택지 표시
            if (this.choices.length > 0) {
                const choiceStartY = this.boxY + 120;
                this.choices.forEach((choice, index) => {
                    const isSelected = index === this.selectedChoiceIndex;
                    const choiceY = choiceStartY + index * 35;

                    // 선택된 항목 배경
                    if (isSelected) {
                        ctx.fillStyle = 'rgba(255, 215, 0, 0.2)';
                        ctx.fillRect(this.boxX + 20, choiceY - 20, this.boxWidth - 40, 30);
                    }

                    // 선택 화살표
                    const arrow = isSelected ? '▶' : ' ';
                    renderer.drawText(
                        `${arrow} ${choice.text}`,
                        textX + 10,
                        choiceY,
                        isSelected ? 'bold 14px Arial' : '14px Arial',
                        isSelected ? '#FFD700' : '#CCCCCC',
                        'left'
                    );
                });

                // 조작법 힌트
                renderer.drawText(
                    '↑↓ 선택  |  Enter 확정',
                    this.boxX + this.boxWidth - this.padding - 10,
                    this.boxY + this.boxHeight - 10,
                    '12px Arial',
                    '#888888',
                    'right'
                );
            } else {
                // 선택지 없으면 계속 표시
                const pulse = Math.sin(Date.now() / 300) * 0.3 + 0.7;
                renderer.drawText(
                    '▼ Space 계속',
                    this.boxX + this.boxWidth - this.padding - 10,
                    this.boxY + this.boxHeight - 10,
                    '14px Arial',
                    `rgba(255, 215, 0, ${pulse})`,
                    'right'
                );
            }
        } else {
            // 타이핑 중일 때 스킵 안내
            renderer.drawText(
                'Space 스킵',
                this.boxX + this.boxWidth - this.padding - 10,
                this.boxY + this.boxHeight - 10,
                '12px Arial',
                '#888888',
                'right'
            );
        }
    }

    /**
     * 여러 줄 텍스트 그리기
     */
    private drawWrappedText(
        ctx: CanvasRenderingContext2D,
        text: string,
        x: number,
        y: number,
        maxWidth: number,
        lineHeight: number,
        font: string,
        color: string
    ): void {
        ctx.font = font;
        ctx.fillStyle = color;

        const words = text.split(' ');
        let line = '';
        let currentY = y;

        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + ' ';
            const metrics = ctx.measureText(testLine);

            if (metrics.width > maxWidth && i > 0) {
                ctx.fillText(line, x, currentY);
                line = words[i] + ' ';
                currentY += lineHeight;
            } else {
                line = testLine;
            }
        }

        ctx.fillText(line, x, currentY);
    }

    /**
     * 활성 상태 확인
     */
    isDialogueActive(): boolean {
        return this.isActive;
    }

    /**
     * 텍스트 완전히 표시됐는지 확인
     */
    isTextComplete(): boolean {
        return this.textProgress >= this.currentText.length;
    }

    /**
     * 선택지 있는지 확인
     */
    hasChoices(): boolean {
        return this.choices.length > 0;
    }
}
