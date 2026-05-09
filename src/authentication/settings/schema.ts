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
  MetadataRecordPropertySchema,
  UpsertMetadataPropertySchema,
} from '../../common/schema/metadata.js';
import { AuthenticationFactorsSchema } from '../factors/schema.js';

export const SettingsSchema = z.object({
  factors: AuthenticationFactorsSchema.optional(),
  updatedAt: OptionalDateSchema,
  ...DeletedAtPropertySchema.shape,
  ...DeactivatedAtPropertySchema.shape,
  ...MetadataMapPropertySchema.shape,
});
export type SettingsProperties = z.input<typeof SettingsSchema>;
export type Settings = z.output<typeof SettingsSchema>;

export const SettingsPayloadSchema = z.object({
  factors: AuthenticationFactorsSchema.optional(),
  updatedAt: OptionalDatePayloadSchema,
  ...DeletedAtPropertyPayloadSchema.shape,
  ...DeactivatedAtPropertyPayloadSchema.shape,
  ...MetadataRecordPropertySchema.shape,
});
export type SettingsPayload = z.output<typeof SettingsPayloadSchema>;

export const UpsertSettingsPayloadSchema = z.object({
  factors: AuthenticationFactorsSchema.optional(),
  ...UpsertMetadataPropertySchema.shape,
});
export type UpsertSettingsInput = z.input<typeof UpsertSettingsPayloadSchema>;
export type UpsertSettingsPayload = z.output<
  typeof UpsertSettingsPayloadSchema
>;
