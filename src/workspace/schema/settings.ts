import { type } from 'arktype';
import { OptionalDatePayloadSchema } from '../../common/schema/dates.js';
import { MetadataPayloadPropertySchema } from '../../common/schema/metadata.js';

/**
 * This isn't really being used yet...but some general settings would go here
 */
export const SettingsPayloadSchema = type({
  'updatedAt?': OptionalDatePayloadSchema,
  'deletedAt?': OptionalDatePayloadSchema,
  'deactivatedAt?': OptionalDatePayloadSchema,
}).and(MetadataPayloadPropertySchema);
export type SettingsPayload = typeof SettingsPayloadSchema.inferOut;

export const UpsertSettingsPayloadSchema = MetadataPayloadPropertySchema;
export type UpsertSettingsPayload = typeof UpsertSettingsPayloadSchema.inferOut;
