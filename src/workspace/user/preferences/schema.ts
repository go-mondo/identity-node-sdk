import { z } from 'zod';
import {
  DeactivatedAtPropertyPayloadSchema,
  DeactivatedAtPropertySchema,
  DeletedAtPropertyPayloadSchema,
  DeletedAtPropertySchema,
  OptionalDatePayloadSchema,
  OptionalDateSchema,
} from '../../../common/schema/dates.js';
import {
  MetadataMapPropertySchema,
  UpsertMetadataPropertyPayloadSchema,
} from '../../../common/schema/metadata.js';

const TableSchema = z.object({
  columns: z.array(z.string()).optional(),
});

const TablesSchema = z.record(z.string(), TableSchema);

const BaseSchema = z.object({
  views: TablesSchema.optional(),
});

export const UserPreferencesSchema = z.object({
  ...BaseSchema.shape,
  updatedAt: OptionalDateSchema,
  ...DeletedAtPropertySchema.shape,
  ...DeactivatedAtPropertySchema.shape,
  ...MetadataMapPropertySchema.shape,
});
export type UserPreferencesProperties = z.input<typeof UserPreferencesSchema>;
export type UserPreferences = z.output<typeof UserPreferencesSchema>;

export const UserPreferencesPayloadSchema = z.object({
  ...BaseSchema.shape,
  updatedAt: OptionalDatePayloadSchema,
  ...DeletedAtPropertyPayloadSchema.shape,
  ...DeactivatedAtPropertyPayloadSchema.shape,
  ...UpsertMetadataPropertyPayloadSchema.shape,
});
export type UserPreferencesPayload = z.output<
  typeof UserPreferencesPayloadSchema
>;

export const UpsertUserPreferencesPayloadSchema = z.object({
  ...BaseSchema.shape,
  ...UpsertMetadataPropertyPayloadSchema.shape,
});
export type UpsertUserPreferencesPayload = z.output<
  typeof UpsertUserPreferencesPayloadSchema
>;
