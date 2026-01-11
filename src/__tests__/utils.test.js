import { describe, it, expect } from 'vitest';
import { isValidEmail, formatDate } from '../utils.js';

describe('isValidEmail', () => {
  it('유효한 이메일 형식을 통과시킨다', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('user.name@domain.co.kr')).toBe(true);
  });

  it('잘못된 이메일 형식을 거부한다', () => {
    expect(isValidEmail('invalid')).toBe(false);
    expect(isValidEmail('no-at-sign.com')).toBe(false);
    expect(isValidEmail('@no-local.com')).toBe(false);
    expect(isValidEmail('no-domain@')).toBe(false);
  });

  it('빈 문자열을 거부한다', () => {
    expect(isValidEmail('')).toBe(false);
  });
});

describe('formatDate', () => {
  it('ISO 날짜 문자열을 한국어 형식으로 변환한다', () => {
    const result = formatDate('2024-01-15T10:30:00');
    expect(result).toContain('2024');
    expect(result).toContain('1월');
    expect(result).toContain('15');
  });
});
