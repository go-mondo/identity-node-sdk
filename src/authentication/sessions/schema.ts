import * as z from 'zod/v4';
import {
  CreatedAtPropertyPayloadSchema,
  CreatedAtPropertySchema,
  DeactivatedAtPropertyPayloadSchema,
  DeactivatedAtPropertySchema,
  DeletedAtPropertyPayloadSchema,
  DeletedAtPropertySchema,
  RequiredDatePayloadSchema,
  RequiredDateSchema,
  UpdatedAtPropertyPayloadSchema,
  UpdatedAtPropertySchema,
} from '../../common/schema/dates.js';
import { KSUIDSchema } from '../../common/schema/id.js';
import {
  MetadataMapPropertySchema,
  MetadataPayloadPropertySchema,
} from '../../common/schema/metadata.js';
import { UserIdSchema } from '../../customer/schema.js';
import {
  StrategyIdSchema,
  StrategyTypeSchema,
} from '../strategies/schema/base.js';
import { Model } from '../utils.js';

export const SessionStatus = {
  INITIATED: 'initiated', // Session was created, but no activity has been taken
  AUTHENTICATED: 'authenticated', // Session is authenticated
  PENDING: 'pending', // Session is in the process of authenticating
} as const;

export type AnySessionStatus =
  (typeof SessionStatus)[keyof typeof SessionStatus];

export const SessionIdSchema = KSUIDSchema(Model.Session.UIDPrefix);
export type SessionId = z.output<typeof SessionIdSchema>;

export const SessionIdPropertySchema = z.object({
  id: SessionIdSchema,
});
export type SessionIdProperty = z.output<typeof SessionIdPropertySchema>;

export const SessionStatusSchema = z.enum([
  SessionStatus.INITIATED,
  SessionStatus.AUTHENTICATED,
  SessionStatus.PENDING,
] as const);

export const SessionAuthenticationFactorSchema = z.object({
  id: StrategyIdSchema,
  type: StrategyTypeSchema,
  settings: z.record(z.string(), z.unknown()).optional(),
  state: z.string().optional(),
});
export type SessionAuthenticationFactor = z.output<
  typeof SessionAuthenticationFactorSchema
>;

const AuthenticationFactorHistoryArraySchema = z.array(StrategyIdSchema);
const AuthenticationFactorHistorySetSchema = z.instanceof(
  Set<z.output<typeof StrategyIdSchema>>
);
const SessionAuthenticationFactorHistoryInput = z.union([
  z.undefined(),
  AuthenticationFactorHistoryArraySchema,
  AuthenticationFactorHistorySetSchema,
]);

const SessionAuthenticationFactorHistoryArraySchema =
  SessionAuthenticationFactorHistoryInput.pipe(
    z.transform((s) =>
      (s instanceof Set ? Array.from(s) : s)?.length ? s : undefined
    )
  );
// type SessionAuthenticationFactorArrayHistory = z.output<
//   typeof SessionAuthenticationFactorHistoryArraySchema
// >;

const SessionAuthenticationFactorHistorySetSchema =
  SessionAuthenticationFactorHistoryInput.pipe(
    z.transform((s) => (s instanceof Set ? s : new Set(s)))
  );
// type SessionAuthenticationFactorSetHistory = z.output<
//   typeof SessionAuthenticationFactorHistorySetSchema
// >;

const RedirectPathSchema = z
  .string()
  .regex(/^\/[a-zA-Z0-9\-\._~%!$&'()*+,;=:@\/?]*$/, {
    message: 'Must be a valid relative path starting with /',
  })
  .default('/');

const BaseSchema = z.object({
  ...SessionIdPropertySchema.shape,
  status: SessionStatusSchema,
  user: z.union([UserIdSchema, z.undefined()]).optional(),
  userAgent: z.string().optional(),
  sourceIp: z.union([z.ipv4(), z.ipv6(), z.undefined()]).optional(),
  factors: z
    .union([z.array(SessionAuthenticationFactorSchema), z.undefined()])
    .optional(),
  factorHistory: SessionAuthenticationFactorHistoryArraySchema.optional(),
});

export const SessionSchema = z.object({
  ...BaseSchema.shape,
  expiresAt: RequiredDateSchema,
  ...CreatedAtPropertySchema.shape,
  ...UpdatedAtPropertySchema.shape,
  factorHistory: SessionAuthenticationFactorHistorySetSchema,
  redirectPath: RedirectPathSchema,
  ...DeletedAtPropertySchema.shape,
  ...DeactivatedAtPropertySchema.shape,
  ...MetadataMapPropertySchema.shape,
});
export type SessionProperties = z.input<typeof SessionSchema>;
export type Session = z.output<typeof SessionSchema>;

export const SessionPayloadSchema = z.object({
  ...BaseSchema.shape,
  expiresAt: RequiredDatePayloadSchema,
  ...CreatedAtPropertyPayloadSchema.shape,
  ...UpdatedAtPropertyPayloadSchema.shape,
  redirectPath: RedirectPathSchema,
  ...DeletedAtPropertyPayloadSchema.shape,
  ...DeactivatedAtPropertyPayloadSchema.shape,
  ...MetadataPayloadPropertySchema.shape,
});
export type SessionPayload = z.output<typeof SessionPayloadSchema>;

export const SessionAssociationReferenceSchema = z.object({
  ...SessionPayloadSchema.pick({
    id: true,
    status: true,
    user: true,
    userAgent: true,
    sourceIp: true,
    createdAt: true,
    expiresAt: true,
  }).shape,
  model: z.literal('Session'),
});
export type SessionAssociationReference = z.output<
  typeof SessionAssociationReferenceSchema
>;
