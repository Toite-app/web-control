import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { FC, PropsWithChildren } from "react";
import Providers from "./providers";
import "./globals.css";
import { unstable_setRequestLocale } from "next-intl/server";
import { IntlPageParams } from "@/types/i18n.types";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export const metadata: Metadata = {
  title: "Next 14 Template",
  description: "Created by Yefrosynii",
};

const RootLayout: FC<PropsWithChildren & IntlPageParams> = (props) => {
  const {
    children,
    params: { locale },
  } = props;

  // Enable static rendering
  unstable_setRequestLocale(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={roboto.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};

export default RootLayout;
