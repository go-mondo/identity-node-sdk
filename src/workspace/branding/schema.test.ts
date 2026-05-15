import { describe, expect, test } from 'vitest';
import {
  BrandingPayloadSchema,
  BrandingSchema,
  UpsertBrandingPayloadSchema,
} from './schema.js';

describe('Workspace Branding - Schema', () => {
  describe('BrandingSchema', () => {
    test('should accept complete branding settings', () => {
      const updatedAt = new Date();
      const branding = {
        logo: {
          dark: 'https://assets.example.com/logo-dark.png',
          light: 'https://assets.example.com/logo-light.png',
          email: 'https://assets.example.com/logo-email.png',
        },
        color: {
          link: '#1f6feb',
          linkHover: '#0a58ca',
        },
        updatedAt,
        deletedAt: new Date(),
        deactivatedAt: new Date(),
        metadata: {
          brandVersion: '2026.01',
        },
      };

      const result = BrandingSchema.safeParse(branding);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.logo?.dark).toBe(branding.logo.dark);
        expect(result.data.color?.linkHover).toBe(branding.color.linkHover);
        expect(result.data.metadata).toBeInstanceOf(Map);
        expect(result.data.metadata.get('brandVersion')).toBe('2026.01');
      }
    });

    test('should accept empty branding settings', () => {
      const result = BrandingSchema.safeParse({});

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.logo).toBeUndefined();
        expect(result.data.color).toBeUndefined();
        expect(result.data.metadata).toBeInstanceOf(Map);
      }
    });

    test('should reject invalid logo URLs', () => {
      const result = BrandingSchema.safeParse({
        logo: {
          dark: 'not-a-url',
        },
      });

      expect(result.success).toBe(false);
    });
  });

  describe('BrandingPayloadSchema', () => {
    test('should serialize dates and metadata for payloads', () => {
      const updatedAt = new Date('2026-02-01T00:00:00.000Z');
      const result = BrandingPayloadSchema.safeParse({
        logo: {
          dark: 'https://assets.example.com/logo-dark.png',
        },
        updatedAt,
        metadata: new Map<string, string>([['source', 'dashboard']]),
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.updatedAt).toBe(updatedAt.toISOString());
        expect(result.data.metadata).toEqual({ source: 'dashboard' });
      }
    });
  });

  describe('UpsertBrandingPayloadSchema', () => {
    test('should accept partial branding updates', () => {
      const result = UpsertBrandingPayloadSchema.safeParse({
        color: {
          link: '#005fcc',
        },
        metadata: {
          updatedBy: 'admin',
        },
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.color?.link).toBe('#005fcc');
        expect(result.data.metadata).toEqual({ updatedBy: 'admin' });
      }
    });

    test('should normalize empty metadata to null', () => {
      const result = UpsertBrandingPayloadSchema.safeParse({
        metadata: {},
      });

      expect(result.success).toBe(true);
      expect(result.data?.metadata).toBeNull();
    });
  });
});
