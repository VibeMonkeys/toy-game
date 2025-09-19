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
        COMPLETE_MEETING_TASK: 'complete_meeting_task'
    },

    MAPS: {
        // 1층
        LOBBY: 'lobby',

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
        NINTH: 9
    },

    ELEVATOR_FLOORS: [1, 7, 8, 9]
};