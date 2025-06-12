import { type } from 'arktype';
import {
  OptionalDatePayloadSchema,
  OptionalDateSchema,
  RequiredDatePayloadSchema,
  RequiredDateSchema,
} from '../../common/schema/dates.js';
import {
  MetadataMapPropertySchema,
  MetadataPayloadPropertySchema,
} from '../../common/schema/metadata.js';
import { UserIdSchema } from '../../customer/users/schema.js';
import {
  StrategyIdSchema,
  StrategyTypeSchema,
} from '../strategies/schema/base.js';

export const SessionStatus = {
  INITIATED: 'initiated', // Session was created, but no activity has been taken
  AUTHENTICATED: 'authenticated', // Session is authenticated
  PENDING: 'pending', // Session is in the process of authenticating
} as const;

export type AnySessionStatus =
  (typeof SessionStatus)[keyof typeof SessionStatus];

export const SessionIdSchema = type.string;
export type SessionId = typeof SessionIdSchema.inferOut;

export const SessionIdPropertySchema = type({
  id: SessionIdSchema,
});
export type SessionIdProperty = typeof SessionIdPropertySchema.inferOut;

export const SessionStatusSchema = type.enumerated(
  SessionStatus.INITIATED,
  SessionStatus.AUTHENTICATED,
  SessionStatus.PENDING
);

export const SessionAuthenticationFactorSchema = type({
  id: StrategyIdSchema,
  type: StrategyTypeSchema,
  settings: type('Record<string, unknown> | undefined').optional(),
  state: type('string | undefined').optional(),
});
export type SessionAuthenticationFactor =
  typeof SessionAuthenticationFactorSchema.inferOut;

const AuthenticationFactorHistoryArraySchema = StrategyIdSchema.array();
const AuthenticationFactorHistorySetSchema = type.instanceOf(
  Set<typeof StrategyIdSchema.inferOut>
);
export const SessionAuthenticationFactorHistorySchema = type('undefined')
  .or(AuthenticationFactorHistoryArraySchema)
  .or(AuthenticationFactorHistorySetSchema)
  .pipe((s) =>
    (s instanceof Set ? Array.from(s) : s)?.length ? s : undefined
  );
export type SessionAuthenticationFactorHistory =
  typeof SessionAuthenticationFactorHistorySchema.inferOut;

const BaseSchema = SessionIdPropertySchema.and({
  status: SessionStatusSchema,
  user: UserIdSchema.or('undefined').optional(),
  userAgent: type('string | undefined').optional(),
  sourceIp: type('string.ip.v4 | string.ip.v6	| undefined').optional(),
  factors: SessionAuthenticationFactorSchema.array().or('undefined').optional(),
  factorHistory: SessionAuthenticationFactorHistorySchema.optional(),
});

export const SessionSchema = BaseSchema.and({
  expiresAt: RequiredDateSchema,
  createdAt: RequiredDateSchema,
  updatedAt: RequiredDateSchema,
  deletedAt: OptionalDateSchema.optional(),
  deactivatedAt: OptionalDateSchema.optional(),
}).and(MetadataMapPropertySchema);
export type SessionProperties = typeof SessionSchema.inferIn;
export type Session = typeof SessionSchema.inferOut;

export const SessionPayloadSchema = BaseSchema.and({
  expiresAt: RequiredDatePayloadSchema,
  createdAt: RequiredDatePayloadSchema,
  updatedAt: RequiredDatePayloadSchema,
  'deletedAt?': OptionalDatePayloadSchema,
  'deactivatedAt?': OptionalDatePayloadSchema,
}).and(MetadataPayloadPropertySchema);
export type SessionPayload = typeof SessionPayloadSchema.inferOut;

export const SessionAssociationReferenceSchema = SessionPayloadSchema.pick(
  'id',
  'status',
  'user',
  'userAgent',
  'sourceIp',
  'createdAt',
  'expiresAt'
).and({
  model: "'Session'",
});
export type SessionAssociationReference =
  typeof SessionAssociationReferenceSchema.inferOut;
