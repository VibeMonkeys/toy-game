import { CONSTANTS } from '../utils/Constants.js';

export class MapData {
    static generateWalls() {
        const walls = [];
        for (let x = 0; x < 40; x++) {
            walls.push({x: x, y: 0});
            walls.push({x: x, y: 29});
        }
        for (let y = 0; y < 30; y++) {
            walls.push({x: 0, y: y});
            walls.push({x: 39, y: y});
        }
        return walls;
    }

    static generateOfficeItems() {
        return {
            desks: [],
            chairs: [],
            computers: [],
            monitors: [],
            keyboards: [],
            plants: [],
            printers: [],
            meetingTables: [],
            elevatorDoors: [],
            // 새로운 상호작용 오브젝트들
            vendingMachines: [],
            interactableComputers: [],
            interactablePrinters: [],
            whiteboards: [],
            coffeeMachines: []
        };
    }

    static getAllMaps() {
        const officeItems = this.generateOfficeItems();

        return {
            [CONSTANTS.MAPS.LOBBY]: {
                name: 'Lobby',
                background: '#F0F8FF',
                walls: this.generateWalls(),
                officeItems: {
                    ...officeItems,
                    // 로비에는 화분과 기본적인 로비 가구만
                    plants: [
                        {x: 5, y: 5}, {x: 30, y: 5}, {x: 5, y: 25}, {x: 30, y: 25},
                        {x: 10, y: 15}, {x: 25, y: 15}, {x: 15, y: 8}, {x: 20, y: 22}
                    ],
                    elevatorDoors: [
                        {x: 34, y: 14}, {x: 35, y: 14}, {x: 36, y: 14}, {x: 37, y: 14},
                        {x: 34, y: 15}, {x: 35, y: 15}, {x: 36, y: 15}, {x: 37, y: 15},
                        {x: 34, y: 16}, {x: 35, y: 16}, {x: 36, y: 16}, {x: 37, y: 16}
                    ],
                    // 로비에는 데스크, 의자, 컴퓨터 제거
                    // 상호작용 오브젝트들 - 로비에 적절한 것들만
                    vendingMachines: [
                        {x: 2, y: 10, type: 'drink'}, // 음료 자판기
                        {x: 2, y: 20, type: 'snack'}  // 간식 자판기
                    ],
                    // 로비 안내 컴퓨터 제거 - 실제 로비에는 부적절
                    coffeeMachines: [
                        {x: 32, y: 8} // 커피머신
                    ]
                },
                npcs: [
                    {
                        id: 'reception',
                        name: '안내 데스크 직원',
                        x: 15, y: 15,
                        dialog: ['환영합니다! 휴넷 26주년 기념 게임에 참여해주셔서 감사합니다.', '먼저 입장 패스를 찾아서 경비 아저씨에게 보여주세요!'],
                        questGiver: true,
                        questId: 1
                    },
                    {
                        id: 'guard',
                        name: '경비 아저씨',
                        x: 32, y: 18,
                        dialog: ['입장 패스를 가져오셨나요?', '확인되었습니다. 이제 건물을 자유롭게 이용하실 수 있어요!'],
                        questGiver: true,
                        questId: 0
                    },
                    {
                        id: 'arcade_master',
                        name: '아케이드 마스터',
                        x: 20, y: 8,
                        dialog: ['안녕하세요! 휴넷 아케이드에 오신 걸 환영합니다!', '스트레스 해소용 미니게임을 즐겨보세요!', '메모리 게임과 스네이크 게임이 준비되어 있어요!'],
                        questGiver: true,
                        questId: 114,
                        specialAction: 'arcade'
                    },
                    {
                        id: 'visitor_1',
                        name: '회사 방문객',
                        x: 8, y: 18,
                        dialog: ['처음 방문인데 건물이 정말 크네요!', '휴넷은 정말 유명한 회사라고 들었어요.', '미팅 시간까지 좀 기다려야겠어요.'],
                        questGiver: true,
                        questId: 101
                    },
                    {
                        id: 'cleaning_staff',
                        name: '청소 아주머니',
                        x: 25, y: 12,
                        dialog: ['오늘은 26주년 기념일이니까 특별히 더 깨끗하게 청소했어요!', '26년 동안 이 회사가 얼마나 발전했는지 보면 신기해요.', '처음 입사했을 때는 직원이 5명뿐이었는데... 이제는 정말 큰 회사가 됐네요!'],
                        questGiver: true,
                        questId: 115
                    },
                    {
                        id: 'delivery_person',
                        name: '택배 기사',
                        x: 28, y: 25,
                        dialog: ['26주년 축하 선물 배달 왔어요!', '이 회사 직원들이 정말 친절해서 배달하기 좋아요.', '아, 그런데 오늘은 26주년 파티 때문에 모든 게 특별하네요!'],
                        questGiver: true,
                        questId: 100
                    },
                    {
                        id: 'job_applicant',
                        name: '면접 지원자',
                        x: 12, y: 23,
                        dialog: ['26주년 기념일에 면접이라니, 정말 특별한 날이네요!', '휴넷이 26년간 성장한 모습을 보니 저도 이 회사의 일원이 되고 싶어요.', '면접관님들도 오늘은 기분이 좋으실 것 같아요!'],
                        questGiver: true,
                        questId: 108
                    },
                    {
                        id: 'maintenance_worker',
                        name: '시설 관리자',
                        x: 6, y: 8,
                        dialog: ['26주년 기념일이니까 모든 시설을 완벽하게 점검했어요!', '이 건물도 휴넷과 함께 26년을 버텨왔네요.', '오늘은 특별한 날이니까 엘리베이터도 더 부드럽게 작동할 거예요!'],
                        questGiver: true,
                        questId: 105
                    }
                ],
                items: [
                    // 1층 퀘스트 아이템
                    { x: 10, y: 10, type: 'treasure', name: '입장 패스', icon: '🎫', description: '휴넷 26주년 게임 입장 패스' },
                    { x: 25, y: 20, type: 'treasure', name: '26주년 기념 메달', icon: '🏅', description: '휴넷 26주년을 기념하는 특별한 메달' },

                    // 추가 아이템
                    { x: 15, y: 15, type: 'treasure', name: '동전', icon: '🪙', description: '1000원 동전' },
                    { x: 30, y: 10, type: 'treasure', name: '회사 팜플렛', icon: '📄', description: '휴넷 소개 자료' },
                    { x: 8, y: 25, type: 'treasure', name: '방명록', icon: '📓', description: '방문자 방명록' }
                ],
                portals: [
                    {
                        name: '스타벅스',
                        x: 6, y: 6,
                        targetMap: CONSTANTS.MAPS.STARBUCKS,
                        targetX: 20, targetY: 25,
                        icon: '☕'
                    },
                    {
                        name: '메머드 커피',
                        x: 31, y: 6,
                        targetMap: CONSTANTS.MAPS.MAMMOTH_COFFEE,
                        targetX: 20, targetY: 25,
                        icon: '🦣'
                    },
                    {
                        name: '국밥집 92소',
                        x: 6, y: 24,
                        targetMap: CONSTANTS.MAPS.KOOK_BAB_92,
                        targetX: 20, targetY: 25,
                        icon: '🍲'
                    },
                    {
                        name: '팀홀튼',
                        x: 31, y: 24,
                        targetMap: CONSTANTS.MAPS.TIM_HORTONS,
                        targetX: 20, targetY: 25,
                        icon: '🍩'
                    }
                ],
                elevatorPanel: { x: 35, y: 15 }
            },
            [CONSTANTS.MAPS.FLOOR_7_CORRIDOR]: {
                name: '7층 복도',
                background: '#F5F5DC',
                walls: this.generateWalls(),
                officeItems: {
                    ...officeItems,
                    elevatorDoors: [
                        {x: 18, y: 7}, {x: 19, y: 7}, {x: 20, y: 7}, {x: 21, y: 7}, {x: 22, y: 7}
                    ],
                    // 복도에는 데스크, 의자 제거 - 화분이나 벤치 정도만
                    plants: [
                        {x: 10, y: 12}, {x: 30, y: 12}, {x: 10, y: 18}, {x: 30, y: 18}
                    ],
                    // 상호작용 오브젝트들
                    interactablePrinters: [
                        {x: 35, y: 12, type: 'office'} // 사무용 프린터
                    ],
                    interactableComputers: [
                        {x: 6, y: 18, type: 'office'} // 업무용 컴퓨터
                    ],
                    vendingMachines: [
                        {x: 2, y: 15, type: 'drink'} // 음료 자판기
                    ],
                    whiteboards: [
                        {x: 15, y: 3}, // 화이트보드
                        {x: 25, y: 27}
                    ]
                },
                npcs: [
                    {
                        id: 'kim_deputy',
                        name: '김대리',
                        x: 12, y: 10,
                        dialog: ['26주년 축하합니다! 저는 김대리예요.', '업무 보고서를 찾아주세요!', '7층 복도 어딘가에 있을 거예요.'],
                        questGiver: true,
                        questId: 2
                    },
                    {
                        id: 'office_worker_2',
                        name: '박직원',
                        x: 32, y: 20,
                        dialog: ['계약서를 찾아주세요!', '709호 계열사에 있을 거예요.', '중요한 계약서라서 꼭 필요해요.'],
                        questGiver: true,
                        questId: 4
                    },
                    {
                        id: 'intern',
                        name: '인턴',
                        x: 25, y: 15,
                        dialog: ['프로젝트 파일이 필요해요!', '710호 본사 IT에 있을 거예요.', '도와주시면 감사하겠습니다!'],
                        questGiver: true,
                        questId: 3
                    },
                    {
                        id: 'hr_manager',
                        name: '인사팀 최과장',
                        x: 8, y: 15,
                        dialog: ['인사팀에서 왔어요.', '신입사원 교육 자료를 준비 중이에요.', '오늘도 바쁜 하루네요!'],
                        questGiver: false,
                        questId: null
                    },
                    {
                        id: 'developer_1',
                        name: '개발팀 이선임',
                        x: 15, y: 12,
                        dialog: ['코딩하느라 목이 아파요.', '커피 한 잔 마시고 와야겠어요.', '이번 프로젝트 마감이 촉박해서...'],
                        questGiver: true,
                        questId: 102
                    },
                    {
                        id: 'marketing_staff',
                        name: '마케팅팀 정대리',
                        x: 28, y: 12,
                        dialog: ['26주년 이벤트 기획하고 있어요.', '많은 분들이 참여해주셔서 감사해요!', '보물찾기 재미있으시죠?'],
                        questGiver: false,
                        questId: null
                    },
                    {
                        id: 'sales_rep',
                        name: '영업팀 강주임',
                        x: 35, y: 15,
                        dialog: ['고객사 미팅 준비 중이에요.', '휴넷 교육 서비스 홍보하러 가야죠.', '영업이 쉽지 않네요...'],
                        questGiver: false,
                        questId: null
                    },
                    {
                        id: 'office_newbie',
                        name: '신입사원 윤씨',
                        x: 20, y: 18,
                        dialog: ['입사한 지 일주일 됐어요!', '아직 모르는 게 너무 많아요.', '선배님들이 친절하게 도와주세요.'],
                        questGiver: true,
                        questId: 106
                    }
                ],
                items: [
                    // 7층 퀘스트 아이템 (여러 위치에 배치해서 찾기 쉽게)
                    { x: 20, y: 15, type: 'treasure', name: '업무 보고서', icon: '📋', description: '김대리가 요청한 업무 보고서' },

                    // 추가 보물 아이템
                    { x: 10, y: 10, type: 'treasure', name: '동전', icon: '🪙', description: '500원 동전' },
                    { x: 30, y: 20, type: 'treasure', name: '열쇠', icon: '🔑', description: '사무실 열쇠' },
                    { x: 15, y: 25, type: 'treasure', name: '메모지', icon: '📝', description: '중요한 메모' }
                ],
                portals: [
                    { x: 5, y: 10, targetMap: CONSTANTS.MAPS.FLOOR_7_709_AFFILIATES, targetX: 35, targetY: 15, name: '709호 계열사' },
                    { x: 35, y: 20, targetMap: CONSTANTS.MAPS.FLOOR_7_710_MAIN_IT, targetX: 5, targetY: 15, name: '710호 본사 IT' }
                ],
                elevatorPanel: { x: 20, y: 8 }
            },
            [CONSTANTS.MAPS.FLOOR_7_709_AFFILIATES]: {
                name: '709호 계열사',
                background: '#F0F8FF',
                walls: this.generateWalls(),
                officeItems: {
                    ...officeItems,
                    desks: [
                        {x: 10, y: 10}, {x: 20, y: 10}, {x: 30, y: 10},
                        {x: 10, y: 15}, {x: 20, y: 15}, {x: 30, y: 15},
                        {x: 10, y: 20}, {x: 20, y: 20}, {x: 30, y: 20}
                    ],
                    chairs: [
                        {x: 11, y: 10}, {x: 21, y: 10}, {x: 31, y: 10},
                        {x: 11, y: 15}, {x: 21, y: 15}, {x: 31, y: 15},
                        {x: 11, y: 20}, {x: 21, y: 20}, {x: 31, y: 20}
                    ],
                    computers: [
                        {x: 10, y: 9}, {x: 20, y: 9}, {x: 30, y: 9},
                        {x: 10, y: 14}, {x: 20, y: 14}, {x: 30, y: 14},
                        {x: 10, y: 19}, {x: 20, y: 19}, {x: 30, y: 19}
                    ]
                },
                npcs: [
                    {
                        id: 'affiliate_manager',
                        name: '계열사 관리자',
                        x: 15, y: 12,
                        dialog: ['계열사 업무를 담당하고 있습니다.', '휴넷 그룹의 다양한 계열사들과 협업하고 있어요.'],
                        questGiver: false,
                        questId: null
                    }
                ],
                items: [
                    { x: 20, y: 15, type: 'treasure', name: '중요 계약서', icon: '📂', description: '박직원이 필요한 계약서' },
                    { x: 10, y: 10, type: 'treasure', name: '계열사 소개서', icon: '📚', description: '계열사 소개 자료' },
                    { x: 30, y: 20, type: 'treasure', name: '명함', icon: '💳', description: '계열사 직원 명함' }
                ],
                portals: [
                    { x: 35, y: 15, targetMap: CONSTANTS.MAPS.FLOOR_7_CORRIDOR, targetX: 5, targetY: 10, name: '복도로' }
                ]
            },
            [CONSTANTS.MAPS.FLOOR_7_710_MAIN_IT]: {
                name: '710호 본사 IT',
                background: '#F0F0F0',
                walls: this.generateWalls(),
                officeItems: {
                    ...officeItems,
                    desks: [
                        {x: 8, y: 8}, {x: 15, y: 8}, {x: 22, y: 8}, {x: 29, y: 8},
                        {x: 8, y: 13}, {x: 15, y: 13}, {x: 22, y: 13}, {x: 29, y: 13},
                        {x: 8, y: 18}, {x: 15, y: 18}, {x: 22, y: 18}, {x: 29, y: 18},
                        {x: 8, y: 23}, {x: 15, y: 23}, {x: 22, y: 23}, {x: 29, y: 23}
                    ],
                    chairs: [
                        {x: 9, y: 8}, {x: 16, y: 8}, {x: 23, y: 8}, {x: 30, y: 8},
                        {x: 9, y: 13}, {x: 16, y: 13}, {x: 23, y: 13}, {x: 30, y: 13},
                        {x: 9, y: 18}, {x: 16, y: 18}, {x: 23, y: 18}, {x: 30, y: 18},
                        {x: 9, y: 23}, {x: 16, y: 23}, {x: 23, y: 23}, {x: 30, y: 23}
                    ],
                    computers: [
                        {x: 8, y: 7}, {x: 15, y: 7}, {x: 22, y: 7}, {x: 29, y: 7},
                        {x: 8, y: 12}, {x: 15, y: 12}, {x: 22, y: 12}, {x: 29, y: 12},
                        {x: 8, y: 17}, {x: 15, y: 17}, {x: 22, y: 17}, {x: 29, y: 17},
                        {x: 8, y: 22}, {x: 15, y: 22}, {x: 22, y: 22}, {x: 29, y: 22}
                    ],
                    printers: [
                        {x: 33, y: 10}, {x: 33, y: 20}
                    ]
                },
                npcs: [
                    {
                        id: 'it_developer',
                        name: 'IT 개발자',
                        x: 12, y: 10,
                        dialog: ['휴넷의 IT 시스템을 개발하고 있습니다.', '26주년 기념 게임도 저희가 만들고 있어요!'],
                        questGiver: false,
                        questId: null
                    },
                    {
                        id: 'it_manager',
                        name: 'IT 팀장',
                        x: 25, y: 15,
                        dialog: ['본사 IT 업무를 총괄하고 있습니다.', '기술 혁신으로 휴넷의 미래를 만들어가고 있어요.'],
                        questGiver: false,
                        questId: null
                    }
                ],
                items: [
                    { x: 20, y: 15, type: 'treasure', name: '프로젝트 파일', icon: '📁', description: '인턴이 필요한 프로젝트 파일' },
                    { x: 12, y: 20, type: 'treasure', name: 'IT팀 소개서', icon: '💻', description: 'IT팀 소개 자료' },
                    { x: 25, y: 10, type: 'treasure', name: 'USB', icon: '💾', description: '중요한 데이터 USB' }
                ],
                portals: [
                    { x: 5, y: 15, targetMap: CONSTANTS.MAPS.FLOOR_7_CORRIDOR, targetX: 35, targetY: 20, name: '복도로' }
                ]
            },
            [CONSTANTS.MAPS.FLOOR_8_CORRIDOR]: {
                name: '8층 복도',
                background: '#E6E6FA',
                walls: this.generateWalls(),
                officeItems: {
                    ...officeItems,
                    elevatorDoors: [
                        {x: 18, y: 28}, {x: 19, y: 28}, {x: 20, y: 28}, {x: 21, y: 28}, {x: 22, y: 28}
                    ],
                    // 복도에는 화분만 - 데스크, 의자 제거
                    plants: [
                        {x: 5, y: 5}, {x: 35, y: 5}, {x: 5, y: 25}, {x: 35, y: 25},
                        {x: 10, y: 15}, {x: 30, y: 15}
                    ]
                },
                npcs: [
                    {
                        id: 'floor_coordinator',
                        name: '8층 안내원',
                        x: 20, y: 15,
                        dialog: ['8층 각 본부로 안내해드릴게요!', '왼쪽에 IT본부와 인경실, 오른쪽에 다른 본부들이 있어요.'],
                        questGiver: false,
                        questId: null
                    },
                    {
                        id: 'manager_lee',
                        name: '팀장 이씨',
                        x: 20, y: 20,
                        dialog: ['회의 자료를 준비해주세요!', '회의록과 프레젠테이션이 모두 필요합니다.'],
                        questGiver: true,
                        questId: 5
                    }
                ],
                items: [
                    { x: 12, y: 15, type: 'treasure', name: '회의록', icon: '📋', description: '8층 중요 회의록' },
                    { x: 28, y: 18, type: 'treasure', name: '프레젠테이션', icon: '📊', description: '8층 프레젠테이션 자료' },
                    { x: 20, y: 10, type: 'treasure', name: '8층 보고서', icon: '📄', description: '8층 월간 보고서' },
                    { x: 15, y: 25, type: 'treasure', name: '커피 쿠폰', icon: '☕', description: '스타벅스 커피 쿠폰' }
                ],
                portals: [
                    { x: 5, y: 8, targetMap: CONSTANTS.MAPS.FLOOR_8_IT_DIVISION, targetX: 35, targetY: 15, name: 'IT본부' },
                    { x: 5, y: 15, targetMap: CONSTANTS.MAPS.FLOOR_8_HR_OFFICE, targetX: 35, targetY: 15, name: '인경실' },
                    { x: 5, y: 22, targetMap: CONSTANTS.MAPS.FLOOR_8_AI_RESEARCH, targetX: 35, targetY: 15, name: '인공지능연구소' },
                    { x: 35, y: 8, targetMap: CONSTANTS.MAPS.FLOOR_8_EDUCATION_SERVICE, targetX: 5, targetY: 15, name: '교육서비스본부' },
                    { x: 35, y: 22, targetMap: CONSTANTS.MAPS.FLOOR_8_SALES_SUPPORT, targetX: 5, targetY: 15, name: '영업+교육지원본부' }
                ],
                elevatorPanel: { x: 20, y: 29 }
            },
            [CONSTANTS.MAPS.FLOOR_8_IT_DIVISION]: {
                name: 'IT본부',
                background: '#F0F0FF',
                walls: this.generateWalls(),
                officeItems: {
                    ...officeItems,
                    desks: [
                        {x: 8, y: 8}, {x: 15, y: 8}, {x: 22, y: 8}, {x: 29, y: 8},
                        {x: 8, y: 13}, {x: 15, y: 13}, {x: 22, y: 13}, {x: 29, y: 13},
                        {x: 8, y: 18}, {x: 15, y: 18}, {x: 22, y: 18}, {x: 29, y: 18},
                        {x: 8, y: 23}, {x: 15, y: 23}, {x: 22, y: 23}, {x: 29, y: 23}
                    ],
                    chairs: [
                        {x: 9, y: 8}, {x: 16, y: 8}, {x: 23, y: 8}, {x: 30, y: 8},
                        {x: 9, y: 13}, {x: 16, y: 13}, {x: 23, y: 13}, {x: 30, y: 13},
                        {x: 9, y: 18}, {x: 16, y: 18}, {x: 23, y: 18}, {x: 30, y: 18},
                        {x: 9, y: 23}, {x: 16, y: 23}, {x: 23, y: 23}, {x: 30, y: 23}
                    ],
                    computers: [
                        {x: 8, y: 7}, {x: 15, y: 7}, {x: 22, y: 7}, {x: 29, y: 7},
                        {x: 8, y: 12}, {x: 15, y: 12}, {x: 22, y: 12}, {x: 29, y: 12},
                        {x: 8, y: 17}, {x: 15, y: 17}, {x: 22, y: 17}, {x: 29, y: 17},
                        {x: 8, y: 22}, {x: 15, y: 22}, {x: 22, y: 22}, {x: 29, y: 22}
                    ],
                    printers: [
                        {x: 33, y: 10}, {x: 33, y: 20}
                    ]
                },
                npcs: [
                    {
                        id: 'it_division_head',
                        name: 'IT본부장',
                        x: 20, y: 10,
                        dialog: ['IT본부에 오신 걸 환영합니다!', '휴넷의 모든 기술 혁신이 여기서 시작됩니다.'],
                        questGiver: false,
                        questId: null
                    },
                    {
                        id: 'senior_developer',
                        name: '선임 개발자',
                        x: 12, y: 15,
                        dialog: ['새로운 플랫폼 개발에 한창이에요.', '26주년을 맞아 기술적 도약을 준비하고 있습니다.'],
                        questGiver: false,
                        questId: null
                    }
                ],
                items: [
                    { x: 25, y: 15, type: 'treasure', name: '기획팀 메시지' }
                ],
                portals: [
                    { x: 35, y: 15, targetMap: CONSTANTS.MAPS.FLOOR_8_CORRIDOR, targetX: 5, targetY: 8, name: '복도로' }
                ]
            },
            [CONSTANTS.MAPS.FLOOR_8_HR_OFFICE]: {
                name: '인경실',
                background: '#FFF0F0',
                walls: this.generateWalls(),
                officeItems: {
                    ...officeItems,
                    desks: [
                        {x: 15, y: 12}, {x: 25, y: 12},
                        {x: 15, y: 18}, {x: 25, y: 18}
                    ],
                    chairs: [
                        {x: 16, y: 12}, {x: 26, y: 12},
                        {x: 16, y: 18}, {x: 26, y: 18}
                    ],
                    computers: [
                        {x: 15, y: 11}, {x: 25, y: 11},
                        {x: 15, y: 17}, {x: 25, y: 17}
                    ]
                },
                npcs: [
                    {
                        id: 'hr_manager',
                        name: '인사 팀장',
                        x: 20, y: 15,
                        dialog: ['인사팀에서 직원 복지를 담당하고 있어요.', '26주년을 맞아 특별한 이벤트를 준비했답니다!'],
                        questGiver: false,
                        questId: null
                    }
                ],
                items: [
                    { x: 20, y: 20, type: 'treasure', name: '인사팀 메시지' }
                ],
                portals: [
                    { x: 35, y: 15, targetMap: CONSTANTS.MAPS.FLOOR_8_CORRIDOR, targetX: 5, targetY: 15, name: '복도로' }
                ]
            },
            [CONSTANTS.MAPS.FLOOR_8_AI_RESEARCH]: {
                name: '인공지능연구소',
                background: '#F0FFF0',
                walls: this.generateWalls(),
                officeItems: {
                    ...officeItems,
                    desks: [
                        {x: 12, y: 10}, {x: 28, y: 10},
                        {x: 12, y: 20}, {x: 28, y: 20}
                    ],
                    chairs: [
                        {x: 13, y: 10}, {x: 29, y: 10},
                        {x: 13, y: 20}, {x: 29, y: 20}
                    ],
                    computers: [
                        {x: 12, y: 9}, {x: 28, y: 9},
                        {x: 12, y: 19}, {x: 28, y: 19}
                    ]
                },
                npcs: [
                    {
                        id: 'ai_researcher',
                        name: 'AI 연구원',
                        x: 20, y: 15,
                        dialog: ['인공지능 기술 연구에 몰두하고 있어요.', '미래 교육의 새로운 패러다임을 만들어가고 있습니다.'],
                        questGiver: false,
                        questId: null
                    }
                ],
                items: [],
                portals: [
                    { x: 35, y: 15, targetMap: CONSTANTS.MAPS.FLOOR_8_CORRIDOR, targetX: 5, targetY: 22, name: '복도로' }
                ]
            },
            [CONSTANTS.MAPS.FLOOR_8_EDUCATION_SERVICE]: {
                name: '교육서비스본부',
                background: '#FFFFF0',
                walls: this.generateWalls(),
                officeItems: {
                    ...officeItems,
                    desks: [
                        {x: 8, y: 8}, {x: 18, y: 8}, {x: 28, y: 8},
                        {x: 8, y: 13}, {x: 18, y: 13}, {x: 28, y: 13},
                        {x: 8, y: 18}, {x: 18, y: 18}, {x: 28, y: 18},
                        {x: 8, y: 23}, {x: 18, y: 23}, {x: 28, y: 23}
                    ],
                    chairs: [
                        {x: 9, y: 8}, {x: 19, y: 8}, {x: 29, y: 8},
                        {x: 9, y: 13}, {x: 19, y: 13}, {x: 29, y: 13},
                        {x: 9, y: 18}, {x: 19, y: 18}, {x: 29, y: 18},
                        {x: 9, y: 23}, {x: 19, y: 23}, {x: 29, y: 23}
                    ],
                    computers: [
                        {x: 8, y: 7}, {x: 18, y: 7}, {x: 28, y: 7},
                        {x: 8, y: 12}, {x: 18, y: 12}, {x: 28, y: 12},
                        {x: 8, y: 17}, {x: 18, y: 17}, {x: 28, y: 17},
                        {x: 8, y: 22}, {x: 18, y: 22}, {x: 28, y: 22}
                    ]
                },
                npcs: [
                    {
                        id: 'education_director',
                        name: '교육서비스 본부장',
                        x: 18, y: 12,
                        dialog: ['교육서비스를 통해 많은 분들에게 도움을 드리고 있어요.', '26년간 쌓아온 교육 노하우가 우리의 자산입니다.'],
                        questGiver: false,
                        questId: null
                    },
                    {
                        id: 'education_manager',
                        name: '교육팀장',
                        x: 25, y: 20,
                        dialog: ['교육 매뉴얼을 찾아주세요!', '교육팀의 중요한 자료입니다.'],
                        questGiver: true,
                        questId: 6
                    },
                    {
                        id: 'training_coordinator_2',
                        name: '교육 담당자 한대리',
                        x: 12, y: 20,
                        dialog: ['휴넷 교육 프로그램을 담당하고 있어요.', '26주년 기념 이벤트도 교육의 일환이죠.', '게임을 통해 회사를 알아가세요!'],
                        questGiver: false,
                        questId: null
                    }
                ],
                items: [
                    { x: 25, y: 15, type: 'treasure', name: '미래 비전서', icon: '📘', description: '휴넷의 미래 비전' },
                    { x: 15, y: 20, type: 'treasure', name: '교육 매뉴얼', icon: '📖', description: '교육서비스본부 매뉴얼' },
                    { x: 20, y: 10, type: 'treasure', name: '교육 자료', icon: '📚', description: '교육 프로그램 자료' }
                ],
                portals: [
                    { x: 5, y: 15, targetMap: CONSTANTS.MAPS.FLOOR_8_CORRIDOR, targetX: 35, targetY: 8, name: '복도로' }
                ]
            },
            [CONSTANTS.MAPS.FLOOR_8_SALES_SUPPORT]: {
                name: '영업+교육지원본부',
                background: '#F0F8FF',
                walls: this.generateWalls(),
                officeItems: {
                    ...officeItems,
                    desks: [
                        {x: 8, y: 8}, {x: 16, y: 8}, {x: 24, y: 8}, {x: 32, y: 8},
                        {x: 8, y: 13}, {x: 16, y: 13}, {x: 24, y: 13}, {x: 32, y: 13},
                        {x: 8, y: 18}, {x: 16, y: 18}, {x: 24, y: 18}, {x: 32, y: 18},
                        {x: 8, y: 23}, {x: 16, y: 23}, {x: 24, y: 23}, {x: 32, y: 23}
                    ],
                    chairs: [
                        {x: 9, y: 8}, {x: 17, y: 8}, {x: 25, y: 8}, {x: 33, y: 8},
                        {x: 9, y: 13}, {x: 17, y: 13}, {x: 25, y: 13}, {x: 33, y: 13},
                        {x: 9, y: 18}, {x: 17, y: 18}, {x: 25, y: 18}, {x: 33, y: 18},
                        {x: 9, y: 23}, {x: 17, y: 23}, {x: 25, y: 23}, {x: 33, y: 23}
                    ],
                    computers: [
                        {x: 8, y: 7}, {x: 16, y: 7}, {x: 24, y: 7}, {x: 32, y: 7},
                        {x: 8, y: 12}, {x: 16, y: 12}, {x: 24, y: 12}, {x: 32, y: 12},
                        {x: 8, y: 17}, {x: 16, y: 17}, {x: 24, y: 17}, {x: 32, y: 17},
                        {x: 8, y: 22}, {x: 16, y: 22}, {x: 24, y: 22}, {x: 32, y: 22}
                    ]
                },
                npcs: [
                    {
                        id: 'sales_manager',
                        name: '영업팀장',
                        x: 15, y: 12,
                        dialog: ['영업과 교육지원을 담당하고 있습니다.', '고객분들께 더 나은 서비스를 제공하기 위해 노력하고 있어요.'],
                        questGiver: false,
                        questId: null
                    },
                    {
                        id: 'support_staff',
                        name: '교육지원 담당자',
                        x: 25, y: 18,
                        dialog: ['교육 운영을 지원하는 업무를 하고 있어요.', '원활한 교육 진행을 위해 최선을 다하고 있습니다.'],
                        questGiver: false,
                        questId: null
                    }
                ],
                items: [
                    { x: 20, y: 15, type: 'treasure', name: '영업팀 메시지' }
                ],
                portals: [
                    { x: 5, y: 15, targetMap: CONSTANTS.MAPS.FLOOR_8_CORRIDOR, targetX: 35, targetY: 22, name: '복도로' }
                ]
            },
            [CONSTANTS.MAPS.FLOOR_9_CORRIDOR]: {
                name: '9층 복도',
                background: '#FFF8DC',
                walls: this.generateWalls(),
                officeItems: {
                    ...officeItems,
                    elevatorDoors: [
                        {x: 18, y: 7}, {x: 19, y: 7}, {x: 20, y: 7}, {x: 21, y: 7}, {x: 22, y: 7}
                    ],
                    plants: [
                        {x: 10, y: 15}, {x: 30, y: 15}
                    ]
                },
                npcs: [
                    {
                        id: 'secretary_jung',
                        name: '비서 정씨',
                        x: 25, y: 15,
                        dialog: ['오늘은 정말 특별한 26주년 기념일이에요!', 'CEO님도 26년 전 창립 당시의 추억을 많이 얘기하고 계세요.', '준비가 다 되시면 CEO님께 26주년의 의미를 전해드리세요!'],
                        questGiver: true,
                        questId: 4
                    },
                    {
                        id: 'executive_assistant',
                        name: '임원실 어시스턴트',
                        x: 15, y: 10,
                        dialog: ['9층은 임원진들이 계신 층이에요.', '조용히 해주시면 감사하겠어요.', 'CEO님 일정 관리가 정말 바빠요.'],
                        questGiver: true,
                        questId: 117
                    },
                    {
                        id: 'cfo',
                        name: 'CFO 재무이사',
                        x: 12, y: 20,
                        dialog: ['26주년 재무 보고서를 검토 중이에요.', '회사가 안정적으로 성장하고 있어서 다행이에요.', '숫자로 보는 26년의 역사네요.'],
                        questGiver: true,
                        questId: 119
                    },
                    {
                        id: 'cto',
                        name: 'CTO 기술이사',
                        x: 32, y: 12,
                        dialog: ['기술 혁신 전략을 세우고 있어요.', '교육 플랫폼의 미래를 고민 중이죠.', 'AI와 VR 기술도 도입해야겠어요.'],
                        questGiver: false,
                        questId: null
                    },
                    {
                        id: 'legal_advisor',
                        name: '법무 고문',
                        x: 8, y: 12,
                        dialog: ['계약서 검토하느라 바빠요.', '26년간 축적된 법무 노하우가 있어요.', '안전한 비즈니스가 최우선이죠.'],
                        questGiver: true,
                        questId: 118
                    }
                ],
                items: [
                    { x: 20, y: 15, type: 'treasure', name: '기밀 문서', icon: '📄', description: '9층 기밀 문서' },
                    { x: 10, y: 10, type: 'treasure', name: '금고 열쇠', icon: '🔐', description: '비밀 금고 열쇠' },
                    { x: 30, y: 20, type: 'treasure', name: '보석', icon: '💎', description: '작은 다이아몬드' },
                    { x: 15, y: 25, type: 'treasure', name: '금화', icon: '🏆', description: '황금 동전' }
                ],
                portals: [
                    { x: 35, y: 15, targetMap: CONSTANTS.MAPS.FLOOR_9_CEO_OFFICE, targetX: 5, targetY: 15, name: 'CEO실' }
                ],
                elevatorPanel: { x: 20, y: 8 }
            },
            [CONSTANTS.MAPS.FLOOR_9_CEO_OFFICE]: {
                name: 'CEO실',
                background: '#FFE4B5',
                walls: this.generateWalls(),
                officeItems: {
                    ...officeItems,
                    desks: [
                        {x: 20, y: 15}
                    ],
                    chairs: [
                        {x: 21, y: 15}, {x: 15, y: 12}, {x: 25, y: 12}
                    ],
                    computers: [
                        {x: 20, y: 14}
                    ],
                    plants: [
                        {x: 10, y: 10}, {x: 30, y: 10}, {x: 10, y: 20}, {x: 30, y: 20}
                    ]
                },
                npcs: [
                    {
                        id: 'ceo_kim',
                        name: 'CEO 김대표',
                        x: 20, y: 18,
                        dialog: ['26주년 축하합니다! 휴넷의 CEO 김대표입니다.', '26년 전, 작은 사무실에서 꿈을 키우던 때가 엊그제 같네요.', '오늘 여러분과 함께 이 특별한 순간을 나눌 수 있어서 정말 행복합니다!', '휴넷의 다음 26년도 여러분과 함께 만들어가고 싶습니다!'],
                        questGiver: true,
                        questId: 5
                    }
                ],
                items: [
                    { x: 15, y: 18, type: 'treasure', name: '휴넷 26주년 기념품' }
                ],
                portals: [
                    { x: 5, y: 15, targetMap: CONSTANTS.MAPS.FLOOR_9_CORRIDOR, targetX: 35, targetY: 15, name: '복도로' }
                ]
            },

            // 카페/음식점 맵들
            [CONSTANTS.MAPS.STARBUCKS]: {
                name: '스타벅스',
                background: '#2D5016',
                walls: this.generateWalls(),
                officeItems: {
                    ...officeItems,
                    meetingTables: [
                        {x: 8, y: 8}, {x: 12, y: 8}, {x: 16, y: 8}, {x: 20, y: 8},
                        {x: 8, y: 12}, {x: 12, y: 12}, {x: 16, y: 12}, {x: 20, y: 12},
                        {x: 8, y: 16}, {x: 12, y: 16}, {x: 16, y: 16}, {x: 20, y: 16},
                        {x: 8, y: 20}, {x: 12, y: 20}, {x: 16, y: 20}, {x: 20, y: 20}
                    ],
                    chairs: [
                        {x: 7, y: 8}, {x: 9, y: 8}, {x: 11, y: 8}, {x: 13, y: 8}, {x: 15, y: 8}, {x: 17, y: 8}, {x: 19, y: 8}, {x: 21, y: 8},
                        {x: 7, y: 12}, {x: 9, y: 12}, {x: 11, y: 12}, {x: 13, y: 12}, {x: 15, y: 12}, {x: 17, y: 12}, {x: 19, y: 12}, {x: 21, y: 12},
                        {x: 7, y: 16}, {x: 9, y: 16}, {x: 11, y: 16}, {x: 13, y: 16}, {x: 15, y: 16}, {x: 17, y: 16}, {x: 19, y: 16}, {x: 21, y: 16},
                        {x: 7, y: 20}, {x: 9, y: 20}, {x: 11, y: 20}, {x: 13, y: 20}, {x: 15, y: 20}, {x: 17, y: 20}, {x: 19, y: 20}, {x: 21, y: 20}
                    ],
                    plants: [
                        {x: 5, y: 5}, {x: 25, y: 5}, {x: 5, y: 23}, {x: 25, y: 23}
                    ]
                },
                npcs: [
                    {
                        id: 'starbucks_barista',
                        name: '스타벅스 바리스타',
                        x: 30, y: 15,
                        dialog: ['어서오세요! 스타벅스입니다!', '오늘의 추천 음료는 아메리카노예요!', '휴넷 직원분들께는 10% 할인해드려요!'],
                        questGiver: false,
                        questId: null
                    },
                    {
                        id: 'coffee_lover',
                        name: '커피 애호가',
                        x: 15, y: 15,
                        dialog: ['이곳 커피 정말 맛있어요!', '업무 스트레스가 다 날아가는 기분이에요.', '여기서 미팅하기도 좋고...'],
                        questGiver: false,
                        questId: null
                    }
                ],
                items: [
                    { x: 28, y: 10, type: 'food', name: '특제 아메리카노', icon: '☕' },
                    { x: 28, y: 12, type: 'food', name: '카페라떼', icon: '🥛' }
                ],
                portals: [
                    { x: 20, y: 28, targetMap: CONSTANTS.MAPS.LOBBY, targetX: 6, targetY: 6, name: '로비로' }
                ]
            },

            [CONSTANTS.MAPS.MAMMOTH_COFFEE]: {
                name: '메머드 커피',
                background: '#8B4513',
                walls: this.generateWalls(),
                officeItems: {
                    ...officeItems,
                    meetingTables: [
                        {x: 10, y: 10}, {x: 15, y: 10}, {x: 20, y: 10}, {x: 25, y: 10},
                        {x: 10, y: 15}, {x: 15, y: 15}, {x: 20, y: 15}, {x: 25, y: 15},
                        {x: 10, y: 20}, {x: 15, y: 20}, {x: 20, y: 20}, {x: 25, y: 20}
                    ],
                    chairs: [
                        {x: 9, y: 10}, {x: 11, y: 10}, {x: 14, y: 10}, {x: 16, y: 10}, {x: 19, y: 10}, {x: 21, y: 10}, {x: 24, y: 10}, {x: 26, y: 10},
                        {x: 9, y: 15}, {x: 11, y: 15}, {x: 14, y: 15}, {x: 16, y: 15}, {x: 19, y: 15}, {x: 21, y: 15}, {x: 24, y: 15}, {x: 26, y: 15},
                        {x: 9, y: 20}, {x: 11, y: 20}, {x: 14, y: 20}, {x: 16, y: 20}, {x: 19, y: 20}, {x: 21, y: 20}, {x: 24, y: 20}, {x: 26, y: 20}
                    ],
                    plants: [
                        {x: 6, y: 6}, {x: 30, y: 6}, {x: 6, y: 24}, {x: 30, y: 24}
                    ]
                },
                npcs: [
                    {
                        id: 'mammoth_owner',
                        name: '메머드 사장님',
                        x: 32, y: 15,
                        dialog: ['메머드 커피에 오신 걸 환영해요!', '저희는 원두를 직접 로스팅해요!', '진짜 커피 맛을 느껴보세요!'],
                        questGiver: false,
                        questId: null
                    },
                    {
                        id: 'study_student',
                        name: '공부하는 학생',
                        x: 12, y: 12,
                        dialog: ['여기가 집중이 잘 되는 것 같아요.', '시험공부 하러 매일 와요.', '아, 휴넷 교육 들으면서 공부해요!'],
                        questGiver: false,
                        questId: null
                    }
                ],
                items: [
                    { x: 30, y: 10, type: 'food', name: '핸드드립 커피', icon: '☕' },
                    { x: 30, y: 12, type: 'food', name: '크로와상', icon: '🥐' }
                ],
                portals: [
                    { x: 20, y: 28, targetMap: CONSTANTS.MAPS.LOBBY, targetX: 31, targetY: 6, name: '로비로' }
                ]
            },

            [CONSTANTS.MAPS.KOOK_BAB_92]: {
                name: '국밥집 92소',
                background: '#CD853F',
                walls: this.generateWalls(),
                officeItems: {
                    ...officeItems,
                    meetingTables: [
                        {x: 8, y: 10}, {x: 12, y: 10}, {x: 16, y: 10}, {x: 20, y: 10}, {x: 24, y: 10}, {x: 28, y: 10},
                        {x: 8, y: 14}, {x: 12, y: 14}, {x: 16, y: 14}, {x: 20, y: 14}, {x: 24, y: 14}, {x: 28, y: 14},
                        {x: 8, y: 18}, {x: 12, y: 18}, {x: 16, y: 18}, {x: 20, y: 18}, {x: 24, y: 18}, {x: 28, y: 18},
                        {x: 8, y: 22}, {x: 12, y: 22}, {x: 16, y: 22}, {x: 20, y: 22}, {x: 24, y: 22}, {x: 28, y: 22}
                    ],
                    chairs: [
                        {x: 7, y: 10}, {x: 9, y: 10}, {x: 11, y: 10}, {x: 13, y: 10}, {x: 15, y: 10}, {x: 17, y: 10}, {x: 19, y: 10}, {x: 21, y: 10}, {x: 23, y: 10}, {x: 25, y: 10}, {x: 27, y: 10}, {x: 29, y: 10},
                        {x: 7, y: 14}, {x: 9, y: 14}, {x: 11, y: 14}, {x: 13, y: 14}, {x: 15, y: 14}, {x: 17, y: 14}, {x: 19, y: 14}, {x: 21, y: 14}, {x: 23, y: 14}, {x: 25, y: 14}, {x: 27, y: 14}, {x: 29, y: 14},
                        {x: 7, y: 18}, {x: 9, y: 18}, {x: 11, y: 18}, {x: 13, y: 18}, {x: 15, y: 18}, {x: 17, y: 18}, {x: 19, y: 18}, {x: 21, y: 18}, {x: 23, y: 18}, {x: 25, y: 18}, {x: 27, y: 18}, {x: 29, y: 18},
                        {x: 7, y: 22}, {x: 9, y: 22}, {x: 11, y: 22}, {x: 13, y: 22}, {x: 15, y: 22}, {x: 17, y: 22}, {x: 19, y: 22}, {x: 21, y: 22}, {x: 23, y: 22}, {x: 25, y: 22}, {x: 27, y: 22}, {x: 29, y: 22}
                    ]
                },
                npcs: [
                    {
                        id: 'kookbab_owner',
                        name: '국밥집 사장님',
                        x: 32, y: 15,
                        dialog: ['어서오세요! 92소에 오신 걸 환영합니다!', '오늘 끓인 돼지국밥 한 그릇 어떠세요?', '휴넷 직원분들 많이 오셔요. 힘내세요!'],
                        questGiver: false,
                        questId: null
                    },
                    {
                        id: 'hungry_employee',
                        name: '배고픈 직장인',
                        x: 15, y: 15,
                        dialog: ['아, 진짜 배고팠는데!', '여기 국밥이 진짜 맛있어요.', '든든하게 먹고 오후에 힘내야죠!'],
                        questGiver: false,
                        questId: null
                    },
                    {
                        id: 'lunch_friend',
                        name: '점심 동료',
                        x: 25, y: 15,
                        dialog: ['같이 점심 먹으러 온 동료예요.', '회사 근처에 이런 맛집이 있어서 좋아요.', '오늘 메뉴는 뭘로 하지?'],
                        questGiver: false,
                        questId: null
                    }
                ],
                items: [
                    { x: 30, y: 8, type: 'food', name: '선호 메뉴 조사서', icon: '📝' },
                    { x: 30, y: 10, type: 'food', name: '김치', icon: '🥬' },
                    { x: 30, y: 12, type: 'food', name: '공기밥', icon: '🍚' }
                ],
                portals: [
                    { x: 20, y: 28, targetMap: CONSTANTS.MAPS.LOBBY, targetX: 6, targetY: 24, name: '로비로' }
                ]
            },

            [CONSTANTS.MAPS.TIM_HORTONS]: {
                name: '팀홀튼',
                background: '#8B0000',
                walls: this.generateWalls(),
                officeItems: {
                    ...officeItems,
                    meetingTables: [
                        {x: 9, y: 9}, {x: 13, y: 9}, {x: 17, y: 9}, {x: 21, y: 9}, {x: 25, y: 9},
                        {x: 9, y: 13}, {x: 13, y: 13}, {x: 17, y: 13}, {x: 21, y: 13}, {x: 25, y: 13},
                        {x: 9, y: 17}, {x: 13, y: 17}, {x: 17, y: 17}, {x: 21, y: 17}, {x: 25, y: 17},
                        {x: 9, y: 21}, {x: 13, y: 21}, {x: 17, y: 21}, {x: 21, y: 21}, {x: 25, y: 21}
                    ],
                    chairs: [
                        {x: 8, y: 9}, {x: 10, y: 9}, {x: 12, y: 9}, {x: 14, y: 9}, {x: 16, y: 9}, {x: 18, y: 9}, {x: 20, y: 9}, {x: 22, y: 9}, {x: 24, y: 9}, {x: 26, y: 9},
                        {x: 8, y: 13}, {x: 10, y: 13}, {x: 12, y: 13}, {x: 14, y: 13}, {x: 16, y: 13}, {x: 18, y: 13}, {x: 20, y: 13}, {x: 22, y: 13}, {x: 24, y: 13}, {x: 26, y: 13},
                        {x: 8, y: 17}, {x: 10, y: 17}, {x: 12, y: 17}, {x: 14, y: 17}, {x: 16, y: 17}, {x: 18, y: 17}, {x: 20, y: 17}, {x: 22, y: 17}, {x: 24, y: 17}, {x: 26, y: 17},
                        {x: 8, y: 21}, {x: 10, y: 21}, {x: 12, y: 21}, {x: 14, y: 21}, {x: 16, y: 21}, {x: 18, y: 21}, {x: 20, y: 21}, {x: 22, y: 21}, {x: 24, y: 21}, {x: 26, y: 21}
                    ],
                    plants: [
                        {x: 5, y: 5}, {x: 30, y: 5}, {x: 5, y: 25}, {x: 30, y: 25}
                    ]
                },
                npcs: [
                    {
                        id: 'timhortons_staff',
                        name: '팀홀튼 직원',
                        x: 33, y: 15,
                        dialog: ['Welcome to Tim Hortons!', '캐나다 정통 커피와 도넛을 맛보세요!', '더블더블 커피 한 잔 어떠세요?'],
                        questGiver: false,
                        questId: null
                    },
                    {
                        id: 'canadian_customer',
                        name: '캐나다 고객',
                        x: 18, y: 15,
                        dialog: ['Eh, this reminds me of home!', '한국에서 팀홀튼을 만나다니!', '도넛이 정말 고향 맛이에요.'],
                        questGiver: false,
                        questId: null
                    }
                ],
                items: [
                    { x: 31, y: 10, type: 'food', name: '더블더블 커피', icon: '☕' },
                    { x: 31, y: 12, type: 'food', name: '글레이즈 도넛', icon: '🍩' },
                    { x: 31, y: 14, type: 'food', name: '팀빗', icon: '🥪' }
                ],
                portals: [
                    { x: 20, y: 28, targetMap: CONSTANTS.MAPS.LOBBY, targetX: 31, targetY: 24, name: '로비로' }
                ]
            },

            // 옥상층 (R층)
            [CONSTANTS.MAPS.ROOFTOP]: {
                name: '옥상 (흡연구역/비흡연구역)',
                background: '#87CEEB',
                walls: this.generateWalls(),
                officeItems: {
                    ...officeItems,
                    // 중앙 분리벽
                    desks: [
                        {x: 19, y: 5}, {x: 19, y: 6}, {x: 19, y: 7}, {x: 19, y: 8}, {x: 19, y: 9},
                        {x: 19, y: 10}, {x: 19, y: 11}, {x: 19, y: 12}, {x: 19, y: 13}, {x: 19, y: 14},
                        {x: 19, y: 15}, {x: 19, y: 16}, {x: 19, y: 17}, {x: 19, y: 18}, {x: 19, y: 19},
                        {x: 19, y: 20}, {x: 19, y: 21}, {x: 19, y: 22}, {x: 19, y: 23}, {x: 19, y: 24}
                    ],
                    // 비흡연구역 의자들 (왼쪽)
                    chairs: [
                        {x: 5, y: 8}, {x: 7, y: 8}, {x: 9, y: 8}, {x: 11, y: 8}, {x: 13, y: 8}, {x: 15, y: 8},
                        {x: 5, y: 12}, {x: 7, y: 12}, {x: 9, y: 12}, {x: 11, y: 12}, {x: 13, y: 12}, {x: 15, y: 12},
                        {x: 5, y: 16}, {x: 7, y: 16}, {x: 9, y: 16}, {x: 11, y: 16}, {x: 13, y: 16}, {x: 15, y: 16},
                        {x: 5, y: 20}, {x: 7, y: 20}, {x: 9, y: 20}, {x: 11, y: 20}, {x: 13, y: 20}, {x: 15, y: 20},
                        // 흡연구역 의자들 (오른쪽)
                        {x: 23, y: 8}, {x: 25, y: 8}, {x: 27, y: 8}, {x: 29, y: 8}, {x: 31, y: 8}, {x: 33, y: 8},
                        {x: 23, y: 12}, {x: 25, y: 12}, {x: 27, y: 12}, {x: 29, y: 12}, {x: 31, y: 12}, {x: 33, y: 12},
                        {x: 23, y: 16}, {x: 25, y: 16}, {x: 27, y: 16}, {x: 29, y: 16}, {x: 31, y: 16}, {x: 33, y: 16},
                        {x: 23, y: 20}, {x: 25, y: 20}, {x: 27, y: 20}, {x: 29, y: 20}, {x: 31, y: 20}, {x: 33, y: 20}
                    ],
                    plants: [
                        {x: 8, y: 6}, {x: 12, y: 6}, {x: 8, y: 22}, {x: 12, y: 22}, // 비흡연구역
                        {x: 26, y: 6}, {x: 30, y: 6}, {x: 26, y: 22}, {x: 30, y: 22}  // 흡연구역
                    ]
                },
                npcs: [
                    {
                        id: 'nonsmoker_employee',
                        name: '휴식중인 직원',
                        x: 10, y: 10,
                        dialog: ['옥상에 올라오니 공기가 좋네요!', '비흡연구역이라 편안해요.', '잠깐 쉬었다가 일하러 가야겠어요.'],
                        questGiver: false,
                        questId: null
                    },
                    {
                        id: 'smoker_employee',
                        name: '흡연중인 직원',
                        x: 28, y: 10,
                        dialog: ['후... 담배 한 대 피우고...', '스트레스가 많이 쌓였어요.', '금연해야 하는데 쉽지 않네요.'],
                        questGiver: false,
                        questId: null
                    },
                    {
                        id: 'roof_janitor',
                        name: '옥상 관리인',
                        x: 19, y: 3,
                        dialog: ['옥상 관리를 담당하고 있어요.', '왼쪽은 비흡연구역, 오른쪽은 흡연구역입니다.', '깨끗하게 사용해주세요!'],
                        questGiver: false,
                        questId: null
                    },
                    {
                        id: 'exercise_enthusiast',
                        name: '운동하는 직원',
                        x: 14, y: 16,
                        dialog: ['점심시간에 운동하러 왔어요!', '옥상에서 하는 운동이 최고죠.', '건강한 몸에 건강한 정신!'],
                        questGiver: true,
                        questId: 111
                    },
                    {
                        id: 'stressed_worker',
                        name: '스트레스 받는 직원',
                        x: 32, y: 16,
                        dialog: ['일이 너무 힘들어서...', '옥상에서 담배라도 피워야겠어요.', '언제까지 이런 생활을 해야 할까요?'],
                        questGiver: true,
                        questId: 109
                    },
                    {
                        id: 'phone_caller',
                        name: '통화중인 직원',
                        x: 6, y: 12,
                        dialog: ['(통화 중) 네, 프로젝트 일정이...', '옥상에서 통화하니 조용하네요.', '중요한 전화라서 올라왔어요.'],
                        questGiver: true,
                        questId: 112
                    },
                    {
                        id: 'meditation_person',
                        name: '명상하는 직원',
                        x: 8, y: 20,
                        dialog: ['마음의 평화를 찾고 있어요.', '바쁜 일상에서 잠깐의 휴식...', '명상하고 나면 머리가 맑아져요.'],
                        questGiver: true,
                        questId: 113
                    },
                    {
                        id: 'security_guard',
                        name: '보안 요원',
                        x: 35, y: 25,
                        dialog: ['옥상 보안을 담당하고 있어요.', '안전한 휴식 공간을 만들어야죠.', '규칙을 지켜서 사용해주세요.'],
                        questGiver: true,
                        questId: 110
                    }
                ],
                items: [
                    // 90년대 옵상 레트로 아이템
                    { x: 6, y: 14, type: 'retro', name: '국무당 담배', icon: '🚬', description: '90년대 인기 담배 브랜드' },
                    { x: 32, y: 14, type: 'retro', name: '워크맨', icon: '🎧', description: '소니 배터리 노래 듣기' },
                    { x: 16, y: 24, type: 'retro', name: '전자오락기', icon: '🎰', description: '전대안사용 오락기' },
                    { x: 24, y: 8, type: 'retro', name: '하이하이텔', icon: '📱', description: '제일 아름다운 당신에게' },
                    { x: 4, y: 4, type: 'retro', name: '올림픽 기념품', icon: '🏅', description: '1988 서울올림픽 기념품' },
                    { x: 8, y: 20, type: 'retro', name: '머리기 기팬', icon: '🧢', description: '대우 레미콘 전자제품' },
                    { x: 28, y: 12, type: 'retro', name: '포켓머니 장난감', icon: '🕹️', description: '닌텐도 전용 게임기' },
                    { x: 35, y: 18, type: 'retro', name: '딩딩밥 넘기기', icon: '👕', description: '90년대 유행 전자제품' },
                    { x: 20, y: 16, type: 'retro', name: '노다지 게임기', icon: '📾', description: '전용 휘대용 게임기' }
                ],
                portals: [],
                elevatorPanel: { x: 19, y: 28 }
            }
        };
    }
}