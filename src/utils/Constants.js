export const CONSTANTS = {
    TILE_SIZE: 48,
    MAP_WIDTH: 40,
    MAP_HEIGHT: 30,

    GAME_MODES: {
        LOADING: 'loading',
        TITLE: 'title',
        PLAYING: 'playing',
        PAUSED: 'paused',
        CELEBRATION: 'celebration'
    },

    DIRECTIONS: {
        UP: 'up',
        DOWN: 'down',
        LEFT: 'left',
        RIGHT: 'right'
    },

    QUEST_TARGETS: {
        TALK_TO_KIM: 'talk_to_kim',
        TALK_TO_PARK: 'talk_to_park',
        TALK_TO_LEE: 'talk_to_lee',
        TALK_TO_CEO: 'talk_to_ceo',
        COLLECT_ALL_ITEMS: 'collect_all_items',
        EXPLORE_OFFICE_1: 'explore_office_1',
        EXPLORE_OFFICE_2: 'explore_office_2',
        FIND_HIDDEN_DOCUMENT: 'find_hidden_document',
        HELP_INTERN: 'help_intern',
        COMPLETE_MEETING_TASK: 'complete_meeting_task',

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

        // 7층 - 2개 사무실
        FLOOR_7_OFFICE_1: 'floor_7_office_1',
        FLOOR_7_OFFICE_2: 'floor_7_office_2',
        FLOOR_7_CORRIDOR: 'floor_7_corridor',

        // 8층 - 전체 (기존 회의실, 카페테리아 개념)
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

    ELEVATOR_FLOORS: [1, 7, 8, 9, 'R']
};