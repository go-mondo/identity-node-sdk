import { type } from 'arktype';
import { AggregateSchema } from '../../common/schema/aggregate.js';
import {
  OptionalDatePayloadSchema,
  OptionalDateSchema,
  RequiredDatePayloadSchema,
  RequiredDateSchema,
} from '../../common/schema/dates.js';
import {
  MetadataMapPropertySchema,
  MetadataPayloadPropertySchema,
  UpsertMetadataPayloadPropertySchema,
} from '../../common/schema/metadata.js';
import {
  optionallyNullish,
  optionallyNullishToUndefined,
  optionallyUndefined,
} from '../../common/schema/schema.js';

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

const UserStatusSchema = type.enumerated(
  UserStatus.ACTIVE,
  UserStatus.SUSPENDED,
  UserStatus.UNVERIFIED
);

export const UserNamePropertiesSchema = type({
  givenName: optionallyNullishToUndefined(type('string')),
  middleName: optionallyNullishToUndefined(type('string')),
  familyName: optionallyNullishToUndefined(type('string')),
  honorificPrefix: optionallyNullishToUndefined(type('string')),
  honorificSuffix: optionallyNullishToUndefined(type('string')),
});
// export type UserNameProperties = typeof UserNamePropertiesSchema.inferOut;

export const UpdateUserNamePropertiesSchema = type({
  givenName: optionallyNullish(type('string')),
  middleName: optionallyNullish(type('string')),
  familyName: optionallyNullish(type('string')),
  honorificPrefix: optionallyNullish(type('string')),
  honorificSuffix: optionallyNullish(type('string')),
});
// type UpsertUserNameProperties = typeof UpdateUserNamePropertiesSchema.inferOut;

export const UserIdSchema = type.string;
export type UserId = typeof UserIdSchema.inferOut;

export const UserIdPropertySchema = type({
  id: UserIdSchema,
});
export type UserIdProperty = typeof UserIdPropertySchema.inferOut;

export const RequiredEmailSchema = type('string.email');
export const RequiredPhoneNumberSchema = type('string');

export const VerifiedEmailOrPhonePropertiesSchema = type({
  email: optionallyNullishToUndefined(RequiredEmailSchema),
  verifiedEmail: optionallyNullishToUndefined(type('boolean')),
  phoneNumber: optionallyNullishToUndefined(RequiredPhoneNumberSchema),
  verifiedPhoneNumber: optionallyNullishToUndefined(type('boolean')),
});

export const EmailOrPhonePropertiesSchema = type({
  email: optionallyNullishToUndefined(RequiredEmailSchema),
  phoneNumber: optionallyNullishToUndefined(RequiredPhoneNumberSchema),
});

const UserRoleAssociationSchema = type('string[] | undefined');

export const UserAssociationsSchema = type({
  roles: UserRoleAssociationSchema.optional(),
});
export type UserAssociations = typeof UserAssociationsSchema.inferOut;

const BaseSchema = UserIdPropertySchema.and(UserNamePropertiesSchema)
  .and(VerifiedEmailOrPhonePropertiesSchema)
  .and({
    status: UserStatusSchema,
    roles: optionallyUndefined(AggregateSchema),
  });

export const UserSchema = BaseSchema.and({
  lastLogin: OptionalDateSchema.optional(),
  createdAt: RequiredDateSchema,
  updatedAt: RequiredDateSchema,
  deletedAt: OptionalDateSchema.optional(),
  deactivatedAt: OptionalDateSchema.optional(),
}).and(MetadataMapPropertySchema);
export type UserProperties = typeof UserSchema.inferIn;
export type User = typeof UserSchema.inferOut;

export const UserPayloadSchema = BaseSchema.and({
  lastLogin: OptionalDatePayloadSchema.optional(),
  createdAt: RequiredDatePayloadSchema,
  updatedAt: RequiredDatePayloadSchema,
  'deletedAt?': OptionalDatePayloadSchema,
  'deactivatedAt?': OptionalDatePayloadSchema,
}).and(MetadataPayloadPropertySchema);
export type UserPayload = typeof UserPayloadSchema.inferOut;

export const InsertUserPayloadSchema = type({
  id: UserIdSchema.optional(),
})
  .and(UserNamePropertiesSchema)
  .and(VerifiedEmailOrPhonePropertiesSchema)
  .and(UserAssociationsSchema)
  .and(UpsertMetadataPayloadPropertySchema);
export type InsertUserInput = typeof InsertUserPayloadSchema.inferIn;
export type InsertUserPayload = typeof InsertUserPayloadSchema.inferOut;

export const UpdateUserPayloadSchema = type({
  suspended: type.boolean.optional(),
})
  .and(UpdateUserNamePropertiesSchema)
  .and(UpsertMetadataPayloadPropertySchema);
export type UpdateUserInput = typeof UpdateUserPayloadSchema.inferIn;
export type UpdateUserPayload = typeof UpdateUserPayloadSchema.inferOut;

export const UserAssociationReferenceSchema = UserIdPropertySchema.and(
  UserNamePropertiesSchema
).and(
  EmailOrPhonePropertiesSchema.and(
    type({
      status: UserStatusSchema.default('unverified'),
      model: "'User'",
    })
  )
);
export type UserAssociationReference =
  typeof UserAssociationReferenceSchema.inferOut;
