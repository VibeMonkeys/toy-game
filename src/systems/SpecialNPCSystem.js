// 특별 NPC 시스템 - 숨겨진 캐릭터 및 이스터 에그
export class SpecialNPCSystem {
    constructor(gameInstance) {
        this.gameInstance = gameInstance;
        this.mapManager = gameInstance.mapManager;
        this.questSystem = gameInstance.questSystem;
        this.particleSystem = gameInstance.particleSystem;
        this.audioManager = gameInstance.audioManager;
        
        this.activeSpecialNPCs = new Map(); // 현재 활성화된 특별 NPC들
        this.discoveredNPCs = new Set(); // 발견한 특별 NPC 목록
        this.spawnTimers = new Set(); // 타이머 관리
        
        // 특별 NPC 정의
        this.specialNPCs = this.defineSpecialNPCs();
        
        // 스폰 설정
        this.spawnConfig = {
            checkInterval: 45000, // 45초마다 스폰 확인
            baseSpawnChance: 0.12, // 12% 기본 스폰 확률
            maxActiveNPCs: 2, // 동시 최대 2명
            npcLifetime: 180000, // 3분 후 자동 사라짐
            cooldownTime: 120000 // 2분 쿨다운
        };
        
        this.lastSpawnTime = new Map(); // NPC별 마지막 스폰 시간
        this.isActive = true;
        
        this.startSpawnSystem();
    }

    // 특별 NPC 정의
    defineSpecialNPCs() {
        return {
            'developer_choi': {
                id: 'developer_choi',
                name: '개발자 최진안',
                emoji: '👨‍💻',
                description: '휴넷 게임의 실제 개발자',
                rarity: 'legendary', // legendary, epic, rare
                spawnChance: 0.08, // 8% 스폰 확률
                preferredFloors: ['floor_7', 'floor_8'], // 선호 층
                hiddenSpots: true, // 숨겨진 장소 선호
                dialogues: {
                    first: {
                        text: "어? 저를 찾으셨군요! 안녕하세요, 이 게임을 만든 개발자 최진안입니다! 🎮",
                        choices: [
                            { text: "게임 개발 이야기를 들려주세요!", response: "dev_story" },
                            { text: "특별한 선물이 있나요?", response: "special_gift" },
                            { text: "개발 비하인드가 궁금해요!", response: "behind_scenes" }
                        ]
                    },
                    dev_story: {
                        text: "이 게임은 휴넷 26주년을 기념해서 만들었어요. 실제 회사 분위기를 담으려고 정말 많이 노력했답니다! 각 층마다 다른 소리가 나는 것도 발견하셨나요? 😊",
                        reward: { type: 'item', name: '개발자 노트', emoji: '📝' }
                    },
                    special_gift: {
                        text: "당연하죠! 저를 찾아주신 분께는 특별한 선물을 드려야죠! 이건 개발팀만 가지고 있는 특별한 명함이에요! ✨",
                        reward: { type: 'special_item', name: '개발팀 골든 명함', emoji: '💳', rarity: 'legendary' }
                    },
                    behind_scenes: {
                        text: "실은... 이 게임에 숨겨진 기능들이 더 있어요! 코나미 코드는 발견하셨나요? 그리고 특정 시간에만 나타나는 NPC들도 있답니다! 🤫",
                        reward: { type: 'hint', name: '개발자 힌트', info: 'secret_features' }
                    },
                    repeat: {
                        text: "또 만나게 되었네요! 개발하면서 정말 재미있었어요. 앞으로도 더 재미있는 기능들을 추가할 예정이니 기대해 주세요! 🚀",
                        reward: { type: 'experience', amount: 500 }
                    }
                },
                rewards: {
                    first_discovery: {
                        items: ['개발팀 골든 명함', '개발자 사인'],
                        achievement: '🏆 개발자 발견!',
                        experience: 1000
                    }
                }
            },
            
            'legendary_intern': {
                id: 'legendary_intern',
                name: '전설의 인턴 김야근',
                emoji: '😴',
                description: '회사에서 가장 오래 야근한 전설적인 인턴',
                rarity: 'epic',
                spawnChance: 0.15,
                preferredFloors: ['floor_7', 'floor_8'],
                timeRestriction: { start: 18, end: 23 }, // 오후 6시~11시에만 출현
                dialogues: {
                    first: {
                        text: "아... 또 누군가 저를 찾으시네요. 안녕하세요, 저는 이 회사의 전설적인 인턴 김야근입니다... *하품* 😪",
                        choices: [
                            { text: "야근 비법을 알려주세요!", response: "overtime_tips" },
                            { text: "커피 추천 부탁드려요!", response: "coffee_tips" },
                            { text: "힘내세요! 응원합니다!", response: "encouragement" }
                        ]
                    },
                    overtime_tips: {
                        text: "야근의 비결은... 적당한 휴식과 간식이에요. 이 에너지 드링크 레시피를 드릴게요! 하지만 너무 무리하지는 마세요... 💪",
                        reward: { type: 'recipe', name: '야근 에너지 드링크', emoji: '🥤' }
                    },
                    coffee_tips: {
                        text: "7층 커피머신의 숨겨진 메뉴를 아시나요? 버튼을 특정 순서로 누르면... 어? 이건 비밀인데... 뭐, 알려드릴게요! ☕",
                        reward: { type: 'secret', name: '커피머신 히든 메뉴', info: 'coffee_sequence' }
                    },
                    encouragement: {
                        text: "고마워요... 정말 힘이 되네요. 이 야근 생존 키트를 드릴게요. 언젠가 도움이 될 거예요! 🎁",
                        reward: { type: 'item', name: '야근 생존 키트', emoji: '📦' }
                    }
                },
                rewards: {
                    first_discovery: {
                        items: ['야근 마스터 증명서'],
                        achievement: '🌙 야근의 신과 만나다',
                        experience: 750
                    }
                }
            },
            
            'company_cat': {
                id: 'company_cat',
                name: '회사 고양이 나비',
                emoji: '🐱',
                description: '회사의 마스코트 고양이, 힐링의 아이콘',
                rarity: 'rare',
                spawnChance: 0.25,
                preferredFloors: ['lobby', 'rooftop'], // 로비와 옥상 선호
                randomMovement: true, // 랜덤하게 움직임
                dialogues: {
                    first: {
                        text: "야옹~ 🐾 (회사 고양이 나비가 당신을 바라보며 꼬리를 흔들고 있습니다)",
                        choices: [
                            { text: "*쓰다듬기*", response: "pet" },
                            { text: "*간식 주기*", response: "treat" },
                            { text: "*가만히 지켜보기*", response: "observe" }
                        ]
                    },
                    pet: {
                        text: "골골골~ 😸 (나비가 기분 좋게 골골거리며 스트레스가 확 풀리는 느낌입니다)",
                        reward: { type: 'healing', amount: '100%', effect: 'stress_relief' }
                    },
                    treat: {
                        text: "냠냠~ 야옹! 🐟 (나비가 맛있게 간식을 먹고 고마워하며 특별한 선물을 가져옵니다)",
                        reward: { type: 'item', name: '행운의 고양이털', emoji: '🍀' }
                    },
                    observe: {
                        text: "야옹? 👀 (나비가 신비로운 장소로 안내하는 것 같습니다. 숨겨진 아이템이 있는 위치를 알려줍니다)",
                        reward: { type: 'location_hint', name: '나비의 비밀 장소', info: 'hidden_treasure' }
                    }
                },
                rewards: {
                    first_discovery: {
                        items: ['고양이 친구 증명서'],
                        achievement: '🐱 고양이와 친해지다',
                        experience: 300
                    }
                }
            },
            
            'mystery_janitor': {
                id: 'mystery_janitor',
                name: '미스터리 청소부 박비밀',
                emoji: '🧹',
                description: '회사의 모든 비밀을 아는 신비한 청소부',
                rarity: 'epic',
                spawnChance: 0.10,
                preferredFloors: ['floor_7', 'floor_8', 'floor_9'],
                timeRestriction: { start: 19, end: 6 }, // 야간에만 출현
                dialogues: {
                    first: {
                        text: "쉿... 조용히 하세요. 저는 이 회사의 모든 비밀을 아는 청소부입니다. 무엇을 찾고 계신가요? 🤫",
                        choices: [
                            { text: "숨겨진 보물 위치를 알려주세요!", response: "treasure_hint" },
                            { text: "회사의 비밀을 알려주세요!", response: "company_secrets" },
                            { text: "청소 노하우를 알려주세요!", response: "cleaning_tips" }
                        ]
                    },
                    treasure_hint: {
                        text: "흠... 9층 CEO실 뒤편에 숨겨진 금고가 있어요. 하지만 암호가 필요하죠. 힌트는... '휴넷의 창립년도'랍니다. 🗝️",
                        reward: { type: 'treasure_map', name: '보물 지도', location: 'ceo_safe' }
                    },
                    company_secrets: {
                        text: "이 회사에는... 직원들만 아는 비밀 통로가 있어요. 7층 프린터실 뒤쪽 벽을 자세히 보세요. 🚪",
                        reward: { type: 'secret_passage', name: '비밀 통로 정보', location: 'printer_room' }
                    },
                    cleaning_tips: {
                        text: "청소의 비결은 정성이에요. 이 특별한 청소 도구를 드릴게요. 숨겨진 아이템을 찾는 데 도움이 될 거예요! ✨",
                        reward: { type: 'tool', name: '마법의 청소 도구', emoji: '🔍' }
                    }
                },
                rewards: {
                    first_discovery: {
                        items: ['비밀 정보 수집가 증명서'],
                        achievement: '🕵️ 미스터리 마스터',
                        experience: 800
                    }
                }
            },
            
            'leaving_fairy': {
                id: 'leaving_fairy',
                name: '퇴근 요정 정시퇴',
                emoji: '🧚',
                description: '정시 퇴근의 중요성을 알려주는 신비한 요정',
                rarity: 'legendary',
                spawnChance: 0.05,
                preferredFloors: ['lobby', 'rooftop'],
                timeRestriction: { start: 17, end: 19 }, // 오후 5시~7시에만 출현
                dialogues: {
                    first: {
                        text: "안녕하세요! 저는 퇴근 요정이에요! 정시 퇴근의 소중함을 알려드리러 왔어요! ✨👼",
                        choices: [
                            { text: "퇴근 요령을 알려주세요!", response: "leaving_tips" },
                            { text: "워라밸 비결이 뭔가요?", response: "work_life_balance" },
                            { text: "퇴근 축복을 받고 싶어요!", response: "leaving_blessing" }
                        ]
                    },
                    leaving_tips: {
                        text: "퇴근의 비결은 미리미리 준비하는 것! 이 '스마트 퇴근 가이드'를 드릴게요. 효율적인 업무 마무리 방법이 담겨있어요! 📋",
                        reward: { type: 'guide', name: '스마트 퇴근 가이드', emoji: '📚' }
                    },
                    work_life_balance: {
                        text: "일과 삶의 균형은 행복의 열쇠에요! 이 '워라밸 마스터 키트'로 더 행복한 직장생활을 하세요! 🗝️✨",
                        reward: { type: 'kit', name: '워라밸 마스터 키트', emoji: '⚖️' }
                    },
                    leaving_blessing: {
                        text: "좋은 마음이네요! 퇴근 요정의 축복을 드릴게요! 앞으로 야근 없는 행복한 퇴근길이 되시길! 🌟",
                        reward: { type: 'blessing', name: '퇴근 요정의 축복', effect: 'productivity_boost' }
                    }
                },
                rewards: {
                    first_discovery: {
                        items: ['정시 퇴근 마스터 증명서'],
                        achievement: '🧚 퇴근 요정을 만나다',
                        experience: 1500
                    }
                }
            }
        };
    }

    // 안전한 타이머 설정
    setSafeTimeout(callback, delay) {
        const timerId = setTimeout(() => {
            this.spawnTimers.delete(timerId);
            callback();
        }, delay);
        this.spawnTimers.add(timerId);
        return timerId;
    }

    // 스폰 시스템 시작
    startSpawnSystem() {
        if (!this.isActive) return;

        const checkSpawn = () => {
            if (!this.isActive) return;
            
            this.checkSpecialNPCSpawn();
            
            // 다음 체크 예약
            this.setSafeTimeout(checkSpawn, this.spawnConfig.checkInterval);
        };

        // 첫 체크는 30초 후
        this.setSafeTimeout(checkSpawn, 30000);
    }

    // 특별 NPC 스폰 확인
    checkSpecialNPCSpawn() {
        // 현재 활성 NPC 수 확인
        if (this.activeSpecialNPCs.size >= this.spawnConfig.maxActiveNPCs) {
            return;
        }

        // 각 특별 NPC에 대해 스폰 확인
        for (const [npcId, npcConfig] of Object.entries(this.specialNPCs)) {
            if (this.activeSpecialNPCs.has(npcId)) continue; // 이미 활성화됨
            
            // 쿨다운 확인
            const lastSpawn = this.lastSpawnTime.get(npcId) || 0;
            if (Date.now() - lastSpawn < this.spawnConfig.cooldownTime) continue;
            
            // 시간 제한 확인
            if (!this.checkTimeRestriction(npcConfig)) continue;
            
            // 스폰 확률 계산
            const spawnChance = npcConfig.spawnChance || this.spawnConfig.baseSpawnChance;
            if (Math.random() > spawnChance) continue;
            
            // 스폰 실행
            this.spawnSpecialNPC(npcId, npcConfig);
            break; // 한 번에 하나씩만 스폰
        }
    }

    // 시간 제한 확인
    checkTimeRestriction(npcConfig) {
        if (!npcConfig.timeRestriction) return true;
        
        const now = new Date();
        const currentHour = now.getHours();
        const { start, end } = npcConfig.timeRestriction;
        
        if (start <= end) {
            // 일반적인 경우 (예: 9시~18시)
            return currentHour >= start && currentHour <= end;
        } else {
            // 자정을 넘나드는 경우 (예: 19시~6시)
            return currentHour >= start || currentHour <= end;
        }
    }

    // 특별 NPC 스폰
    spawnSpecialNPC(npcId, npcConfig) {
        const spawnLocation = this.findSpawnLocation(npcConfig);
        if (!spawnLocation) return;

        // NPC 생성
        const specialNPC = {
            id: npcId,
            config: npcConfig,
            location: spawnLocation,
            spawnTime: Date.now(),
            discovered: false,
            interactionCount: 0
        };

        // 맵에 NPC 추가
        this.addNPCToMap(specialNPC);
        
        this.activeSpecialNPCs.set(npcId, specialNPC);
        this.lastSpawnTime.set(npcId, Date.now());

        console.log(`✨ 특별 NPC 스폰: ${npcConfig.name} (${spawnLocation.floor})`);

        // 힌트 제공 (legendary 등급만)
        if (npcConfig.rarity === 'legendary') {
            this.setSafeTimeout(() => {
                this.gameInstance.inventory?.showItemNotification({
                    name: `🔍 어딘가에 특별한 존재가 나타났습니다...`,
                    duration: 3000
                });
            }, 5000);
        }

        // 자동 소멸 타이머
        this.setSafeTimeout(() => {
            this.despawnSpecialNPC(npcId);
        }, this.spawnConfig.npcLifetime);
    }

    // 스폰 위치 찾기
    findSpawnLocation(npcConfig) {
        const availableFloors = npcConfig.preferredFloors || ['lobby', 'floor_7', 'floor_8', 'floor_9', 'rooftop'];
        const targetFloor = availableFloors[Math.floor(Math.random() * availableFloors.length)];
        
        // 해당 층의 사용 가능한 위치들
        const floorPositions = this.getFloorPositions(targetFloor, npcConfig.hiddenSpots);
        
        if (floorPositions.length === 0) return null;
        
        const position = floorPositions[Math.floor(Math.random() * floorPositions.length)];
        
        return {
            floor: targetFloor,
            x: position.x,
            y: position.y
        };
    }

    // 층별 위치 정보
    getFloorPositions(floor, preferHidden = false) {
        const positions = {
            'lobby': [
                { x: 8, y: 8 }, { x: 32, y: 8 }, { x: 15, y: 20 }, { x: 25, y: 20 },
                { x: 5, y: 15 }, { x: 35, y: 15 } // 로비 구석진 곳들
            ],
            'floor_7': [
                { x: 6, y: 6 }, { x: 34, y: 6 }, { x: 8, y: 22 }, { x: 32, y: 22 },
                { x: 12, y: 12 }, { x: 28, y: 12 }, { x: 20, y: 18 } // 사무실 구석
            ],
            'floor_8': [
                { x: 10, y: 8 }, { x: 30, y: 8 }, { x: 12, y: 20 }, { x: 28, y: 20 },
                { x: 18, y: 10 }, { x: 22, y: 16 } // 회의실 주변
            ],
            'floor_9': [
                { x: 15, y: 10 }, { x: 25, y: 10 }, { x: 18, y: 18 }, { x: 22, y: 18 },
                { x: 8, y: 12 }, { x: 32, y: 12 } // 임원실 주변
            ],
            'rooftop': [
                { x: 10, y: 10 }, { x: 30, y: 10 }, { x: 15, y: 20 }, { x: 25, y: 20 },
                { x: 20, y: 8 }, { x: 20, y: 22 } // 옥상 전체
            ]
        };

        return positions[floor] || [];
    }

    // 맵에 NPC 추가
    addNPCToMap(specialNPC) {
        const mapData = this.mapManager.getMapData(specialNPC.location.floor);
        if (!mapData || !mapData.npcs) return;

        const npcData = {
            id: specialNPC.id,
            name: specialNPC.config.name,
            emoji: specialNPC.config.emoji,
            x: specialNPC.location.x,
            y: specialNPC.location.y,
            description: specialNPC.config.description,
            isSpecial: true,
            rarity: specialNPC.config.rarity,
            dialogue: specialNPC.config.dialogues.first
        };

        mapData.npcs.push(npcData);
    }

    // 특별 NPC 소멸
    despawnSpecialNPC(npcId) {
        const specialNPC = this.activeSpecialNPCs.get(npcId);
        if (!specialNPC) return;

        // 맵에서 제거
        this.removeNPCFromMap(specialNPC);
        
        this.activeSpecialNPCs.delete(npcId);

        console.log(`👻 특별 NPC 소멸: ${specialNPC.config.name}`);

        // 발견하지 못했을 때 힌트
        if (!specialNPC.discovered && specialNPC.config.rarity === 'legendary') {
            this.gameInstance.inventory?.showItemNotification({
                name: `👻 특별한 존재가 사라져갔습니다...`,
                duration: 2000
            });
        }
    }

    // 맵에서 NPC 제거
    removeNPCFromMap(specialNPC) {
        const mapData = this.mapManager.getMapData(specialNPC.location.floor);
        if (!mapData || !mapData.npcs) return;

        const index = mapData.npcs.findIndex(npc => npc.id === specialNPC.id);
        if (index !== -1) {
            mapData.npcs.splice(index, 1);
        }
    }

    // 특별 NPC와 상호작용
    interactWithSpecialNPC(npcId) {
        const specialNPC = this.activeSpecialNPCs.get(npcId);
        if (!specialNPC) return null;

        // 첫 발견 처리
        if (!specialNPC.discovered) {
            specialNPC.discovered = true;
            this.discoveredNPCs.add(npcId);
            this.processFirstDiscovery(specialNPC);
        }

        specialNPC.interactionCount++;
        
        return this.getDialogueResponse(specialNPC);
    }

    // 첫 발견 처리
    processFirstDiscovery(specialNPC) {
        const config = specialNPC.config;
        const rewards = config.rewards?.first_discovery;

        if (rewards) {
            // 경험치 지급
            if (rewards.experience) {
                this.gameInstance.gameState?.addExperience?.(rewards.experience);
            }

            // 아이템 지급
            if (rewards.items) {
                rewards.items.forEach(item => {
                    this.gameInstance.gameState?.addItem?.(item);
                });
            }

            // 업적 달성
            if (rewards.achievement) {
                this.gameInstance.inventory?.showItemNotification({
                    name: rewards.achievement,
                    duration: 4000
                });
            }

            // 특별 파티클 효과
            this.createDiscoveryEffect(specialNPC);
        }

        console.log(`🎉 특별 NPC 첫 발견: ${config.name}`);
    }

    // 발견 특별 효과
    createDiscoveryEffect(specialNPC) {
        if (!this.particleSystem) return;

        const colors = {
            'legendary': '💫',
            'epic': '⭐',
            'rare': '✨'
        };

        const effect = colors[specialNPC.config.rarity] || '✨';
        
        // 화면 중앙에 축하 파티클
        for (let i = 0; i < 10; i++) {
            this.setSafeTimeout(() => {
                const x = this.gameInstance.canvas.width / 2 + (Math.random() - 0.5) * 200;
                const y = this.gameInstance.canvas.height / 2 + (Math.random() - 0.5) * 200;
                this.particleSystem.createRewardEffect(x, y, effect);
            }, i * 100);
        }

        // 음향 효과
        if (this.audioManager) {
            this.audioManager.playGameComplete?.();
        }
    }

    // 대화 응답 가져오기
    getDialogueResponse(specialNPC) {
        const config = specialNPC.config;
        
        if (specialNPC.interactionCount === 1) {
            return config.dialogues.first;
        } else {
            return config.dialogues.repeat || config.dialogues.first;
        }
    }

    // 선택지 처리
    processChoice(npcId, choiceResponse) {
        const specialNPC = this.activeSpecialNPCs.get(npcId);
        if (!specialNPC) return null;

        const dialogue = specialNPC.config.dialogues[choiceResponse];
        if (!dialogue) return null;

        // 보상 처리
        if (dialogue.reward) {
            this.processReward(dialogue.reward);
        }

        return dialogue;
    }

    // 보상 처리
    processReward(reward) {
        switch (reward.type) {
            case 'item':
            case 'special_item':
                this.gameInstance.gameState?.addItem?.(reward.name);
                this.gameInstance.inventory?.showItemNotification({
                    name: `${reward.emoji || '🎁'} ${reward.name}을(를) 받았습니다!`,
                    duration: 3000
                });
                break;
                
            case 'experience':
                this.gameInstance.gameState?.addExperience?.(reward.amount);
                this.gameInstance.inventory?.showItemNotification({
                    name: `✨ 경험치 +${reward.amount}`,
                    duration: 2000
                });
                break;
                
            case 'healing':
                this.gameInstance.inventory?.showItemNotification({
                    name: `💚 ${reward.effect} - 기분이 좋아집니다!`,
                    duration: 3000
                });
                break;
                
            case 'hint':
            case 'secret':
                this.gameInstance.inventory?.showItemNotification({
                    name: `🔍 ${reward.name}을(를) 얻었습니다!`,
                    duration: 3000
                });
                break;
                
            default:
                this.gameInstance.inventory?.showItemNotification({
                    name: `🎁 ${reward.name}`,
                    duration: 2000
                });
        }
    }

    // 현재 활성 특별 NPC 목록
    getActiveSpecialNPCs() {
        return Array.from(this.activeSpecialNPCs.values()).map(npc => ({
            id: npc.id,
            name: npc.config.name,
            location: npc.location,
            rarity: npc.config.rarity,
            discovered: npc.discovered
        }));
    }

    // 발견한 특별 NPC 통계
    getDiscoveryStats() {
        return {
            discovered: this.discoveredNPCs.size,
            total: Object.keys(this.specialNPCs).length,
            discoveredList: Array.from(this.discoveredNPCs)
        };
    }

    // 시스템 정리
    destroy() {
        this.isActive = false;
        
        // 모든 활성 NPC 제거
        for (const npcId of this.activeSpecialNPCs.keys()) {
            this.despawnSpecialNPC(npcId);
        }
        
        // 타이머 정리
        this.spawnTimers.forEach(timerId => clearTimeout(timerId));
        this.spawnTimers.clear();
    }
}