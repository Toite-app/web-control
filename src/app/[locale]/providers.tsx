"use client";

import { AbstractIntlMessages, NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "next-themes";
import { FC, PropsWithChildren } from "react";

import { Provider as WrapBalancerProvider } from "react-wrap-balancer";

type Props = PropsWithChildren & {
  messages: AbstractIntlMessages;
  locale: string;
};

const Providers: FC<Props> = (props) => {
  const { children, messages, locale } = props;

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <NextIntlClientProvider
        timeZone={"America/New_York"}
        {...{ messages, locale }}
      >
        <WrapBalancerProvider>{children}</WrapBalancerProvider>
      </NextIntlClientProvider>
    </ThemeProvider>
  );
};

export default Providers;
