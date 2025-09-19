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
                    }
                ],
                items: [],
                portals: [],
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
                    }
                ],
                items: [
                    { x: 15, y: 15, type: 'treasure', name: '7층 업무 보고서' }
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
                    }
                ],
                items: [
                    { x: 12, y: 15, type: 'treasure', name: '회의록' },
                    { x: 28, y: 18, type: 'treasure', name: '프레젠테이션 자료' }
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
                    }
                ],
                items: [
                    { x: 15, y: 15, type: 'treasure', name: '9층 기밀 문서' }
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
            }
        };
    }
}