import { Logger } from './Logger.js';

export class SaveSystem {
    static SAVE_KEY = 'treasureHuntGame';

    static checkSavedGame() {
        return localStorage.getItem(this.SAVE_KEY) !== null;
    }

    static saveGame(gameOrSnapshot) {
        const snapshot = this.#isSnapshot(gameOrSnapshot)
            ? { ...gameOrSnapshot, timestamp: Date.now() }
            : this.createSnapshot(gameOrSnapshot);

        if (!snapshot) {
            Logger.warn('SaveSystem: 저장할 스냅샷을 생성하지 못했습니다.');
            return false;
        }

        try {
            localStorage.setItem(this.SAVE_KEY, JSON.stringify(snapshot));
            Logger.info('💾 게임 진행 상황이 저장되었습니다.');
            return true;
        } catch (error) {
            Logger.error('Save failed:', error);
            return false;
        }
    }

    static createSnapshot(game) {
        if (!game) {
            Logger.warn('SaveSystem: 유효하지 않은 게임 인스턴스입니다.');
            return null;
        }

        const playerState = game.player?.serialize ? game.player.serialize() : null;
        const coreState = game.gameState?.serialize ? game.gameState.serialize() : null;
        const questState = game.questSystem?.getDebugInfo ? game.questSystem.getDebugInfo() : null;
        const currentMapId = game.mapManager?.getCurrentMapId ? game.mapManager.getCurrentMapId() : null;

        if (!playerState || !coreState) {
            Logger.warn('SaveSystem: 필수 상태 정보가 부족하여 저장할 수 없습니다.');
            return null;
        }

        return {
            timestamp: Date.now(),
            mapId: currentMapId,
            player: playerState,
            gameState: coreState,
            questState
        };
    }

    static loadGame() {
        try {
            const savedData = localStorage.getItem(this.SAVE_KEY);
            if (!savedData) {
                Logger.debug('SaveSystem: 저장된 데이터가 없습니다.');
                return null;
            }

            const gameData = JSON.parse(savedData);
            Logger.info('📂 저장 데이터를 불러왔습니다.');
            return gameData;
        } catch (error) {
            Logger.error('Load failed:', error);
            return null;
        }
    }

    static deleteSave() {
        localStorage.removeItem(this.SAVE_KEY);
        Logger.info('🗑️ 저장 데이터를 삭제했습니다.');
    }

    static #isSnapshot(data) {
        if (!data || typeof data !== 'object') return false;
        return 'gameState' in data || 'player' in data || 'mapId' in data;
    }
}
