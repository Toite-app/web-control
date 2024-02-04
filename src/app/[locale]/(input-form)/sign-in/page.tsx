import DevelopedWithToite from "@/components/toite/developed-with";
import LanguageSelector from "@/components/toite/language-selector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCategories } from "@/messages/index.types";
import { IntlPageParams } from "@/types/i18n.types";
import TOITE_CONFIG from "@config";
import { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { FC, PropsWithChildren } from "react";

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

const SignInPage: FC<IntlPageParams> = (props) => {
  const {
    params: { locale },
  } = props;

  unstable_setRequestLocale(locale);
  const t = useTranslations(MessageCategories.SIGN_IN);
  const tFields = useTranslations(MessageCategories.FIELDS);

  return (
    <div className="flex flex-col gap-2 md:flex-row">
      <div>
        <Image src="/sign-in.svg" width={300} height={300} alt="" />
      </div>
      <div className="flex min-w-[300px] flex-col gap-2 py-5">
        <div className="flex flex-row justify-between">
          <div className="flex flex-col">
            <h1 className="text-zinc-400">{t("description")}</h1>
            <h1 className="text-3xl font-bold">{TOITE_CONFIG.appName}</h1>
          </div>
          <LanguageSelector />
        </div>
        <Input
          className="mt-3"
          type="text"
          placeholder={tFields("login")}
          required
        />
        <Input type="password" placeholder={tFields("password")} required />
        <Button className="w-full">{t("submit")}</Button>
        <DevelopedWithToite className="mt-auto pt-2" />
      </div>
    </div>
  );
};

export default SignInPage;
