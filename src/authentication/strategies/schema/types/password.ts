import { type } from 'arktype';
import { IdentityIdentifierSchema } from '../../../../identity/schema.js';
import {
  BaseInsertStrategyPayloadSchema,
  BaseStrategyPayloadSchema,
  BaseStrategySchema,
  BaseUpdateStrategyPayloadSchema,
} from '../base.js';

export const PasswordPolicyDefaults = {
  minimumLength: 8,
  maximumLength: 36,
  minimumCapital: 1,
  minimumLower: 1,
  minimumNumber: 1,
  minimumSpecial: 1,
};

const TypeSchema = type({
  type: "'password'",
});

export const PasswordPolicySchema = type({
  minimumLength: type.number.default(PasswordPolicyDefaults.minimumLength),
  maximumLength: type.number.default(PasswordPolicyDefaults.maximumLength),
  minimumCapital: type.number.default(PasswordPolicyDefaults.minimumCapital),
  minimumLower: type.number.default(PasswordPolicyDefaults.minimumLower),
  minimumNumber: type.number.default(PasswordPolicyDefaults.minimumNumber),
  minimumSpecial: type.number.default(PasswordPolicyDefaults.minimumSpecial),
});

const SettingsSchema = type({
  passwordPolicy: PasswordPolicySchema,
});

export const PasswordStrategySettingsPropertySchema = type({
  settings: SettingsSchema,
});

export const PasswordStrategySchema = BaseStrategySchema.and(TypeSchema).and({
  settings: SettingsSchema,
});
export type PasswordStrategyProperties = typeof PasswordStrategySchema.inferIn;
export type PasswordStrategy = typeof PasswordStrategySchema.inferOut;

export const PasswordStrategyPayloadSchema = BaseStrategyPayloadSchema.and(
  TypeSchema
).and(PasswordStrategySettingsPropertySchema);
export type PasswordStrategyPayload =
  typeof PasswordStrategyPayloadSchema.inferOut;

export const InsertPasswordStrategyPayloadSchema = TypeSchema.and(
  BaseInsertStrategyPayloadSchema
)
  .and(TypeSchema)
  .and({
    settings: SettingsSchema.optional(),
  });
export type InsertPasswordStrategyInput =
  typeof InsertPasswordStrategyPayloadSchema.inferIn;
export type InsertPasswordStrategyPayload =
  typeof InsertPasswordStrategyPayloadSchema.inferOut;

export const UpdatePasswordStrategyPayloadSchema = TypeSchema.and(
  BaseUpdateStrategyPayloadSchema
).and({
  settings: SettingsSchema.optional(),
});
export type UpdatePasswordStrategyInput =
  typeof UpdatePasswordStrategyPayloadSchema.inferIn;
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
