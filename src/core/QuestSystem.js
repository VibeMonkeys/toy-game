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

        // 서브 퀘스트들 (메인 퀘스트와 독립적으로 진행)
        this.subQuests = [
            {
                id: 100,
                title: "택배 배달 도움",
                description: "1층 택배 기사가 7층 김대리님께 전달할 택배를 도와주세요",
                target: CONSTANTS.QUEST_TARGETS.DELIVER_PACKAGE,
                completed: false,
                progress: 0,
                maxProgress: 1,
                category: "업무",
                questGiver: 'delivery_person',
                itemSubmitted: false
            },
            {
                id: 101,
                title: "방문객 안내",
                description: "1층 로비의 방문객에게 회사 소개를 도와주세요",
                target: CONSTANTS.QUEST_TARGETS.HELP_VISITOR,
                completed: false,
                progress: 0,
                maxProgress: 1,
                category: "사교",
                questGiver: 'visitor_1',
                itemSubmitted: false
            },
            {
                id: 102,
                title: "커피 심부름",
                description: "7층 개발팀 이선임을 위해 스타벅스에서 아메리카노를 가져다주세요",
                target: CONSTANTS.QUEST_TARGETS.COFFEE_DELIVERY,
                completed: false,
                progress: 0,
                maxProgress: 1,
                category: "생활",
                questGiver: 'developer_1',
                requiredItem: '아메리카노',
                rewardItem: '커피 쿠폰',
                itemSubmitted: false
            },
            {
                id: 103,
                title: "점심 주문",
                description: "8층 점심 먹는 직원을 위해 국밥집 92소에서 돼지국밥을 주문해주세요",
                target: CONSTANTS.QUEST_TARGETS.LUNCH_ORDER,
                completed: false,
                progress: 0,
                maxProgress: 1,
                category: "생활",
                questGiver: 'lunch_employee',
                requiredItem: '돼지국밥',
                rewardItem: '식사 쿠폰',
                itemSubmitted: false
            },
            {
                id: 104,
                title: "신입사원 교육",
                description: "8층 교육 담당자를 도와 신입사원 교육 자료를 준비해주세요",
                target: CONSTANTS.QUEST_TARGETS.TRAINING_ASSIST,
                completed: false,
                progress: 0,
                maxProgress: 1,
                category: "업무",
                questGiver: 'training_coordinator',
                itemSubmitted: false
            },
            {
                id: 105,
                title: "프린터 수리",
                description: "7층 사무실 2의 프린터가 고장났어요. 시설 관리자에게 알려주세요",
                target: CONSTANTS.QUEST_TARGETS.REPAIR_PRINTER,
                completed: false,
                progress: 0,
                maxProgress: 1,
                category: "업무",
                questGiver: 'maintenance_worker',
                itemSubmitted: false
            },
            {
                id: 106,
                title: "분실물 찾기",
                description: "7층 신입사원 윤씨가 잃어버린 명찰을 찾아주세요",
                target: CONSTANTS.QUEST_TARGETS.FIND_LOST_ITEM,
                completed: false,
                progress: 0,
                maxProgress: 1,
                category: "탐험",
                questGiver: 'office_newbie',
                itemSubmitted: false
            },
            {
                id: 107,
                title: "회의실 준비",
                description: "8층 발표자 김선임의 프레젠테이션을 위해 회의실을 준비해주세요",
                target: CONSTANTS.QUEST_TARGETS.MEETING_SETUP,
                completed: false,
                progress: 0,
                maxProgress: 1,
                category: "업무",
                questGiver: 'presenter',
                itemSubmitted: false
            },
            {
                id: 108,
                title: "동료 소개",
                description: "1층 면접 지원자에게 회사 분위기를 소개해주세요",
                target: CONSTANTS.QUEST_TARGETS.EMPLOYEE_INTRODUCTION,
                completed: false,
                progress: 0,
                maxProgress: 1,
                category: "사교",
                questGiver: 'job_applicant',
                itemSubmitted: false
            },
            {
                id: 109,
                title: "스트레스 해소",
                description: "옥상의 스트레스 받는 직원에게 위로의 말을 건네주세요",
                target: CONSTANTS.QUEST_TARGETS.STRESS_RELIEF,
                completed: false,
                progress: 0,
                maxProgress: 1,
                category: "사교",
                questGiver: 'stressed_worker',
                itemSubmitted: false
            },
            {
                id: 110,
                title: "보안 점검",
                description: "옥상 보안 요원과 함께 건물 보안 상태를 점검해주세요",
                target: CONSTANTS.QUEST_TARGETS.SECURITY_CHECK,
                completed: false,
                progress: 0,
                maxProgress: 1,
                category: "업무",
                questGiver: 'security_guard',
                itemSubmitted: false
            },
            {
                id: 111,
                title: "운동 파트너",
                description: "옥상에서 운동하는 직원과 함께 운동해주세요",
                target: CONSTANTS.QUEST_TARGETS.EXERCISE_BUDDY,
                completed: false,
                progress: 0,
                maxProgress: 1,
                category: "사교",
                questGiver: 'exercise_enthusiast',
                itemSubmitted: false
            },
            {
                id: 112,
                title: "전화 메시지",
                description: "옥상의 통화중인 직원 대신 중요한 메시지를 전달해주세요",
                target: CONSTANTS.QUEST_TARGETS.PHONE_MESSAGE,
                completed: false,
                progress: 0,
                maxProgress: 1,
                category: "업무",
                questGiver: 'phone_caller',
                itemSubmitted: false
            },
            {
                id: 113,
                title: "명상 가이드",
                description: "옥상의 명상하는 직원에게 평온한 환경을 제공해주세요",
                target: CONSTANTS.QUEST_TARGETS.MEDITATION_GUIDE,
                completed: false,
                progress: 0,
                maxProgress: 1,
                category: "사교",
                questGiver: 'meditation_person',
                itemSubmitted: false
            },
            {
                id: 114,
                title: "아케이드 챔피언",
                description: "1층 아케이드 마스터와 함께 미니게임에서 고득점을 달성하세요",
                target: CONSTANTS.QUEST_TARGETS.ARCADE_CHAMPION,
                completed: false,
                progress: 0,
                maxProgress: 1,
                category: "미니게임",
                questGiver: 'arcade_master',
                itemSubmitted: false
            },
            {
                id: 115,
                title: "청소 도움",
                description: "1층 청소 아주머니의 청소 작업을 도와주세요",
                target: CONSTANTS.QUEST_TARGETS.CLEANING_HELP,
                completed: false,
                progress: 0,
                maxProgress: 1,
                category: "사교",
                questGiver: 'cleaning_staff',
                itemSubmitted: false
            },
            {
                id: 116,
                title: "면접 준비",
                description: "1층 면접 지원자의 면접 준비를 도와주세요",
                target: CONSTANTS.QUEST_TARGETS.JOB_INTERVIEW_PREP,
                completed: false,
                progress: 0,
                maxProgress: 1,
                category: "사교",
                questGiver: 'job_applicant',
                itemSubmitted: false
            },
            {
                id: 117,
                title: "임원 브리핑",
                description: "9층 임원실 어시스턴트를 도와 임원 브리핑 자료를 준비하세요",
                target: CONSTANTS.QUEST_TARGETS.EXECUTIVE_BRIEFING,
                completed: false,
                progress: 0,
                maxProgress: 1,
                category: "업무",
                questGiver: 'executive_assistant',
                itemSubmitted: false
            },
            {
                id: 118,
                title: "법무 문서",
                description: "9층 법무 고문이 검토할 중요 계약서를 찾아주세요",
                target: CONSTANTS.QUEST_TARGETS.LEGAL_DOCUMENT,
                completed: false,
                progress: 0,
                maxProgress: 1,
                category: "업무",
                questGiver: 'legal_advisor',
                itemSubmitted: false
            },
            {
                id: 119,
                title: "재무 보고서",
                description: "9층 CFO를 위해 26주년 기념 재무 분석 자료를 준비해주세요",
                target: CONSTANTS.QUEST_TARGETS.FINANCIAL_REPORT,
                completed: false,
                progress: 0,
                maxProgress: 1,
                category: "업무",
                questGiver: 'cfo',
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

    // 서브 퀘스트 관련 메서드들
    getAllSubQuests() {
        return this.subQuests;
    }

    getAvailableSubQuests() {
        return this.subQuests.filter(quest => !quest.completed);
    }

    getCompletedSubQuests() {
        return this.subQuests.filter(quest => quest.completed);
    }

    getSubQuestsByCategory(category) {
        return this.subQuests.filter(quest => quest.category === category);
    }

    findSubQuestByGiver(npcId) {
        return this.subQuests.find(quest => quest.questGiver === npcId && !quest.completed);
    }

    completeSubQuest(questTarget) {
        const quest = this.subQuests.find(q => q.target === questTarget);
        if (quest && !quest.completed) {
            quest.completed = true;
            quest.progress = quest.maxProgress;

            if (this.audioManager) {
                this.audioManager.playQuestComplete();
            }
            return true;
        }
        return false;
    }

    canSubmitToSubQuestGiver(npcId, playerInventory) {
        const quest = this.findSubQuestByGiver(npcId);
        if (!quest) return { canSubmit: false, reason: '서브 퀘스트가 없습니다.' };

        if (quest.requiredItem) {
            const hasItem = playerInventory.some(item => item.name === quest.requiredItem);
            if (!hasItem) {
                return { canSubmit: false, reason: `'${quest.requiredItem}'이(가) 필요합니다.` };
            }
        }

        return { canSubmit: true, quest: quest };
    }

    submitItemsToSubQuestGiver(npcId, playerInventory, gameState) {
        const submission = this.canSubmitToSubQuestGiver(npcId, playerInventory);
        if (!submission.canSubmit) return { success: false, message: submission.reason };

        const quest = submission.quest;

        if (quest.requiredItem) {
            const itemIndex = playerInventory.findIndex(item => item.name === quest.requiredItem);
            if (itemIndex !== -1) {
                playerInventory.splice(itemIndex, 1);
                gameState.itemsCollected--;
            }
        }

        if (quest.rewardItem) {
            playerInventory.push({ name: quest.rewardItem, type: 'reward' });
            gameState.itemsCollected++;
        }

        quest.completed = true;
        quest.itemSubmitted = true;
        quest.progress = quest.maxProgress;

        if (this.audioManager) {
            this.audioManager.playQuestComplete();
        }

        return {
            success: true,
            message: quest.rewardItem ?
                `서브 퀘스트 완료! '${quest.rewardItem}'을(를) 받았습니다.` :
                `서브 퀘스트 완료! 경험을 얻었습니다.`,
            quest: quest
        };
    }

    getAllQuests() {
        return [...this.quests, ...this.subQuests];
    }

    getTotalQuestCount() {
        return this.quests.length + this.subQuests.length;
    }

    getCompletedQuestCount() {
        return this.quests.filter(q => q.completed).length +
               this.subQuests.filter(q => q.completed).length;
    }

    serialize() {
        return {
            currentQuest: this.currentQuest,
            showQuestUI: this.showQuestUI,
            quests: this.quests.map(q => ({ ...q })),
            subQuests: this.subQuests.map(q => ({ ...q }))
        };
    }

    deserialize(data) {
        this.currentQuest = data.currentQuest || 0;
        this.showQuestUI = data.showQuestUI !== undefined ? data.showQuestUI : true;
        if (data.quests) {
            this.quests = data.quests.map(q => ({ ...q }));
        }
        if (data.subQuests) {
            this.subQuests = data.subQuests.map(q => ({ ...q }));
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