import {
  BadgePercentIcon,
  BoltIcon,
  CalendarFold,
  CandlestickChartIcon,
  LandmarkIcon,
  Layers,
  LayoutDashboardIcon,
  ShoppingBasketIcon,
  SoupIcon,
  StoreIcon,
  UserIcon,
} from "lucide-react";
import { ReactNode } from "react";

export type MenuItem = {
  labelId: string;
  href?: string;
  icon?: ReactNode;
  childrens?: MenuItem[];
  disabled?: boolean;
};

export const menuItems: MenuItem[] = [
  {
    labelId: "dashboard",
    href: "/dashboard",
    icon: <LayoutDashboardIcon />,
  },
  {
    labelId: "orders",
    href: "/orders",
    icon: <ShoppingBasketIcon />,
    childrens: [
      {
        labelId: "orders-dispatcher",
        href: "/orders/dispatcher",
      },
      {
        labelId: "orders-hall",
        href: "/orders/hall",
      },
      {
        labelId: "orders-banquet",
        href: "/orders/banquet",
      },
      {
        labelId: "orders-takeaway",
        href: "/orders/takeaway",
      },
      {
        labelId: "orders-delivery",
        href: "/orders/delivery",
      },
      {
        labelId: "orders-archive",
        href: "/orders/archive",
      },
    ],
  },
  {
    labelId: "finances",
    icon: <LandmarkIcon />,
    childrens: [
      {
        labelId: "workshifts",
        href: "/workshifts",
        icon: <CalendarFold />,
      },
      {
        labelId: "finances-report",
        href: "/finances",
        icon: <CandlestickChartIcon />,
      },
    ],
  },
  {
    labelId: "administrate",
    icon: <BoltIcon />,
    childrens: [
      {
        labelId: "restaurants",
        href: "/restaurants",
        icon: <StoreIcon />,
      },
      {
        labelId: "dishes",
        href: "/dishes",
        icon: <SoupIcon />,
      },
      {
        labelId: "discounts",
        href: "/discounts",
        icon: <BadgePercentIcon />,
      },
      {
        labelId: "workers",
        href: "/workers",
        icon: <Layers />,
      },
      {
        labelId: "guests",
        href: "/guests",
        icon: <UserIcon />,
      },
    ],
  },
];
