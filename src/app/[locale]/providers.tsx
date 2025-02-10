"use client";

import { AbstractIntlMessages, NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "next-themes";
import { FC, PropsWithChildren } from "react";
import { SWRDevTools } from "swr-devtools";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { Provider as WrapBalancerProvider } from "react-wrap-balancer";
import DialogsPortal from "@/components/dialogs-portal";
import SocketProvider from "@/components/socket-provider";

type Props = PropsWithChildren & {
  messages: AbstractIntlMessages;
  locale: string;
};

const Providers: FC<Props> = (props) => {
  const { children, messages, locale } = props;

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SWRDevTools>
        <NuqsAdapter>
          <NextIntlClientProvider
            timeZone={"America/New_York"}
            {...{ messages, locale }}
          >
            <WrapBalancerProvider>{children}</WrapBalancerProvider>
            <DialogsPortal />
            <SocketProvider />
          </NextIntlClientProvider>
        </NuqsAdapter>
      </SWRDevTools>
    </ThemeProvider>
  );
};

export default Providers;
