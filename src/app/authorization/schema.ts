import { type } from 'arktype';
import {
  OptionalDatePayloadSchema,
  OptionalDateSchema,
} from '../../common/schema/dates.js';
import {
  MetadataMapPropertySchema,
  MetadataPayloadPropertySchema,
  UpsertMetadataPropertyPayloadSchema,
} from '../../common/schema/metadata.js';
import { type AnyGrantType, GrantType } from '../../oauth/common/schema.js';
import { AuthorizationPayloadSchema as WorkspaceAuthorizationPayloadSchema } from '../../workspace/authorization/schema.js';

const UrlSetSchema = type.instanceOf(Set<URL>);
const UrlArrayScheama = type('string.url.parse').array();

const StringSetSchema = type.instanceOf(Set<string>);
// const UrlStringSchema = type('string.url[]').pipe((v) => v?.filter((i) => !!i));
const StringSchema = type('string[]').pipe((v) => v?.filter((i) => !!i));

// const CallbackUrlsSchema = type('undefined')
//   .or(UrlArrayScheama)
//   .or(UrlSetSchema)
//   .pipe((v) => (v instanceof Set ? Array.from(v.values()) : v));

const CallbackUrlArraySchema = type('undefined')
  .or(UrlArrayScheama)
  .or(UrlSetSchema)
  .pipe((v) => (v instanceof Set ? Array.from(v.values()) : v));

const CallbackUrlSetSchema = type('undefined')
  .or(UrlArrayScheama)
  .or(UrlSetSchema)
  .pipe((v) => (!v || v instanceof Set ? v : new Set(v)));

const AvailableAudienceArraySchema = type('undefined')
  .or(StringSchema)
  .or(StringSetSchema)
  .pipe((v) => (v instanceof Set ? Array.from(v.values()) : v));

const AvailableAudienceSetSchema = type('undefined')
  .or(StringSchema)
  .or(StringSetSchema)
  .pipe((v) => (!v || v instanceof Set ? v : new Set(v)));

const GrantSetSchema = type.instanceOf(Set<AnyGrantType>);
const GrantArraySchema = type
  .enumerated(
    GrantType.AUTHORIZATION_CODE,
    GrantType.CLIENT_CREDENTIALS,
    GrantType.IMPLICIT,
    GrantType.REFRESH_TOKEN
  )
  .array();

const AvailableGrantSetSchema = type('undefined')
  .or(GrantArraySchema)
  .or(GrantSetSchema)
  .pipe((v) => (!v || v instanceof Set ? v : new Set(v)));
const AvailableGrantArraySchema = type('undefined')
  .or(GrantArraySchema)
  .or(GrantSetSchema)
  .pipe((v) => (v instanceof Set ? Array.from(v.values()) : v));

const BaseAuthorization = WorkspaceAuthorizationPayloadSchema.pick(
  'refreshTokenDuration',
  'accessTokenDuration',
  'accessTokenSignatureAlgorithm'
);

export const AuthorizationSchema = BaseAuthorization.and({
  loginUri: type('string.url | undefined').optional(),
  callbackUrls: CallbackUrlSetSchema.optional(),
  availableAudiences: AvailableAudienceSetSchema.optional(),
  availableGrants: AvailableGrantSetSchema.optional(),
  defaultAudience: type('string | undefined').optional(),
  'updatedAt?': OptionalDateSchema,
  'deletedAt?': OptionalDateSchema,
  'deactivatedAt?': OptionalDateSchema,
}).and(MetadataMapPropertySchema);
export type AuthorizationProperties = typeof AuthorizationSchema.inferIn;
export type Authorization = typeof AuthorizationSchema.inferOut;

export const AuthorizationPayloadSchema = BaseAuthorization.and({
  loginUri: type('string.url | undefined').optional(),
  callbackUrls: CallbackUrlArraySchema.optional(),
  availableAudiences: AvailableAudienceArraySchema.optional(),
  availableGrants: AvailableGrantArraySchema.optional(),
  defaultAudience: type('string | undefined').optional(),
  'updatedAt?': OptionalDatePayloadSchema,
  'deletedAt?': OptionalDatePayloadSchema,
  'deactivatedAt?': OptionalDatePayloadSchema,
}).and(MetadataPayloadPropertySchema);
export type AuthorizationPayload = typeof AuthorizationPayloadSchema.inferOut;

export const UpsertAuthorizationPayloadSchema = BaseAuthorization.and({
  loginUri: type('string.url | undefined').optional(),
  callbackUrls: CallbackUrlArraySchema.optional(),
  availableAudiences: AvailableAudienceArraySchema.optional(),
  availableGrants: AvailableGrantArraySchema.optional(),
  defaultAudience: type('string | undefined').optional(),
}).and(UpsertMetadataPropertyPayloadSchema);
export type UpsertAuthorizationInput =
  typeof UpsertAuthorizationPayloadSchema.inferIn;
export type UpsertAuthorizationPayload =
  typeof UpsertAuthorizationPayloadSchema.inferOut;
