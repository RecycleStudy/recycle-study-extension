/**
 * Duration 유틸리티
 *
 * ISO 8601 Duration 형식의 파싱, 변환, 검증을 담당한다.
 */

import { DURATION_REGEX, DURATION_CONSTANTS } from './constants.js';

/**
 * ISO 8601 Duration을 파싱하여 일/시간/분 값 반환
 * @param {string} duration - ISO 8601 Duration (예: 'P1D', 'PT1H', 'PT10M')
 * @returns {{ days: number, hours: number, minutes: number }}
 */
export function parseDuration(duration) {
  const match = duration.match(DURATION_REGEX);
  if (!match) {
    return { days: 0, hours: 0, minutes: 0 };
  }

  return {
    days: parseInt(match[1]) || 0,
    hours: parseInt(match[2]) || 0,
    minutes: parseInt(match[3]) || 0
  };
}

/**
 * ISO 8601 Duration을 읽기 쉬운 텍스트로 변환
 * @param {string} duration - ISO 8601 Duration
 * @returns {string} 예: '1일', '2시간', '10분', '1일 2시간'
 */
export function formatDurationToText(duration) {
  const { days, hours, minutes } = parseDuration(duration);

  const parts = [];
  if (days > 0) parts.push(`${days}일`);
  if (hours > 0) parts.push(`${hours}시간`);
  if (minutes > 0) parts.push(`${minutes}분`);

  return parts.join(' ') || duration;
}

/**
 * Duration 배열을 표시용 문자열로 변환
 * @param {string[]} durations - ISO 8601 Duration 배열
 * @returns {string} 예: '10분 → 1시간 → 1일'
 */
export function formatDurationsForDisplay(durations) {
  if (!durations || durations.length === 0) return '';
  return durations.map(d => formatDurationToText(d)).join(' → ');
}

/**
 * ISO 8601 Duration을 값과 단위로 변환 (폼 입력용)
 * @param {string} duration - ISO 8601 Duration
 * @returns {{ value: number, unit: string }} unit: 'D' | 'H' | 'M'
 */
export function parseDurationToValueUnit(duration) {
  const { days, hours, minutes } = parseDuration(duration);

  if (days > 0) return { value: days, unit: 'D' };
  if (hours > 0) return { value: hours, unit: 'H' };
  return {
    value: minutes || DURATION_CONSTANTS.DEFAULT_VALUE,
    unit: DURATION_CONSTANTS.DEFAULT_UNIT
  };
}

/**
 * 값과 단위를 ISO 8601 Duration으로 변환
 * @param {number} value - 숫자 값
 * @param {string} unit - 단위 ('D' | 'H' | 'M')
 * @returns {string} ISO 8601 Duration
 */
export function formatValueUnitToDuration(value, unit) {
  if (unit === 'D') return `P${value}D`;
  if (unit === 'H') return `PT${value}H`;
  return `PT${value}M`;
}

/**
 * Duration 배열 검증 (10분 단위)
 * @param {string[]} durations - ISO 8601 Duration 배열
 * @returns {{ valid: boolean, message: string }}
 */
export function validateDurations(durations) {
  if (durations.length === 0) {
    return { valid: false, message: '최소 1개의 복습 간격이 필요합니다.' };
  }

  for (const d of durations) {
    const match = d.match(/^PT(\d+)M$/);
    if (match) {
      const minutes = parseInt(match[1]);
      if (minutes % DURATION_CONSTANTS.VALIDATION_STEP_MINUTES !== 0) {
        return { valid: false, message: '분 단위는 10분 단위로 입력해주세요.' };
      }
    }
  }

  return { valid: true, message: '' };
}
