/**
 * 인증 관련 핸들러
 *
 * 디바이스 등록, 인증 확인, 리셋 처리를 담당한다.
 */

import { STORAGE_KEYS } from '../config.js';
import { ERROR_CODES } from '../constants.js';
import { registerDevice, getDevices } from '../api.js';
import { setStorageData, clearStorage, validateStorageForAuth } from '../storage.js';
import { handleLoadCycleOptions } from './cycle.js';
import {
  elements,
  showLoading,
  hideLoading,
  showMessage,
  showView,
  handleApiError
} from '../ui/index.js';
import { isValidEmail } from '../utils.js';

/**
 * 디바이스 등록 버튼 클릭 핸들러
 */
export async function handleRegister() {
  const email = elements.emailInput.value.trim();

  if (!email) {
    showMessage('이메일을 입력해주세요.', 'error');
    return;
  }

  if (!isValidEmail(email)) {
    showMessage('유효한 이메일 형식이 아닙니다.', 'error');
    return;
  }

  try {
    showLoading();
    const result = await registerDevice(email);

    await setStorageData({
      [STORAGE_KEYS.EMAIL]: result.email,
      [STORAGE_KEYS.IDENTIFIER]: result.identifier,
      [STORAGE_KEYS.IS_AUTHENTICATED]: false
    });

    elements.emailDisplay.textContent = result.email;
    showView('pending');
    showMessage('이메일로 인증 링크가 전송되었습니다.', 'success');
  } catch (error) {
    showMessage(error.message, 'error');
  } finally {
    hideLoading();
  }
}

/**
 * 인증 확인 버튼 클릭 핸들러
 */
export async function handleCheckAuth() {
  try {
    showLoading();
    const storageData = await validateStorageForAuth();
    const result = await getDevices(storageData.email, storageData.identifier);

    await setStorageData({
      [STORAGE_KEYS.IS_AUTHENTICATED]: true
    });

    elements.userEmail.textContent = result.email;
    showView('main');
    await handleLoadCycleOptions();
    showMessage('인증이 완료되었습니다!', 'success');
  } catch (error) {
    if (error.code === ERROR_CODES.UNAUTHORIZED) {
      showMessage('아직 인증이 완료되지 않았습니다.', 'info');
    } else {
      await handleApiError(error);
    }
  } finally {
    hideLoading();
  }
}

/**
 * 다른 이메일로 등록 버튼 클릭 핸들러
 */
export async function handleReset() {
  await clearStorage();
  elements.emailInput.value = '';
  showView('login');
}
