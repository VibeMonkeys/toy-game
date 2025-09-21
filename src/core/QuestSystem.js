import { CONSTANTS } from '../utils/Constants.js';
import { QuestManager } from './QuestManager.js';
import { QUEST_TYPES } from '../data/QuestData.js';

export class QuestSystem {
    constructor(audioManager = null) {
        this.audioManager = audioManager;
        this.questManager = new QuestManager();
        this.showQuestUI = true;

        // 서브 퀘스트는 제거됨 (빈 배열 유지)
        this.subQuests = [];
    }

    // 레거시 호환성을 위한 프록시 속성들
    get quests() {
        return this.questManager.quests;
    }

    get currentQuest() {
        return this.questManager.currentQuest;
    }

    set currentQuest(value) {
        this.questManager.currentQuest = value;
    }

    // 현재 퀘스트 반환
    getCurrentQuest() {
        return this.questManager.getCurrentQuest();
    }

    // 퀘스트 완료 처리
    completeQuest(questTarget) {
        const quest = this.questManager.quests.find(q => q.target === questTarget);
        if (quest) {
            const success = this.questManager.completeQuest(quest.id);
            if (success && this.audioManager) {
                this.audioManager.playQuestComplete();
            }
            return success;
        }
        return false;
    }

    // 퀘스트 진행도 업데이트
    updateProgress(target, value) {
        const quest = this.questManager.quests.find(q => q.target === target);
        if (quest) {
            return this.questManager.updateQuestProgress(quest.id, value);
        }
        return false;
    }

    // NPC에게 아이템 제출 가능 여부 확인
    canSubmitToNPC(npcId, playerInventory) {
        return this.questManager.canSubmitItems(npcId, playerInventory);
    }

    // NPC에게 아이템 제출
    submitItemsToNPC(npcId, playerInventory, gameState) {
        const result = this.questManager.submitItems(npcId, playerInventory, gameState);

        if (result.success && this.audioManager) {
            this.audioManager.playQuestComplete();
            if (this.questManager.currentQuest < this.questManager.quests.length - 1) {
                setTimeout(() => this.audioManager.playLevelUp(), 800);
            }
        }

        return result;
    }

    // 서브 퀘스트 관련 메서드들 (빈 구현 - 레거시 호환성)
    canSubmitToSubQuestGiver(npcId, playerInventory) {
        return { canSubmit: false, reason: '서브 퀘스트가 비활성화됨' };
    }

    submitItemsToSubQuestGiver(npcId, playerInventory, gameState) {
        return { success: false, message: '서브 퀘스트가 비활성화됨' };
    }

    // 아이템 수집 시 호출
    onItemCollected(item, gameState) {
        this.questManager.onItemCollected(item, gameState);
    }

    // 완료된 퀘스트 수 반환
    getCompletedQuestCount() {
        return this.questManager.getCompletedQuestCount();
    }

    // 모든 퀘스트 완료 여부
    areAllQuestsCompleted() {
        return this.questManager.areAllQuestsCompleted();
    }

    // UI 관련 메서드들
    toggleQuestUI() {
        this.showQuestUI = !this.showQuestUI;
    }

    showQuestUIPanel() {
        this.showQuestUI = true;
    }

    hideQuestUIPanel() {
        this.showQuestUI = false;
    }

    // 퀘스트 상태 정보 반환 (UI용)
    getQuestStatusInfo() {
        const currentQuest = this.getCurrentQuest();
        const completedCount = this.getCompletedQuestCount();
        const totalCount = this.questManager.quests.length;

        return {
            current: currentQuest,
            completed: completedCount,
            total: totalCount,
            allCompleted: this.areAllQuestsCompleted(),
            progress: Math.round((completedCount / totalCount) * 100)
        };
    }

    // 퀘스트 타입별 정보 반환
    getQuestsByType(type) {
        return this.questManager.quests.filter(quest => quest.type === type);
    }

    // 퀘스트 난이도 정보 반환
    getQuestDifficulty(quest) {
        if (!quest) return 'normal';

        if (quest.type === 'final') return 'hard';
        if (quest.type === 'collection') return 'medium';
        return 'normal';
    }

    // 퀘스트 아이콘 반환
    getQuestIcon(quest) {
        if (!quest || !quest.type) return '📋';
        return QUEST_TYPES[quest.type]?.icon || '📋';
    }

    // 퀘스트 색상 반환
    getQuestColor(quest) {
        if (!quest || !quest.type) return '#4A90E2';
        return QUEST_TYPES[quest.type]?.color || '#4A90E2';
    }

    // 게임 리셋
    reset() {
        this.questManager.reset();
        this.showQuestUI = true;
    }

    // 서브 퀘스트 호환성 메서드들 (빈 구현)
    getAvailableSubQuests() {
        return [];
    }

    getCompletedSubQuests() {
        return [];
    }

    getSubQuestsByCategory(category) {
        return [];
    }

    // 디버그 정보 출력
    getDebugInfo() {
        return {
            currentQuest: this.questManager.currentQuest,
            completedQuests: this.getCompletedQuestCount(),
            totalQuests: this.questManager.quests.length,
            questStatus: this.questManager.quests.map(q => ({
                id: q.id,
                title: q.title,
                completed: q.completed,
                progress: `${q.progress}/${q.maxProgress}`
            }))
        };
    }
}