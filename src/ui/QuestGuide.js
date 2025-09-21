export class QuestGuide {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.animationTime = 0;
        this.lastInventoryState = ''; // 디버깅용 상태 추적
    }

    draw(questSystem, gameState) {
        const currentQuest = questSystem.getCurrentQuest();
        if (!currentQuest) return;

        this.animationTime += 16; // 대략 60fps 기준

        // 가이드 박스 설정
        const boxWidth = 600;
        const boxHeight = 80;
        const boxX = (this.canvas.width - boxWidth) / 2;
        const boxY = 20;

        // 반투명 배경
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

        // 테두리 (펄스 효과)
        const pulseAlpha = 0.5 + 0.3 * Math.sin(this.animationTime * 0.003);
        this.ctx.strokeStyle = `rgba(255, 215, 0, ${pulseAlpha})`;
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

        // 퀘스트 제목
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`📋 ${currentQuest.title}`, boxX + boxWidth / 2, boxY + 25);

        // 현재 해야 할 일 가이드
        const guideText = this.getGuideText(currentQuest, gameState);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '14px Arial';
        this.ctx.fillText(guideText, boxX + boxWidth / 2, boxY + 45);

        // 진행도 표시
        const progressText = `${currentQuest.progress}/${currentQuest.maxProgress}`;
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.font = 'bold 12px Arial';
        this.ctx.fillText(progressText, boxX + boxWidth / 2, boxY + 65);

        // 아이템 수집 상황 (간단히)
        if (currentQuest.requiredItem || currentQuest.requiredItems) {
            const requiredItems = currentQuest.requiredItems || [currentQuest.requiredItem];
            const playerInventory = gameState?.collectedItems || [];
            const collectedCount = requiredItems.filter(item =>
                playerInventory.some(invItem => invItem.name === item)
            ).length;

            // 아이템 수집 상황을 아이콘으로 표시
            this.ctx.fillStyle = collectedCount === requiredItems.length ? '#00ff00' : '#ffaa00';
            this.ctx.font = '12px Arial';
            this.ctx.fillText(`📦 ${collectedCount}/${requiredItems.length}`, boxX + boxWidth - 60, boxY + 25);
        }
    }

    getGuideText(quest, gameState) {
        const playerInventory = gameState?.collectedItems || [];
        const currentMap = gameState?.currentMap || 'lobby';


        // 필요한 아이템이 있는 경우
        if (quest.requiredItem || quest.requiredItems) {
            const requiredItems = quest.requiredItems || [quest.requiredItem];

            // 아직 수집하지 못한 아이템 찾기
            const missingItems = requiredItems.filter(item =>
                !playerInventory.some(invItem => invItem.name === item)
            );

            if (missingItems.length > 0) {
                // 첫 번째 미수집 아이템에 대한 가이드
                const firstMissingItem = missingItems[0];
                return this.getLocationGuide(firstMissingItem, currentMap);
            } else {
                // 모든 아이템을 수집했으면 제출 가이드
                return this.getSubmissionGuide(quest, currentMap);
            }
        }

        // 기본 가이드
        return "퀘스트를 확인하고 목표를 달성하세요!";
    }

    getLocationGuide(itemName, currentMap) {
        // 아이템별 목표 위치 정의
        const itemLocations = {
            '7층 업무 보고서': { floor: 7, map: 'floor_7_corridor', detail: '7층 복도' },
            '중요한 문서': { floor: 7, map: 'floor_7_709_affiliates', detail: '709호 계열사 사무실' },
            '프로젝트 파일': { floor: 7, map: 'floor_7_710_main_it', detail: '710호 본사 IT 사무실' },
            '창립 스토리북': { floor: 7, map: 'floor_7_709_affiliates', detail: '709호 계열사 사무실' },
            '개발팀 메시지': { floor: 7, map: 'floor_7_710_main_it', detail: '710호 본사 IT 사무실' },
            '회의록': { floor: 8, map: 'floor_8_corridor', detail: '8층 복도' },
            '프레젠테이션 자료': { floor: 8, map: 'floor_8_corridor', detail: '8층 복도' },
            '기획팀 메시지': { floor: 8, map: 'floor_8_it_division', detail: 'IT본부 사무실' },
            '인사팀 메시지': { floor: 8, map: 'floor_8_hr_office', detail: '인경실' },
            '미래 비전서': { floor: 8, map: 'floor_8_education_service', detail: '교육서비스본부' },
            '영업팀 메시지': { floor: 8, map: 'floor_8_sales_support', detail: '영업+교육지원본부' },
            '9층 기밀 문서': { floor: 9, map: 'floor_9_corridor', detail: '9층 복도' },
            '재무팀 메시지': { floor: 9, map: 'floor_9_ceo_office', detail: '9층 CEO실' },
            '임원진 메시지': { floor: 9, map: 'floor_9_ceo_office', detail: '9층 CEO실' },
            '26주년 기념 메달': { floor: 1, map: 'lobby', detail: '1층 로비' }
        };

        const targetLocation = itemLocations[itemName];
        if (!targetLocation) {
            return `📍 ${itemName}을(를) 찾으세요`;
        }

        return this.getDetailedDirections(currentMap, targetLocation, itemName);
    }

    getDetailedDirections(currentMap, targetLocation, itemName) {
        const currentFloor = this.getCurrentFloor(currentMap);
        const targetFloor = targetLocation.floor;

        // 같은 층에 있는 경우
        if (currentFloor === targetFloor) {
            return this.getSameFloorDirections(currentMap, targetLocation, itemName);
        }

        // 다른 층으로 이동해야 하는 경우
        return this.getDifferentFloorDirections(currentFloor, targetLocation, itemName);
    }

    getCurrentFloor(mapId) {
        if (mapId.includes('lobby') || mapId.includes('starbucks') || mapId.includes('mammoth') ||
            mapId.includes('kook_bab') || mapId.includes('tim_hortons')) return 1;
        if (mapId.includes('floor_7') || mapId.includes('709') || mapId.includes('710')) return 7;
        if (mapId.includes('floor_8')) return 8;
        if (mapId.includes('floor_9')) return 9;
        if (mapId.includes('rooftop')) return 'R';
        return 1; // 기본값
    }

    getSameFloorDirections(currentMap, targetLocation, itemName) {
        const targetMap = targetLocation.map;
        const targetDetail = targetLocation.detail;

        // 이미 목표 맵에 있는 경우
        if (currentMap === targetMap) {
            return `📍 현재 위치에서 ${itemName}을(를) 찾으세요! 주변을 둘러보세요.`;
        }

        // 같은 층 내에서 이동
        if (currentMap.includes('floor_7')) {
            if (targetMap === 'floor_7_corridor') {
                return `🚪 문을 통해 7층 복도로 나가서 ${itemName}을(를) 찾으세요`;
            } else if (targetMap === 'floor_7_709_affiliates') {
                return `🚪 복도로 나간 후 → 왼쪽 '709호 계열사' 문으로 들어가세요`;
            } else if (targetMap === 'floor_7_710_main_it') {
                return `🚪 복도로 나간 후 → 오른쪽 '710호 본사 IT' 문으로 들어가세요`;
            }
        }

        if (currentMap.includes('floor_8')) {
            if (targetMap === 'floor_8_corridor') {
                return `🚪 문을 통해 8층 복도로 나가서 ${itemName}을(를) 찾으세요`;
            } else if (targetMap === 'floor_8_it_division') {
                return `🚪 복도로 나간 후 → 왼쪽 위 'IT본부' 문으로 들어가세요`;
            } else if (targetMap === 'floor_8_hr_office') {
                return `🚪 복도로 나간 후 → 왼쪽 중간 '인경실' 문으로 들어가세요`;
            } else if (targetMap === 'floor_8_ai_research') {
                return `🚪 복도로 나간 후 → 왼쪽 아래 '인공지능연구소' 문으로 들어가세요`;
            } else if (targetMap === 'floor_8_education_service') {
                return `🚪 복도로 나간 후 → 오른쪽 위 '교육서비스본부' 문으로 들어가세요`;
            } else if (targetMap === 'floor_8_sales_support') {
                return `🚪 복도로 나간 후 → 오른쪽 아래 '영업+교육지원본부' 문으로 들어가세요`;
            }
        }

        return `📍 ${targetDetail}에서 ${itemName}을(를) 찾으세요`;
    }

    getDifferentFloorDirections(currentFloor, targetLocation, itemName) {
        const targetFloor = targetLocation.floor;
        const targetDetail = targetLocation.detail;

        let floorDirection = '';
        if (currentFloor < targetFloor) {
            floorDirection = '위로';
        } else {
            floorDirection = '아래로';
        }

        let baseDirection = `🛗 엘리베이터를 찾아서 → ${targetFloor}층 버튼을 눌러 이동하세요`;

        // 목표 층 도착 후 상세 안내
        let afterElevator = '';
        if (targetLocation.map === 'floor_7_corridor') {
            afterElevator = ` → 7층 복도에서 ${itemName} 찾기`;
        } else if (targetLocation.map === 'floor_7_709_affiliates') {
            afterElevator = ` → 7층 복도 → 왼쪽 '709호 계열사' 입장`;
        } else if (targetLocation.map === 'floor_7_710_main_it') {
            afterElevator = ` → 7층 복도 → 오른쪽 '710호 본사 IT' 입장`;
        } else if (targetLocation.map === 'floor_8_corridor') {
            afterElevator = ` → 8층 복도에서 ${itemName} 찾기`;
        } else if (targetLocation.map === 'floor_8_it_division') {
            afterElevator = ` → 8층 복도 → 왼쪽 위 'IT본부' 입장`;
        } else if (targetLocation.map === 'floor_8_hr_office') {
            afterElevator = ` → 8층 복도 → 왼쪽 중간 '인경실' 입장`;
        } else if (targetLocation.map === 'floor_8_ai_research') {
            afterElevator = ` → 8층 복도 → 왼쪽 아래 '인공지능연구소' 입장`;
        } else if (targetLocation.map === 'floor_8_education_service') {
            afterElevator = ` → 8층 복도 → 오른쪽 위 '교육서비스본부' 입장`;
        } else if (targetLocation.map === 'floor_8_sales_support') {
            afterElevator = ` → 8층 복도 → 오른쪽 아래 '영업+교육지원본부' 입장`;
        } else if (targetLocation.map === 'floor_9_corridor') {
            afterElevator = ` → 9층 복도에서 ${itemName} 찾기`;
        } else if (targetLocation.map === 'floor_9_ceo_office') {
            afterElevator = ` → 9층 복도 → 'CEO실' 입장`;
        } else if (targetLocation.map === 'lobby') {
            afterElevator = ` → 1층 로비에서 ${itemName} 찾기`;
        }

        return baseDirection + afterElevator;
    }

    getSubmissionGuide(quest, currentMap) {
        // 퀘스트별 제출 위치 정의
        const submissionLocations = {
            0: { floor: 7, map: 'floor_7_corridor', npc: '김대리', detail: '7층 복도' },
            1: { floor: 7, map: 'floor_7_corridor', npc: '박직원', detail: '7층 복도' },
            2: { floor: 7, map: 'floor_7_corridor', npc: '인턴', detail: '7층 복도' },
            3: { floor: 8, map: 'floor_8_corridor', npc: '팀장 이씨', detail: '8층 복도' },
            4: { floor: 9, map: 'floor_9_corridor', npc: '비서 정씨', detail: '9층 복도' },
            5: { floor: 1, map: 'lobby', npc: '26주년 코디네이터', detail: '1층 로비' },
            6: { floor: 1, map: 'lobby', npc: '역사 관리자', detail: '1층 로비' },
            7: { floor: 9, map: 'floor_9_ceo_office', npc: 'CEO', detail: '9층 CEO실' },
            8: { floor: 9, map: 'floor_9_ceo_office', npc: 'CEO 김대표', detail: '9층 CEO실' }
        };

        const submissionLocation = submissionLocations[quest.id];
        if (!submissionLocation) {
            return '➤ 퀘스트 완료! 다음 단계로 진행하세요';
        }

        return this.getSubmissionDirections(currentMap, submissionLocation);
    }

    getSubmissionDirections(currentMap, submissionLocation) {
        const currentFloor = this.getCurrentFloor(currentMap);
        const targetFloor = submissionLocation.floor;
        const npcName = submissionLocation.npc;
        const targetDetail = submissionLocation.detail;

        // 같은 층에 있는 경우
        if (currentFloor === targetFloor) {
            // 이미 목표 맵에 있는 경우
            if (currentMap === submissionLocation.map) {
                return `✅ ${npcName}를 찾아서 대화하세요! (스페이스바로 대화)`;
            }

            // 같은 층 내에서 이동
            if (currentFloor === 7) {
                if (submissionLocation.map === 'floor_7_corridor') {
                    return `🚪 복도로 나가서 → ${npcName} 찾기 → 대화하여 제출`;
                }
            } else if (currentFloor === 8) {
                if (submissionLocation.map === 'floor_8_corridor') {
                    return `🚪 복도로 나가서 → ${npcName} 찾기 → 대화하여 제출`;
                }
            } else if (currentFloor === 9) {
                if (submissionLocation.map === 'floor_9_corridor') {
                    return `🚪 복도로 나가서 → ${npcName} 찾기 → 대화하여 제출`;
                } else if (submissionLocation.map === 'floor_9_ceo_office') {
                    return `🚪 복도로 나간 후 → 'CEO실' 입장 → ${npcName} 찾기 → 대화하여 제출`;
                }
            }

            return `➤ ${targetDetail}에서 ${npcName} 찾아서 제출하세요`;
        }

        // 다른 층으로 이동해야 하는 경우
        let baseDirection = `🛗 엘리베이터 → ${targetFloor}층 이동`;

        // 목표 층 도착 후 상세 안내
        let afterElevator = '';
        if (submissionLocation.map === 'floor_7_corridor') {
            afterElevator = ` → 7층 복도에서 ${npcName} 찾기 → 대화하여 제출`;
        } else if (submissionLocation.map === 'floor_8_corridor') {
            afterElevator = ` → 8층 복도에서 ${npcName} 찾기 → 대화하여 제출`;
        } else if (submissionLocation.map === 'floor_9_corridor') {
            afterElevator = ` → 9층 복도에서 ${npcName} 찾기 → 대화하여 제출`;
        } else if (submissionLocation.map === 'floor_9_ceo_office') {
            afterElevator = ` → 9층 복도 → 'CEO실' 입장 → ${npcName} 찾기 → 대화하여 제출`;
        } else if (submissionLocation.map === 'lobby') {
            afterElevator = ` → 1층 로비에서 ${npcName} 찾기 → 대화하여 제출`;
        }

        return baseDirection + afterElevator;
    }
}