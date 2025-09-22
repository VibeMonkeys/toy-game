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

        // 1999년 레트로 스타일 요소들 (응답하라 1999 감성)
        this.titleText = '휴넷 26주년 기념 게임에 오신 것을 환영합니다';
        this.subtitleText = '휴넷 에듀테크 어드벤처 RPG v1.0';
        this.companyText = '(c)1999 휴넷 코퍼레이션 - 인간 네트워크';
        this.typewriterIndex = 0;
        this.typewriterSpeed = 3;
        this.typewriterComplete = false;

        // 90년대 컴퓨터 효과들
        this.crtScanlines = [];
        this.pixelNoise = [];
        this.windowsElements = [];
        this.bootSequence = [];
        this.logoGlow = 0;
        this.backgroundMatrix = [];
        this.particleTrails = [];
        this.scanlines = [];
        this.glitchEffect = 0;
        this.retroColors = {
            amber: '#FFB000',
            green: '#00FF41',
            blue: '#0080FF',
            white: '#F0F0F0',
            darkBlue: '#000080',
            lightGray: '#C0C0C0',
            darkGray: '#808080'
        };

        this.initializeRetroEffects();

        this.showSecretMessage = false;
        this.specialMessage = null;

        this.initializeCRTEffects();
        this.createWindowsElements();
        this.initializeBootSequence();
    }

    setMenuOptions(options) {
        this.menuOptions = options;
        this.menuIndex = Math.min(this.menuIndex, options.length - 1);
    }

    update() {
        // 애니메이션 업데이트는 draw 메서드에서 처리됨
    }

    initializeCRTEffects() {
        // CRT 모니터 스캔라인
        for (let i = 0; i < this.canvas.height; i += 3) {
            this.crtScanlines.push({
                y: i,
                opacity: Math.random() * 0.15 + 0.05,
                flicker: Math.random() * 0.1
            });
        }

        // CRT 픽셀 노이즈
        for (let i = 0; i < 200; i++) {
            this.pixelNoise.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                brightness: Math.random(),
                flickerSpeed: Math.random() * 0.1 + 0.05
            });
        }
    }

    initializeRetroEffects() {
        // 매트릭스 스타일 배경 문자들 초기화
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?~`';
        for (let i = 0; i < 100; i++) {
            this.backgroundMatrix.push({
                char: chars[Math.floor(Math.random() * chars.length)],
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                speed: Math.random() * 2 + 1,
                opacity: Math.random() * 0.3 + 0.1
            });
        }

        // 네온 파티클 트레일 초기화
        const colors = ['#ff0040', '#00ffff', '#ffff00', '#ff8000', '#8000ff'];
        for (let i = 0; i < 15; i++) {
            this.particleTrails.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                trail: [],
                maxTrailLength: 10
            });
        }

        // 스캔라인 초기화
        for (let i = 0; i < this.canvas.height; i += 4) {
            this.scanlines.push({
                y: i,
                opacity: Math.random() * 0.1 + 0.02
            });
        }
    }

    createWindowsElements() {
        // Windows 98 스타일 UI 요소들
        this.windowsElements = {
            startButton: {
                x: 5, y: this.canvas.height - 35,
                width: 80, height: 30,
                text: '시작',
                pressed: false
            },
            taskbar: {
                x: 0, y: this.canvas.height - 40,
                width: this.canvas.width, height: 40
            },
            windows: [],
            clock: {
                x: this.canvas.width - 100, y: this.canvas.height - 25,
                time: '23:59'
            }
        };
    }

    initializeBootSequence() {
        // 90년대 부팅 시퀀스 메시지
        this.bootSequence = [
            'HUNET CORP. BIOS v2.04.08',
            'System initialized successfully',
            'Loading Windows 98...',
            'Starting HUNET Adventure Game',
            'Press any key to continue...'
        ];
        this.currentBootMessage = 0;
        this.bootMessageTimer = 0;
    }

    draw() {
        // 1999년 클래식 게임 스타일
        this.updateAnimations();
        this.drawTitle();
        this.drawMenu();

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
        // Windows 98 데스크톱 스타일 배경
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        gradient.addColorStop(0, '#008080');
        gradient.addColorStop(0.5, '#008B8B');
        gradient.addColorStop(1, '#006666');

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Windows 98 태스크바
        this.drawTaskbar();
    }

    drawTaskbar() {
        const taskbar = this.windowsElements.taskbar;

        // 태스크바 배경
        this.ctx.fillStyle = '#C0C0C0';
        this.ctx.fillRect(taskbar.x, taskbar.y, taskbar.width, taskbar.height);

        // 태스크바 테두리 (3D 효과)
        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(taskbar.x, taskbar.y + taskbar.height);
        this.ctx.lineTo(taskbar.x, taskbar.y);
        this.ctx.lineTo(taskbar.x + taskbar.width, taskbar.y);
        this.ctx.stroke();

        this.ctx.strokeStyle = '#808080';
        this.ctx.beginPath();
        this.ctx.moveTo(taskbar.x + taskbar.width, taskbar.y);
        this.ctx.lineTo(taskbar.x + taskbar.width, taskbar.y + taskbar.height);
        this.ctx.lineTo(taskbar.x, taskbar.y + taskbar.height);
        this.ctx.stroke();

        // 시작 버튼
        this.drawWindows98Button(
            this.windowsElements.startButton.x,
            this.windowsElements.startButton.y,
            this.windowsElements.startButton.width,
            this.windowsElements.startButton.height,
            this.windowsElements.startButton.text,
            this.windowsElements.startButton.pressed
        );

        // 시계
        this.ctx.fillStyle = '#000000';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(this.windowsElements.clock.time, this.windowsElements.clock.x, this.windowsElements.clock.y);
    }

    drawWindows98Button(x, y, width, height, text, pressed = false) {
        // 버튼 배경
        this.ctx.fillStyle = '#C0C0C0';
        this.ctx.fillRect(x, y, width, height);

        // 3D 버튼 테두리
        if (pressed) {
            // 눌린 상태
            this.ctx.strokeStyle = '#808080';
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(x, y + height);
            this.ctx.lineTo(x, y);
            this.ctx.lineTo(x + width, y);
            this.ctx.stroke();

            this.ctx.strokeStyle = '#FFFFFF';
            this.ctx.beginPath();
            this.ctx.moveTo(x + width, y);
            this.ctx.lineTo(x + width, y + height);
            this.ctx.lineTo(x, y + height);
            this.ctx.stroke();
        } else {
            // 일반 상태
            this.ctx.strokeStyle = '#FFFFFF';
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(x, y + height);
            this.ctx.lineTo(x, y);
            this.ctx.lineTo(x + width, y);
            this.ctx.stroke();

            this.ctx.strokeStyle = '#808080';
            this.ctx.beginPath();
            this.ctx.moveTo(x + width, y);
            this.ctx.lineTo(x + width, y + height);
            this.ctx.lineTo(x, y + height);
            this.ctx.stroke();
        }

        // 버튼 텍스트
        this.ctx.fillStyle = '#000000';
        this.ctx.font = 'bold 12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(text, x + width/2, y + height/2 + 4);
    }

    drawCRTEffects() {
        // CRT 모니터 스캔라인 효과
        this.crtScanlines.forEach(line => {
            const opacity = line.opacity + Math.sin(this.animationTime * 2 + line.y * 0.01) * line.flicker;
            this.ctx.fillStyle = `rgba(0, 255, 0, ${Math.max(0, opacity)})`;
            this.ctx.fillRect(0, line.y, this.canvas.width, 1);
        });

        // CRT 픽셀 노이즈
        this.pixelNoise.forEach(pixel => {
            const brightness = pixel.brightness + Math.sin(this.animationTime * 10 + pixel.x * 0.01) * pixel.flickerSpeed;
            this.ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, Math.min(1, brightness * 0.1))})`;
            this.ctx.fillRect(pixel.x, pixel.y, 1, 1);
        });

        // 약간의 색수차 효과
        if (Math.random() < 0.005) {
            this.ctx.fillStyle = 'rgba(255, 0, 0, 0.02)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    drawWindowsDecorations() {
        // Windows 98 스타일 장식 요소들

        // 가끔 "윈도우" 팝업 효과
        if (Math.random() < 0.001) {
            this.drawFakeWindow();
        }

        // 마우스 커서 (화살표)
        const cursorX = this.canvas.width * 0.7;
        const cursorY = this.canvas.height * 0.3;

        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 1;

        this.ctx.beginPath();
        this.ctx.moveTo(cursorX, cursorY);
        this.ctx.lineTo(cursorX + 10, cursorY + 8);
        this.ctx.lineTo(cursorX + 6, cursorY + 12);
        this.ctx.lineTo(cursorX + 8, cursorY + 16);
        this.ctx.lineTo(cursorX + 4, cursorY + 18);
        this.ctx.lineTo(cursorX + 2, cursorY + 14);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
    }

    drawFakeWindow() {
        const windowX = Math.random() * (this.canvas.width - 300);
        const windowY = Math.random() * (this.canvas.height - 200);
        const windowWidth = 250;
        const windowHeight = 150;

        // 윈도우 배경
        this.ctx.fillStyle = '#C0C0C0';
        this.ctx.fillRect(windowX, windowY, windowWidth, windowHeight);

        // 윈도우 테두리
        this.ctx.strokeStyle = '#808080';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(windowX, windowY, windowWidth, windowHeight);

        // 타이틀 바
        this.ctx.fillStyle = '#000080';
        this.ctx.fillRect(windowX, windowY, windowWidth, 20);

        // 타이틀 텍스트
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('HUNET Game Loader', windowX + 5, windowY + 14);

        // 닫기 버튼
        this.ctx.fillStyle = '#C0C0C0';
        this.ctx.fillRect(windowX + windowWidth - 18, windowY + 2, 16, 16);
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(windowX + windowWidth - 18, windowY + 2, 16, 16);
        this.ctx.fillStyle = '#000000';
        this.ctx.font = 'bold 12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('×', windowX + windowWidth - 10, windowY + 14);
    }


    drawTitle() {
        // 1999년 클래식 게임 스타일 타이틀
        this.drawClassicGameTitle();
    }

    drawDOSWelcomeBox() {
        // DOS 스타일 환영 상자
        const boxWidth = 600;
        const boxHeight = 200;
        const boxX = (this.canvas.width - boxWidth) / 2;
        const boxY = 50;

        // DOS 스타일 이중 테두리 박스
        this.ctx.strokeStyle = '#FFFF00';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

        this.ctx.strokeStyle = '#00FF00';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(boxX + 4, boxY + 4, boxWidth - 8, boxHeight - 8);

        // 1990년대 컴퓨터 시작 메시지
        this.ctx.fillStyle = '#00FFFF';
        this.ctx.font = '12px "굴림", "Gulim", monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('■□■□■□■□■□■□■□■□■□■□■□■□■□■□■□■□■', this.canvas.width / 2, boxY + 25);

        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '11px "굴림", "Gulim", monospace';
        this.ctx.fillText('HUNET CORP. COMPUTER SYSTEM v2.04', this.canvas.width / 2, boxY + 50);
        this.ctx.fillText('SYSTEM INITIALIZED SUCCESSFULLY', this.canvas.width / 2, boxY + 65);
        this.ctx.fillText('26TH ANNIVERSARY EDITION LOADED', this.canvas.width / 2, boxY + 80);
        this.ctx.fillText('LOADING GAME ENVIRONMENT...', this.canvas.width / 2, boxY + 95);

        this.ctx.fillStyle = '#00FFFF';
        this.ctx.fillText('■□■□■□■□■□■□■□■□■□■□■□■□■□■□■□■□■', this.canvas.width / 2, boxY + 185);
    }

    draw1990sDecorations() {
        // 1990년대 ASCII 아트 스타일 장식
        this.ctx.fillStyle = '#808080';
        this.ctx.font = '10px monospace';
        this.ctx.textAlign = 'left';

        // 좌측 장식
        const leftDecor = [
            '┌─────────┐',
            '│ HUNET   │',
            '│ 1999.03 │',
            '│ 26th    │',
            '└─────────┘'
        ];

        for (let i = 0; i < leftDecor.length; i++) {
            this.ctx.fillText(leftDecor[i], 50, 300 + i * 15);
        }

        // 우측 장식
        this.ctx.textAlign = 'right';
        const rightDecor = [
            '┌─────────┐',
            '│ WELCOME │',
            '│ TO GAME │',
            '│ WORLD   │',
            '└─────────┘'
        ];

        for (let i = 0; i < rightDecor.length; i++) {
            this.ctx.fillText(rightDecor[i], this.canvas.width - 50, 300 + i * 15);
        }
    }

    drawLogo() {
        const logoX = this.canvas.width / 2;
        const logoY = 80;

        this.ctx.save();
        this.ctx.translate(logoX, logoY);

        // Windows 98 스타일 로고 (사각형 아이콘)
        const iconSize = 64;

        // 아이콘 배경 (3D 효과)
        this.ctx.fillStyle = '#C0C0C0';
        this.ctx.fillRect(-iconSize/2, -iconSize/2, iconSize, iconSize);

        // 3D 테두리
        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(-iconSize/2, iconSize/2);
        this.ctx.lineTo(-iconSize/2, -iconSize/2);
        this.ctx.lineTo(iconSize/2, -iconSize/2);
        this.ctx.stroke();

        this.ctx.strokeStyle = '#808080';
        this.ctx.beginPath();
        this.ctx.moveTo(iconSize/2, -iconSize/2);
        this.ctx.lineTo(iconSize/2, iconSize/2);
        this.ctx.lineTo(-iconSize/2, iconSize/2);
        this.ctx.stroke();

        // HUNET 로고 내부
        this.ctx.fillStyle = '#000080';
        this.ctx.font = 'bold 14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('HUNET', 0, -8);

        // 26주년 텍스트
        this.ctx.fillStyle = '#FF0000';
        this.ctx.font = 'bold 12px Arial';
        this.ctx.fillText('26TH', 0, 8);

        // 아이콘 하이라이트
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.fillRect(-iconSize/2 + 4, -iconSize/2 + 4, iconSize/3, iconSize/3);

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
        this.menuAreas = [];
        const startY = 340;
        const spacing = 50;

        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'center';

        for (let i = 0; i < this.menuOptions.length; i++) {
            const y = startY + i * spacing;
            const isSelected = i === this.menuIndex;
            const buttonWidth = 200;
            const buttonHeight = 40;
            const buttonX = this.canvas.width / 2 - buttonWidth / 2;
            const buttonY = y - 20;

            // 1999년 클래식 게임 스타일 버튼
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

        // 조작 힌트 (Windows 98 스타일)
        this.ctx.fillStyle = '#000000';
        this.ctx.font = '12px Arial';
        this.ctx.fillText('↑↓ 선택 | ENTER 확인 | ESC 정보', this.canvas.width / 2, this.canvas.height - 60);

        // 1999년 저작권 메시지
        this.ctx.fillStyle = '#666666';
        this.ctx.font = '10px Arial';
        this.ctx.fillText('© 1999 HUNET Corporation. All rights reserved.', this.canvas.width / 2, this.canvas.height - 80);
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

    drawClassicGameTitle() {
        // 1999년 클래식 게임 스타일 - 깔끔하고 심플한 디자인
        const centerX = this.canvas.width / 2;

        // 배경 그라데이션 (90년대 게임 특유의 부드러운 배경)
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(0.5, '#16213e');
        gradient.addColorStop(1, '#0f0f23');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height - 40); // 태스크바 제외

        // 메인 게임 로고
        this.ctx.save();
        this.ctx.translate(centerX, 120);

        // 로고 배경 원
        this.ctx.fillStyle = '#ffd700';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 60, 0, Math.PI * 2);
        this.ctx.fill();

        // 로고 테두리
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();

        // HUNET 텍스트
        this.ctx.fillStyle = '#000080';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('HUNET', 0, -5);

        // 26주년 텍스트
        this.ctx.fillStyle = '#ff4500';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.fillText('26TH', 0, 15);

        this.ctx.restore();

        // 게임 제목 (간단하고 임팩트 있게)
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 36px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.strokeStyle = '#000080';
        this.ctx.lineWidth = 2;
        this.ctx.strokeText('ANNIVERSARY', centerX, 220);
        this.ctx.fillText('ANNIVERSARY', centerX, 220);

        this.ctx.font = 'bold 24px Arial';
        this.ctx.fillStyle = '#ffd700';
        this.ctx.strokeStyle = '#000080';
        this.ctx.lineWidth = 1;
        this.ctx.strokeText('TREASURE HUNT', centerX, 250);
        this.ctx.fillText('TREASURE HUNT', centerX, 250);

        // 심플한 장식 라인
        this.ctx.strokeStyle = '#ffd700';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(centerX - 150, 270);
        this.ctx.lineTo(centerX + 150, 270);
        this.ctx.stroke();

        // 작은 별 장식
        for (let i = 0; i < 5; i++) {
            const x = centerX - 120 + (i * 60);
            const y = 285;
            this.drawSimpleStar(x, y, 8, '#ffd700');
        }

        // 저작권 정보 (하단에 심플하게)
        this.ctx.fillStyle = '#cccccc';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('© 1999 HUNET Corporation', centerX, this.canvas.height - 100);
        this.ctx.fillText('Human Network', centerX, this.canvas.height - 85);
    }

    drawSimpleStar(x, y, size, color) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
            const px = Math.cos(angle) * size;
            const py = Math.sin(angle) * size;
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

    drawClassicButton(x, y, width, height, text, isSelected) {
        // 1999년 클래식 게임 버튼 스타일

        // 버튼 배경
        if (isSelected) {
            // 선택된 버튼 - 금색 그라데이션
            const gradient = this.ctx.createLinearGradient(x, y, x, y + height);
            gradient.addColorStop(0, '#ffd700');
            gradient.addColorStop(1, '#b8860b');
            this.ctx.fillStyle = gradient;
        } else {
            // 일반 버튼 - 은색 그라데이션
            const gradient = this.ctx.createLinearGradient(x, y, x, y + height);
            gradient.addColorStop(0, '#e0e0e0');
            gradient.addColorStop(1, '#a0a0a0');
            this.ctx.fillStyle = gradient;
        }

        this.ctx.fillRect(x, y, width, height);

        // 버튼 테두리
        this.ctx.strokeStyle = isSelected ? '#ffffff' : '#808080';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, width, height);

        // 내부 하이라이트
        this.ctx.strokeStyle = isSelected ? '#ffff80' : '#f0f0f0';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x + 1, y + 1, width - 2, height - 2);

        // 버튼 텍스트
        this.ctx.fillStyle = isSelected ? '#000080' : '#000000';
        this.ctx.font = isSelected ? 'bold 18px Arial' : 'bold 16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(text, x + width/2, y + height/2 + 6);

        // 선택된 버튼에 화살표 추가
        if (isSelected) {
            this.ctx.fillStyle = '#000080';
            this.ctx.font = 'bold 16px Arial';
            this.ctx.fillText('►', x + 20, y + height/2 + 5);
            this.ctx.fillText('◄', x + width - 20, y + height/2 + 5);
        }
    }
};