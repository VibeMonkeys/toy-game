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

    // NPC 관계 아이콘 표시
    drawNPCRelationshipIcon(nearbyNPC, npcRelationshipSystem) {
        if (!nearbyNPC || !npcRelationshipSystem) return;

        const icons = npcRelationshipSystem.getRelationshipIcon(nearbyNPC.id);
        const relationship = npcRelationshipSystem.getRelationshipStatus(nearbyNPC.id);
        
        // NPC 이름 옆에 관계 아이콘 표시
        const boxX = 20;
        const boxY = 20;
        const boxWidth = 280;
        const boxHeight = 90;

        // 배경
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

        // 테두리
        this.ctx.strokeStyle = '#FFD700';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

        // NPC 이름과 아이콘
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`${icons.mood} ${nearbyNPC.name} ${icons.status}`, boxX + 10, boxY + 25);

        // 관계 레벨
        this.ctx.font = '12px Arial';
        this.ctx.fillStyle = '#FFD700';
        this.ctx.fillText(`관계 레벨: ${icons.level}`, boxX + 10, boxY + 45);

        // 관계 상태
        const statusText = {
            best_friend: '최고의 친구',
            good_friend: '좋은 친구', 
            friend: '친구',
            acquaintance: '지인',
            stranger: '낯선 사람',
            dislike: '싫어함',
            enemy: '적대적'
        };
        
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillText(`상태: ${statusText[relationship.status] || '알 수 없음'}`, boxX + 10, boxY + 65);

        // 상호작용 횟수
        this.ctx.fillStyle = '#CCCCCC';
        this.ctx.font = '10px Arial';
        this.ctx.fillText(`상호작용: ${relationship.interactionCount}회`, boxX + 180, boxY + 45);

        // 특별 능력 표시
        const abilities = npcRelationshipSystem.getSpecialAbilities(nearbyNPC.id);
        if (abilities.length > 0) {
            const abilityIcons = {
                special_discount: '💰',
                discount: '💵',
                small_discount: '💳',
                secret_info: '🔍',
                helpful_hints: '💡',
                exclusive_quests: '⭐',
                priority_service: '🚀',
                price_increase: '📈',
                reluctant_service: '😒',
                service_refusal: '❌',
                hostile_response: '💢'
            };
            
            let abilityText = abilities.map(ability => abilityIcons[ability] || '?').join(' ');
            this.ctx.fillText(`효과: ${abilityText}`, boxX + 180, boxY + 65);
        }
    }

    // 동적 퀘스트 힌트 표시
    drawDynamicQuestHint(hint, isUrgent = false) {
        if (!hint) return;

        const boxWidth = Math.min(500, this.canvas.width - 40);
        const boxHeight = 60;
        const boxX = (this.canvas.width - boxWidth) / 2;
        const boxY = this.canvas.height - 200;

        // 긴급도에 따른 스타일 설정
        const urgentStyle = {
            bgColor: 'rgba(220, 53, 69, 0.9)',
            borderColor: '#FF6B6B',
            textColor: '#FFFFFF',
            icon: '🚨'
        };
        
        const normalStyle = {
            bgColor: 'rgba(40, 167, 69, 0.9)',
            borderColor: '#28A745',
            textColor: '#FFFFFF',
            icon: '💡'
        };
        
        const style = isUrgent ? urgentStyle : normalStyle;

        // 배경
        this.ctx.fillStyle = style.bgColor;
        this.ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

        // 테두리 (깜빡이는 효과)
        const pulseAlpha = isUrgent ? 
            0.7 + 0.3 * Math.sin(Date.now() * 0.01) : 
            0.8;
        this.ctx.strokeStyle = style.borderColor;
        this.ctx.globalAlpha = pulseAlpha;
        this.ctx.lineWidth = isUrgent ? 3 : 2;
        this.ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
        this.ctx.globalAlpha = 1;

        // 아이콘과 제목
        this.ctx.fillStyle = style.textColor;
        this.ctx.font = 'bold 14px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`${style.icon} 스마트 힌트`, boxX + 15, boxY + 20);

        // 힌트 텍스트 (긴 텍스트는 줄바꿈)
        this.ctx.font = '12px Arial';
        const maxWidth = boxWidth - 30;
        const words = hint.split(' ');
        let line = '';
        let y = boxY + 40;

        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = this.ctx.measureText(testLine);
            const testWidth = metrics.width;
            
            if (testWidth > maxWidth && n > 0) {
                this.ctx.fillText(line, boxX + 15, y);
                line = words[n] + ' ';
                y += 14;
            } else {
                line = testLine;
            }
        }
        this.ctx.fillText(line, boxX + 15, y);
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

    // 퀘스트 피드백 메시지 표시
    drawQuestFeedback(ctx, feedback, canvas) {
        if (!feedback || !feedback.message) return;

        const currentTime = Date.now();
        const displayDuration = 4000; // 4초 동안 표시
        
        if (!feedback.startTime) {
            feedback.startTime = currentTime;
        }

        const elapsed = currentTime - feedback.startTime;
        if (elapsed > displayDuration) {
            return false; // 피드백 표시 완료
        }

        // 페이드 인/아웃 효과
        let alpha = 1;
        const fadeTime = 500;
        if (elapsed < fadeTime) {
            alpha = elapsed / fadeTime;
        } else if (elapsed > displayDuration - fadeTime) {
            alpha = (displayDuration - elapsed) / fadeTime;
        }

        ctx.save();
        ctx.globalAlpha = alpha;

        // 배경 박스
        const boxWidth = 400;
        const boxHeight = 120;
        const x = (canvas.width - boxWidth) / 2;
        const y = 100;

        // 피드백 타입에 따른 색상 설정
        const bgColor = feedback.type === 'progress' ? '#4A90E2' : '#27AE60';
        
        ctx.fillStyle = bgColor;
        ctx.globalAlpha = alpha * 0.9;
        ctx.fillRect(x, y, boxWidth, boxHeight);
        
        // 테두리
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.globalAlpha = alpha;
        ctx.strokeRect(x, y, boxWidth, boxHeight);

        // 메인 메시지
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(feedback.message, x + boxWidth/2, y + 30);

        // 진행도 바 (progress 타입인 경우)
        if (feedback.type === 'progress' && feedback.progress !== undefined) {
            const progressWidth = 300;
            const progressHeight = 20;
            const progressX = x + (boxWidth - progressWidth) / 2;
            const progressY = y + 45;

            // 진행도 바 배경
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.fillRect(progressX, progressY, progressWidth, progressHeight);

            // 진행도 바 채움
            const fillWidth = (feedback.progress / feedback.maxProgress) * progressWidth;
            ctx.fillStyle = '#FFD700';
            ctx.fillRect(progressX, progressY, fillWidth, progressHeight);

            // 진행도 텍스트
            ctx.fillStyle = '#ffffff';
            ctx.font = '14px Arial';
            ctx.fillText(`${feedback.progress}/${feedback.maxProgress}`, x + boxWidth/2, progressY + 14);
        }

        // 힌트 메시지
        if (feedback.hint) {
            ctx.fillStyle = '#ffffff';
            ctx.font = '12px Arial';
            ctx.fillText(feedback.hint, x + boxWidth/2, y + boxHeight - 15);
        }

        ctx.restore();
        return true; // 계속 표시 중
    }

    // 다음 단계 정보 표시
    drawNextStepInfo(ctx, nextStepInfo, canvas) {
        if (!nextStepInfo || !nextStepInfo.message) return;

        const x = 20;
        const y = canvas.height - 80;
        const boxWidth = 300;
        const boxHeight = 60;

        // 배경
        ctx.fillStyle = 'rgba(46, 204, 113, 0.9)';
        ctx.fillRect(x, y, boxWidth, boxHeight);

        // 테두리
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, boxWidth, boxHeight);

        // 제목
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('🎯 다음 단계:', x + 10, y + 20);

        // 메시지
        ctx.font = '12px Arial';
        ctx.fillText(nextStepInfo.message.substring(0, 35), x + 10, y + 35);
        if (nextStepInfo.message.length > 35) {
            ctx.fillText(nextStepInfo.message.substring(35), x + 10, y + 50);
        }
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