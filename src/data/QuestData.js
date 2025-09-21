import { CONSTANTS } from '../utils/Constants.js';

// 퀘스트 데이터를 별도 파일로 분리
export const QUEST_DATA = [
    {
        id: 0,
        title: "업무 보고서 수집",
        description: "7층 복도에서 '7층 업무 보고서'를 찾아서 → 7층에 있는 김대리에게 가져다주세요",
        target: CONSTANTS.QUEST_TARGETS.TALK_TO_KIM,
        completed: false,
        progress: 0,
        maxProgress: 1,
        requiredItem: '7층 업무 보고서',
        rewardItem: '김대리 추천서',
        questGiver: 'kim_deputy',
        itemSubmitted: false,
        type: 'main'
    },
    {
        id: 1,
        title: "중요한 문서 회수",
        description: "7층 709호 계열사에서 '중요한 문서'를 찾아서 → 7층에 있는 박직원에게 전달하세요",
        target: CONSTANTS.QUEST_TARGETS.EXPLORE_OFFICE_1,
        completed: false,
        progress: 0,
        maxProgress: 1,
        requiredItem: '중요한 문서',
        rewardItem: '박직원 도장',
        questGiver: 'office_worker_2',
        itemSubmitted: false,
        type: 'main'
    },
    {
        id: 2,
        title: "프로젝트 파일 제출",
        description: "7층 710호 본사 IT에서 '프로젝트 파일'을 찾아서 → 7층에 있는 인턴에게 도움을 주세요",
        target: CONSTANTS.QUEST_TARGETS.HELP_INTERN,
        completed: false,
        progress: 0,
        maxProgress: 1,
        requiredItem: '프로젝트 파일',
        rewardItem: '인턴 감사장',
        questGiver: 'intern',
        itemSubmitted: false,
        type: 'main'
    },
    {
        id: 3,
        title: "회의 자료 정리",
        description: "8층 복도에서 '회의록'과 '프레젠테이션 자료'를 모아서 → 8층에 있는 팀장 이씨에게 제출하세요",
        target: CONSTANTS.QUEST_TARGETS.COMPLETE_MEETING_TASK,
        completed: false,
        progress: 0,
        maxProgress: 2,
        requiredItems: ['회의록', '프레젠테이션 자료'],
        rewardItem: '팀장 승인서',
        questGiver: 'manager_lee',
        itemSubmitted: false,
        type: 'main'
    },
    {
        id: 4,
        title: "기밀 문서 보고",
        description: "9층에서 '9층 기밀 문서'를 찾아서 → 9층에 있는 비서 정씨에게 전달하세요",
        target: CONSTANTS.QUEST_TARGETS.FIND_HIDDEN_DOCUMENT,
        completed: false,
        progress: 0,
        maxProgress: 1,
        requiredItem: '9층 기밀 문서',
        rewardItem: '비서 허가증',
        questGiver: 'secretary_jung',
        itemSubmitted: false,
        type: 'main'
    },
    {
        id: 5,
        title: "휴넷 26주년 기념품 수집",
        description: "26주년 기념품들을 수집하세요: 1층 로비 '26주년 기념 메달', 7층 709호 계열사 '창립 스토리북', 8층 교육서비스본부 '미래 비전서'",
        target: CONSTANTS.QUEST_TARGETS.COLLECT_26TH_ITEMS,
        completed: false,
        progress: 0,
        maxProgress: 3,
        requiredItems: ['26주년 기념 메달', '창립 스토리북', '미래 비전서'],
        rewardItem: '26주년 특별 증서',
        questGiver: 'anniversary_coordinator',
        itemSubmitted: false,
        type: 'collection'
    },
    {
        id: 6,
        title: "휴넷 히스토리 탐험",
        description: "각 층에서 휴넷 역사 아이템들을 발견하세요: '창립 당시 사진', '첫 제품 샘플', '성장 일지', '미래 계획서'",
        target: CONSTANTS.QUEST_TARGETS.DISCOVER_HISTORY,
        completed: false,
        progress: 0,
        maxProgress: 4,
        requiredItems: ['창립 당시 사진', '첫 제품 샘플', '성장 일지', '미래 계획서'],
        rewardItem: '역사 수호자 인증서',
        questGiver: 'history_keeper',
        itemSubmitted: false,
        type: 'collection'
    },
    {
        id: 7,
        title: "26주년 축하 메시지 전달",
        description: "각 부서 축하 메시지를 수집하세요: 7층 710호 본사IT '개발팀 메시지', 8층 IT본부 '기획팀 메시지', 8층 영업+교육지원본부 '영업팀 메시지', 8층 인경실 '인사팀 메시지', 9층 CEO실 '재무팀 메시지', 9층 CEO실 '임원진 메시지'",
        target: CONSTANTS.QUEST_TARGETS.COLLECT_MESSAGES,
        completed: false,
        progress: 0,
        maxProgress: 6,
        requiredItems: ['개발팀 메시지', '기획팀 메시지', '영업팀 메시지', '인사팀 메시지', '재무팀 메시지', '임원진 메시지'],
        rewardItem: '감동 전달자 트로피',
        questGiver: 'message_collector',
        itemSubmitted: false,
        type: 'collection'
    },
    {
        id: 8,
        title: "CEO와의 최종 면담",
        description: "모든 증명서와 26주년 기념품들을 모아서 → 9층 CEO실에 있는 CEO 김대표에게 제출하세요",
        target: CONSTANTS.QUEST_TARGETS.TALK_TO_CEO,
        completed: false,
        progress: 0,
        maxProgress: 8,
        requiredItems: ['김대리 추천서', '박직원 도장', '인턴 감사장', '팀장 승인서', '비서 허가증', '26주년 특별 증서', '역사 수호자 인증서', '감동 전달자 트로피'],
        rewardItem: 'CEO 친필 사인',
        questGiver: 'ceo_kim',
        itemSubmitted: false,
        type: 'final'
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