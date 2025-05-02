import { type } from 'arktype';
import { IdentityIdentifierSchema } from '../../../../identity/schema.js';
import {
  BaseInsertStrategyPayloadSchema,
  BaseStrategyPayloadSchema,
  BaseUpdateStrategyPayloadSchema,
} from '../base.js';

const TypeSchema = type({
  type: "'password'",
});

export const PasswordPolicySchema = type({
  minimumLength: type.number.default(8),
  maximumLength: type.number.default(36),
  minimumCapital: type.number.default(1),
  minimumLower: type.number.default(1),
  minimumNumber: type.number.default(1),
  minimumSpecial: type.number.default(1),
});

const SettingsSchema = type({
  passwordPolicy: PasswordPolicySchema,
});

export const PasswordStrategySettingsPropertySchema = type({
  settings: SettingsSchema,
});

export const PasswordStrategyPayloadSchema = BaseStrategyPayloadSchema.and(
  TypeSchema
).and(PasswordStrategySettingsPropertySchema);
export type PasswordStrategyPayload =
  typeof PasswordStrategyPayloadSchema.inferOut;

export const InsertPasswordStrategyPayloadSchema =
  BaseInsertStrategyPayloadSchema.and(TypeSchema).and(
    PasswordStrategySettingsPropertySchema
  );
export type InsertPasswordStrategyPayload =
  typeof InsertPasswordStrategyPayloadSchema.inferOut;

export const UpdatePasswordStrategyPayloadSchema =
  BaseUpdateStrategyPayloadSchema.and(TypeSchema).and(
    PasswordStrategySettingsPropertySchema
  );
export type UpdatePasswordStrategyPayload =
  typeof UpdatePasswordStrategyPayloadSchema.inferOut;

export const ForgotPasswordSchema = type({
  identifier: type('string').optional(),
  identifierType: IdentityIdentifierSchema.optional(),
});

export const VerifyPasswordSchema = type({
  password: type('string'),
  identifier: type('string').optional(),
  identifierType: IdentityIdentifierSchema.optional(),
});
