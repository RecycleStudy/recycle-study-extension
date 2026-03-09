/**
 * 팝업 진입점
 *
 * DOM 로드 후 UI 초기화, 이벤트 리스너 등록, 인증 상태에 따른 뷰 전환을 수행한다.
 */

import { getStorageData, clearStorage, isStorageDataValid } from './storage.js';
import {
  elements,
  initializeElements,
  showView,
  showMessage,
  hideCycleModal
} from './ui/index.js';
import { getNextReview } from './api.js';
import { formatNextReviewDate } from './utils.js';
import {
  handleRegister,
  handleCheckAuth,
  handleReset,
  handleSaveUrl,
  handleShowDevices,
  handleDeleteDevice,
  handleLogout,
  handleLoadCycleOptions,
  handleShowCycleManagement,
  handleSaveCycle,
  handleDeleteCycle,
  handleEditCycle,
  handleAddCycle,
  handleAddDuration,
  handleShowNotificationTime,
  handleUpdateNotificationTime
} from './handlers/index.js';

/**
 * 이벤트 리스너 등록
 */
function setupEventListeners() {
  elements.registerBtn.addEventListener('click', handleRegister);
  elements.checkAuthBtn.addEventListener('click', handleCheckAuth);
  elements.resetBtn.addEventListener('click', handleReset);
  elements.saveUrlBtn.addEventListener('click', handleSaveUrl);
  elements.notificationTimeBtn.addEventListener('click', handleShowNotificationTime);
  elements.notificationTimeSaveBtn.addEventListener('click', handleUpdateNotificationTime);
  elements.showDevicesBtn.addEventListener('click', handleShowDevices);
  elements.logoutBtn.addEventListener('click', handleLogout);

  // 주기 관리 이벤트
  elements.cycleManageBtn.addEventListener('click', handleShowCycleManagement);
  elements.cycleAddBtn.addEventListener('click', handleAddCycle);
  elements.cycleFormCancelBtn.addEventListener('click', hideCycleModal);
  elements.cycleForm.addEventListener('submit', handleSaveCycle);
  elements.addDurationBtn.addEventListener('click', handleAddDuration);

  // 주기 목록 이벤트 위임 (수정/삭제)
  elements.cycleList.addEventListener('click', (e) => {
    const id = parseInt(e.target.dataset.id, 10);
    if (e.target.classList.contains('cycle-edit-btn')) {
      handleEditCycle(id);
    } else if (e.target.classList.contains('cycle-delete-btn')) {
      handleDeleteCycle(id);
    }
  });

  // 디바이스 삭제 버튼 (이벤트 위임)
  elements.devicesList.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-danger')) {
      const targetId = e.target.dataset.id;
      handleDeleteDevice(targetId);
    }
  });

  // 엔터키로 등록
  elements.emailInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleRegister();
    }
  });
}

/**
 * 앱 초기화
 */
async function initialize() {
  try {
    const storageData = await getStorageData();

    // 스토리지 데이터 유효성 검증
    if (!isStorageDataValid(storageData)) {
      console.warn('손상된 스토리지 데이터 감지, 초기화 진행');
      await clearStorage();
      showView('login');
      showMessage('저장된 정보에 문제가 있어 초기화되었습니다.', 'info');
      return;
    }

    if (storageData.isAuthenticated) {
      elements.userEmail.textContent = storageData.email;
      showView('main');
      // 주기 옵션 로드
      handleLoadCycleOptions();
      loadNextReview(storageData.identifier);
    } else if (storageData.email && storageData.identifier) {
      elements.emailDisplay.textContent = storageData.email;
      showView('pending');
    } else {
      showView('login');
    }
  } catch (error) {
    console.error('초기화 오류:', error);
    await clearStorage();
    showView('login');
  }
}

/**
 * 다음 리뷰 정보 로드 및 표시
 */
async function loadNextReview(identifier) {
  try {
    const result = await getNextReview(identifier);
    if (result.scheduledAt && result.count > 0) {
      elements.nextReviewText.textContent =
        `다음 리뷰: ${formatNextReviewDate(result.scheduledAt)} / 대기 중 ${result.count}개`;
      elements.nextReviewInfo.classList.remove('hidden');
    }
  } catch (error) {
    console.debug('다음 리뷰 정보 조회 실패:', error);
  }
}

/**
 * DOM 로드 후 실행
 */
document.addEventListener('DOMContentLoaded', () => {
  initializeElements();
  setupEventListeners();
  initialize();
});
