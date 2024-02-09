import { Method } from "axios";
import { PDefault, RequestEndpointConfig, _requestEndpoint } from "./_request";
import { ApiCacheTag } from "../types";
import { _buildUrl } from "./_url";
import { mutateCache } from "./mutate";

export type BuildApiMutationConfig = {
  url: string;
  method: Method;
  tags?: ApiCacheTag[];
};

export type ApiMutationConfig<U extends string, P extends PDefault, D> = Pick<
  RequestEndpointConfig<U, P, D>,
  "params" | "data" | "urlValues"
>;

export const buildApiMutation = <U extends string, R, P extends PDefault, D>(
  buildConfig: BuildApiMutationConfig
) => {
  const { method, url: _url, tags: _b_tags = [] } = buildConfig;

  return async (config?: ApiMutationConfig<U, P, D>) => {
    const { params, data, urlValues } = config || {};

    const url = _buildUrl(_url, urlValues);
    const tags = [`${url}-${JSON.stringify(params)}`, ..._b_tags];

    const result = await _requestEndpoint<U, R, P, D>({
      url,
      method,
      params,
      data,
    });

    // invalidate tags if result is successful
    if (method !== "GET") mutateCache(tags);

    return result?.data as R;
  };
};
