import { CONSTANTS } from '../utils/Constants.js';

// 최진안의 휴넷 생존기 - 메인 퀘스트 데이터
// 휴넷 신입사원으로서 회사 문화에 적응하며 성장하는 스토리

export const QUEST_DATA = [
    // === 1층 로비: 첫날의 혼돈 ===
    {
        id: 0,
        title: "출입카드 미스터리",
        description: "첫 출근인데 출입카드가 없다고? 경비 아저씨가 '어제 회식했던 직원들을 찾아보라'고 하네요. 4개 카페를 돌아다니며 정보를 수집해보세요.",
        target: CONSTANTS.QUEST_TARGETS.START_GAME,
        completed: false,
        started: true, // 첫 번째 퀘스트는 게임 시작과 함께 자동 활성화
        progress: 0,
        maxProgress: 1,
        requiredItem: '임시 출입카드',
        rewardItem: '정식 출입카드',
        questGiver: 'guard',
        itemSubmitted: false,
        type: 'main',
        floor: 1,
        hint: "💡 1층 로비에서 '임시 출입카드'를 찾아 경비 아저씨에게 전달하세요",
        connectionMessage: "🎯 첫 출근날의 시작! 출입카드부터 해결해야겠네요.",
        storyContext: "신입사원 최진안의 첫 출근날, 하지만 출입카드가 없어서 난감한 상황입니다.",
        prerequisites: [],
        nextStep: "안내 데스크에서 신입사원 오리엔테이션을 받으세요"
    },
    {
        id: 1,
        title: "신입사원 오리엔테이션의 함정",
        description: "강해빈 인사담당자가 '간단한 서류만 작성하면 된다'고 했는데... 각 층을 돌아다니며 부서별 도장을 받고 휴넷 퀴즈까지 풀어야 한다고?",
        target: CONSTANTS.QUEST_TARGETS.COLLECT_ORIENTATION,
        completed: false,
        started: false,
        progress: 0,
        maxProgress: 1,
        requiredItem: '신입사원 서류',
        rewardItem: '정식 직원증',
        questGiver: 'reception',
        itemSubmitted: false,
        type: 'main',
        floor: 1,
        hint: "📋 1층에서 '신입사원 서류'를 찾아 안내 데스크에 전달하세요",
        connectionMessage: "✅ 출입카드 문제 해결! 이제 본격적인 오리엔테이션을 받아보세요.",
        storyContext: "강해빈의 깜짝 테스트가 시작됩니다. 휴넷에 대해 얼마나 알고 있을까요?",
        prerequisites: ["정식 출입카드"],
        nextStep: "7층으로 올라가 IT팀에 합류하세요"
    },
    // === 7층: IT팀 첫 출근 & 부서 탐방기 ===
    {
        id: 2,
        title: "IT팀 첫 출근 소동",
        description: "710호 본사 IT의 김대리가 커피 심부름을 시키네요. 각자 다른 카페에서 특정 음료를 주문해야 한다고? 휴넷의 시차출근제도 체험해보세요.",
        target: CONSTANTS.QUEST_TARGETS.TALK_TO_KIM,
        completed: false,
        started: false,
        progress: 0,
        maxProgress: 1,
        requiredItem: '커피 주문서',
        rewardItem: 'IT팀 멤버 인증',
        questGiver: 'kim_deputy',
        itemSubmitted: false,
        type: 'main',
        floor: 7,
        hint: "☕ 7층에서 '커피 주문서'를 찾아 김대리에게 전달하세요",
        connectionMessage: "🏢 7층 도착! IT팀의 독특한 문화를 경험해보세요.",
        storyContext: "김대리는 커피에 까다롭기로 유명하지만, 한 번 마음에 들면 엄청 잘 챙겨준다고 하네요.",
        prerequisites: ["정식 직원증"],
        nextStep: "709호 계열사 사람들과도 인사하고 점심시간을 준비하세요"
    },
    {
        id: 3,
        title: "점심시간 전쟁",
        description: "12시 정각 엘리베이터 전쟁이 시작됩니다! 국밥92에서 줄을 서고, 앞사람과 대화하며 점심 후 커피까지 마시는 휴넷의 점심 문화를 체험하세요.",
        target: CONSTANTS.QUEST_TARGETS.LUNCH_EXPERIENCE,
        completed: false,
        started: false,
        progress: 0,
        maxProgress: 1,
        requiredItem: '점심 영수증',
        rewardItem: '점심시간 생존자 뱃지',
        questGiver: 'office_worker_1',
        itemSubmitted: false,
        type: 'main',
        floor: 7,
        hint: "🍽️ 7층에서 '점심 영수증'을 찾아 동료에게 보여주세요",
        connectionMessage: "👥 IT팀에 적응 완료! 이제 점심시간의 진짜 전쟁을 경험해보세요.",
        storyContext: "점심시간만 잘 넘기면 휴넷 생활의 반은 성공이라고 강해빈이 말했었죠.",
        prerequisites: ["IT팀 멤버 인증"],
        nextStep: "8층으로 올라가 각 본부의 특색을 파악하세요"
    },
    // === 8층: 부서간 정치학 ===
    {
        id: 4,
        title: "8층 복도의 비밀",
        description: "각 본부마다 완전히 다른 문화가 있다고? IT본부는 '조용히', 인사경영실은 '정중하게', AI연구소는 '혁신적으로', 교육서비스본부는 '열정적으로', 영업본부는 '실적 위주'로!",
        target: CONSTANTS.QUEST_TARGETS.DEPARTMENT_CULTURE,
        completed: false,
        started: false,
        progress: 0,
        maxProgress: 1,
        requiredItem: '부서 탐방 노트',
        rewardItem: '부서 정치 마스터 칭호',
        questGiver: 'auto_start', // 8층 진입 시 자동 시작
        itemSubmitted: false,
        type: 'main',
        floor: 8,
        hint: "🏢 8층에서 '부서 탐방 노트'를 찾고 각 본부의 분위기를 체험하세요",
        connectionMessage: "🚀 8층 진입! 복잡한 부서 정치의 세계에 오신 것을 환영합니다.",
        storyContext: "윤도현의 말이 맞았네요. 8층은 정말 복잡한 곳입니다. 각 본부마다 완전히 다른 세상이에요.",
        prerequisites: ["점심시간 생존자 뱃지"],
        nextStep: "첫 번째 회의에 참석할 준비를 하세요"
    },
    {
        id: 5,
        title: "첫 번째 회의 참석",
        description: "이과장의 부서간 협업 회의에 참석하게 되었습니다. 자리 선택부터 신중해야 하고, 5개 부서 사람들의 다른 의견을 들어야 하며, 신입사원 의견도 말해야 한다고?",
        target: CONSTANTS.QUEST_TARGETS.MEETING_SURVIVAL,
        completed: false,
        started: false,
        progress: 0,
        maxProgress: 1,
        requiredItem: '회의록',
        rewardItem: '회의 생존자 뱃지',
        questGiver: 'manager_lee',
        itemSubmitted: false,
        type: 'main',
        floor: 8,
        hint: "📝 8층에서 '회의록'을 찾아 이과장에게 전달하세요",
        connectionMessage: "🎯 부서 문화 파악 완료! 이제 실전 회의에서 살아남아 보세요.",
        storyContext: "첫 회의는 누구에게나 부담스럽죠. 하지만 이것도 휴넷 적응의 중요한 과정입니다.",
        prerequisites: ["부서 정치 마스터 칭호"],
        nextStep: "교육서비스본부에서 휴넷의 핵심 사업을 체험하세요"
    },
    {
        id: 6,
        title: "교육서비스본부의 열정",
        description: "휴넷의 핵심 사업을 체험할 시간입니다! CEO 영상 시청부터 실제 교육생으로 참여, 만족도 설문까지. 교육매니저와 '교육의 철학'에 대해 깊은 대화도 나누세요.",
        target: CONSTANTS.QUEST_TARGETS.EDUCATION_EXPERIENCE,
        completed: false,
        started: false,
        progress: 0,
        maxProgress: 1,
        requiredItem: '교육 수료증',
        rewardItem: '휴넷 DNA 이해 인증서',
        questGiver: 'education_manager',
        itemSubmitted: false,
        type: 'main',
        floor: 8,
        hint: "🎓 8층에서 '교육 수료증'을 찾아 교육매니저에게 전달하세요",
        connectionMessage: "🏆 회의 생존 성공! 이제 휴넷의 진짜 핵심 사업을 경험해보세요.",
        storyContext: "'교육을 통해 세상을 바꾼다'는 휴넷의 철학을 직접 체험할 수 있는 기회입니다.",
        prerequisites: ["회의 생존자 뱃지"],
        nextStep: "9층으로 올라가 CEO와의 만남을 준비하세요"
    },
    // === 9층: 윗선과의 만남 ===
    {
        id: 7,
        title: "9층 진입 작전",
        description: "윤도현이 'CEO님이 신입사원을 만나고 싶어한다'고 합니다. 각 부서 담당자들로부터 추천서를 받고, 강해빈의 '최종 면접' 시뮬레이션도 통과해야 해요.",
        target: CONSTANTS.QUEST_TARGETS.CEO_PREPARATION,
        completed: false,
        started: false,
        progress: 0,
        maxProgress: 1,
        requiredItem: '9층 출입 허가서',
        rewardItem: '경영진 만남 준비 완료',
        questGiver: 'yoon_dohyun',
        itemSubmitted: false,
        type: 'main',
        floor: 9,
        hint: "🔑 9층에서 '9층 출입 허가서'를 찾아 윤도현에게 전달하세요",
        connectionMessage: "🌟 휴넷 DNA 이해 완료! 마침내 CEO와의 만남이 기다리고 있습니다.",
        storyContext: "여기까지 온 걸 보면 정말 휴넷에 적응한 것 같다고 윤도현이 칭찬해주네요.",
        prerequisites: ["휴넷 DNA 이해 인증서"],
        nextStep: "조영탁 CEO와의 특별한 대화를 시작하세요"
    },
    {
        id: 8,
        title: "CEO와의 특별한 대화",
        description: "드디어 조영탁 CEO와의 만남! 생각보다 소박한 CEO실에서 차 한 잔하며 '휴넷에서 어떠셨나요?'라는 질문에 답하고, '행복경영' 철학을 들어보세요. 마지막엔 깜짝 제안도 있다고?",
        target: CONSTANTS.QUEST_TARGETS.TALK_TO_CEO,
        completed: false,
        started: false,
        progress: 0,
        maxProgress: 1,
        requiredItem: 'CEO 면담 요청서',
        rewardItem: '휴넷 정규직 확정서',
        questGiver: 'ceo_kim',
        itemSubmitted: false,
        type: 'final',
        floor: 9,
        hint: "👑 9층에서 'CEO 면담 요청서'를 찾아 김대표에게 전달하세요",
        connectionMessage: "🎊 9층 진입 성공! 이제 CEO와의 마지막 대화만 남았습니다.",
        storyContext: "조영탁 CEO와의 대화에서 휴넷의 진정한 가치와 미래 계획을 들어볼 수 있을 거예요.",
        prerequisites: ["경영진 만남 준비 완료"],
        nextStep: "휴넷 생존기 완료! 정규직 확정과 멘토 자격을 획득하세요",
        completionMessage: "🎉 축하합니다! 최진안의 휴넷 생존기를 성공적으로 완료했습니다!"
    },
    // === 히든 메인 퀘스트 ===
    {
        id: 9,
        title: "인사팀의 진실",
        description: "윤도현과 강해빈의 관계도가 최고치일 때만 발동되는 특별한 스토리. 옥상에서 두 사람의 진솔한 대화를 엿듣고, 과거 이야기와 함께 더 좋은 신입사원 적응 프로그램을 함께 만들어보세요.",
        target: CONSTANTS.QUEST_TARGETS.HIDDEN_TRUTH,
        completed: false,
        started: false,
        progress: 0,
        maxProgress: 1,
        requiredItem: '우정의 증표',
        rewardItem: '진정한 동료 관계',
        questGiver: 'hidden_trigger',
        itemSubmitted: false,
        type: 'hidden',
        floor: 'R',
        hint: "💫 옥상에서 '우정의 증표'를 찾고 윤도현, 강해빈과의 특별한 우정을 완성하세요",
        connectionMessage: "✨ 특별한 조건 달성! 인사팀의 숨겨진 진실을 발견했습니다.",
        storyContext: "사실 우리도 예전에 신입사원 때 많이 당황했었어... 그래서 미리 테스트해보는 거야.",
        prerequisites: ["휴넷 정규직 확정서", "윤도현_최고관계", "강해빈_최고관계"],
        nextStep: "특별 엔딩 해금! 진정한 휴넷인이 되었습니다"
    }
];

// 서브 퀘스트 데이터 (25개)
export const SUB_QUEST_DATA = [
    // 카페 문화 시리즈 (4개)
    {
        id: 100,
        title: "스타벅스 단골 되기",
        description: "일주일 동안 매일 다른 음료를 주문해보세요",
        target: CONSTANTS.QUEST_TARGETS.STARBUCKS_REGULAR,
        type: 'sub',
        floor: 1,
        questGiver: 'starbucks_barista',
        requiredItem: '스타벅스 포인트 카드'
    },
    {
        id: 101,
        title: "매머드 커피 사장과의 우정",
        description: "로컬 카페 사장님과 친해지기",
        target: CONSTANTS.QUEST_TARGETS.MAMMOTH_FRIENDSHIP,
        type: 'sub',
        floor: 1,
        questGiver: 'mammoth_owner',
        requiredItem: '매머드 커피 단골 카드'
    },
    {
        id: 102,
        title: "국밥92 아줌마의 인정",
        description: "국밥 아줌마가 얼굴을 기억할 때까지",
        target: CONSTANTS.QUEST_TARGETS.KOOKBAP_RECOGNITION,
        type: 'sub',
        floor: 1,
        questGiver: 'gukbap_ajumma',
        requiredItem: '단골 도장'
    },
    {
        id: 103,
        title: "팀 호튼스 메뉴 마스터",
        description: "캐나다 본토 메뉴 전체 섭렵",
        target: CONSTANTS.QUEST_TARGETS.TIMHORTONS_MASTER,
        type: 'sub',
        floor: 1,
        questGiver: 'timhortons_staff',
        requiredItem: '메뉴 마스터 증서'
    },
    // 동료 관계 구축 시리즈 (8개)
    {
        id: 104,
        title: "복도 인사왕",
        description: "복도에서 만나는 모든 직원과 10번 이상 인사",
        target: CONSTANTS.QUEST_TARGETS.CORRIDOR_GREETINGS,
        type: 'sub',
        floor: 'all',
        questGiver: 'office_worker_1',
        requiredItem: '인사왕 인증서'
    },
    {
        id: 105,
        title: "709호 계열사 탐방",
        description: "계열사 직원들의 업무 이해하고 친해지기",
        target: CONSTANTS.QUEST_TARGETS.AFFILIATES_TOUR,
        type: 'sub',
        floor: 7,
        questGiver: 'office_worker_2',
        requiredItem: '계열사 이해 인증서'
    },
    {
        id: 106,
        title: "IT본부 게임왕",
        description: "점심시간 보드게임에서 3번 우승",
        target: CONSTANTS.QUEST_TARGETS.IT_GAME_CHAMPION,
        type: 'sub',
        floor: 8,
        questGiver: 'kim_deputy',
        requiredItem: '게임 챔피언 트로피'
    },
    {
        id: 107,
        title: "AI연구소 질문왕",
        description: "AI 연구원들에게 100개 질문하기",
        target: CONSTANTS.QUEST_TARGETS.AI_RESEARCHER_QUESTIONS,
        type: 'sub',
        floor: 8,
        questGiver: 'ai_researcher',
        requiredItem: '호기심 마스터 인증서'
    },
    {
        id: 108,
        title: "교육서비스본부 열정상",
        description: "교육팀의 모든 이벤트에 적극 참여",
        target: CONSTANTS.QUEST_TARGETS.EDUCATION_EVENTS,
        type: 'sub',
        floor: 8,
        questGiver: 'education_manager',
        requiredItem: '열정 참여상'
    },
    {
        id: 109,
        title: "영업팀 실적 도우미",
        description: "영업팀 자료 정리 도우미 역할",
        target: CONSTANTS.QUEST_TARGETS.SALES_ASSISTANT,
        type: 'sub',
        floor: 8,
        questGiver: 'manager_lee',
        requiredItem: '영업 서포터 인증서'
    },
    {
        id: 110,
        title: "인사팀의 신뢰",
        description: "윤도현과 강해빈의 업무 도우미 되기",
        target: CONSTANTS.QUEST_TARGETS.HR_TRUST,
        type: 'sub',
        floor: 9,
        questGiver: 'yoon_dohyun',
        requiredItem: '인사팀 신뢰 인증서'
    },
    {
        id: 111,
        title: "경영진과의 거리 좀히기",
        description: "9층에서 자연스럽게 대화 나누기",
        target: CONSTANTS.QUEST_TARGETS.EXECUTIVE_RAPPORT,
        type: 'sub',
        floor: 9,
        questGiver: 'ceo_kim',
        requiredItem: '경영진 친밀도 인증서'
    },
    // 회사 문화 체험 시리즈 (7개)
    {
        id: 112,
        title: "주4일제의 달인",
        description: "금요일 자유시간 100% 활용하기",
        target: CONSTANTS.QUEST_TARGETS.FOUR_DAY_WORK,
        type: 'sub',
        floor: 'all',
        questGiver: 'yoon_dohyun',
        requiredItem: '주4일제 마스터 인증서'
    },
    {
        id: 113,
        title: "무제한 휴가 체험",
        description: "하루 연차 내고 휴식 만끽하기",
        target: CONSTANTS.QUEST_TARGETS.UNLIMITED_VACATION,
        type: 'sub',
        floor: 'all',
        questGiver: 'kang_haebin',
        requiredItem: '휴가 마스터 인증서'
    },
    {
        id: 114,
        title: "시차출근제 마스터",
        description: "8시, 9시, 10시 출근 모두 체험",
        target: CONSTANTS.QUEST_TARGETS.FLEXIBLE_HOURS,
        type: 'sub',
        floor: 'all',
        questGiver: 'kim_deputy',
        requiredItem: '시차출근 마스터 인증서'
    },
    {
        id: 115,
        title: "과일 냉장고 지킴이",
        description: "매일 과일 챙겨먹기 미션",
        target: CONSTANTS.QUEST_TARGETS.FRUIT_FRIDGE,
        type: 'sub',
        floor: 'all',
        questGiver: 'office_worker_1',
        requiredItem: '과일 마스터 인증서'
    },
    {
        id: 116,
        title: "상상력발전소 독서왕",
        description: "사내 도서관에서 책 10권 읽기",
        target: CONSTANTS.QUEST_TARGETS.LIBRARY_READING,
        type: 'sub',
        floor: 'all',
        questGiver: 'librarian',
        requiredItem: '독서왕 인증서'
    },
    {
        id: 117,
        title: "옵상 휴식 마스터",
        description: "옵상 흡연구역과 비흡연구역 모든 사람과 대화",
        target: CONSTANTS.QUEST_TARGETS.ROOFTOP_SOCIALIZING,
        type: 'sub',
        floor: 'R',
        questGiver: 'rooftop_worker',
        requiredItem: '옥상 소셜 마스터 인증서'
    },
    {
        id: 118,
        title: "야근 문화 체험",
        description: "자발적 야근으로 프로젝트 완성하기",
        target: CONSTANTS.QUEST_TARGETS.OVERTIME_CULTURE,
        type: 'sub',
        floor: 'all',
        questGiver: 'kim_deputy',
        requiredItem: '야근 마스터 인증서'
    },
    // 히든 퀘스트 시리즈 (6개)
    {
        id: 119,
        title: "엘리베이터의 비밀",
        description: "엘리베이터에서만 들을 수 있는 특별한 대화들",
        target: CONSTANTS.QUEST_TARGETS.ELEVATOR_SECRETS,
        type: 'hidden',
        floor: 'all',
        questGiver: 'hidden_trigger',
        requiredItem: '엘리베이터 비밀 수집노트'
    },
    {
        id: 120,
        title: "화장실 정치학",
        description: "화장실에서 들리는 각 부서 뿷담화 수집",
        target: CONSTANTS.QUEST_TARGETS.BATHROOM_POLITICS,
        type: 'hidden',
        floor: 'all',
        questGiver: 'hidden_trigger',
        requiredItem: '뿷담화 수집노트'
    },
    {
        id: 121,
        title: "자판기의 전설",
        description: "로비 자판기에서 나오는 특별 아이템 획득",
        target: CONSTANTS.QUEST_TARGETS.VENDING_MACHINE_LEGEND,
        type: 'hidden',
        floor: 1,
        questGiver: 'hidden_trigger',
        requiredItem: '전설의 음료'
    },
    {
        id: 122,
        title: "커피머신 마스터",
        description: "무료 커피머신으로 동료들 커피 타주기",
        target: CONSTANTS.QUEST_TARGETS.COFFEE_MACHINE_MASTER,
        type: 'hidden',
        floor: 'all',
        questGiver: 'hidden_trigger',
        requiredItem: '커피 마스터 자격증'
    },
    {
        id: 123,
        title: "청소 아저씨의 지혜",
        description: "청소 담당자로부터 회사 역사 듣기",
        target: CONSTANTS.QUEST_TARGETS.JANITOR_WISDOM,
        type: 'hidden',
        floor: 'all',
        questGiver: 'janitor',
        requiredItem: '회사 역사 노트'
    },
    {
        id: 124,
        title: "회식 문화 탐구",
        description: "각 부서 회식 스타일 체험하기",
        target: CONSTANTS.QUEST_TARGETS.COMPANY_DINNER_CULTURE,
        type: 'hidden',
        floor: 'all',
        questGiver: 'hidden_trigger',
        requiredItem: '회식 문화 마스터 인증서'
    }
];

// 퀘스트 타입별 설정
export const QUEST_TYPES = {
    main: {
        icon: '📋',
        color: '#4A90E2',
        priority: 1,
        description: '휴넷 생존기 메인 스토리'
    },
    sub: {
        icon: '⭐',
        color: '#F5A623',
        priority: 2,
        description: '부서별 특별 미션'
    },
    hidden: {
        icon: '🔮',
        color: '#7ED321',
        priority: 3,
        description: '특별한 조건에서만 나타나는 히든 퀘스트'
    },
    final: {
        icon: '👑',
        color: '#D0021B',
        priority: 4,
        description: '휴넷 생존기 최종 미션'
    }
};

// 미니게임 챌린지 시스템
export const MINIGAME_CHALLENGES = {
    // 휴넷 생존기에서는 미니게임이 대신 NPC와의 대화 선택지 사용
    quiz_basic: {
        name: '휴넷 기본 지식 퀴즈',
        description: '휴넷에 대한 기본 지식을 테스트하는 퀴즈',
        questions: [
            {
                question: '휴넷의 창립년도는?',
                options: ['1998년', '1999년', '2000년', '2001년'],
                correct: 1 // 1999년
            },
            {
                question: '휴넷의 대표이사는?',
                options: ['김영수', '이수민', '조영탁', '박민수'],
                correct: 2 // 조영탁
            }
        ]
    }
};

// 관계도 시스템 (NPC별 호감도)
export const RELATIONSHIP_SYSTEM = {
    윤도현: { level: 0, maxLevel: 5, description: "인사경영실 총무담당" },
    강해빈: { level: 0, maxLevel: 5, description: "인사경영실 채용담당" },
    김대리: { level: 0, maxLevel: 5, description: "710호 본사 IT 김대리" },
    이과장: { level: 0, maxLevel: 5, description: "영업+교육지원본부 이과장" },
    교육매니저: { level: 0, maxLevel: 5, description: "교육서비스본부 교육매니저" },
    김대표: { level: 0, maxLevel: 5, description: "조영탁 CEO" }
};

// 엔딩 시스템
export const ENDING_CONDITIONS = {
    A: {
        name: "완벽한 휴넷인",
        description: "모든 메인퀘 + 서브퀘 90% 완료",
        requirements: { mainQuests: 9, subQuests: 23, relationships: 5 }
    },
    B: {
        name: "인사팀의 절친",
        description: "윤도현, 강해빈과의 최고 관계",
        requirements: { 윤도현: 5, 강해빈: 5, hiddenQuest: true }
    },
    C: {
        name: "부서 협업 마스터",
        description: "모든 부서와 고른 관계 형성",
        requirements: { averageRelationship: 3 }
    },
    D: {
        name: "자유로운 영혼",
        description: "주4일제, 무제한 휴가 문화 체험",
        requirements: { culturalQuests: 15 }
    },
    HIDDEN_1: {
        name: "멘토의 길",
        description: "히든 퀘스트 완료 후 멘토 자격",
        requirements: { hiddenQuest: true, allRelationships: 4 }
    },
    HIDDEN_2: {
        name: "휴넷 전설",
        description: "모든 퀘스트 100% 완료",
        requirements: { allQuests: true, allSecrets: true }
    },
    BAD: {
        name: "적응 실패",
        description: "메인퀘스트 50% 미만 완료",
        requirements: { mainQuests: 4, minRelationships: true }
    }
};

// 퀘스트 검증 규칙
export const QUEST_VALIDATION = {
    // 단일 아이템 퀘스트 검증
    validateSingleItem: (quest, inventory) => {
        if (!quest.requiredItem) return true;
        return inventory.some(item => item.name === quest.requiredItem);
    },

    // 전제 조건 확인
    validatePrerequisites: (quest, inventory) => {
        if (!quest.prerequisites || quest.prerequisites.length === 0) return true;
        return quest.prerequisites.every(prerequisite => {
            // 특별한 관계도 조건 체크
            if (prerequisite.includes('_최고관계')) {
                const npcName = prerequisite.replace('_최고관계', '');
                return RELATIONSHIP_SYSTEM[npcName] && RELATIONSHIP_SYSTEM[npcName].level >= 5;
            }
            return inventory.some(item => item.name === prerequisite);
        });
    },

    // 퀘스트 완료 가능 여부 확인
    canComplete: (quest, inventory) => {
        return QUEST_VALIDATION.validateSingleItem(quest, inventory) &&
               QUEST_VALIDATION.validatePrerequisites(quest, inventory);
    },

    // 퀘스트 활성화 가능 여부 확인
    canActivate: (quest, inventory) => {
        return QUEST_VALIDATION.validatePrerequisites(quest, inventory);
    },

    // 다음 추천 퀘스트 반환
    getNextRecommendedQuest: (completedQuests, inventory) => {
        const incompleteQuests = QUEST_DATA.filter(quest =>
            !completedQuests.includes(quest.id) && !quest.completed
        );

        for (const quest of incompleteQuests) {
            if (QUEST_VALIDATION.canActivate(quest, inventory)) {
                return quest.id;
            }
        }

        return null;
    },

    // 스토리 진행률 계산
    getStoryProgress: (completedQuests) => {
        const totalMainQuests = QUEST_DATA.filter(q => q.type === 'main' || q.type === 'final').length;
        const completedMainQuests = completedQuests.filter(id => {
            const quest = QUEST_DATA.find(q => q.id === id);
            return quest && (quest.type === 'main' || quest.type === 'final');
        }).length;
        return Math.round((completedMainQuests / totalMainQuests) * 100);
    }
};