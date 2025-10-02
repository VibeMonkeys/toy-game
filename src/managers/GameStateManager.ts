/**
 * 🎮 게임 상태 매니저
 *
 * 게임 모드, 층, 메타 진행도 등 게임 상태 관리
 */

import { GameMode } from '../types';
import { GAME_INFO } from '../utils/Constants';

export class GameStateManager {
    // 게임 모드
    private gameMode: GameMode = GameMode.LOADING;
    private previousGameMode: GameMode = GameMode.PLAYING; // Soul Chamber 토글용

    // 현재 던전 상태
    private currentFloor: number = 1;

    // 플레이어 정보
    private playerName: string = GAME_INFO.DEFAULT_PLAYER_NAME;

    // 메타 진행도
    private soulPoints: number = 0;
    private totalRuns: number = 0;
    private highestFloor: number = 0;

    // UI 상태
    private inventoryOpen: boolean = false;
    private soulChamberOpen: boolean = false;

    /**
     * 게임 모드 가져오기
     */
    getGameMode(): GameMode {
        return this.gameMode;
    }

    /**
     * 이전 게임 모드 가져오기
     */
    getPreviousGameMode(): GameMode {
        return this.previousGameMode;
    }

    /**
     * 게임 모드 변경
     */
    changeGameMode(newMode: GameMode): void {
        console.log(`🔄 게임 모드 변경: ${this.gameMode} → ${newMode}`);
        this.previousGameMode = this.gameMode;
        this.gameMode = newMode;
    }

    /**
     * 현재 층 가져오기
     */
    getCurrentFloor(): number {
        return this.currentFloor;
    }

    /**
     * 현재 층 설정
     */
    setCurrentFloor(floor: number): void {
        this.currentFloor = floor;
    }

    /**
     * 다음 층으로 진행
     */
    nextFloor(): void {
        this.currentFloor++;
        if (this.currentFloor > this.highestFloor) {
            this.highestFloor = this.currentFloor;
        }
    }

    /**
     * 플레이어 이름 가져오기
     */
    getPlayerName(): string {
        return this.playerName;
    }

    /**
     * 플레이어 이름 설정
     */
    setPlayerName(name: string): void {
        this.playerName = name;
    }

    /**
     * 소울 포인트 가져오기
     */
    getSoulPoints(): number {
        return this.soulPoints;
    }

    /**
     * 소울 포인트 추가
     */
    addSoulPoints(points: number): void {
        this.soulPoints += points;
    }

    /**
     * 소울 포인트 사용
     */
    spendSoulPoints(points: number): boolean {
        if (this.soulPoints >= points) {
            this.soulPoints -= points;
            return true;
        }
        return false;
    }

    /**
     * 총 플레이 횟수 가져오기
     */
    getTotalRuns(): number {
        return this.totalRuns;
    }

    /**
     * 플레이 횟수 증가
     */
    incrementTotalRuns(): void {
        this.totalRuns++;
    }

    /**
     * 최고 도달 층 가져오기
     */
    getHighestFloor(): number {
        return this.highestFloor;
    }

    /**
     * 인벤토리 열기/닫기 상태
     */
    isInventoryOpen(): boolean {
        return this.inventoryOpen;
    }

    /**
     * 인벤토리 토글
     */
    toggleInventory(): void {
        this.inventoryOpen = !this.inventoryOpen;
    }

    /**
     * 인벤토리 닫기
     */
    closeInventory(): void {
        this.inventoryOpen = false;
    }

    /**
     * Soul Chamber 열기/닫기 상태
     */
    isSoulChamberOpen(): boolean {
        return this.soulChamberOpen;
    }

    /**
     * Soul Chamber 토글
     */
    toggleSoulChamber(): void {
        this.soulChamberOpen = !this.soulChamberOpen;
    }

    /**
     * Soul Chamber 닫기
     */
    closeSoulChamber(): void {
        this.soulChamberOpen = false;
    }

    /**
     * 새 게임 시작 시 상태 초기화
     */
    resetForNewGame(): void {
        this.currentFloor = 1;
        this.inventoryOpen = false;
        this.soulChamberOpen = false;
        this.incrementTotalRuns();
    }

    /**
     * 저장 데이터 변환
     */
    toSaveData(): {
        playerName: string;
        soulPoints: number;
        totalRuns: number;
        highestFloor: number;
    } {
        return {
            playerName: this.playerName,
            soulPoints: this.soulPoints,
            totalRuns: this.totalRuns,
            highestFloor: this.highestFloor
        };
    }

    /**
     * 저장 데이터에서 복원
     */
    fromSaveData(data: {
        playerName?: string;
        soulPoints?: number;
        totalRuns?: number;
        highestFloor?: number;
    }): void {
        if (data.playerName) this.playerName = data.playerName;
        if (data.soulPoints !== undefined) this.soulPoints = data.soulPoints;
        if (data.totalRuns !== undefined) this.totalRuns = data.totalRuns;
        if (data.highestFloor !== undefined) this.highestFloor = data.highestFloor;
    }
}
