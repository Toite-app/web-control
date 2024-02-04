"use client";

import { AbstractIntlMessages, NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "next-themes";
import { FC, PropsWithChildren } from "react";
import { SWRConfig } from "swr";

type Props = PropsWithChildren & {
  messages: AbstractIntlMessages;
  locale: string;
};

const Providers: FC<Props> = (props) => {
  const { children, messages, locale } = props;

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SWRConfig value={{ provider: () => new Map() }}>
        <NextIntlClientProvider
          timeZone={"America/New_York"}
          {...{ messages, locale }}
        >
          {children}
        </NextIntlClientProvider>
      </SWRConfig>
    </ThemeProvider>
  );
};

export default Providers;
