import { beforeEach, describe, expect, test, vi } from 'vitest';
import type { MondoInstance } from '../../common/resources/init.js';
import { RegistrationResources } from './resources.js';

describe('App Registration Resources', () => {
  let mockInstance: MondoInstance;
  let registrationResources: RegistrationResources;

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock MondoInstance instance
    mockInstance = {
      baseUrl: new URL('https://api.example.com'),
      config: {
        host: 'https://api.example.com',
        accessToken: 'test-token',
      },
      authorize: vi.fn((req) => req),
    } as unknown as MondoInstance;

    registrationResources = new RegistrationResources(mockInstance);
  });

  describe('RegistrationResources class', () => {
    test('should initialize with MondoInstance instance', () => {
      expect(registrationResources).toBeInstanceOf(RegistrationResources);
      // biome-ignore lint/complexity/useLiteralKeys: <explanation>
      expect(registrationResources['instance']).toBe(mockInstance);
    });

    describe('buildPath static method', () => {
      test('should build path with app ID', () => {
        const path = RegistrationResources.buildPath('app_123');
        expect(path).toBe('/v1/apps/app_123/registration');
      });

      test('should return existing path if ID already starts with /v1/apps', () => {
        const existingPath = '/v1/apps/app_456/custom/path';
        const path = RegistrationResources.buildPath(existingPath);
        expect(path).toBe(existingPath);
      });

      test('should handle empty ID', () => {
        const path = RegistrationResources.buildPath('');
        expect(path).toBe('/v1/apps/registration');
      });

      test('should handle undefined ID', () => {
        const path = RegistrationResources.buildPath(
          undefined as unknown as string
        );
        expect(path).toBe('/v1/apps/registration');
      });

      test('should filter out falsy values correctly', () => {
        const path = RegistrationResources.buildPath('app_789');
        expect(path).toBe('/v1/apps/app_789/registration');
      });

      test('should handle various app ID patterns', () => {
        const testCases = [
          { input: 'app_12345', expected: '/v1/apps/app_12345/registration' },
          {
            input: 'app_production',
            expected: '/v1/apps/app_production/registration',
          },
          {
            input: 'app_test_env',
            expected: '/v1/apps/app_test_env/registration',
          },
          { input: '/v1/apps/existing', expected: '/v1/apps/existing' },
          { input: '/v1/apps/nested/path', expected: '/v1/apps/nested/path' },
        ];

        for (const { input, expected } of testCases) {
          expect(RegistrationResources.buildPath(input)).toBe(expected);
        }
      });
    });

    describe('method signatures', () => {
      test('should have getItem method', () => {
        expect(typeof registrationResources.getItem).toBe('function');
        expect(registrationResources.getItem.length).toBe(1); // id parameter
      });

      test('should have upsertItem method', () => {
        expect(typeof registrationResources.upsertItem).toBe('function');
        expect(registrationResources.upsertItem.length).toBe(2); // id and item parameters
      });
    });
  });

  describe('PATH integration', () => {
    test('should use correct base PATH from parent resources', async () => {
      const { PATH } = await import('../resources.js');
      expect(PATH).toBe('/v1/apps');

      // Verify the registration path builds from the base PATH
      const appId = 'app_test';
      const registrationPath = RegistrationResources.buildPath(appId);
      expect(registrationPath).toBe(`${PATH}/${appId}/registration`);
    });
  });

  describe('RESOURCE constant', () => {
    test('should construct paths with registration resource', () => {
      const appId = 'app_example';
      const path = RegistrationResources.buildPath(appId);
      expect(path).toContain('/registration');
      expect(path.endsWith('/registration')).toBe(true);
    });
  });

  describe('URL building scenarios', () => {
    test('should create proper URL structure for different app types', () => {
      const scenarios = [
        {
          appId: 'app_web_frontend',
          expected: '/v1/apps/app_web_frontend/registration',
        },
        {
          appId: 'app_mobile_ios',
          expected: '/v1/apps/app_mobile_ios/registration',
        },
        {
          appId: 'app_api_gateway',
          expected: '/v1/apps/app_api_gateway/registration',
        },
        {
          appId: 'app_enterprise_sso',
          expected: '/v1/apps/app_enterprise_sso/registration',
        },
      ];

      for (const { appId, expected } of scenarios) {
        const result = RegistrationResources.buildPath(appId);
        expect(result).toBe(expected);
        expect(result).toMatch(/^\/v1\/apps\/.*\/registration$/);
      }
    });

    test('should handle edge cases in path building', () => {
      // Test with already formatted paths
      expect(
        RegistrationResources.buildPath('/v1/apps/already/formatted')
      ).toBe('/v1/apps/already/formatted');

      // Test with empty string
      expect(RegistrationResources.buildPath('')).toBe('/v1/apps/registration');

      // Test with null/undefined
      expect(RegistrationResources.buildPath(null as unknown as string)).toBe(
        '/v1/apps/registration'
      );

      expect(
        RegistrationResources.buildPath(undefined as unknown as string)
      ).toBe('/v1/apps/registration');
    });

    test('should create valid URL paths for various app patterns', () => {
      const appPatterns = [
        'app_development_env',
        'app_staging_v2',
        'app_production_main',
        'app_testing_sandbox',
        'app_demo_instance',
      ];

      for (const appId of appPatterns) {
        const path = RegistrationResources.buildPath(appId);
        expect(path).toBe(`/v1/apps/${appId}/registration`);
        expect(path).toMatch(/^\/v1\/apps\/app_.*\/registration$/);
      }
    });
  });

  describe('Integration with MondoInstance instance', () => {
    test('should store MondoInstance instance internally', () => {
      // biome-ignore lint/complexity/useLiteralKeys: <explanation>
      const internalInstance = registrationResources['instance'];
      expect(internalInstance).toBe(mockInstance);
      expect(internalInstance.baseUrl.toString()).toBe(
        'https://api.example.com/'
      );
    });

    test('should maintain reference to authorize function', () => {
      // biome-ignore lint/complexity/useLiteralKeys: <explanation>
      const internalInstance = registrationResources['instance'];
      expect(typeof internalInstance.authorize).toBe('function');
      expect(internalInstance.authorize).toBe(mockInstance.authorize);
    });

    test('should work with different MondoInstance configurations', () => {
      const customInstance = {
        baseUrl: new URL('https://custom-registration.api.com'),
        config: {
          host: 'https://custom-registration.api.com',
          accessToken: 'custom-registration-token',
        },
        authorize: vi.fn(),
      } as unknown as MondoInstance;

      const customResources = new RegistrationResources(customInstance);
      // biome-ignore lint/complexity/useLiteralKeys: <explanation>
      expect(customResources['instance']).toBe(customInstance);
      // biome-ignore lint/complexity/useLiteralKeys: <explanation>
      expect(customResources['instance'].baseUrl.toString()).toBe(
        'https://custom-registration.api.com/'
      );
    });
  });

  describe('Class structure and inheritance', () => {
    test('should have proper class structure', () => {
      expect(RegistrationResources).toBeDefined();
      expect(typeof RegistrationResources).toBe('function');
      expect(RegistrationResources.prototype.constructor).toBe(
        RegistrationResources
      );
    });

    test('should have static buildPath method', () => {
      expect(typeof RegistrationResources.buildPath).toBe('function');
      expect(RegistrationResources.buildPath).toBeDefined();
    });

    test('should have instance methods for registration operations', () => {
      const methods: Array<keyof RegistrationResources> = [
        'getItem',
        'upsertItem',
      ];

      for (const methodName of methods) {
        expect(typeof registrationResources[methodName]).toBe('function');
        expect(registrationResources[methodName]).toBeDefined();
      }
    });

    test('should maintain method binding', () => {
      const { getItem, upsertItem } = registrationResources;

      expect(typeof getItem).toBe('function');
      expect(typeof upsertItem).toBe('function');
    });
  });

  describe('Registration operation method signatures', () => {
    test('should have correct parameter counts for each method', () => {
      // getItem(id: string)
      expect(registrationResources.getItem.length).toBe(1);

      // upsertItem(id: string, item: UpsertRegistrationInput)
      expect(registrationResources.upsertItem.length).toBe(2);
    });

    test('should support registration-specific workflow pattern', () => {
      // This test verifies the class provides the expected registration interface
      // without actually calling the methods (which would require complex mocking)

      const registrationMethods = {
        read: 'getItem',
        upsert: 'upsertItem',
      };

      // Read operation
      expect(registrationResources).toHaveProperty(registrationMethods.read);

      // Upsert operation (create or update)
      expect(registrationResources).toHaveProperty(registrationMethods.upsert);
    });
  });

  describe('Path construction behavior', () => {
    test('should properly filter out falsy values in path construction', () => {
      const falsyValues = [null, undefined, ''];

      for (const value of falsyValues) {
        const path = RegistrationResources.buildPath(value as string);
        expect(path).toBe('/v1/apps/registration');
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
        const path = RegistrationResources.buildPath(id);
        expect(path).toBe(`/v1/apps/${id}/registration`);
      }
    });

    test('should maintain consistent path structure', () => {
      const testIds = [
        'app_simple',
        'app_complex_id_with_many_parts',
        'app_short',
        'app_with_numbers_123_456',
      ];

      for (const id of testIds) {
        const path = RegistrationResources.buildPath(id);

        // Should start with /v1/apps
        expect(path.startsWith('/v1/apps/')).toBe(true);

        // Should end with /registration
        expect(path.endsWith('/registration')).toBe(true);

        // Should contain the app ID
        expect(path).toContain(id);

        // Should match the expected format
        expect(path).toBe(`/v1/apps/${id}/registration`);
      }
    });
  });
});
