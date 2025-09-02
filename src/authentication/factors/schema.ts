import * as z from 'zod/v4';
import { StrategyIdSchema } from '../strategies/schema/base.js';

// Define the recursive factor schema
export type AuthenticationFactorType = {
  id: string;
  nextFactors?: AuthenticationFactorType[] | undefined | null;
};

const AuthenticationFactorBaseSchema: z.ZodType<AuthenticationFactorType> =
  z.lazy(() =>
    z.object({
      id: StrategyIdSchema,
      nextFactors: z
        .array(AuthenticationFactorBaseSchema)
        .or(z.undefined())
        .or(z.null())
        .optional(),
    })
  );

export const AuthenticationFactorSchema = AuthenticationFactorBaseSchema;
export type AuthenticationFactorProperties = z.input<
  typeof AuthenticationFactorPayloadSchema
>;
export type AuthenticationFactor = z.output<
  typeof AuthenticationFactorPayloadSchema
>;

export const AuthenticationFactorPayloadSchema = AuthenticationFactorBaseSchema;
export type AuthenticationFactorPayload = z.output<
  typeof AuthenticationFactorPayloadSchema
>;

export const AuthenticationFactorsSchema = z
  .union([z.undefined(), z.null(), z.array(AuthenticationFactorPayloadSchema)])
  .pipe(z.transform((f) => (f == null ? undefined : f)));

// export const AuthenticationFactorsSchema =
//   z.array(AuthenticationFactorPayloadSchema)
//     .or(z.undefined())
//     .or(z.null())
//     .pipe(z.transform((f) => (f == null ? undefined : f)));
export type AuthenticationFactors = z.output<
  typeof AuthenticationFactorsSchema
>;

export const AuthenticationFactorsPayloadSchema = z.object({
  factors: AuthenticationFactorsSchema,
});
export type AuthenticationFactorsPayload = z.output<
  typeof AuthenticationFactorsPayloadSchema
>;

export const UpsertAuthenticationFactorsPayloadSchema = z.object({
  factors: z
    .union([
      z.array(AuthenticationFactorPayloadSchema),
      z.undefined(),
      z.null(),
    ])
    .optional(),
});
