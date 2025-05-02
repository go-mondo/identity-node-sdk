import { type } from 'arktype';
import { AppIdSchema } from '../../../app/schema.js';
import {
  InsertUserPayloadSchema,
  RequiredEmailSchema,
  RequiredPhoneNumberSchema,
  UserNamePropertiesSchema,
} from '../../../customer/users/schema.js';
import { BasePayloadSchema } from '../base.js';

export const SignUpActionPayloadSchema = BasePayloadSchema.and({
  operation: type("'sign-up'"),
  app: AppIdSchema.optional(),
  user: UserNamePropertiesSchema,
}).onUndeclaredKey('delete');
export type SignUpActionPayload = typeof SignUpActionPayloadSchema.inferOut;

const EmailSignUpActionRequestSchema = UserNamePropertiesSchema.and({
  email: RequiredEmailSchema,
  phoneNumber: RequiredPhoneNumberSchema.optional(),
}).and(InsertUserPayloadSchema.pick('id'));

const PhoneNumberSignUpActionRequestSchema = UserNamePropertiesSchema.and({
  phoneNumber: RequiredPhoneNumberSchema,
  email: RequiredEmailSchema.optional(),
}).and(InsertUserPayloadSchema.pick('id'));

export const SignUpActionRequestSchema = EmailSignUpActionRequestSchema.or(
  PhoneNumberSignUpActionRequestSchema
);
export type SignUpActionRequest = typeof SignUpActionRequestSchema.inferOut;
