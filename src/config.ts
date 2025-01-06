import { Pathnames } from "next-intl/navigation";

export const locales = ["ru", "en", "et"] as const;

export const pathnames = {
  "/": "/",
  "/sign-in": "/sign-in",
  "/dashboard": "/dashboard",
  "/restaurants": "/restaurants",
  "/restaurants/[restaurantId]": "/restaurants/[restaurantId]",
} satisfies Pathnames<typeof locales>;

// Use the default: `always`
export const localePrefix = undefined;

export type AppPathnames = keyof typeof pathnames;
