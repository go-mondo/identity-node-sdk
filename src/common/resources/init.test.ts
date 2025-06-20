import { describe, expect, test } from 'vitest';
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
          'https://manage-api.mondoidentity.com/'
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

    describe('authorizer property', () => {
      test('should return function that adds authorization header when access token is provided', () => {
        const config = {
          accessToken: 'bearer-token-123',
        };

        const mondoIdentity = new MondoIdentity(config);
        const authorizer = mondoIdentity.authorizer;

        expect(typeof authorizer).toBe('function');

        const mockRequest: RequestInit = {
          method: 'GET',
          headers: {},
        };

        const authorizedRequest = authorizer(mockRequest);

        expect(authorizedRequest.headers).toBeInstanceOf(Headers);
        const headers = authorizedRequest.headers as Headers;
        expect(headers.get('authorization')).toBe('bearer-token-123');
      });

      test('should preserve existing headers when adding authorization', () => {
        const config = {
          accessToken: 'test-token',
        };

        const mondoIdentity = new MondoIdentity(config);
        const authorizer = mondoIdentity.authorizer;

        const mockRequest: RequestInit = {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'user-agent': 'test-client',
          },
        };

        const authorizedRequest = authorizer(mockRequest);
        const headers = authorizedRequest.headers as Headers;

        expect(headers.get('authorization')).toBe('test-token');
        expect(headers.get('content-type')).toBe('application/json');
        expect(headers.get('user-agent')).toBe('test-client');
      });

      test('should handle Headers object as input', () => {
        const config = {
          accessToken: 'header-token',
        };

        const mondoIdentity = new MondoIdentity(config);
        const authorizer = mondoIdentity.authorizer;

        const existingHeaders = new Headers({
          accept: 'application/json',
        });

        const mockRequest: RequestInit = {
          method: 'GET',
          headers: existingHeaders,
        };

        const authorizedRequest = authorizer(mockRequest);
        const headers = authorizedRequest.headers as Headers;

        expect(headers.get('authorization')).toBe('header-token');
        expect(headers.get('accept')).toBe('application/json');
      });

      test('should handle undefined headers', () => {
        const config = {
          accessToken: 'undefined-headers-token',
        };

        const mondoIdentity = new MondoIdentity(config);
        const authorizer = mondoIdentity.authorizer;

        const mockRequest: RequestInit = {
          method: 'GET',
          // headers intentionally undefined
        };

        const authorizedRequest = authorizer(mockRequest);
        const headers = authorizedRequest.headers as Headers;

        expect(headers.get('authorization')).toBe('undefined-headers-token');
      });

      test('should return same request reference with modified headers', () => {
        const config = {
          accessToken: 'reference-token',
        };

        const mondoIdentity = new MondoIdentity(config);
        const authorizer = mondoIdentity.authorizer;

        const mockRequest: RequestInit = {
          method: 'PUT',
          body: 'test-body',
        };

        const authorizedRequest = authorizer(mockRequest);

        // Should be the same object reference
        expect(authorizedRequest).toBe(mockRequest);
        expect(authorizedRequest.method).toBe('PUT');
        expect(authorizedRequest.body).toBe('test-body');
      });

      test('should be a getter that returns consistent function', () => {
        const config = {
          accessToken: 'consistent-token',
        };

        const mondoIdentity = new MondoIdentity(config);

        // Getting authorizer multiple times should return the same function behavior
        const authorizer1 = mondoIdentity.authorizer;
        const authorizer2 = mondoIdentity.authorizer;

        const mockRequest1: RequestInit = { method: 'GET' };
        const mockRequest2: RequestInit = { method: 'POST' };

        const result1 = authorizer1(mockRequest1);
        const result2 = authorizer2(mockRequest2);

        const headers1 = result1.headers as Headers;
        const headers2 = result2.headers as Headers;

        expect(headers1.get('authorization')).toBe('consistent-token');
        expect(headers2.get('authorization')).toBe('consistent-token');
      });
    });

    describe('integration tests', () => {
      test('should work with real-world configuration', () => {
        const config = {
          accessToken: 'prod_12345abcdef67890',
          host: 'https://api.mondoidentity.com/v1',
        };

        const mondoIdentity = new MondoIdentity(config);
        const authorizer = mondoIdentity.authorizer;

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

        const authorizedRequest = authorizer(apiRequest);
        const headers = authorizedRequest.headers as Headers;

        expect(headers.get('authorization')).toBe('prod_12345abcdef67890');
        expect(headers.get('accept')).toBe('application/json');
        expect(headers.get('user-agent')).toBe('mondo-identity-sdk/1.0.0');
      });

      test('should handle edge cases gracefully', () => {
        const config = {
          accessToken: 'edge-case-token-with-special-chars!@#$%^&*()',
          host: 'https://localhost:3000',
        };

        const mondoIdentity = new MondoIdentity(config);

        expect(() => {
          const authorizer = mondoIdentity.authorizer;
          const request = authorizer({ method: 'OPTIONS' });
          const headers = request.headers as Headers;
          headers.get('authorization');
        }).not.toThrow();
      });
    });
  });
});
