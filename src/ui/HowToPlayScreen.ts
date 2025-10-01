/**
 * 📖 조작법 화면
 *
 * 게임 조작 방법과 시스템 설명을 제공합니다.
 */

import { Renderer } from '../systems/Renderer';

export class HowToPlayScreen {
    private animationTime: number = 0;

    /**
     * 업데이트
     */
    update(deltaTime: number): void {
        this.animationTime += deltaTime;
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

        // 장식용 별
        this.drawStars(ctx);

        // 타이틀
        renderer.drawText(
            '📖 조작법',
            640,
            80,
            'bold 36px Arial',
            '#e94560',
            'center'
        );

        // 컨텐츠 박스
        const boxX = 200;
        const boxY = 140;
        const boxWidth = 880;
        const boxHeight = 500;

        ctx.fillStyle = 'rgba(30, 30, 40, 0.9)';
        ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
        ctx.strokeStyle = '#e94560';
        ctx.lineWidth = 3;
        ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

        // 조작법 섹션들
        let currentY = boxY + 40;

        // 이동 조작
        this.drawSection(
            renderer,
            boxX + 40,
            currentY,
            '🎮 이동',
            [
                '↑ ↓ ← → (방향키): 캐릭터 이동',
                'W A S D: 캐릭터 이동 (대체키)'
            ]
        );
        currentY += 100;

        // 전투 조작
        this.drawSection(
            renderer,
            boxX + 40,
            currentY,
            '⚔️ 전투',
            [
                'Space: 공격',
                '적에게 접근하여 공격하세요'
            ]
        );
        currentY += 100;

        // 상호작용
        this.drawSection(
            renderer,
            boxX + 40,
            currentY,
            '💬 상호작용',
            [
                'E 또는 Enter: NPC 대화, 아이템 획득',
                'I: 인벤토리 열기/닫기',
                'M: 미니맵 열기/닫기'
            ]
        );
        currentY += 120;

        // 시스템
        this.drawSection(
            renderer,
            boxX + 40,
            currentY,
            '⚙️ 시스템',
            [
                'ESC: 일시정지 / 메뉴',
                'F: 전체화면 토글'
            ]
        );

        // 게임 팁
        const tipY = boxY + boxHeight + 20;
        renderer.drawText(
            '💡 팁: 던전을 탐험하고 적을 처치하여 소울 포인트를 모으세요!',
            640,
            tipY,
            'italic 16px Arial',
            '#FFD700',
            'center'
        );

        // 하단 힌트
        const pulse = Math.sin(this.animationTime * 3) * 0.3 + 0.7;
        renderer.drawText(
            'ESC 키를 눌러 돌아가기',
            640,
            680,
            '16px Arial',
            `rgba(255, 215, 0, ${pulse})`,
            'center'
        );
    }

    /**
     * 섹션 그리기
     */
    private drawSection(
        renderer: Renderer,
        x: number,
        y: number,
        title: string,
        items: string[]
    ): void {
        // 섹션 타이틀
        renderer.drawText(title, x, y, 'bold 20px Arial', '#FFD700', 'left');

        // 항목들
        items.forEach((item, index) => {
            const itemY = y + 30 + index * 25;
            renderer.drawText(item, x + 20, itemY, '16px Arial', '#CCCCCC', 'left');
        });
    }

    /**
     * 배경 별 그리기
     */
    private drawStars(ctx: CanvasRenderingContext2D): void {
        const starCount = 50;

        for (let i = 0; i < starCount; i++) {
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
