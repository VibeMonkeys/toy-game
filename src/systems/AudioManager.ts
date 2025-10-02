/**
 * 🎵 오디오 매니저
 *
 * BGM 및 효과음 관리 시스템
 */

import { AUDIO } from '../utils/Constants';

type BGMType = 'title' | 'floor' | 'boss' | 'victory' | 'gameover';
type SFXType =
    | 'attack'
    | 'hit'
    | 'damage'
    | 'item_pickup'
    | 'level_up'
    | 'quest_complete'
    | 'boss_appear'
    | 'boss_phase'
    | 'player_death'
    | 'button_click';

export class AudioManager {
    // BGM
    private currentBGM: HTMLAudioElement | null = null;
    private bgmVolume: number = AUDIO.MUSIC_VOLUME;
    private sfxVolume: number = AUDIO.SFX_VOLUME;
    private masterVolume: number = AUDIO.MASTER_VOLUME;
    private isMuted: boolean = false;

    // SFX 풀 (동시 재생을 위해)
    private sfxPool: Map<SFXType, HTMLAudioElement[]> = new Map();
    private maxSFXInstances: number = 5;

    // 페이드 효과
    private fadeInterval: number | null = null;

    constructor() {
        console.log('🎵 AudioManager 초기화');
    }

    /**
     * BGM 재생
     */
    playBGM(type: BGMType, loop: boolean = true): void {
        // 현재 BGM 정지
        this.stopBGM();

        // TODO: 실제 오디오 파일 경로 설정 필요
        const bgmPath = this.getBGMPath(type);

        if (!bgmPath) {
            console.warn(`⚠️ BGM 파일 없음: ${type}`);
            return;
        }

        try {
            this.currentBGM = new Audio(bgmPath);
            this.currentBGM.loop = loop;
            this.currentBGM.volume = this.bgmVolume * this.masterVolume;

            this.currentBGM.play().catch(err => {
                console.warn('⚠️ BGM 재생 실패:', err);
            });

            console.log(`🎵 BGM 재생: ${type}`);
        } catch (error) {
            console.error('❌ BGM 로드 실패:', error);
        }
    }

    /**
     * BGM 정지
     */
    stopBGM(): void {
        if (this.currentBGM) {
            this.currentBGM.pause();
            this.currentBGM.currentTime = 0;
            this.currentBGM = null;
        }
    }

    /**
     * BGM 일시정지
     */
    pauseBGM(): void {
        if (this.currentBGM) {
            this.currentBGM.pause();
        }
    }

    /**
     * BGM 재개
     */
    resumeBGM(): void {
        if (this.currentBGM) {
            this.currentBGM.play().catch(err => {
                console.warn('⚠️ BGM 재개 실패:', err);
            });
        }
    }

    /**
     * BGM 페이드 아웃
     */
    fadeBGMOut(duration: number = 1000): void {
        if (!this.currentBGM) return;

        const startVolume = this.currentBGM.volume;
        const fadeStep = startVolume / (duration / 50);

        if (this.fadeInterval) {
            clearInterval(this.fadeInterval);
        }

        this.fadeInterval = window.setInterval(() => {
            if (!this.currentBGM) {
                if (this.fadeInterval) clearInterval(this.fadeInterval);
                return;
            }

            this.currentBGM.volume = Math.max(0, this.currentBGM.volume - fadeStep);

            if (this.currentBGM.volume <= 0) {
                this.stopBGM();
                if (this.fadeInterval) {
                    clearInterval(this.fadeInterval);
                    this.fadeInterval = null;
                }
            }
        }, 50);
    }

    /**
     * BGM 페이드 인
     */
    fadeBGMIn(type: BGMType, duration: number = 1000): void {
        this.playBGM(type);

        if (!this.currentBGM) return;

        const targetVolume = this.bgmVolume * this.masterVolume;
        this.currentBGM.volume = 0;
        const fadeStep = targetVolume / (duration / 50);

        if (this.fadeInterval) {
            clearInterval(this.fadeInterval);
        }

        this.fadeInterval = window.setInterval(() => {
            if (!this.currentBGM) {
                if (this.fadeInterval) clearInterval(this.fadeInterval);
                return;
            }

            this.currentBGM.volume = Math.min(targetVolume, this.currentBGM.volume + fadeStep);

            if (this.currentBGM.volume >= targetVolume) {
                if (this.fadeInterval) {
                    clearInterval(this.fadeInterval);
                    this.fadeInterval = null;
                }
            }
        }, 50);
    }

    /**
     * 효과음 재생
     */
    playSFX(type: SFXType): void {
        if (this.isMuted) return;

        const sfxPath = this.getSFXPath(type);

        if (!sfxPath) {
            // 실제 파일이 없으면 콘솔로만 표시
            console.log(`🔊 SFX: ${type}`);
            return;
        }

        try {
            // SFX 풀에서 가져오기
            if (!this.sfxPool.has(type)) {
                this.sfxPool.set(type, []);
            }

            const pool = this.sfxPool.get(type)!;

            // 사용 가능한 인스턴스 찾기
            let sfx = pool.find(audio => audio.paused || audio.ended);

            if (!sfx && pool.length < this.maxSFXInstances) {
                // 새 인스턴스 생성
                sfx = new Audio(sfxPath);
                pool.push(sfx);
            }

            if (sfx) {
                sfx.volume = this.sfxVolume * this.masterVolume;
                sfx.currentTime = 0;
                sfx.play().catch(err => {
                    console.warn('⚠️ SFX 재생 실패:', err);
                });
            }
        } catch (error) {
            console.warn('⚠️ SFX 로드 실패:', error);
        }
    }

    /**
     * 볼륨 설정
     */
    setMasterVolume(volume: number): void {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        this.updateBGMVolume();
        console.log(`🔊 마스터 볼륨: ${(this.masterVolume * 100).toFixed(0)}%`);
    }

    setBGMVolume(volume: number): void {
        this.bgmVolume = Math.max(0, Math.min(1, volume));
        this.updateBGMVolume();
        console.log(`🎵 BGM 볼륨: ${(this.bgmVolume * 100).toFixed(0)}%`);
    }

    setSFXVolume(volume: number): void {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
        console.log(`🔊 SFX 볼륨: ${(this.sfxVolume * 100).toFixed(0)}%`);
    }

    /**
     * 음소거 토글
     */
    toggleMute(): void {
        this.isMuted = !this.isMuted;

        if (this.isMuted) {
            if (this.currentBGM) {
                this.currentBGM.volume = 0;
            }
            console.log('🔇 음소거');
        } else {
            this.updateBGMVolume();
            console.log('🔊 음소거 해제');
        }
    }

    /**
     * BGM 볼륨 업데이트
     */
    private updateBGMVolume(): void {
        if (this.currentBGM && !this.isMuted) {
            this.currentBGM.volume = this.bgmVolume * this.masterVolume;
        }
    }

    /**
     * BGM 파일 경로 가져오기
     */
    private getBGMPath(type: BGMType): string | null {
        // TODO: 실제 오디오 파일 경로로 교체 필요
        const bgmPaths: Record<BGMType, string | null> = {
            'title': null, // 'assets/audio/bgm/title.mp3',
            'floor': null, // 'assets/audio/bgm/floor.mp3',
            'boss': null,  // 'assets/audio/bgm/boss.mp3',
            'victory': null, // 'assets/audio/bgm/victory.mp3',
            'gameover': null // 'assets/audio/bgm/gameover.mp3'
        };

        return bgmPaths[type] || null;
    }

    /**
     * SFX 파일 경로 가져오기
     */
    private getSFXPath(type: SFXType): string | null {
        // TODO: 실제 오디오 파일 경로로 교체 필요
        const sfxPaths: Record<SFXType, string | null> = {
            'attack': null, // 'assets/audio/sfx/attack.mp3',
            'hit': null, // 'assets/audio/sfx/hit.mp3',
            'damage': null, // 'assets/audio/sfx/damage.mp3',
            'item_pickup': null, // 'assets/audio/sfx/item_pickup.mp3',
            'level_up': null, // 'assets/audio/sfx/level_up.mp3',
            'quest_complete': null, // 'assets/audio/sfx/quest_complete.mp3',
            'boss_appear': null, // 'assets/audio/sfx/boss_appear.mp3',
            'boss_phase': null, // 'assets/audio/sfx/boss_phase.mp3',
            'player_death': null, // 'assets/audio/sfx/player_death.mp3',
            'button_click': null // 'assets/audio/sfx/button_click.mp3'
        };

        return sfxPaths[type] || null;
    }

    /**
     * 볼륨 값 가져오기
     */
    getMasterVolume(): number {
        return this.masterVolume;
    }

    getBGMVolumeValue(): number {
        return this.bgmVolume;
    }

    getSFXVolumeValue(): number {
        return this.sfxVolume;
    }

    isMutedValue(): boolean {
        return this.isMuted;
    }

    /**
     * 정리
     */
    cleanup(): void {
        this.stopBGM();
        if (this.fadeInterval) {
            clearInterval(this.fadeInterval);
        }
        this.sfxPool.clear();
        console.log('🔇 AudioManager 정리 완료');
    }
}
