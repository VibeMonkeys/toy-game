export class GameState {
    constructor() {
        this.itemsCollected = 0;
        this.totalItems = 4;
        this.visitedMaps = ['lobby'];
        this.completedQuests = [];
        this.inventory = [];
        this.collectedItems = []; // UI에서 참조하는 수집된 아이템 목록
        this.coins = 5000; // 기본 지급 동전
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
            coins: this.coins
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
};
