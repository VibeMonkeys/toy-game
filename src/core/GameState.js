export class GameState {
    constructor() {
        this.itemsCollected = 0;
        this.totalItems = 4;
        this.visitedMaps = ['lobby'];
        this.completedQuests = [];
        this.inventory = [];
        this.collectedItems = []; // UI에서 참조하는 수집된 아이템 목록
        this.coins = 5000; // 기본 지급 동전
        
        // NPC 관계 시스템
        this.npcRelationships = {}; // NPC ID별 관계 정보
        this.npcInteractions = {}; // NPC별 상호작용 횟수 추적
        this.lastInteractionTime = {}; // 마지막 상호작용 시간
    }

    addItem(item) {
        this.inventory.push(item);
        this.collectedItems.push(item);
        this.itemsCollected++;
    }

    hasItem(itemId) {
        return this.inventory.some(item => item.id === itemId);
    }

    visitMap(mapId) {
        if (!this.visitedMaps.includes(mapId)) {
            this.visitedMaps.push(mapId);
        }
    }

    completeQuest(questId) {
        if (!this.completedQuests.includes(questId)) {
            this.completedQuests.push(questId);
        }
    }

    isQuestCompleted(questId) {
        return this.completedQuests.includes(questId);
    }

    serialize() {
        return {
            itemsCollected: this.itemsCollected,
            totalItems: this.totalItems,
            visitedMaps: [...this.visitedMaps],
            completedQuests: [...this.completedQuests],
            inventory: [...this.inventory],
            collectedItems: [...this.collectedItems],
            coins: this.coins,
            npcRelationships: JSON.parse(JSON.stringify(this.npcRelationships)),
            npcInteractions: {...this.npcInteractions},
            lastInteractionTime: {...this.lastInteractionTime}
        };
    }

    deserialize(data) {
        this.itemsCollected = data.itemsCollected || 0;
        this.totalItems = data.totalItems || 4;
        this.visitedMaps = data.visitedMaps || ['lobby'];
        this.completedQuests = data.completedQuests || [];
        this.inventory = data.inventory || [];
        this.collectedItems = data.collectedItems || data.inventory || []; // 하위 호환성
        this.coins = typeof data.coins === 'number' ? data.coins : 0;
        
        // NPC 관계 시스템 데이터
        this.npcRelationships = data.npcRelationships || {};
        this.npcInteractions = data.npcInteractions || {};
        this.lastInteractionTime = data.lastInteractionTime || {};
    }

    getCoins() {
        return this.coins;
    }

    addCoins(amount) {
        this.coins = Math.max(0, this.coins + amount);
    }

    hasEnoughCoins(amount) {
        return this.coins >= amount;
    }

    spendCoins(amount) {
        if (!this.hasEnoughCoins(amount)) {
            return false;
        }
        this.coins -= amount;
        return true;
    }

    // NPC 관계 시스템 메서드
    getNPCRelationship(npcId) {
        if (!this.npcRelationships[npcId]) {
            this.npcRelationships[npcId] = {
                affection: 0, // -100 ~ 100
                trust: 0, // -100 ~ 100
                respect: 0, // -100 ~ 100
                mood: 'neutral', // happy, friendly, neutral, annoyed, angry
                interactionCount: 0,
                lastMoodChange: Date.now()
            };
        }
        return this.npcRelationships[npcId];
    }

    updateNPCRelationship(npcId, changes) {
        const relationship = this.getNPCRelationship(npcId);
        
        // 수치 업데이트 (-100 ~ 100 범위 유지)
        if (changes.affection !== undefined) {
            relationship.affection = Math.max(-100, Math.min(100, relationship.affection + changes.affection));
        }
        if (changes.trust !== undefined) {
            relationship.trust = Math.max(-100, Math.min(100, relationship.trust + changes.trust));
        }
        if (changes.respect !== undefined) {
            relationship.respect = Math.max(-100, Math.min(100, relationship.respect + changes.respect));
        }

        // 상호작용 횟수 증가
        relationship.interactionCount++;
        this.npcInteractions[npcId] = (this.npcInteractions[npcId] || 0) + 1;
        this.lastInteractionTime[npcId] = Date.now();

        // 기분 자동 업데이트
        this.updateNPCMood(npcId);
        
        return relationship;
    }

    updateNPCMood(npcId) {
        const relationship = this.getNPCRelationship(npcId);
        const avgRelation = (relationship.affection + relationship.trust + relationship.respect) / 3;
        
        let newMood = 'neutral';
        if (avgRelation >= 60) newMood = 'happy';
        else if (avgRelation >= 20) newMood = 'friendly';
        else if (avgRelation <= -60) newMood = 'angry';
        else if (avgRelation <= -20) newMood = 'annoyed';
        
        if (relationship.mood !== newMood) {
            relationship.mood = newMood;
            relationship.lastMoodChange = Date.now();
        }
    }

    getInteractionHistory(npcId) {
        return {
            count: this.npcInteractions[npcId] || 0,
            lastTime: this.lastInteractionTime[npcId] || null,
            relationship: this.getNPCRelationship(npcId)
        };
    }
};
