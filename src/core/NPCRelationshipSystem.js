import { Logger } from '../utils/Logger.js';

export class NPCRelationshipSystem {
    constructor(gameState) {
        this.gameState = gameState;
        this.moodDialogues = this.initializeMoodDialogues();
        this.relationshipEvents = this.initializeRelationshipEvents();
    }

    initializeMoodDialogues() {
        return {
            happy: [
                "정말 만나서 반가워요! 오늘 기분이 아주 좋아요!",
                "당신과 이야기하는 것이 즐거워요.",
                "어떤 일이든 도와드릴게요!",
                "오늘은 정말 좋은 날이네요!"
            ],
            friendly: [
                "안녕하세요! 무엇을 도와드릴까요?",
                "반갑습니다. 좋은 하루 보내고 계신가요?",
                "언제든 말씀해 주세요.",
                "함께 일할 수 있어서 좋네요."
            ],
            neutral: [
                "안녕하세요.",
                "무슨 일이신가요?",
                "도움이 필요하시면 말씀해 주세요.",
                "어떻게 도와드릴까요?"
            ],
            annoyed: [
                "지금 좀 바쁜데요...",
                "무슨 일인지 빨리 말씀해 주세요.",
                "아, 또 무슨 일이신가요?",
                "시간이 별로 없어요."
            ],
            angry: [
                "지금 기분이 좋지 않아요.",
                "무슨 일인지 간단히 말씀해 주세요.",
                "오늘은 별로 도움을 드릴 수 없을 것 같네요.",
                "죄송하지만 지금은 힘들어요."
            ]
        };
    }

    initializeRelationshipEvents() {
        return {
            questComplete: { affection: 15, trust: 10, respect: 10 },
            questSubmit: { affection: 5, trust: 5, respect: 3 },
            normalTalk: { affection: 1, trust: 1 },
            repeatVisit: { affection: 2 },
            helpfulAction: { affection: 10, trust: 8, respect: 5 },
            rudeBehavior: { affection: -20, trust: -10, respect: -15 },
            questFail: { affection: -5, trust: -8, respect: -3 },
            longTimeNoSee: { affection: -3 }, // 오랫동안 방문하지 않음
            frequency: { affection: 3, trust: 2 } // 자주 방문
        };
    }

    processInteraction(npcId, interactionType, context = {}) {
        const relationship = this.gameState.getNPCRelationship(npcId);
        const event = this.relationshipEvents[interactionType];
        
        if (!event) {
            Logger.debug(`🤝 알 수 없는 상호작용 타입: ${interactionType}`);
            return relationship;
        }

        // 상호작용 타입에 따른 관계 변화 적용
        const changes = { ...event };
        
        // 컨텍스트에 따른 보정
        this.applyContextualModifiers(changes, relationship, context);
        
        // 관계 업데이트
        this.gameState.updateNPCRelationship(npcId, changes);
        
        const updatedRelationship = this.gameState.getNPCRelationship(npcId);
        
        Logger.debug(`🤝 NPC ${npcId} 관계 업데이트:`, {
            interactionType,
            changes,
            newMood: updatedRelationship.mood,
            affection: updatedRelationship.affection,
            trust: updatedRelationship.trust,
            respect: updatedRelationship.respect
        });
        
        return updatedRelationship;
    }

    applyContextualModifiers(changes, relationship, context) {
        // 현재 기분에 따른 보정
        switch (relationship.mood) {
            case 'happy':
                // 기쁠 때는 긍정적 상호작용이 더 효과적
                if (changes.affection > 0) changes.affection *= 1.3;
                break;
            case 'angry':
                // 화났을 때는 긍정적 상호작용이 덜 효과적
                if (changes.affection > 0) changes.affection *= 0.7;
                if (changes.affection < 0) changes.affection *= 1.2;
                break;
        }

        // 상호작용 횟수에 따른 보정
        if (relationship.interactionCount > 10) {
            // 너무 자주 상호작용하면 효과 감소
            Object.keys(changes).forEach(key => {
                if (typeof changes[key] === 'number') {
                    changes[key] *= 0.8;
                }
            });
        }

        // 시간 기반 보정
        const timeSinceLastInteraction = Date.now() - (relationship.lastMoodChange || 0);
        if (timeSinceLastInteraction > 300000) { // 5분 이상
            // 오랜만에 만나면 약간의 보너스
            if (changes.affection > 0) changes.affection += 2;
        }
    }

    getMoodBasedDialogue(npcId, defaultDialogue = null) {
        const relationship = this.gameState.getNPCRelationship(npcId);
        const moodDialogues = this.moodDialogues[relationship.mood] || this.moodDialogues.neutral;
        
        // 기분에 따른 대화를 30% 확률로 사용
        if (Math.random() < 0.3) {
            const randomIndex = Math.floor(Math.random() * moodDialogues.length);
            return moodDialogues[randomIndex];
        }
        
        return defaultDialogue;
    }

    getRelationshipStatus(npcId) {
        const relationship = this.gameState.getNPCRelationship(npcId);
        const avgRelation = (relationship.affection + relationship.trust + relationship.respect) / 3;
        
        let status = 'stranger';
        if (avgRelation >= 70) status = 'best_friend';
        else if (avgRelation >= 40) status = 'good_friend';
        else if (avgRelation >= 10) status = 'friend';
        else if (avgRelation >= -10) status = 'acquaintance';
        else if (avgRelation >= -40) status = 'dislike';
        else status = 'enemy';
        
        return {
            status,
            level: Math.floor(avgRelation / 10) + 10, // 0-20 레벨
            mood: relationship.mood,
            interactionCount: relationship.interactionCount,
            relationship
        };
    }

    getSpecialAbilities(npcId) {
        const status = this.getRelationshipStatus(npcId);
        const abilities = [];
        
        // 관계 수준에 따른 특별 능력
        switch (status.status) {
            case 'best_friend':
                abilities.push('special_discount', 'secret_info', 'exclusive_quests');
                break;
            case 'good_friend':
                abilities.push('discount', 'helpful_hints', 'priority_service');
                break;
            case 'friend':
                abilities.push('small_discount', 'friendly_advice');
                break;
            case 'dislike':
                abilities.push('price_increase', 'reluctant_service');
                break;
            case 'enemy':
                abilities.push('service_refusal', 'hostile_response');
                break;
        }
        
        return abilities;
    }

    // NPC의 현재 상태에 따른 아이콘 반환
    getRelationshipIcon(npcId) {
        const relationship = this.gameState.getNPCRelationship(npcId);
        const status = this.getRelationshipStatus(npcId);
        
        const moodIcons = {
            happy: '😊',
            friendly: '🙂',
            neutral: '😐',
            annoyed: '😤',
            angry: '😠'
        };
        
        const statusIcons = {
            best_friend: '💖',
            good_friend: '💝',
            friend: '💛',
            acquaintance: '💙',
            stranger: '🤍',
            dislike: '💔',
            enemy: '💢'
        };
        
        return {
            mood: moodIcons[relationship.mood] || '😐',
            status: statusIcons[status.status] || '🤍',
            level: status.level
        };
    }

    // 시간 경과에 따른 관계 변화 (게임 루프에서 호출)
    updateTimeBasedChanges() {
        const now = Date.now();
        
        Object.keys(this.gameState.npcRelationships).forEach(npcId => {
            const relationship = this.gameState.getNPCRelationship(npcId);
            const timeSinceLastInteraction = now - (this.gameState.lastInteractionTime[npcId] || now);
            
            // 24시간(실제로는 24초로 축소) 이상 상호작용하지 않으면 관계 약간 감소
            if (timeSinceLastInteraction > 24000) {
                const decay = Math.min(1, timeSinceLastInteraction / 86400000); // 하루 기준
                this.gameState.updateNPCRelationship(npcId, {
                    affection: -decay,
                    trust: -decay * 0.5
                });
            }
        });
    }
}