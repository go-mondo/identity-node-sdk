import * as z from 'zod/v4';
import {
  DeactivatedAtPropertyPayloadSchema,
  DeactivatedAtPropertySchema,
  DeletedAtPropertyPayloadSchema,
  DeletedAtPropertySchema,
  OptionalDatePayloadSchema,
  OptionalDateSchema,
} from '../../common/schema/dates.js';
import { AlgorithmSchema, DEFAULT_ALGORITHM } from '../../common/schema/jwt.js';
import {
  MetadataMapPropertySchema,
  MetadataRecordPropertySchema,
  UpsertMetadataPropertySchema,
} from '../../common/schema/metadata.js';

export const DEFAULT_SESSION_DURATION = 60 * 60 * 4; // 4 hour
export const DEFAULT_REFRESH_TOKEN_DURATION = 60 * 60 * 24 * 14; // 14 days
export const DEFAULT_ACCESS_TOKEN_DURATION = 60 * 60 * 2; // 2 hours

const BaseAttributes = z.object({
  sessionDuration: z.number().default(DEFAULT_SESSION_DURATION),
  refreshTokenDuration: z.number().default(DEFAULT_REFRESH_TOKEN_DURATION),
  accessTokenDuration: z.number().default(DEFAULT_ACCESS_TOKEN_DURATION),
  accessTokenSignatureAlgorithm: AlgorithmSchema.default(DEFAULT_ALGORITHM),
});

export const AuthorizationSchema = z.object({
  ...BaseAttributes.shape,
  updatedAt: OptionalDateSchema,
  ...DeletedAtPropertySchema.shape,
  ...DeactivatedAtPropertySchema.shape,
  ...MetadataMapPropertySchema.shape,
});
export type AuthorizationProperties = z.input<typeof AuthorizationSchema>;
export type Authorization = z.output<typeof AuthorizationSchema>;

export const AuthorizationPayloadSchema = z.object({
  ...BaseAttributes.shape,
  updatedAt: OptionalDatePayloadSchema,
  ...DeletedAtPropertyPayloadSchema.shape,
  ...DeactivatedAtPropertyPayloadSchema.shape,
  ...MetadataRecordPropertySchema.shape,
});
export type AuthorizationPayload = z.output<typeof AuthorizationPayloadSchema>;

export const UpsertAuthorizationPayloadSchema = z.object({
  ...BaseAttributes.shape,
  ...UpsertMetadataPropertySchema.shape,
});
export type UpsertAuthorizationPayload = z.output<
  typeof UpsertAuthorizationPayloadSchema
>;
