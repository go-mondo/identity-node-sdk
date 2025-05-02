import { type } from 'arktype';
import { OptionalDatePayloadSchema } from '../../common/schema/dates.js';
import { MetadataPayloadPropertySchema } from '../../common/schema/metadata.js';

export const OIDCPayloadSchema = type({
  'updatedAt?': OptionalDatePayloadSchema,
  'deletedAt?': OptionalDatePayloadSchema,
  'deactivatedAt?': OptionalDatePayloadSchema,
}).and(MetadataPayloadPropertySchema);
export type OIDCPayload = typeof OIDCPayloadSchema.inferOut;

export const InsertOIDCPayloadSchema = MetadataPayloadPropertySchema;
export type InsertOIDCPayload = typeof InsertOIDCPayloadSchema.inferOut;

export const UpdateOIDCPayloadSchema = MetadataPayloadPropertySchema;
export type UpdateOIDCPayload = typeof UpdateOIDCPayloadSchema.inferOut;
