import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { FC, PropsWithChildren } from "react";
import Providers from "./providers";
import "./globals.css";
import { getMessages, unstable_setRequestLocale } from "next-intl/server";
import { IntlPageParams } from "@/types/i18n.types";
import { locales } from "@/config";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export const metadata: Metadata = {
  title: "Next 14 Template",
  description: "Created by Yefrosynii",
  robots: {
    notranslate: true,
    index: false,
    follow: false,
  },
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const LocaleLayout: FC<PropsWithChildren & IntlPageParams> = async (props) => {
  const {
    children,
    params: { locale },
  } = props;

  unstable_setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={roboto.className}>
        <Providers {...{ locale, messages }}>{children}</Providers>
      </body>
    </html>
  );
};

export default LocaleLayout;
