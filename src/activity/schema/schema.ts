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
export type ActivityProperties = typeof ActivitySchema.inferIn;
export type Activity = typeof ActivitySchema.inferOut;

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
export * from './types/authentication.js';
export * from './types/authorization.js';
export * from './types/note.js';
export * from './types/operation.js';
export * from './types/unknown.js';

export * from './utils.js';
