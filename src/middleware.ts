import { locales, pathnames, localePrefix } from "./config";
import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  defaultLocale: "en",
  locales,
  pathnames,
  localePrefix,
});

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(ru|en|et)/:path*"],
};
