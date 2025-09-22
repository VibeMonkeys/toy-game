import { InteractableObject } from './InteractableObject.js';

// 자판기 클래스 - 음료/간식 구매 시스템
export class VendingMachine extends InteractableObject {
    constructor(x, y, machineType = 'drink') {
        const name = machineType === 'drink' ? '음료 자판기' : '간식 자판기';
        super(x, y, 'vending_machine', name);

        this.machineType = machineType;
        this.cooldown = 3000; // 3초 쿨다운
        this.isOperating = false;

        // 상품 목록
        this.products = this.getProductList();
        this.selectedProduct = 0;
        this.showUI = false;
    }

    getProductList() {
        if (this.machineType === 'drink') {
            return [
                { name: '콜라', price: 1000, emoji: '🥤', description: '시원한 콜라' },
                { name: '커피', price: 1500, emoji: '☕', description: '진한 아메리카노' },
                { name: '물', price: 500, emoji: '💧', description: '생수' },
                { name: '이온음료', price: 1200, emoji: '🥤', description: '갈증 해소' },
                { name: '과일주스', price: 2000, emoji: '🧃', description: '신선한 과일' }
            ];
        } else {
            return [
                { name: '초콜릿', price: 800, emoji: '🍫', description: '달콤한 초콜릿' },
                { name: '과자', price: 1000, emoji: '🍪', description: '바삭한 과자' },
                { name: '사탕', price: 500, emoji: '🍬', description: '알록달록 사탕' },
                { name: '껌', price: 600, emoji: '🍡', description: '민트향 껌' },
                { name: '아이스크림', price: 1500, emoji: '🍦', description: '차가운 아이스크림' }
            ];
        }
    }

    performInteraction(gameState, audioManager) {
        // 동전이 필요한지 확인
        const playerCoins = this.getPlayerCoins(gameState);

        if (playerCoins <= 0) {
            return {
                success: false,
                message: '동전이 필요합니다! (퀘스트나 상호작용으로 확보하세요)',
                showDialog: true
            };
        }

        // 자판기 UI 표시
        this.showUI = true;

        if (audioManager) {
            audioManager.playUIClick();
        }

        return {
            success: true,
            message: `${this.name}에 오신 것을 환영합니다!`,
            showVendingUI: true,
            vendingMachine: this
        };
    }

    // 플레이어가 가진 동전 개수 확인 (GameState API 우선)
    getPlayerCoins(gameState) {
        if (gameState) {
            if (typeof gameState.getCoins === 'function') {
                return gameState.getCoins();
            }

            if (typeof gameState.coins === 'number') {
                return gameState.coins;
            }
        }

        if (!gameState || !gameState.inventory) return 0;
        const coinItem = gameState.inventory.find(item =>
            item.name === '동전' || item.name === 'coin' || (typeof item.name === 'string' && item.name.includes('동전'))
        );
        return coinItem ? (coinItem.quantity || 0) : 0;
    }

    // 상품 구매 처리
    purchaseProduct(productIndex, gameState, audioManager) {
        if (productIndex < 0 || productIndex >= this.products.length) {
            return { success: false, message: '잘못된 상품 선택입니다.' };
        }

        const product = this.products[productIndex];
        const playerCoins = this.getPlayerCoins(gameState);

        if (playerCoins < product.price) {
            return {
                success: false,
                message: `동전이 부족합니다. (필요: ${product.price}원, 보유: ${playerCoins}원)`
            };
        }

        // 동전 차감
        const spent = this.deductCoins(gameState, product.price);
        if (!spent) {
            return {
                success: false,
                message: '동전 차감에 실패했습니다. 다시 시도해주세요.'
            };
        }

        // 상품 지급
        const purchasedItem = {
            name: product.name,
            emoji: product.emoji,
            description: product.description,
            type: this.machineType === 'drink' ? 'consumable' : 'snack',
            value: product.price,
            restoreHealth: this.machineType === 'drink' ? 10 : 5 // 체력 회복 (향후 구현)
        };

        gameState.addItem(purchasedItem);

        if (audioManager) {
            audioManager.playItemCollect();
            setTimeout(() => audioManager.playUIClick(), 800); // 자판기 소리
        }

        this.isOperating = true;
        setTimeout(() => {
            this.isOperating = false;
        }, 2000);

        const remainingCoins = this.getPlayerCoins(gameState);

        return {
            success: true,
            message: `${product.emoji} ${product.name}을(를) 구매했습니다! (잔액: ${remainingCoins}원)`,
            item: purchasedItem
        };
    }

    // 동전 차감 (GameState API 우선 사용)
    deductCoins(gameState, amount) {
        if (gameState && typeof gameState.spendCoins === 'function') {
            return gameState.spendCoins(amount);
        }

        if (!gameState || !gameState.inventory) return false;

        const coinIndex = gameState.inventory.findIndex(item =>
            item.name === '동전' || item.name === 'coin' || (typeof item.name === 'string' && item.name.includes('동전'))
        );

        if (coinIndex === -1) {
            return false;
        }

        const coinItem = gameState.inventory[coinIndex];
        const currentAmount = coinItem.quantity || 0;

        if (currentAmount < amount) {
            return false;
        }

        if (currentAmount === amount) {
            gameState.inventory.splice(coinIndex, 1);
        } else {
            coinItem.quantity = currentAmount - amount;
        }

        return true;
    }

    // 상품 선택 변경
    selectProduct(direction) {
        if (direction === 'up') {
            this.selectedProduct = Math.max(0, this.selectedProduct - 1);
        } else if (direction === 'down') {
            this.selectedProduct = Math.min(this.products.length - 1, this.selectedProduct + 1);
        }
    }

    // UI 닫기
    closeUI() {
        this.showUI = false;
        this.selectedProduct = 0;
        this.endInteraction();
    }

    // 자판기 상태 업데이트
    update(deltaTime) {
        // 운영 상태 업데이트
        if (this.isOperating) {
            // 운영 중 애니메이션 효과 등 구현 가능
        }
    }

    // 힌트 텍스트
    getHintText() {
        if (this.isOperating) {
            return `${this.name} (상품 준비 중...)`;
        }
        if (!this.canInteract()) {
            return `${this.name} (잠시 후 이용 가능)`;
        }
        return `${this.name} (스페이스바로 이용)`;
    }

    // 현재 선택된 상품 정보
    getSelectedProduct() {
        return this.products[this.selectedProduct];
    }

    // 자판기 UI 렌더링 정보
    getUIData() {
        return {
            show: this.showUI,
            products: this.products,
            selectedIndex: this.selectedProduct,
            machineType: this.machineType,
            name: this.name,
            isOperating: this.isOperating
        };
    }
}
