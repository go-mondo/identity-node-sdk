import * as z from 'zod/v4';
import {
  DeactivatedAtPropertyPayloadSchema,
  DeactivatedAtPropertySchema,
  DeletedAtPropertyPayloadSchema,
  DeletedAtPropertySchema,
  OptionalDatePayloadSchema,
  OptionalDateSchema,
} from '../../common/schema/dates.js';
import { AlgorithmSchema } from '../../common/schema/jwt.js';
import {
  MetadataMapPropertySchema,
  MetadataPayloadPropertySchema,
  UpsertMetadataPropertyPayloadSchema,
} from '../../common/schema/metadata.js';
import {
  UniqueStringArraySchema,
  UniqueStringSetSchema,
  UniqueUrlArraySchema,
  UniqueUrlSetSchema,
} from '../../common/schema/sets.js';
import { type AnyGrantType, GrantType } from '../../oauth/common/schema.js';

const CallbackUrlArraySchema = UniqueUrlArraySchema;
const CallbackUrlSetSchema = UniqueUrlSetSchema;

const AudienceArraySchema = UniqueStringArraySchema;
const AudienceSetSchema = UniqueStringSetSchema;

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

const BaseAuthorization = z.object({
  refreshTokenDuration: z.number().optional(),
  accessTokenDuration: z.number().optional(),
  accessTokenSignatureAlgorithm: AlgorithmSchema.optional(),
});

export const AuthorizationSchema = z.object({
  ...BaseAuthorization.shape,
  loginUri: z.union([z.url(), z.undefined()]).optional(),
  callbackUrls: CallbackUrlSetSchema.optional(),
  availableAudiences: AudienceSetSchema.optional(),
  availableGrants: AvailableGrantSetSchema.optional(),
  defaultAudience: z.union([z.string(), z.undefined()]).optional(),
  updatedAt: OptionalDateSchema,
  ...DeletedAtPropertySchema.shape,
  ...DeactivatedAtPropertySchema.shape,
  ...MetadataMapPropertySchema.shape,
});
export type AuthorizationProperties = z.input<typeof AuthorizationSchema>;
export type Authorization = z.output<typeof AuthorizationSchema>;

export const AuthorizationPayloadSchema = z.object({
  ...BaseAuthorization.shape,
  loginUri: z.union([z.url(), z.undefined()]).optional(),
  callbackUrls: CallbackUrlArraySchema.optional(),
  availableAudiences: AudienceArraySchema.optional(),
  availableGrants: AvailableGrantArraySchema.optional(),
  defaultAudience: z.union([z.string(), z.undefined()]).optional(),
  updatedAt: OptionalDatePayloadSchema,
  ...DeletedAtPropertyPayloadSchema.shape,
  ...DeactivatedAtPropertyPayloadSchema.shape,
  ...MetadataPayloadPropertySchema.shape,
});
export type AuthorizationPayload = z.output<typeof AuthorizationPayloadSchema>;

export const UpsertAuthorizationPayloadSchema = z.object({
  ...BaseAuthorization.shape,
  loginUri: z.union([z.url(), z.undefined()]).optional(),
  callbackUrls: CallbackUrlArraySchema.optional(),
  availableAudiences: AudienceArraySchema.optional(),
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
