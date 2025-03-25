import { type } from 'arktype';
import { BasePayloadSchema } from '../base.js';

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

export const OperationActivityPayloadSchema = BasePayloadSchema.and({
  type: type("'operation'"),
  operation: OperationSchema,
  message: type('string'),
  target: type('string'),
});
export type OperationActivityPayload =
  typeof OperationActivityPayloadSchema.inferOut;
