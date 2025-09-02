import * as z from 'zod/v4';
import {
  DeactivatedAtPropertyPayloadSchema,
  DeactivatedAtPropertySchema,
  DeletedAtPropertyPayloadSchema,
  DeletedAtPropertySchema,
  OptionalDatePayloadSchema,
  OptionalDateSchema,
} from '../../common/schema/dates.js';
import { KSUIDSchema } from '../../common/schema/id.js';
import {
  MetadataMapPropertySchema,
  MetadataPayloadPropertySchema,
} from '../../common/schema/metadata.js';
import { Model, generateOAuthId } from '../utils.js';

export const OAuthIdSchema = KSUIDSchema(Model.OAuth.UIDPrefix);
export type OAuthId = z.output<typeof OAuthIdSchema>;

export const OAuthIdPropertySchema = z.object({
  id: OAuthIdSchema,
});
export type OAuthIdProperty = z.output<typeof OAuthIdPropertySchema>;

const BaseOAuth = z.object({
  ...OAuthIdPropertySchema.shape,
  clientId: z.string(),
  clientSecret: z.string(),
});

export const OAuthSchema = z.object({
  ...BaseOAuth.shape,
  updatedAt: OptionalDateSchema,
  ...DeletedAtPropertySchema.shape,
  ...DeactivatedAtPropertySchema.shape,
  ...MetadataMapPropertySchema.shape,
});
export type OAuthProperties = z.input<typeof OAuthSchema>;
export type OAuth = z.output<typeof OAuthSchema>;

export const OAuthPayloadSchema = z.object({
  ...BaseOAuth.shape,
  updatedAt: OptionalDatePayloadSchema,
  ...DeletedAtPropertyPayloadSchema.shape,
  ...DeactivatedAtPropertyPayloadSchema.shape,
  ...MetadataPayloadPropertySchema.shape,
});
export type OAuthPayload = z.output<typeof OAuthPayloadSchema>;

export const InsertOAuthPayloadSchema = z.object({
  id: OAuthIdSchema.default(() => generateOAuthId()),
  ...MetadataPayloadPropertySchema.shape,
});
export type InsertOAuthInput = z.input<typeof InsertOAuthPayloadSchema>;
export type InsertOAuthPayload = z.output<typeof InsertOAuthPayloadSchema>;
