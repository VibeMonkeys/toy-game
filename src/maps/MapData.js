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
                    plants: [
                        {x: 5, y: 5}, {x: 30, y: 5}, {x: 5, y: 25}, {x: 30, y: 25},
                        {x: 10, y: 15}, {x: 25, y: 15}, {x: 15, y: 8}, {x: 20, y: 22}
                    ],
                    elevatorDoors: [
                        {x: 34, y: 14}, {x: 35, y: 14}, {x: 36, y: 14}, {x: 37, y: 14},
                        {x: 34, y: 15}, {x: 35, y: 15}, {x: 36, y: 15}, {x: 37, y: 15},
                        {x: 34, y: 16}, {x: 35, y: 16}, {x: 36, y: 16}, {x: 37, y: 16}
                    ],
                    vendingMachines: [
                        {x: 2, y: 10, type: 'drink'},
                        {x: 2, y: 20, type: 'snack'}
                    ],
                    coffeeMachines: [
                        {x: 32, y: 8}
                    ]
                },
                npcs: [
                    {
                        id: 'guard',
                        name: '경비 아저씨',
                        x: 8, y: 12,
                        dialog: [
                            '어? 새로 온 사람이네! 나는 이 건물 경비를 담당하고 있는 박경비야.',
                            '휴넷에 입사한 지 이틀째인데... 뭔가 이상한 일들이 계속 일어나고 있어.',
                            '아침에 출근하니까 출입카드가 다 사라져 버렸더라고!'
                        ],
                        hasChoices: true,
                        dialogChoices: {
                            question: "어떻게 도와드릴까요?",
                            choices: [
                                {
                                    text: "출입카드가 사라졌다고요?",
                                    response: [
                                        "그렇다니까! 어제까지 분명히 있었는데 말이야.",
                                        "아마 누군가 몰래 숨겨놓은 것 같아. 이런 미스터리가 다 있나?",
                                        "혹시 로비 어딘가에서 출입카드를 찾아주면 정말 고맙겠어!"
                                    ]
                                },
                                {
                                    text: "휴넷 생존 가이드를 들려주세요",
                                    response: [
                                        "아, 신입사원을 위한 생존 가이드 말이지? 내가 이틀 동안 배운 걸 알려줄게!",
                                        "첫째, 점심시간은 전쟁이야. 11시 50분부터 움직여야 해!",
                                        "둘째, 엘리베이터는 항상 붐비니까 계단도 고려해봐.",
                                        "셋째, 9층 진입은... 음, 그건 직접 경험해봐야 알 거야."
                                    ]
                                }
                            ]
                        }
                    },
                    {
                        id: 'guard',
                        name: '경비 아저씨',
                        x: 38, y: 12,
                        dialog: [
                            '어서 오세요! 저는 이 건물의 보안을 담당하는 경비입니다.',
                            '첫 출근이신가요? 그런데 문제가 하나 있어서요...',
                            '어제 발급해드린 임시 출입카드가 어디론가 사라졌어요!'
                        ],
                        hasChoices: true,
                        dialogChoices: {
                            question: "출입카드 분실 문제를 도와드릴까요?",
                            choices: [
                                {
                                    text: "임시 출입카드가 어떻게 사라졌나요?",
                                    response: [
                                        "어제까지 분명히 제 책상에 있었는데 말이죠.",
                                        "아마도 청소하시는 분이 실수로 어딘가에 두셨을 수도...",
                                        "로비 어딘가에 떨어뜨린 것 같아요. 찾아주시면 정말 감사하겠습니다!"
                                    ]
                                },
                                {
                                    text: "휴넷 건물 보안에 대해 알려주세요",
                                    response: [
                                        "이 건물은 총 9층으로 되어 있고, 층마다 보안 등급이 다릅니다.",
                                        "1층은 누구나 출입 가능하지만, 위층으로 올라가려면 직원증이 필요해요.",
                                        "특히 9층은 최고 보안 구역이라 특별 허가가 있어야 합니다.",
                                        "신입사원분은 천천히 각 층을 둘러보시면 됩니다!"
                                    ]
                                }
                            ]
                        }
                    },
                    {
                        id: 'reception',
                        name: '강해빈',
                        x: 18, y: 15,
                        dialog: [
                            '안녕하세요! 인사경영실 채용담당 강해빈입니다.',
                            '오늘 첫 출근이신가요? 신입사원 오리엔테이션을 도와드릴게요!',
                            '휴넷에서의 첫날을 성공적으로 보내실 수 있도록 안내해드릴게요.'
                        ],
                        hasChoices: true,
                        dialogChoices: {
                            question: "어떤 안내가 필요하신가요?",
                            choices: [
                                {
                                    text: "신입사원 오리엔테이션을 받고 싶어요",
                                    response: [
                                        "좋아요! 먼저 휴넷의 기본적인 구조를 설명드릴게요.",
                                        "7층은 IT팀과 일반 사무실, 8층은 각 본부들, 9층은 경영진이 계세요.",
                                        "각 층마다 만나야 할 사람들이 있으니 차근차근 돌아보세요!",
                                        "아, 그리고 사원증을 잃어버리면 큰일나니까 조심하세요!"
                                    ]
                                },
                                {
                                    text: "휴넷 생활 꿀팁을 알려주세요",
                                    response: [
                                        "휴넷 생활의 핵심은 '적응'이에요!",
                                        "점심시간에는 카페들이 엄청 붐비니까 미리미리 준비하세요.",
                                        "각 부서마다 특색이 다르니까 눈치껏 행동하는 게 중요해요.",
                                        "그리고... 9층은 함부로 올라가지 마세요. 특별한 허가가 필요하거든요!"
                                    ]
                                }
                            ]
                        }
                    },
                    {
                        id: 'janitor',
                        name: '청소 아저씨',
                        x: 35, y: 25,
                        dialog: [
                            '어서 오세요! 나는 이 건물에서 20년 넘게 청소를 하고 있어요.',
                            '휴넷의 역사를 다 보았죠. 자그마한 회사에서 이렇게 큰 회사가 되었어요.',
                            '신입사원들도 많이 보았는데... 오래 남는 사람들에는 특징이 있어요.'
                        ],
                        hasChoices: true,
                        dialogChoices: {
                            question: "휴넷의 역사에 대해 더 들어보고 싶어요!",
                            choices: [
                                {
                                    text: "휴넷이 어떻게 시작되었나요?",
                                    response: "처음에는 작은 사무실에서 시작했어요. 조영탁 대표님이 '교육으로 세상을 바꾸자'는 꿈을 가지고 계셨죠."
                                },
                                {
                                    text: "오래 남는 사람들의 특징은 뮴죠?",
                                    response: "진심으로 사람들을 대하고, 늘 배우려는 자세를 가진 사람들이에요. 조급하지 않고 차근차근 성장하는 사람들말이에요."
                                }
                            ]
                        }
                    }
                ],
                items: [
                    { x: 12, y: 8, type: 'keycard', name: '임시 출입카드', icon: '🗝️', description: '경비실에서 발급한 임시 출입카드' },
                    { x: 28, y: 18, type: 'handbook', name: '신입사원 서류', icon: '📋', description: '강해빈이 준비한 신입사원 오리엔테이션 서류' },
                    { x: 6, y: 22, type: 'coffee', name: '웰컴 커피', icon: '☕', description: '첫 출근 기념 커피' },
                    { x: 35, y: 10, type: 'plant', name: '로비 화분', icon: '🌱', description: '휴넷 로비의 싱그러운 화분' },
                    // 서브 퀘스트 아이템들
                    { x: 15, y: 25, type: 'greeting_card', name: '인사왕 인증서', icon: '🙋', description: '복도에서 인사 많이 한 인증서' },
                    { x: 25, y: 12, type: 'vending_legend', name: '전설의 음료', icon: '🥤', description: '자판기에서만 나오는 레어 아이템' },
                    { x: 8, y: 18, type: 'history_note', name: '회사 역사 노트', icon: '📃', description: '청소 아저씨가 들려준 휴넷의 역사' }
                ],
                portals: [],
                elevatorPanel: { x: 32, y: 15 }
            },

            [CONSTANTS.MAPS.FLOOR_7_710_MAIN_IT]: {
                name: '710호 - 본사 IT팀',
                background: '#E8F4FD',
                walls: this.generateWalls(),
                officeItems: {
                    ...officeItems,
                    desks: [
                        {x: 6, y: 8}, {x: 10, y: 8}, {x: 14, y: 8}, {x: 18, y: 8},
                        {x: 22, y: 8}, {x: 26, y: 8}, {x: 30, y: 8},
                        {x: 6, y: 12}, {x: 10, y: 12}, {x: 14, y: 12}, {x: 18, y: 12},
                        {x: 22, y: 12}, {x: 26, y: 12}, {x: 30, y: 12},
                        {x: 6, y: 20}, {x: 10, y: 20}, {x: 14, y: 20}, {x: 18, y: 20}
                    ],
                    computers: [
                        {x: 6, y: 7}, {x: 10, y: 7}, {x: 14, y: 7}, {x: 18, y: 7},
                        {x: 22, y: 7}, {x: 26, y: 7}, {x: 30, y: 7},
                        {x: 6, y: 11}, {x: 10, y: 11}, {x: 14, y: 11}, {x: 18, y: 11},
                        {x: 22, y: 11}, {x: 26, y: 11}, {x: 30, y: 11}
                    ],
                    chairs: [
                        {x: 6, y: 9}, {x: 10, y: 9}, {x: 14, y: 9}, {x: 18, y: 9},
                        {x: 22, y: 9}, {x: 26, y: 9}, {x: 30, y: 9}
                    ],
                    printers: [
                        {x: 32, y: 10}, {x: 32, y: 16}
                    ],
                    coffeeMachines: [
                        {x: 4, y: 16}
                    ],
                    elevatorDoors: [
                        {x: 34, y: 14}, {x: 35, y: 14}, {x: 36, y: 14}, {x: 37, y: 14},
                        {x: 34, y: 15}, {x: 35, y: 15}, {x: 36, y: 15}, {x: 37, y: 15},
                        {x: 34, y: 16}, {x: 35, y: 16}, {x: 36, y: 16}, {x: 37, y: 16}
                    ]
                },
                npcs: [
                    {
                        id: 'kim_deputy',
                        name: '김대리',
                        x: 10, y: 10,
                        dialog: [
                            '아! 새로 온 사람이구나. 나는 710호 본사 IT팀의 김대리야.',
                            '오늘이 첫 출근이라고? 그럼 IT팀 첫 출근 소동을 겪어봐야겠네!',
                            '여기서는 컴퓨터 한 대가 갑자기 먹통이 되는 게 일상이거든.'
                        ],
                        hasChoices: true,
                        dialogChoices: {
                            question: "IT팀에 대해 더 알고 싶으신가요?",
                            choices: [
                                {
                                    text: "IT팀 첫 출근 소동이 뭔가요?",
                                    response: [
                                        "아침에 출근하면 항상 누군가의 컴퓨터가 문제를 일으켜!",
                                        "오늘은 특히 심각해. 메인 서버 중 하나가 이상 증상을 보이고 있어.",
                                        "네가 IT 관련 아이템들을 찾아서 문제를 해결해주면 정말 고맙겠어!",
                                        "키보드, 마우스, USB 같은 기본 장비들이 필요해."
                                    ]
                                },
                                {
                                    text: "휴넷 IT 시스템에 대해 알려주세요",
                                    response: [
                                        "휴넷의 IT 시스템은 꽤 복잡해. 각 층마다 다른 네트워크를 사용하거든.",
                                        "7층은 일반 사무 업무용, 8층은 각 본부별 전용 시스템이 있어.",
                                        "9층은... 음, 거기는 특별한 보안 시스템이 있어서 함부로 접근할 수 없어.",
                                        "IT 장비들을 잘 관리하는 게 이 회사에서 살아남는 방법 중 하나야!"
                                    ]
                                }
                            ]
                        }
                    },
                    {
                        id: 'office_worker_1',
                        name: '동료 직원',
                        x: 20, y: 15,
                        dialog: [
                            '어? 새 얼굴이네! 반가워. 나는 7층에서 일하는 박사원이야.',
                            '오늘 첫 출근이라면서? 그럼 점심시간 전쟁을 경험해봐야겠네!',
                            '11시 50분부터 시작되는 휴넷의 대표적인 생존 게임이지.'
                        ],
                        hasChoices: true,
                        dialogChoices: {
                            question: "점심시간에 대해 더 알고 싶나요?",
                            choices: [
                                {
                                    text: "점심시간 전쟁이 뭔가요?",
                                    response: [
                                        "휴넷에는 정말 맛있는 카페들이 많아. 스타벅스, 매머드 커피, 국밥92, 팀 호튼스...",
                                        "문제는 모든 직원이 동시에 몰린다는 거지!",
                                        "11시 50분부터 움직이기 시작해서 12시 정각에는 이미 줄이 엄청나.",
                                        "각 카페마다 인기 메뉴가 다르니까 미리 정보를 수집해두는 게 좋아!"
                                    ]
                                },
                                {
                                    text: "휴넷 카페 추천 메뉴가 있나요?",
                                    response: [
                                        "스타벅스는 아메리카노가 기본이고, 시즌 메뉴도 괜찮아.",
                                        "매머드 커피는 라떼류가 정말 맛있어. 특히 바닐라 라떼!",
                                        "국밥92는... 이름처럼 국밥이 메인이지만 다른 한식도 훌륭해.",
                                        "팀 호튼스는 도넛이 유명하지만 샌드위치류도 괜찮아."
                                    ]
                                }
                            ]
                        }
                    },
                    {
                        id: 'office_worker_2',
                        name: '박직원',
                        x: 26, y: 18,
                        dialog: [
                            '안녕! 나는 709호 계열사에서 일하는 박직원이야.',
                            '7층 생활에 빨리 적응했으면 좋겠네. 여기서 일하는 건 생각보다 재미있어!',
                            '각 부서마다 특색이 있으니까 천천히 둘러보면서 분위기를 파악해봐.'
                        ],
                        hasChoices: true,
                        dialogChoices: {
                            question: "7층 생활에 대해 더 알고 싶어요!",
                            choices: [
                                {
                                    text: "709호 계열사는 어떤 일을 하나요?",
                                    response: [
                                        "우리는 휴넷 계열사 업무를 담당하고 있어.",
                                        "다양한 프로젝트를 진행하면서 본사와 협력하는 일이 많지.",
                                        "가끔 다른 층과도 연계 업무를 하니까 엘리베이터 이용이 잦아.",
                                        "네가 회사 생활에 적응하면 같이 협업할 기회도 있을 거야!"
                                    ]
                                },
                                {
                                    text: "7층에서의 업무 꿀팁이 있나요?",
                                    response: [
                                        "프린터기가 자주 문제를 일으키니까 여분의 토너를 항상 준비해둬.",
                                        "커피머신 근처는 비공식 회의 장소야. 중요한 정보를 얻을 수 있어!",
                                        "오후 3시쯤 되면 모든 사람이 졸려하니까 그때가 조용히 업무하기 좋아.",
                                        "금요일 오후는 분위기가 제일 좋으니까 새로운 아이디어 제안하기 적절해!"
                                    ]
                                }
                            ]
                        }
                    }
                ],
                items: [
                    { x: 8, y: 6, type: 'order_form', name: '커피 주문서', icon: '☕', description: '김대리가 찾고 있던 커피 주문서' },
                    { x: 24, y: 10, type: 'mouse', name: '무선 마우스', icon: '🖱️', description: 'IT 업무용 고성능 마우스' },
                    { x: 4, y: 18, type: 'usb', name: 'USB 드라이브', icon: '💾', description: '중요한 데이터가 들어있는 USB' },
                    { x: 32, y: 12, type: 'manual', name: 'IT 매뉴얼', icon: '📖', description: '휴넷 IT 시스템 가이드' },
                    { x: 16, y: 22, type: 'receipt', name: '점심 영수증', icon: '🍽️', description: '점심시간 전쟁 생존 인증서' },
                    { x: 28, y: 6, type: 'cable', name: '네트워크 케이블', icon: '🔌', description: '서버 연결용 랜 케이블' }
                ],
                portals: [],
                elevatorPanel: { x: 32, y: 15 }
            },

            [CONSTANTS.MAPS.FLOOR_8_EDUCATION_SERVICE]: {
                name: '8층 - 교육서비스본부 & 영업지원본부',
                background: '#FFF8E1',
                walls: this.generateWalls(),
                officeItems: {
                    ...officeItems,
                    desks: [
                        {x: 8, y: 8}, {x: 12, y: 8}, {x: 16, y: 8}, {x: 20, y: 8},
                        {x: 24, y: 8}, {x: 28, y: 8},
                        {x: 8, y: 16}, {x: 12, y: 16}, {x: 16, y: 16}, {x: 20, y: 16},
                        {x: 24, y: 16}, {x: 28, y: 16}
                    ],
                    meetingTables: [
                        {x: 6, y: 22}, {x: 10, y: 22}, {x: 14, y: 22},
                        {x: 22, y: 22}, {x: 26, y: 22}, {x: 30, y: 22}
                    ],
                    whiteboards: [
                        {x: 4, y: 20}, {x: 18, y: 20}, {x: 32, y: 20}
                    ],
                    computers: [
                        {x: 8, y: 7}, {x: 12, y: 7}, {x: 16, y: 7}, {x: 20, y: 7},
                        {x: 24, y: 7}, {x: 28, y: 7}
                    ],
                    elevatorDoors: [
                        {x: 34, y: 14}, {x: 35, y: 14}, {x: 36, y: 14}, {x: 37, y: 14},
                        {x: 34, y: 15}, {x: 35, y: 15}, {x: 36, y: 15}, {x: 37, y: 15},
                        {x: 34, y: 16}, {x: 35, y: 16}, {x: 36, y: 16}, {x: 37, y: 16}
                    ]
                },
                npcs: [
                    {
                        id: 'manager_lee',
                        name: '이과장',
                        x: 12, y: 10,
                        dialog: [
                            '어서 와! 영업+교육지원본부의 이과장이야.',
                            '오늘 첫 출근이라고? 그럼 첫 번째 회의에 참석해봐야겠네!',
                            '8층에서는 여러 본부가 함께 일하니까 협업이 정말 중요해.'
                        ],
                        hasChoices: true,
                        dialogChoices: {
                            question: "8층 업무에 대해 궁금한 게 있나요?",
                            choices: [
                                {
                                    text: "첫 번째 회의가 어떤 건가요?",
                                    response: [
                                        "신입사원들이 겪는 첫 번째 시련이지! 회의 문화에 적응하는 거야.",
                                        "우리는 매일 오전에 각 본부별 브리핑을 진행해.",
                                        "회의 자료, 프레젠테이션, 보고서... 이런 것들을 준비해야 해.",
                                        "네가 관련 아이템들을 찾아서 회의 준비를 도와주면 고맙겠어!"
                                    ]
                                },
                                {
                                    text: "영업+교육지원본부는 어떤 일을 하나요?",
                                    response: [
                                        "우리는 휴넷의 영업과 교육 지원을 담당하고 있어.",
                                        "고객사와의 미팅, 교육 프로그램 기획, 영업 전략 수립... 정말 다양해!",
                                        "특히 교육 부분에서는 8층의 교육서비스본부와 긴밀하게 협력하지.",
                                        "네가 여기서 일하게 되면 정말 많은 걸 배울 수 있을 거야!"
                                    ]
                                }
                            ]
                        }
                    },
                    {
                        id: 'education_manager',
                        name: '교육매니저',
                        x: 24, y: 14,
                        dialog: [
                            '안녕하세요! 교육서비스본부의 교육매니저 최교육입니다.',
                            '신입사원 교육 체험에 오신 걸 환영해요!',
                            '휴넷은 교육 전문 기업답게 직원 교육에도 많은 신경을 쓰고 있어요.'
                        ],
                        hasChoices: true,
                        dialogChoices: {
                            question: "교육 체험에 대해 알고 싶어요!",
                            choices: [
                                {
                                    text: "신입사원 교육 체험이 뭔가요?",
                                    response: [
                                        "휴넷에서 제공하는 다양한 교육 프로그램을 직접 체험해보는 거예요!",
                                        "온라인 강의, 오프라인 워크숍, 멘토링 시스템... 정말 다양해요.",
                                        "교육 자료와 학습 도구들을 찾아서 실제로 사용해보세요.",
                                        "체험이 끝나면 교육 수료증도 받을 수 있어요!"
                                    ]
                                },
                                {
                                    text: "휴넷의 교육 철학이 궁금해요",
                                    response: [
                                        "휴넷은 '사람이 성장하면 기업도 성장한다'는 철학을 가지고 있어요.",
                                        "26년간 축적된 교육 노하우로 최고의 학습 경험을 제공하죠.",
                                        "개인 맞춤형 학습부터 조직 단위 교육까지 모든 걸 커버해요.",
                                        "여러분도 이곳에서 많은 걸 배우고 성장하실 거예요!"
                                    ]
                                }
                            ]
                        }
                    },
                    {
                        id: 'ai_researcher',
                        name: 'AI 연구원',
                        x: 8, y: 20,
                        dialog: [
                            '안녕하세요! AI연구소에서 인공지능 연구를 하고 있어요.',
                            '요즘 ChatGPT, 생성형 AI 등이 화제이잖아요.',
                            '궤금하신 것이 있으면 언제든지 물어보세요!'
                        ],
                        hasChoices: true,
                        dialogChoices: {
                            question: "무엇이 궤금하신가요?",
                            choices: [
                                {
                                    text: "AI가 인간의 일자리를 빼앗는다면?",
                                    response: "좋은 질문이에요! 오히려 AI가 인간의 창의적 업무를 더 돋워준다고 생각해요."
                                },
                                {
                                    text: "휴넷에서 AI를 어떻게 활용하나요?",
                                    response: "개인화 교육, 학습 분석 등에 활용하고 있어요. 미래에는 더 다양한 분야로 확대할 예정이에요!"
                                }
                            ]
                        }
                    },
                    {
                        id: 'librarian',
                        name: '상상력발전소 사서',
                        x: 35, y: 25,
                        dialog: [
                            '안녕하세요! 상상력발전소 도서관 사서입니다.',
                            '여기에는 비즈니스, 자기계발, 인문학 등 다양한 책들이 있어요.',
                            '직원들의 지식 향상을 위해 마련된 특별한 공간이죠!'
                        ],
                        hasChoices: true,
                        dialogChoices: {
                            question: "어떤 책을 추천해주시겠어요?",
                            choices: [
                                {
                                    text: "비즈니스 관련 책",
                                    response: "신입사원에게는 '어떻게 일할 것인가'를 추천드리고 싶어요. 일하는 방식에 대한 인사이트가 담겨 있거든요."
                                },
                                {
                                    text: "자기계발 책",
                                    response: "자기계발서도 좋아요! '성장 마인드셋'이라는 책이 요즘 인기 많더라고요."
                                }
                            ]
                        }
                    }
                ],
                items: [
                    { x: 6, y: 12, type: 'presentation', name: '프레젠테이션 자료', icon: '📊', description: '첫 회의용 발표 자료' },
                    { x: 18, y: 9, type: 'report', name: '업무 보고서', icon: '📋', description: '이과장이 찾던 보고서' },
                    { x: 30, y: 12, type: 'education_material', name: '교육 자료', icon: '📚', description: '신입사원용 교육 교재' },
                    { x: 8, y: 20, type: 'whiteboard_marker', name: '화이트보드 마커', icon: '✏️', description: '회의용 마커 세트' },
                    { x: 26, y: 18, type: 'certificate', name: '교육 수료증', icon: '🏆', description: '교육 체험 완료 인증서' },
                    { x: 14, y: 6, type: 'meeting_notes', name: '회의록', icon: '📝', description: '중요한 회의 내용 정리' },
                    { x: 32, y: 24, type: 'department_notes', name: '부서 탐방 노트', icon: '📔', description: '8층 각 본부 특색 정리 노트' }
                ],
                portals: [],
                elevatorPanel: { x: 32, y: 15 }
            },

            [CONSTANTS.MAPS.FLOOR_9_CEO_OFFICE]: {
                name: '9층 - CEO실',
                background: '#F3E5F5',
                walls: this.generateWalls(),
                officeItems: {
                    ...officeItems,
                    desks: [
                        {x: 12, y: 8}, {x: 20, y: 8}, {x: 28, y: 8},
                        {x: 8, y: 16}, {x: 16, y: 16}, {x: 24, y: 16}
                    ],
                    meetingTables: [
                        {x: 12, y: 20}, {x: 16, y: 20}, {x: 20, y: 20}, {x: 24, y: 20}
                    ],
                    computers: [
                        {x: 12, y: 7}, {x: 20, y: 7}, {x: 28, y: 7}
                    ],
                    plants: [
                        {x: 6, y: 6}, {x: 32, y: 6}, {x: 6, y: 24}, {x: 32, y: 24}
                    ],
                    elevatorDoors: [
                        {x: 34, y: 14}, {x: 35, y: 14}, {x: 36, y: 14}, {x: 37, y: 14},
                        {x: 34, y: 15}, {x: 35, y: 15}, {x: 36, y: 15}, {x: 37, y: 15},
                        {x: 34, y: 16}, {x: 35, y: 16}, {x: 36, y: 16}, {x: 37, y: 16}
                    ]
                },
                npcs: [
                    {
                        id: 'yoon_dohyun',
                        name: '윤도현',
                        x: 16, y: 12,
                        dialog: [
                            '어? 어떻게 9층까지 올라왔지? 나는 인사경영실 총무담당 윤도현이야.',
                            '9층은 함부로 올 수 있는 곳이 아닌데... 정말 대단한 신입이네!',
                            '그럼 진짜 9층 진입 작전을 성공한 거야? 축하해!'
                        ],
                        hasChoices: true,
                        dialogChoices: {
                            question: "9층에 대해 더 알고 싶어요!",
                            choices: [
                                {
                                    text: "9층 진입 작전이 뭔가요?",
                                    response: [
                                        "9층은 경영진이 계신 곳이라 특별한 보안 시스템이 있어.",
                                        "일반 직원들은 특별한 사유 없이는 올라올 수 없지.",
                                        "네가 여기까지 온 건 정말 대단한 일이야!",
                                        "이제 CEO님을 만날 자격이 있는 것 같은데?"
                                    ]
                                },
                                {
                                    text: "인사경영실에서는 어떤 일을 하나요?",
                                    response: [
                                        "인사경영실은 회사의 핵심 운영을 담당해.",
                                        "채용, 인사관리, 총무, 경영 지원... 정말 중요한 업무들이지.",
                                        "특히 신입사원들의 적응을 도우는 것도 우리 일 중 하나야.",
                                        "네가 이렇게 잘 적응한 걸 보니 정말 뿌듯하네!"
                                    ]
                                }
                            ]
                        }
                    },
                    {
                        id: 'kang_haebin',
                        name: '강해빈 (인사경영실)',
                        x: 8, y: 18,
                        dialog: [
                            '어머! 로비에서 봤던 신입사원이네요!',
                            '정말로 9층까지 올라왔군요. 대단해요!',
                            '인사경영실에서도 당신의 성장을 지켜보고 있었어요.'
                        ],
                        hasChoices: true,
                        dialogChoices: {
                            question: "더 궁금한 게 있으신가요?",
                            choices: [
                                {
                                    text: "제가 9층에 온 걸 어떻게 알았죠?",
                                    response: [
                                        "인사경영실에서는 모든 신입사원의 적응 과정을 모니터링해요.",
                                        "당신이 각 층에서 보여준 모습들이 정말 인상적이었어요!",
                                        "이제 최종 단계만 남았네요. CEO님과의 만남이요!",
                                        "준비되셨다면 CEO님께 인사드리러 가보세요!"
                                    ]
                                },
                                {
                                    text: "휴넷 생활에 대한 총평을 해주세요",
                                    response: [
                                        "정말 훌륭하게 적응하셨어요!",
                                        "각 층에서 만난 동료들도 당신을 좋게 기억할 거예요.",
                                        "휴넷의 진정한 가치를 이해하고 체험하신 것 같아서 기뻐요.",
                                        "앞으로도 이런 열정으로 함께 성장해가요!"
                                    ]
                                }
                            ]
                        }
                    },
                    {
                        id: 'ceo_kim',
                        name: '조영탁 CEO',
                        x: 24, y: 10,
                        dialog: [
                            '오! 드디어 9층까지 올라온 신입사원이 나타났군요!',
                            '저는 휴넷의 CEO 조영탁입니다. 만나서 반갑습니다.',
                            '26년간 휴넷을 이끌어오면서 이런 적극적인 신입사원을 만나니 정말 기뻐요.'
                        ],
                        hasChoices: true,
                        dialogChoices: {
                            question: "CEO님과의 특별한 대화를 나눠보세요!",
                            choices: [
                                {
                                    text: "휴넷의 미래 비전에 대해 듣고 싶어요",
                                    response: [
                                        "휴넷은 지난 26년간 대한민국 교육 산업의 혁신을 주도해왔습니다.",
                                        "앞으로도 개인과 기업의 성장을 돕는 최고의 교육 파트너가 되겠어요.",
                                        "디지털 전환 시대에 맞는 새로운 교육 방법론을 개발하고 있습니다.",
                                        "여러분 같은 인재가 있어서 휴넷의 미래가 더욱 밝아 보입니다!"
                                    ]
                                },
                                {
                                    text: "신입사원으로서 어떻게 성장해야 할까요?",
                                    response: [
                                        "가장 중요한 것은 배움에 대한 열정입니다.",
                                        "실패를 두려워하지 말고 도전하세요. 그것이 성장의 원동력입니다.",
                                        "동료들과의 소통과 협업을 중시하세요. 혼자서는 할 수 없는 일들이 많아요.",
                                        "휴넷의 가치를 이해하고 고객에게 진정한 도움을 주는 것이 우리의 사명입니다."
                                    ]
                                }
                            ]
                        }
                    }
                ],
                items: [
                    { x: 10, y: 6, type: 'executive_pass', name: '임원 출입증', icon: '🏅', description: '9층 진입 성공의 증표' },
                    { x: 30, y: 14, type: 'company_history', name: '휴넷 26년사', icon: '📜', description: '휴넷의 발자취를 담은 역사서' },
                    { x: 6, y: 20, type: 'vision_book', name: '비전 북', icon: '🔮', description: 'CEO의 경영 철학과 미래 비전' },
                    { x: 28, y: 22, type: 'golden_badge', name: '골든 배지', icon: '🌟', description: 'CEO 직접 수여하는 특별 배지' },
                    { x: 18, y: 26, type: 'completion_certificate', name: '최종 수료증', icon: '🏆', description: '휴넷 생존기 최종 완주 증명서' },
                    { x: 4, y: 10, type: 'floor_pass', name: '9층 출입 허가서', icon: '🔑', description: '윤도현이 발급한 9층 출입 허가서' },
                    { x: 32, y: 8, type: 'meeting_request', name: 'CEO 면담 요청서', icon: '📋', description: 'CEO와의 면담을 위한 요청서' }
                ],
                portals: [],
                elevatorPanel: { x: 32, y: 15 }
            },

            [CONSTANTS.MAPS.STARBUCKS]: {
                name: '스타벅스',
                background: '#2D5830',
                walls: this.generateWalls(),
                officeItems: {
                    ...officeItems,
                    meetingTables: [
                        {x: 8, y: 8}, {x: 12, y: 8}, {x: 16, y: 8}, {x: 20, y: 8},
                        {x: 8, y: 12}, {x: 12, y: 12}, {x: 16, y: 12}, {x: 20, y: 12},
                        {x: 8, y: 20}, {x: 12, y: 20}, {x: 16, y: 20}, {x: 20, y: 20}
                    ],
                    chairs: [
                        {x: 8, y: 9}, {x: 12, y: 9}, {x: 16, y: 9}, {x: 20, y: 9},
                        {x: 8, y: 13}, {x: 12, y: 13}, {x: 16, y: 13}, {x: 20, y: 13}
                    ],
                    coffeeMachines: [
                        {x: 28, y: 10}, {x: 30, y: 10}, {x: 32, y: 10}
                    ],
                    elevatorDoors: [
                        {x: 34, y: 14}, {x: 35, y: 14}, {x: 36, y: 14}, {x: 37, y: 14},
                        {x: 34, y: 15}, {x: 35, y: 15}, {x: 36, y: 15}, {x: 37, y: 15},
                        {x: 34, y: 16}, {x: 35, y: 16}, {x: 36, y: 16}, {x: 37, y: 16}
                    ]
                },
                npcs: [
                    {
                        id: 'starbucks_barista',
                        name: '스타벅스 바리스타',
                        x: 28, y: 12,
                        dialog: [
                            '안녕하세요! 휴넷 스타벅스에 오신 걸 환영해요!',
                            '점심시간 전쟁의 한복판에 오신 건가요?',
                            '여기서는 빠른 주문과 결제가 생존의 핵심이에요!'
                        ],
                        hasChoices: true,
                        dialogChoices: {
                            question: "어떤 도움이 필요하신가요?",
                            choices: [
                                {
                                    text: "인기 메뉴를 추천해주세요",
                                    response: [
                                        "휴넷 직원들이 가장 많이 시키는 건 아메리카노예요!",
                                        "바닐라 라떼와 카라멜 마키아토도 인기가 많아요.",
                                        "점심 후에는 디카페인 음료들이 인기가 높죠.",
                                        "시즌 한정 메뉴도 꼭 한번 드셔보세요!"
                                    ]
                                },
                                {
                                    text: "점심시간 꿀팁을 알려주세요",
                                    response: [
                                        "11시 50분 전에 미리 와서 주문하시는 게 좋아요!",
                                        "휴넷 앱으로 미리 주문하면 줄을 서지 않아도 돼요.",
                                        "현금보다는 카드 결제가 훨씬 빨라요.",
                                        "테이크아웃이 매장 이용보다 대기시간이 짧아요!"
                                    ]
                                }
                            ]
                        }
                    },
                    {
                        id: 'office_regular',
                        name: '단골 직장인',
                        x: 12, y: 15,
                        dialog: [
                            '어? 새 얼굴이네! 나는 여기 단골이야.',
                            '매일 점심시간마다 여기 와서 아메리카노 마시고 가거든.',
                            '스타벅스는 휴넷에서 일하는 사람들의 성지 같은 곳이지!'
                        ],
                        hasChoices: true,
                        dialogChoices: {
                            question: "스타벅스 이용 팁이 있나요?",
                            choices: [
                                {
                                    text: "어떻게 하면 빨리 주문할 수 있나요?",
                                    response: [
                                        "메뉴를 미리 정해두고 오는 게 제일 중요해!",
                                        "복잡한 커스텀 주문은 피하고 기본 메뉴로 가자.",
                                        "결제 수단도 미리 준비해두고!",
                                        "가끔 직원들끼리 단체 주문하는 경우도 있으니 그때는 피해!"
                                    ]
                                },
                                {
                                    text: "스타벅스에서 일하는 사람들 만나나요?",
                                    response: [
                                        "여기서 다른 층 직원들과 자주 마주쳐!",
                                        "가끔 중요한 이야기들도 들을 수 있어.",
                                        "네트워킹하기에도 좋은 곳이야.",
                                        "점심시간에는 거의 회사 사람들로 가득해!"
                                    ]
                                }
                            ]
                        }
                    }
                ],
                items: [
                    { x: 6, y: 10, type: 'americano', name: '아메리카노', icon: '☕', description: '휴넷인의 기본 음료' },
                    { x: 24, y: 14, type: 'latte', name: '바닐라 라떼', icon: '🥛', description: '달콤한 오후를 위한 라떼' },
                    { x: 10, y: 22, type: 'sandwich', name: '샌드위치', icon: '🥪', description: '간단한 점심 대용' },
                    { x: 32, y: 18, type: 'tumbler', name: '스타벅스 텀블러', icon: '🥤', description: '환경을 생각하는 텀블러' }
                ],
                portals: [],
                elevatorPanel: { x: 32, y: 15 }
            },

            [CONSTANTS.MAPS.MAMMOTH_COFFEE]: {
                name: '매머드 커피',
                background: '#8B4513',
                walls: this.generateWalls(),
                officeItems: {
                    ...officeItems,
                    meetingTables: [
                        {x: 6, y: 8}, {x: 10, y: 8}, {x: 14, y: 8}, {x: 18, y: 8}, {x: 22, y: 8},
                        {x: 6, y: 16}, {x: 10, y: 16}, {x: 14, y: 16}, {x: 18, y: 16}, {x: 22, y: 16},
                        {x: 6, y: 22}, {x: 10, y: 22}, {x: 14, y: 22}, {x: 18, y: 22}
                    ],
                    coffeeMachines: [
                        {x: 26, y: 10}, {x: 28, y: 10}, {x: 30, y: 10}
                    ],
                    elevatorDoors: [
                        {x: 34, y: 14}, {x: 35, y: 14}, {x: 36, y: 14}, {x: 37, y: 14},
                        {x: 34, y: 15}, {x: 35, y: 15}, {x: 36, y: 15}, {x: 37, y: 15},
                        {x: 34, y: 16}, {x: 35, y: 16}, {x: 36, y: 16}, {x: 37, y: 16}
                    ]
                },
                npcs: [
                    {
                        id: 'mammoth_owner',
                        name: '매머드 사장님',
                        x: 26, y: 12,
                        dialog: [
                            '어서 오세요! 매머드 커피입니다!',
                            '우리는 원두에 진짜 자신 있어요. 신입사원이시군요?',
                            '매머드만의 특별한 원두 블렌딩을 경험해보세요!'
                        ],
                        hasChoices: true,
                        dialogChoices: {
                            question: "매머드 커피만의 특별함이 뭔가요?",
                            choices: [
                                {
                                    text: "시그니처 메뉴를 추천해주세요",
                                    response: [
                                        "매머드 라떼가 저희 대표 메뉴예요!",
                                        "직접 로스팅한 원두로 만든 진짜 맛있는 커피죠.",
                                        "휴넷 직원분들 사이에서 입소문이 자자해요.",
                                        "한 번 드시면 다른 커피는 못 마실 걸요!"
                                    ]
                                },
                                {
                                    text: "매머드 커피의 특별한 이야기가 있나요?",
                                    response: [
                                        "저희는 정성스럽게 직접 로스팅한 원두만 사용해요.",
                                        "매일 아침 일찍 와서 그날 쓸 원두를 준비하죠.",
                                        "휴넷 직원분들의 피드백을 받아서 메뉴를 개발하고 있어요.",
                                        "커피 한 잔에 정성을 담는 것이 저희 철학입니다!"
                                    ]
                                }
                            ]
                        }
                    },
                    {
                        id: 'coffee_enthusiast',
                        name: '커피 매니아 직원',
                        x: 14, y: 18,
                        dialog: [
                            '아! 새로운 커피 러버가 나타났군! 반가워!',
                            '나는 휴넷에서 일하면서 커피를 정말 좋아하는 김커피야.',
                            '매머드 커피는 진짜 숨겨진 보석 같은 곳이지!'
                        ],
                        hasChoices: true,
                        dialogChoices: {
                            question: "커피에 대해 더 알고 싶어요!",
                            choices: [
                                {
                                    text: "매머드 커피만의 매력이 뭔가요?",
                                    response: [
                                        "일단 원두 품질이 다른 곳과 비교할 수 없이 좋아!",
                                        "사장님이 직접 로스팅해서 신선도가 최고야.",
                                        "가격도 합리적이고 양도 푸짐해!",
                                        "특히 라떼 계열 음료는 정말 예술이야!"
                                    ]
                                },
                                {
                                    text: "휴넷에서 커피 생활 팁 좀 알려주세요",
                                    response: [
                                        "각 카페마다 특색이 있으니까 다양하게 시도해봐!",
                                        "매머드는 진짜 커피맛을 원할 때, 스타벅스는 무난할 때.",
                                        "오후 3시 이후엔 디카페인을 추천해!",
                                        "텀블러 가져오면 할인해주는 곳들이 많으니까 챙겨!"
                                    ]
                                }
                            ]
                        }
                    }
                ],
                items: [
                    { x: 8, y: 10, type: 'mammoth_latte', name: '매머드 라떼', icon: '🥛', description: '매머드 커피의 시그니처 음료' },
                    { x: 20, y: 12, type: 'coffee_beans', name: '원두 원두', icon: '☕', description: '직접 로스팅한 프리미엄 원두' },
                    { x: 12, y: 24, type: 'drip_coffee', name: '드립 커피', icon: '☕', description: '핸드드립으로 내린 깊은 맛' },
                    { x: 30, y: 20, type: 'coffee_grinder', name: '커피 그라인더', icon: '⚙️', description: '원두를 갈아주는 기계' }
                ],
                portals: [],
                elevatorPanel: { x: 32, y: 15 }
            },

            [CONSTANTS.MAPS.KOOK_BAB_92]: {
                name: '국밥92',
                background: '#CD853F',
                walls: this.generateWalls(),
                officeItems: {
                    ...officeItems,
                    meetingTables: [
                        {x: 6, y: 8}, {x: 10, y: 8}, {x: 14, y: 8}, {x: 18, y: 8}, {x: 22, y: 8}, {x: 26, y: 8},
                        {x: 6, y: 12}, {x: 10, y: 12}, {x: 14, y: 12}, {x: 18, y: 12}, {x: 22, y: 12}, {x: 26, y: 12},
                        {x: 6, y: 20}, {x: 10, y: 20}, {x: 14, y: 20}, {x: 18, y: 20}, {x: 22, y: 20}
                    ],
                    chairs: [
                        {x: 6, y: 9}, {x: 10, y: 9}, {x: 14, y: 9}, {x: 18, y: 9}, {x: 22, y: 9}, {x: 26, y: 9}
                    ],
                    elevatorDoors: [
                        {x: 34, y: 14}, {x: 35, y: 14}, {x: 36, y: 14}, {x: 37, y: 14},
                        {x: 34, y: 15}, {x: 35, y: 15}, {x: 36, y: 15}, {x: 37, y: 15},
                        {x: 34, y: 16}, {x: 35, y: 16}, {x: 36, y: 16}, {x: 37, y: 16}
                    ]
                },
                npcs: [
                    {
                        id: 'gukbap_ajumma',
                        name: '국밥 이모님',
                        x: 28, y: 10,
                        dialog: [
                            '어이고! 새로 온 사람이네! 어서 와요!',
                            '여기는 국밥92예요. 정성스럽게 끓인 국밥이 유명하죠!',
                            '휴넷 사람들이 진짜 많이 오는데, 특히 추운 날엔 줄을 서요!'
                        ],
                        hasChoices: true,
                        dialogChoices: {
                            question: "어떤 메뉴를 추천해주세요?",
                            choices: [
                                {
                                    text: "시그니처 국밥을 먹고 싶어요",
                                    response: [
                                        "우리 돼지국밥이 제일 유명해요!",
                                        "사골을 12시간 동안 끓여서 국물이 진짜 진해요.",
                                        "고기도 푸짐하게 들어가고 김치도 직접 담갔어요!",
                                        "한 그릇 먹으면 오후에 힘이 넘칠 거예요!"
                                    ]
                                },
                                {
                                    text: "다른 메뉴도 있나요?",
                                    response: [
                                        "국밥 말고도 찌개류도 정말 맛있어요!",
                                        "김치찌개, 된장찌개, 부대찌개... 다 해요!",
                                        "보쌈이랑 족발도 있고, 간단한 안주류도 있어요.",
                                        "뭘 드셔도 후회 안 하실 거예요!"
                                    ]
                                }
                            ]
                        }
                    },
                    {
                        id: 'hungry_employee',
                        name: '배고픈 직장인',
                        x: 16, y: 16,
                        dialog: [
                            '아~ 배고파 죽겠어! 점심시간이 기다려지지 않아!',
                            '국밥92는 휴넷에서 정말 든든한 한 끼를 해결할 수 있는 곳이야.',
                            '커피랑 빵으로는 배가 안 차니까, 이런 곳이 진짜 필요해!'
                        ],
                        hasChoices: true,
                        dialogChoices: {
                            question: "국밥92에 대해 더 알려주세요!",
                            choices: [
                                {
                                    text: "왜 국밥92를 자주 오나요?",
                                    response: [
                                        "일단 양이 정말 많아! 한 그릇 먹으면 오후까지 든든해.",
                                        "가격도 합리적이고 맛도 좋고!",
                                        "특히 추운 겨울날에는 뜨끈한 국밥이 최고야.",
                                        "이모님이 정말 친절하셔서 기분도 좋아져!"
                                    ]
                                },
                                {
                                    text: "점심시간 혼잡도는 어때요?",
                                    response: [
                                        "12시 정각에는 정말 사람이 많아!",
                                        "11시 50분이나 12시 30분쯤 오면 좀 여유로워.",
                                        "국밥은 빨리 나오니까 회전율은 괜찮은 편이야.",
                                        "테이블이 많아서 스타벅스보다는 앉을 자리가 있어!"
                                    ]
                                }
                            ]
                        }
                    }
                ],
                items: [
                    { x: 8, y: 14, type: 'gukbap', name: '돼지국밥', icon: '🍲', description: '이모님 정성이 담긴 돼지국밥' },
                    { x: 20, y: 10, type: 'kimchi', name: '직접 담근 김치', icon: '🥬', description: '국밥과 찰떡궁합인 김치' },
                    { x: 24, y: 18, type: 'jjigae', name: '김치찌개', icon: '🍲', description: '매콤하고 시원한 김치찌개' },
                    { x: 12, y: 22, type: 'banchan', name: '반찬 세트', icon: '🥘', description: '정갈하게 준비된 반찬들' }
                ],
                portals: [],
                elevatorPanel: { x: 32, y: 15 }
            },

            [CONSTANTS.MAPS.TIM_HORTONS]: {
                name: '팀 호튼스',
                background: '#8B0000',
                walls: this.generateWalls(),
                officeItems: {
                    ...officeItems,
                    meetingTables: [
                        {x: 8, y: 8}, {x: 12, y: 8}, {x: 16, y: 8}, {x: 20, y: 8}, {x: 24, y: 8},
                        {x: 8, y: 14}, {x: 12, y: 14}, {x: 16, y: 14}, {x: 20, y: 14}, {x: 24, y: 14},
                        {x: 8, y: 20}, {x: 12, y: 20}, {x: 16, y: 20}, {x: 20, y: 20}
                    ],
                    coffeeMachines: [
                        {x: 28, y: 10}, {x: 30, y: 10}
                    ],
                    elevatorDoors: [
                        {x: 34, y: 14}, {x: 35, y: 14}, {x: 36, y: 14}, {x: 37, y: 14},
                        {x: 34, y: 15}, {x: 35, y: 15}, {x: 36, y: 15}, {x: 37, y: 15},
                        {x: 34, y: 16}, {x: 35, y: 16}, {x: 36, y: 16}, {x: 37, y: 16}
                    ]
                },
                npcs: [
                    {
                        id: 'timhortons_staff',
                        name: '팀 호튼스 직원',
                        x: 28, y: 12,
                        dialog: [
                            '안녕하세요! 팀 호튼스입니다!',
                            '캐나다에서 온 정통 도넛과 커피를 맛보세요!',
                            '휴넷 직원분들이 특히 도넛을 좋아하시더라고요!'
                        ],
                        hasChoices: true,
                        dialogChoices: {
                            question: "팀 호튼스만의 특별함이 뭔가요?",
                            choices: [
                                {
                                    text: "유명한 도넛을 먹고 싶어요",
                                    response: [
                                        "팀비트가 저희의 시그니처 도넛이에요!",
                                        "작고 동글동글한 도넛 구멍 부분만 따로 만든 거예요.",
                                        "달콤하고 부드러워서 커피와 정말 잘 어울려요!",
                                        "한 번에 여러 개씩 드시는 분들이 많아요!"
                                    ]
                                },
                                {
                                    text: "캐나다 정통 메뉴가 궁금해요",
                                    response: [
                                        "더블더블이라고 들어보셨나요? 설탕 2개, 크림 2개 넣은 커피예요!",
                                        "아이스캡은 저희만의 특별한 아이스커피예요.",
                                        "샌드위치류도 신선하고 맛있어요!",
                                        "캐나다 현지 맛을 그대로 재현하려고 노력하고 있어요!"
                                    ]
                                }
                            ]
                        }
                    },
                    {
                        id: 'donut_lover',
                        name: '도넛 애호가',
                        x: 16, y: 18,
                        dialog: [
                            '어! 새 얼굴이네! 나는 팀 호튼스 단골 이도넛이야!',
                            '여기 도넛은 정말 예술이야. 달콤함의 정점!',
                            '업무 스트레스 받을 때 여기 와서 도넛 먹으면 천국이야!'
                        ],
                        hasChoices: true,
                        dialogChoices: {
                            question: "도넛에 대해 더 알려주세요!",
                            choices: [
                                {
                                    text: "어떤 도넛이 제일 맛있나요?",
                                    response: [
                                        "팀비트는 기본이고, 글레이즈드 도넛도 정말 맛있어!",
                                        "초콜릿 글레이즈드는 초콜릿 러버들한테 완전 인기!",
                                        "올드패션 도넛은 좀 더 담백해서 커피와 잘 맞아.",
                                        "계절 한정 도넛들도 나오니까 체크해봐!"
                                    ]
                                },
                                {
                                    text: "언제 오는 게 좋나요?",
                                    response: [
                                        "오전에 오면 갓 만든 도넛을 먹을 수 있어!",
                                        "오후 간식 시간인 3-4시도 좋고.",
                                        "점심시간에는 샌드위치를 먹으러 오는 사람들이 많아.",
                                        "도넛은 아무래도 여유로울 때 천천히 즐기는 게 최고야!"
                                    ]
                                }
                            ]
                        }
                    }
                ],
                items: [
                    { x: 10, y: 10, type: 'timbits', name: '팀비트', icon: '🍩', description: '팀 호튼스의 시그니처 미니 도넛' },
                    { x: 22, y: 12, type: 'double_double', name: '더블더블', icon: '☕', description: '캐나다식 정통 커피' },
                    { x: 14, y: 22, type: 'glazed_donut', name: '글레이즈드 도넛', icon: '🍩', description: '달콤한 글레이즈가 코팅된 도넛' },
                    { x: 26, y: 18, type: 'iced_capp', name: '아이스캡', icon: '🥤', description: '팀 호튼스만의 특별한 아이스커피' }
                ],
                portals: [],
                elevatorPanel: { x: 32, y: 15 }
            },

            [CONSTANTS.MAPS.FLOOR_7_709_AFFILIATES]: {
                name: '709호 - 계열사 사무실',
                background: '#F5F5DC',
                walls: this.generateWalls(),
                officeItems: {
                    ...officeItems,
                    desks: [
                        {x: 8, y: 10}, {x: 16, y: 10}, {x: 24, y: 10},
                        {x: 8, y: 18}, {x: 16, y: 18}, {x: 24, y: 18}
                    ],
                    computers: [
                        {x: 8, y: 9}, {x: 16, y: 9}, {x: 24, y: 9}
                    ],
                    chairs: [
                        {x: 8, y: 11}, {x: 16, y: 11}, {x: 24, y: 11}
                    ],
                    meetingTables: [
                        {x: 30, y: 15}
                    ],
                    elevatorDoors: [
                        {x: 34, y: 14}, {x: 35, y: 14}, {x: 36, y: 14}, {x: 37, y: 14},
                        {x: 34, y: 15}, {x: 35, y: 15}, {x: 36, y: 15}, {x: 37, y: 15},
                        {x: 34, y: 16}, {x: 35, y: 16}, {x: 36, y: 16}, {x: 37, y: 16}
                    ]
                },
                npcs: [
                    {
                        id: 'office_worker_2',
                        name: '박직원',
                        x: 16, y: 15,
                        dialog: [
                            '안녕! 나는 709호 계열사에서 일하는 박직원이야.',
                            '7층에서는 우리 계열사와 710호 본사 IT팀이 함께 일하고 있어.',
                            '서로 다른 회사지만 한 건물을 쓰면서 협업하는 경우가 많지!'
                        ],
                        hasChoices: true,
                        dialogChoices: {
                            question: "계열사 업무에 대해 더 알고 싶어요!",
                            choices: [
                                {
                                    text: "계열사는 어떤 일을 하나요?",
                                    response: [
                                        "우리는 휴넷 계열사로 다양한 프로젝트를 담당해.",
                                        "교육 콘텐츠 제작, 시스템 개발 지원, 마케팅 업무 등 정말 다양해!",
                                        "본사와는 별개 회사지만 휴넷 그룹의 일원으로 열심히 일하고 있어.",
                                        "신입사원이 오면 우리도 도움을 많이 주려고 노력해!"
                                    ]
                                },
                                {
                                    text: "7층에서의 생활 팁이 있나요?",
                                    response: [
                                        "710호 IT팀과는 정말 친해! 같이 점심도 먹고 커피도 마시지.",
                                        "IT 문제 생기면 서로 도와주고, 우리는 기획 쪽에서 도움을 주고.",
                                        "7층 화장실은 아침에 청소하니까 9시 이후에 가는 게 좋아!",
                                        "복사기는 우리 쪽이 더 좋으니까 필요하면 언제든 말해!"
                                    ]
                                }
                            ]
                        }
                    }
                ],
                items: [
                    { x: 12, y: 12, type: 'document', name: '계열사 업무 계획서', icon: '📋', description: '이번 분기 계열사 주요 업무' },
                    { x: 28, y: 20, type: 'folder', name: '협업 프로젝트 파일', icon: '📁', description: '본사와의 공동 프로젝트 자료' },
                    { x: 6, y: 22, type: 'namecard', name: '박직원 명함', icon: '💳', description: '709호 계열사 박직원의 명함' }
                ],
                portals: [],
                elevatorPanel: { x: 32, y: 15 }
            },

            // 옥상 (히든 퀘스트용)
            [CONSTANTS.MAPS.ROOFTOP]: {
                name: 'Rooftop',
                background: '#87CEEB',
                walls: this.generateWalls(),
                officeItems: {
                    ...officeItems,
                    plants: [
                        {x: 10, y: 10}, {x: 30, y: 10}, {x: 15, y: 20}, {x: 25, y: 20}
                    ],
                    vendingMachines: [
                        {x: 35, y: 8}
                    ]
                },
                npcs: [
                    {
                        id: 'rooftop_worker',
                        name: '옵상 관리인',
                        x: 12, y: 15,
                        dialog: [
                            '옵상에 올라오다니! 여기서는 휴넷 직원들이 쉬어가는 곳이에요.',
                            '고생 많았는데, 이제 정말 휴넷의 일원이 된 것 같네요!',
                            '특별한 선물이 여기 있다고 들었는데... 찾아보세요!'
                        ],
                        hasChoices: true,
                        dialogChoices: {
                            question: "옵상에서 뭐 할 수 있나요?",
                            choices: [
                                {
                                    text: "휴넷 전체를 내려다보기",
                                    response: "여기서 보는 휴넷의 전체 모습이 눈에 들어오네요! 새로운 시각이 생겼죠?"
                                },
                                {
                                    text: "특별한 선물이 있다고요?",
                                    response: "아, 전 직원들이 하나씩 남기고 간 우정의 증표예요. 그거 찾으면 진짜 휴넷에 속한 거나 마찬가지!"
                                }
                            ]
                        }
                    }
                ],
                items: [
                    { x: 25, y: 8, type: 'friendship_token', name: '우정의 증표', icon: '🤝', description: '과거 직원들이 남긴 우정과 동료애의 상징' },
                    { x: 8, y: 25, type: 'rooftop_note', name: '옥상 일기', icon: '📃', description: '옥상 관리인의 일기장' },
                    { x: 35, y: 20, type: 'sky_view', name: '전망대', icon: '🔍', description: '휴넷 전체를 내려다볼 수 있는 전망대' }
                ],
                portals: [],
                elevatorPanel: { x: 32, y: 15 }
            }
        };
    }
}