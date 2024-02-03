import axios, { AxiosError, Method } from "axios";
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
  skip?: boolean;
};

export const useApiEndpoint = <DataType, PayloadType, UrlValues extends string>(
  options: BuildApiHookOptions<DataType, PayloadType, UrlValues>
) => {
  const {
    method = "GET",
    config,
    payload,
    defaultPayload,
    params,
    skip,
  } = options;

  const url = buildUrl(options.url);

  const fetcher = async () => {
    if (skip) return undefined;

    const mergedPayload = {
      ...defaultPayload,
      ...payload,
    };

    const result = await axios({
      method,
      url,
      params,
      ...(Object.keys(mergedPayload).length > 0 ? { data: mergedPayload } : {}),
      withCredentials: true,
    });

    return result.data;
  };

  const swrInstance = useSWR<DataType, AxiosError<DataType, PayloadType>>(
    url,
    fetcher,
    {
      revalidateOnFocus: false,
      ...config,
    }
  );

  return swrInstance;
};
