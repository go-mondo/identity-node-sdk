import { z } from 'zod';
import {
  OptionalDatePayloadSchema,
  OptionalDateSchema,
} from '../../common/schema/dates.js';
import {
  MetadataMapPropertySchema,
  MetadataPayloadPropertySchema,
  UpsertMetadataPropertyPayloadSchema,
} from '../../common/schema/metadata.js';

export const OIDCSchema = z.object({
  updatedAt: OptionalDateSchema.optional(),
  deletedAt: OptionalDateSchema.optional(),
  deactivatedAt: OptionalDateSchema.optional(),
  ...MetadataMapPropertySchema.shape,
});
export type OIDCProperties = z.input<typeof OIDCSchema>;
export type OIDC = z.output<typeof OIDCSchema>;

export const OIDCPayloadSchema = z.object({
  updatedAt: OptionalDatePayloadSchema.optional(),
  deletedAt: OptionalDatePayloadSchema.optional(),
  deactivatedAt: OptionalDatePayloadSchema.optional(),
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
