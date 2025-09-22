import { QUEST_DATA, QUEST_VALIDATION } from '../data/QuestData.js';
import { Logger } from '../utils/Logger.js';

// 퀘스트 관리 전용 클래스
export class QuestManager {
    constructor() {
        this.quests = JSON.parse(JSON.stringify(QUEST_DATA)); // 깊은 복사
        this.currentQuest = 0;
    }

    // 현재 활성 퀘스트 반환
    getCurrentQuest() {
        return this.quests[this.currentQuest] || null;
    }

    // 특정 ID의 퀘스트 반환
    getQuestById(id) {
        return this.quests.find(quest => quest.id === id) || null;
    }

    // NPC별 퀘스트 반환
    getQuestByNPC(npcId) {
        Logger.debug(`🔍 NPC ${npcId}에 대한 퀘스트 검색`);
        const quest = this.quests.find(quest => quest.questGiver === npcId && !quest.completed);
        if (quest) {
            Logger.debug(`✅ 퀘스트 발견: ${quest.title} (ID: ${quest.id})`);
        } else {
            Logger.debug(`❌ NPC ${npcId}에 대한 활성 퀘스트 없음`);
        }
        return quest || null;
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
        if (quest.id === this.currentQuest) {
            this.currentQuest = Math.min(this.currentQuest + 1, this.quests.length - 1);
            Logger.debug(`➡️ 다음 퀘스트로 이동: ${this.currentQuest}`);
        }

        return {
            success: true,
            message: `퀘스트 완료! '${quest.rewardItem}'을(를) 받았습니다.`,
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
            this._updateQuestProgressForItem(currentQuest, item, gameState);
        }

        // 모든 퀘스트에 대해 진행도 확인 (수집형 퀘스트용)
        this.quests.forEach(quest => {
            if (!quest.completed && quest.type === 'collection') {
                this._updateQuestProgressForItem(quest, item, gameState);
            }
        });
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

            quest.progress = collectedNeededItems.length;

            // progress가 maxProgress를 초과하지 않도록 제한
            quest.progress = Math.min(quest.progress, quest.maxProgress);

            Logger.debug(`📈 퀘스트 "${quest.title}" 진행도: ${quest.progress}/${quest.maxProgress}`);

            // 완료 체크는 제거 - 아이템 제출 시에만 완료 처리
            // if (quest.progress >= quest.maxProgress) {
            //     quest.completed = true;
            // }
        }
    }

    // 퀘스트 초기화
    reset() {
        this.quests = JSON.parse(JSON.stringify(QUEST_DATA));
        this.currentQuest = 0;
    }
}
