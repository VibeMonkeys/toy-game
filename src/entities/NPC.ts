/**
 * 👤 NPC 엔티티
 *
 * 대화, 상점, 퀘스트 등을 제공하는 NPC를 관리합니다.
 */

import { Position } from '../types';
import { Renderer } from '../systems/Renderer';
import { AnimationController } from '../systems/AnimationController';

export type NPCType = 'soul_keeper' | 'blacksmith' | 'skill_master' | 'sage' | 'merchant';

export interface NPCData {
    name: string;
    type: NPCType;
    spriteKey: string;
    dialogues: {
        greeting: string;
        default: string;
        farewell: string;
        questAvailable?: string; // 퀘스트 있을 때
        questInProgress?: string; // 퀘스트 진행 중
        questComplete?: string; // 퀘스트 완료 가능
    };
    services?: ('shop' | 'upgrade' | 'quest')[];
    questIds?: string[]; // 제공하는 퀘스트 ID 목록
}

export class NPC {
    x: number;
    y: number;
    type: NPCType;
    data: NPCData;

    // 크기
    private width: number = 32;
    private height: number = 32;

    // 상호작용
    private interactionRange: number = 50;
    private isInteracting: boolean = false;

    // 애니메이션
    private animationController: AnimationController;

    constructor(x: number, y: number, type: NPCType) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.data = this.getNPCData(type);
        this.animationController = new AnimationController(300, 4); // NPC는 천천히
        this.animationController.stop(); // 기본적으로 정지 상태
    }

    /**
     * NPC 타입별 데이터
     */
    private getNPCData(type: NPCType): NPCData {
        const npcDataMap: Record<NPCType, NPCData> = {
            soul_keeper: {
                name: '영혼 수호자',
                type: 'soul_keeper',
                spriteKey: 'soul_keeper',
                dialogues: {
                    greeting: '죽음조차 끝이 아니군요. 당신은 특별합니다.',
                    default: '더 강해지고 싶으십니까? 소울 포인트로 업그레이드할 수 있습니다.',
                    farewell: '행운을 빕니다, 용사여.',
                    questAvailable: '당신에게 맡길 중요한 임무가 있습니다.',
                    questInProgress: '임무는 잘 진행되고 있습니까?',
                    questComplete: '임무를 완수했군요. 훌륭합니다!'
                },
                services: ['upgrade', 'quest'],
                questIds: ['floor4_troll', 'floor4_treasure']
            },
            blacksmith: {
                name: '무기 대장장이',
                type: 'blacksmith',
                spriteKey: 'blacksmith',
                dialogues: {
                    greeting: '좋은 무기가 좋은 영웅을 만들지요.',
                    default: '새로운 무기가 필요하신가요?',
                    farewell: '좋은 전투 되시길!',
                    questAvailable: '도와줄 일이 있는데...',
                    questInProgress: '일은 잘 되어가나?',
                    questComplete: '고맙네! 약속대로 보상을 주지.'
                },
                services: ['shop', 'upgrade', 'quest'],
                questIds: ['floor2_combat', 'floor2_equipment']
            },
            skill_master: {
                name: '기술 스승',
                type: 'skill_master',
                spriteKey: 'skill_master',
                dialogues: {
                    greeting: '힘만으로는 부족합니다. 기술을 배우세요.',
                    default: '새로운 기술을 배울 준비가 되셨나요?',
                    farewell: '당신의 잠재력을 믿습니다.',
                    questAvailable: '수행해야 할 시험이 있소.',
                    questInProgress: '시험은 어떻게 진행되고 있소?',
                    questComplete: '훌륭하오! 당신은 자격이 있소.'
                },
                services: ['upgrade', 'quest'],
                questIds: ['floor3_undead', 'floor3_magic']
            },
            sage: {
                name: '현자',
                type: 'sage',
                spriteKey: 'sage',
                dialogues: {
                    greeting: '이곳은 영혼이 시험받는 공간입니다...',
                    default: '진정한 용기를 증명하십시오.',
                    farewell: '지혜가 함께하길.',
                    questAvailable: '당신에게 맡길 시련이 있습니다.',
                    questInProgress: '시련은 계속되고 있군요.',
                    questComplete: '놀랍군요! 당신은 진정한 영웅입니다!'
                },
                services: ['quest'],
                questIds: ['floor1_tutorial', 'floor5_final']
            },
            merchant: {
                name: '떠돌이 상인',
                type: 'merchant',
                spriteKey: 'merchant',
                dialogues: {
                    greeting: '오! 손님이시군요. 좋은 물건 많습니다!',
                    default: '뭐 필요한 거 있으세요?',
                    farewell: '또 오세요!',
                    questAvailable: '재미있는 제안이 있는데요...',
                    questInProgress: '일은 잘 되고 있나요?',
                    questComplete: '오! 훌륭해요! 보상 여기 있습니다!'
                },
                services: ['shop', 'quest'],
                questIds: ['floor1_exploration', 'daily_collector']
            }
        };

        return npcDataMap[type];
    }

    /**
     * 업데이트
     */
    update(deltaTime: number): void {
        this.animationController.update(deltaTime);
    }

    /**
     * 플레이어가 상호작용 범위 안에 있는지 확인
     */
    isPlayerInRange(playerX: number, playerY: number): boolean {
        const dx = playerX - this.x;
        const dy = playerY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance <= this.interactionRange;
    }

    /**
     * 상호작용 시작
     */
    startInteraction(): void {
        this.isInteracting = true;
    }

    /**
     * 상호작용 종료
     */
    endInteraction(): void {
        this.isInteracting = false;
    }

    /**
     * 상호작용 중인지 확인
     */
    getIsInteracting(): boolean {
        return this.isInteracting;
    }

    /**
     * 애니메이션 컨트롤러 가져오기
     */
    getAnimationController(): AnimationController {
        return this.animationController;
    }

    /**
     * 위치 가져오기
     */
    getPosition(): Position {
        return { x: this.x, y: this.y };
    }

    /**
     * 히트박스
     */
    getHitbox(): { x: number; y: number; width: number; height: number } {
        return {
            x: this.x - this.width / 2,
            y: this.y - this.height / 2,
            width: this.width,
            height: this.height
        };
    }

    /**
     * 렌더링 (Game.ts에서 SpriteManager로 직접 렌더링하므로 빈 메서드)
     */
    render(renderer: Renderer): void {
        // SpriteManager가 처리
    }
}
