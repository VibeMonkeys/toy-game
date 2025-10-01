/**
 * 🎨 플레이스홀더 스프라이트 생성 스크립트
 *
 * 실제 스프라이트를 다운로드하기 전에 테스트용 플레이스홀더를 생성합니다.
 * Node.js Canvas 라이브러리 없이 HTML5 Canvas API를 사용합니다.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 색상 정의
const COLORS = {
    player: '#4A90E2',
    goblin: '#8B4513',
    orc: '#228B22',
    skeleton: '#D3D3D3',
    troll: '#556B2F',
    wraith: '#9370DB',
    soul_keeper: '#1A1A1A',
    blacksmith: '#8B4513',
    skill_master: '#4B0082',
    sage: '#F0E68C',
    merchant: '#FFD700',
    goblin_chieftain: '#A0522D',
    orc_chieftain: '#006400',
    troll_king: '#2F4F2F',
    skeleton_lord: '#A9A9A9',
    death_knight: '#000000',
    chaos_lord: '#8B0000'
};

/**
 * SVG로 플레이스홀더 생성 (브라우저 없이 가능)
 */
function generatePlaceholderSVG(name, color, width, height) {
    const frameWidth = width;
    const frameHeight = height;
    const totalWidth = frameWidth * 4; // 4프레임
    const totalHeight = frameHeight * 4; // 4방향

    let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${totalWidth}" height="${totalHeight}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .label { font-family: Arial; font-size: 8px; fill: white; text-anchor: middle; }
    </style>
  </defs>`;

    const directions = ['UP', 'LEFT', 'DOWN', 'RIGHT'];

    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            const x = col * frameWidth;
            const y = row * frameHeight;

            // 배경
            svg += `
  <rect x="${x}" y="${y}" width="${frameWidth}" height="${frameHeight}" fill="${color}" stroke="#000" stroke-width="1"/>`;

            // 눈 (간단한 캐릭터 표현)
            const eyeY = y + frameHeight * 0.4;
            const eyeOffset = (col % 2 === 0) ? 0 : 2; // 애니메이션 느낌
            svg += `
  <circle cx="${x + frameWidth * 0.35}" cy="${eyeY + eyeOffset}" r="2" fill="#fff"/>
  <circle cx="${x + frameWidth * 0.65}" cy="${eyeY + eyeOffset}" r="2" fill="#fff"/>`;

            // 라벨 (프레임 번호)
            if (col === 0) {
                svg += `
  <text x="${x + frameWidth / 2}" y="${y + frameHeight * 0.8}" class="label">${directions[row]}${col + 1}</text>`;
            }
        }
    }

    svg += '\n</svg>';
    return svg;
}

/**
 * 디렉토리 생성
 */
function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

/**
 * 메인 실행
 */
function main() {
    console.log('🎨 플레이스홀더 스프라이트 생성 중...\n');

    const baseDir = path.join(__dirname, '../public/assets/sprites');

    // 디렉토리 생성
    ensureDir(path.join(baseDir, 'characters'));
    ensureDir(path.join(baseDir, 'enemies'));
    ensureDir(path.join(baseDir, 'npcs'));

    const sprites = [
        // 플레이어
        { name: 'player', folder: 'characters', size: 32 },

        // 적들
        { name: 'goblin', folder: 'enemies', size: 32 },
        { name: 'orc', folder: 'enemies', size: 32 },
        { name: 'skeleton', folder: 'enemies', size: 32 },
        { name: 'troll', folder: 'enemies', size: 32 },
        { name: 'wraith', folder: 'enemies', size: 32 },

        // NPC
        { name: 'soul_keeper', folder: 'npcs', size: 32 },
        { name: 'blacksmith', folder: 'npcs', size: 32 },
        { name: 'skill_master', folder: 'npcs', size: 32 },
        { name: 'sage', folder: 'npcs', size: 32 },
        { name: 'merchant', folder: 'npcs', size: 32 },

        // 보스
        { name: 'goblin_chieftain', folder: 'enemies', size: 48 },
        { name: 'orc_chieftain', folder: 'enemies', size: 48 },
        { name: 'troll_king', folder: 'enemies', size: 64 },
        { name: 'skeleton_lord', folder: 'enemies', size: 64 },
        { name: 'death_knight', folder: 'enemies', size: 64 },
        { name: 'chaos_lord', folder: 'enemies', size: 128 }
    ];

    let created = 0;

    sprites.forEach(({ name, folder, size }) => {
        const filePath = path.join(baseDir, folder, `${name}.svg`);
        const color = COLORS[name] || '#888888';
        const svg = generatePlaceholderSVG(name, color, size, size);

        fs.writeFileSync(filePath, svg);
        console.log(`✅ ${filePath}`);
        created++;
    });

    console.log(`\n🎉 ${created}개 플레이스홀더 생성 완료!`);
    console.log('\n📝 참고: SVG 파일을 PNG로 변환하려면:');
    console.log('   1. 웹 브라우저에서 SVG 파일 열기');
    console.log('   2. 개발자 도구 콘솔에서 실행:');
    console.log('      - 이미지 우클릭 → "다른 이름으로 저장" → PNG 선택');
    console.log('   또는 온라인 변환 도구 사용: https://convertio.co/kr/svg-png/');
}

main();
