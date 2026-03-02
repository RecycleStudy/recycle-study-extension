/**
 * 뷰 전환 관리
 *
 * 화면 전환 및 강제 로그아웃 처리를 담당한다.
 */

import { elements } from './elements.js';
import { UI_CONSTANTS } from '../constants.js';
import { clearStorage } from '../storage.js';

/**
 * 뷰 전환
 * @param {string} viewName - 표시할 뷰 ('login' | 'pending' | 'main')
 */
export function showView(viewName) {
  elements.loginView.classList.add('hidden');
  elements.pendingView.classList.add('hidden');
  elements.mainView.classList.add('hidden');

  switch (viewName) {
    case 'login':
      elements.loginView.classList.remove('hidden');
      break;
    case 'pending':
      elements.pendingView.classList.remove('hidden');
      break;
    case 'main':
      elements.mainView.classList.remove('hidden');
      break;
  }
}

/**
 * 강제 로그아웃 처리
 * @param {string} message - 표시할 메시지
 */
export async function forceLogout(message) {
  await clearStorage();
  elements.saveResult.classList.add('hidden');
  elements.devicesSection.classList.add('hidden');
  elements.notificationSection.classList.add('hidden');
  elements.emailInput.value = '';
  showView('login');

  // 메시지 표시 (순환 참조 방지를 위해 직접 처리)
  elements.messageArea.textContent = message;
  elements.messageArea.className = 'message-area error';
  elements.messageArea.classList.remove('hidden');

  setTimeout(() => {
    elements.messageArea.classList.add('hidden');
  }, UI_CONSTANTS.MESSAGE_DISPLAY_DURATION_MS);
}
