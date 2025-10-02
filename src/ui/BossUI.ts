/**
 * 👑 보스 UI
 *
 * 보스 전투 시 특수 UI 표시
 * - 보스 체력바 (화면 상단)
 * - 페이즈 표시
 * - 패턴 경고 (Telegraph)
 */

import { Renderer } from '../systems/Renderer';
import { Boss } from '../entities/Boss';
import { SCREEN } from '../utils/Constants';

export class BossUI {
    private boss: Boss | null = null;
    private isActive: boolean = false;

    // UI 설정
    private readonly healthBarWidth: number = 800;
    private readonly healthBarHeight: number = 30;
    private readonly healthBarX: number = (SCREEN.WIDTH - 800) / 2;
    private readonly healthBarY: number = 50;

    // 애니메이션
    private damageFlashTime: number = 0;
    private phaseChangeTime: number = 0;

    constructor() {}

    /**
     * 보스 설정
     */
    setBoss(boss: Boss | null): void {
        this.boss = boss;
        this.isActive = boss !== null;

        if (boss) {
            console.log(`👑 보스 UI 활성화: ${boss.getBossData().name}`);
        }
    }

    /**
     * 보스 활성 상태 확인
     */
    isBossActive(): boolean {
        return this.isActive && this.boss !== null && this.boss.getHealth() > 0;
    }

    /**
     * 데미지 플래시 효과
     */
    triggerDamageFlash(): void {
        this.damageFlashTime = Date.now();
    }

    /**
     * 페이즈 변경 효과
     */
    triggerPhaseChange(): void {
        this.phaseChangeTime = Date.now();
    }

    /**
     * 렌더링
     */
    render(renderer: Renderer): void {
        if (!this.isBossActive() || !this.boss) return;

        const bossData = this.boss.getBossData();

        // 보스 체력바
        this.renderHealthBar(renderer);

        // 보스 이름 & 페이즈
        this.renderBossInfo(renderer);

        // 페이즈 전환 효과
        if (Date.now() - this.phaseChangeTime < 2000) {
            this.renderPhaseTransition(renderer);
        }

        // 패턴 경고 (현재 패턴이 있으면)
        const currentPattern = this.boss.getCurrentPattern();
        if (currentPattern) {
            this.renderPatternWarning(renderer, currentPattern.name);
        }
    }

    /**
     * 보스 체력바
     */
    private renderHealthBar(renderer: Renderer): void {
        if (!this.boss) return;

        const ctx = renderer.getContext();
        const bossData = this.boss.getBossData();
        const currentHealth = this.boss.getHealth();
        const maxHealth = this.boss.getMaxHealth();
        const healthPercent = currentHealth / maxHealth;

        // 배경 (어두운 테두리)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(
            this.healthBarX - 5,
            this.healthBarY - 5,
            this.healthBarWidth + 10,
            this.healthBarHeight + 10
        );

        // 체력바 배경
        ctx.fillStyle = '#2a2a2a';
        ctx.fillRect(
            this.healthBarX,
            this.healthBarY,
            this.healthBarWidth,
            this.healthBarHeight
        );

        // 체력바 (페이즈별 색상 변화)
        const phase = this.boss.getCurrentPhase();
        let healthColor = '#00FF00'; // 기본: 초록색

        if (phase === 2) {
            healthColor = '#FFD700'; // Phase 2: 황금색
        } else if (phase === 3) {
            healthColor = '#FF4500'; // Phase 3: 빨간색
        } else if (healthPercent < 0.3) {
            healthColor = '#FF0000'; // 체력 30% 미만: 빨간색
        } else if (healthPercent < 0.6) {
            healthColor = '#FFA500'; // 체력 60% 미만: 주황색
        }

        // 데미지 플래시 효과
        const flashElapsed = Date.now() - this.damageFlashTime;
        if (flashElapsed < 200) {
            const flashAlpha = 1 - (flashElapsed / 200);
            ctx.fillStyle = `rgba(255, 255, 255, ${flashAlpha * 0.5})`;
            ctx.fillRect(
                this.healthBarX,
                this.healthBarY,
                this.healthBarWidth * healthPercent,
                this.healthBarHeight
            );
        }

        // 실제 체력바
        ctx.fillStyle = healthColor;
        ctx.fillRect(
            this.healthBarX,
            this.healthBarY,
            this.healthBarWidth * healthPercent,
            this.healthBarHeight
        );

        // 테두리
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        ctx.strokeRect(
            this.healthBarX,
            this.healthBarY,
            this.healthBarWidth,
            this.healthBarHeight
        );

        // 체력 텍스트
        renderer.drawText(
            `${currentHealth} / ${maxHealth}`,
            this.healthBarX + this.healthBarWidth / 2,
            this.healthBarY + this.healthBarHeight / 2 + 5,
            'bold 14px Arial',
            '#FFFFFF',
            'center'
        );

        // 페이즈 구분선 (2페이즈 이상인 경우)
        if (bossData.totalPhases > 1) {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 2;

            for (let i = 1; i < bossData.totalPhases; i++) {
                const phaseThreshold = (bossData.totalPhases - i) / bossData.totalPhases;
                const lineX = this.healthBarX + this.healthBarWidth * phaseThreshold;

                ctx.beginPath();
                ctx.moveTo(lineX, this.healthBarY);
                ctx.lineTo(lineX, this.healthBarY + this.healthBarHeight);
                ctx.stroke();
            }
        }
    }

    /**
     * 보스 이름 & 페이즈 정보
     */
    private renderBossInfo(renderer: Renderer): void {
        if (!this.boss) return;

        const ctx = renderer.getContext();
        const bossData = this.boss.getBossData();
        const phase = this.boss.getCurrentPhase();

        // 보스 이름
        renderer.drawText(
            `👑 ${bossData.name}`,
            SCREEN.CENTER_X,
            this.healthBarY - 20,
            'bold 24px Arial',
            '#FFD700',
            'center'
        );

        // 페이즈 표시
        if (bossData.totalPhases > 1) {
            let phaseText = `Phase ${phase}/${bossData.totalPhases}`;
            let phaseColor = '#FFFFFF';

            if (phase === 2) phaseColor = '#FFD700';
            if (phase === 3) phaseColor = '#FF4500';

            renderer.drawText(
                phaseText,
                SCREEN.CENTER_X,
                this.healthBarY + this.healthBarHeight + 25,
                'bold 16px Arial',
                phaseColor,
                'center'
            );
        }
    }

    /**
     * 페이즈 전환 효과
     */
    private renderPhaseTransition(renderer: Renderer): void {
        if (!this.boss) return;

        const ctx = renderer.getContext();
        const elapsed = Date.now() - this.phaseChangeTime;
        const duration = 2000;
        const progress = elapsed / duration;

        if (progress >= 1) return;

        // 화면 깜빡임 효과
        const alpha = Math.sin(elapsed * 0.01) * 0.3;
        ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;
        ctx.fillRect(0, 0, SCREEN.WIDTH, SCREEN.HEIGHT);

        // 페이즈 전환 텍스트
        const phase = this.boss.getCurrentPhase();
        const textAlpha = progress < 0.5 ? progress * 2 : (1 - progress) * 2;

        ctx.save();
        ctx.globalAlpha = textAlpha;

        renderer.drawText(
            `⚡ PHASE ${phase} ⚡`,
            SCREEN.CENTER_X,
            SCREEN.CENTER_Y - 50,
            'bold 48px Arial',
            '#FFD700',
            'center'
        );

        // 페이즈 설명 (있으면)
        const bossData = this.boss.getBossData();
        const phaseData = bossData.phases[phase - 1];

        if (phaseData?.phaseTransition?.message) {
            renderer.drawText(
                phaseData.phaseTransition.message,
                SCREEN.CENTER_X,
                SCREEN.CENTER_Y + 20,
                'bold 20px Arial',
                '#FFFFFF',
                'center'
            );
        }

        ctx.restore();
    }

    /**
     * 패턴 경고
     */
    private renderPatternWarning(renderer: Renderer, patternName: string): void {
        const ctx = renderer.getContext();

        // 경고 배경
        const warningY = SCREEN.HEIGHT - 150;
        ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
        ctx.fillRect(0, warningY, SCREEN.WIDTH, 50);

        // 경고 텍스트
        renderer.drawText(
            `⚠️ ${patternName}`,
            SCREEN.CENTER_X,
            warningY + 30,
            'bold 20px Arial',
            '#FF4500',
            'center'
        );

        // 깜빡임 효과
        const pulse = Math.sin(Date.now() * 0.01) * 0.5 + 0.5;
        ctx.save();
        ctx.globalAlpha = pulse;

        renderer.drawText(
            '회피 준비!',
            SCREEN.CENTER_X,
            warningY + 55,
            'bold 14px Arial',
            '#FFFF00',
            'center'
        );

        ctx.restore();
    }

    /**
     * 디버그 정보 (개발용)
     */
    renderDebugInfo(renderer: Renderer): void {
        if (!this.boss) return;

        const bossData = this.boss.getBossData();
        const pattern = this.boss.getCurrentPattern();

        let y = SCREEN.HEIGHT - 100;

        renderer.drawText(
            `[DEBUG] Boss: ${bossData.name}`,
            10,
            y,
            '12px monospace',
            '#00FF00'
        );

        y += 15;
        renderer.drawText(
            `Phase: ${this.boss.getCurrentPhase()}/${bossData.totalPhases}`,
            10,
            y,
            '12px monospace',
            '#00FF00'
        );

        y += 15;
        renderer.drawText(
            `HP: ${this.boss.getHealth()}/${this.boss.getMaxHealth()} (${Math.floor((this.boss.getHealth() / this.boss.getMaxHealth()) * 100)}%)`,
            10,
            y,
            '12px monospace',
            '#00FF00'
        );

        if (pattern) {
            y += 15;
            renderer.drawText(
                `Pattern: ${pattern.name} (${pattern.frequency})`,
                10,
                y,
                '12px monospace',
                '#FFFF00'
            );
        }
    }
}
