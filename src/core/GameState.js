export class GameState {
    constructor() {
        this.itemsCollected = 0;
        this.totalItems = 4;
        this.visitedMaps = ['lobby'];
        this.completedQuests = [];
        this.inventory = [];
    }

    addItem(item) {
        this.inventory.push(item);
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
            inventory: [...this.inventory]
        };
    }

    deserialize(data) {
        this.itemsCollected = data.itemsCollected || 0;
        this.totalItems = data.totalItems || 4;
        this.visitedMaps = data.visitedMaps || ['lobby'];
        this.completedQuests = data.completedQuests || [];
        this.inventory = data.inventory || [];
    }
};