import { CONSTANTS } from '../utils/Constants.js';

export class QuestSystem {
    constructor() {
        this.currentQuest = 0;
        this.showQuestUI = true;
        this.quests = [
            {
                id: 0,
                title: "회사 탐험 시작",
                description: "김대리와 대화하여 첫 번째 단서를 얻으세요",
                target: CONSTANTS.QUEST_TARGETS.TALK_TO_KIM,
                completed: false,
                progress: 0,
                maxProgress: 1
            },
            {
                id: 1,
                title: "회의실 조사",
                description: "회의실로 이동하여 박과장과 대화하세요",
                target: CONSTANTS.QUEST_TARGETS.TALK_TO_PARK,
                completed: false,
                progress: 0,
                maxProgress: 1
            },
            {
                id: 2,
                title: "카페테리아 방문",
                description: "카페테리아에서 이부장과 대화하세요",
                target: CONSTANTS.QUEST_TARGETS.TALK_TO_LEE,
                completed: false,
                progress: 0,
                maxProgress: 1
            },
            {
                id: 3,
                title: "CEO와의 만남",
                description: "CEO실에서 CEO와 대화하여 보물을 찾으세요",
                target: CONSTANTS.QUEST_TARGETS.TALK_TO_CEO,
                completed: false,
                progress: 0,
                maxProgress: 1
            },
            {
                id: 4,
                title: "보물 수집",
                description: "모든 아이템을 수집하세요",
                target: CONSTANTS.QUEST_TARGETS.COLLECT_ALL_ITEMS,
                completed: false,
                progress: 0,
                maxProgress: 4
            }
        ];
    }

    getCurrentQuest() {
        return this.quests[this.currentQuest];
    }

    completeQuest(questTarget) {
        const quest = this.quests.find(q => q.target === questTarget);
        if (quest && !quest.completed) {
            quest.completed = true;
            quest.progress = quest.maxProgress;

            // Move to next quest if current
            if (quest.id === this.currentQuest && this.currentQuest < this.quests.length - 1) {
                this.currentQuest++;
            }

            return true;
        }
        return false;
    }

    updateProgress(questTarget, progress) {
        const quest = this.quests.find(q => q.target === questTarget);
        if (quest && !quest.completed) {
            quest.progress = Math.min(progress, quest.maxProgress);
            if (quest.progress >= quest.maxProgress) {
                this.completeQuest(questTarget);
            }
        }
    }

    isQuestCompleted(questTarget) {
        const quest = this.quests.find(q => q.target === questTarget);
        return quest ? quest.completed : false;
    }

    serialize() {
        return {
            currentQuest: this.currentQuest,
            showQuestUI: this.showQuestUI,
            quests: this.quests.map(q => ({ ...q }))
        };
    }

    deserialize(data) {
        this.currentQuest = data.currentQuest || 0;
        this.showQuestUI = data.showQuestUI !== undefined ? data.showQuestUI : true;
        if (data.quests) {
            this.quests = data.quests.map(q => ({ ...q }));
        }
    }
};