import * as z from 'zod/v4';
import { IdentityIdentifierSchema } from '../../../../identity/schema.js';
import {
  BaseInsertStrategyPayloadSchema,
  BaseStrategyPayloadSchema,
  BaseStrategySchema,
  BaseUpdateStrategyPayloadSchema,
  StrategyType,
} from '../base.js';

export const PasswordPolicyDefaults = {
  minimumLength: 8,
  maximumLength: 36,
  minimumCapital: 1,
  minimumLower: 1,
  minimumNumber: 1,
  minimumSpecial: 1,
};

const TypeSchema = z.object({
  type: z.literal(StrategyType.PASSWORD),
});

export const PasswordPolicySchema = z.object({
  minimumLength: z.number().default(PasswordPolicyDefaults.minimumLength),
  maximumLength: z.number().default(PasswordPolicyDefaults.maximumLength),
  minimumCapital: z.number().default(PasswordPolicyDefaults.minimumCapital),
  minimumLower: z.number().default(PasswordPolicyDefaults.minimumLower),
  minimumNumber: z.number().default(PasswordPolicyDefaults.minimumNumber),
  minimumSpecial: z.number().default(PasswordPolicyDefaults.minimumSpecial),
});

const SettingsSchema = z.object({
  passwordPolicy: PasswordPolicySchema,
});

export const PasswordStrategySettingsPropertySchema = z.object({
  settings: SettingsSchema,
});

export const PasswordStrategySchema = z.object({
  ...BaseStrategySchema.shape,
  ...TypeSchema.shape,
  settings: SettingsSchema,
});
export type PasswordStrategyProperties = z.input<typeof PasswordStrategySchema>;
export type PasswordStrategy = z.output<typeof PasswordStrategySchema>;

export const PasswordStrategyPayloadSchema = z.object({
  ...BaseStrategyPayloadSchema.shape,
  ...TypeSchema.shape,
  ...PasswordStrategySettingsPropertySchema.shape,
});
export type PasswordStrategyPayload = z.output<
  typeof PasswordStrategyPayloadSchema
>;

export const InsertPasswordStrategyPayloadSchema = z.object({
  ...TypeSchema.shape,
  ...BaseInsertStrategyPayloadSchema.shape,
  settings: SettingsSchema.optional(),
});
export type InsertPasswordStrategyInput = z.input<
  typeof InsertPasswordStrategyPayloadSchema
>;
export type InsertPasswordStrategyPayload = z.output<
  typeof InsertPasswordStrategyPayloadSchema
>;

export const UpdatePasswordStrategyPayloadSchema = z.object({
  ...TypeSchema.shape,
  ...BaseUpdateStrategyPayloadSchema.shape,
  settings: SettingsSchema.optional(),
});
export type UpdatePasswordStrategyInput = z.input<
  typeof UpdatePasswordStrategyPayloadSchema
>;
export type UpdatePasswordStrategyPayload = z.output<
  typeof UpdatePasswordStrategyPayloadSchema
>;

export const ForgotPasswordSchema = z.object({
  identifier: z.string().optional(),
  identifierType: IdentityIdentifierSchema.optional(),
});

export const VerifyPasswordSchema = z.object({
  password: z.string(),
  identifier: z.string().optional(),
  identifierType: IdentityIdentifierSchema.optional(),
});
