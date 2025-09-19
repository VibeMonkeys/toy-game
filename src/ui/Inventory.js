export class Inventory {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.width = 300;
        this.height = 150;
        this.x = this.canvas.width - this.width - 20;
        this.y = this.canvas.height - this.height - 20;
        this.itemNotification = null;
        this.notificationTimer = 0;
    }

    draw(gameState) {
        // 인벤토리 배경
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(this.x, this.y, this.width, this.height);

        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(this.x, this.y, this.width, this.height);

        // 제목
        this.ctx.fillStyle = '#ffff00';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('인벤토리', this.x + 10, this.y + 25);

        // 아이템 카운트
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '14px Arial';
        this.ctx.fillText(`아이템: ${gameState.itemsCollected}/${gameState.totalItems}`, this.x + 10, this.y + 50);

        // 아이템 목록
        if (gameState.inventory.length > 0) {
            let itemY = this.y + 75;
            for (let i = 0; i < gameState.inventory.length; i++) {
                const item = gameState.inventory[i];

                // 아이템 아이콘 (간단한 사각형)
                this.ctx.fillStyle = this.getItemColor(item.type);
                this.ctx.fillRect(this.x + 10, itemY - 12, 15, 15);

                // 아이템 이름
                this.ctx.fillStyle = '#ffffff';
                this.ctx.font = '12px Arial';
                this.ctx.fillText(item.name, this.x + 30, itemY);

                itemY += 20;

                // 4개까지만 표시
                if (i >= 3) {
                    if (gameState.inventory.length > 4) {
                        this.ctx.fillStyle = '#cccccc';
                        this.ctx.fillText(`... +${gameState.inventory.length - 4}개 더`, this.x + 10, itemY);
                    }
                    break;
                }
            }
        } else {
            this.ctx.fillStyle = '#888888';
            this.ctx.font = '12px Arial';
            this.ctx.fillText('아이템이 없습니다', this.x + 10, this.y + 75);
        }

        // 아이템 획득 알림 그리기
        this.drawItemNotification();
    }

    drawItemNotification() {
        if (!this.itemNotification || this.notificationTimer <= 0) return;

        const alpha = Math.min(1, this.notificationTimer / 60);
        const notifY = this.y - 60;

        // 알림 배경
        this.ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.8})`;
        this.ctx.fillRect(this.x, notifY, this.width, 40);

        this.ctx.strokeStyle = `rgba(255, 255, 0, ${alpha})`;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(this.x, notifY, this.width, 40);

        // 알림 텍스트
        this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        this.ctx.font = 'bold 14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('아이템 획득!', this.x + this.width/2, notifY + 15);

        this.ctx.font = '12px Arial';
        this.ctx.fillText(this.itemNotification.name, this.x + this.width/2, notifY + 32);

        this.notificationTimer--;
    }

    showItemNotification(item) {
        this.itemNotification = item;
        this.notificationTimer = 180; // 3초간 표시 (60fps 기준)
    }

    getItemColor(itemType) {
        const colors = {
            'treasure': '#ffd700',  // 금색
            'key': '#silver',       // 은색
            'document': '#87ceeb',  // 하늘색
            'badge': '#ff6347',     // 토마토색
            'default': '#ffffff'    // 흰색
        };
        return colors[itemType] || colors.default;
    }

};