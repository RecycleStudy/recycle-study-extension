/**
 * 복습 주기 관련 핸들러
 *
 * 주기 옵션 로드, 생성, 수정, 삭제 처리를 담당한다.
 */

import {
  getCycleOptions,
  createCustomCycle,
  updateCustomCycle,
  deleteCustomCycle
} from '../api.js';
import { validateStorageForAuth } from '../storage.js';
import {
  elements,
  showLoading,
  hideLoading,
  showMessage,
  handleApiError,
  renderCycleSelect,
  renderCycleList,
  showCycleModal,
  hideCycleModal,
  getEditingCycleId,
  addDurationInput,
  getDurationsFromForm
} from '../ui/index.js';
import { validateDurations } from '../duration-utils.js';

// 현재 로드된 주기 옵션 캐시
let cachedCycleOptions = { defaultOptions: [], customOptions: [] };

/**
 * 캐시된 주기 옵션 반환
 * @returns {{ defaultOptions: Array, customOptions: Array }}
 */
export function getCachedCycleOptions() {
  return cachedCycleOptions;
}

/**
 * 주기 옵션 로드 핸들러
 */
export async function handleLoadCycleOptions() {
  try {
    const storageData = await validateStorageForAuth();
    const result = await getCycleOptions(storageData.identifier);

    cachedCycleOptions = {
      defaultOptions: result.defaultOptions || [],
      customOptions: result.customOptions || []
    };

    renderCycleSelect(cachedCycleOptions.defaultOptions, cachedCycleOptions.customOptions);
  } catch (error) {
    console.warn('주기 옵션 로드 실패:', error);
    // 에러 시에도 기본 빈 상태로 렌더링
    renderCycleSelect([], []);
  }
}

/**
 * 주기 관리 섹션 토글 핸들러
 */
export async function handleShowCycleManagement() {
  const isVisible = !elements.cycleSection.classList.contains('hidden');

  if (isVisible) {
    elements.cycleSection.classList.add('hidden');
    return;
  }

  try {
    showLoading();
    const storageData = await validateStorageForAuth();
    const result = await getCycleOptions(storageData.identifier);

    cachedCycleOptions = {
      defaultOptions: result.defaultOptions || [],
      customOptions: result.customOptions || []
    };

    renderCycleList(cachedCycleOptions.customOptions);
    elements.cycleSection.classList.remove('hidden');
  } catch (error) {
    await handleApiError(error);
  } finally {
    hideLoading();
  }
}

/**
 * 커스텀 주기 저장 핸들러 (생성/수정)
 * @param {Event} e - 폼 제출 이벤트
 */
export async function handleSaveCycle(e) {
  e.preventDefault();

  const title = elements.cycleTitleInput.value.trim();
  if (!title) {
    showMessage('주기 이름을 입력해주세요.', 'error');
    return;
  }

  const durations = getDurationsFromForm();
  const validation = validateDurations(durations);
  if (!validation.valid) {
    showMessage(validation.message, 'error');
    return;
  }

  try {
    showLoading();
    const storageData = await validateStorageForAuth();
    const editingId = getEditingCycleId();

    if (editingId) {
      // 수정
      await updateCustomCycle(storageData.identifier, editingId, title, durations);
      showMessage('주기가 수정되었습니다.', 'success');
    } else {
      // 생성
      await createCustomCycle(storageData.identifier, title, durations);
      showMessage('주기가 생성되었습니다.', 'success');
    }

    hideCycleModal();

    // 목록 및 드롭다운 갱신
    await handleLoadCycleOptions();
    renderCycleList(cachedCycleOptions.customOptions);
  } catch (error) {
    await handleApiError(error);
  } finally {
    hideLoading();
  }
}

/**
 * 커스텀 주기 삭제 핸들러
 * @param {number} id - 주기 ID
 */
export async function handleDeleteCycle(id) {
  if (!confirm('이 복습 주기를 삭제하시겠습니까?')) {
    return;
  }

  try {
    showLoading();
    const storageData = await validateStorageForAuth();
    await deleteCustomCycle(storageData.identifier, id);

    showMessage('주기가 삭제되었습니다.', 'success');

    // 목록 및 드롭다운 갱신
    await handleLoadCycleOptions();
    renderCycleList(cachedCycleOptions.customOptions);
  } catch (error) {
    await handleApiError(error);
  } finally {
    hideLoading();
  }
}

/**
 * 커스텀 주기 수정 모달 열기 핸들러
 * @param {number} id - 주기 ID
 */
export function handleEditCycle(id) {
  const cycle = cachedCycleOptions.customOptions.find(c => c.id === id);
  if (cycle) {
    showCycleModal(cycle);
  }
}

/**
 * 새 주기 추가 버튼 클릭 핸들러
 */
export function handleAddCycle() {
  showCycleModal(null);
}

/**
 * Duration 추가 버튼 클릭 핸들러
 */
export function handleAddDuration() {
  addDurationInput();
}
