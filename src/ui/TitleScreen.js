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

        this.backgroundGradient = null;
        this.particles = [];
        this.titlePulse = 0;
        this.logoAnimation = 0;
        this.showSecretMessage = false;
        this.specialMessage = null;

        this.createBackground();
        this.initializeParticles();
    }

    setMenuOptions(options) {
        this.menuOptions = options;
        this.menuIndex = Math.min(this.menuIndex, options.length - 1);
    }

    update() {
        // 애니메이션 업데이트는 draw 메서드에서 처리됨
    }

    createBackground() {
        this.backgroundGradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        this.backgroundGradient.addColorStop(0, '#0f1b2e');
        this.backgroundGradient.addColorStop(0.3, '#1a2f5e');
        this.backgroundGradient.addColorStop(0.7, '#264183');
        this.backgroundGradient.addColorStop(1, '#1e3a8a');
    }

    initializeParticles() {
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.2,
                twinkle: Math.random() * Math.PI * 2
            });
        }
    }

    draw() {
        // 배경 그라디언트
        this.ctx.fillStyle = this.backgroundGradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.updateAnimations();
        this.drawParticles();
        this.drawTitleDecorations();
        this.drawTitleMenu();

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
        this.animationTime += 0.02;
        this.titlePulse += 0.03;
        this.logoAnimation += 0.01;

        // 파티클 업데이트
        this.particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            particle.twinkle += 0.05;

            // 경계에서 튕기기
            if (particle.x <= 0 || particle.x >= this.canvas.width) {
                particle.speedX *= -1;
            }
            if (particle.y <= 0 || particle.y >= this.canvas.height) {
                particle.speedY *= -1;
            }
        });
    }

    drawParticles() {
        this.particles.forEach(particle => {
            const twinkleOpacity = particle.opacity * (Math.sin(particle.twinkle) * 0.5 + 0.5);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${twinkleOpacity})`;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();

            // 가끔 반짝이는 효과
            if (Math.random() < 0.001) {
                this.ctx.fillStyle = `rgba(255, 215, 0, ${twinkleOpacity * 0.8})`;
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
                this.ctx.fill();
            }
        });
    }

    drawTitleDecorations() {
        // 애니메이션된 로고 영역
        this.drawAnimatedLogo();

        // 메인 제목 (맥동 효과)
        const titlePulseScale = 1 + Math.sin(this.titlePulse) * 0.05;
        const titleY = 180;

        this.ctx.save();
        this.ctx.translate(this.canvas.width / 2, titleY);
        this.ctx.scale(titlePulseScale, titlePulseScale);

        // 제목 그림자
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.font = 'bold 54px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('휴넷 26주년', 3, 3);

        // 제목 그라디언트
        const titleGradient = this.ctx.createLinearGradient(0, -30, 0, 30);
        titleGradient.addColorStop(0, '#ffd700');
        titleGradient.addColorStop(0.5, '#ffed4a');
        titleGradient.addColorStop(1, '#f39c12');

        this.ctx.fillStyle = titleGradient;
        this.ctx.fillText('휴넷 26주년', 0, 0);

        // 제목 테두리
        this.ctx.strokeStyle = '#b8860b';
        this.ctx.lineWidth = 2;
        this.ctx.strokeText('휴넷 26주년', 0, 0);

        this.ctx.restore();

        // 부제목
        const subtitleY = 240;
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        this.ctx.font = 'bold 28px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.lineWidth = 2;
        this.ctx.strokeText('창립 기념 보물찾기', this.canvas.width / 2, subtitleY);
        this.ctx.fillText('창립 기념 보물찾기', this.canvas.width / 2, subtitleY);

        // 장식적 요소들
        this.drawDecorations();
    }

    drawAnimatedLogo() {
        const logoX = this.canvas.width / 2;
        const logoY = 80;
        const logoSize = 80 + Math.sin(this.logoAnimation * 2) * 10;

        // 로고 배경 원
        this.ctx.fillStyle = 'rgba(255, 215, 0, 0.2)';
        this.ctx.beginPath();
        this.ctx.arc(logoX, logoY, logoSize / 2, 0, Math.PI * 2);
        this.ctx.fill();

        // 로고 테두리
        this.ctx.strokeStyle = '#ffd700';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.arc(logoX, logoY, logoSize / 2, 0, Math.PI * 2);
        this.ctx.stroke();

        // HUNET 텍스트
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('HUNET', logoX, logoY + 8);
    }

    drawDecorations() {
        // 반짝이는 별들
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2 + this.animationTime;
            const x = this.canvas.width / 2 + Math.cos(angle) * 320;
            const y = 200 + Math.sin(angle) * 60;
            const alpha = (Math.sin(this.animationTime * 3 + i) + 1) / 2;

            this.ctx.fillStyle = `rgba(255, 215, 0, ${alpha * 0.8})`;
            this.drawStar(x, y, 4, 2, 5);
        }

        // 하단 장식 라인
        const gradient = this.ctx.createLinearGradient(0, 280, this.canvas.width, 280);
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(0.2, 'rgba(255, 215, 0, 0.5)');
        gradient.addColorStop(0.5, 'rgba(255, 215, 0, 0.8)');
        gradient.addColorStop(0.8, 'rgba(255, 215, 0, 0.5)');
        gradient.addColorStop(1, 'transparent');

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 275, this.canvas.width, 4);
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

    drawTitleMenu() {
        this.menuAreas = [];
        const startY = 350;
        const spacing = 60;

        this.ctx.font = '24px Arial';
        this.ctx.textAlign = 'center';

        for (let i = 0; i < this.menuOptions.length; i++) {
            const y = startY + i * spacing;
            const isSelected = i === this.menuIndex;

            // 선택된 메뉴 하이라이트
            if (isSelected) {
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
                this.ctx.fillRect(this.canvas.width / 2 - 150, y - 25, 300, 40);

                this.ctx.fillStyle = '#ffff00';
                this.ctx.strokeStyle = '#000000';
                this.ctx.lineWidth = 2;
            } else {
                this.ctx.fillStyle = '#ffffff';
                this.ctx.strokeStyle = '#000000';
                this.ctx.lineWidth = 1;
            }

            this.ctx.strokeText(this.menuOptions[i], this.canvas.width / 2, y);
            this.ctx.fillText(this.menuOptions[i], this.canvas.width / 2, y);

            // 마우스 클릭 영역 저장
            this.menuAreas.push({
                x: this.canvas.width / 2 - 150,
                y: y - 25,
                width: 300,
                height: 40,
                index: i
            });
        }

        // 조작 힌트
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        this.ctx.font = '16px Arial';
        this.ctx.fillText('↑↓ 키로 선택, Enter로 확인', this.canvas.width / 2, this.canvas.height - 50);
    }

    drawGameInfo() {
        // 반투명 배경
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 정보 박스
        const boxWidth = 600;
        const boxHeight = 400;
        const boxX = (this.canvas.width - boxWidth) / 2;
        const boxY = (this.canvas.height - boxHeight) / 2;

        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

        // 게임 정보 텍스트
        this.ctx.fillStyle = '#000000';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('게임 정보', this.canvas.width / 2, boxY + 50);

        this.ctx.font = '18px Arial';
        this.ctx.textAlign = 'left';
        const infoText = [
            '휴넷 26주년을 기념하는 보물찾기 게임입니다.',
            '',
            '조작법:',
            '• 방향키: 캐릭터 이동',
            '• 스페이스바: NPC와 대화/아이템 수집',
            '• S키: 게임 저장',
            '',
            '목표:',
            '• 김대리 → 박과장 → 이부장 → CEO 순서로 찾아가세요',
            '• 각 NPC로부터 단서를 얻고 보물을 찾으세요',
            '• 모든 아이템을 수집하면 게임 완료!'
        ];

        let textY = boxY + 100;
        for (let line of infoText) {
            this.ctx.fillText(line, boxX + 30, textY);
            textY += 25;
        }

        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('ESC 키를 눌러 돌아가기', this.canvas.width / 2, boxY + boxHeight - 30);
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