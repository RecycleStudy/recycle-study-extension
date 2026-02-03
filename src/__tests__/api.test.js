import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { registerDevice, getDevices, deleteDevice, saveReviewUrl } from '../api.js';
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
    it('식별자를 헤더에 포함하여 URL 저장 요청을 보낸다', async () => {
      const identifier = 'my-device-id';
      const targetUrl = 'https://example.com';
      const mockResponse = { success: true, data: { url: targetUrl } };
      sendMessageMock.mockResolvedValue(mockResponse);

      await saveReviewUrl(identifier, targetUrl);

      expect(sendMessageMock).toHaveBeenCalledWith({
        type: 'API_REQUEST',
        request: {
          endpoint: '/api/v1/reviews',
          method: 'POST',
          headers: { 'X-Device-Id': identifier },
          body: { targetUrl }
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
