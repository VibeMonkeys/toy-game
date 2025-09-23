// 퀘스트-NPC 매핑 분석 도구
import { QUEST_DATA } from './src/data/QuestData.js';

// 주요 퀘스트 정보 추출
const mainQuests = QUEST_DATA.filter(quest => quest.type === 'main').map(quest => ({
    id: quest.id,
    title: quest.title,
    questGiver: quest.questGiver,
    floor: quest.floor,
    requiredItem: quest.requiredItem || quest.requiredItems,
    rewardItem: quest.rewardItem,
    prerequisites: quest.prerequisites || []
}));

console.log('=== 메인 퀘스트 분석 ===');
mainQuests.forEach(quest => {
    console.log(`퀘스트 ${quest.id}: ${quest.title}`);
    console.log(`  - questGiver: ${quest.questGiver}`);
    console.log(`  - 층: ${quest.floor}층`);
    console.log(`  - 필요 아이템: ${JSON.stringify(quest.requiredItem)}`);
    console.log(`  - 보상 아이템: ${quest.rewardItem}`);
    console.log(`  - 전제조건: ${JSON.stringify(quest.prerequisites)}`);
    console.log('');
});