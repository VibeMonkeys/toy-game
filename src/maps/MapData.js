import { CONSTANTS } from '../utils/Constants.js';

export class MapData {
    static generateWalls() {
        const walls = [];
        // 외곽 벽 생성
        for (let x = 0; x < CONSTANTS.MAP_WIDTH; x++) {
            walls.push({x: x, y: 0});
            walls.push({x: x, y: CONSTANTS.MAP_HEIGHT - 1});
        }
        for (let y = 0; y < CONSTANTS.MAP_HEIGHT; y++) {
            walls.push({x: 0, y: y});
            walls.push({x: CONSTANTS.MAP_WIDTH - 1, y: y});
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
            meetingTables: []
        };
    }

    static getAllMaps() {
        const officeItems = this.generateOfficeItems();

        return {
            [CONSTANTS.MAPS.BUILDING_ENTRANCE]: {
                name: '휴넷 빌딩 입구',
                background: '#E8F4FD',
                walls: this.generateWalls().concat([
                    {x: 15, y: 10}, {x: 16, y: 10}, {x: 17, y: 10}, {x: 18, y: 10},
                    {x: 19, y: 10}, {x: 20, y: 10}, {x: 21, y: 10}, {x: 22, y: 10},
                    {x: 23, y: 10}, {x: 24, y: 10}, {x: 25, y: 10}
                ]),
                officeItems: {
                    desks: [
                        {x: 18, y: 12}, {x: 19, y: 12}, {x: 20, y: 12}, {x: 21, y: 12}, {x: 22, y: 12}
                    ],
                    chairs: [
                        {x: 10, y: 18}, {x: 11, y: 18}, {x: 12, y: 18},
                        {x: 28, y: 18}, {x: 29, y: 18}, {x: 30, y: 18}
                    ],
                    computers: [],
                    monitors: [],
                    keyboards: [],
                    plants: [
                        {x: 8, y: 8}, {x: 32, y: 8}, {x: 8, y: 22}, {x: 32, y: 22},
                        {x: 15, y: 15}, {x: 25, y: 15}
                    ],
                    printers: [],
                    meetingTables: []
                },
                npcs: [
                    {
                        x: 20, y: 13, type: 'receptionist', name: '안내데스크 직원',
                        rank: 'employee',
                        dialog: [
                            '휴넷 빌딩에 오신 것을 환영합니다!',
                            '엘리베이터를 이용하여 각 층으로 이동하세요.',
                            '26주년을 맞아 특별한 이벤트가 준비되어 있어요!'
                        ],
                        movable: true
                    }
                ],
                items: [
                    { x: 25, y: 25, type: 'badge', name: '휴넷 26주년 기념 배지', collected: false }
                ],
                portals: [
                    { x: 20, y: 29, targetMap: CONSTANTS.MAPS.LOBBY, targetX: 20, targetY: 1, name: '로비' }
                ]
            },

            [CONSTANTS.MAPS.LOBBY]: {
                name: '휴넷 로비',
                background: '#F0F8FF',
                walls: this.generateWalls(),
                officeItems: {
                    ...officeItems,
                    desks: [
                        {x: 10, y: 10}, {x: 11, y: 10}, {x: 12, y: 10},
                        {x: 28, y: 10}, {x: 29, y: 10}, {x: 30, y: 10}
                    ],
                    plants: [
                        {x: 5, y: 5}, {x: 35, y: 5}, {x: 5, y: 25}, {x: 35, y: 25}
                    ]
                },
                npcs: [
                    {
                        x: 10, y: 15, type: 'employee', name: '김대리',
                        rank: 'senior',
                        dialog: [
                            '안녕하세요! 저는 김대리입니다.',
                            '휴넷 26주년을 축하해주셔서 감사해요!',
                            '회의실에서 박과장님이 기다리고 계세요.',
                            '특별한 프로젝트에 대해 이야기해주실 거예요!'
                        ],
                        movable: true,
                        questTarget: CONSTANTS.QUEST_TARGETS.TALK_TO_KIM
                    }
                ],
                items: [
                    { x: 15, y: 20, type: 'document', name: '휴넷 역사 문서', collected: false }
                ],
                portals: [
                    { x: 20, y: 1, targetMap: CONSTANTS.MAPS.BUILDING_ENTRANCE, targetX: 20, targetY: 29, name: '빌딩 입구' },
                    { x: 38, y: 15, targetMap: CONSTANTS.MAPS.MEETING_ROOM, targetX: 1, targetY: 15, name: '회의실' }
                ]
            },

            [CONSTANTS.MAPS.MEETING_ROOM]: {
                name: '회의실',
                background: '#F5F5DC',
                walls: this.generateWalls().concat([
                    {x: 15, y: 8}, {x: 16, y: 8}, {x: 17, y: 8}, {x: 18, y: 8},
                    {x: 19, y: 8}, {x: 20, y: 8}, {x: 21, y: 8}, {x: 22, y: 8},
                    {x: 23, y: 8}, {x: 24, y: 8}, {x: 25, y: 8}
                ]),
                officeItems: {
                    ...officeItems,
                    meetingTables: [
                        {x: 18, y: 12}, {x: 19, y: 12}, {x: 20, y: 12}, {x: 21, y: 12}, {x: 22, y: 12}
                    ],
                    chairs: [
                        {x: 17, y: 11}, {x: 18, y: 11}, {x: 19, y: 11}, {x: 20, y: 11},
                        {x: 21, y: 11}, {x: 22, y: 11}, {x: 23, y: 11}
                    ]
                },
                npcs: [
                    {
                        x: 20, y: 10, type: 'manager', name: '박과장',
                        rank: 'manager',
                        dialog: [
                            '김대리가 보냈군요. 잘 오셨습니다!',
                            '휴넷의 26년 여정이 정말 대단하죠.',
                            '카페테리아에서 이부장님을 만나보세요.',
                            '그분이 특별한 이야기를 들려주실 거예요!'
                        ],
                        movable: false,
                        questTarget: CONSTANTS.QUEST_TARGETS.TALK_TO_PARK
                    }
                ],
                items: [
                    { x: 25, y: 15, type: 'key', name: '특별 회의실 열쇠', collected: false }
                ],
                portals: [
                    { x: 1, y: 15, targetMap: CONSTANTS.MAPS.LOBBY, targetX: 38, targetY: 15, name: '로비' },
                    { x: 20, y: 29, targetMap: CONSTANTS.MAPS.CAFETERIA, targetX: 20, targetY: 1, name: '카페테리아' }
                ]
            },

            [CONSTANTS.MAPS.CAFETERIA]: {
                name: '카페테리아',
                background: '#FFF8DC',
                walls: this.generateWalls(),
                officeItems: {
                    ...officeItems,
                    meetingTables: [
                        {x: 8, y: 12}, {x: 9, y: 12}, {x: 32, y: 12}, {x: 33, y: 12},
                        {x: 15, y: 18}, {x: 16, y: 18}, {x: 24, y: 18}, {x: 25, y: 18}
                    ],
                    chairs: [
                        {x: 8, y: 11}, {x: 9, y: 11}, {x: 8, y: 13}, {x: 9, y: 13},
                        {x: 32, y: 11}, {x: 33, y: 11}, {x: 32, y: 13}, {x: 33, y: 13}
                    ]
                },
                npcs: [
                    {
                        x: 25, y: 15, type: 'director', name: '이부장',
                        rank: 'director',
                        dialog: [
                            '휴넷의 미래를 함께 만들어가는 동료여서 기쁩니다!',
                            '26년간 쌓아온 우리의 노하우가 정말 소중해요.',
                            'CEO님께서 마지막 미션을 준비하고 계세요.',
                            'CEO실로 올라가서 특별한 선물을 받아보세요!'
                        ],
                        movable: true,
                        questTarget: CONSTANTS.QUEST_TARGETS.TALK_TO_LEE
                    }
                ],
                items: [
                    { x: 30, y: 20, type: 'treasure', name: '휴넷 혁신상', collected: false }
                ],
                portals: [
                    { x: 20, y: 1, targetMap: CONSTANTS.MAPS.MEETING_ROOM, targetX: 20, targetY: 29, name: '회의실' },
                    { x: 38, y: 20, targetMap: CONSTANTS.MAPS.CEO_OFFICE, targetX: 1, targetY: 20, name: 'CEO실' }
                ]
            },

            [CONSTANTS.MAPS.CEO_OFFICE]: {
                name: 'CEO실',
                background: '#F0E68C',
                walls: this.generateWalls().concat([
                    {x: 10, y: 10}, {x: 11, y: 10}, {x: 12, y: 10}, {x: 13, y: 10},
                    {x: 14, y: 10}, {x: 25, y: 10}, {x: 26, y: 10}, {x: 27, y: 10},
                    {x: 28, y: 10}, {x: 29, y: 10}, {x: 30, y: 10}
                ]),
                officeItems: {
                    ...officeItems,
                    desks: [
                        {x: 18, y: 15}, {x: 19, y: 15}, {x: 20, y: 15}, {x: 21, y: 15}, {x: 22, y: 15}
                    ],
                    chairs: [
                        {x: 20, y: 16}
                    ],
                    plants: [
                        {x: 8, y: 8}, {x: 32, y: 8}, {x: 8, y: 22}, {x: 32, y: 22}
                    ]
                },
                npcs: [
                    {
                        x: 20, y: 12, type: 'ceo', name: 'CEO',
                        rank: 'ceo',
                        dialog: [
                            '휴넷 26주년 보물찾기에 참여해주셔서 감사합니다!',
                            '26년간 함께해온 모든 분들께 진심으로 감사드려요.',
                            '앞으로도 더 나은 교육 서비스로 사회에 기여하겠습니다!',
                            '축하합니다! 모든 미션을 완료하셨습니다!'
                        ],
                        movable: false,
                        questTarget: CONSTANTS.QUEST_TARGETS.TALK_TO_CEO
                    }
                ],
                items: [
                    { x: 20, y: 20, type: 'treasure', name: '휴넷 26주년 기념품', collected: false }
                ],
                portals: [
                    { x: 1, y: 20, targetMap: CONSTANTS.MAPS.CAFETERIA, targetX: 38, targetY: 20, name: '카페테리아' }
                ]
            }
        };
    }
};