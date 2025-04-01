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
import { generateUserId } from '../schema/utils.js';

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
  givenName: type('string | undefined').or('undefined').optional(),
  middleName: type('string | undefined').optional(),
  familyName: type('string | undefined').optional(),
  honorificPrefix: type('string | undefined').optional(),
  honorificSuffix: type('string | undefined').optional(),
});
export type UserNameProperties = typeof UserNamePropertiesSchema.inferOut;

export const UpsertUserNamePropertiesSchema = type({
  givenName: type('string | undefined | null').optional(),
  middleName: type('string | undefined | null').optional(),
  familyName: type('string | undefined | null').optional(),
  honorificPrefix: type('string | undefined | null').optional(),
  honorificSuffix: type('string | undefined | null').optional(),
});

export const UserIdSchema = type.string;
export type UserId = typeof UserIdSchema.inferOut;

export const UserIdPropertySchema = type({
  id: UserIdSchema,
});
export type UserIdProperty = typeof UserIdPropertySchema.inferOut;

export const RequiredEmailSchema = type('string.email');
export const RequiredPhoneNumberSchema = type('string');

const EmailSchema = RequiredEmailSchema.or('undefined').pipe((v) =>
  v != null ? v : undefined
);
const PhoneNumberSchema = RequiredPhoneNumberSchema.or('undefined');

export const VerifiedEmailOrPhonePropertiesSchema = type({
  email: EmailSchema.optional(),
  verifiedEmail: type('boolean').or('undefined').optional(),
  phoneNumber: PhoneNumberSchema.optional(),
  verifiedPhoneNumber: type('boolean').or('undefined').optional(),
});

export const EmailOrPhonePropertiesSchema = type({
  email: EmailSchema.optional(),
  phoneNumber: PhoneNumberSchema.optional(),
});

const BaseSchema = UserIdPropertySchema.and(UserNamePropertiesSchema)
  .and(VerifiedEmailOrPhonePropertiesSchema)
  .and({
    status: UserStatusSchema,
    roles: AggregateSchema.or(type.undefined).optional(),
  });

export const UserSchema = BaseSchema.and({
  lastLogin: OptionalDateSchema.optional(),
  createdAt: RequiredDateSchema,
  updatedAt: RequiredDateSchema,
  'deletedAt?': OptionalDateSchema,
  'deactivatedAt?': OptionalDateSchema,
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
  suspended: type.boolean.optional(),
  id: UserIdSchema.default(() => generateUserId()),
})
  .and(UserNamePropertiesSchema)
  .and(VerifiedEmailOrPhonePropertiesSchema)
  .and(UpsertMetadataPayloadPropertySchema);
export type InsertUserInput = typeof InsertUserPayloadSchema.inferIn;
export type InsertUserPayload = typeof InsertUserPayloadSchema.inferOut;

export const UpdateUserPayloadSchema = type({
  suspended: type.boolean.optional(),
})
  .and(UpsertUserNamePropertiesSchema)
  .and(UpsertMetadataPayloadPropertySchema);
export type UpdateUserInput = typeof UpdateUserPayloadSchema.inferIn;
export type UpdateUserPayload = typeof UpdateUserPayloadSchema.inferOut;

const UserRoleAssociationSchema = type('string[] | undefined');

export const UserAssociationsSchema = type({
  '+': 'delete',
  roles: UserRoleAssociationSchema.optional(),
});
export type UserAssociations = typeof UserAssociationsSchema.inferOut;

export const UserAssociationReferenceSchema = UserIdPropertySchema.and(
  UserNamePropertiesSchema
).and(
  EmailOrPhonePropertiesSchema.and(
    type({
      status: UserStatusSchema,
      model: "'User'",
    })
  )
);
export type UserAssociationReference =
  typeof UserAssociationReferenceSchema.inferOut;
