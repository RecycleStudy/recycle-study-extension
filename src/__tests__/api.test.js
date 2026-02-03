import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  registerDevice,
  getDevices,
  deleteDevice,
  saveReviewUrl,
  getCycleOptions,
  createCustomCycle,
  updateCustomCycle,
  deleteCustomCycle
} from '../api.js';
import { ERROR_CODES } from '../constants.js';

// Mock chrome.runtime.sendMessage
const sendMessageMock = vi.fn();
global.chrome = {
  runtime: {
    sendMessage: sendMessageMock
  }
};

describe('api.js', () => {
  beforeEach(() => {
    sendMessageMock.mockReset();
  });

  describe('registerDevice', () => {
    it('이메일로 등록 요청을 보낸다', async () => {
      const email = 'test@example.com';
      const mockResponse = { success: true, data: { email, identifier: 'dev-id' } };
      sendMessageMock.mockResolvedValue(mockResponse);

      const result = await registerDevice(email);

      expect(sendMessageMock).toHaveBeenCalledWith({
        type: 'API_REQUEST',
        request: {
          endpoint: '/api/v1/members',
          method: 'POST',
          body: { email }
        }
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getDevices', () => {
    it('식별자를 헤더에 포함하여 디바이스 목록을 조회한다', async () => {
      const email = 'test@example.com';
      const identifier = 'my-device-id';
      const mockResponse = { success: true, data: { devices: [] } };
      sendMessageMock.mockResolvedValue(mockResponse);

      await getDevices(email, identifier);

      expect(sendMessageMock).toHaveBeenCalledWith({
        type: 'API_REQUEST',
        request: {
          endpoint: '/api/v1/members',
          method: 'GET',
          params: { email },
          headers: { 'X-Device-Id': identifier }
        }
      });
    });
  });

  describe('deleteDevice', () => {
    it('식별자를 헤더에 포함하여 디바이스 삭제 요청을 보낸다', async () => {
      const email = 'test@example.com';
      const deviceIdentifier = 'my-device-id';
      const targetDeviceIdentifier = 'target-id';
      const mockResponse = { success: true, data: null };
      sendMessageMock.mockResolvedValue(mockResponse);

      await deleteDevice(email, deviceIdentifier, targetDeviceIdentifier);

      expect(sendMessageMock).toHaveBeenCalledWith({
        type: 'API_REQUEST',
        request: {
          endpoint: '/api/v1/device',
          method: 'DELETE',
          headers: { 'X-Device-Id': deviceIdentifier },
          body: { email, targetDeviceIdentifier }
        }
      });
    });
  });

  describe('saveReviewUrl', () => {
    it('식별자와 주기를 포함하여 URL 저장 요청을 보낸다', async () => {
      const identifier = 'my-device-id';
      const targetUrl = 'https://example.com';
      const cycle = { type: 'DEFAULT', code: 'EBBINGHAUS' };
      const mockResponse = { success: true, data: { url: targetUrl, scheduledAts: [] } };
      sendMessageMock.mockResolvedValue(mockResponse);

      await saveReviewUrl(identifier, targetUrl, cycle);

      expect(sendMessageMock).toHaveBeenCalledWith({
        type: 'API_REQUEST',
        request: {
          endpoint: '/api/v1/reviews',
          method: 'POST',
          headers: { 'X-Device-Id': identifier },
          body: { targetUrl, cycle }
        }
      });
    });

    it('커스텀 주기로 URL 저장 요청을 보낸다', async () => {
      const identifier = 'my-device-id';
      const targetUrl = 'https://example.com';
      const cycle = { type: 'CUSTOM', id: 1 };
      const mockResponse = { success: true, data: { url: targetUrl, scheduledAts: [] } };
      sendMessageMock.mockResolvedValue(mockResponse);

      await saveReviewUrl(identifier, targetUrl, cycle);

      expect(sendMessageMock).toHaveBeenCalledWith({
        type: 'API_REQUEST',
        request: {
          endpoint: '/api/v1/reviews',
          method: 'POST',
          headers: { 'X-Device-Id': identifier },
          body: { targetUrl, cycle }
        }
      });
    });
  });

  describe('getCycleOptions', () => {
    it('주기 옵션 목록을 조회한다', async () => {
      const identifier = 'my-device-id';
      const mockResponse = {
        success: true,
        data: {
          defaultOptions: [{ code: 'EBBINGHAUS', title: '에빙하우스' }],
          customOptions: []
        }
      };
      sendMessageMock.mockResolvedValue(mockResponse);

      const result = await getCycleOptions(identifier);

      expect(sendMessageMock).toHaveBeenCalledWith({
        type: 'API_REQUEST',
        request: {
          endpoint: '/api/v1/cycles/custom',
          method: 'GET',
          headers: { 'X-Device-Id': identifier }
        }
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('createCustomCycle', () => {
    it('커스텀 주기를 생성한다', async () => {
      const identifier = 'my-device-id';
      const title = '나의 주기';
      const durations = ['PT10M', 'PT1H', 'P1D'];
      const mockResponse = { success: true, data: { id: 1, title, durations } };
      sendMessageMock.mockResolvedValue(mockResponse);

      const result = await createCustomCycle(identifier, title, durations);

      expect(sendMessageMock).toHaveBeenCalledWith({
        type: 'API_REQUEST',
        request: {
          endpoint: '/api/v1/cycles/custom',
          method: 'POST',
          headers: { 'X-Device-Id': identifier },
          body: { title, durations }
        }
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('updateCustomCycle', () => {
    it('커스텀 주기를 수정한다', async () => {
      const identifier = 'my-device-id';
      const id = 1;
      const title = '수정된 주기';
      const durations = ['PT30M', 'P2D'];
      const mockResponse = { success: true, data: { id, title, durations } };
      sendMessageMock.mockResolvedValue(mockResponse);

      const result = await updateCustomCycle(identifier, id, title, durations);

      expect(sendMessageMock).toHaveBeenCalledWith({
        type: 'API_REQUEST',
        request: {
          endpoint: '/api/v1/cycles/custom/1',
          method: 'PUT',
          headers: { 'X-Device-Id': identifier },
          body: { title, durations }
        }
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('deleteCustomCycle', () => {
    it('커스텀 주기를 삭제한다', async () => {
      const identifier = 'my-device-id';
      const id = 1;
      const mockResponse = { success: true, data: null };
      sendMessageMock.mockResolvedValue(mockResponse);

      await deleteCustomCycle(identifier, id);

      expect(sendMessageMock).toHaveBeenCalledWith({
        type: 'API_REQUEST',
        request: {
          endpoint: '/api/v1/cycles/custom/1',
          method: 'DELETE',
          headers: { 'X-Device-Id': identifier }
        }
      });
    });
  });

  describe('Error Handling', () => {
    it('API 실패 시 에러를 던진다', async () => {
      sendMessageMock.mockResolvedValue({
        success: false,
        status: 400,
        message: 'Bad Request'
      });

      await expect(registerDevice('test@test.com')).rejects.toThrow('Bad Request');
    });

    it('네트워크 에러 시 NETWORK_ERROR 코드를 반환한다', async () => {
      sendMessageMock.mockResolvedValue({
        success: false,
        isNetworkError: true,
        message: 'Network Error'
      });

      try {
        await registerDevice('test@test.com');
      } catch (error) {
        expect(error.code).toBe(ERROR_CODES.NETWORK_ERROR);
      }
    });
  });
});
