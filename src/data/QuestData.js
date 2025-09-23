import { CONSTANTS } from '../utils/Constants.js';

// 휴넷 26주년 기념 게임 - 메인 퀘스트 데이터
// 1998년부터 2024년까지, 26년간의 성장 여정을 따라가는 스토리
// 미니게임 챌린지 요구사항 정의
export const MINIGAME_CHALLENGES = {
    MEMORY_MATCH: 'memory_match',
    SNAKE_SCORE: 'snake_score',
    TETRIS_LINES: 'tetris_lines',
    BREAKOUT_WIN: 'breakout_win',
    FLAPPY_SCORE: 'flappy_score'
};
export const QUEST_DATA = [
    // === 1층 로비: 여정의 시작 (1998년 창립 정신) ===
    {
        id: 0,
        title: "휴넷 입사 첫날 - 출입증 발급",
        description: "1998년 휴넷 창립 당시의 열정을 느껴보세요! 1층 로비에서 '입장 패스'를 찾아 경비 아저씨에게 전달하여 정식 직원 출입증을 발급받으세요.",
        target: CONSTANTS.QUEST_TARGETS.START_GAME,
        completed: false,
        started: false, // 퀘스트를 받았는지 여부
        progress: 0,
        maxProgress: 1,
        requiredItem: '입장 패스',
        rewardItem: '건물 출입증',
        questGiver: 'guard',
        itemSubmitted: false,
        type: 'main',
        floor: 1,
        hint: "💡 1층 로비 바닥의 황금색 '입장 패스'를 찾아 오른쪽 경비 아저씨에게 전달하세요",
        connectionMessage: "🎯 휴넷 26주년 여정의 시작! 1998년 창립 정신으로 첫 발을 내딛습니다.",
        storyContext: "휴넷 창립자들이 처음 이 건물에 들어섰을 때의 설렘을 경험해보세요.",
        prerequisites: [],
        nextStep: "26주년 기념 메달을 찾아 상위 층 접근 권한을 얻으세요"
    },
    {
        id: 1,
        title: "26주년 기념 - 특별 메달 수여",
        description: "26년간의 성장을 기념하는 특별한 메달이 준비되어 있습니다. 1층 로비에서 '26주년 기념 메달'을 찾아 안내 데스크에 전달하여 엘리베이터 이용권을 받으세요.",
        target: CONSTANTS.QUEST_TARGETS.COLLECT_MEDAL,
        completed: false,
        started: false, // 퀘스트를 받았는지 여부
        progress: 0,
        maxProgress: 1,
        requiredItem: '26주년 기념 메달',
        rewardItem: '엘리베이터 이용권',
        questGiver: 'reception',
        itemSubmitted: false,
        type: 'main',
        floor: 1,
        hint: "🏅 1층 로비 바닥의 황금색 '26주년 기념 메달'을 찾아 중앙 안내 데스크에 전달하세요",
        connectionMessage: "🎊 출입증 발급 완료! 이제 26주년 기념 메달로 휴넷의 각 부서를 탐험할 준비를 하세요.",
        storyContext: "26년 전 작은 시작에서 오늘날 대한민국 대표 교육기업으로 성장한 휴넷의 역사를 기념합니다.",
        prerequisites: ["건물 출입증"],
        nextStep: "7층으로 올라가 휴넷의 핵심 업무 부서들을 만나보세요"
    },
    // === 7층: 초기 성장기 (2000년대 초반, 디지털 전환기) ===
    {
        id: 2,
        title: "초기 성장기 - 김대리와의 협업",
        description: "2000년대 초 휴넷이 디지털 교육으로 전환하던 시기를 경험해보세요. 김대리는 당시 핵심 인재로 중요한 업무 보고서를 기다리고 있습니다.",
        target: CONSTANTS.QUEST_TARGETS.TALK_TO_KIM,
        completed: false,
        started: false, // 퀘스트를 받았는지 여부
        progress: 0,
        maxProgress: 1,
        requiredItem: '업무 보고서',
        rewardItem: '김대리 추천서',
        questGiver: 'kim_deputy',
        itemSubmitted: false,
        type: 'main',
        floor: 7,
        hint: "📋 7층 복도를 탐색하여 '업무 보고서'를 찾아 김대리에게 전달하세요",
        connectionMessage: "🚀 엘리베이터로 7층에 도착! 휴넷의 초기 성장기 이야기가 시작됩니다.",
        storyContext: "2000년대 초, 휴넷이 오프라인 교육에서 온라인 교육으로 전환하며 급성장하던 시기입니다.",
        prerequisites: ["엘리베이터 이용권"],
        nextStep: "IT부서와 계열사에서 디지털 전환 작업을 도와주세요"
    },
    {
        id: 3,
        title: "IT 혁신기 - 기술 인턴 지원",
        description: "휴넷의 디지털 교육 플랫폼 구축을 위해 열심히 일하는 IT 인턴을 도와주세요. 710호 본사IT에서 중요한 프로젝트 파일을 찾아 전달해야 합니다.",
        target: CONSTANTS.QUEST_TARGETS.HELP_INTERN,
        completed: false,
        started: false, // 퀘스트를 받았는지 여부
        progress: 0,
        maxProgress: 1,
        requiredItem: '프로젝트 파일',
        rewardItem: '인턴 감사장',
        questGiver: 'intern',
        itemSubmitted: false,
        type: 'main',
        floor: 7,
        hint: "💻 7층 710호 본사IT실에서 '프로젝트 파일'을 찾아 인턴에게 전달하세요",
        connectionMessage: "📈 김대리의 신뢰를 얻었습니다! 이제 IT 혁신 작업에 참여해보세요.",
        storyContext: "휴넷의 e-러닝 플랫폼이 처음 개발되던 시기, 젊은 개발자들의 열정이 가득했습니다.",
        prerequisites: ["김대리 추천서"],
        nextStep: "계열사와의 협력을 통해 사업 확장 기반을 마련하세요",
        minigameChallenge: {
            type: MINIGAME_CHALLENGES.MEMORY_MATCH,
            description: "인턴의 기억력 테스트: 메모리 매치 게임을 완료하세요",
            required: true,
            completed: false
        }
    },
    {
        id: 4,
        title: "사업 확장기 - 계열사 파트너십",
        description: "휴넷이 다양한 계열사와 파트너십을 맺으며 사업을 확장하던 시기입니다. 709호 계열사에서 중요한 계약서를 찾아 박직원에게 전달하세요.",
        target: CONSTANTS.QUEST_TARGETS.EXPLORE_OFFICE_1,
        completed: false,
        started: false, // 퀘스트를 받았는지 여부
        progress: 0,
        maxProgress: 1,
        requiredItem: '중요 계약서',
        rewardItem: '박직원 도장',
        questGiver: 'office_worker_2',
        itemSubmitted: false,
        type: 'main',
        floor: 7,
        hint: "🤝 7층 709호 계열사 사무실에서 '중요 계약서'를 찾아 박직원에게 전달하세요",
        connectionMessage: "🔧 IT 시스템 구축에 기여했습니다! 이제 사업 확장을 위한 파트너십 업무를 진행하세요.",
        storyContext: "2000년대 중반, 휴넷이 계열사들과 협력하여 교육 서비스 영역을 확장하던 중요한 시기입니다.",
        prerequisites: ["인턴 감사장"],
        nextStep: "8층으로 올라가 휴넷의 황금기 성장 스토리를 경험하세요"
    },
    // === 8층: 황금기 성장 (2010년대, 다각화 및 혁신기) ===
    {
        id: 5,
        title: "황금기 성장 - 전략 회의 지원",
        description: "2010년대 휴넷의 황금기 성장을 이끈 핵심 전략 회의를 지원하세요. 이씨 팀장이 중요한 프레젠테이션을 위해 '회의록'과 '프레젠테이션' 자료를 기다리고 있습니다.",
        target: CONSTANTS.QUEST_TARGETS.COMPLETE_MEETING_TASK,
        completed: false,
        started: false, // 퀘스트를 받았는지 여부
        progress: 0,
        maxProgress: 2,
        requiredItems: ['회의록', '프레젠테이션'],
        rewardItem: '팀장 승인서',
        questGiver: 'manager_lee',
        itemSubmitted: false,
        type: 'main',
        floor: 8,
        hint: "📊 8층에서 '회의록'과 '프레젠테이션' 자료를 모두 찾아 이씨 팀장에게 제출하세요",
        connectionMessage: "🏢 7층에서 기반을 다졌습니다! 이제 8층에서 휴넷의 황금기 성장 전략을 경험하세요.",
        storyContext: "2010년대, 휴넷이 다양한 교육 솔루션으로 시장을 선도하며 급성장하던 황금기입니다.",
        prerequisites: ["박직원 도장"],
        nextStep: "교육서비스본부에서 혁신적인 교육 콘텐츠 개발에 참여하세요",
        minigameChallenge: {
            type: MINIGAME_CHALLENGES.TETRIS_LINES,
            description: "전략적 사고 테스트: 테트리스에서 10줄 이상 클리어하세요",
            required: true,
            completed: false,
            targetScore: 10
        }
    },
    {
        id: 6,
        title: "교육 혁신기 - 콘텐츠 개발 지원",
        description: "휴넷 교육서비스본부의 혁신적인 교육 콘텐츠 개발팀을 지원하세요. 새로운 교육 방법론이 담긴 '교육 매뉴얼'을 찾아 교육팀장에게 전달해야 합니다.",
        target: CONSTANTS.QUEST_TARGETS.COLLECT_EDUCATION,
        completed: false,
        started: false, // 퀘스트를 받았는지 여부
        progress: 0,
        maxProgress: 1,
        requiredItem: '교육 매뉴얼',
        rewardItem: '교육팀 인증서',
        questGiver: 'education_manager',
        itemSubmitted: false,
        type: 'main',
        floor: 8,
        hint: "🎓 8층 교육서비스본부에서 '교육 매뉴얼'을 찾아 교육팀장에게 전달하세요",
        connectionMessage: "📈 전략 회의 성공! 이제 휴넷의 핵심인 교육 혁신 업무에 참여해보세요.",
        storyContext: "휴넷이 개발한 혁신적인 교육 방법론들이 대한민국 교육 시장을 변화시키던 시기입니다.",
        prerequisites: ["팀장 승인서"],
        nextStep: "9층 CEO실로 올라가 휴넷의 미래 비전을 확인하세요",
        minigameChallenge: {
            type: MINIGAME_CHALLENGES.BREAKOUT_WIN,
            description: "혁신적 사고 테스트: 브레이크아웃 게임을 완전히 클리어하세요",
            required: true,
            completed: false
        }
    },
    // === 9층: 미래 비전 (2020년대, AI·디지털 혁신 및 26주년) ===
    {
        id: 7,
        title: "미래 비전 - 기밀 프로젝트 지원",
        description: "휴넷의 미래를 책임질 AI·디지털 혁신 프로젝트에 참여하세요. CEO실의 최고기밀 문서를 정씨 비서에게 안전하게 전달해야 합니다.",
        target: CONSTANTS.QUEST_TARGETS.FIND_HIDDEN_DOCUMENT,
        completed: false,
        started: false, // 퀘스트를 받았는지 여부
        progress: 0,
        maxProgress: 1,
        requiredItem: '기밀 문서',
        rewardItem: '비서 허가증',
        questGiver: 'secretary_jung',
        itemSubmitted: false,
        type: 'main',
        floor: 9,
        hint: "🔒 9층 CEO실에서 '기밀 문서'를 찾아 정씨 비서에게 안전하게 전달하세요",
        connectionMessage: "🚀 8층 교육 혁신 완료! 마침내 9층에서 휴넷의 미래 비전을 확인할 차례입니다.",
        storyContext: "2020년대, 휴넷이 AI와 디지털 기술로 교육의 미래를 개척하며 26주년을 맞이한 현재입니다.",
        prerequisites: ["교육팀 인증서"],
        nextStep: "CEO와의 최종 면담을 위해 지금까지 모은 모든 증명서를 준비하세요"
    },
    // === 최종 퀘스트: 26주년 완주 ===
    {
        id: 8,
        title: "26주년 완주 - CEO와의 최종 면담",
        description: "축하합니다! 휴넷 26년 역사의 모든 여정을 완주했습니다. 지금까지 모은 7개의 증명서를 김대표 CEO에게 제출하여 특별한 26주년 수료증을 받으세요.",
        target: CONSTANTS.QUEST_TARGETS.TALK_TO_CEO,
        completed: false,
        started: false, // 퀘스트를 받았는지 여부
        progress: 0,
        maxProgress: 7,
        requiredItems: [
            '건물 출입증',      // 1998년 창립 정신
            '김대리 추천서',    // 2000년대 초 성장기
            '인턴 감사장',      // IT 혁신기
            '박직원 도장',      // 사업 확장기
            '팀장 승인서',      // 2010년대 황금기
            '교육팀 인증서',    // 교육 혁신기
            '비서 허가증'       // 2020년대 미래 비전
        ],
        rewardItem: '휴넷 26주년 수료증',
        questGiver: 'ceo_kim',
        itemSubmitted: false,
        type: 'final',
        floor: 9,
        hint: "👑 지금까지 모은 7개의 증명서를 모두 가지고 김대표 CEO에게 최종 제출하세요",
        connectionMessage: "🏆 모든 부서의 인정을 받았습니다! 이제 CEO와의 최종 면담으로 26주년 여정을 완성하세요.",
        storyContext: "1998년부터 2024년까지, 휴넷의 26년 역사를 모두 경험한 당신은 진정한 휴넷인이 되었습니다.",
        prerequisites: ["비서 허가증"],
        nextStep: "휴넷 26주년 수료증을 받고 축하 파티에 참여하세요!",
        completionMessage: "🎊 휴넷 26주년 여정 완주! 창립부터 현재까지의 모든 순간을 함께했습니다."
    }
];

// 퀘스트 타입별 설정 (스토리 기반 확장)
export const QUEST_TYPES = {
    main: {
        icon: '📋',
        color: '#4A90E2',
        priority: 1,
        description: '휴넷 역사 여정의 핵심 스토리'
    },
    collection: {
        icon: '🎯',
        color: '#F5A623',
        priority: 2,
        description: '부서별 특별 수집 미션'
    },
    final: {
        icon: '👑',
        color: '#D0021B',
        priority: 3,
        description: '26주년 완주 기념 최종 미션'
    }
};

// 휴넷 26년 역사 연대표 (스토리 맥락 제공)
export const HUNET_TIMELINE = {
    1998: {
        era: "창립기",
        icon: "🌱",
        description: "휴넷 창립, 교육 사업의 첫 발걸음",
        questIds: [0, 1]
    },
    "2000s_early": {
        era: "디지털 전환기",
        icon: "💻",
        description: "오프라인에서 온라인 교육으로의 혁신적 전환",
        questIds: [2, 3, 4]
    },
    "2010s": {
        era: "황금기 성장",
        icon: "🚀",
        description: "다양한 교육 솔루션으로 시장 선도",
        questIds: [5, 6]
    },
    "2020s": {
        era: "미래 혁신기",
        icon: "🔮",
        description: "AI·디지털 기술로 교육의 미래 개척",
        questIds: [7, 8]
    }
};

// 퀘스트 검증 규칙 (스토리 진행 강화)
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

    // 전제 조건 확인 (스토리 진행 순서 보장)
    validatePrerequisites: (quest, inventory) => {
        if (!quest.prerequisites || quest.prerequisites.length === 0) return true;
        return quest.prerequisites.every(prerequisite =>
            inventory.some(item => item.name === prerequisite)
        );
    },

    // 퀘스트 완료 가능 여부 확인 (전제 조건 포함)
    canComplete: (quest, inventory) => {
        return QUEST_VALIDATION.validateSingleItem(quest, inventory) &&
               QUEST_VALIDATION.validateMultipleItems(quest, inventory) &&
               QUEST_VALIDATION.validatePrerequisites(quest, inventory);
    },

    // 퀘스트 활성화 가능 여부 확인 (다음 퀘스트 진행 조건)
    canActivate: (quest, inventory) => {
        return QUEST_VALIDATION.validatePrerequisites(quest, inventory);
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
    },

    // 부족한 전제 조건 반환
    getMissingPrerequisites: (quest, inventory) => {
        if (!quest.prerequisites) return [];
        return quest.prerequisites.filter(prerequisite =>
            !inventory.some(item => item.name === prerequisite)
        );
    },

    // 스토리 진행률 계산 (0-100%)
    getStoryProgress: (completedQuests) => {
        const totalMainQuests = QUEST_DATA.filter(q => q.type === 'main' || q.type === 'final').length;
        const completedMainQuests = completedQuests.filter(id => {
            const quest = QUEST_DATA.find(q => q.id === id);
            return quest && (quest.type === 'main' || quest.type === 'final');
        }).length;
        return Math.round((completedMainQuests / totalMainQuests) * 100);
    },

    // 현재 시대 확인 (휴넷 역사 맥락)
    getCurrentEra: (completedQuests) => {
        for (const [period, info] of Object.entries(HUNET_TIMELINE)) {
            const allQuestsCompleted = info.questIds.every(id => completedQuests.includes(id));
            if (!allQuestsCompleted) {
                return {
                    period,
                    era: info.era,
                    icon: info.icon,
                    description: info.description,
                    progress: info.questIds.filter(id => completedQuests.includes(id)).length,
                    total: info.questIds.length
                };
            }
        }
        return null; // 모든 퀘스트 완료
    },

    // 다음 추천 퀘스트 ID 반환
    getNextRecommendedQuest: (completedQuests, inventory) => {
        const incompleteQuests = QUEST_DATA.filter(quest =>
            !completedQuests.includes(quest.id) && !quest.completed
        );

        // 전제 조건을 만족하는 첫 번째 퀘스트 반환
        for (const quest of incompleteQuests) {
            if (QUEST_VALIDATION.canActivate(quest, inventory)) {
                return quest.id;
            }
        }

        return null; // 활성화 가능한 퀘스트 없음
    }
};