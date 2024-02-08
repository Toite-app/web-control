import useSWR, { SWRConfiguration } from "swr";
import { PDefault, RequestEndpointConfig, _requestEndpoint } from "./_request";
import { AxiosError, Method } from "axios";
import { _buildUrl } from "./_url";

// When hook building
export type BuildApiHookConfig<U extends string, R, P extends PDefault, D> = {
  url: string;
  method: Method;
} & Pick<UseApiHookConfig<U, R, P, D>, "config" | "requestConfig">;

// When hook used in client components
export type UseApiHookConfig<U extends string, R, P extends PDefault, D> = Pick<
  RequestEndpointConfig<U, P, D>,
  "params" | "data" | "skip" | "urlValues"
> & {
  config?: SWRConfiguration<R, AxiosError<R, D>>;
  requestConfig?: Omit<
    RequestEndpointConfig<U, P, D>,
    "params" | "data" | "skip" | "url" | "urlValues"
  >;
};

export const buildApiHook = <U extends string, R, P extends PDefault, D>(
  buildConfig: BuildApiHookConfig<U, R, P, D>
) => {
  const {
    url: _url,
    method,
    config: _b_config,
    requestConfig: _b_requestConfig,
  } = buildConfig;

  return (config?: UseApiHookConfig<U, R, P, D>) => {
    const { urlValues, requestConfig } = config || {};

    const url = _buildUrl(_url, urlValues);

    const tags = [url];

    return useSWR(
      tags,
      async () => {
        const result = await _requestEndpoint<U, R, P, D>({
          url,
          method,
          ..._b_requestConfig,
          ...requestConfig,
        });

        return result?.data as R;
      },
      {
        revalidateOnFocus: false,
        ..._b_config,
        ...config?.config,
      }
    );
  };
};
