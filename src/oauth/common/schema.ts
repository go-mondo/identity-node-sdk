import * as z from 'zod/v4';
import {
  SpaceDelimitedStringToArraySchema,
  StringSetTypeSchema,
  UniqueStringArraySchema,
} from '../../common';

export const GrantType = {
  CLIENT_CREDENTIALS: 'client_credentials',
  AUTHORIZATION_CODE: 'authorization_code',
  IMPLICIT: 'implicit',
  REFRESH_TOKEN: 'refresh_token',
} as const;

export type AnyGrantType = (typeof GrantType)[keyof typeof GrantType];

export const GrantTypeLabel = {
  [GrantType.CLIENT_CREDENTIALS]: 'Client Credentials',
  [GrantType.AUTHORIZATION_CODE]: 'Authorization Code',
  [GrantType.IMPLICIT]: 'Implicit',
  [GrantType.REFRESH_TOKEN]: 'Refresh Token',
} as const;

export const ResponseType = {
  ID_TOKEN: 'id_token',
  TOKEN: 'token',
  CODE: 'code',
} as const;
export type AnyResponseType = (typeof ResponseType)[keyof typeof ResponseType];
// export const ResponseTypeSchema = type.enumerated(ResponseType.CODE, ResponseType.ID_TOKEN, ResponseType.TOKEN)

export const CodeChallengeMethod = {
  DEFAULT: 'S256',
  S256: 'S256',
  PLAIN: 'plain',
} as const;
export type AnyCodeChallengeMethod =
  (typeof CodeChallengeMethod)[keyof typeof CodeChallengeMethod];
export const CodeChallengeMethodSchema = z
  .enum([CodeChallengeMethod.PLAIN, CodeChallengeMethod.S256] as const)
  .describe('PKCE Challenge Method.');

export const AuthorizationDisplay = {
  PAGE: 'page',
  POPUP: 'popup',
  TOUCH: 'touch',
  WAP: 'wap',
} as const;
export type AnyAuthorizationDisplay =
  (typeof AuthorizationDisplay)[keyof typeof AuthorizationDisplay];
export const AuthorizationDisplaySchema = z.enum([
  AuthorizationDisplay.PAGE,
  AuthorizationDisplay.POPUP,
  AuthorizationDisplay.TOUCH,
  AuthorizationDisplay.WAP,
] as const);

export const AuthorizationPrompt = {
  NONE: 'none',
  LOGIN: 'login',
  CONSENT: 'consent',
  SELECT_ACCOUNT: 'select_account',
} as const;
export type AnyAuthorizationPrompt =
  (typeof AuthorizationPrompt)[keyof typeof AuthorizationPrompt];
export const AuthorizationPromptSchema = z.enum(
  Object.values(AuthorizationPrompt)
);

export const OptionalSchema = z.object({
  audience: z.string().optional(),
});

export const OIDCScope = {
  OPENID: 'openid',
  PROFILE: 'profile',
  EMAIL: 'email',
  ADDRESS: 'address',
  PHONE: 'phone',
} as const;
export type AnyOIDCScope = (typeof OIDCScope)[keyof typeof OIDCScope];

export const OAuthScope = {
  OFFLINE_ACCESS: 'offline_access',
} as const;
export type AnyOAuthScope = (typeof OAuthScope)[keyof typeof OAuthScope];

export const Scope = {
  ...OIDCScope,
  ...OAuthScope,
};
export type AnyScope = AnyOAuthScope | AnyOIDCScope | string;

export const ScopeStringSchema = z
  .string()
  .min(1)
  .describe('A list of space-delimited, case-sensitive strings.');
export type ScopeString = z.output<typeof ScopeStringSchema>;

export const ScopeSetSchema = z
  .union([
    SpaceDelimitedStringToArraySchema,
    UniqueStringArraySchema,
    StringSetTypeSchema,
  ])
  .pipe(z.transform((v) => (!v || v instanceof Set ? v : new Set(v))));
export type ScopeSet = z.output<typeof ScopeSetSchema>;
