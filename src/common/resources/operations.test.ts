import {
  type Mock,
  afterEach,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from 'vitest';
import { HttpError } from '../errors/http.js';
import { ValidationError } from '../errors/validation.js';
import type { Authorization } from './authorization.js';
import {
  deleteItemWithAuthorization,
  getItemWithAuthorization,
  listItemsWithAuthorization,
  postItemWithAuthorization,
  putItemWithAuthorization,
} from './operations.js';

// Mock console.debug to avoid noise in tests
global.console.debug = vi.fn();

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('Common Resources - Operations', () => {
  let mockAuthorization: Mock<Authorization>;
  let testUrl: URL;

  beforeEach(() => {
    vi.clearAllMocks();

    // Create mock authorization function
    mockAuthorization = vi.fn((request: RequestInit) => ({
      ...request,
      headers: new Headers({
        ...Object.fromEntries((request.headers as Headers)?.entries() || []),
        authorization: 'Bearer test-token',
      }),
    }));

    testUrl = new URL('https://api.example.com/resource');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('listItemsWithAuthorization', () => {
    test('should successfully list items with valid response', async () => {
      const mockData = { items: [{ id: 1, name: 'Item 1' }] };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const result = await listItemsWithAuthorization(
        testUrl,
        mockAuthorization
      );

      expect(result).toEqual(mockData);
      expect(mockFetch).toHaveBeenCalledWith(
        testUrl,
        expect.objectContaining({
          method: 'GET',
          headers: expect.any(Headers),
        })
      );
      expect(mockAuthorization).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          headers: expect.any(Headers),
        })
      );
    });

    test('should include correct default headers', async () => {
      const mockData = { items: [] };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      await listItemsWithAuthorization(testUrl, mockAuthorization);

      const authCall = mockAuthorization.mock.calls[0][0];
      const headers = authCall.headers as Headers;
      expect(headers.get('accept')).toBe('application/json');
    });

    test('should throw HttpError when response is not ok', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () =>
          Promise.resolve({
            error: 'not_found',
            error_description: 'Resource not found',
          }),
      });

      await expect(
        listItemsWithAuthorization(testUrl, mockAuthorization)
      ).rejects.toThrow(HttpError);
    });

    test('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(
        listItemsWithAuthorization(testUrl, mockAuthorization)
      ).rejects.toThrow(HttpError);
    });

    test('should log debug information', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      });

      await listItemsWithAuthorization(testUrl, mockAuthorization);

      expect(console.debug).toHaveBeenCalledWith('List items', {
        url: testUrl,
      });
    });
  });

  describe('getItemWithAuthorization', () => {
    test('should successfully get item with valid response', async () => {
      const mockData = { id: 1, name: 'Test Item' };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const result = await getItemWithAuthorization(testUrl, mockAuthorization);

      expect(result).toEqual(mockData);
      expect(mockFetch).toHaveBeenCalledWith(
        testUrl,
        expect.objectContaining({
          method: 'GET',
          headers: expect.any(Headers),
        })
      );
    });

    test('should handle authorization errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: () =>
          Promise.resolve({
            error: 'unauthorized',
            error_description: 'Invalid token',
          }),
      });

      await expect(
        getItemWithAuthorization(testUrl, mockAuthorization)
      ).rejects.toThrow(HttpError);
    });

    test('should log debug information', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      });

      await getItemWithAuthorization(testUrl, mockAuthorization);

      expect(console.debug).toHaveBeenCalledWith('GET item', { url: testUrl });
    });
  });

  describe('updateItemWithAuthorization', () => {
    test('should successfully update item', async () => {
      const updateData = { name: 'Updated Item' };
      const responseData = { id: 1, name: 'Updated Item' };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(responseData),
      });

      const result = await putItemWithAuthorization(
        testUrl,
        mockAuthorization,
        updateData
      );

      expect(result).toEqual(responseData);
      expect(mockFetch).toHaveBeenCalledWith(
        testUrl,
        expect.objectContaining({
          method: 'PUT',
          headers: expect.any(Headers),
          body: JSON.stringify(updateData),
        })
      );
    });

    test('should include correct headers for mutations', async () => {
      const updateData = { name: 'Test' };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      });

      await putItemWithAuthorization(testUrl, mockAuthorization, updateData);

      const authCall = mockAuthorization.mock.calls[0][0];
      const headers = authCall.headers as Headers;
      expect(headers.get('accept')).toBe('application/json');
      expect(headers.get('content-type')).toBe('application/json');
    });

    test('should handle validation errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () =>
          Promise.resolve({
            error: 'validation_error',
            error_description: 'Invalid input',
            fields: { name: ['required'] },
          }),
      });

      await expect(
        putItemWithAuthorization(testUrl, mockAuthorization, {})
      ).rejects.toThrow(ValidationError);
    });

    test('should log debug information with item data', async () => {
      const updateData = { name: 'Test Item' };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      });

      await putItemWithAuthorization(testUrl, mockAuthorization, updateData);

      expect(console.debug).toHaveBeenCalledWith('PUT item', {
        url: testUrl,
        item: updateData,
      });
    });
  });

  describe('insertItemWithAuthorization', () => {
    test('should successfully insert item with data', async () => {
      const insertData = { name: 'New Item' };
      const responseData = { id: 1, name: 'New Item' };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(responseData),
      });

      const result = await postItemWithAuthorization(
        testUrl,
        mockAuthorization,
        insertData
      );

      expect(result).toEqual(responseData);
      expect(mockFetch).toHaveBeenCalledWith(
        testUrl,
        expect.objectContaining({
          method: 'POST',
          headers: expect.any(Headers),
          body: JSON.stringify(insertData),
        })
      );
    });

    test('should handle insert without data (undefined body)', async () => {
      const responseData = { id: 1, status: 'created' };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(responseData),
      });

      const result = await postItemWithAuthorization(
        testUrl,
        mockAuthorization
      );

      expect(result).toEqual(responseData);
      expect(mockFetch).toHaveBeenCalledWith(
        testUrl,
        expect.objectContaining({
          method: 'POST',
          headers: expect.any(Headers),
          body: undefined,
        })
      );
    });

    test('should handle insert with null data', async () => {
      const responseData = { id: 1 };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(responseData),
      });

      const result = await postItemWithAuthorization(
        testUrl,
        mockAuthorization,
        null
      );

      expect(result).toEqual(responseData);
      expect(mockFetch).toHaveBeenCalledWith(
        testUrl,
        expect.objectContaining({
          method: 'POST',
          body: undefined,
        })
      );
    });

    test('should handle server errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () =>
          Promise.resolve({
            error: 'internal_error',
            error_description: 'Internal server error',
          }),
      });

      await expect(
        postItemWithAuthorization(testUrl, mockAuthorization, {})
      ).rejects.toThrow(HttpError);
    });

    test('should log debug information', async () => {
      const insertData = { name: 'Test' };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      });

      await postItemWithAuthorization(testUrl, mockAuthorization, insertData);

      expect(console.debug).toHaveBeenCalledWith('POST item', {
        url: testUrl,
        item: insertData,
      });
    });
  });

  describe('deleteItemWithAuthorization', () => {
    test('should successfully delete item', async () => {
      const responseData = { deleted: true };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(responseData),
      });

      const result = await deleteItemWithAuthorization(
        testUrl,
        mockAuthorization
      );

      expect(result).toEqual(responseData);
      expect(mockFetch).toHaveBeenCalledWith(
        testUrl,
        expect.objectContaining({
          method: 'DELETE',
          headers: expect.any(Headers),
        })
      );
    });

    test('should handle empty response body', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.reject(new Error('No JSON body')),
      });

      const result = await deleteItemWithAuthorization(
        testUrl,
        mockAuthorization
      );

      expect(result).toBeUndefined();
    });

    test('should use default headers (not mutation headers)', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      });

      await deleteItemWithAuthorization(testUrl, mockAuthorization);

      const authCall = mockAuthorization.mock.calls[0][0];
      const headers = authCall.headers as Headers;
      expect(headers.get('accept')).toBe('application/json');
      expect(headers.get('content-type')).toBeNull();
    });

    test('should handle not found errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () =>
          Promise.resolve({
            error: 'not_found',
            error_description: 'Resource not found',
          }),
      });

      await expect(
        deleteItemWithAuthorization(testUrl, mockAuthorization)
      ).rejects.toThrow(HttpError);
    });

    test('should log debug information', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      });

      await deleteItemWithAuthorization(testUrl, mockAuthorization);

      expect(console.debug).toHaveBeenCalledWith('Delete item', {
        url: testUrl,
      });
    });
  });

  describe('authorization integration', () => {
    test('should call authorization function for all operations', async () => {
      const operations = [
        () => listItemsWithAuthorization(testUrl, mockAuthorization),
        () => getItemWithAuthorization(testUrl, mockAuthorization),
        () => putItemWithAuthorization(testUrl, mockAuthorization, {}),
        () => postItemWithAuthorization(testUrl, mockAuthorization, {}),
        () => deleteItemWithAuthorization(testUrl, mockAuthorization),
      ];

      // Mock successful responses for all operations
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });

      for (const operation of operations) {
        await operation();
        expect(mockAuthorization).toHaveBeenCalled();
        vi.clearAllMocks();
      }
    });

    test('should preserve authorization modifications across operations', async () => {
      const customAuth: Authorization = (request) => ({
        ...request,
        headers: new Headers({
          ...Object.fromEntries((request.headers as Headers)?.entries() || []),
          authorization: 'Bearer custom-token',
          'x-custom-header': 'custom-value',
        }),
      });

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });

      await getItemWithAuthorization(testUrl, customAuth);

      const fetchCall = mockFetch.mock.calls[0];
      const requestHeaders = fetchCall[1].headers as Headers;

      expect(requestHeaders.get('authorization')).toBe('Bearer custom-token');
      expect(requestHeaders.get('x-custom-header')).toBe('custom-value');
    });
  });

  describe('error handling edge cases', () => {
    test('should handle fetch throwing non-Error objects', async () => {
      mockFetch.mockRejectedValueOnce('String error');

      await expect(
        listItemsWithAuthorization(testUrl, mockAuthorization)
      ).rejects.toThrow(HttpError);
    });

    test('should handle malformed JSON responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.reject(new Error('Invalid JSON')),
      });

      await expect(
        getItemWithAuthorization(testUrl, mockAuthorization)
      ).rejects.toThrow();
    });

    test('should handle response with missing error fields', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({}),
      });

      await expect(
        putItemWithAuthorization(testUrl, mockAuthorization, {})
      ).rejects.toThrow(HttpError);
    });
  });
});
