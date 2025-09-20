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

        // 버튼 설정
        this.buttonWidth = 70;
        this.buttonHeight = 50;
        this.buttonSpacing = 15;

        // 동적 크기 계산 (나중에 calculateDimensions에서 설정됨)
        this.width = 0;
        this.height = 0;
        this.x = 0;
        this.y = 0;
    }

    show(currentFloor = 1) {
        this.isVisible = true;
        this.currentFloor = currentFloor;

        // 모든 층을 표시 (현재 층 포함)
        this.availableFloors = [...CONSTANTS.ELEVATOR_FLOORS];

        // 현재 층이 아닌 첫 번째 층을 선택
        this.selectedFloor = this.availableFloors.find(floor => floor !== currentFloor) || this.availableFloors[0];

        // 화면에 맞게 UI 크기 계산
        this.calculateDimensions();

        if (this.audioManager) {
            this.audioManager.playUIClick();
        }
    }

    calculateDimensions() {
        // 버튼 개수에 따른 너비 계산
        const totalButtonWidth = this.availableFloors.length * this.buttonWidth +
                                (this.availableFloors.length - 1) * this.buttonSpacing;

        // 패딩을 포함한 전체 너비
        this.width = Math.max(400, totalButtonWidth + 100);
        this.height = 250;

        // 화면을 벗어나지 않도록 위치 조정
        this.x = Math.max(20, (this.canvas.width - this.width) / 2);
        this.y = Math.max(20, this.canvas.height - this.height - 50);

        // 화면 우측을 벗어나는 경우 조정
        if (this.x + this.width > this.canvas.width - 20) {
            this.x = this.canvas.width - this.width - 20;
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
        } else if (event.key.toLowerCase() === 'r') {
            if (this.availableFloors.includes('R')) {
                this.selectedFloor = 'R';
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

        // 버튼 클릭 확인 (새로운 중앙 정렬된 위치 기준)
        const totalButtonWidth = this.availableFloors.length * this.buttonWidth +
                                (this.availableFloors.length - 1) * this.buttonSpacing;
        const startX = this.x + (this.width - totalButtonWidth) / 2;

        for (let index = 0; index < this.availableFloors.length; index++) {
            const floor = this.availableFloors[index];
            const buttonX = startX + index * (this.buttonWidth + this.buttonSpacing);
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
        // 현재 층과 같은 층을 선택했을 때는 아무것도 하지 않음
        if (this.selectedFloor === this.currentFloor) {
            if (this.audioManager) {
                this.audioManager.playMenuMove(); // 에러 사운드 대신 일반 메뉴 사운드
            }
            return null;
        }

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
        const currentFloorText = this.currentFloor === 'R' ? '현재 위치: 옥상' : `현재 위치: ${this.currentFloor}층`;
        this.ctx.fillText(currentFloorText, this.x + this.width / 2, this.y + 70);
    }

    drawFloorButtons() {
        // 버튼들이 중앙에 오도록 시작 위치 계산
        const totalButtonWidth = this.availableFloors.length * this.buttonWidth +
                                (this.availableFloors.length - 1) * this.buttonSpacing;
        const startX = this.x + (this.width - totalButtonWidth) / 2;

        this.availableFloors.forEach((floor, index) => {
            const buttonX = startX + index * (this.buttonWidth + this.buttonSpacing);
            const buttonY = this.y + 100;
            const isSelected = floor === this.selectedFloor;
            const isCurrent = floor === this.currentFloor;

            // 버튼 배경
            if (isCurrent) {
                // 현재 층 - 비활성화 상태
                this.ctx.fillStyle = 'rgba(60, 60, 60, 0.6)';
            } else if (isSelected) {
                // 선택된 층
                this.ctx.fillStyle = '#FFD700';
            } else {
                // 일반 층
                this.ctx.fillStyle = 'rgba(100, 100, 100, 0.8)';
            }

            this.ctx.fillRect(buttonX, buttonY, this.buttonWidth, this.buttonHeight);

            // 버튼 테두리
            if (isCurrent) {
                this.ctx.strokeStyle = '#888888';
            } else if (isSelected) {
                this.ctx.strokeStyle = '#FF6B35';
            } else {
                this.ctx.strokeStyle = '#CCCCCC';
            }
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(buttonX, buttonY, this.buttonWidth, this.buttonHeight);

            // 현재 층 표시
            if (isCurrent) {
                this.ctx.fillStyle = '#00FF00';
                this.ctx.font = 'bold 12px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText('현재', buttonX + this.buttonWidth / 2, buttonY - 5);
            }

            // 버튼 텍스트
            if (isCurrent) {
                this.ctx.fillStyle = '#AAAAAA';
            } else if (isSelected) {
                this.ctx.fillStyle = '#000000';
            } else {
                this.ctx.fillStyle = '#FFFFFF';
            }

            this.ctx.font = 'bold 16px Arial';
            this.ctx.textAlign = 'center';
            const floorText = floor === 'R' ? '옥상' : `${floor}F`;
            this.ctx.fillText(floorText, buttonX + this.buttonWidth / 2, buttonY + this.buttonHeight / 2 + 5);
        });
    }

    drawInstructions() {
        const instructionY = this.y + this.height - 30;

        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('←→: 선택 | Enter/Space: 이동 | 숫자키/R키: 직접 선택 | ESC: 닫기', this.x + this.width / 2, instructionY);
    }
}