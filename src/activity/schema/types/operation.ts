import { z } from 'zod';
import { BasePayloadSchema, BaseSchema } from '../base.js';

export const OperationType = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  AUTOMATION: 'automation',
} as const;

export type AnyOperationType =
  (typeof OperationType)[keyof typeof OperationType];

const OperationSchema = z.enum([
  OperationType.CREATE,
  OperationType.UPDATE,
  OperationType.DELETE,
  OperationType.AUTOMATION,
] as const);

const BaseOperationSchema = z.object({
  type: z.literal('operation'),
  operation: OperationSchema,
  message: z.string(),
  target: z.string(),
});

export const OperationActivitySchema = z.object({
  ...BaseSchema.shape,
  ...BaseOperationSchema.shape,
});
export type OperationActivityProperties = z.input<
  typeof OperationActivitySchema
>;
export type OperationActivity = z.output<typeof OperationActivitySchema>;

export const OperationActivityPayloadSchema = z.object({
  ...BasePayloadSchema.shape,
  ...BaseOperationSchema.shape,
});
export type OperationActivityPayload = z.output<
  typeof OperationActivityPayloadSchema
>;
