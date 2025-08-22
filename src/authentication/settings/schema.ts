import { z } from 'zod';
import {
  OptionalDatePayloadSchema,
  OptionalDateSchema,
  RequiredDateSchema,
} from '../../common/schema/dates.js';
import {
  MetadataMapPropertySchema,
  MetadataPayloadPropertySchema,
  UpsertMetadataPropertyPayloadSchema,
} from '../../common/schema/metadata.js';
import { AuthenticationFactorsSchema } from '../factors/schema.js';

export const SettingsSchema = z.object({
  factors: AuthenticationFactorsSchema.optional(),
  createdAt: RequiredDateSchema,
  updatedAt: RequiredDateSchema,
  deletedAt: OptionalDateSchema.optional(),
  deactivatedAt: OptionalDateSchema.optional(),
  ...MetadataMapPropertySchema.shape,
});
export type SettingsProperties = z.input<typeof SettingsSchema>;
export type Settings = z.output<typeof SettingsSchema>;

export const SettingsPayloadSchema = z.object({
  factors: AuthenticationFactorsSchema.optional(),
  updatedAt: OptionalDatePayloadSchema.optional(),
  deletedAt: OptionalDatePayloadSchema.optional(),
  deactivatedAt: OptionalDatePayloadSchema.optional(),
  ...MetadataPayloadPropertySchema.shape,
});
export type SettingsPayload = z.output<typeof SettingsPayloadSchema>;

export const UpsertSettingsPayloadSchema = z.object({
  factors: AuthenticationFactorsSchema.optional(),
  ...UpsertMetadataPropertyPayloadSchema.shape,
});
export type UpsertSettingsInput = z.input<typeof UpsertSettingsPayloadSchema>;
export type UpsertSettingsPayload = z.output<
  typeof UpsertSettingsPayloadSchema
>;
