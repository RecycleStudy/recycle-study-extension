/**
 * 환경 설정
 *
 * 개발: vite build (.env.development 사용, 기본값)
 * 프로덕션: vite build --mode production (.env.production 사용)
 */
export const CONFIG = {
  BASE_URL: import.meta.env.VITE_BASE_URL || 'http://localhost:8080',
  ENV: import.meta.env.MODE || 'development'
};

export const STORAGE_KEYS = {
  EMAIL: 'email',
  IDENTIFIER: 'identifier',
  IS_AUTHENTICATED: 'isAuthenticated'
};
