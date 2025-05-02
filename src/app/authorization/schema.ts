import { type } from 'arktype';
import { OptionalDatePayloadSchema } from '../../common/schema/dates.js';
import {
  MetadataPayloadPropertySchema,
  UpsertMetadataPayloadPropertySchema,
} from '../../common/schema/metadata.js';
import { type AnyGrantType, GrantType } from '../../oauth/common/schema.js';
import { AuthorizationPayloadSchema as WorkspaceAuthorizationPayloadSchema } from '../../workspace/authorization/schema.js';

const StringSetSchema = type.instanceOf(Set<string>);

const CallbackUrlsSchema = type('string.url[] | undefined')
  .or(StringSetSchema)
  .pipe((v) => (v instanceof Set ? Array.from(v.values()) : v));

const AvailableAudiencesSchema = type('string[] | undefined')
  .or(StringSetSchema)
  .pipe((v) => (v instanceof Set ? Array.from(v.values()) : v));

const GrantSetSchema = type.instanceOf(Set<AnyGrantType>);
const GrantArraySchema = type
  .enumerated(
    GrantType.AUTHORIZATION_CODE,
    GrantType.CLIENT_CREDENTIALS,
    GrantType.IMPLICIT,
    GrantType.REFRESH_TOKEN
  )
  .array();
const AvailableGrantsSchema = type.undefined
  .or(GrantArraySchema)
  .or(GrantSetSchema)
  .pipe((v) => (v instanceof Set ? Array.from(v.values()) : v));

const BaseAuthorization = WorkspaceAuthorizationPayloadSchema.pick(
  'refreshTokenDuration',
  'accessTokenDuration',
  'accessTokenSignatureAlgorithm'
);

export const AuthorizationPayloadSchema = BaseAuthorization.and({
  loginUri: type('string.url | undefined').optional(),
  callbackUrls: CallbackUrlsSchema.optional(),
  availableGrants: AvailableGrantsSchema.optional(),
  availableAudiences: AvailableAudiencesSchema.optional(),
  defaultAudience: type('string | undefined').optional(),
  'updatedAt?': OptionalDatePayloadSchema,
  'deletedAt?': OptionalDatePayloadSchema,
  'deactivatedAt?': OptionalDatePayloadSchema,
}).and(MetadataPayloadPropertySchema);
export type AuthorizationPayload = typeof AuthorizationPayloadSchema.inferOut;

export const UpsertAuthorizationPayloadSchema = BaseAuthorization.and({
  loginUri: type('string.url | undefined').optional(),
  callbackUrls: CallbackUrlsSchema.optional(),
  availableGrants: type
    .enumerated(
      GrantType.AUTHORIZATION_CODE,
      GrantType.CLIENT_CREDENTIALS,
      GrantType.IMPLICIT,
      GrantType.REFRESH_TOKEN
    )
    .array()
    .optional(),
  availableAudiences: type('string').array().optional(),
  defaultAudience: type('string').optional(),
}).and(UpsertMetadataPayloadPropertySchema);
export type UpsertAuthorizationPayload =
  typeof UpsertAuthorizationPayloadSchema.inferOut;
