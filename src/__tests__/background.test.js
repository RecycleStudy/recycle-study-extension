import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleApiRequest } from '../api-proxy.js';
import { CONFIG } from '../config.js';

// Mock global fetch
global.fetch = vi.fn();

describe('handleApiRequest', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('GET 요청을 올바르게 구성하여 보낸다', async () => {
    const mockResponse = { data: 'test' };
    fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockResponse
    });

    const request = {
      endpoint: '/test',
      method: 'GET',
      params: { q: 'hello' }
    };

    const result = await handleApiRequest(request);

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/test?q=hello'),
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          'Content-Type': 'application/json'
        })
      })
    );
    expect(result).toEqual({ success: true, data: mockResponse });
  });

  it('POST 요청과 Body를 올바르게 보낸다', async () => {
    const mockResponse = { id: 1 };
    fetch.mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => mockResponse
    });

    const request = {
      endpoint: '/create',
      method: 'POST',
      body: { name: 'item' }
    };

    await handleApiRequest(request);

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/create'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ name: 'item' })
      })
    );
  });

  it('커스텀 헤더를 포함하여 요청을 보낸다', async () => {
    fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({})
    });

    const request = {
      endpoint: '/header-test',
      headers: { 'X-Device-Id': '12345' }
    };

    await handleApiRequest(request);

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'X-Device-Id': '12345'
        })
      })
    );
  });

  it('204 응답을 올바르게 처리한다', async () => {
    fetch.mockResolvedValue({
      ok: true,
      status: 204
    });

    const result = await handleApiRequest({ endpoint: '/delete' });

    expect(result).toEqual({ success: true, data: null });
  });

  it('API 에러 응답을 처리한다', async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ message: 'Invalid data' })
    });

    const result = await handleApiRequest({ endpoint: '/error' });

    expect(result).toEqual({
      success: false,
      status: 400,
      message: 'Invalid data'
    });
  });

  it('네트워크 에러를 처리한다', async () => {
    fetch.mockRejectedValue(new Error('Network error'));

    const result = await handleApiRequest({ endpoint: '/network-fail' });

    expect(result).toEqual({
      success: false,
      status: 0,
      message: 'Network error',
      isNetworkError: true
    });
  });
});
