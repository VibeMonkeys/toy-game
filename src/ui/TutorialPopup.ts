/**
 * 💡 튜토리얼 팝업
 *
 * 게임 시작 시 조작법을 단계별로 안내합니다.
 */

import { Renderer } from '../systems/Renderer';

export interface TutorialStep {
    title: string;
    message: string;
    icon?: string;
}

export class TutorialPopup {
    private isActive: boolean = false;
    private currentStepIndex: number = 0;
    private steps: TutorialStep[] = [];
    private animationTime: number = 0;

    /**
     * 튜토리얼 시작
     */
    start(): void {
        this.isActive = true;
        this.currentStepIndex = 0;
        this.animationTime = 0;

        // 튜토리얼 단계 정의
        this.steps = [
            {
                title: '환영합니다!',
                message: '최진안의 이세계 모험기에 오신 것을 환영합니다.\n이 던전을 탐험하고 강력한 적들을 물리치세요!',
                icon: '👋'
            },
            {
                title: '이동하기',
                message: '방향키 (↑↓←→) 또는 WASD 키로\n캐릭터를 움직일 수 있습니다.',
                icon: '🎮'
            },
            {
                title: '전투하기',
                message: 'Space 키로 적을 공격하세요.\n적에게 가까이 다가가서 공격해야 합니다.',
                icon: '⚔️'
            },
            {
                title: '상호작용',
                message: 'E 또는 Enter 키로 NPC와 대화하고\n아이템을 획득할 수 있습니다.',
                icon: '💬'
            },
            {
                title: '인벤토리 & 미니맵',
                message: 'I 키로 인벤토리를, M 키로 미니맵을\n열고 닫을 수 있습니다.',
                icon: '🎒'
            },
            {
                title: '준비 완료!',
                message: 'ESC 키로 언제든지 일시정지할 수 있습니다.\n이제 모험을 시작해볼까요?',
                icon: '🚀'
            }
        ];
    }

    /**
     * 다음 단계로
     */
    nextStep(): void {
        if (this.currentStepIndex < this.steps.length - 1) {
            this.currentStepIndex++;
            this.animationTime = 0;
        } else {
            this.end();
        }
    }

    /**
     * 이전 단계로
     */
    previousStep(): void {
        if (this.currentStepIndex > 0) {
            this.currentStepIndex--;
            this.animationTime = 0;
        }
    }

    /**
     * 튜토리얼 종료
     */
    end(): void {
        this.isActive = false;
        this.currentStepIndex = 0;
        this.steps = [];
    }

    /**
     * 튜토리얼 스킵
     */
    skip(): void {
        this.end();
    }

    /**
     * 업데이트
     */
    update(deltaTime: number): void {
        if (!this.isActive) return;
        this.animationTime += deltaTime;
    }

    /**
     * 렌더링
     */
    render(renderer: Renderer): void {
        if (!this.isActive || this.steps.length === 0) return;

        const ctx = renderer.getContext();
        const step = this.steps[this.currentStepIndex];

        // 배경 어둡게
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, 1280, 720);

        // 팝업 박스
        const boxWidth = 600;
        const boxHeight = 300;
        const boxX = (1280 - boxWidth) / 2;
        const boxY = (720 - boxHeight) / 2;

        // 그림자
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(boxX + 5, boxY + 5, boxWidth, boxHeight);

        // 박스 배경
        ctx.fillStyle = 'rgba(30, 30, 40, 0.98)';
        ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

        // 박스 테두리
        ctx.strokeStyle = '#e94560';
        ctx.lineWidth = 3;
        ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

        // 아이콘
        if (step.icon) {
            renderer.drawText(
                step.icon,
                boxX + boxWidth / 2,
                boxY + 60,
                '48px Arial',
                '#FFD700',
                'center'
            );
        }

        // 타이틀
        renderer.drawText(
            step.title,
            boxX + boxWidth / 2,
            boxY + 120,
            'bold 24px Arial',
            '#FFD700',
            'center'
        );

        // 메시지 (여러 줄 지원)
        const lines = step.message.split('\n');
        lines.forEach((line, index) => {
            renderer.drawText(
                line,
                boxX + boxWidth / 2,
                boxY + 160 + index * 25,
                '16px Arial',
                '#CCCCCC',
                'center'
            );
        });

        // 진행 상황 표시
        const progressY = boxY + boxHeight - 60;
        renderer.drawText(
            `${this.currentStepIndex + 1} / ${this.steps.length}`,
            boxX + boxWidth / 2,
            progressY,
            '14px Arial',
            '#888888',
            'center'
        );

        // 조작 힌트
        const pulse = Math.sin(this.animationTime * 3) * 0.3 + 0.7;
        const hintY = boxY + boxHeight - 30;

        if (this.currentStepIndex > 0) {
            renderer.drawText(
                '← 이전',
                boxX + 80,
                hintY,
                '14px Arial',
                `rgba(255, 215, 0, ${pulse})`,
                'center'
            );
        }

        if (this.currentStepIndex < this.steps.length - 1) {
            renderer.drawText(
                '다음 →  또는  Space',
                boxX + boxWidth - 120,
                hintY,
                '14px Arial',
                `rgba(255, 215, 0, ${pulse})`,
                'center'
            );
        } else {
            renderer.drawText(
                'Enter 또는 Space 시작!',
                boxX + boxWidth - 120,
                hintY,
                'bold 14px Arial',
                `rgba(255, 215, 0, ${pulse})`,
                'center'
            );
        }

        // 스킵 힌트
        renderer.drawText(
            'ESC 스킵',
            boxX + boxWidth / 2,
            boxY + boxHeight + 30,
            '12px Arial',
            '#666666',
            'center'
        );
    }

    /**
     * 활성 상태 확인
     */
    isOpen(): boolean {
        return this.isActive;
    }

    /**
     * 현재 단계 가져오기
     */
    getCurrentStep(): number {
        return this.currentStepIndex;
    }

    /**
     * 총 단계 수
     */
    getTotalSteps(): number {
        return this.steps.length;
    }
}
