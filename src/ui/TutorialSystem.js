export class TutorialSystem {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.isActive = false;
        this.currentStep = 0;
        this.steps = [
            {
                title: "🎮 휴넷 26주년 게임에 오신 것을 환영합니다!",
                description: "이 게임의 기본 조작법과 UI를 알아보겠습니다.",
                highlight: null,
                action: "시작하기"
            },
            {
                title: "📋 퀘스트 시스템",
                description: "[Q] 또는 [ㅂ] 키를 눌러서 퀘스트 창을 열어보세요!\n메인 퀘스트와 서브 퀘스트를 확인할 수 있습니다.",
                highlight: { key: "Q", description: "퀘스트 창 열기" },
                action: "press_Q",
                completed: false
            },
            {
                title: "🎒 인벤토리 시스템",
                description: "[I] 또는 [ㅑ] 키를 눌러서 인벤토리를 열어보세요!\n수집한 아이템들을 확인할 수 있습니다.",
                highlight: { key: "I", description: "인벤토리 열기" },
                action: "press_I",
                completed: false
            },
            {
                title: "🗺️ 미니맵",
                description: "[M] 또는 [ㅡ] 키를 눌러서 미니맵을 열어보세요!\n현재 위치와 층 구조를 파악할 수 있습니다.",
                highlight: { key: "M", description: "미니맵 열기" },
                action: "press_M",
                completed: false
            },
            {
                title: "🎯 튜토리얼 완료!",
                description: "이제 게임을 즐길 준비가 되었습니다!\n방향키로 이동하며 휴넷 26주년을 축하해보세요!",
                highlight: null,
                action: "완료"
            }
        ];
        this.playerHasMoved = false;
        this.playerHasInteracted = false;
    }

    start() {
        this.isActive = true;
        this.currentStep = 0;
        this.resetProgress();
    }

    resetProgress() {
        this.playerHasMoved = false;
        this.playerHasInteracted = false;
        this.steps.forEach(step => {
            if (step.completed !== undefined) {
                step.completed = false;
            }
        });
    }

    draw() {
        if (!this.isActive) {
            return;
        }

        const step = this.steps[this.currentStep];
        if (!step) {
            return;
        }


        // 반투명 배경 전체
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 튜토리얼 박스
        const boxWidth = 500;
        const boxHeight = 200;
        const boxX = (this.canvas.width - boxWidth) / 2;
        const boxY = (this.canvas.height - boxHeight) / 2;

        // 튜토리얼 박스 배경
        this.ctx.fillStyle = 'rgba(20, 20, 40, 0.95)';
        this.ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

        // 테두리
        this.ctx.strokeStyle = '#00aaff';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

        // 제목
        this.ctx.fillStyle = '#00aaff';
        this.ctx.font = 'bold 18px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(step.title, boxX + boxWidth/2, boxY + 40);

        // 설명
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'center';

        const lines = step.description.split('\n');
        lines.forEach((line, index) => {
            this.ctx.fillText(line, boxX + boxWidth/2, boxY + 70 + (index * 20));
        });

        // 하이라이트된 키 표시
        if (step.highlight) {
            const keyBoxWidth = 80;
            const keyBoxHeight = 40;
            const keyBoxX = boxX + boxWidth/2 - keyBoxWidth/2;
            const keyBoxY = boxY + 120;

            // 키 박스 (애니메이션 효과)
            const pulseAlpha = step.completed ? 1.0 : 0.7 + 0.3 * Math.sin(Date.now() * 0.005);
            this.ctx.fillStyle = step.completed ? '#00aa00' : `rgba(255, 170, 0, ${pulseAlpha})`;
            this.ctx.fillRect(keyBoxX, keyBoxY, keyBoxWidth, keyBoxHeight);

            this.ctx.strokeStyle = step.completed ? '#00ff00' : '#ffffff';
            this.ctx.lineWidth = step.completed ? 3 : 2;
            this.ctx.strokeRect(keyBoxX, keyBoxY, keyBoxWidth, keyBoxHeight);

            // 키 텍스트
            this.ctx.fillStyle = step.completed ? '#ffffff' : '#000000';
            this.ctx.font = 'bold 16px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(step.highlight.key, keyBoxX + keyBoxWidth/2, keyBoxY + 25);

            // 완료 체크 아이콘
            if (step.completed) {
                this.ctx.fillStyle = '#ffffff';
                this.ctx.font = '20px Arial';
                this.ctx.fillText('✓', keyBoxX + keyBoxWidth + 10, keyBoxY + 25);
            }
        }

        // 진행 상태
        this.ctx.fillStyle = '#cccccc';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`${this.currentStep + 1} / ${this.steps.length}`, boxX + boxWidth/2, boxY + boxHeight - 15);

        // 버튼
        const buttonText = step.completed ? "다음 ➤" : (step.action === "시작하기" || step.action === "완료" ? step.action : "키를 눌러주세요");
        const buttonWidth = 120;
        const buttonHeight = 30;
        const buttonX = boxX + boxWidth - buttonWidth - 20;
        const buttonY = boxY + boxHeight - 50;

        const canProceed = step.action === "시작하기" || step.action === "완료" || step.completed;

        this.ctx.fillStyle = canProceed ? '#00aa00' : '#666666';
        this.ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);

        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(buttonText, buttonX + buttonWidth/2, buttonY + 20);

        // Space 키 안내 (넘어갈 수 있을 때만 표시)
        if (canProceed) {
            this.ctx.fillStyle = '#ffff00';
            this.ctx.font = 'bold 14px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('[Space] 키를 눌러 계속하기', boxX + boxWidth/2, buttonY - 10);
        }
    }

    handleKeyPress(key, questSystemVisible, inventoryVisible, minimapVisible) {
        if (!this.isActive) return false;

        const step = this.steps[this.currentStep];
        if (!step) return false;


        // 각 단계별 조건 체크 (한글 키보드 지원)
        switch(step.action) {
            case "press_Q":
                if ((key === 'q' || key === 'Q' || key === 'ㅂ')) {
                    if (questSystemVisible) {
                        step.completed = true;
                        return true;
                    }
                }
                break;
            case "press_I":
                if ((key === 'i' || key === 'I' || key === 'ㅑ')) {
                    if (inventoryVisible) {
                        step.completed = true;
                        return true;
                    }
                }
                break;
            case "press_M":
                if ((key === 'm' || key === 'M' || key === 'ㅡ')) {
                    if (minimapVisible) {
                        step.completed = true;
                        return true;
                    }
                }
                break;
        }

        // 다음 단계로 진행 (Enter 또는 Space)
        if ((key === 'Enter' || key === ' ') && (step.completed || step.action === "시작하기" || step.action === "완료")) {
            this.nextStep();
            return true;
        }

        return false;
    }

    handleMovement() {
        if (!this.isActive) return;
        // 캐릭터 이동 단계가 제거되었으므로 특별한 처리 불필요
    }

    handleInteraction() {
        if (!this.isActive) return;

        const step = this.steps[this.currentStep];
        if (step && (step.action === "interact" || step.action === "talk_npc")) {
            this.playerHasInteracted = true;
            step.completed = true;
        }
    }

    nextStep() {
        this.currentStep++;
        if (this.currentStep >= this.steps.length) {
            this.complete();
        }
    }

    complete() {
        this.isActive = false;
        this.currentStep = 0;
        // 게임에 튜토리얼 완료 알림
    }

    skip() {
        this.complete();
    }

    isVisible() {
        return this.isActive;
    }
}