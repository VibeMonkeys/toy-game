/**
 * 🎯 엔티티 매니저
 *
 * 플레이어, 적, NPC 등 모든 게임 엔티티 관리
 */

import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';
import { Boss } from '../entities/Boss';
import { NPC } from '../entities/NPC';
import { Vector2D } from '../types';

export class EntityManager {
    private player: Player | null = null;
    private enemies: Enemy[] = [];
    private npcs: NPC[] = [];

    /**
     * 플레이어 설정
     */
    setPlayer(player: Player): void {
        this.player = player;
    }

    /**
     * 플레이어 가져오기
     */
    getPlayer(): Player | null {
        return this.player;
    }

    /**
     * 적 추가
     */
    addEnemy(enemy: Enemy): void {
        this.enemies.push(enemy);
    }

    /**
     * 적 목록 설정
     */
    setEnemies(enemies: Enemy[]): void {
        this.enemies = enemies;
    }

    /**
     * 적 목록 가져오기
     */
    getEnemies(): Enemy[] {
        return this.enemies;
    }

    /**
     * 적 제거
     */
    removeEnemy(enemy: Enemy): void {
        const index = this.enemies.indexOf(enemy);
        if (index > -1) {
            this.enemies.splice(index, 1);
        }
    }

    /**
     * NPC 추가
     */
    addNPC(npc: NPC): void {
        this.npcs.push(npc);
    }

    /**
     * NPC 목록 설정
     */
    setNPCs(npcs: NPC[]): void {
        this.npcs = npcs;
    }

    /**
     * NPC 목록 가져오기
     */
    getNPCs(): NPC[] {
        return this.npcs;
    }

    /**
     * 가장 가까운 적 찾기
     */
    findNearestEnemy(position: Vector2D): Enemy | null {
        if (this.enemies.length === 0) return null;

        let nearestEnemy: Enemy | null = null;
        let minDistance = Infinity;

        for (const enemy of this.enemies) {
            const dx = enemy.x - position.x;
            const dy = enemy.y - position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < minDistance) {
                minDistance = distance;
                nearestEnemy = enemy;
            }
        }

        return nearestEnemy;
    }

    /**
     * 범위 내 적 찾기
     */
    findEnemiesInRange(position: Vector2D, range: number): Enemy[] {
        return this.enemies.filter(enemy => {
            const dx = enemy.x - position.x;
            const dy = enemy.y - position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance <= range;
        });
    }

    /**
     * 범위 내 NPC 찾기
     */
    findNPCInRange(position: Vector2D, range: number): NPC | null {
        for (const npc of this.npcs) {
            const dx = npc.x - position.x;
            const dy = npc.y - position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= range) {
                return npc;
            }
        }

        return null;
    }

    /**
     * 보스 찾기
     */
    findBoss(): Boss | null {
        for (const enemy of this.enemies) {
            if (enemy instanceof Boss) {
                return enemy;
            }
        }
        return null;
    }

    /**
     * 모든 엔티티 업데이트
     */
    updateAll(deltaTime: number): void {
        // 플레이어 업데이트
        if (this.player) {
            this.player.update(deltaTime);
        }

        // 적 업데이트 (플레이어 필요)
        if (this.player) {
            for (const enemy of this.enemies) {
                enemy.update(deltaTime, this.player);
            }
        }

        // NPC 업데이트
        for (const npc of this.npcs) {
            npc.update(deltaTime);
        }
    }

    /**
     * 죽은 적 제거
     */
    removeDeadEnemies(): Enemy[] {
        const deadEnemies: Enemy[] = [];

        this.enemies = this.enemies.filter(enemy => {
            if (enemy.isDead()) {
                deadEnemies.push(enemy);
                return false;
            }
            return true;
        });

        return deadEnemies;
    }

    /**
     * 모든 엔티티 초기화
     */
    clear(): void {
        this.player = null;
        this.enemies = [];
        this.npcs = [];
    }

    /**
     * 적 수 가져오기
     */
    getEnemyCount(): number {
        return this.enemies.length;
    }

    /**
     * 살아있는 적 수
     */
    getAliveEnemyCount(): number {
        return this.enemies.filter(enemy => !enemy.isDead()).length;
    }
}
