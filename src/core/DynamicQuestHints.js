import { Logger } from '../utils/Logger.js';
import { CONSTANTS } from '../utils/Constants.js';

export class DynamicQuestHints {
    constructor(gameState, questManager, mapManager) {
        this.gameState = gameState;
        this.questManager = questManager;
        this.mapManager = mapManager;
        this.lastHintTime = {};
        this.hintHistory = {};
        this.playerStuckTime = {};
        this.lastPlayerPosition = { x: 0, y: 0 };
        this.positionCheckTime = Date.now();
    }

    // 플레이어 진행 상황에 따른 동적 힌트 생성
    getDynamicHint(currentQuest, player, currentMap) {
        if (!currentQuest) return null;

        const questId = currentQuest.id;
        const now = Date.now();
        
        // 힌트 쿨다운 (30초)
        if (this.lastHintTime[questId] && now - this.lastHintTime[questId] < 30000) {
            return null;
        }

        // 플레이어가 움직이지 않는 시간 추적
        this.trackPlayerMovement(player);
        
        // 컨텍스트 분석
        const context = this.analyzePlayerContext(currentQuest, player, currentMap);
        
        // 상황에 맞는 힌트 생성
        const hint = this.generateContextualHint(currentQuest, context);
        
        if (hint) {
            this.lastHintTime[questId] = now;
            this.recordHint(questId, hint);
            Logger.debug(`💡 동적 힌트 생성: ${hint}`);
        }
        
        return hint;
    }

    trackPlayerMovement(player) {
        const now = Date.now();
        const moved = Math.abs(player.x - this.lastPlayerPosition.x) > 5 || 
                     Math.abs(player.y - this.lastPlayerPosition.y) > 5;
        
        if (moved) {
            this.lastPlayerPosition = { x: player.x, y: player.y };
            this.positionCheckTime = now;
        }
        
        // 30초 이상 같은 위치에 있으면 stuck 상태로 판단
        const stuckTime = now - this.positionCheckTime;
        if (stuckTime > 30000) {
            this.playerStuckTime[this.mapManager.getCurrentMapId()] = stuckTime;
        }
    }

    analyzePlayerContext(quest, player, currentMap) {
        const context = {
            questType: this.determineQuestType(quest),
            playerLocation: { map: currentMap, x: player.x, y: player.y },
            hasRequiredItems: this.checkRequiredItems(quest),
            nearbyNPCs: this.getNearbyNPCs(player, currentMap),
            visitedMaps: this.gameState.visitedMaps,
            timeStuck: this.playerStuckTime[currentMap] || 0,
            previousAttempts: this.hintHistory[quest.id]?.length || 0,
            questProgress: this.getQuestProgress(quest)
        };
        
        return context;
    }

    determineQuestType(quest) {
        if (quest.requiredItem || quest.requiredItems) return 'collection';
        if (quest.target === CONSTANTS.QUEST_TARGETS.TALK_TO_CEO) return 'dialogue';
        if (quest.npcId) return 'npc_interaction';
        return 'exploration';
    }

    checkRequiredItems(quest) {
        if (!quest.requiredItem && !quest.requiredItems) return { hasAll: true, missing: [] };
        
        const required = quest.requiredItems || [quest.requiredItem];
        const playerItems = this.gameState.inventory.map(item => item.name);
        
        const missing = required.filter(item => !playerItems.includes(item));
        
        return {
            hasAll: missing.length === 0,
            missing: missing,
            hasPartial: missing.length < required.length
        };
    }

    getNearbyNPCs(player, currentMap) {
        const mapData = this.mapManager.getCurrentMap();
        if (!mapData || !mapData.npcs) return [];
        
        return mapData.npcs.filter(npc => {
            const distance = Math.sqrt(
                Math.pow(npc.x - player.x, 2) + Math.pow(npc.y - player.y, 2)
            );
            return distance < 100; // 100픽셀 이내
        });
    }

    getQuestProgress(quest) {
        if (quest.steps && quest.progress !== undefined) {
            return {
                current: quest.progress,
                total: quest.maxProgress || quest.steps.length,
                percentage: ((quest.progress / (quest.maxProgress || quest.steps.length)) * 100)
            };
        }
        return { current: 0, total: 1, percentage: 0 };
    }

    generateContextualHint(quest, context) {
        const { questType, hasRequiredItems, nearbyNPCs, timeStuck, previousAttempts } = context;
        
        // 플레이어가 오래 멈춰있으면 더 구체적인 힌트 제공 (시간 조정)
        const urgency = timeStuck > 180000 ? 'urgent' : timeStuck > 90000 ? 'helpful' : 'gentle';
        
        switch (questType) {
            case 'collection':
                return this.getCollectionHint(quest, hasRequiredItems, context, urgency);
            case 'dialogue':
                return this.getDialogueHint(quest, nearbyNPCs, context, urgency);
            case 'npc_interaction':
                return this.getNPCInteractionHint(quest, nearbyNPCs, context, urgency);
            case 'exploration':
                return this.getExplorationHint(quest, context, urgency);
            default:
                return this.getGenericHint(quest, context, urgency);
        }
    }

    getCollectionHint(quest, hasRequiredItems, context, urgency) {
        if (hasRequiredItems.hasAll) {
            return this.getSubmissionHint(quest, context, urgency);
        }
        
        const missing = hasRequiredItems.missing;
        const hints = [];
        
        missing.forEach(item => {
            const locationHint = this.getItemLocationHint(item, context, urgency);
            if (locationHint) hints.push(locationHint);
        });
        
        if (hints.length === 0) {
            switch (urgency) {
                case 'urgent':
                    return `🆘 ${missing.join(', ')}이(가) 필요해요! 각 층을 자세히 탐색해보세요. 사무실 안쪽까지 확인하세요!`;
                case 'helpful':
                    return `🔍 ${missing[0]}을(를) 찾고 계시나요? 해당 부서 사무실을 방문해보세요. 문을 클릭하여 들어갈 수 있어요.`;
                default:
                    return `💭 ${missing[0]}이(가) 어디 있을지 생각해보세요. 관련된 부서를 찾아가보는 건 어떨까요?`;
            }
        }
        
        return hints[0];
    }

    getItemLocationHint(itemName, context, urgency) {
        const itemHints = {
            '명함': {
                gentle: '💼 영업팀에서 명함을 구할 수 있을 것 같아요.',
                helpful: '📍 2층 영업팀 사무실을 방문해보세요. 202호에 들어가서 찾아보세요.',
                urgent: '🚨 2층 → 202호 영업팀 → 사무실 내부를 클릭하여 명함을 찾으세요!'
            },
            '프로젝트 파일': {
                gentle: '📁 개발팀에서 프로젝트 파일을 얻을 수 있을 거예요.',
                helpful: '🎯 7층 복도에서 오른쪽으로 가서 710호 본사IT에 들어가보세요.',
                urgent: '⚡ 7층 복도 → 오른쪽 이동 → 710호 본사IT 문 클릭 → 프로젝트 파일 수집!'
            },
            '교육 자료': {
                gentle: '📚 교육팀에서 교육 자료를 구할 수 있을 것 같네요.',
                helpful: '📖 6층 교육팀에 가서 교육 담당자와 대화해보세요.',
                urgent: '📋 6층 → 교육팀 찾기 → 교육 담당자와 대화 → 교육 자료 요청!'
            },
            '회계 보고서': {
                gentle: '💰 회계팀에서 보고서를 얻을 수 있을 거예요.',
                helpful: '🧮 회계팀 사무실을 찾아가서 회계 담당자에게 문의해보세요.',
                urgent: '💼 회계팀 위치 확인 → 담당자 대화 → 회계 보고서 수집!'
            }
        };
        
        const hint = itemHints[itemName];
        return hint ? hint[urgency] : null;
    }

    getSubmissionHint(quest, context, urgency) {
        const npcName = this.getNPCNameById(quest.npcId);
        
        switch (urgency) {
            case 'urgent':
                return `✅ 필요한 아이템을 모두 모았어요! ${npcName}에게 가서 제출하세요!`;
            case 'helpful':
                return `🎁 아이템을 모두 수집했으니 ${npcName}를 찾아가서 대화해보세요.`;
            default:
                return `💡 이제 ${npcName}에게 갈 시간인 것 같아요.`;
        }
    }

    getDialogueHint(quest, nearbyNPCs, context, urgency) {
        if (nearbyNPCs.length > 0) {
            const npc = nearbyNPCs[0];
            switch (urgency) {
                case 'urgent':
                    return `💬 ${npc.name} 앞에 있어요! 스페이스바를 눌러 대화하세요!`;
                case 'helpful':
                    return `👋 ${npc.name}와 대화할 수 있어요. 스페이스바를 누르세요.`;
                default:
                    return `💭 ${npc.name}에게 말을 걸어보세요.`;
            }
        }
        
        const targetNPC = this.getNPCNameById(quest.npcId);
        switch (urgency) {
            case 'urgent':
                return `🎯 ${targetNPC}를 찾아야 해요! 미니맵을 확인하거나 각 층을 탐색해보세요!`;
            case 'helpful':
                return `🗺️ ${targetNPC}의 위치를 찾아보세요. 미니맵(M키)을 활용해보세요.`;
            default:
                return `🤔 ${targetNPC}가 어디 있을까요?`;
        }
    }

    getNPCInteractionHint(quest, nearbyNPCs, context, urgency) {
        return this.getDialogueHint(quest, nearbyNPCs, context, urgency);
    }

    getExplorationHint(quest, context, urgency) {
        const currentMap = context.playerLocation.map;
        
        if (urgency === 'urgent') {
            return `🗺️ 현재 ${currentMap}에 있어요. 엘리베이터를 이용해 다른 층도 탐색해보세요!`;
        } else if (urgency === 'helpful') {
            return `🔍 주변을 더 자세히 살펴보세요. 놓친 것이 있을 수 있어요.`;
        } else {
            return `🚀 새로운 곳을 탐험해보는 건 어떨까요?`;
        }
    }

    getGenericHint(quest, context, urgency) {
        switch (urgency) {
            case 'urgent':
                return `❓ 막히셨나요? 퀘스트 가이드(Q키)를 다시 확인해보세요!`;
            case 'helpful':
                return `💡 현재 퀘스트: ${quest.title}. 목표를 다시 확인해보세요.`;
            default:
                return `🎯 차근차근 진행해보세요.`;
        }
    }

    getNPCNameById(npcId) {
        const npcNames = {
            'guard': '경비원',
            'reception': '접수원',
            'kim_deputy': '김대리',
            'manager_lee': '이과장',
            'education_manager': '교육 담당자',
            'ceo_kim': '김대표',
            'sales_manager': '영업 담당자',
            'dev_manager': '개발 담당자',
            'accounting_manager': '회계 담당자'
        };
        
        return npcNames[npcId] || 'NPC';
    }

    recordHint(questId, hint) {
        if (!this.hintHistory[questId]) {
            this.hintHistory[questId] = [];
        }
        
        this.hintHistory[questId].push({
            hint: hint,
            timestamp: Date.now()
        });
        
        // 최대 5개까지만 기록 유지
        if (this.hintHistory[questId].length > 5) {
            this.hintHistory[questId].shift();
        }
    }

    // 특별한 상황에 대한 맞춤형 힌트
    getEmergencyHint(situation) {
        const emergencyHints = {
            'lost': '🧭 미니맵(M키)을 열어서 현재 위치를 확인해보세요!',
            'no_progress': '⚡ 퀘스트 가이드(Q키)에서 현재 목표를 다시 확인해보세요!',
            'inventory_full': '🎒 인벤토리(I키)를 열어서 가지고 있는 아이템을 확인해보세요!',
            'wrong_floor': '🛗 엘리베이터를 이용해서 다른 층으로 이동해보세요!',
            'missing_interaction': '👆 NPC 근처에서 스페이스바를 눌러 대화하세요!'
        };
        
        return emergencyHints[situation] || '❓ 도움이 필요하시면 퀘스트 가이드를 확인해보세요!';
    }

    // 플레이어 행동 패턴 분석하여 힌트 개선
    analyzePlayerBehavior() {
        // 향후 확장: 플레이어의 행동 패턴을 분석하여 더 개인화된 힌트 제공
        return {
            preferredHintStyle: 'detailed', // 'brief', 'detailed', 'visual'
            commonMistakes: [],
            learningProgress: 'beginner' // 'beginner', 'intermediate', 'advanced'
        };
    }
}