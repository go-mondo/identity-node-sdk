import { z } from 'zod';
import {
  OptionalDatePayloadSchema,
  OptionalDateSchema,
  RequiredDatePayloadSchema,
  RequiredDateSchema,
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
export const SessionAuthenticationFactorHistorySchema = z
  .union([
    z.undefined(),
    AuthenticationFactorHistoryArraySchema,
    AuthenticationFactorHistorySetSchema,
  ])
  .pipe(
    z.transform((s) =>
      (s instanceof Set ? Array.from(s) : s)?.length ? s : undefined
    )
  );
export type SessionAuthenticationFactorHistory = z.output<
  typeof SessionAuthenticationFactorHistorySchema
>;

const BaseSchema = z.object({
  ...SessionIdPropertySchema.shape,
  status: SessionStatusSchema,
  user: z.union([UserIdSchema, z.undefined()]).optional(),
  userAgent: z.string().optional(),
  sourceIp: z.union([z.ipv4(), z.ipv6(), z.undefined()]).optional(),
  factors: z
    .union([z.array(SessionAuthenticationFactorSchema), z.undefined()])
    .optional(),
  factorHistory: SessionAuthenticationFactorHistorySchema.optional(),
});

export const SessionSchema = z.object({
  ...BaseSchema.shape,
  expiresAt: RequiredDateSchema,
  createdAt: RequiredDateSchema,
  updatedAt: RequiredDateSchema,
  redirectTo: z
    .union([z.string(), z.instanceof(URL)])
    .pipe(z.transform((v) => (!v || v instanceof URL ? v : new URL(v))))
    .optional(),
  deletedAt: OptionalDateSchema.optional(),
  deactivatedAt: OptionalDateSchema.optional(),
  ...MetadataMapPropertySchema.shape,
});
export type SessionProperties = z.input<typeof SessionSchema>;
export type Session = z.output<typeof SessionSchema>;

export const SessionPayloadSchema = z.object({
  ...BaseSchema.shape,
  expiresAt: RequiredDatePayloadSchema,
  createdAt: RequiredDatePayloadSchema,
  updatedAt: RequiredDatePayloadSchema,
  redirectTo: z
    .union([z.string(), z.instanceof(URL)])
    .transform((v) => (v instanceof URL ? v.toString() : v))
    .optional(),
  deletedAt: OptionalDatePayloadSchema.optional(),
  deactivatedAt: OptionalDatePayloadSchema.optional(),
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
