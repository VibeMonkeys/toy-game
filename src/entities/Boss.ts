/**
 * 👑 보스 엔티티
 *
 * 패턴 기반 보스 전투 시스템
 */

import { Enemy } from './Enemy';
import { Player } from './Player';
import { Renderer } from '../systems/Renderer';
import { ProjectileSystem } from '../systems/ProjectileSystem';
import { BuffSystem } from '../systems/BuffSystem';
import {
    Position,
    BossType,
    BossData,
    BossPhase,
    BossPattern,
    PatternSequence
} from '../types';

export class Boss extends Enemy {
    // 보스 고유 데이터
    private bossData: BossData;
    private currentPhase: number = 1;
    private currentPhaseData: BossPhase;

    // 패턴 실행
    private currentPattern: BossPattern | null = null;
    private currentSequenceIndex: number = 0;
    private sequenceStartTime: number = 0;
    private isExecutingPattern: boolean = false;

    // 페이즈 전환
    private isTransitioning: boolean = false;
    private transitionStartTime: number = 0;

    // 무적 상태
    private isInvulnerable: boolean = false;

    // 외부 시스템 참조
    private projectileSystem: ProjectileSystem | null = null;
    private buffSystem: BuffSystem | null = null;

    // 콜백
    private onPhaseChangeCallback: ((phase: number, bossX: number, bossY: number) => void) | null = null;

    constructor(x: number, y: number, bossData: BossData) {
        // Enemy 생성자 호출 (더미 타입으로, 보스는 isBoss=true로 구별됨)
        super(x, y, 'goblin', true); // 더미 EnemyType (보스는 bossData로 식별)

        this.bossData = bossData;

        // 보스 스탯 설정
        this.health = bossData.health;
        this.maxHealth = bossData.health;
        this.attack = bossData.attack;
        this.defense = bossData.defense;
        this.speed = bossData.speed;
        this.width = bossData.width;
        this.height = bossData.height;

        // 첫 페이즈 로드
        this.currentPhaseData = bossData.phases[0];

        console.log(`👑 보스 생성: ${bossData.name} (${bossData.totalPhases}페이즈)`);
    }

    /**
     * 보스 업데이트
     */
    update(deltaTime: number, player: Player): void {
        if (this.health <= 0) return;

        // 페이즈 전환 중
        if (this.isTransitioning) {
            this.updatePhaseTransition(deltaTime);
            return;
        }

        // 페이즈 체크
        this.checkPhaseTransition();

        // 패턴 실행
        if (this.isExecutingPattern && this.currentPattern) {
            this.executePattern(deltaTime, player);
        } else {
            // 다음 패턴 선택
            this.selectNextPattern(player);
        }
    }

    /**
     * 페이즈 전환 체크
     */
    private checkPhaseTransition(): void {
        const healthPercent = (this.health / this.maxHealth) * 100;

        for (let i = 0; i < this.bossData.phases.length; i++) {
            const phase = this.bossData.phases[i];

            // 현재 체력이 이 페이즈 범위 안에 있는지 확인
            if (healthPercent <= phase.healthRange[0] && healthPercent > phase.healthRange[1]) {
                if (this.currentPhase !== phase.phase) {
                    this.startPhaseTransition(phase);
                }
                break;
            }
        }
    }

    /**
     * 페이즈 전환 시작
     */
    private startPhaseTransition(newPhase: BossPhase): void {
        if (!newPhase.phaseTransition) {
            // 전환 연출 없으면 즉시 페이즈 변경
            this.currentPhase = newPhase.phase;
            this.currentPhaseData = newPhase;
            console.log(`👑 ${this.bossData.name} - Phase ${this.currentPhase}`);

            // 페이즈 변경 콜백 호출
            if (this.onPhaseChangeCallback) {
                this.onPhaseChangeCallback(this.currentPhase, this.x, this.y);
            }
            return;
        }

        this.isTransitioning = true;
        this.transitionStartTime = Date.now();
        this.isInvulnerable = newPhase.phaseTransition.invulnerable;

        console.log(`👑 페이즈 전환: Phase ${newPhase.phase}`);
        console.log(`📢 ${newPhase.phaseTransition.message}`);

        // 패턴 중단
        this.isExecutingPattern = false;
        this.currentPattern = null;

        // 전환 후 페이즈 데이터 저장
        this.currentPhaseData = newPhase;
        this.currentPhase = newPhase.phase;

        // 페이즈 변경 콜백 호출
        if (this.onPhaseChangeCallback) {
            this.onPhaseChangeCallback(this.currentPhase, this.x, this.y);
        }
    }

    /**
     * 페이즈 전환 업데이트
     */
    private updatePhaseTransition(deltaTime: number): void {
        if (!this.currentPhaseData.phaseTransition) return;

        const elapsed = Date.now() - this.transitionStartTime;

        if (elapsed >= this.currentPhaseData.phaseTransition.duration) {
            // 전환 완료
            this.isTransitioning = false;
            this.isInvulnerable = false;
            console.log(`✅ 페이즈 전환 완료 - Phase ${this.currentPhase}`);
        }
    }

    /**
     * 다음 패턴 선택
     */
    private selectNextPattern(player: Player): void {
        const now = Date.now();
        const availablePatterns: BossPattern[] = [];

        // 쿨다운 끝난 패턴만 선택
        for (const pattern of this.currentPhaseData.patterns) {
            const timeSinceLastUse = pattern.lastUsed ? now - pattern.lastUsed : Infinity;

            if (timeSinceLastUse >= pattern.cooldown) {
                availablePatterns.push(pattern);
            }
        }

        if (availablePatterns.length === 0) {
            // 사용 가능한 패턴 없으면 대기
            return;
        }

        // 우선순위: main > filler > special
        const mainPatterns = availablePatterns.filter(p => p.frequency === 'main');
        const fillerPatterns = availablePatterns.filter(p => p.frequency === 'filler');
        const specialPatterns = availablePatterns.filter(p => p.frequency === 'special');

        let selectedPattern: BossPattern | null = null;

        const rand = Math.random();
        if (rand < 0.6 && mainPatterns.length > 0) {
            // 60% 확률로 메인 패턴
            selectedPattern = mainPatterns[Math.floor(Math.random() * mainPatterns.length)];
        } else if (rand < 0.9 && fillerPatterns.length > 0) {
            // 30% 확률로 필러 패턴
            selectedPattern = fillerPatterns[Math.floor(Math.random() * fillerPatterns.length)];
        } else if (specialPatterns.length > 0) {
            // 10% 확률로 특수 패턴
            selectedPattern = specialPatterns[Math.floor(Math.random() * specialPatterns.length)];
        }

        if (selectedPattern) {
            this.startPattern(selectedPattern);
        }
    }

    /**
     * 패턴 시작
     */
    private startPattern(pattern: BossPattern): void {
        this.currentPattern = pattern;
        this.currentSequenceIndex = 0;
        this.sequenceStartTime = Date.now();
        this.isExecutingPattern = true;
        pattern.lastUsed = Date.now();

        console.log(`🎯 보스 패턴: ${pattern.name}`);
    }

    /**
     * 패턴 실행
     */
    private executePattern(deltaTime: number, player: Player): void {
        if (!this.currentPattern) return;

        const sequence = this.currentPattern.sequence[this.currentSequenceIndex];
        if (!sequence) {
            // 패턴 종료
            this.isExecutingPattern = false;
            this.currentPattern = null;
            return;
        }

        const elapsed = Date.now() - this.sequenceStartTime;

        // 시퀀스 지속시간 체크
        if (elapsed >= sequence.duration) {
            // 다음 시퀀스로
            this.currentSequenceIndex++;
            this.sequenceStartTime = Date.now();

            if (this.currentSequenceIndex >= this.currentPattern.sequence.length) {
                // 패턴 완전 종료
                this.isExecutingPattern = false;
                this.currentPattern = null;
            }
            return;
        }

        // 시퀀스 실행
        this.executeSequence(sequence, player, elapsed, deltaTime);
    }

    /**
     * 시퀀스 실행
     */
    private executeSequence(
        seq: PatternSequence,
        player: Player,
        elapsed: number,
        deltaTime: number
    ): void {
        // 무적 상태 설정
        if (seq.invulnerable !== undefined) {
            this.isInvulnerable = seq.invulnerable;
        }

        switch (seq.action) {
            case 'telegraph':
                // 예고 - 시각 효과만 (실제 공격 없음)
                break;

            case 'attack':
                // 공격 - 첫 프레임에만 실행
                if (elapsed < 50) {
                    this.performAttack(seq, player);
                }
                break;

            case 'move':
                // 이동
                this.performMove(seq, player, deltaTime);
                break;

            case 'projectile':
                // 투사체 발사 - 첫 프레임에만
                if (elapsed < 50) {
                    this.performProjectile(seq, player);
                }
                break;

            case 'summon':
                // 소환 - 첫 프레임에만
                if (elapsed < 50) {
                    this.performSummon(seq);
                }
                break;

            case 'buff':
                // 버프 - 첫 프레임에만
                if (elapsed < 50) {
                    this.performBuff(seq);
                }
                break;

            case 'aoe':
                // 광역 공격
                if (elapsed < 50) {
                    this.performAOE(seq, player);
                }
                break;

            case 'recovery':
                // 회복 단계 - 아무것도 안함 (취약 상태)
                break;
        }
    }

    /**
     * 공격 실행
     */
    private performAttack(seq: PatternSequence, player: Player): void {
        const distance = this.getDistanceToPlayer(player);

        if (distance <= (seq.range || this.attackRange)) {
            let damage = seq.damage || this.attack;

            // 페이즈 보정
            if (this.currentPhaseData.modifiers?.damage) {
                damage *= this.currentPhaseData.modifiers.damage;
            }

            player.takeDamage(Math.floor(damage));
            console.log(`💥 보스 공격! ${Math.floor(damage)} 데미지`);
        }
    }

    /**
     * 이동 실행
     */
    private performMove(seq: PatternSequence, player: Player, deltaTime: number): void {
        if (seq.targetPlayer) {
            // 플레이어 방향으로 이동
            const dx = player.x - this.x;
            const dy = player.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 0) {
                const speed = seq.speed || this.speed;
                this.x += (dx / distance) * speed * deltaTime;
                this.y += (dy / distance) * speed * deltaTime;
            }
        } else if (seq.distance && seq.speed) {
            // 현재 방향으로 일정 거리 이동
            // TODO: 방향 저장 필요
        }
    }

    /**
     * 투사체 발사
     */
    private performProjectile(seq: PatternSequence, player: Player): void {
        if (!this.projectileSystem) {
            console.warn('⚠️ ProjectileSystem이 연결되지 않음');
            return;
        }

        const count = seq.projectileCount || 1;
        const speed = seq.projectileSpeed || 200;
        const homing = seq.homing || false;

        console.log(`🔮 투사체 발사 (${count}개, 속도: ${speed})`);

        if (count === 1) {
            // 단일 투사체 - 플레이어 방향으로
            const dx = player.x - this.x;
            const dy = player.y - this.y;
            const angle = Math.atan2(dy, dx);

            this.projectileSystem.createProjectile(
                this.x,
                this.y,
                angle,
                speed,
                seq.damage || this.attack,
                'boss',
                {
                    radius: 12,
                    homing: homing,
                    target: homing ? { x: player.x, y: player.y } : undefined,
                    color: this.bossData.color
                }
            );
        } else if (count <= 5) {
            // 부채꼴 패턴
            const dx = player.x - this.x;
            const dy = player.y - this.y;
            const baseAngle = Math.atan2(dy, dx);
            const spreadAngle = Math.PI / 3; // 60도

            this.projectileSystem.createSpread(
                this.x,
                this.y,
                baseAngle,
                count,
                spreadAngle,
                speed,
                seq.damage || this.attack,
                'boss',
                {
                    radius: 10,
                    homing: homing,
                    target: homing ? { x: player.x, y: player.y } : undefined,
                    color: this.bossData.color
                }
            );
        } else {
            // 원형 패턴
            this.projectileSystem.createCircle(
                this.x,
                this.y,
                count,
                speed,
                seq.damage || this.attack,
                'boss',
                {
                    radius: 10,
                    color: this.bossData.color
                }
            );
        }
    }

    /**
     * 소환 실행
     */
    private performSummon(seq: PatternSequence): void {
        console.log(`👥 소환: ${seq.summonType} x${seq.summonCount || 1}`);
        // TODO: Game.ts에서 enemies 배열에 추가 필요
    }

    /**
     * 버프 실행
     */
    private performBuff(seq: PatternSequence): void {
        if (!this.buffSystem) {
            console.warn('⚠️ BuffSystem이 연결되지 않음');
            return;
        }

        const buffType = seq.buffType;
        const duration = seq.buffDuration || 5000;
        const value = seq.buffValue || 0.5; // 기본 50% 증가

        if (!buffType) {
            console.warn('⚠️ buffType이 정의되지 않음');
            return;
        }

        console.log(`✨ 보스 버프: ${buffType} (${duration}ms, 값: ${value})`);

        // 보스 자신에게 버프 적용
        this.buffSystem.applyBuff(
            `boss_${this.bossData.id}`,
            buffType,
            duration,
            value,
            {
                isMultiplier: true,
                stackable: true,
                maxStacks: 3
            }
        );
    }

    /**
     * 광역 공격
     */
    private performAOE(seq: PatternSequence, player: Player): void {
        const distance = this.getDistanceToPlayer(player);

        if (distance <= (seq.aoeRadius || 100)) {
            let damage = seq.damage || this.attack;

            if (this.currentPhaseData.modifiers?.damage) {
                damage *= this.currentPhaseData.modifiers.damage;
            }

            player.takeDamage(Math.floor(damage));
            console.log(`💥 광역 공격! ${Math.floor(damage)} 데미지`);
        }
    }

    /**
     * 데미지 받기 (오버라이드)
     */
    takeDamage(damage: number): void {
        if (this.isInvulnerable) {
            console.log(`🛡️ 무적 상태! 데미지 무효`);
            return;
        }

        super.takeDamage(damage);
    }

    /**
     * 보스 데이터 가져오기
     */
    getBossData(): BossData {
        return this.bossData;
    }

    /**
     * 현재 페이즈 가져오기
     */
    getCurrentPhase(): number {
        return this.currentPhase;
    }

    /**
     * 현재 패턴 가져오기
     */
    getCurrentPattern(): BossPattern | null {
        return this.currentPattern;
    }

    /**
     * ProjectileSystem 연결
     */
    setProjectileSystem(system: ProjectileSystem): void {
        this.projectileSystem = system;
    }

    /**
     * BuffSystem 연결
     */
    setBuffSystem(system: BuffSystem): void {
        this.buffSystem = system;
    }

    /**
     * 페이즈 변경 콜백 설정
     */
    setOnPhaseChange(callback: (phase: number, bossX: number, bossY: number) => void): void {
        this.onPhaseChangeCallback = callback;
    }

    /**
     * 보스 ID 가져오기 (BuffSystem용)
     */
    getBossId(): string {
        return `boss_${this.bossData.id}`;
    }

    /**
     * 렌더링 (오버라이드)
     */
    render(renderer: Renderer): void {
        this.renderAtPosition(renderer, this.x, this.y);
    }

    renderAtPosition(renderer: Renderer, x: number, y: number): void {
        const ctx = renderer.getContext();

        // 페이즈 전환 이펙트
        if (this.isTransitioning && this.currentPhaseData.phaseTransition) {
            const elapsed = Date.now() - this.transitionStartTime;
            const progress = elapsed / this.currentPhaseData.phaseTransition.duration;

            // 깜빡임 효과
            ctx.globalAlpha = Math.abs(Math.sin(elapsed * 0.01)) * 0.5 + 0.5;
        }

        // 무적 상태 이펙트
        if (this.isInvulnerable) {
            const pulse = Math.sin(Date.now() * 0.02) * 0.3 + 0.7;
            ctx.globalAlpha = pulse;
        }

        // Enemy 기본 렌더링 사용
        super.renderAtPosition(renderer, x, y);

        // 페이즈 표시
        ctx.globalAlpha = 1.0;
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
            `Phase ${this.currentPhase}/${this.bossData.totalPhases}`,
            x + this.width / 2,
            y - 30
        );
    }
}
