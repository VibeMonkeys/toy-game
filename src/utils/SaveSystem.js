export class SaveSystem {
    static SAVE_KEY = 'treasureHuntGame';

    static checkSavedGame() {
        const savedData = localStorage.getItem(this.SAVE_KEY);
        return savedData !== null;
    }

    static saveGame(gameState) {
        const gameData = {
            player: gameState.player,
            currentMap: gameState.currentMap,
            inventory: gameState.inventory,
            gameState: gameState.gameState,
            questSystem: gameState.questSystem,
            timestamp: Date.now()
        };

        try {
            localStorage.setItem(this.SAVE_KEY, JSON.stringify(gameData));
            return true;
        } catch (error) {
            console.error('Save failed:', error);
            return false;
        }
    }

    static loadGame() {
        try {
            const savedData = localStorage.getItem(this.SAVE_KEY);
            if (!savedData) return null;

            const gameData = JSON.parse(savedData);
            return gameData;
        } catch (error) {
            console.error('Load failed:', error);
            return null;
        }
    }

    static deleteSave() {
        localStorage.removeItem(this.SAVE_KEY);
    }
};