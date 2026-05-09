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
  MetadataRecordPropertySchema,
  UpsertMetadataPropertySchema,
} from '../../common/schema/metadata.js';
import { optionallyNullishToUndefined } from '../../common/schema/schema.js';
import {
  UniqueStringArraySchema,
  UniqueStringSetSchema,
} from '../../common/schema/sets.js';
import {
  UniqueWebUrlObjectSetSchema,
  UniqueWebUrlStringArraySchema,
  WebUrlStringSchema,
} from '../../common/schema/url.js';
import { type AnyGrantType, GrantType } from '../../oauth/common/schema.js';

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
  refreshTokenDuration: optionallyNullishToUndefined(z.number()),
  accessTokenDuration: optionallyNullishToUndefined(z.number()),
  accessTokenSignatureAlgorithm: optionallyNullishToUndefined(AlgorithmSchema),
  loginUri: optionallyNullishToUndefined(WebUrlStringSchema),
});

export const AuthorizationSchema = z.object({
  ...BaseAuthorization.shape,
  callbackUrls: UniqueWebUrlObjectSetSchema.optional(),
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
  callbackUrls: UniqueWebUrlStringArraySchema.optional(),
  availableAudiences: AudienceArraySchema.optional(),
  availableGrants: AvailableGrantArraySchema.optional(),
  defaultAudience: z.union([z.string(), z.undefined()]).optional(),
  updatedAt: OptionalDatePayloadSchema,
  ...DeletedAtPropertyPayloadSchema.shape,
  ...DeactivatedAtPropertyPayloadSchema.shape,
  ...MetadataRecordPropertySchema.shape,
});
export type AuthorizationPayload = z.output<typeof AuthorizationPayloadSchema>;

export const UpsertAuthorizationPayloadSchema = z.object({
  loginUri: z.union([WebUrlStringSchema, z.null(), z.undefined()]).optional(),
  refreshTokenDuration: z.number().nullish(),
  accessTokenDuration: z.number().nullish(),
  accessTokenSignatureAlgorithm: AlgorithmSchema.nullish(),
  callbackUrls: UniqueWebUrlStringArraySchema.optional(),
  availableAudiences: AudienceArraySchema.optional(),
  availableGrants: AvailableGrantArraySchema.optional(),
  defaultAudience: z.union([z.string(), z.null(), z.undefined()]).optional(),
  ...UpsertMetadataPropertySchema.shape,
});
export type UpsertAuthorizationInput = z.input<
  typeof UpsertAuthorizationPayloadSchema
>;
export type UpsertAuthorizationPayload = z.output<
  typeof UpsertAuthorizationPayloadSchema
>;
