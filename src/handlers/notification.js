/**
 * 알림 시간 관련 핸들러
 *
 * 알림 시간 조회 및 업데이트 처리를 담당한다.
 */

import { getNotificationTime, updateNotificationTime } from '../api.js';
import { validateStorageForAuth } from '../storage.js';
import {
  elements,
  showLoading,
  hideLoading,
  showMessage,
  handleApiError
} from '../ui/index.js';
import { utcTimeStringToLocal, localTimeStringToUtcArray } from '../utils.js';

/**
 * 알림 시간 설정 버튼 클릭 핸들러 (toggle)
 */
export async function handleShowNotificationTime() {
  const isVisible = !elements.notificationSection.classList.contains('hidden');

  if (isVisible) {
    elements.notificationSection.classList.add('hidden');
    return;
  }

  try {
    showLoading();
    const storageData = await validateStorageForAuth();
    const result = await getNotificationTime(storageData.identifier);

    if (result.notificationTime) {
      elements.notificationTimeInput.value = utcTimeStringToLocal(result.notificationTime);
    } else {
      elements.notificationTimeInput.value = '';
    }

    elements.notificationSection.classList.remove('hidden');
  } catch (error) {
    await handleApiError(error);
  } finally {
    hideLoading();
  }
}

/**
 * 알림 시간 저장 버튼 클릭 핸들러
 */
export async function handleUpdateNotificationTime() {
  const timeValue = elements.notificationTimeInput.value;

  if (!timeValue) {
    showMessage('알림 시간을 입력해주세요.', 'error');
    return;
  }

  try {
    showLoading();
    const storageData = await validateStorageForAuth();
    const [hour, minute] = localTimeStringToUtcArray(timeValue);
    await updateNotificationTime(storageData.identifier, hour, minute);
    showMessage('알림 시간이 저장되었습니다.', 'success');
  } catch (error) {
    await handleApiError(error);
  } finally {
    hideLoading();
  }
}
