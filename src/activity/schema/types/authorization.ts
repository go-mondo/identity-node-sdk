import { type } from 'arktype';
import { UserIdSchema } from '../../../customer/users/schema.js';
import { BasePayloadSchema } from '../base.js';

export const AuthorizationStatus = {
  SUCESS: 'success',
  FAIL: 'fail',
} as const;

export type AnyAuthorizationStatus =
  (typeof AuthorizationStatus)[keyof typeof AuthorizationStatus];

const StatusSchema = type.enumerated(
  AuthorizationStatus.SUCESS,
  AuthorizationStatus.FAIL
);

export const AuthorizationActivityPayloadSchema = BasePayloadSchema.and({
  type: type("'authorization'"),
  status: StatusSchema,
  identity: UserIdSchema.optional(),
  message: type('string'),
});
export type AuthorizationActivityPayload =
  typeof AuthorizationActivityPayloadSchema.inferOut;
