/**
 * URL 저장 관련 핸들러
 *
 * 현재 페이지 URL 저장 처리를 담당한다.
 */

import { saveReviewUrl } from '../api.js';
import { validateStorageForAuth } from '../storage.js';
import {
  elements,
  showLoading,
  hideLoading,
  showMessage,
  handleApiError,
  getSelectedCycle
} from '../ui/index.js';
import { formatDate } from '../utils.js';

/**
 * URL 저장 버튼 클릭 핸들러
 */
export async function handleSaveUrl() {
  try {
    showLoading();

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab?.url) {
      showMessage('현재 페이지의 URL을 가져올 수 없습니다.', 'error');
      return;
    }

    const storageData = await validateStorageForAuth();
    const cycle = getSelectedCycle();
    const result = await saveReviewUrl(storageData.identifier, tab.url, cycle);

    elements.scheduleDates.innerHTML = '';
    result.scheduledAts.forEach(date => {
      const li = document.createElement('li');
      li.textContent = formatDate(date);
      elements.scheduleDates.appendChild(li);
    });

    elements.saveResult.classList.remove('hidden');
    showMessage('저장되었습니다!', 'success');
  } catch (error) {
    await handleApiError(error);
  } finally {
    hideLoading();
  }
}
