export class QuestUI {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
    }

    draw(questSystem) {
        if (!questSystem.showQuestUI) return;

        const currentQuest = questSystem.getCurrentQuest();
        const availableSubQuests = questSystem.getAvailableSubQuests();
        const completedCount = questSystem.getCompletedQuestCount();
        const totalCount = questSystem.getTotalQuestCount();

        // 전체 UI 배경 크기 계산
        const baseHeight = currentQuest ? 140 : 60;
        const subQuestHeight = Math.min(availableSubQuests.length * 20, 100);
        const totalHeight = baseHeight + subQuestHeight + 40;

        // 퀘스트 UI 배경
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(10, 10, 380, totalHeight);

        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(10, 10, 380, totalHeight);

        let currentY = 25;

        // 전체 퀘스트 진행률
        this.ctx.fillStyle = '#00ff00';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`전체 진행률: ${completedCount}/${totalCount}`, 20, currentY);
        currentY += 25;

        if (currentQuest) {
            // 메인 퀘스트 제목
            this.ctx.fillStyle = '#ffff00';
            this.ctx.font = 'bold 18px Arial';
            this.ctx.fillText('메인 퀘스트', 20, currentY);
            currentY += 25;

            // 퀘스트 내용
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '16px Arial';
            this.ctx.fillText(currentQuest.title, 20, currentY);
            currentY += 20;

            this.ctx.font = '14px Arial';
            this.ctx.fillStyle = '#cccccc';

            // 설명을 여러 줄로 나누기
            const words = currentQuest.description.split(' ');
            let line = '';
            const maxWidth = 350;

            for (let word of words) {
                const testLine = line + word + ' ';
                const metrics = this.ctx.measureText(testLine);

                if (metrics.width > maxWidth && line !== '') {
                    this.ctx.fillText(line, 20, currentY);
                    line = word + ' ';
                    currentY += 18;
                } else {
                    line = testLine;
                }
            }

            // 마지막 줄 그리기
            if (line) {
                this.ctx.fillText(line, 20, currentY);
                currentY += 18;
            }

            // 진행률 표시
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '12px Arial';
            this.ctx.fillText(
                `진행률: ${currentQuest.progress}/${currentQuest.maxProgress}`,
                20,
                currentY
            );
            currentY += 25;
        }

        // 서브 퀘스트 섹션
        if (availableSubQuests.length > 0) {
            this.ctx.fillStyle = '#00ccff';
            this.ctx.font = 'bold 16px Arial';
            this.ctx.fillText('이용 가능한 서브 퀘스트', 20, currentY);
            currentY += 20;

            this.ctx.font = '12px Arial';
            this.ctx.fillStyle = '#ffffff';

            const maxSubQuests = Math.min(availableSubQuests.length, 5);
            for (let i = 0; i < maxSubQuests; i++) {
                const subQuest = availableSubQuests[i];
                const categoryIcon = this.getCategoryIcon(subQuest.category);
                this.ctx.fillText(
                    `${categoryIcon} ${subQuest.title}`,
                    25,
                    currentY
                );
                currentY += 16;
            }

            if (availableSubQuests.length > 5) {
                this.ctx.fillStyle = '#cccccc';
                this.ctx.fillText(`...그 외 ${availableSubQuests.length - 5}개`, 25, currentY);
            }
        }
    }

    getCategoryIcon(category) {
        const icons = {
            '업무': '💼',
            '생활': '🍕',
            '사교': '🤝',
            '탐험': '🔍',
            '미니게임': '🎮'
        };
        return icons[category] || '📋';
    }
};