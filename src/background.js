/**
 * 백그라운드 서비스 워커
 *
 * 익스텐션 설치/업데이트 이벤트 처리 및 popup과의 메시지 통신을 담당한다.
 * API 요청은 CORS 우회를 위해 이 서비스 워커에서 처리한다.
 */

import { handleApiRequest } from './api-proxy.js';

// ============================================
// 익스텐션 설치/업데이트 이벤트
// ============================================
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Recycle Study 익스텐션이 설치되었습니다.');
  } else if (details.reason === 'update') {
    console.log('Recycle Study 익스텐션이 업데이트되었습니다.');
  }
});



// ============================================
// 메시지 리스너 (popup과 통신)
// ============================================
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'API_REQUEST') {
    handleApiRequest(message.request)
      .then(sendResponse);
    return true; // 비동기 응답을 위해 true 반환
  }

  if (message.type === 'CHECK_AUTH') {
    sendResponse({ success: true });
  }
});
