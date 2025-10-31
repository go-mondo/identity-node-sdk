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

const UrlObjectScheama = z
  .url()
  .pipe(z.transform((url) => new URL(url)))
  .or(z.instanceof(URL));
export type UrlObjectInput = z.input<typeof UrlObjectScheama>;
export type UrlObject = z.output<typeof UrlObjectScheama>;

const UrlStringScheama = z
  .instanceof(URL)
  .pipe(z.transform((url) => url.toString()))
  .or(z.url());
export type UrlStringInput = z.input<typeof UrlStringScheama>;
export type UrlString = z.output<typeof UrlStringScheama>;
