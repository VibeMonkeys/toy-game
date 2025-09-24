import { Logger } from '../utils/Logger.js';
import { QUEST_DATA } from '../data/QuestData.js';

export class QuestGuide {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.animationTime = 0;
        this.lastInventoryState = ''; // 디버깅용 상태 추적
        this.visible = true; // 게임 시작과 함께 표시
        // Logger는 static 클래스이므로 인스턴스 생성 불필요
    }
    show() {
        this.visible = true;
    }

    hide() {
        this.visible = false;
    }

    isVisible() {
        return this.visible;
    }

    draw(questSystem, gameState) {
        // 가이드가 숨겨진 상태면 렌더링하지 않음
        if (!this.visible) return;
        
        // QuestManager 접근
        const questManager = questSystem?.questManager;
        
        // 현재 활성 퀘스트 가져오기 (실시간 상태 반영)
        const currentQuest = this.getQuestData(gameState, questManager);
        if (!currentQuest) return;

        this.animationTime += 16; // 대략 60fps 기준

        // 현재 맵 ID 가져오기
        const currentMapId = gameState?.currentMap || 'lobby';
        
        // 가이드 텍스트 생성 (questManager 전달)
        const guideText = this.getGuideText(gameState, currentMapId, questManager);

        // 가이드 박스 설정 (높이 증가)
        const boxWidth = 600;
        const boxHeight = 100;
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
        this.ctx.fillText(`${currentQuest.title}`, boxX + boxWidth / 2, boxY + 25);

        // 현재 해야 할 일 가이드 (줄바꿈 지원)
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '14px Arial';
        this.drawMultilineText(guideText, boxX + boxWidth / 2, boxY + 45, 18);

        // 퀘스트 상태 표시 (우측 상단)
        let statusText = '';
        let statusColor = '#ffffff';

        if (!currentQuest.started) {
            statusText = '퀘스트 받기 필요';
            statusColor = '#ffaa00';
        } else if (currentQuest.completed) {
            statusText = '완료됨';
            statusColor = '#00ff00';
        } else {
            const hasRequiredItem = this.hasRequiredItems(currentQuest, gameState?.inventory || []);
            if (hasRequiredItem) {
                statusText = '제출 가능';
                statusColor = '#00ff00';
            } else {
                statusText = '수집 중';
                statusColor = '#ffaa00';
            }
        }

        this.ctx.fillStyle = statusColor;
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'right';
        this.ctx.fillText(statusText, boxX + boxWidth - 15, boxY + 25);

        // 진행도 표시 (우측 하단, 충분한 간격)
        const progressText = `${currentQuest.progress}/${currentQuest.maxProgress}`;
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.font = 'bold 12px Arial';
        this.ctx.textAlign = 'right';
        this.ctx.fillText(progressText, boxX + boxWidth - 15, boxY + boxHeight - 15);

        // textAlign 복원
        this.ctx.textAlign = 'center';
    }

    // 퀘스트 데이터 캐싱 및 중복 계산 방지
    getQuestData(gameState, questManager) {
        Logger.debug('🔍 QuestGuide.getQuestData 호출됨');
        Logger.debug('📊 gameState:', gameState ? 'exists' : 'null');
        Logger.debug('📊 questManager:', questManager ? 'exists' : 'null');

        // QuestManager를 통해 현재 활성 퀘스트 가져오기 (실시간 상태 반영)
        if (questManager) {
            const activeQuest = questManager.getCurrentActiveQuest();
            if (activeQuest) {
                Logger.debug(`✅ QuestManager에서 활성 퀘스트 발견: ${activeQuest.title}`);
                Logger.debug(`📋 퀘스트 상태 - ID: ${activeQuest.id}, started: ${activeQuest.started}, completed: ${activeQuest.completed}`);
                return activeQuest;
            } else {
                Logger.debug('❌ QuestManager에서 활성 퀘스트 없음');
            }
        }

        // 폴백: QUEST_DATA에서 직접 찾기 - 첫 번째 미완료 퀘스트
        Logger.debug('📋 QUEST_DATA에서 직접 검색 시작...');
        Logger.debug('📋 총 퀘스트 개수:', QUEST_DATA.length);

        const activeQuest = QUEST_DATA.find(quest => {
            Logger.debug(`🔍 퀘스트 검사: ${quest.title} (ID: ${quest.id})`);
            Logger.debug(`   - completed: ${quest.completed}, started: ${quest.started}`);

            if (quest.completed) {
                Logger.debug(`   ❌ 이미 완료됨`);
                return false;
            }

            // 전제 조건이 있는 경우 확인
            if (quest.prerequisites && quest.prerequisites.length > 0) {
                Logger.debug(`   📋 전제조건 확인: ${quest.prerequisites}`);
                const inventory = gameState?.inventory || [];
                const collectedItems = gameState?.collectedItems || [];
                Logger.debug(`   📦 인벤토리: ${inventory.map(i => i.name)}`);
                Logger.debug(`   📦 수집된 아이템: ${collectedItems.map(i => i.name)}`);

                const hasPrerequisites = quest.prerequisites.every(prereq => {
                    const hasInInventory = inventory.some(item => item.name === prereq);
                    const hasInCollected = collectedItems.some(item => item.name === prereq);
                    const hasPrereq = hasInInventory || hasInCollected;
                    Logger.debug(`     - ${prereq}: ${hasPrereq ? '✅' : '❌'}`);
                    return hasPrereq;
                });

                if (!hasPrerequisites) {
                    Logger.debug(`   ❌ 전제조건 불충족`);
                    return false;
                }
            }

            Logger.debug(`   ✅ 활성 퀘스트로 선정!`);
            return true;
        });

        if (!activeQuest) {
            Logger.debug('🎊 모든 퀘스트 완료됨');
            return null;
        }

        Logger.debug(`🎯 최종 선정된 퀘스트: ${activeQuest.title} (ID: ${activeQuest.id})`);
        return activeQuest;
    }

    getGuideText(gameState, currentMapId, questManager) {
        if (!gameState || !currentMapId) return '';

        // 진행 중인 퀘스트 찾기 (실시간 상태 반영)
        const activeQuest = this.getQuestData(gameState, questManager);
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
        Logger.debug(`🔍 퀘스트 단계 판별 시작: ${quest.title}`);
        Logger.debug(`📊 퀘스트 상태 - completed: ${quest.completed}, started: ${quest.started}, itemSubmitted: ${quest.itemSubmitted}`);
        Logger.debug(`🎒 인벤토리:`, gameState?.inventory?.map(item => item.name) || []);
        
        // 퀘스트가 완료된 경우
        if (quest.completed) {
            Logger.debug(`✅ 퀘스트 완료됨 → COMPLETED`);
            return 'COMPLETED';
        }
        
        // 퀘스트를 아직 받지 않은 경우
        if (!quest.started) {
            Logger.debug(`📝 퀘스트 시작 안됨 → NEED_TO_RECEIVE`);
            return 'NEED_TO_RECEIVE';
        }
        
        // 퀘스트를 받았지만 아이템을 아직 수집하지 않은 경우
        const hasRequiredItem = this.hasRequiredItems(quest, gameState.inventory || []);
        Logger.debug(`📦 필요 아이템 보유 여부: ${hasRequiredItem}`);
        
        if (!hasRequiredItem) {
            Logger.debug(`📦 아이템 수집 필요 → NEED_TO_COLLECT`);
            return 'NEED_TO_COLLECT';
        }
        
        // 아이템은 있지만 아직 제출하지 않은 경우
        if (!quest.itemSubmitted) {
            Logger.debug(`📤 아이템 제출 필요 → NEED_TO_SUBMIT`);
            return 'NEED_TO_SUBMIT';
        }
        
        Logger.debug(`🎯 모든 조건 완료 → COMPLETED`);
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
            return `${npcInfo.locationDescription}의 ${npcInfo.name}에게서\n퀘스트를 받으세요`;
        }
        
        // 다른 층에 있는 경우
        return `${npcInfo.floor}층으로 이동 후\n${npcInfo.locationDescription}의 ${npcInfo.name}에게서\n퀘스트를 받으세요`;
    }

    // 2. 아이템 수집 단계 가이드 
    getItemCollectionGuide(quest, currentMapId) {
        const itemName = quest.requiredItem || (quest.requiredItems && quest.requiredItems[0]);
        if (!itemName) {
            return `필요한 아이템을 수집하세요`;
        }

        // 기존 위치 가이드 로직 활용
        const locationGuide = this.getLocationGuide(itemName, currentMapId);
        return `아이템 수집 필요: ${itemName}\n${locationGuide}`;
    }

    // 3. 아이템 제출 단계 가이드
    getItemSubmissionGuide(quest, currentMapId) {
        const npcInfo = this.getNPCLocationInfo(quest.questGiver);
        const itemName = quest.requiredItem || (quest.requiredItems && quest.requiredItems.join(', '));

        // 미니게임 챌린지가 필요한 경우 우선 안내
        if (quest.minigameChallenge && quest.minigameChallenge.required && !quest.minigameChallenge.completed) {
            if (!npcInfo) {
                return `${quest.questGiver}에게 가서\n미니게임 챌린지를 완료하세요\n${quest.minigameChallenge.description}`;
            }

            const currentFloor = this.getCurrentFloor(currentMapId);
            if (currentFloor === npcInfo.floor) {
                return `${npcInfo.locationDescription}의 ${npcInfo.name}에게 가서\n미니게임 챌린지를 완료하세요\n${quest.minigameChallenge.description}`;
            } else {
                return `${npcInfo.floor}층 ${npcInfo.locationDescription}의\n${npcInfo.name}에게 가서\n미니게임 챌린지를 완료하세요`;
            }
        }

        if (!npcInfo) {
            return `${itemName}을 가지고\n${quest.questGiver}에게 제출하세요`;
        }

        const currentFloor = this.getCurrentFloor(currentMapId);

        // 같은 층에 있는 경우
        if (currentFloor === npcInfo.floor) {
            return `${itemName}을 가지고\n${npcInfo.locationDescription}의 ${npcInfo.name}에게\n제출하세요`;
        }

        // 다른 층에 있는 경우
        return `${itemName}을 가지고 ${npcInfo.floor}층으로 이동 후\n${npcInfo.locationDescription}의 ${npcInfo.name}에게\n제출하세요`;
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
            return `다음 퀘스트: ${nextQuest.title}`;
        }
        
        return `다음 퀘스트: ${nextQuest.title}\n${npcInfo.floor}층 ${npcInfo.locationDescription}의\n${npcInfo.name}에게 대화하세요`;
    }

    // NPC 위치 정보 가져오기 (휴넷 생존기 전용)
    getNPCLocationInfo(npcId) {
        const npcLocationMap = {
            // 1층 로비 NPC - 휴넷 생존기 실제 NPC들
            'guard': {
                name: '경비 아저씨',
                floor: 1,
                locationDescription: '1층 로비 우측'
            },
            'reception': {
                name: '안내 데스크',
                floor: 1,
                locationDescription: '1층 로비 중앙 안내 데스크'
            },
            'janitor': {
                name: '청소 아저씨',
                floor: 1,
                locationDescription: '1층 로비 좌측'
            },
            // 1층 카페 NPC들
            'starbucks_barista': {
                name: '스타벅스 바리스타',
                floor: 1,
                locationDescription: '1층 스타벅스'
            },
            'mammoth_owner': {
                name: '매머드 커피 사장님',
                floor: 1,
                locationDescription: '1층 매머드 커피'
            },
            'gukbab_ajumma': {
                name: '국밥92 이모님',
                floor: 1,
                locationDescription: '1층 국밥92'
            },
            'timhortons_staff': {
                name: '팀 호튼스 직원',
                floor: 1,
                locationDescription: '1층 팀 호튼스'
            },
            // 7층 IT팀 & 계열사 NPC들
            'kim_deputy': {
                name: '김대리',
                floor: 7,
                locationDescription: '7층 710호 본사 IT'
            },
            'office_worker_1': {
                name: '동료 직원',
                floor: 7,
                locationDescription: '7층 710호 본사 IT'
            },
            'office_worker_2': {
                name: '박직원',
                floor: 7,
                locationDescription: '7층 709호 계열사'
            },
            // 8층 본부들 NPC들
            'manager_lee': {
                name: '이과장',
                floor: 8,
                locationDescription: '8층 영업+교육지원본부'
            },
            'education_manager': {
                name: '교육매니저',
                floor: 8,
                locationDescription: '8층 교육서비스본부'
            },
            'ai_researcher': {
                name: 'AI 연구원',
                floor: 8,
                locationDescription: '8층 AI연구소'
            },
            'librarian': {
                name: '도서관 사서',
                floor: 8,
                locationDescription: '8층 상상력발전소'
            },
            // 9층 경영진 NPC들
            'yoon_dohyun': {
                name: '윤도현',
                floor: 9,
                locationDescription: '9층 인사경영실'
            },
            'kang_haebin': {
                name: '강해빈',
                floor: 9,
                locationDescription: '9층 인사경영실'
            },
            'ceo_kim': {
                name: '조영탁 CEO',
                floor: 9,
                locationDescription: '9층 CEO실'
            },
            // 옥상 NPC들
            'rooftop_worker': {
                name: '옥상 관리인',
                floor: 'R',
                locationDescription: '옥상 휴식공간'
            },
            // 특수 퀘스트
            'auto_start': {
                name: '자동 시작',
                floor: 8,
                locationDescription: '8층 진입 시 자동 발동'
            },
            'hidden_trigger': {
                name: '특별 조건',
                floor: 'R',
                locationDescription: '옥상에서 특별 조건 달성 시'
            }
        };

        return npcLocationMap[npcId];
    }

    getLocationGuide(itemName, currentMap) {
        // 휴넷 생존기 전용 아이템 위은e
        const itemLocations = {
            // 1층 메인 퀘스트 아이템
            '임시 출입카드': { floor: 1, map: 'lobby', detail: '1층 로비 바닥', specific: '로비를 상하좌우로 이동하며 바닥을 확인하세요' },
            '신입사원 서류': { floor: 1, map: 'lobby', detail: '1층 로비 바닥', specific: '안내 데스크 근처의 서류를 찾으세요' },

            // 7층 메인 퀘스트 아이템
            '커피 주문서': { floor: 7, map: 'floor_7_710_main_it', detail: '710호 본사 IT', specific: '710호 IT팀 사무실에서 커피 주문서를 찾으세요' },
            '점심 영수증': { floor: 7, map: 'floor_7_710_main_it', detail: '710호 본사 IT', specific: '점심시간 후 IT팀에서 영수증을 찾으세요' },

            // 8층 메인 퀘스트 아이템
            '부서 탐방 노트': { floor: 8, map: 'floor_8_education_service', detail: '8층 교육서비스본부', specific: '8층 각 본부를 돌아다니며 탐방 노트를 작성하세요' },
            '회의록': { floor: 8, map: 'floor_8_education_service', detail: '8층 영업+교육지원본부', specific: '이과장이 있는 본부에서 회의록을 찾으세요' },
            '교육 수료증': { floor: 8, map: 'floor_8_education_service', detail: '8층 교육서비스본부', specific: '교육매니저와 배울이 끈난 후 수료증을 수령하세요' },

            // 9층 메인 퀘스트 아이템
            '9층 출입 허가서': { floor: 9, map: 'floor_9_ceo_office', detail: '9층 CEO실', specific: '윤도현으로부터 9층 출입 허가를 얻으세요' },
            'CEO 면담 요청서': { floor: 9, map: 'floor_9_ceo_office', detail: '9층 CEO실', specific: 'CEO실 내에서 면담 요청서를 찾으세요' },

            // 옵상 히든 퀘스트 아이템
            '우정의 증표': { floor: 'R', map: 'rooftop', detail: '옵상 휴식공간', specific: '옵상에서 과거 직원들이 남긴 우정의 증표를 찾으세요' },

            // 서브 퀘스트 아이템들
            '스타벅스 포인트 카드': { floor: 1, map: 'starbucks', detail: '스타벅스 카페' },
            '매머드 커피 단골 카드': { floor: 1, map: 'mammoth_coffee', detail: '매머드 커피' },
            '단골 도장': { floor: 1, map: 'kook_bab_92', detail: '국법92' },
            '메뉴 마스터 증서': { floor: 1, map: 'tim_hortons', detail: '팀 호튤스' }
        };

        const targetLocation = itemLocations[itemName];
        if (!targetLocation) {
            return `${itemName}을 찾아서\n가까이 가면 자동으로 수집됩니다`;
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
        // 휴넷 생존기 맵 구조에 맞게 업데이트
        if (mapId.includes('lobby') || mapId.includes('starbucks') || mapId.includes('mammoth') ||
            mapId.includes('kook_bab') || mapId.includes('tim_hortons')) return 1;
        if (mapId.includes('floor_7') || mapId.includes('709') || mapId.includes('710')) return 7;
        if (mapId.includes('floor_8') || mapId.includes('it_division') || mapId.includes('hr_office') ||
            mapId.includes('ai_research') || mapId.includes('education_service') || mapId.includes('sales_support')) return 8;
        if (mapId.includes('floor_9') || mapId.includes('ceo_office')) return 9;
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
                return `${targetLocation.specific}`;
            }
            return `${itemName}이 이 방에 있습니다\n가까이 가면 자동으로 수집됩니다`;
        }

        // 프로젝트 파일 전용 상세 가이드 - 현재 위치에 따라 다른 안내
        if (itemName === '프로젝트 파일') {
            Logger.debug(`📁 프로젝트 파일 가이드: currentMap=${currentMap}`);
            if (currentMap === 'floor_7_corridor') {
                return `7층 복도에서 오른쪽으로 이동\n710호 본사IT에 입장하세요`;
            } else if (currentMap === 'floor_7_710_main_it') {
                Logger.debug(`🎯 710호 안에 있음! 파일 수집 안내`);
                return `710호 본사IT 사무실에서\n프로젝트 파일 근처로 이동하면\n자동으로 수집됩니다`;
            } else {
                return `7층으로 이동 후\n복도에서 오른쪽으로 이동\n710호 본사IT에 입장하여 파일 수집`;
            }
        }

        // 중요 계약서 전용 가이드
        if (itemName === '중요 계약서') {
            if (currentMap === 'floor_7_corridor') {
                return `7층 복도에서 왼쪽으로 이동\n709호 계열사에 입장하세요`;
            } else if (currentMap === 'floor_7_709_affiliates') {
                return `709호 계열사 사무실에서\n중요 계약서 근처로 이동하면\n자동으로 수집됩니다`;
            } else {
                return `7층으로 이동 후\n복도에서 왼쪽으로 이동\n709호 계열사에 입장하여 계약서 수집`;
            }
        }

        // 업무 보고서 전용 가이드
        if (itemName === '업무 보고서') {
            if (currentMap === 'floor_7_corridor') {
                return `7층 복도를 탐색하여\n업무 보고서를 찾아\n가까이 가면 자동으로 수집됩니다`;
            } else {
                return `7층 복도로 이동하여\n업무 보고서를 찾으세요`;
            }
        }

        // 교육 매뉴얼 전용 가이드
        if (itemName === '교육 매뉴얼') {
            if (currentMap === 'floor_8_corridor') {
                return `8층 복도에서 오른쪽 위로 이동\n교육서비스본부에 입장하세요`;
            } else if (currentMap === 'floor_8_education_service') {
                return `교육서비스본부 사무실에서\n교육 매뉴얼 근처로 이동하면\n자동으로 수집됩니다`;
            } else {
                return `8층으로 이동 후\n교육서비스본부에 입장하여\n매뉴얼 수집`;
            }
        }

        // 기밀 문서 전용 가이드
        if (itemName === '기밀 문서') {
            if (currentMap === 'floor_9_corridor') {
                return `9층 복도에서\nCEO실에 입장하세요`;
            } else if (currentMap === 'floor_9_ceo_office') {
                return `CEO실에서\n기밀 문서 근처로 이동하면\n자동으로 수집됩니다`;
            } else {
                return `9층 CEO실로 이동하여\n기밀 문서를 찾으세요`;
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

    // 여러 줄 텍스트 그리기 (줄바꿈 지원)
    drawMultilineText(text, x, y, lineHeight) {
        const lines = text.split('\n');
        lines.forEach((line, index) => {
            this.ctx.fillText(line, x, y + (index * lineHeight));
        });
    }
}