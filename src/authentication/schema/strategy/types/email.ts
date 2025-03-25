import { type } from 'arktype';
import {
  BaseInsertStrategyPayloadSchema,
  BaseStrategyPayloadSchema,
  BaseUpdateStrategyPayloadSchema,
} from '../base.js';

const TypeSchema = type({
  type: "'email'",
});

export const EmailStrategyPayloadSchema =
  BaseStrategyPayloadSchema.and(TypeSchema);

export const InsertEmailStrategyPayloadSchema =
  BaseInsertStrategyPayloadSchema.and(TypeSchema);

export const UpdateEmailStrategyPayloadSchema =
  BaseUpdateStrategyPayloadSchema.and(TypeSchema);

export const VerifyEmailSchema = type({
  email: type('string.email').optional(),
  code: type('string').configure({
    message: 'A verification code is required',
  }),
});

export const SendEmailVerificationCodeSchema = type({
  email: type('string.email').optional(),
});
