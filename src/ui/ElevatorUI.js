import { CONSTANTS } from '../utils/Constants.js';

export class ElevatorUI {
    constructor(canvas, ctx, audioManager = null) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.audioManager = audioManager;

        this.isVisible = false;
        this.currentFloor = 1;
        this.selectedFloor = 1;
        this.availableFloors = [];

        // 간단한 팝업 크기
        this.width = 400;
        this.height = 250;
        this.x = (canvas.width - this.width) / 2;
        this.y = canvas.height - this.height - 50; // 하단에 위치

        // 버튼 설정
        this.buttonWidth = 80;
        this.buttonHeight = 50;
        this.buttonSpacing = 20;
    }

    show(currentFloor = 1) {
        this.isVisible = true;
        this.currentFloor = currentFloor;

        // 현재 층을 제외한 이동 가능한 층들만 표시
        this.availableFloors = CONSTANTS.ELEVATOR_FLOORS.filter(floor => floor !== currentFloor);
        this.selectedFloor = this.availableFloors[0] || currentFloor;

        if (this.audioManager) {
            this.audioManager.playUIClick();
        }
    }

    hide() {
        this.isVisible = false;
    }

    handleKeyDown(event) {
        if (!this.isVisible) return null;

        if (event.key >= '1' && event.key <= '9') {
            const floor = parseInt(event.key);
            if (this.availableFloors.includes(floor)) {
                this.selectedFloor = floor;
                return this.selectFloor();
            }
        }

        switch (event.key) {
            case 'ArrowLeft':
                this.moveSelection(-1);
                return 'move_selection';
            case 'ArrowRight':
                this.moveSelection(1);
                return 'move_selection';
            case 'Enter':
            case ' ':
                return this.selectFloor();
            case 'Escape':
                this.hide();
                return 'close';
        }
        return null;
    }

    handleMouseMove(event) {
        if (!this.isVisible) return;

        const rect = this.canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        // 버튼 위에 마우스가 있는지 확인
        this.availableFloors.forEach((floor, index) => {
            const buttonX = this.x + 50 + index * (this.buttonWidth + this.buttonSpacing);
            const buttonY = this.y + 100;

            if (mouseX >= buttonX && mouseX <= buttonX + this.buttonWidth &&
                mouseY >= buttonY && mouseY <= buttonY + this.buttonHeight) {
                this.selectedFloor = floor;
            }
        });
    }

    handleMouseClick(event) {
        if (!this.isVisible) return null;

        const rect = this.canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        // 버튼 클릭 확인
        for (let index = 0; index < this.availableFloors.length; index++) {
            const floor = this.availableFloors[index];
            const buttonX = this.x + 50 + index * (this.buttonWidth + this.buttonSpacing);
            const buttonY = this.y + 100;

            if (mouseX >= buttonX && mouseX <= buttonX + this.buttonWidth &&
                mouseY >= buttonY && mouseY <= buttonY + this.buttonHeight) {
                this.selectedFloor = floor;
                return this.selectFloor();
            }
        }

        return null;
    }

    moveSelection(direction) {
        const currentIndex = this.availableFloors.indexOf(this.selectedFloor);
        let newIndex = currentIndex + direction;

        if (newIndex < 0) newIndex = this.availableFloors.length - 1;
        if (newIndex >= this.availableFloors.length) newIndex = 0;

        this.selectedFloor = this.availableFloors[newIndex];

        if (this.audioManager) {
            this.audioManager.playMenuSelect();
        }
    }

    selectFloor() {
        if (this.audioManager) {
            this.audioManager.playPortalSound();
        }

        const result = {
            action: 'move_to_floor',
            targetFloor: this.selectedFloor
        };

        this.hide();
        return result;
    }

    update() {
        // 간단한 업데이트만 수행
    }

    draw() {
        if (!this.isVisible) return;

        // 패널 배경
        this.drawPanel();

        // 제목
        this.drawTitle();

        // 층 버튼들
        this.drawFloorButtons();

        // 안내 메시지
        this.drawInstructions();
    }

    drawPanel() {
        // 패널 배경
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        this.ctx.fillRect(this.x, this.y, this.width, this.height);

        // 패널 테두리
        this.ctx.strokeStyle = '#FFD700';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(this.x, this.y, this.width, this.height);
    }

    drawTitle() {
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('몇 층으로 가시겠습니까?', this.x + this.width / 2, this.y + 40);

        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '16px Arial';
        this.ctx.fillText(`현재 위치: ${this.currentFloor}층`, this.x + this.width / 2, this.y + 70);
    }

    drawFloorButtons() {
        this.availableFloors.forEach((floor, index) => {
            const buttonX = this.x + 50 + index * (this.buttonWidth + this.buttonSpacing);
            const buttonY = this.y + 100;
            const isSelected = floor === this.selectedFloor;

            // 버튼 배경
            if (isSelected) {
                this.ctx.fillStyle = '#FFD700';
            } else {
                this.ctx.fillStyle = 'rgba(100, 100, 100, 0.8)';
            }

            this.ctx.fillRect(buttonX, buttonY, this.buttonWidth, this.buttonHeight);

            // 버튼 테두리
            this.ctx.strokeStyle = isSelected ? '#FF6B35' : '#CCCCCC';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(buttonX, buttonY, this.buttonWidth, this.buttonHeight);

            // 버튼 텍스트
            this.ctx.fillStyle = isSelected ? '#000000' : '#FFFFFF';
            this.ctx.font = 'bold 20px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(`${floor}F`, buttonX + this.buttonWidth / 2, buttonY + this.buttonHeight / 2 + 7);
        });
    }

    drawInstructions() {
        const instructionY = this.y + this.height - 30;

        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('←→: 선택 | Enter/Space: 이동 | 숫자키: 직접 선택 | ESC: 닫기', this.x + this.width / 2, instructionY);
    }
}