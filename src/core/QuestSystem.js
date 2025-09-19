import { CONSTANTS } from '../utils/Constants.js';

export class QuestSystem {
    constructor(audioManager = null) {
        this.audioManager = audioManager;
        this.currentQuest = 0;
        this.showQuestUI = true;
        this.quests = [
            {
                id: 0,
                title: "업무 보고서 수집",
                description: "7층 복도에서 '7층 업무 보고서'를 찾아 김대리에게 가져다주세요",
                target: CONSTANTS.QUEST_TARGETS.TALK_TO_KIM,
                completed: false,
                progress: 0,
                maxProgress: 1,
                requiredItem: '7층 업무 보고서',
                rewardItem: '김대리 추천서',
                questGiver: 'kim_deputy',
                itemSubmitted: false
            },
            {
                id: 1,
                title: "중요한 문서 회수",
                description: "7층 사무실 1에서 '중요한 문서'를 찾아 박직원에게 전달하세요",
                target: CONSTANTS.QUEST_TARGETS.EXPLORE_OFFICE_1,
                completed: false,
                progress: 0,
                maxProgress: 1,
                requiredItem: '중요한 문서',
                rewardItem: '박직원 도장',
                questGiver: 'office_worker_2',
                itemSubmitted: false
            },
            {
                id: 2,
                title: "프로젝트 파일 제출",
                description: "7층 사무실 2에서 '프로젝트 파일'을 찾아 인턴에게 도움을 주세요",
                target: CONSTANTS.QUEST_TARGETS.HELP_INTERN,
                completed: false,
                progress: 0,
                maxProgress: 1,
                requiredItem: '프로젝트 파일',
                rewardItem: '인턴 감사장',
                questGiver: 'intern',
                itemSubmitted: false
            },
            {
                id: 3,
                title: "회의 자료 정리",
                description: "8층에서 '회의록'과 '프레젠테이션 자료'를 모아 팀장 이씨에게 제출하세요",
                target: CONSTANTS.QUEST_TARGETS.COMPLETE_MEETING_TASK,
                completed: false,
                progress: 0,
                maxProgress: 2,
                requiredItems: ['회의록', '프레젠테이션 자료'],
                rewardItem: '팀장 승인서',
                questGiver: 'manager_lee',
                itemSubmitted: false
            },
            {
                id: 4,
                title: "기밀 문서 보고",
                description: "9층에서 '9층 기밀 문서'를 찾아 비서 정씨에게 전달하세요",
                target: CONSTANTS.QUEST_TARGETS.FIND_HIDDEN_DOCUMENT,
                completed: false,
                progress: 0,
                maxProgress: 1,
                requiredItem: '9층 기밀 문서',
                rewardItem: '비서 허가증',
                questGiver: 'secretary_jung',
                itemSubmitted: false
            },
            {
                id: 5,
                title: "CEO와의 최종 면담",
                description: "모든 증명서(추천서, 도장, 감사장, 승인서, 허가증)를 모아 CEO에게 제출하세요",
                target: CONSTANTS.QUEST_TARGETS.TALK_TO_CEO,
                completed: false,
                progress: 0,
                maxProgress: 5,
                requiredItems: ['김대리 추천서', '박직원 도장', '인턴 감사장', '팀장 승인서', '비서 허가증'],
                rewardItem: 'CEO 친필 사인',
                questGiver: 'ceo_kim',
                itemSubmitted: false
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

            // Play quest complete sound
            if (this.audioManager) {
                this.audioManager.playQuestComplete();
            }

            // Move to next quest if current
            if (quest.id === this.currentQuest && this.currentQuest < this.quests.length - 1) {
                this.currentQuest++;

                // Play level up sound when advancing to next quest
                if (this.audioManager) {
                    setTimeout(() => this.audioManager.playLevelUp(), 800);
                }
            }

            // Check if all quests are completed
            if (this.currentQuest >= this.quests.length - 1 && quest.id === this.quests.length - 1) {
                // Play game complete sound
                if (this.audioManager) {
                    setTimeout(() => this.audioManager.playGameComplete(), 1500);
                }
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

    areAllQuestsCompleted() {
        return this.quests.every(quest => quest.completed);
    }

    toggleQuestUI() {
        this.showQuestUI = !this.showQuestUI;
    }

    showQuestUIPanel() {
        this.showQuestUI = true;
    }

    hideQuestUIPanel() {
        this.showQuestUI = false;
    }

    canSubmitToNPC(npcId, playerInventory) {
        const quest = this.quests.find(q => q.questGiver === npcId && !q.completed);
        if (!quest) return { canSubmit: false, reason: '퀘스트가 없습니다.' };

        if (quest.requiredItem) {
            const hasItem = playerInventory.some(item => item.name === quest.requiredItem);
            if (!hasItem) {
                return { canSubmit: false, reason: `'${quest.requiredItem}'이(가) 필요합니다.` };
            }
        }

        if (quest.requiredItems) {
            const missingItems = quest.requiredItems.filter(requiredItem =>
                !playerInventory.some(item => item.name === requiredItem)
            );
            if (missingItems.length > 0) {
                return { canSubmit: false, reason: `필요한 아이템: ${missingItems.join(', ')}` };
            }
        }

        return { canSubmit: true, quest: quest };
    }

    submitItemsToNPC(npcId, playerInventory, gameState) {
        const submission = this.canSubmitToNPC(npcId, playerInventory);
        if (!submission.canSubmit) return { success: false, message: submission.reason };

        const quest = submission.quest;

        // 필요한 아이템들을 인벤토리에서 제거
        if (quest.requiredItem) {
            const itemIndex = playerInventory.findIndex(item => item.name === quest.requiredItem);
            if (itemIndex !== -1) {
                playerInventory.splice(itemIndex, 1);
                gameState.itemsCollected--;
            }
        }

        if (quest.requiredItems) {
            quest.requiredItems.forEach(requiredItem => {
                const itemIndex = playerInventory.findIndex(item => item.name === requiredItem);
                if (itemIndex !== -1) {
                    playerInventory.splice(itemIndex, 1);
                    gameState.itemsCollected--;
                }
            });
        }

        // 보상 아이템 추가
        if (quest.rewardItem) {
            playerInventory.push({ name: quest.rewardItem, type: 'reward' });
            gameState.itemsCollected++;
        }

        // 퀘스트 완료 처리
        quest.completed = true;
        quest.itemSubmitted = true;
        quest.progress = quest.maxProgress;

        // 다음 퀘스트로 이동
        if (quest.id === this.currentQuest && this.currentQuest < this.quests.length - 1) {
            this.currentQuest++;
        }

        // 사운드 재생
        if (this.audioManager) {
            this.audioManager.playQuestComplete();
            if (this.currentQuest < this.quests.length - 1) {
                setTimeout(() => this.audioManager.playLevelUp(), 800);
            }
        }

        return {
            success: true,
            message: `퀘스트 완료! '${quest.rewardItem}'을(를) 받았습니다.`,
            quest: quest
        };
    }
};