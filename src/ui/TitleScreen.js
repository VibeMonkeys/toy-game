export class TitleScreen {
    constructor(canvas, ctx, audioManager) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.audioManager = audioManager;

        this.menuIndex = 0;
        this.menuOptions = [];
        this.animationTime = 0;
        this.showGameInfo = false;
        this.showCredits = false;
        this.menuAreas = [];

        // 응답하라 1999 스타일 요소들
        this.titleText = '휴넷 26주년 기념 게임에 오신 것을 환영합니다';
        this.subtitleText = '휴넷 에듀테크 어드벤처 RPG v1.0';
        this.companyText = '(c)1999-2025 휴넷 코퍼레이션 - 인간 네트워크 (26주년)';

        this.showSecretMessage = false;
        this.specialMessage = null;

        // 로그라이크 게임 스타일 파티클
        this.particles = [];
        this.initializeParticles();
    }

    initializeParticles() {
        // 배경 파티클 효과 (로그라이크 게임 스타일)
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                color: Math.random() > 0.5 ? '#FFD700' : '#FFA500',
                alpha: Math.random() * 0.5 + 0.1
            });
        }
    }

    setMenuOptions(options) {
        this.menuOptions = options;
        this.menuIndex = Math.min(this.menuIndex, options.length - 1);
    }

    update() {
        this.animationTime += 0.02;

        // 파티클 업데이트
        this.particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            // 경계 체크
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.speedX *= -1;
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.speedY *= -1;
            }

            particle.alpha = Math.sin(this.animationTime * 2 + particle.x * 0.01) * 0.3 + 0.2;
        });
    }

    draw() {
        this.drawTitle();
        this.drawMenu();

        if (this.showGameInfo) {
            this.drawGameInfo();
        }

        if (this.showCredits) {
            this.drawCreditsScreen();
        }

        if (this.showSecretMessage) {
            this.drawSecretMessage();
        }

        if (this.specialMessage) {
            this.drawSpecialMessage();
        }
    }

    drawTitle() {
        this.drawClassicGameTitle();
    }

    drawClassicGameTitle() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        // 응답하라 1999 스타일 깊은 배경 그라데이션
        const bgGradient = this.ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(this.canvas.width, this.canvas.height));
        bgGradient.addColorStop(0, '#2c1810');
        bgGradient.addColorStop(0.4, '#1a0f0a');
        bgGradient.addColorStop(1, '#0a0504');
        this.ctx.fillStyle = bgGradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 90년대 스타일 패턴 배경
        this.drawRetroPattern();

        // 배경 파티클
        this.drawParticles();

        // 메인 로고 컨테이너 (로그라이크 게임 스타일)
        this.ctx.save();
        this.ctx.translate(centerX, 140);

        // 외곽 프레임 (픽셀 아트 스타일)
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(-180, -80, 360, 160);

        // 내부 프레임
        this.ctx.fillStyle = '#D2691E';
        this.ctx.fillRect(-170, -70, 340, 140);

        // 금속 테두리 효과
        this.ctx.strokeStyle = '#FFD700';
        this.ctx.lineWidth = 4;
        this.ctx.strokeRect(-175, -75, 350, 150);

        this.ctx.strokeStyle = '#FFA500';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(-172, -72, 344, 144);

        // 메인 타이틀 (굵은 픽셀 스타일)
        this.ctx.fillStyle = '#FFD700';
        this.ctx.strokeStyle = '#8B4513';
        this.ctx.lineWidth = 3;
        this.ctx.font = 'bold 48px "Courier New", monospace';
        this.ctx.textAlign = 'center';

        // 그림자 효과
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillText('HUNET 26TH', 2, -12);

        // 메인 텍스트
        this.ctx.fillStyle = '#FFD700';
        this.ctx.fillText('HUNET 26TH', 0, -15);

        // 서브타이틀
        this.ctx.fillStyle = '#FFA500';
        this.ctx.font = 'bold 24px "Courier New", monospace';
        this.ctx.fillText('ANNIVERSARY', 0, 20);

        // "TREASURE HUNT" 텍스트 (더 임팩트 있게)
        this.ctx.fillStyle = '#FF6347';
        this.ctx.strokeStyle = '#8B0000';
        this.ctx.lineWidth = 2;
        this.ctx.font = 'bold 28px "Courier New", monospace';
        this.ctx.strokeText('TREASURE HUNT', 0, 50);
        this.ctx.fillStyle = '#FFD700';
        this.ctx.fillText('TREASURE HUNT', 0, 50);

        this.ctx.restore();

        // 로그라이크 스타일 장식 요소들
        this.drawRoguelikeDecorations(centerX);

        // 1999년 감성 하단 정보
        this.drawVintageFooter(centerX);
    }

    drawRetroPattern() {
        // 90년대 패턴 배경
        this.ctx.fillStyle = 'rgba(139, 69, 19, 0.1)';
        for (let x = 0; x < this.canvas.width; x += 40) {
            for (let y = 0; y < this.canvas.height; y += 40) {
                if ((x + y) % 80 === 0) {
                    this.ctx.fillRect(x, y, 20, 20);
                }
            }
        }
    }

    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.alpha;
            this.ctx.fillStyle = particle.color;
            this.ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
            this.ctx.restore();
        });
    }

    drawRoguelikeDecorations(centerX) {
        // 양쪽 장식 기둥
        const decorY = 280;

        // 왼쪽 기둥
        this.drawPixelColumn(centerX - 250, decorY);
        // 오른쪽 기둥
        this.drawPixelColumn(centerX + 250, decorY);

        // 중앙 보석들 (로그라이크 아이템 스타일)
        for (let i = 0; i < 3; i++) {
            const x = centerX - 60 + (i * 60);
            const y = decorY + 20;
            this.drawPixelGem(x, y, ['#FF6B6B', '#4ECDC4', '#45B7D1'][i]);
        }
    }

    drawPixelColumn(x, y) {
        // 픽셀 아트 스타일 기둥
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(x - 15, y - 100, 30, 120);

        this.ctx.fillStyle = '#D2691E';
        this.ctx.fillRect(x - 12, y - 95, 24, 110);

        // 기둥 장식
        this.ctx.fillStyle = '#FFD700';
        for (let i = 0; i < 5; i++) {
            this.ctx.fillRect(x - 10, y - 80 + (i * 20), 20, 4);
        }
    }

    drawPixelGem(x, y, color) {
        // 로그라이크 스타일 보석
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x - 8, y - 8, 16, 16);

        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        this.ctx.fillRect(x - 6, y - 6, 4, 4);

        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x - 8, y - 8, 16, 16);
    }

    drawVintageFooter(centerX) {
        // 1999년 스타일 하단 정보
        const footerY = this.canvas.height - 120;

        // 배경 박스
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(centerX - 300, footerY - 20, 600, 80);

        this.ctx.strokeStyle = '#FFD700';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(centerX - 300, footerY - 20, 600, 80);

        // 회사 정보
        this.ctx.fillStyle = '#D2691E';
        this.ctx.font = 'bold 16px "Courier New", monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('H U M A N   N E T W O R K', centerX, footerY);

        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = '14px "Courier New", monospace';
        this.ctx.fillText('Since 1999 • 26주년 • Educational Technology Leader', centerX, footerY + 20);

        this.ctx.fillStyle = '#FFA500';
        this.ctx.font = '12px "Courier New", monospace';
        this.ctx.fillText('© 1999-2025 HUNET Corporation. All Rights Reserved. (26th Anniversary)', centerX, footerY + 40);
    }

    drawMenu() {
        this.menuAreas = [];
        const startY = 320;
        const spacing = 65;

        this.ctx.font = 'bold 16px "Courier New", monospace';
        this.ctx.textAlign = 'center';

        for (let i = 0; i < this.menuOptions.length; i++) {
            const y = startY + i * spacing;
            const isSelected = i === this.menuIndex;
            const buttonWidth = 280;
            const buttonHeight = 60;
            const buttonX = this.canvas.width / 2 - buttonWidth / 2;
            const buttonY = y - 25;

            // 로그라이크 스타일 버튼
            this.drawClassicButton(buttonX, buttonY, buttonWidth, buttonHeight, this.menuOptions[i], isSelected);

            // 마우스 클릭 영역 저장
            this.menuAreas.push({
                x: buttonX,
                y: buttonY,
                width: buttonWidth,
                height: buttonHeight,
                index: i
            });
        }

        // 조작 힌트 (픽셀 스타일)
        this.ctx.fillStyle = '#D2691E';
        this.ctx.font = '14px "Courier New", monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('↑↓ 선택 | ENTER 확인 | ESC 정보', this.canvas.width / 2, this.canvas.height - 40);
    }


    drawClassicButton(x, y, width, height, text, isSelected) {
        // 로그라이크 스타일 픽셀 버튼

        // 버튼 그림자
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(x + 4, y + 4, width, height);

        if (isSelected) {
            // 선택된 버튼 - 로그라이크 스타일 골드 버튼
            this.ctx.fillStyle = '#8B4513';
            this.ctx.fillRect(x, y, width, height);

            this.ctx.fillStyle = '#D2691E';
            this.ctx.fillRect(x + 2, y + 2, width - 4, height - 4);

            this.ctx.fillStyle = '#FFD700';
            this.ctx.fillRect(x + 4, y + 4, width - 8, height - 8);

            // 골드 테두리
            this.ctx.strokeStyle = '#FFA500';
            this.ctx.lineWidth = 3;
            this.ctx.strokeRect(x, y, width, height);

        } else {
            // 일반 버튼 - 로그라이크 스타일 스톤 버튼
            this.ctx.fillStyle = '#2F2F2F';
            this.ctx.fillRect(x, y, width, height);

            this.ctx.fillStyle = '#4A4A4A';
            this.ctx.fillRect(x + 2, y + 2, width - 4, height - 4);

            this.ctx.fillStyle = '#696969';
            this.ctx.fillRect(x + 4, y + 4, width - 8, height - 8);

            // 스톤 테두리
            this.ctx.strokeStyle = '#808080';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(x, y, width, height);
        }

        // 픽셀 스타일 하이라이트
        this.ctx.fillStyle = isSelected ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.2)';
        this.ctx.fillRect(x + 6, y + 6, width - 12, 4);
        this.ctx.fillRect(x + 6, y + 6, 4, height - 12);

        // 버튼 텍스트 (픽셀 폰트 스타일)
        this.ctx.font = isSelected ? 'bold 18px "Courier New", monospace' : 'bold 16px "Courier New", monospace';
        this.ctx.textAlign = 'center';

        // 텍스트 그림자
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillText(text, x + width/2 + 1, y + height/2 + 7);

        // 메인 텍스트
        this.ctx.fillStyle = isSelected ? '#000080' : '#FFD700';
        this.ctx.fillText(text, x + width/2, y + height/2 + 6);

        // 선택된 버튼에 로그라이크 스타일 인디케이터
        if (isSelected) {
            // 왼쪽 다이아몬드
            this.drawPixelDiamond(x - 20, y + height/2, '#FFD700');
            // 오른쪽 다이아몬드
            this.drawPixelDiamond(x + width + 10, y + height/2, '#FFD700');
        }
    }

    drawPixelDiamond(x, y, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x - 1, y - 4, 3, 1);
        this.ctx.fillRect(x - 2, y - 3, 5, 1);
        this.ctx.fillRect(x - 3, y - 2, 7, 1);
        this.ctx.fillRect(x - 4, y - 1, 9, 3);
        this.ctx.fillRect(x - 3, y + 2, 7, 1);
        this.ctx.fillRect(x - 2, y + 3, 5, 1);
        this.ctx.fillRect(x - 1, y + 4, 3, 1);
    }

    drawGameInfo() {
        // 어두운 배경
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 로그라이크 스타일 정보 박스
        const boxWidth = 700;
        const boxHeight = 500;
        const boxX = (this.canvas.width - boxWidth) / 2;
        const boxY = (this.canvas.height - boxHeight) / 2;

        // 골드 테두리
        this.ctx.strokeStyle = '#FFD700';
        this.ctx.lineWidth = 4;
        this.ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

        // 내부 테두리
        this.ctx.strokeStyle = '#D2691E';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(boxX + 4, boxY + 4, boxWidth - 8, boxHeight - 8);

        // 어두운 배경
        this.ctx.fillStyle = '#1a0f0a';
        this.ctx.fillRect(boxX + 6, boxY + 6, boxWidth - 12, boxHeight - 12);

        // 제목
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = 'bold 24px "Courier New", monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('=== GAME INFO ===', this.canvas.width / 2, boxY + 40);

        // 정보 텍스트 (로그라이크 스타일)
        this.ctx.font = '16px "Courier New", monospace';
        this.ctx.textAlign = 'left';
        this.ctx.fillStyle = '#D2691E';

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
                this.ctx.fillStyle = '#FFD700';
            } else if (line.startsWith('  [')) {
                this.ctx.fillStyle = '#FFA500';
            } else if (line.startsWith('  •')) {
                this.ctx.fillStyle = '#FF6347';
            } else {
                this.ctx.fillStyle = '#D2691E';
            }
            this.ctx.fillText(line, boxX + 30, textY);
            textY += 20;
        }

        // 닫기 안내
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = 'bold 16px "Courier New", monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('[ESC] 돌아가기', this.canvas.width / 2, boxY + boxHeight - 30);
    }

    drawCreditsScreen() {
        // 반투명 배경
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 정보 박스
        const boxWidth = Math.min(600, this.canvas.width - 80);
        const boxHeight = 400;
        const boxX = (this.canvas.width - boxWidth) / 2;
        const boxY = (this.canvas.height - boxHeight) / 2;

        // 박스 배경
        this.ctx.fillStyle = 'rgba(50, 30, 20, 0.95)';
        this.ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

        // 박스 테두리
        this.ctx.strokeStyle = '#FFD700';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

        // 제목
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = 'bold 24px "Courier New", monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('=== 크레딧 ===', this.canvas.width / 2, boxY + 50);

        // 크레딧 정보
        this.ctx.font = '18px "Courier New", monospace';
        this.ctx.textAlign = 'left';
        this.ctx.fillStyle = '#D2691E';

        const creditText = [
            '',
            '> 개발자의 한마디',
            '  "휴넷 26주년을 기념하여 제작된 이 게임이',
            '   여러분께 즐거움을 드리길 바랍니다."',
            '',
            '> 개발팀',
            '  개발자: 최진안, 김경훈(기획)',
            '  기획자: 인경실 직원 일동',
            '',
            '> 특별 감사',
            '  • 26년간 휴넷과 함께해 주신 모든 임직원분들',
            '  • 게임 개발에 아이디어를 제공해 주신 분들',
            '  • 베타 테스트에 참여해 주신 모든 분들'
        ];

        let textY = boxY + 90;
        for (let line of creditText) {
            if (line.startsWith('>')) {
                this.ctx.fillStyle = '#FFD700';
                this.ctx.font = 'bold 18px "Courier New", monospace';
            } else if (line.startsWith('  •')) {
                this.ctx.fillStyle = '#FFA500';
                this.ctx.font = '16px "Courier New", monospace';
            } else if (line.startsWith('  ')) {
                this.ctx.fillStyle = '#FF6347';
                this.ctx.font = '16px "Courier New", monospace';
            } else {
                this.ctx.fillStyle = '#D2691E';
                this.ctx.font = '16px "Courier New", monospace';
            }
            this.ctx.fillText(line, boxX + 30, textY);
            textY += 18;
        }

        // 닫기 안내
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = 'bold 16px "Courier New", monospace';
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

        if (this.showCredits) {
            if (event.key === 'Escape') {
                this.showCredits = false;
                this.audioManager?.playMenuSelect();
            }
            return;
        }

        switch (event.key) {
            case 'ArrowUp':
                this.menuIndex = (this.menuIndex - 1 + this.menuOptions.length) % this.menuOptions.length;
                this.audioManager?.playRetroUISound();
                break;
            case 'ArrowDown':
                this.menuIndex = (this.menuIndex + 1) % this.menuOptions.length;
                this.audioManager?.playRetroUISound();
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
                    this.audioManager?.playRetroUISound();
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

        if (this.showCredits) {
            this.showCredits = false;
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
        this.audioManager?.playRetroUISound();

        if (selectedOption === '게임 정보') {
            this.showGameInfo = true;
            return null;
        }

        if (selectedOption === '크레딧') {
            this.showCredits = true;
            return null;
        }

        return selectedOption;
    }

    drawSecretMessage() {
        // 반투명 배경
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 비밀 메시지
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = 'bold 32px "Courier New", monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('🔍 숨겨진 기능을 발견했습니다! 🔍', this.canvas.width / 2, this.canvas.height / 2 - 50);

        this.ctx.fillStyle = '#FFA500';
        this.ctx.font = '20px "Courier New", monospace';
        this.ctx.fillText('게임 중에 H키를 눌러 더 많은 비밀을 찾아보세요!', this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.fillText('D키로 디버그 모드도 활성화할 수 있어요!', this.canvas.width / 2, this.canvas.height / 2 + 30);
        this.ctx.fillText('↑↑↓↓←→←→BA 를 입력해보세요...', this.canvas.width / 2, this.canvas.height / 2 + 60);
    }

    drawSpecialMessage() {
        // 로그라이크 스타일 특별 메시지 배경
        const time = Date.now() * 0.005;
        this.ctx.fillStyle = 'rgba(139, 69, 19, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 특별 메시지
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = 'bold 24px "Courier New", monospace';
        this.ctx.textAlign = 'center';
        this.ctx.strokeStyle = '#8B4513';
        this.ctx.lineWidth = 2;
        this.ctx.strokeText(this.specialMessage, this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.fillText(this.specialMessage, this.canvas.width / 2, this.canvas.height / 2);

        // 반짝이는 다이아몬드 효과
        for (let i = 0; i < 12; i++) {
            const x = this.canvas.width / 2 + Math.cos(time + i) * (100 + i * 15);
            const y = this.canvas.height / 2 + Math.sin(time + i * 1.3) * (50 + i * 8);
            const alpha = Math.sin(time * 3 + i) * 0.5 + 0.5;

            this.ctx.save();
            this.ctx.globalAlpha = alpha;
            this.drawPixelDiamond(x, y, '#FFD700');
            this.ctx.restore();
        }
    }
}