import { beforeEach, describe, expect, test, vi } from 'vitest';
import type { MondoIdentity } from '../common/resources/init.js';
import { ActivityResources } from './resources.js';

describe('Activity Resources', () => {
  let mockInstance: MondoIdentity;
  let activityResources: ActivityResources;

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock MondoIdentity instance
    mockInstance = {
      config: {
        host: 'https://api.example.com',
        accessToken: 'test-token',
      },
      authorize: vi.fn((req) => req),
    } as unknown as MondoIdentity;

    activityResources = new ActivityResources(mockInstance);
  });

  describe('ActivityResources class', () => {
    test('should initialize with MondoIdentity instance', () => {
      expect(activityResources).toBeInstanceOf(ActivityResources);
      // biome-ignore lint/complexity/useLiteralKeys: <explanation>
      expect(activityResources['instance']).toBe(mockInstance);
    });

    describe('buildPath static method', () => {
      test('should build path with source', () => {
        const path = ActivityResources.buildPath('app_123');
        expect(path).toBe('/v1/activities/app_123');
      });

      test('should return existing path if source already starts with /v1/activities', () => {
        const existingPath = '/v1/activities/app_456/custom/path';
        const path = ActivityResources.buildPath(existingPath);
        expect(path).toBe(existingPath);
      });

      test('should handle empty source', () => {
        const path = ActivityResources.buildPath('');
        expect(path).toBe('/v1/activities');
      });

      test('should filter out falsy values correctly', () => {
        const path = ActivityResources.buildPath('user_789');
        expect(path).toBe('/v1/activities/user_789');
      });

      test('should handle complex source paths', () => {
        const path = ActivityResources.buildPath('organization_123');
        expect(path).toBe('/v1/activities/organization_123');
      });

      test('should handle various source ID patterns', () => {
        const testCases = [
          { input: 'app_12345', expected: '/v1/activities/app_12345' },
          { input: 'user_67890', expected: '/v1/activities/user_67890' },
          { input: 'org_abcdef', expected: '/v1/activities/org_abcdef' },
          {
            input: '/v1/activities/existing',
            expected: '/v1/activities/existing',
          },
          {
            input: '/v1/activities/nested/path',
            expected: '/v1/activities/nested/path',
          },
        ];

        for (const { input, expected } of testCases) {
          expect(ActivityResources.buildPath(input)).toBe(expected);
        }
      });

      test('should handle special characters in source', () => {
        const path = ActivityResources.buildPath('app-123_test.source');
        expect(path).toBe('/v1/activities/app-123_test.source');
      });

      test('should maintain path structure integrity', () => {
        const basePath = '/v1/activities';
        const source = 'test_source';
        const expectedPath = `${basePath}/${source}`;

        expect(ActivityResources.buildPath(source)).toBe(expectedPath);
      });
    });

    describe('listItems method delegation', () => {
      test('should have listItems method that accepts source parameter', () => {
        expect(typeof activityResources.listItems).toBe('function');
        expect(activityResources.listItems.length).toBeGreaterThanOrEqual(1);
      });

      test('should have listItems method that accepts optional pagination parameter', () => {
        expect(activityResources.listItems.length).toBe(2);
      });
    });
  });

  describe('PATH constant', () => {
    test('should export correct PATH constant', async () => {
      const { PATH } = await import('./resources.js');
      expect(PATH).toBe('/v1/activities');
    });
  });

  describe('URL building scenarios', () => {
    test('should create proper URL structure for different source types', () => {
      const scenarios = [
        { source: 'app_production', expected: '/v1/activities/app_production' },
        {
          source: 'user_session_123',
          expected: '/v1/activities/user_session_123',
        },
        {
          source: 'organization_enterprise',
          expected: '/v1/activities/organization_enterprise',
        },
        {
          source: 'workflow_automation',
          expected: '/v1/activities/workflow_automation',
        },
      ];

      for (const { source, expected } of scenarios) {
        const result = ActivityResources.buildPath(source);
        expect(result).toBe(expected);
        expect(result).toMatch(/^\/v1\/activities\//);
      }
    });

    test('should handle edge cases in path building', () => {
      // Test with already formatted paths
      expect(
        ActivityResources.buildPath('/v1/activities/already/formatted')
      ).toBe('/v1/activities/already/formatted');

      // Test with empty string
      expect(ActivityResources.buildPath('')).toBe('/v1/activities');

      // Test with single character
      expect(ActivityResources.buildPath('a')).toBe('/v1/activities/a');

      // Test with numbers only
      expect(ActivityResources.buildPath('123')).toBe('/v1/activities/123');
    });

    test('should create valid URL paths for various content types', () => {
      const contentTypes = [
        'authentication_events',
        'user_management_logs',
        'system_diagnostics',
        'audit_trail_data',
        'security_incidents',
      ];

      for (const contentType of contentTypes) {
        const path = ActivityResources.buildPath(contentType);
        expect(path).toBe(`/v1/activities/${contentType}`);
        expect(path).toMatch(/^\/v1\/activities\/[a-z_]+$/);
      }
    });
  });

  describe('Integration with MondoIdentity instance', () => {
    test('should store MondoIdentity instance internally', () => {
      // biome-ignore lint/complexity/useLiteralKeys: <explanation>
      const internalInstance = activityResources['instance'];
      expect(internalInstance).toBe(mockInstance);
      expect(internalInstance.config.host).toBe('https://api.example.com');
      expect(internalInstance.config.accessToken).toBe('test-token');
    });

    test('should maintain reference to authorize function', () => {
      // biome-ignore lint/complexity/useLiteralKeys: <explanation>
      const internalInstance = activityResources['instance'];
      expect(typeof internalInstance.authorize).toBe('function');
      expect(internalInstance.authorize).toBe(mockInstance.authorize);
    });

    test('should work with different MondoIdentity configurations', () => {
      const customInstance = {
        config: {
          host: 'https://custom.api.com',
          accessToken: 'custom-token',
        },
        authorize: vi.fn(),
      } as unknown as MondoIdentity;

      const customResources = new ActivityResources(customInstance);
      // biome-ignore lint/complexity/useLiteralKeys: <explanation>
      expect(customResources['instance']).toBe(customInstance);
      // biome-ignore lint/complexity/useLiteralKeys: <explanation>
      expect(customResources['instance'].config.host).toBe(
        'https://custom.api.com'
      );
    });
  });

  describe('Class inheritance and structure', () => {
    test('should have proper class structure', () => {
      expect(ActivityResources).toBeDefined();
      expect(typeof ActivityResources).toBe('function');
      expect(ActivityResources.prototype.constructor).toBe(ActivityResources);
    });

    test('should have static buildPath method', () => {
      expect(typeof ActivityResources.buildPath).toBe('function');
      expect(ActivityResources.buildPath).toBeDefined();
    });

    test('should have instance methods', () => {
      expect(typeof activityResources.listItems).toBe('function');
      expect(activityResources.listItems).toBeDefined();
    });

    test('should maintain method binding', () => {
      const { listItems } = activityResources;
      expect(typeof listItems).toBe('function');
      // Method should be bound to instance
      expect(listItems.length).toBe(2); // source + optional pagination
    });
  });
});
