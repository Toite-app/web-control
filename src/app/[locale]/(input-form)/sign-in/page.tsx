import DevelopedWithToite from "@/components/toite/developed-with";
import { MessageCategories } from "@/messages/index.types";
import { IntlPageParams } from "@/types/i18n.types";
import TOITE_CONFIG from "@config";
import { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren<IntlPageParams>;

export async function generateMetadata({
  params: { locale },
}: Props): Promise<Metadata> {
  const t = await getTranslations({
    locale,
    namespace: MessageCategories.SIGN_IN,
  });

  return {
    title: `${t("title")} / ${TOITE_CONFIG.appName}`,
  };
}

const SignInPage = () => {
  const t = useTranslations(MessageCategories.SIGN_IN);

  return (
    <div className="flex flex-row gap-2">
      <div>
        <Image src="/sign-in.svg" width={300} height={300} alt="" />
      </div>
      <div className="flex min-w-[300px] flex-col gap-2">
        <div className="flex flex-col">
          <h1 className="text-zinc-400">{t("description")}</h1>
          <h1 className="text-3xl font-bold">{TOITE_CONFIG.appName}</h1>
        </div>
        <DevelopedWithToite className="mt-auto pb-5" />
      </div>
    </div>
  );
};

export default SignInPage;
