import { InteractableObject } from './InteractableObject.js';

// 프린터 클래스 - 문서 출력 및 용지 걸림 미니게임
export class Printer extends InteractableObject {
    constructor(x, y, printerType = 'office') {
        const name = printerType === 'office' ? '사무용 프린터' : '컬러 프린터';
        super(x, y, 'printer', name);

        this.printerType = printerType;
        this.cooldown = 4000; // 4초 쿨다운
        this.paperLevel = 100; // 용지 잔량 (0-100)
        this.inkLevel = 80; // 잉크 잔량 (0-100)
        this.status = 'ready'; // 'ready', 'printing', 'jammed', 'out_of_paper', 'error'
        this.showUI = false;

        // 출력 대기열
        this.printQueue = [];

        // 용지 걸림 미니게임
        this.jamGame = {
            active: false,
            sequence: [],
            userSequence: [],
            currentStep: 0,
            attempts: 0,
            maxAttempts: 3
        };

        // 출력 가능한 문서들
        this.availableDocuments = this.getAvailableDocuments();
    }

    getAvailableDocuments() {
        return [
            {
                id: 'report',
                name: '업무 보고서',
                emoji: '📊',
                pages: 5,
                paperCost: 5,
                inkCost: 10,
                description: '월간 업무 보고서',
                reward: '완성된 업무 보고서'
            },
            {
                id: 'manual',
                name: '사용자 매뉴얼',
                emoji: '📖',
                pages: 12,
                paperCost: 12,
                inkCost: 15,
                description: '신입사원용 매뉴얼',
                reward: '사용자 매뉴얼'
            },
            {
                id: 'certificate',
                name: '수료증',
                emoji: '📜',
                pages: 1,
                paperCost: 1,
                inkCost: 25,
                description: '교육 수료증 (컬러 출력)',
                reward: '교육 수료증'
            },
            {
                id: 'memo',
                name: '회의록',
                emoji: '📝',
                pages: 3,
                paperCost: 3,
                inkCost: 5,
                description: '팀 회의록',
                reward: '회의록'
            },
            {
                id: 'photo',
                name: '사진',
                emoji: '📷',
                pages: 1,
                paperCost: 1,
                inkCost: 30,
                description: '회사 단체 사진 (고품질)',
                reward: '회사 단체 사진'
            }
        ];
    }

    performInteraction(gameState, audioManager) {
        if (this.status === 'error') {
            return {
                success: false,
                message: '프린터에 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
            };
        }

        this.showUI = true;

        if (audioManager) {
            audioManager.playUIClick();
        }

        return {
            success: true,
            message: `${this.name}에 접속했습니다.`,
            showPrinterUI: true,
            printer: this
        };
    }

    // 문서 출력 시작
    startPrint(documentId, gameState, audioManager) {
        const document = this.availableDocuments.find(doc => doc.id === documentId);
        if (!document) {
            return { success: false, message: '문서를 찾을 수 없습니다.' };
        }

        // 용지 및 잉크 확인
        if (this.paperLevel < document.paperCost) {
            return { success: false, message: '용지가 부족합니다.' };
        }

        if (this.inkLevel < document.inkCost) {
            return { success: false, message: '잉크가 부족합니다.' };
        }

        // 랜덤으로 용지 걸림 발생 (30% 확률)
        if (Math.random() < 0.3) {
            this.status = 'jammed';
            this.startJamGame();

            if (audioManager) {
                audioManager.playUIClick(); // 에러 사운드 대신
            }

            return {
                success: false,
                message: '용지가 걸렸습니다! 용지 걸림을 해결해주세요.',
                paperJammed: true
            };
        }

        // 정상 출력 진행
        this.status = 'printing';
        this.paperLevel -= document.paperCost;
        this.inkLevel -= document.inkCost;

        this.printQueue.push({
            document: document,
            startTime: Date.now(),
            duration: document.pages * 1000 // 페이지당 1초
        });

        if (audioManager) {
            audioManager.playUIClick();
        }

        // 출력 완료 후 처리
        setTimeout(() => {
            this.completePrint(document, gameState, audioManager);
        }, document.pages * 1000);

        return {
            success: true,
            message: `${document.name} 출력을 시작했습니다...`
        };
    }

    // 출력 완료 처리
    completePrint(document, gameState, audioManager) {
        this.status = 'ready';

        // 출력물을 인벤토리에 추가
        const printedItem = {
            name: document.reward,
            emoji: document.emoji,
            description: `출력된 ${document.name}`,
            type: 'document',
            pages: document.pages
        };

        gameState.addItem(printedItem);

        if (audioManager) {
            audioManager.playItemCollect();
        }

        // 출력 대기열에서 제거
        this.printQueue = this.printQueue.filter(item => item.document.id !== document.id);
    }

    // 용지 걸림 미니게임 시작
    startJamGame() {
        const sequences = [
            ['위', '아래', '당기기'],
            ['좌', '우', '당기기'],
            ['위', '좌', '아래', '당기기'],
            ['우', '위', '좌', '당기기']
        ];

        this.jamGame = {
            active: true,
            sequence: sequences[Math.floor(Math.random() * sequences.length)],
            userSequence: [],
            currentStep: 0,
            attempts: 0,
            maxAttempts: 3
        };
    }

    // 용지 걸림 해결 시도
    attemptJamFix(action) {
        if (!this.jamGame.active) return { success: false, message: '용지 걸림이 없습니다.' };

        const correctAction = this.jamGame.sequence[this.jamGame.currentStep];

        if (action === correctAction) {
            this.jamGame.userSequence.push(action);
            this.jamGame.currentStep++;

            // 모든 단계 완료
            if (this.jamGame.currentStep >= this.jamGame.sequence.length) {
                this.status = 'ready';
                this.jamGame.active = false;

                return {
                    success: true,
                    message: '용지 걸림을 성공적으로 해결했습니다!',
                    completed: true
                };
            }

            return {
                success: true,
                message: `올바른 동작입니다. 다음: ${this.jamGame.sequence[this.jamGame.currentStep]}`
            };
        } else {
            this.jamGame.attempts++;
            this.jamGame.userSequence = [];
            this.jamGame.currentStep = 0;

            if (this.jamGame.attempts >= this.jamGame.maxAttempts) {
                this.status = 'error';
                this.jamGame.active = false;

                // 5초 후 프린터 복구
                setTimeout(() => {
                    this.status = 'ready';
                    this.jamGame = {
                        active: false,
                        sequence: [],
                        userSequence: [],
                        currentStep: 0,
                        attempts: 0,
                        maxAttempts: 3
                    };
                }, 5000);

                return {
                    success: false,
                    message: '용지 걸림 해결에 실패했습니다. 프린터가 일시적으로 비활성화됩니다.',
                    failed: true
                };
            }

            return {
                success: false,
                message: `잘못된 동작입니다. 처음부터 다시 시도하세요. (${this.jamGame.attempts}/${this.jamGame.maxAttempts})`
            };
        }
    }

    // 용지 보충
    refillPaper(gameState) {
        // 인벤토리에서 용지 확인
        const paperItem = gameState.inventory.find(item =>
            item.name.includes('용지') || item.name.includes('종이')
        );

        if (!paperItem) {
            return { success: false, message: '인벤토리에 용지가 없습니다.' };
        }

        // 용지 제거하고 프린터 보충
        const paperIndex = gameState.inventory.indexOf(paperItem);
        gameState.inventory.splice(paperIndex, 1);

        this.paperLevel = Math.min(100, this.paperLevel + 50);

        return {
            success: true,
            message: `용지를 보충했습니다. (현재 ${this.paperLevel}%)`
        };
    }

    // 잉크 보충
    refillInk(gameState) {
        // 인벤토리에서 잉크 확인
        const inkItem = gameState.inventory.find(item =>
            item.name.includes('잉크') || item.name.includes('토너')
        );

        if (!inkItem) {
            return { success: false, message: '인벤토리에 잉크가 없습니다.' };
        }

        // 잉크 제거하고 프린터 보충
        const inkIndex = gameState.inventory.indexOf(inkItem);
        gameState.inventory.splice(inkIndex, 1);

        this.inkLevel = Math.min(100, this.inkLevel + 30);

        return {
            success: true,
            message: `잉크를 보충했습니다. (현재 ${this.inkLevel}%)`
        };
    }

    // UI 닫기
    closeUI() {
        this.showUI = false;
        this.endInteraction();
    }

    update(deltaTime) {
        // 출력 중인 작업 업데이트
        this.printQueue.forEach(job => {
            const elapsed = Date.now() - job.startTime;
            job.progress = Math.min(100, (elapsed / job.duration) * 100);
        });

        // 용지/잉크 자연 소모 (매우 천천히)
        if (Math.random() < 0.0001) {
            this.paperLevel = Math.max(0, this.paperLevel - 1);
            this.inkLevel = Math.max(0, this.inkLevel - 1);
        }
    }

    getHintText() {
        if (this.status === 'error') {
            return `${this.name} (오류 발생)`;
        }
        if (this.status === 'jammed') {
            return `${this.name} (용지 걸림)`;
        }
        if (this.status === 'printing') {
            return `${this.name} (출력 중...)`;
        }
        if (!this.canInteract()) {
            return `${this.name} (사용 중...)`;
        }
        return `${this.name} (스페이스바로 사용)`;
    }

    // 프린터 UI 렌더링 정보
    getUIData() {
        return {
            show: this.showUI,
            status: this.status,
            paperLevel: this.paperLevel,
            inkLevel: this.inkLevel,
            documents: this.availableDocuments,
            printQueue: this.printQueue,
            jamGame: this.jamGame,
            printerType: this.printerType
        };
    }
}