import { describe, it, expect } from 'vitest';
import { ERROR_CODES } from '../constants.js';
import {
  ApiError,
  getErrorCodeFromStatus,
  getErrorMessage,
  isLogoutRequiredError
} from '../errors.js';

describe('ApiError', () => {
  it('code와 message를 저장한다', () => {
    const error = new ApiError(ERROR_CODES.UNAUTHORIZED, '인증 실패');
    expect(error.code).toBe(ERROR_CODES.UNAUTHORIZED);
    expect(error.message).toBe('인증 실패');
    expect(error.name).toBe('ApiError');
  });
});

describe('getErrorCodeFromStatus', () => {
  it('401은 UNAUTHORIZED를 반환한다', () => {
    expect(getErrorCodeFromStatus(401)).toBe(ERROR_CODES.UNAUTHORIZED);
  });

  it('404는 NOT_FOUND를 반환한다', () => {
    expect(getErrorCodeFromStatus(404)).toBe(ERROR_CODES.NOT_FOUND);
  });

  it('400은 BAD_REQUEST를 반환한다', () => {
    expect(getErrorCodeFromStatus(400)).toBe(ERROR_CODES.BAD_REQUEST);
  });

  it('5xx는 SERVER_ERROR를 반환한다', () => {
    expect(getErrorCodeFromStatus(500)).toBe(ERROR_CODES.SERVER_ERROR);
    expect(getErrorCodeFromStatus(503)).toBe(ERROR_CODES.SERVER_ERROR);
  });
});

describe('isLogoutRequiredError', () => {
  it('UNAUTHORIZED는 로그아웃 필요', () => {
    expect(isLogoutRequiredError(ERROR_CODES.UNAUTHORIZED)).toBe(true);
  });

  it('NOT_FOUND는 로그아웃 필요', () => {
    expect(isLogoutRequiredError(ERROR_CODES.NOT_FOUND)).toBe(true);
  });

  it('NETWORK_ERROR는 로그아웃 불필요', () => {
    expect(isLogoutRequiredError(ERROR_CODES.NETWORK_ERROR)).toBe(false);
  });

  it('SERVER_ERROR는 로그아웃 불필요', () => {
    expect(isLogoutRequiredError(ERROR_CODES.SERVER_ERROR)).toBe(false);
  });
});
