import { CONFIG } from './config.js';

/**
 * API 요청 처리 로직
 * @param {Object} request
 * @returns {Promise<Object>}
 */
export async function handleApiRequest(request) {
  const { endpoint, method = 'GET', body, params, headers } = request;

  let url = `${CONFIG.BASE_URL}${endpoint}`;
  if (params) {
    url += `?${new URLSearchParams(params)}`;
  }

  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(headers || {})
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);

    // 204 No Content
    if (response.status === 204) {
      return { success: true, data: null };
    }

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError);
      data = { message: 'Invalid JSON response from server.' };
    }

    if (!response.ok) {
      console.error('API request failed:', { url, status: response.status, data });
      return { success: false, status: response.status, message: data.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Network request failed:', { url, error });
    return { success: false, status: 0, message: error.message, isNetworkError: true };
  }
}
