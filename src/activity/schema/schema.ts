import { AuthenticationActivityPayloadSchema } from './types/authentication.js';
import { AuthorizationActivityPayloadSchema } from './types/authorization.js';
import {
  InsertNoteActivityPayloadSchema,
  NoteActivityPayloadSchema,
  UpdateNoteActivityPayloadSchema,
} from './types/note.js';
import { OperationActivityPayloadSchema } from './types/operation.js';
import { UnknownActivityPayloadSchema } from './types/unknown.js';

export const ActivityType = {
  UNKNOWN: 'unknown',
  NOTE: 'note',
  OPERATION: 'operation',
  AUTHORIZATION: 'authorization',
  AUTHENTICATION: 'authentication',
} as const;

export type AnyActivityType = (typeof ActivityType)[keyof typeof ActivityType];

export const PerformerType = {
  SYSTEM: 'system',
  GUEST: 'guest',
  IDENTITY: 'identity',
  AUTOMATION: 'automation',
  INTEGRATION: 'integration',
} as const;

export type AnyPerformerType =
  (typeof PerformerType)[keyof typeof PerformerType];

export const ActivityPayloadSchema = NoteActivityPayloadSchema.or(
  AuthenticationActivityPayloadSchema
)
  .or(AuthorizationActivityPayloadSchema)
  .or(OperationActivityPayloadSchema)
  .or(UnknownActivityPayloadSchema);
export type ActivityPayload = typeof ActivityPayloadSchema.inferOut;

export const InsertActivityPayloadSchema = InsertNoteActivityPayloadSchema;
export type InsertActivityPayload = typeof InsertActivityPayloadSchema.inferOut;

export const UpdateActivityPayloadSchema = UpdateNoteActivityPayloadSchema;
export type UpdateActivityPayload = typeof UpdateActivityPayloadSchema.inferOut;

export {
  ActivityIdPropertySchema,
  ActivityIdSchema,
  PerformedBySchema,
  SourceSchema,
  type ActivityId,
  type ActivityIdProperty,
  type PerformedBy,
} from './base.js';
export * from './schema.js';
export * from './types/authentication.js';
export * from './types/authorization.js';
export * from './types/note.js';
export * from './types/operation.js';
export * from './types/unknown.js';

export * from './utils.js';
