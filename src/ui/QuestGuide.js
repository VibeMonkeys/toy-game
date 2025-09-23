import { Logger } from '../utils/Logger.js';

import { QUEST_DATA } from '../data/QuestData.js';

export class QuestGuide {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.animationTime = 0;
        this.lastInventoryState = ''; // 디버깅용 상태 추적
        // Logger는 static 클래스이므로 인스턴스 생성 불필요
    }

    draw(questSystem, gameState) {
        const currentQuest = questSystem.getCurrentQuest();
        if (!currentQuest) return;

        this.animationTime += 16; // 대략 60fps 기준

        // 캐시된 계산 재사용
        const questData = this.getQuestData(currentQuest, gameState);

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
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '14px Arial';
        this.ctx.fillText(questData.guideText, boxX + boxWidth / 2, boxY + 45);

        // 진행도 표시
        const progressText = `${currentQuest.progress}/${currentQuest.maxProgress}`;
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.font = 'bold 12px Arial';
        this.ctx.fillText(progressText, boxX + boxWidth / 2, boxY + 65);

        // 아이템 수집 상황 (간단히)
        if (questData.hasItems) {
            this.ctx.fillStyle = questData.collectedCount === questData.requiredItems.length ? '#00ff00' : '#ffaa00';
            this.ctx.font = '12px Arial';
            this.ctx.fillText(`📦 ${questData.collectedCount}/${questData.requiredItems.length}`, boxX + boxWidth - 60, boxY + 25);
        }
    }

    // 퀘스트 데이터 캐싱 및 중복 계산 방지
    getQuestData(quest, gameState) {
        const questId = quest.id;
        const inventoryKey = gameState?.collectedItems?.map(i => i.name).join(',') || '';
        const cacheKey = `${questId}-${inventoryKey}`;

        // 캐시 확인
        if (this.questDataCache && this.questDataCache.key === cacheKey) {
            return this.questDataCache.data;
        }

        // 새로운 데이터 계산
        const playerInventory = gameState?.collectedItems || [];
        const hasItems = quest.requiredItem || quest.requiredItems;
        let requiredItems = [];
        let collectedCount = 0;

        if (hasItems) {
            requiredItems = quest.requiredItems || [quest.requiredItem];
            collectedCount = requiredItems.filter(item =>
                playerInventory.some(invItem => invItem.name === item)
            ).length;
        }

        const guideText = this.getGuideText(quest, gameState);

        // 캐시 저장
        this.questDataCache = {
            key: cacheKey,
            data: {
                hasItems,
                requiredItems,
                collectedCount,
                guideText
            }
        };

        return this.questDataCache.data;
    }

    getGuideText(gameState, currentMapId) {
        if (!gameState || !currentMapId) return '';

        // 진행 중인 퀘스트 찾기
        const activeQuest = this.getQuestData(gameState);
        if (!activeQuest) return '🎊 모든 퀘스트를 완료했습니다!';

        Logger.debug(`🎯 현재 활성 퀘스트: ${activeQuest.title}, started: ${activeQuest.started}, completed: ${activeQuest.completed}`);

        // 퀘스트 단계 판단
        const questPhase = this.determineQuestPhase(activeQuest, gameState);
        Logger.debug(`📍 퀘스트 단계: ${questPhase}`);

        switch (questPhase) {
            case 'NEED_TO_RECEIVE':
                return this.getQuestReceiveGuide(activeQuest, currentMapId);
            
            case 'NEED_TO_COLLECT':
                return this.getItemCollectionGuide(activeQuest, currentMapId);
            
            case 'NEED_TO_SUBMIT':
                return this.getItemSubmissionGuide(activeQuest, currentMapId);
            
            case 'COMPLETED':
                return this.getNextQuestGuide(activeQuest, gameState);
            
            default:
                return `📋 ${activeQuest.hint}`;
        }
    }

    // 퀘스트 단계 판단 메서드
    determineQuestPhase(quest, gameState) {
        // 퀘스트가 완료된 경우
        if (quest.completed) {
            return 'COMPLETED';
        }
        
        // 퀘스트를 아직 받지 않은 경우
        if (!quest.started) {
            return 'NEED_TO_RECEIVE';
        }
        
        // 퀘스트를 받았지만 아이템을 아직 수집하지 않은 경우
        const hasRequiredItem = this.hasRequiredItems(quest, gameState.inventory);
        if (!hasRequiredItem) {
            return 'NEED_TO_COLLECT';
        }
        
        // 아이템은 있지만 아직 제출하지 않은 경우
        if (!quest.itemSubmitted) {
            return 'NEED_TO_SUBMIT';
        }
        
        return 'COMPLETED';
    }

    // 필요한 아이템을 가지고 있는지 확인
    hasRequiredItems(quest, inventory) {
        if (quest.requiredItem) {
            return inventory.some(item => item.name === quest.requiredItem);
        }
        
        if (quest.requiredItems) {
            return quest.requiredItems.every(requiredItem => 
                inventory.some(item => item.name === requiredItem)
            );
        }
        
        return false;
    }

    // 1. 퀘스트 받기 단계 가이드
    getQuestReceiveGuide(quest, currentMapId) {
        const npcInfo = this.getNPCLocationInfo(quest.questGiver);
        
        if (!npcInfo) {
            return `🎯 ${quest.questGiver}을(를) 찾아가서 퀘스트를 받으세요`;
        }

        const currentFloor = this.getCurrentFloor(currentMapId);
        
        // 같은 층에 있는 경우
        if (currentFloor === npcInfo.floor) {
            return `🗣️ ${npcInfo.locationDescription}에서 ${npcInfo.name}과(와) 대화하여 퀘스트를 받으세요`;
        }
        
        // 다른 층에 있는 경우
        return `🚀 ${npcInfo.floor}층으로 이동 → ${npcInfo.locationDescription}에서 ${npcInfo.name}과(와) 대화하여 퀘스트를 받으세요`;
    }

    // 2. 아이템 수집 단계 가이드 
    getItemCollectionGuide(quest, currentMapId) {
        const itemName = quest.requiredItem || (quest.requiredItems && quest.requiredItems[0]);
        if (!itemName) {
            return `📦 필요한 아이템을 수집하세요`;
        }

        // 기존 위치 가이드 로직 활용
        const locationGuide = this.getLocationGuide(itemName, currentMapId);
        return `📦 아이템 수집 필요: ${itemName}\n${locationGuide}`;
    }

    // 3. 아이템 제출 단계 가이드
    getItemSubmissionGuide(quest, currentMapId) {
        const npcInfo = this.getNPCLocationInfo(quest.questGiver);
        const itemName = quest.requiredItem || (quest.requiredItems && quest.requiredItems.join(', '));
        
        if (!npcInfo) {
            return `✅ ${itemName}을(를) ${quest.questGiver}에게 제출하세요`;
        }

        const currentFloor = this.getCurrentFloor(currentMapId);
        
        // 같은 층에 있는 경우
        if (currentFloor === npcInfo.floor) {
            return `✅ ${itemName}을(를) 가지고 ${npcInfo.locationDescription}의 ${npcInfo.name}에게 제출하세요`;
        }
        
        // 다른 층에 있는 경우
        return `✅ ${itemName}을(를) 가지고 ${npcInfo.floor}층 → ${npcInfo.locationDescription}의 ${npcInfo.name}에게 제출하세요`;
    }

    // 4. 다음 퀘스트 안내
    getNextQuestGuide(completedQuest, gameState) {
        // 다음 퀘스트 확인
        const nextQuest = QUEST_DATA.find(q => !q.completed && !q.started);
        
        if (!nextQuest) {
            return '🎊 축하합니다! 모든 퀘스트를 완료했습니다!';
        }
        
        const npcInfo = this.getNPCLocationInfo(nextQuest.questGiver);
        if (!npcInfo) {
            return `🎯 다음 퀘스트: ${nextQuest.title}`;
        }
        
        return `🎯 다음 퀘스트: ${nextQuest.title}\n🗣️ ${npcInfo.floor}층 ${npcInfo.locationDescription}에서 ${npcInfo.name}과(와) 대화하세요`;
    }

    // NPC 위치 정보 가져오기
    getNPCLocationInfo(npcId) {
        const npcLocationMap = {
            'guard': {
                name: '경비 아저씨',
                floor: 1,
                locationDescription: '1층 로비 오른쪽'
            },
            'reception': {
                name: '안내 데스크',
                floor: 1,
                locationDescription: '1층 로비 중앙'
            },
            'kim_deputy': {
                name: '김 부장',
                floor: 7,
                locationDescription: '7층 복도'
            },
            'intern': {
                name: '인턴',
                floor: 7,
                locationDescription: '7층 복도'
            },
            'office_worker_2': {
                name: '직원',
                floor: 7,
                locationDescription: '7층 복도'
            },
            'manager_lee': {
                name: '이 매니저',
                floor: 8,
                locationDescription: '8층 복도'
            },
            'education_manager': {
                name: '교육 매니저',
                floor: 8,
                locationDescription: '8층 복도'
            },
            'secretary_jung': {
                name: '정 비서',
                floor: 9,
                locationDescription: '9층 복도'
            },
            'ceo_kim': {
                name: '김 대표',
                floor: 9,
                locationDescription: '9층 CEO실'
            }
        };
        
        return npcLocationMap[npcId];
    }

    getLocationGuide(itemName, currentMap) {
        // 아이템별 목표 위치 정의 (QuestData.js와 MapData.js에 맞춰 업데이트)
        const itemLocations = {
            // 1층 아이템
            '입장 패스': { floor: 1, map: 'lobby', detail: '1층 로비 바닥' },
            '26주년 기념 메달': { floor: 1, map: 'lobby', detail: '1층 로비 바닥' },

            // 7층 아이템
            '업무 보고서': { floor: 7, map: 'floor_7_corridor', detail: '7층 복도' },
            '프로젝트 파일': { floor: 7, map: 'floor_7_710_main_it', detail: '710호 본사IT', specific: '710호 문을 열고 들어가서 바닥의 파일을 수집하세요' },
            '중요 계약서': { floor: 7, map: 'floor_7_709_affiliates', detail: '709호 계열사' },

            // 8층 아이템
            '회의록': { floor: 8, map: 'floor_8_corridor', detail: '8층 복도' },
            '프레젠테이션': { floor: 8, map: 'floor_8_corridor', detail: '8층 복도' },
            '교육 매뉴얼': { floor: 8, map: 'floor_8_education_service', detail: '교육서비스본부' },

            // 9층 아이템
            '기밀 문서': { floor: 9, map: 'floor_9_ceo_office', detail: '9층 CEO실' }
        };

        const targetLocation = itemLocations[itemName];
        if (!targetLocation) {
            return `📍 ${itemName}을(를) 찾으세요 - 바닥을 잘 살펴보세요`;
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

        // 디버그 로그 추가
        Logger.debug(`🔍 QuestGuide Debug: currentMap=${currentMap}, targetMap=${targetMap}, itemName=${itemName}`);

        // 이미 목표 맵에 있는 경우 - 더 구체적인 안내
        if (currentMap === targetMap) {
            Logger.debug(`✅ 목표 맵에 도착! specific 안내 적용`);
            if (targetLocation.specific) {
                return `✨ ${targetLocation.specific}`;
            }
            return `💎 ${itemName}이(가) 이 방에 있습니다! 바닥을 클릭해서 수집하세요`;
        }

        // 프로젝트 파일 전용 상세 가이드 - 현재 위치에 따라 다른 안내
        if (itemName === '프로젝트 파일') {
            Logger.debug(`📁 프로젝트 파일 가이드: currentMap=${currentMap}`);
            if (currentMap === 'floor_7_corridor') {
                return `🚪 7층 복도에서 오른쪽으로 이동 → 710호 본사IT 문을 클릭하여 입장하세요`;
            } else if (currentMap === 'floor_7_710_main_it') {
                Logger.debug(`🎯 710호 안에 있음! 파일 수집 안내`);
                return `📁 710호 본사IT 사무실 내부에서 바닥의 프로젝트 파일을 클릭하여 수집하세요!`;
            } else {
                return `🎯 7층으로 이동 → 복도에서 오른쪽 → 710호 본사IT에 입장 → 파일 수집`;
            }
        }

        // 중요 계약서 전용 가이드
        if (itemName === '중요 계약서') {
            if (currentMap === 'floor_7_corridor') {
                return `🚪 7층 복도에서 왼쪽으로 이동 → 709호 계열사 문을 클릭하여 입장하세요`;
            } else if (currentMap === 'floor_7_709_affiliates') {
                return `📄 709호 계열사 사무실 내부에서 바닥의 중요 계약서를 클릭하여 수집하세요!`;
            } else {
                return `🎯 7층으로 이동 → 복도에서 왼쪽 → 709호 계열사에 입장 → 계약서 수집`;
            }
        }

        // 업무 보고서 전용 가이드
        if (itemName === '업무 보고서') {
            if (currentMap === 'floor_7_corridor') {
                return `📋 7층 복도 바닥을 탐색하여 업무 보고서를 수집하세요 (바닥 클릭)`;
            } else {
                return `🎯 7층 복도로 이동하여 업무 보고서를 찾으세요`;
            }
        }

        // 교육 매뉴얼 전용 가이드
        if (itemName === '교육 매뉴얼') {
            if (currentMap === 'floor_8_corridor') {
                return `🚪 8층 복도에서 오른쪽 위 '교육서비스본부' 문으로 들어가세요`;
            } else if (currentMap === 'floor_8_education_service') {
                return `📚 교육서비스본부 사무실 내부에서 바닥의 교육 매뉴얼을 클릭하여 수집하세요!`;
            } else {
                return `🎯 8층으로 이동 → 교육서비스본부에 입장 → 매뉴얼 수집`;
            }
        }

        // 기밀 문서 전용 가이드
        if (itemName === '기밀 문서') {
            if (currentMap === 'floor_9_corridor') {
                return `🚪 9층 복도에서 CEO실 문으로 들어가세요`;
            } else if (currentMap === 'floor_9_ceo_office') {
                return `🔒 CEO실 내부에서 바닥의 기밀 문서를 클릭하여 수집하세요!`;
            } else {
                return `🎯 9층 CEO실로 이동하여 기밀 문서를 찾으세요`;
            }
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
        // 퀘스트별 제출 위치 정의 (QuestData.js의 실제 퀘스트 ID와 NPC 매칭)
        const submissionLocations = {
            0: { floor: 1, map: 'lobby', npc: '경비 아저씨', detail: '1층 로비 오른쪽', icon: '📕' },  // guard
            1: { floor: 1, map: 'lobby', npc: '안내 데스크 직원', detail: '1층 로비 중앙', icon: '📕' },  // reception
            2: { floor: 7, map: 'floor_7_corridor', npc: '김대리', detail: '7층 복도', icon: '📕' },  // kim_deputy
            3: { floor: 7, map: 'floor_7_corridor', npc: '인턴', detail: '7층 복도', icon: '📕' },  // intern
            4: { floor: 7, map: 'floor_7_corridor', npc: '박직원', detail: '7층 복도', icon: '📕' },  // office_worker_2
            5: { floor: 8, map: 'floor_8_corridor', npc: '팀장 이씨', detail: '8층 복도', icon: '📕' },  // manager_lee
            6: { floor: 8, map: 'floor_8_corridor', npc: '교육팀장', detail: '8층 복도', icon: '📕' },  // education_manager
            7: { floor: 9, map: 'floor_9_corridor', npc: '비서 정씨', detail: '9층 복도', icon: '📕' },  // secretary_jung
            8: { floor: 9, map: 'floor_9_ceo_office', npc: 'CEO 김대표', detail: '9층 CEO실', icon: '📕' }  // ceo_kim
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
                return `🎯 ${npcName}를 찾아서 대화하세요! ${submissionLocation.icon} 아이콘을 찾으세요 (스페이스바로 대화)`;
            }

            // 같은 층 내에서 이동
            if (currentFloor === 1) {
                // 1층 로비에서는 이미 같은 공간이므로
                return `➤ ${npcName}를 찾아서 대화하세요! ${submissionLocation.icon} 아이콘을 찾으세요`;
            } else if (currentFloor === 7) {
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