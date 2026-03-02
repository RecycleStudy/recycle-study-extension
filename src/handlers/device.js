/**
 * 디바이스 관련 핸들러
 *
 * 디바이스 목록 조회, 삭제, 로그아웃 처리를 담당한다.
 */

import { UI_CONSTANTS } from '../constants.js';
import { getDevices, deleteDevice } from '../api.js';
import { getStorageData, clearStorage, validateStorageForAuth } from '../storage.js';
import {
  elements,
  showLoading,
  hideLoading,
  showMessage,
  showView,
  handleApiError
} from '../ui/index.js';
import { formatDate } from '../utils.js';

/**
 * 디바이스 관리 버튼 클릭 핸들러
 */
export async function handleShowDevices() {
  const isVisible = !elements.devicesSection.classList.contains('hidden');

  if (isVisible) {
    elements.devicesSection.classList.add('hidden');
    return;
  }

  try {
    showLoading();
    const storageData = await validateStorageForAuth();
    const result = await getDevices(storageData.email, storageData.identifier);

    elements.devicesList.innerHTML = '';

    result.devices.forEach(device => {
      const li = document.createElement('li');
      const isCurrentDevice = device.identifier === storageData.identifier;

      const deviceInfo = document.createElement('div');
      deviceInfo.className = 'device-info';

      const deviceIdDiv = document.createElement('div');
      deviceIdDiv.className = 'device-id';
      deviceIdDiv.textContent = device.identifier.substring(0, UI_CONSTANTS.DEVICE_ID_DISPLAY_LENGTH) + '...';
      deviceInfo.appendChild(deviceIdDiv);

      const deviceDateDiv = document.createElement('div');
      deviceDateDiv.className = 'device-date';
      deviceDateDiv.textContent = formatDate(device.createdAt);
      deviceInfo.appendChild(deviceDateDiv);

      if (isCurrentDevice) {
        const currentDeviceDiv = document.createElement('div');
        currentDeviceDiv.className = 'current-device';
        currentDeviceDiv.textContent = '현재 디바이스';
        deviceInfo.appendChild(currentDeviceDiv);
      }

      li.appendChild(deviceInfo);

      if (!isCurrentDevice) {
        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-danger';
        deleteButton.setAttribute('data-id', device.identifier);
        deleteButton.textContent = '삭제';
        li.appendChild(deleteButton);
      }

      elements.devicesList.appendChild(li);
    });

    elements.devicesSection.classList.remove('hidden');
  } catch (error) {
    await handleApiError(error);
  } finally {
    hideLoading();
  }
}

/**
 * 디바이스 삭제 클릭 핸들러
 * @param {string} targetIdentifier - 삭제할 디바이스 식별자
 */
export async function handleDeleteDevice(targetIdentifier) {
  if (!confirm('이 디바이스를 삭제하시겠습니까?')) {
    return;
  }

  try {
    showLoading();
    const storageData = await validateStorageForAuth();

    await deleteDevice(
      storageData.email,
      storageData.identifier,
      targetIdentifier
    );

    showMessage('디바이스가 삭제되었습니다.', 'success');
    elements.devicesSection.classList.add('hidden');
    await handleShowDevices();
  } catch (error) {
    await handleApiError(error);
  } finally {
    hideLoading();
  }
}

/**
 * 로그아웃 버튼 클릭 핸들러
 */
export async function handleLogout() {
  if (!confirm('로그아웃 하시겠습니까?')) {
    return;
  }

  try {
    showLoading();
    const storageData = await getStorageData();

    // 인증된 상태라면 서버에 디바이스 삭제 요청
    if (storageData.email && storageData.identifier) {
      await deleteDevice(
        storageData.email,
        storageData.identifier,
        storageData.identifier // 자기 자신을 삭제
      );
    }
  } catch (error) {
    console.warn('서버 디바이스 삭제 실패 (로컬 로그아웃은 진행):', error);
  } finally {
    hideLoading();
  }

  await clearStorage();
  elements.saveResult.classList.add('hidden');
  elements.devicesSection.classList.add('hidden');
  elements.cycleSection.classList.add('hidden');
  elements.notificationSection.classList.add('hidden');
  showView('login');
  showMessage('로그아웃 되었습니다.', 'info');
}
