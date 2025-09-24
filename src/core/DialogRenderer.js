// 대화창 렌더링 전용 클래스
export class DialogRenderer {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
    }

    // 대화창 그리기
    drawDialog(currentDialog, dialogIndex, currentNPC) {
        if (!currentDialog || dialogIndex >= currentDialog.length) return;

        const currentText = currentDialog[dialogIndex];

        // 대화창 크기와 위치
        const dialogWidth = 800;
        const dialogHeight = 150;
        const dialogX = (this.canvas.width - dialogWidth) / 2;
        const dialogY = this.canvas.height - 200;

        // 반투명 전체 배경 (대화 중임을 강조)
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 대화창 그림자
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(dialogX + 5, dialogY + 5, dialogWidth, dialogHeight);

        // 대화창 배경
        this.ctx.fillStyle = 'rgba(15, 25, 50, 0.95)';
        this.ctx.fillRect(dialogX, dialogY, dialogWidth, dialogHeight);

        // 대화창 테두리
        this.ctx.strokeStyle = '#FFD700';
        this.ctx.lineWidth = 4;
        this.ctx.strokeRect(dialogX, dialogY, dialogWidth, dialogHeight);

        // 내부 테두리
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(dialogX + 3, dialogY + 3, dialogWidth - 6, dialogHeight - 6);

        // NPC 이름 표시
        if (currentNPC) {
            this.ctx.fillStyle = '#FFD700';
            this.ctx.font = 'bold 16px Arial';
            this.ctx.textAlign = 'left';
            this.ctx.fillText(`💬 ${currentNPC.name}`, dialogX + 20, dialogY + 25);

            // NPC 이름 아래 구분선
            this.ctx.strokeStyle = 'rgba(255, 215, 0, 0.5)';
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(dialogX + 20, dialogY + 35);
            this.ctx.lineTo(dialogX + dialogWidth - 20, dialogY + 35);
            this.ctx.stroke();
        }

        // 대화 텍스트
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 18px Arial';
        this.ctx.textAlign = 'left';

        // 텍스트 줄바꿈 처리
        const maxWidth = dialogWidth - 40;
        const lineHeight = 26; // 줄 간격을 더 넓히기
        const lines = this.wrapText(currentText, maxWidth);

        // NPC 이름이 있으면 텍스트를 더 아래에 표시
        const textStartY = currentNPC ? dialogY + 60 : dialogY + 40;

        // 텍스트가 대화창을 벗어나지 않도록 제한
        const maxLines = Math.floor((dialogHeight - (textStartY - dialogY) - 40) / lineHeight);
        const visibleLines = lines.slice(0, maxLines);

        visibleLines.forEach((line, index) => {
            this.ctx.fillText(line, dialogX + 20, textStartY + index * lineHeight);
        });

        // 진행 표시
        const progressText = `${dialogIndex + 1} / ${currentDialog.length}`;
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'right';
        this.ctx.fillText(progressText, dialogX + dialogWidth - 20, dialogY + dialogHeight - 15);

        // 계속하기 안내
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'center';

        const continueText = dialogIndex < currentDialog.length - 1 ?
            '▶️ 스페이스나 엔터를 눌러 계속하기' :
            '✅ 스페이스나 엔터를 눌러 닫기';

        // 반짝이는 효과
        const blinkAlpha = Math.sin(Date.now() * 0.005) * 0.3 + 0.7;
        this.ctx.fillStyle = `rgba(255, 215, 0, ${blinkAlpha})`;
        this.ctx.fillText(continueText, this.canvas.width / 2, dialogY + dialogHeight + 25);
    }

    // 대화 선택지 그리기
    drawDialogChoices(npc, selectedChoice = 0) {
        if (!npc || !npc.hasChoices || !npc.dialogChoices) return;

        const choices = npc.dialogChoices;
        const boxWidth = 500;
        const choiceHeight = 40;
        const spacing = 10;
        const totalHeight = 80 + (choices.choices.length * (choiceHeight + spacing));
        
        const x = (this.canvas.width - boxWidth) / 2;
        const y = (this.canvas.height - totalHeight) / 2;

        // 메인 배경
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(x, y, boxWidth, totalHeight);
        
        // 테두리
        this.ctx.strokeStyle = '#4A90E2';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(x, y, boxWidth, totalHeight);

        // NPC 이름
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = 'bold 18px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(npc.name, x + boxWidth/2, y + 25);

        // 질문
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '16px Arial';
        this.ctx.fillText(choices.question, x + boxWidth/2, y + 50);

        // 선택지들
        choices.choices.forEach((choice, index) => {
            const choiceY = y + 80 + (index * (choiceHeight + spacing));
            
            // 선택지 배경
            if (index === selectedChoice) {
                this.ctx.fillStyle = 'rgba(74, 144, 226, 0.7)';
            } else {
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            }
            this.ctx.fillRect(x + 20, choiceY, boxWidth - 40, choiceHeight);
            
            // 선택지 테두리
            this.ctx.strokeStyle = index === selectedChoice ? '#FFD700' : '#ffffff';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(x + 20, choiceY, boxWidth - 40, choiceHeight);
            
            // 선택지 텍스트
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '14px Arial';
            this.ctx.textAlign = 'left';
            this.ctx.fillText(`${index + 1}. ${choice.text}`, x + 35, choiceY + 25);
        });

        // 조작 안내
        this.ctx.fillStyle = '#cccccc';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('↑↓ 키로 선택, Enter로 확인, ESC로 취소', x + boxWidth/2, y + totalHeight - 10);
    }

    // 텍스트 줄바꿈 처리
    wrapText(text, maxWidth) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';

        this.ctx.font = 'bold 18px Arial'; // 측정을 위해 폰트 설정

        for (let i = 0; i < words.length; i++) {
            const testLine = currentLine + words[i] + ' ';
            const metrics = this.ctx.measureText(testLine);
            const testWidth = metrics.width;

            if (testWidth > maxWidth && i > 0) {
                lines.push(currentLine.trim());
                currentLine = words[i] + ' ';
            } else {
                currentLine = testLine;
            }
        }
        lines.push(currentLine.trim());

        return lines;
    }
}