/**
 * API 호출 관련 함수
 *
 * 서버와의 통신을 담당하며, 디바이스 등록/조회/삭제, 복습 URL 저장 등의 API를 제공한다.
 * 모든 API 요청은 background.js를 통해 처리되어 CORS 문제를 우회한다.
 */

import { ERROR_CODES } from './constants.js';
import { ApiError, getErrorCodeFromStatus } from './errors.js';

/**
 * Background Script로 API 요청 전송
 * @param {Object} request - API 요청 정보
 * @returns {Promise<Object|null>} 응답 데이터
 * @throws {ApiError}
 */
async function sendApiRequest(request) {
  const response = await chrome.runtime.sendMessage({
    type: 'API_REQUEST',
    request
  });

  if (!response.success) {
    if (response.isNetworkError) {
      throw new ApiError(ERROR_CODES.NETWORK_ERROR, response.message);
    }
    const errorCode = getErrorCodeFromStatus(response.status);
    throw new ApiError(errorCode, response.message);
  }

  return response.data;
}

/**
 * 디바이스 등록 (회원가입)
 * @param {string} email - 사용자 이메일
 * @returns {Promise<Object>} { email, identifier }
 */
export async function registerDevice(email) {
  return await sendApiRequest({
    endpoint: '/api/v1/members',
    method: 'POST',
    body: { email }
  });
}

/**
 * 디바이스 목록 조회
 * @param {string} email - 사용자 이메일
 * @param {string} identifier - 디바이스 식별자
 * @returns {Promise<Object>} { email, devices }
 */
export async function getDevices(email, identifier) {
  return await sendApiRequest({
    endpoint: '/api/v1/members',
    method: 'GET',
    params: { email },
    headers: { 'X-Device-Id': identifier }
  });
}

/**
 * 디바이스 삭제
 * @param {string} email - 사용자 이메일
 * @param {string} deviceIdentifier - 현재 디바이스 식별자
 * @param {string} targetDeviceIdentifier - 삭제할 디바이스 식별자
 */
export async function deleteDevice(email, deviceIdentifier, targetDeviceIdentifier) {
  return await sendApiRequest({
    endpoint: '/api/v1/device',
    method: 'DELETE',
    headers: { 'X-Device-Id': deviceIdentifier },
    body: { email, targetDeviceIdentifier }
  });
}

/**
 * 복습 URL 저장
 * @param {string} identifier - 디바이스 식별자
 * @param {string} targetUrl - 저장할 URL
 * @param {Object} cycle - 복습 주기 { type: "DEFAULT", code } 또는 { type: "CUSTOM", id }
 * @returns {Promise<Object>} { url, scheduledAts }
 */
export async function saveReviewUrl(identifier, targetUrl, cycle) {
  return await sendApiRequest({
    endpoint: '/api/v1/reviews',
    method: 'POST',
    headers: { 'X-Device-Id': identifier },
    body: { targetUrl, cycle }
  });
}

/**
 * 복습 주기 옵션 조회
 * @param {string} identifier - 디바이스 식별자
 * @returns {Promise<Object>} { defaultOptions, customOptions }
 */
export async function getCycleOptions(identifier) {
  return await sendApiRequest({
    endpoint: '/api/v1/cycles/custom',
    method: 'GET',
    headers: { 'X-Device-Id': identifier }
  });
}

/**
 * 커스텀 주기 생성
 * @param {string} identifier - 디바이스 식별자
 * @param {string} title - 주기 이름
 * @param {string[]} durations - ISO 8601 Duration 배열
 * @returns {Promise<Object>} { id, title, durations }
 */
export async function createCustomCycle(identifier, title, durations) {
  return await sendApiRequest({
    endpoint: '/api/v1/cycles/custom',
    method: 'POST',
    headers: { 'X-Device-Id': identifier },
    body: { title, durations }
  });
}

/**
 * 커스텀 주기 수정
 * @param {string} identifier - 디바이스 식별자
 * @param {number} id - 주기 ID
 * @param {string} title - 주기 이름
 * @param {string[]} durations - ISO 8601 Duration 배열
 * @returns {Promise<Object>} { id, title, durations }
 */
export async function updateCustomCycle(identifier, id, title, durations) {
  return await sendApiRequest({
    endpoint: `/api/v1/cycles/custom/${id}`,
    method: 'PUT',
    headers: { 'X-Device-Id': identifier },
    body: { title, durations }
  });
}

/**
 * 커스텀 주기 삭제
 * @param {string} identifier - 디바이스 식별자
 * @param {number} id - 주기 ID
 */
export async function deleteCustomCycle(identifier, id) {
  return await sendApiRequest({
    endpoint: `/api/v1/cycles/custom/${id}`,
    method: 'DELETE',
    headers: { 'X-Device-Id': identifier }
  });
}

/**
 * 알림 시간 조회
 * @param {string} identifier - 디바이스 식별자
 * @returns {Promise<Object>} { notificationTime: "09:00:00" } or { notificationTime: null }
 */
export async function getNotificationTime(identifier) {
  return await sendApiRequest({
    endpoint: '/api/v1/members/notification-time',
    method: 'GET',
    headers: { 'X-Device-Id': identifier }
  });
}

/**
 * 알림 시간 업데이트
 * @param {string} identifier - 디바이스 식별자
 * @param {number} hour - 시 (0-23)
 * @param {number} minute - 분 (0-59)
 */
export async function updateNotificationTime(identifier, hour, minute) {
  return await sendApiRequest({
    endpoint: '/api/v1/members/notification-time',
    method: 'PATCH',
    headers: { 'X-Device-Id': identifier },
    body: { notificationTime: [hour, minute] }
  });
}
