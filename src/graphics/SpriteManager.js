import { Logger } from '../utils/Logger.js';

// 스프라이트 관리 클래스
export class SpriteManager {
    constructor() {
        this.sprites = {};
        this.tilesets = {};
        this.loaded = false;
        this.loadPromises = [];
    }

    // 스프라이트 로드
    loadSprite(name, path) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.sprites[name] = img;
                Logger.info(`✅ 스프라이트 로드 완료: ${name}`);
                resolve(img);
            };
            img.onerror = () => {
                Logger.error(`❌ 스프라이트 로드 실패: ${name} (${path})`);
                reject(new Error(`Failed to load sprite: ${name}`));
            };
            img.src = path;
        });
    }

    // 타일셋 로드
    loadTileset(name, path, tileWidth = 16, tileHeight = 16) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.tilesets[name] = {
                    image: img,
                    tileWidth: tileWidth,
                    tileHeight: tileHeight,
                    cols: Math.floor(img.width / tileWidth),
                    rows: Math.floor(img.height / tileHeight)
                };
                Logger.info(`✅ 타일셋 로드 완료: ${name} (${this.tilesets[name].cols}x${this.tilesets[name].rows})`);
                Logger.debug(`   이미지 크기: ${img.width}x${img.height}, 타일 크기: ${tileWidth}x${tileHeight}`);
                resolve(this.tilesets[name]);
            };
            img.onerror = () => {
                Logger.error(`❌ 타일셋 로드 실패: ${name} (${path})`);
                reject(new Error(`Failed to load tileset: ${name}`));
            };
            img.src = path;
        });
    }

    // 모든 에셋 로드
    async loadAllAssets() {
        Logger.info('🎨 게임 에셋 로딩 시작...');

        const loadPromises = [
            // 기본 캐릭터 스프라이트 (16x16)
            this.loadTileset('characters', 'assets/sprites/characters-16x16.png', 16, 16),

            // 다양한 오피스 워커들
            this.loadTileset('office_workers_1', 'assets/characters/office-workers-1.png', 16, 16),
            this.loadTileset('office_workers_2', 'assets/characters/office-workers-2.png', 16, 16),
            this.loadTileset('worker_brown_purple', 'assets/characters/WorkerSheetBrownPurple.png', 16, 16),
            this.loadTileset('worker_brown_white', 'assets/characters/WorkerSheetBrownWhite.png', 16, 16),
            this.loadTileset('worker_yellow_purple', 'assets/characters/WorkerSheetYellowPurple.png', 16, 16),
            this.loadTileset('worker_yellow_white', 'assets/characters/WorkerSheetYellowWhite.png', 16, 16),

            // 오피스 타일셋 (사이드스크롤용이지만 활용 가능)
            this.loadTileset('office_items', 'assets/tilesets/office-space-tileset.png', 16, 16),

            // 탑다운 타일셋 (16x16)
            this.loadTileset('topdown_tiles', 'assets/tilesets/tileset_full.png', 16, 16),

            // 오피스 가구 스프라이트들 (개별 로딩)
            this.loadSprite('office_desk', 'assets/office_furniture/desk.png'),
            this.loadSprite('office_chair', 'assets/office_furniture/chair.png'),
            this.loadSprite('office_monitor', 'assets/office_furniture/monitor.png'),
            this.loadSprite('office_keyboard', 'assets/office_furniture/keyboard.png'),
            this.loadSprite('office_bookshelf', 'assets/office_furniture/bookshelf.png'),
            this.loadSprite('office_plant', 'assets/office_furniture/plant.png'),
            this.loadSprite('office_lamp', 'assets/office_furniture/lamp.png'),

            // 상호작용 오브젝트 스프라이트들
            this.loadSprite('vending_machine_drink', 'assets/office_furniture/vending_machine_1.png'),
            this.loadSprite('vending_machine_snack', 'assets/office_furniture/vending_machine_2.png'),

            // 추가 다양한 캐릭터 스프라이트
            this.loadTileset('eight_bit_rpg', 'assets/characters/eight-bit-rpg-set.png', 16, 16),
            this.loadTileset('simple_character', 'assets/characters/character_base_16x16.png', 16, 16),

        ];

        try {
            await Promise.all(loadPromises);
            this.loaded = true;
            Logger.info('✅ 모든 게임 에셋 로딩 완료!');
            Logger.debug('📊 로딩된 타일셋:', Object.keys(this.tilesets));
            Logger.debug('📊 로딩된 스프라이트:', Object.keys(this.sprites));
            return true;
        } catch (error) {
            Logger.error('❌ 에셋 로딩 실패:', error);
            Logger.debug('🔍 현재 로딩된 타일셋:', Object.keys(this.tilesets));
            return false;
        }
    }

    // 스프라이트 가져오기
    getSprite(name) {
        return this.sprites[name] || null;
    }

    // 타일셋 가져오기
    getTileset(name) {
        return this.tilesets[name] || null;
    }

    // 타일셋에서 특정 타일 그리기
    drawTile(ctx, tilesetName, tileIndex, x, y, width = null, height = null) {
        const tileset = this.getTileset(tilesetName);
        if (!tileset) {
            Logger.warn(`타일셋을 찾을 수 없습니다: ${tilesetName}`);
            return false;
        }

        const col = tileIndex % tileset.cols;
        const row = Math.floor(tileIndex / tileset.cols);

        const sourceX = col * tileset.tileWidth;
        const sourceY = row * tileset.tileHeight;

        const destWidth = width || tileset.tileWidth;
        const destHeight = height || tileset.tileHeight;

        try {
            ctx.drawImage(
                tileset.image,
                sourceX, sourceY, tileset.tileWidth, tileset.tileHeight,
                x, y, destWidth, destHeight
            );
            return true;
        } catch (error) {
            Logger.warn(`타일 그리기 실패: ${tilesetName}[${tileIndex}]`, error);
            return false;
        }
    }

    // 캐릭터 스프라이트 그리기 (애니메이션 지원)
    drawCharacter(ctx, characterIndex, x, y, width = 48, height = 48) {
        return this.drawTile(ctx, 'characters', characterIndex, x, y, width, height);
    }

    // 오피스 아이템 그리기
    drawOfficeItem(ctx, itemIndex, x, y, width = 48, height = 48) {
        return this.drawTile(ctx, 'office_items', itemIndex, x, y, width, height);
    }

    // 탑다운 타일 그리기
    drawTopdownTile(ctx, tileIndex, x, y, width = 48, height = 48) {
        return this.drawTile(ctx, 'topdown_tiles', tileIndex, x, y, width, height);
    }

    // 오피스 가구 그리기
    drawOfficeFurniture(ctx, furnitureType, x, y, width = 48, height = 48) {
        const sprite = this.getSprite(`office_${furnitureType}`);
        if (!sprite) {
            Logger.warn(`가구 스프라이트를 찾을 수 없습니다: office_${furnitureType}`);
            return false;
        }

        try {
            ctx.drawImage(sprite, x, y, width, height);
            return true;
        } catch (error) {
            Logger.warn(`가구 그리기 실패: office_${furnitureType}`, error);
            return false;
        }
    }

    // 타일셋 정보 출력 (디버깅용)
    getTilesetInfo(name) {
        const tileset = this.getTileset(name);
        if (!tileset) return null;

        return {
            name: name,
            width: tileset.image.width,
            height: tileset.image.height,
            tileWidth: tileset.tileWidth,
            tileHeight: tileset.tileHeight,
            cols: tileset.cols,
            rows: tileset.rows,
            totalTiles: tileset.cols * tileset.rows
        };
    }

    // 모든 타일셋 정보 출력
    getAllTilesetInfo() {
        const info = {};
        Object.keys(this.tilesets).forEach(name => {
            info[name] = this.getTilesetInfo(name);
        });
        return info;
    }

    // 로딩 상태 확인
    isLoaded() {
        return this.loaded;
    }

    // 특정 에셋이 로드되었는지 확인
    hasSprite(name) {
        return this.sprites[name] !== undefined;
    }

    hasTileset(name) {
        return this.tilesets[name] !== undefined;
    }
}
