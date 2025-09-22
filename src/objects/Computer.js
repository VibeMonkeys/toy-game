import { InteractableObject } from './InteractableObject.js';

// 컴퓨터 클래스 - 이메일 체크 및 간단한 업무 게임
export class Computer extends InteractableObject {
    constructor(x, y, computerType = 'office') {
        const name = computerType === 'office' ? '사무용 컴퓨터' : '개발용 컴퓨터';
        super(x, y, 'computer', name);

        this.computerType = computerType;
        this.cooldown = 5000; // 5초 쿨다운
        this.isLoggedIn = false;
        this.currentScreen = 'login'; // 'login', 'desktop', 'email', 'game'
        this.showUI = false;

        // 이메일 시스템
        this.emails = this.generateEmails();
        this.unreadCount = this.emails.filter(email => !email.read).length;

        // 간단한 타이핑 게임
        this.typingGame = {
            active: false,
            text: '',
            userInput: '',
            score: 0,
            timeLeft: 30,
            wpm: 0
        };

        // 컴퓨터 상태
        this.powerOn = true;
        this.loginAttempts = 0;
        this.password = '1234'; // 간단한 패스워드
    }

    generateEmails() {
        const emailTemplates = [
            {
                from: '인사팀',
                subject: '🎉 휴넷 26주년 기념행사 안내',
                content: '안녕하세요! 휴넷 26주년을 맞아 특별한 행사를 준비했습니다.\n오늘 오후 4시 옥상에서 케이크 커팅식이 있으니 많은 참여 부탁드립니다!',
                read: false,
                important: true
            },
            {
                from: '총무팀',
                subject: '사무용품 신청 마감 안내',
                content: '사무용품 신청 마감이 내일까지입니다.\n필요한 물품이 있으시면 서둘러 신청해주세요.',
                read: false,
                important: false
            },
            {
                from: 'IT팀',
                subject: '시스템 점검 안내',
                content: '오늘 밤 12시부터 새벽 4시까지 시스템 점검이 있습니다.\n작업 중인 파일은 미리 저장해주세요.',
                read: false,
                important: true
            },
            {
                from: '개발팀',
                subject: '프로젝트 진행 상황 공유',
                content: '현재 프로젝트가 90% 완료되었습니다.\n최종 테스트 후 다음 주에 배포 예정입니다.',
                read: true,
                important: false
            },
            {
                from: '카페테리아',
                subject: '🍕 오늘의 메뉴',
                content: '오늘의 점심 메뉴:\n- 김치찌개\n- 불고기\n- 샐러드\n- 과일\n\n맛있게 드세요!',
                read: true,
                important: false
            }
        ];

        return emailTemplates.map((email, index) => ({
            id: index,
            ...email,
            timestamp: this.getRandomTimestamp()
        }));
    }

    getRandomTimestamp() {
        const now = new Date();
        const randomHours = Math.floor(Math.random() * 24);
        const randomMinutes = Math.floor(Math.random() * 60);
        now.setHours(randomHours, randomMinutes, 0, 0);
        return now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    }

    performInteraction(gameState, audioManager) {
        if (!this.powerOn) {
            return {
                success: false,
                message: '컴퓨터가 꺼져있습니다.'
            };
        }

        this.showUI = true;
        this.currentScreen = this.isLoggedIn ? 'desktop' : 'login';

        if (audioManager) {
            audioManager.playUIClick();
        }

        return {
            success: true,
            message: `${this.name}에 접속했습니다.`,
            showComputerUI: true,
            computer: this
        };
    }

    // 로그인 시도
    attemptLogin(password, audioManager) {
        this.loginAttempts++;

        if (password === this.password) {
            this.isLoggedIn = true;
            this.currentScreen = 'desktop';
            this.loginAttempts = 0;

            if (audioManager) {
                audioManager.playQuestComplete();
            }

            return {
                success: true,
                message: '로그인 성공!'
            };
        } else {
            if (audioManager) {
                audioManager.playUIClick();
            }

            if (this.loginAttempts >= 3) {
                this.powerOn = false;
                setTimeout(() => {
                    this.powerOn = true;
                    this.loginAttempts = 0;
                }, 10000); // 10초 후 재부팅

                return {
                    success: false,
                    message: '로그인 시도 횟수 초과. 컴퓨터가 잠시 잠겼습니다.'
                };
            }

            return {
                success: false,
                message: `비밀번호가 틀렸습니다. (${this.loginAttempts}/3)`
            };
        }
    }

    // 이메일 읽기
    readEmail(emailId) {
        const email = this.emails.find(e => e.id === emailId);
        if (email && !email.read) {
            email.read = true;
            this.unreadCount--;
            return true;
        }
        return false;
    }

    // 타이핑 게임 시작
    startTypingGame() {
        const texts = [
            '휴넷 26주년을 축하합니다!',
            '열심히 일하는 직장인',
            '코딩은 예술이다',
            '성공적인 프로젝트 완성',
            '팀워크가 중요합니다'
        ];

        this.typingGame = {
            active: true,
            text: texts[Math.floor(Math.random() * texts.length)],
            userInput: '',
            score: 0,
            timeLeft: 30,
            wpm: 0,
            startTime: Date.now()
        };

        this.currentScreen = 'game';
    }

    // 타이핑 게임 입력 처리
    handleTypingInput(input) {
        if (!this.typingGame.active) return false;

        this.typingGame.userInput = input;

        // 정확도 계산
        let correctChars = 0;
        for (let i = 0; i < Math.min(input.length, this.typingGame.text.length); i++) {
            if (input[i] === this.typingGame.text[i]) {
                correctChars++;
            }
        }

        this.typingGame.score = Math.floor((correctChars / this.typingGame.text.length) * 100);

        // 게임 완료 체크
        if (input === this.typingGame.text) {
            this.completeTypingGame();
            return true;
        }

        return false;
    }

    // 타이핑 게임 완료
    completeTypingGame() {
        const elapsed = (Date.now() - this.typingGame.startTime) / 1000;
        const wordsTyped = this.typingGame.text.length / 5; // 평균 단어 길이 5글자
        this.typingGame.wpm = Math.floor((wordsTyped / elapsed) * 60);

        this.typingGame.active = false;

        // 보상 지급 (높은 점수일 때)
        if (this.typingGame.score >= 90) {
            return {
                success: true,
                reward: {
                    name: '타이핑 마스터 인증서',
                    emoji: '🏆',
                    description: `WPM: ${this.typingGame.wpm}, 정확도: ${this.typingGame.score}%`
                }
            };
        }

        return { success: true, reward: null };
    }

    // 화면 전환
    changeScreen(screen) {
        if (!this.isLoggedIn && screen !== 'login') {
            return false;
        }
        this.currentScreen = screen;
        return true;
    }

    // UI 닫기
    closeUI() {
        this.showUI = false;
        this.currentScreen = this.isLoggedIn ? 'desktop' : 'login';
        this.endInteraction();
    }

    // 로그아웃
    logout() {
        this.isLoggedIn = false;
        this.currentScreen = 'login';
    }

    update(deltaTime) {
        // 타이핑 게임 타이머 업데이트
        if (this.typingGame.active && this.typingGame.timeLeft > 0) {
            this.typingGame.timeLeft -= deltaTime / 1000;
            if (this.typingGame.timeLeft <= 0) {
                this.typingGame.active = false;
                this.typingGame.timeLeft = 0;
            }
        }
    }

    getHintText() {
        if (!this.powerOn) {
            return `${this.name} (전원 꺼짐)`;
        }
        if (!this.canInteract()) {
            return `${this.name} (사용 중...)`;
        }
        return `${this.name} (스페이스바로 사용)`;
    }

    // 컴퓨터 UI 렌더링 정보
    getUIData() {
        return {
            show: this.showUI,
            screen: this.currentScreen,
            isLoggedIn: this.isLoggedIn,
            powerOn: this.powerOn,
            emails: this.emails,
            unreadCount: this.unreadCount,
            typingGame: this.typingGame,
            loginAttempts: this.loginAttempts,
            maxAttempts: 3
        };
    }
}