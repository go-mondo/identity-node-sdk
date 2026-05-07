import * as z from 'zod/v4';

export function appendSearchParams(
  path: string,
  params: Map<string, string | undefined | null> | URLSearchParams
): string {
  const vals = Array.from(params.entries()).reduce((result, [key, val]) => {
    if (val) {
      result.push(`${key}=${val}`);
    }

    return result;
  }, [] as string[]);

  return [path, vals.filter(Boolean).join('&')].filter(Boolean).join('?');
}

export const RelativeUrlPathSchema = z
  .string()
  .regex(/^\/(?!\/)[a-zA-Z0-9\-\._~%!$&'()*+,;=:@\/?]*$/, {
    message: 'Must be a valid relative path starting with /',
  });
export type RelativeUrlPath = z.output<typeof RelativeUrlPathSchema>;

const WebUrlString = z.url({
  protocol: /^https?$/,
  hostname:
    /^([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}|localhost$/,
});

const WebUrlObject = z.instanceof(URL);

export const WebUrlObjectSchema = WebUrlString.pipe(
  z.transform((url) => new URL(url))
).or(WebUrlObject);
export type WebUrlObjectInput = z.input<typeof WebUrlObjectSchema>;
export type WebUrlObject = z.output<typeof WebUrlObjectSchema>;

export const WebUrlStringSchema = WebUrlObject.pipe(
  z.transform((url) => url.toString())
).or(WebUrlString);
export type WebUrlStringInput = z.input<typeof WebUrlStringSchema>;
export type WebUrlString = z.output<typeof WebUrlStringSchema>;

const WebUrlObjectSetTypeSchema = z.instanceof(Set<URL>);
const WebUrlObjectArrayTypeScheama = z
  .array(WebUrlObjectSchema)
  .pipe(z.transform((v) => v?.filter((i) => !!i)));

export const UniqueWebUrlObjectArraySchema = z
  .union([
    z.undefined(),
    WebUrlObjectArrayTypeScheama,
    WebUrlObjectSetTypeSchema,
  ])
  .pipe(z.transform((v) => (!v ? v : Array.from(new Set(v)))));
export type UniqueWebUrlObjectArrayInput = z.input<
  typeof UniqueWebUrlObjectArraySchema
>;
export type UniqueWebUrlObjectArray = z.output<
  typeof UniqueWebUrlObjectArraySchema
>;

export const UniqueWebUrlStringArraySchema = z
  .union([
    z.undefined(),
    WebUrlObjectArrayTypeScheama,
    WebUrlObjectSetTypeSchema,
  ])
  .pipe(
    z.transform((v) =>
      !v ? v : Array.from(new Set(v)).map((url) => url.toString())
    )
  );
export type UniqueWebUrlStringArrayInput = z.input<
  typeof UniqueWebUrlStringArraySchema
>;
export type UniqueWebUrlStringArray = z.output<
  typeof UniqueWebUrlStringArraySchema
>;

export const UniqueWebUrlObjectSetSchema = z
  .union([
    z.undefined(),
    WebUrlObjectArrayTypeScheama,
    WebUrlObjectSetTypeSchema,
  ])
  .pipe(z.transform((v) => (!v ? v : new Set(v))));

export type UniqueWebUrlObjectSetInput = z.input<
  typeof UniqueWebUrlObjectSetSchema
>;
export type UniqueWebUrlObjectSet = z.output<
  typeof UniqueWebUrlObjectSetSchema
>;

export const UniqueWebUrlStringSetSchema = z
  .union([
    z.undefined(),
    WebUrlObjectArrayTypeScheama,
    WebUrlObjectSetTypeSchema,
  ])
  .pipe(
    z.transform((v) =>
      !v ? v : new Set(Array.from(new Set(v)).map((url) => url.toString()))
    )
  );

export type UniqueWebUrlStringSetInput = z.input<
  typeof UniqueWebUrlStringSetSchema
>;
export type UniqueWebUrlStringSet = z.output<
  typeof UniqueWebUrlStringSetSchema
>;
