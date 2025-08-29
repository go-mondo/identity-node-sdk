import { z } from 'zod';
import {
  DeactivatedAtPropertyPayloadSchema,
  DeactivatedAtPropertySchema,
  DeletedAtPropertyPayloadSchema,
  DeletedAtPropertySchema,
  OptionalDatePayloadSchema,
  UpdatedAtPropertySchema,
} from '../../common/schema/dates.js';
import { Algorithm, AlgorithmSchema } from '../../common/schema/jwt.js';
import {
  MetadataMapPropertySchema,
  MetadataPayloadPropertySchema,
} from '../../common/schema/metadata.js';

export const DEFAULT_SESSION_DURATION = 60 * 60 * 4; // 4 hour
export const DEFAULT_REFRESH_TOKEN_DURATION = 60 * 60 * 24 * 14; // 14 days
export const DEFAULT_ACCESS_TOKEN_DURATION = 60 * 60 * 2; // 2 hours

const BaseAttributes = z.object({
  sessionDuration: z.number().default(DEFAULT_SESSION_DURATION),
  refreshTokenDuration: z.number().default(DEFAULT_REFRESH_TOKEN_DURATION),
  accessTokenDuration: z.number().default(DEFAULT_ACCESS_TOKEN_DURATION),
  accessTokenSignatureAlgorithm: AlgorithmSchema.default(Algorithm.DEFAULT),
});

export const AuthorizationSchema = z.object({
  ...BaseAttributes.shape,
  ...UpdatedAtPropertySchema.shape,
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
  ...MetadataPayloadPropertySchema.shape,
});
export type AuthorizationPayload = z.output<typeof AuthorizationPayloadSchema>;

export const UpsertAuthorizationPayloadSchema = z.object({
  ...BaseAttributes.shape,
  ...MetadataPayloadPropertySchema.shape,
});
export type UpsertAuthorizationPayload = z.output<
  typeof UpsertAuthorizationPayloadSchema
>;
