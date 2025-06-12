import { type } from 'arktype';
import { BasePayloadSchema, BaseSchema } from '../base.js';

export const OperationType = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  AUTOMATION: 'automation',
} as const;

export type AnyOperationType =
  (typeof OperationType)[keyof typeof OperationType];

const OperationSchema = type.enumerated(
  OperationType.CREATE,
  OperationType.UPDATE,
  OperationType.DELETE,
  OperationType.AUTOMATION
);

const BaseOperationSchema = type({
  type: type("'operation'"),
  operation: OperationSchema,
  message: type('string'),
  target: type('string'),
});

export const OperationActivitySchema = BaseSchema.and(BaseOperationSchema);
export type OperationActivityProperties =
  typeof OperationActivitySchema.inferIn;
export type OperationActivity = typeof OperationActivitySchema.inferOut;

export const OperationActivityPayloadSchema =
  BasePayloadSchema.and(BaseOperationSchema);
export type OperationActivityPayload =
  typeof OperationActivityPayloadSchema.inferOut;
