import { QUEST_DATA, QUEST_VALIDATION } from '../data/QuestData.js';
import { Logger } from '../utils/Logger.js';

// 퀘스트 관리 전용 클래스
export class QuestManager {
    constructor() {
        this.quests = JSON.parse(JSON.stringify(QUEST_DATA)); // 깊은 복사
        this.currentQuest = 0;
        this.gameState = null; // Game.js에서 설정됨
    }

    // 게임 상태 설정 (Game.js에서 호출)
    setGameState(gameState) {
        this.gameState = gameState;
    }

    // 현재 활성 퀘스트 반환
    getCurrentQuest() {
        return this.quests[this.currentQuest] || null;
    }

    // 특정 ID의 퀘스트 반환
    getQuestById(id) {
        return this.quests.find(quest => quest.id === id) || null;
    }

    // NPC별 퀘스트 반환 (전제조건 체크 포함)
    getQuestByNPC(npcId) {
        Logger.debug(`🔍 NPC ${npcId}에 대한 퀘스트 검색`);
        const quest = this.quests.find(quest => 
            quest.questGiver === npcId && 
            !quest.completed && 
            this.checkPrerequisites(quest)
        );
        if (quest) {
            Logger.debug(`✅ 퀘스트 발견: ${quest.title} (ID: ${quest.id})`);
        } else {
            Logger.debug(`❌ NPC ${npcId}에 대한 활성 퀘스트 없음`);
        }
        return quest || null;
    }

    // 퀘스트 전제조건 체크
    checkPrerequisites(quest) {
        if (!quest.prerequisites || quest.prerequisites.length === 0) {
            return true; // 전제조건이 없으면 활성화 가능
        }

        // 현재 인벤토리에서 전제조건 아이템들이 모두 있는지 확인
        const playerInventory = this.gameState?.collectedItems || [];
        const hasAllPrerequisites = quest.prerequisites.every(prereqItem =>
            playerInventory.some(invItem => invItem.name === prereqItem)
        );

        Logger.debug(`🔍 퀘스트 "${quest.title}" 전제조건 체크:`, {
            prerequisites: quest.prerequisites,
            inventory: playerInventory.map(item => item.name),
            satisfied: hasAllPrerequisites
        });

        return hasAllPrerequisites;
    }

    // 완료된 퀘스트 수 반환
    getCompletedQuestCount() {
        return this.quests.filter(quest => quest.completed).length;
    }

    // 모든 퀘스트 완료 여부
    areAllQuestsCompleted() {
        return this.quests.every(quest => quest.completed);
    }

    // 퀘스트 완료 처리
    completeQuest(questId) {
        const quest = this.getQuestById(questId);
        if (quest) {
            quest.completed = true;
            quest.progress = quest.maxProgress;

            Logger.info(`✅ 퀘스트 완료: ${quest.title} (ID: ${questId})`);

            if (questId === this.currentQuest) {
                this.currentQuest = Math.min(this.currentQuest + 1, this.quests.length - 1);
                Logger.debug(`➡️ 다음 퀘스트로 이동: ${this.currentQuest}`);
            }

            return true;
        }
        return false;
    }

    // 퀘스트 진행도 업데이트
    updateQuestProgress(questId, progress) {
        const quest = this.getQuestById(questId);
        if (quest) {
            quest.progress = Math.min(progress, quest.maxProgress);
            if (quest.progress >= quest.maxProgress) {
                quest.completed = true;
            }
            return true;
        }
        return false;
    }

    // 아이템 제출 가능 여부 확인
    canSubmitItems(npcId, inventory) {
        Logger.debug(`🔍 퀘스트 체크: NPC ${npcId}`);
        Logger.debug('📦 플레이어 인벤토리:', inventory.map(item => item.name));

        const quest = this.getQuestByNPC(npcId);
        if (!quest) {
            Logger.debug(`❌ ${npcId}에 대한 퀘스트가 없습니다.`);
            return { canSubmit: false, reason: '퀘스트가 없습니다.' };
        }

        // 이미 완료된 퀘스트는 제외
        if (quest.completed) {
            Logger.debug(`⭐ 퀘스트 이미 완료됨: ${quest.title}`);
            return { canSubmit: false, reason: '이미 완료된 퀘스트입니다.' };
        }

        // ⭐ 핵심: 퀘스트를 아직 시작하지 않았으면 제출 불가능
        if (!quest.started) {
            Logger.debug(`🚫 퀘스트를 아직 받지 않았습니다: ${quest.title}`);
            return { canSubmit: false, reason: '퀘스트를 먼저 받으세요.' };
        }

        Logger.debug('📋 발견된 퀘스트:', quest.title, '필요 아이템:', quest.requiredItem || quest.requiredItems);

        if (!QUEST_VALIDATION.canComplete(quest, inventory)) {
            const missingItems = QUEST_VALIDATION.getMissingItems(quest, inventory);
            Logger.debug('❌ 부족한 아이템:', missingItems);
            return {
                canSubmit: false,
                reason: `필요한 아이템: ${missingItems.join(', ')}`,
                missingItems: missingItems
            };
        }

        Logger.debug('✅ 퀘스트 완료 가능!');
        return { canSubmit: true, quest: quest };
    }

    // NPC와 대화할 때 퀘스트 시작
    startQuestFromNPC(npcId) {
        const quest = this.getQuestByNPC(npcId);
        if (!quest) {
            Logger.debug(`❌ ${npcId}에 대한 퀘스트가 없습니다.`);
            return { success: false, message: '받을 수 있는 퀘스트가 없습니다.' };
        }

        if (quest.completed) {
            Logger.debug(`⭐ 퀘스트 이미 완료됨: ${quest.title}`);
            return { success: false, message: '이미 완료된 퀘스트입니다.' };
        }

        if (quest.started) {
            Logger.debug(`🔄 퀘스트 이미 진행 중: ${quest.title}`);
            return { success: false, message: '이미 진행 중인 퀘스트입니다.' };
        }

        // 전제 조건 확인
        if (!this.checkPrerequisites(quest)) {
            const missingPrereqs = QUEST_VALIDATION.getMissingPrerequisites(quest, this.gameState?.inventory || []);
            Logger.debug(`🚫 전제 조건 부족:`, missingPrereqs);
            return { 
                success: false, 
                message: `먼저 필요한 것: ${missingPrereqs.join(', ')}` 
            };
        }

        // 퀘스트 시작!
        quest.started = true;
        Logger.debug(`🎯 퀘스트 시작: ${quest.title}`);
        
        return { 
            success: true, 
            quest: quest,
            message: `새로운 퀘스트를 받았습니다: ${quest.title}` 
        };
    }

    // 현재 활성 퀘스트 가져오기 (실시간 상태 반영)
    getCurrentActiveQuest() {
        // 시작되었지만 완료되지 않은 퀘스트 찾기
        let activeQuest = this.quests.find(quest => quest.started && !quest.completed);
        
        if (activeQuest) {
            Logger.debug(`🎯 진행 중인 퀘스트 발견: ${activeQuest.title}`);
            return activeQuest;
        }
        
        // 시작되지 않은 퀘스트 중 전제 조건을 만족하는 첫 번째 퀘스트
        activeQuest = this.quests.find(quest => {
            if (quest.completed || quest.started) return false;
            
            // 전제 조건 확인
            if (quest.prerequisites && quest.prerequisites.length > 0) {
                const hasPrerequisites = quest.prerequisites.every(prereq => 
                    this.gameState?.inventory?.some(item => item.name === prereq)
                );
                if (!hasPrerequisites) return false;
            }
            
            return true;
        });
        
        if (activeQuest) {
            Logger.debug(`🆕 다음 시작 가능한 퀘스트: ${activeQuest.title}`);
        } else {
            Logger.debug(`🎊 모든 퀘스트 완료됨`);
        }
        
        return activeQuest;
    }

    // 퀘스트 기버인지 확인
    isQuestGiver(npcId) {
        const quest = this.getQuestByNPC(npcId);
        return quest && !quest.completed && !quest.started;
    }

    // 아이템 제출 처리
    submitItems(npcId, inventory, gameState) {
        Logger.debug(`🎯 아이템 제출 시작: NPC ${npcId}`);

        const submission = this.canSubmitItems(npcId, inventory);
        if (!submission.canSubmit) {
            Logger.debug(`❌ 제출 실패: ${submission.reason}`);
            return { success: false, message: submission.reason };
        }

        const quest = submission.quest;
        Logger.debug(`📝 퀘스트 처리 중: ${quest.title} (ID: ${quest.id})`);

        // 아이템 제거 처리
        this._removeQuestItems(quest, inventory, gameState);

        // 보상 아이템 추가
        this._addRewardItem(quest, inventory, gameState);

        // 퀘스트 완료 처리
        quest.completed = true;
        quest.itemSubmitted = true;
        quest.progress = quest.maxProgress;

        Logger.info(`✅ 퀘스트 완료: ${quest.title}`);

        // 다음 퀘스트로 이동 (순차적으로)
        const previousQuest = quest.id;
        if (quest.id === this.currentQuest) {
            this.currentQuest = Math.min(this.currentQuest + 1, this.quests.length - 1);
            Logger.debug(`➡️ 다음 퀘스트로 이동: ${this.currentQuest}`);
        }

        // 완료 메시지와 연결성 설명 생성
        const completionMessage = this._generateCompletionMessage(quest, previousQuest);
        const nextStepInfo = this._generateNextQuestInfo(previousQuest);

        return {
            success: true,
            message: completionMessage,
            nextStepInfo: nextStepInfo,
            quest: quest
        };
    }

    // 아이템 제거 처리 (private)
    _removeQuestItems(quest, inventory, gameState) {
        const itemsToRemove = [];

        if (quest.requiredItem) {
            itemsToRemove.push(quest.requiredItem);
        }

        if (quest.requiredItems) {
            itemsToRemove.push(...quest.requiredItems);
        }

        itemsToRemove.forEach(itemName => {
            // inventory에서 제거
            const inventoryIndex = inventory.findIndex(item => item.name === itemName);
            if (inventoryIndex !== -1) {
                inventory.splice(inventoryIndex, 1);
                gameState.itemsCollected--;
            }

            // collectedItems에서 제거
            const collectedIndex = gameState.collectedItems.findIndex(item => item.name === itemName);
            if (collectedIndex !== -1) {
                gameState.collectedItems.splice(collectedIndex, 1);
            }
        });
    }

    // 보상 아이템 추가 (private)
    _addRewardItem(quest, inventory, gameState) {
        if (quest.rewardItem) {
            const rewardItem = {
                name: quest.rewardItem,
                type: 'reward',
                description: `${quest.title} 완료 보상`
            };
            inventory.push(rewardItem);
            gameState.collectedItems.push(rewardItem);
            gameState.itemsCollected++;
        }
    }

    // 아이템 수집 시 퀘스트 진행도 확인
    onItemCollected(item, gameState) {
        Logger.debug(`📋 퀘스트 매니저: 아이템 수집 확인 - ${item.name}`);

        // 현재 퀘스트 진행도 업데이트
        const currentQuest = this.getCurrentQuest();
        if (currentQuest && !currentQuest.completed) {
            const feedback = this._updateQuestProgressForItem(currentQuest, item, gameState);
            if (feedback) {
                return feedback;
            }
        }

        // 모든 퀘스트에 대해 진행도 확인 (수집형 퀘스트용)
        this.quests.forEach(quest => {
            if (!quest.completed && quest.type === 'collection') {
                this._updateQuestProgressForItem(quest, item, gameState);
            }
        });

        return null;
    }

    // 특정 아이템에 대한 퀘스트 진행도 업데이트 (private)
    _updateQuestProgressForItem(quest, item, gameState) {
        const itemsNeeded = quest.requiredItems || (quest.requiredItem ? [quest.requiredItem] : []);

        // 이 퀘스트에 필요한 아이템인지 확인
        if (itemsNeeded.includes(item.name)) {
            // 현재 보유한 필요 아이템 수 계산
            const collectedNeededItems = itemsNeeded.filter(neededItem =>
                gameState.collectedItems.some(collectedItem => collectedItem.name === neededItem)
            );

            const previousProgress = quest.progress;
            quest.progress = collectedNeededItems.length;

            // progress가 maxProgress를 초과하지 않도록 제한
            quest.progress = Math.min(quest.progress, quest.maxProgress);

            Logger.debug(`📈 퀘스트 "${quest.title}" 진행도: ${quest.progress}/${quest.maxProgress}`);

            // 진행도 변화가 있을 때 피드백 메시지 생성
            if (quest.progress > previousProgress) {
                const feedback = {
                    type: 'progress',
                    questTitle: quest.title,
                    itemName: item.name,
                    progress: quest.progress,
                    maxProgress: quest.maxProgress,
                    message: this._generateProgressMessage(quest, item),
                    hint: this._generateNextStepHint(quest)
                };

                Logger.info(`✨ 퀘스트 진행: ${feedback.message}`);
                return feedback;
            }
        }

        return null;
    }

    // 퀘스트 진행 메시지 생성 (private)
    _generateProgressMessage(quest, item) {
        const progressPercentage = Math.round((quest.progress / quest.maxProgress) * 100);
        
        if (quest.progress >= quest.maxProgress) {
            return `🎉 "${quest.title}" 완료 준비됨! 모든 아이템을 수집했습니다.`;
        } else if (quest.maxProgress === 1) {
            return `✅ "${item.name}" 획득! "${quest.title}" 완료 가능합니다.`;
        } else {
            const remaining = quest.maxProgress - quest.progress;
            return `📋 "${item.name}" 획득! "${quest.title}" ${progressPercentage}% 완료 (${remaining}개 더 필요)`;
        }
    }

    // 다음 단계 힌트 생성 (private)
    _generateNextStepHint(quest) {
        if (quest.progress >= quest.maxProgress) {
            if (quest.questGiver) {
                const npcNames = {
                    'guard': '경비 아저씨',
                    'reception': '안내 데스크 직원',
                    'kim_deputy': '김대리',
                    'intern': '인턴',
                    'office_worker_2': '박직원',
                    'manager_lee': '팀장 이씨',
                    'education_manager': '교육팀장',
                    'secretary_jung': '비서 정씨',
                    'ceo_kim': 'CEO 김대표'
                };
                const npcName = npcNames[quest.questGiver] || quest.questGiver;
                return `💡 ${npcName}에게 가서 아이템을 제출하세요!`;
            }
            return `💡 퀘스트 완료 조건을 만족했습니다!`;
        } else {
            const missingItems = this._getMissingItemsForQuest(quest);
            if (missingItems.length > 0) {
                return `🔍 다음 아이템을 찾아보세요: ${missingItems.join(', ')}`;
            }
            return `🔍 ${quest.hint || '계속 탐험해보세요!'}`;
        }
    }

    // 퀘스트에 부족한 아이템 목록 반환 (private)
    _getMissingItemsForQuest(quest) {
        const itemsNeeded = quest.requiredItems || (quest.requiredItem ? [quest.requiredItem] : []);
        const collectedItems = this.gameState?.collectedItems || [];
        
        return itemsNeeded.filter(neededItem =>
            !collectedItems.some(collectedItem => collectedItem.name === neededItem)
        );
    }

    // 퀘스트 완료 메시지 생성 (private)
    _generateCompletionMessage(quest, questId) {
        const baseMessage = `🎉 퀘스트 완료! "${quest.rewardItem}"을(를) 받았습니다.`;
        
        const questMessages = {
            0: `${baseMessage}\n🏢 이제 건물을 자유롭게 탐험할 수 있습니다!`,
            1: `${baseMessage}\n🛗 엘리베이터를 이용해 다른 층으로 이동하세요!`,
            2: `${baseMessage}\n📋 김대리의 신뢰를 얻었습니다!`,
            3: `${baseMessage}\n💼 인턴의 업무를 도와주어 감사받았습니다!`,
            4: `${baseMessage}\n📄 박직원과의 업무 관계를 쌓았습니다!`,
            5: `${baseMessage}\n👥 팀장님의 회의 준비를 도왔습니다!`,
            6: `${baseMessage}\n📚 교육팀의 소중한 자료를 지켜주었습니다!`,
            7: `${baseMessage}\n🔒 기밀 문서를 안전하게 전달했습니다!`,
            8: `${baseMessage}\n👑 휴넷 26주년의 모든 여정을 완주했습니다!`
        };

        return questMessages[questId] || baseMessage;
    }

    // 다음 퀘스트 정보 생성 (private)
    _generateNextQuestInfo(completedQuestId) {
        const nextQuestMaps = {
            0: { message: "🔍 이제 26주년 기념 메달을 찾아 안내 데스크에 전달하세요!", floor: "1층 로비" },
            1: { message: "🛗 엘리베이터를 타고 7층으로 올라가세요!", floor: "7층 사무실" },
            2: { message: "💼 같은 7층에서 인턴을 도와주세요!", floor: "7층 사무실" },
            3: { message: "📄 7층의 박직원도 도움이 필요합니다!", floor: "7층 사무실" },
            4: { message: "⬆️ 8층으로 올라가서 팀장님을 만나보세요!", floor: "8층 본부" },
            5: { message: "📚 8층 교육서비스본부에서 교육팀장을 찾아보세요!", floor: "8층 교육서비스본부" },
            6: { message: "🔝 최고층인 9층 CEO실로 올라가세요!", floor: "9층 경영진" },
            7: { message: "👑 모든 증명서를 모아 CEO님께 최종 보고하세요!", floor: "9층 CEO실" },
            8: { message: "🎊 축하합니다! 휴넷 26주년 여정을 완주했습니다!", floor: "완료" }
        };

        return nextQuestMaps[completedQuestId] || { message: "🎯 다음 목표를 찾아보세요!", floor: "탐험 계속" };
    }

    // 퀘스트 초기화
    reset() {
        this.quests = JSON.parse(JSON.stringify(QUEST_DATA));
        this.currentQuest = 0;
    }
}
