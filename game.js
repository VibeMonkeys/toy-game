class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.tileSize = 32;
        this.mapWidth = 25;
        this.mapHeight = 18;

        this.player = {
            x: 5,
            y: 5,
            direction: 'down',
            animFrame: 0,
            animTimer: 0,
            isMoving: false
        };

        this.npcs = [
            { x: 10, y: 8, type: 'employee', name: '김대리', dialog: ['안녕하세요! 26주년을 축하합니다!', '첫 번째 단서는 회의실에 있어요.'] },
            { x: 15, y: 12, type: 'manager', name: '박과장', dialog: ['여기는 회의실입니다.', '다음 단서는 카페테리아에서 찾아보세요!'] },
            { x: 3, y: 15, type: 'director', name: '이부장', dialog: ['카페테리아에 오신 걸 환영합니다!', '마지막 보물은 CEO실에 숨겨져 있답니다.'] },
            { x: 20, y: 3, type: 'ceo', name: 'CEO', dialog: ['축하합니다! 보물을 찾으셨네요!', '26주년 기념품을 받아가세요!'] }
        ];

        this.walls = [
            {x: 8, y: 8}, {x: 9, y: 8}, {x: 11, y: 8}, {x: 12, y: 8},
            {x: 8, y: 9}, {x: 12, y: 9},
            {x: 8, y: 10}, {x: 12, y: 10},
            {x: 8, y: 11}, {x: 9, y: 11}, {x: 11, y: 11}, {x: 12, y: 11}
        ];

        this.currentDialog = null;
        this.dialogIndex = 0;

        this.setupEventListeners();
        this.gameLoop();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (this.currentDialog) {
                if (e.code === 'Space' || e.code === 'Enter') {
                    this.nextDialog();
                }
                return;
            }

            let newX = this.player.x;
            let newY = this.player.y;

            switch(e.code) {
                case 'ArrowUp':
                    newY--;
                    this.player.direction = 'up';
                    break;
                case 'ArrowDown':
                    newY++;
                    this.player.direction = 'down';
                    break;
                case 'ArrowLeft':
                    newX--;
                    this.player.direction = 'left';
                    break;
                case 'ArrowRight':
                    newX++;
                    this.player.direction = 'right';
                    break;
                case 'Space':
                    this.interactWithNPC();
                    return;
            }

            if (this.canMoveTo(newX, newY)) {
                this.player.x = newX;
                this.player.y = newY;
                this.player.isMoving = true;
                this.player.animTimer = Date.now();
                this.checkNPCInteraction();
            }
        });

        document.getElementById('dialogNext').addEventListener('click', () => {
            this.nextDialog();
        });
    }

    canMoveTo(x, y) {
        if (x < 0 || x >= this.mapWidth || y < 0 || y >= this.mapHeight) {
            return false;
        }

        return !this.walls.some(wall => wall.x === x && wall.y === y);
    }

    checkNPCInteraction() {
        const nearbyNPC = this.npcs.find(npc =>
            Math.abs(npc.x - this.player.x) <= 1 &&
            Math.abs(npc.y - this.player.y) <= 1
        );

        if (nearbyNPC && !this.currentDialog) {
            this.startDialog(nearbyNPC);
        }
    }

    interactWithNPC() {
        this.checkNPCInteraction();
    }

    startDialog(npc) {
        this.currentDialog = npc.dialog;
        this.dialogIndex = 0;
        this.showDialog(npc.name + ': ' + this.currentDialog[this.dialogIndex]);
    }

    nextDialog() {
        this.dialogIndex++;
        if (this.dialogIndex < this.currentDialog.length) {
            this.showDialog(this.currentDialog[this.dialogIndex]);
        } else {
            this.hideDialog();
        }
    }

    showDialog(text) {
        const dialogBox = document.getElementById('dialogBox');
        const dialogText = document.getElementById('dialogText');
        dialogText.textContent = text;
        dialogBox.classList.remove('hidden');
    }

    hideDialog() {
        const dialogBox = document.getElementById('dialogBox');
        dialogBox.classList.add('hidden');
        this.currentDialog = null;
        this.dialogIndex = 0;
    }

    drawPixelCharacter(x, y, direction, isPlayer = false) {
        const centerX = x * this.tileSize + this.tileSize / 2;
        const centerY = y * this.tileSize + this.tileSize / 2;

        this.ctx.save();
        this.ctx.translate(centerX, centerY);

        if (isPlayer) {
            this.ctx.fillStyle = '#4A90E2';
        } else {
            this.ctx.fillStyle = '#8E44AD';
        }

        this.ctx.fillRect(-6, -8, 12, 8);

        this.ctx.fillStyle = '#F4D1AE';
        this.ctx.fillRect(-4, -12, 8, 6);

        this.ctx.fillStyle = '#2C3E50';
        this.ctx.fillRect(-3, -11, 2, 2);
        this.ctx.fillRect(1, -11, 2, 2);

        this.ctx.fillStyle = '#34495E';
        this.ctx.fillRect(-2, -7, 4, 1);

        this.ctx.fillStyle = isPlayer ? '#3498DB' : '#9B59B6';
        this.ctx.fillRect(-5, 0, 10, 8);

        this.ctx.fillStyle = '#2C3E50';
        this.ctx.fillRect(-3, 8, 2, 6);
        this.ctx.fillRect(1, 8, 2, 6);

        this.ctx.fillStyle = '#34495E';
        this.ctx.fillRect(-4, 13, 3, 2);
        this.ctx.fillRect(1, 13, 3, 2);

        if (direction === 'left') {
            this.ctx.fillStyle = '#F4D1AE';
            this.ctx.fillRect(-7, -4, 3, 6);
        } else if (direction === 'right') {
            this.ctx.fillStyle = '#F4D1AE';
            this.ctx.fillRect(4, -4, 3, 6);
        } else {
            this.ctx.fillStyle = '#F4D1AE';
            this.ctx.fillRect(-7, -4, 3, 6);
            this.ctx.fillRect(4, -4, 3, 6);
        }

        this.ctx.restore();
    }

    drawNPC(npc) {
        this.drawPixelCharacter(npc.x, npc.y, 'down', false);

        this.ctx.fillStyle = 'white';
        this.ctx.font = '10px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 2;
        this.ctx.strokeText(
            npc.name,
            npc.x * this.tileSize + this.tileSize/2,
            npc.y * this.tileSize - 10
        );
        this.ctx.fillText(
            npc.name,
            npc.x * this.tileSize + this.tileSize/2,
            npc.y * this.tileSize - 10
        );
    }

    drawTileMap() {
        for (let y = 0; y < this.mapHeight; y++) {
            for (let x = 0; x < this.mapWidth; x++) {
                const tileX = x * this.tileSize;
                const tileY = y * this.tileSize;

                this.ctx.fillStyle = '#2ECC71';
                this.ctx.fillRect(tileX, tileY, this.tileSize, this.tileSize);

                if ((x + y) % 2 === 0) {
                    this.ctx.fillStyle = '#27AE60';
                    this.ctx.fillRect(tileX, tileY, this.tileSize, this.tileSize);
                }

                this.ctx.strokeStyle = 'rgba(0,0,0,0.1)';
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(tileX, tileY, this.tileSize, this.tileSize);
            }
        }
    }

    drawWalls() {
        this.walls.forEach(wall => {
            const x = wall.x * this.tileSize;
            const y = wall.y * this.tileSize;

            this.ctx.fillStyle = '#8B4513';
            this.ctx.fillRect(x, y, this.tileSize, this.tileSize);

            this.ctx.fillStyle = '#A0522D';
            this.ctx.fillRect(x + 2, y + 2, this.tileSize - 4, this.tileSize - 4);

            this.ctx.strokeStyle = '#654321';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(x, y, this.tileSize, this.tileSize);
        });
    }

    updateAnimation() {
        if (this.player.isMoving) {
            const now = Date.now();
            if (now - this.player.animTimer > 200) {
                this.player.isMoving = false;
            }
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawTileMap();
        this.drawWalls();

        this.npcs.forEach(npc => {
            this.drawNPC(npc);
        });

        this.drawPixelCharacter(this.player.x, this.player.y, this.player.direction, true);

        this.ctx.fillStyle = 'white';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 2;
        this.ctx.strokeText(
            '나',
            this.player.x * this.tileSize + this.tileSize/2,
            this.player.y * this.tileSize - 10
        );
        this.ctx.fillText(
            '나',
            this.player.x * this.tileSize + this.tileSize/2,
            this.player.y * this.tileSize - 10
        );
    }

    gameLoop() {
        this.updateAnimation();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

window.addEventListener('load', () => {
    new Game();
});