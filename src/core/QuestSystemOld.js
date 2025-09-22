import { CONSTANTS } from '../utils/Constants.js';
import { Logger } from '../utils/Logger.js';

export class QuestSystem {
    constructor(audioManager = null) {
        this.audioManager = audioManager;
        this.currentQuest = 0;
        this.showQuestUI = true;
        this.quests = [
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
                itemSubmitted: false
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
                itemSubmitted: false
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
                itemSubmitted: false
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
                itemSubmitted: false
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
                itemSubmitted: false
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
                itemSubmitted: false
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
                itemSubmitted: false
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
                itemSubmitted: false
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
                itemSubmitted: false
            }
        ];

        // 서브 퀘스트 제거 - 메인 퀘스트만 진행
        this.subQuests = [
            /* 서브퀘스트 모두 제거
            {
                id: 100,
                title: "택배 배달 체인",
                description: "1층 택배 기사에게서 택배를 받아 7층 김대리에게 전달하세요",
                target: CONSTANTS.QUEST_TARGETS.DELIVER_PACKAGE,
                completed: false,
                progress: 0,
                maxProgress: 2,
                category: "업무",
                questGiver: 'delivery_person',
                requiredItem: '택배 상자',
                rewardItem: '배달 완료증',
                steps: [
                    { description: "1층에서 택배 상자 받기", completed: false },
                    { description: "7층 김대리에게 택배 전달", completed: false }
                ],
                itemSubmitted: false
            },
            {
                id: 101,
                title: "회사 투어 가이드",
                description: "면접 지원자를 위해 각 층의 특색을 설명해주세요",
                target: CONSTANTS.QUEST_TARGETS.HELP_VISITOR,
                completed: false,
                progress: 0,
                maxProgress: 3,
                category: "사교",
                questGiver: 'job_applicant',
                requiredItem: '회사 안내서',
                rewardItem: '감사 편지',
                steps: [
                    { description: "1층 안내 데스크에서 회사 안내서 받기", completed: false },
                    { description: "7층, 8층, 9층 각각 방문하기", completed: false },
                    { description: "면접 지원자에게 투어 완료 보고", completed: false }
                ],
                itemSubmitted: false
            },
            {
                id: 102,
                title: "특별 커피 주문",
                description: "개발팀을 위한 특별 커피를 준비하는 복잡한 주문 과정",
                target: CONSTANTS.QUEST_TARGETS.COFFEE_DELIVERY,
                completed: false,
                progress: 0,
                maxProgress: 3,
                category: "생활",
                questGiver: 'developer_1',
                requiredItem: '특제 아메리카노',
                rewardItem: '개발팀 감사패',
                steps: [
                    { description: "개발팀에서 커피 주문서 받기", completed: false },
                    { description: "스타벅스에서 특제 아메리카노 주문", completed: false },
                    { description: "개발팀에 커피 배달", completed: false }
                ],
                itemSubmitted: false
            },
            {
                id: 103,
                title: "점심 메뉴 조사",
                description: "직원들의 점심 선호도를 조사하고 주문하세요",
                target: CONSTANTS.QUEST_TARGETS.LUNCH_ORDER,
                completed: false,
                progress: 0,
                maxProgress: 4,
                category: "생활",
                questGiver: 'lunch_employee',
                requiredItem: '선호 메뉴 조사서',
                rewardItem: '맛집 지도',
                steps: [
                    { description: "각 층 직원들에게 메뉴 선호도 조사", completed: false },
                    { description: "조사 결과를 정리하여 보고서 작성", completed: false },
                    { description: "국밥집에서 인기 메뉴 주문", completed: false },
                    { description: "점심 먹는 직원에게 결과 보고", completed: false }
                ],
                itemSubmitted: false
            },
            {
                id: 104,
                title: "신입사원 멘토링 프로그램",
                description: "신입사원을 위한 종합 교육 프로그램을 운영하세요",
                target: CONSTANTS.QUEST_TARGETS.TRAINING_ASSIST,
                completed: false,
                progress: 0,
                maxProgress: 3,
                category: "업무",
                questGiver: 'training_coordinator',
                requiredItem: '교육 완료증',
                rewardItem: '멘토 자격증',
                steps: [
                    { description: "신입사원 윤씨와 대화하여 교육 필요사항 파악", completed: false },
                    { description: "8층에서 교육 자료 수집", completed: false },
                    { description: "교육 프로그램 완료 후 보고", completed: false }
                ],
                itemSubmitted: false
            },
            {
                id: 105,
                title: "프린터 수리 체인",
                description: "7층 프린터 문제를 해결하기 위한 복잡한 수리 과정",
                target: CONSTANTS.QUEST_TARGETS.REPAIR_PRINTER,
                completed: false,
                progress: 0,
                maxProgress: 3,
                category: "업무",
                questGiver: 'maintenance_worker',
                requiredItem: '수리 완료 보고서',
                rewardItem: '기술자 인증서',
                steps: [
                    { description: "7층 사무실 2에서 프린터 상태 확인", completed: false },
                    { description: "1층에서 프린터 수리 도구 가져오기", completed: false },
                    { description: "수리 완료 후 시설 관리자에게 보고", completed: false }
                ],
                itemSubmitted: false
            }
            // 나머지 서브퀘스트는 이벤트용으로 간소화를 위해 제거
            /* {
                id: 106,
                title: "분실물 수사 체인",
                description: "신입사원의 명찰을 찾기 위한 탐정 활동",
                target: CONSTANTS.QUEST_TARGETS.FIND_LOST_ITEM,
                completed: false,
                progress: 0,
                maxProgress: 4,
                category: "탐험",
                questGiver: 'office_newbie',
                requiredItem: '윤씨 명찰',
                rewardItem: '감사의 마음',
                steps: [
                    { description: "7층에서 명찰 단서 수집", completed: false },
                    { description: "8층 청소 직원에게 문의", completed: false },
                    { description: "9층 분실물 보관소 확인", completed: false },
                    { description: "명찰을 신입사원에게 반환", completed: false }
                ],
                itemSubmitted: false
            },
            {
                id: 107,
                title: "프레젠테이션 준비 체인",
                description: "완벽한 프레젠테이션을 위한 종합 준비 과정",
                target: CONSTANTS.QUEST_TARGETS.MEETING_SETUP,
                completed: false,
                progress: 0,
                maxProgress: 4,
                category: "업무",
                questGiver: 'presenter',
                requiredItem: '프레젠테이션 세팅 완료증',
                rewardItem: '발표 성공 인증서',
                steps: [
                    { description: "7층에서 프로젝터 장비 가져오기", completed: false },
                    { description: "8층 회의실 테이블과 의자 정리", completed: false },
                    { description: "9층에서 프레젠테이션 자료 인쇄", completed: false },
                    { description: "발표자에게 준비 완료 보고", completed: false }
                ],
                itemSubmitted: false
            },
            {
                id: 108,
                title: "회사 문화 체험 투어",
                description: "면접 지원자를 위한 심화 회사 문화 체험 프로그램",
                target: CONSTANTS.QUEST_TARGETS.EMPLOYEE_INTRODUCTION,
                completed: false,
                progress: 0,
                maxProgress: 5,
                category: "사교",
                questGiver: 'job_applicant',
                requiredItem: '회사 문화 체험 리포트',
                rewardItem: '추천인 자격증',
                steps: [
                    { description: "7층 개발팀과 인사하기", completed: false },
                    { description: "8층 기획팀 업무 관찰하기", completed: false },
                    { description: "9층 임원진과 인사하기", completed: false },
                    { description: "옥상에서 회사 전경 소개하기", completed: false },
                    { description: "면접 지원자에게 체험 후기 작성 요청", completed: false }
                ],
                itemSubmitted: false
            },
            {
                id: 109,
                title: "종합 스트레스 관리 프로그램",
                description: "동료의 스트레스 해소를 위한 체계적인 힐링 과정",
                target: CONSTANTS.QUEST_TARGETS.STRESS_RELIEF,
                completed: false,
                progress: 0,
                maxProgress: 4,
                category: "사교",
                questGiver: 'stressed_worker',
                requiredItem: '스트레스 해소 키트',
                rewardItem: '마음의 평화',
                steps: [
                    { description: "1층 카페에서 따뜻한 차 구매하기", completed: false },
                    { description: "8층에서 스트레스 해소 음악 찾기", completed: false },
                    { description: "9층에서 휴식용 쿠션 가져오기", completed: false },
                    { description: "옥상에서 스트레스 해소 키트 전달", completed: false }
                ],
                itemSubmitted: false
            },
            {
                id: 110,
                title: "종합 보안 감사",
                description: "건물 전체의 보안 시스템을 체계적으로 점검하는 과정",
                target: CONSTANTS.QUEST_TARGETS.SECURITY_CHECK,
                completed: false,
                progress: 0,
                maxProgress: 3,
                category: "업무",
                questGiver: 'security_guard',
                requiredItem: '보안 감사 리포트',
                rewardItem: '보안 관리 자격증',
                steps: [
                    { description: "각 층별 출입문 보안 상태 점검", completed: false },
                    { description: "CCTV 시스템 작동 확인", completed: false },
                    { description: "보안 요원에게 점검 결과 보고", completed: false }
                ],
                itemSubmitted: false
            },
            {
                id: 111,
                title: "헬스 케어 프로그램",
                description: "직장 내 건강 증진을 위한 운동 파트너십 구축",
                target: CONSTANTS.QUEST_TARGETS.EXERCISE_BUDDY,
                completed: false,
                progress: 0,
                maxProgress: 4,
                category: "사교",
                questGiver: 'exercise_enthusiast',
                requiredItem: '운동 프로그램 완주증',
                rewardItem: '헬스 트레이너 인증',
                steps: [
                    { description: "8층에서 운동 계획서 작성", completed: false },
                    { description: "다른 직원들에게 운동 참여 권유", completed: false },
                    { description: "옥상에서 단체 운동 실시", completed: false },
                    { description: "운동 성과 평가 및 보고", completed: false }
                ],
                itemSubmitted: false
            },
            {
                id: 112,
                title: "긴급 연락망 구축",
                description: "중요한 메시지를 정확하게 전달하는 연락 체계 구축",
                target: CONSTANTS.QUEST_TARGETS.PHONE_MESSAGE,
                completed: false,
                progress: 0,
                maxProgress: 3,
                category: "업무",
                questGiver: 'phone_caller',
                requiredItem: '메시지 전달 확인서',
                rewardItem: '커뮤니케이션 전문가 인증',
                steps: [
                    { description: "7층에서 메시지 내용 정확히 기록", completed: false },
                    { description: "8층 담당자에게 메시지 전달", completed: false },
                    { description: "전달 완료 확인 후 보고", completed: false }
                ],
                itemSubmitted: false
            },
            {
                id: 113,
                title: "웰빙 환경 조성",
                description: "직장 내 명상과 힐링을 위한 완벽한 환경 구성",
                target: CONSTANTS.QUEST_TARGETS.MEDITATION_GUIDE,
                completed: false,
                progress: 0,
                maxProgress: 4,
                category: "사교",
                questGiver: 'meditation_person',
                requiredItem: '명상 가이드 자격증',
                rewardItem: '웰빙 코디네이터 인증',
                steps: [
                    { description: "9층에서 조용한 음악 선별", completed: false },
                    { description: "8층에서 향초와 방석 준비", completed: false },
                    { description: "옥상에 명상 공간 조성", completed: false },
                    { description: "명상 세션 완료 후 평가", completed: false }
                ],
                itemSubmitted: false
            },
            {
                id: 114,
                title: "게임 마스터 챌린지",
                description: "아케이드 게임의 최고 기록을 세우기 위한 전문가 과정",
                target: CONSTANTS.QUEST_TARGETS.ARCADE_CHAMPION,
                completed: false,
                progress: 0,
                maxProgress: 3,
                category: "미니게임",
                questGiver: 'arcade_master',
                requiredItem: '게임 챔피언 트로피',
                rewardItem: '아케이드 마스터 칭호',
                steps: [
                    { description: "각종 미니게임 연습 및 전략 수립", completed: false },
                    { description: "다른 직원들과 게임 대회 개최", completed: false },
                    { description: "최고 기록 달성 후 인증", completed: false }
                ],
                itemSubmitted: false
            },
            {
                id: 115,
                title: "청결 관리 시스템",
                description: "건물 전체의 청결도를 향상시키는 체계적인 청소 프로그램",
                target: CONSTANTS.QUEST_TARGETS.CLEANING_HELP,
                completed: false,
                progress: 0,
                maxProgress: 5,
                category: "사교",
                questGiver: 'cleaning_staff',
                requiredItem: '청소 품질 인증서',
                rewardItem: '환경 관리 전문가 인증',
                steps: [
                    { description: "각 층별 청소 구역 분담", completed: false },
                    { description: "7층 사무실 정리 정돈", completed: false },
                    { description: "8층 회의실 청소", completed: false },
                    { description: "9층 임원실 관리", completed: false },
                    { description: "옥상 환경 정비", completed: false }
                ],
                itemSubmitted: false
            },
            {
                id: 116,
                title: "면접 성공 컨설팅",
                description: "완벽한 면접 준비를 위한 종합 컨설팅 프로그램",
                target: CONSTANTS.QUEST_TARGETS.JOB_INTERVIEW_PREP,
                completed: false,
                progress: 0,
                maxProgress: 4,
                category: "사교",
                questGiver: 'job_applicant',
                requiredItem: '면접 준비 완료증',
                rewardItem: '면접 컨설턴트 자격증',
                steps: [
                    { description: "7층 개발팀에서 기술 질문 수집", completed: false },
                    { description: "8층 기획팀에서 업무 프로세스 학습", completed: false },
                    { description: "9층 임원진에게 회사 비전 청취", completed: false },
                    { description: "모의 면접 실시 및 피드백", completed: false }
                ],
                itemSubmitted: false
            },
            {
                id: 117,
                title: "임원 전략 브리핑 시스템",
                description: "고급 임원진을 위한 포괄적 전략 분석 자료 작성",
                target: CONSTANTS.QUEST_TARGETS.EXECUTIVE_BRIEFING,
                completed: false,
                progress: 0,
                maxProgress: 4,
                category: "업무",
                questGiver: 'executive_assistant',
                requiredItem: '전략 브리핑 패키지',
                rewardItem: '전략 분석가 인증서',
                steps: [
                    { description: "7층에서 개발 현황 데이터 수집", completed: false },
                    { description: "8층에서 기획 로드맵 분석", completed: false },
                    { description: "각 부서별 성과 지표 통합", completed: false },
                    { description: "임원진 브리핑 자료 최종 완성", completed: false }
                ],
                itemSubmitted: false
            },
            {
                id: 118,
                title: "법무 종합 검토 시스템",
                description: "중요 계약의 법적 리스크를 완벽하게 분석하는 과정",
                target: CONSTANTS.QUEST_TARGETS.LEGAL_DOCUMENT,
                completed: false,
                progress: 0,
                maxProgress: 3,
                category: "업무",
                questGiver: 'legal_advisor',
                requiredItem: '법무 검토 완료서',
                rewardItem: '법무 컨설턴트 자격증',
                steps: [
                    { description: "7층에서 관련 계약서 원본 수집", completed: false },
                    { description: "8층에서 법적 조항 분석 자료 검토", completed: false },
                    { description: "법무 고문에게 최종 검토 결과 제출", completed: false }
                ],
                itemSubmitted: false
            },
            {
                id: 119,
                title: "26주년 재무 분석 프로젝트",
                description: "회사 26주년을 기념하는 종합적인 재무 성과 분석",
                target: CONSTANTS.QUEST_TARGETS.FINANCIAL_REPORT,
                completed: false,
                progress: 0,
                maxProgress: 5,
                category: "업무",
                questGiver: 'cfo',
                requiredItem: '26주년 재무 분석 리포트',
                rewardItem: '재무 분석 전문가 인증서',
                steps: [
                    { description: "7층에서 개발비 지출 내역 수집", completed: false },
                    { description: "8층에서 기획비 및 마케팅비 분석", completed: false },
                    { description: "9층에서 전체 매출 및 수익 데이터 통합", completed: false },
                    { description: "26년간의 재무 트렌드 분석", completed: false },
                    { description: "CFO에게 최종 분석 리포트 제출", completed: false }
                ],
                itemSubmitted: false
            }
            서브퀘스트 모두 제거 종료 */
        ];
    }

    getCurrentQuest() {
        return this.quests[this.currentQuest];
    }

    completeQuest(questTarget) {
        const quest = this.quests.find(q => q.target === questTarget);
        if (quest && !quest.completed) {
            quest.completed = true;
            quest.progress = quest.maxProgress;

            // Play quest complete sound
            if (this.audioManager) {
                this.audioManager.playQuestComplete();
            }

            // Move to next quest if current
            if (quest.id === this.currentQuest && this.currentQuest < this.quests.length - 1) {
                this.currentQuest++;

                // Play level up sound when advancing to next quest
                if (this.audioManager) {
                    setTimeout(() => this.audioManager.playLevelUp(), 800);
                }
            }

            // Check if all quests are completed
            if (this.currentQuest >= this.quests.length - 1 && quest.id === this.quests.length - 1) {
                // Play game complete sound
                if (this.audioManager) {
                    setTimeout(() => this.audioManager.playGameComplete(), 1500);
                }
            }

            return true;
        }
        return false;
    }

    updateProgress(questTarget, progress) {
        const quest = this.quests.find(q => q.target === questTarget);
        if (quest && !quest.completed) {
            quest.progress = Math.min(progress, quest.maxProgress);
            if (quest.progress >= quest.maxProgress) {
                this.completeQuest(questTarget);
            }
        }
    }

    isQuestCompleted(questTarget) {
        const quest = this.quests.find(q => q.target === questTarget);
        return quest ? quest.completed : false;
    }

    // 서브 퀘스트 관련 메서드들
    getAllSubQuests() {
        return this.subQuests;
    }

    getAvailableSubQuests() {
        return this.subQuests.filter(quest => !quest.completed);
    }

    getCompletedSubQuests() {
        return this.subQuests.filter(quest => quest.completed);
    }

    getSubQuestsByCategory(category) {
        return this.subQuests.filter(quest => quest.category === category);
    }

    findSubQuestByGiver(npcId) {
        return this.subQuests.find(quest => quest.questGiver === npcId && !quest.completed);
    }

    completeSubQuest(questTarget) {
        const quest = this.subQuests.find(q => q.target === questTarget);
        if (quest && !quest.completed) {
            quest.completed = true;
            quest.progress = quest.maxProgress;

            if (this.audioManager) {
                this.audioManager.playQuestComplete();
            }
            return true;
        }
        return false;
    }

    canSubmitToSubQuestGiver(npcId, playerInventory) {
        const quest = this.findSubQuestByGiver(npcId);
        if (!quest) return { canSubmit: false, reason: '서브 퀘스트가 없습니다.' };

        Logger.debug(`🎯 퀘스트 검증: ${quest.title} (ID: ${quest.id}), 진행도: ${quest.progress}/${quest.maxProgress}`);

        // 이미 완료된 퀘스트는 더 이상 진행 불가
        if (quest.completed) {
            return { canSubmit: false, reason: '이미 완료된 퀘스트입니다.' };
        }

        // 퀘스트가 아직 시작되지 않았다면 무조건 시작 가능
        if (quest.progress === 0) {
            Logger.debug(`✅ 퀘스트 시작 가능: ${quest.title}`);
            return { canSubmit: true, quest: quest, action: 'start' };
        }

        // 진행 중인 퀘스트에서 현재 단계 확인
        if (quest.progress < quest.maxProgress) {
            // 현재 단계에서 필요한 아이템 확인
            const currentStepRequiredItems = this.getStepRequiredItems(quest.id, quest.progress);
            Logger.debug(`🔧 현재 단계 검증 (step ${quest.progress}): 필요 아이템 [${currentStepRequiredItems.join(', ')}], 보유 아이템: [${playerInventory.map(item => item.name).join(', ')}]`);

            if (currentStepRequiredItems.length > 0) {
                const missingItems = currentStepRequiredItems.filter(itemName =>
                    !playerInventory.some(item => item.name === itemName)
                );
                if (missingItems.length > 0) {
                    Logger.debug(`❌ 아이템 부족: [${missingItems.join(', ')}]`);
                    return { canSubmit: false, reason: `현재 단계를 완료하려면 '${missingItems.join(', ')}'이(가) 필요합니다.` };
                }
            }

            Logger.debug(`✅ 단계 진행 가능`);
            return { canSubmit: true, quest: quest, action: 'progress' };
        }

        return { canSubmit: false, reason: '이미 완료된 퀘스트입니다.' };
    }

    // 퀘스트 단계별 필요 아이템 확인 (현재 단계를 완료하기 위해 필요한 아이템)
    getStepRequiredItems(questId, stepIndex) {
        const stepRequirements = {
            100: { // 택배 배달 체인 (2단계)
                0: [], // 0→1: 퀘스트 시작, 택배 상자를 받음
                1: ['택배 상자'] // 1→2: 김대리에게 전달하려면 택배 상자 필요
            },
            101: { // 회사 투어 가이드 (3단계)
                0: [], // 0→1: 퀘스트 시작, 회사 안내서를 받음
                1: [], // 1→2: 각 층 방문 (아이템 불필요)
                2: ['회사 문화 체험 리포트'] // 2→3: 완료 보고 시 리포트 필요
            },
            102: { // 커피 주문 퀘스트 (3단계)
                0: [], // 0→1: 퀘스트 시작, 커피 주문서를 받음
                1: ['커피 주문서'], // 1→2: 스타벅스에서 주문하려면 주문서 필요
                2: ['특제 아메리카노'] // 2→3: 개발팀에 배달하려면 커피 필요
            },
            103: { // 점심 메뉴 조사 (4단계)
                0: [], // 0→1: 퀘스트 시작, 메뉴 조사지를 받음
                1: [], // 1→2: 각 층 직원들 조사 (아이템 불필요)
                2: [], // 2→3: 국밥집에서 주문 (아이템 불필요)
                3: ['선호 메뉴 조사서'] // 3→4: 결과 보고 시 조사서 필요
            },
            104: { // 신입사원 멘토링 (3단계)
                0: [], // 0→1: 퀘스트 시작
                1: [], // 1→2: 교육 자료 수집 (아이템 불필요)
                2: ['교육 완료증'] // 2→3: 완료 보고 시 완료증 필요
            },
            105: { // 프린터 수리 체인 (3단계)
                0: [], // 0→1: 프린터 상태 확인 (아이템 불필요)
                1: [], // 1→2: 수리 도구 가져오기 (아이템 불필요)
                2: ['수리 완료 보고서'] // 2→3: 수리 완료 보고 시 보고서 필요
            },
            106: { // 분실물 수사 체인 (4단계)
                0: [], // 0→1: 단서 수집 (아이템 불필요)
                1: [], // 1→2: 청소 직원 문의 (아이템 불필요)
                2: [], // 2→3: 분실물 보관소 확인 (아이템 불필요)
                3: ['윤씨 명찰'] // 3→4: 명찰 반환 시 명찰 필요
            },
            107: { // 프레젠테이션 준비 체인 (4단계)
                0: [], // 0→1: 프로젝터 장비 가져오기 (아이템 불필요)
                1: [], // 1→2: 회의실 정리 (아이템 불필요)
                2: [], // 2→3: 자료 인쇄 (아이템 불필요)
                3: ['프레젠테이션 세팅 완료증'] // 3→4: 준비 완료 보고 시 완료증 필요
            },
            108: { // 회사 문화 체험 투어 (5단계)
                0: [], // 0→1: 개발팀과 인사 (아이템 불필요)
                1: [], // 1→2: 기획팀 업무 관찰 (아이템 불필요)
                2: [], // 2→3: 임원진과 인사 (아이템 불필요)
                3: [], // 3→4: 옥상에서 전경 소개 (아이템 불필요)
                4: ['회사 문화 체험 리포트'] // 4→5: 체험 후기 작성 요청 시 리포트 필요
            },
            109: { // 스트레스 관리 프로그램 (4단계)
                0: [], // 0→1: 따뜻한 차 구매 (아이템 불필요)
                1: [], // 1→2: 스트레스 해소 음악 찾기 (아이템 불필요)
                2: [], // 2→3: 휴식용 쿠션 가져오기 (아이템 불필요)
                3: ['스트레스 해소 키트'] // 3→4: 키트 전달 시 키트 필요
            }
        };

        const questRequirements = stepRequirements[questId];
        if (!questRequirements) return [];

        return questRequirements[stepIndex] || [];
    }

    // 퀘스트 단계별 진행을 위한 새 메서드
    progressSubQuest(questId, stepIndex = null) {
        const quest = this.subQuests.find(q => q.id === questId);
        if (!quest) return false;

        if (stepIndex !== null && quest.steps) {
            quest.steps[stepIndex].completed = true;
        }

        quest.progress = Math.min(quest.progress + 1, quest.maxProgress);

        if (quest.progress >= quest.maxProgress) {
            quest.completed = true;
        }

        return true;
    }

    // NPC별 퀘스트 진행 상태 확인
    getSubQuestProgressForNPC(npcId) {
        const quest = this.findSubQuestByGiver(npcId);
        if (!quest) return null;

        return {
            questId: quest.id,
            title: quest.title,
            progress: quest.progress,
            maxProgress: quest.maxProgress,
            currentStep: quest.steps ? quest.steps[quest.progress] : null,
            completed: quest.completed
        };
    }

    submitItemsToSubQuestGiver(npcId, playerInventory, gameState) {
        const submission = this.canSubmitToSubQuestGiver(npcId, playerInventory);
        if (!submission.canSubmit) return { success: false, message: submission.reason };

        const quest = submission.quest;
        const action = submission.action;

        if (action === 'start') {
            // 퀘스트 시작
            quest.progress = 1;
            if (quest.steps) {
                quest.steps[0].completed = true;
            }

            // 퀘스트 시작시 특별 아이템 지급
            if (quest.id === 100) { // 택배 퀘스트
                playerInventory.push({ name: '택배 상자', type: 'quest' });
                gameState.itemsCollected++;
            } else if (quest.id === 101) { // 투어 가이드 퀘스트
                playerInventory.push({ name: '회사 안내서', type: 'quest' });
                gameState.itemsCollected++;
            } else if (quest.id === 102) { // 커피 주문 퀘스트
                playerInventory.push({ name: '커피 주문서', type: 'quest' });
                gameState.itemsCollected++;
            } else if (quest.id === 103) { // 점심 메뉴 조사
                playerInventory.push({ name: '메뉴 조사지', type: 'quest' });
                gameState.itemsCollected++;
            } else if (quest.id === 104) { // 신입사원 멘토링
                playerInventory.push({ name: '교육 계획서', type: 'quest' });
                gameState.itemsCollected++;
            } else if (quest.id === 105) { // 프린터 수리
                playerInventory.push({ name: '수리 점검표', type: 'quest' });
                gameState.itemsCollected++;
            } else if (quest.id === 106) { // 분실물 찾기
                playerInventory.push({ name: '수사 노트', type: 'quest' });
                gameState.itemsCollected++;
            } else if (quest.id === 107) { // 프레젠테이션 준비
                playerInventory.push({ name: '준비 체크리스트', type: 'quest' });
                gameState.itemsCollected++;
            } else if (quest.id === 108) { // 회사 문화 체험
                playerInventory.push({ name: '체험 가이드북', type: 'quest' });
                gameState.itemsCollected++;
            } else if (quest.id === 109) { // 스트레스 관리
                playerInventory.push({ name: '힐링 계획서', type: 'quest' });
                gameState.itemsCollected++;
            } else if (quest.id === 110) { // 보안 감사
                playerInventory.push({ name: '보안 점검표', type: 'quest' });
                gameState.itemsCollected++;
            } else if (quest.id === 111) { // 헬스 케어
                playerInventory.push({ name: '운동 계획표', type: 'quest' });
                gameState.itemsCollected++;
            } else if (quest.id === 112) { // 긴급 연락망
                playerInventory.push({ name: '메시지 기록지', type: 'quest' });
                gameState.itemsCollected++;
            } else if (quest.id === 113) { // 웰빙 환경
                playerInventory.push({ name: '명상 준비 리스트', type: 'quest' });
                gameState.itemsCollected++;
            } else if (quest.id === 114) { // 게임 마스터
                playerInventory.push({ name: '게임 전략서', type: 'quest' });
                gameState.itemsCollected++;
            } else if (quest.id === 115) { // 청결 관리
                playerInventory.push({ name: '청소 계획표', type: 'quest' });
                gameState.itemsCollected++;
            } else if (quest.id === 116) { // 면접 컨설팅
                playerInventory.push({ name: '면접 가이드북', type: 'quest' });
                gameState.itemsCollected++;
            } else if (quest.id === 117) { // 임원 브리핑
                playerInventory.push({ name: '브리핑 템플릿', type: 'quest' });
                gameState.itemsCollected++;
            } else if (quest.id === 118) { // 법무 검토
                playerInventory.push({ name: '법무 체크리스트', type: 'quest' });
                gameState.itemsCollected++;
            } else if (quest.id === 119) { // 재무 분석
                playerInventory.push({ name: '분석 양식', type: 'quest' });
                gameState.itemsCollected++;
            }

            return {
                success: true,
                action: 'start',
                message: `${quest.title} 퀘스트를 시작했습니다!`,
                quest: quest
            };
        } else if (action === 'progress') {
            // 퀘스트 진행
            const wasLastStep = quest.progress === quest.maxProgress - 1;

            // 마지막 단계에서 아이템 제출
            if (wasLastStep && quest.requiredItem) {
                const itemIndex = playerInventory.findIndex(item => item.name === quest.requiredItem);
                if (itemIndex !== -1) {
                    playerInventory.splice(itemIndex, 1);
                    gameState.itemsCollected--;
                }
            }

            quest.progress = Math.min(quest.progress + 1, quest.maxProgress);
            if (quest.steps && quest.progress <= quest.steps.length) {
                quest.steps[quest.progress - 1].completed = true;
            }

            // 퀘스트 완료 체크
            if (quest.progress >= quest.maxProgress) {
                quest.completed = true;
                quest.itemSubmitted = true;

                // 보상 아이템 지급
                if (quest.rewardItem) {
                    playerInventory.push({ name: quest.rewardItem, type: 'reward' });
                    gameState.itemsCollected++;
                }

                if (this.audioManager) {
                    this.audioManager.playQuestComplete();
                }

                return {
                    success: true,
                    action: 'progress',
                    message: quest.rewardItem ?
                        `서브 퀘스트 완료! '${quest.rewardItem}'을(를) 받았습니다.` :
                        `서브 퀘스트 완료! 경험을 얻었습니다.`,
                    quest: quest
                };
            } else {
                // 중간 단계 진행
                const nextStep = quest.steps ? quest.steps[quest.progress] : null;
                return {
                    success: true,
                    action: 'progress',
                    message: nextStep ?
                        `다음 단계: ${nextStep.description}` :
                        `퀘스트 진행 중... (${quest.progress}/${quest.maxProgress})`,
                    quest: quest
                };
            }
        }

        return { success: false, message: '알 수 없는 오류가 발생했습니다.' };
    }

    getAllQuests() {
        return [...this.quests, ...this.subQuests];
    }

    getTotalQuestCount() {
        return this.quests.length + this.subQuests.length;
    }

    getCompletedQuestCount() {
        return this.quests.filter(q => q.completed).length +
               this.subQuests.filter(q => q.completed).length;
    }

    serialize() {
        return {
            currentQuest: this.currentQuest,
            showQuestUI: this.showQuestUI,
            quests: this.quests.map(q => ({ ...q })),
            subQuests: this.subQuests.map(q => ({ ...q }))
        };
    }

    deserialize(data) {
        this.currentQuest = data.currentQuest || 0;
        this.showQuestUI = data.showQuestUI !== undefined ? data.showQuestUI : true;
        if (data.quests) {
            this.quests = data.quests.map(q => ({ ...q }));
        }
        if (data.subQuests) {
            this.subQuests = data.subQuests.map(q => ({ ...q }));
        }
    }

    areAllQuestsCompleted() {
        return this.quests.every(quest => quest.completed);
    }

    toggleQuestUI() {
        this.showQuestUI = !this.showQuestUI;
    }

    showQuestUIPanel() {
        this.showQuestUI = true;
    }

    hideQuestUIPanel() {
        this.showQuestUI = false;
    }

    canSubmitToNPC(npcId, playerInventory) {
        const quest = this.quests.find(q => q.questGiver === npcId && !q.completed);
        if (!quest) return { canSubmit: false, reason: '퀘스트가 없습니다.' };

        if (quest.requiredItem) {
            const hasItem = playerInventory.some(item => item.name === quest.requiredItem);
            if (!hasItem) {
                return { canSubmit: false, reason: `'${quest.requiredItem}'이(가) 필요합니다.` };
            }
        }

        if (quest.requiredItems) {
            const missingItems = quest.requiredItems.filter(requiredItem =>
                !playerInventory.some(item => item.name === requiredItem)
            );
            if (missingItems.length > 0) {
                return { canSubmit: false, reason: `필요한 아이템: ${missingItems.join(', ')}` };
            }
        }

        return { canSubmit: true, quest: quest };
    }

    submitItemsToNPC(npcId, playerInventory, gameState) {
        const submission = this.canSubmitToNPC(npcId, playerInventory);
        if (!submission.canSubmit) return { success: false, message: submission.reason };

        const quest = submission.quest;

        // 필요한 아이템들을 인벤토리에서 제거
        if (quest.requiredItem) {
            const itemIndex = playerInventory.findIndex(item => item.name === quest.requiredItem);
            if (itemIndex !== -1) {
                playerInventory.splice(itemIndex, 1);
                gameState.itemsCollected--;
            }

            // collectedItems에서도 제거
            const collectedIndex = gameState.collectedItems.findIndex(item => item.name === quest.requiredItem);
            if (collectedIndex !== -1) {
                gameState.collectedItems.splice(collectedIndex, 1);
            }
        }

        if (quest.requiredItems) {
            quest.requiredItems.forEach(requiredItem => {
                const itemIndex = playerInventory.findIndex(item => item.name === requiredItem);
                if (itemIndex !== -1) {
                    playerInventory.splice(itemIndex, 1);
                    gameState.itemsCollected--;
                }

                // collectedItems에서도 제거
                const collectedIndex = gameState.collectedItems.findIndex(item => item.name === requiredItem);
                if (collectedIndex !== -1) {
                    gameState.collectedItems.splice(collectedIndex, 1);
                }
            });
        }

        // 보상 아이템 추가
        if (quest.rewardItem) {
            const rewardItem = { name: quest.rewardItem, type: 'reward' };
            playerInventory.push(rewardItem);
            gameState.collectedItems.push(rewardItem);
            gameState.itemsCollected++;
        }

        // 퀘스트 완료 처리
        quest.completed = true;
        quest.itemSubmitted = true;
        quest.progress = quest.maxProgress;

        // 다음 퀘스트로 이동
        if (quest.id === this.currentQuest && this.currentQuest < this.quests.length - 1) {
            this.currentQuest++;
        }

        // 사운드 재생
        if (this.audioManager) {
            this.audioManager.playQuestComplete();
            if (this.currentQuest < this.quests.length - 1) {
                setTimeout(() => this.audioManager.playLevelUp(), 800);
            }
        }

        return {
            success: true,
            message: `퀘스트 완료! '${quest.rewardItem}'을(를) 받았습니다.`,
            quest: quest
        };
    }

    // 아이템 수집 시 호출되는 메서드
    onItemCollected(item, gameState) {
        Logger.debug(`📋 퀘스트 시스템: 아이템 수집 확인 - ${item.name}`);
        Logger.debug(`🎒 현재 인벤토리:`, gameState.collectedItems.map(i => i.name));

        // 현재 퀘스트의 필요 아이템 확인
        const currentQuest = this.getCurrentQuest();
        if (!currentQuest) {
            Logger.debug(`❌ 현재 진행 중인 퀘스트가 없습니다`);
            return;
        }

        Logger.debug(`🎯 현재 퀘스트: ${currentQuest.title} (ID: ${currentQuest.id})`);

        // 현재 퀘스트에서 요구하는 아이템인지 확인
        const requiredItems = currentQuest.requiredItems || [currentQuest.requiredItem];
        Logger.debug(`📋 필요 아이템들:`, requiredItems);

        if (requiredItems.includes(item.name)) {
            Logger.debug(`✅ 퀘스트 아이템 매치: ${item.name}`);

            // 모든 필요 아이템이 수집되었는지 확인
            const collectedRequiredItems = requiredItems.filter(reqItem =>
                gameState.collectedItems.some(collectedItem => collectedItem.name === reqItem)
            );

            Logger.debug(`📊 수집 진행도: ${collectedRequiredItems.length}/${requiredItems.length}`);
            Logger.debug(`📝 수집된 필요 아이템들:`, collectedRequiredItems);

            // 퀘스트 진행도 업데이트 (수집된 아이템 개수로)
            const previousProgress = currentQuest.progress;
            currentQuest.progress = collectedRequiredItems.length;

            Logger.debug(`📈 진행도 업데이트: ${previousProgress} → ${currentQuest.progress}`);

            if (currentQuest.progress === currentQuest.maxProgress) {
                Logger.debug(`🎉 ${currentQuest.title} 아이템 수집 완료!`);
            }
        } else {
            Logger.debug(`❌ 현재 퀘스트와 무관한 아이템: ${item.name}`);
        }
    }
};
