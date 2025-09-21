export class QuestUI {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.currentTab = 'main'; // 메인 퀘스트만 사용
        this.selectedQuestIndex = 0;
        this.scrollOffset = 0;
    }

    draw(questSystem, gameState) {
        if (!questSystem.showQuestUI) return;

        const currentQuest = questSystem.getCurrentQuest();
        const activeSubQuests = questSystem.getAvailableSubQuests().filter(q => q.progress > 0 && !q.completed);

        // UI 크기 설정 - 화면 중앙에 배치
        const uiWidth = 500;
        const uiHeight = 450;
        const uiX = (this.canvas.width - uiWidth) / 2;
        const uiY = (this.canvas.height - uiHeight) / 2;

        // 전체 화면 오버레이 (반투명)
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 퀘스트창 배경
        this.ctx.fillStyle = 'rgba(20, 30, 50, 0.95)';
        this.ctx.fillRect(uiX, uiY, uiWidth, uiHeight);

        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(uiX, uiY, uiWidth, uiHeight);

        // 제목
        this.ctx.fillStyle = '#ffff00';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('📋 휴넷 26주년 퀘스트 로그', uiX + uiWidth/2, uiY + 40);

        // 메인 퀘스트만 표시
        this.drawMainQuestTab(questSystem, gameState, uiX, uiY + 50, uiWidth, uiHeight - 120);

        // 조작법 안내
        this.drawControls(uiX, uiY + uiHeight - 70, uiWidth);
    }

    drawTabs(uiX, uiY, uiWidth) {
        const tabWidth = 120;
        const tabHeight = 30;
        const tabY = uiY + 45;

        // 메인 퀘스트 탭
        const mainTabX = uiX + 20;
        this.ctx.fillStyle = this.currentTab === 'main' ? 'rgba(255, 255, 0, 0.3)' : 'rgba(100, 100, 100, 0.3)';
        this.ctx.fillRect(mainTabX, tabY, tabWidth, tabHeight);

        this.ctx.strokeStyle = this.currentTab === 'main' ? '#ffff00' : '#666666';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(mainTabX, tabY, tabWidth, tabHeight);

        this.ctx.fillStyle = this.currentTab === 'main' ? '#ffff00' : '#cccccc';
        this.ctx.font = 'bold 14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('메인 퀘스트', mainTabX + tabWidth/2, tabY + 20);

        // 서브 퀘스트 탭
        const subTabX = mainTabX + tabWidth + 10;
        this.ctx.fillStyle = this.currentTab === 'sub' ? 'rgba(135, 206, 235, 0.3)' : 'rgba(100, 100, 100, 0.3)';
        this.ctx.fillRect(subTabX, tabY, tabWidth, tabHeight);

        this.ctx.strokeStyle = this.currentTab === 'sub' ? '#87CEEB' : '#666666';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(subTabX, tabY, tabWidth, tabHeight);

        this.ctx.fillStyle = this.currentTab === 'sub' ? '#87CEEB' : '#cccccc';
        this.ctx.font = 'bold 14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('서브 퀘스트', subTabX + tabWidth/2, tabY + 20);
    }

    drawMainQuestTab(questSystem, gameState, x, y, width, height) {
        const currentQuest = questSystem.getCurrentQuest();

        if (!currentQuest) {
            this.ctx.fillStyle = '#cccccc';
            this.ctx.font = '16px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('현재 진행 중인 메인 퀘스트가 없습니다.', x + width/2, y + height/2);
            return;
        }

        let currentY = y + 30;

        // 퀘스트 제목
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 18px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(currentQuest.title, x + 20, currentY);

        currentY += 30;

        // 퀘스트 설명
        this.ctx.fillStyle = '#cccccc';
        this.ctx.font = '14px Arial';
        this.drawWrappedText(currentQuest.description, x + 20, currentY, width - 40, 18);

        currentY += 60;

        // 진행도
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.fillText(`진행도: ${currentQuest.progress}/${currentQuest.maxProgress}`, x + 20, currentY);

        currentY += 30;

        // 진행도 바
        const progressBarWidth = width - 40;
        const progressBarHeight = 20;

        this.ctx.fillStyle = '#333333';
        this.ctx.fillRect(x + 20, currentY, progressBarWidth, progressBarHeight);

        const progressPercent = currentQuest.progress / currentQuest.maxProgress;
        this.ctx.fillStyle = '#00ff00';
        this.ctx.fillRect(x + 20, currentY, progressBarWidth * progressPercent, progressBarHeight);

        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x + 20, currentY, progressBarWidth, progressBarHeight);

        // 진행률 텍스트
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`${Math.round(progressPercent * 100)}%`, x + 20 + progressBarWidth/2, currentY + 14);

        currentY += 25;

        // 수집 상황 요약 표시
        if (currentQuest.requiredItem || currentQuest.requiredItems) {
            const requiredItems = currentQuest.requiredItems || [currentQuest.requiredItem];
            const playerInventory = gameState?.collectedItems || [];


            const collectedCount = requiredItems.filter(item =>
                playerInventory.some(invItem => invItem.name === item)
            ).length;

            this.ctx.fillStyle = '#87CEEB';
            this.ctx.font = 'bold 12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(`아이템 수집: ${collectedCount}/${requiredItems.length}`, x + 20 + progressBarWidth/2, currentY + 14);
        }

        currentY += 25;

        // 필요 아이템
        if (currentQuest.requiredItem || currentQuest.requiredItems) {
            this.ctx.fillStyle = '#ffaa00';
            this.ctx.font = 'bold 14px Arial';
            this.ctx.textAlign = 'left';
            this.ctx.fillText('필요 아이템:', x + 20, currentY);

            currentY += 20;

            const requiredItems = currentQuest.requiredItems || [currentQuest.requiredItem];
            requiredItems.forEach(item => {
                if (item) {
                    // 플레이어 인벤토리에서 아이템 보유 여부 확인
                    const playerInventory = gameState?.collectedItems || [];
                    const hasItem = playerInventory.some(invItem => invItem.name === item);

                    // 아이템 보유 상태에 따른 색상 설정
                    if (hasItem) {
                        this.ctx.fillStyle = '#00ff00'; // 초록색 - 수집 완료
                        this.ctx.font = 'bold 12px Arial';
                        this.ctx.fillText(`✅ ${item}`, x + 30, currentY);
                    } else {
                        this.ctx.fillStyle = '#ffccaa'; // 주황색 - 미수집
                        this.ctx.font = '12px Arial';
                        this.ctx.fillText(`❌ ${item}`, x + 30, currentY);
                    }
                    currentY += 16;
                }
            });
        }
    }

    drawSubQuestTab(questSystem, x, y, width, height) {
        const allSubQuests = questSystem.getAllSubQuests();
        const availableSubQuests = allSubQuests.filter(q => q.progress > 0 || !q.completed);

        if (availableSubQuests.length === 0) {
            this.ctx.fillStyle = '#cccccc';
            this.ctx.font = '16px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('진행 중인 서브퀘스트가 없습니다.', x + width/2, y + height/2);
            return;
        }

        let currentY = y + 20;
        const itemHeight = 50;
        const maxVisible = Math.floor((height - 60) / itemHeight);

        // 서브퀘스트 리스트
        for (let i = this.scrollOffset; i < Math.min(availableSubQuests.length, this.scrollOffset + maxVisible); i++) {
            const quest = availableSubQuests[i];
            const isSelected = (i - this.scrollOffset) === this.selectedQuestIndex;

            // 배경 (선택된 항목)
            if (isSelected) {
                this.ctx.fillStyle = 'rgba(135, 206, 235, 0.3)';
                this.ctx.fillRect(x + 10, currentY - 5, width - 20, itemHeight);
            }

            // 상태 아이콘
            let statusIcon = '';
            let statusColor = '#cccccc';

            if (quest.completed) {
                statusIcon = '✅';
                statusColor = '#00ff00';
            } else if (quest.progress > 0) {
                statusIcon = '🔄';
                statusColor = '#ffaa00';
            } else {
                statusIcon = '📋';
                statusColor = '#cccccc';
            }

            this.ctx.fillStyle = statusColor;
            this.ctx.font = '16px Arial';
            this.ctx.textAlign = 'left';
            this.ctx.fillText(statusIcon, x + 20, currentY + 20);

            // 퀘스트 제목
            this.ctx.fillStyle = isSelected ? '#ffffff' : '#cccccc';
            this.ctx.font = isSelected ? 'bold 14px Arial' : '14px Arial';
            this.ctx.fillText(quest.title, x + 50, currentY + 15);

            // 진행도
            this.ctx.fillStyle = '#aaaaaa';
            this.ctx.font = '12px Arial';
            this.ctx.fillText(`(${quest.progress}/${quest.maxProgress})`, x + 50, currentY + 32);

            // 카테고리
            if (quest.category) {
                this.ctx.fillStyle = '#666666';
                this.ctx.font = '10px Arial';
                this.ctx.textAlign = 'right';
                this.ctx.fillText(quest.category, x + width - 30, currentY + 20);
            }

            currentY += itemHeight;
        }

        // 선택된 퀘스트 상세 정보 (우측)
        if (this.selectedQuestIndex >= 0 && this.selectedQuestIndex < availableSubQuests.length) {
            const selectedQuest = availableSubQuests[this.scrollOffset + this.selectedQuestIndex];
            this.drawSelectedQuestDetails(selectedQuest, x + width - 180, y + 20, 160, height - 60);
        }
    }

    drawSelectedQuestDetails(quest, x, y, width, height) {
        // 배경
        this.ctx.fillStyle = 'rgba(50, 50, 50, 0.8)';
        this.ctx.fillRect(x, y, width, height);

        this.ctx.strokeStyle = '#87CEEB';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x, y, width, height);

        let currentY = y + 20;

        // 제목
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.font = 'bold 12px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(quest.title, x + 10, currentY);

        currentY += 25;

        // 설명
        this.ctx.fillStyle = '#cccccc';
        this.ctx.font = '10px Arial';
        this.drawWrappedText(quest.description, x + 10, currentY, width - 20, 12);

        currentY += 50;

        // 현재 단계
        if (quest.steps && quest.progress < quest.steps.length && quest.progress > 0) {
            const currentStep = quest.steps[quest.progress];
            this.ctx.fillStyle = '#ffaa00';
            this.ctx.font = 'bold 10px Arial';
            this.ctx.fillText('현재 단계:', x + 10, currentY);

            currentY += 15;

            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '9px Arial';
            this.drawWrappedText(currentStep.description, x + 10, currentY, width - 20, 11);
        }
    }

    drawWrappedText(text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';
        let currentY = y;

        for (let word of words) {
            const testLine = line + word + ' ';
            const metrics = this.ctx.measureText(testLine);

            if (metrics.width > maxWidth && line !== '') {
                this.ctx.fillText(line, x, currentY);
                line = word + ' ';
                currentY += lineHeight;
            } else {
                line = testLine;
            }
        }
        this.ctx.fillText(line, x, currentY);
        return currentY;
    }

    drawControls(x, y, width) {
        // 배경 구분선
        this.ctx.strokeStyle = '#555555';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(x + 20, y);
        this.ctx.lineTo(x + width - 20, y);
        this.ctx.stroke();

        // 조작법 제목
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 14px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('🎮 조작법', x + 20, y + 20);

        // 조작법 내용
        this.ctx.fillStyle = '#e0e0e0';
        this.ctx.font = '12px Arial';

        const controls = [
            '[Q] 또는 [ㅂ] 퀘스트창 닫기',
            '퀘스트 확인 후 [Q] 또는 [ㅂ]를 눌러서',
            '닫으면 게임을 계속하세요!',
            '💡 퀘스트창을 닫아야 움직일 수 있습니다'
        ];

        let startX = x + 30;
        let currentX = startX;
        const spacing = 110;

        controls.forEach((control, index) => {
            if (index === 2) {
                // 두 번째 줄 시작
                currentX = startX;
                this.ctx.fillText(control, currentX, y + 50);
                currentX += spacing;
            } else if (index === 3) {
                // 마지막 안내 메시지는 강조해서 표시
                this.ctx.fillStyle = '#ffff00';
                this.ctx.font = 'bold 12px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(control, x + width/2, y + 65);
                this.ctx.fillStyle = '#e0e0e0'; // 색상 원복
                this.ctx.font = '12px Arial';
                this.ctx.textAlign = 'left';
            } else {
                this.ctx.fillText(control, currentX, y + 35);
                currentX += spacing;
            }
        });
    }

    // 키 입력 처리 (서브퀘스트 제거로 단순화)
    handleKeyPress(key) {
        // 메인 퀘스트만 사용하므로 특별한 키 처리 불필요
        // 방향키와 숫자키는 이제 게임 내 이동에 사용됨
    }
};