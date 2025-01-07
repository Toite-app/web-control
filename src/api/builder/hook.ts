import useSWR, { SWRConfiguration } from "swr";
import { PDefault, RequestEndpointConfig, _requestEndpoint } from "./_request";
import { AxiosError, Method } from "axios";
import { _buildUrl } from "./_url";
import { ApiCacheTag } from "../types";

// When hook building
export type BuildApiHookConfig<
  U extends Record<string, any> | unknown,
  R,
  P extends PDefault,
  D,
> = {
  url: string;
  method: Method;
  tags?: ApiCacheTag[];
} & Pick<UseApiHookConfig<U, R, P, D>, "config" | "requestConfig">;

// When hook used in client components
export type UseApiHookConfig<
  U extends Record<string, any> | unknown,
  R,
  P extends PDefault,
  D,
> = Pick<
  RequestEndpointConfig<U, P, D>,
  "params" | "data" | "skip" | "urlValues"
> & {
  config?: SWRConfiguration<R | undefined, AxiosError<R | undefined, D>>;
  requestConfig?: Omit<
    RequestEndpointConfig<U, P, D>,
    "params" | "data" | "skip" | "url" | "urlValues"
  >;
};

export const buildApiHook = <
  U extends Record<string, any> | unknown,
  R,
  P extends PDefault,
  D,
>(
  buildConfig: BuildApiHookConfig<U, R, P, D>
) => {
  const {
    url: _url,
    method,
    config: _b_config,
    requestConfig: _b_requestConfig,
    tags: _b_tags = [],
  } = buildConfig;

  return (config?: UseApiHookConfig<U, R, P, D>) => {
    const {
      params,
      data,
      skip,
      urlValues,
      requestConfig,
      config: swrConfig,
    } = config || {};

    const url = _buildUrl(_url, urlValues ?? {});
    const tags = [`${url}-${JSON.stringify(params)}`, ..._b_tags];

    return useSWR(
      tags,
      async () => {
        if (skip) return undefined;

        const result = await _requestEndpoint<U, R, P, D>({
          url,
          method,
          params,
          data,
          ..._b_requestConfig,
          ...requestConfig,
        });

        return result?.data as R;
      },
      {
        revalidateOnFocus: false,
        revalidateIfStale: false,
        ..._b_config,
        ...swrConfig,
      }
    );
  };
};
