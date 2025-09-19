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
            color: '#3498db'
        };

        this.npcs = [
            { x: 10, y: 8, color: '#e74c3c', name: '김대리', dialog: ['안녕하세요! 26주년을 축하합니다!', '첫 번째 단서는 회의실에 있어요.'] },
            { x: 15, y: 12, color: '#9b59b6', name: '박과장', dialog: ['여기는 회의실입니다.', '다음 단서는 카페테리아에서 찾아보세요!'] },
            { x: 3, y: 15, color: '#f39c12', name: '이부장', dialog: ['카페테리아에 오신 걸 환영합니다!', '마지막 보물은 CEO실에 숨겨져 있답니다.'] },
            { x: 20, y: 3, color: '#1abc9c', name: 'CEO', dialog: ['축하합니다! 보물을 찾으셨네요!', '26주년 기념품을 받아가세요!'] }
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
                    break;
                case 'ArrowDown':
                    newY++;
                    break;
                case 'ArrowLeft':
                    newX--;
                    break;
                case 'ArrowRight':
                    newX++;
                    break;
                case 'Space':
                    this.interactWithNPC();
                    return;
            }

            if (this.canMoveTo(newX, newY)) {
                this.player.x = newX;
                this.player.y = newY;
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

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = '#27ae60';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = '#2c3e50';
        this.walls.forEach(wall => {
            this.ctx.fillRect(
                wall.x * this.tileSize,
                wall.y * this.tileSize,
                this.tileSize,
                this.tileSize
            );
        });

        this.npcs.forEach(npc => {
            this.ctx.fillStyle = npc.color;
            this.ctx.fillRect(
                npc.x * this.tileSize + 4,
                npc.y * this.tileSize + 4,
                this.tileSize - 8,
                this.tileSize - 8
            );

            this.ctx.fillStyle = 'white';
            this.ctx.font = '10px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(
                npc.name,
                npc.x * this.tileSize + this.tileSize/2,
                npc.y * this.tileSize - 5
            );
        });

        this.ctx.fillStyle = this.player.color;
        this.ctx.fillRect(
            this.player.x * this.tileSize + 6,
            this.player.y * this.tileSize + 6,
            this.tileSize - 12,
            this.tileSize - 12
        );

        this.ctx.fillStyle = 'white';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(
            '나',
            this.player.x * this.tileSize + this.tileSize/2,
            this.player.y * this.tileSize - 5
        );
    }

    gameLoop() {
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

window.addEventListener('load', () => {
    new Game();
});