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
            elevatorDoors: []
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
                    plants: [
                        {x: 5, y: 5}, {x: 30, y: 5}, {x: 5, y: 25}, {x: 30, y: 25},
                        {x: 10, y: 15}, {x: 25, y: 15}, {x: 15, y: 8}, {x: 20, y: 22}
                    ],
                    elevatorDoors: [
                        {x: 34, y: 14}, {x: 35, y: 14}, {x: 36, y: 14}, {x: 37, y: 14},
                        {x: 34, y: 15}, {x: 35, y: 15}, {x: 36, y: 15}, {x: 37, y: 15},
                        {x: 34, y: 16}, {x: 35, y: 16}, {x: 36, y: 16}, {x: 37, y: 16}
                    ],
                    desks: [
                        {x: 8, y: 10}, {x: 12, y: 10}, {x: 22, y: 10}, {x: 26, y: 10},
                        {x: 8, y: 20}, {x: 12, y: 20}, {x: 22, y: 20}, {x: 26, y: 20}
                    ],
                    chairs: [
                        {x: 9, y: 10}, {x: 13, y: 10}, {x: 23, y: 10}, {x: 27, y: 10},
                        {x: 9, y: 20}, {x: 13, y: 20}, {x: 23, y: 20}, {x: 27, y: 20}
                    ],
                    computers: [
                        {x: 8, y: 9}, {x: 12, y: 9}, {x: 22, y: 9}, {x: 26, y: 9},
                        {x: 8, y: 19}, {x: 12, y: 19}, {x: 22, y: 19}, {x: 26, y: 19}
                    ]
                },
                npcs: [
                    {
                        id: 'reception',
                        name: '안내 데스크 직원',
                        x: 15, y: 15,
                        dialog: ['환영합니다! Hunet 26주년 기념 보물찾기에 참여해주셔서 감사합니다.', '각 층을 탐험하며 단서를 모으세요!'],
                        questGiver: false,
                        questId: null
                    },
                    {
                        id: 'guard',
                        name: '경비 아저씨',
                        x: 32, y: 18,
                        dialog: ['이 건물은 정말 크죠?', '엘리베이터를 이용해서 다른 층으로 이동하세요.'],
                        questGiver: false,
                        questId: null
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
                        dialog: ['매일 이 넓은 건물을 청소하기 힘들어요.', '직원분들이 깨끗하게 써주시면 좋겠어요.', '26주년이라니, 정말 오래된 회사네요!'],
                        questGiver: true,
                        questId: 115
                    },
                    {
                        id: 'delivery_person',
                        name: '택배 기사',
                        x: 28, y: 25,
                        dialog: ['휴넷에 택배 배달 왔어요!', '이 건물에는 패키지가 정말 많이 와요.', '7층 김대리님 택배인데... 어디 계실까요?'],
                        questGiver: true,
                        questId: 100
                    },
                    {
                        id: 'job_applicant',
                        name: '면접 지원자',
                        x: 12, y: 23,
                        dialog: ['오늘 휴넷 면접이에요!', '너무 긴장돼서 일찍 왔어요.', '이런 큰 회사에서 일할 수 있을까요?'],
                        questGiver: true,
                        questId: 108
                    },
                    {
                        id: 'maintenance_worker',
                        name: '시설 관리자',
                        x: 6, y: 8,
                        dialog: ['건물 시설 점검하러 왔어요.', '26년 된 건물이라 관리가 중요해요.', '엘리베이터 점검도 주기적으로 해야죠.'],
                        questGiver: true,
                        questId: 105
                    }
                ],
                items: [],
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
                    desks: [
                        {x: 10, y: 10}, {x: 30, y: 10}, {x: 10, y: 20}, {x: 30, y: 20}
                    ],
                    chairs: [
                        {x: 11, y: 10}, {x: 31, y: 10}, {x: 11, y: 20}, {x: 31, y: 20}
                    ]
                },
                npcs: [
                    {
                        id: 'kim_deputy',
                        name: '김대리',
                        x: 12, y: 10,
                        dialog: ['안녕하세요! 저는 김대리입니다.', '7층 사무실들을 모두 탐험해보세요.', '중요한 문서들이 숨겨져 있을 거예요!'],
                        questGiver: true,
                        questId: 0
                    },
                    {
                        id: 'office_worker_2',
                        name: '직원 박씨',
                        x: 32, y: 20,
                        dialog: ['여기는 7층 사무실입니다.', '김대리님이 뭔가 찾고 계시던데...', '도와드리는 게 어떨까요?'],
                        questGiver: true,
                        questId: 1
                    },
                    {
                        id: 'intern',
                        name: '인턴 신입',
                        x: 25, y: 15,
                        dialog: ['저는 인턴이에요!', '회사가 정말 크죠?', '저도 아직 길을 잘 몰라요...'],
                        questGiver: true,
                        questId: 2
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
                    { x: 15, y: 15, type: 'treasure', name: '7층 업무 보고서' },
                    { x: 5, y: 25, type: 'quest', name: '명찰', icon: '🎫' },
                    { x: 35, y: 5, type: 'quest', name: '택배 상자', icon: '📦' }
                ],
                portals: [
                    { x: 5, y: 10, targetMap: CONSTANTS.MAPS.FLOOR_7_OFFICE_1, targetX: 35, targetY: 15, name: '사무실 1' },
                    { x: 35, y: 20, targetMap: CONSTANTS.MAPS.FLOOR_7_OFFICE_2, targetX: 5, targetY: 15, name: '사무실 2' }
                ],
                elevatorPanel: { x: 20, y: 8 }
            },
            [CONSTANTS.MAPS.FLOOR_7_OFFICE_1]: {
                name: '7층 사무실 1',
                background: '#F0F8FF',
                walls: this.generateWalls(),
                officeItems: {
                    ...officeItems,
                    desks: [
                        {x: 10, y: 10}, {x: 20, y: 10}, {x: 10, y: 20}, {x: 20, y: 20}
                    ],
                    chairs: [
                        {x: 11, y: 10}, {x: 21, y: 10}, {x: 11, y: 20}, {x: 21, y: 20}
                    ],
                    computers: [
                        {x: 10, y: 9}, {x: 20, y: 9}, {x: 10, y: 19}, {x: 20, y: 19}
                    ]
                },
                npcs: [],
                items: [
                    { x: 15, y: 15, type: 'treasure', name: '중요한 문서' }
                ],
                portals: [
                    { x: 35, y: 15, targetMap: CONSTANTS.MAPS.FLOOR_7_CORRIDOR, targetX: 5, targetY: 10, name: '복도로' }
                ]
            },
            [CONSTANTS.MAPS.FLOOR_7_OFFICE_2]: {
                name: '7층 사무실 2',
                background: '#F0F0F0',
                walls: this.generateWalls(),
                officeItems: {
                    ...officeItems,
                    desks: [
                        {x: 15, y: 10}, {x: 25, y: 10}, {x: 15, y: 20}, {x: 25, y: 20}
                    ],
                    chairs: [
                        {x: 16, y: 10}, {x: 26, y: 10}, {x: 16, y: 20}, {x: 26, y: 20}
                    ],
                    printers: [
                        {x: 30, y: 15}
                    ]
                },
                npcs: [],
                items: [
                    { x: 20, y: 15, type: 'treasure', name: '프로젝트 파일' }
                ],
                portals: [
                    { x: 5, y: 15, targetMap: CONSTANTS.MAPS.FLOOR_7_CORRIDOR, targetX: 35, targetY: 20, name: '복도로' }
                ]
            },
            [CONSTANTS.MAPS.FLOOR_8_MAIN]: {
                name: '8층 메인홀 & 카페테리아',
                background: '#E6E6FA',
                walls: this.generateWalls(),
                officeItems: {
                    ...officeItems,
                    elevatorDoors: [
                        {x: 18, y: 28}, {x: 19, y: 28}, {x: 20, y: 28}, {x: 21, y: 28}, {x: 22, y: 28}
                    ],
                    meetingTables: [
                        {x: 8, y: 8}, {x: 32, y: 8}, {x: 8, y: 22}, {x: 32, y: 22}, {x: 20, y: 15}
                    ],
                    chairs: [
                        {x: 7, y: 8}, {x: 9, y: 8}, {x: 31, y: 8}, {x: 33, y: 8},
                        {x: 7, y: 22}, {x: 9, y: 22}, {x: 31, y: 22}, {x: 33, y: 22},
                        {x: 19, y: 15}, {x: 21, y: 15}
                    ],
                    plants: [
                        {x: 5, y: 5}, {x: 35, y: 5}, {x: 5, y: 25}, {x: 35, y: 25}
                    ]
                },
                npcs: [
                    {
                        id: 'manager_lee',
                        name: '팀장 이씨',
                        x: 20, y: 12,
                        dialog: ['8층 회의실에 오신 것을 환영합니다!', '중요한 회의 자료들이 여기저기 흩어져 있어요.', '모두 모아주시면 도움이 될 것 같아요!'],
                        questGiver: true,
                        questId: 3
                    },
                    {
                        id: 'staff_choi',
                        name: '직원 최씨',
                        x: 10, y: 10,
                        dialog: ['카페테리아에서 휴식을 취해보세요.', '회의 자료가 테이블 위에 남아있을 거예요.'],
                        questGiver: false,
                        questId: null
                    },
                    {
                        id: 'secretary_park',
                        name: '비서 박씨',
                        x: 30, y: 20,
                        dialog: ['안녕하세요! 프레젠테이션 준비가 한창이에요.', '자료를 찾고 계신다면 저쪽 테이블을 확인해보세요.'],
                        questGiver: false,
                        questId: null
                    },
                    {
                        id: 'presenter',
                        name: '발표자 김선임',
                        x: 15, y: 8,
                        dialog: ['오늘 중요한 프레젠테이션이 있어요.', '자료 준비에 몇 시간을 썼네요.', '성공적인 발표가 되길 바라요!'],
                        questGiver: true,
                        questId: 107
                    },
                    {
                        id: 'meeting_attendee_1',
                        name: '회의 참석자 조과장',
                        x: 25, y: 18,
                        dialog: ['회의 시간이 거의 다 됐네요.', '오늘 안건이 중요해서 긴장돼요.', '팀장님 발표 잘 들어야겠어요.'],
                        questGiver: false,
                        questId: null
                    },
                    {
                        id: 'cafeteria_worker',
                        name: '카페테리아 직원',
                        x: 35, y: 10,
                        dialog: ['오늘 점심 메뉴는 불고기덮밥이에요!', '직원분들이 맛있게 드셔주셔서 보람있어요.', '식사 시간에 또 오세요!'],
                        questGiver: false,
                        questId: null
                    },
                    {
                        id: 'lunch_employee',
                        name: '점심 먹는 직원',
                        x: 6, y: 20,
                        dialog: ['카페테리아 음식이 맛있어요.', '회의 전에 든든하게 먹어야죠.', '오후에도 힘내서 일해야겠어요!'],
                        questGiver: true,
                        questId: 103
                    },
                    {
                        id: 'training_coordinator',
                        name: '교육 담당자 한대리',
                        x: 12, y: 25,
                        dialog: ['휴넷 교육 프로그램을 담당하고 있어요.', '26주년 기념 이벤트도 교육의 일환이죠.', '게임을 통해 회사를 알아가세요!'],
                        questGiver: true,
                        questId: 104
                    }
                ],
                items: [
                    { x: 12, y: 15, type: 'treasure', name: '회의록' },
                    { x: 28, y: 18, type: 'treasure', name: '프레젠테이션 자료' },
                    { x: 5, y: 15, type: 'quest', name: '교육 자료', icon: '📚' },
                    { x: 35, y: 25, type: 'quest', name: '회의실 열쇠', icon: '🔑' }
                ],
                portals: [],
                elevatorPanel: { x: 20, y: 29 }
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
                        dialog: ['CEO님이 기다리고 계십니다.', 'CEO실은 저쪽입니다.', '모든 준비가 완료되면 CEO님께 보고드리세요.'],
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
                    { x: 15, y: 15, type: 'treasure', name: '9층 기밀 문서' },
                    { x: 35, y: 10, type: 'quest', name: '임원 브리핑 자료', icon: '📋' },
                    { x: 5, y: 25, type: 'quest', name: '법무 계약서', icon: '📄' },
                    { x: 25, y: 25, type: 'quest', name: '재무 보고서', icon: '📊' }
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
                        dialog: ['휴넷에 오신 것을 환영합니다!', '26주년을 함께 축하해주셔서 감사합니다.', '모든 퀘스트를 완료하셨군요! 정말 수고하셨습니다.', '앞으로도 휴넷과 함께해주세요!'],
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
                    { x: 28, y: 10, type: 'food', name: '아메리카노', icon: '☕' },
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
                    { x: 30, y: 8, type: 'food', name: '돼지국밥', icon: '🍲' },
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
                    { x: 6, y: 14, type: 'health', name: '신선한 공기', icon: '🌬️' },
                    { x: 32, y: 14, type: 'item', name: '재떨이', icon: '🚬' },
                    { x: 16, y: 24, type: 'quest', name: '보안 체크리스트', icon: '📝' },
                    { x: 24, y: 8, type: 'quest', name: '운동 장비', icon: '🏋️' },
                    { x: 4, y: 4, type: 'quest', name: '전화 메모', icon: '📞' }
                ],
                portals: [],
                elevatorPanel: { x: 19, y: 28 }
            }
        };
    }
}