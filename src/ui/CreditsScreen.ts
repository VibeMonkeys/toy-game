/**
 * ✨ 크레딧 화면
 *
 * 게임 제작 크레딧을 보여줍니다.
 */

import { Renderer } from '../systems/Renderer';
import { GAME_INFO } from '../utils/Constants';

export class CreditsScreen {
    private scrollOffset: number = 0;
    private scrollSpeed: number = 30; // 픽셀/초
    private animationTime: number = 0;

    /**
     * 업데이트
     */
    update(deltaTime: number): void {
        this.animationTime += deltaTime;
        this.scrollOffset += this.scrollSpeed * deltaTime;
    }

    /**
     * 스크롤 리셋
     */
    reset(): void {
        this.scrollOffset = 0;
        this.animationTime = 0;
    }

    /**
     * 렌더링
     */
    render(renderer: Renderer): void {
        const ctx = renderer.getContext();

        // 배경 그라데이션
        const bgGradient = ctx.createLinearGradient(0, 0, 0, 720);
        bgGradient.addColorStop(0, '#0f0f23');
        bgGradient.addColorStop(0.5, '#1a1a3e');
        bgGradient.addColorStop(1, '#0f0f23');
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, 1280, 720);

        // 장식용 별
        this.drawStars(ctx);

        // 크레딧 컨텐츠
        const startY = 720 - this.scrollOffset;
        let currentY = startY;

        // 타이틀
        renderer.drawText(
            `⚔️ ${GAME_INFO.TITLE}`,
            640,
            currentY,
            'bold 42px Arial',
            '#e94560',
            'center'
        );
        currentY += 80;

        // 메인 크레딧
        const credits = [
            { title: '🎮 Game Design & Development', content: 'Jinan Choi' },
            { title: '', content: '' },
            { title: '💻 Programming', content: 'TypeScript + HTML5 Canvas' },
            { title: '', content: '' },
            { title: '🎨 Graphics & UI', content: 'Custom Pixel Art Style' },
            { title: '', content: 'Liberated Pixel Cup (LPC) Assets' },
            { title: '', content: '' },
            { title: '🎵 Audio', content: 'Procedural Sound Effects' },
            { title: '', content: '' },
            { title: '📚 Story & Writing', content: 'Jinan Choi' },
            { title: '', content: '' },
            { title: '🛠️ Game Engine', content: 'Custom Canvas Engine' },
            { title: '', content: '' },
            { title: '🌟 Special Thanks', content: 'Open Source Community' },
            { title: '', content: 'Claude Code Assistant' },
            { title: '', content: 'All Playtesters' },
            { title: '', content: '' },
            { title: '', content: '' },
            { title: '🎉 Created with ❤️', content: 'by Jinan' },
            { title: '', content: '' },
            { title: '', content: '' },
            { title: '© 2025 All Rights Reserved', content: '' }
        ];

        credits.forEach((credit) => {
            if (credit.title) {
                renderer.drawText(
                    credit.title,
                    640,
                    currentY,
                    'bold 20px Arial',
                    '#FFD700',
                    'center'
                );
                currentY += 35;
            }

            if (credit.content) {
                renderer.drawText(
                    credit.content,
                    640,
                    currentY,
                    '18px Arial',
                    '#CCCCCC',
                    'center'
                );
                currentY += 30;
            } else {
                currentY += 20; // 빈 줄
            }
        });

        // 스크롤이 끝까지 가면 리셋
        if (currentY < -100) {
            this.reset();
        }

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
     * 배경 별 그리기
     */
    private drawStars(ctx: CanvasRenderingContext2D): void {
        const starCount = 80;

        for (let i = 0; i < starCount; i++) {
            const seed = i * 23456;
            const x = (seed * 9301 + 49297) % 1280;
            const y = (seed * 3571 + 29573) % 720;
            const size = ((seed * 7919) % 2) + 1;
            const twinkle = Math.sin(this.animationTime * 3 + i) * 0.5 + 0.5;

            ctx.fillStyle = `rgba(255, 255, 255, ${twinkle * 0.6})`;
            ctx.fillRect(x, y, size, size);
        }
    }
}
