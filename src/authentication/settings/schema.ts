import { type } from 'arktype';
import { OptionalDatePayloadSchema } from '../../common/schema/dates.js';
import {
  MetadataPayloadPropertySchema,
  UpsertMetadataPayloadPropertySchema,
} from '../../common/schema/metadata.js';
import { AuthenticationFactorsSchema } from '../factors/schema.js';

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
export type UpsertSettingsPayload = typeof UpsertSettingsPayloadSchema.inferOut;
