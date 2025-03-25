import { type } from 'arktype';
import { OptionalDatePayloadSchema } from '../../common/schema/dates.js';
import { UpsertMetadataPayloadPropertySchema } from '../../common/schema/metadata.js';

const TableSchema = type({
  columns: type('string').array().optional(),
});

const TablesSchema = type.Record('string', TableSchema);

const BaseAttributes = type({
  views: TablesSchema.optional(),
});

export const UserPreferencesPayloadSchema = BaseAttributes.and({
  'updatedAt?': OptionalDatePayloadSchema,
  'deletedAt?': OptionalDatePayloadSchema,
  'deactivatedAt?': OptionalDatePayloadSchema,
}).and(UpsertMetadataPayloadPropertySchema);
export type UserPreferencesPayload =
  typeof UserPreferencesPayloadSchema.inferOut;

export const UpsertUserPreferencesPayloadSchema = BaseAttributes.and(
  UpsertMetadataPayloadPropertySchema
);
export type UpsertUserPreferencesPayload =
  typeof UpsertUserPreferencesPayloadSchema.inferOut;
