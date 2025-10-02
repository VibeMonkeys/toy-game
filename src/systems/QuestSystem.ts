/**
 * 📜 퀘스트 시스템
 *
 * 퀘스트 진행, 완료, 보상 관리
 */

import { Quest, QuestType, QuestObjective, QuestRewards } from '../types';
import { Player } from '../entities/Player';
import { Inventory } from './Inventory';

export class QuestSystem {
    private activeQuests: Map<string, Quest> = new Map();
    private completedQuests: Set<string> = new Set();
    private questProgress: Map<string, Map<string, number>> = new Map(); // questId -> objectiveId -> progress

    // 성능 최적화: 역 인덱스 (objectivePrefix → questId + objectiveId 매핑)
    // 예: "kill_goblin" → [{ questId: "quest_001", objectiveId: "kill_goblin_1" }]
    private objectiveIndex: Map<string, Set<{ questId: string; objectiveId: string }>> = new Map();

    /**
     * 퀘스트 시작
     */
    startQuest(quest: Quest): boolean {
        if (this.activeQuests.has(quest.id)) {
            console.warn(`이미 진행 중인 퀘스트: ${quest.id}`);
            return false;
        }

        if (this.completedQuests.has(quest.id)) {
            console.warn(`이미 완료한 퀘스트: ${quest.id}`);
            return false;
        }

        // 퀘스트 활성화
        const activeQuest: Quest = {
            ...quest,
            isActive: true,
            startTime: Date.now(),
            objectives: quest.objectives.map(obj => ({
                ...obj,
                progress: 0,
                completed: false
            }))
        };

        this.activeQuests.set(quest.id, activeQuest);

        // 진행도 초기화
        const progressMap = new Map<string, number>();
        quest.objectives.forEach(obj => {
            progressMap.set(obj.id, 0);

            // 역 인덱스 생성 (성능 최적화)
            this.addObjectiveToIndex(obj.id, quest.id);
        });
        this.questProgress.set(quest.id, progressMap);

        console.log(`📜 퀘스트 시작: ${quest.title}`);
        return true;
    }

    /**
     * 퀘스트 목표 진행도 업데이트
     */
    updateObjectiveProgress(questId: string, objectiveId: string, amount: number = 1): boolean {
        const quest = this.activeQuests.get(questId);
        if (!quest) return false;

        const objective = quest.objectives.find(obj => obj.id === objectiveId);
        if (!objective) return false;

        if (objective.completed) return false;

        // 진행도 증가
        const currentProgress = this.questProgress.get(questId)?.get(objectiveId) ?? 0;
        const newProgress = Math.min((objective.target ?? 1), currentProgress + amount);

        this.questProgress.get(questId)?.set(objectiveId, newProgress);
        objective.progress = newProgress;

        // 목표 완료 체크
        if (newProgress >= (objective.target ?? 1)) {
            objective.completed = true;
            console.log(`✅ 퀘스트 목표 달성: ${objective.text}`);

            // 모든 목표 완료 체크
            this.checkQuestCompletion(questId);
        }

        return true;
    }

    /**
     * 퀘스트 완료 체크
     */
    private checkQuestCompletion(questId: string): void {
        const quest = this.activeQuests.get(questId);
        if (!quest) return;

        const allCompleted = quest.objectives.every(obj => obj.completed);

        if (allCompleted) {
            console.log(`🎉 퀘스트 완료: ${quest.title}`);
            // 완료 상태로 변경 (보상은 NPC와 대화 시 지급)
        }
    }

    /**
     * 퀘스트 완료 및 보상 지급
     */
    completeQuest(questId: string, player: Player, inventory: Inventory): QuestRewards | null {
        const quest = this.activeQuests.get(questId);
        if (!quest) return null;

        const allCompleted = quest.objectives.every(obj => obj.completed);
        if (!allCompleted) {
            console.warn('아직 퀘스트 목표를 모두 달성하지 못했습니다.');
            return null;
        }

        // 보상 지급
        const rewards = quest.rewards;

        if (rewards.experience) {
            const leveledUp = player.gainExperience(rewards.experience);
            console.log(`💫 경험치 +${rewards.experience}`);
            if (leveledUp) {
                console.log('🎊 레벨업!');
            }
        }

        if (rewards.soulPoints) {
            // 소울 포인트는 Player에 메서드 추가 필요
            console.log(`💎 소울 포인트 +${rewards.soulPoints}`);
        }

        if (rewards.items) {
            rewards.items.forEach(itemId => {
                // 인벤토리에 아이템 추가 (ItemDatabase에서 가져오기)
                console.log(`🎁 아이템 획득: ${itemId}`);
            });
        }

        // 퀘스트 완료 처리
        this.activeQuests.delete(questId);
        this.completedQuests.add(questId);
        this.questProgress.delete(questId);

        // 역 인덱스에서 제거 (성능 최적화)
        quest.objectives.forEach(obj => {
            this.removeObjectiveFromIndex(obj.id, questId);
        });

        console.log(`✨ ${quest.title} 보상 지급 완료!`);
        return rewards;
    }

    /**
     * 특정 타입의 행동 시 관련 퀘스트 진행도 업데이트
     * 최적화: O(n * m) → O(1) (역 인덱스 사용)
     */
    onEnemyKilled(enemyType: string): void {
        // "kill_goblin", "kill_orc" 등의 패턴 검색
        this.updateProgressByPattern(`kill_${enemyType}`, 1);
    }

    /**
     * 아이템 수집 시 퀘스트 진행도 업데이트
     * 최적화: O(n * m) → O(1) (역 인덱스 사용)
     */
    onItemCollected(itemId: string, amount: number = 1): void {
        this.updateProgressByPattern(`collect_${itemId}`, amount);
    }

    /**
     * NPC 대화 시 퀘스트 진행도 업데이트
     * 최적화: O(n * m) → O(1) (역 인덱스 사용)
     */
    onNPCTalkTo(npcType: string): void {
        this.updateProgressByPattern(`talk_${npcType}`, 1);
    }

    /**
     * 특정 위치 도달 시 퀘스트 진행도 업데이트
     * 최적화: O(n * m) → O(1) (역 인덱스 사용)
     */
    onLocationReached(locationId: string): void {
        this.updateProgressByPattern(`reach_${locationId}`, 1);
    }

    /**
     * 활성 퀘스트 목록 가져오기
     */
    getActiveQuests(): Quest[] {
        return Array.from(this.activeQuests.values());
    }

    /**
     * 특정 퀘스트 가져오기
     */
    getQuest(questId: string): Quest | undefined {
        return this.activeQuests.get(questId);
    }

    /**
     * 퀘스트 완료 여부 확인
     */
    isQuestCompleted(questId: string): boolean {
        return this.completedQuests.has(questId);
    }

    /**
     * 퀘스트 진행 가능 여부 확인
     */
    canStartQuest(questId: string): boolean {
        return !this.activeQuests.has(questId) && !this.completedQuests.has(questId);
    }

    /**
     * 퀘스트 목표 완료 여부 확인
     */
    isQuestReadyToComplete(questId: string): boolean {
        const quest = this.activeQuests.get(questId);
        if (!quest) return false;
        return quest.objectives.every(obj => obj.completed);
    }

    /**
     * 저장 데이터 변환
     */
    toSaveData(): {
        activeQuests: string[];
        completedQuests: string[];
        progress: Record<string, Record<string, number>>;
    } {
        const progressData: Record<string, Record<string, number>> = {};

        this.questProgress.forEach((objMap, questId) => {
            progressData[questId] = {};
            objMap.forEach((progress, objId) => {
                progressData[questId][objId] = progress;
            });
        });

        return {
            activeQuests: Array.from(this.activeQuests.keys()),
            completedQuests: Array.from(this.completedQuests),
            progress: progressData
        };
    }

    /**
     * 역 인덱스에 목표 추가 (성능 최적화)
     */
    private addObjectiveToIndex(objectiveId: string, questId: string): void {
        // objectiveId에서 prefix 추출 (예: "kill_goblin_1" → "kill_goblin")
        const parts = objectiveId.split('_');
        if (parts.length >= 2) {
            // 마지막 부분이 숫자면 제거 (예: "kill_goblin_1" → "kill_goblin")
            const lastPart = parts[parts.length - 1];
            const prefix = !isNaN(Number(lastPart))
                ? parts.slice(0, -1).join('_')
                : objectiveId;

            if (!this.objectiveIndex.has(prefix)) {
                this.objectiveIndex.set(prefix, new Set());
            }

            this.objectiveIndex.get(prefix)!.add({ questId, objectiveId });
        }
    }

    /**
     * 역 인덱스에서 목표 제거 (성능 최적화)
     */
    private removeObjectiveFromIndex(objectiveId: string, questId: string): void {
        const parts = objectiveId.split('_');
        if (parts.length >= 2) {
            const lastPart = parts[parts.length - 1];
            const prefix = !isNaN(Number(lastPart))
                ? parts.slice(0, -1).join('_')
                : objectiveId;

            const targets = this.objectiveIndex.get(prefix);
            if (targets) {
                targets.forEach(target => {
                    if (target.questId === questId && target.objectiveId === objectiveId) {
                        targets.delete(target);
                    }
                });

                if (targets.size === 0) {
                    this.objectiveIndex.delete(prefix);
                }
            }
        }
    }

    /**
     * 패턴으로 퀘스트 진행도 업데이트 (성능 최적화)
     * O(1) 복잡도 - 역 인덱스 활용
     */
    private updateProgressByPattern(pattern: string, amount: number): void {
        const targets = this.objectiveIndex.get(pattern);
        if (!targets) return;

        targets.forEach(({ questId, objectiveId }) => {
            this.updateObjectiveProgress(questId, objectiveId, amount);
        });
    }

    /**
     * 저장 데이터에서 복원
     */
    fromSaveData(
        data: {
            activeQuests: string[];
            completedQuests: string[];
            progress: Record<string, Record<string, number>>;
        },
        questDatabase: Record<string, Quest>
    ): void {
        // 완료된 퀘스트 복원
        this.completedQuests = new Set(data.completedQuests);

        // 활성 퀘스트 복원
        data.activeQuests.forEach(questId => {
            const questTemplate = questDatabase[questId];
            if (questTemplate) {
                const quest: Quest = {
                    ...questTemplate,
                    isActive: true,
                    objectives: questTemplate.objectives.map(obj => {
                        const progress = data.progress[questId]?.[obj.id] ?? 0;
                        return {
                            ...obj,
                            progress,
                            completed: progress >= (obj.target ?? 1)
                        };
                    })
                };
                this.activeQuests.set(questId, quest);

                // 진행도 복원
                const progressMap = new Map<string, number>();
                Object.entries(data.progress[questId] ?? {}).forEach(([objId, progress]) => {
                    progressMap.set(objId, progress);

                    // 역 인덱스 재생성 (성능 최적화)
                    this.addObjectiveToIndex(objId, questId);
                });
                this.questProgress.set(questId, progressMap);
            }
        });
    }
}
