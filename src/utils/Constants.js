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
        // 휴넷 생존기 메인 퀘스트 타겟
        START_GAME: 'start_game',
        COLLECT_ORIENTATION: 'collect_orientation',
        TALK_TO_KIM: 'talk_to_kim',
        LUNCH_EXPERIENCE: 'lunch_experience',
        DEPARTMENT_CULTURE: 'department_culture',
        MEETING_SURVIVAL: 'meeting_survival',
        EDUCATION_EXPERIENCE: 'education_experience',
        CEO_PREPARATION: 'ceo_preparation',
        TALK_TO_CEO: 'talk_to_ceo',
        HIDDEN_TRUTH: 'hidden_truth',

        // 서브 퀘스트 타겟 - 카페 문화 시리즈
        STARBUCKS_REGULAR: 'starbucks_regular',
        MAMMOTH_FRIENDSHIP: 'mammoth_friendship',
        KOOKBAP_RECOGNITION: 'kookbap_recognition',
        TIMHORTONS_MASTER: 'timhortons_master',

        // 서브 퀘스트 타겟 - 동료 관계 구축
        CORRIDOR_GREETINGS: 'corridor_greetings',
        AFFILIATES_TOUR: 'affiliates_tour',
        IT_GAME_CHAMPION: 'it_game_champion',
        AI_RESEARCHER_QUESTIONS: 'ai_researcher_questions',
        EDUCATION_EVENTS: 'education_events',
        SALES_ASSISTANT: 'sales_assistant',
        HR_TRUST: 'hr_trust',
        EXECUTIVE_RAPPORT: 'executive_rapport',

        // 서브 퀘스트 타겟 - 회사 문화 체험
        FOUR_DAY_WORK: 'four_day_work',
        UNLIMITED_VACATION: 'unlimited_vacation',
        FLEXIBLE_HOURS: 'flexible_hours',
        FRUIT_FRIDGE: 'fruit_fridge',
        LIBRARY_READING: 'library_reading',
        ROOFTOP_SOCIALIZING: 'rooftop_socializing',
        OVERTIME_CULTURE: 'overtime_culture',

        // 서브 퀘스트 타겟 - 히든 퀘스트
        ELEVATOR_SECRETS: 'elevator_secrets',
        BATHROOM_POLITICS: 'bathroom_politics',
        VENDING_MACHINE_LEGEND: 'vending_machine_legend',
        COFFEE_MACHINE_MASTER: 'coffee_machine_master',
        JANITOR_WISDOM: 'janitor_wisdom',
        COMPANY_DINNER_CULTURE: 'company_dinner_culture'
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

        // 9층 - 1개 사무실 (CEO실)
        FLOOR_9_CEO_OFFICE: 'floor_9_ceo_office',
        FLOOR_9_CORRIDOR: 'floor_9_corridor'
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