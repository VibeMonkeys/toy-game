export class TitleScreen {
    constructor(canvas, ctx, audioManager) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.audioManager = audioManager;

        this.menuIndex = 0;
        this.menuOptions = [];
        this.animationTime = 0;
        this.showGameInfo = false;
        this.menuAreas = [];

        // 로그라이크 스타일 요소들
        this.titleText = '휴넷 에듀테크 어드벤처';
        this.subtitleText = '26주년 창립기념 엘리베이터 RPG';
        this.typewriterIndex = 0;
        this.typewriterSpeed = 3;
        this.typewriterComplete = false;

        this.backgroundMatrix = [];
        this.scanlines = [];
        this.glitchEffect = 0;
        this.logoGlow = 0;
        this.particleTrails = [];

        this.showSecretMessage = false;
        this.specialMessage = null;

        this.createMatrix();
        this.initializeScanlines();
        this.createParticleTrails();
    }

    setMenuOptions(options) {
        this.menuOptions = options;
        this.menuIndex = Math.min(this.menuIndex, options.length - 1);
    }

    update() {
        // 애니메이션 업데이트는 draw 메서드에서 처리됨
    }

    createMatrix() {
        // 매트릭스 스타일 배경 문자들
        const chars = '01HUNET에듀테크';
        for (let i = 0; i < 30; i++) {
            this.backgroundMatrix.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                char: chars[Math.floor(Math.random() * chars.length)],
                speed: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.3 + 0.1,
                size: Math.random() * 12 + 8
            });
        }
    }

    initializeScanlines() {
        // 레트로 CRT 스캔라인 효과
        for (let i = 0; i < this.canvas.height; i += 4) {
            this.scanlines.push({
                y: i,
                opacity: Math.random() * 0.1 + 0.05
            });
        }
    }

    createParticleTrails() {
        // 네온 파티클 트레일
        for (let i = 0; i < 15; i++) {
            this.particleTrails.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                trail: [],
                color: `hsl(${Math.random() * 360}, 70%, 50%)`,
                maxTrailLength: 20
            });
        }
    }

    draw() {
        // 로그라이크 스타일 배경
        this.drawBackground();
        this.updateAnimations();
        this.drawMatrixEffect();
        this.drawParticleTrails();
        this.drawScanlines();
        this.drawTitle();
        this.drawLogo();
        this.drawMenu();
        this.drawGlitchEffect();

        if (this.showGameInfo) {
            this.drawGameInfo();
        }

        // 비밀 메시지들
        if (this.showSecretMessage) {
            this.drawSecretMessage();
        }

        if (this.specialMessage) {
            this.drawSpecialMessage();
        }
    }

    updateAnimations() {
        this.animationTime += 0.03;
        this.logoGlow += 0.05;
        this.glitchEffect = Math.random() * 0.1;

        // 타이핑 애니메이션
        if (!this.typewriterComplete) {
            this.typewriterIndex += this.typewriterSpeed;
            if (this.typewriterIndex >= this.titleText.length + this.subtitleText.length) {
                this.typewriterComplete = true;
            }
        }

        // 매트릭스 문자 업데이트
        this.backgroundMatrix.forEach(char => {
            char.y += char.speed;
            if (char.y > this.canvas.height + 50) {
                char.y = -50;
                char.x = Math.random() * this.canvas.width;
            }
            char.opacity = Math.sin(this.animationTime + char.x * 0.01) * 0.2 + 0.1;
        });

        // 파티클 트레일 업데이트
        this.particleTrails.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            // 트레일 추가
            particle.trail.push({ x: particle.x, y: particle.y });
            if (particle.trail.length > particle.maxTrailLength) {
                particle.trail.shift();
            }

            // 경계 체크
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.vx *= -1;
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.vy *= -1;
            }
        });
    }

    drawBackground() {
        // 어두운 그라디언트 배경 (로그라이크 스타일)
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#0a0a0a');
        gradient.addColorStop(0.3, '#1a1a2e');
        gradient.addColorStop(0.7, '#16213e');
        gradient.addColorStop(1, '#0f0f23');

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawMatrixEffect() {
        // 매트릭스 스타일 배경 문자들
        this.ctx.font = '12px monospace';
        this.backgroundMatrix.forEach(char => {
            this.ctx.fillStyle = `rgba(0, 255, 100, ${char.opacity})`;
            this.ctx.fillText(char.char, char.x, char.y);

            // 가끔 밝게 깜빡이는 효과
            if (Math.random() < 0.01) {
                this.ctx.fillStyle = `rgba(0, 255, 100, 0.8)`;
                this.ctx.fillText(char.char, char.x, char.y);
            }
        });
    }

    drawParticleTrails() {
        // 네온 파티클 트레일
        this.particleTrails.forEach(particle => {
            if (particle.trail.length > 1) {
                this.ctx.strokeStyle = particle.color;
                this.ctx.lineWidth = 2;
                this.ctx.lineCap = 'round';

                for (let i = 1; i < particle.trail.length; i++) {
                    const alpha = i / particle.trail.length;
                    this.ctx.globalAlpha = alpha * 0.3;

                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.trail[i-1].x, particle.trail[i-1].y);
                    this.ctx.lineTo(particle.trail[i].x, particle.trail[i].y);
                    this.ctx.stroke();
                }

                this.ctx.globalAlpha = 1;
            }
        });
    }

    drawScanlines() {
        // CRT 스캔라인 효과
        this.scanlines.forEach(line => {
            this.ctx.fillStyle = `rgba(0, 255, 100, ${line.opacity})`;
            this.ctx.fillRect(0, line.y, this.canvas.width, 1);
        });
    }

    drawTitle() {
        // 타이핑 애니메이션으로 제목 표시
        const titleY = 200;
        const subtitleY = 250;

        // 메인 타이틀
        this.ctx.font = 'bold 48px monospace';
        this.ctx.textAlign = 'center';

        const displayTitle = this.titleText.substring(0, Math.floor(this.typewriterIndex));

        // 네온 글로우 효과
        this.ctx.shadowColor = '#00ffff';
        this.ctx.shadowBlur = 20;
        this.ctx.fillStyle = '#00ffff';
        this.ctx.fillText(displayTitle, this.canvas.width / 2, titleY);

        // 메인 텍스트
        this.ctx.shadowBlur = 0;
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillText(displayTitle, this.canvas.width / 2, titleY);

        // 커서 효과
        if (!this.typewriterComplete && Math.sin(this.animationTime * 8) > 0) {
            this.ctx.fillStyle = '#00ffff';
            const cursorX = this.canvas.width / 2 + this.ctx.measureText(displayTitle).width / 2;
            this.ctx.fillText('_', cursorX, titleY);
        }

        // 부제목 (타이틀 완성 후)
        if (this.typewriterIndex > this.titleText.length) {
            this.ctx.font = 'bold 24px monospace';
            const subtitleProgress = Math.max(0, this.typewriterIndex - this.titleText.length);
            const displaySubtitle = this.subtitleText.substring(0, Math.floor(subtitleProgress));

            this.ctx.shadowColor = '#ff6600';
            this.ctx.shadowBlur = 10;
            this.ctx.fillStyle = '#ff6600';
            this.ctx.fillText(displaySubtitle, this.canvas.width / 2, subtitleY);

            this.ctx.shadowBlur = 0;
            this.ctx.fillStyle = '#ffccaa';
            this.ctx.fillText(displaySubtitle, this.canvas.width / 2, subtitleY);
        }
    }

    drawLogo() {
        const logoX = this.canvas.width / 2;
        const logoY = 120;

        // 육각형 로고 베이스 (테크 느낌)
        const hexSize = 60 + Math.sin(this.logoGlow) * 5;

        this.ctx.save();
        this.ctx.translate(logoX, logoY);

        // 육각형 그리기
        this.ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            const x = Math.cos(angle) * hexSize;
            const y = Math.sin(angle) * hexSize;
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        this.ctx.closePath();

        // 네온 글로우 효과
        this.ctx.shadowColor = '#00ffff';
        this.ctx.shadowBlur = 20;
        this.ctx.strokeStyle = '#00ffff';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();

        // 내부 육각형
        this.ctx.shadowBlur = 10;
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();

        // HUNET 텍스트
        this.ctx.shadowBlur = 0;
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 20px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('HUNET', 0, -5);

        // 26 텍스트
        this.ctx.fillStyle = '#ff6600';
        this.ctx.font = 'bold 16px monospace';
        this.ctx.fillText('26TH', 0, 15);

        this.ctx.restore();
    }


    drawStar(x, y, outerRadius, innerRadius, points) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(-Math.PI / 2);

        this.ctx.beginPath();
        for (let i = 0; i < points * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (i * Math.PI) / points;
            const px = radius * Math.cos(angle);
            const py = radius * Math.sin(angle);

            if (i === 0) {
                this.ctx.moveTo(px, py);
            } else {
                this.ctx.lineTo(px, py);
            }
        }
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();
    }

    drawMenu() {
        // 타이핑 완료 후에만 메뉴 표시
        if (!this.typewriterComplete) return;

        this.menuAreas = [];
        const startY = 400;
        const spacing = 50;

        this.ctx.font = 'bold 20px monospace';
        this.ctx.textAlign = 'center';

        for (let i = 0; i < this.menuOptions.length; i++) {
            const y = startY + i * spacing;
            const isSelected = i === this.menuIndex;

            // 선택된 메뉴 하이라이트 박스
            if (isSelected) {
                // 네온 박스
                this.ctx.strokeStyle = '#00ffff';
                this.ctx.lineWidth = 2;
                this.ctx.shadowColor = '#00ffff';
                this.ctx.shadowBlur = 10;
                this.ctx.strokeRect(this.canvas.width / 2 - 180, y - 20, 360, 35);

                // 배경
                this.ctx.fillStyle = 'rgba(0, 255, 255, 0.1)';
                this.ctx.fillRect(this.canvas.width / 2 - 180, y - 20, 360, 35);

                // 선택 화살표
                this.ctx.shadowBlur = 0;
                this.ctx.fillStyle = '#00ffff';
                this.ctx.font = 'bold 20px monospace';
                this.ctx.fillText('►', this.canvas.width / 2 - 220, y + 5);

                // 메뉴 텍스트 (선택됨)
                this.ctx.shadowColor = '#00ffff';
                this.ctx.shadowBlur = 5;
                this.ctx.fillStyle = '#ffffff';
            } else {
                // 일반 메뉴 텍스트
                this.ctx.shadowBlur = 0;
                this.ctx.fillStyle = '#aaaaaa';
            }

            this.ctx.fillText(this.menuOptions[i], this.canvas.width / 2, y + 5);

            // 마우스 클릭 영역 저장
            this.menuAreas.push({
                x: this.canvas.width / 2 - 180,
                y: y - 20,
                width: 360,
                height: 35,
                index: i
            });
        }

        // 조작 힌트
        this.ctx.shadowBlur = 0;
        this.ctx.fillStyle = 'rgba(0, 255, 100, 0.8)';
        this.ctx.font = '14px monospace';
        this.ctx.fillText('[↑↓] 선택  [ENTER] 확인  [ESC] 정보', this.canvas.width / 2, this.canvas.height - 30);
    }

    drawGlitchEffect() {
        // 가끔 글리치 효과
        if (Math.random() < 0.02) {
            const glitchHeight = 20;
            const glitchY = Math.random() * this.canvas.height;

            this.ctx.fillStyle = `rgba(255, 0, 0, ${this.glitchEffect})`;
            this.ctx.fillRect(0, glitchY, this.canvas.width, glitchHeight);

            this.ctx.fillStyle = `rgba(0, 255, 0, ${this.glitchEffect * 0.5})`;
            this.ctx.fillRect(0, glitchY + 2, this.canvas.width, glitchHeight);
        }
    }

    drawGameInfo() {
        // 어두운 배경
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 터미널 스타일 정보 박스
        const boxWidth = 700;
        const boxHeight = 500;
        const boxX = (this.canvas.width - boxWidth) / 2;
        const boxY = (this.canvas.height - boxHeight) / 2;

        // 네온 테두리
        this.ctx.strokeStyle = '#00ffff';
        this.ctx.lineWidth = 3;
        this.ctx.shadowColor = '#00ffff';
        this.ctx.shadowBlur = 10;
        this.ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

        // 어두운 배경
        this.ctx.shadowBlur = 0;
        this.ctx.fillStyle = '#000020';
        this.ctx.fillRect(boxX + 3, boxY + 3, boxWidth - 6, boxHeight - 6);

        // 제목
        this.ctx.fillStyle = '#00ffff';
        this.ctx.font = 'bold 24px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('=== GAME INFO ===', this.canvas.width / 2, boxY + 40);

        // 정보 텍스트 (터미널 스타일)
        this.ctx.font = '16px monospace';
        this.ctx.textAlign = 'left';
        this.ctx.fillStyle = '#00ff00';

        const infoText = [
            '> 휴넷 26주년 기념 에듀테크 어드벤처 RPG',
            '',
            '> 컨트롤:',
            '  [↑↓←→] 캐릭터 이동',
            '  [SPACE]  NPC 대화 / 아이템 수집 / 상호작용',
            '  [S]      게임 저장',
            '  [I]      인벤토리 토글',
            '  [Q]      퀘스트 UI 토글',
            '  [M]      미니맵 토글',
            '  [ESC]    일시정지 메뉴',
            '',
            '> 미션 목표:',
            '  • 엘리베이터로 각 층을 탐험하세요',
            '  • 동료들과 대화하고 업무를 도와주세요',
            '  • 숨겨진 아이템과 문서를 수집하세요',
            '  • CEO님과의 최종 미팅을 완료하세요',
            '',
            '> 히든 기능:',
            '  • H키: 숨겨진 메시지',
            '  • D키: 디버그 모드',
            '  • 코나미 코드: ↑↑↓↓←→←→BA'
        ];

        let textY = boxY + 80;
        for (let line of infoText) {
            if (line.startsWith('>')) {
                this.ctx.fillStyle = '#ffff00';
            } else if (line.startsWith('  [')) {
                this.ctx.fillStyle = '#00ffff';
            } else if (line.startsWith('  •')) {
                this.ctx.fillStyle = '#ff6600';
            } else {
                this.ctx.fillStyle = '#00ff00';
            }
            this.ctx.fillText(line, boxX + 30, textY);
            textY += 20;
        }

        // 닫기 안내
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 16px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('[ESC] 돌아가기', this.canvas.width / 2, boxY + boxHeight - 30);
    }

    handleKeyDown(event) {
        if (this.showGameInfo) {
            if (event.key === 'Escape') {
                this.showGameInfo = false;
                this.audioManager?.playMenuSelect();
            }
            return;
        }

        switch (event.key) {
            case 'ArrowUp':
                this.menuIndex = (this.menuIndex - 1 + this.menuOptions.length) % this.menuOptions.length;
                this.audioManager?.playUIHover();
                break;
            case 'ArrowDown':
                this.menuIndex = (this.menuIndex + 1) % this.menuOptions.length;
                this.audioManager?.playUIHover();
                break;
            case 'Enter':
                return this.selectCurrentOption();
        }
        return null;
    }

    handleMouseMove(event) {
        if (this.showGameInfo) return;

        const rect = this.canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        for (let i = 0; i < this.menuAreas.length; i++) {
            const area = this.menuAreas[i];
            if (mouseX >= area.x && mouseX <= area.x + area.width &&
                mouseY >= area.y && mouseY <= area.y + area.height) {
                if (this.menuIndex !== i) {
                    this.menuIndex = i;
                    this.audioManager?.playMenuMove();
                }
                break;
            }
        }
    }

    handleMouseClick(event) {
        if (this.showGameInfo) {
            this.showGameInfo = false;
            this.audioManager?.playMenuSelect();
            return null;
        }

        const rect = this.canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        for (let area of this.menuAreas) {
            if (mouseX >= area.x && mouseX <= area.x + area.width &&
                mouseY >= area.y && mouseY <= area.y + area.height) {
                this.menuIndex = area.index;
                return this.selectCurrentOption();
            }
        }
        return null;
    }

    selectCurrentOption() {
        const selectedOption = this.menuOptions[this.menuIndex];
        this.audioManager?.playUIClick();

        if (selectedOption === '게임 정보') {
            this.showGameInfo = true;
            return null;
        }

        return selectedOption;
    }

    update() {
        // 애니메이션 업데이트만 수행
        this.animationTime += 0.05;
    }

    drawSecretMessage() {
        // 반투명 배경
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 비밀 메시지
        this.ctx.fillStyle = '#ffff00';
        this.ctx.font = 'bold 32px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('🔍 숨겨진 기능을 발견했습니다! 🔍', this.canvas.width / 2, this.canvas.height / 2 - 50);

        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '20px Arial';
        this.ctx.fillText('게임 중에 H키를 눌러 더 많은 비밀을 찾아보세요!', this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.fillText('D키로 디버그 모드도 활성화할 수 있어요!', this.canvas.width / 2, this.canvas.height / 2 + 30);
        this.ctx.fillText('↑↑↓↓←→←→BA 를 입력해보세요...', this.canvas.width / 2, this.canvas.height / 2 + 60);
    }

    drawSpecialMessage() {
        // 무지개 배경 효과
        const time = Date.now() * 0.005;
        const gradient = this.ctx.createRadialGradient(
            this.canvas.width / 2, this.canvas.height / 2, 0,
            this.canvas.width / 2, this.canvas.height / 2, 400
        );

        for (let i = 0; i < 7; i++) {
            const hue = (time * 50 + i * 51.43) % 360;
            const alpha = 0.1 + Math.sin(time + i) * 0.05;
            gradient.addColorStop(i / 6, `hsla(${hue}, 70%, 50%, ${alpha})`);
        }

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 특별 메시지
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 2;
        this.ctx.strokeText(this.specialMessage, this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.fillText(this.specialMessage, this.canvas.width / 2, this.canvas.height / 2);

        // 반짝이는 별 효과
        for (let i = 0; i < 20; i++) {
            const x = this.canvas.width / 2 + Math.cos(time + i) * (100 + i * 20);
            const y = this.canvas.height / 2 + Math.sin(time + i * 1.3) * (50 + i * 10);
            const alpha = Math.sin(time * 3 + i) * 0.5 + 0.5;

            this.ctx.fillStyle = `rgba(255, 255, 0, ${alpha})`;
            this.drawStar(x, y, 3, 1, 5);
        }
    }
};