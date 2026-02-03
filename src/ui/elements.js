/**
 * DOM 요소 관리
 *
 * DOM 요소 캐싱 및 초기화를 담당한다.
 */

/**
 * DOM 요소 캐시
 */
export const elements = {
  // 뷰
  loginView: null,
  pendingView: null,
  mainView: null,

  // 로그인 화면
  emailInput: null,
  registerBtn: null,

  // 인증 대기 화면
  emailDisplay: null,
  checkAuthBtn: null,
  resetBtn: null,

  // 메인 화면
  userEmail: null,
  cycleSelect: null,
  saveUrlBtn: null,
  saveResult: null,
  scheduleDates: null,
  cycleManageBtn: null,
  cycleSection: null,
  cycleList: null,
  cycleAddBtn: null,
  showDevicesBtn: null,
  devicesSection: null,
  devicesList: null,
  logoutBtn: null,

  // 주기 폼 모달
  cycleModal: null,
  cycleModalTitle: null,
  cycleForm: null,
  cycleTitleInput: null,
  cycleDurationsContainer: null,
  addDurationBtn: null,
  cycleFormSubmitBtn: null,
  cycleFormCancelBtn: null,

  // 공통
  messageArea: null,
  loading: null
};

/**
 * DOM 요소 초기화
 */
export function initializeElements() {
  elements.loginView = document.getElementById('login-view');
  elements.pendingView = document.getElementById('pending-view');
  elements.mainView = document.getElementById('main-view');

  elements.emailInput = document.getElementById('email-input');
  elements.registerBtn = document.getElementById('register-btn');

  elements.emailDisplay = document.querySelector('.email-display');
  elements.checkAuthBtn = document.getElementById('check-auth-btn');
  elements.resetBtn = document.getElementById('reset-btn');

  elements.userEmail = document.getElementById('user-email');
  elements.cycleSelect = document.getElementById('cycle-select');
  elements.saveUrlBtn = document.getElementById('save-url-btn');
  elements.saveResult = document.getElementById('save-result');
  elements.scheduleDates = document.getElementById('schedule-dates');
  elements.cycleManageBtn = document.getElementById('cycle-manage-btn');
  elements.cycleSection = document.getElementById('cycle-section');
  elements.cycleList = document.getElementById('cycle-list');
  elements.cycleAddBtn = document.getElementById('cycle-add-btn');
  elements.showDevicesBtn = document.getElementById('show-devices-btn');
  elements.devicesSection = document.getElementById('devices-section');
  elements.devicesList = document.getElementById('devices-list');
  elements.logoutBtn = document.getElementById('logout-btn');

  elements.cycleModal = document.getElementById('cycle-modal');
  elements.cycleModalTitle = document.getElementById('cycle-modal-title');
  elements.cycleForm = document.getElementById('cycle-form');
  elements.cycleTitleInput = document.getElementById('cycle-title-input');
  elements.cycleDurationsContainer = document.getElementById('cycle-durations-container');
  elements.addDurationBtn = document.getElementById('add-duration-btn');
  elements.cycleFormSubmitBtn = document.getElementById('cycle-form-submit');
  elements.cycleFormCancelBtn = document.getElementById('cycle-form-cancel');

  elements.messageArea = document.getElementById('message-area');
  elements.loading = document.getElementById('loading');
}
