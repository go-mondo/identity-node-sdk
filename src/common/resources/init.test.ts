import { describe, expect, test, vi } from 'vitest';
import { type ConfigProps, MondoIdentity } from './init.js';

describe('Common Resources - Init', () => {
  describe('MondoIdentity class', () => {
    describe('constructor', () => {
      test('should initialize with valid config including access token', () => {
        const config = {
          accessToken: 'test-access-token',
          host: 'https://api.example.com',
        };

        const mondoIdentity = new MondoIdentity(config);
        expect(mondoIdentity.config.accessToken).toBe('test-access-token');
        expect(mondoIdentity.config.host.toString()).toBe(`${config.host}/`);
      });

      test('should use default host when not provided', () => {
        const config = {
          accessToken: 'test-access-token',
        };

        const mondoIdentity = new MondoIdentity(config);
        expect(mondoIdentity.config.accessToken).toBe('test-access-token');
        expect(mondoIdentity.config.host.toString()).toBe(
          'https://api.mondoidentity.com/'
        );
      });

      test('should parse URL host correctly', () => {
        const config = {
          accessToken: 'test-token',
          host: 'https://custom-api.domain.com:8080/path',
        };

        const mondoIdentity = new MondoIdentity(config);
        expect(mondoIdentity.config.host.toString()).toBe(config.host);
      });

      test('should throw error when access token is missing', () => {
        const config = {
          host: 'https://api.example.com',
        };

        expect(
          () => new MondoIdentity(config as unknown as ConfigProps)
        ).toThrow('Invalid configuration');
      });

      test('should throw error when access token is empty', () => {
        const config = {
          accessToken: '',
          host: 'https://api.example.com',
        };

        expect(() => new MondoIdentity(config)).toThrow(
          'Invalid configuration'
        );
      });

      test('should throw error when host is invalid URL', () => {
        const config = {
          accessToken: 'test-token',
          host: 'not-a-valid-url',
        };

        expect(() => new MondoIdentity(config)).toThrow(
          'Invalid configuration'
        );
      });

      test('should throw error when host is not a string', () => {
        const config = {
          accessToken: 'test-token',
          host: 123,
        };

        expect(
          () => new MondoIdentity(config as unknown as ConfigProps)
        ).toThrow('Invalid configuration');
      });

      test('should throw error when access token is not a string', () => {
        const config = {
          accessToken: 123,
          host: 'https://api.example.com',
        };

        expect(
          () => new MondoIdentity(config as unknown as ConfigProps)
        ).toThrow('Invalid configuration');
      });

      test('should initialize with an access token provider', () => {
        const accessToken = vi.fn(() => 'provided-token');

        const mondoIdentity = new MondoIdentity({ accessToken });

        expect(mondoIdentity.config.accessToken).toBe(accessToken);
      });
    });

    describe('config property', () => {
      test('should be readonly', () => {
        const config = {
          accessToken: 'test-token',
          host: 'https://api.example.com',
        };

        const mondoIdentity = new MondoIdentity(config);

        // Config should be accessible
        expect(mondoIdentity.config).toBeDefined();
        expect(mondoIdentity.config.accessToken).toBe('test-token');
      });

      test('should preserve original config values', () => {
        const config = {
          accessToken: 'my-secret-token',
          host: 'https://staging-api.mondoidentity.com',
        };

        const mondoIdentity = new MondoIdentity(config);
        expect(mondoIdentity.config.accessToken).toBe('my-secret-token');
        expect(mondoIdentity.config.host).instanceOf(URL);
        expect(mondoIdentity.config.host.toString()).toBe(`${config.host}/`);
      });
    });

    describe('authorize property', () => {
      test('should return function that adds authorization header when access token is provided', async () => {
        const config = {
          accessToken: 'bearer-token-123',
        };

        const mondoIdentity = new MondoIdentity(config);
        const authorize = mondoIdentity.authorize;

        expect(typeof authorize).toBe('function');

        const mockRequest: RequestInit = {
          method: 'GET',
          headers: {},
        };

        const authorizedRequest = await authorize(mockRequest);

        expect(authorizedRequest.headers).toBeInstanceOf(Headers);
        const headers = authorizedRequest.headers as Headers;
        expect(headers.get('authorization')).toBe('bearer-token-123');
      });

      test('should preserve existing headers when adding authorization', async () => {
        const config = {
          accessToken: 'test-token',
        };

        const mondoIdentity = new MondoIdentity(config);
        const authorize = mondoIdentity.authorize;

        const mockRequest: RequestInit = {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'user-agent': 'test-client',
          },
        };

        const authorizedRequest = await authorize(mockRequest);
        const headers = authorizedRequest.headers as Headers;

        expect(headers.get('authorization')).toBe('test-token');
        expect(headers.get('content-type')).toBe('application/json');
        expect(headers.get('user-agent')).toBe('test-client');
      });

      test('should handle Headers object as input', async () => {
        const config = {
          accessToken: 'header-token',
        };

        const mondoIdentity = new MondoIdentity(config);
        const authorize = mondoIdentity.authorize;

        const existingHeaders = new Headers({
          accept: 'application/json',
        });

        const mockRequest: RequestInit = {
          method: 'GET',
          headers: existingHeaders,
        };

        const authorizedRequest = await authorize(mockRequest);
        const headers = authorizedRequest.headers as Headers;

        expect(headers.get('authorization')).toBe('header-token');
        expect(headers.get('accept')).toBe('application/json');
      });

      test('should handle undefined headers', async () => {
        const config = {
          accessToken: 'undefined-headers-token',
        };

        const mondoIdentity = new MondoIdentity(config);
        const authorize = mondoIdentity.authorize;

        const mockRequest: RequestInit = {
          method: 'GET',
          // headers intentionally undefined
        };

        const authorizedRequest = await authorize(mockRequest);
        const headers = authorizedRequest.headers as Headers;

        expect(headers.get('authorization')).toBe('undefined-headers-token');
      });

      test('should return same request reference with modified headers', async () => {
        const config = {
          accessToken: 'reference-token',
        };

        const mondoIdentity = new MondoIdentity(config);
        const authorize = mondoIdentity.authorize;

        const mockRequest: RequestInit = {
          method: 'PUT',
          body: 'test-body',
        };

        const authorizedRequest = await authorize(mockRequest);

        // Should be the same object reference
        expect(authorizedRequest).toBe(mockRequest);
        expect(authorizedRequest.method).toBe('PUT');
        expect(authorizedRequest.body).toBe('test-body');
      });

      test('should expose a consistent function', async () => {
        const config = {
          accessToken: 'consistent-token',
        };

        const mondoIdentity = new MondoIdentity(config);

        const authorize1 = mondoIdentity.authorize;
        const authorize2 = mondoIdentity.authorize;

        const mockRequest1: RequestInit = { method: 'GET' };
        const mockRequest2: RequestInit = { method: 'POST' };

        const result1 = await authorize1(mockRequest1);
        const result2 = await authorize2(mockRequest2);

        const headers1 = result1.headers as Headers;
        const headers2 = result2.headers as Headers;

        expect(headers1.get('authorization')).toBe('consistent-token');
        expect(headers2.get('authorization')).toBe('consistent-token');
      });

      test('should resolve access token providers with authorize options', async () => {
        const accessToken = vi.fn((options) =>
          options?.refresh ? 'refreshed-token' : 'cached-token'
        );
        const mondoIdentity = new MondoIdentity({ accessToken });

        const cachedRequest = await mondoIdentity.authorize({ method: 'GET' });
        const refreshedRequest = await mondoIdentity.authorize(
          { method: 'GET' },
          { refresh: true }
        );

        expect(accessToken).toHaveBeenNthCalledWith(1, undefined);
        expect(accessToken).toHaveBeenNthCalledWith(2, { refresh: true });
        expect((cachedRequest.headers as Headers).get('authorization')).toBe(
          'cached-token'
        );
        expect((refreshedRequest.headers as Headers).get('authorization')).toBe(
          'refreshed-token'
        );
      });

      test('should use the accessToken value from provider token objects', async () => {
        const accessToken = vi.fn(() => ({
          accessToken: 'object-token',
          expiresAt: Date.now() + 60_000,
          scope: 'workspace:read',
          type: 'Bearer',
        }));
        const mondoIdentity = new MondoIdentity({ accessToken });

        const request = await mondoIdentity.authorize({ method: 'GET' });

        expect((request.headers as Headers).get('authorization')).toBe(
          'object-token'
        );
      });
    });

    describe('integration tests', () => {
      test('should work with real-world configuration', async () => {
        const config = {
          accessToken: 'prod_12345abcdef67890',
          host: 'https://api.mondoidentity.com/v1',
        };

        const mondoIdentity = new MondoIdentity(config);
        const authorize = mondoIdentity.authorize;

        // Test configuration
        expect(mondoIdentity.config.accessToken).toBe('prod_12345abcdef67890');
        expect(mondoIdentity.config.host).instanceOf(URL);
        expect(mondoIdentity.config.host.toString()).toBe(config.host);

        // Test authorization
        const apiRequest: RequestInit = {
          method: 'GET',
          headers: {
            accept: 'application/json',
            'user-agent': 'mondo-identity-sdk/1.0.0',
          },
        };

        const authorizedRequest = await authorize(apiRequest);
        const headers = authorizedRequest.headers as Headers;

        expect(headers.get('authorization')).toBe('prod_12345abcdef67890');
        expect(headers.get('accept')).toBe('application/json');
        expect(headers.get('user-agent')).toBe('mondo-identity-sdk/1.0.0');
      });

      test('should handle edge cases gracefully', async () => {
        const config = {
          accessToken: 'edge-case-token-with-special-chars!@#$%^&*()',
          host: 'https://localhost:3000',
        };

        const mondoIdentity = new MondoIdentity(config);

        await expect(async () => {
          const request = await mondoIdentity.authorize({ method: 'OPTIONS' });
          const headers = request.headers as Headers;
          headers.get('authorization');
        }).not.toThrow();
      });
    });
  });
});
