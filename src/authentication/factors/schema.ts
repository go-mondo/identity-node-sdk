import { scope, type } from 'arktype';
import { StrategyIdSchema } from '../strategies/schema/base.js';

const factorScope = scope({
  factor: {
    id: StrategyIdSchema,
    'nextFactors?': 'childFactors',
  },
  childFactors: 'factor[] | undefined | null',
  'nextFactors?': 'factor[] | undefined | null',
});

export const AuthenticationFactorPayloadSchema = type({
  id: StrategyIdSchema,
  ...factorScope.export('nextFactors?'),
});
export type AuthenticationFactorPayload =
  typeof AuthenticationFactorPayloadSchema.inferOut;

export const AuthenticationFactorsSchema =
  AuthenticationFactorPayloadSchema.array()
    .or('undefined | null')
    .pipe((f) => (f == null ? undefined : f));
export type AuthenticationFactors = typeof AuthenticationFactorsSchema.inferOut;

export const AuthenticationFactorsPayloadSchema = type({
  factors: AuthenticationFactorsSchema,
});
export type AuthenticationFactorsPayload =
  typeof AuthenticationFactorsPayloadSchema.inferOut;

export const UpsertAuthenticationFactorsPayloadSchema = type({
  factors: AuthenticationFactorPayloadSchema.array()
    .or('undefined | null')
    .optional(),
});
