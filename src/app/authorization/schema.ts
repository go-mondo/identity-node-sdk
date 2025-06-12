import { type } from 'arktype';
import {
  OptionalDatePayloadSchema,
  OptionalDateSchema,
} from '../../common/schema/dates.js';
import {
  MetadataMapPropertySchema,
  MetadataPayloadPropertySchema,
  UpsertMetadataPayloadPropertySchema,
} from '../../common/schema/metadata.js';
import { type AnyGrantType, GrantType } from '../../oauth/common/schema.js';
import { AuthorizationPayloadSchema as WorkspaceAuthorizationPayloadSchema } from '../../workspace/authorization/schema.js';

const StringSetSchema = type.instanceOf(Set<string>);
const UrlStringSchema = type('string.url[]').pipe((v) => v.filter((i) => !!i));
const StringSchema = type('string[]').pipe((v) => v.filter((i) => !!i));

const CallbackUrlsSchema = type('undefined')
  .or(UrlStringSchema)
  .or(StringSetSchema)
  .pipe((v) => (v instanceof Set ? Array.from(v.values()) : v));

const AvailableAudiencesSchema = type('undefined')
  .or(StringSchema)
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
).and({
  loginUri: type('string.url | undefined').optional(),
  callbackUrls: CallbackUrlsSchema.optional(),
  availableAudiences: AvailableAudiencesSchema.optional(),
});

export const AuthorizationSchema = BaseAuthorization.and({
  availableGrants: type.undefined
    .or(GrantArraySchema)
    .or(GrantSetSchema)
    .pipe((v) => (v instanceof Set ? v : new Set(v)))
    .optional(),
  //   availableAudiences: type('string[] | undefined')
  //     .or(StringSetSchema)
  //     .pipe((v) => (v instanceof Set ? v : new Set(v)))
  //     .optional(),
  defaultAudience: type('string | undefined').optional(),
  'updatedAt?': OptionalDateSchema,
  'deletedAt?': OptionalDateSchema,
  'deactivatedAt?': OptionalDateSchema,
}).and(MetadataMapPropertySchema);
export type AuthorizationProperties = typeof AuthorizationSchema.inferIn;
export type Authorization = typeof AuthorizationSchema.inferOut;

export const AuthorizationPayloadSchema = BaseAuthorization.and({
  availableGrants: AvailableGrantsSchema.optional(),
  //   availableAudiences: AvailableAudiencesSchema.optional(),
  defaultAudience: type('string | undefined').optional(),
  'updatedAt?': OptionalDatePayloadSchema,
  'deletedAt?': OptionalDatePayloadSchema,
  'deactivatedAt?': OptionalDatePayloadSchema,
}).and(MetadataPayloadPropertySchema);
export type AuthorizationPayload = typeof AuthorizationPayloadSchema.inferOut;

export const UpsertAuthorizationPayloadSchema = BaseAuthorization.and({
  availableGrants: AvailableGrantsSchema.optional(),
  //   availableAudiences: type('string').array().optional(),
  defaultAudience: type('string | undefined').optional(),
}).and(UpsertMetadataPayloadPropertySchema);
export type UpsertAuthorizationInput =
  typeof UpsertAuthorizationPayloadSchema.inferIn;
export type UpsertAuthorizationPayload =
  typeof UpsertAuthorizationPayloadSchema.inferOut;
