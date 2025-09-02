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
  UpsertMetadataPropertyPayloadSchema,
} from '../../common/schema/metadata.js';

export const OIDCSchema = z.object({
  updatedAt: OptionalDateSchema,
  ...DeletedAtPropertySchema.shape,
  ...DeactivatedAtPropertySchema.shape,
  ...MetadataMapPropertySchema.shape,
});
export type OIDCProperties = z.input<typeof OIDCSchema>;
export type OIDC = z.output<typeof OIDCSchema>;

export const OIDCPayloadSchema = z.object({
  updatedAt: OptionalDatePayloadSchema,
  ...DeletedAtPropertyPayloadSchema.shape,
  ...DeactivatedAtPropertyPayloadSchema.shape,
  ...MetadataPayloadPropertySchema.shape,
});
export type OIDCPayload = z.output<typeof OIDCPayloadSchema>;

export const InsertOIDCPayloadSchema = z.object({
  ...UpsertMetadataPropertyPayloadSchema.shape,
});
export type InsertOIDCInput = z.input<typeof InsertOIDCPayloadSchema>;
export type InsertOIDCPayload = z.output<typeof InsertOIDCPayloadSchema>;

export const UpdateOIDCPayloadSchema = MetadataPayloadPropertySchema;
export type UpdateOIDCInput = z.input<typeof UpdateOIDCPayloadSchema>;
export type UpdateOIDCPayload = z.output<typeof UpdateOIDCPayloadSchema>;
