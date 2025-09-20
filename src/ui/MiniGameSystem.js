export class MiniGameSystem {
    constructor(canvas, ctx, audioManager) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.audioManager = audioManager;

        this.isVisible = false;
        this.currentGame = null;
        this.gameMenuIndex = 0;
        this.games = [
            { name: '메모리 매치', id: 'memory', icon: '🧠' },
            { name: '스네이크 게임', id: 'snake', icon: '🐍' },
            { name: '나가기', id: 'exit', icon: '🚪' }
        ];

        // 메모리 게임 상태
        this.memoryGame = {
            cards: [],
            flippedCards: [],
            matchedPairs: 0,
            totalPairs: 8,
            gameStarted: false,
            gameWon: false,
            flipDelay: false
        };

        // 스네이크 게임 상태
        this.snakeGame = {
            snake: [{ x: 10, y: 10 }],
            food: { x: 15, y: 15 },
            direction: { x: 1, y: 0 },
            score: 0,
            gameStarted: false,
            gameOver: false,
            lastUpdate: 0,
            speed: 200
        };

        this.initializeMemoryCards();
    }

    initializeMemoryCards() {
        const symbols = ['🎓', '💻', '📚', '🏆', '⭐', '🔥', '💡', '🎯'];
        const cardPairs = [...symbols, ...symbols];

        // 카드 섞기
        for (let i = cardPairs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cardPairs[i], cardPairs[j]] = [cardPairs[j], cardPairs[i]];
        }

        // 4x4 그리드로 배치
        this.memoryGame.cards = [];
        for (let i = 0; i < 16; i++) {
            this.memoryGame.cards.push({
                symbol: cardPairs[i],
                flipped: false,
                matched: false,
                x: (i % 4) * 120 + 300,
                y: Math.floor(i / 4) * 100 + 200
            });
        }
    }

    show() {
        this.isVisible = true;
        this.currentGame = null;
        this.gameMenuIndex = 0;
    }

    hide() {
        this.isVisible = false;
        this.currentGame = null;
        this.resetGames();
    }

    resetGames() {
        // 메모리 게임 리셋
        this.memoryGame.matchedPairs = 0;
        this.memoryGame.gameStarted = false;
        this.memoryGame.gameWon = false;
        this.memoryGame.flippedCards = [];
        this.memoryGame.flipDelay = false;
        this.initializeMemoryCards();

        // 스네이크 게임 리셋
        this.snakeGame.snake = [{ x: 10, y: 10 }];
        this.snakeGame.food = { x: 15, y: 15 };
        this.snakeGame.direction = { x: 1, y: 0 };
        this.snakeGame.score = 0;
        this.snakeGame.gameStarted = false;
        this.snakeGame.gameOver = false;
        this.snakeGame.lastUpdate = 0;
    }

    handleKeyDown(event) {
        if (!this.isVisible) return null;

        if (this.currentGame === null) {
            // 게임 메뉴
            switch (event.key) {
                case 'ArrowUp':
                    this.gameMenuIndex = (this.gameMenuIndex - 1 + this.games.length) % this.games.length;
                    this.audioManager?.playUIHover();
                    break;
                case 'ArrowDown':
                    this.gameMenuIndex = (this.gameMenuIndex + 1) % this.games.length;
                    this.audioManager?.playUIHover();
                    break;
                case 'Enter':
                case ' ':
                    return this.selectGame();
                case 'Escape':
                    this.hide();
                    return 'close';
            }
        } else if (this.currentGame === 'snake') {
            return this.handleSnakeInput(event);
        } else if (this.currentGame === 'memory') {
            return this.handleMemoryInput(event);
        }

        return null;
    }

    handleMouseClick(event) {
        if (!this.isVisible) return null;

        const rect = this.canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        if (this.currentGame === 'memory') {
            return this.handleMemoryClick(mouseX, mouseY);
        }

        return null;
    }

    selectGame() {
        const selectedGame = this.games[this.gameMenuIndex];

        switch (selectedGame.id) {
            case 'memory':
                this.currentGame = 'memory';
                this.memoryGame.gameStarted = true;
                this.audioManager?.playUIClick();
                break;
            case 'snake':
                this.currentGame = 'snake';
                this.snakeGame.gameStarted = true;
                this.audioManager?.playUIClick();
                break;
            case 'exit':
                this.hide();
                return 'close';
        }

        return null;
    }

    handleMemoryInput(event) {
        if (event.key === 'Escape') {
            this.currentGame = null;
            return null;
        }
        return null;
    }

    handleMemoryClick(mouseX, mouseY) {
        if (this.memoryGame.flipDelay || this.memoryGame.gameWon) return null;

        for (let card of this.memoryGame.cards) {
            if (mouseX >= card.x && mouseX <= card.x + 100 &&
                mouseY >= card.y && mouseY <= card.y + 80) {

                if (!card.flipped && !card.matched && this.memoryGame.flippedCards.length < 2) {
                    card.flipped = true;
                    this.memoryGame.flippedCards.push(card);
                    this.audioManager?.playUIClick();

                    if (this.memoryGame.flippedCards.length === 2) {
                        setTimeout(() => this.checkMemoryMatch(), 1000);
                        this.memoryGame.flipDelay = true;
                    }
                }
                break;
            }
        }

        return null;
    }

    checkMemoryMatch() {
        const [card1, card2] = this.memoryGame.flippedCards;

        if (card1.symbol === card2.symbol) {
            card1.matched = true;
            card2.matched = true;
            this.memoryGame.matchedPairs++;
            this.audioManager?.playGameComplete();

            if (this.memoryGame.matchedPairs === this.memoryGame.totalPairs) {
                this.memoryGame.gameWon = true;
            }
        } else {
            card1.flipped = false;
            card2.flipped = false;
            this.audioManager?.playMenuMove();
        }

        this.memoryGame.flippedCards = [];
        this.memoryGame.flipDelay = false;
    }

    handleSnakeInput(event) {
        if (!this.snakeGame.gameStarted || this.snakeGame.gameOver) {
            if (event.key === 'Enter' || event.key === ' ') {
                this.resetGames();
                this.snakeGame.gameStarted = true;
                return null;
            }
            if (event.key === 'Escape') {
                this.currentGame = null;
                return null;
            }
            return null;
        }

        switch (event.key) {
            case 'ArrowUp':
                if (this.snakeGame.direction.y !== 1) {
                    this.snakeGame.direction = { x: 0, y: -1 };
                }
                break;
            case 'ArrowDown':
                if (this.snakeGame.direction.y !== -1) {
                    this.snakeGame.direction = { x: 0, y: 1 };
                }
                break;
            case 'ArrowLeft':
                if (this.snakeGame.direction.x !== 1) {
                    this.snakeGame.direction = { x: -1, y: 0 };
                }
                break;
            case 'ArrowRight':
                if (this.snakeGame.direction.x !== -1) {
                    this.snakeGame.direction = { x: 1, y: 0 };
                }
                break;
            case 'Escape':
                this.currentGame = null;
                break;
        }

        return null;
    }

    update() {
        if (!this.isVisible) return;

        if (this.currentGame === 'snake' && this.snakeGame.gameStarted && !this.snakeGame.gameOver) {
            const now = Date.now();
            if (now - this.snakeGame.lastUpdate > this.snakeGame.speed) {
                this.updateSnake();
                this.snakeGame.lastUpdate = now;
            }
        }
    }

    updateSnake() {
        const head = { ...this.snakeGame.snake[0] };
        head.x += this.snakeGame.direction.x;
        head.y += this.snakeGame.direction.y;

        // 벽 충돌 체크
        if (head.x < 0 || head.x >= 30 || head.y < 0 || head.y >= 20) {
            this.snakeGame.gameOver = true;
            return;
        }

        // 자기 자신 충돌 체크
        for (let segment of this.snakeGame.snake) {
            if (head.x === segment.x && head.y === segment.y) {
                this.snakeGame.gameOver = true;
                return;
            }
        }

        this.snakeGame.snake.unshift(head);

        // 음식 먹기 체크
        if (head.x === this.snakeGame.food.x && head.y === this.snakeGame.food.y) {
            this.snakeGame.score += 10;
            this.generateSnakeFood();
            this.audioManager?.playItemCollect();
        } else {
            this.snakeGame.snake.pop();
        }
    }

    generateSnakeFood() {
        do {
            this.snakeGame.food = {
                x: Math.floor(Math.random() * 30),
                y: Math.floor(Math.random() * 20)
            };
        } while (this.snakeGame.snake.some(segment =>
            segment.x === this.snakeGame.food.x && segment.y === this.snakeGame.food.y
        ));
    }

    draw() {
        if (!this.isVisible) return;

        // 배경
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.currentGame === null) {
            this.drawGameMenu();
        } else if (this.currentGame === 'memory') {
            this.drawMemoryGame();
        } else if (this.currentGame === 'snake') {
            this.drawSnakeGame();
        }
    }

    drawGameMenu() {
        // 제목
        this.ctx.fillStyle = '#00ffff';
        this.ctx.font = 'bold 36px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('🎮 휴넷 아케이드 🎮', this.canvas.width / 2, 150);

        // 게임 목록
        this.ctx.font = 'bold 24px monospace';
        const startY = 250;
        const spacing = 60;

        for (let i = 0; i < this.games.length; i++) {
            const y = startY + i * spacing;
            const isSelected = i === this.gameMenuIndex;

            if (isSelected) {
                // 선택된 게임 하이라이트
                this.ctx.fillStyle = 'rgba(0, 255, 255, 0.2)';
                this.ctx.fillRect(this.canvas.width / 2 - 200, y - 30, 400, 50);

                this.ctx.strokeStyle = '#00ffff';
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(this.canvas.width / 2 - 200, y - 30, 400, 50);

                this.ctx.fillStyle = '#ffffff';
                this.ctx.fillText('►', this.canvas.width / 2 - 250, y);
            } else {
                this.ctx.fillStyle = '#aaaaaa';
            }

            this.ctx.fillText(`${this.games[i].icon} ${this.games[i].name}`, this.canvas.width / 2, y);
        }

        // 조작 안내
        this.ctx.fillStyle = 'rgba(0, 255, 100, 0.8)';
        this.ctx.font = '16px monospace';
        this.ctx.fillText('[↑↓] 선택  [ENTER] 확인  [ESC] 나가기', this.canvas.width / 2, this.canvas.height - 50);
    }

    drawMemoryGame() {
        // 제목
        this.ctx.fillStyle = '#ff6600';
        this.ctx.font = 'bold 28px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('🧠 메모리 매치 게임', this.canvas.width / 2, 80);

        // 진행 상황
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '18px monospace';
        this.ctx.fillText(`매치된 쌍: ${this.memoryGame.matchedPairs} / ${this.memoryGame.totalPairs}`, this.canvas.width / 2, 120);

        // 카드들 그리기
        for (let card of this.memoryGame.cards) {
            if (card.matched) {
                // 매치된 카드
                this.ctx.fillStyle = '#228B22';
            } else if (card.flipped) {
                // 뒤집힌 카드
                this.ctx.fillStyle = '#4169E1';
            } else {
                // 뒤집어진 카드
                this.ctx.fillStyle = '#2F4F4F';
            }

            this.ctx.fillRect(card.x, card.y, 100, 80);

            // 테두리
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(card.x, card.y, 100, 80);

            // 카드 내용
            if (card.flipped || card.matched) {
                this.ctx.fillStyle = '#ffffff';
                this.ctx.font = 'bold 32px monospace';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(card.symbol, card.x + 50, card.y + 50);
            } else {
                this.ctx.fillStyle = '#ffffff';
                this.ctx.font = 'bold 24px monospace';
                this.ctx.textAlign = 'center';
                this.ctx.fillText('?', card.x + 50, card.y + 50);
            }
        }

        // 게임 완료 메시지
        if (this.memoryGame.gameWon) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            this.ctx.fillStyle = '#FFD700';
            this.ctx.font = 'bold 36px monospace';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('🎉 축하합니다! 🎉', this.canvas.width / 2, this.canvas.height / 2 - 50);

            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '20px monospace';
            this.ctx.fillText('모든 카드를 매치했습니다!', this.canvas.width / 2, this.canvas.height / 2);
            this.ctx.fillText('[ESC] 메뉴로 돌아가기', this.canvas.width / 2, this.canvas.height / 2 + 50);
        }

        // 조작 안내
        this.ctx.fillStyle = 'rgba(0, 255, 100, 0.8)';
        this.ctx.font = '14px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('[클릭] 카드 뒤집기  [ESC] 메뉴로', this.canvas.width / 2, this.canvas.height - 30);
    }

    drawSnakeGame() {
        // 제목
        this.ctx.fillStyle = '#32CD32';
        this.ctx.font = 'bold 28px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('🐍 휴넷 스네이크', this.canvas.width / 2, 80);

        // 점수
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '18px monospace';
        this.ctx.fillText(`점수: ${this.snakeGame.score}`, this.canvas.width / 2, 120);

        // 게임 영역
        const gameArea = {
            x: 200,
            y: 150,
            width: 800,
            height: 400
        };

        // 게임 영역 배경
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(gameArea.x, gameArea.y, gameArea.width, gameArea.height);

        // 게임 영역 테두리
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(gameArea.x, gameArea.y, gameArea.width, gameArea.height);

        if (this.snakeGame.gameStarted && !this.snakeGame.gameOver) {
            // 뱀 그리기
            this.ctx.fillStyle = '#32CD32';
            for (let segment of this.snakeGame.snake) {
                this.ctx.fillRect(
                    gameArea.x + segment.x * 25 + 2,
                    gameArea.y + segment.y * 20 + 2,
                    21, 16
                );
            }

            // 머리 강조
            this.ctx.fillStyle = '#228B22';
            const head = this.snakeGame.snake[0];
            this.ctx.fillRect(
                gameArea.x + head.x * 25 + 2,
                gameArea.y + head.y * 20 + 2,
                21, 16
            );

            // 음식 그리기
            this.ctx.fillStyle = '#FF6347';
            this.ctx.fillRect(
                gameArea.x + this.snakeGame.food.x * 25 + 2,
                gameArea.y + this.snakeGame.food.y * 20 + 2,
                21, 16
            );
        } else if (this.snakeGame.gameOver) {
            // 게임 오버 메시지
            this.ctx.fillStyle = '#FF4500';
            this.ctx.font = 'bold 36px monospace';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('게임 오버!', this.canvas.width / 2, this.canvas.height / 2 - 50);

            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '20px monospace';
            this.ctx.fillText(`최종 점수: ${this.snakeGame.score}`, this.canvas.width / 2, this.canvas.height / 2);
            this.ctx.fillText('[ENTER] 다시 시작  [ESC] 메뉴로', this.canvas.width / 2, this.canvas.height / 2 + 50);
        } else {
            // 시작 메시지
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = 'bold 24px monospace';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('스네이크 게임', this.canvas.width / 2, this.canvas.height / 2 - 30);
            this.ctx.fillText('[ENTER] 게임 시작', this.canvas.width / 2, this.canvas.height / 2 + 10);
        }

        // 조작 안내
        this.ctx.fillStyle = 'rgba(0, 255, 100, 0.8)';
        this.ctx.font = '14px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('[방향키] 이동  [ESC] 메뉴로', this.canvas.width / 2, this.canvas.height - 30);
    }
}