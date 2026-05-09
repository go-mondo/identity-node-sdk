import { describe, expect, test } from 'vitest';
import {
  MetadataMapPropertySchema,
  MetadataMapSchema,
  MetadataRecordPropertySchema,
  MetadataRecordSchema,
  UpsertMetadataPropertySchema,
  buildMetadataPayload,
  buildUpsertMetadataPayload,
  buildUpsertMetadataPayloadFromIterable,
} from './metadata.js';

describe('Common - Metadata', () => {
  describe('MetadataMapSchema', () => {
    test('should parse a record to a map', () => {
      const result = MetadataMapSchema.safeParse({
        enabled: true,
        foo: 'bar',
        version: 2,
      });

      expect(result.data).toBeInstanceOf(Map);
      expect(result.data?.get('foo')).toBe('bar');
      expect(result.data?.get('enabled')).toBe(true);
      expect(result.data?.get('version')).toBe(2);
    });

    test('should parse nullish values to an empty map', () => {
      expect(MetadataMapSchema.parse(undefined).size).toBe(0);
      expect(MetadataMapSchema.parse(null).size).toBe(0);
    });

    test('should parse map to a map', () => {
      const result = MetadataMapSchema.safeParse(new Map([['foo', 'bar']]));

      expect(result.data).toBeInstanceOf(Map);
      expect(result.data?.get('foo')).toBe('bar');
    });

    test('should reject unsupported metadata values', () => {
      const result = MetadataMapSchema.safeParse({
        nested: { unsupported: true },
      });

      expect(result.success).toBe(false);
    });
  });

  describe('MetadataMapPropertySchema', () => {
    test('should parse undefined property to a map', () => {
      const result = MetadataMapPropertySchema.safeParse({
        metadata: undefined,
      });

      expect(result.data?.metadata).toBeInstanceOf(Map);
    });

    test('should parse omitted property to a map', () => {
      const result = MetadataMapPropertySchema.safeParse({});

      expect(result.data?.metadata).toBeInstanceOf(Map);
    });

    test('should parse null property to a map', () => {
      const result = MetadataMapPropertySchema.safeParse({
        metadata: null,
      });

      expect(result.data?.metadata).toBeInstanceOf(Map);
    });

    test('should parse record property to a map', () => {
      const result = MetadataMapPropertySchema.safeParse({
        metadata: {
          foo: 'bar',
          bar: 'baz',
        },
      });

      expect(result.data?.metadata).toBeInstanceOf(Map);
      expect(result.data?.metadata.get('foo')).to.equal('bar');
      expect(result.data?.metadata.get('bar')).to.equal('baz');
    });
  });

  describe('MetadataRecordSchema', () => {
    test('should parse a record to a record', () => {
      const record = {
        active: true,
        count: 4,
        label: 'test',
      };

      expect(MetadataRecordSchema.parse(record)).toEqual(record);
    });

    test('should parse a map to a record', () => {
      const result = MetadataRecordSchema.safeParse(
        new Map<string, string | number>([
          ['foo', 'bar'],
          ['baz', 0],
        ])
      );

      expect(result.data?.foo).to.equal('bar');
      expect(result.data?.baz).to.equal(0);
    });

    test('should parse nullish values to an empty record', () => {
      expect(MetadataRecordSchema.parse(undefined)).toEqual({});
      expect(MetadataRecordSchema.parse(null)).toEqual({});
    });

    test('should omit empty string values from map input', () => {
      const result = MetadataRecordSchema.parse(
        new Map([
          ['empty', ''],
          ['foo', 'bar'],
        ])
      );

      expect(result).toEqual({ foo: 'bar' });
    });

    test('should allow 10 items', () => {
      const result = MetadataRecordSchema.safeParse(
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
        ])
      );

      expect(result.success).toBe(true);
    });

    test('should only allow 10 items', () => {
      const result = MetadataRecordSchema.safeParse(
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

    test('should reject unsupported metadata values', () => {
      const result = MetadataRecordSchema.safeParse(
        new Map<string, unknown>([['nested', { unsupported: true }]])
      );

      expect(result.success).toBe(false);
    });
  });

  describe('MetadataRecordPropertySchema', () => {
    test('should parse map property to record', () => {
      const result = MetadataRecordPropertySchema.safeParse({
        metadata: new Map<string, string | number>([
          ['foo', 'bar'],
          ['baz', 0],
        ]),
      });

      expect(result.data?.metadata?.foo).to.equal('bar');
      expect(result.data?.metadata?.baz).to.equal(0);
    });

    test('should return undefined if map is empty', () => {
      const result = MetadataRecordPropertySchema.safeParse({
        metadata: new Map(),
      });

      expect(result.data?.metadata).is.undefined;
    });

    test('should return undefined if record is empty', () => {
      const result = MetadataRecordPropertySchema.safeParse({
        metadata: {},
      });

      expect(result.data?.metadata).is.undefined;
    });

    test('should return undefined if property is null', () => {
      const result = MetadataRecordPropertySchema.safeParse({
        metadata: null,
      });

      expect(result.data?.metadata).is.undefined;
    });

    test('should return undefined if property is omitted', () => {
      const result = MetadataRecordPropertySchema.safeParse({});

      expect(result.data?.metadata).is.undefined;
    });
  });

  describe('UpsertMetadataPropertySchema', () => {
    test('should handle incoming record', () => {
      const result = UpsertMetadataPropertySchema.safeParse({
        metadata: {
          foo: 'bar',
          bar: 'baz',
        },
      });

      expect(result.data?.metadata?.foo).to.equal('bar');
      expect(result.data?.metadata?.bar).to.equal('baz');
    });

    test('should handle incoming map', () => {
      const result = UpsertMetadataPropertySchema.safeParse({
        metadata: new Map([
          ['foo', 'bar'],
          ['bar', 'baz'],
        ]),
      });

      expect(result.data?.metadata?.foo).to.equal('bar');
      expect(result.data?.metadata?.bar).to.equal('baz');
    });

    test('should return null if map is empty', () => {
      const result = UpsertMetadataPropertySchema.safeParse({
        metadata: new Map(),
      });

      expect(result.data?.metadata).is.null;
    });

    test('should return null if record is empty', () => {
      const result = UpsertMetadataPropertySchema.safeParse({
        metadata: {},
      });

      expect(result.data?.metadata).is.null;
    });

    test('should return null if property is null', () => {
      const result = UpsertMetadataPropertySchema.safeParse({
        metadata: null,
      });

      expect(result.data?.metadata).is.null;
    });

    test('should return undefined if property is omitted', () => {
      const result = UpsertMetadataPropertySchema.safeParse({});

      expect(result.data?.metadata).is.undefined;
    });
  });

  describe('metadata payload builders', () => {
    test('should build omitted payloads from empty metadata', () => {
      expect(buildMetadataPayload(new Map())).toBeUndefined();
      expect(buildMetadataPayload({})).toBeUndefined();
    });

    test('should build record payloads while omitting empty map values', () => {
      const result = buildMetadataPayload(
        new Map<string, string | boolean>([
          ['empty', ''],
          ['enabled', true],
          ['label', 'metadata'],
        ])
      );

      expect(result).toEqual({
        enabled: true,
        label: 'metadata',
      });
    });

    test('should build null upsert payloads from empty metadata', () => {
      expect(buildUpsertMetadataPayload(new Map())).toBeNull();
      expect(buildUpsertMetadataPayload({})).toBeNull();
    });

    test('should build upsert payloads from iterables', () => {
      const result = buildUpsertMetadataPayloadFromIterable([
        ['empty', ''],
        ['retries', 3],
        ['verified', false],
      ]);

      expect(result).toEqual({
        retries: 3,
        verified: false,
      });
    });

    test('should return null for null or empty iterable upsert payloads', () => {
      expect(buildUpsertMetadataPayloadFromIterable(null)).toBeNull();
      expect(buildUpsertMetadataPayloadFromIterable([])).toBeNull();
      expect(
        buildUpsertMetadataPayloadFromIterable([['empty', '']])
      ).toBeNull();
    });
  });
});
