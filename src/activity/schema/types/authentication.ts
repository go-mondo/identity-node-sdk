import { type } from 'arktype';
import { UserIdSchema } from '../../../customer/schema/user.js';
import { BasePayloadSchema } from '../base.js';

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

export const AuthenticationActivityPayloadSchema = BasePayloadSchema.and({
  type: type("'authentication'"),
  status: AuthenticationStatusSchema,
  identity: UserIdSchema,
});
export type AuthenticationActivityPayload =
  typeof AuthenticationActivityPayloadSchema.inferOut;
