import { describe, expect, test } from 'vitest';
import {
  MetadataMapPropertySchema,
  MetadataPayloadPropertySchema,
  UpsertMetadataPayloadSchema,
} from './metadata.js';

describe('Common - Metadata', () => {
  describe('Map Property Schema', () => {
    test('should parse a record to a map', async () => {
      const result = MetadataMapPropertySchema.safeParse({
        metadata: { foo: 'bar' },
      });

      // Parse succeeds for valid data
      expect(result.data?.metadata).toBeInstanceOf(Map);
    });

    test('should parse undefined property to a map', async () => {
      const result = MetadataMapPropertySchema.safeParse({
        metadata: undefined,
      });

      // Parse succeeds for valid data
      expect(result.data?.metadata).toBeInstanceOf(Map);
    });

    test('should parse undefined to a map', async () => {
      const result = MetadataMapPropertySchema.safeParse({});

      // Parse succeeds for valid data
      expect(result.data?.metadata).toBeInstanceOf(Map);
    });

    test('should parse map to a map', async () => {
      const result = MetadataMapPropertySchema.safeParse({
        metadata: new Map([['foo', 'bar']]),
      });

      // Parse succeeds for valid data
      expect(result.data?.metadata).toBeInstanceOf(Map);
    });

    test('should parse null to a map', async () => {
      const result = MetadataMapPropertySchema.safeParse({
        metadata: null,
      });

      // Parse succeeds for valid data
      expect(result.data?.metadata).toBeInstanceOf(Map);
    });
  });

  describe('Payload', () => {
    test('should parse map to record', async () => {
      const result = MetadataPayloadPropertySchema.safeParse({
        metadata: new Map<string, string | number>([
          ['foo', 'bar'],
          ['baz', 0],
        ]),
      });

      // Parse succeeds for valid data
      expect(result.data?.metadata?.foo).to.equal('bar');
      expect(result.data?.metadata?.baz).to.equal(0);
    });

    test('should return undefined if map is empty', async () => {
      const result = MetadataPayloadPropertySchema.safeParse({
        metadata: new Map(),
      });

      // Parse succeeds for valid data
      expect(result.data?.metadata).is.undefined;
    });
  });

  describe('Upsert Metadata Payload Schema', () => {
    test('should handle incoming record', async () => {
      const result = UpsertMetadataPayloadSchema.safeParse({
        foo: 'bar',
        bar: 'baz',
      });

      // Parse succeeds for valid data
      expect(result.data?.foo).to.equal('bar');
      expect(result.data?.bar).to.equal('baz');
    });

    test('should handle incoming map', async () => {
      const result = UpsertMetadataPayloadSchema.safeParse(
        new Map([
          ['foo', 'bar'],
          ['bar', 'baz'],
        ])
      );

      // Parse succeeds for valid data
      expect(result.data?.foo).to.equal('bar');
      expect(result.data?.bar).to.equal('baz');
    });

    test('should only allow 10 items', async () => {
      const result = UpsertMetadataPayloadSchema.safeParse(
        new Map([
          ['1', '1'],
          ['2', '2'],
          ['3', '3'],
          ['4', '4'],
          ['5', '5'],
          ['6', '6'],
          ['7', '7'],
          ['8', '8'],
          ['9', '9'],
          ['10', '10'],
          ['11', '11'],
        ])
      );

      expect(result.success).toBe(false);
    });
  });

  describe('Map Property Schema', () => {
    test('should parse map to record', async () => {
      const result = MetadataMapPropertySchema.safeParse({
        metadata: {
          foo: 'bar',
          bar: 'baz',
        },
      });

      // Parse succeeds for valid data
      expect(result.data?.metadata?.get('foo')).to.equal('bar');
      expect(result.data?.metadata?.get('bar')).to.equal('baz');
    });
  });
});
