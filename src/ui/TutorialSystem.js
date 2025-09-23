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

        // 레트로 스타일 반투명 배경 + 스캔라인 효과
        this.drawRetroBackground();

        // 레트로 스타일 튜토리얼 박스 (크기 증가)
        const boxWidth = 600;
        const boxHeight = 300;
        const boxX = (this.canvas.width - boxWidth) / 2;
        const boxY = (this.canvas.height - boxHeight) / 2;

        // 레트로 박스 드로잉
        this.drawRetroBox(boxX, boxY, boxWidth, boxHeight);

        // 레트로 스타일 제목
        this.drawRetroTitle(step.title, boxX + boxWidth/2, boxY + 45);

        // 레트로 스타일 설명 텍스트
        this.drawRetroDescription(step.description, boxX, boxY, boxWidth);

        // 레트로 스타일 키 하이라이트
        if (step.highlight) {
            this.drawRetroKeyHighlight(step, boxX, boxY, boxWidth);
        }

        // 레트로 스타일 진행 상태 및 버튼
        this.drawRetroProgressAndButton(step, boxX, boxY, boxWidth, boxHeight);
    }

    // 레트로 스타일 배경 그리기 (밝기 개선)
    drawRetroBackground() {
        // CRT 모니터 스타일 배경 (덜 어둡게)
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 90년대 CRT 모니터 스캔라인 효과
        for (let y = 0; y < this.canvas.height; y += 4) {
            this.ctx.fillStyle = 'rgba(0, 100, 0, 0.08)';
            this.ctx.fillRect(0, y, this.canvas.width, 2);
        }

        // 깜빡이는 그리드 효과 (더 밝게)
        const time = Date.now() * 0.001;
        for (let x = 0; x < this.canvas.width; x += 60) {
            for (let y = 0; y < this.canvas.height; y += 60) {
                const alpha = 0.15 + 0.1 * Math.sin(time + x * 0.01 + y * 0.01);
                this.ctx.fillStyle = `rgba(0, 255, 150, ${alpha})`;
                this.ctx.fillRect(x, y, 2, 2);
            }
        }
    }

    // 레트로 박스 그리기 (도스/윈도우 95 스타일, 밝기 개선)
    drawRetroBox(x, y, width, height) {
        // 메인 박스 배경 (더 밝은 그라데이션 효과)
        const gradient = this.ctx.createLinearGradient(x, y, x, y + height);
        gradient.addColorStop(0, 'rgba(60, 60, 80, 0.96)');
        gradient.addColorStop(0.5, 'rgba(45, 45, 65, 0.96)');
        gradient.addColorStop(1, 'rgba(35, 35, 55, 0.96)');

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(x, y, width, height);

        // 윈도우 95 스타일 3D 테두리 효과
        // 상단과 좌측 밝은 테두리 (볼록 효과)
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y + height);
        this.ctx.lineTo(x, y);
        this.ctx.lineTo(x + width, y);
        this.ctx.stroke();

        // 하단과 우측 어두운 테두리 (볼록 효과)
        this.ctx.strokeStyle = '#666666';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(x + width, y);
        this.ctx.lineTo(x + width, y + height);
        this.ctx.lineTo(x, y + height);
        this.ctx.stroke();

        // 메인 테두리 (골드 컬러로 휴넷 브랜딩)
        this.ctx.strokeStyle = '#FFD700';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(x + 3, y + 3, width - 6, height - 6);

        // 깜빡이는 코너 장식
        const time = Date.now() * 0.003;
        const cornerAlpha = 0.7 + 0.3 * Math.sin(time);
        this.ctx.fillStyle = `rgba(255, 215, 0, ${cornerAlpha})`;

        // 코너 장식 점들
        const cornerSize = 6;
        this.ctx.fillRect(x + 8, y + 8, cornerSize, cornerSize);
        this.ctx.fillRect(x + width - 14, y + 8, cornerSize, cornerSize);
        this.ctx.fillRect(x + 8, y + height - 14, cornerSize, cornerSize);
        this.ctx.fillRect(x + width - 14, y + height - 14, cornerSize, cornerSize);
    }

    // 레트로 제목 그리기
    drawRetroTitle(title, centerX, y) {
        // 픽셀 폰트 스타일
        this.ctx.font = 'bold 20px "Courier New", monospace';
        this.ctx.textAlign = 'center';

        // 그림자 효과 (깊이감)
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillText(title, centerX + 2, y + 2);

        // 메인 텍스트 (골드 그라데이션 느낌)
        this.ctx.fillStyle = '#FFD700';
        this.ctx.fillText(title, centerX, y);

        // 깜빡이는 강조 효과
        const time = Date.now() * 0.004;
        const glowAlpha = 0.3 + 0.2 * Math.sin(time);
        this.ctx.shadowColor = '#FFD700';
        this.ctx.shadowBlur = 10;
        this.ctx.globalAlpha = glowAlpha;
        this.ctx.fillText(title, centerX, y);

        // 효과 리셋
        this.ctx.shadowBlur = 0;
        this.ctx.globalAlpha = 1;
    }

    // 레트로 설명 텍스트 그리기 (간격 개선)
    drawRetroDescription(description, boxX, boxY, boxWidth) {
        this.ctx.font = '16px "Courier New", monospace';
        this.ctx.textAlign = 'center';

        const lines = description.split('\n');
        lines.forEach((line, index) => {
            const textY = boxY + 90 + (index * 26); // 간격 증가

            // 텍스트 그림자
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            this.ctx.fillText(line, boxX + boxWidth/2 + 1, textY + 1);

            // 메인 텍스트 (더 밝은 그린)
            this.ctx.fillStyle = '#33FFAA';
            this.ctx.fillText(line, boxX + boxWidth/2, textY);
        });
    }

    // 레트로 키 하이라이트 그리기 (위치 조정)
    drawRetroKeyHighlight(step, boxX, boxY, boxWidth) {
        const keyBoxWidth = 100;
        const keyBoxHeight = 50;
        const keyBoxX = boxX + boxWidth/2 - keyBoxWidth/2;
        const keyBoxY = boxY + 180; // 위치 하향 조정

        // 애니메이션 효과
        const time = Date.now() * 0.005;
        const pulseScale = 1 + 0.1 * Math.sin(time);
        const glowIntensity = step.completed ? 1.0 : 0.6 + 0.4 * Math.sin(time);

        this.ctx.save();
        this.ctx.translate(keyBoxX + keyBoxWidth/2, keyBoxY + keyBoxHeight/2);
        this.ctx.scale(pulseScale, pulseScale);
        this.ctx.translate(-keyBoxWidth/2, -keyBoxHeight/2);

        if (step.completed) {
            // 완료된 상태 - 성공 색상
            this.drawRetroKeyBox('#00AA00', '#00FF00', '✓ ' + step.highlight.key, '#FFFFFF');
        } else {
            // 대기 상태 - 주의 색상
            this.drawRetroKeyBox('#FF6600', '#FFAA00', step.highlight.key, '#000000');
        }

        this.ctx.restore();

        // 글로우 효과
        this.ctx.shadowColor = step.completed ? '#00FF00' : '#FFAA00';
        this.ctx.shadowBlur = 15 * glowIntensity;
        this.ctx.globalAlpha = glowIntensity;

        this.ctx.fillStyle = step.completed ? '#00AA00' : '#FF6600';
        this.ctx.fillRect(keyBoxX, keyBoxY, keyBoxWidth, keyBoxHeight);

        this.ctx.shadowBlur = 0;
        this.ctx.globalAlpha = 1;
    }

    // 키박스 그리기 헬퍼
    drawRetroKeyBox(fillColor, borderColor, text, textColor) {
        const width = 100;
        const height = 50;

        // 3D 키보드 키 효과
        this.ctx.fillStyle = fillColor;
        this.ctx.fillRect(0, 0, width, height);

        // 키 테두리 (3D 효과)
        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(0, height);
        this.ctx.lineTo(0, 0);
        this.ctx.lineTo(width, 0);
        this.ctx.stroke();

        this.ctx.strokeStyle = '#666666';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(width, 0);
        this.ctx.lineTo(width, height);
        this.ctx.lineTo(0, height);
        this.ctx.stroke();

        // 메인 테두리
        this.ctx.strokeStyle = borderColor;
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(2, 2, width - 4, height - 4);

        // 키 텍스트
        this.ctx.fillStyle = textColor;
        this.ctx.font = 'bold 18px "Courier New", monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(text, width/2, height/2 + 6);
    }

    // 레트로 진행상태 및 버튼 그리기
    drawRetroProgressAndButton(step, boxX, boxY, boxWidth, boxHeight) {
        // 진행 상태 (도트 매트릭스 스타일)
        this.ctx.fillStyle = '#00FF88';
        this.ctx.font = 'bold 14px "Courier New", monospace';
        this.ctx.textAlign = 'center';

        const progressText = `STEP ${this.currentStep + 1} OF ${this.steps.length}`;
        this.ctx.fillText(progressText, boxX + boxWidth/2, boxY + boxHeight - 45);

        // 진행 바 (픽셀 스타일)
        const progressBarWidth = 200;
        const progressBarHeight = 8;
        const progressBarX = boxX + boxWidth/2 - progressBarWidth/2;
        const progressBarY = boxY + boxHeight - 35;

        // 진행 바 배경
        this.ctx.fillStyle = '#333333';
        this.ctx.fillRect(progressBarX, progressBarY, progressBarWidth, progressBarHeight);

        // 진행 바 채우기
        const fillWidth = (progressBarWidth * (this.currentStep + 1)) / this.steps.length;
        this.ctx.fillStyle = '#00FF88';
        this.ctx.fillRect(progressBarX, progressBarY, fillWidth, progressBarHeight);

        // 진행 바 테두리
        this.ctx.strokeStyle = '#FFD700';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(progressBarX, progressBarY, progressBarWidth, progressBarHeight);

        // Space 키 안내 (레트로 스타일, 간격 개선)
        const canProceed = step.action === "시작하기" || step.action === "완료" || step.completed;
        if (canProceed) {
            const time = Date.now() * 0.008;
            const blinkAlpha = 0.8 + 0.2 * Math.sin(time);

            // 배경 박스 추가 (가독성 향상)
            const textBoxWidth = 420;
            const textBoxHeight = 25;
            const textBoxX = boxX + boxWidth/2 - textBoxWidth/2;
            const textBoxY = boxY + boxHeight - 35;

            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
            this.ctx.fillRect(textBoxX, textBoxY, textBoxWidth, textBoxHeight);

            this.ctx.strokeStyle = '#FFD700';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(textBoxX, textBoxY, textBoxWidth, textBoxHeight);

            // 텍스트
            this.ctx.fillStyle = `rgba(255, 255, 100, ${blinkAlpha})`;
            this.ctx.font = 'bold 15px "Courier New", monospace';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('>>> PRESS [SPACE] TO CONTINUE <<<', boxX + boxWidth/2, boxY + boxHeight - 18);
        }
    }

    handleKeyPress(key, questSystemVisible, inventoryVisible, minimapVisible) {
        if (!this.isActive) return false;

        const step = this.steps[this.currentStep];
        if (!step) return false;


        // 각 단계별 조건 체크 (한글 키보드 지원)
        switch(step.action) {
            case "press_Q":
                if ((key === 'q' || key === 'Q' || key === 'ㅂ' || key === 'ㅃ')) {
                    if (questSystemVisible) {
                        step.completed = true;
                        return true;
                    }
                }
                break;
            case "press_I":
                if ((key === 'i' || key === 'I' || key === 'ㅑ' || key === 'ㅣ')) {
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
        if (this.onComplete) {
            this.onComplete();
        }
    }

    setOnComplete(callback) {
        this.onComplete = callback;
    }

    skip() {
        this.complete();
    }

    isVisible() {
        return this.isActive;
    }
}