import { CONSTANTS } from '../utils/Constants.js';
import { MapData } from './MapData.js';

export class MapManager {
    constructor() {
        this.maps = {};
        this.currentMapId = CONSTANTS.MAPS.BUILDING_ENTRANCE;
        this.initializeMaps();
    }

    initializeMaps() {
        this.maps = MapData.getAllMaps();
    }

    getCurrentMap() {
        return this.maps[this.currentMapId];
    }

    getMap(mapId) {
        return this.maps[mapId];
    }

    setCurrentMap(mapId) {
        if (this.maps[mapId]) {
            this.currentMapId = mapId;
            return true;
        }
        return false;
    }

    getCurrentMapId() {
        return this.currentMapId;
    }

    isValidPosition(x, y, excludePlayer = false, playerPos = null) {
        const currentMap = this.getCurrentMap();
        if (!currentMap) return false;

        // 맵 경계 확인
        if (x < 1 || x >= CONSTANTS.MAP_WIDTH - 1 || y < 1 || y >= CONSTANTS.MAP_HEIGHT - 1) {
            return false;
        }

        // 벽 충돌 확인
        if (currentMap.walls && currentMap.walls.some(wall => wall.x === x && wall.y === y)) {
            return false;
        }

        // 다른 NPC와 충돌 확인
        if (currentMap.npcs && currentMap.npcs.some(npc => npc.x === x && npc.y === y)) {
            return false;
        }

        // 플레이어와 충돌 확인 (옵션)
        if (!excludePlayer && playerPos && playerPos.x === x && playerPos.y === y) {
            return false;
        }

        return true;
    }

    findPortalAt(x, y) {
        const currentMap = this.getCurrentMap();
        if (!currentMap || !currentMap.portals) return null;

        return currentMap.portals.find(portal => portal.x === x && portal.y === y);
    }

    findItemAt(x, y) {
        const currentMap = this.getCurrentMap();
        if (!currentMap || !currentMap.items) return null;

        return currentMap.items.find(item => item.x === x && item.y === y && !item.collected);
    }

    findNPCAt(x, y) {
        const currentMap = this.getCurrentMap();
        if (!currentMap || !currentMap.npcs) return null;

        return currentMap.npcs.find(npc => npc.x === x && npc.y === y);
    }

    getNearbyNPC(x, y, range = 1) {
        const currentMap = this.getCurrentMap();
        if (!currentMap || !currentMap.npcs) return null;

        for (let npc of currentMap.npcs) {
            const distance = Math.abs(npc.x - x) + Math.abs(npc.y - y);
            if (distance <= range) {
                return npc;
            }
        }
        return null;
    }

    getNearbyPortal(x, y, range = 1) {
        const currentMap = this.getCurrentMap();
        if (!currentMap || !currentMap.portals) return null;

        for (let portal of currentMap.portals) {
            const distance = Math.abs(portal.x - x) + Math.abs(portal.y - y);
            if (distance <= range) {
                return portal;
            }
        }
        return null;
    }

    collectItem(x, y) {
        const item = this.findItemAt(x, y);
        if (item) {
            item.collected = true;
            return item;
        }
        return null;
    }

};