export class QuestUI {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
    }

    draw(questSystem) {
        if (!questSystem.showQuestUI) return;

        const currentQuest = questSystem.getCurrentQuest();
        if (!currentQuest) return;

        // 퀘스트 UI 배경
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(10, 10, 350, 120);

        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(10, 10, 350, 120);

        // 퀘스트 제목
        this.ctx.fillStyle = '#ffff00';
        this.ctx.font = 'bold 18px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('현재 퀘스트', 20, 35);

        // 퀘스트 내용
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '16px Arial';
        this.ctx.fillText(currentQuest.title, 20, 60);

        this.ctx.font = '14px Arial';
        this.ctx.fillStyle = '#cccccc';

        // 설명을 여러 줄로 나누기
        const words = currentQuest.description.split(' ');
        let line = '';
        let y = 80;
        const maxWidth = 320;

        for (let word of words) {
            const testLine = line + word + ' ';
            const metrics = this.ctx.measureText(testLine);

            if (metrics.width > maxWidth && line !== '') {
                this.ctx.fillText(line, 20, y);
                line = word + ' ';
                y += 18;
            } else {
                line = testLine;
            }
        }
        this.ctx.fillText(line, 20, y);

        // 진행도 바
        if (currentQuest.maxProgress > 1) {
            const progressBarY = 110;
            const progressBarWidth = 200;
            const progressBarHeight = 10;

            // 배경
            this.ctx.fillStyle = '#333333';
            this.ctx.fillRect(20, progressBarY, progressBarWidth, progressBarHeight);

            // 진행도
            const progressPercent = currentQuest.progress / currentQuest.maxProgress;
            this.ctx.fillStyle = '#00ff00';
            this.ctx.fillRect(20, progressBarY, progressBarWidth * progressPercent, progressBarHeight);

            // 진행도 텍스트
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '12px Arial';
            this.ctx.fillText(`${currentQuest.progress}/${currentQuest.maxProgress}`, 230, progressBarY + 8);
        }
    }
};