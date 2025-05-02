import { type } from 'arktype';
import { OptionalDatePayloadSchema } from '../../common/schema/dates.js';
import { Algorithm, AlgorithmSchema } from '../../common/schema/jwt.js';
import { MetadataPayloadPropertySchema } from '../../common/schema/metadata.js';

export const DEFAULT_SESSION_DURATION = 60 * 60 * 4; // 4 hour
export const DEFAULT_REFRESH_TOKEN_DURATION = 60 * 60 * 24 * 14; // 14 days
export const DEFAULT_ACCESS_TOKEN_DURATION = 60 * 60 * 2; // 2 hours

const BaseAttributes = type({
  sessionDuration: type('number').default(DEFAULT_SESSION_DURATION),
  refreshTokenDuration: type('number').default(DEFAULT_REFRESH_TOKEN_DURATION),
  accessTokenDuration: type('number').default(DEFAULT_ACCESS_TOKEN_DURATION),
  accessTokenSignatureAlgorithm: AlgorithmSchema.default(Algorithm.DEFAULT),
});

export const AuthorizationPayloadSchema = BaseAttributes.and({
  'updatedAt?': OptionalDatePayloadSchema,
  'deletedAt?': OptionalDatePayloadSchema,
  'deactivatedAt?': OptionalDatePayloadSchema,
}).and(MetadataPayloadPropertySchema);
export type AuthorizationPayload = typeof AuthorizationPayloadSchema.inferOut;

export const UpsertAuthorizationPayloadSchema = BaseAttributes.and(
  MetadataPayloadPropertySchema
);
export type UpsertAuthorizationPayload =
  typeof UpsertAuthorizationPayloadSchema.inferOut;
