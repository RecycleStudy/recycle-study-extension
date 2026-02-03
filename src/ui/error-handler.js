/**
 * API 에러 처리
 *
 * API 에러 처리 및 자동 로그아웃 판단을 담당한다.
 */

import { ERROR_CODES } from '../constants.js';
import { getErrorMessage, isLogoutRequiredError } from '../errors.js';
import { showMessage } from './messages.js';
import { forceLogout } from './views.js';

/**
 * 공통 API 에러 핸들러
 * @param {Error} error - 에러 객체
 * @returns {Promise<boolean>} 로그아웃되었으면 true
 */
export async function handleApiError(error) {
  const code = error.code || ERROR_CODES.BAD_REQUEST;
  const message = getErrorMessage(code, error.message);

  if (isLogoutRequiredError(code)) {
    await forceLogout(message);
    return true;
  }

  showMessage(message, 'error');
  return false;
}
