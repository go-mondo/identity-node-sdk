import { z } from 'zod';
import {
  OptionalDatePayloadSchema,
  OptionalDateSchema,
} from '../../common/schema/dates.js';
import {
  MetadataMapPropertySchema,
  MetadataPayloadPropertySchema,
} from '../../common/schema/metadata.js';

/**
 * This isn't really being used yet...but some general settings would go here
 */
export const SettingsSchema = z.object({
  updatedAt: OptionalDateSchema,
  deletedAt: OptionalDateSchema,
  deactivatedAt: OptionalDateSchema,
  ...MetadataMapPropertySchema.shape,
});
export type SettingsProperties = z.input<typeof SettingsSchema>;
export type Settings = z.output<typeof SettingsSchema>;

export const SettingsPayloadSchema = z.object({
  updatedAt: OptionalDatePayloadSchema,
  deletedAt: OptionalDatePayloadSchema,
  deactivatedAt: OptionalDatePayloadSchema,
  ...MetadataPayloadPropertySchema.shape,
});
export type SettingsPayload = z.output<typeof SettingsPayloadSchema>;

export const UpsertSettingsPayloadSchema = MetadataPayloadPropertySchema;
export type UpsertSettingsPayload = z.output<
  typeof UpsertSettingsPayloadSchema
>;
