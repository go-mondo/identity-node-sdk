import * as z from 'zod/v4';

/**
 * Metadata values supported by the public API.
 *
 * Metadata is intentionally limited to primitive scalar values so it can be
 * represented consistently as either a JavaScript `Map` or a JSON object.
 */
export const MetadataValueSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
]);
type MetadataValue = z.output<typeof MetadataValueSchema>;

/**
 * JSON-object representation of metadata.
 */
export type MetadataRecord = Record<string, MetadataValue>;

/**
 * Runtime `Map` representation of metadata.
 */
export type MetadataMap = Map<string, MetadataValue>;

type MetadataInput = MetadataMap | MetadataRecord | undefined | null;

/**
 * Input
 */
const MetadataRecordInputSchema = z.record(z.string(), MetadataValueSchema);
const MetadataMapInputSchema = z.map(z.string(), MetadataValueSchema);
const MetadataInputSchema = z.union([
  z.undefined(),
  z.null(),
  MetadataMapInputSchema,
  MetadataRecordInputSchema,
]);

function isMetadataMap(input: unknown): input is MetadataMap {
  return input instanceof Map;
}

function transformToMetadataMap(input: MetadataInput): MetadataMap {
  if (input == null) {
    return new Map<string, MetadataValue>();
  }
  if (isMetadataMap(input)) {
    return new Map<string, MetadataValue>(input);
  }
  return new Map(Object.entries(input));
}

function transformToMetadataRecord(input: MetadataInput): MetadataRecord {
  if (input == null) {
    return {};
  }
  if (!isMetadataMap(input)) {
    return input;
  }

  return Array.from(input.entries()).reduce((result, [key, value]) => {
    if (value == null || value === '') {
      return result;
    }

    Object.assign(result, { [key]: value });

    return result;
  }, {} as MetadataRecord);
}

function emptyRecordToUndefined(
  record: MetadataRecord
): MetadataRecord | undefined {
  return Object.keys(record).length ? record : undefined;
}

function emptyRecordToNull(
  record: MetadataRecord | undefined
): MetadataRecord | null | undefined {
  if (record == null) {
    return record;
  }

  return Object.keys(record).length ? record : null;
}

function hasTenOrFewerItems(record: MetadataRecord | undefined | null) {
  return !record || Object.keys(record).length <= 10;
}

const metadataItemsLimitConfig = {
  message: 'Metadata must have 10 items or less',
};

/**
 * Parses metadata into a `Map`.
 *
 * Accepts `null`, `undefined`, metadata records, and metadata maps. Nullish
 * input is normalized to an empty `Map`.
 */
export const MetadataMapSchema = MetadataInputSchema.transform(
  transformToMetadataMap
);
export type MetadataMapInput = z.input<typeof MetadataMapSchema>;

/**
 * Parses metadata into a record.
 *
 * Accepts `null`, `undefined`, metadata records, and metadata maps. Nullish
 * input is normalized to `{}`. Empty string values are removed when converting
 * from a `Map`, matching the payload builder behavior.
 *
 * Metadata records are limited to 10 items.
 */
export const MetadataRecordSchema = MetadataInputSchema.transform(
  transformToMetadataRecord
).refine(hasTenOrFewerItems, metadataItemsLimitConfig);
export type MetadataRecordInput = z.input<typeof MetadataRecordSchema>;

/**
 * Object schema for resource models that expose metadata as a `Map`.
 *
 * Missing, `undefined`, or `null` `metadata` properties are normalized to an
 * empty `Map`.
 */
export const MetadataMapPropertySchema = z.object({
  metadata: MetadataMapSchema.optional().transform(
    (metadata) => metadata ?? new Map<string, MetadataValue>()
  ),
});
export type MetadataMapProperty = z.output<typeof MetadataMapPropertySchema>;

/**
 * Object schema for payloads that expose metadata as a record.
 *
 * Missing, `undefined`, `null`, and empty `metadata` properties are normalized
 * to `undefined` so empty metadata is omitted from serialized payloads.
 */
export const MetadataRecordPropertySchema = z.object({
  metadata: MetadataRecordSchema.optional().transform((metadata) =>
    metadata ? emptyRecordToUndefined(metadata) : undefined
  ),
});
export type MetadataRecordPropertyInput = z.input<
  typeof MetadataRecordPropertySchema
>;
export type MetadataRecordProperty = z.output<
  typeof MetadataRecordPropertySchema
>;

/**
 * Object schema for upsert payloads that expose metadata as a record.
 *
 * Missing or `undefined` `metadata` stays `undefined`. Explicitly empty or
 * `null` metadata is normalized to `null`, allowing callers to clear existing
 * metadata.
 */
export const UpsertMetadataPropertySchema = z.object({
  metadata: MetadataRecordSchema.optional().transform(emptyRecordToNull),
});
export type UpsertMetadataPropertyInput = z.input<
  typeof UpsertMetadataPropertySchema
>;
export type UpsertMetadataProperty = z.output<
  typeof UpsertMetadataPropertySchema
>;

/**
 * Builds a serialized metadata payload from a map or record.
 *
 * Empty maps are returned as `undefined`; map entries with empty-string values
 * are omitted.
 */
export function buildMetadataPayload(
  map: MetadataMap | MetadataRecord
): MetadataRecord | undefined {
  return emptyRecordToUndefined(transformToMetadataRecord(map));
}

/**
 * Builds an upsert metadata payload from a map or record.
 *
 * Empty maps are returned as `null`; map entries with empty-string values are
 * omitted. Use this for update/upsert flows where `null` means "clear".
 */
export function buildUpsertMetadataPayload(
  map: MetadataMap | MetadataRecord
): MetadataRecord | null {
  return emptyRecordToNull(transformToMetadataRecord(map)) ?? null;
}

/**
 * Builds an upsert metadata payload from metadata entries.
 *
 * Returns `null` for `null`, empty iterables, or iterables whose values are all
 * empty strings.
 */
export function buildUpsertMetadataPayloadFromIterable(
  metadata: Iterable<[string, string | number | boolean]> | null
): MetadataRecord | null {
  if (metadata == null) {
    return null;
  }

  const result = Array.from(metadata).reduce((result, [key, value]) => {
    if (value == null || value === '') {
      return result;
    }

    Object.assign(result, { [key]: value });

    return result;
  }, {} as MetadataRecord);

  return Object.keys(result).length ? result : null;
}
