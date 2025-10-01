/**
 * ⚔️ 무기 선택 UI
 *
 * 게임 플레이 중 W키로 열어서 무기를 변경하는 UI
 */

import { Renderer } from '../systems/Renderer';
import { WeaponSystem } from '../systems/WeaponSystem';

export class WeaponSelectUI {
    private selectedIndex: number = 0;
    private isOpen: boolean = false;

    /**
     * UI 열기/닫기
     */
    toggle(): void {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.selectedIndex = 0;
        }
    }

    /**
     * 열려있는지 확인
     */
    isOpened(): boolean {
        return this.isOpen;
    }

    /**
     * 닫기
     */
    close(): void {
        this.isOpen = false;
    }

    /**
     * 위로 이동
     */
    moveUp(): void {
        if (this.selectedIndex > 0) {
            this.selectedIndex--;
        }
    }

    /**
     * 아래로 이동
     */
    moveDown(maxIndex: number): void {
        if (this.selectedIndex < maxIndex) {
            this.selectedIndex++;
        }
    }

    /**
     * 선택된 인덱스
     */
    getSelectedIndex(): number {
        return this.selectedIndex;
    }

    /**
     * 렌더링
     */
    render(renderer: Renderer, weaponSystem: WeaponSystem, soulPoints: number): void {
        if (!this.isOpen) return;

        const ctx = renderer.getContext();
        const weapons = weaponSystem.getAllWeapons();
        const currentWeapon = weaponSystem.getCurrentWeapon();

        // 반투명 배경
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, 1280, 720);

        // 메인 패널
        const panelX = 240;
        const panelY = 120;
        const panelWidth = 800;
        const panelHeight = 480;

        // 패널 배경
        ctx.fillStyle = 'rgba(20, 20, 30, 0.95)';
        ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);

        // 제목
        renderer.drawText(
            '⚔️ 무기 선택',
            640,
            panelY + 40,
            'bold 28px Arial',
            '#FFD700',
            'center'
        );

        // 소울 포인트 표시
        renderer.drawText(
            `💜 소울: ${soulPoints}`,
            panelX + panelWidth - 30,
            panelY + 40,
            'bold 18px Arial',
            '#9C27B0',
            'right'
        );

        // 무기 리스트
        const listStartY = panelY + 80;
        const itemHeight = 70;

        weapons.forEach((weapon, index) => {
            const y = listStartY + index * itemHeight;
            const isSelected = index === this.selectedIndex;
            const isCurrent = currentWeapon?.id === weapon.id;

            // 선택 배경
            if (isSelected) {
                ctx.fillStyle = 'rgba(255, 215, 0, 0.15)';
                ctx.fillRect(panelX + 20, y, panelWidth - 40, 60);
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 2;
                ctx.strokeRect(panelX + 20, y, panelWidth - 40, 60);
            }

            // 잠금 상태에 따른 색상
            const alpha = weapon.unlocked ? 1.0 : 0.4;

            // 아이콘
            const icon = weapon.category === 'melee' ? '⚔️' :
                weapon.category === 'ranged' ? '🏹' : '🔮';

            ctx.globalAlpha = alpha;
            renderer.drawText(
                icon,
                panelX + 50,
                y + 35,
                '32px Arial',
                weapon.unlocked ? '#FFFFFF' : '#666666',
                'left'
            );

            // 무기 이름
            renderer.drawText(
                weapon.name,
                panelX + 100,
                y + 25,
                'bold 18px Arial',
                weapon.unlocked ? '#FFFFFF' : '#666666',
                'left'
            );

            // 장착 중 표시
            if (isCurrent && weapon.unlocked) {
                renderer.drawText(
                    '(장착 중)',
                    panelX + 180,
                    y + 25,
                    '14px Arial',
                    '#00FF00',
                    'left'
                );
            }

            // 스탯 정보
            const stats = `데미지: ${weapon.baseDamage} | 속도: ${weapon.attackSpeed.toFixed(1)}/s | 사거리: ${weapon.range}px`;
            renderer.drawText(
                stats,
                panelX + 100,
                y + 48,
                '12px Arial',
                weapon.unlocked ? '#AAAAAA' : '#555555',
                'left'
            );

            // 잠금/해금 표시
            if (!weapon.unlocked) {
                renderer.drawText(
                    `🔒 ${weapon.unlockCost} 소울`,
                    panelX + panelWidth - 50,
                    y + 35,
                    'bold 14px Arial',
                    '#FFD700',
                    'right'
                );
            } else if (!isCurrent) {
                renderer.drawText(
                    '장착 가능',
                    panelX + panelWidth - 50,
                    y + 35,
                    '14px Arial',
                    '#00FF00',
                    'right'
                );
            }

            ctx.globalAlpha = 1.0;
        });

        // 조작 힌트
        const hints = [
            '↑↓: 선택',
            'Enter/Space: 장착 또는 해금',
            'W/ESC: 닫기'
        ];

        hints.forEach((hint, index) => {
            renderer.drawText(
                hint,
                640,
                panelY + panelHeight + 30 + index * 25,
                '14px Arial',
                '#888888',
                'center'
            );
        });
    }
}
