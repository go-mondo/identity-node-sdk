import { type } from 'arktype';
import { UserIdSchema } from '../../../customer/users/schema.js';
import { IdentityIdentifierSchema } from '../../../identity/schema.js';
import { BasePayloadSchema } from '../base.js';

export const UserAttributeVerificationActionPayloadSchema =
  BasePayloadSchema.and({
    operation: type("'user-attribute-verification'"),
    user: UserIdSchema,
    attribute: IdentityIdentifierSchema,
  }).onUndeclaredKey('delete');
export type UserAttributeVerificationActionPayload =
  typeof UserAttributeVerificationActionPayloadSchema.inferOut;

export const UserAttributeVerificationActionRequestSchema = type(
  {}
).onUndeclaredKey('delete');
export type UserAttributeVerificationActionRequest =
  typeof UserAttributeVerificationActionRequestSchema.inferOut;
