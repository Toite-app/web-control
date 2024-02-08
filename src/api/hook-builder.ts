import axios, { AxiosError, AxiosRequestConfig, Method } from "axios";
import { _buildUrl, BuildUrlInput } from "./builder/_url";
import useSWR, { SWRConfiguration } from "swr";

export type BuildApiHookOptions<
  DataType,
  PayloadType,
  ParamsType extends Record<string, string | number>,
  UrlValues extends string,
> = {
  method?: Method;
  url: BuildUrlInput<UrlValues>;
  payload?: PayloadType;
  defaultPayload?: PayloadType;
  params?: ParamsType;
  config?: SWRConfiguration<DataType, AxiosError<DataType, PayloadType>>;
  axiosConfig?: AxiosRequestConfig;
  skip?: boolean;
};

export const mutateApiEndpoint = async <
  DataType,
  PayloadType,
  ParamsType extends Record<string, string | number>,
  UrlValues extends string,
>(
  options: Pick<
    BuildApiHookOptions<DataType, PayloadType, ParamsType, UrlValues>,
    "method" | "payload" | "defaultPayload" | "params" | "url" | "axiosConfig"
  >
) => {
  const {
    method = "GET",
    payload,
    defaultPayload,
    params,
    axiosConfig,
  } = options;

  const url = _buildUrl(options.url);

  const mergedPayload = {
    ...defaultPayload,
    ...payload,
  };

  const result = await axios({
    baseURL: `${process.env.NEXT_PUBLIC_APP_URL}/api`,
    method,
    url,
    params,
    ...(Object.keys(mergedPayload).length > 0 ? { data: mergedPayload } : {}),
    withCredentials: true,
    ...(axiosConfig || {}),
  });

  // mutate tags

  return result.data as DataType;
};

export const useApiEndpoint = <
  DataType,
  PayloadType,
  ParamsType extends Record<string, string | number>,
  UrlValues extends string,
>(
  options: BuildApiHookOptions<DataType, PayloadType, ParamsType, UrlValues>
) => {
  const { config, skip } = options;

  const url = _buildUrl(options.url);

  const fetcher = async () => {
    if (skip) return undefined;

    return await mutateApiEndpoint<
      DataType,
      PayloadType,
      ParamsType,
      UrlValues
    >(options);
  };

  const swrInstance = useSWR<DataType, AxiosError<DataType, PayloadType>>(
    url + JSON.stringify(options.params),
    fetcher as () => Promise<DataType>,
    {
      revalidateOnFocus: false,
      ...config,
    }
  );

  return swrInstance;
};

/**
 * @deprecated
 * @param options
 * @returns
 */
export const buildApiHook = <
  DataType,
  PayloadType,
  ParamsType extends Record<string, string | number>,
  UrlValues extends string,
>(
  options: BuildApiHookOptions<DataType, PayloadType, ParamsType, UrlValues>
) => {
  return (
    params?: Pick<
      BuildApiHookOptions<DataType, PayloadType, ParamsType, UrlValues>,
      "config" | "skip" | "payload" | "params"
    >
  ) => {
    const { config, ...rest } = params || {};

    return useApiEndpoint<DataType, PayloadType, ParamsType, UrlValues>({
      ...options,
      ...rest,
      config: {
        ...options.config,
        ...config,
      },
    });
  };
};

export const buildApiMutation = <
  DataType,
  PayloadType,
  ParamsType extends Record<string, string | number>,
  UrlValues extends string,
>(
  options: BuildApiHookOptions<DataType, PayloadType, ParamsType, UrlValues>
) => {
  return async (
    params?: Pick<
      BuildApiHookOptions<DataType, PayloadType, ParamsType, UrlValues>,
      "payload" | "params" | "axiosConfig"
    >
  ) => {
    return await mutateApiEndpoint<
      DataType,
      PayloadType,
      ParamsType,
      UrlValues
    >({
      ...options,
      ...params,
    });
  };
};
