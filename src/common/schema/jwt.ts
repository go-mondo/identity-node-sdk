import * as z from 'zod/v4';

/**
 * Ref: https://datatracker.ietf.org/doc/html/rfc7518#section-3.1
 */
export const Algorithm = {
  RS256: 'RS256',
  RS384: 'RS384',
  RS512: 'RS512',
  ES256: 'ES256',
  ES384: 'ES384',
  ES512: 'ES512',
  PS256: 'PS256',
  PS384: 'PS384',
  PS512: 'PS512',
} as const;

export type AnyAlgorithm = (typeof Algorithm)[keyof typeof Algorithm];

export const DEFAULT_ALGORITHM = Algorithm.RS256;

export const AlgorithmSchema = z.enum(
  Object.values(Algorithm)
) satisfies z.ZodType<AnyAlgorithm>;
