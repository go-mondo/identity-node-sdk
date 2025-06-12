import {
  EmailStrategyPayloadSchema,
  EmailStrategySchema,
  InsertEmailStrategyPayloadSchema,
  UpdateEmailStrategyPayloadSchema,
} from './types/email.js';
import {
  InsertPasswordStrategyPayloadSchema,
  PasswordStrategyPayloadSchema,
  PasswordStrategySchema,
  UpdatePasswordStrategyPayloadSchema,
} from './types/password.js';
import {
  InsertTOTPStrategyPayloadSchema,
  TOTPStrategyPayloadSchema,
  TOTPStrategySchema,
  UpdateTOTPStrategyPayloadSchema,
} from './types/totp.js';

/**
 * Union(s)
 */
export const InsertStrategyPayloadSchema =
  InsertPasswordStrategyPayloadSchema.or(InsertEmailStrategyPayloadSchema).or(
    InsertTOTPStrategyPayloadSchema
  );
export type InsertStrategyInput = typeof InsertStrategyPayloadSchema.inferIn;
export type InsertStrategyPayload = typeof InsertStrategyPayloadSchema.inferOut;

export const UpdateStrategyPayloadSchema =
  UpdatePasswordStrategyPayloadSchema.or(UpdateEmailStrategyPayloadSchema).or(
    UpdateTOTPStrategyPayloadSchema
  );
export type UpdateStrategyInput = typeof UpdateStrategyPayloadSchema.inferIn;
export type UpdateStrategyPayload = typeof UpdateStrategyPayloadSchema.inferOut;

export const StrategyPayloadSchema = PasswordStrategyPayloadSchema.or(
  EmailStrategyPayloadSchema.or(TOTPStrategyPayloadSchema)
);
export type StrategyPayload = typeof StrategyPayloadSchema.inferOut;

export const StrategySchema =
  PasswordStrategySchema.or(EmailStrategySchema).or(TOTPStrategySchema);
export type Strategy = typeof StrategySchema.inferOut;

export {
  BaseInsertStrategyPayloadSchema,
  BaseStrategyPayloadSchema,
  BaseUpdateStrategyPayloadSchema,
  StrategyIdPropertySchema,
  StrategyIdSchema,
  StrategyLabelSchema,
  StrategyStatus,
  StrategyStatusSchema,
  StrategyType,
  type AnyStrategyStatus,
  type AnyStrategyType,
  type StrategyId,
  type StrategyIdProperty,
} from './base.js';
export * from './types/email.js';
export * from './types/password.js';
export * from './types/totp.js';
