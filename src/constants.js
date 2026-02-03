/**
 * 상수 정의
 *
 * 에러 코드, UI 설정값, Duration 관련 상수를 정의한다.
 */

/**
 * 에러 코드
 */
export const ERROR_CODES = {
  // 로그아웃이 필요한 에러
  UNAUTHORIZED: 'UNAUTHORIZED',           // 401: 인증되지 않은 디바이스
  NOT_FOUND: 'NOT_FOUND',                 // 404: 존재하지 않는 리소스
  INVALID_STORAGE: 'INVALID_STORAGE',     // 스토리지 데이터 손상

  // 로그아웃 불필요한 에러
  BAD_REQUEST: 'BAD_REQUEST',             // 400: 잘못된 요청
  SERVER_ERROR: 'SERVER_ERROR',           // 5xx: 서버 오류
  NETWORK_ERROR: 'NETWORK_ERROR'          // 네트워크 연결 실패
};

/**
 * 자동 로그아웃이 필요한 에러 코드
 */
export const LOGOUT_REQUIRED_ERRORS = [
  ERROR_CODES.UNAUTHORIZED,
  ERROR_CODES.NOT_FOUND,
  ERROR_CODES.INVALID_STORAGE
];

/**
 * UI 관련 상수
 */
export const UI_CONSTANTS = {
  MESSAGE_DISPLAY_DURATION_MS: 3000,      // 메시지 표시 시간 (3초)
  DEVICE_ID_DISPLAY_LENGTH: 20            // 디바이스 ID 표시 길이
};

/**
 * Duration 관련 상수
 */
export const DURATION_CONSTANTS = {
  VALIDATION_STEP_MINUTES: 10,            // 분 단위 검증 기준 (10분)
  DEFAULT_DURATION: 'PT10M',              // 기본 Duration 값
  DEFAULT_VALUE: 10,                      // 기본 숫자 값
  DEFAULT_UNIT: 'M'                       // 기본 단위 (분)
};

/**
 * ISO 8601 Duration 파싱용 정규식
 */
export const DURATION_REGEX = /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?)?$/;
