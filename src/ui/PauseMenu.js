export class PauseMenu {
    constructor(canvas, ctx, audioManager) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.audioManager = audioManager;

        this.isVisible = false;
        this.menuIndex = 0;
        this.menuOptions = [
            '게임 계속하기',
            '게임 저장하기',
            '설정',
            '타이틀로 돌아가기',
            '게임 종료'
        ];

        this.showSettings = false;
        this.settingsIndex = 0;
        this.settings = {
            soundEnabled: true,
            musicEnabled: true,
            showMinimap: true,
            showQuestUI: true
        };
    }

    show() {
        this.isVisible = true;
        this.menuIndex = 0;
        this.showSettings = false;
    }

    hide() {
        this.isVisible = false;
        this.showSettings = false;
    }

    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }

    handleKeyDown(event) {
        if (!this.isVisible) return null;

        if (this.showSettings) {
            return this.handleSettingsInput(event);
        }

        switch (event.key) {
            case 'Escape':
                this.hide();
                this.audioManager?.playMenuSelect();
                return 'resume';
            case 'ArrowUp':
                this.menuIndex = (this.menuIndex - 1 + this.menuOptions.length) % this.menuOptions.length;
                this.audioManager?.playUIHover();
                break;
            case 'ArrowDown':
                this.menuIndex = (this.menuIndex + 1) % this.menuOptions.length;
                this.audioManager?.playUIHover();
                break;
            case 'Enter':
                return this.selectCurrentOption();
        }
        return null;
    }

    handleSettingsInput(event) {
        const settingsOptions = [
            'soundEnabled',
            'musicEnabled',
            'showMinimap',
            'showQuestUI',
            'back'
        ];

        switch (event.key) {
            case 'Escape':
                this.showSettings = false;
                this.audioManager?.playMenuSelect();
                break;
            case 'ArrowUp':
                this.settingsIndex = (this.settingsIndex - 1 + settingsOptions.length) % settingsOptions.length;
                this.audioManager?.playUIHover();
                break;
            case 'ArrowDown':
                this.settingsIndex = (this.settingsIndex + 1) % settingsOptions.length;
                this.audioManager?.playUIHover();
                break;
            case 'Enter':
                const selected = settingsOptions[this.settingsIndex];
                if (selected === 'back') {
                    this.showSettings = false;
                } else {
                    this.settings[selected] = !this.settings[selected];
                }
                this.audioManager?.playMenuSelect();
                break;
        }
        return null;
    }

    selectCurrentOption() {
        const selectedOption = this.menuOptions[this.menuIndex];
        this.audioManager?.playUIClick();

        switch (selectedOption) {
            case '게임 계속하기':
                this.hide();
                return 'resume';
            case '게임 저장하기':
                return 'save';
            case '설정':
                this.showSettings = true;
                this.settingsIndex = 0;
                return null;
            case '타이틀로 돌아가기':
                return 'title';
            case '게임 종료':
                return 'quit';
        }
        return null;
    }

    draw() {
        if (!this.isVisible) return;

        // 반투명 배경
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.showSettings) {
            this.drawSettings();
        } else {
            this.drawMainMenu();
        }
    }

    drawMainMenu() {
        // 메뉴 박스
        const boxWidth = 400;
        const boxHeight = 350;
        const boxX = (this.canvas.width - boxWidth) / 2;
        const boxY = (this.canvas.height - boxHeight) / 2;

        // 메뉴 배경
        this.ctx.fillStyle = 'rgba(34, 45, 78, 0.95)';
        this.ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

        // 제목
        this.ctx.fillStyle = '#ffff00';
        this.ctx.font = 'bold 28px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('일시 정지', this.canvas.width / 2, boxY + 50);

        // 메뉴 옵션들
        this.ctx.font = '20px Arial';
        const startY = boxY + 100;
        const spacing = 45;

        for (let i = 0; i < this.menuOptions.length; i++) {
            const y = startY + i * spacing;
            const isSelected = i === this.menuIndex;

            // 선택된 메뉴 하이라이트
            if (isSelected) {
                this.ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
                this.ctx.fillRect(boxX + 20, y - 25, boxWidth - 40, 35);

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
        }

        // 조작 힌트
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        this.ctx.font = '14px Arial';
        this.ctx.fillText('↑↓: 선택, Enter: 확인, ESC: 닫기', this.canvas.width / 2, boxY + boxHeight - 20);
    }

    drawSettings() {
        // 설정 박스
        const boxWidth = 500;
        const boxHeight = 400;
        const boxX = (this.canvas.width - boxWidth) / 2;
        const boxY = (this.canvas.height - boxHeight) / 2;

        // 설정 배경
        this.ctx.fillStyle = 'rgba(34, 45, 78, 0.95)';
        this.ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

        // 제목
        this.ctx.fillStyle = '#ffff00';
        this.ctx.font = 'bold 28px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('게임 설정', this.canvas.width / 2, boxY + 50);

        // 설정 옵션들
        const settingsOptions = [
            { key: 'soundEnabled', label: '효과음' },
            { key: 'musicEnabled', label: '배경음악' },
            { key: 'showMinimap', label: '미니맵 표시' },
            { key: 'showQuestUI', label: '퀘스트 UI 표시' },
            { key: 'back', label: '뒤로 가기' }
        ];

        this.ctx.font = '18px Arial';
        this.ctx.textAlign = 'left';
        const startY = boxY + 100;
        const spacing = 50;

        for (let i = 0; i < settingsOptions.length; i++) {
            const y = startY + i * spacing;
            const isSelected = i === this.settingsIndex;
            const option = settingsOptions[i];

            // 선택된 설정 하이라이트
            if (isSelected) {
                this.ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
                this.ctx.fillRect(boxX + 20, y - 20, boxWidth - 40, 35);
            }

            // 설정 라벨
            this.ctx.fillStyle = isSelected ? '#ffff00' : '#ffffff';
            this.ctx.fillText(option.label, boxX + 40, y);

            // 설정 값 (ON/OFF 또는 뒤로가기)
            if (option.key !== 'back') {
                const value = this.settings[option.key] ? 'ON' : 'OFF';
                const valueColor = this.settings[option.key] ? '#00ff00' : '#ff6666';

                this.ctx.fillStyle = isSelected ? valueColor : '#cccccc';
                this.ctx.textAlign = 'right';
                this.ctx.fillText(value, boxX + boxWidth - 40, y);
                this.ctx.textAlign = 'left';
            }
        }

        // 조작 힌트
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('↑↓: 선택, Enter: 토글/확인, ESC: 뒤로', this.canvas.width / 2, boxY + boxHeight - 20);
    }

    getSettings() {
        return { ...this.settings };
    }
};