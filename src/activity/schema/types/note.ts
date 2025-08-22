import { z } from 'zod';
import {
  BaseInsertPayloadSchema,
  BasePayloadSchema,
  BaseSchema,
  BaseUpdatePayloadSchema,
} from '../base.js';

const BaseNoteSchema = z.object({
  type: z.literal('note'),
  message: z.string(),
});

export const NoteActivitySchema = z.object({
  ...BaseSchema.shape,
  ...BaseNoteSchema.shape,
});
export type NoteActivityProperties = z.input<typeof NoteActivitySchema>;
export type NoteActivity = z.output<typeof NoteActivitySchema>;

export const NoteActivityPayloadSchema = z.object({
  ...BasePayloadSchema.shape,
  ...BaseNoteSchema.shape,
});
export type NoteActivityPayload = z.output<typeof NoteActivityPayloadSchema>;

export const InsertNoteActivityPayloadSchema = z.object({
  ...BaseInsertPayloadSchema.shape,
  type: z.literal('note'),
  message: z.string(),
});
export type InsertNoteActivityPayload = z.output<
  typeof InsertNoteActivityPayloadSchema
>;

export const UpdateNoteActivityPayloadSchema = z.object({
  ...BaseUpdatePayloadSchema.shape,
  type: z.literal('note'),
  message: z.string().optional(),
});
export type UpdateNoteActivityPayload = z.output<
  typeof UpdateNoteActivityPayloadSchema
>;
