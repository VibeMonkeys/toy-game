import { CONSTANTS } from '../utils/Constants.js';
import { Logger } from '../utils/Logger.js';

/**
 * 1999 레트로 테마용 스프라이트 매니저
 * 90년대 오피스 워커와 오브젝트 스프라이트를 관리합니다
 */
export class RetroSpriteManager {
    constructor() {
        this.sprites = new Map();
        this.loaded = false;
        this.loadPromises = [];

        // 90년대 오피스 스프라이트 정의
        this.spriteDefinitions = {
            // 오피스 워커 스프라이트 (16x16, 4프레임 애니메이션)
            'office_worker_brown_purple': {
                src: 'assets/sprites/retro-office/WorkerSheetBrownPurple.png',
                frameWidth: 16,
                frameHeight: 16,
                animations: {
                    walk_down: { row: 0, frames: 4 },
                    walk_left: { row: 1, frames: 4 },
                    walk_right: { row: 2, frames: 4 },
                    walk_up: { row: 3, frames: 4 },
                    typing: { row: 4, frames: 4 },
                    idle: { row: 0, frames: 1 }
                }
            },
            'office_worker_brown_white': {
                src: 'assets/sprites/retro-office/WorkerSheetBrownWhite.png',
                frameWidth: 16,
                frameHeight: 16,
                animations: {
                    walk_down: { row: 0, frames: 4 },
                    walk_left: { row: 1, frames: 4 },
                    walk_right: { row: 2, frames: 4 },
                    walk_up: { row: 3, frames: 4 },
                    typing: { row: 4, frames: 4 },
                    idle: { row: 0, frames: 1 }
                }
            },
            'office_worker_yellow_purple': {
                src: 'assets/sprites/retro-office/WorkerSheetYellowPurple.png',
                frameWidth: 16,
                frameHeight: 16,
                animations: {
                    walk_down: { row: 0, frames: 4 },
                    walk_left: { row: 1, frames: 4 },
                    walk_right: { row: 2, frames: 4 },
                    walk_up: { row: 3, frames: 4 },
                    typing: { row: 4, frames: 4 },
                    idle: { row: 0, frames: 1 }
                }
            },
            'office_worker_yellow_white': {
                src: 'assets/sprites/retro-office/WorkerSheetYellowWhite.png',
                frameWidth: 16,
                frameHeight: 16,
                animations: {
                    walk_down: { row: 0, frames: 4 },
                    walk_left: { row: 1, frames: 4 },
                    walk_right: { row: 2, frames: 4 },
                    walk_up: { row: 3, frames: 4 },
                    typing: { row: 4, frames: 4 },
                    idle: { row: 0, frames: 1 }
                }
            },
            // 90년대 오피스 오브젝트 스프라이트
            'retro_computer': {
                src: 'assets/sprites/retro-office/ComputerSheet.png',
                frameWidth: 16,
                frameHeight: 16,
                animations: {
                    idle: { row: 0, frames: 1 },
                    working: { row: 0, frames: 4 }
                }
            },
            'retro_watercooler': {
                src: 'assets/sprites/retro-office/WatercoolerSheet.png',
                frameWidth: 16,
                frameHeight: 16,
                animations: {
                    idle: { row: 0, frames: 1 },
                    bubbling: { row: 0, frames: 3 }
                }
            }
        };

        // NPC 타입별 스프라이트 매핑 (백인 캐릭터 - 밝은 피부톤 흰 셔츠)
        this.npcSpriteMapping = [
            'office_worker_yellow_white',   // 가장 밝은 피부톤, 흰 셔츠
            'office_worker_yellow_white',   // 통일성을 위해 모두 동일
            'office_worker_yellow_white',
            'office_worker_yellow_white'
        ];
    }

    /**
     * 모든 레트로 스프라이트 로드
     */
    async loadSprites() {
        Logger.info('🎨 RetroSpriteManager: 레트로 스프라이트 로딩 시작...');

        const loadPromises = Object.entries(this.spriteDefinitions).map(([key, def]) => {
            return this.loadSprite(key, def);
        });

        try {
            await Promise.all(loadPromises);
            this.loaded = true;
            Logger.info('✅ RetroSpriteManager: 모든 레트로 스프라이트 로딩 완료!');
            Logger.debug(`📊 로드된 스프라이트: ${this.sprites.size}개`);
        } catch (error) {
            Logger.error('❌ RetroSpriteManager: 스프라이트 로딩 실패:', error);
            this.loaded = false;
        }
    }

    /**
     * 개별 스프라이트 로드
     */
    async loadSprite(key, definition) {
        return new Promise((resolve, reject) => {
            const img = new Image();

            img.onload = () => {
                this.sprites.set(key, {
                    image: img,
                    frameWidth: definition.frameWidth,
                    frameHeight: definition.frameHeight,
                    animations: definition.animations,
                    cols: Math.floor(img.width / definition.frameWidth),
                    rows: Math.floor(img.height / definition.frameHeight)
                });
                Logger.info(`✅ 스프라이트 로드 완료: ${key} (${img.width}x${img.height})`);
                resolve();
            };

            img.onerror = () => {
                Logger.error(`❌ 스프라이트 로드 실패: ${key} - ${definition.src}`);
                // 로드 실패해도 다른 스프라이트는 계속 로드
                resolve();
            };

            img.src = definition.src;
        });
    }

    /**
     * 스프라이트 로딩 완료 여부
     */
    isLoaded() {
        return this.loaded;
    }

    /**
     * NPC용 레트로 캐릭터 그리기
     */
    drawRetroNPC(ctx, npcIndex, x, y, width, height, animation = 'idle', frame = 0) {
        if (!this.loaded) {
            this.drawFallbackNPC(ctx, npcIndex, x, y, width, height);
            return;
        }

        const spriteKey = this.npcSpriteMapping[npcIndex % this.npcSpriteMapping.length];
        const sprite = this.sprites.get(spriteKey);

        if (!sprite) {
            this.drawFallbackNPC(ctx, npcIndex, x, y, width, height);
            return;
        }

        const animData = sprite.animations[animation] || sprite.animations.idle;
        const frameIndex = frame % animData.frames;

        const srcX = frameIndex * sprite.frameWidth;
        const srcY = animData.row * sprite.frameHeight;

        ctx.drawImage(
            sprite.image,
            srcX, srcY,
            sprite.frameWidth, sprite.frameHeight,
            x, y,
            width, height
        );
    }

    /**
     * 플레이어용 레트로 캐릭터 그리기 (백인 캐릭터 - 밝은 피부톤)
     */
    drawRetroPlayer(ctx, x, y, width, height, direction, frame = 0) {
        if (!this.loaded) {
            this.drawFallbackPlayer(ctx, x, y, width, height);
            return;
        }

        const sprite = this.sprites.get('office_worker_yellow_white');
        if (!sprite) {
            this.drawFallbackPlayer(ctx, x, y, width, height);
            return;
        }

        // 방향에 따른 애니메이션 선택
        let animation = 'walk_down';
        switch (direction) {
            case CONSTANTS.DIRECTIONS.UP:
                animation = 'walk_up';
                break;
            case CONSTANTS.DIRECTIONS.DOWN:
                animation = 'walk_down';
                break;
            case CONSTANTS.DIRECTIONS.LEFT:
                animation = 'walk_left';
                break;
            case CONSTANTS.DIRECTIONS.RIGHT:
                animation = 'walk_right';
                break;
        }

        const animData = sprite.animations[animation];
        const frameIndex = frame % animData.frames;

        const srcX = frameIndex * sprite.frameWidth;
        const srcY = animData.row * sprite.frameHeight;

        ctx.drawImage(
            sprite.image,
            srcX, srcY,
            sprite.frameWidth, sprite.frameHeight,
            x, y,
            width, height
        );
    }

    /**
     * 레트로 오피스 오브젝트 그리기
     */
    drawRetroObject(ctx, objectType, x, y, width, height, animation = 'idle', frame = 0) {
        let spriteKey;

        switch (objectType) {
            case 'computer':
                spriteKey = 'retro_computer';
                break;
            case 'watercooler':
                spriteKey = 'retro_watercooler';
                break;
            default:
                this.drawFallbackObject(ctx, objectType, x, y, width, height);
                return;
        }

        const sprite = this.sprites.get(spriteKey);
        if (!sprite) {
            this.drawFallbackObject(ctx, objectType, x, y, width, height);
            return;
        }

        const animData = sprite.animations[animation] || sprite.animations.idle;
        const frameIndex = frame % animData.frames;

        const srcX = frameIndex * sprite.frameWidth;
        const srcY = animData.row * sprite.frameHeight;

        ctx.drawImage(
            sprite.image,
            srcX, srcY,
            sprite.frameWidth, sprite.frameHeight,
            x, y,
            width, height
        );
    }

    /**
     * 폴백: 기본 NPC 그리기
     */
    drawFallbackNPC(ctx, npcIndex, x, y, width, height) {
        const colors = ['#8B4513', '#4169E1', '#228B22', '#FF6347'];
        const color = colors[npcIndex % colors.length];

        ctx.fillStyle = color;
        ctx.fillRect(x, y, width, height);

        // 간단한 얼굴
        ctx.fillStyle = '#FFDBAC';
        ctx.fillRect(x + width*0.25, y + height*0.1, width*0.5, height*0.3);
    }

    /**
     * 폴백: 기본 플레이어 그리기
     */
    drawFallbackPlayer(ctx, x, y, width, height) {
        ctx.fillStyle = '#0000FF';
        ctx.fillRect(x, y, width, height);

        ctx.fillStyle = '#FFDBAC';
        ctx.fillRect(x + width*0.25, y + height*0.1, width*0.5, height*0.3);
    }

    /**
     * 폴백: 기본 오브젝트 그리기
     */
    drawFallbackObject(ctx, objectType, x, y, width, height) {
        let color = '#808080';
        let emoji = '📦';

        switch (objectType) {
            case 'computer':
                color = '#2F4F4F';
                emoji = '💻';
                break;
            case 'watercooler':
                color = '#4169E1';
                emoji = '🚰';
                break;
        }

        ctx.fillStyle = color;
        ctx.fillRect(x, y, width, height);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = `${Math.min(width, height) * 0.6}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(emoji, x + width/2, y + height*0.7);
    }

    /**
     * 애니메이션 프레임 계산 (시간 기반)
     */
    getAnimationFrame(animationSpeed = 200) {
        return Math.floor(Date.now() / animationSpeed) % 4;
    }

    /**
     * 특정 스프라이트가 로드되었는지 확인
     */
    hasSprite(spriteKey) {
        return this.sprites.has(spriteKey);
    }

    /**
     * 모든 로드된 스프라이트 키 반환
     */
    getLoadedSprites() {
        return Array.from(this.sprites.keys());
    }
}
