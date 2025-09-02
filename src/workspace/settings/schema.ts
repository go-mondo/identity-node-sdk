import * as z from 'zod/v4';
import {
  DeactivatedAtPropertyPayloadSchema,
  DeactivatedAtPropertySchema,
  DeletedAtPropertyPayloadSchema,
  DeletedAtPropertySchema,
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
  ...DeletedAtPropertySchema.shape,
  ...DeactivatedAtPropertySchema.shape,
  ...MetadataMapPropertySchema.shape,
});
export type SettingsProperties = z.input<typeof SettingsSchema>;
export type Settings = z.output<typeof SettingsSchema>;

export const SettingsPayloadSchema = z.object({
  updatedAt: OptionalDatePayloadSchema,
  ...DeletedAtPropertyPayloadSchema.shape,
  ...DeactivatedAtPropertyPayloadSchema.shape,
  ...MetadataPayloadPropertySchema.shape,
});
export type SettingsPayload = z.output<typeof SettingsPayloadSchema>;

export const UpsertSettingsPayloadSchema = MetadataPayloadPropertySchema;
export type UpsertSettingsPayload = z.output<
  typeof UpsertSettingsPayloadSchema
>;
