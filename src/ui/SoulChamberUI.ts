/**
 * 🏛️ Soul Chamber UI
 *
 * 영혼의 방 - 업그레이드 및 준비 화면
 */

import { Renderer } from '../systems/Renderer';
import { UpgradeSystem, Upgrade } from '../systems/UpgradeSystem';
import { WeaponSystem, WeaponData } from '../systems/WeaponSystem';
import { WeaponType } from '../types';

type MenuTab = 'upgrades' | 'stats' | 'start';

export class SoulChamberUI {
    private currentTab: MenuTab = 'upgrades';
    private selectedUpgradeIndex: number = 0;
    private selectedCategory: 'offense' | 'defense' | 'utility' = 'offense';
    private selectedWeaponIndex: number = 0;
    private animationTime: number = 0;
    private soulPoints: number = 0;
    private totalRuns: number = 0;
    private highestFloor: number = 0;

    private readonly tabs: { id: MenuTab; label: string; icon: string }[] = [
        { id: 'upgrades', label: '영구 업그레이드', icon: '⬆️' },
        { id: 'stats', label: '통계', icon: '📊' },
        { id: 'start', label: '도전 시작', icon: '🚪' }
    ];

    /**
     * 업데이트
     */
    update(deltaTime: number): void {
        this.animationTime += deltaTime;
    }

    /**
     * 소울 포인트 설정
     */
    setSoulPoints(points: number): void {
        this.soulPoints = points;
    }

    /**
     * 통계 설정
     */
    setStats(runs: number, highestFloor: number): void {
        this.totalRuns = runs;
        this.highestFloor = highestFloor;
    }

    /**
     * 탭 이동
     */
    moveTabLeft(): void {
        const currentIndex = this.tabs.findIndex(t => t.id === this.currentTab);
        const newIndex = (currentIndex - 1 + this.tabs.length) % this.tabs.length;
        this.currentTab = this.tabs[newIndex].id;
        this.selectedUpgradeIndex = 0;
    }

    moveTabRight(): void {
        const currentIndex = this.tabs.findIndex(t => t.id === this.currentTab);
        const newIndex = (currentIndex + 1) % this.tabs.length;
        this.currentTab = this.tabs[newIndex].id;
        this.selectedUpgradeIndex = 0;
    }

    /**
     * 업그레이드 선택 이동
     */
    moveUpgradeUp(): void {
        if (this.selectedUpgradeIndex > 0) {
            this.selectedUpgradeIndex--;
        }
    }

    moveUpgradeDown(maxIndex: number): void {
        if (this.selectedUpgradeIndex < maxIndex) {
            this.selectedUpgradeIndex++;
        }
    }

    /**
     * 카테고리 변경
     */
    changeCategory(category: 'offense' | 'defense' | 'utility'): void {
        this.selectedCategory = category;
        this.selectedUpgradeIndex = 0;
    }

    /**
     * 현재 선택된 업그레이드 인덱스
     */
    getSelectedUpgradeIndex(): number {
        return this.selectedUpgradeIndex;
    }

    /**
     * 현재 카테고리
     */
    getCurrentCategory(): 'offense' | 'defense' | 'utility' {
        return this.selectedCategory;
    }

    /**
     * 현재 탭
     */
    getCurrentTab(): MenuTab {
        return this.currentTab;
    }

    /**
     * 마우스 호버 확인 (커서 변경용)
     */
    isMouseOverClickable(x: number, y: number, upgradeSystem: UpgradeSystem): boolean {
        const clickResult = this.handleClick(x, y, upgradeSystem);
        return clickResult.action !== 'none';
    }

    /**
     * 마우스 클릭 처리
     */
    handleClick(x: number, y: number, upgradeSystem: UpgradeSystem): { action: 'none' | 'upgrade' | 'tab' | 'start'; upgradeId?: string } {
        // 탭 클릭 확인
        const tabWidth = 280;
        const startX = (1280 - tabWidth * this.tabs.length) / 2;
        const tabY = 120;

        for (let i = 0; i < this.tabs.length; i++) {
            const tabX = startX + i * tabWidth;
            if (x >= tabX && x <= tabX + tabWidth && y >= tabY && y <= tabY + 50) {
                this.currentTab = this.tabs[i].id;
                this.selectedUpgradeIndex = 0;
                if (this.tabs[i].id === 'start') {
                    return { action: 'start' };
                }
                return { action: 'tab' };
            }
        }

        // 업그레이드 탭에서 카테고리 클릭 확인
        if (this.currentTab === 'upgrades') {
            const catStartX = 100;
            const catY = 200;
            const catWidth = 150;
            const catHeight = 50;

            const categories: ('offense' | 'defense' | 'utility')[] = ['offense', 'defense', 'utility'];
            for (let i = 0; i < categories.length; i++) {
                const catX = catStartX + i * (catWidth + 20);
                if (x >= catX && x <= catX + catWidth && y >= catY && y <= catY + catHeight) {
                    this.changeCategory(categories[i]);
                    return { action: 'tab' };
                }
            }

            // 업그레이드 아이템 클릭 확인
            const upgrades = upgradeSystem.getUpgradesByCategory(this.selectedCategory);
            const listStartY = 290;
            const itemHeight = 80;
            const listPadding = 120;
            const itemWidth = 1280 - listPadding * 2;

            for (let i = 0; i < upgrades.length; i++) {
                const itemY = listStartY + i * itemHeight;
                if (x >= listPadding && x <= listPadding + itemWidth && y >= itemY + 2 && y <= itemY + itemHeight - 12) {
                    this.selectedUpgradeIndex = i;
                    return { action: 'upgrade', upgradeId: upgrades[i].id };
                }
            }
        }

        return { action: 'none' };
    }

    /**
     * 렌더링
     */
    render(renderer: Renderer, upgradeSystem: UpgradeSystem, weaponSystem?: WeaponSystem): void {
        const ctx = renderer.getContext();

        // 배경 그라데이션
        const bgGradient = ctx.createLinearGradient(0, 0, 0, 720);
        bgGradient.addColorStop(0, '#0a0a1a');
        bgGradient.addColorStop(0.5, '#1a1a3e');
        bgGradient.addColorStop(1, '#0a0a1a');
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, 1280, 720);

        // 배경 별
        this.drawStars(ctx);

        // 타이틀
        const pulse = Math.sin(this.animationTime * 2) * 0.3 + 0.7;
        renderer.drawText(
            '🏛️ 영혼의 성소',
            640,
            60,
            'bold 42px Arial',
            `rgba(233, 69, 96, ${pulse})`,
            'center'
        );

        // 소울 포인트 표시
        this.renderSoulPoints(renderer);

        // 탭 메뉴
        this.renderTabs(renderer);

        // 탭별 컨텐츠
        switch (this.currentTab) {
            case 'upgrades':
                this.renderUpgradesTab(renderer, upgradeSystem);
                break;
            case 'stats':
                this.renderStatsTab(renderer);
                break;
            case 'start':
                this.renderStartTab(renderer);
                break;
        }

        // 조작 힌트
        this.renderControlHints(renderer);
    }

    /**
     * 소울 포인트 표시
     */
    private renderSoulPoints(renderer: Renderer): void {
        const ctx = renderer.getContext();

        // 배경 패널
        ctx.fillStyle = 'rgba(30, 30, 40, 0.9)';
        ctx.fillRect(920, 10, 350, 80);
        ctx.strokeStyle = '#9C27B0';
        ctx.lineWidth = 2;
        ctx.strokeRect(920, 10, 350, 80);

        // 소울 아이콘 + 포인트
        renderer.drawText(
            '💜 소울 포인트',
            940,
            35,
            'bold 18px Arial',
            '#9C27B0',
            'left'
        );

        renderer.drawText(
            `${this.soulPoints}`,
            1095,
            70,
            'bold 36px Arial',
            '#FFFFFF',
            'center'
        );
    }

    /**
     * 탭 메뉴 렌더링
     */
    private renderTabs(renderer: Renderer): void {
        const ctx = renderer.getContext();
        const tabWidth = 340;
        const tabHeight = 70;
        const gap = 20;
        const totalWidth = (tabWidth * this.tabs.length) + (gap * (this.tabs.length - 1));
        const startX = (1280 - totalWidth) / 2;
        const tabY = 120;

        this.tabs.forEach((tab, index) => {
            const tabX = startX + index * (tabWidth + gap);
            const isSelected = tab.id === this.currentTab;

            // 탭 배경
            if (isSelected) {
                ctx.fillStyle = 'rgba(233, 69, 96, 0.3)';
                ctx.fillRect(tabX, tabY, tabWidth, tabHeight);
                ctx.strokeStyle = '#e94560';
                ctx.lineWidth = 3;
                ctx.strokeRect(tabX, tabY, tabWidth, tabHeight);
            } else {
                ctx.fillStyle = 'rgba(50, 50, 60, 0.5)';
                ctx.fillRect(tabX, tabY, tabWidth, tabHeight);
                ctx.strokeStyle = '#555555';
                ctx.lineWidth = 1;
                ctx.strokeRect(tabX, tabY, tabWidth, tabHeight);
            }

            // 탭 아이콘
            renderer.drawText(
                tab.icon,
                tabX + tabWidth / 2,
                tabY + 20,
                '24px Arial',
                isSelected ? '#FFFFFF' : '#888888',
                'center'
            );

            // 탭 텍스트
            renderer.drawText(
                tab.label,
                tabX + tabWidth / 2,
                tabY + 48,
                isSelected ? 'bold 16px Arial' : '14px Arial',
                isSelected ? '#FFFFFF' : '#AAAAAA',
                'center'
            );
        });
    }

    /**
     * 업그레이드 탭 렌더링
     */
    private renderUpgradesTab(renderer: Renderer, upgradeSystem: UpgradeSystem): void {
        const ctx = renderer.getContext();

        // 카테고리 버튼
        const categories = [
            { id: 'offense' as const, label: '⚔️ 공격', color: '#FF5252' },
            { id: 'defense' as const, label: '🛡️ 방어', color: '#4CAF50' },
            { id: 'utility' as const, label: '⚡ 유틸리티', color: '#2196F3' }
        ];

        const catStartX = 100;
        const catY = 200;
        const catWidth = 150;
        const catHeight = 50;

        categories.forEach((cat, index) => {
            const catX = catStartX + index * (catWidth + 20);
            const isSelected = cat.id === this.selectedCategory;

            // 선택된 카테고리 강조
            if (isSelected) {
                const pulse = Math.sin(this.animationTime * 5) * 0.2 + 0.8;
                ctx.fillStyle = `rgba(233, 69, 96, ${pulse * 0.5})`;
                ctx.fillRect(catX - 3, catY - 3, catWidth + 6, catHeight + 6);
            }

            ctx.fillStyle = isSelected ? 'rgba(233, 69, 96, 0.4)' : 'rgba(50, 50, 60, 0.7)';
            ctx.fillRect(catX, catY, catWidth, catHeight);
            ctx.strokeStyle = isSelected ? cat.color : '#555555';
            ctx.lineWidth = isSelected ? 4 : 1;
            ctx.strokeRect(catX, catY, catWidth, catHeight);

            renderer.drawText(
                cat.label,
                catX + catWidth / 2,
                catY + catHeight / 2 + 5,
                isSelected ? 'bold 18px Arial' : '14px Arial',
                isSelected ? '#FFFFFF' : '#AAAAAA',
                'center'
            );

            // 선택 화살표 표시
            if (isSelected) {
                renderer.drawText(
                    '▼',
                    catX + catWidth / 2,
                    catY + catHeight + 15,
                    'bold 14px Arial',
                    cat.color,
                    'center'
                );
            }
        });

        // 업그레이드 리스트
        const upgrades = upgradeSystem.getUpgradesByCategory(this.selectedCategory);
        const listStartY = 290;
        const itemHeight = 80;
        const listPadding = 120;
        const itemWidth = 1280 - listPadding * 2;

        upgrades.forEach((upgrade, index) => {
            const itemY = listStartY + index * itemHeight;
            const isSelected = index === this.selectedUpgradeIndex;
            const cost = upgradeSystem.getUpgradeCost(upgrade.id);
            const canAfford = this.soulPoints >= cost;
            const isMaxLevel = upgrade.currentLevel >= upgrade.maxLevel;

            // 아이템 배경
            if (isSelected) {
                const pulse = Math.sin(this.animationTime * 5) * 0.2 + 0.8;
                ctx.fillStyle = `rgba(233, 69, 96, ${pulse * 0.3})`;
                ctx.fillRect(listPadding - 5, itemY, itemWidth + 10, itemHeight - 10);
            }

            ctx.fillStyle = 'rgba(30, 30, 40, 0.8)';
            ctx.fillRect(listPadding, itemY + 2, itemWidth, itemHeight - 12);
            ctx.strokeStyle = isSelected ? '#e94560' : '#555555';
            ctx.lineWidth = isSelected ? 2 : 1;
            ctx.strokeRect(listPadding, itemY + 2, itemWidth, itemHeight - 12);

            // 업그레이드 이름
            renderer.drawText(
                upgrade.name,
                listPadding + 20,
                itemY + 25,
                'bold 20px Arial',
                '#FFFFFF',
                'left'
            );

            // 설명
            renderer.drawText(
                upgrade.description,
                listPadding + 20,
                itemY + 52,
                '14px Arial',
                '#AAAAAA',
                'left'
            );

            // 레벨 표시
            renderer.drawText(
                `Lv.${upgrade.currentLevel}/${upgrade.maxLevel}`,
                listPadding + itemWidth - 200,
                itemY + 40,
                'bold 18px Arial',
                '#FFD700',
                'left'
            );

            // 비용 또는 MAX 표시
            if (isMaxLevel) {
                renderer.drawText(
                    'MAX',
                    listPadding + itemWidth - 50,
                    itemY + 40,
                    'bold 22px Arial',
                    '#4CAF50',
                    'center'
                );
            } else {
                renderer.drawText(
                    `💜 ${cost}`,
                    listPadding + itemWidth - 50,
                    itemY + 40,
                    'bold 20px Arial',
                    canAfford ? '#9C27B0' : '#666666',
                    'center'
                );
            }
        });
    }

    /**
     * 무기 탭 렌더링
     */
    private renderWeaponsTab(renderer: Renderer, weaponSystem?: WeaponSystem): void {
        if (!weaponSystem) return;

        const ctx = renderer.getContext();
        const weapons = weaponSystem.getAllWeapons();
        const currentWeapon = weaponSystem.getCurrentWeapon();

        // 제목
        renderer.drawText(
            '⚔️ 무기 선택',
            640,
            200,
            'bold 32px Arial',
            '#FFD700',
            'center'
        );

        // 설명
        renderer.drawText(
            '보유한 무기를 선택하여 장착하거나 새로운 무기를 해금하세요',
            640,
            250,
            '16px Arial',
            '#AAAAAA',
            'center'
        );

        // 무기 리스트
        const startY = 300;
        const itemHeight = 100;

        weapons.forEach((weapon, index) => {
            const y = startY + index * itemHeight;
            const isSelected = index === this.selectedWeaponIndex;
            const isCurrent = currentWeapon?.id === weapon.id;

            // 배경
            if (isSelected) {
                ctx.fillStyle = 'rgba(255, 215, 0, 0.1)';
                ctx.fillRect(200, y - 10, 880, 90);
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 2;
                ctx.strokeRect(200, y - 10, 880, 90);
            }

            // 잠금 상태에 따른 색상
            const nameColor = weapon.unlocked ? '#FFFFFF' : '#666666';
            const descColor = weapon.unlocked ? '#AAAAAA' : '#444444';

            // 무기 아이콘 (카테고리별)
            const icon = weapon.category === 'melee' ? '⚔️' :
                weapon.category === 'ranged' ? '🏹' : '🔮';

            renderer.drawText(
                icon,
                230,
                y + 30,
                '32px Arial',
                nameColor,
                'left'
            );

            // 무기 이름
            renderer.drawText(
                weapon.name,
                280,
                y + 15,
                'bold 20px Arial',
                nameColor,
                'left'
            );

            // 현재 장착 표시
            if (isCurrent && weapon.unlocked) {
                renderer.drawText(
                    '(장착 중)',
                    380,
                    y + 15,
                    '16px Arial',
                    '#00FF00',
                    'left'
                );
            }

            // 설명
            renderer.drawText(
                weapon.description,
                280,
                y + 45,
                '14px Arial',
                descColor,
                'left'
            );

            // 스탯 정보
            const statInfo = `데미지: ${weapon.baseDamage} | 속도: ${weapon.attackSpeed.toFixed(1)}/s | 사거리: ${weapon.range}px | 크리: ${(weapon.criticalChance * 100).toFixed(0)}%`;
            renderer.drawText(
                statInfo,
                280,
                y + 65,
                '12px Arial',
                descColor,
                'left'
            );

            // 잠금/해금 상태
            if (!weapon.unlocked) {
                renderer.drawText(
                    `🔒 해금: ${weapon.unlockCost} 소울`,
                    1000,
                    y + 30,
                    'bold 16px Arial',
                    '#FFD700',
                    'right'
                );
            } else if (!isCurrent) {
                renderer.drawText(
                    '장착 가능',
                    1000,
                    y + 30,
                    '16px Arial',
                    '#00FF00',
                    'right'
                );
            }
        });

        // 조작 힌트
        const hints = [
            '↑↓: 무기 선택',
            'Enter/Space: 장착 또는 해금',
            'Q/E: 탭 전환',
            'ESC: 돌아가기'
        ];

        hints.forEach((hint, index) => {
            renderer.drawText(
                hint,
                640,
                650 + index * 25,
                '14px Arial',
                '#888888',
                'center'
            );
        });
    }

    /**
     * 통계 탭 렌더링
     */
    private renderStatsTab(renderer: Renderer): void {
        const ctx = renderer.getContext();

        renderer.drawText(
            '📊 플레이 통계',
            640,
            220,
            'bold 32px Arial',
            '#FFFFFF',
            'center'
        );

        // 통계 패널
        const panelX = 240;
        const panelY = 250;
        const panelWidth = 800;
        const panelHeight = 350;

        ctx.fillStyle = 'rgba(30, 30, 40, 0.9)';
        ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
        ctx.strokeStyle = '#e94560';
        ctx.lineWidth = 3;
        ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);

        const stats = [
            { label: '총 도전 횟수', value: `${this.totalRuns}회` },
            { label: '최고 도달 층수', value: `${this.highestFloor}층` },
            { label: '보유 소울 포인트', value: `${this.soulPoints}` }
        ];

        stats.forEach((stat, index) => {
            const statY = panelY + 100 + index * 80;

            renderer.drawText(
                stat.label,
                panelX + 60,
                statY,
                '22px Arial',
                '#AAAAAA',
                'left'
            );

            renderer.drawText(
                stat.value,
                panelX + panelWidth - 60,
                statY,
                'bold 28px Arial',
                '#FFD700',
                'right'
            );
        });
    }

    /**
     * 도전 시작 탭 렌더링
     */
    private renderStartTab(renderer: Renderer): void {
        const ctx = renderer.getContext();

        const pulse = Math.sin(this.animationTime * 3) * 0.3 + 0.7;

        renderer.drawText(
            '🚪 던전 입장',
            640,
            280,
            'bold 48px Arial',
            `rgba(233, 69, 96, ${pulse})`,
            'center'
        );

        renderer.drawText(
            '준비가 되셨나요?',
            640,
            350,
            '24px Arial',
            '#FFFFFF',
            'center'
        );

        renderer.drawText(
            'Enter를 눌러 도전을 시작하세요',
            640,
            420,
            'bold 20px Arial',
            `rgba(255, 215, 0, ${pulse})`,
            'center'
        );

        // 경고 메시지
        renderer.drawText(
            '⚠️ 던전에서 죽으면 다시 여기로 돌아옵니다',
            640,
            500,
            '16px Arial',
            '#FF5722',
            'center'
        );
    }

    /**
     * 조작 힌트
     */
    private renderControlHints(renderer: Renderer): void {
        let hints: string[] = [];

        if (this.currentTab === 'upgrades') {
            hints = [
                'Q/E 탭 이동',
                '← → 카테고리',
                '↑ ↓ 선택',
                'Enter 구매',
                'ESC 나가기'
            ];
        } else {
            hints = [
                'Q/E 탭 이동',
                'Enter 확인',
                'ESC 나가기'
            ];
        }

        hints.forEach((hint, index) => {
            renderer.drawText(
                hint,
                150 + index * 200,
                690,
                '14px Arial',
                '#888888',
                'left'
            );
        });
    }

    /**
     * 배경 별
     */
    private drawStars(ctx: CanvasRenderingContext2D): void {
        const starCount = 100;

        for (let i = 0; i < starCount; i++) {
            const seed = i * 34567;
            const x = (seed * 9301 + 49297) % 1280;
            const y = (seed * 3571 + 29573) % 720;
            const size = ((seed * 7919) % 2) + 1;
            const twinkle = Math.sin(this.animationTime * 1.5 + i) * 0.5 + 0.5;

            ctx.fillStyle = `rgba(200, 200, 255, ${twinkle * 0.7})`;
            ctx.fillRect(x, y, size, size);
        }
    }

    /**
     * 무기 선택 인덱스 가져오기
     */
    getSelectedWeaponIndex(): number {
        return this.selectedWeaponIndex;
    }

    /**
     * 무기 선택 위로 이동
     */
    moveWeaponUp(): void {
        if (this.selectedWeaponIndex > 0) {
            this.selectedWeaponIndex--;
        }
    }

    /**
     * 무기 선택 아래로 이동
     */
    moveWeaponDown(maxIndex: number): void {
        if (this.selectedWeaponIndex < maxIndex) {
            this.selectedWeaponIndex++;
        }
    }
}
