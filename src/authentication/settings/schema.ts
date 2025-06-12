import { type } from 'arktype';
import {
  OptionalDatePayloadSchema,
  OptionalDateSchema,
  RequiredDateSchema,
} from '../../common/schema/dates.js';
import {
  MetadataMapPropertySchema,
  MetadataPayloadPropertySchema,
  UpsertMetadataPayloadPropertySchema,
} from '../../common/schema/metadata.js';
import { AuthenticationFactorsSchema } from '../factors/schema.js';

export const SettingsSchema = type({
  factors: AuthenticationFactorsSchema.optional(),
  createdAt: RequiredDateSchema,
  updatedAt: RequiredDateSchema,
  deletedAt: OptionalDateSchema.optional(),
  deactivatedAt: OptionalDateSchema.optional(),
}).and(MetadataMapPropertySchema);
export type SettingsProperties = typeof SettingsSchema.inferIn;
export type Settings = typeof SettingsSchema.inferOut;

export const SettingsPayloadSchema = type({
  factors: AuthenticationFactorsSchema.optional(),
  'updatedAt?': OptionalDatePayloadSchema,
  'deletedAt?': OptionalDatePayloadSchema,
  'deactivatedAt?': OptionalDatePayloadSchema,
}).and(MetadataPayloadPropertySchema);
export type SettingsPayload = typeof SettingsPayloadSchema.inferOut;

export const UpsertSettingsPayloadSchema = type({
  factors: AuthenticationFactorsSchema.optional(),
}).and(UpsertMetadataPayloadPropertySchema);
export type UpsertSettingsInput = typeof UpsertSettingsPayloadSchema.inferIn;
export type UpsertSettingsPayload = typeof UpsertSettingsPayloadSchema.inferOut;
