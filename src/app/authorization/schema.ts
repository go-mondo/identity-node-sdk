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
import { type AnyGrantType, GrantType } from '../../oauth/common/schema.js';
import { AuthorizationPayloadSchema as WorkspaceAuthorizationPayloadSchema } from '../../workspace/authorization/schema.js';

const UrlSetSchema = z.instanceof(Set<URL>);
const UrlArrayScheama = z.array(
  z.url().pipe(z.transform((url) => new URL(url)))
);

const StringSetSchema = z.instanceof(Set<string>);
// const UrlStringSchema = type('string.url[]').pipe((v) => v?.filter((i) => !!i));
const StringSchema = z
  .array(z.string())
  .pipe(z.transform((v) => v?.filter((i) => !!i)));

// const CallbackUrlsSchema = type('undefined')
//   .or(UrlArrayScheama)
//   .or(UrlSetSchema)
//   .pipe((v) => (v instanceof Set ? Array.from(v.values()) : v));

const CallbackUrlArraySchema = z
  .union([z.undefined(), UrlArrayScheama, UrlSetSchema])
  .pipe(z.transform((v) => (v instanceof Set ? Array.from(v.values()) : v)));

const CallbackUrlSetSchema = z
  .union([z.undefined(), UrlArrayScheama, UrlSetSchema])
  .pipe(z.transform((v) => (!v || v instanceof Set ? v : new Set(v))));

const AvailableAudienceArraySchema = z
  .union([z.undefined(), StringSchema, StringSetSchema])
  .pipe(z.transform((v) => (v instanceof Set ? Array.from(v.values()) : v)));

const AvailableAudienceSetSchema = z
  .union([z.undefined(), StringSchema, StringSetSchema])
  .pipe(z.transform((v) => (!v || v instanceof Set ? v : new Set(v))));

const GrantSetSchema = z.instanceof(Set<AnyGrantType>);
const GrantArraySchema = z.array(
  z.enum([
    GrantType.AUTHORIZATION_CODE,
    GrantType.CLIENT_CREDENTIALS,
    GrantType.IMPLICIT,
    GrantType.REFRESH_TOKEN,
  ] as const)
);

const AvailableGrantSetSchema = z
  .union([z.undefined(), GrantArraySchema, GrantSetSchema])
  .pipe(z.transform((v) => (!v || v instanceof Set ? v : new Set(v))));
const AvailableGrantArraySchema = z
  .union([z.undefined(), GrantArraySchema, GrantSetSchema])
  .pipe(z.transform((v) => (v instanceof Set ? Array.from(v.values()) : v)));

const BaseAuthorization = WorkspaceAuthorizationPayloadSchema.pick({
  refreshTokenDuration: true,
  accessTokenDuration: true,
  accessTokenSignatureAlgorithm: true,
});

export const AuthorizationSchema = z.object({
  ...BaseAuthorization.shape,
  loginUri: z.union([z.url(), z.undefined()]).optional(),
  callbackUrls: CallbackUrlSetSchema.optional(),
  availableAudiences: AvailableAudienceSetSchema.optional(),
  availableGrants: AvailableGrantSetSchema.optional(),
  defaultAudience: z.union([z.string(), z.undefined()]).optional(),
  updatedAt: OptionalDateSchema,
  deletedAt: OptionalDateSchema,
  deactivatedAt: OptionalDateSchema,
  ...MetadataMapPropertySchema.shape,
});
export type AuthorizationProperties = z.input<typeof AuthorizationSchema>;
export type Authorization = z.output<typeof AuthorizationSchema>;

export const AuthorizationPayloadSchema = z.object({
  ...BaseAuthorization.shape,
  loginUri: z.union([z.url(), z.undefined()]).optional(),
  callbackUrls: CallbackUrlArraySchema.optional(),
  availableAudiences: AvailableAudienceArraySchema.optional(),
  availableGrants: AvailableGrantArraySchema.optional(),
  defaultAudience: z.union([z.string(), z.undefined()]).optional(),
  updatedAt: OptionalDatePayloadSchema,
  deletedAt: OptionalDatePayloadSchema,
  deactivatedAt: OptionalDatePayloadSchema,
  ...MetadataPayloadPropertySchema.shape,
});
export type AuthorizationPayload = z.output<typeof AuthorizationPayloadSchema>;

export const UpsertAuthorizationPayloadSchema = z.object({
  ...BaseAuthorization.shape,
  loginUri: z.union([z.url(), z.undefined()]).optional(),
  callbackUrls: CallbackUrlArraySchema.optional(),
  availableAudiences: AvailableAudienceArraySchema.optional(),
  availableGrants: AvailableGrantArraySchema.optional(),
  defaultAudience: z.union([z.string(), z.undefined()]).optional(),
  ...UpsertMetadataPropertyPayloadSchema.shape,
});
export type UpsertAuthorizationInput = z.input<
  typeof UpsertAuthorizationPayloadSchema
>;
export type UpsertAuthorizationPayload = z.output<
  typeof UpsertAuthorizationPayloadSchema
>;
