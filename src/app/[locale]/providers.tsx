"use client";

import { AbstractIntlMessages, NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "next-themes";
import { FC, PropsWithChildren } from "react";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { Provider as WrapBalancerProvider } from "react-wrap-balancer";
import DialogsPortal from "@/components/dialogs-portal";

type Props = PropsWithChildren & {
  messages: AbstractIntlMessages;
  locale: string;
};

const Providers: FC<Props> = (props) => {
  const { children, messages, locale } = props;

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <NuqsAdapter>
        <NextIntlClientProvider
          timeZone={"America/New_York"}
          {...{ messages, locale }}
        >
          <WrapBalancerProvider>{children}</WrapBalancerProvider>
          <DialogsPortal />
        </NextIntlClientProvider>
      </NuqsAdapter>
    </ThemeProvider>
  );
};

export default Providers;
