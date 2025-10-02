/**
 * 🔢 수학 유틸리티 함수
 *
 * 게임에서 자주 사용되는 수학 계산 함수들
 */

import { Position, Vector2D } from '../types';

/**
 * 두 점 사이의 유클리드 거리 계산
 */
export function getDistance(x1: number, y1: number, x2: number, y2: number): number {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * 두 Position 객체 사이의 거리 계산
 */
export function getDistanceBetween(pos1: Position, pos2: Position): number {
    return getDistance(pos1.x, pos1.y, pos2.x, pos2.y);
}

/**
 * 거리의 제곱 계산 (Math.sqrt 생략으로 성능 향상)
 * 거리 비교만 필요한 경우 사용
 */
export function getDistanceSquared(x1: number, y1: number, x2: number, y2: number): number {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return dx * dx + dy * dy;
}

/**
 * 맨해튼 거리 계산 (택시 거리)
 */
export function getManhattanDistance(x1: number, y1: number, x2: number, y2: number): number {
    return Math.abs(x2 - x1) + Math.abs(y2 - y1);
}

/**
 * 각도를 라디안으로 변환
 */
export function degToRad(degrees: number): number {
    return degrees * (Math.PI / 180);
}

/**
 * 라디안을 각도로 변환
 */
export function radToDeg(radians: number): number {
    return radians * (180 / Math.PI);
}

/**
 * 값을 min과 max 사이로 제한 (clamp)
 */
export function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

/**
 * 선형 보간 (linear interpolation)
 */
export function lerp(start: number, end: number, t: number): number {
    return start + (end - start) * t;
}

/**
 * 두 점 사이의 각도 계산 (라디안)
 */
export function getAngleBetween(x1: number, y1: number, x2: number, y2: number): number {
    return Math.atan2(y2 - y1, x2 - x1);
}

/**
 * 정규화된 방향 벡터 계산
 */
export function getNormalizedDirection(x1: number, y1: number, x2: number, y2: number): Vector2D {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance === 0) {
        return { x: 0, y: 0 };
    }

    return {
        x: dx / distance,
        y: dy / distance
    };
}

/**
 * 랜덤 정수 생성 (min 이상 max 이하)
 */
export function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 랜덤 실수 생성 (min 이상 max 이하)
 */
export function randomFloat(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

/**
 * 배열에서 랜덤 요소 선택
 */
export function randomChoice<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * 확률 체크 (0.0 ~ 1.0)
 */
export function chance(probability: number): boolean {
    return Math.random() < probability;
}
