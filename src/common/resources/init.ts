import { z } from 'zod';

const BaseConfigSchema = z.object({
  host: z
    .url()
    .default('https://manage-api.mondoidentity.com')
    .pipe(z.transform((v) => new URL(v))),
});

const AccessTokenConfigSchema = z.object({
  ...BaseConfigSchema.shape,
  accessToken: z.string().min(1),
});

const ConfigSchema = AccessTokenConfigSchema;

export type ConfigProps = z.input<typeof ConfigSchema>;
export type Config = z.output<typeof ConfigSchema>;

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
  try {
    return ConfigSchema.parse(config);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid configuration: ${error.message}`);
    }
    throw error;
  }
}
