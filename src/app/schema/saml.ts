import { type } from 'arktype';
import { OptionalDatePayloadSchema } from '../../common/schema/dates.js';
import { MetadataPayloadPropertySchema } from '../../common/schema/metadata.js';

export const SAMLPayloadSchema = type({
  'updatedAt?': OptionalDatePayloadSchema,
  'deletedAt?': OptionalDatePayloadSchema,
  'deactivatedAt?': OptionalDatePayloadSchema,
}).and(MetadataPayloadPropertySchema);
export type SAMLPayload = typeof SAMLPayloadSchema.inferOut;

export const InsertSAMLPayloadSchema = MetadataPayloadPropertySchema;
export type InsertSAMLPayload = typeof InsertSAMLPayloadSchema.inferOut;

export const UpdateSAMLPayloadSchema = MetadataPayloadPropertySchema;
export type UpdateSAMLPayload = typeof InsertSAMLPayloadSchema.inferOut;
