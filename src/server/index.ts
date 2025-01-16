import axios, { AxiosRequestConfig } from "axios";
import { cookies, headers } from "next/headers";

export default class Server {
  public static instance = axios.create({
    baseURL: process.env.NEXT_INTERNAL_API_URL,
    withCredentials: true,
  });

  public static async request<T>(config: AxiosRequestConfig) {
    "use server";
    try {
      const response = await this.instance.request<T>({
        ...config,
        headers: {
          ...(config.headers ?? {}),
          ...Object.fromEntries(headers().entries()),
          "x-disable-session-refresh": "true",
          "x-lang": cookies().get("NEXT_LOCALE")?.value ?? "en",
        },
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
