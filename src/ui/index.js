/**
 * UI 모듈 진입점
 *
 * 모든 UI 함수를 re-export한다.
 */

// DOM 요소
export { elements, initializeElements } from './elements.js';

// 뷰 전환
export { showView, forceLogout } from './views.js';

// 메시지/로딩
export { showLoading, hideLoading, showMessage } from './messages.js';

// 에러 처리
export { handleApiError } from './error-handler.js';

// 주기 UI
export { renderCycleSelect, renderCycleList, getSelectedCycle } from './cycle.js';

// 모달
export {
  showCycleModal,
  hideCycleModal,
  getEditingCycleId,
  addDurationInput,
  getDurationsFromForm
} from './modal.js';
