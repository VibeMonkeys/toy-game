/**
 * 🎮 타이틀 화면
 *
 * 메인 메뉴, 크레딧, 게임 설명 등을 제공합니다.
 */

import { Renderer } from '../systems/Renderer';
import { GAME_INFO } from '../utils/Constants';

export type TitleMenuOption = 'start' | 'how_to_play' | 'credits' | 'exit';

export class TitleScreen {
    private menuOptions: { id: TitleMenuOption; label: string }[] = [
        { id: 'start', label: '🎮 게임 시작' },
        { id: 'how_to_play', label: '📖 조작법' },
        { id: 'credits', label: '✨ 크레딧' }
    ];

    private selectedIndex: number = 0;
    private animationTime: number = 0;

    /**
     * 업데이트
     */
    update(deltaTime: number): void {
        this.animationTime += deltaTime;
    }

    /**
     * 위로 이동
     */
    moveUp(): void {
        this.selectedIndex = (this.selectedIndex - 1 + this.menuOptions.length) % this.menuOptions.length;
    }

    /**
     * 아래로 이동
     */
    moveDown(): void {
        this.selectedIndex = (this.selectedIndex + 1) % this.menuOptions.length;
    }

    /**
     * 선택된 옵션 가져오기
     */
    getSelectedOption(): TitleMenuOption {
        return this.menuOptions[this.selectedIndex].id;
    }

    /**
     * 렌더링
     */
    render(renderer: Renderer): void {
        const ctx = renderer.getContext();

        // 배경 그라데이션
        const bgGradient = ctx.createLinearGradient(0, 0, 0, 720);
        bgGradient.addColorStop(0, '#1a1a2e');
        bgGradient.addColorStop(0.5, '#16213e');
        bgGradient.addColorStop(1, '#0f3460');
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, 1280, 720);

        // 장식용 파티클 (별)
        this.drawStars(ctx);

        // 게임 로고 (그림자 효과)
        const logoY = 150;

        // 로고 그림자
        renderer.drawText(
            `⚔️ ${GAME_INFO.TITLE}`,
            642,
            logoY + 3,
            'bold 56px Arial',
            'rgba(0, 0, 0, 0.5)',
            'center'
        );

        // 로고 본체 (발광 효과)
        const glowIntensity = Math.sin(this.animationTime * 2) * 0.3 + 0.7;
        renderer.drawText(
            `⚔️ ${GAME_INFO.TITLE}`,
            640,
            logoY,
            'bold 56px Arial',
            `rgba(233, 69, 96, ${glowIntensity})`,
            'center'
        );

        // 서브타이틀
        renderer.drawText(
            GAME_INFO.TITLE_EN,
            640,
            logoY + 50,
            'italic 24px Arial',
            'rgba(255, 255, 255, 0.6)',
            'center'
        );

        // 메뉴 배경 패널
        const menuX = 440;
        const menuY = 320;
        const menuWidth = 400;
        const menuHeight = 250;

        ctx.fillStyle = 'rgba(30, 30, 40, 0.8)';
        ctx.fillRect(menuX, menuY, menuWidth, menuHeight);
        ctx.strokeStyle = '#e94560';
        ctx.lineWidth = 3;
        ctx.strokeRect(menuX, menuY, menuWidth, menuHeight);

        // 메뉴 옵션들
        const optionStartY = menuY + 60;
        const optionSpacing = 70;

        this.menuOptions.forEach((option, index) => {
            const isSelected = index === this.selectedIndex;
            const optionY = optionStartY + index * optionSpacing;

            // 선택된 항목 배경
            if (isSelected) {
                const pulse = Math.sin(this.animationTime * 5) * 0.2 + 0.8;
                ctx.fillStyle = `rgba(233, 69, 96, ${pulse * 0.3})`;
                ctx.fillRect(menuX + 20, optionY - 25, menuWidth - 40, 50);
            }

            // 화살표 (선택 표시)
            const arrow = isSelected ? '▶' : ' ';
            const arrowX = menuX + 50;

            renderer.drawText(
                arrow,
                arrowX,
                optionY,
                'bold 24px Arial',
                '#e94560',
                'left'
            );

            // 옵션 텍스트
            renderer.drawText(
                option.label,
                arrowX + 40,
                optionY,
                isSelected ? 'bold 24px Arial' : '22px Arial',
                isSelected ? '#ffffff' : '#cccccc',
                'left'
            );
        });

        // 조작 힌트
        const hintY = menuY + menuHeight + 40;
        renderer.drawText(
            '↑↓ 선택  |  Enter 또는 Space 확인',
            640,
            hintY,
            '16px Arial',
            '#888888',
            'center'
        );

        // 버전 정보
        renderer.drawText(
            'v1.0.0 - TypeScript + Canvas',
            640,
            680,
            '14px Arial',
            '#555555',
            'center'
        );

        // 제작자 정보 (작게)
        renderer.drawText(
            'Made with ❤️ by Jinan',
            640,
            700,
            '12px Arial',
            '#444444',
            'center'
        );
    }

    /**
     * 배경 별 그리기
     */
    private drawStars(ctx: CanvasRenderingContext2D): void {
        const starCount = 50;

        for (let i = 0; i < starCount; i++) {
            // 시드 기반 랜덤 (일관성 있게)
            const seed = i * 12345;
            const x = (seed * 9301 + 49297) % 1280;
            const y = (seed * 3571 + 29573) % 720;
            const size = ((seed * 7919) % 3) + 1;
            const twinkle = Math.sin(this.animationTime * 2 + i) * 0.5 + 0.5;

            ctx.fillStyle = `rgba(255, 255, 255, ${twinkle * 0.8})`;
            ctx.fillRect(x, y, size, size);
        }
    }
}
