import type { z } from 'zod';

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
export type InsertStrategyInput = z.input<typeof InsertStrategyPayloadSchema>;
export type InsertStrategyPayload = z.output<
  typeof InsertStrategyPayloadSchema
>;

export const UpdateStrategyPayloadSchema =
  UpdatePasswordStrategyPayloadSchema.or(UpdateEmailStrategyPayloadSchema).or(
    UpdateTOTPStrategyPayloadSchema
  );
export type UpdateStrategyInput = z.input<typeof UpdateStrategyPayloadSchema>;
export type UpdateStrategyPayload = z.output<
  typeof UpdateStrategyPayloadSchema
>;

export const StrategyPayloadSchema = PasswordStrategyPayloadSchema.or(
  EmailStrategyPayloadSchema.or(TOTPStrategyPayloadSchema)
);
export type StrategyPayload = z.input<typeof StrategyPayloadSchema>;

export const StrategySchema =
  PasswordStrategySchema.or(EmailStrategySchema).or(TOTPStrategySchema);
export type StrategyProperties = z.input<typeof StrategySchema>;
export type Strategy = z.output<typeof StrategySchema>;

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
