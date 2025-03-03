import { Pathnames } from "next-intl/navigation";

export const locales = ["ru", "en", "et"] as const;

export const pathnames = {
  "/": "/",
  "/sign-in": "/sign-in",
  "/dashboard": "/dashboard",
  "/restaurants": "/restaurants",
  "/restaurants/[restaurantId]": "/restaurants/[restaurantId]",
  "/dishes/[dishId]": "/dishes/[dishId]",
  "/dishes": "/dishes",
  "/orders/create": "/orders/create",
  "/orders/dispatcher": "/orders/dispatcher",
  "/orders/kitchener": "/orders/kitchener",
  "/orders/[orderId]": "/orders/[orderId]",
  "/discounts": "/discounts",
  "/discounts/[discountId]": "/discounts/[discountId]",
  "/discounts/create": "/discounts/create",
} satisfies Pathnames<typeof locales>;

// Use the default: `always`
export const localePrefix = undefined;

export type AppPathnames = keyof typeof pathnames;
