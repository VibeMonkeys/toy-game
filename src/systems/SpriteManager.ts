/**
 * 🎨 스프라이트 관리 시스템
 *
 * 모든 게임 스프라이트를 로드하고 관리합니다.
 */

export interface SpriteAnimation {
    frames: number;
    frameWidth: number;
    frameHeight: number;
    directions: {
        up: number;
        left: number;
        down: number;
        right: number;
    };
}

export interface SpriteData {
    image: HTMLImageElement;
    animation?: SpriteAnimation;
    width: number;
    height: number;
}

export class SpriteManager {
    private sprites: Map<string, SpriteData> = new Map();
    private loadingPromises: Map<string, Promise<HTMLImageElement>> = new Map();
    private basePath: string = '/assets/sprites/';

    /**
     * 스프라이트 정의 (게임에서 사용할 모든 스프라이트)
     */
    private spriteDefinitions = {
        // 플레이어
        player: {
            path: 'characters/player.svg',
            animation: {
                frames: 4,
                frameWidth: 32,
                frameHeight: 32,
                directions: { up: 0, left: 1, down: 2, right: 3 }
            }
        },

        // 적들
        goblin: {
            path: 'enemies/goblin.svg',
            animation: {
                frames: 4,
                frameWidth: 32,
                frameHeight: 32,
                directions: { up: 0, left: 1, down: 2, right: 3 }
            }
        },
        orc: {
            path: 'enemies/orc.svg',
            animation: {
                frames: 4,
                frameWidth: 32,
                frameHeight: 32,
                directions: { up: 0, left: 1, down: 2, right: 3 }
            }
        },
        skeleton: {
            path: 'enemies/skeleton.svg',
            animation: {
                frames: 4,
                frameWidth: 32,
                frameHeight: 32,
                directions: { up: 0, left: 1, down: 2, right: 3 }
            }
        },
        troll: {
            path: 'enemies/troll.svg',
            animation: {
                frames: 4,
                frameWidth: 32,
                frameHeight: 32,
                directions: { up: 0, left: 1, down: 2, right: 3 }
            }
        },
        wraith: {
            path: 'enemies/wraith.svg',
            animation: {
                frames: 4,
                frameWidth: 32,
                frameHeight: 32,
                directions: { up: 0, left: 1, down: 2, right: 3 }
            }
        },

        // NPC
        soul_keeper: {
            path: 'npcs/soul_keeper.svg',
            animation: {
                frames: 4,
                frameWidth: 32,
                frameHeight: 32,
                directions: { up: 0, left: 1, down: 2, right: 3 }
            }
        },
        blacksmith: {
            path: 'npcs/blacksmith.svg',
            animation: {
                frames: 4,
                frameWidth: 32,
                frameHeight: 32,
                directions: { up: 0, left: 1, down: 2, right: 3 }
            }
        },
        skill_master: {
            path: 'npcs/skill_master.svg',
            animation: {
                frames: 4,
                frameWidth: 32,
                frameHeight: 32,
                directions: { up: 0, left: 1, down: 2, right: 3 }
            }
        },
        sage: {
            path: 'npcs/sage.svg',
            animation: {
                frames: 4,
                frameWidth: 32,
                frameHeight: 32,
                directions: { up: 0, left: 1, down: 2, right: 3 }
            }
        },
        merchant: {
            path: 'npcs/merchant.svg',
            animation: {
                frames: 4,
                frameWidth: 32,
                frameHeight: 32,
                directions: { up: 0, left: 1, down: 2, right: 3 }
            }
        },

        // 보스 (더 큰 사이즈)
        goblin_chieftain: {
            path: 'enemies/goblin_chieftain.svg',
            animation: {
                frames: 4,
                frameWidth: 48,
                frameHeight: 48,
                directions: { up: 0, left: 1, down: 2, right: 3 }
            }
        },
        orc_chieftain: {
            path: 'enemies/orc_chieftain.svg',
            animation: {
                frames: 4,
                frameWidth: 48,
                frameHeight: 48,
                directions: { up: 0, left: 1, down: 2, right: 3 }
            }
        },
        troll_king: {
            path: 'enemies/troll_king.svg',
            animation: {
                frames: 4,
                frameWidth: 64,
                frameHeight: 64,
                directions: { up: 0, left: 1, down: 2, right: 3 }
            }
        },
        skeleton_lord: {
            path: 'enemies/skeleton_lord.svg',
            animation: {
                frames: 4,
                frameWidth: 64,
                frameHeight: 64,
                directions: { up: 0, left: 1, down: 2, right: 3 }
            }
        },
        death_knight: {
            path: 'enemies/death_knight.svg',
            animation: {
                frames: 4,
                frameWidth: 64,
                frameHeight: 64,
                directions: { up: 0, left: 1, down: 2, right: 3 }
            }
        },
        chaos_lord: {
            path: 'enemies/chaos_lord.svg',
            animation: {
                frames: 4,
                frameWidth: 128,
                frameHeight: 128,
                directions: { up: 0, left: 1, down: 2, right: 3 }
            }
        }
    };

    /**
     * 스프라이트 로드
     */
    private loadImage(path: string): Promise<HTMLImageElement> {
        // 이미 로딩 중이면 그 Promise 반환
        if (this.loadingPromises.has(path)) {
            return this.loadingPromises.get(path)!;
        }

        const promise = new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image();
            img.src = this.basePath + path;

            img.onload = () => {
                resolve(img);
            };

            img.onerror = () => {
                console.warn(`⚠️ 스프라이트 로드 실패: ${path} - 플레이스홀더 사용`);
                // 플레이스홀더 이미지 생성 (32x32 빨간 사각형)
                const canvas = document.createElement('canvas');
                canvas.width = 32;
                canvas.height = 32;
                const ctx = canvas.getContext('2d')!;
                ctx.fillStyle = '#ff0000';
                ctx.fillRect(0, 0, 32, 32);
                ctx.strokeStyle = '#000000';
                ctx.strokeRect(0, 0, 32, 32);

                const placeholderImg = new Image();
                placeholderImg.src = canvas.toDataURL();
                placeholderImg.onload = () => resolve(placeholderImg);
            };
        });

        this.loadingPromises.set(path, promise);
        return promise;
    }

    /**
     * 모든 스프라이트 로드
     */
    async loadAll(): Promise<void> {
        console.log('🎨 스프라이트 로딩 시작...');

        const loadPromises: Promise<void>[] = [];

        for (const [key, definition] of Object.entries(this.spriteDefinitions)) {
            const promise = this.loadImage(definition.path).then((image) => {
                this.sprites.set(key, {
                    image,
                    animation: definition.animation,
                    width: definition.animation?.frameWidth || image.width,
                    height: definition.animation?.frameHeight || image.height
                });
            });

            loadPromises.push(promise);
        }

        await Promise.all(loadPromises);
        console.log(`✅ ${this.sprites.size}개 스프라이트 로드 완료!`);
    }

    /**
     * 특정 스프라이트 가져오기
     */
    getSprite(key: string): SpriteData | null {
        return this.sprites.get(key) || null;
    }

    /**
     * 스프라이트가 로드되었는지 확인
     */
    isLoaded(key: string): boolean {
        return this.sprites.has(key);
    }

    /**
     * 모든 스프라이트가 로드되었는지 확인
     */
    isAllLoaded(): boolean {
        return this.sprites.size === Object.keys(this.spriteDefinitions).length;
    }

    /**
     * 애니메이션 프레임 그리기
     */
    drawAnimatedSprite(
        ctx: CanvasRenderingContext2D,
        spriteKey: string,
        x: number,
        y: number,
        direction: 'up' | 'down' | 'left' | 'right',
        frameIndex: number
    ): void {
        const sprite = this.getSprite(spriteKey);
        if (!sprite || !sprite.animation) {
            // 플레이스홀더 그리기
            ctx.fillStyle = '#ff00ff';
            ctx.fillRect(x, y, 32, 32);
            return;
        }

        const { image, animation } = sprite;
        const row = animation.directions[direction];
        const frameX = frameIndex * animation.frameWidth;
        const frameY = row * animation.frameHeight;

        ctx.drawImage(
            image,
            frameX, frameY,
            animation.frameWidth, animation.frameHeight,
            x, y,
            animation.frameWidth, animation.frameHeight
        );
    }

    /**
     * 정적 스프라이트 그리기 (애니메이션 없음)
     */
    drawStaticSprite(
        ctx: CanvasRenderingContext2D,
        spriteKey: string,
        x: number,
        y: number
    ): void {
        const sprite = this.getSprite(spriteKey);
        if (!sprite) {
            ctx.fillStyle = '#ff00ff';
            ctx.fillRect(x, y, 32, 32);
            return;
        }

        ctx.drawImage(sprite.image, x, y);
    }

    /**
     * 디버그: 로드된 스프라이트 목록 출력
     */
    debug(): void {
        console.log('📋 로드된 스프라이트:');
        this.sprites.forEach((sprite, key) => {
            console.log(`  - ${key}: ${sprite.width}x${sprite.height}${sprite.animation ? ' (애니메이션)' : ''}`);
        });
    }
}
