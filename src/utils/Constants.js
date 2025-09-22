export const CONSTANTS = {
    TILE_SIZE: 48,
    MAP_WIDTH: 40,
    MAP_HEIGHT: 30,

    GAME_MODES: {
        LOADING: 'loading',
        TITLE: 'title',
        INTRO: 'intro',
        PLAYING: 'playing',
        PAUSED: 'paused',
        CELEBRATION: 'celebration',
        CERTIFICATE: 'certificate'
    },

    DIRECTIONS: {
        UP: 'up',
        DOWN: 'down',
        LEFT: 'left',
        RIGHT: 'right'
    },

    QUEST_TARGETS: {
        // 메인 퀘스트 타겟
        START_GAME: 'start_game',
        COLLECT_MEDAL: 'collect_medal',
        TALK_TO_KIM: 'talk_to_kim',
        TALK_TO_PARK: 'talk_to_park',
        TALK_TO_LEE: 'talk_to_lee',
        TALK_TO_CEO: 'talk_to_ceo',
        COLLECT_EDUCATION: 'collect_education',
        EXPLORE_OFFICE_1: 'explore_office_1',
        FIND_HIDDEN_DOCUMENT: 'find_hidden_document',
        HELP_INTERN: 'help_intern',
        COMPLETE_MEETING_TASK: 'complete_meeting_task',

        // 기존 컬렉션 퀘스트
        COLLECT_26TH_ITEMS: 'collect_26th_items',
        DISCOVER_HISTORY: 'discover_history',
        COLLECT_MESSAGES: 'collect_messages',
        COLLECT_ALL_ITEMS: 'collect_all_items',

        // 새로운 서브 퀘스트들
        DELIVER_PACKAGE: 'deliver_package',
        HELP_VISITOR: 'help_visitor',
        COFFEE_DELIVERY: 'coffee_delivery',
        LUNCH_ORDER: 'lunch_order',
        TRAINING_ASSIST: 'training_assist',
        REPAIR_PRINTER: 'repair_printer',
        FIND_LOST_ITEM: 'find_lost_item',
        MEETING_SETUP: 'meeting_setup',
        EMPLOYEE_INTRODUCTION: 'employee_introduction',
        STRESS_RELIEF: 'stress_relief',
        SECURITY_CHECK: 'security_check',
        EXERCISE_BUDDY: 'exercise_buddy',
        PHONE_MESSAGE: 'phone_message',
        MEDITATION_GUIDE: 'meditation_guide',
        ARCADE_CHAMPION: 'arcade_champion',
        CLEANING_HELP: 'cleaning_help',
        JOB_INTERVIEW_PREP: 'job_interview_prep',
        EXECUTIVE_BRIEFING: 'executive_briefing',
        LEGAL_DOCUMENT: 'legal_document',
        FINANCIAL_REPORT: 'financial_report'
    },

    MAPS: {
        // 1층
        LOBBY: 'lobby',

        // 1층 카페/음식점들
        STARBUCKS: 'starbucks',
        MAMMOTH_COFFEE: 'mammoth_coffee',
        KOOK_BAB_92: 'kook_bab_92',
        TIM_HORTONS: 'tim_hortons',

        // 옥상층 (R층)
        ROOFTOP: 'rooftop',

        // 7층 - 709호 (계열사), 710호 (본사 IT)
        FLOOR_7_709_AFFILIATES: 'floor_7_709_affiliates',  // 709호 계열사
        FLOOR_7_710_MAIN_IT: 'floor_7_710_main_it',        // 710호 본사 IT
        FLOOR_7_CORRIDOR: 'floor_7_corridor',

        // 8층 - 6개 본부
        FLOOR_8_IT_DIVISION: 'floor_8_it_division',              // IT본부 (큰 맵)
        FLOOR_8_HR_OFFICE: 'floor_8_hr_office',                  // 인경실 (작은 맵)
        FLOOR_8_AI_RESEARCH: 'floor_8_ai_research',              // 인공지능 연구소 (작은 맵)
        FLOOR_8_EDUCATION_SERVICE: 'floor_8_education_service',  // 교육서비스 본부 (큰 맵)
        FLOOR_8_SALES_SUPPORT: 'floor_8_sales_support',          // 영업+교육지원 본부 (큰 맵)
        FLOOR_8_CORRIDOR: 'floor_8_corridor',

        // 기존 8층 호환성 (제거 예정)
        FLOOR_8_MAIN: 'floor_8_main',

        // 9층 - 1개 사무실 (CEO실)
        FLOOR_9_CEO_OFFICE: 'floor_9_ceo_office',
        FLOOR_9_CORRIDOR: 'floor_9_corridor',

        // 기존 호환성 유지 (제거 예정)
        MEETING_ROOM: 'meeting_room',
        CAFETERIA: 'cafeteria',
        CEO_OFFICE: 'ceo_office'
    },

    FLOORS: {
        FIRST: 1,
        SEVENTH: 7,
        EIGHTH: 8,
        NINTH: 9,
        ROOFTOP: 'R'
    },

    ELEVATOR_FLOORS: [1, 7, 8, 9, 'R'],

    OBJECT_TYPES: {
        VENDING_MACHINE: 'vending_machine',
        COMPUTER: 'computer',
        PRINTER: 'printer',
        WHITEBOARD: 'whiteboard',
        COFFEE_MACHINE: 'coffee_machine'
    }
};