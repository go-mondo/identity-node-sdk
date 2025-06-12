import { type } from 'arktype';
import { UserIdSchema } from '../../../customer/users/schema.js';
import { BasePayloadSchema, BaseSchema } from '../base.js';

export const AuthenticationStatus = {
  SUCESS: 'success',
  FAIL: 'fail',
} as const;

export type AnyAuthenticationStatus =
  (typeof AuthenticationStatus)[keyof typeof AuthenticationStatus];

export const AuthenticationStatusSchema = type.enumerated(
  AuthenticationStatus.SUCESS,
  AuthenticationStatus.FAIL
);

const BaseAuthenticationSchema = type({
  type: type("'authentication'"),
  status: AuthenticationStatusSchema,
  identity: UserIdSchema,
  message: type('string'),
});

export const AuthenticationActivitySchema = BaseSchema.and(
  BaseAuthenticationSchema
);
export type AuthenticationActivityProperties =
  typeof AuthenticationActivitySchema.inferIn;
export type AuthenticationActivity =
  typeof AuthenticationActivitySchema.inferOut;

export const AuthenticationActivityPayloadSchema = BasePayloadSchema.and(
  BaseAuthenticationSchema
);
export type AuthenticationActivityPayload =
  typeof AuthenticationActivityPayloadSchema.inferOut;
