import { type } from 'arktype';
import {
  OptionalDatePayloadSchema,
  OptionalDateSchema,
} from '../../common/schema/dates.js';
import {
  MetadataMapPropertySchema,
  MetadataPayloadPropertySchema,
} from '../../common/schema/metadata.js';

export const OIDCSchema = type({
  'updatedAt?': OptionalDateSchema,
  'deletedAt?': OptionalDateSchema,
  'deactivatedAt?': OptionalDateSchema,
}).and(MetadataMapPropertySchema);
export type OIDCProperties = typeof OIDCSchema.inferIn;
export type OIDC = typeof OIDCSchema.inferOut;

export const OIDCPayloadSchema = type({
  'updatedAt?': OptionalDatePayloadSchema,
  'deletedAt?': OptionalDatePayloadSchema,
  'deactivatedAt?': OptionalDatePayloadSchema,
}).and(MetadataPayloadPropertySchema);
export type OIDCPayload = typeof OIDCPayloadSchema.inferOut;

export const InsertOIDCPayloadSchema =
  MetadataPayloadPropertySchema.or('undefined');
export type InsertOIDCInput = typeof InsertOIDCPayloadSchema.inferIn;
export type InsertOIDCPayload = typeof InsertOIDCPayloadSchema.inferOut;

export const UpdateOIDCPayloadSchema = MetadataPayloadPropertySchema;
export type UpdateOIDCInput = typeof UpdateOIDCPayloadSchema.inferIn;
export type UpdateOIDCPayload = typeof UpdateOIDCPayloadSchema.inferOut;
