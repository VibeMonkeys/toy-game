/**
 * 📜 퀘스트 UI
 *
 * 활성 퀘스트 목록 및 진행도 표시
 */

import { Renderer } from '../systems/Renderer';
import { QuestSystem } from '../systems/QuestSystem';
import { Quest } from '../types';

export class QuestUI {
    private isOpen: boolean = false;
    private questSystem: QuestSystem;

    // UI 설정
    private readonly panelX: number = 50;
    private readonly panelY: number = 100;
    private readonly panelWidth: number = 400;
    private readonly panelHeight: number = 500;
    private readonly padding: number = 20;

    constructor(questSystem: QuestSystem) {
        this.questSystem = questSystem;
    }

    /**
     * UI 열기/닫기
     */
    toggle(): void {
        this.isOpen = !this.isOpen;
    }

    /**
     * UI 닫기
     */
    close(): void {
        this.isOpen = false;
    }

    /**
     * UI 열림 상태 확인
     */
    isQuestUIOpen(): boolean {
        return this.isOpen;
    }

    /**
     * 렌더링
     */
    render(renderer: Renderer): void {
        if (!this.isOpen) {
            // 간단한 퀘스트 표시 (우측 상단)
            this.renderCompactView(renderer);
            return;
        }

        // 전체 퀘스트 패널
        this.renderFullPanel(renderer);
    }

    /**
     * 간단한 퀘스트 표시 (항상 표시)
     */
    private renderCompactView(renderer: Renderer): void {
        const activeQuests = this.questSystem.getActiveQuests();
        if (activeQuests.length === 0) return;

        const ctx = renderer.getContext();
        const startX = 900;
        const startY = 50;

        // 퀘스트 카운트
        renderer.drawText(
            `📜 퀘스트 (${activeQuests.length})`,
            startX,
            startY,
            'bold 14px Arial',
            '#FFD700'
        );

        // 첫 번째 퀘스트만 간단히 표시
        const quest = activeQuests[0];
        const completedCount = quest.objectives.filter(obj => obj.completed).length;
        const totalCount = quest.objectives.length;

        renderer.drawText(
            `${quest.title} [${completedCount}/${totalCount}]`,
            startX,
            startY + 25,
            '12px Arial',
            completedCount === totalCount ? '#00FF00' : '#FFFFFF'
        );

        // Q키 힌트
        renderer.drawText(
            'Q: 상세보기',
            startX,
            startY + 45,
            '10px Arial',
            '#888888'
        );
    }

    /**
     * 전체 퀘스트 패널
     */
    private renderFullPanel(renderer: Renderer): void {
        const ctx = renderer.getContext();

        // 배경
        ctx.fillStyle = 'rgba(20, 20, 30, 0.95)';
        ctx.fillRect(this.panelX, this.panelY, this.panelWidth, this.panelHeight);

        // 테두리
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        ctx.strokeRect(this.panelX, this.panelY, this.panelWidth, this.panelHeight);

        // 제목
        renderer.drawText(
            '📜 활성 퀘스트',
            this.panelX + this.panelWidth / 2,
            this.panelY + 30,
            'bold 20px Arial',
            '#FFD700',
            'center'
        );

        // 구분선
        ctx.strokeStyle = '#555555';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(this.panelX + this.padding, this.panelY + 50);
        ctx.lineTo(this.panelX + this.panelWidth - this.padding, this.panelY + 50);
        ctx.stroke();

        // 퀘스트 목록
        const activeQuests = this.questSystem.getActiveQuests();

        if (activeQuests.length === 0) {
            renderer.drawText(
                '진행 중인 퀘스트가 없습니다',
                this.panelX + this.panelWidth / 2,
                this.panelY + 100,
                '14px Arial',
                '#888888',
                'center'
            );
        } else {
            let yOffset = this.panelY + 80;

            activeQuests.forEach((quest, index) => {
                if (yOffset > this.panelY + this.panelHeight - 80) return; // 패널 넘어가면 중단

                this.renderQuestItem(renderer, quest, this.panelX + this.padding, yOffset);
                yOffset += this.getQuestItemHeight(quest) + 15;
            });
        }

        // 닫기 안내
        renderer.drawText(
            'Q: 닫기',
            this.panelX + this.panelWidth / 2,
            this.panelY + this.panelHeight - 20,
            '12px Arial',
            '#888888',
            'center'
        );
    }

    /**
     * 개별 퀘스트 아이템 렌더링
     */
    private renderQuestItem(renderer: Renderer, quest: Quest, x: number, y: number): void {
        const ctx = renderer.getContext();

        // 퀘스트 타입 배지
        const typeColor = quest.type === 'MAIN' ? '#FF6B6B' : '#4ECDC4';
        ctx.fillStyle = typeColor;
        ctx.fillRect(x, y, 50, 20);

        renderer.drawText(
            quest.type === 'MAIN' ? 'MAIN' : 'SIDE',
            x + 25,
            y + 15,
            'bold 10px Arial',
            '#FFFFFF',
            'center'
        );

        // 퀘스트 제목
        renderer.drawText(
            quest.title,
            x + 60,
            y + 15,
            'bold 14px Arial',
            '#FFD700'
        );

        // 목표 목록
        let objY = y + 35;
        quest.objectives.forEach(obj => {
            const color = obj.completed ? '#00FF00' : '#FFFFFF';
            const checkmark = obj.completed ? '✓' : '○';

            renderer.drawText(
                `${checkmark} ${obj.text}`,
                x + 10,
                objY,
                '12px Arial',
                color
            );

            // 진행도 표시
            if (obj.target && obj.target > 1) {
                const progress = obj.progress ?? 0;
                renderer.drawText(
                    `[${progress}/${obj.target}]`,
                    x + this.panelWidth - this.padding * 2 - 50,
                    objY,
                    '11px Arial',
                    color
                );
            }

            objY += 20;
        });
    }

    /**
     * 퀘스트 아이템 높이 계산
     */
    private getQuestItemHeight(quest: Quest): number {
        return 35 + quest.objectives.length * 20;
    }
}
