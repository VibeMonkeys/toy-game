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
    private readonly boxX: number = 80;
    private readonly boxY: number = 450;
    private readonly boxWidth: number = 1120;
    private readonly boxHeight: number = 240;
    private readonly padding: number = 25;

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
     * 렌더링 (완전히 재설계)
     */
    render(renderer: Renderer): void {
        if (!this.isActive) return;

        const ctx = renderer.getContext();

        // 1. 배경 어둡게
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, 1280, 720);

        // 2. 대화창 배경
        ctx.fillStyle = 'rgba(30, 30, 40, 0.95)';
        ctx.fillRect(this.boxX, this.boxY, this.boxWidth, this.boxHeight);

        // 3. 대화창 테두리
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        ctx.strokeRect(this.boxX, this.boxY, this.boxWidth, this.boxHeight);

        // 4. NPC 이름 태그 (박스 바깥 상단)
        if (this.currentNPC) {
            const nameTagWidth = 200;
            const nameTagHeight = 40;
            const nameTagX = this.boxX + 20;
            const nameTagY = this.boxY - nameTagHeight;

            ctx.fillStyle = 'rgba(50, 50, 60, 1)';
            ctx.fillRect(nameTagX, nameTagY, nameTagWidth, nameTagHeight);
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 2;
            ctx.strokeRect(nameTagX, nameTagY, nameTagWidth, nameTagHeight);

            ctx.font = 'bold 16px Arial';
            ctx.fillStyle = '#FFD700';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.currentNPC.data.name, nameTagX + nameTagWidth / 2, nameTagY + nameTagHeight / 2);
        }

        // 5. 내부 컨텐츠 영역 계산
        const contentX = this.boxX + this.padding;
        const contentY = this.boxY + this.padding;
        const contentWidth = this.boxWidth - this.padding * 2;
        const contentHeight = this.boxHeight - this.padding * 2;

        // 6. 대화 텍스트 영역
        const hasChoices = this.choices.length > 0;
        const textAreaHeight = hasChoices ? 70 : contentHeight - 40;

        ctx.save();
        // 텍스트 영역 클리핑 (박스 밖으로 안 나가게)
        ctx.beginPath();
        ctx.rect(contentX, contentY, contentWidth, textAreaHeight);
        ctx.clip();

        this.drawWrappedText(
            ctx,
            this.displayedText,
            contentX + 5,
            contentY + 5,
            contentWidth - 10,
            textAreaHeight - 10,
            24,
            '15px Arial',
            '#FFFFFF'
        );
        ctx.restore();

        // 7. 타이핑 완료 후 UI
        if (this.textProgress >= this.currentText.length) {
            if (hasChoices) {
                // 선택지 영역 구분선
                const dividerY = contentY + textAreaHeight + 10;
                ctx.strokeStyle = 'rgba(255, 215, 0, 0.4)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(contentX, dividerY);
                ctx.lineTo(contentX + contentWidth, dividerY);
                ctx.stroke();

                // 선택지 타이틀
                ctx.font = 'bold 14px Arial';
                ctx.fillStyle = '#FFD700';
                ctx.textAlign = 'left';
                ctx.textBaseline = 'top';
                ctx.fillText('선택하세요:', contentX + 5, dividerY + 10);

                // 선택지 목록
                const choiceAreaY = dividerY + 35;
                const choiceHeight = 38;
                const choiceSpacing = 5;

                this.choices.forEach((choice, index) => {
                    const isSelected = index === this.selectedChoiceIndex;
                    const choiceY = choiceAreaY + index * (choiceHeight + choiceSpacing);

                    // 선택지 박스가 대화창 내부에 있는지 확인
                    if (choiceY + choiceHeight > this.boxY + this.boxHeight - this.padding) {
                        return; // 박스 밖으로 나가면 그리지 않음
                    }

                    // 선택된 항목 배경
                    if (isSelected) {
                        ctx.fillStyle = 'rgba(255, 215, 0, 0.2)';
                        ctx.fillRect(contentX + 5, choiceY, contentWidth - 10, choiceHeight);

                        ctx.strokeStyle = '#FFD700';
                        ctx.lineWidth = 2;
                        ctx.strokeRect(contentX + 5, choiceY, contentWidth - 10, choiceHeight);
                    } else {
                        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
                        ctx.lineWidth = 1;
                        ctx.strokeRect(contentX + 5, choiceY, contentWidth - 10, choiceHeight);
                    }

                    // 선택지 텍스트
                    const arrow = isSelected ? '▶ ' : '   ';
                    ctx.font = isSelected ? 'bold 15px Arial' : '14px Arial';
                    ctx.fillStyle = isSelected ? '#FFD700' : '#CCCCCC';
                    ctx.textAlign = 'left';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(arrow + choice.text, contentX + 15, choiceY + choiceHeight / 2);
                });

                // 조작법 힌트 (하단 우측)
                ctx.font = '11px Arial';
                ctx.fillStyle = '#888888';
                ctx.textAlign = 'right';
                ctx.textBaseline = 'bottom';
                ctx.fillText('↑↓ 선택  |  Enter 확정', this.boxX + this.boxWidth - this.padding, this.boxY + this.boxHeight - 10);
            } else {
                // 선택지 없음 - 계속 표시 (하단 우측)
                const pulse = Math.sin(Date.now() / 300) * 0.3 + 0.7;
                ctx.font = 'bold 14px Arial';
                ctx.fillStyle = `rgba(255, 215, 0, ${pulse})`;
                ctx.textAlign = 'right';
                ctx.textBaseline = 'bottom';
                ctx.fillText('▼ Space 계속', this.boxX + this.boxWidth - this.padding, this.boxY + this.boxHeight - 10);
            }
        } else {
            // 타이핑 중 - 스킵 안내 (하단 우측)
            ctx.font = '11px Arial';
            ctx.fillStyle = '#888888';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'bottom';
            ctx.fillText('Space 스킵', this.boxX + this.boxWidth - this.padding, this.boxY + this.boxHeight - 10);
        }
    }

    /**
     * 여러 줄 텍스트 그리기 (높이 제한 추가)
     */
    private drawWrappedText(
        ctx: CanvasRenderingContext2D,
        text: string,
        x: number,
        y: number,
        maxWidth: number,
        maxHeight: number,
        lineHeight: number,
        font: string,
        color: string
    ): void {
        ctx.font = font;
        ctx.fillStyle = color;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';

        // 빈 텍스트 처리
        if (!text || text.length === 0) return;

        const lines: string[] = [];
        const words = text.split(' ');
        let currentLine = '';

        // 1단계: 텍스트를 줄바꿈 처리
        for (let i = 0; i < words.length; i++) {
            const testLine = currentLine + (currentLine ? ' ' : '') + words[i];
            const metrics = ctx.measureText(testLine);

            if (metrics.width > maxWidth && currentLine.length > 0) {
                // 현재 줄 저장하고 새 줄 시작
                lines.push(currentLine);
                currentLine = words[i];
            } else {
                currentLine = testLine;
            }
        }

        // 마지막 줄 추가
        if (currentLine) {
            lines.push(currentLine);
        }

        // 2단계: 줄 렌더링 (높이 제한 적용)
        let currentY = y;
        for (let i = 0; i < lines.length; i++) {
            // 높이 초과 체크
            if (currentY + lineHeight > y + maxHeight) {
                // 마지막에 "..." 표시
                if (i > 0) {
                    const prevY = y + (i - 1) * lineHeight;
                    ctx.fillText(lines[i - 1] + '...', x, prevY);
                }
                break;
            }

            ctx.fillText(lines[i], x, currentY);
            currentY += lineHeight;
        }
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
