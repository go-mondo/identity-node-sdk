import * as z from 'zod/v4';
import { RoleIdAssociationsSchema } from '../../authorization/schema.js';
import { AggregateSchema } from '../../common/schema/aggregate.js';
import {
  CreatedAtPropertyPayloadSchema,
  CreatedAtPropertySchema,
  DeactivatedAtPropertyPayloadSchema,
  DeactivatedAtPropertySchema,
  DeletedAtPropertyPayloadSchema,
  DeletedAtPropertySchema,
  OptionalDatePayloadSchema,
  OptionalDateSchema,
  UpdatedAtPropertyPayloadSchema,
  UpdatedAtPropertySchema,
} from '../../common/schema/dates.js';
import {
  MetadataMapPropertySchema,
  MetadataPayloadPropertySchema,
  UpsertMetadataPropertyPayloadSchema,
} from '../../common/schema/metadata.js';
import {
  optionallyNullish,
  optionallyNullishToUndefined,
  optionallyUndefined,
} from '../../common/schema/schema.js';
import { UserIdSchema } from '../schema.js';

export const VerifiableAttribute = {
  EMAIL: 'email',
  PHONE_NUMBER: 'phoneNumber',
} as const;

export type AnyVerifiableAttribute =
  (typeof VerifiableAttribute)[keyof typeof VerifiableAttribute];

export const UserStatus = {
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  UNVERIFIED: 'unverified',
} as const;
export type AnyUserStatus = (typeof UserStatus)[keyof typeof UserStatus];

export const UserStatusSchema = z.enum(Object.values(UserStatus));

export const UserNamePropertiesSchema = z.object({
  givenName: optionallyNullishToUndefined(z.string()),
  middleName: optionallyNullishToUndefined(z.string()),
  familyName: optionallyNullishToUndefined(z.string()),
  honorificPrefix: optionallyNullishToUndefined(z.string()),
  honorificSuffix: optionallyNullishToUndefined(z.string()),
});
// export type UserNameProperties = typeof UserNamePropertiesSchema.inferOut;

export const UpdateUserNamePropertiesSchema = z.object({
  givenName: optionallyNullish(z.string()),
  middleName: optionallyNullish(z.string()),
  familyName: optionallyNullish(z.string()),
  honorificPrefix: optionallyNullish(z.string()),
  honorificSuffix: optionallyNullish(z.string()),
});
// type UpsertUserNameProperties = typeof UpdateUserNamePropertiesSchema.inferOut;

export const UserIdPropertySchema = z.object({
  id: UserIdSchema,
});
export type UserIdProperty = z.output<typeof UserIdPropertySchema>;

export const RequiredEmailSchema = z.email();
export const RequiredPhoneNumberSchema = z.e164();

export const VerifiedEmailOrPhonePropertiesSchema = z.object({
  verifiedEmail: optionallyNullishToUndefined(RequiredEmailSchema),
  verifiedPhoneNumber: optionallyNullishToUndefined(RequiredPhoneNumberSchema),
});

export const UnverifiedEmailOrPhonePropertiesSchema = z.object({
  unverifiedEmail: optionallyNullishToUndefined(RequiredEmailSchema),
  unverifiedPhoneNumber: optionallyNullishToUndefined(
    RequiredPhoneNumberSchema
  ),
});

export const EmailOrPhonePropertiesSchema = z.object({
  email: optionallyNullishToUndefined(RequiredEmailSchema),
  phoneNumber: optionallyNullishToUndefined(RequiredPhoneNumberSchema),
});

export const UserAssociationsSchema = z.object({
  roles: RoleIdAssociationsSchema.optional(),
});
export type UserAssociations = z.output<typeof UserAssociationsSchema>;

const BaseSchema = z.object({
  ...UserIdPropertySchema.shape,
  ...UserNamePropertiesSchema.shape,
  ...VerifiedEmailOrPhonePropertiesSchema.shape,
  ...UnverifiedEmailOrPhonePropertiesSchema.shape,
  status: UserStatusSchema,
  roles: optionallyUndefined(AggregateSchema),
});

const UserSchemaBase = z.object({
  ...BaseSchema.shape,
  lastLogin: OptionalDateSchema,
  ...CreatedAtPropertySchema.shape,
  ...UpdatedAtPropertySchema.shape,
  ...DeletedAtPropertySchema.shape,
  ...DeactivatedAtPropertySchema.shape,
  ...MetadataMapPropertySchema.shape,
});

export const UserSchema = UserSchemaBase.transform((user) => ({
  ...user,
  email: user.verifiedEmail,
  phoneNumber: user.verifiedPhoneNumber,
}));
export type UserProperties = z.input<typeof UserSchema>;
export type User = z.output<typeof UserSchema>;

const UserPayloadSchemaBase = z.object({
  ...BaseSchema.shape,
  lastLogin: OptionalDatePayloadSchema,
  ...CreatedAtPropertyPayloadSchema.shape,
  ...UpdatedAtPropertyPayloadSchema.shape,
  ...DeletedAtPropertyPayloadSchema.shape,
  ...DeactivatedAtPropertyPayloadSchema.shape,
  ...MetadataPayloadPropertySchema.shape,
});

export const UserPayloadSchema = UserPayloadSchemaBase.transform((user) => ({
  ...user,
  email: user.verifiedEmail,
  phoneNumber: user.verifiedPhoneNumber,
}));
export type UserPayload = z.output<typeof UserPayloadSchema>;

const requiredEmailOrPhoneMessage =
  'At least one of verifiedEmail, verifiedPhoneNumber, unverifiedEmail, or unverifiedPhoneNumber is required';

const hasEmailOrPhone = (data: {
  verifiedEmail?: string;
  verifiedPhoneNumber?: string;
  unverifiedEmail?: string;
  unverifiedPhoneNumber?: string;
}) =>
  data.verifiedEmail !== undefined ||
  data.verifiedPhoneNumber !== undefined ||
  data.unverifiedEmail !== undefined ||
  data.unverifiedPhoneNumber !== undefined;

export const InsertUserPayloadSchema = z
  .object({
    id: UserIdSchema.optional(),
    status: UserStatusSchema.optional(),
    ...UserNamePropertiesSchema.shape,
    ...VerifiedEmailOrPhonePropertiesSchema.shape,
    ...UnverifiedEmailOrPhonePropertiesSchema.shape,
    ...UserAssociationsSchema.shape,
    ...UpsertMetadataPropertyPayloadSchema.shape,
  })
  .refine(hasEmailOrPhone, {
    message: requiredEmailOrPhoneMessage,
    path: ['verifiedEmail'],
  })
  .refine(hasEmailOrPhone, {
    message: requiredEmailOrPhoneMessage,
    path: ['verifiedPhoneNumber'],
  })
  .refine(hasEmailOrPhone, {
    message: requiredEmailOrPhoneMessage,
    path: ['unverifiedEmail'],
  })
  .refine(hasEmailOrPhone, {
    message: requiredEmailOrPhoneMessage,
    path: ['unverifiedPhoneNumber'],
  });
export type InsertUserInput = z.input<typeof InsertUserPayloadSchema>;
export type InsertUserPayload = z.output<typeof InsertUserPayloadSchema>;

export const UpdateUserPayloadSchema = z.object({
  suspended: z.boolean().optional(),
  ...UpdateUserNamePropertiesSchema.shape,
  ...VerifiedEmailOrPhonePropertiesSchema.shape,
  ...UnverifiedEmailOrPhonePropertiesSchema.shape,
  ...UpsertMetadataPropertyPayloadSchema.shape,
});
export type UpdateUserInput = z.input<typeof UpdateUserPayloadSchema>;
export type UpdateUserPayload = z.output<typeof UpdateUserPayloadSchema>;

/**
 * Association
 */
export const UserAssociationReferenceSchema = z.object({
  ...UserIdPropertySchema.shape,
  ...UserNamePropertiesSchema.shape,
  ...EmailOrPhonePropertiesSchema.shape,
  status: UserStatusSchema.default('unverified'),
  model: z.literal('User'),
});
export type UserAssociationReference = z.output<
  typeof UserAssociationReferenceSchema
>;
