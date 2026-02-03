/**
 * 메시지 및 로딩 표시
 *
 * 사용자 피드백 메시지와 로딩 상태 표시를 담당한다.
 */

import { elements } from './elements.js';
import { UI_CONSTANTS } from '../constants.js';

/**
 * 로딩 표시
 */
export function showLoading() {
  elements.loading.classList.remove('hidden');
}

/**
 * 로딩 숨김
 */
export function hideLoading() {
  elements.loading.classList.add('hidden');
}

/**
 * 메시지 표시
 * @param {string} message - 표시할 메시지
 * @param {string} type - 메시지 타입 ('info' | 'success' | 'error')
 */
export function showMessage(message, type = 'info') {
  elements.messageArea.textContent = message;
  elements.messageArea.className = `message-area ${type}`;
  elements.messageArea.classList.remove('hidden');

  setTimeout(() => {
    elements.messageArea.classList.add('hidden');
  }, UI_CONSTANTS.MESSAGE_DISPLAY_DURATION_MS);
}
