import { beforeEach, describe, expect, test, vi } from 'vitest';
import type { MondoIdentity } from '../common/resources/init.js';
import { AppResources } from './resources.js';

describe('App Resources', () => {
  let mockInstance: MondoIdentity;
  let appResources: AppResources;

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock MondoIdentity instance
    mockInstance = {
      config: {
        host: 'https://api.example.com',
        accessToken: 'test-token',
      },
      authorizer: vi.fn((req) => req),
    } as unknown as MondoIdentity;

    appResources = new AppResources(mockInstance);
  });

  describe('AppResources class', () => {
    test('should initialize with MondoIdentity instance', () => {
      expect(appResources).toBeInstanceOf(AppResources);
      // biome-ignore lint/complexity/useLiteralKeys: <explanation>
      expect(appResources['instance']).toBe(mockInstance);
    });

    describe('buildPath static method', () => {
      test('should build path without ID', () => {
        const path = AppResources.buildPath();
        expect(path).toBe('/v1/apps');
      });

      test('should build path with app ID', () => {
        const path = AppResources.buildPath('app_123');
        expect(path).toBe('/v1/apps/app_123');
      });

      test('should return existing path if ID already starts with /v1/apps', () => {
        const existingPath = '/v1/apps/app_456/custom/path';
        const path = AppResources.buildPath(existingPath);
        expect(path).toBe(existingPath);
      });

      test('should handle empty ID', () => {
        const path = AppResources.buildPath('');
        expect(path).toBe('/v1/apps');
      });

      test('should handle undefined ID', () => {
        const path = AppResources.buildPath(undefined);
        expect(path).toBe('/v1/apps');
      });

      test('should filter out falsy values correctly', () => {
        const path = AppResources.buildPath('app_789');
        expect(path).toBe('/v1/apps/app_789');
      });

      test('should handle various app ID patterns', () => {
        const testCases = [
          { input: 'app_12345', expected: '/v1/apps/app_12345' },
          { input: 'app_production', expected: '/v1/apps/app_production' },
          { input: 'app_test_env', expected: '/v1/apps/app_test_env' },
          { input: '/v1/apps/existing', expected: '/v1/apps/existing' },
          { input: '/v1/apps/nested/path', expected: '/v1/apps/nested/path' },
        ];

        for (const { input, expected } of testCases) {
          expect(AppResources.buildPath(input)).toBe(expected);
        }
      });
    });

    describe('method signatures', () => {
      test('should have listItems method', () => {
        expect(typeof appResources.listItems).toBe('function');
        expect(appResources.listItems.length).toBe(1); // optional pagination parameter
      });

      test('should have getItem method', () => {
        expect(typeof appResources.getItem).toBe('function');
        expect(appResources.getItem.length).toBe(1); // id parameter
      });

      test('should have insertItem method', () => {
        expect(typeof appResources.insertItem).toBe('function');
        expect(appResources.insertItem.length).toBe(1); // item parameter
      });

      test('should have updateItem method', () => {
        expect(typeof appResources.updateItem).toBe('function');
        expect(appResources.updateItem.length).toBe(2); // id and item parameters
      });

      test('should have deleteItem method', () => {
        expect(typeof appResources.deleteItem).toBe('function');
        expect(appResources.deleteItem.length).toBe(1); // id parameter
      });
    });
  });

  describe('PATH constant', () => {
    test('should export correct PATH constant', async () => {
      const { PATH } = await import('./resources.js');
      expect(PATH).toBe('/v1/apps');
    });
  });

  describe('URL building scenarios', () => {
    test('should create proper URL structure for different app types', () => {
      const scenarios = [
        { appId: 'app_web_frontend', expected: '/v1/apps/app_web_frontend' },
        { appId: 'app_mobile_ios', expected: '/v1/apps/app_mobile_ios' },
        { appId: 'app_api_gateway', expected: '/v1/apps/app_api_gateway' },
        {
          appId: 'app_background_worker',
          expected: '/v1/apps/app_background_worker',
        },
      ];

      for (const { appId, expected } of scenarios) {
        const result = AppResources.buildPath(appId);
        expect(result).toBe(expected);
        expect(result).toMatch(/^\/v1\/apps\//);
      }
    });

    test('should handle edge cases in path building', () => {
      // Test with already formatted paths
      expect(AppResources.buildPath('/v1/apps/already/formatted')).toBe(
        '/v1/apps/already/formatted'
      );

      // Test with empty string
      expect(AppResources.buildPath('')).toBe('/v1/apps');

      // Test with undefined
      expect(AppResources.buildPath(undefined)).toBe('/v1/apps');

      // Test with null
      expect(AppResources.buildPath(null as unknown as string)).toBe(
        '/v1/apps'
      );

      // Test with single character
      expect(AppResources.buildPath('a')).toBe('/v1/apps/a');
    });

    test('should create valid URL paths for various app environments', () => {
      const environments = [
        'app_development',
        'app_staging',
        'app_production',
        'app_testing',
        'app_sandbox',
      ];

      for (const env of environments) {
        const path = AppResources.buildPath(env);
        expect(path).toBe(`/v1/apps/${env}`);
        expect(path).toMatch(/^\/v1\/apps\/app_[a-z]+$/);
      }
    });
  });

  describe('Integration with MondoIdentity instance', () => {
    test('should store MondoIdentity instance internally', () => {
      // biome-ignore lint/complexity/useLiteralKeys: <explanation>
      const internalInstance = appResources['instance'];
      expect(internalInstance).toBe(mockInstance);
      expect(internalInstance.config.host).toBe('https://api.example.com');
      expect(internalInstance.config.accessToken).toBe('test-token');
    });

    test('should maintain reference to authorizer function', () => {
      // biome-ignore lint/complexity/useLiteralKeys: <explanation>
      const internalInstance = appResources['instance'];
      expect(typeof internalInstance.authorizer).toBe('function');
      expect(internalInstance.authorizer).toBe(mockInstance.authorizer);
    });

    test('should work with different MondoIdentity configurations', () => {
      const customInstance = {
        config: {
          host: 'https://custom-apps.api.com',
          accessToken: 'custom-app-token',
        },
        authorizer: vi.fn(),
      } as unknown as MondoIdentity;

      const customResources = new AppResources(customInstance);
      // biome-ignore lint/complexity/useLiteralKeys: <explanation>
      expect(customResources['instance']).toBe(customInstance);
      // biome-ignore lint/complexity/useLiteralKeys: <explanation>
      expect(customResources['instance'].config.host).toBe(
        'https://custom-apps.api.com'
      );
    });
  });

  describe('Class structure and inheritance', () => {
    test('should have proper class structure', () => {
      expect(AppResources).toBeDefined();
      expect(typeof AppResources).toBe('function');
      expect(AppResources.prototype.constructor).toBe(AppResources);
    });

    test('should have static buildPath method', () => {
      expect(typeof AppResources.buildPath).toBe('function');
      expect(AppResources.buildPath).toBeDefined();
    });

    test('should have all CRUD instance methods', () => {
      const methods = [
        'listItems',
        'getItem',
        'insertItem',
        'updateItem',
        'deleteItem',
      ];

      for (const methodName of methods) {
        expect(typeof appResources[methodName as keyof AppResources]).toBe(
          'function'
        );
        expect(appResources[methodName as keyof AppResources]).toBeDefined();
      }
    });

    test('should maintain method binding', () => {
      const { listItems, getItem, insertItem, updateItem, deleteItem } =
        appResources;

      expect(typeof listItems).toBe('function');
      expect(typeof getItem).toBe('function');
      expect(typeof insertItem).toBe('function');
      expect(typeof updateItem).toBe('function');
      expect(typeof deleteItem).toBe('function');
    });
  });

  describe('CRUD operation method signatures', () => {
    test('should have correct parameter counts for each method', () => {
      // listItems(pagination?: Pagination)
      expect(appResources.listItems.length).toBe(1);

      // getItem(id: string)
      expect(appResources.getItem.length).toBe(1);

      // insertItem(item: InsertAppInput)
      expect(appResources.insertItem.length).toBe(1);

      // updateItem(id: string, item: UpdateAppInput)
      expect(appResources.updateItem.length).toBe(2);

      // deleteItem(id: string)
      expect(appResources.deleteItem.length).toBe(1);
    });

    test('should support full CRUD workflow pattern', () => {
      // This test verifies the class provides a complete CRUD interface
      // without actually calling the methods (which would require complex mocking)

      const crudMethods = {
        create: 'insertItem',
        read: ['listItems', 'getItem'],
        update: 'updateItem',
        delete: 'deleteItem',
      };

      // Create operation
      expect(appResources).toHaveProperty(crudMethods.create);

      // Read operations
      for (const method of crudMethods.read) {
        expect(appResources).toHaveProperty(method);
      }

      // Update operation
      expect(appResources).toHaveProperty(crudMethods.update);

      // Delete operation
      expect(appResources).toHaveProperty(crudMethods.delete);
    });
  });

  describe('Path filtering and validation', () => {
    test('should properly filter out falsy values in path construction', () => {
      const falsyValues = [null, undefined, ''];

      for (const value of falsyValues) {
        const path = AppResources.buildPath(value as string);
        expect(path).toBe('/v1/apps');
      }
    });

    test('should handle complex app ID formats', () => {
      const complexIds = [
        'app_complex-name_123',
        'app_with.dots',
        'app_with_multiple_underscores',
        'app-with-dashes',
        'app123numbers',
      ];

      for (const id of complexIds) {
        const path = AppResources.buildPath(id);
        expect(path).toBe(`/v1/apps/${id}`);
      }
    });
  });
});
