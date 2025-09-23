// 층별 분위기 및 환경음 시스템
export class FloorAtmosphereSystem {
    constructor(audioManager) {
        this.audioManager = audioManager;
        this.currentFloor = null;
        this.isActive = true;
        this.ambientTimers = new Set();
        
        // 층별 분위기 설정
        this.floorConfigs = {
            'lobby': {
                name: '1층 로비',
                ambientSounds: ['footsteps', 'chatter', 'elevator_ding'],
                soundInterval: { min: 3000, max: 8000 },
                atmosphere: 'busy_reception',
                specialEvents: ['visitor_arrival', 'security_check'],
                backgroundTone: 'professional'
            },
            'floor_7': {
                name: '7층 사무실', 
                ambientSounds: ['typing', 'phone_ring', 'paper_shuffle', 'coffee_machine'],
                soundInterval: { min: 2000, max: 6000 },
                atmosphere: 'busy_office',
                specialEvents: ['urgent_call', 'printer_jam', 'coffee_break'],
                backgroundTone: 'productive'
            },
            'floor_8': {
                name: '8층 회의실/카페테리아',
                ambientSounds: ['meeting_discussion', 'projector_hum', 'cutlery', 'microwave'],
                soundInterval: { min: 4000, max: 10000 },
                atmosphere: 'meeting_focus',
                specialEvents: ['presentation_prep', 'lunch_rush', 'meeting_start'],
                backgroundTone: 'collaborative'
            },
            'floor_9': {
                name: '9층 임원실',
                ambientSounds: ['quiet_typing', 'phone_whisper', 'paper_turn'],
                soundInterval: { min: 5000, max: 15000 },
                atmosphere: 'executive_quiet',
                specialEvents: ['important_call', 'document_review', 'strategic_meeting'],
                backgroundTone: 'luxury'
            },
            'rooftop': {
                name: '옥상',
                ambientSounds: ['wind', 'birds', 'distant_traffic', 'leaves_rustle'],
                soundInterval: { min: 3000, max: 12000 },
                atmosphere: 'relaxing_nature',
                specialEvents: ['weather_change', 'break_time', 'team_gathering'],
                backgroundTone: 'peaceful'
            }
        };
        
        this.activeEvents = new Map();
    }

    // 안전한 타이머 설정
    setSafeTimeout(callback, delay) {
        const timerId = setTimeout(() => {
            this.ambientTimers.delete(timerId);
            callback();
        }, delay);
        this.ambientTimers.add(timerId);
        return timerId;
    }

    // 모든 타이머 정리
    clearAllTimers() {
        this.ambientTimers.forEach(timerId => clearTimeout(timerId));
        this.ambientTimers.clear();
    }

    // 층 변경 시 분위기 전환
    changeFloor(floorId) {
        if (this.currentFloor === floorId) return;
        
        // 이전 층 효과 정리
        this.stopCurrentAtmosphere();
        
        this.currentFloor = floorId;
        const config = this.floorConfigs[floorId];
        
        if (config && this.isActive) {
            console.log(`🏢 ${config.name} 분위기 시작`);
            this.startFloorAtmosphere(config);
        }
    }

    // 층별 분위기 시작
    startFloorAtmosphere(config) {
        // 환경음 재생 시작
        this.startAmbientSounds(config);
        
        // 랜덤 이벤트 예약
        this.scheduleRandomEvents(config);
        
        // 시각적 효과 (추후 확장)
        this.applyVisualAtmosphere(config);
    }

    // 환경음 재생
    startAmbientSounds(config) {
        const playRandomSound = () => {
            if (!this.isActive || this.currentFloor !== Object.keys(this.floorConfigs).find(key => this.floorConfigs[key] === config)) {
                return;
            }
            
            const sounds = config.ambientSounds;
            const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
            this.playAmbientSound(randomSound, config.backgroundTone);
            
            // 다음 소리 예약
            const nextDelay = Math.random() * (config.soundInterval.max - config.soundInterval.min) + config.soundInterval.min;
            this.setSafeTimeout(playRandomSound, nextDelay);
        };
        
        // 첫 소리는 1-3초 후 시작
        const initialDelay = Math.random() * 2000 + 1000;
        this.setSafeTimeout(playRandomSound, initialDelay);
    }

    // 개별 환경음 재생
    playAmbientSound(soundType, tone) {
        if (!this.audioManager || !this.audioManager.soundEnabled) return;
        
        const soundConfig = this.getAmbientSoundConfig(soundType, tone);
        
        if (soundConfig.sequence) {
            // 연속음 재생
            soundConfig.sequence.forEach((sound, index) => {
                this.setSafeTimeout(() => {
                    this.audioManager.playBeep(sound.freq, sound.duration);
                }, sound.delay);
            });
        } else {
            // 단일음 재생
            this.audioManager.playBeep(soundConfig.frequency, soundConfig.duration);
        }
    }

    // 환경음 설정 정의
    getAmbientSoundConfig(soundType, tone) {
        const baseVolume = tone === 'luxury' ? 0.3 : tone === 'peaceful' ? 0.5 : 0.4;
        
        const soundConfigs = {
            // 로비 소리
            'footsteps': {
                sequence: [
                    { freq: 200, duration: 80, delay: 0 },
                    { freq: 180, duration: 60, delay: 200 },
                    { freq: 220, duration: 70, delay: 400 }
                ]
            },
            'chatter': {
                sequence: [
                    { freq: 300, duration: 150, delay: 0 },
                    { freq: 400, duration: 100, delay: 200 },
                    { freq: 350, duration: 120, delay: 400 }
                ]
            },
            'elevator_ding': {
                sequence: [
                    { freq: 800, duration: 200, delay: 0 },
                    { freq: 600, duration: 300, delay: 250 }
                ]
            },
            
            // 사무실 소리
            'typing': {
                sequence: [
                    { freq: 1000, duration: 50, delay: 0 },
                    { freq: 1100, duration: 40, delay: 80 },
                    { freq: 950, duration: 60, delay: 160 },
                    { freq: 1050, duration: 45, delay: 250 }
                ]
            },
            'phone_ring': {
                sequence: [
                    { freq: 800, duration: 400, delay: 0 },
                    { freq: 1000, duration: 400, delay: 500 },
                    { freq: 800, duration: 400, delay: 1000 }
                ]
            },
            'paper_shuffle': {
                sequence: [
                    { freq: 2000, duration: 150, delay: 0 },
                    { freq: 1800, duration: 100, delay: 200 },
                    { freq: 2200, duration: 80, delay: 350 }
                ]
            },
            'coffee_machine': {
                sequence: [
                    { freq: 400, duration: 800, delay: 0 },
                    { freq: 600, duration: 200, delay: 1000 }
                ]
            },
            
            // 회의실 소리
            'meeting_discussion': {
                sequence: [
                    { freq: 250, duration: 300, delay: 0 },
                    { freq: 280, duration: 200, delay: 400 },
                    { freq: 230, duration: 250, delay: 700 }
                ]
            },
            'projector_hum': {
                frequency: 120,
                duration: 2000
            },
            'cutlery': {
                sequence: [
                    { freq: 2500, duration: 100, delay: 0 },
                    { freq: 2800, duration: 80, delay: 150 }
                ]
            },
            'microwave': {
                frequency: 800,
                duration: 1500
            },
            
            // 임원실 소리
            'quiet_typing': {
                sequence: [
                    { freq: 900, duration: 80, delay: 0 },
                    { freq: 920, duration: 60, delay: 200 }
                ]
            },
            'phone_whisper': {
                frequency: 400,
                duration: 800
            },
            'paper_turn': {
                frequency: 1500,
                duration: 200
            },
            
            // 옥상 소리
            'wind': {
                frequency: 150,
                duration: 3000
            },
            'birds': {
                sequence: [
                    { freq: 2000, duration: 200, delay: 0 },
                    { freq: 1800, duration: 150, delay: 300 },
                    { freq: 2200, duration: 100, delay: 500 }
                ]
            },
            'distant_traffic': {
                frequency: 80,
                duration: 2000
            },
            'leaves_rustle': {
                sequence: [
                    { freq: 2500, duration: 300, delay: 0 },
                    { freq: 2300, duration: 200, delay: 400 }
                ]
            }
        };
        
        return soundConfigs[soundType] || { frequency: 440, duration: 200 };
    }

    // 랜덤 이벤트 예약
    scheduleRandomEvents(config) {
        const scheduleEvent = () => {
            if (!this.isActive) return;
            
            const events = config.specialEvents;
            const randomEvent = events[Math.floor(Math.random() * events.length)];
            
            // 이벤트 실행 확률 (30%)
            if (Math.random() < 0.3) {
                this.triggerSpecialEvent(randomEvent, config);
            }
            
            // 다음 이벤트 예약 (30초 ~ 2분)
            const nextEventDelay = Math.random() * 90000 + 30000;
            this.setSafeTimeout(scheduleEvent, nextEventDelay);
        };
        
        // 첫 이벤트는 30초 ~ 1분 후
        const initialDelay = Math.random() * 30000 + 30000;
        this.setSafeTimeout(scheduleEvent, initialDelay);
    }

    // 특별 이벤트 실행
    triggerSpecialEvent(eventType, config) {
        if (this.activeEvents.has(eventType)) return; // 중복 실행 방지
        
        console.log(`🎭 특별 이벤트: ${eventType} (${config.name})`);
        this.activeEvents.set(eventType, true);
        
        const eventConfigs = {
            // 로비 이벤트
            'visitor_arrival': {
                message: '👥 새로운 방문객이 도착했습니다',
                duration: 5000,
                sound: 'elevator_ding'
            },
            'security_check': {
                message: '🔍 보안 검색이 진행 중입니다',
                duration: 8000,
                sound: 'chatter'
            },
            
            // 사무실 이벤트
            'urgent_call': {
                message: '📞 긴급 전화가 걸려왔습니다',
                duration: 10000,
                sound: 'phone_ring'
            },
            'printer_jam': {
                message: '🖨️ 프린터에 용지가 걸렸습니다',
                duration: 15000,
                sound: 'paper_shuffle'
            },
            'coffee_break': {
                message: '☕ 커피 타임입니다',
                duration: 12000,
                sound: 'coffee_machine'
            },
            
            // 회의실 이벤트
            'presentation_prep': {
                message: '📊 프레젠테이션 준비 중입니다',
                duration: 20000,
                sound: 'projector_hum'
            },
            'lunch_rush': {
                message: '🍽️ 점심시간 러시가 시작됐습니다',
                duration: 15000,
                sound: 'cutlery'
            },
            'meeting_start': {
                message: '👔 회의가 시작됩니다',
                duration: 10000,
                sound: 'meeting_discussion'
            },
            
            // 임원실 이벤트
            'important_call': {
                message: '📱 중요한 통화가 진행 중입니다',
                duration: 25000,
                sound: 'phone_whisper'
            },
            'document_review': {
                message: '📋 중요 문서 검토 중입니다',
                duration: 18000,
                sound: 'paper_turn'
            },
            'strategic_meeting': {
                message: '🎯 전략 회의가 진행 중입니다',
                duration: 30000,
                sound: 'quiet_typing'
            },
            
            // 옥상 이벤트
            'weather_change': {
                message: '🌤️ 날씨가 변하고 있습니다',
                duration: 10000,
                sound: 'wind'
            },
            'break_time': {
                message: '😌 휴식 시간입니다',
                duration: 8000,
                sound: 'birds'
            },
            'team_gathering': {
                message: '👥 팀원들이 모여들고 있습니다',
                duration: 12000,
                sound: 'chatter'
            }
        };
        
        const eventConfig = eventConfigs[eventType];
        if (eventConfig) {
            // 이벤트 사운드 재생
            this.playAmbientSound(eventConfig.sound, config.backgroundTone);
            
            // 이벤트 종료 후 상태 정리
            this.setSafeTimeout(() => {
                this.activeEvents.delete(eventType);
                console.log(`✅ 이벤트 종료: ${eventType}`);
            }, eventConfig.duration);
            
            // 게임에 이벤트 알림 (Game.js에서 처리할 수 있도록)
            this.notifyGameEvent(eventType, eventConfig);
        }
    }

    // 게임에 이벤트 알림
    notifyGameEvent(eventType, eventConfig) {
        // Game.js의 이벤트 핸들러로 전달
        const event = new CustomEvent('floorAtmosphereEvent', {
            detail: {
                type: eventType,
                message: eventConfig.message,
                duration: eventConfig.duration,
                floor: this.currentFloor
            }
        });
        window.dispatchEvent(event);
    }

    // 시각적 분위기 적용 (추후 확장)
    applyVisualAtmosphere(config) {
        // 배경색 조정, 조명 효과 등 추후 구현
        console.log(`🎨 ${config.name} 시각적 분위기 적용: ${config.backgroundTone}`);
    }

    // 현재 분위기 중단
    stopCurrentAtmosphere() {
        this.clearAllTimers();
        this.activeEvents.clear();
        
        if (this.currentFloor) {
            const config = this.floorConfigs[this.currentFloor];
            if (config) {
                console.log(`🔇 ${config.name} 분위기 중단`);
            }
        }
    }

    // 시스템 활성화/비활성화
    setActive(active) {
        this.isActive = active;
        if (!active) {
            this.stopCurrentAtmosphere();
        } else if (this.currentFloor) {
            const config = this.floorConfigs[this.currentFloor];
            if (config) {
                this.startFloorAtmosphere(config);
            }
        }
    }

    // 현재 층 정보 반환
    getCurrentFloorInfo() {
        if (!this.currentFloor) return null;
        
        const config = this.floorConfigs[this.currentFloor];
        return {
            floor: this.currentFloor,
            name: config.name,
            atmosphere: config.atmosphere,
            activeEvents: Array.from(this.activeEvents.keys())
        };
    }

    // 시스템 정리
    destroy() {
        this.stopCurrentAtmosphere();
        this.isActive = false;
    }
}