/**
 * 📜 퀘스트 데이터베이스
 *
 * 각 층별 퀘스트 정의
 */

import { Quest, QuestType } from '../types';

export const QUEST_DATABASE: Record<string, Quest> = {
    // ============================================
    // 1층 - 튜토리얼 퀘스트
    // ============================================
    floor1_tutorial: {
        id: 'floor1_tutorial',
        type: QuestType.MAIN,
        act: 1,
        title: '던전 입문',
        description: '던전의 기초를 배우고 첫 번째 적을 처치하세요.',
        objectives: [
            {
                id: 'kill_goblin',
                text: '고블린 3마리 처치',
                target: 3,
                progress: 0,
                completed: false
            },
            {
                id: 'collect_health_potion',
                text: '체력 물약 수집',
                target: 1,
                progress: 0,
                completed: false
            }
        ],
        rewards: {
            experience: 50,
            soulPoints: 10,
            items: ['leather_helmet']
        },
        storyText: '현자: "던전에 오신 것을 환영합니다. 먼저 기본을 익혀야 합니다."',
        completionText: '현자: "훌륭합니다! 이제 더 깊은 곳으로 갈 준비가 되었군요."'
    },

    floor1_exploration: {
        id: 'floor1_exploration',
        type: QuestType.SIDE,
        act: 1,
        title: '던전 탐험가',
        description: '1층의 모든 방을 탐험하세요.',
        objectives: [
            {
                id: 'reach_treasure_room',
                text: '보물 방 발견',
                target: 1,
                progress: 0,
                completed: false
            },
            {
                id: 'talk_merchant',
                text: '상인과 대화',
                target: 1,
                progress: 0,
                completed: false
            }
        ],
        rewards: {
            experience: 30,
            soulPoints: 5,
            items: ['iron_ore']
        }
    },

    // ============================================
    // 2층 - 전투 퀘스트
    // ============================================
    floor2_combat: {
        id: 'floor2_combat',
        type: QuestType.MAIN,
        act: 2,
        title: '오크 소탕',
        description: '강력한 오크들을 처치하세요.',
        objectives: [
            {
                id: 'kill_orc',
                text: '오크 5마리 처치',
                target: 5,
                progress: 0,
                completed: false
            }
        ],
        rewards: {
            experience: 100,
            soulPoints: 20,
            items: ['iron_armor']
        },
        storyText: '대장장이: "오크들이 너무 많아졌어. 좀 처치해주게."',
        completionText: '대장장이: "잘했네! 이 갑옷을 받게."'
    },

    floor2_equipment: {
        id: 'floor2_equipment',
        type: QuestType.SIDE,
        act: 2,
        title: '대장장이의 부탁',
        description: '철광석을 모아 대장장이에게 가져다주세요.',
        objectives: [
            {
                id: 'collect_iron_ore',
                text: '철광석 5개 수집',
                target: 5,
                progress: 0,
                completed: false
            },
            {
                id: 'talk_blacksmith',
                text: '대장장이에게 전달',
                target: 1,
                progress: 0,
                completed: false
            }
        ],
        rewards: {
            experience: 50,
            soulPoints: 10,
            items: ['knight_helmet']
        }
    },

    // ============================================
    // 3층 - 스켈레톤 던전
    // ============================================
    floor3_undead: {
        id: 'floor3_undead',
        type: QuestType.MAIN,
        act: 3,
        title: '언데드 정화',
        description: '스켈레톤들을 정화하세요.',
        objectives: [
            {
                id: 'kill_skeleton',
                text: '스켈레톤 8마리 처치',
                target: 8,
                progress: 0,
                completed: false
            },
            {
                id: 'collect_magic_crystal',
                text: '마법 수정 획득',
                target: 2,
                progress: 0,
                completed: false
            }
        ],
        rewards: {
            experience: 150,
            soulPoints: 30,
            items: ['critical_amulet']
        },
        storyText: '기술 스승: "언데드의 기운이 강하군. 마법 수정을 모아오게."',
        completionText: '기술 스승: "훌륭해. 이 부적으로 더 강해질 수 있을 거야."'
    },

    floor3_magic: {
        id: 'floor3_magic',
        type: QuestType.SIDE,
        act: 3,
        title: '마법의 힘',
        description: '마법 수정을 사용하여 적을 처치하세요.',
        objectives: [
            {
                id: 'kill_with_staff',
                text: '지팡이로 적 처치',
                target: 5,
                progress: 0,
                completed: false
            }
        ],
        rewards: {
            experience: 80,
            soulPoints: 15,
            items: ['mana_potion', 'mana_potion']
        }
    },

    // ============================================
    // 4층 - 트롤 요새
    // ============================================
    floor4_troll: {
        id: 'floor4_troll',
        type: QuestType.MAIN,
        act: 4,
        title: '트롤 왕 토벌',
        description: '강력한 트롤들을 처치하고 왕에게 도전하세요.',
        objectives: [
            {
                id: 'kill_troll',
                text: '트롤 3마리 처치',
                target: 3,
                progress: 0,
                completed: false
            },
            {
                id: 'kill_troll_king',
                text: '트롤 왕 처치',
                target: 1,
                progress: 0,
                completed: false
            }
        ],
        rewards: {
            experience: 250,
            soulPoints: 50,
            items: ['dragon_armor']
        },
        storyText: '영혼 수호자: "트롤 왕은 강력하다. 준비를 철저히 하게."',
        completionText: '영혼 수호자: "대단하군! 이제 진정한 시련이 기다리고 있네."'
    },

    floor4_treasure: {
        id: 'floor4_treasure',
        type: QuestType.SIDE,
        act: 4,
        title: '숨겨진 보물',
        description: '비밀 방을 찾아 보물을 획득하세요.',
        objectives: [
            {
                id: 'reach_secret_room',
                text: '비밀 방 발견',
                target: 1,
                progress: 0,
                completed: false
            }
        ],
        rewards: {
            experience: 100,
            soulPoints: 20,
            items: ['vampire_amulet', 'dragon_scale']
        }
    },

    // ============================================
    // 5층 - 최종 보스 (레이스)
    // ============================================
    floor5_final: {
        id: 'floor5_final',
        type: QuestType.MAIN,
        act: 5,
        title: '어둠의 군주',
        description: '던전의 지배자 레이스를 처치하세요.',
        objectives: [
            {
                id: 'kill_wraith',
                text: '레이스 처치',
                target: 5,
                progress: 0,
                completed: false
            },
            {
                id: 'reach_boss_room',
                text: '보스 방 도달',
                target: 1,
                progress: 0,
                completed: false
            }
        ],
        rewards: {
            experience: 500,
            soulPoints: 100,
            items: ['legendary_sword']
        },
        storyText: '현자: "마침내 최종 관문에 도달했군. 행운을 빈다."',
        completionText: '현자: "놀랍군! 당신이야말로 진정한 영웅이오!"'
    },

    // ============================================
    // 반복 퀘스트 (모든 층)
    // ============================================
    daily_hunter: {
        id: 'daily_hunter',
        type: QuestType.SIDE,
        act: 0, // 모든 층
        title: '일일 사냥',
        description: '아무 적이나 10마리 처치하세요.',
        objectives: [
            {
                id: 'kill_any',
                text: '적 처치',
                target: 10,
                progress: 0,
                completed: false
            }
        ],
        rewards: {
            experience: 50,
            soulPoints: 10
        }
    },

    daily_collector: {
        id: 'daily_collector',
        type: QuestType.SIDE,
        act: 0,
        title: '일일 수집',
        description: '아무 아이템이나 5개 수집하세요.',
        objectives: [
            {
                id: 'collect_any',
                text: '아이템 수집',
                target: 5,
                progress: 0,
                completed: false
            }
        ],
        rewards: {
            experience: 30,
            items: ['health_potion_medium']
        }
    }
};

/**
 * 층별 퀘스트 ID 매핑
 */
export const FLOOR_QUESTS: Record<number, string[]> = {
    1: ['floor1_tutorial', 'floor1_exploration', 'daily_hunter', 'daily_collector'],
    2: ['floor2_combat', 'floor2_equipment', 'daily_hunter', 'daily_collector'],
    3: ['floor3_undead', 'floor3_magic', 'daily_hunter', 'daily_collector'],
    4: ['floor4_troll', 'floor4_treasure', 'daily_hunter', 'daily_collector'],
    5: ['floor5_final', 'daily_hunter', 'daily_collector']
};

/**
 * NPC별 퀘스트 매핑
 */
export const NPC_QUESTS: Record<string, string[]> = {
    sage: ['floor1_tutorial', 'floor5_final'], // 현자
    merchant: ['floor1_exploration', 'daily_collector'], // 상인
    blacksmith: ['floor2_combat', 'floor2_equipment'], // 대장장이
    skill_master: ['floor3_undead', 'floor3_magic'], // 기술 스승
    soul_keeper: ['floor4_troll', 'floor4_treasure'] // 영혼 수호자
};

/**
 * 퀘스트 ID로 퀘스트 가져오기
 */
export function getQuestById(questId: string): Quest | undefined {
    return QUEST_DATABASE[questId];
}

/**
 * 층에 맞는 퀘스트 목록 가져오기
 */
export function getQuestsForFloor(floor: number): Quest[] {
    const questIds = FLOOR_QUESTS[floor] || [];
    return questIds.map(id => QUEST_DATABASE[id]).filter(q => q !== undefined);
}

/**
 * NPC가 제공하는 퀘스트 목록 가져오기
 */
export function getQuestsForNPC(npcType: string): Quest[] {
    const questIds = NPC_QUESTS[npcType] || [];
    return questIds.map(id => QUEST_DATABASE[id]).filter(q => q !== undefined);
}
