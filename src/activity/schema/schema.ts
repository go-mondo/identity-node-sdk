import type { z } from 'zod';
import {
  AuthenticationActivityPayloadSchema,
  AuthenticationActivitySchema,
} from './types/authentication.js';
import {
  AuthorizationActivityPayloadSchema,
  AuthorizationActivitySchema,
} from './types/authorization.js';
import {
  InsertNoteActivityPayloadSchema,
  NoteActivityPayloadSchema,
  NoteActivitySchema,
  UpdateNoteActivityPayloadSchema,
} from './types/note.js';
import {
  OperationActivityPayloadSchema,
  OperationActivitySchema,
} from './types/operation.js';
import {
  UnknownActivityPayloadSchema,
  UnknownActivitySchema,
} from './types/unknown.js';

export {
  ActivityType,
  PerformerType,
  type AnyActivityType,
  type AnyPerformerType,
} from './base.js';

export const ActivitySchema = NoteActivitySchema.or(
  AuthenticationActivitySchema
)
  .or(AuthorizationActivitySchema)
  .or(OperationActivitySchema)
  .or(UnknownActivitySchema);
export type ActivityProperties = z.input<typeof ActivitySchema>;
export type Activity = z.output<typeof ActivitySchema>;

export const ActivityPayloadSchema = NoteActivityPayloadSchema.or(
  AuthenticationActivityPayloadSchema
)
  .or(AuthorizationActivityPayloadSchema)
  .or(OperationActivityPayloadSchema)
  .or(UnknownActivityPayloadSchema);
export type ActivityPayload = z.output<typeof ActivityPayloadSchema>;

export const InsertActivityPayloadSchema = InsertNoteActivityPayloadSchema;
export type InsertActivityPayload = z.output<
  typeof InsertActivityPayloadSchema
>;

export const UpdateActivityPayloadSchema = UpdateNoteActivityPayloadSchema;
export type UpdateActivityPayload = z.output<
  typeof UpdateActivityPayloadSchema
>;

export {
  ActivityIdPropertySchema,
  ActivityIdSchema,
  PerformedBySchema,
  SourceSchema,
  type ActivityId,
  type ActivityIdProperty,
  type PerformedBy,
} from './base.js';
export * from './types/authentication.js';
export * from './types/authorization.js';
export * from './types/note.js';
export * from './types/operation.js';
export * from './types/unknown.js';

export * from './utils.js';
