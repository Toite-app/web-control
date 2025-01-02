import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { _buildUrl } from "./_url";

export type PDefault = Record<string, string | number> | unknown;
export type DDefault = Record<string, unknown> | any | unknown;

export type RequestEndpointConfig<
  U extends string = string,
  P extends PDefault = PDefault,
  D extends DDefault = DDefault,
> = Omit<AxiosRequestConfig<D>, "params" | "url"> & {
  url: string;
  urlValues?: Record<U, string | number>;
  params?: P;
  skip?: boolean;
};

/**
 * Typization for the request endpoint function
 * first - U - url (string | { path: string; values: Record<string, string | number> })
 * second - R - response type
 * third - P - params type
 * fourth - D - data type
 * @param config
 * @returns
 */
export const _requestEndpoint = async <
  U extends string,
  R,
  P extends PDefault,
  D,
>(
  config: RequestEndpointConfig<U, P, D>
): Promise<AxiosResponse<R> | undefined> => {
  const { params, urlValues, skip } = config;

  const url = _buildUrl(config.url, urlValues);

  if (skip) return undefined;

  return await axios<R, AxiosResponse<R>, D>({
    baseURL: `/api`,
    withCredentials: true,
    ...config,
    url,
    params,
  });
};
