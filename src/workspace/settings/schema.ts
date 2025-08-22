import { z } from 'zod';
import { OptionalDatePayloadSchema } from '../../common/schema/dates.js';
import { MetadataPayloadPropertySchema } from '../../common/schema/metadata.js';

/**
 * This isn't really being used yet...but some general settings would go here
 */
export const SettingsPayloadSchema = z.object({
  updatedAt: OptionalDatePayloadSchema.optional(),
  deletedAt: OptionalDatePayloadSchema.optional(),
  deactivatedAt: OptionalDatePayloadSchema.optional(),
  ...MetadataPayloadPropertySchema.shape,
});
export type SettingsPayload = z.output<typeof SettingsPayloadSchema>;

export const UpsertSettingsPayloadSchema = MetadataPayloadPropertySchema;
export type UpsertSettingsPayload = z.output<
  typeof UpsertSettingsPayloadSchema
>;
