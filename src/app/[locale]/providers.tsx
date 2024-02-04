"use client";

import { AbstractIntlMessages, NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "next-themes";
import { FC, PropsWithChildren } from "react";

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
        {children}
      </NextIntlClientProvider>
    </ThemeProvider>
  );
};

export default Providers;
