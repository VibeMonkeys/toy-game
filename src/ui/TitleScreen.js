export class TitleScreen {
    constructor(canvas, ctx, audioManager) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.audioManager = audioManager;

        this.menuIndex = 0;
        this.menuOptions = [];
        this.animationTime = 0;
        this.showGameInfo = false;
        this.menuAreas = [];

        this.backgroundGradient = null;
        this.createBackground();
    }

    setMenuOptions(options) {
        this.menuOptions = options;
        this.menuIndex = Math.min(this.menuIndex, options.length - 1);
    }

    createBackground() {
        this.backgroundGradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        this.backgroundGradient.addColorStop(0, '#1a1a2e');
        this.backgroundGradient.addColorStop(0.5, '#16213e');
        this.backgroundGradient.addColorStop(1, '#0f3460');
    }

    draw() {
        // 배경 그라디언트
        this.ctx.fillStyle = this.backgroundGradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawTitleDecorations();
        this.drawTitleMenu();

        if (this.showGameInfo) {
            this.drawGameInfo();
        }
    }

    drawTitleDecorations() {
        this.animationTime += 0.05;

        // 제목
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 3;

        const titleY = 150;
        this.ctx.strokeText('휴넷 26주년', this.canvas.width / 2, titleY);
        this.ctx.fillText('휴넷 26주년', this.canvas.width / 2, titleY);

        this.ctx.font = 'bold 32px Arial';
        const subtitleY = 200;
        this.ctx.strokeText('보물찾기 게임', this.canvas.width / 2, subtitleY);
        this.ctx.fillText('보물찾기 게임', this.canvas.width / 2, subtitleY);

        // 반짝이는 효과
        for (let i = 0; i < 20; i++) {
            const x = (Math.sin(this.animationTime + i) * 200) + this.canvas.width / 2;
            const y = (Math.cos(this.animationTime * 0.7 + i) * 100) + 250;
            const alpha = (Math.sin(this.animationTime * 2 + i) + 1) / 2;

            this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.6})`;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 3, 0, Math.PI * 2);
            this.ctx.fill();
        }

        // 회사 로고 영역 (placeholder)
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.fillRect(this.canvas.width / 2 - 50, 50, 100, 50);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '14px Arial';
        this.ctx.fillText('HUNET LOGO', this.canvas.width / 2, 80);
    }

    drawTitleMenu() {
        this.menuAreas = [];
        const startY = 350;
        const spacing = 60;

        this.ctx.font = '24px Arial';
        this.ctx.textAlign = 'center';

        for (let i = 0; i < this.menuOptions.length; i++) {
            const y = startY + i * spacing;
            const isSelected = i === this.menuIndex;

            // 선택된 메뉴 하이라이트
            if (isSelected) {
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
                this.ctx.fillRect(this.canvas.width / 2 - 150, y - 25, 300, 40);

                this.ctx.fillStyle = '#ffff00';
                this.ctx.strokeStyle = '#000000';
                this.ctx.lineWidth = 2;
            } else {
                this.ctx.fillStyle = '#ffffff';
                this.ctx.strokeStyle = '#000000';
                this.ctx.lineWidth = 1;
            }

            this.ctx.strokeText(this.menuOptions[i], this.canvas.width / 2, y);
            this.ctx.fillText(this.menuOptions[i], this.canvas.width / 2, y);

            // 마우스 클릭 영역 저장
            this.menuAreas.push({
                x: this.canvas.width / 2 - 150,
                y: y - 25,
                width: 300,
                height: 40,
                index: i
            });
        }

        // 조작 힌트
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        this.ctx.font = '16px Arial';
        this.ctx.fillText('↑↓ 키로 선택, Enter로 확인', this.canvas.width / 2, this.canvas.height - 50);
    }

    drawGameInfo() {
        // 반투명 배경
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 정보 박스
        const boxWidth = 600;
        const boxHeight = 400;
        const boxX = (this.canvas.width - boxWidth) / 2;
        const boxY = (this.canvas.height - boxHeight) / 2;

        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

        // 게임 정보 텍스트
        this.ctx.fillStyle = '#000000';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('게임 정보', this.canvas.width / 2, boxY + 50);

        this.ctx.font = '18px Arial';
        this.ctx.textAlign = 'left';
        const infoText = [
            '휴넷 26주년을 기념하는 보물찾기 게임입니다.',
            '',
            '조작법:',
            '• 방향키: 캐릭터 이동',
            '• 스페이스바: NPC와 대화/아이템 수집',
            '• S키: 게임 저장',
            '',
            '목표:',
            '• 김대리 → 박과장 → 이부장 → CEO 순서로 찾아가세요',
            '• 각 NPC로부터 단서를 얻고 보물을 찾으세요',
            '• 모든 아이템을 수집하면 게임 완료!'
        ];

        let textY = boxY + 100;
        for (let line of infoText) {
            this.ctx.fillText(line, boxX + 30, textY);
            textY += 25;
        }

        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('ESC 키를 눌러 돌아가기', this.canvas.width / 2, boxY + boxHeight - 30);
    }

    handleKeyDown(event) {
        if (this.showGameInfo) {
            if (event.key === 'Escape') {
                this.showGameInfo = false;
                this.audioManager?.playMenuSelect();
            }
            return;
        }

        switch (event.key) {
            case 'ArrowUp':
                this.menuIndex = (this.menuIndex - 1 + this.menuOptions.length) % this.menuOptions.length;
                this.audioManager?.playMenuMove();
                break;
            case 'ArrowDown':
                this.menuIndex = (this.menuIndex + 1) % this.menuOptions.length;
                this.audioManager?.playMenuMove();
                break;
            case 'Enter':
                return this.selectCurrentOption();
        }
        return null;
    }

    handleMouseMove(event) {
        if (this.showGameInfo) return;

        const rect = this.canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        for (let i = 0; i < this.menuAreas.length; i++) {
            const area = this.menuAreas[i];
            if (mouseX >= area.x && mouseX <= area.x + area.width &&
                mouseY >= area.y && mouseY <= area.y + area.height) {
                if (this.menuIndex !== i) {
                    this.menuIndex = i;
                    this.audioManager?.playMenuMove();
                }
                break;
            }
        }
    }

    handleMouseClick(event) {
        if (this.showGameInfo) {
            this.showGameInfo = false;
            this.audioManager?.playMenuSelect();
            return null;
        }

        const rect = this.canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        for (let area of this.menuAreas) {
            if (mouseX >= area.x && mouseX <= area.x + area.width &&
                mouseY >= area.y && mouseY <= area.y + area.height) {
                this.menuIndex = area.index;
                return this.selectCurrentOption();
            }
        }
        return null;
    }

    selectCurrentOption() {
        const selectedOption = this.menuOptions[this.menuIndex];
        this.audioManager?.playMenuSelect();

        if (selectedOption === '게임 정보') {
            this.showGameInfo = true;
            return null;
        }

        return selectedOption;
    }

    update() {
        // 애니메이션 업데이트만 수행
        this.animationTime += 0.05;
    }
};