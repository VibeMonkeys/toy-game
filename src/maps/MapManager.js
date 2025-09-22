import { CONSTANTS } from '../utils/Constants.js';
import { MapData } from './MapData.js';
import { VendingMachine } from '../objects/VendingMachine.js';
import { Computer } from '../objects/Computer.js';
import { Printer } from '../objects/Printer.js';

export class MapManager {
    constructor() {
        this.maps = {};
        this.currentMapId = CONSTANTS.MAPS.LOBBY;
        this.interactableObjects = {}; // 맵별 상호작용 오브젝트 저장
        this.initializeMaps();
    }

    initializeMaps() {
        this.maps = MapData.getAllMaps();
        this.initializeInteractableObjects();
    }

    // 상호작용 오브젝트 초기화
    initializeInteractableObjects() {
        Object.keys(this.maps).forEach(mapId => {
            this.interactableObjects[mapId] = [];
            const map = this.maps[mapId];

            if (map.officeItems) {
                // 자판기 초기화
                if (map.officeItems.vendingMachines) {
                    map.officeItems.vendingMachines.forEach(data => {
                        const vendingMachine = new VendingMachine(data.x, data.y, data.type);
                        this.interactableObjects[mapId].push(vendingMachine);
                    });
                }

                // 컴퓨터 초기화
                if (map.officeItems.interactableComputers) {
                    map.officeItems.interactableComputers.forEach(data => {
                        const computer = new Computer(data.x, data.y, data.type);
                        this.interactableObjects[mapId].push(computer);
                    });
                }

                // 프린터 초기화
                if (map.officeItems.interactablePrinters) {
                    map.officeItems.interactablePrinters.forEach(data => {
                        const printer = new Printer(data.x, data.y, data.type);
                        this.interactableObjects[mapId].push(printer);
                    });
                }
            }
        });
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

    // 상호작용 오브젝트 관련 메서드들
    getCurrentMapObjects() {
        return this.interactableObjects[this.currentMapId] || [];
    }

    getNearbyObject(x, y, range = 1) {
        const objects = this.getCurrentMapObjects();

        for (let obj of objects) {
            if (obj.isPlayerNearby(x, y, range)) {
                return obj;
            }
        }
        return null;
    }

    getObjectAt(x, y) {
        const objects = this.getCurrentMapObjects();

        for (let obj of objects) {
            if (obj.x === x && obj.y === y) {
                return obj;
            }
        }
        return null;
    }

    updateObjects(deltaTime) {
        const objects = this.getCurrentMapObjects();
        objects.forEach(obj => {
            if (obj.update) {
                obj.update(deltaTime);
            }
        });
    }

    // 오브젝트 타입별 검색
    getObjectsByType(type) {
        const objects = this.getCurrentMapObjects();
        return objects.filter(obj => obj.type === type);
    }

    // 모든 자판기 반환
    getVendingMachines() {
        return this.getObjectsByType(CONSTANTS.OBJECT_TYPES.VENDING_MACHINE);
    }

    // 모든 컴퓨터 반환
    getComputers() {
        return this.getObjectsByType(CONSTANTS.OBJECT_TYPES.COMPUTER);
    }

    // 모든 프린터 반환
    getPrinters() {
        return this.getObjectsByType(CONSTANTS.OBJECT_TYPES.PRINTER);
    }

};