import { type } from 'arktype';

const BaseConfigSchema = type({
  host: type('string.url.parse').default(
    'https://manage-api.mondoidentity.com'
  ),
});

const AccessTokenConfigSchema = BaseConfigSchema.and({
  accessToken: type('string'),
});

const ConfigSchema = AccessTokenConfigSchema;

type ConfigProps = typeof ConfigSchema.inferIn;
type Config = typeof ConfigSchema.inferOut;

export class MondoIdentity {
  readonly config: Config;

  public constructor(config: ConfigProps) {
    this.config = initConfig(config);
  }

  /**
   * Builds an authorizer function based on the type of access token
   */
  public get authorizer(): (request: RequestInit) => RequestInit {
    if (this.config.accessToken) {
      return (request) => {
        request.headers = new Headers(request.headers);
        request.headers.append('authorization', this.config.accessToken);
        return request;
      };
    }

    return (request) => request;
  }

  // public getItemWithAuthorization<Result>(url: URL): Promise<Result> {
  //     try {
  //         console.debug("Get item", { url });

  //         const response = await fetch(
  //             url,
  //             authorization.applyAuthorization({
  //                 method: "GET",
  //                 headers: defaultRequestHeaders(),
  //             })
  //         );

  //         if (response.ok) {
  //             return await response.json();
  //         }

  //         throw await responseToHttpError(response);
  //     } catch (error) {
  //         throw toHttpError(error);
  //     }
  // };
}

function initConfig(config: ConfigProps): Config {
  const out = ConfigSchema(config);

  if (out instanceof type.errors) {
    throw new Error(`Invalid configuration: ${out.summary}`);
  }

  return out;
}
