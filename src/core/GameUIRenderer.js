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

    // 동적 퀘스트 힌트 표시 (레트로 스타일)
    drawDynamicQuestHint(hint, isUrgent = false) {
        if (!hint) return;

        const boxWidth = Math.min(480, this.canvas.width - 40);
        const boxHeight = 70;
        const boxX = (this.canvas.width - boxWidth) / 2;
        const boxY = this.canvas.height - 210;

        // 레트로 스타일 설정 (덜 자극적으로)
        const urgentStyle = {
            bgColor: 'rgba(80, 20, 20, 0.92)', // 어두운 레드
            borderColor: '#FF6666',
            textColor: '#FFAAAA',
            icon: '⚠️'
        };

        const normalStyle = {
            bgColor: 'rgba(20, 60, 20, 0.92)', // 어두운 그린
            borderColor: '#66BB66',
            textColor: '#AAFFAA',
            icon: '💡'
        };

        const style = isUrgent ? urgentStyle : normalStyle;

        // 레트로 스타일 배경 박스
        this.drawRetroHintBox(boxX, boxY, boxWidth, boxHeight, isUrgent);

        // 제목 (레트로 폰트)
        this.ctx.fillStyle = style.textColor;
        this.ctx.font = 'bold 13px "Courier New", monospace';
        this.ctx.textAlign = 'left';

        const time = Date.now() * 0.005;
        const titleText = isUrgent ? '>> SYSTEM ALERT' : '>> QUEST HINT';

        // 글로우 효과
        this.ctx.shadowColor = style.borderColor;
        this.ctx.shadowBlur = isUrgent ? 6 : 4;
        this.ctx.fillText(`${style.icon} ${titleText}`, boxX + 18, boxY + 22);
        this.ctx.shadowBlur = 0;

        // 힌트 텍스트 (레트로 스타일)
        this.ctx.fillStyle = style.textColor;
        this.ctx.font = '12px "Courier New", monospace';

        // 텍스트 자동 줄바꿈
        const maxCharsPerLine = 58;
        const words = hint.split(' ');
        let lines = [];
        let currentLine = '';

        for (let word of words) {
            if (currentLine.length + word.length + 1 <= maxCharsPerLine) {
                currentLine += (currentLine ? ' ' : '') + word;
            } else {
                if (currentLine) lines.push(currentLine);
                currentLine = word;
            }
        }
        if (currentLine) lines.push(currentLine);

        // 최대 2줄로 제한
        lines = lines.slice(0, 2);

        lines.forEach((line, index) => {
            // 부드러운 애니메이션
            const fadeAlpha = isUrgent ?
                0.9 + 0.1 * Math.sin(time + index * 0.3) :
                0.8 + 0.2 * Math.sin(time + index * 0.5);
            this.ctx.globalAlpha = fadeAlpha;

            this.ctx.fillText(`> ${line}`, boxX + 18, boxY + 42 + (index * 15));
        });

        this.ctx.globalAlpha = 1;
    }

    // 레트로 스타일 힌트 박스 그리기
    drawRetroHintBox(x, y, width, height, isUrgent = false) {
        const time = Date.now() * 0.008;

        // 배경 그라데이션
        const gradient = this.ctx.createLinearGradient(x, y, x, y + height);
        if (isUrgent) {
            gradient.addColorStop(0, 'rgba(80, 20, 20, 0.94)');
            gradient.addColorStop(0.5, 'rgba(60, 15, 15, 0.94)');
            gradient.addColorStop(1, 'rgba(40, 10, 10, 0.94)');
        } else {
            gradient.addColorStop(0, 'rgba(20, 60, 20, 0.94)');
            gradient.addColorStop(0.5, 'rgba(15, 45, 15, 0.94)');
            gradient.addColorStop(1, 'rgba(10, 30, 10, 0.94)');
        }

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(x, y, width, height);

        // Windows 95 스타일 3D 테두리
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y + height);
        this.ctx.lineTo(x, y);
        this.ctx.lineTo(x + width, y);
        this.ctx.stroke();

        this.ctx.strokeStyle = 'rgba(100, 100, 100, 0.8)';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(x + width, y);
        this.ctx.lineTo(x + width, y + height);
        this.ctx.lineTo(x, y + height);
        this.ctx.stroke();

        // 메인 테두리 (부드러운 펄스)
        const pulseAlpha = isUrgent ?
            0.5 + 0.3 * Math.sin(time * 2) :
            0.6 + 0.2 * Math.sin(time);

        const borderColor = isUrgent ? '#FF6666' : '#66BB66';
        this.ctx.strokeStyle = `${borderColor}${Math.floor(pulseAlpha * 255).toString(16).padStart(2, '0')}`;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x + 2, y + 2, width - 4, height - 4);

        // 좌상단 상태 LED (더 부드럽게)
        const ledAlpha = isUrgent ?
            0.6 + 0.4 * Math.sin(time * 4) :
            0.5 + 0.3 * Math.sin(time * 2);

        this.ctx.fillStyle = `${borderColor}${Math.floor(ledAlpha * 255).toString(16).padStart(2, '0')}`;
        this.ctx.beginPath();
        this.ctx.arc(x + 8, y + 8, 3, 0, Math.PI * 2);
        this.ctx.fill();
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

    // 다음 단계 정보 표시 (레트로 스타일)
    drawNextStepInfo(ctx, nextStepInfo, canvas) {
        if (!nextStepInfo || !nextStepInfo.message) return;

        const x = 15;
        const y = canvas.height - 95;
        const boxWidth = 360;
        const boxHeight = 80;

        // 레트로 스타일 배경 박스 그리기
        this.drawRetroNextStepBox(ctx, x, y, boxWidth, boxHeight);

        // 레트로 스타일 제목
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 14px "Courier New", monospace';
        ctx.textAlign = 'left';

        // 깜박이는 아이콘 효과
        const time = Date.now() * 0.006;
        const iconAlpha = 0.8 + 0.2 * Math.sin(time);
        ctx.globalAlpha = iconAlpha;

        // 글로우 효과 추가
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 8;
        ctx.fillText('>> QUEST GUIDE', x + 18, y + 22);
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;

        // 레트로 스타일 메시지
        ctx.fillStyle = '#00FF88';
        ctx.font = '13px "Courier New", monospace';

        // 메시지 자동 줄바꿈 (박스 경계 내에서 최적화)
        const maxCharsPerLine = 38; // 박스 너비에 맞게 조정
        const maxLines = 3; // 최대 3줄까지 허용
        const words = nextStepInfo.message.split(' ');
        let lines = [];
        let currentLine = '';

        for (let word of words) {
            // 현재 줄에 단어를 추가했을 때의 길이 계산
            const testLine = currentLine ? currentLine + ' ' + word : word;

            if (testLine.length <= maxCharsPerLine) {
                currentLine = testLine;
            } else {
                // 현재 줄을 완성하고 새 줄 시작
                if (currentLine) {
                    lines.push(currentLine);
                    currentLine = word;
                } else {
                    // 단어가 너무 길면 강제로 자르기
                    if (word.length > maxCharsPerLine) {
                        lines.push(word.substring(0, maxCharsPerLine - 2) + '..');
                        currentLine = '';
                    } else {
                        currentLine = word;
                    }
                }
            }
        }

        // 마지막 줄 추가
        if (currentLine) lines.push(currentLine);

        // 최대 줄 수로 제한하고, 넘치면 마지막 줄에 "..." 추가
        if (lines.length > maxLines) {
            lines = lines.slice(0, maxLines - 1);
            const lastLine = lines[lines.length - 1];
            if (lastLine.length > maxCharsPerLine - 3) {
                lines[lines.length - 1] = lastLine.substring(0, maxCharsPerLine - 3) + '...';
            } else {
                lines[lines.length - 1] = lastLine + '...';
            }
        }

        lines.forEach((line, index) => {
            // 모든 줄에 부드러운 페이드인 효과
            const lineTime = time + index * 0.5;
            const fadeAlpha = 0.8 + 0.2 * Math.sin(lineTime);
            ctx.globalAlpha = fadeAlpha;

            // 터미널 그린 글로우 효과
            ctx.shadowColor = '#00FF88';
            ctx.shadowBlur = 4;
            // 줄 간격을 조정하여 3줄이 박스 안에 잘 들어가도록
            ctx.fillText(`> ${line}`, x + 18, y + 38 + (index * 15));
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;
        });

        // 진행 표시기 (우하단)
        const progressDots = '...';
        const dotTime = Math.floor(time * 3) % 4;
        const visibleDots = progressDots.substring(0, dotTime);
        ctx.fillStyle = '#666666';
        ctx.font = '12px "Courier New", monospace';
        ctx.fillText(visibleDots, x + boxWidth - 30, y + boxHeight - 12);
    }

    // 레트로 스타일 다음 단계 박스 그리기
    drawRetroNextStepBox(ctx, x, y, width, height) {
        // 레트로 그라데이션 배경 (더 세련된 색상)
        const gradient = ctx.createLinearGradient(x, y, x, y + height);
        gradient.addColorStop(0, 'rgba(30, 30, 60, 0.96)');
        gradient.addColorStop(0.3, 'rgba(20, 20, 45, 0.96)');
        gradient.addColorStop(0.7, 'rgba(15, 15, 30, 0.96)');
        gradient.addColorStop(1, 'rgba(10, 10, 20, 0.96)');

        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, width, height);

        // 윈도우 95 스타일 3D 테두리 (더 선명하게)
        // 상단/좌측 밝은 테두리
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y + height);
        ctx.lineTo(x, y);
        ctx.lineTo(x + width, y);
        ctx.stroke();

        // 하단/우측 어두운 테두리
        ctx.strokeStyle = 'rgba(85, 85, 85, 0.9)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + width, y);
        ctx.lineTo(x + width, y + height);
        ctx.lineTo(x, y + height);
        ctx.stroke();

        // 메인 테두리 (그린 어센트, 펄스 효과)
        const time = Date.now() * 0.008;
        const pulseAlpha = 0.6 + 0.4 * Math.sin(time * 2);
        ctx.strokeStyle = `rgba(0, 170, 68, ${pulseAlpha})`;
        ctx.lineWidth = 2;
        ctx.strokeRect(x + 2, y + 2, width - 4, height - 4);

        // 좌상단 시스템 상태 LED
        const ledAlpha = 0.7 + 0.3 * Math.sin(time * 3);
        ctx.fillStyle = `rgba(0, 255, 136, ${ledAlpha})`;
        ctx.beginPath();
        ctx.arc(x + 10, y + 10, 4, 0, Math.PI * 2);
        ctx.fill();

        // LED 글로우 효과
        ctx.shadowColor = '#00FF88';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(x + 10, y + 10, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // 우상단 시스템 정보 표시
        ctx.fillStyle = 'rgba(255, 215, 0, 0.4)';
        ctx.font = '8px "Courier New", monospace';
        ctx.textAlign = 'right';
        ctx.fillText('v1.0', x + width - 8, y + 12);

        // 우하단 진행 표시기 (더 세련되게)
        for (let i = 0; i < 3; i++) {
            const dotTime = time + i * 0.8;
            const dotAlpha = 0.4 + 0.4 * Math.sin(dotTime);
            const dotSize = 2 + Math.sin(dotTime) * 0.5;
            ctx.fillStyle = `rgba(255, 215, 0, ${dotAlpha})`;
            ctx.beginPath();
            ctx.arc(x + width - 22 + (i * 8), y + height - 8, dotSize, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // 디버그 정보 그리기 (레트로 스타일)
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