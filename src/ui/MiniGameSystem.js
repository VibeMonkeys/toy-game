// 게임 설정 상수들
const GAME_CONFIG = {
    MEMORY: {
        TOTAL_PAIRS: 8,
        GRID_SIZE: 4,
        CARD_WIDTH: 100,
        CARD_HEIGHT: 80,
        CARD_SPACING: 120,
        FLIP_DELAY: 1000
    },
    SNAKE: {
        INITIAL_SPEED: 200,
        GRID_WIDTH: 30,
        GRID_HEIGHT: 20,
        INITIAL_POS: { x: 10, y: 10 },
        FOOD_INITIAL: { x: 15, y: 15 }
    },
    TETRIS: {
        BOARD_WIDTH: 10,
        BOARD_HEIGHT: 20,
        INITIAL_SPEED: 1000,
        MIN_SPEED: 100,
        SPEED_INCREASE: 100,
        LINES_PER_LEVEL: 10,
        POINTS_PER_LINE: 100,
        CHALLENGE_LINES: 10
    },
    BREAKOUT: {
        PADDLE: { x: 350, y: 550, width: 100, height: 10 },
        BALL: { x: 400, y: 300, dx: 3, dy: -3, radius: 8 },
        BRICK: { width: 90, height: 25 },
        GRID: { rows: 5, cols: 8 },
        POINTS_PER_BRICK: 10,
        GAME_AREA: { x: 200, y: 150, width: 800, height: 400 }
    },
    FLAPPY: {
        BIRD: { x: 100, y: 250, radius: 15 },
        PIPE: { width: 50, gap: 150, speed: 3 },
        GRAVITY: 0.5,
        JUMP_FORCE: -8,
        MIN_GAP_Y: 100,
        GAP_RANGE: 200,
        SPAWN_DISTANCE: 600,
        CHALLENGE_SCORE: 10
    },
    UI: {
        GAME_AREA_HEIGHT: 500,
        BOTTOM_BOUNDARY: 600
    }
};

export class MiniGameSystem {
    constructor(canvas, ctx, audioManager, gameInstance = null) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.audioManager = audioManager;
        this.gameInstance = gameInstance; // Game.js 인스턴스 참조

        this.isVisible = false;
        this.currentGame = null;
        this.gameMenuIndex = 0;
        this.games = [
            { name: '메모리 매치', id: 'memory', icon: '🧠' },
            { name: '스네이크 게임', id: 'snake', icon: '🐍' },
            { name: '휴넷 테트리스', id: 'tetris', icon: '🧩' },
            { name: '브레이크아웃', id: 'breakout', icon: '🏓' },
            { name: '플래피 버드', id: 'flappy', icon: '🐦' },
            { name: '나가기', id: 'exit', icon: '🚪' }
        ];

        // 메모리 게임 상태
        this.memoryGame = {
            cards: [],
            flippedCards: [],
            matchedPairs: 0,
            totalPairs: GAME_CONFIG.MEMORY.TOTAL_PAIRS,
            gameStarted: false,
            gameWon: false,
            flipDelay: false,
            challengeCompleted: false
        };

        // 스네이크 게임 상태
        this.snakeGame = {
            snake: [{ ...GAME_CONFIG.SNAKE.INITIAL_POS }],
            food: { ...GAME_CONFIG.SNAKE.FOOD_INITIAL },
            direction: { x: 1, y: 0 },
            score: 0,
            gameStarted: false,
            gameOver: false,
            lastUpdate: 0,
            speed: GAME_CONFIG.SNAKE.INITIAL_SPEED,
            challengeCompleted: false
        };

        // 테트리스 게임 상태
        this.tetrisGame = {
            board: this.createEmptyBoard(GAME_CONFIG.TETRIS.BOARD_HEIGHT, GAME_CONFIG.TETRIS.BOARD_WIDTH),
            currentPiece: null,
            nextPiece: null,
            position: { x: 0, y: 0 },
            score: 0,
            level: 1,
            lines: 0,
            gameStarted: false,
            gameOver: false,
            lastUpdate: 0,
            dropSpeed: GAME_CONFIG.TETRIS.INITIAL_SPEED,
            challengeCompleted: false,
            pieces: [
                // I-piece
                [['....', 'XXXX', '....', '....']],
                // O-piece
                [['XX', 'XX']],
                // T-piece
                [['...', 'XXX', '.X.'], ['.X', 'XX', '.X'], ['.X.', 'XXX', '...'], ['X.', 'XX', 'X.']],
                // S-piece
                [['...', '.XX', 'XX.'], ['X.', 'XX', '.X']],
                // Z-piece
                [['...', 'XX.', '.XX'], ['.X', 'XX', 'X.']],
                // J-piece
                [['...', 'XXX', '..X'], ['.X', '.X', 'XX'], ['X..', 'XXX', '...'], ['XX', 'X.', 'X.']],
                // L-piece
                [['...', 'XXX', 'X..'], ['XX', '.X', '.X'], ['..X', 'XXX', '...'], ['X.', 'X.', 'XX']]
            ]
        };

        // 브레이크아웃 게임 상태
        this.breakoutGame = {
            paddle: { ...GAME_CONFIG.BREAKOUT.PADDLE },
            ball: { ...GAME_CONFIG.BREAKOUT.BALL },
            bricks: [],
            score: 0,
            gameStarted: false,
            gameOver: false,
            gameWon: false,
            challengeCompleted: false
        };

        // 플래피 버드 게임 상태
        this.flappyGame = {
            bird: { ...GAME_CONFIG.FLAPPY.BIRD, dy: 0 },
            pipes: [],
            score: 0,
            gameStarted: false,
            gameOver: false,
            lastUpdate: 0,
            pipeGap: GAME_CONFIG.FLAPPY.PIPE.gap,
            pipeWidth: GAME_CONFIG.FLAPPY.PIPE.width,
            challengeCompleted: false
        };

        this.initializeMemoryCards();
        this.initializeTetris();
        this.initializeBreakout();
        this.initializeFlappy();
    }

    initializeMemoryCards() {
        const symbols = ['🎓', '💻', '📚', '🏆', '⭐', '🔥', '💡', '🎯'];
        const cardPairs = [...symbols, ...symbols];

        // 카드 섞기
        for (let i = cardPairs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cardPairs[i], cardPairs[j]] = [cardPairs[j], cardPairs[i]];
        }

        // 4x4 그리드로 배치 - 설정 상수 사용
        this.memoryGame.cards = [];
        const gridSize = GAME_CONFIG.MEMORY.GRID_SIZE;
        for (let i = 0; i < gridSize * gridSize; i++) {
            this.memoryGame.cards.push({
                symbol: cardPairs[i],
                flipped: false,
                matched: false,
                x: (i % gridSize) * GAME_CONFIG.MEMORY.CARD_SPACING + 300,
                y: Math.floor(i / gridSize) * 100 + 200
            });
        }
    }

    createEmptyBoard(rows, cols) {
        return Array(rows).fill().map(() => Array(cols).fill(0));
    }

    initializeTetris() {
        this.tetrisGame.board = this.createEmptyBoard(20, 10);
        this.tetrisGame.currentPiece = this.getRandomPiece();
        this.tetrisGame.nextPiece = this.getRandomPiece();
        this.tetrisGame.position = { x: 4, y: 0 };
    }

    initializeBreakout() {
        this.breakoutGame.bricks = [];
        const { rows, cols } = GAME_CONFIG.BREAKOUT.GRID;
        const { width, height } = GAME_CONFIG.BREAKOUT.BRICK;
        
        // 벽돌 생성 - 설정 상수 사용
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                this.breakoutGame.bricks.push({
                    x: col * 100 + 50,
                    y: row * 30 + 50,
                    width: width,
                    height: height,
                    color: `hsl(${row * 60}, 70%, 50%)`,
                    destroyed: false
                });
            }
        }
    }

    initializeFlappy() {
        this.flappyGame.bird = { ...GAME_CONFIG.FLAPPY.BIRD, dy: 0 };
        this.flappyGame.pipes = [];
        this.flappyGame.score = 0;
        // 첫 번째 파이프 생성
        this.addFlappyPipe();
    }

    getRandomPiece() {
        const pieces = this.tetrisGame.pieces;
        const randomIndex = Math.floor(Math.random() * pieces.length);
        const piece = pieces[randomIndex];
        return {
            shape: piece[0], // 첫 번째 회전 상태
            rotations: piece,
            currentRotation: 0,
            color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3', '#54A0FF'][randomIndex]
        };
    }

    addFlappyPipe() {
        const gapY = GAME_CONFIG.FLAPPY.MIN_GAP_Y + Math.random() * GAME_CONFIG.FLAPPY.GAP_RANGE;
        this.flappyGame.pipes.push({
            x: 800,
            topHeight: gapY - this.flappyGame.pipeGap / 2,
            bottomY: gapY + this.flappyGame.pipeGap / 2,
            passed: false
        });
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
        this.memoryGame.challengeCompleted = false;
        this.initializeMemoryCards();

        // 스네이크 게임 리셋
        this.snakeGame.snake = [{ ...GAME_CONFIG.SNAKE.INITIAL_POS }];
        this.snakeGame.food = { ...GAME_CONFIG.SNAKE.FOOD_INITIAL };
        this.snakeGame.direction = { x: 1, y: 0 };
        this.snakeGame.score = 0;
        this.snakeGame.gameStarted = false;
        this.snakeGame.gameOver = false;
        this.snakeGame.lastUpdate = 0;
        this.snakeGame.challengeCompleted = false;

        // 테트리스 게임 리셋
        this.tetrisGame.score = 0;
        this.tetrisGame.level = 1;
        this.tetrisGame.lines = 0;
        this.tetrisGame.gameStarted = false;
        this.tetrisGame.gameOver = false;
        this.tetrisGame.lastUpdate = 0;
        this.tetrisGame.dropSpeed = GAME_CONFIG.TETRIS.INITIAL_SPEED;
        this.tetrisGame.challengeCompleted = false;
        this.initializeTetris();

        // 브레이크아웃 게임 리셋
        this.breakoutGame.paddle = { ...GAME_CONFIG.BREAKOUT.PADDLE };
        this.breakoutGame.ball = { ...GAME_CONFIG.BREAKOUT.BALL };
        this.breakoutGame.score = 0;
        this.breakoutGame.gameStarted = false;
        this.breakoutGame.gameOver = false;
        this.breakoutGame.gameWon = false;
        this.breakoutGame.challengeCompleted = false;
        this.initializeBreakout();

        // 플래피 버드 게임 리셋
        this.flappyGame.score = 0;
        this.flappyGame.gameStarted = false;
        this.flappyGame.gameOver = false;
        this.flappyGame.lastUpdate = 0;
        this.flappyGame.challengeCompleted = false;
        this.initializeFlappy();
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
        } else if (this.currentGame === 'tetris') {
            return this.handleTetrisInput(event);
        } else if (this.currentGame === 'breakout') {
            return this.handleBreakoutInput(event);
        } else if (this.currentGame === 'flappy') {
            return this.handleFlappyInput(event);
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
            case 'tetris':
                this.currentGame = 'tetris';
                this.tetrisGame.gameStarted = true;
                this.audioManager?.playUIClick();
                break;
            case 'breakout':
                this.currentGame = 'breakout';
                this.breakoutGame.gameStarted = true;
                this.audioManager?.playUIClick();
                break;
            case 'flappy':
                this.currentGame = 'flappy';
                this.flappyGame.gameStarted = true;
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
                        this.gameInstance?.setSafeTimeout(() => this.checkMemoryMatch(), GAME_CONFIG.MEMORY.FLIP_DELAY);
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
                // 게임 완료 콜백 호출 - 중복 호출 방지
                if (!this.memoryGame.challengeCompleted && this.gameInstance?.onMinigameCompleted) {
                    this.memoryGame.challengeCompleted = true;
                    this.gameInstance.onMinigameCompleted('memory_match');
                }
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

    handleTetrisInput(event) {
        if (!this.tetrisGame.gameStarted || this.tetrisGame.gameOver) {
            if (event.key === 'Enter' || event.key === ' ') {
                this.resetGames();
                this.tetrisGame.gameStarted = true;
                return null;
            }
            if (event.key === 'Escape') {
                this.currentGame = null;
                return null;
            }
            return null;
        }

        switch (event.key) {
            case 'ArrowLeft':
                if (this.canMoveTetris(-1, 0)) {
                    this.tetrisGame.position.x--;
                }
                break;
            case 'ArrowRight':
                if (this.canMoveTetris(1, 0)) {
                    this.tetrisGame.position.x++;
                }
                break;
            case 'ArrowDown':
                if (this.canMoveTetris(0, 1)) {
                    this.tetrisGame.position.y++;
                }
                break;
            case 'ArrowUp':
            case ' ':
                this.rotateTetrisPiece();
                break;
            case 'Escape':
                this.currentGame = null;
                break;
        }

        return null;
    }

    handleBreakoutInput(event) {
        if (!this.breakoutGame.gameStarted || this.breakoutGame.gameOver || this.breakoutGame.gameWon) {
            if (event.key === 'Enter' || event.key === ' ') {
                this.resetGames();
                this.breakoutGame.gameStarted = true;
                return null;
            }
            if (event.key === 'Escape') {
                this.currentGame = null;
                return null;
            }
            return null;
        }

        switch (event.key) {
            case 'ArrowLeft':
                this.breakoutGame.paddle.x = Math.max(0, this.breakoutGame.paddle.x - 20);
                break;
            case 'ArrowRight':
                this.breakoutGame.paddle.x = Math.min(700, this.breakoutGame.paddle.x + 20);
                break;
            case 'Escape':
                this.currentGame = null;
                break;
        }

        return null;
    }

    handleFlappyInput(event) {
        if (!this.flappyGame.gameStarted || this.flappyGame.gameOver) {
            if (event.key === 'Enter' || event.key === ' ') {
                this.resetGames();
                this.flappyGame.gameStarted = true;
                return null;
            }
            if (event.key === 'Escape') {
                this.currentGame = null;
                return null;
            }
            return null;
        }

        switch (event.key) {
            case ' ':
            case 'ArrowUp':
                this.flappyGame.bird.dy = GAME_CONFIG.FLAPPY.JUMP_FORCE; // 설정 상수 사용
                this.audioManager?.playUIClick();
                break;
            case 'Escape':
                this.currentGame = null;
                break;
        }

        return null;
    }

    update() {
        if (!this.isVisible) return;

        const now = Date.now();

        if (this.currentGame === 'snake' && this.snakeGame.gameStarted && !this.snakeGame.gameOver) {
            if (now - this.snakeGame.lastUpdate > this.snakeGame.speed) {
                this.updateSnake();
                this.snakeGame.lastUpdate = now;
            }
        } else if (this.currentGame === 'tetris' && this.tetrisGame.gameStarted && !this.tetrisGame.gameOver) {
            if (now - this.tetrisGame.lastUpdate > this.tetrisGame.dropSpeed) {
                this.updateTetris();
                this.tetrisGame.lastUpdate = now;
            }
        } else if (this.currentGame === 'breakout' && this.breakoutGame.gameStarted && !this.breakoutGame.gameOver && !this.breakoutGame.gameWon) {
            this.updateBreakout();
        } else if (this.currentGame === 'flappy' && this.flappyGame.gameStarted && !this.flappyGame.gameOver) {
            if (now - this.flappyGame.lastUpdate > 16) { // ~60 FPS
                this.updateFlappy();
                this.flappyGame.lastUpdate = now;
            }
        }
    }

    updateSnake() {
        const head = { ...this.snakeGame.snake[0] };
        head.x += this.snakeGame.direction.x;
        head.y += this.snakeGame.direction.y;

        // 벽 충돌 체크 - 설정 상수 사용
        if (head.x < 0 || head.x >= GAME_CONFIG.SNAKE.GRID_WIDTH || 
            head.y < 0 || head.y >= GAME_CONFIG.SNAKE.GRID_HEIGHT) {
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
                x: Math.floor(Math.random() * GAME_CONFIG.SNAKE.GRID_WIDTH),
                y: Math.floor(Math.random() * GAME_CONFIG.SNAKE.GRID_HEIGHT)
            };
        } while (this.snakeGame.snake.some(segment =>
            segment.x === this.snakeGame.food.x && segment.y === this.snakeGame.food.y
        ));
    }

    updateTetris() {
        if (this.canMoveTetris(0, 1)) {
            this.tetrisGame.position.y++;
        } else {
            // 피스가 바닥에 닿음
            this.placeTetrisPiece();
            this.clearTetrisLines();
            this.tetrisGame.currentPiece = this.tetrisGame.nextPiece;
            this.tetrisGame.nextPiece = this.getRandomPiece();
            this.tetrisGame.position = { x: 4, y: 0 };

            // 게임 오버 체크
            if (!this.canMoveTetris(0, 0)) {
                this.tetrisGame.gameOver = true;
            }
        }
    }

    updateBreakout() {
        const ball = this.breakoutGame.ball;
        const paddle = this.breakoutGame.paddle;

        // 공 이동
        ball.x += ball.dx;
        ball.y += ball.dy;

        // 벽 충돌
        if (ball.x <= ball.radius || ball.x >= 800 - ball.radius) {
            ball.dx = -ball.dx;
        }
        if (ball.y <= ball.radius) {
            ball.dy = -ball.dy;
        }

        // 패들 충돌
        if (ball.y >= paddle.y - ball.radius && 
            ball.x >= paddle.x && ball.x <= paddle.x + paddle.width) {
            ball.dy = -Math.abs(ball.dy);
            // 패들의 어느 부분에 맞았는지에 따라 각도 조정
            const hitPos = (ball.x - paddle.x) / paddle.width;
            ball.dx = (hitPos - 0.5) * 6;
        }

        // 바닥에 떨어지면 게임 오버 - 설정 상수 사용
        if (ball.y > GAME_CONFIG.UI.BOTTOM_BOUNDARY) {
            this.breakoutGame.gameOver = true;
        }

        // 벽돌 충돌
        for (let brick of this.breakoutGame.bricks) {
            if (!brick.destroyed && 
                ball.x + ball.radius > brick.x && 
                ball.x - ball.radius < brick.x + brick.width &&
                ball.y + ball.radius > brick.y && 
                ball.y - ball.radius < brick.y + brick.height) {
                
                brick.destroyed = true;
                ball.dy = -ball.dy;
                this.breakoutGame.score += GAME_CONFIG.BREAKOUT.POINTS_PER_BRICK;
                this.audioManager?.playItemCollect();
                break;
            }
        }

        // 모든 벽돌 파괴시 승리 - 중복 호출 방지
        if (this.breakoutGame.bricks.every(brick => brick.destroyed) && !this.breakoutGame.challengeCompleted) {
            this.breakoutGame.gameWon = true;
            this.breakoutGame.challengeCompleted = true;
            // 게임 완료 콜백 호출
            if (this.gameInstance?.onMinigameCompleted) {
                this.gameInstance.onMinigameCompleted('breakout_win', this.breakoutGame.score);
            }
        }
    }

    updateFlappy() {
        const bird = this.flappyGame.bird;

        // 중력 - 설정 상수 사용
        bird.dy += GAME_CONFIG.FLAPPY.GRAVITY;
        bird.y += bird.dy;

        // 파이프 이동
        for (let i = this.flappyGame.pipes.length - 1; i >= 0; i--) {
            const pipe = this.flappyGame.pipes[i];
            pipe.x -= GAME_CONFIG.FLAPPY.PIPE.speed;

            // 점수 체크
            if (!pipe.passed && pipe.x + this.flappyGame.pipeWidth < bird.x) {
                pipe.passed = true;
                this.flappyGame.score++;
                this.audioManager?.playUIClick();
                
                // 플래피 챌린지 체크 - 설정 상수 사용
                if (this.flappyGame.score >= GAME_CONFIG.FLAPPY.CHALLENGE_SCORE && 
                    !this.flappyGame.challengeCompleted && 
                    this.gameInstance) {
                    this.flappyGame.challengeCompleted = true;
                    this.gameInstance.onMinigameCompleted('flappy_score', this.flappyGame.score);
                }
            }

            // 충돌 체크
            if (bird.x + bird.radius > pipe.x && bird.x - bird.radius < pipe.x + this.flappyGame.pipeWidth) {
                if (bird.y - bird.radius < pipe.topHeight || bird.y + bird.radius > pipe.bottomY) {
                    this.flappyGame.gameOver = true;
                }
            }

            // 화면 밖으로 나간 파이프 제거
            if (pipe.x + this.flappyGame.pipeWidth < 0) {
                this.flappyGame.pipes.splice(i, 1);
            }
        }

        // 새 파이프 추가 - 설정 상수 사용
        if (this.flappyGame.pipes.length === 0 || 
            this.flappyGame.pipes[this.flappyGame.pipes.length - 1].x < GAME_CONFIG.FLAPPY.SPAWN_DISTANCE) {
            this.addFlappyPipe();
        }

        // 경계 체크 - 설정 상수 사용
        if (bird.y <= 0 || bird.y >= GAME_CONFIG.UI.GAME_AREA_HEIGHT) {
            this.flappyGame.gameOver = true;
        }
    }

    canMoveTetris(dx, dy) {
        const piece = this.tetrisGame.currentPiece;
        const newX = this.tetrisGame.position.x + dx;
        const newY = this.tetrisGame.position.y + dy;

        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                if (piece.shape[y][x] === 'X') {
                    const boardX = newX + x;
                    const boardY = newY + y;

                    if (boardX < 0 || boardX >= GAME_CONFIG.TETRIS.BOARD_WIDTH || 
                        boardY >= GAME_CONFIG.TETRIS.BOARD_HEIGHT) {
                        return false;
                    }
                    if (boardY >= 0 && this.tetrisGame.board[boardY][boardX]) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    rotateTetrisPiece() {
        const piece = this.tetrisGame.currentPiece;
        const nextRotation = (piece.currentRotation + 1) % piece.rotations.length;
        const oldShape = piece.shape;
        
        piece.shape = piece.rotations[nextRotation];
        piece.currentRotation = nextRotation;

        if (!this.canMoveTetris(0, 0)) {
            // 회전할 수 없으면 원래대로
            piece.shape = oldShape;
            piece.currentRotation = (nextRotation - 1 + piece.rotations.length) % piece.rotations.length;
        } else {
            this.audioManager?.playUIClick();
        }
    }

    placeTetrisPiece() {
        const piece = this.tetrisGame.currentPiece;
        const pos = this.tetrisGame.position;

        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                if (piece.shape[y][x] === 'X') {
                    const boardY = pos.y + y;
                    const boardX = pos.x + x;
                    if (boardY >= 0) {
                        this.tetrisGame.board[boardY][boardX] = piece.color;
                    }
                }
            }
        }
    }

    clearTetrisLines() {
        let linesCleared = 0;
        
        for (let y = this.tetrisGame.board.length - 1; y >= 0; y--) {
            if (this.tetrisGame.board[y].every(cell => cell !== 0)) {
                this.tetrisGame.board.splice(y, 1);
                this.tetrisGame.board.unshift(Array(GAME_CONFIG.TETRIS.BOARD_WIDTH).fill(0));
                linesCleared++;
                y++; // 같은 줄 다시 체크
            }
        }

        if (linesCleared > 0) {
            this.tetrisGame.lines += linesCleared;
            this.tetrisGame.score += linesCleared * GAME_CONFIG.TETRIS.POINTS_PER_LINE * this.tetrisGame.level;
            this.tetrisGame.level = Math.floor(this.tetrisGame.lines / GAME_CONFIG.TETRIS.LINES_PER_LEVEL) + 1;
            this.tetrisGame.dropSpeed = Math.max(
                GAME_CONFIG.TETRIS.MIN_SPEED, 
                GAME_CONFIG.TETRIS.INITIAL_SPEED - (this.tetrisGame.level - 1) * GAME_CONFIG.TETRIS.SPEED_INCREASE
            );
            this.audioManager?.playGameComplete();

            // 테트리스 챌린지 체크 - 설정 상수 사용
            if (this.tetrisGame.lines >= GAME_CONFIG.TETRIS.CHALLENGE_LINES && 
                !this.tetrisGame.challengeCompleted && 
                this.gameInstance) {
                this.tetrisGame.challengeCompleted = true;
                this.gameInstance.onMinigameCompleted('tetris_lines', this.tetrisGame.score, this.tetrisGame.lines);
            }
        }
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
        } else if (this.currentGame === 'tetris') {
            this.drawTetrisGame();
        } else if (this.currentGame === 'breakout') {
            this.drawBreakoutGame();
        } else if (this.currentGame === 'flappy') {
            this.drawFlappyGame();
        }
    }

    drawGameMenu() {
        // 제목
        this.ctx.fillStyle = '#00ffff';
        this.ctx.font = 'bold 36px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('🎮 휴넷 아케이드 🎮', this.canvas.width / 2, 150);

        // 현재 필요한 챌린지 확인
        let requiredChallenge = null;
        if (this.gameInstance) {
            const allQuests = this.gameInstance.questSystem.questManager.quests;
            for (let quest of allQuests) {
                if (quest.minigameChallenge && 
                    quest.minigameChallenge.required && 
                    quest.started && 
                    !quest.minigameChallenge.completed) {
                    requiredChallenge = quest.minigameChallenge;
                    break;
                }
            }
        }

        // 챌린지 안내 메시지
        if (requiredChallenge) {
            this.ctx.fillStyle = '#FFD700';
            this.ctx.font = 'bold 18px monospace';
            this.ctx.fillText('🏆 현재 필요한 챌린지:', this.canvas.width / 2, 190);
            this.ctx.font = '16px monospace';
            this.ctx.fillText(requiredChallenge.description, this.canvas.width / 2, 215);
        }

        // 게임 목록
        this.ctx.font = 'bold 24px monospace';
        const startY = requiredChallenge ? 270 : 250;
        const spacing = 60;

        for (let i = 0; i < this.games.length; i++) {
            const y = startY + i * spacing;
            const isSelected = i === this.gameMenuIndex;
            const game = this.games[i];

            // 현재 필요한 챌린지 게임 강조
            let isRequiredGame = false;
            if (requiredChallenge && game.id !== 'exit') {
                const challengeGameMap = {
                    'memory_match': 'memory',
                    'tetris_lines': 'tetris',
                    'breakout_win': 'breakout',
                    'snake_score': 'snake',
                    'flappy_score': 'flappy'
                };
                isRequiredGame = challengeGameMap[requiredChallenge.type] === game.id;
            }

            if (isSelected) {
                // 선택된 게임 하이라이트
                this.ctx.fillStyle = isRequiredGame ? 'rgba(255, 215, 0, 0.3)' : 'rgba(0, 255, 255, 0.2)';
                this.ctx.fillRect(this.canvas.width / 2 - 200, y - 30, 400, 50);

                this.ctx.strokeStyle = isRequiredGame ? '#FFD700' : '#00ffff';
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(this.canvas.width / 2 - 200, y - 30, 400, 50);

                this.ctx.fillStyle = '#ffffff';
                this.ctx.fillText('▶', this.canvas.width / 2 - 250, y);
            } else if (isRequiredGame) {
                // 필요한 챌린지 게임 강조
                this.ctx.fillStyle = 'rgba(255, 215, 0, 0.1)';
                this.ctx.fillRect(this.canvas.width / 2 - 200, y - 30, 400, 50);
                this.ctx.strokeStyle = '#FFD700';
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(this.canvas.width / 2 - 200, y - 30, 400, 50);
            }

            // 게임 이름
            if (isSelected) {
                this.ctx.fillStyle = '#ffffff';
            } else if (isRequiredGame) {
                this.ctx.fillStyle = '#FFD700';
            } else {
                this.ctx.fillStyle = '#aaaaaa';
            }

            let gameText = `${game.icon} ${game.name}`;
            if (isRequiredGame) {
                gameText += ' ⭐'; // 필요한 게임 표시
            }

            this.ctx.fillText(gameText, this.canvas.width / 2, y);
        }

        // 조작 안내
        this.ctx.fillStyle = 'rgba(0, 255, 100, 0.8)';
        this.ctx.font = '16px monospace';
        this.ctx.fillText('[↑↓] 선택  [ENTER] 확인  [ESC] 나가기', this.canvas.width / 2, this.canvas.height - 50);

        // 추가 도움말
        if (requiredChallenge) {
            this.ctx.fillStyle = 'rgba(255, 215, 0, 0.8)';
            this.ctx.font = '14px monospace';
            this.ctx.fillText('⭐ 표시된 게임을 완료하면 퀘스트를 진행할 수 있습니다!', this.canvas.width / 2, this.canvas.height - 80);
        }
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

    drawTetrisGame() {
        // 제목
        this.ctx.fillStyle = '#9B59B6';
        this.ctx.font = 'bold 28px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('🧩 휴넷 테트리스', this.canvas.width / 2, 80);

        // 점수 정보
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '18px monospace';
        this.ctx.fillText(`점수: ${this.tetrisGame.score}  레벨: ${this.tetrisGame.level}  라인: ${this.tetrisGame.lines}`, this.canvas.width / 2, 120);

        // 게임 보드 영역
        const boardArea = { x: 250, y: 150, width: 300, height: 400 };
        
        // 보드 배경
        this.ctx.fillStyle = '#2C3E50';
        this.ctx.fillRect(boardArea.x, boardArea.y, boardArea.width, boardArea.height);
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(boardArea.x, boardArea.y, boardArea.width, boardArea.height);

        if (this.tetrisGame.gameStarted && !this.tetrisGame.gameOver) {
            // 보드 그리기
            const cellSize = 30;
            for (let y = 0; y < this.tetrisGame.board.length; y++) {
                for (let x = 0; x < this.tetrisGame.board[y].length; x++) {
                    if (this.tetrisGame.board[y][x]) {
                        this.ctx.fillStyle = this.tetrisGame.board[y][x];
                        this.ctx.fillRect(
                            boardArea.x + x * cellSize,
                            boardArea.y + y * cellSize,
                            cellSize - 1,
                            cellSize - 1
                        );
                    }
                }
            }

            // 현재 피스 그리기
            const piece = this.tetrisGame.currentPiece;
            const pos = this.tetrisGame.position;
            this.ctx.fillStyle = piece.color;
            
            for (let y = 0; y < piece.shape.length; y++) {
                for (let x = 0; x < piece.shape[y].length; x++) {
                    if (piece.shape[y][x] === 'X') {
                        const drawX = boardArea.x + (pos.x + x) * cellSize;
                        const drawY = boardArea.y + (pos.y + y) * cellSize;
                        if (drawY >= boardArea.y) {
                            this.ctx.fillRect(drawX, drawY, cellSize - 1, cellSize - 1);
                        }
                    }
                }
            }

            // 다음 피스 표시
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '16px monospace';
            this.ctx.fillText('다음 피스:', 600, 180);
            
            const nextPiece = this.tetrisGame.nextPiece;
            this.ctx.fillStyle = nextPiece.color;
            for (let y = 0; y < nextPiece.shape.length; y++) {
                for (let x = 0; x < nextPiece.shape[y].length; x++) {
                    if (nextPiece.shape[y][x] === 'X') {
                        this.ctx.fillRect(600 + x * 20, 200 + y * 20, 18, 18);
                    }
                }
            }

        } else if (this.tetrisGame.gameOver) {
            // 게임 오버
            this.ctx.fillStyle = '#E74C3C';
            this.ctx.font = 'bold 36px monospace';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('게임 오버!', this.canvas.width / 2, this.canvas.height / 2 - 50);

            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '20px monospace';
            this.ctx.fillText(`최종 점수: ${this.tetrisGame.score}`, this.canvas.width / 2, this.canvas.height / 2);
            this.ctx.fillText('[ENTER] 다시 시작  [ESC] 메뉴로', this.canvas.width / 2, this.canvas.height / 2 + 50);
        } else {
            // 시작 메시지
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = 'bold 24px monospace';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('휴넷 테트리스', this.canvas.width / 2, this.canvas.height / 2 - 30);
            this.ctx.fillText('[ENTER] 게임 시작', this.canvas.width / 2, this.canvas.height / 2 + 10);
        }

        // 조작 안내
        this.ctx.fillStyle = 'rgba(0, 255, 100, 0.8)';
        this.ctx.font = '14px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('[←→] 이동  [↓] 빠른 낙하  [↑/SPACE] 회전  [ESC] 메뉴로', this.canvas.width / 2, this.canvas.height - 30);
    }

    drawBreakoutGame() {
        // 제목
        this.ctx.fillStyle = '#E67E22';
        this.ctx.font = 'bold 28px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('🏓 휴넷 브레이크아웃', this.canvas.width / 2, 80);

        // 점수
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '18px monospace';
        this.ctx.fillText(`점수: ${this.breakoutGame.score}`, this.canvas.width / 2, 120);

        if (this.breakoutGame.gameStarted && !this.breakoutGame.gameOver && !this.breakoutGame.gameWon) {
            // 벽돌들 그리기
            for (let brick of this.breakoutGame.bricks) {
                if (!brick.destroyed) {
                    this.ctx.fillStyle = brick.color;
                    this.ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
                    this.ctx.strokeStyle = '#ffffff';
                    this.ctx.lineWidth = 1;
                    this.ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
                }
            }

            // 패들 그리기
            this.ctx.fillStyle = '#3498DB';
            this.ctx.fillRect(this.breakoutGame.paddle.x, this.breakoutGame.paddle.y, 
                            this.breakoutGame.paddle.width, this.breakoutGame.paddle.height);

            // 공 그리기
            this.ctx.fillStyle = '#E74C3C';
            this.ctx.beginPath();
            this.ctx.arc(this.breakoutGame.ball.x, this.breakoutGame.ball.y, this.breakoutGame.ball.radius, 0, Math.PI * 2);
            this.ctx.fill();

        } else if (this.breakoutGame.gameWon) {
            // 승리 메시지
            this.ctx.fillStyle = '#27AE60';
            this.ctx.font = 'bold 36px monospace';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('🎉 승리! 🎉', this.canvas.width / 2, this.canvas.height / 2 - 50);

            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '20px monospace';
            this.ctx.fillText(`최종 점수: ${this.breakoutGame.score}`, this.canvas.width / 2, this.canvas.height / 2);
            this.ctx.fillText('[ENTER] 다시 시작  [ESC] 메뉴로', this.canvas.width / 2, this.canvas.height / 2 + 50);

        } else if (this.breakoutGame.gameOver) {
            // 게임 오버
            this.ctx.fillStyle = '#E74C3C';
            this.ctx.font = 'bold 36px monospace';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('게임 오버!', this.canvas.width / 2, this.canvas.height / 2 - 50);

            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '20px monospace';
            this.ctx.fillText(`최종 점수: ${this.breakoutGame.score}`, this.canvas.width / 2, this.canvas.height / 2);
            this.ctx.fillText('[ENTER] 다시 시작  [ESC] 메뉴로', this.canvas.width / 2, this.canvas.height / 2 + 50);

        } else {
            // 시작 메시지
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = 'bold 24px monospace';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('휴넷 브레이크아웃', this.canvas.width / 2, this.canvas.height / 2 - 30);
            this.ctx.fillText('[ENTER] 게임 시작', this.canvas.width / 2, this.canvas.height / 2 + 10);
        }

        // 조작 안내
        this.ctx.fillStyle = 'rgba(0, 255, 100, 0.8)';
        this.ctx.font = '14px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('[←→] 패들 이동  [ESC] 메뉴로', this.canvas.width / 2, this.canvas.height - 30);
    }

    drawFlappyGame() {
        // 제목
        this.ctx.fillStyle = '#F39C12';
        this.ctx.font = 'bold 28px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('🐦 휴넷 플래피', this.canvas.width / 2, 80);

        // 점수
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '18px monospace';
        this.ctx.fillText(`점수: ${this.flappyGame.score}`, this.canvas.width / 2, 120);

        if (this.flappyGame.gameStarted && !this.flappyGame.gameOver) {
            // 파이프들 그리기
            this.ctx.fillStyle = '#27AE60';
            for (let pipe of this.flappyGame.pipes) {
                // 위쪽 파이프
                this.ctx.fillRect(pipe.x, 150, this.flappyGame.pipeWidth, pipe.topHeight - 150);
                // 아래쪽 파이프
                this.ctx.fillRect(pipe.x, pipe.bottomY, this.flappyGame.pipeWidth, 500 - pipe.bottomY);
                
                // 파이프 테두리
                this.ctx.strokeStyle = '#229954';
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(pipe.x, 150, this.flappyGame.pipeWidth, pipe.topHeight - 150);
                this.ctx.strokeRect(pipe.x, pipe.bottomY, this.flappyGame.pipeWidth, 500 - pipe.bottomY);
            }

            // 새 그리기
            this.ctx.fillStyle = '#F1C40F';
            this.ctx.beginPath();
            this.ctx.arc(this.flappyGame.bird.x, this.flappyGame.bird.y, this.flappyGame.bird.radius, 0, Math.PI * 2);
            this.ctx.fill();
            
            // 새 눈 그리기
            this.ctx.fillStyle = '#000000';
            this.ctx.beginPath();
            this.ctx.arc(this.flappyGame.bird.x + 5, this.flappyGame.bird.y - 3, 3, 0, Math.PI * 2);
            this.ctx.fill();

        } else if (this.flappyGame.gameOver) {
            // 게임 오버
            this.ctx.fillStyle = '#E74C3C';
            this.ctx.font = 'bold 36px monospace';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('게임 오버!', this.canvas.width / 2, this.canvas.height / 2 - 50);

            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '20px monospace';
            this.ctx.fillText(`최종 점수: ${this.flappyGame.score}`, this.canvas.width / 2, this.canvas.height / 2);
            this.ctx.fillText('[ENTER] 다시 시작  [ESC] 메뉴로', this.canvas.width / 2, this.canvas.height / 2 + 50);

        } else {
            // 시작 메시지
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = 'bold 24px monospace';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('휴넷 플래피', this.canvas.width / 2, this.canvas.height / 2 - 30);
            this.ctx.fillText('[SPACE] 게임 시작', this.canvas.width / 2, this.canvas.height / 2 + 10);
        }

        // 조작 안내
        this.ctx.fillStyle = 'rgba(0, 255, 100, 0.8)';
        this.ctx.font = '14px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('[SPACE/↑] 점프  [ESC] 메뉴로', this.canvas.width / 2, this.canvas.height - 30);
    }
}