import { type } from 'arktype';

/**
 * Ref: https://datatracker.ietf.org/doc/html/rfc7518#section-3.1
 */
export const Algorithm = {
  // DEFAULT: 'ES256',
  DEFAULT: 'RS256',
  HS256: 'HS256',
  HS384: 'HS384',
  HS512: 'HS512',
  RS256: 'RS256',
  RS384: 'RS384',
  RS512: 'RS512',
  ES256: 'ES256',
  ES384: 'ES384',
  ES512: 'ES512',
  PS256: 'PS256',
  PS384: 'PS384',
  PS512: 'PS512',
};

export type AnyAlgorithm = (typeof Algorithm)[keyof typeof Algorithm];

export const AlgorithmSchema = type.enumerated(
  Algorithm.HS256,
  Algorithm.HS384,
  Algorithm.HS512,
  Algorithm.RS256,
  Algorithm.RS384,
  Algorithm.RS512,
  Algorithm.ES256,
  Algorithm.ES384,
  Algorithm.PS256,
  Algorithm.PS384,
  Algorithm.PS512
);
