/**
 * 유틸리티 함수
 *
 * 날짜 포맷팅, 이메일 검증 등 범용 헬퍼 함수를 정의한다.
 */

/**
 * 날짜 포맷팅
 * @param {string} dateString - ISO 형식 날짜 문자열
 * @returns {string} 포맷된 날짜 문자열
 */
export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * 다음 리뷰 날짜 포맷팅 (월/일/시:분)
 * @param {string} dateString - ISO 형식 날짜 문자열
 * @returns {string} 포맷된 날짜 문자열 (예: "3월 6일 09:00")
 */
export function formatNextReviewDate(dateString) {
  // 타임존 정보가 없으면 UTC로 가정 (서버 버그 방어)
  const hasTimezone = /Z$|[+-]\d{2}:\d{2}$/.test(dateString);
  const normalized = hasTimezone ? dateString : dateString + 'Z';

  const date = new Date(normalized);
  const parts = new Intl.DateTimeFormat('ko-KR', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    // timeZone 미지정 → 브라우저 로컬 타임존 자동 사용 (글로벌 대응)
  }).formatToParts(date);

  const get = (type) => parts.find(p => p.type === type).value;
  return `${get('month')}월 ${get('day')}일 ${get('hour')}:${get('minute')}`;
}

/**
 * 이메일 형식 검증
 * @param {string} email - 검증할 이메일
 * @returns {boolean} 유효하면 true
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * UTC 시간 문자열 → 로컬 HH:MM 변환
 * 예: "00:00:00" (UTC) → "09:00" (서울 UTC+9)
 * @param {string} utcTimeString - "HH:MM:SS" 형식의 UTC 시간 문자열
 * @returns {string} 로컬 시간 "HH:MM" 문자열
 */
export function utcTimeStringToLocal(utcTimeString) {
  const [h, m] = utcTimeString.split(':');
  const today = new Date().toISOString().slice(0, 10);
  const utcDate = new Date(`${today}T${h}:${m}:00Z`);
  return utcDate.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

/**
 * 로컬 HH:MM → UTC [hour, minute] 배열 변환
 * 예: "09:00" (서울 UTC+9) → [0, 0] (UTC)
 * @param {string} localTimeString - "HH:MM" 형식의 로컬 시간 문자열
 * @returns {number[]} UTC 기준 [hour, minute] 배열
 */
export function localTimeStringToUtcArray(localTimeString) {
  const [h, m] = localTimeString.split(':').map(Number);
  const today = new Date().toISOString().slice(0, 10);
  // 타임존 suffix 없는 형식은 로컬 시간으로 파싱됨 (ECMAScript 표준)
  const localDate = new Date(
    `${today}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`
  );
  return [localDate.getUTCHours(), localDate.getUTCMinutes()];
}
