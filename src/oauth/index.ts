export {
  AuthorizationDisplay,
  AuthorizationDisplaySchema,
  AuthorizationPrompt,
  AuthorizationPromptSchema,
  CodeChallengeMethod,
  CodeChallengeMethodSchema,
  GrantType,
  GrantTypeLabel,
  OAuthScope,
  OIDCScope,
  ResponseType,
  ScopeStringSchema,
  type AnyAuthorizationDisplay,
  type AnyAuthorizationPrompt,
  type AnyCodeChallengeMethod,
  type AnyGrantType,
  type AnyOAuthScope,
  type AnyOIDCScope,
  type AnyResponseType,
  type AnyScope,
  type ScopeString,
} from './common/schema.js';

export * as Authorize from './authorize/index.js';
export * as Token from './token/index.js';
