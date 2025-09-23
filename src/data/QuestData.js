import { CONSTANTS } from '../utils/Constants.js';

// 퀘스트 데이터를 별도 파일로 분리
export const QUEST_DATA = [
    // 1층 로비 퀘스트 (시작)
    {
        id: 0,
        title: "휴넷 26주년 게임 시작",
        description: "① 1층 로비 바닥에서 '입장 패스'를 찾으세요 (황금색 아이템) → ② 경비 아저씨(오른쪽)에게 가져다주세요",
        target: CONSTANTS.QUEST_TARGETS.START_GAME,
        completed: false,
        progress: 0,
        maxProgress: 1,
        requiredItem: '입장 패스',
        rewardItem: '건물 출입증',
        questGiver: 'guard',
        itemSubmitted: false,
        type: 'main',
        floor: 1,
        hint: "입장 패스 찾기 → 경비 아저씨에게 전달"
    },
    {
        id: 1,
        title: "26주년 기념 메달 찾기",
        description: "① 1층 로비 바닥에서 '26주년 기념 메달'을 찾으세요 (황금색 아이템) → ② 안내 데스크 직원(중앙)에게 가져다주세요",
        target: CONSTANTS.QUEST_TARGETS.COLLECT_MEDAL,
        completed: false,
        progress: 0,
        maxProgress: 1,
        requiredItem: '26주년 기념 메달',
        rewardItem: '엘리베이터 이용권',
        questGiver: 'reception',
        itemSubmitted: false,
        type: 'main',
        floor: 1,
        hint: "기념 메달 찾기 → 안내 데스크에 전달"
    },
    // 7층 퀘스트
    {
        id: 2,
        title: "김대리의 부탁",
        description: "7층 복도에서 '업무 보고서'를 찾아서 → 김대리에게 가져다주세요",
        target: CONSTANTS.QUEST_TARGETS.TALK_TO_KIM,
        completed: false,
        progress: 0,
        maxProgress: 1,
        requiredItem: '업무 보고서',
        rewardItem: '김대리 추천서',
        questGiver: 'kim_deputy',
        itemSubmitted: false,
        type: 'main',
        floor: 7
    },
    {
        id: 3,
        title: "프로젝트 파일 회수",
        description: "7층 710호 본사IT에서 '프로젝트 파일'을 찾아서 → 인턴에게 전달하세요",
        target: CONSTANTS.QUEST_TARGETS.HELP_INTERN,
        completed: false,
        progress: 0,
        maxProgress: 1,
        requiredItem: '프로젝트 파일',
        rewardItem: '인턴 감사장',
        questGiver: 'intern',
        itemSubmitted: false,
        type: 'main',
        floor: 7
    },
    {
        id: 4,
        title: "계약서 전달",
        description: "7층 709호 계열사에서 '중요 계약서'를 찾아서 → 박직원에게 전달하세요",
        target: CONSTANTS.QUEST_TARGETS.EXPLORE_OFFICE_1,
        completed: false,
        progress: 0,
        maxProgress: 1,
        requiredItem: '중요 계약서',
        rewardItem: '박직원 도장',
        questGiver: 'office_worker_2',
        itemSubmitted: false,
        type: 'main',
        floor: 7
    },
    // 8층 퀘스트
    {
        id: 5,
        title: "회의 자료 준비",
        description: "8층에서 '회의록'과 '프레젠테이션'을 모두 찾아서 → 팀장 이씨에게 제출하세요",
        target: CONSTANTS.QUEST_TARGETS.COMPLETE_MEETING_TASK,
        completed: false,
        progress: 0,
        maxProgress: 2,
        requiredItems: ['회의록', '프레젠테이션'],
        rewardItem: '팀장 승인서',
        questGiver: 'manager_lee',
        itemSubmitted: false,
        type: 'main',
        floor: 8
    },
    {
        id: 6,
        title: "교육 자료 수집",
        description: "8층 교육서비스본부에서 '교육 매뉴얼'을 찾아서 → 교육팀장에게 전달하세요",
        target: CONSTANTS.QUEST_TARGETS.COLLECT_EDUCATION,
        completed: false,
        progress: 0,
        maxProgress: 1,
        requiredItem: '교육 매뉴얼',
        rewardItem: '교육팀 인증서',
        questGiver: 'education_manager',
        itemSubmitted: false,
        type: 'main',
        floor: 8
    },
    // 9층 퀘스트
    {
        id: 7,
        title: "기밀 문서 확보",
        description: "9층 CEO실에서 '기밀 문서'를 찾아서 → 비서 정씨에게 전달하세요",
        target: CONSTANTS.QUEST_TARGETS.FIND_HIDDEN_DOCUMENT,
        completed: false,
        progress: 0,
        maxProgress: 1,
        requiredItem: '기밀 문서',
        rewardItem: '비서 허가증',
        questGiver: 'secretary_jung',
        itemSubmitted: false,
        type: 'main',
        floor: 9
    },
    // 최종 퀘스트
    {
        id: 8,
        title: "CEO와의 최종 면담",
        description: "모든 증명서를 모아서 → 9층 CEO실의 CEO 김대표에게 제출하세요",
        target: CONSTANTS.QUEST_TARGETS.TALK_TO_CEO,
        completed: false,
        progress: 0,
        maxProgress: 7,
        requiredItems: [
            '건물 출입증',
            '김대리 추천서',
            '인턴 감사장',
            '박직원 도장',
            '팀장 승인서',
            '교육팀 인증서',
            '비서 허가증'
        ],
        rewardItem: '휴넷 26주년 수료증',
        questGiver: 'ceo_kim',
        itemSubmitted: false,
        type: 'final',
        floor: 9
    }
];

// 퀘스트 타입별 설정
export const QUEST_TYPES = {
    main: {
        icon: '📋',
        color: '#4A90E2',
        priority: 1
    },
    collection: {
        icon: '🎯',
        color: '#F5A623',
        priority: 2
    },
    final: {
        icon: '👑',
        color: '#D0021B',
        priority: 3
    }
};

// 퀘스트 검증 규칙
export const QUEST_VALIDATION = {
    // 단일 아이템 퀘스트 검증
    validateSingleItem: (quest, inventory) => {
        if (!quest.requiredItem) return true;
        return inventory.some(item => item.name === quest.requiredItem);
    },

    // 다중 아이템 퀘스트 검증
    validateMultipleItems: (quest, inventory) => {
        if (!quest.requiredItems) return true;
        return quest.requiredItems.every(requiredItem =>
            inventory.some(item => item.name === requiredItem)
        );
    },

    // 퀘스트 완료 가능 여부 확인
    canComplete: (quest, inventory) => {
        return QUEST_VALIDATION.validateSingleItem(quest, inventory) &&
               QUEST_VALIDATION.validateMultipleItems(quest, inventory);
    },

    // 부족한 아이템 목록 반환
    getMissingItems: (quest, inventory) => {
        const missing = [];

        if (quest.requiredItem && !QUEST_VALIDATION.validateSingleItem(quest, inventory)) {
            missing.push(quest.requiredItem);
        }

        if (quest.requiredItems) {
            const missingMultiple = quest.requiredItems.filter(requiredItem =>
                !inventory.some(item => item.name === requiredItem)
            );
            missing.push(...missingMultiple);
        }

        return missing;
    }
};