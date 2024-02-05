import axios, { AxiosError, AxiosRequestConfig, Method } from "axios";
import { buildUrl, BuildUrlInput } from "./url-builder";
import useSWR, { SWRConfiguration } from "swr";

export type BuildApiHookOptions<
  DataType,
  PayloadType,
  UrlValues extends string,
> = {
  method?: Method;
  url: BuildUrlInput<UrlValues>;
  payload?: PayloadType;
  defaultPayload?: PayloadType;
  params?: Record<string, string>;
  config?: SWRConfiguration<DataType, AxiosError<DataType, PayloadType>>;
  axiosConfig?: AxiosRequestConfig;
  skip?: boolean;
};

export const mutateApiEndpoint = async <
  DataType,
  PayloadType,
  UrlValues extends string,
>(
  options: Pick<
    BuildApiHookOptions<DataType, PayloadType, UrlValues>,
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

  const url = buildUrl(options.url);

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

export const useApiEndpoint = <DataType, PayloadType, UrlValues extends string>(
  options: BuildApiHookOptions<DataType, PayloadType, UrlValues>
) => {
  const { config, skip } = options;

  const url = buildUrl(options.url);

  const fetcher = async () => {
    if (skip) return undefined;

    return await mutateApiEndpoint<DataType, PayloadType, UrlValues>(options);
  };

  const swrInstance = useSWR<DataType, AxiosError<DataType, PayloadType>>(
    url,
    fetcher as () => Promise<DataType>,
    {
      revalidateOnFocus: false,
      ...config,
    }
  );

  return swrInstance;
};

export const buildApiHook = <DataType, PayloadType, UrlValues extends string>(
  options: BuildApiHookOptions<DataType, PayloadType, UrlValues>
) => {
  return (
    params?: Pick<
      BuildApiHookOptions<DataType, PayloadType, UrlValues>,
      "config" | "skip" | "payload" | "params"
    >
  ) => {
    const { config, ...rest } = params || {};

    return useApiEndpoint<DataType, PayloadType, UrlValues>({
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
  UrlValues extends string,
>(
  options: BuildApiHookOptions<DataType, PayloadType, UrlValues>
) => {
  return async (
    params?: Pick<
      BuildApiHookOptions<DataType, PayloadType, UrlValues>,
      "payload" | "params" | "axiosConfig"
    >
  ) => {
    return await mutateApiEndpoint<DataType, PayloadType, UrlValues>({
      ...options,
      ...params,
    });
  };
};
