// UI 렌더링 전용 클래스
export class GameUIRenderer {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
    }

    // 게임 조작 안내 그리기
    drawGameInstructions(debugMode, konamiActivated) {
        const instructionY = this.canvas.height - 30;

        // 반투명 배경
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        this.ctx.fillRect(0, instructionY - 20, this.canvas.width, 40);

        // 안내 텍스트
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'center';

        let message = '방향키: 이동 | 스페이스: 상호작용 | I: 인벤토리 | Q: 퀘스트 | M: 미니맵 | ESC: 메뉴';

        // 디버그 모드일 때 추가 안내
        if (debugMode) {
            message += ' | H: 숨겨진 메시지 | D: 디버그';
        }

        // 코나미 코드 활성화 시 다른 메시지
        if (konamiActivated) {
            message = '🌟 무적 모드 활성화! 벽을 통과할 수 있습니다! 🌟';
            this.ctx.fillStyle = 'rgba(255, 215, 0, 0.9)';
        }

        this.ctx.fillText(message, this.canvas.width / 2, instructionY);
    }

    // 상호작용 힌트 그리기
    drawInteractionHint(nearbyNPC, nearbyElevator, nearbyPortal, nearbyObject) {
        let message = '';
        let icon = '';

        if (nearbyNPC) {
            message = `${nearbyNPC.name}과(와) 대화하기`;
            icon = '💬';
        } else if (nearbyElevator) {
            message = '엘리베이터 - 층 선택하기';
            icon = '🛗';
        } else if (nearbyPortal) {
            message = `${nearbyPortal.name}(으)로 이동하기`;
            icon = '🚪';
        } else if (nearbyObject) {
            message = nearbyObject.getHintText();
            // 오브젝트 타입에 따른 아이콘
            switch (nearbyObject.type) {
                case 'vending_machine':
                    icon = nearbyObject.machineType === 'drink' ? '🥤' : '🍫';
                    break;
                case 'computer':
                    icon = '💻';
                    break;
                case 'printer':
                    icon = '🖨️';
                    break;
                default:
                    icon = '📦';
            }
        }

        if (message) {
            // 메시지 박스 크기 계산
            this.ctx.font = 'bold 18px Arial';
            const textWidth = this.ctx.measureText(message).width + 60;
            const boxHeight = 50;
            const boxX = this.canvas.width/2 - textWidth/2;
            const boxY = this.canvas.height - 120;

            // 그림자 효과
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            this.ctx.fillRect(boxX + 3, boxY + 3, textWidth, boxHeight);

            // 메인 박스 배경
            this.ctx.fillStyle = 'rgba(25, 25, 60, 0.95)';
            this.ctx.fillRect(boxX, boxY, textWidth, boxHeight);

            // 황금색 테두리
            this.ctx.strokeStyle = '#FFD700';
            this.ctx.lineWidth = 3;
            this.ctx.strokeRect(boxX, boxY, textWidth, boxHeight);

            // 반짝이는 내부 테두리
            const sparkle = Math.sin(Date.now() * 0.008) * 0.3 + 0.7;
            this.ctx.strokeStyle = `rgba(255, 255, 255, ${sparkle})`;
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(boxX + 2, boxY + 2, textWidth - 4, boxHeight - 4);

            // 아이콘과 메시지
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.font = 'bold 18px Arial';
            this.ctx.textAlign = 'center';

            // 그림자 텍스트
            this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
            this.ctx.lineWidth = 3;
            this.ctx.strokeText(`${icon} 스페이스`, this.canvas.width/2, boxY + 20);
            this.ctx.strokeText(message, this.canvas.width/2, boxY + 38);

            // 메인 텍스트
            this.ctx.fillStyle = '#FFD700';
            this.ctx.fillText(`${icon} 스페이스`, this.canvas.width/2, boxY + 20);

            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.fillText(message, this.canvas.width/2, boxY + 38);
        }
    }

    // 무적 모드 효과 그리기
    drawInvincibleEffect() {
        const time = Date.now() * 0.01;
        const alpha = Math.sin(time) * 0.3 + 0.7;

        // 화면 테두리에 무지개색 효과
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, 0);
        gradient.addColorStop(0, `rgba(255, 0, 0, ${alpha * 0.3})`);
        gradient.addColorStop(0.17, `rgba(255, 165, 0, ${alpha * 0.3})`);
        gradient.addColorStop(0.33, `rgba(255, 255, 0, ${alpha * 0.3})`);
        gradient.addColorStop(0.5, `rgba(0, 255, 0, ${alpha * 0.3})`);
        gradient.addColorStop(0.67, `rgba(0, 0, 255, ${alpha * 0.3})`);
        gradient.addColorStop(0.83, `rgba(75, 0, 130, ${alpha * 0.3})`);
        gradient.addColorStop(1, `rgba(238, 130, 238, ${alpha * 0.3})`);

        this.ctx.strokeStyle = gradient;
        this.ctx.lineWidth = 5;
        this.ctx.strokeRect(2, 2, this.canvas.width - 4, this.canvas.height - 4);

        // 무적 모드 텍스트
        this.ctx.fillStyle = `rgba(255, 255, 0, ${alpha})`;
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('🎮 INVINCIBLE MODE 🎮', this.canvas.width / 2, 30);
    }

    // 디버그 정보 그리기
    drawDebugInfo(player, mapManager, questSystem, gameState, konamiActivated) {
        const debugInfo = [
            `Position: (${player.x}, ${player.y})`,
            `Map: ${mapManager.getCurrentMapId()}`,
            `FPS: ${Math.round(1000 / 16.67)}`, // 대략적인 FPS
            `Quest: ${questSystem.currentQuest + 1}/${questSystem.quests.length}`,
            `Items: ${gameState.itemsCollected}`,
            `Konami: ${konamiActivated ? 'ON' : 'OFF'}`
        ];

        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(10, 10, 200, 120);

        this.ctx.fillStyle = '#00ff00';
        this.ctx.font = '12px monospace';
        this.ctx.textAlign = 'left';

        debugInfo.forEach((info, index) => {
            this.ctx.fillText(info, 15, 25 + index * 15);
        });
    }
}